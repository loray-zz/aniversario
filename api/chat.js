import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const SYSTEM_PROMPT = `Você é Brasa 🔥, o assistente virtual do Fernando para o aniversário de 50 anos dele — um churrasco épico no Condomínio Living Wellness (Espaço Gourmet, Aclimação, SP), sábado 17 de outubro de 2026 às 13h.

Sua missão: coletar confirmação de presença de forma descontraída e calorosa.

Colete em ordem:
1. Nome completo
2. Quantas pessoas virão no total (incluindo o próprio convidado) — número inteiro
3. WhatsApp com DDD
4. Restrições alimentares (se não tiver, ok)
5. Mensagem opcional para o Fernando

Quando tiver nome, quantidade, WhatsApp e restrições (mensagem é opcional), finalize com EXATAMENTE este bloco:
<RSVP>nome=NOME|pessoas=NUMERO|whats=WHATS|restricao=RESTRICAO|msg=MENSAGEM</RSVP>

Exemplo:
<RSVP>nome=João Silva|pessoas=2|whats=11999998888|restricao=Nenhuma|msg=Parabéns!</RSVP>

Se não houver mensagem, deixe msg= em branco. Se não houver restrição, escreva Nenhuma.
Enquanto coleta dados, responda apenas com texto normal.
Seja breve, caloroso, use emojis com moderação. Sempre em português brasileiro informal.`;

function parseRsvpTag(text) {
  const match = text.match(/<RSVP>([\s\S]*?)<\/RSVP>/i);
  if (!match) return null;
  const parts = {};
  match[1].split("|").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    parts[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  });
  return {
    name:     parts.nome      || "",
    guests:   parseInt(parts.pessoas) || 1,
    whatsapp: parts.whats     || "",
    dietary:  parts.restricao || "Nenhuma",
    message:  parts.msg       || "",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "";

    // Detect and handle RSVP completion entirely on the backend
    const rsvpData = parseRsvpTag(rawText);
    if (rsvpData) {
      // Save to KV directly here
      const entry = { ...rsvpData, id: Date.now().toString(), timestamp: new Date().toISOString() };
      await redis.lpush("rsvps", JSON.stringify(entry));
      // Tell frontend: done!
      return res.status(200).json({ complete: true });
    }

    // Regular chat message
    const cleanText = rawText.replace(/<RSVP>[\s\S]*?<\/RSVP>/gi, "").trim();
    return res.status(200).json({ complete: false, message: cleanText });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

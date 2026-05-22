const SYSTEM_PROMPT = `Você é Brasa 🔥, o assistente virtual do Fernando para o aniversário de 50 anos dele — um churrasco épico no Condomínio Living Wellness (Espaço Gourmet, Aclimação, SP), sábado 17 de outubro de 2026 às 13h.

Sua missão: coletar confirmação de presença de forma descontraída e calorosa.

Colete em ordem:
1. Nome completo
2. Quantas pessoas virão no total (incluindo o próprio convidado) — número inteiro
3. WhatsApp com DDD
4. Restrições alimentares (se não tiver, ok)
5. Mensagem opcional para o Fernando

Quando tiver nome, quantidade, WhatsApp e restrições (mensagem é opcional), responda SOMENTE com este JSON exato, sem nenhum texto adicional, sem markdown:
{"complete":true,"name":"NOME","guests":NUMERO,"whatsapp":"WHATS","dietary":"RESTRICAO","message":"MENSAGEM"}

Se não houver mensagem, use string vazia. Se não houver restrição, use "Nenhuma".
Enquanto coleta dados, responda apenas com texto natural — NUNCA com JSON parcial.
Seja breve, caloroso, use emojis com moderação. Sempre em português brasileiro informal.`;

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
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const ULTRAMSG_INSTANCE = process.env.ULTRAMSG_INSTANCE;
const ULTRAMSG_TOKEN    = process.env.ULTRAMSG_TOKEN;
const FERNANDO_WHATSAPP = process.env.FERNANDO_WHATSAPP;

async function sendWhatsApp(to, message) {
  const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`;
  const body = new URLSearchParams({
    token:    ULTRAMSG_TOKEN,
    to:       to,
    body:     message,
    priority: "10",
  });
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    body.toString(),
  });
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, guests, whatsapp, dietary, message } = req.body;

  if (!name || !whatsapp) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const results = [];

  // 1. Mensagem para o convidado confirmando presença
  const guestPhone = whatsapp.replace(/\D/g, "");
  const guestMsg =
    `Olá, ${name}! 🔥\n\n` +
    `Sua presença no aniversário de 50 anos do *Fernando* está confirmada!\n\n` +
    `📅 Sábado, 17 de outubro de 2026 às 13h\n` +
    `📍 Condomínio Living Wellness — Espaço Gourmet, Aclimação, SP\n\n` +
    `Te esperamos para uma tarde incrível de churrasco e resenha. Até lá! 🥩🎉`;

  try {
    const r1 = await sendWhatsApp(`+55${guestPhone}`, guestMsg);
    results.push({ to: "guest", result: r1 });
  } catch (err) {
    results.push({ to: "guest", error: err.message });
  }

  // 2. Alerta para o Fernando
  const dietaryInfo = dietary && dietary !== "Nenhuma" ? dietary : "Nenhuma";
  const msgInfo     = message ? `\n💬 Recado: "${message}"` : "";
  const alertMsg =
    `🔔 *Nova confirmação!*\n\n` +
    `👤 *Nome:* ${name}\n` +
    `👥 *Pessoas:* ${guests}\n` +
    `📱 *WhatsApp:* ${whatsapp}\n` +
    `🥗 *Restrição:* ${dietaryInfo}` +
    msgInfo;

  try {
    const r2 = await sendWhatsApp(FERNANDO_WHATSAPP, alertMsg);
    results.push({ to: "fernando", result: r2 });
  } catch (err) {
    results.push({ to: "fernando", error: err.message });
  }

  return res.status(200).json({ success: true, results });
}

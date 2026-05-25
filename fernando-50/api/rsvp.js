import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, guests, whatsapp, dietary, message } = req.body;

  if (!name || !guests || !whatsapp) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const entry = {
    id: Date.now().toString(),
    name,
    guests: parseInt(guests) || 1,
    whatsapp,
    dietary: dietary || "Nenhuma",
    message: message || "",
    timestamp: new Date().toISOString(),
  };

  try {
    await redis.lpush("rsvps", JSON.stringify(entry));
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Redis error:", err);
    return res.status(500).json({ error: "Failed to save RSVP" });
  }
}

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, id, name, guests, whatsapp, dietary, message } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const items = await redis.lrange("rsvps", 0, -1);
    const rsvps = items.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );

    const updated = rsvps.map((r) =>
      r.id === id
        ? { ...r, name, guests: parseInt(guests) || r.guests, whatsapp, dietary, message }
        : r
    );

    await redis.del("rsvps");
    for (let i = updated.length - 1; i >= 0; i--) {
      await redis.lpush("rsvps", JSON.stringify(updated[i]));
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

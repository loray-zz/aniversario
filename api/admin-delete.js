import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, id, deleteAll } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (deleteAll) {
      // Clear entire list
      await redis.del("rsvps");
      return res.status(200).json({ success: true });
    }

    if (id) {
      // Delete single entry
      const items = await redis.lrange("rsvps", 0, -1);
      const rsvps = items.map((item) =>
        typeof item === "string" ? JSON.parse(item) : item
      );
      const filtered = rsvps.filter((r) => r.id !== id);
      await redis.del("rsvps");
      if (filtered.length > 0) {
        // Re-insert in reverse so newest stays at top
        for (let i = filtered.length - 1; i >= 0; i--) {
          await redis.lpush("rsvps", JSON.stringify(filtered[i]));
        }
      }
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Missing id or deleteAll" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

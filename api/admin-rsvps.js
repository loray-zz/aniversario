import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.query;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // lrange 0 -1 = all items
    const items = await kv.lrange("rsvps", 0, -1);
    const rsvps = items.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );

    const totalGuests = rsvps.reduce((sum, r) => sum + (r.guests || 0), 0);

    return res.status(200).json({ rsvps, totalGuests });
  } catch (err) {
    console.error("KV error:", err);
    return res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
}

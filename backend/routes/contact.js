const express = require("express");
const rateLimit = require("express-rate-limit");
const { adminClient } = require("../lib/supabase");

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/", contactLimiter, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();
  const website = String(req.body.website || "").trim();

  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  const { error } = await adminClient.from("contact_messages").insert({
    name,
    email,
    message
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json({ ok: true });
});

module.exports = router;

const express = require("express");
const { adminClient } = require("../lib/supabase");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

function normalizeProjectPayload(body) {
  return {
    slug: String(body.slug || "").trim(),
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    stack: Array.isArray(body.stack) ? body.stack.map(String) : [],
    status: String(body.status || "Coming Soon").trim(),
    featured: Boolean(body.featured),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 999,
    repo_url: body.repo_url ? String(body.repo_url).trim() : null,
    live_url: body.live_url ? String(body.live_url).trim() : null,
    image_url: body.image_url ? String(body.image_url).trim() : null
  };
}

router.get("/", async (req, res) => {
  const { data, error } = await adminClient
    .from("projects")
    .select("id, slug, title, description, stack, status, featured, sort_order, repo_url, live_url, image_url")
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

router.get("/admin", requireAdmin, async (req, res) => {
  const { data, error } = await adminClient
    .from("projects")
    .select("id, slug, title, description, stack, status, featured, sort_order, repo_url, live_url, image_url")
    .order("sort_order", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

router.post("/", requireAdmin, async (req, res) => {
  const payload = normalizeProjectPayload(req.body);
  if (!payload.slug || !payload.title || !payload.description) {
    return res.status(400).json({ error: "slug, title, and description are required" });
  }

  const { data, error } = await adminClient.from("projects").insert(payload).select("*").single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(201).json(data);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const payload = normalizeProjectPayload(req.body);
  const { data, error } = await adminClient
    .from("projects")
    .update(payload)
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.json(data);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const { error } = await adminClient.from("projects").delete().eq("id", req.params.id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(204).send();
});

module.exports = router;

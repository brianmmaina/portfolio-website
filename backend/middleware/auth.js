const { getUserClient } = require("../lib/supabase");

function parseAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid auth token" });
  }

  const userClient = getUserClient(token);
  const { data, error } = await userClient.auth.getUser();
  if (error || !data?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const allowedAdmins = parseAdminEmails();
  const email = (data.user.email || "").toLowerCase();
  if (!allowedAdmins.includes(email)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  req.user = data.user;
  return next();
}

module.exports = {
  requireAdmin
};

export default function handler(req, res) {
  res.json({ ok: true, env: {
    hasDbHost: Boolean(process.env.DB_HOST),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    dbSsl: process.env.DB_SSL,
  }});
}

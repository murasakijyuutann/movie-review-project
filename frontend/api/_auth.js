import jwt from 'jsonwebtoken';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyTokenFromReq(req) {
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return null;
  try {
    return jwt.verify(m[1], process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

/** Wrap an API handler to require JWT auth. */
export function requireAuth(handler) {
  return async (req, res) => {
    const user = verifyTokenFromReq(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    return handler(req, res, user);
  };
}

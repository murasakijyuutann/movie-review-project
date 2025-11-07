import { requireAuth } from '../_auth.js';

export default requireAuth(async (req, res, user) => {
  res.json({ user });
});

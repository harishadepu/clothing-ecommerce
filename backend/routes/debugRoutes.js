import { Router } from 'express';
import { debugInfo } from '../controllers/debugController.js';

const router = Router();

// Diagnostic route: returns headers & cookies received by the server.
// Intended for debugging only. Safe to deploy but do not log secrets.
router.get('/info', (req, res) => {
  // Only enable in non-production or when DEBUG_DEBUG=true is set
  const enabled = process.env.NODE_ENV !== 'production' || process.env.DEBUG_DEBUG === 'true';
  if (!enabled) return res.status(404).json({ error: 'Not found' });
  return debugInfo(req, res);
});

export default router;

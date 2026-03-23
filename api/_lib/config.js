import { timingSafeEqual } from 'crypto';

/** @type {string} Base URL — uses VERCEL_URL for previews, falls back to production */
export const BASE_URL = process.env.BASE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://chikielau.com');

/** Timing-safe string comparison. Returns false if lengths differ. */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Verify admin secret + CSRF for state-changing methods.
 * @param {import('http').IncomingMessage} req
 * @returns {boolean}
 */
export function adminAuth(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !safeCompare(req.headers['x-admin-secret'] || '', secret)) return false;
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const csrf = req.headers['x-csrf-token'];
    if (!csrf || csrf.length < 16) return false;
  }
  return true;
}

/**
 * Manual Instagram Token Refresh endpoint.
 */

import { safeCompare } from './_lib/config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-refresh-secret'] || req.body?.secret;
  const expectedSecret = process.env.INSTAGRAM_TOKEN_SECRET;

  if (!expectedSecret || !safeCompare(secret || '', expectedSecret)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!currentToken) {
    console.error('INSTAGRAM_ACCESS_TOKEN not configured');
    return res.status(500).json({ error: 'Not configured' });
  }

  try {
    // Refresh the long-lived token (extends it by 60 days)
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
    
    const response = await fetch(refreshUrl, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Instagram token refresh error:', errorData);
      
      return res.status(response.status).json({
        error: 'Token refresh failed'
      });
    }
    
    const data = await response.json();
    if (!data.access_token) return res.status(502).json({ error: 'No token in refresh response' });
    
    // Return the new token and expiration info
    const days = data.expires_in ? Math.floor(data.expires_in / 86400) : null;
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      expiresIn: data.expires_in || null,
      expiresInDays: days
    });
    
  } catch (error) {
    console.error('Error refreshing Instagram token:', error);
    return res.status(500).json({
      error: 'Failed to refresh Instagram token'
    });
  }
}

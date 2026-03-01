/**
 * Vercel Serverless Function - Instagram Token Refresh
 * Automatically refreshes Instagram access token before expiration
 * 
 * Environment Variables Required:
 * - INSTAGRAM_ACCESS_TOKEN: Current Instagram access token
 * - INSTAGRAM_TOKEN_SECRET: Secret key to protect this endpoint
 * 
 * This endpoint should be called by a cron job every 30 days
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify secret to prevent unauthorized access
  const secret = req.headers['x-refresh-secret'] || req.body?.secret;
  const expectedSecret = process.env.INSTAGRAM_TOKEN_SECRET;
  
  if (!expectedSecret) {
    console.error('INSTAGRAM_TOKEN_SECRET not configured');
    return res.status(500).json({ 
      error: 'Token refresh not configured',
      message: 'Please set INSTAGRAM_TOKEN_SECRET in environment variables'
    });
  }
  
  if (secret !== expectedSecret) {
    console.error('Invalid refresh secret provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!currentToken) {
    console.error('INSTAGRAM_ACCESS_TOKEN not configured');
    return res.status(500).json({ 
      error: 'Instagram API not configured',
      message: 'Please set INSTAGRAM_ACCESS_TOKEN in environment variables'
    });
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
        error: 'Token refresh failed',
        message: errorData.error?.message || 'Failed to refresh Instagram token',
        details: errorData
      });
    }
    
    const data = await response.json();
    
    // Return the new token and expiration info
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      newToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      expiresInDays: Math.floor(data.expires_in / 86400),
      instructions: 'Update INSTAGRAM_ACCESS_TOKEN environment variable with the newToken value in Vercel dashboard'
    });
    
  } catch (error) {
    console.error('Error refreshing Instagram token:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to refresh Instagram token',
      details: error.message
    });
  }
}

/**
 * Vercel Cron Job - Automatic Instagram Token Refresh
 * This endpoint is called automatically by Vercel Cron every 30 days
 * 
 * Environment Variables Required:
 * - INSTAGRAM_ACCESS_TOKEN: Current Instagram access token
 * - CRON_SECRET: Secret key from Vercel Cron configuration
 * - VERCEL_PROJECT_ID: Your Vercel project ID
 * - VERCEL_TEAM_ID: Your Vercel team ID (if applicable)
 * - VERCEL_API_TOKEN: Vercel API token with write access to environment variables
 */

export default async function handler(req, res) {
  // Verify this is a legitimate cron request
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.error('CRON_SECRET not configured');
    return res.status(500).json({ 
      error: 'Cron not configured',
      message: 'Please set CRON_SECRET in environment variables'
    });
  }
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    console.error('Invalid cron authorization');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const vercelToken = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  
  if (!currentToken) {
    console.error('INSTAGRAM_ACCESS_TOKEN not configured');
    return res.status(500).json({ 
      error: 'Instagram API not configured'
    });
  }
  
  if (!vercelToken || !projectId) {
    console.error('Vercel API credentials not configured');
    return res.status(500).json({ 
      error: 'Vercel API not configured',
      message: 'Please set VERCEL_API_TOKEN and VERCEL_PROJECT_ID'
    });
  }

  try {
    // Step 1: Refresh the Instagram token
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
    
    const refreshResponse = await fetch(refreshUrl, {
      method: 'GET'
    });
    
    if (!refreshResponse.ok) {
      const errorData = await refreshResponse.json();
      console.error('Instagram token refresh error:', errorData);
      
      return res.status(refreshResponse.status).json({
        error: 'Token refresh failed',
        message: errorData.error?.message || 'Failed to refresh Instagram token'
      });
    }
    
    const refreshData = await refreshResponse.json();
    const newToken = refreshData.access_token;
    
    // Step 2: Update the environment variable in Vercel
    const vercelApiUrl = teamId 
      ? `https://api.vercel.com/v10/projects/${projectId}/env/INSTAGRAM_ACCESS_TOKEN?teamId=${teamId}`
      : `https://api.vercel.com/v10/projects/${projectId}/env/INSTAGRAM_ACCESS_TOKEN`;
    
    // First, get the current env var ID
    const getEnvUrl = teamId
      ? `https://api.vercel.com/v9/projects/${projectId}/env?teamId=${teamId}`
      : `https://api.vercel.com/v9/projects/${projectId}/env`;
    
    const getEnvResponse = await fetch(getEnvUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!getEnvResponse.ok) {
      console.error('Failed to get environment variables');
      return res.status(500).json({
        error: 'Failed to get environment variables',
        tokenRefreshed: true,
        newToken: newToken,
        message: 'Token was refreshed but could not be automatically updated. Please update INSTAGRAM_ACCESS_TOKEN manually in Vercel dashboard.'
      });
    }
    
    const envVars = await getEnvResponse.json();
    const tokenEnvVar = envVars.envs?.find(env => env.key === 'INSTAGRAM_ACCESS_TOKEN');
    
    if (!tokenEnvVar) {
      console.error('INSTAGRAM_ACCESS_TOKEN environment variable not found');
      return res.status(500).json({
        error: 'Environment variable not found',
        tokenRefreshed: true,
        newToken: newToken,
        message: 'Token was refreshed but environment variable not found. Please add INSTAGRAM_ACCESS_TOKEN manually in Vercel dashboard.'
      });
    }
    
    // Update the environment variable
    const updateUrl = teamId
      ? `https://api.vercel.com/v9/projects/${projectId}/env/${tokenEnvVar.id}?teamId=${teamId}`
      : `https://api.vercel.com/v9/projects/${projectId}/env/${tokenEnvVar.id}`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: newToken,
        target: tokenEnvVar.target || ['production', 'preview', 'development']
      })
    });
    
    if (!updateResponse.ok) {
      const updateError = await updateResponse.json();
      console.error('Failed to update environment variable:', updateError);
      return res.status(500).json({
        error: 'Failed to update environment variable',
        tokenRefreshed: true,
        newToken: newToken,
        message: 'Token was refreshed but could not be automatically updated. Please update INSTAGRAM_ACCESS_TOKEN manually in Vercel dashboard.'
      });
    }
    
    // Success!
    return res.status(200).json({
      success: true,
      message: 'Instagram token refreshed and updated automatically',
      expiresIn: refreshData.expires_in,
      expiresInDays: Math.floor(refreshData.expires_in / 86400),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in cron refresh:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to refresh Instagram token',
      details: error.message
    });
  }
}

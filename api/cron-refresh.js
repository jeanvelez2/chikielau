/**
 * Vercel Cron Job - Automatic Instagram Token Refresh
 * Called by Vercel Cron monthly to refresh the Instagram long-lived token.
 */

import { safeCompare } from './_lib/config.js';

export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || !safeCompare(req.headers.authorization || '', `Bearer ${cronSecret}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const vercelToken = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!currentToken || !vercelToken || !projectId) {
    console.error('Missing required env vars for cron refresh');
    return res.status(500).json({ error: 'Not configured' });
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
        error: 'Token refresh failed'
      });
    }
    
    const refreshData = await refreshResponse.json();
    const newToken = refreshData.access_token;
    if (!newToken) return res.status(502).json({ error: 'No token in refresh response' });
    
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
      return res.status(500).json({ error: 'Failed to update token' });
    }
    
    const envVars = await getEnvResponse.json();
    const tokenEnvVar = envVars.envs?.find(env => env.key === 'INSTAGRAM_ACCESS_TOKEN');
    
    if (!tokenEnvVar) {
      console.error('INSTAGRAM_ACCESS_TOKEN environment variable not found');
      return res.status(500).json({ error: 'Failed to update token' });
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
      console.error('Failed to update environment variable:', await updateResponse.text());
      return res.status(500).json({ error: 'Failed to update token' });
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
      error: 'Failed to refresh Instagram token'
    });
  }
}

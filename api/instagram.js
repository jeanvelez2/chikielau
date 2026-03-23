import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1 h'),
  prefix: 'instagram',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'anonymous';
    const { success } = await ratelimit.limit(ip);
    if (!success) return res.status(429).json({ error: 'Too many requests' });
  } catch { /* allow request if rate limiter fails */ }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('INSTAGRAM_ACCESS_TOKEN not configured');
    return res.status(500).json({ error: 'Not configured' });
  }

  try {
    // Get number of posts to fetch (default: 6, max: 25)
    const limit = Math.min(parseInt(req.query.limit) || 6, 25);
    
    // Fetch user's media
    const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
    const apiUrl = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${accessToken}&limit=${limit}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Instagram API error:', errorData);
      
      // Handle token expiration
      if (response.status === 400 && errorData.error?.code === 190) {
        return res.status(401).json({
          error: 'Access token expired',
          message: 'Please refresh your Instagram access token'
        });
      }
      
      return res.status(response.status).json({
        error: 'Instagram API error'
      });
    }
    
    const data = await response.json();
    
    // Transform data to a cleaner format
    const posts = data.data.map(post => ({
      id: post.id,
      caption: post.caption || '',
      type: post.media_type,
      url: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink?.startsWith('https://') ? post.permalink : '#',
      timestamp: post.timestamp
    }));
    
    // Set cache headers (cache for 1 hour)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json({
      success: true,
      posts,
      count: posts.length
    });
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return res.status(500).json({
      error: 'Failed to fetch Instagram posts'
    });
  }
}

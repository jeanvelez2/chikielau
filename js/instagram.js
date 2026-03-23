/**
 * Instagram Feed Client
 * Fetches and displays Instagram posts from the serverless API
 */

class InstagramFeed {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }
    
    this.options = {
      limit: options.limit || 6,
      apiEndpoint: options.apiEndpoint || '/api/instagram',
      loadingText: options.loadingText || 'Loading Instagram posts...',
      errorText: options.errorText || 'Unable to load Instagram posts',
      cacheKey: 'instagram_feed_cache',
      cacheDuration: options.cacheDuration || 3600000 // 1 hour in milliseconds
    };
    
    this.init();
  }
  
  /**
   * Initialize the Instagram feed
   */
  async init() {
    this.showLoading();
    
    try {
      // Try to get cached data first
      const cachedData = this.getCachedData();
      if (cachedData) {
        this.renderPosts(cachedData);
        return;
      }
      
      // Fetch fresh data
      const data = await this.fetchPosts();
      if (data && data.posts) {
        this.cacheData(data);
        this.renderPosts(data.posts);
      } else {
        this.showError();
      }
    } catch (error) {
      console.error('Error loading Instagram feed:', error);
      this.showError();
    }
  }
  
  /**
   * Fetch posts from the API
   */
  async fetchPosts() {
    const url = `${this.options.apiEndpoint}?limit=${this.options.limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  }
  
  /**
   * Get cached data from localStorage
   */
  getCachedData() {
    try {
      const cached = localStorage.getItem(this.options.cacheKey);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp < this.options.cacheDuration) {
        return data;
      }
      
      // Cache expired, remove it
      localStorage.removeItem(this.options.cacheKey);
      return null;
    } catch (error) {
      console.warn('Error reading cache:', error);
      return null;
    }
  }
  
  /**
   * Cache data to localStorage
   */
  cacheData(data) {
    try {
      const cacheObject = {
        data: data.posts,
        timestamp: Date.now()
      };
      localStorage.setItem(this.options.cacheKey, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Error caching data:', error);
    }
  }
  
  /**
   * Render posts to the DOM
   */
  renderPosts(posts) {
    if (!posts || posts.length === 0) {
      this.showError('No posts available');
      return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'instagram-grid';
    
    posts.forEach(post => {
      const item = this.createPostElement(post);
      grid.appendChild(item);
    });
    
    this.container.innerHTML = '';
    this.container.appendChild(grid);
  }
  
  /**
   * Create a post element
   */
  createPostElement(post) {
    const item = document.createElement('a');
    item.className = 'instagram-item';
    item.href = post.permalink;
    item.target = '_blank';
    item.rel = 'noopener noreferrer';
    item.setAttribute('aria-label', `View Instagram post: ${this.truncateText(post.caption, 50)}`);
    
    const img = document.createElement('img');
    img.src = post.url;
    img.alt = this.truncateText(post.caption, 100) || 'Instagram post';
    img.loading = 'lazy';
    
    const overlay = document.createElement('div');
    overlay.className = 'instagram-overlay';
    
    const icon = document.createElement('span');
    icon.className = 'instagram-icon';
    icon.textContent = post.type === 'VIDEO' ? '▶' : '📷';
    
    overlay.appendChild(icon);
    item.appendChild(img);
    item.appendChild(overlay);
    
    return item;
  }
  
  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = `
      <div class="instagram-loading">
        <p>${this.options.loadingText}</p>
      </div>
    `;
  }
  
  /**
   * Show error state
   */
  showError(message) {
    this.container.innerHTML = `
      <div class="instagram-error">
        <p>${message || this.options.errorText}</p>
        <a href="https://instagram.com/chikielau" target="_blank" rel="noopener" class="btn-outline" style="margin-top:1rem;display:inline-block;">Visit Instagram</a>
      </div>
    `;
  }
  
  /**
   * Truncate text to specified length
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Refresh the feed
   */
  async refresh() {
    try { localStorage.removeItem(this.options.cacheKey); } catch {}
    await this.init();
  }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('instagram-feed');
  if (feedContainer) {
    window.instagramFeed = new InstagramFeed('instagram-feed', {
      limit: 6
    });
  }
});

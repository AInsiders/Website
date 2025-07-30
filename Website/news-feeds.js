/**
 * Optimized News Feeds Integration Script
 * Addresses performance issues with caching, lazy loading, and optimized video handling
 */

class OptimizedNewsManager {
    constructor() {
        // Performance configuration
        this.articlesPerPage = 12;
        this.maxConcurrentFeeds = 10;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.searchDebounceDelay = 300;
        this.lazyLoadThreshold = 100; // pixels from viewport
        
        // State management
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.searchQuery = '';
        this.isLoading = false;
        this.hasInitialized = false;
        
        // Caching
        this.articleCache = new Map();
        this.feedCache = new Map();
        this.imageCache = new Map();
        
        // Performance tracking
        this.loadedImages = new Set();
        this.visibleArticles = new Set();
        this.videoIframes = new Map();
        
        // DOM elements
        this.newsGrid = null;
        this.searchInput = null;
        this.categoryFilters = null;
        this.loadingIndicator = null;
        this.statsContainer = null;
        this.paginationContainer = null;
        
        // Intersection Observer for lazy loading
        this.imageObserver = null;
        this.articleObserver = null;
        
        // Debounced search
        this.searchTimeout = null;
        
        // Initialize when DOM is ready
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }
    
    setupUI() {
        console.log('🔧 Setting up optimized news UI...');
        
        // Get DOM elements
        this.newsGrid = document.querySelector('.news-grid');
        this.searchInput = document.querySelector('.search-box input');
        this.categoryFilters = document.querySelectorAll('.category-filter');
        this.loadingIndicator = document.querySelector('.news-loading');
        this.statsContainer = document.querySelector('.news-stats');
        this.paginationContainer = document.querySelector('.news-pagination');
        
        if (!this.newsGrid) {
            console.error('❌ News grid not found');
            return;
        }
        
        // Setup observers
        this.setupIntersectionObservers();
        
        // Bind event listeners
        this.bindEvents();
        
        // Optimize background canvas performance
        this.optimizeBackgroundCanvas();
        
        // Initialize with news aggregator
        this.initializeNewsAggregator();
        
        console.log('✅ Optimized news UI setup complete');
    }
    
    optimizeBackgroundCanvas() {
        // Optimize the nuroback canvas for better performance
        const canvas = document.getElementById('aiCanvas');
        if (canvas) {
            // Reduce animation intensity when not interacting
            let isUserInteracting = false;
            let interactionTimeout;
            
            const handleInteraction = () => {
                isUserInteracting = true;
                clearTimeout(interactionTimeout);
                
                // Resume full animation
                if (window.nuroback && window.nuroback.setAnimationIntensity) {
                    window.nuroback.setAnimationIntensity(1.0);
                }
                
                // Set timeout to reduce animation after user stops interacting
                interactionTimeout = setTimeout(() => {
                    isUserInteracting = false;
                    // Reduce animation intensity for better performance
                    if (window.nuroback && window.nuroback.setAnimationIntensity) {
                        window.nuroback.setAnimationIntensity(0.3);
                    }
                }, 3000);
            };
            
            // Listen for user interactions
            ['mousemove', 'scroll', 'touchstart', 'click'].forEach(event => {
                document.addEventListener(event, handleInteraction, { passive: true });
            });
            
            // Check device performance and adjust accordingly
            if ('connection' in navigator) {
                const connection = navigator.connection;
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    // Reduce animation for slow connections
                    if (window.nuroback && window.nuroback.setAnimationIntensity) {
                        window.nuroback.setAnimationIntensity(0.1);
                    }
                }
            }
        }
    }
    
    setupIntersectionObservers() {
        // Image lazy loading observer
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: `${this.lazyLoadThreshold}px`
        });
        
        // Article visibility observer for video optimization
        this.articleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const articleId = entry.target.dataset.articleId;
                if (entry.isIntersecting) {
                    this.visibleArticles.add(articleId);
                    this.optimizeVideosInArticle(entry.target);
                } else {
                    this.visibleArticles.delete(articleId);
                    this.cleanupHiddenVideos(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
    }
    
    bindEvents() {
        // Debounced search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value.trim();
                    this.currentPage = 1;
                    this.updateDisplay();
                }, this.searchDebounceDelay);
            });
        }
        
        // Category filters with loading states
        this.categoryFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                const category = e.target.dataset.category || 'all';
                this.setCategory(category);
            });
        });
        
        // Pagination with smooth scrolling
        if (this.paginationContainer) {
            this.paginationContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('page-btn')) {
                    const page = parseInt(e.target.dataset.page);
                    if (page && page !== this.currentPage) {
                        this.setPage(page);
                    }
                }
            });
        }
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more-news');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }
    }
    
    initializeNewsAggregator() {
        const checkAggregator = () => {
            if (window.newsAggregator) {
                console.log('📡 News aggregator found, setting up optimized integration...');
                this.setupAggregatorIntegration();
            } else {
                console.log('⏳ Waiting for news aggregator...');
                setTimeout(checkAggregator, 500);
            }
        };
        
        checkAggregator();
    }
    
    setupAggregatorIntegration() {
        const aggregator = window.newsAggregator;
        
        // Override methods for optimized performance
        aggregator.triggerUIUpdate = () => {
            this.updateDisplay();
        };
        
        aggregator.renderCurrentPage = () => {
            this.renderArticles();
        };
        
        // Set up optimized setters
        aggregator.setCategory = (category) => {
            this.setCategory(category);
        };
        
        aggregator.setPage = (page) => {
            this.setPage(page);
        };
        
        aggregator.searchArticles = (query) => {
            this.searchQuery = query;
            this.currentPage = 1;
            this.updateDisplay();
        };
        
        // Initial display with caching
        this.loadFromCache();
        this.updateDisplay();
        
        console.log('✅ Optimized news aggregator integration complete');
    }
    
    setCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        // Update active filter
        this.categoryFilters.forEach(filter => {
            filter.classList.remove('active');
            if (filter.dataset.category === category || 
                (category === 'all' && !filter.dataset.category)) {
                filter.classList.add('active');
            }
        });
        
        this.updateDisplay();
    }
    
    setPage(page) {
        this.currentPage = page;
        this.updateDisplay();
        this.scrollToTop();
    }
    
    updateDisplay() {
        if (!window.newsAggregator) {
            console.error('❌ News aggregator not available');
            return;
        }
        
        this.showLoading(true);
        
        // Update aggregator state
        window.newsAggregator.currentCategory = this.currentCategory;
        window.newsAggregator.currentPage = this.currentPage;
        window.newsAggregator.searchQuery = this.searchQuery;
        
        // Trigger update with caching
        window.newsAggregator.updateFilteredArticles();
        this.renderArticles();
        this.updateStats();
        this.renderPagination();
        
        // Cache the results
        this.cacheResults();
        
        this.showLoading(false);
    }
    
    renderArticles() {
        if (!this.newsGrid || !window.newsAggregator) return;
        
        const articles = window.newsAggregator.getCurrentPageArticles() || [];
        
        // Hide welcome screen and show news grid
        const welcomeScreen = document.getElementById('news-welcome');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        this.newsGrid.style.display = 'grid';
        
        if (articles.length === 0) {
            this.newsGrid.innerHTML = `
                <div class="no-articles" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-newspaper" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No articles found</h3>
                    <p style="color: var(--text-muted);">Try adjusting your search or category filters.</p>
                </div>
            `;
            return;
        }
        
        // Clear existing content
        this.newsGrid.innerHTML = '';
        
        // Render articles with lazy loading
        articles.forEach((article, index) => {
            const articleElement = this.createArticleCard(article, index);
            this.newsGrid.appendChild(articleElement);
            
            // Observe for lazy loading
            this.articleObserver.observe(articleElement);
        });
    }
    
    createArticleCard(article, index) {
        const articleElement = document.createElement('article');
        articleElement.className = 'news-card';
        articleElement.dataset.articleId = `article-${index}`;
        articleElement.dataset.category = (article.category || 'Technology').toLowerCase();
        
        const imageUrl = article.imageUrl || article.thumbnail || '';
        const category = article.category || 'Technology';
        const date = new Date(article.pubDate || article.published || Date.now());
        const timeAgo = this.getTimeAgo(date);
        
        articleElement.innerHTML = `
            <div class="news-image">
                ${imageUrl ? 
                    `<img data-src="${imageUrl}" alt="${article.title}" loading="lazy" class="lazy-image">` :
                    `<div class="news-placeholder">
                        <i class="fas fa-newspaper"></i>
                    </div>`
                }
                <div class="news-overlay">
                    <div class="news-category">${category}</div>
                </div>
            </div>
            <div class="news-content">
                <h3>
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                        ${article.title}
                    </a>
                </h3>
                <p>${this.truncateText(article.description || article.summary || '', 150)}</p>
                <div class="news-meta">
                    <span class="news-source">
                        <i class="fas fa-rss"></i>
                        ${article.source || 'Unknown Source'}
                    </span>
                    <span class="news-time-ago">
                        <i class="fas fa-clock"></i>
                        ${timeAgo}
                    </span>
                </div>
            </div>
        `;
        
        // Setup lazy loading for images
        const img = articleElement.querySelector('.lazy-image');
        if (img) {
            this.imageObserver.observe(img);
        }
        
        return articleElement;
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src || this.loadedImages.has(src)) return;
        
        // Create a new image to test loading
        const testImg = new Image();
        testImg.onload = () => {
            img.src = src;
            img.classList.remove('lazy-image');
            this.loadedImages.add(src);
        };
        testImg.onerror = () => {
            img.style.display = 'none';
            img.nextElementSibling.style.display = 'block'; // Show placeholder
        };
        testImg.src = src;
    }
    
    optimizeVideosInArticle(articleElement) {
        // Only load videos for visible articles
        const videoLinks = articleElement.querySelectorAll('a[href*="youtube.com"], a[href*="vimeo.com"]');
        videoLinks.forEach(link => {
            if (!this.videoIframes.has(link.href)) {
                this.setupVideoThumbnail(link);
            }
        });
    }
    
    setupVideoThumbnail(link) {
        const videoId = this.extractVideoId(link.href);
        if (!videoId) return;
        
        // Create thumbnail placeholder
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        thumbnail.style.cssText = `
            position: relative;
            width: 100%;
            height: 200px;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;
        
        thumbnail.innerHTML = `
            <div class="play-button" style="
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #000;
            ">
                <i class="fas fa-play"></i>
            </div>
        `;
        
        // Replace link with thumbnail
        link.parentNode.insertBefore(thumbnail, link);
        link.style.display = 'none';
        
        // Setup click handler for lazy video loading
        thumbnail.addEventListener('click', () => {
            this.loadVideo(link.href, thumbnail);
        });
    }
    
    loadVideo(videoUrl, container) {
        const videoId = this.extractVideoId(videoUrl);
        if (!videoId) return;
        
        // Create iframe only when needed
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.width = '100%';
        iframe.height = '200';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        // Replace thumbnail with iframe
        container.innerHTML = '';
        container.appendChild(iframe);
        container.className = 'video-container';
        
        // Store reference for cleanup
        this.videoIframes.set(videoUrl, iframe);
    }
    
    cleanupHiddenVideos(articleElement) {
        // Remove iframes from hidden articles to save resources
        const iframes = articleElement.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.remove();
        });
    }
    
    extractVideoId(url) {
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        const vimeoMatch = url.match(/vimeo\.com\/([0-9]+)/);
        
        if (youtubeMatch) return youtubeMatch[1];
        if (vimeoMatch) return vimeoMatch[1];
        return null;
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    updateStats() {
        if (!this.statsContainer || !window.newsAggregator) return;
        
        const totalArticles = window.newsAggregator.articles.length;
        const totalFeeds = window.newsAggregator.getTotalFeedCount();
        const categories = window.newsAggregator.getCategoryCount();
        
        this.statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-number">${totalArticles.toLocaleString()}</div>
                <div class="stat-label">Articles</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${totalFeeds}</div>
                <div class="stat-label">Sources</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${categories}</div>
                <div class="stat-label">Categories</div>
            </div>
        `;
    }
    
    renderPagination() {
        if (!this.paginationContainer || !window.newsAggregator) return;
        
        const totalPages = Math.ceil(window.newsAggregator.filteredArticles.length / this.articlesPerPage);
        
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="pagination-controls">';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage - 1}">
                <i class="fas fa-chevron-left"></i> Previous
            </button>`;
        }
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage + 1}">
                Next <i class="fas fa-chevron-right"></i>
            </button>`;
        }
        
        paginationHTML += '</div>';
        this.paginationContainer.innerHTML = paginationHTML;
    }
    
    showLoading(show) {
        this.isLoading = show;
        
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.toggle('hidden', !show);
        }
        
        if (this.newsGrid) {
            this.newsGrid.style.opacity = show ? '0.5' : '1';
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    }
    
    // Caching methods
    cacheResults() {
        const cacheKey = `${this.currentCategory}-${this.currentPage}-${this.searchQuery}`;
        const cacheData = {
            articles: window.newsAggregator.getCurrentPageArticles(),
            timestamp: Date.now()
        };
        
        this.articleCache.set(cacheKey, cacheData);
        
        // Cleanup old cache entries
        this.cleanupCache();
    }
    
    loadFromCache() {
        const cacheKey = `${this.currentCategory}-${this.currentPage}-${this.searchQuery}`;
        const cached = this.articleCache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            console.log('📦 Loading from cache...');
            return true;
        }
        
        return false;
    }
    
    cleanupCache() {
        const now = Date.now();
        for (const [key, data] of this.articleCache.entries()) {
            if (now - data.timestamp > this.cacheTimeout) {
                this.articleCache.delete(key);
            }
        }
    }
    
    loadMoreArticles() {
        this.currentPage++;
        this.updateDisplay();
    }
}

// Initialize the optimized news manager
console.log('🚀 Initializing OptimizedNewsManager...');

let newsManager = null;

function initializeNewsManager() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            newsManager = new OptimizedNewsManager();
        });
    } else {
        newsManager = new OptimizedNewsManager();
    }
}

// Start initialization
initializeNewsManager();

// Make it globally available
window.OptimizedNewsManager = OptimizedNewsManager;
window.newsManager = newsManager;

console.log('✅ Optimized news manager initialization complete'); 
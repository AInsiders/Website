// A.Insiders News System - RSS Feed Integration
class NewsSystem {
    constructor() {
        this.newsGrid = document.getElementById('news-grid');
        this.searchInput = document.getElementById('search-input');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.currentPage = 0;
        this.itemsPerPage = 12;
        this.allNews = [];
        this.filteredNews = [];
        this.currentCategory = 'all';
        
        // RSS Feeds from OPML file
        this.rssFeeds = {
            ai: [
                'https://www.wired.com/feed/tag/ai/latest/rss',
                'https://www.aitrends.com/feed/',
                'https://dailyai.com/feed/',
                'https://deepmind.google/blog/rss.xml',
                'https://machinelearningmastery.com/blog/feed/',
                'https://www.producthunt.com/feed?category=artificial-intelligence',
                'https://bair.berkeley.edu/blog/feed.xml',
                'https://ruder.io/rss/'
            ],
            cybersecurity: [
                'https://www.kitploit.com/feeds/posts/default',
                'https://spyboy.blog/category/networking/feed/'
            ],
            bioengineering: [
                'https://www.biopharmadive.com/feeds/news/',
                'https://www.bioworld.com/rss/22',
                'https://www.labiotech.eu/feed/',
                'https://www.nature.com/nbt.rss',
                'https://www.healthcareitnews.com/home/feed',
                'https://newatlas.com/science/index.rss'
            ],
            robotics: [
                'https://www.therobotreport.com/feed/'
            ],
            space: [
                'https://www.esa.int/rssfeed/science'
            ]
        };
        
        this.init();
    }
    
    async init() {
        await this.loadAllFeeds();
        this.setupEventListeners();
        this.renderNews();
    }
    
    async loadAllFeeds() {
        const allFeeds = [];
        
        // Collect all feed URLs
        Object.values(this.rssFeeds).forEach(feeds => {
            allFeeds.push(...feeds);
        });
        
        // Load feeds in parallel
        const feedPromises = allFeeds.map(url => this.fetchRSSFeed(url));
        const results = await Promise.allSettled(feedPromises);
        
        // Process successful results
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                this.allNews.push(...result.value);
            }
        });
        
        // Sort by date (newest first)
        this.allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        this.filteredNews = [...this.allNews];
        
        console.log(`Loaded ${this.allNews.length} articles from RSS feeds`);
    }
    
    async fetchRSSFeed(url) {
        try {
            // Use a CORS proxy to bypass CORS restrictions
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            const xmlText = await response.text();
            
            // Parse XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Extract articles
            const items = xmlDoc.querySelectorAll('item');
            const articles = [];
            
            items.forEach(item => {
                const article = this.parseRSSItem(item, url);
                if (article) {
                    articles.push(article);
                }
            });
            
            return articles;
        } catch (error) {
            console.error(`Error fetching RSS feed ${url}:`, error);
            return [];
        }
    }
    
    parseRSSItem(item, feedUrl) {
        try {
            const title = item.querySelector('title')?.textContent?.trim() || '';
            const link = item.querySelector('link')?.textContent?.trim() || '';
            const description = item.querySelector('description')?.textContent?.trim() || '';
            const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
            
            // Extract image/video
            let mediaUrl = null;
            let mediaType = null;
            
            // Check for media:content
            const mediaContent = item.querySelector('media\\:content, content');
            if (mediaContent) {
                mediaUrl = mediaContent.getAttribute('url');
                mediaType = mediaContent.getAttribute('type');
            }
            
            // Check for enclosure
            const enclosure = item.querySelector('enclosure');
            if (enclosure && !mediaUrl) {
                mediaUrl = enclosure.getAttribute('url');
                mediaType = enclosure.getAttribute('type');
            }
            
            // Check for og:image in description
            if (!mediaUrl && description) {
                const ogImageMatch = description.match(/<img[^>]+src="([^"]+)"/);
                if (ogImageMatch) {
                    mediaUrl = ogImageMatch[1];
                    mediaType = 'image';
                }
            }
            
            // Determine category based on feed URL
            let category = 'ai'; // default
            for (const [cat, feeds] of Object.entries(this.rssFeeds)) {
                if (feeds.includes(feedUrl)) {
                    category = cat;
                    break;
                }
            }
            
            return {
                title,
                link,
                description: this.cleanDescription(description),
                pubDate,
                mediaUrl,
                mediaType,
                category,
                feedUrl
            };
        } catch (error) {
            console.error('Error parsing RSS item:', error);
            return null;
        }
    }
    
    cleanDescription(description) {
        // Remove HTML tags and clean up
        return description
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim()
            .substring(0, 200) + (description.length > 200 ? '...' : '');
    }
    
    setupEventListeners() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.filterNews(e.target.value);
        });
        
        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.filter-btn').classList.add('active');
                
                const category = e.target.closest('.filter-btn').dataset.category;
                this.filterByCategory(category);
            });
        });
        
        // Load more
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMore();
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                this.handleNewsletterSignup(email);
            });
        }
    }
    
    filterNews(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredNews = [...this.allNews];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredNews = this.allNews.filter(article => 
                article.title.toLowerCase().includes(term) ||
                article.description.toLowerCase().includes(term) ||
                article.category.toLowerCase().includes(term)
            );
        }
        
        this.currentPage = 0;
        this.renderNews();
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        
        if (category === 'all') {
            this.filteredNews = [...this.allNews];
        } else {
            this.filteredNews = this.allNews.filter(article => 
                article.category === category
            );
        }
        
        this.currentPage = 0;
        this.renderNews();
    }
    
    renderNews() {
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const articlesToShow = this.filteredNews.slice(startIndex, endIndex);
        
        if (this.currentPage === 0) {
            this.newsGrid.innerHTML = '';
        }
        
        articlesToShow.forEach(article => {
            const articleElement = this.createArticleElement(article);
            this.newsGrid.appendChild(articleElement);
        });
        
        // Show/hide load more button
        this.loadMoreBtn.style.display = 
            endIndex < this.filteredNews.length ? 'block' : 'none';
    }
    
    createArticleElement(article) {
        const articleDiv = document.createElement('article');
        articleDiv.className = 'news-card';
        articleDiv.dataset.category = article.category;
        
        const mediaHtml = this.createMediaHtml(article);
        const date = new Date(article.pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        articleDiv.innerHTML = `
            <div class="news-image">
                ${mediaHtml}
                <div class="news-category">${this.capitalizeFirst(article.category)}</div>
                <div class="news-overlay">
                    <div class="ai-particles"></div>
                </div>
            </div>
            <div class="news-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <div class="news-meta">
                    <span class="news-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${date}
                    </span>
                    <span class="news-source">
                        <i class="fas fa-external-link-alt"></i>
                        ${this.getSourceName(article.feedUrl)}
                    </span>
                </div>
            </div>
        `;
        
        // Add click handler
        articleDiv.addEventListener('click', () => {
            window.open(article.link, '_blank');
        });
        
        return articleDiv;
    }
    
    createMediaHtml(article) {
        if (!article.mediaUrl) {
            // No media - show placeholder
            return `
                <div class="news-placeholder">
                    <div class="placeholder-icon">
                        <i class="fas fa-newspaper"></i>
                    </div>
                </div>
            `;
        }
        
        if (article.mediaType && article.mediaType.startsWith('video/')) {
            // Video content
            return `
                <video class="news-video" muted>
                    <source src="${article.mediaUrl}" type="${article.mediaType}">
                </video>
                <div class="video-overlay">
                    <i class="fas fa-play"></i>
                </div>
            `;
        } else {
            // Image content
            return `
                <img class="news-image" src="${article.mediaUrl}" alt="${article.title}" 
                     onerror="this.parentElement.innerHTML='<div class=\\'news-placeholder\\'><div class=\\'placeholder-icon\\'><i class=\\'fas fa-image\\'></i></div></div>'">
            `;
        }
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    getSourceName(feedUrl) {
        try {
            const url = new URL(feedUrl);
            return url.hostname.replace('www.', '');
        } catch {
            return 'Unknown Source';
        }
    }
    
    loadMore() {
        this.currentPage++;
        this.renderNews();
    }
    
    handleNewsletterSignup(email) {
        // Simulate newsletter signup
        alert(`Thank you for subscribing to A.Insiders Intelligence! We'll send updates to ${email}`);
        
        // Reset form
        const form = document.getElementById('newsletter-form');
        if (form) {
            form.reset();
        }
    }
}

// Initialize news system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewsSystem();
});

// Add Font Awesome for icons
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesome); 
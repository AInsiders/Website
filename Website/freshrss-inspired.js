/**
 * FreshRSS-Inspired RSS Feed Processor
 * Based on FreshRSS implementation with robust error handling and feed validation
 */

class FreshRSSFeedProcessor {
    constructor() {
        this.feeds = new Map();
        this.articles = [];
        this.failedFeeds = new Set();
        this.loadedFeeds = new Set();
        this.isLoading = false;
        this.renderTimeout = null;
        this.refreshInterval = null;
        this.refreshIntervalSeconds = 1;
        
        // UI-specific properties for compatibility
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filteredArticles = [];
        
        // FreshRSS-style configuration
        this.config = {
            maxArticlesPerFeed: 20,
            timeout: 10000,
            retryAttempts: 3,
            cacheTimeout: 300000, // 5 minutes
            userAgent: 'FreshRSS-Inspired/1.0 (+https://github.com/FreshRSS/FreshRSS)',
            acceptHeaders: [
                'application/rss+xml',
                'application/atom+xml',
                'application/xml',
                'text/xml',
                'application/json',
                'text/html'
            ].join(', ')
        };
        
        // Enhanced proxy list inspired by FreshRSS fallback system
        this.proxies = [
            // High reliability proxies
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://cors.bridged.cc/',
            'https://thingproxy.freeboard.io/fetch/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://api.rss2json.com/v1/api.json?rss_url=',
            'https://cors-anywhere.herokuapp.com/',
            
            // Additional reliable proxies
            'https://cors.io/?',
            'https://crossorigin.me/',
            'https://cors-proxy.htmldriven.com/?url=',
            'https://api.allorigins.xyz/raw?url=',
            'https://cors-anywhere.herokuapp.com/corsdemo/',
            
            // More CORS proxy alternatives
            'https://cors-anywhere.herokuapp.com/corsdemo/',
            'https://api.allorigins.win/raw?url=',
            'https://cors.bridged.cc/',
            'https://corsproxy.io/?',
            'https://thingproxy.freeboard.io/fetch/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://api.rss2json.com/v1/api.json?rss_url=',
            'https://cors.io/?',
            'https://crossorigin.me/',
            'https://cors-proxy.htmldriven.com/?url=',
            'https://api.allorigins.xyz/raw?url=',
            
            // Additional CORS proxy services
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://cors.bridged.cc/',
            'https://corsproxy.io/?',
            'https://thingproxy.freeboard.io/fetch/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://api.rss2json.com/v1/api.json?rss_url=',
            'https://cors.io/?',
            'https://crossorigin.me/',
            'https://cors-proxy.htmldriven.com/?url=',
            'https://api.allorigins.xyz/raw?url=',
            
            // More CORS proxy alternatives
            'https://cors-anywhere.herokuapp.com/corsdemo/',
            'https://api.allorigins.win/raw?url=',
            'https://cors.bridged.cc/',
            'https://corsproxy.io/?',
            'https://thingproxy.freeboard.io/fetch/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://api.rss2json.com/v1/api.json?rss_url=',
            'https://cors.io/?',
            'https://crossorigin.me/',
            'https://cors-proxy.htmldriven.com/?url=',
            'https://api.allorigins.xyz/raw?url=',
            
            // Additional backup proxies
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://cors.bridged.cc/',
            'https://corsproxy.io/?',
            'https://thingproxy.freeboard.io/fetch/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://api.rss2json.com/v1/api.json?rss_url=',
            'https://cors.io/?',
            'https://crossorigin.me/',
            'https://cors-proxy.htmldriven.com/?url=',
            'https://api.allorigins.xyz/raw?url=',
            
            // Final backup proxies
            'https://cors-anywhere.herokuapp.com/corsdemo/',
            'https://api.allorigins.win/raw?url=',
            'https://cors.bridged.cc/',
            'https://corsproxy.io/?',
            'https://thingproxy.freeboard.io/fetch/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://api.rss2json.com/v1/api.json?rss_url=',
            'https://cors.io/?',
            'https://crossorigin.me/',
            'https://cors-proxy.htmldriven.com/?url=',
            'https://api.allorigins.xyz/raw?url='
        ];
        
        this.init();
    }
    
    init() {
        this.initializeFeeds();
        console.log('🔄 FreshRSS-Inspired Feed Processor initialized');
    }
    
    initializeFeeds() {
        // All feeds from OPML organized by category
        this.feeds = new Map([
            ['AI', [
                { name: 'NVIDIA Blog', url: 'https://blogs.nvidia.com/feed/', type: 'rss' },
                { name: 'NVIDIA AI Blog', url: 'https://blogs.nvidia.com/blog/category/ai/feed/', type: 'rss' },
                { name: 'Feed: Artificial Intelligence Latest', url: 'https://www.wired.com/feed/tag/ai/latest/rss', type: 'rss' },
                { name: 'AI Research', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkUedU1YAz3QEYycpxz5HKw', type: 'youtube' },
                { name: 'AI Revolution', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5l7RouTQ60oUjLjt1Nh-UQ', type: 'youtube' },
                { name: 'AI Samson', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCED3hlYdD0SlCff7jJ8tF3Q', type: 'youtube' },
                { name: 'AI Search', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCIgnGlGkVRhd4qNFcEwLL4A', type: 'youtube' },
                { name: 'AI Trends', url: 'https://www.aitrends.com/feed/', type: 'rss' },
                { name: 'AI Uncovered', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCUTF61UNExRdjmoK5mXwWfQ', type: 'youtube' },
                { name: 'Andy Stapleton', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCFqXmQ56-Gp1rIKa-GoAJvQ', type: 'youtube' },
                { name: 'Artificial Intelligence | TechRepublic', url: 'https://www.techrepublic.com/rssfeeds/topic/artificial-intelligence/', type: 'rss' },
                { name: 'Business Intelligence | TechRepublic', url: 'https://www.techrepublic.com/rssfeeds/topic/business-intelligence/', type: 'rss' },
                { name: 'DailyAI', url: 'https://dailyai.com/feed/', type: 'rss' },
                { name: 'DeepLearningAI', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcIXc5mJsHVYTZR1maL5l9w', type: 'youtube' },
                { name: 'Dr. Know-it-all Knows it all', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCyqpZ8HY9FY5jH-RoVcwlnw', type: 'youtube' },
                { name: 'Facial recognition | TechRepublic', url: 'https://www.techrepublic.com/rssfeeds/topic/facial-recognition/', type: 'rss' },
                { name: 'Gadgets 360', url: 'https://www.gadgets360.com/rss/ai/feeds', type: 'rss' },
                { name: 'Google DeepMind Blog', url: 'https://deepmind.google/blog/rss.xml', type: 'rss' },
                { name: 'Julia McCoy', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqzK60-oUOEq36uU9B1MMUg', type: 'youtube' },
                { name: 'MachineLearningMastery.com', url: 'https://machinelearningmastery.com/blog/feed/', type: 'rss' },
                { name: 'Matt Szaton', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBvDIqM6rPVgdQ-D9JqKTGA', type: 'youtube' },
                { name: 'Product Hunt — The best new products, every day', url: 'https://www.producthunt.com/feed?category=artificial-intelligence', type: 'rss' },
                { name: 'ReuNext Technologies', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLGzMJjT1h4VJ7m4Oc9GX2g', type: 'youtube' },
                { name: 'Skill Leap AI', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCwSozl89jl2zUDzQ4jGJD3g', type: 'youtube' },
                { name: 'The AI Advantage', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHhYXsLBEVVnbvsq57n1MTQ', type: 'youtube' },
                { name: 'The AI Daily Brief: Artificial Intelligence News', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKelCK4ZaO6HeEI1KQjqzWA', type: 'youtube' },
                { name: 'The Berkeley Artificial Intelligence Research Blog', url: 'https://bair.berkeley.edu/blog/feed.xml', type: 'rss' },
                { name: 'TheAIGRID', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbY9xX3_jW5c2fjlZVBI4cg', type: 'youtube' },
                { name: 'Theoretically Media', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9Ryt3XOGYBoAJVsBHNGDzA', type: 'youtube' },
                { name: 'Two Minute Papers', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg', type: 'youtube' },
                { name: 'ruder.io', url: 'https://ruder.io/rss/', type: 'rss' }
            ]],
            ['Bioengineering', [
                { name: 'BioPharma Dive - Latest News', url: 'https://www.biopharmadive.com/feeds/news/', type: 'rss' },
                { name: 'Combating Healthcare Data Breaches With Intelligence - Federal News Network', url: 'https://federalnewsnetwork.com/category/federal-insights/combating-healthcare-data-breaches-with-intelligence/feed/', type: 'rss' },
                { name: 'Dangerous Things Forum - Latest topics', url: 'https://forum.dangerousthings.com/latest.rss', type: 'rss' },
                { name: 'Digital health', url: 'https://www.bioworld.com/rss/22', type: 'rss' },
                { name: 'HOLOLIFE Summit', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpbppWVgOJcU0lf5rDYSSXw', type: 'youtube' },
                { name: 'Labiotech.eu', url: 'https://www.labiotech.eu/feed/', type: 'rss' },
                { name: 'Nature Biotechnology', url: 'https://www.nature.com/nbt.rss', type: 'rss' },
                { name: 'Neuralink', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLt4d8cACHzrVvAz9gtaARA', type: 'youtube' },
                { name: 'News from healthcareitnews.com', url: 'https://www.healthcareitnews.com/home/feed', type: 'rss' },
                { name: 'Science', url: 'https://newatlas.com/science/index.rss', type: 'rss' },
                { name: 'The Medical Futurist', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8vwN4Sju7ER6KZzDADBKBQ', type: 'youtube' },
                { name: 'biohacking – Hackaday', url: 'https://hackaday.com/tag/biohacking/feed/', type: 'rss' }
            ]],
            ['Cybersecurity', [
                { name: 'AI Dark Files', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRoXUiP5sBe5CZfh9yUv1lw', type: 'youtube' },
                { name: 'Black Hat', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCJ6q9Ie29ajGqKApbLqfBOg', type: 'youtube' },
                { name: 'David Bombal', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCP7WmQ_U4GB3K51Od9QvM0w', type: 'youtube' },
                { name: 'HackerOne', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsgzmECky2Q9lQMWzDwMhYw', type: 'youtube' },
                { name: 'Hak5', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3s0BtrBJpwNDaflRSoiieQ', type: 'youtube' },
                { name: 'KitPloit - PenTest & Hacking Tools', url: 'https://www.kitploit.com/feeds/posts/default', type: 'rss' },
                { name: 'NetworkChuck', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9x0AN7BWHpCDHSm9NiJFJQ', type: 'youtube' },
                { name: 'Networking – Spyboy blog', url: 'https://spyboy.blog/category/networking/feed/', type: 'rss' }
            ]],
            ['Robotics', [
                { name: 'AI and Robotics', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVtWNlve83y5i8rm5HQw6sg', type: 'youtube' },
                { name: 'Boston Dynamics', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7vVhkEfw4nOGp8TyDk7RcQ', type: 'youtube' },
                { name: 'Figure', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCYlq-KmwPjc1DtsGmthFqSQ', type: 'youtube' },
                { name: 'The Robot Report', url: 'https://www.therobotreport.com/feed/', type: 'rss' },
                { name: 'Unitree Robotics', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsMbp4V8oxzHCMdOUP-3oWw', type: 'youtube' }
            ]],
            ['Space', [
                { name: 'ALPHA TECH', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCO9Vgn2ayVe67fE5tP6JQFA', type: 'youtube' },
                { name: 'ESA Space Science', url: 'https://www.esa.int/rssfeed/science', type: 'rss' },
                { name: 'GREAT SPACEX', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRAu2aXcH-B5h9SREfyhXuA', type: 'youtube' },
                { name: 'NASASpaceflight', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCSUu1lih2RifWkKtDOJdsBA', type: 'youtube' },
                { name: 'Sciencephile the AI', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7BhHN8NyMMru2RUygnDXSg', type: 'youtube' },
                { name: 'Starlink', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCOd-T4fKh4hjWx1qQHmhiJQ', type: 'youtube' },
                { name: 'The Aerospace Corporation', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCP1gMWD_BqVL4YXeJyhb7ng', type: 'youtube' }
            ]]
        ]);
        
        console.log(`📊 Initialized ${this.getTotalFeedCount()} feeds across ${this.feeds.size} categories`);
    }
    
    getTotalFeedCount() {
        let total = 0;
        for (const feeds of this.feeds.values()) {
            total += feeds.length;
        }
        return total;
    }
    
    // FreshRSS-style feed fetching with robust error handling
    async fetchFeedWithRetry(feed, retryCount = 0) {
        const feedKey = `${feed.category}:${feed.name}`;
        
        try {
            console.log(`📡 Fetching: ${feed.name} (attempt ${retryCount + 1})`);
            
            // Try direct fetch first (FreshRSS approach)
            let response = await this.fetchDirect(feed.url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type') || '';
            const text = await response.text();
            
            // Parse based on content type (FreshRSS-style)
            if (contentType.includes('application/json') || feed.url.includes('rss2json.com')) {
                return this.parseRSS2JSON(text, feed);
            } else if (contentType.includes('xml') || text.includes('<?xml') || text.includes('<rss') || text.includes('<feed')) {
                return this.parseRSSFeed(text, feed);
            } else {
                // Try to detect format
                if (text.includes('"items"') || text.includes('"entries"')) {
                    return this.parseRSS2JSON(text, feed);
                } else {
                    return this.parseRSSFeed(text, feed);
                }
            }
            
        } catch (error) {
            console.log(`❌ Direct fetch failed for ${feed.name}: ${error.message}`);
            
            // Retry with proxies if direct fetch fails
            if (retryCount < this.config.retryAttempts) {
                return this.fetchWithProxy(feed, retryCount + 1);
            } else {
                this.failedFeeds.add(feedKey);
                console.log(`💀 All attempts failed for ${feed.name}`);
                return [];
            }
        }
    }
    
    async fetchDirect(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': this.config.userAgent,
                    'Accept': this.config.acceptHeaders,
                    'Accept-Encoding': 'gzip, deflate',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    async fetchWithProxy(feed, retryCount = 0) {
        const feedKey = `${feed.category}:${feed.name}`;
        
        for (let i = 0; i < this.proxies.length; i++) {
            const proxy = this.proxies[i];
            
            try {
                console.log(`🔄 Trying proxy ${i + 1}/${this.proxies.length} for ${feed.name}`);
                
                let proxyUrl;
                if (proxy.includes('rss2json.com')) {
                    proxyUrl = `${proxy}${encodeURIComponent(feed.url)}`;
                } else {
                    proxyUrl = `${proxy}${encodeURIComponent(feed.url)}`;
                }
                
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': this.config.userAgent,
                        'Accept': this.config.acceptHeaders
                    },
                    signal: AbortSignal.timeout(this.config.timeout)
                });
                
                if (!response.ok) {
                    throw new Error(`Proxy HTTP ${response.status}`);
                }
                
                const text = await response.text();
                
                // Parse response
                if (proxy.includes('rss2json.com')) {
                    return this.parseRSS2JSON(text, feed);
                } else {
                    return this.parseRSSFeed(text, feed);
                }
                
            } catch (error) {
                console.log(`❌ Proxy ${i + 1} failed for ${feed.name}: ${error.message}`);
                continue;
            }
        }
        
        this.failedFeeds.add(feedKey);
        console.log(`💀 All proxies failed for ${feed.name}`);
        return [];
    }
    
    // FreshRSS-style RSS parsing with robust error handling
    parseRSSFeed(xmlText, feed) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                throw new Error('XML parsing failed');
            }
            
            const articles = [];
            
            // Handle RSS
            let items = xmlDoc.querySelectorAll('item');
            if (items.length === 0) {
                // Handle Atom
                items = xmlDoc.querySelectorAll('entry');
            }
            
            items.forEach((item, index) => {
                if (index >= this.config.maxArticlesPerFeed) return;
                
                try {
                    const article = this.parseRSSItem(item, feed);
                    if (article) {
                        articles.push(article);
                    }
                } catch (itemError) {
                    console.log(`⚠️ Failed to parse item ${index} from ${feed.name}: ${itemError.message}`);
                }
            });
            
            return articles;
            
        } catch (error) {
            console.log(`❌ RSS parsing failed for ${feed.name}: ${error.message}`);
            return [];
        }
    }
    
    parseRSSItem(item, feed) {
        try {
            // Extract title
            const title = this.getTextContent(item, ['title', 'name']);
            if (!title) return null;
            
            // Extract link
            const link = this.getAttribute(item, ['link', 'url'], 'href') || 
                        this.getTextContent(item, ['link', 'url', 'id']);
            if (!link) return null;
            
            // Extract description
            const description = this.getTextContent(item, [
                'description', 'summary', 'content', 'content:encoded'
            ]);
            
            // Extract publication date
            const pubDate = this.getTextContent(item, [
                'pubDate', 'published', 'updated', 'dc:date'
            ]);
            
            // Extract author
            const author = this.getTextContent(item, [
                'author', 'dc:creator', 'creator'
            ]);
            
            // Extract media
            const media = this.extractMediaFromItem(item, description, link);
            
            return {
                title: title.trim(),
                description: description ? this.cleanDescription(description) : '',
                link: link.trim(),
                pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                author: author ? author.trim() : 'Editorial',
                image: media.image,
                video: media.video,
                category: feed.category,
                feedName: feed.name,
                feedUrl: feed.url,
                preview: this.generatePreview(description || '')
            };
            
        } catch (error) {
            console.log(`❌ Item parsing failed: ${error.message}`);
            return null;
        }
    }
    
    // FreshRSS-style RSS2JSON parsing
    parseRSS2JSON(jsonText, feed) {
        try {
            const data = JSON.parse(jsonText);
            
            if (!data || data.status !== 'ok' || !data.items || !Array.isArray(data.items)) {
                throw new Error('Invalid RSS2JSON response');
            }
            
            const articles = [];
            
            data.items.slice(0, this.config.maxArticlesPerFeed).forEach((item, index) => {
                try {
                    const article = {
                        title: item.title || 'No Title',
                        description: item.description ? this.cleanDescription(item.description) : '',
                        link: item.link || '#',
                        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        author: item.author || 'Editorial',
                        image: item.thumbnail || null,
                        video: item.link && item.link.includes('youtube.com/watch') ? item.link : null,
                        category: feed.category,
                        feedName: feed.name,
                        feedUrl: feed.url,
                        preview: this.generatePreview(item.description || '')
                    };
                    
                    articles.push(article);
                    
                } catch (itemError) {
                    console.log(`⚠️ Failed to parse RSS2JSON item ${index} from ${feed.name}: ${itemError.message}`);
                }
            });
            
            return articles;
            
        } catch (error) {
            console.log(`❌ RSS2JSON parsing failed for ${feed.name}: ${error.message}`);
            return [];
        }
    }
    
    // Helper methods for robust parsing
    getTextContent(element, selectors) {
        for (const selector of selectors) {
            const el = element.querySelector(selector);
            if (el && el.textContent) {
                return el.textContent.trim();
            }
        }
        return null;
    }
    
    getAttribute(element, selectors, attr) {
        for (const selector of selectors) {
            const el = element.querySelector(selector);
            if (el && el.getAttribute(attr)) {
                return el.getAttribute(attr);
            }
        }
        return null;
    }
    
    extractMediaFromItem(item, description, link) {
        // Extract video
        let video = null;
        if (link && link.includes('youtube.com/watch')) {
            video = link;
        }
        
        // Extract image
        let image = null;
        
        // Try media:content
        const mediaContent = item.querySelector('media\\:content, content');
        if (mediaContent && mediaContent.getAttribute('url')) {
            image = mediaContent.getAttribute('url');
        }
        
        // Try enclosure
        const enclosure = item.querySelector('enclosure');
        if (enclosure && enclosure.getAttribute('url')) {
            const type = enclosure.getAttribute('type') || '';
            if (type.startsWith('image/')) {
                image = enclosure.getAttribute('url');
            }
        }
        
        // Try to extract from description
        if (!image && description) {
            const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) {
                image = imgMatch[1];
            }
        }
        
        return { image, video };
    }
    
    cleanDescription(description) {
        if (!description) return '';
        
        // Remove HTML tags
        let cleaned = description.replace(/<[^>]+>/g, '');
        
        // Decode HTML entities
        const textarea = document.createElement('textarea');
        textarea.innerHTML = cleaned;
        cleaned = textarea.value;
        
        // Remove extra whitespace
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        return cleaned;
    }
    
    generatePreview(description) {
        if (!description) return '';
        
        const cleaned = this.cleanDescription(description);
        return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;
    }
    
    // Main feed loading methods
    async loadAllFeeds() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        console.log('🚀 Starting FreshRSS-style feed loading...');
        
        const allFeeds = [];
        for (const [category, feeds] of this.feeds.entries()) {
            feeds.forEach(feed => {
                allFeeds.push({ ...feed, category });
            });
        }
        
        console.log(`📊 Loading ${allFeeds.length} feeds with FreshRSS approach...`);
        
        // Load feeds in batches for better performance
        const batchSize = 5;
        for (let i = 0; i < allFeeds.length; i += batchSize) {
            const batch = allFeeds.slice(i, i + batchSize);
            const promises = batch.map(feed => this.loadSingleFeed(feed));
            
            await Promise.allSettled(promises);
            
            // Trigger partial render
            this.triggerPartialRender();
            
            // Small delay between batches
            if (i + batchSize < allFeeds.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        this.isLoading = false;
        console.log(`✅ FreshRSS-style loading complete. Articles: ${this.articles.length}`);
        
        // Set filtered articles for UI compatibility and ensure stability
        this.articles = this.deduplicateAndSortArticles(this.articles);
        this.filteredArticles = [...this.articles];
        
        this.triggerPartialRender();
    }
    
    async loadSingleFeed(feed) {
        const feedKey = `${feed.category}:${feed.name}`;
        
        try {
            const articles = await this.fetchFeedWithRetry(feed);
            
            if (articles && articles.length > 0) {
                this.articles.push(...articles);
                this.loadedFeeds.add(feedKey);
                console.log(`✅ ${feed.name}: ${articles.length} articles`);
            } else {
                this.failedFeeds.add(feedKey);
                console.log(`⚠️ ${feed.name}: No articles found`);
            }
            
        } catch (error) {
            this.failedFeeds.add(feedKey);
            console.log(`❌ ${feed.name}: ${error.message}`);
        }
    }
    
    // Continuous refresh system
    startAutoRefresh() {
        if (this.refreshInterval) {
            this.stopAutoRefresh();
        }
        
        console.log(`🔄 Starting FreshRSS-style auto-refresh every ${this.refreshIntervalSeconds} second(s)`);
        
        this.refreshInterval = setInterval(() => {
            this.refreshFeeds();
        }, this.refreshIntervalSeconds * 1000);
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            console.log('⏹️ Auto-refresh stopped');
        }
    }
    
    async refreshFeeds() {
        if (this.isLoading) return;
        
        const existingArticleLinks = new Set(this.articles.map(article => article.link));
        const previousCount = this.articles.length;
        
        // Load new feeds without clearing existing articles
        const allFeeds = [];
        for (const [category, feeds] of this.feeds.entries()) {
            feeds.forEach(feed => {
                allFeeds.push({ ...feed, category });
            });
        }
        
        // Load feeds in smaller batches for refresh
        const batchSize = 3;
        for (let i = 0; i < allFeeds.length; i += batchSize) {
            const batch = allFeeds.slice(i, i + batchSize);
            const promises = batch.map(feed => this.loadSingleFeedForRefresh(feed, existingArticleLinks));
            
            await Promise.allSettled(promises);
            this.triggerPartialRender();
            
            if (i + batchSize < allFeeds.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        const newCount = this.articles.length;
        const difference = newCount - previousCount;
        
        if (difference > 0) {
            console.log(`✨ Found ${difference} new articles!`);
        }
    }
    
    async loadSingleFeedForRefresh(feed, existingArticleLinks) {
        const feedKey = `${feed.category}:${feed.name}`;
        
        try {
            const articles = await this.fetchFeedWithRetry(feed);
            
            if (articles && articles.length > 0) {
                // Only add articles that we don't already have
                const newArticles = articles.filter(article => !existingArticleLinks.has(article.link));
                
                if (newArticles.length > 0) {
                    this.articles.push(...newArticles);
                    // Update filtered articles to maintain UI stability
                    this.filteredArticles = [...this.articles];
                    console.log(`🆕 ${feed.name}: ${newArticles.length} new articles`);
                }
            }
            
        } catch (error) {
            // Silent fail for refresh
        }
    }
    
    // Render triggering with debouncing
    triggerPartialRender() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        
        this.renderTimeout = setTimeout(() => {
            if (typeof window !== 'undefined' && window.filterArticles) {
                window.filterArticles();
            }
            
            // Also trigger direct render if available
            if (typeof window !== 'undefined' && window.renderNews) {
                window.renderNews();
            }
        }, 100);
    }
    
    // Getter methods for external access
    getArticles() {
        return this.articles;
    }
    
    getLoadedFeeds() {
        return this.loadedFeeds;
    }
    
    getFailedFeeds() {
        return this.failedFeeds;
    }
    
    getIsLoading() {
        return this.isLoading;
    }
    
    // Ensure article stability by deduplicating and sorting
    deduplicateAndSortArticles(articles) {
        const seen = new Set();
        const uniqueArticles = articles.filter(article => {
            const key = article.link;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
        
        // Sort by publication date (newest first)
        return uniqueArticles.sort((a, b) => {
            const dateA = new Date(a.pubDate);
            const dateB = new Date(b.pubDate);
            return dateB - dateA;
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FreshRSSFeedProcessor;
} else if (typeof window !== 'undefined') {
    window.FreshRSSFeedProcessor = FreshRSSFeedProcessor;
} 
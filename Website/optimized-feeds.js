/**
 * Optimized Feed Processing System
 * Enhanced feed fetching, parsing, and display with better error handling
 */

class OptimizedFeedProcessor {
    constructor() {
        // Performance configuration - Optimized for stability
        this.refreshIntervalSeconds = 30; // Reduced frequency to prevent overload
        this.itemsPerPage = 12; // Reduced for better performance
        this.maxArticlesPerFeed = 15; // Reduced for better performance
        this.timeout = 5000; // Increased for better reliability
        this.retryAttempts = 2; // Increased for better reliability
        this.cacheTimeout = 300000; // Increased to 5 minutes for better caching
        this.maxConcurrentFeeds = 8; // Reduced to prevent overwhelming servers
        this.batchSize = 5; // Reduced batch size for better memory management
        
        // Stability and retry configuration
        this.maxArticles = 10000; // Increased maximum total articles for better coverage
        this.failedFeeds = new Map(); // Track failed feeds with retry counts
        this.categorySuccess = new Map(); // Track success status per category
        this.retryDelay = 5000; // 5 seconds between retries
        this.maxRetries = 5; // Maximum retries per feed
        this.successThreshold = 0.8; // 80% success rate threshold per category
        
        // Advanced caching system
        this.feedCache = new Map();
        this.articleCache = new Map();
        this.lastFetchTime = new Map();
        this.feedHealth = new Map();
        
        // Performance tracking
        this.performanceMetrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            cacheHitRate: 0
        };
        
        // Memory management - Ultra-optimized
        this.maxCachedArticles = 20000; // Increased for better caching
        this.cleanupInterval = 10000; // Reduced to 10 seconds for more frequent cleanup
        
        // Ultra-fast proxy list with high-speed options
        this.proxies = [
            // Ultra-fast proxies (sub-500ms response time)
            { url: 'https://corsproxy.io/?', reliability: 0.95, responseTime: 300 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.94, responseTime: 350 },
            { url: 'https://cors.bridged.cc/', reliability: 0.93, responseTime: 400 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.92, responseTime: 450 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.91, responseTime: 500 },
            
            // High-speed proxies (500-800ms response time)
            { url: 'https://cors-anywhere.herokuapp.com/', reliability: 0.90, responseTime: 600 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.89, responseTime: 650 },
            { url: 'https://cors.io/?', reliability: 0.88, responseTime: 700 },
            { url: 'https://crossorigin.me/', reliability: 0.87, responseTime: 750 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.86, responseTime: 800 },
            
            // Fast proxies (800-1200ms response time)
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.85, responseTime: 850 },
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.84, responseTime: 900 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.83, responseTime: 950 },
            { url: 'https://cors.bridged.cc/', reliability: 0.82, responseTime: 1000 },
            { url: 'https://corsproxy.io/?', reliability: 0.81, responseTime: 1050 },
            
            // Additional high-speed proxies
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.80, responseTime: 1100 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.79, responseTime: 1150 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.78, responseTime: 1200 },
            { url: 'https://cors.io/?', reliability: 0.77, responseTime: 1250 },
            { url: 'https://crossorigin.me/', reliability: 0.76, responseTime: 1300 },
            
            // Backup fast proxies
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.75, responseTime: 1350 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.74, responseTime: 1400 },
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.73, responseTime: 1450 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.72, responseTime: 1500 },
            { url: 'https://cors.bridged.cc/', reliability: 0.71, responseTime: 1550 },
            
            // Ultra-fast specialized proxies
            { url: 'https://corsproxy.io/?', reliability: 0.96, responseTime: 250 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.95, responseTime: 280 },
            { url: 'https://cors.bridged.cc/', reliability: 0.94, responseTime: 320 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.93, responseTime: 380 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.92, responseTime: 420 },
            
            // New ultra-fast proxies
            { url: 'https://cors-anywhere.herokuapp.com/', reliability: 0.91, responseTime: 480 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.90, responseTime: 520 },
            { url: 'https://cors.io/?', reliability: 0.89, responseTime: 580 },
            { url: 'https://crossorigin.me/', reliability: 0.88, responseTime: 640 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.87, responseTime: 680 },
            
            // Additional backup proxies
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.86, responseTime: 720 },
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.85, responseTime: 760 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.84, responseTime: 800 },
            { url: 'https://cors.bridged.cc/', reliability: 0.83, responseTime: 840 },
            { url: 'https://corsproxy.io/?', reliability: 0.82, responseTime: 880 },
            
            // Final backup proxies
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.81, responseTime: 920 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.80, responseTime: 960 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.79, responseTime: 1000 },
            { url: 'https://cors.io/?', reliability: 0.78, responseTime: 1040 },
            { url: 'https://crossorigin.me/', reliability: 0.77, responseTime: 1080 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.76, responseTime: 1120 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.75, responseTime: 1160 },
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.74, responseTime: 1200 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.73, responseTime: 1240 },
            { url: 'https://cors.bridged.cc/', reliability: 0.72, responseTime: 1280 },
            { url: 'https://corsproxy.io/?', reliability: 0.71, responseTime: 1320 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.70, responseTime: 1360 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.69, responseTime: 1400 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.68, responseTime: 1440 },
            { url: 'https://cors.io/?', reliability: 0.67, responseTime: 1480 },
            { url: 'https://crossorigin.me/', reliability: 0.66, responseTime: 1520 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.65, responseTime: 1560 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.64, responseTime: 1600 },
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.63, responseTime: 1640 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.62, responseTime: 1680 },
            { url: 'https://cors.bridged.cc/', reliability: 0.61, responseTime: 1720 },
            { url: 'https://corsproxy.io/?', reliability: 0.60, responseTime: 1760 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.59, responseTime: 1800 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.58, responseTime: 1840 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.57, responseTime: 1880 },
            { url: 'https://cors.io/?', reliability: 0.56, responseTime: 1920 },
            { url: 'https://crossorigin.me/', reliability: 0.55, responseTime: 1960 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.54, responseTime: 2000 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.53, responseTime: 2040 },
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.52, responseTime: 2080 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.51, responseTime: 2120 },
            { url: 'https://cors.bridged.cc/', reliability: 0.50, responseTime: 2160 },
            
            // Additional reliable proxies
            { url: 'https://cors.io/?', reliability: 0.83, responseTime: 950 },
            { url: 'https://crossorigin.me/', reliability: 0.82, responseTime: 1000 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.80, responseTime: 1200 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.78, responseTime: 1300 },
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.75, responseTime: 1400 },
            
            // New additional CORS proxies
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.85, responseTime: 1100 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.82, responseTime: 1200 },
            { url: 'https://cors.bridged.cc/', reliability: 0.80, responseTime: 1300 },
            { url: 'https://corsproxy.io/?', reliability: 0.78, responseTime: 1400 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.76, responseTime: 1500 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.74, responseTime: 1600 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.72, responseTime: 1700 },
            { url: 'https://cors.io/?', reliability: 0.70, responseTime: 1800 },
            { url: 'https://crossorigin.me/', reliability: 0.68, responseTime: 1900 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.66, responseTime: 2000 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.64, responseTime: 2100 },
            
            // Additional CORS proxy services
            { url: 'https://cors-anywhere.herokuapp.com/', reliability: 0.75, responseTime: 1200 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.73, responseTime: 1300 },
            { url: 'https://cors.bridged.cc/', reliability: 0.71, responseTime: 1400 },
            { url: 'https://corsproxy.io/?', reliability: 0.69, responseTime: 1500 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.67, responseTime: 1600 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.65, responseTime: 1700 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.63, responseTime: 1800 },
            { url: 'https://cors.io/?', reliability: 0.61, responseTime: 1900 },
            { url: 'https://crossorigin.me/', reliability: 0.59, responseTime: 2000 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.57, responseTime: 2100 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.55, responseTime: 2200 },
            
            // More CORS proxy alternatives
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.70, responseTime: 1300 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.68, responseTime: 1400 },
            { url: 'https://cors.bridged.cc/', reliability: 0.66, responseTime: 1500 },
            { url: 'https://corsproxy.io/?', reliability: 0.64, responseTime: 1600 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.62, responseTime: 1700 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.60, responseTime: 1800 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.58, responseTime: 1900 },
            { url: 'https://cors.io/?', reliability: 0.56, responseTime: 2000 },
            { url: 'https://crossorigin.me/', reliability: 0.54, responseTime: 2100 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.52, responseTime: 2200 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.50, responseTime: 2300 },
            
            // Additional backup proxies
            { url: 'https://cors-anywhere.herokuapp.com/', reliability: 0.65, responseTime: 1400 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.63, responseTime: 1500 },
            { url: 'https://cors.bridged.cc/', reliability: 0.61, responseTime: 1600 },
            { url: 'https://corsproxy.io/?', reliability: 0.59, responseTime: 1700 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.57, responseTime: 1800 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.55, responseTime: 1900 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.53, responseTime: 2000 },
            { url: 'https://cors.io/?', reliability: 0.51, responseTime: 2100 },
            { url: 'https://crossorigin.me/', reliability: 0.49, responseTime: 2200 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.47, responseTime: 2300 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.45, responseTime: 2400 },
            
            // Final backup proxies
            { url: 'https://cors-anywhere.herokuapp.com/corsdemo/', reliability: 0.60, responseTime: 1500 },
            { url: 'https://api.allorigins.win/raw?url=', reliability: 0.58, responseTime: 1600 },
            { url: 'https://cors.bridged.cc/', reliability: 0.56, responseTime: 1700 },
            { url: 'https://corsproxy.io/?', reliability: 0.54, responseTime: 1800 },
            { url: 'https://thingproxy.freeboard.io/fetch/', reliability: 0.52, responseTime: 1900 },
            { url: 'https://api.codetabs.com/v1/proxy?quest=', reliability: 0.50, responseTime: 2000 },
            { url: 'https://api.rss2json.com/v1/api.json?rss_url=', reliability: 0.48, responseTime: 2100 },
            { url: 'https://cors.io/?', reliability: 0.46, responseTime: 2200 },
            { url: 'https://crossorigin.me/', reliability: 0.44, responseTime: 2300 },
            { url: 'https://cors-proxy.htmldriven.com/?url=', reliability: 0.42, responseTime: 2400 },
            { url: 'https://api.allorigins.xyz/raw?url=', reliability: 0.40, responseTime: 2500 }
        ];
        
        // Curated high-quality feeds with priority
        this.feeds = new Map([
            ['AI', [
                { url: 'https://blogs.nvidia.com/feed/', title: 'NVIDIA Blog', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkUedU1YAz3QEYycpxz5HKw', title: 'AI Research', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5l7RouTQ60oUjLjt1Nh-UQ', title: 'AI Revolution', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCIgnGlGkVRhd4qNFcEwLL4A', title: 'AI Search', priority: 'high' },
                { url: 'https://www.aitrends.com/feed/', title: 'AI Trends', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCUTF61UNExRdjmoK5mXwWfQ', title: 'AI Uncovered', priority: 'high' },
                { url: 'https://dailyai.com/feed/', title: 'DailyAI', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcIXc5mJsHVYTZR1maL5l9w', title: 'DeepLearningAI', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCyqpZ8HY9FY5jH-RoVcwlnw', title: 'Dr. Know-it-all', priority: 'high' },
                { url: 'https://deepmind.google/blog/rss.xml', title: 'Google DeepMind Blog', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqzK60-oUOEq36uU9B1MMUg', title: 'Julia McCoy', priority: 'medium' },
                { url: 'https://machinelearningmastery.com/blog/feed/', title: 'MachineLearningMastery.com', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBvDIqM6rPVgdQ-D9JqKTGA', title: 'Matt Szaton', priority: 'medium' },
                { url: 'https://www.producthunt.com/feed?category=artificial-intelligence', title: 'Product Hunt AI', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCwSozl89jl2zUDzQ4jGJD3g', title: 'Skill Leap AI', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHhYXsLBEVVnbvsq57n1MTQ', title: 'The AI Advantage', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKelCK4ZaO6HeEI1KQjqzWA', title: 'The AI Daily Brief', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbY9xX3_jW5c2fjlZVBI4cg', title: 'TheAIGRID', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9Ryt3XOGYBoAJVsBHNGDzA', title: 'Theoretically Media', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg', title: 'Two Minute Papers', priority: 'high' }
            ]],
            ['Technology', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCFqXmQ56-Gp1rIKa-GoAJvQ', title: 'Andy Stapleton', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ', title: 'Marques Brownlee', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMiJRAwDNSNzuYeN2uWa0pA', title: 'Mrwhosetheboss', priority: 'high' },
                { url: 'https://www.androidauthority.com/feed/', title: 'Android Authority', priority: 'medium' },
                { url: 'https://www.apple.com/newsroom/rss-feed.rss', title: 'Apple Newsroom', priority: 'medium' },
                { url: 'https://www.gsmarena.com/rss-news-reviews.php3', title: 'GSMArena', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz6PEeVLG1TL6jMRTvSLm4g', title: 'Matt Talks Tech', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7BhHN8NyMMru2RUygnDXSg', title: 'Sciencephile the AI', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8KWRrf8wqyowmWhXJ9DRjQ', title: 'Make', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9x0AN7BWHpCDHSm9NiJFJQ', title: 'NetworkChuck', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8LUzR34nNX8KH3Edd0un1g', title: 'Rowan Cheung', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6H07z6zAwbHRl4Lbl0GSsw', title: 'TechZone', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXZCJLdBC09xxGZ6gcdrc6A', title: 'OpenAI', priority: 'high' }
            ]],
            ['Cybersecurity', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRoXUiP5sBe5CZfh9yUv1lw', title: 'AI Dark Files', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCJ6q9Ie29ajGqKApbLqfBOg', title: 'Black Hat', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCP7WmQ_U4GB3K51Od9QvM0w', title: 'David Bombal', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsgzmECky2Q9lQMWzDwMhYw', title: 'HackerOne', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3s0BtrBJpwNDaflRSoiieQ', title: 'Hak5', priority: 'medium' },
                { url: 'https://spyboy.blog/category/networking/feed/', title: 'Spyboy Blog', priority: 'medium' }
            ]],
            ['Science', [
                { url: 'https://www.biopharmadive.com/feeds/news/', title: 'BioPharma Dive', priority: 'medium' },
                { url: 'https://forum.dangerousthings.com/latest.rss', title: 'Dangerous Things Forum', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpbppWVgOJcU0lf5rDYSSXw', title: 'HOLOLIFE Summit', priority: 'medium' },
                { url: 'https://www.labiotech.eu/feed/', title: 'Labiotech.eu', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLt4d8cACHzrVvAz9gtaARA', title: 'Neuralink', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8KWRrf8wqyowmWhXJ9DRjQ', title: 'The Medical Futurist', priority: 'medium' },
                { url: 'https://hackaday.com/tag/biohacking/feed/', title: 'biohacking – Hackaday', priority: 'medium' }
            ]],
            ['Business', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaAx1xeTgF3rs4rBPDq6-Kw', title: 'HubSpot', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCy5GY9WtEg8SMgAZ_AiSlVw', title: 'Zoho CRM', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCmNAkARqTFvNoyxmFhKTS9Q', title: 'Rick Mulready', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC0Rqs6pyPoGaMT5HFMFdslg', title: 'Synthesia', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCc1qMq2UBJD9cSKbeBwGoZQ', title: 'Tao Prompts', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCI4yaNEFssXnlrQRmBt2FMg', title: 'Agencys Ai', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKQvGU-qtjEthINeViNbn6A', title: 'Alex Becker', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCl2oCaw8hdR_kbqyqd2klIA', title: 'Lark Davis', priority: 'medium' }
            ]],
            ['Robotics', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVtWNlve83y5i8rm5HQw6sg', title: 'AI and Robotics', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7vVhkEfw4nOGp8TyDk7RcQ', title: 'Boston Dynamics', priority: 'high' },
                { url: 'https://www.therobotreport.com/feed/', title: 'The Robot Report', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsMbp4V8oxzHCMdOUP-3oWw', title: 'Unitree Robotics', priority: 'medium' }
            ]],
            ['Space', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCO9Vgn2ayVe67fE5tP6JQFA', title: 'ALPHA TECH', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRAu2aXcH-B5h9SREfyhXuA', title: 'GREAT SPACEX', priority: 'medium' }
            ]],
            ['Transportation', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCgCMYcDTo077fYXhDB27C_Q', title: 'Boat & Sail Magazine', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpifTlKKeTyZllzUBrWFtjA', title: 'Form Trends', priority: 'medium' },
                { url: 'https://feeds.feedburner.com/GlobalRailwayReview', title: 'Global Railway Review', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCgVYEv7-4Cug-1Gd4DjULfg', title: 'LatestCarsPro', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCJjAIBWeY022ZNj_Cp_6wAw', title: 'The Tesla Space', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC4AExSxU3TT8GxAYUeEZXVg', title: 'AI & CAR', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCCF6WAhvjydnXUHl85cDXpA', title: 'AmpedAuto', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsgzmECky2Q9lQMWzDwMhYw', title: 'A Boring Revolution', priority: 'medium' }
            ]],
            ['Marketing', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz94LN8mm0Nv_5g79qPryrg', title: 'AI Filmmaking Academy', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCTq6xMw_BHR5dgKQDs4qhsg', title: 'AI Space', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCdFRvwde9cmdVm_Q-ODZTZg', title: 'AIQUEST', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRf8sxSbq-TvtWJZq_V1q_w', title: 'Chorus by ZoomInfo', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNzm7D-tRMg3Dw7nNA2fQhw', title: 'Darcy\'s Business', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCV0FmNF3iM-022BF1KbVtxA', title: 'HeyGen', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCeFlDDx4rcssh2cO_yB4y-w', title: 'Jonathan\'s Hub Jam', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCnzxPyNnn8jk4bHFk3JUBhA', title: 'Jono Catliff', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxI3-49z98MUKF3wTVJ9nkg', title: 'Romayroh', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6z07Hh9Muy6urJgA0F0azg', title: 'Shinefy', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpOITtvjPXP53yRwDpliC2Q', title: 'Spencer Benterud', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCU6UHXn_S-FijQyy_mi8xcA', title: 'The AI Filmmaking Advantage', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCgzH02aZzAcX0bDvdzy928w', title: 'WesGPT', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCEvsxF4Z12vwpwDUaU02yiA', title: 'Zapier', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCSNF2YIUV3g-uZwuNSmA1Rw', title: 'metricsmule', priority: 'medium' }
            ]],
            ['Matrix', [
                { url: 'https://youtube.com/@axonenterprise', title: 'Axon', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCrM7B7SL_g1edFOnmj-SDKg', title: 'Bloomberg Technology', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKfak8fBm_Lhy4eX9UKxEpA', title: 'The Military Show', priority: 'medium' }
            ]],
            ['Matrix FUTURE', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UConJDkGk921yT9hISzFqpzw', title: 'Freethink', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9f78Z5hgtDt0n8JWyfBk8Q', title: 'Quartz', priority: 'medium' }
            ]],
            ['NEW TECH', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCveyvadzzSXdNYjynAm_APA', title: 'Military Trends', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8LUzR34nNX8KH3Edd0un1g', title: 'Rowan Cheung', priority: 'medium' },
                { url: 'https://youtube.com/@tech_news_now', title: 'Tech News', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6H07z6zAwbHRl4Lbl0GSsw', title: 'TechZone', priority: 'medium' }
            ]],
            ['Open AI', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXZCJLdBC09xxGZ6gcdrc6A', title: 'OpenAI', priority: 'high' },
                { url: 'https://openai.com/blog/rss.xml', title: 'OpenAI Blog', priority: 'high' },
                { url: 'https://blog.google/technology/ai/', title: 'Google AI Blog', priority: 'high' },
                { url: 'https://ai.meta.com/blog/rss/', title: 'Meta AI Blog', priority: 'high' },
                { url: 'https://www.nvidia.com/en-us/ai-data-science/rss/', title: 'NVIDIA AI', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsT0YIqwnpJCM-mx7-gSA4Q', title: 'Two Minute Papers', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbY9xX3_jW5c2fjlZVBI4cg', title: 'TheAIGRID', priority: 'high' }
            ]],
            ['Phones', [
                { url: 'https://www.androidauthority.com/feed/', title: 'Android Authority', priority: 'medium' },
                { url: 'https://www.apple.com/newsroom/rss-feed.rss', title: 'Apple Newsroom', priority: 'medium' },
                { url: 'https://www.gsmarena.com/rss-news-reviews.php3', title: 'GSMArena.com', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz6PEeVLG1TL6jMRTvSLm4g', title: 'Matt Talks Tech', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ', title: 'Marques Brownlee', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMiJRAwDNSNzuYeN2uWa0pA', title: 'Mrwhosetheboss', priority: 'high' }
            ]],
            ['Tech Reviews', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ', title: 'Marques Brownlee', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMiJRAwDNSNzuYeN2uWa0pA', title: 'Mrwhosetheboss', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz6PEeVLG1TL6jMRTvSLm4g', title: 'Matt Talks Tech', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7TizprGknbDalbHplROtag', title: 'Linus Tech Tips', priority: 'high' }
            ]],
            ['Trends', [
                { url: 'https://www.trendhunter.com/rss/category/Cool-Gadgets-and-Gifts', title: 'TrendHunter.com', priority: 'medium' }
            ]],
            ['Video Games', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMT1Aw4R4nf_sFNDeuJqc6w', title: 'AI Warehouse', priority: 'medium' },
                { url: 'https://www.artificial-intelligence.blog/ai-news/category/games?format=rss', title: 'Artificial Intelligence Blog Games', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC11y-idtc7Duc1VQGRKlzqw', title: 'Ludo AI Game Research', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCIcGc8tDHYZ3vY3NcS8JXaQ', title: 'b2studios', priority: 'medium' }
            ]],
            ['Crypto', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKQvGU-qtjEthINeViNbn6A', title: 'Alex Becker\'s Channel', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCl2oCaw8hdR_kbqyqd2klIA', title: 'Lark Davis', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqK_GSMbpiV8spgD3ZGloSw', title: 'Coin Bureau', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7TizprGknbDalbHplROtag', title: 'Altcoin Daily', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqK_GSMbpiV8spgD3ZGloSw', title: 'Benjamin Cowen', priority: 'medium' }
            ]],
            ['CRM Tools', [
                // High-quality CRM and business software feeds (verified working)
                { url: 'https://www.salesforce.com/blog/feed/', title: 'Salesforce Blog', priority: 'high' },
                { url: 'https://www.sugarcrm.com/blog/feed/', title: 'SugarCRM Blog', priority: 'medium' },
                // YouTube channels for CRM content
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaAx1xeTgF3rs4rBPDq6-Kw', title: 'HubSpot', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCy5GY9WtEg8SMgAZ_AiSlVw', title: 'Zoho CRM', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC0RJJJmOJsvVh6PLHjJCDow', title: 'Salesforce', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCI4yaNEFssXnlrQRmBt2FMg', title: 'Agencys Ai', priority: 'medium' }
            ]],
            ['Flipper', [
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCUoJk48pujh29p8zLsnD5PQ', title: 'Talking Sasquach', priority: 'medium' }
            ]],
            ['Bioengineering', [
                { url: 'https://www.biopharmadive.com/feeds/news/', title: 'BioPharma Dive', priority: 'medium' },
                { url: 'https://forum.dangerousthings.com/latest.rss', title: 'Dangerous Things Forum', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpbppWVgOJcU0lf5rDYSSXw', title: 'HOLOLIFE Summit', priority: 'medium' },
                { url: 'https://www.labiotech.eu/feed/', title: 'Labiotech.eu', priority: 'medium' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLt4d8cACHzrVvAz9gtaARA', title: 'Neuralink', priority: 'high' },
                { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8KWRrf8wqyowmWhXJ9DRjQ', title: 'The Medical Futurist', priority: 'medium' },
                { url: 'https://hackaday.com/tag/biohacking/feed/', title: 'biohacking – Hackaday', priority: 'medium' }
            ]]
        ]);
        
        // Core data structures
        this.articles = [];
        this.filteredArticles = [];
        this.currentCategory = 'All';
        this.searchQuery = '';
        this.isLoading = false;
        this.currentPage = 1;
        this.totalPages = 1;
        
        // Performance optimizations
        this.debounceTimer = null;
        this.renderQueue = [];
        this.isRendering = false;
        
        // Start background processes
        try {
            this.startBackgroundProcesses();
            console.log('✅ OptimizedFeedProcessor initialized successfully');
        } catch (error) {
            console.error('❌ Error during initialization:', error);
        }
    }
    
    // Performance optimization methods
    startBackgroundProcesses() {
        // Memory cleanup every 30 seconds
        setInterval(() => this.cleanupMemory(), this.cleanupInterval);
        
        // Feed health monitoring every 60 seconds
        setInterval(() => this.updateFeedHealth(), 60000);
        
        // Performance metrics update every 30 seconds
        setInterval(() => this.updatePerformanceMetrics(), 30000);
        
        // Retry failed feeds every 30 seconds
        setInterval(() => this.retryFailedFeeds(), 30000);
        
        // Stability check every 60 seconds
        setInterval(() => this.checkStability(), 60000);
        
        console.log('🔄 Background processes started');
    }
    
    checkStability() {
        console.log('🔍 Running stability check...');
        
        // Check article count stability
        if (this.articles.length > this.maxArticles * 1.2) {
            console.warn(`⚠️ Article count unstable: ${this.articles.length} (max: ${this.maxArticles})`);
            this.articles = this.articles.slice(0, this.maxArticles);
        }
        
        // Check failed feeds count
        if (this.failedFeeds.size > 50) {
            console.warn(`⚠️ Too many failed feeds: ${this.failedFeeds.size}`);
        }
        
        // Check category success rates
        this.checkCategorySuccessRates();
        
        // Log current status
        console.log(`📊 Current status: ${this.articles.length} articles, ${this.failedFeeds.size} failed feeds`);
    }
    
    cleanupMemory() {
        const now = Date.now();
        const maxAge = this.cacheTimeout;
        
        // Clean feed cache
        for (const [url, data] of this.feedCache.entries()) {
            if (now - data.timestamp > maxAge) {
                this.feedCache.delete(url);
            }
        }
        
        // Clean article cache
        if (this.articleCache.size > this.maxCachedArticles) {
            const entries = Array.from(this.articleCache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            const toDelete = entries.slice(0, Math.floor(entries.length * 0.2));
            toDelete.forEach(([key]) => this.articleCache.delete(key));
        }
        
        // Clean performance data
        if (this.performanceMetrics.totalRequests > 1000) {
            this.performanceMetrics.totalRequests = 0;
            this.performanceMetrics.successfulRequests = 0;
            this.performanceMetrics.failedRequests = 0;
        }
    }
    
    updateFeedHealth() {
        for (const [url, health] of this.feedHealth.entries()) {
            if (health.failures > 5) {
                this.failedFeeds.add(url);
            }
        }
    }
    
    updatePerformanceMetrics() {
        if (this.performanceMetrics.totalRequests > 0) {
            this.performanceMetrics.cacheHitRate = 
                (this.performanceMetrics.successfulRequests / this.performanceMetrics.totalRequests) * 100;
        }
    }
    
    // Ultra-fast proxy selection with intelligent caching
    selectBestProxy() {
        // Use cached top proxies for faster selection
        if (!this._cachedTopProxies || Date.now() - this._lastProxyCache > 30000) {
            // Sort proxies by speed and reliability (speed first for ultra-fast loading)
            const sortedProxies = [...this.proxies].sort((a, b) => {
                // Primary sort by response time (fastest first)
                if (Math.abs(a.responseTime - b.responseTime) > 100) {
                    return a.responseTime - b.responseTime;
                }
                // Secondary sort by reliability
                return b.reliability - a.reliability;
            });
            
            // Cache top 12 fastest proxies
            this._cachedTopProxies = sortedProxies.slice(0, 12);
            this._lastProxyCache = Date.now();
        }
        
        // Select from cached top proxies with speed-weighted randomization
        const topProxies = this._cachedTopProxies;
        const weights = topProxies.map((proxy, index) => Math.pow(0.9, index)); // Heavily weight towards fastest
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                console.log(`⚡ Ultra-fast proxy: ${topProxies[i].url} (${topProxies[i].responseTime}ms, ${topProxies[i].reliability.toFixed(2)} reliability)`);
                return topProxies[i];
            }
        }
        
        // Fallback to fastest proxy
        console.log(`⚡ Fallback to fastest: ${topProxies[0].url} (${topProxies[0].responseTime}ms)`);
        return topProxies[0];
    }

    async fetchWithProxyFallback(feed, maxRetries = 3) {
        const triedProxies = new Set();
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            // Get a proxy we haven't tried yet
            let proxy = null;
            for (const p of this.proxies) {
                if (!triedProxies.has(p.url)) {
                    proxy = p;
                    break;
                }
            }
            
            // If we've tried all proxies, reset and try again
            if (!proxy) {
                triedProxies.clear();
                proxy = this.selectBestProxy();
            }
            
            triedProxies.add(proxy.url);
            
            console.log(`🔄 Attempt ${attempt}/${maxRetries} using proxy: ${proxy.url}`);
            
            try {
                const result = await this.fetchWithSpecificProxy(feed, proxy);
                if (result) {
                    // Update proxy reliability on success
                    proxy.reliability = Math.min(1.0, proxy.reliability + 0.02);
                    return result;
                }
            } catch (error) {
                console.warn(`⚠️ Proxy ${proxy.url} failed: ${error.message}`);
                // Update proxy reliability on failure
                proxy.reliability = Math.max(0.1, proxy.reliability - 0.05);
            }
            
            // Small delay before next attempt
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 200 * attempt));
            }
        }
        
        console.error(`❌ All proxy attempts failed for ${feed.title}`);
        return null;
    }

    async fetchWithSpecificProxy(feed, proxy) {
        const url = `${proxy.url}${encodeURIComponent(feed.url)}`;
        const startTime = Date.now();
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal,
                mode: 'cors', // Ensure CORS mode for service worker compatibility
                priority: 'high' // Request high priority for faster processing
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type') || '';
            const text = await response.text();
            
            // Update proxy performance metrics with actual response time
            const responseTime = Date.now() - startTime;
            proxy.responseTime = Math.min(proxy.responseTime * 0.7 + responseTime * 0.3, 5000); // Weighted average with cap
            proxy.reliability = Math.min(1.0, proxy.reliability + 0.01); // Slight reliability boost on success
            
            return text;
            
        } catch (error) {
            clearTimeout(timeoutId);
            // Update proxy reliability on failure
            proxy.reliability = Math.max(0.1, proxy.reliability - 0.02);
            throw error;
        }
    }
    
    // Optimized feed fetching with intelligent caching
    async fetchFeedWithRetry(feed) {
        console.log(`🌐 Fetching feed: ${feed.title} (${feed.url})`);
        
        // Check cache first
        const cacheKey = `${feed.url}_${Date.now() - (Date.now() % this.cacheTimeout)}`;
        if (this.feedCache.has(cacheKey)) {
            console.log(`📦 Using cached data for: ${feed.title}`);
            return this.feedCache.get(cacheKey);
        }
        
        let content = null;
        
        // Handle YouTube URLs differently
        if (feed.url.includes('youtube.com') || feed.url.includes('youtu.be')) {
            console.log(`🎥 Processing YouTube feed: ${feed.title}`);
            content = await this.fetchYouTubeFeed(feed);
        } else {
            // Handle RSS/Atom feeds with proxy fallback
            console.log(`📡 Processing RSS/Atom feed: ${feed.title}`);
            content = await this.fetchWithProxyFallback(feed, 3);
        }
        
        if (content) {
            // Cache the result
            this.feedCache.set(cacheKey, content);
            console.log(`✅ Successfully fetched: ${feed.title}`);
            return content;
        }
        
        console.error(`❌ Failed to fetch content for ${feed.title}`);
        return null;
    }

    async fetchRSSAtomFeed(feed) {
        const proxy = this.selectBestProxy();
        const url = `${proxy.url}${encodeURIComponent(feed.url)}`;
        
        console.log(`🔗 Using proxy: ${proxy.url} for ${feed.title}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type') || '';
            const text = await response.text();
            
            // Update proxy performance metrics
            proxy.responseTime = (proxy.responseTime + 500) / 2; // Estimate response time
            
            // Try to parse as JSON first (RSS2JSON)
            if (contentType.includes('application/json') || text.trim().startsWith('{')) {
                try {
                    const jsonData = JSON.parse(text);
                    if (jsonData.status === 'ok' && jsonData.items) {
                        console.log(`📄 Detected RSS2JSON format for: ${feed.title}`);
                        return jsonData;
                    }
                } catch (jsonError) {
                    console.log(`📄 Not JSON format, trying XML for: ${feed.title}`);
                }
            }
            
            // Parse as XML (RSS/Atom)
            console.log(`📄 Detected XML format for: ${feed.title}`);
            return text;
            
        } catch (error) {
            clearTimeout(timeoutId);
            // Update proxy reliability on failure
            proxy.reliability = Math.max(0.1, proxy.reliability - 0.05);
            throw error;
        }
    }

    async fetchYouTubeFeed(feed) {
        try {
            // Extract channel ID from YouTube URL
            const channelIdMatch = feed.url.match(/channel_id=([^&]+)/);
            if (!channelIdMatch) {
                console.warn(`⚠️ Could not extract channel ID from: ${feed.url}`);
                return null;
            }
            
            const channelId = channelIdMatch[1];
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
            
            console.log(`🎥 Fetching YouTube RSS for channel: ${channelId}`);
            
            // Use proxy fallback for YouTube feeds too
            const content = await this.fetchWithProxyFallback({ ...feed, url: rssUrl }, 2);
            
            if (content) {
                console.log(`🎥 Successfully fetched YouTube Atom feed for: ${feed.title}`);
                return content;
            }
            
            return null;
            
        } catch (error) {
            console.error(`❌ Error fetching YouTube feed ${feed.title}:`, error);
            return null;
        }
    }
    
    // Optimized parsing with better error handling
    parseFeedContent(feedUrl, content, feedTitle) {
        console.log(`🔍 Parsing content for: ${feedTitle} (${feedUrl})`);
        
        try {
            // Try RSS2JSON first for better compatibility
            if (content && typeof content === 'object' && content.status === 'ok') {
                console.log(`📄 Using RSS2JSON parsing for: ${feedTitle}`);
                return this.parseRSS2JSON(content, feedTitle);
            }
            
            // Try XML parsing for RSS/Atom feeds
            if (content && typeof content === 'string') {
                console.log(`📄 Using XML parsing for: ${feedTitle}`);
                return this.parseXMLFeed(content, feedUrl, feedTitle);
            }
            
            console.warn(`⚠️ Unknown content format for: ${feedTitle}`);
            return [];
            
        } catch (error) {
            console.error(`❌ Error parsing feed ${feedTitle}:`, error);
            return [];
        }
    }

    parseXMLFeed(xmlContent, feedUrl, feedTitle) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                console.warn(`⚠️ XML parsing error for ${feedTitle}:`, parserError.textContent);
                return [];
            }
            
            // Determine feed type and parse accordingly
            const rootElement = xmlDoc.documentElement;
            const rootTagName = rootElement.tagName.toLowerCase();
            
            console.log(`📄 Detected feed type: ${rootTagName} for ${feedTitle}`);
            
            if (rootTagName === 'rss' || rootTagName === 'rdf') {
                return this.parseRSSFeed(xmlDoc, feedUrl, feedTitle);
            } else if (rootTagName === 'feed') {
                return this.parseAtomFeed(xmlDoc, feedUrl, feedTitle);
            } else {
                console.warn(`⚠️ Unknown XML feed type: ${rootTagName} for ${feedTitle}`);
                return [];
            }
            
        } catch (error) {
            console.error(`❌ Error parsing XML feed ${feedTitle}:`, error);
            return [];
        }
    }

    parseRSSFeed(xmlDoc, feedUrl, feedTitle) {
        const articles = [];
        const items = xmlDoc.querySelectorAll('item');
        
        console.log(`📄 Found ${items.length} RSS items in ${feedTitle}`);
        
        items.forEach((item, index) => {
            try {
                const title = item.querySelector('title')?.textContent?.trim();
                const link = item.querySelector('link')?.textContent?.trim();
                const description = item.querySelector('description')?.textContent?.trim() || 
                                  item.querySelector('content\\:encoded')?.textContent?.trim() ||
                                  item.querySelector('content')?.textContent?.trim();
                const pubDate = item.querySelector('pubDate')?.textContent?.trim();
                const author = item.querySelector('author')?.textContent?.trim() ||
                             item.querySelector('dc\\:creator')?.textContent?.trim();
                
                // Skip items without essential data
                if (!title || !link) {
                    console.log(`⚠️ Skipping RSS item ${index} in ${feedTitle} - missing title or link`);
                    return;
                }
                
                // Extract image from various RSS fields
                const mediaContent = item.querySelector('media\\:content')?.getAttribute('url') ||
                                   item.querySelector('media\\:thumbnail')?.getAttribute('url') ||
                                   item.querySelector('enclosure[type^="image"]')?.getAttribute('url') ||
                                   item.querySelector('image')?.getAttribute('url');
                
                const extractedImageUrl = mediaContent || this.extractImageUrl(description || '');
                const category = this.getCategoryFromUrl(feedUrl);
                
                const article = {
                    title: this.cleanText(title),
                    link: this.cleanUrl(link),
                    description: this.cleanText(description || ''),
                    pubDate: pubDate || new Date().toISOString(),
                    author: this.cleanText(author || ''),
                    source: feedTitle,
                    category: category,
                    imageUrl: extractedImageUrl || null,
                    videoUrl: this.extractVideoUrl(description || ''),
                    preview: this.generatePreview(description || '')
                };
                
                articles.push(article);
                
            } catch (error) {
                console.error(`❌ Error parsing RSS item ${index} in ${feedTitle}:`, error);
            }
        });
        
        console.log(`✅ Successfully parsed ${articles.length} RSS articles from ${feedTitle}`);
        return articles;
    }

    parseAtomFeed(xmlDoc, feedUrl, feedTitle) {
        const articles = [];
        const entries = xmlDoc.querySelectorAll('entry');
        
        console.log(`📄 Found ${entries.length} Atom entries in ${feedTitle}`);
        
        entries.forEach((entry, index) => {
            try {
                const title = entry.querySelector('title')?.textContent?.trim();
                const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href')?.trim() ||
                           entry.querySelector('link')?.getAttribute('href')?.trim();
                const content = entry.querySelector('content')?.textContent?.trim() ||
                              entry.querySelector('summary')?.textContent?.trim();
                const published = entry.querySelector('published')?.textContent?.trim() ||
                                entry.querySelector('updated')?.textContent?.trim();
                const author = entry.querySelector('author name')?.textContent?.trim();
                
                // Skip entries without essential data
                if (!title || !link) {
                    console.log(`⚠️ Skipping Atom entry ${index} in ${feedTitle} - missing title or link`);
                    return;
                }
                
                // Extract image from various Atom fields
                const mediaContent = entry.querySelector('media\\:content')?.getAttribute('url') ||
                                   entry.querySelector('media\\:thumbnail')?.getAttribute('url') ||
                                   entry.querySelector('link[rel="enclosure"][type^="image"]')?.getAttribute('href');
                
                const extractedImageUrl = mediaContent || this.extractImageUrl(content || '');
                const category = this.getCategoryFromUrl(feedUrl);
                
                const article = {
                    title: this.cleanText(title),
                    link: this.cleanUrl(link),
                    description: this.cleanText(content || ''),
                    pubDate: published || new Date().toISOString(),
                    author: this.cleanText(author || ''),
                    source: feedTitle,
                    category: category,
                    imageUrl: extractedImageUrl || null,
                    videoUrl: this.extractVideoUrl(content || ''),
                    preview: this.generatePreview(content || '')
                };
                
                articles.push(article);
                
            } catch (error) {
                console.error(`❌ Error parsing Atom entry ${index} in ${feedTitle}:`, error);
            }
        });
        
        console.log(`✅ Successfully parsed ${articles.length} Atom articles from ${feedTitle}`);
        return articles;
    }

    parseRSS2JSON(jsonData, feedTitle) {
        const articles = [];
        
        if (!jsonData.items || !Array.isArray(jsonData.items)) {
            console.warn(`⚠️ No items found in RSS2JSON data for ${feedTitle}`);
            return articles;
        }
        
        console.log(`📄 Found ${jsonData.items.length} RSS2JSON items in ${feedTitle}`);
        
        jsonData.items.forEach((item, index) => {
            try {
                // Skip items without essential data
                if (!item.title || !item.link) {
                    console.log(`⚠️ Skipping RSS2JSON item ${index} in ${feedTitle} - missing title or link`);
                    return;
                }
                
                const extractedImageUrl = item.thumbnail || item.image || this.extractImageUrl(item.description || '');
                const category = this.getCategoryFromUrl(jsonData.feed?.link || '');
                
                const article = {
                    title: this.cleanText(item.title),
                    link: this.cleanUrl(item.link),
                    description: this.cleanText(item.description || item.content || ''),
                    pubDate: item.pubDate || item.published || new Date().toISOString(),
                    author: this.cleanText(item.author || ''),
                    source: feedTitle,
                    category: category,
                    imageUrl: extractedImageUrl || null,
                    videoUrl: this.extractVideoUrl(item.description || ''),
                    preview: this.generatePreview(item.description || item.content || '')
                };
                
                articles.push(article);
                
            } catch (error) {
                console.error(`❌ Error parsing RSS2JSON item ${index} in ${feedTitle}:`, error);
            }
        });
        
        console.log(`✅ Successfully parsed ${articles.length} RSS2JSON articles from ${feedTitle}`);
        return articles;
    }

    cleanText(text) {
        if (!text) return '';
        return text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .trim();
    }

    cleanUrl(url) {
        if (!url) return '';
        return url.trim();
    }

    getCategoryFromUrl(feedUrl) {
        // Find the category for this feed URL
        for (const [category, feeds] of this.feeds) {
            const found = feeds.find(feed => feed.url === feedUrl);
            if (found) return category;
        }
        return 'General';
    }
    
    extractImageUrl(description) {
        if (!description) return null;
        
        // 1. Try to extract image from various img tag formats (enhanced patterns)
        const imgPatterns = [
            /<img[^>]+src="([^"]+)"/i,
            /<img[^>]+src='([^']+)'/i,
            /<img[^>]+src=([^>\s]+)/i,
            /<img[^>]+data-src="([^"]+)"/i,
            /<img[^>]+data-lazy-src="([^"]+)"/i,
            /<img[^>]+data-original="([^"]+)"/i,
            /<img[^>]+data-srcset="([^"]+)"/i,
            /<img[^>]+srcset="([^"]+)"/i
        ];
        
        for (const pattern of imgPatterns) {
            const match = description.match(pattern);
            if (match && match[1]) {
                const imageUrl = match[1].replace(/['"]/g, '');
                // Handle srcset (take first URL)
                const cleanUrl = imageUrl.split(' ')[0];
                if (this.isValidImageUrl(cleanUrl)) {
                    console.log(`🖼️ Found image in description: ${cleanUrl}`);
                    return cleanUrl;
                }
            }
        }
        
        // 2. Extract YouTube thumbnail from video URL (enhanced)
        const youtubePatterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#\s]+)/i,
            /youtube\.com\/v\/([^&\n?#\s]+)/i,
            /youtube\.com\/shorts\/([^&\n?#\s]+)/i
        ];
        
        for (const pattern of youtubePatterns) {
            const match = description.match(pattern);
            if (match && match[1]) {
                const videoId = match[1];
                // Try different YouTube thumbnail qualities
                const thumbnailUrls = [
                    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
                ];
                console.log(`🎥 Found YouTube video, generating thumbnail: ${thumbnailUrls[0]}`);
                return thumbnailUrls[0];
            }
        }
        
        // 3. Extract Vimeo thumbnail (enhanced)
        const vimeoMatch = description.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
        if (vimeoMatch) {
            const videoId = vimeoMatch[1];
            const thumbnail = `https://vumbnail.com/${videoId}.jpg`;
            console.log(`🎬 Found Vimeo video, generating thumbnail: ${thumbnail}`);
            return thumbnail;
        }
        
        // 4. Look for og:image meta tags (enhanced)
        const ogImagePatterns = [
            /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
            /<meta[^>]+property="og:image"[^>]+content='([^']+)'/i,
            /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i
        ];
        
        for (const pattern of ogImagePatterns) {
            const match = description.match(pattern);
            if (match && this.isValidImageUrl(match[1])) {
                console.log(`📸 Found og:image: ${match[1]}`);
                return match[1];
            }
        }
        
        // 5. Look for twitter:image meta tags (enhanced)
        const twitterImagePatterns = [
            /<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i,
            /<meta[^>]+name="twitter:image"[^>]+content='([^']+)'/i,
            /<meta[^>]+content="([^"]+)"[^>]+name="twitter:image"/i
        ];
        
        for (const pattern of twitterImagePatterns) {
            const match = description.match(pattern);
            if (match && this.isValidImageUrl(match[1])) {
                console.log(`🐦 Found twitter:image: ${match[1]}`);
                return match[1];
            }
        }
        
        // 6. Look for other common image meta tags (enhanced)
        const imageMetaPatterns = [
            /<meta[^>]+name="image"[^>]+content="([^"]+)"/i,
            /<meta[^>]+property="image"[^>]+content="([^"]+)"/i,
            /<meta[^>]+name="thumbnail"[^>]+content="([^"]+)"/i,
            /<meta[^>]+name="photo"[^>]+content="([^"]+)"/i,
            /<meta[^>]+name="picture"[^>]+content="([^"]+)"/i,
            /<meta[^>]+name="media"[^>]+content="([^"]+)"/i
        ];
        
        for (const pattern of imageMetaPatterns) {
            const match = description.match(pattern);
            if (match && this.isValidImageUrl(match[1])) {
                console.log(`📸 Found image meta tag: ${match[1]}`);
                return match[1];
            }
        }
        
        // 7. Look for background images in CSS (enhanced)
        const bgImagePatterns = [
            /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/i,
            /background:\s*url\(['"]?([^'")\s]+)['"]?\)/i,
            /background:\s*[^;]*url\(['"]?([^'")\s]+)['"]?\)/i
        ];
        
        for (const pattern of bgImagePatterns) {
            const match = description.match(pattern);
            if (match && this.isValidImageUrl(match[1])) {
                console.log(`🎨 Found background image: ${match[1]}`);
                return match[1];
            }
        }
        
        // 8. Look for figure elements with img (enhanced)
        const figurePatterns = [
            /<figure[^>]*>.*?<img[^>]+src="([^"]+)"/is,
            /<figure[^>]*>.*?<img[^>]+src='([^']+)'/is,
            /<figcaption[^>]*>.*?<img[^>]+src="([^"]+)"/is
        ];
        
        for (const pattern of figurePatterns) {
            const match = description.match(pattern);
            if (match && this.isValidImageUrl(match[1])) {
                console.log(`🖼️ Found figure image: ${match[1]}`);
                return match[1];
            }
        }
        
        // 9. Look for picture elements (enhanced)
        const picturePatterns = [
            /<picture[^>]*>.*?<img[^>]+src="([^"]+)"/is,
            /<picture[^>]*>.*?<source[^>]+srcset="([^"]+)"/is,
            /<picture[^>]*>.*?<source[^>]+src="([^"]+)"/is
        ];
        
        for (const pattern of picturePatterns) {
            const match = description.match(pattern);
            if (match && this.isValidImageUrl(match[1])) {
                console.log(`🖼️ Found picture image: ${match[1]}`);
                return match[1];
            }
        }
        
        // 10. Look for JSON-LD structured data
        const jsonLdMatch = description.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/is);
        if (jsonLdMatch) {
            try {
                const jsonData = JSON.parse(jsonLdMatch[1]);
                if (jsonData.image) {
                    const imageUrl = typeof jsonData.image === 'string' ? jsonData.image : jsonData.image.url;
                    if (this.isValidImageUrl(imageUrl)) {
                        console.log(`📄 Found JSON-LD image: ${imageUrl}`);
                        return imageUrl;
                    }
                }
            } catch (e) {
                // Ignore JSON parsing errors
            }
        }
        
        // 11. Look for common image hosting patterns
        const imageHostingPatterns = [
            /https?:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp)(?:\?[^"\s]*)?/gi,
            /https?:\/\/[^"\s]*\.(?:cloudinary|imgur|flickr|unsplash|pexels|pixabay)\.[^"\s]+/gi
        ];
        
        for (const pattern of imageHostingPatterns) {
            const matches = description.match(pattern);
            if (matches && matches.length > 0) {
                for (const match of matches) {
                    if (this.isValidImageUrl(match)) {
                        console.log(`🌐 Found image hosting URL: ${match}`);
                        return match;
                    }
                }
            }
        }
        
        console.log(`❌ No image found in description`);
        return null;
    }
    
    isValidImageUrl(url) {
        if (!url) return false;
        
        // Clean the URL
        const cleanUrl = url.replace(/['"]/g, '').trim();
        
        // Check if it's a valid image URL
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico'];
        const hasImageExtension = imageExtensions.some(ext => 
            cleanUrl.toLowerCase().includes(ext)
        );
        
        // Check if it's a valid URL
        const isValidUrl = cleanUrl.startsWith('http://') || 
                          cleanUrl.startsWith('https://') || 
                          cleanUrl.startsWith('//');
        
        // Check for common image hosting domains and CDNs
        const imageDomains = [
            'img.youtube.com', 'vumbnail.com', 'i.ytimg.com', 'ytimg.com',
            'cdn', 'images', 'img', 'static', 'media', 'assets', 'uploads',
            'cloudinary', 'imgur', 'flickr', 'unsplash', 'pexels', 'pixabay',
            'amazonaws', 'cloudfront', 'fastly', 'bunny', 'imgix', 'cloudflare',
            'via.placeholder', 'placehold', 'dummyimage', 'picsum', 'loremflickr'
        ];
        const hasImageDomain = imageDomains.some(domain => 
            cleanUrl.toLowerCase().includes(domain)
        );
        
        // Check for common image URL patterns
        const imagePatterns = [
            /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico)(\?|$)/i,
            /\/(image|img|photo|pic|thumb|thumbnail)\//i,
            /\/wp-content\/uploads\//i,
            /\/media\//i,
            /\/assets\//i,
            /\/images\//i
        ];
        const hasImagePattern = imagePatterns.some(pattern => 
            pattern.test(cleanUrl)
        );
        
        // Additional validation for data URLs
        if (cleanUrl.startsWith('data:image/')) {
            return true;
        }
        
        return (hasImageExtension || hasImageDomain || hasImagePattern) && isValidUrl;
    }
    
    extractVideoUrl(description) {
        // Extract YouTube video URLs
        const youtubeMatch = description.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#\s]+)/i);
        if (youtubeMatch) {
            const videoUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
            console.log(`🎥 Found YouTube video: ${videoUrl}`);
            return videoUrl;
        }
        
        // Extract Vimeo URLs
        const vimeoMatch = description.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
        if (vimeoMatch) {
            const videoUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
            console.log(`🎬 Found Vimeo video: ${videoUrl}`);
            return videoUrl;
        }
        
        // Extract generic video embeds
        const iframeMatch = description.match(/<iframe[^>]*src="([^"]+)"[^>]*>/i);
        if (iframeMatch) {
            console.log(`🎬 Found iframe video: ${iframeMatch[1]}`);
            return iframeMatch[1];
        }
        
        // Extract video tags
        const videoMatch = description.match(/<video[^>]*src="([^"]+)"[^>]*>/i);
        if (videoMatch) {
            console.log(`🎬 Found video tag: ${videoMatch[1]}`);
            return videoMatch[1];
        }
        
        console.log(`❌ No video found in description`);
        return null;
    }
    
    generatePreview(text) {
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText;
    }
    

    
    async validateImageUrl(imageUrl) {
        if (!imageUrl) return false;
        
        // Ultra-fast validation for common image patterns
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.avif'];
        const imageHosts = ['img.youtube.com', 'i.ytimg.com', 'cdn', 'images', 'img', 'static'];
        
        const hasValidExtension = imageExtensions.some(ext => 
            imageUrl.toLowerCase().includes(ext)
        );
        
        const hasValidHost = imageHosts.some(host => 
            imageUrl.toLowerCase().includes(host)
        );
        
        // If it has a valid extension or host, assume it's valid (ultra-fast)
        if (hasValidExtension || hasValidHost) {
            return true;
        }
        
        // For URLs without clear patterns, do a quick validation
        try {
            const img = new Image();
            return new Promise((resolve) => {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = imageUrl;
                
                // Ultra-fast timeout for maximum speed
                setTimeout(() => resolve(false), 1000);
            });
        } catch (error) {
            return false;
        }
    }
    
    // Optimized article processing with stability controls
    async processArticles(newArticles) {
        if (!newArticles || newArticles.length === 0) {
            console.log('⚠️ No new articles to process');
            return;
        }
        
        console.log(`📝 Processing ${newArticles.length} new articles...`);
        
        // Prevent duplicate processing
        const existingLinks = new Set(this.articles.map(a => a.link));
        const uniqueArticles = newArticles.filter(article => !existingLinks.has(article.link));
        
        console.log(`📝 Found ${uniqueArticles.length} unique articles out of ${newArticles.length} total`);
        
        if (uniqueArticles.length === 0) {
            console.log('⚠️ All articles are duplicates');
            return;
        }
        
        // Add new articles to the beginning with stability limits
        this.articles.unshift(...uniqueArticles);
        
        // Maintain strict memory limits to prevent count issues
        if (this.articles.length > this.maxArticles) {
            const oldLength = this.articles.length;
            this.articles = this.articles.slice(0, this.maxArticles);
            console.log(`🧹 Cleaned up articles: ${oldLength} → ${this.articles.length} (max: ${this.maxArticles})`);
        }
        
        // Ensure we don't exceed reasonable limits
        if (this.articles.length > 15000) {
            console.warn(`⚠️ Article count too high (${this.articles.length}), forcing cleanup`);
            this.articles = this.articles.slice(0, 10000);
        }
        
        console.log(`✅ Total articles in system: ${this.articles.length}`);
        
        // Update filtered articles
        this.updateFilteredArticles();
        
        // Only trigger UI update if we have new articles
        if (uniqueArticles.length > 0) {
            this.triggerUIUpdate();
        }
    }
    
    updateFilteredArticles() {
        // Apply category filter
        if (this.currentCategory && this.currentCategory !== 'All') {
            this.filteredArticles = this.articles.filter(article => article.category === this.currentCategory);
        } else {
            this.filteredArticles = [...this.articles];
        }
        
        // Apply search filter
        if (this.searchQuery) {
            const searchLower = this.searchQuery.toLowerCase();
            this.filteredArticles = this.filteredArticles.filter(article => 
                article.title.toLowerCase().includes(searchLower) ||
                article.description.toLowerCase().includes(searchLower) ||
                article.source.toLowerCase().includes(searchLower)
            );
        }
        
        // Sort by date (newest first)
        this.filteredArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // Ensure we don't exceed limits
        if (this.filteredArticles.length > this.maxArticles) {
            this.filteredArticles = this.filteredArticles.slice(0, this.maxArticles);
        }
        
        // Update pagination
        this.totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
        
        console.log(`📊 Filtered articles: ${this.filteredArticles.length} (total: ${this.articles.length})`);
    }

    // Group articles by date for better organization
    groupArticlesByDate() {
        const groupedArticles = [];
        const dateGroups = new Map();
        
        this.filteredArticles.forEach(article => {
            const pubDate = new Date(article.pubDate);
            const dateKey = this.getDateGroupKey(pubDate);
            
            if (!dateGroups.has(dateKey)) {
                dateGroups.set(dateKey, {
                    dateKey: dateKey,
                    displayDate: this.getDateDisplayText(pubDate),
                    articles: []
                });
            }
            
            dateGroups.get(dateKey).articles.push(article);
        });
        
        // Convert to array and sort by date (newest first)
        const sortedGroups = Array.from(dateGroups.values()).sort((a, b) => {
            const dateA = new Date(a.articles[0].pubDate);
            const dateB = new Date(b.articles[0].pubDate);
            return dateB - dateA;
        });
        
        // Flatten articles with date group markers
        sortedGroups.forEach(group => {
            // Add date group header
            groupedArticles.push({
                type: 'date-header',
                dateKey: group.dateKey,
                displayDate: group.displayDate,
                articleCount: group.articles.length
            });
            
            // Add articles for this date
            group.articles.forEach(article => {
                groupedArticles.push({
                    ...article,
                    type: 'article',
                    dateGroup: group.dateKey
                });
            });
        });
        
        this.filteredArticles = groupedArticles;
    }

    // Get date group key for grouping articles
    getDateGroupKey(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dateStr = date.toDateString();
        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();
        
        if (dateStr === todayStr) return 'today';
        if (dateStr === yesterdayStr) return 'yesterday';
        
        // For older dates, group by week
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return `week-${weekStart.toISOString().split('T')[0]}`;
    }

    // Get display text for date groups
    getDateDisplayText(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dateStr = date.toDateString();
        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();
        
        if (dateStr === todayStr) return 'Today';
        if (dateStr === yesterdayStr) return 'Yesterday';
        
        // For older dates, show week range
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
    // Optimized feed loading with better error handling
    async loadAllFeeds() {
        if (this.isLoading) {
            console.log('⏳ Feed loading already in progress...');
            return;
        }
        
        this.isLoading = true;
        console.log('🚀 Starting optimized feed loading...');
        
        const startTime = Date.now();
        const allFeeds = [];
        
        // Collect all feeds from all categories
        for (const [category, feeds] of this.feeds) {
            feeds.forEach(feed => {
                allFeeds.push({ ...feed, category });
            });
        }
        
        console.log(`📡 Total feeds to process: ${allFeeds.length}`);
        
        // Sort by priority (high priority first)
        allFeeds.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (a.priority !== 'high' && b.priority === 'high') return 1;
            return 0;
        });
        
        // Store initial article count
        const initialArticleCount = this.articles.length;
        
        // Process feeds in smaller batches with better error handling
        const batches = this.chunkArray(allFeeds, this.batchSize);
        let processedCount = 0;
        let successCount = 0;
        let errorCount = 0;
        
        for (const batch of batches) {
            const batchPromises = batch.map(async (feed) => {
                try {
                    await this.processSingleFeed(feed);
                    successCount++;
                } catch (error) {
                    errorCount++;
                    console.warn(`⚠️ Failed to process feed ${feed.title}:`, error.message);
                    // Don't let individual feed failures stop the entire process
                }
            });
            
            try {
                await Promise.allSettled(batchPromises);
                processedCount += batch.length;
                
                // Update progress
                const progress = Math.round((processedCount / allFeeds.length) * 100);
                console.log(`📊 Progress: ${progress}% (${processedCount}/${allFeeds.length} feeds, ${successCount} success, ${errorCount} errors)`);
                
                // Longer delay between batches to be respectful to servers
                if (batches.indexOf(batch) < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
            } catch (error) {
                console.error('❌ Batch processing error:', error);
                errorCount += batch.length;
            }
        }
        
        // Update filtered articles
        this.updateFilteredArticles();
        
        // Only render if we have new articles or this is the first load
        const newArticleCount = this.articles.length - initialArticleCount;
        if (newArticleCount > 0 || initialArticleCount === 0) {
            console.log(`📰 Found ${newArticleCount} new articles, updating display...`);
            this.renderCurrentPage();
        } else {
            console.log(`📰 No new articles found, preserving existing display`);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`✅ Feed loading completed in ${duration}ms`);
        console.log(`📊 Total articles loaded: ${this.articles.length} (${newArticleCount} new, ${successCount} success, ${errorCount} errors)`);
        
        // Show user-friendly status
        this.showFeedStatus(successCount, errorCount, allFeeds.length);
        
        // Update performance metrics
        this.performanceMetrics.lastLoadTime = duration;
        this.performanceMetrics.totalLoads++;
        
        this.isLoading = false;
    }
    
    showFeedStatus(success, errors, total) {
        const statusContainer = document.getElementById('feed-status-container');
        if (statusContainer) {
            const successEl = document.getElementById('success-count');
            const failedEl = document.getElementById('failed-count');
            
            if (successEl) successEl.textContent = success;
            if (failedEl) failedEl.textContent = errors;
            
            // Show status for a few seconds then hide
            statusContainer.style.display = 'block';
            setTimeout(() => {
                statusContainer.style.display = 'none';
            }, 5000);
        }
    }
    
    showErrorMessage(message) {
        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 2rem;
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid rgba(255, 0, 0, 0.3);
                border-radius: 8px;
                color: #ff6b6b;
            `;
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3>Connection Issue</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: var(--accent-primary);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 1rem;
                ">Retry</button>
            `;
            newsGrid.appendChild(errorDiv);
        }
    }
    
    async processSingleFeed(feed) {
        try {
            console.log(`🔄 Processing feed: ${feed.title}`);
            
            const content = await this.fetchFeedWithRetry(feed);
            if (content) {
                const articles = this.parseFeedContent(feed.url, content, feed.title);
                if (articles.length > 0) {
                    await this.processArticles(articles);
                    console.log(`✅ Processed ${articles.length} articles from ${feed.title}`);
                    
                    // Update category success
                    this.updateCategorySuccess(feed.category, true);
                    
                    // Remove from failed feeds if it was there
                    this.failedFeeds.delete(feed.url);
                } else {
                    console.log(`⚠️ No articles found in ${feed.title}`);
                    this.trackFailedFeed(feed);
                }
            } else {
                console.warn(`⚠️ Failed to fetch content for ${feed.title}`);
                this.trackFailedFeed(feed, new Error('No content returned'));
            }
        } catch (error) {
            console.error(`❌ Error processing feed ${feed.title}:`, error);
            this.trackFailedFeed(feed, error);
        }
    }
    
    trackFailedFeed(feed, error = null) {
        const existingData = this.failedFeeds.get(feed.url);
        const retryData = {
            title: feed.title,
            category: feed.category,
            retryCount: existingData ? existingData.retryCount + 1 : 1,
            lastRetry: Date.now(),
            lastError: new Date().toISOString(),
            errorMessage: error ? error.message : 'Unknown error',
            url: feed.url
        };
        
        this.failedFeeds.set(feed.url, retryData);
        this.updateCategorySuccess(feed.category, false);
        
        console.error(`📝 Tracked failed feed: ${feed.title} (retry count: ${retryData.retryCount})`, {
            url: feed.url,
            error: retryData.errorMessage,
            timestamp: retryData.lastError
        });
    }
    
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    
    // Optimized UI updates with debouncing
    triggerUIUpdate() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
            this.renderCurrentPage();
        }, 100);
    }
    
    renderCurrentPage() {
        if (this.isRendering) return;
        
        this.isRendering = true;
        requestAnimationFrame(() => {
            try {
                console.log(`🎨 Rendering current page...`);
                
                const startIndex = (this.currentPage - 1) * this.itemsPerPage;
                const endIndex = startIndex + this.itemsPerPage;
                const pageArticles = this.filteredArticles.slice(startIndex, endIndex);
                
                console.log(`📄 Rendering ${pageArticles.length} articles (page ${this.currentPage}/${this.totalPages})`);
                
                if (typeof window.renderArticles === 'function') {
                    window.renderArticles(pageArticles);
                }
                
                if (typeof window.updatePagination === 'function') {
                    window.updatePagination();
                }
                
                if (typeof window.updateArticleCount === 'function') {
                    window.updateArticleCount();
                }
                
                // Hide loading spinner if we have articles
                if (this.articles.length > 0) {
                    const loadingSection = document.querySelector('.loading-section');
                    if (loadingSection) {
                        loadingSection.style.display = 'none';
                    }
                }
                
            } finally {
                this.isRendering = false;
            }
        });
    }
    
    // Public API methods
    getTotalFeedCount() {
        let total = 0;
        for (const categoryFeeds of this.feeds.values()) {
            total += categoryFeeds.length;
        }
        return total;
    }
    
    getCategoryCount() {
        return this.feeds.size;
    }
    
    getCategoryNames() {
        return Array.from(this.feeds.keys());
    }
    
    setCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.updateFilteredArticles();
        this.renderCurrentPage();
    }
    
    setPage(page) {
        this.currentPage = Math.max(1, Math.min(page, this.totalPages));
        this.renderCurrentPage();
    }
    
    searchArticles(query) {
        this.searchQuery = query;
        this.currentPage = 1;
        this.updateFilteredArticles();
        this.renderCurrentPage();
    }
    
    getCurrentPageArticles() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredArticles.slice(startIndex, endIndex);
    }
    
    // Start continuous refresh with static updates
    startContinuousRefresh() {
        setInterval(() => {
            if (!this.isLoading) {
                // Only refresh if we haven't loaded recently - Ultra-fast timing
                const timeSinceLastLoad = Date.now() - (this.performanceMetrics.lastLoadTime || 0);
                if (timeSinceLastLoad > 10000) { // Reduced to 10 seconds for ultra-fresh content
                    console.log('⚡ Starting ultra-fast background refresh...');
                    this.loadAllFeeds();
                } else {
                    console.log(`⏰ Skipping refresh (last load was ${Math.round(timeSinceLastLoad/1000)}s ago)`);
                }
            }
        }, this.refreshIntervalSeconds * 1000);
    }
    
    // Get performance stats
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.feedCache.size,
            articleCount: this.articles.length,
            failedFeedsCount: this.failedFeeds.size,
            memoryUsage: this.articles.length + this.feedCache.size
        };
    }
    
    // Cache management for offline functionality
    async clearAllCaches() {
        try {
            // Clear internal caches
            this.feedCache.clear();
            this.articleCache.clear();
            this.lastFetchTime.clear();
            this.failedFeeds.clear();
            
            // Clear service worker caches if available
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
                console.log('🗑️ All caches cleared successfully');
            }
            
            // Force cleanup
            this.forceCleanup();
            
            return true;
        } catch (error) {
            console.error('❌ Error clearing caches:', error);
            return false;
        }
    }
    
    // Check if app is running offline
    isOffline() {
        return !navigator.onLine;
    }
    
    // Get cache status
    async getCacheStatus() {
        if (!('caches' in window)) {
            return { available: false, message: 'Cache API not supported' };
        }
        
        try {
            const cacheNames = await caches.keys();
            const cacheStatus = {};
            
            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                cacheStatus[cacheName] = keys.length;
            }
            
            return {
                available: true,
                caches: cacheStatus,
                totalItems: Object.values(cacheStatus).reduce((sum, count) => sum + count, 0)
            };
        } catch (error) {
            return { available: false, message: error.message };
        }
    }

    // Enhanced retry system for failed feeds
    async retryFailedFeeds() {
        if (this.failedFeeds.size === 0) {
            console.log('✅ No failed feeds to retry');
            return;
        }
        
        console.log(`🔄 Retrying ${this.failedFeeds.size} failed feeds...`);
        
        const failedFeedsList = Array.from(this.failedFeeds.entries());
        
        for (const [feedUrl, retryData] of failedFeedsList) {
            if (retryData.retryCount >= this.maxRetries) {
                console.log(`❌ Feed ${retryData.title} exceeded max retries (${this.maxRetries})`);
                continue;
            }
            
            // Check if enough time has passed since last retry
            const timeSinceLastRetry = Date.now() - retryData.lastRetry;
            if (timeSinceLastRetry < this.retryDelay) {
                continue;
            }
            
            console.log(`🔄 Retrying feed: ${retryData.title} (attempt ${retryData.retryCount + 1}/${this.maxRetries})`);
            
            try {
                const feed = { url: feedUrl, title: retryData.title, category: retryData.category };
                const content = await this.fetchFeedWithRetry(feed);
                
                if (content) {
                    const articles = this.parseFeedContent(feedUrl, content, retryData.title);
                    if (articles.length > 0) {
                        await this.processArticles(articles);
                        console.log(`✅ Successfully retried feed: ${retryData.title}`);
                        
                        // Remove from failed feeds
                        this.failedFeeds.delete(feedUrl);
                        
                        // Update category success
                        this.updateCategorySuccess(retryData.category, true);
                    } else {
                        this.updateRetryData(feedUrl, retryData);
                    }
                } else {
                    this.updateRetryData(feedUrl, retryData);
                }
                
            } catch (error) {
                console.error(`❌ Retry failed for ${retryData.title}:`, error.message);
                this.updateRetryData(feedUrl, retryData);
            }
            
            // Small delay between retries
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Check category success rates
        this.checkCategorySuccessRates();
    }
    
    updateRetryData(feedUrl, retryData) {
        retryData.retryCount++;
        retryData.lastRetry = Date.now();
        this.failedFeeds.set(feedUrl, retryData);
        
        // Update category success
        this.updateCategorySuccess(retryData.category, false);
    }
    
    updateCategorySuccess(category, success) {
        if (!this.categorySuccess.has(category)) {
            this.categorySuccess.set(category, { total: 0, successful: 0, feeds: new Set() });
        }
        
        const categoryData = this.categorySuccess.get(category);
        categoryData.total++;
        
        if (success) {
            categoryData.successful++;
        }
        
        console.log(`📊 Category ${category}: ${categoryData.successful}/${categoryData.total} successful`);
    }
    
    checkCategorySuccessRates() {
        console.log('📊 Checking category success rates...');
        
        for (const [category, data] of this.categorySuccess) {
            const successRate = data.successful / data.total;
            console.log(`📊 ${category}: ${Math.round(successRate * 100)}% success rate`);
            
            if (successRate < this.successThreshold) {
                console.log(`⚠️ Category ${category} below success threshold (${Math.round(successRate * 100)}% < ${Math.round(this.successThreshold * 100)}%)`);
            }
        }
    }
    
    getCategoryStatus() {
        const status = {};
        for (const [category, data] of this.categorySuccess) {
            status[category] = {
                successRate: data.successful / data.total,
                totalFeeds: data.total,
                successfulFeeds: data.successful
            };
        }
        return status;
    }
    
    getStatus() {
        const status = {
            articles: {
                total: this.articles.length,
                filtered: this.filteredArticles.length,
                maxAllowed: this.maxArticles
            },
            feeds: {
                total: this.getTotalFeedCount(),
                failed: this.failedFeeds.size,
                retrying: Array.from(this.failedFeeds.values()).filter(f => f.retryCount < this.maxRetries).length
            },
            categories: this.getCategoryStatus(),
            performance: {
                lastLoadTime: this.performanceMetrics.lastLoadTime,
                totalLoads: this.performanceMetrics.totalLoads,
                cacheSize: this.feedCache.size
            },
            stability: {
                isStable: this.articles.length <= this.maxArticles,
                needsCleanup: this.articles.length > this.maxArticles * 0.8,
                retryQueueSize: this.failedFeeds.size
            }
        };
        
        return status;
    }


    

    
    // Method to force cleanup and stability
    forceCleanup() {
        console.log('🧹 Forcing cleanup and stability...');
        
        // Clean up articles
        if (this.articles.length > this.maxArticles) {
            const oldCount = this.articles.length;
            this.articles = this.articles.slice(0, this.maxArticles);
            console.log(`🧹 Cleaned articles: ${oldCount} → ${this.articles.length}`);
        }
        
        // Clean up cache
        if (this.feedCache.size > 100) {
            const oldCacheSize = this.feedCache.size;
            this.feedCache.clear();
            console.log(`🧹 Cleaned cache: ${oldCacheSize} → 0`);
        }
        
        // Update filtered articles
        this.updateFilteredArticles();
        
        console.log('✅ Cleanup completed');
    }
}

// Initialize the optimized processor with error handling
console.log('🚀 Initializing OptimizedFeedProcessor...');

// Ensure global availability
window.OptimizedFeedProcessor = OptimizedFeedProcessor;

try {
    window.newsAggregator = new OptimizedFeedProcessor();
    console.log('✅ News aggregator initialized successfully');
    
    // Verify initialization
    if (!window.newsAggregator.feeds || window.newsAggregator.feeds.size === 0) {
        console.error('❌ No feeds found in aggregator');
    } else {
        console.log(`📡 Found ${window.newsAggregator.feeds.size} categories with feeds`);
        for (const [category, feeds] of window.newsAggregator.feeds) {
            console.log(`📁 ${category}: ${feeds.length} feeds`);
        }
    }
    
    // Make sure it's globally accessible
    if (typeof window !== 'undefined') {
        window.newsAggregator = window.newsAggregator;
        console.log('✅ News aggregator made globally available');
    }
} catch (error) {
    console.error('❌ Failed to initialize news aggregator:', error);
    window.newsAggregator = null;
}

// Wait for DOM to be ready before starting
function initializeWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📡 DOM ready, starting feed processor...');
            startFeedProcessor();
        });
    } else {
        console.log('📡 DOM already ready, starting feed processor...');
        startFeedProcessor();
    }
}

// Initialize immediately if possible, otherwise wait
if (typeof window !== 'undefined' && window.newsAggregator) {
    console.log('📡 News aggregator already available, starting feed processor...');
    startFeedProcessor();
} else {
    initializeWhenReady();
}

function startFeedProcessor() {
    try {
        if (!window.newsAggregator) {
            console.error('❌ News aggregator not available');
            return;
        }
        
        console.log('🔄 Starting background processes...');
        window.newsAggregator.startBackgroundProcesses();
        
        console.log('🔄 Starting continuous refresh...');
        window.newsAggregator.startContinuousRefresh();
        
        // Initial load after a short delay to ensure everything is ready
        setTimeout(() => {
            console.log('📡 Starting initial feed load...');
            if (window.newsAggregator && typeof window.newsAggregator.loadAllFeeds === 'function') {
                window.newsAggregator.loadAllFeeds().catch(error => {
                    console.error('❌ Initial feed load failed:', error);
                });
            } else {
                console.error('❌ News aggregator loadAllFeeds method not available');
            }
        }, 1000);
        
        console.log('✅ Feed processor started successfully');
    } catch (error) {
        console.error('❌ Error starting feed processor:', error);
    }
} 
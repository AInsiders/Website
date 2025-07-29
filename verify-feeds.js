// RSS Feed Verification Script for A.Insiders
class FeedVerifier {
    constructor() {
        this.results = {
            valid: [],
            invalid: [],
            errors: []
        };
        this.opmlData = null;
    }

    async verifyOPMLFeeds() {
        console.log('🔍 Starting RSS feed verification...');
        
        try {
            // Parse the OPML data from the file
            const opmlContent = await this.loadOPMLFile();
            this.opmlData = this.parseOPML(opmlContent);
            
            console.log(`📊 Found ${this.opmlData.length} feeds to verify`);
            
            // Verify each feed
            for (let i = 0; i < this.opmlData.length; i++) {
                const feed = this.opmlData[i];
                console.log(`\n${i + 1}/${this.opmlData.length} - Verifying: ${feed.title}`);
                
                await this.verifyFeed(feed);
                
                // Add a small delay to avoid overwhelming servers
                await this.delay(500);
            }
            
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Error during verification:', error);
        }
    }

    async loadOPMLFile() {
        // This would normally load the OPML file
        // For now, we'll use the data from the OPML file content
        return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.1" xmlns:feeder="https://nononsenseapps.com/feeder">
  <head>
    <title>Feeder</title>
  </head>
  <body>
    <outline feeder:notify="false" feeder:fullTextByDefault="true" feeder:openArticlesWith="0" feeder:alternateId="false" title="- Archives Page 1 | NVIDIA Blog" text="- Archives Page 1 | NVIDIA Blog" type="rss" xmlUrl="https://blogs.nvidia.com/blog/category/auto/feed/"/>
    <outline feeder:notify="false" feeder:imageUrl="https://www.wired.com/verso/static/wired-us/assets/favicon.ico" feeder:fullTextByDefault="true" feeder:openArticlesWith="0" feeder:alternateId="false" title="Feed: Artificial Intelligence Latest" text="Feed: Artificial Intelligence Latest" type="rss" xmlUrl="https://www.wired.com/feed/tag/ai/latest/rss"/>
    <outline feeder:notify="false" feeder:imageUrl="https://news.nononsenseapps.com/apple-touch-icon.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="" feeder:alternateId="false" title="Feeder News" text="Feeder News" type="rss" xmlUrl="https://news.nononsenseapps.com/index.atom"/>
    <outline title="AI" text="AI">
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="AI Research" text="AI Research" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCkUedU1YAz3QEYycpxz5HKw"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="AI Revolution" text="AI Revolution" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UC5l7RouTQ60oUjLjt1Nh-UQ"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="AI Samson" text="AI Samson" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCED3hlYdD0SlCff7jJ8tF3Q"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="AI Search" text="AI Search" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCIgnGlGkVRhd4qNFcEwLL4A"/>
      <outline feeder:notify="false" feeder:fullTextByDefault="false" feeder:openArticlesWith="0" feeder:alternateId="false" title="AI Trends" text="AI Trends" type="rss" xmlUrl="https://www.aitrends.com/feed/"/>
      <outline feeder:notify="false" feeder:imageUrl="https://www.youtube.com/s/desktop/661c298b/img/favicon_32x32.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="AI Uncovered" text="AI Uncovered" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCUTF61UNExRdjmoK5mXwWfQ"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="Andy Stapleton" text="Andy Stapleton" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCFqXmQ56-Gp1rIKa-GoAJvQ"/>
      <outline feeder:notify="false" feeder:imageUrl="https://www.techrepublic.com/wp-content/themes/techrepublic-theme/inc/images/app-icons/apple-touch-icon.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="0" feeder:alternateId="false" title="Artificial Intelligence | TechRepublic" text="Artificial Intelligence | TechRepublic" type="rss" xmlUrl="https://www.techrepublic.com/rssfeeds/topic/artificial-intelligence/"/>
      <outline feeder:notify="false" feeder:imageUrl="https://www.techrepublic.com/wp-content/themes/techrepublic-theme/inc/images/app-icons/apple-touch-icon.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="0" feeder:alternateId="false" title="Business Intelligence | TechRepublic" text="Business Intelligence | TechRepublic" type="rss" xmlUrl="https://www.techrepublic.com/rssfeeds/topic/business-intelligence/"/>
      <outline feeder:notify="false" feeder:imageUrl="https://dailyai.com/wp-content/uploads/2023/06/cropped-Daily-Ai_TL_colour-32x32.png" feeder:fullTextByDefault="true" feeder:openArticlesWith="0" feeder:alternateId="false" title="DailyAI" text="DailyAI" type="rss" xmlUrl="https://dailyai.com/feed/"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="DeepLearningAI" text="DeepLearningAI" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCcIXc5mJsHVYTZR1maL5l9w"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="Dr. Know-it-all Knows it all" text="Dr. Know-it-all Knows it all" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCyqpZ8HY9FY5jH-RoVcwlnw"/>
      <outline feeder:notify="true" feeder:imageUrl="https://www.techrepublic.com/wp-content/themes/techrepublic-theme/inc/images/app-icons/apple-touch-icon.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="" feeder:alternateId="false" title="Facial recognition | TechRepublic" text="Facial recognition | TechRepublic" type="rss" xmlUrl="https://www.techrepublic.com/rssfeeds/topic/facial-recognition/"/>
      <outline feeder:notify="false" feeder:imageUrl="https://cdn.gadgets360.com/gadgets360_logo.png" feeder:fullTextByDefault="true" feeder:openArticlesWith="" feeder:alternateId="false" title="Gadgets 360" text="Gadgets 360" type="rss" xmlUrl="https://www.gadgets360.com/rss/ai/feeds"/>
      <outline feeder:notify="false" feeder:imageUrl="https://www.gstatic.com/images/branding/productlogos/google_deepmind/v3/web-96dp/logo_google_deepmind_color_2x_web_96dp.png" feeder:fullTextByDefault="true" feeder:openArticlesWith="" feeder:alternateId="false" title="Google DeepMind Blog" text="Google DeepMind Blog" type="rss" xmlUrl="https://deepmind.google/blog/rss.xml"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="Julia McCoy" text="Julia McCoy" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCqzK60-oUOEq36uU9B1MMUg"/>
      <outline feeder:notify="false" feeder:imageUrl="https://machinelearningmastery.com/wp-content/uploads/2016/09/cropped-icon-180x180.png" feeder:fullTextByDefault="true" feeder:openArticlesWith="0" feeder:alternateId="false" title="MachineLearningMastery.com" text="MachineLearningMastery.com" type="rss" xmlUrl="https://machinelearningmastery.com/blog/feed/"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="Matt Szaton" text="Matt Szaton" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCBvDIqM6rPVgdQ-D9JqKTGA"/>
      <outline feeder:notify="false" feeder:imageUrl="https://ph-static.imgix.net/ph-favicon-brand-500.ico?auto=format" feeder:fullTextByDefault="true" feeder:openArticlesWith="0" feeder:alternateId="false" title="Product Hunt — The best new products, every day" text="Product Hunt — The best new products, every day" type="rss" xmlUrl="https://www.producthunt.com/feed?category=artificial-intelligence"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="ReuNext Technologies" text="ReuNext Technologies" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCLGzMJjT1h4VJ7m4Oc9GX2g"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="Skill Leap AI" text="Skill Leap AI" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCwSozl89jl2zUDzQ4jGJD3g"/>
      <outline feeder:notify="false" feeder:imageUrl="https://www.youtube.com/s/desktop/7c0eb0c2/img/favicon_32x32.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="The AI Advantage" text="The AI Advantage" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCHhYXsLBEVVnbvsq57n1MTQ"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="The AI Daily Brief: Artificial Intelligence News" text="The AI Daily Brief: Artificial Intelligence News" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCKelCK4ZaO6HeEI1KQjqzWA"/>
      <outline feeder:notify="false" feeder:fullTextByDefault="false" feeder:openArticlesWith="" feeder:alternateId="false" title="The Berkeley Artificial Intelligence Research Blog" text="The Berkeley Artificial Intelligence Research Blog" type="rss" xmlUrl="https://bair.berkeley.edu/blog/feed.xml"/>
      <outline feeder:notify="false" feeder:imageUrl="https://www.youtube.com/s/desktop/7c0eb0c2/img/favicon_32x32.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="TheAIGRID" text="TheAIGRID" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCbY9xX3_jW5c2fjlZVBI4cg"/>
      <outline feeder:notify="false" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="Theoretically Media" text="Theoretically Media" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UC9Ryt3XOGYBoAJVsBHNGDzA"/>
      <outline feeder:notify="true" feeder:imageUrl="https://m.youtube.com/static/logos/favicon.ico" feeder:fullTextByDefault="false" feeder:openArticlesWith="2" feeder:alternateId="false" title="Two Minute Papers" text="Two Minute Papers" type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg"/>
      <outline feeder:notify="false" feeder:imageUrl="https://www.ruder.io/favicon.png" feeder:fullTextByDefault="false" feeder:openArticlesWith="" feeder:alternateId="false" title="ruder.io" text="ruder.io" type="rss" xmlUrl="https://ruder.io/rss/"/>
    </outline>
  </body>
</opml>`;
    }

    parseOPML(opmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(opmlContent, 'text/xml');
        const outlines = xmlDoc.querySelectorAll('outline[type="rss"], outline[xmlUrl]');
        
        const feeds = [];
        outlines.forEach(outline => {
            const title = outline.getAttribute('title') || outline.getAttribute('text') || 'Unknown';
            const url = outline.getAttribute('xmlUrl') || '';
            const type = outline.getAttribute('type') || 'rss';
            const category = this.getCategoryFromOutline(outline);
            
            if (url) {
                feeds.push({
                    title: title.trim(),
                    url: url.trim(),
                    type: type,
                    category: category
                });
            }
        });
        
        return feeds;
    }

    getCategoryFromOutline(outline) {
        // Find the parent category
        let parent = outline.parentElement;
        while (parent && parent.tagName === 'outline') {
            const parentTitle = parent.getAttribute('title');
            if (parentTitle && parentTitle !== 'Feeder') {
                return parentTitle;
            }
            parent = parent.parentElement;
        }
        return 'Uncategorized';
    }

    async verifyFeed(feed) {
        try {
            const startTime = Date.now();
            
            // Use CORS proxy to test the feed
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(proxyUrl, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            clearTimeout(timeoutId);
            
            const responseTime = Date.now() - startTime;
            
            if (response.ok) {
                const text = await response.text();
                
                if (text && text.trim() !== '') {
                    // Check if it's valid XML/RSS
                    const isValidXML = this.validateXML(text);
                    
                    if (isValidXML) {
                        const articleCount = this.countArticles(text);
                        
                        this.results.valid.push({
                            ...feed,
                            responseTime,
                            articleCount,
                            status: 'Valid'
                        });
                        
                        console.log(`✅ Valid: ${feed.title} (${articleCount} articles, ${responseTime}ms)`);
                    } else {
                        this.results.invalid.push({
                            ...feed,
                            responseTime,
                            error: 'Invalid XML format',
                            status: 'Invalid XML'
                        });
                        
                        console.log(`❌ Invalid XML: ${feed.title}`);
                    }
                } else {
                    this.results.invalid.push({
                        ...feed,
                        responseTime,
                        error: 'Empty response',
                        status: 'Empty'
                    });
                    
                    console.log(`❌ Empty: ${feed.title}`);
                }
            } else {
                this.results.invalid.push({
                    ...feed,
                    responseTime,
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    status: 'HTTP Error'
                });
                
                console.log(`❌ HTTP Error: ${feed.title} (${response.status})`);
            }
            
        } catch (error) {
            const errorMsg = error.name === 'AbortError' ? 'Timeout' : error.message;
            
            this.results.errors.push({
                ...feed,
                error: errorMsg,
                status: 'Error'
            });
            
            console.log(`❌ Error: ${feed.title} - ${errorMsg}`);
        }
    }

    validateXML(xmlText) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                return false;
            }
            
            // Check for basic RSS/Atom structure
            const hasRSS = xmlDoc.querySelector('rss, feed, rdf\\:RDF');
            const hasItems = xmlDoc.querySelector('item, entry');
            
            return hasRSS && hasItems;
            
        } catch (error) {
            return false;
        }
    }

    countArticles(xmlText) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            const items = xmlDoc.querySelectorAll('item, entry');
            return items.length;
            
        } catch (error) {
            return 0;
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('📊 RSS FEED VERIFICATION REPORT');
        console.log('='.repeat(80));
        
        console.log(`\n✅ Valid Feeds: ${this.results.valid.length}`);
        console.log(`❌ Invalid Feeds: ${this.results.invalid.length}`);
        console.log(`⚠️  Errors: ${this.results.errors.length}`);
        console.log(`📈 Total Tested: ${this.opmlData.length}`);
        
        const successRate = ((this.results.valid.length / this.opmlData.length) * 100).toFixed(1);
        console.log(`🎯 Success Rate: ${successRate}%`);
        
        if (this.results.valid.length > 0) {
            console.log('\n✅ VALID FEEDS:');
            this.results.valid.forEach(feed => {
                console.log(`  • ${feed.title} (${feed.category}) - ${feed.articleCount} articles`);
            });
        }
        
        if (this.results.invalid.length > 0) {
            console.log('\n❌ INVALID FEEDS:');
            this.results.invalid.forEach(feed => {
                console.log(`  • ${feed.title} (${feed.category}) - ${feed.error}`);
            });
        }
        
        if (this.results.errors.length > 0) {
            console.log('\n⚠️  ERRORS:');
            this.results.errors.forEach(feed => {
                console.log(`  • ${feed.title} (${feed.category}) - ${feed.error}`);
            });
        }
        
        // Category breakdown
        console.log('\n📂 CATEGORY BREAKDOWN:');
        const categoryStats = {};
        
        [...this.results.valid, ...this.results.invalid, ...this.results.errors].forEach(feed => {
            if (!categoryStats[feed.category]) {
                categoryStats[feed.category] = { valid: 0, invalid: 0, errors: 0 };
            }
            
            if (this.results.valid.includes(feed)) {
                categoryStats[feed.category].valid++;
            } else if (this.results.invalid.includes(feed)) {
                categoryStats[feed.category].invalid++;
            } else {
                categoryStats[feed.category].errors++;
            }
        });
        
        Object.entries(categoryStats).forEach(([category, stats]) => {
            const total = stats.valid + stats.invalid + stats.errors;
            const validRate = ((stats.valid / total) * 100).toFixed(1);
            console.log(`  • ${category}: ${stats.valid}/${total} valid (${validRate}%)`);
        });
        
        console.log('\n' + '='.repeat(80));
        console.log('🔧 RECOMMENDATIONS:');
        console.log('='.repeat(80));
        
        if (this.results.invalid.length > 0 || this.results.errors.length > 0) {
            console.log('• Consider removing or replacing feeds with consistent errors');
            console.log('• Check for updated RSS URLs for failed feeds');
            console.log('• Implement retry logic for temporary failures');
        }
        
        if (successRate >= 90) {
            console.log('• Excellent feed health! Consider adding more feeds for diversity');
        } else if (successRate >= 75) {
            console.log('• Good feed health. Monitor failing feeds closely');
        } else {
            console.log('• Poor feed health. Consider major feed list cleanup');
        }
        
        console.log('\n✅ Verification complete!');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize and run verification
document.addEventListener('DOMContentLoaded', () => {
    const verifier = new FeedVerifier();
    verifier.verifyOPMLFeeds();
});

// Export for use in other scripts
window.FeedVerifier = FeedVerifier; 
// News Feed Aggregator for A.Insiders
class NewsFeedAggregator {
    constructor() {
        this.feeds = this.initializeFeeds();
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.allArticles = [];
        this.filteredArticles = [];
        this.isLoading = false;
        this.loadingCategories = new Set(); // Track which categories are loading
        
        this.init();
    }

    initializeFeeds() {
        return {
            'AI': [
                { name: 'NVIDIA Blog', url: 'https://blogs.nvidia.com/blog/category/auto/feed/', type: 'rss' },
                { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', type: 'rss' },
                { name: 'Feeder News', url: 'https://news.nononsenseapps.com/index.atom', type: 'rss' },
                { name: 'AI Research', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkUedU1YAz3QEYycpxz5HKw', type: 'youtube' },
                { name: 'AI Revolution', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5l7RouTQ60oUjLjt1Nh-UQ', type: 'youtube' },
                { name: 'AI Samson', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCED3hlYdD0SlCff7jJ8tF3Q', type: 'youtube' },
                { name: 'AI Search', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCIgnGlGkVRhd4qNFcEwLL4A', type: 'youtube' },
                { name: 'AI Trends', url: 'https://www.aitrends.com/feed/', type: 'rss' },
                { name: 'AI Uncovered', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCUTF61UNExRdjmoK5mXwWfQ', type: 'youtube' },
                { name: 'Andy Stapleton', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCFqXmQ56-Gp1rIKa-GoAJvQ', type: 'youtube' },
                { name: 'TechRepublic AI', url: 'https://www.techrepublic.com/rssfeeds/topic/artificial-intelligence/', type: 'rss' },
                { name: 'Business Intelligence', url: 'https://www.techrepublic.com/rssfeeds/topic/business-intelligence/', type: 'rss' },
                { name: 'DailyAI', url: 'https://dailyai.com/feed/', type: 'rss' },
                { name: 'DeepLearningAI', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcIXc5mJsHVYTZR1maL5l9w', type: 'youtube' },
                { name: 'Dr. Know-it-all', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCyqpZ8HY9FY5jH-RoVcwlnw', type: 'youtube' },
                { name: 'Facial Recognition', url: 'https://www.techrepublic.com/rssfeeds/topic/facial-recognition/', type: 'rss' },
                { name: 'Gadgets 360', url: 'https://www.gadgets360.com/rss/ai/feeds', type: 'rss' },
                { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', type: 'rss' },
                { name: 'Julia McCoy', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqzK60-oUOEq36uU9B1MMUg', type: 'youtube' },
                { name: 'Machine Learning Mastery', url: 'https://machinelearningmastery.com/blog/feed/', type: 'rss' },
                { name: 'Matt Szaton', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBvDIqM6rPVgdQ-D9JqKTGA', type: 'youtube' },
                { name: 'Product Hunt AI', url: 'https://www.producthunt.com/feed?category=artificial-intelligence', type: 'rss' },
                { name: 'ReuNext Technologies', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLGzMJjT1h4VJ7m4Oc9GX2g', type: 'youtube' },
                { name: 'Skill Leap AI', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCwSozl89jl2zUDzQ4jGJD3g', type: 'youtube' },
                { name: 'The AI Advantage', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHhYXsLBEVVnbvsq57n1MTQ', type: 'youtube' },
                { name: 'The AI Daily Brief', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKelCK4ZaO6HeEI1KQjqzWA', type: 'youtube' },
                { name: 'Berkeley AI Research', url: 'https://bair.berkeley.edu/blog/feed.xml', type: 'rss' },
                { name: 'TheAIGRID', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbY9xX3_jW5c2fjlZVBI4cg', type: 'youtube' },
                { name: 'Theoretically Media', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9Ryt3XOGYBoAJVsBHNGDzA', type: 'youtube' },
                { name: 'Two Minute Papers', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg', type: 'youtube' },
                { name: 'ruder.io', url: 'https://ruder.io/rss/', type: 'rss' },
                { name: 'MIT Technology Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', type: 'rss' },
                { name: 'ArXiv AI', url: 'https://export.arxiv.org/rss/cs.AI', type: 'rss' },
                { name: 'AI News', url: 'https://artificial-intelligence.blog/feed/', type: 'rss' },
                { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', type: 'rss' }
            ],
            'Bioengineering': [
                { name: 'BioPharma Dive', url: 'https://www.biopharmadive.com/feeds/news/', type: 'rss' },
                { name: 'Healthcare Data Breaches', url: 'https://federalnewsnetwork.com/category/federal-insights/combating-healthcare-data-breaches-with-intelligence/feed/', type: 'rss' },
                { name: 'Dangerous Things Forum', url: 'https://forum.dangerousthings.com/latest.rss', type: 'rss' },
                { name: 'Digital Health', url: 'https://www.bioworld.com/rss/22', type: 'rss' },
                { name: 'HOLOLIFE Summit', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpbppWVgOJcU0lf5rDYSSXw', type: 'youtube' },
                { name: 'Labiotech.eu', url: 'https://www.labiotech.eu/feed/', type: 'rss' },
                { name: 'Nature Biotechnology', url: 'https://www.nature.com/nbt.rss', type: 'rss' },
                { name: 'Neuralink', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLt4d8cACHzrVvAz9gtaARA', type: 'youtube' },
                { name: 'Healthcare IT News', url: 'https://www.healthcareitnews.com/home/feed', type: 'rss' },
                { name: 'Science', url: 'https://newatlas.com/science/index.rss', type: 'rss' },
                { name: 'The Medical Futurist', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8vwN4Sju7ER6KZzDADBKBQ', type: 'youtube' },
                { name: 'Biohacking', url: 'https://hackaday.com/tag/biohacking/feed/', type: 'rss' }
            ],
            'CRM Tools': [
                { name: 'Agencys Ai', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCI4yaNEFssXnlrQRmBt2FMg', type: 'youtube' },
                { name: 'HubSpot', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaAx1xeTgF3rs4rBPDq6-Kw', type: 'youtube' },
                { name: 'Zoho CRM', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCy5GY9WtEg8SMgAZ_AiSlVw', type: 'youtube' }
            ],
            'Crypto': [
                { name: 'Alex Becker', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKQvGU-qtjEthINeViNbn6A', type: 'youtube' },
                { name: 'Lark Davis', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCl2oCaw8hdR_kbqyqd2klIA', type: 'youtube' }
            ],
            'Cybersecurity': [
                { name: 'AI Dark Files', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRoXUiP5sBe5CZfh9yUv1lw', type: 'youtube' },
                { name: 'Black Hat', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCJ6q9Ie29ajGqKApbLqfBOg', type: 'youtube' },
                { name: 'David Bombal', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCP7WmQ_U4GB3K51Od9QvM0w', type: 'youtube' },
                { name: 'HackerOne', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsgzmECky2Q9lQMWzDwMhYw', type: 'youtube' },
                { name: 'Hak5', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3s0BtrBJpwNDaflRSoiieQ', type: 'youtube' },
                { name: 'KitPloit', url: 'https://www.kitploit.com/feeds/posts/default', type: 'rss' },
                { name: 'NetworkChuck', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9x0AN7BWHpCDHSm9NiJFJQ', type: 'youtube' },
                { name: 'Spyboy Blog', url: 'https://spyboy.blog/category/networking/feed/', type: 'rss' },
                { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', type: 'rss' },
                { name: 'Security Week', url: 'https://www.securityweek.com/feed/', type: 'rss' },
                { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', type: 'rss' },
                { name: 'Threat Post', url: 'https://threatpost.com/feed/', type: 'rss' },
                { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/', type: 'rss' },
                { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', type: 'rss' }
            ],
            'Flipper': [
                { name: 'Talking Sasquach', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCUoJk48pujh29p8zLsnD5PQ', type: 'youtube' }
            ],
            'Marketing': [
                { name: 'AI Filmmaking Academy', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz94LN8mm0Nv_5g79qPryrg', type: 'youtube' },
                { name: 'AI Space', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCTq6xMw_BHR5dgKQDs4qhsg', type: 'youtube' },
                { name: 'AIQUEST', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCdFRvwde9cmdVm_Q-ODZTZg', type: 'youtube' },
                { name: 'Chorus by ZoomInfo', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRf8sxSbq-TvtWJZq_V1q_w', type: 'youtube' },
                { name: 'Darcy\'s Business', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNzm7D-tRMg3Dw7nNA2fQhw', type: 'youtube' },
                { name: 'HeyGen', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCV0FmNF3iM-022BF1KbVtxA', type: 'youtube' },
                { name: 'Jonathan\'s Hub Jam', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCeFlDDx4rcssh2cO_yB4y-w', type: 'youtube' },
                { name: 'Jono Catliff', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCnzxPyNnn8jk4bHFk3JUBhA', type: 'youtube' },
                { name: 'Make', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8KWRrf8wqyowmWhXJ9DRjQ', type: 'youtube' },
                { name: 'Marketing AI Institute', url: 'https://www.marketingaiinstitute.com/blog/rss.xml', type: 'rss' },
                { name: 'Rick Mulready', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCmNAkARqTFvNoyxmFhKTS9Q', type: 'youtube' },
                { name: 'Romayroh', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxI3-49z98MUKF3wTVJ9nkg', type: 'youtube' },
                { name: 'Shinefy', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6z07Hh9Muy6urJgA0F0azg', type: 'youtube' },
                { name: 'Spencer Benterud', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpOITtvjPXP53yRwDpliC2Q', type: 'youtube' },
                { name: 'Synthesia', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC0Rqs6pyPoGaMT5HFMFdslg', type: 'youtube' },
                { name: 'Tao Prompts', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCc1qMq2UBJD9cSKbeBwGoZQ', type: 'youtube' },
                { name: 'The AI Filmmaking Advantage', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCU6UHXn_S-FijQyy_mi8xcA', type: 'youtube' },
                { name: 'WesGPT', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCgzH02aZzAcX0bDvdzy928w', type: 'youtube' },
                { name: 'Zapier', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCEvsxF4Z12vwpwDUaU02yiA', type: 'youtube' },
                { name: 'metricsmule', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCSNF2YIUV3g-uZwuNSmA1Rw', type: 'youtube' }
            ],
            'Matrix': [
                { name: 'Axon', url: 'https://youtube.com/@axonenterprise', type: 'youtube' },
                { name: 'Bloomberg Technology', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCrM7B7SL_g1edFOnmj-SDKg', type: 'youtube' },
                { name: 'Defense', url: 'https://federalnewsnetwork.com/category/defense-main/feed/', type: 'rss' },
                { name: 'Defense News', url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml', type: 'rss' },
                { name: 'Technology', url: 'https://federalnewsnetwork.com/category/technology-main/feed/', type: 'rss' },
                { name: 'The Military Show', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKfak8fBm_Lhy4eX9UKxEpA', type: 'youtube' }
            ],
            'Matrix FUTURE': [
                { name: 'Exoskeletons and Wearable Robotics', url: 'https://feeds.buzzsprout.com/2402589.rss', type: 'rss' },
                { name: 'Freethink', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UConJDkGk921yT9hISzFqpzw', type: 'youtube' },
                { name: 'Future of Government', url: 'https://federalnewsnetwork.com/category/federal-insights/future-of-government/feed/', type: 'rss' },
                { name: 'IT Innovation Insider', url: 'https://federalnewsnetwork.com/category/federal-insights/it-innovation-insider/feed/', type: 'rss' },
                { name: 'Innovation in Government', url: 'https://federalnewsnetwork.com/category/federal-insights/innovation-in-government/feed/', type: 'rss' },
                { name: 'Innovation in Government videos', url: 'https://federalnewsnetwork.com/category/federal-insights/innovation-in-government/innovation-in-government-videos/feed/', type: 'rss' },
                { name: 'Artificial intelligence', url: 'https://www.bioworld.com/rss/20', type: 'rss' },
                { name: 'Quartz', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9f78Z5hgtDt0n8JWyfBk8Q', type: 'youtube' },
                { name: 'Special Bulletin Review', url: 'https://federalnewsnetwork.com/category/federal-insights/special-bulletin-review-securing-our-citizens-while-modernizing/feed/', type: 'rss' }
            ],
            'NEW TECH': [
                { name: 'Military Trends', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCveyvadzzSXdNYjynAm_APA', type: 'youtube' },
                { name: 'Rowan Cheung', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8LUzR34nNX8KH3Edd0un1g', type: 'youtube' },
                { name: 'Tech News', url: 'https://youtube.com/@tech_news_now', type: 'youtube' },
                { name: 'TechZone', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6H07z6zAwbHRl4Lbl0GSsw', type: 'youtube' },
                { name: 'Technology', url: 'https://newatlas.com/technology/index.rss', type: 'rss' }
            ],
            'Open AI': [
                { name: 'OpenAI', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXZCJLdBC09xxGZ6gcdrc6A', type: 'youtube' }
            ],
            'Phones': [
                { name: 'Android Authority', url: 'https://www.androidauthority.com/feed/', type: 'rss' },
                { name: 'Apple Newsroom', url: 'https://www.apple.com/newsroom/rss-feed.rss', type: 'rss' },
                { name: 'GSMArena', url: 'https://www.gsmarena.com/rss-news-reviews.php3', type: 'rss' },
                { name: 'Matt Talks Tech', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCz6PEeVLG1TL6jMRTvSLm4g', type: 'youtube' }
            ],
            'Robotics': [
                { name: 'AI and Robotics', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVtWNlve83y5i8rm5HQw6sg', type: 'youtube' },
                { name: 'Boston Dynamics', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7vVhkEfw4nOGp8TyDk7RcQ', type: 'youtube' },
                { name: 'Figure', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCYlq-KmwPjc1DtsGmthFqSQ', type: 'youtube' },
                { name: 'The Robot Report', url: 'https://www.therobotreport.com/feed/', type: 'rss' },
                { name: 'Unitree Robotics', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsMbp4V8oxzHCMdOUP-3oWw', type: 'youtube' },
                { name: 'Robohub', url: 'https://robohub.org/feed/', type: 'rss' },
                { name: 'IEEE Robotics', url: 'https://www.ieee-ras.org/rss-feed', type: 'rss' },
                { name: 'Robotics.org', url: 'https://www.robotics.org/feed.cfm', type: 'rss' },
                { name: 'Automation World', url: 'https://www.automationworld.com/rss.xml', type: 'rss' },
                { name: 'Robotics Business Review', url: 'https://www.roboticsbusinessreview.com/feed/', type: 'rss' },
                { name: 'Will Robots Take My Job', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsT0YIqwnpJCM-mx7-gSA4Q', type: 'youtube' },
                { name: 'Real Engineering', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCR1IuLEqb6UEA_zQ81kwXfg', type: 'youtube' }
            ],
            'Space': [
                { name: 'ALPHA TECH', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCO9Vgn2ayVe67fE5tP6JQFA', type: 'youtube' },
                { name: 'ESA Space Science', url: 'https://www.esa.int/rssfeed/science', type: 'rss' },
                { name: 'GREAT SPACEX', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRAu2aXcH-B5h9SREfyhXuA', type: 'youtube' },
                { name: 'NASASpaceflight', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCSUu1lih2RifWkKtDOJdsBA', type: 'youtube' },
                { name: 'Sciencephile the AI', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7BhHN8NyMMru2RUygnDXSg', type: 'youtube' },
                { name: 'Starlink', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCOd-T4fKh4hjWx1qQHmhiJQ', type: 'youtube' },
                { name: 'The Aerospace Corporation', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCP1gMWD_BqVL4YXeJyhb7ng', type: 'youtube' },
                { name: 'NASA', url: 'https://www.nasa.gov/feed/', type: 'rss' },
                { name: 'Space.com', url: 'https://www.space.com/feeds/all', type: 'rss' },
                { name: 'SpaceNews', url: 'https://spacenews.com/feed/', type: 'rss' },
                { name: 'Astronomy Now', url: 'https://astronomynow.com/feed/', type: 'rss' },
                { name: 'Universe Today', url: 'https://www.universetoday.com/feed/', type: 'rss' },
                { name: 'Everyday Astronaut', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6uKrU_WqJ1r2H7Y0cKTlJA', type: 'youtube' },
                { name: 'Scott Manley', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxzC4EngIsMrPmbm6Nxvb-A', type: 'youtube' }
            ],
            'Tech Reviews': [
                { name: 'Marques Brownlee', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ', type: 'youtube' },
                { name: 'Mrwhosetheboss', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMiJRAwDNSNzuYeN2uWa0pA', type: 'youtube' }
            ],
            'Transportation': [
                { name: 'Automotive IQ News', url: 'https://www.automotive-iq.com/rss/news', type: 'rss' },
                { name: 'Automotive IQ Reports', url: 'https://www.automotive-iq.com/rss/reports', type: 'rss' },
                { name: 'Vehicle Electrification', url: 'https://www.automotive-iq.com/rss/categories/electrics-electronics', type: 'rss' },
                { name: 'A Boring Revolution', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxaChRLSN-k6QkUqF17sGjg', type: 'youtube' },
                { name: 'AI & CAR', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC4AExSxU3TT8GxAYUeEZXVg', type: 'youtube' },
                { name: 'AmpedAuto', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCCF6WAhvjydnXUHl85cDXpA', type: 'youtube' },
                { name: 'Boat & Sail Magazine', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCgCMYcDTo077fYXhDB27C_Q', type: 'youtube' },
                { name: 'Form Trends', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpifTlKKeTyZllzUBrWFtjA', type: 'youtube' },
                { name: 'Global Railway Review', url: 'https://feeds.feedburner.com/GlobalRailwayReview', type: 'rss' },
                { name: 'LatestCarsPro', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCgVYEv7-4Cug-1Gd4DjULfg', type: 'youtube' },
                { name: 'The Tesla Space', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCJjAIBWeY022ZNj_Cp_6wAw', type: 'youtube' }
            ],
            'Hydrogen': [
                { name: 'Hydrogen Cars Now', url: 'https://www.hydrogencarsnow.com/index.php/feed/', type: 'rss' },
                { name: 'Hydrogen Fuel News', url: 'https://www.hydrogenfuelnews.com/feed/', type: 'rss' },
                { name: 'Fuel Cell Today', url: 'https://www.fuelcelltoday.com/rss', type: 'rss' }
            ],
            'Trends': [
                { name: 'TrendHunter AI', url: 'https://www.trendhunter.com/rss/category/Cool-Gadgets-and-Gifts', type: 'rss' }
            ],
            'Video Games': [
                { name: 'AI Warehouse', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMT1Aw4R4nf_sFNDeuJqc6w', type: 'youtube' },
                { name: 'AI News Games', url: 'https://www.artificial-intelligence.blog/ai-news/category/games?format=rss', type: 'rss' },
                { name: 'Ludo AI Game Research', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC11y-idtc7Duc1VQGRKlzqw', type: 'youtube' },
                { name: 'b2studios', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCIcGc8tDHYZ3vY3NcS8JXaQ', type: 'youtube' }
            ]
        };
    }

    async init() {
        this.setupEventListeners();
        await this.loadAllFeeds();
        this.renderNews();
        this.handleURLParameters();
    }

    setupEventListeners() {
        // Category filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-filter')) {
                const selectedCategory = e.target.dataset.category;
                
                // Don't show loading for "all" category since it's just filtering
                if (selectedCategory !== 'all') {
                    this.updateCategoryLoadingState(selectedCategory, true);
                    
                    // Simulate loading time for better UX (remove this in production)
                    setTimeout(() => {
                        this.updateCategoryLoadingState(selectedCategory, false);
                    }, 500);
                }
                
                this.currentCategory = selectedCategory;
                this.currentPage = 1;
                this.filterArticles();
                this.renderNews();
                this.updateActiveFilter();
            }
        });

        // Search functionality
        const searchInput = document.getElementById('news-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterArticles(e.target.value);
                this.renderNews();
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

    async loadAllFeeds() {
        this.isLoading = true;
        this.updateLoadingState(true);
        this.updateAllCategoryLoadingStates(true); // Show loading for all categories

        const feedPromises = [];
        let totalFeeds = 0;
        
        // Count total feeds and create promises
        for (const [category, feeds] of Object.entries(this.feeds)) {
            totalFeeds += feeds.length;
            for (const feed of feeds) {
                feedPromises.push(this.fetchFeed(feed, category));
            }
        }

        console.log(`Loading ${totalFeeds} feeds across ${Object.keys(this.feeds).length} categories...`);

        try {
            const results = await Promise.allSettled(feedPromises);
            let successfulFeeds = 0;
            let failedFeeds = 0;
            let emptyFeeds = 0;
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    if (result.value.length > 0) {
                        this.allArticles.push(...result.value);
                        successfulFeeds++;
                    } else {
                        emptyFeeds++;
                        console.warn(`Feed returned no articles (empty but successful)`);
                    }
                } else {
                    failedFeeds++;
                    if (result.status === 'rejected') {
                        console.error(`Feed ${index} failed:`, result.reason);
                    } else {
                        console.error(`Feed ${index} returned null/undefined`);
                    }
                }
            });

            console.log(`Feed loading complete: ${successfulFeeds} successful, ${emptyFeeds} empty, ${failedFeeds} failed`);
            console.log(`Total articles loaded: ${this.allArticles.length}`);

            // Sort articles by date
            this.allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            
            this.filteredArticles = [...this.allArticles];
            
            // Log articles per category
            const categoryCounts = {};
            this.allArticles.forEach(article => {
                categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
            });
            console.log('Articles per category:', categoryCounts);
            
        } catch (error) {
            console.error('Error loading feeds:', error);
        } finally {
            this.isLoading = false;
            this.updateLoadingState(false);
            this.updateAllCategoryLoadingStates(false); // Remove loading from all categories
        }
    }

    async fetchFeed(feed, category) {
        try {
            console.log(`Fetching feed: ${feed.name} (${category}) - ${feed.url}`);
            
            // Try multiple CORS proxies for better reliability
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://corsproxy.io/?',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];
            
            let response = null;
            let lastError = null;
            
            for (const proxyUrl of proxies) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
                    
                    response = await fetch(proxyUrl + encodeURIComponent(feed.url), {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        },
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    if (response.ok) break;
                } catch (error) {
                    lastError = error;
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw lastError || new Error(`All proxies failed for ${feed.url}`);
            }
            
            const text = await response.text();
            
            if (!text || text.trim() === '') {
                throw new Error('Empty response received');
            }
            
            // Check if response is HTML error page instead of RSS/XML
            if (text.includes('<html') && !text.includes('<rss') && !text.includes('<feed')) {
                throw new Error('Received HTML instead of RSS/XML feed');
            }
            
            let articles = [];
            if (feed.type === 'youtube') {
                articles = this.parseYouTubeFeed(text, feed.name, category);
            } else {
                articles = this.parseRSSFeed(text, feed.name, category);
            }
            
            console.log(`Successfully parsed ${articles.length} articles from ${feed.name}`);
            
            // If no articles found, log the feed structure for debugging
            if (articles.length === 0) {
                console.warn(`No articles parsed from ${feed.name}. Response length: ${text.length}`);
                if (text.length < 1000) {
                    console.log('Feed response preview:', text.substring(0, 500));
                }
            }
            
            return articles;
            
        } catch (error) {
            console.error(`Error fetching ${feed.name} (${category}):`, error);
            console.error(`Feed URL: ${feed.url}`);
            return [];
        }
    }

    parseRSSFeed(xmlText, feedName, category) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('XML parsing error: ' + parserError.textContent);
            }
            
            // Try different selectors for different feed formats
            let items = xmlDoc.querySelectorAll('item');
            if (items.length === 0) {
                items = xmlDoc.querySelectorAll('entry');
            }
            if (items.length === 0) {
                items = xmlDoc.querySelectorAll('rss > channel > item');
            }
            
            if (items.length === 0) {
                console.warn(`No items found in feed: ${feedName}`);
                return [];
            }
            
            console.log(`Found ${items.length} items in ${feedName}`);
            
            return Array.from(items).map(item => {
                // Try multiple selectors for title
                let title = item.querySelector('title')?.textContent || '';
                if (!title) {
                    title = item.querySelector('atom\\:title, a\\:title')?.textContent || '';
                }
                
                // Try multiple selectors for link
                let link = item.querySelector('link')?.textContent || 
                          item.querySelector('link')?.getAttribute('href') || '';
                if (!link) {
                    link = item.querySelector('atom\\:link, a\\:link')?.getAttribute('href') || '';
                }
                
                // Try multiple selectors for description
                let description = item.querySelector('description')?.textContent || 
                                item.querySelector('summary')?.textContent || 
                                item.querySelector('content')?.textContent || '';
                if (!description) {
                    description = item.querySelector('atom\\:summary, a\\:summary, atom\\:content, a\\:content')?.textContent || '';
                }
                
                // Try multiple selectors for date
                let pubDate = item.querySelector('pubDate')?.textContent || 
                            item.querySelector('published')?.textContent || 
                            item.querySelector('updated')?.textContent || 
                            item.querySelector('dc\\:date')?.textContent || '';
                if (!pubDate) {
                    pubDate = item.querySelector('atom\\:published, a\\:published, atom\\:updated, a\\:updated')?.textContent || '';
                }
                
                const image = this.extractImageFromRSS(item, description);
                
                return {
                    title: this.cleanText(title),
                    link: link.trim(),
                    description: this.cleanText(description),
                    pubDate: pubDate || new Date().toISOString(),
                    image,
                    feedName,
                    category,
                    type: 'article'
                };
            }).filter(article => article.title && article.link); // Filter out invalid articles
            
        } catch (error) {
            console.error(`Error parsing RSS feed ${feedName}:`, error);
            return [];
        }
    }

    parseYouTubeFeed(xmlText, feedName, category) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('XML parsing error: ' + parserError.textContent);
            }
            
            const entries = xmlDoc.querySelectorAll('entry');
            
            if (entries.length === 0) {
                console.warn(`No entries found in YouTube feed: ${feedName}`);
                return [];
            }
            
            console.log(`Found ${entries.length} entries in YouTube feed ${feedName}`);
            
            return Array.from(entries).map(entry => {
                const title = entry.querySelector('title')?.textContent || '';
                const link = entry.querySelector('link')?.getAttribute('href') || '';
                
                // Try different selectors for description
                let description = entry.querySelector('media\\:description')?.textContent || 
                                entry.querySelector('description')?.textContent || 
                                entry.querySelector('summary')?.textContent || '';
                
                const pubDate = entry.querySelector('published')?.textContent || 
                              entry.querySelector('updated')?.textContent || '';
                              
                const videoId = this.extractYouTubeVideoId(link);
                
                if (!videoId) {
                    console.warn(`Could not extract video ID from: ${link}`);
                    return null;
                }
                
                const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                
                return {
                    title: this.cleanText(title),
                    link,
                    description: this.cleanText(description),
                    pubDate: pubDate || new Date().toISOString(),
                    image: thumbnail,
                    videoId,
                    feedName,
                    category,
                    type: 'video'
                };
            }).filter(entry => entry !== null && entry.title && entry.videoId); // Filter out invalid entries
            
        } catch (error) {
            console.error(`Error parsing YouTube feed ${feedName}:`, error);
            return [];
        }
    }

    extractImageFromRSS(item, description) {
        // Try to find image in media:content
        const mediaContent = item.querySelector('media\\:content, media\\:thumbnail');
        if (mediaContent) {
            const imageUrl = mediaContent.getAttribute('url');
            if (imageUrl && imageUrl.trim() !== '') {
                return imageUrl;
            }
        }
        
        // Try to extract from description
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch && imgMatch[1] && imgMatch[1].trim() !== '') {
            return imgMatch[1];
        }
        
        // No image available
        return null;
    }

    extractYouTubeVideoId(url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : '';
    }

    getDefaultImage(category) {
        const defaultImages = {
            'ai': '/images/ai-default.jpg',
            'cybersecurity': '/images/cyber-default.jpg',
            'robotics': '/images/robotics-default.jpg',
            'space': '/images/space-default.jpg',
            'transportation': '/images/transport-default.jpg',
            'bioengineering': '/images/bio-default.jpg',
            'marketing': '/images/marketing-default.jpg',
            'matrix': '/images/matrix-default.jpg',
            'new tech': '/images/tech-default.jpg',
            'open ai': '/images/openai-default.jpg',
            'phones': '/images/phones-default.jpg',
            'tech reviews': '/images/reviews-default.jpg',
            'hydrogen': '/images/hydrogen-default.jpg',
            'video games': '/images/games-default.jpg',
            'crypto': '/images/crypto-default.jpg',
            'crm tools': '/images/crm-default.jpg',
            'flipper': '/images/flipper-default.jpg',
            'matrix future': '/images/future-default.jpg',
            'trends': '/images/trends-default.jpg'
        };
        return defaultImages[category.toLowerCase()] || '/images/default-news.jpg';
    }

    cleanText(text) {
        return text.replace(/<[^>]*>/g, '').trim();
    }

    filterArticles(searchTerm = '') {
        this.filteredArticles = this.allArticles.filter(article => {
            const matchesCategory = this.currentCategory === 'all' || article.category === this.currentCategory;
            const matchesSearch = !searchTerm || 
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesCategory && matchesSearch;
        });
    }

    renderNews() {
        const container = document.getElementById('news-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            container.innerHTML = '';
            
            // Show loading state for categories that don't have articles yet
            if (this.currentCategory !== 'all' && articlesToShow.length === 0) {
                const categoryArticles = this.allArticles.filter(article => article.category === this.currentCategory);
                if (categoryArticles.length === 0 && this.isLoading) {
                    container.innerHTML = `
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading ${this.currentCategory} articles...</p>
                        </div>
                    `;
                    return;
                }
            }
        }

        articlesToShow.forEach(article => {
            const articleElement = this.createArticleElement(article);
            container.appendChild(articleElement);
        });

        this.updateLoadMoreButton();
        this.updateArticleCount();
    }

    createArticleElement(article) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'news-card';
        articleDiv.setAttribute('data-category', article.category);

        const pubDate = new Date(article.pubDate);
        const date = pubDate.toLocaleDateString();
        const time = pubDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeAgo = this.getTimeAgo(pubDate);
        const hasImage = article.image && article.image !== null && article.image !== '';

        if (article.type === 'video') {
            articleDiv.innerHTML = `
                <div class="news-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    <div class="news-category">${article.category}</div>
                    <div class="video-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p>${article.description.substring(0, 150)}...</p>
                    <div class="news-meta">
                        <span class="news-date">${date}</span>
                        <span class="news-time">${time}</span>
                        <span class="news-source">${article.feedName}</span>
                        <span class="news-time-ago">${timeAgo}</span>
                    </div>
                    <div class="news-actions">
                        <button class="btn btn-primary watch-video" data-video-id="${article.videoId}">
                            <i class="fas fa-play"></i> Watch Video
                        </button>
                        <a href="${article.link}" target="_blank" class="btn btn-secondary">
                            <i class="fas fa-external-link-alt"></i> View Source
                        </a>
                    </div>
                </div>
            `;
        } else {
            articleDiv.innerHTML = `
                ${hasImage ? `
                    <div class="news-image">
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                        <div class="news-category">${article.category}</div>
                    </div>
                ` : ''}
                <div class="news-content ${!hasImage ? 'no-image' : ''}">
                    <h3>${article.title}</h3>
                    <p>${article.description.substring(0, 200)}...</p>
                    <div class="news-meta">
                        <span class="news-date">${date}</span>
                        <span class="news-time">${time}</span>
                        <span class="news-source">${article.feedName}</span>
                        <span class="news-time-ago">${timeAgo}</span>
                    </div>
                    <div class="news-actions">
                        <a href="${article.link}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Read More
                        </a>
                    </div>
                </div>
            `;
        }

        // Add video player functionality
        const watchBtn = articleDiv.querySelector('.watch-video');
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                this.openVideoModal(article.videoId, article.title);
            });
        }

        return articleDiv;
    }

    openVideoModal(videoId, title) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <div class="video-modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    }

    loadMoreArticles() {
        this.currentPage++;
        this.renderNews();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-news');
        if (loadMoreBtn) {
            const hasMore = this.filteredArticles.length > this.currentPage * this.itemsPerPage;
            loadMoreBtn.style.display = hasMore ? 'block' : 'none';
        }
    }

    updateArticleCount() {
        const countElement = document.getElementById('article-count');
        if (countElement) {
            countElement.textContent = this.filteredArticles.length;
        }
        
        // Update total feeds count
        const totalFeedsElement = document.getElementById('total-feeds');
        if (totalFeedsElement) {
            let totalFeeds = 0;
            for (const [category, feeds] of Object.entries(this.feeds)) {
                totalFeeds += feeds.length;
            }
            totalFeedsElement.textContent = totalFeeds;
        }
    }

    updateActiveFilter() {
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-category="${this.currentCategory}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateLoadingState(isLoading) {
        const container = document.getElementById('news-container');
        const loadingIndicator = document.getElementById('news-loading');
        
        if (container && loadingIndicator) {
            if (isLoading) {
                // Show the loading indicator and clear the container
                loadingIndicator.classList.remove('hidden');
                container.innerHTML = '';
            } else {
                // Hide the loading indicator
                loadingIndicator.classList.add('hidden');
            }
        }
    }
    
    updateCategoryLoadingState(category, isLoading) {
        const categoryButton = document.querySelector(`[data-category="${category}"]`);
        if (categoryButton) {
            if (isLoading) {
                categoryButton.classList.add('loading');
                this.loadingCategories.add(category);
            } else {
                categoryButton.classList.remove('loading');
                this.loadingCategories.delete(category);
            }
        }
    }
    
    updateAllCategoryLoadingStates(isLoading) {
        const categoryButtons = document.querySelectorAll('.category-filter');
        categoryButtons.forEach(button => {
            const category = button.dataset.category;
            if (isLoading) {
                button.classList.add('loading');
                this.loadingCategories.add(category);
            } else {
                button.classList.remove('loading');
                this.loadingCategories.delete(category);
            }
        });
    }

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam && this.feeds[categoryParam]) {
            // Set the current category
            this.currentCategory = categoryParam;
            
            // Update the active filter button
            this.updateActiveFilter();
            
            // Filter and render articles
            this.filterArticles();
            this.renderNews();
            
            // Scroll to the news section if it exists
            const newsSection = document.querySelector('.news-listing');
            if (newsSection) {
                newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

// Initialize the news feed aggregator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('news-container')) {
        window.newsAggregator = new NewsFeedAggregator();
    }
}); 
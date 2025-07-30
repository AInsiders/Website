// Daily Updates Manager for A.Insiders
class DailyUpdatesManager {
    constructor() {
        this.webhookUrl = 'https://discord.com/api/webhooks/1399628142183972905/2aVGyUlHvjtU3Vy4lJBYBzb2ifRSJ3jujZpGWIBy48THARaHzyJIvOKA-ScAq3BLoNyF';
        this.updates = [];
        this.dailyPosts = [];
        this.currentDateFilter = 'all';
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadDailyUpdates();
        this.renderDailyPosts();
        this.updateStats();
    }

    setupEventListeners() {
        // Date filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('date-filter')) {
                const selectedDate = e.target.dataset.date;
                this.currentDateFilter = selectedDate;
                this.updateActiveDateFilter();
                this.renderDailyPosts();
            }
        });
    }

    async loadDailyUpdates() {
        this.isLoading = true;
        this.updateLoadingState(true);
        this.updateWebhookStatus('Connecting to Discord webhook...', 'connecting');

        try {
            // Fetch webhook messages (simulated for now - in production this would fetch from Discord API)
            const mockUpdates = this.generateMockUpdates();
            this.updates = mockUpdates;
            
            // Group updates by date
            this.groupUpdatesByDate();
            
            this.updateWebhookStatus('Connected successfully', 'online');
            console.log(`Loaded ${this.updates.length} updates across ${this.dailyPosts.length} days`);
            
        } catch (error) {
            console.error('Error loading daily updates:', error);
            this.updateWebhookStatus('Connection failed', 'offline');
        } finally {
            this.isLoading = false;
            this.updateLoadingState(false);
        }
    }

    generateMockUpdates() {
        // Generate mock updates for demonstration
        const mockUpdates = [];
        const sources = ['AI News', 'Cybersecurity Alert', 'Tech Update', 'Research Paper', 'Industry Report'];
        const categories = ['AI', 'Cybersecurity', 'Space', 'Robotics', 'Bioengineering'];
        
        // Generate updates for the last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Generate 2-5 updates per day
            const updatesPerDay = Math.floor(Math.random() * 4) + 2;
            
            for (let j = 0; j < updatesPerDay; j++) {
                const hour = Math.floor(Math.random() * 24);
                const minute = Math.floor(Math.random() * 60);
                const updateTime = new Date(date);
                updateTime.setHours(hour, minute, 0, 0);
                
                const source = sources[Math.floor(Math.random() * sources.length)];
                const category = categories[Math.floor(Math.random() * categories.length)];
                
                mockUpdates.push({
                    id: `update_${i}_${j}`,
                    title: this.generateMockTitle(category),
                    description: this.generateMockDescription(category),
                    content: this.generateMockContent(category),
                    source: source,
                    category: category,
                    timestamp: updateTime.toISOString(),
                    date: date.toISOString().split('T')[0],
                    url: `https://example.com/update/${i}_${j}`,
                    author: 'A.Insiders Bot',
                    attachments: Math.random() > 0.7 ? ['image.jpg'] : [],
                    embeds: Math.random() > 0.8 ? [{ title: 'Related Link', url: 'https://example.com' }] : []
                });
            }
        }
        
        return mockUpdates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    generateMockTitle(category) {
        const titles = {
            'AI': [
                'Breakthrough in Large Language Model Training',
                'New AI Algorithm Achieves 99% Accuracy',
                'OpenAI Releases GPT-5 Preview',
                'AI-Powered Medical Diagnosis System Launched',
                'Machine Learning Model Predicts Market Trends'
            ],
            'Cybersecurity': [
                'Critical Zero-Day Vulnerability Discovered',
                'New Ransomware Strain Targets Healthcare',
                'Advanced Threat Detection System Released',
                'Cybersecurity Framework Updated',
                'Major Data Breach Affects Millions'
            ],
            'Space': [
                'NASA Announces Mars Mission Success',
                'SpaceX Launches New Satellite Constellation',
                'Breakthrough in Propulsion Technology',
                'Exoplanet Discovery Confirmed',
                'International Space Station Extension Approved'
            ],
            'Robotics': [
                'Boston Dynamics Unveils New Robot',
                'Autonomous Vehicle Milestone Achieved',
                'Robotic Surgery System Approved',
                'Industrial Robot Efficiency Breakthrough',
                'Humanoid Robot Passes Turing Test'
            ],
            'Bioengineering': [
                'CRISPR Gene Editing Breakthrough',
                'Synthetic Biology Milestone Reached',
                'Bio-Printed Organs Show Promise',
                'Neural Interface Technology Advances',
                'Biomedical Device Revolution'
            ]
        };
        
        const categoryTitles = titles[category] || titles['AI'];
        return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
    }

    generateMockDescription(category) {
        const descriptions = {
            'AI': 'A significant advancement in artificial intelligence technology that promises to revolutionize how we approach machine learning and automation.',
            'Cybersecurity': 'Critical security update addressing emerging threats and vulnerabilities in modern digital infrastructure.',
            'Space': 'Major milestone in space exploration technology, pushing the boundaries of human achievement beyond Earth.',
            'Robotics': 'Innovative robotics development that enhances automation and human-robot collaboration capabilities.',
            'Bioengineering': 'Breakthrough in biological engineering that opens new possibilities for medical treatment and human enhancement.'
        };
        
        return descriptions[category] || descriptions['AI'];
    }

    generateMockContent(category) {
        return `This is a detailed update about the latest developments in ${category.toLowerCase()} technology. The update includes comprehensive analysis, technical details, and implications for the industry. Researchers and industry experts have been working on this breakthrough for months, and the results are now being shared with the community. This development represents a significant step forward in the field and opens up new possibilities for future innovation.`;
    }

    groupUpdatesByDate() {
        const grouped = {};
        
        this.updates.forEach(update => {
            const date = update.date;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(update);
        });
        
        // Convert to array and sort by date (newest first)
        this.dailyPosts = Object.entries(grouped)
            .map(([date, updates]) => ({
                date: date,
                updates: updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
                formattedDate: this.formatDate(date),
                updateCount: updates.length
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }

    renderDailyPosts() {
        const container = document.getElementById('daily-updates-container');
        if (!container) return;

        // Filter posts based on current date filter
        let postsToShow = this.dailyPosts;
        if (this.currentDateFilter !== 'all') {
            postsToShow = this.dailyPosts.filter(post => post.date === this.currentDateFilter);
        }

        if (postsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-updates">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No updates found</h3>
                    <p>No daily updates available for the selected date.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = postsToShow.map(post => this.createDailyPostHTML(post)).join('');
    }

    createDailyPostHTML(post) {
        const feedItemsHTML = post.updates.map(update => this.createFeedItemHTML(update)).join('');
        
        return `
            <div class="daily-post" data-date="${post.date}">
                <div class="daily-post-header">
                    <div class="daily-post-date">${post.formattedDate}</div>
                    <div class="daily-post-meta">${post.updateCount} update${post.updateCount !== 1 ? 's' : ''} • ${this.getTimeRange(post.updates)}</div>
                </div>
                <div class="daily-post-content">
                    ${feedItemsHTML}
                </div>
            </div>
        `;
    }

    createFeedItemHTML(update) {
        const time = new Date(update.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const timeAgo = this.getTimeAgo(new Date(update.timestamp));
        
        return `
            <div class="daily-feed-item">
                <div class="feed-item-header">
                    <div class="feed-source-icon">
                        <i class="fas fa-${this.getCategoryIcon(update.category)}"></i>
                    </div>
                    <div class="feed-source-name">${update.source}</div>
                    <div class="feed-time">${time} • ${timeAgo}</div>
                </div>
                <div class="feed-title">${update.title}</div>
                <div class="feed-description">${update.description}</div>
                <div class="feed-actions">
                    <a href="${update.url}" target="_blank" class="feed-btn primary">
                        <i class="fas fa-external-link-alt"></i>
                        Read More
                    </a>
                    <button class="feed-btn" onclick="window.dailyUpdatesManager.showFullContent('${update.id}')">
                        <i class="fas fa-expand-alt"></i>
                        View Details
                    </button>
                    <span class="feed-btn">
                        <i class="fas fa-tag"></i>
                        ${update.category}
                    </span>
                </div>
            </div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            'AI': 'brain',
            'Cybersecurity': 'shield-alt',
            'Space': 'rocket',
            'Robotics': 'robot',
            'Bioengineering': 'dna'
        };
        return icons[category] || 'newspaper';
    }

    getTimeRange(updates) {
        if (updates.length === 0) return '';
        
        const firstTime = new Date(updates[updates.length - 1].timestamp);
        const lastTime = new Date(updates[0].timestamp);
        
        if (firstTime.toDateString() === lastTime.toDateString()) {
            return `${firstTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        return 'Throughout the day';
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    updateActiveDateFilter() {
        document.querySelectorAll('.date-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-date="${this.currentDateFilter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateDateFilters() {
        const filtersContainer = document.getElementById('date-filters');
        if (!filtersContainer) return;

        // Keep the "All Updates" button
        const allButton = filtersContainer.querySelector('[data-date="all"]');
        filtersContainer.innerHTML = '';
        filtersContainer.appendChild(allButton);

        // Add date-specific filters
        this.dailyPosts.forEach(post => {
            const button = document.createElement('button');
            button.className = 'date-filter';
            button.dataset.date = post.date;
            button.textContent = post.formattedDate;
            filtersContainer.appendChild(button);
        });
    }

    updateStats() {
        const totalUpdates = this.updates.length;
        const daysCovered = this.dailyPosts.length;
        const latestUpdate = this.updates.length > 0 ? this.getTimeAgo(new Date(this.updates[0].timestamp)) : '-';

        document.getElementById('total-updates').textContent = totalUpdates;
        document.getElementById('days-covered').textContent = daysCovered;
        document.getElementById('latest-update').textContent = latestUpdate;
    }

    updateLoadingState(isLoading) {
        const container = document.getElementById('daily-updates-container');
        if (!container) return;

        if (isLoading) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading daily updates...</p>
                </div>
            `;
        }
    }

    updateWebhookStatus(message, status) {
        const statusElement = document.getElementById('webhook-status');
        const textElement = document.getElementById('webhook-status-text');
        
        if (statusElement) {
            statusElement.className = `webhook-status-indicator ${status}`;
        }
        
        if (textElement) {
            textElement.textContent = message;
        }
    }

    showFullContent(updateId) {
        const update = this.updates.find(u => u.id === updateId);
        if (!update) return;

        // Create a modal or expand the content
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${update.title}</h3>
                    <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="update-meta">
                        <span><i class="fas fa-user"></i> ${update.author}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(update.timestamp).toLocaleString()}</span>
                        <span><i class="fas fa-tag"></i> ${update.category}</span>
                    </div>
                    <div class="update-content">
                        <p>${update.content}</p>
                    </div>
                    <div class="update-actions">
                        <a href="${update.url}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Read Full Article
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }
}

// Initialize the daily updates manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('daily-updates-container')) {
        window.dailyUpdatesManager = new DailyUpdatesManager();
    }
}); 
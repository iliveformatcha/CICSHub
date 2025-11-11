// Enhanced Admin Dashboard Functionality
class AdminDashboard {
    constructor() {
        this.currentSection = 'analytics';
        this.editingItem = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.loadAnalytics();
        this.setupEventListeners();
        this.initializeAllSections();
    }

    checkAuthentication() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Please log in first.');
            window.location.href = 'index.html';
            return;
        }
        
        if (currentUser.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index.html';
            return;
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show selected section
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        
        // Update header
        this.updateSectionHeader(sectionName);
        
        this.currentSection = sectionName;
        
        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    updateSectionHeader(sectionName) {
        const titles = {
            'analytics': 'Analytics Dashboard',
            'announcements': 'Announcements Management',
            'rules': 'Rules & Guidelines',
            'letters': 'Official Letters',
            'programs': 'Programs & Events',
            'resolutions': 'Resolutions',
            'documents': 'Document Archive',
            'users': 'User Management',
            'feedback': 'Feedback Management',
            'settings': 'System Settings'
        };
        
        const descriptions = {
            'analytics': 'View platform statistics and insights',
            'announcements': 'Create and manage campus announcements',
            'rules': 'Manage rules and guidelines for students',
            'letters': 'Manage official letters and communications',
            'programs': 'Organize programs and events',
            'resolutions': 'Manage student council resolutions',
            'documents': 'Archive and manage important documents',
            'users': 'Manage user accounts and permissions',
            'feedback': 'Review and respond to student feedback',
            'settings': 'Configure system settings and preferences'
        };
        
        document.getElementById('sectionTitle').textContent = titles[sectionName];
        document.getElementById('sectionDescription').textContent = descriptions[sectionName];
    }

    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'announcements':
                this.loadAnnouncements();
                break;
            case 'rules':
                this.loadRules();
                break;
            case 'programs':
                this.loadPrograms();
                break;
            case 'documents':
                this.loadDocuments();
                break;
            case 'feedback':
                this.loadFeedback();
                break;
        }
    }

    loadAnalytics() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        
        // Update stats
        document.getElementById('totalUsers').textContent = users.filter(u => u.isActive !== false).length;
        document.getElementById('totalAnnouncements').textContent = posts.filter(p => p.section === 'announcements').length;
        document.getElementById('totalDocuments').textContent = posts.filter(p => p.section === 'documents').length;
        document.getElementById('totalEvents').textContent = events.length;
        
        // In a real application, you would update charts here
    }

    loadAnnouncements() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const announcements = posts.filter(post => post.section === 'announcements');
        const listElement = document.getElementById('announcementsList');
        
        if (announcements.length === 0) {
            listElement.innerHTML = this.createEmptyState('announcements', 'No announcements yet. Create your first announcement!');
            return;
        }
        
        listElement.innerHTML = announcements.map(announcement => `
            <div class="content-item" data-id="${announcement.id}">
                <div class="item-content">
                    <div class="item-header">
                        <h4>${this.escapeHtml(announcement.title)} ${announcement.pinned ? '<span class="badge pinned">Pinned</span>' : ''}</h4>
                        <span class="item-date">${this.formatDate(announcement.date)}</span>
                    </div>
                    <p>${this.escapeHtml(announcement.content)}</p>
                    <div class="item-meta">
                        <span class="author"><i class="fas fa-user"></i> ${announcement.author}</span>
                        ${announcement.files && announcement.files.length > 0 ? 
                            `<span class="files-count"><i class="fas fa-paperclip"></i> ${announcement.files.length} files</span>` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="adminApp.editAnnouncement('${announcement.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminApp.deleteAnnouncement('${announcement.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${!announcement.pinned ? 
                        `<button class="btn-secondary" onclick="adminApp.pinAnnouncement('${announcement.id}')" title="Pin">
                            <i class="fas fa-thumbtack"></i>
                        </button>` : 
                        `<button class="btn-secondary" onclick="adminApp.unpinAnnouncement('${announcement.id}')" title="Unpin">
                            <i class="fas fa-thumbtack"></i>
                        </button>`
                    }
                </div>
            </div>
        `).join('');
    }

    loadRules() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const rules = posts.filter(post => post.section === 'rules');
        const listElement = document.getElementById('rulesList');
        
        if (rules.length === 0) {
            listElement.innerHTML = this.createEmptyState('rules', 'No rules yet. Add your first rule!');
            return;
        }
        
        listElement.innerHTML = rules.map(rule => `
            <div class="content-item" data-id="${rule.id}">
                <div class="item-content">
                    <div class="item-header">
                        <h4>${this.escapeHtml(rule.title)} <span class="badge category">${rule.category}</span></h4>
                        <span class="item-date">${this.formatDate(rule.date)}</span>
                    </div>
                    <p>${this.escapeHtml(rule.content)}</p>
                    <div class="item-meta">
                        <span class="author"><i class="fas fa-user"></i> ${rule.author}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="adminApp.editRule('${rule.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminApp.deleteRule('${rule.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadPrograms() {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const listElement = document.getElementById('programsList');
        
        if (events.length === 0) {
            listElement.innerHTML = this.createEmptyState('events', 'No programs yet. Add your first program!');
            return;
        }
        
        listElement.innerHTML = events.map(event => `
            <div class="content-item" data-id="${event.id}">
                <div class="item-content">
                    <div class="item-header">
                        <h4>${this.escapeHtml(event.title)}</h4>
                        <span class="item-date">${this.formatDate(event.date)}</span>
                    </div>
                    <p>${this.escapeHtml(event.description)}</p>
                    <div class="item-meta">
                        <span class="location"><i class="fas fa-map-marker-alt"></i> ${event.location || 'TBA'}</span>
                        <span class="attendees"><i class="fas fa-users"></i> ${event.attendees ? event.attendees.length : 0} attendees</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="adminApp.editProgram('${event.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminApp.deleteProgram('${event.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadDocuments() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const documents = posts.filter(post => post.section === 'documents');
        const listElement = document.getElementById('documentsList');
        
        if (documents.length === 0) {
            listElement.innerHTML = this.createEmptyState('documents', 'No documents yet. Upload your first document!');
            return;
        }
        
        listElement.innerHTML = documents.map(document => `
            <div class="content-item" data-id="${document.id}">
                <div class="item-content">
                    <div class="item-header">
                        <h4>${this.escapeHtml(document.title)}</h4>
                        <span class="item-date">${this.formatDate(document.date)}</span>
                    </div>
                    <p>${this.escapeHtml(document.description || 'No description available')}</p>
                    <div class="item-meta">
                        <span class="author"><i class="fas fa-user"></i> ${document.author}</span>
                        <span class="file-type">${document.category || 'General'}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-secondary" onclick="adminApp.downloadDocument('${document.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-edit" onclick="adminApp.editDocument('${document.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminApp.deleteDocument('${document.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadFeedback() {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        const pendingFeedbacks = feedbacks.filter(f => !f.responded);
        const listElement = document.querySelector('.feedback-list');
        
        if (feedbacks.length === 0) {
            listElement.innerHTML = this.createEmptyState('feedback', 'No feedback submitted yet.');
            return;
        }
        
        listElement.innerHTML = `
            <div class="feedback-filters">
                <button class="filter-btn active" data-filter="all">All (${feedbacks.length})</button>
                <button class="filter-btn" data-filter="pending">Pending (${pendingFeedbacks.length})</button>
                <button class="filter-btn" data-filter="responded">Responded (${feedbacks.length - pendingFeedbacks.length})</button>
            </div>
            <div class="feedback-items">
                ${feedbacks.map(feedback => `
                    <div class="feedback-item ${feedback.responded ? 'responded' : 'pending'}" data-id="${feedback.id}">
                        <div class="feedback-header">
                            <div class="feedback-meta">
                                <strong>${this.escapeHtml(feedback.name)}</strong>
                                <span>${feedback.email}</span>
                                <span class="feedback-date">${this.formatDate(feedback.date)}</span>
                                <span class="status-badge ${feedback.responded ? 'responded' : 'pending'}">
                                    ${feedback.responded ? 'Responded' : 'Pending'}
                                </span>
                            </div>
                            <div class="feedback-actions">
                                ${!feedback.responded ? `
                                    <button class="btn-primary" onclick="adminApp.respondToFeedback('${feedback.id}')">
                                        <i class="fas fa-reply"></i> Respond
                                    </button>
                                ` : `
                                    <button class="btn-secondary" onclick="adminApp.viewResponse('${feedback.id}')">
                                        <i class="fas fa-eye"></i> View Response
                                    </button>
                                `}
                                <button class="btn-delete" onclick="adminApp.deleteFeedback('${feedback.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="feedback-content">
                            <h4>${this.escapeHtml(feedback.subject)}</h4>
                            <p>${this.escapeHtml(feedback.message)}</p>
                        </div>
                        ${feedback.response ? `
                            <div class="feedback-response">
                                <h5><i class="fas fa-reply"></i> Admin Response</h5>
                                <p>${this.escapeHtml(feedback.response)}</p>
                                <small>Responded on: ${this.formatDate(feedback.responseDate)}</small>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add filter functionality
        this.setupFeedbackFilters();
    }

    setupFeedbackFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const feedbackItems = document.querySelectorAll('.feedback-item');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active filter
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter items
                feedbackItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                    } else if (filter === 'pending') {
                        item.style.display = item.classList.contains('pending') ? 'block' : 'none';
                    } else if (filter === 'responded') {
                        item.style.display = item.classList.contains('responded') ? 'block' : 'none';
                    }
                });
            });
        });
    }

    createEmptyState(section, message) {
        const icons = {
            'announcements': 'fa-bullhorn',
            'rules': 'fa-book',
            'events': 'fa-calendar',
            'documents': 'fa-archive',
            'feedback': 'fa-comments'
        };
        
        return `
            <div class="empty-state">
                <i class="fas ${icons[section] || 'fa-inbox'}"></i>
                <h3>No ${section} yet</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // Modal Management
    openAnnouncementModal(editId = null) {
        this.openModal('announcement', editId);
    }

    openRulesModal(editId = null) {
        this.openModal('rules', editId);
    }

    openProgramsModal(editId = null) {
        this.openModal('programs', editId);
    }

    openDocumentsModal(editId = null) {
        this.openModal('documents', editId);
    }

    openModal(type, editId = null) {
        // This would open the appropriate modal for creating/editing content
        // In a full implementation, this would create and show modals dynamically
        console.log(`Opening ${type} modal for ${editId ? 'editing' : 'creating'}`);
        
        // For now, show a simple alert
        alert(`${editId ? 'Edit' : 'Create'} ${type} functionality would open here.`);
    }

    // CRUD Operations
    editAnnouncement(id) {
        this.openAnnouncementModal(id);
    }

    deleteAnnouncement(id) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            this.deleteItem('posts', id);
            this.loadAnnouncements();
            this.loadAnalytics();
            this.showNotification('Announcement deleted successfully!', 'success');
        }
    }

    pinAnnouncement(id) {
        this.updateItem('posts', id, { pinned: true });
        this.loadAnnouncements();
        this.showNotification('Announcement pinned!', 'success');
    }

    unpinAnnouncement(id) {
        this.updateItem('posts', id, { pinned: false });
        this.loadAnnouncements();
        this.showNotification('Announcement unpinned!', 'success');
    }

    editRule(id) {
        this.openRulesModal(id);
    }

    deleteRule(id) {
        if (confirm('Are you sure you want to delete this rule?')) {
            this.deleteItem('posts', id);
            this.loadRules();
            this.loadAnalytics();
            this.showNotification('Rule deleted successfully!', 'success');
        }
    }

    editProgram(id) {
        this.openProgramsModal(id);
    }

    deleteProgram(id) {
        if (confirm('Are you sure you want to delete this program?')) {
            this.deleteItem('events', id);
            this.loadPrograms();
            this.loadAnalytics();
            this.showNotification('Program deleted successfully!', 'success');
        }
    }

    editDocument(id) {
        this.openDocumentsModal(id);
    }

    deleteDocument(id) {
        if (confirm('Are you sure you want to delete this document?')) {
            this.deleteItem('posts', id);
            this.loadDocuments();
            this.loadAnalytics();
            this.showNotification('Document deleted successfully!', 'success');
        }
    }

    downloadDocument(id) {
        // This would handle document download
        alert('Document download would start here.');
    }

    respondToFeedback(id) {
        const response = prompt('Enter your response to this feedback:');
        if (response) {
            this.updateItem('feedbacks', id, {
                response: response,
                responseDate: new Date().toISOString(),
                responded: true
            });
            this.loadFeedback();
            this.showNotification('Response sent successfully!', 'success');
        }
    }

    viewResponse(id) {
        const feedback = this.getItem('feedbacks', id);
        if (feedback && feedback.response) {
            alert(`Admin Response:\n\n${feedback.response}\n\nDate: ${this.formatDate(feedback.responseDate)}`);
        }
    }

    deleteFeedback(id) {
        if (confirm('Are you sure you want to delete this feedback?')) {
            this.deleteItem('feedbacks', id);
            this.loadFeedback();
            this.showNotification('Feedback deleted successfully!', 'success');
        }
    }

    // Utility Methods
    deleteItem(collection, id) {
        const items = JSON.parse(localStorage.getItem(collection)) || [];
        const updatedItems = items.filter(item => item.id !== id);
        localStorage.setItem(collection, JSON.stringify(updatedItems));
    }

    updateItem(collection, id, updates) {
        const items = JSON.parse(localStorage.getItem(collection)) || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            localStorage.setItem(collection, JSON.stringify(items));
        }
    }

    getItem(collection, id) {
        const items = JSON.parse(localStorage.getItem(collection)) || [];
        return items.find(item => item.id === id);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });

        // Search functionality
        document.getElementById('adminSearch')?.addEventListener('input', (e) => {
            this.handleAdminSearch(e.target.value);
        });

        // Settings tabs
        document.querySelectorAll('.settings-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchSettingsTab(tabName);
            });
        });
    }

    handleAdminSearch(query) {
        // Implement admin search functionality
        console.log('Admin searching for:', query);
    }

    switchSettingsTab(tabName) {
        // Update active tab
        document.querySelectorAll('.settings-tabs .tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.settings-tabs .tab[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    initializeAllSections() {
        // Initialize all sections with their respective data
        this.loadAnnouncements();
        this.loadRules();
        this.loadPrograms();
        this.loadDocuments();
        this.loadFeedback();
    }
}

// Initialize the admin dashboard
const adminApp = new AdminDashboard();

// Make adminApp globally available for onclick handlers
window.adminApp = adminApp;
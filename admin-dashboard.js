// Global variables
let currentSection = 'analytics';
let editingItem = null;

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Access denied. Please log in as administrator.');
        window.location.href = 'index.html';
        return;
    }

    initializeAdminDashboard();
});

function initializeAdminDashboard() {
    setupNavigation();
    loadAnalytics();
    loadAllSections();
    setupModals();
}

// Navigation setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update header
    updateSectionHeader(sectionName);
    
    currentSection = sectionName;
}

function updateSectionHeader(sectionName) {
    const titles = {
        'analytics': 'Analytics Dashboard',
        'announcements': 'Announcements Management',
        'rules': 'Rules & Guidelines',
        'letters': 'Official Letters',
        'programs': 'Programs & Events',
        'resolutions': 'Resolutions',
        'documents': 'Document Archive'
    };
    
    const descriptions = {
        'analytics': 'View platform statistics and insights',
        'announcements': 'Create and manage campus announcements',
        'rules': 'Manage rules and guidelines for students',
        'letters': 'Manage official letters and communications',
        'programs': 'Organize programs and events',
        'resolutions': 'Manage student council resolutions',
        'documents': 'Archive and manage important documents'
    };
    
    document.getElementById('sectionTitle').textContent = titles[sectionName];
    document.getElementById('sectionDescription').textContent = descriptions[sectionName];
}

// Analytics
function loadAnalytics() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const documents = JSON.parse(localStorage.getItem('documents')) || [];
    const programs = JSON.parse(localStorage.getItem('programs')) || [];
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalAnnouncements').textContent = announcements.length;
    document.getElementById('totalDocuments').textContent = documents.length;
    document.getElementById('totalEvents').textContent = programs.length;
}

// Announcements Management
function loadAllSections() {
    loadAnnouncements();
    loadRules();
    loadDocuments();
    // Load other sections similarly
}

function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const listElement = document.getElementById('announcementsList');
    
    if (announcements.length === 0) {
        listElement.innerHTML = '<div class="empty-state">No announcements yet. Create your first announcement!</div>';
        return;
    }
    
    listElement.innerHTML = announcements.map(announcement => `
        <div class="content-item" data-id="${announcement.id}">
            <div class="item-content">
                <h4>${announcement.title} ${announcement.pinned ? '<span class="badge pinned">Pinned</span>' : ''}</h4>
                <p>${announcement.content}</p>
                <div class="item-meta">
                    <span class="date">${formatDate(announcement.date)}</span>
                    ${announcement.files && announcement.files.length > 0 ? 
                        `<span class="files-count"><i class="fas fa-paperclip"></i> ${announcement.files.length} files</span>` : ''}
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editAnnouncement('${announcement.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteAnnouncement('${announcement.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function openAnnouncementModal(editId = null) {
    const modal = document.getElementById('announcementModal');
    const form = document.getElementById('announcementForm');
    const title = document.getElementById('announcementModalTitle');
    
    if (editId) {
        title.textContent = 'Edit Announcement';
        const announcement = getAnnouncementById(editId);
        if (announcement) {
            document.getElementById('announcementId').value = announcement.id;
            document.getElementById('announcementTitle').value = announcement.title;
            document.getElementById('announcementContent').value = announcement.content;
            document.getElementById('announcementPinned').checked = announcement.pinned || false;
        }
    } else {
        title.textContent = 'Create New Announcement';
        form.reset();
    }
    
    modal.style.display = 'flex';
}

// Announcement Form Handler
document.getElementById('announcementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('announcementId').value || generateId();
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    const pinned = document.getElementById('announcementPinned').checked;
    const filesInput = document.getElementById('announcementFiles');
    
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    // Handle file upload
    const files = [];
    if (filesInput.files.length > 0) {
        for (let file of filesInput.files) {
            files.push({
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified
            });
        }
    }
    
    const announcementData = {
        id,
        title,
        content,
        pinned,
        date: new Date().toISOString(),
        files,
        author: 'Admin'
    };
    
    if (document.getElementById('announcementId').value) {
        // Update existing
        const index = announcements.findIndex(a => a.id === id);
        if (index !== -1) {
            announcements[index] = { ...announcements[index], ...announcementData };
        }
    } else {
        // Create new
        announcements.push(announcementData);
    }
    
    localStorage.setItem('announcements', JSON.stringify(announcements));
    closeModal('announcementModal');
    loadAnnouncements();
    loadAnalytics();
    alert('Announcement saved successfully!');
});

function editAnnouncement(id) {
    openAnnouncementModal(id);
}

function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        loadAnnouncements();
        loadAnalytics();
        alert('Announcement deleted successfully!');
    }
}

// Rules Management (Similar structure)
function loadRules() {
    const rules = JSON.parse(localStorage.getItem('rules')) || [];
    const listElement = document.getElementById('rulesList');
    
    if (rules.length === 0) {
        listElement.innerHTML = '<div class="empty-state">No rules yet. Add your first rule!</div>';
        return;
    }
    
    listElement.innerHTML = rules.map(rule => `
        <div class="content-item" data-id="${rule.id}">
            <div class="item-content">
                <h4>${rule.title} <span class="badge category">${rule.category}</span></h4>
                <p>${rule.content}</p>
                <div class="item-meta">
                    <span class="date">${formatDate(rule.date)}</span>
                    ${rule.files && rule.files.length > 0 ? 
                        `<span class="files-count"><i class="fas fa-paperclip"></i> ${rule.files.length} files</span>` : ''}
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editRule('${rule.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteRule('${rule.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function openRulesModal(editId = null) {
    // Similar to openAnnouncementModal
}

// Utility Functions
function getAnnouncementById(id) {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    return announcements.find(a => a.id === id);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function setupModals() {
    // Close modals when clicking X
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});

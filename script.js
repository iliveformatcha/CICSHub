// User data storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
let events = JSON.parse(localStorage.getItem('events')) || [];
let currentCalendarView = 'month'; // 'month' or 'list'
let currentDate = new Date();

// Default admin account
if (!users.find(user => user.username === 'admin')) {
    users.push({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@studentcouncil.edu',
        studentId: 'ADMIN001'
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Add sample events if none exist
if (events.length === 0) {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    events = [
        {
            id: 1,
            title: 'Student Council Meeting',
            description: 'Monthly student council meeting to discuss upcoming events and initiatives.',
            date: today.toISOString().split('T')[0],
            time: '14:00',
            venue: 'Main Conference Room',
            category: 'meeting',
            author: 'admin',
            created: today.toLocaleDateString(),
            fileIds: []
        },
        {
            id: 2,
            title: 'Sports Festival',
            description: 'Annual sports festival with various competitions and games.',
            date: nextWeek.toISOString().split('T')[0],
            time: '09:00',
            venue: 'School Grounds',
            category: 'sports',
            author: 'admin',
            created: today.toLocaleDateString(),
            fileIds: []
        },
        {
            id: 3,
            title: 'Cultural Night',
            description: 'An evening celebrating diverse cultures with performances and food.',
            date: nextMonth.toISOString().split('T')[0],
            time: '18:00',
            venue: 'Auditorium',
            category: 'cultural',
            author: 'admin',
            created: today.toLocaleDateString(),
            fileIds: []
        }
    ];
    localStorage.setItem('events', JSON.stringify(events));
}

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userWelcome = document.getElementById('userWelcome');
const contentTitle = document.getElementById('contentTitle');
const contentBody = document.getElementById('contentBody');
const sidebarMenu = document.querySelector('.sidebar-menu');
const exploreBtn = document.getElementById('exploreBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

// Section titles
const sectionTitles = {
    announcements: 'Announcements',
    rules: 'Rules & Guidelines',
    letters: 'Official Letters',
    events: 'Programs & Events',
    resolutions: 'Resolutions',
    files: 'Available Files',
    feedback: 'Student Feedback'
};

// Enhanced Modal functionality
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (modal === loginModal) {
        loginMessage.textContent = '';
        loginForm.reset();
    }
    if (modal === registerModal) {
        registerMessage.textContent = '';
        registerForm.reset();
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === loginModal) {
        closeModal(loginModal);
    }
    if (event.target === registerModal) {
        closeModal(registerModal);
    }
    if (event.target === document.getElementById('eventModal')) {
        closeModal(document.getElementById('eventModal'));
    }
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Student Council Hub initialized');
    
    // Check if user is already logged in
    if (currentUser) {
        console.log('User already logged in:', currentUser.username);
        showDashboard();
    } else {
        console.log('No user logged in');
    }
    
    // Initialize modal event listeners
    initializeModalListeners();
    
    // Add some sample data if none exists
    initializeSampleData();
});

function initializeModalListeners() {
    // Login/Register buttons
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
    
    // Close modals with close button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        }
    });
    
    // Event modal close functionality
    const eventModal = document.getElementById('eventModal');
    if (eventModal) {
        const cancelEventBtn = document.getElementById('cancelEventBtn');
        if (cancelEventBtn) {
            cancelEventBtn.addEventListener('click', function() {
                closeModal(eventModal);
            });
        }
    }
    
    // Explore and Learn More buttons
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            document.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            window.location.href = 'about.html';
        });
    }
}

function initializeSampleData() {
    // Add sample posts if none exist
    if (posts.length === 0) {
        const samplePosts = [
            {
                id: 1,
                section: 'announcements',
                content: 'Welcome to the Student Council Hub! This is your central platform for all student council announcements, events, and important information.',
                author: 'admin',
                date: new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                fileIds: []
            },
            {
                id: 2,
                section: 'rules',
                content: 'Student Council Rules and Guidelines:\n\n1. All members must attend weekly meetings\n2. Respect all opinions during discussions\n3. Submit reports on time\n4. Maintain academic excellence',
                author: 'admin',
                date: new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                fileIds: []
            }
        ];
        
        posts = samplePosts;
        localStorage.setItem('posts', JSON.stringify(posts));
    }
}

// Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // Validate inputs
        if (!username || !password || !role) {
            loginMessage.textContent = 'Please fill in all fields';
            loginMessage.style.color = 'var(--danger)';
            return;
        }
        
        // Find user
        const user = users.find(u => u.username === username && u.role === role);
        
        if (user && user.password === password) {
            // Successful login
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loginMessage.textContent = 'Login successful!';
            loginMessage.style.color = 'var(--success)';
            
            // Redirect to dashboard after a brief delay
            setTimeout(() => {
                closeModal(loginModal);
                showDashboard();
            }, 1000);
        } else {
            // Failed login
            loginMessage.textContent = 'Invalid username, password, or role';
            loginMessage.style.color = 'var(--danger)';
        }
    });
}

// Register Form Submission
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('regEmail').value;
        const studentId = document.getElementById('studentId').value;
        
        // Validate inputs
        if (!username || !password || !confirmPassword || !email || !studentId) {
            registerMessage.textContent = 'Please fill in all fields';
            registerMessage.style.color = 'var(--danger)';
            return;
        }
        
        if (password !== confirmPassword) {
            registerMessage.textContent = 'Passwords do not match';
            registerMessage.style.color = 'var(--danger)';
            return;
        }
        
        // Check if username already exists
        if (users.find(u => u.username === username)) {
            registerMessage.textContent = 'Username already exists';
            registerMessage.style.color = 'var(--danger)';
            return;
        }
        
        // Create new user
        const newUser = {
            username,
            password,
            role: 'student',
            email,
            studentId
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        registerMessage.textContent = 'Registration successful! You can now log in.';
        registerMessage.style.color = 'var(--success)';
        
        // Clear form
        registerForm.reset();
        
        // Close modal after a delay
        setTimeout(() => {
            closeModal(registerModal);
        }, 2000);
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        showLogoutConfirmation();
    });
}

// Show logout confirmation
function showLogoutConfirmation() {
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal';
    confirmationModal.style.display = 'block';
    
    confirmationModal.innerHTML = `
        <div class="modal-content" style="max-width: 450px; text-align: center; padding: 2.5rem; background: white; color: var(--dark);">
            <div class="logout-confirmation-icon" style="margin-bottom: 1.5rem;">
                <i class="fas fa-sign-out-alt" style="font-size: 4rem; color: var(--warning);"></i>
            </div>
            
            <h2 style="color: var(--text-primary); margin-bottom: 0.8rem; font-size: 1.8rem; font-weight: 600;">
                Confirm Logout
            </h2>
            
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">
                Are you sure you want to log out of your account?
            </p>
            
            <div class="logout-confirmation-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button type="button" class="btn-secondary" id="cancelLogoutBtn" style="
                    background: #f8f9fa;
                    color: var(--dark);
                    border: 1px solid #ddd;
                    padding: 0.8rem 1.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    min-width: 120px;
                    justify-content: center;
                ">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button type="button" class="btn-primary warning" id="confirmLogoutBtn" style="
                    background: var(--warning);
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    min-width: 120px;
                    justify-content: center;
                ">
                    <i class="fas fa-sign-out-alt"></i> Yes, Log Out
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
    
    // Add hover effects
    const cancelBtn = document.getElementById('cancelLogoutBtn');
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    
    cancelBtn.addEventListener('mouseenter', function() {
        this.style.background = '#e9ecef';
        this.style.transform = 'translateY(-1px)';
    });
    
    cancelBtn.addEventListener('mouseleave', function() {
        this.style.background = '#f8f9fa';
        this.style.transform = 'translateY(0)';
    });
    
    confirmBtn.addEventListener('mouseenter', function() {
        this.style.background = '#e67e22';
        this.style.transform = 'translateY(-1px)';
    });
    
    confirmBtn.addEventListener('mouseleave', function() {
        this.style.background = 'var(--warning)';
        this.style.transform = 'translateY(0)';
    });
    
    // Add event listeners for confirmation buttons
    confirmBtn.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        confirmationModal.remove();
        hideDashboard();
        showNotification('You have been logged out successfully.', 'success');
    });
    
    cancelBtn.addEventListener('click', function() {
        confirmationModal.remove();
        showNotification('Logout cancelled.', 'info');
    });
    
    // Close modal when clicking outside
    confirmationModal.onclick = function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.remove();
        }
    };
    
    // Close modal with Escape key
    const closeModalHandler = function(e) {
        if (e.key === 'Escape') {
            confirmationModal.remove();
            document.removeEventListener('keydown', closeModalHandler);
        }
    };
    document.addEventListener('keydown', closeModalHandler);
}

// Show dashboard
function showDashboard() {
    document.querySelector('nav').style.display = 'none';
    const hero = document.querySelector('.hero');
    const features = document.querySelector('.features');
    if (hero) hero.style.display = 'none';
    if (features) features.style.display = 'none';
    dashboard.style.display = 'flex';
    
    // Update welcome message
    userWelcome.textContent = `Welcome, ${currentUser.username}!`;
    
    // Update sidebar menu based on user role
    updateSidebarMenu();
    
    // Load default section
    loadSection('announcements');
}

// Update sidebar menu based on user role
function updateSidebarMenu() {
    const sidebarMenu = document.querySelector('.sidebar-menu');
    
    // Base menu items for all users
    let menuHTML = `
        <li><a href="#" data-section="announcements"><i class="fas fa-bullhorn"></i> Announcements</a></li>
        <li><a href="#" data-section="rules"><i class="fas fa-gavel"></i> Rules & Guidelines</a></li>
        <li><a href="#" data-section="letters"><i class="fas fa-envelope"></i> Official Letters</a></li>
        <li><a href="#" data-section="events"><i class="fas fa-calendar-alt"></i> Programs & Events</a></li>
        <li><a href="#" data-section="resolutions"><i class="fas fa-file-contract"></i> Resolutions</a></li>
        <li><a href="#" data-section="files"><i class="fas fa-folder-open"></i> Available Files</a></li>
        <li><a href="#" data-section="feedback"><i class="fas fa-comments"></i> Student Feedback</a></li>
    `;
    
    sidebarMenu.innerHTML = menuHTML;
    
    // Re-attach event listeners to new menu items
    document.querySelectorAll('.sidebar-menu a').forEach(menuItem => {
        menuItem.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            console.log('Loading section:', section);
            loadSection(section);
        });
    });
}

// Hide dashboard
function hideDashboard() {
    document.querySelector('nav').style.display = 'block';
    const hero = document.querySelector('.hero');
    const features = document.querySelector('.features');
    if (hero) hero.style.display = 'flex';
    if (features) features.style.display = 'block';
    dashboard.style.display = 'none';
}

// Enhanced section loading
function loadSection(section) {
    console.log('Loading section:', section);
    
    // Update active menu item
    document.querySelectorAll('.sidebar-menu a').forEach(item => {
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Set content title
    contentTitle.textContent = sectionTitles[section] || 'Dashboard';
    
    // Show/hide add post button based on user role and section
    const addPostBtn = document.getElementById('addPostBtn');
    if (addPostBtn) {
        if (currentUser.role === 'admin' && section !== 'files' && section !== 'feedback') {
            addPostBtn.style.display = 'block';
            addPostBtn.onclick = function() {
                // Focus on post content textarea
                const postContent = document.getElementById('postContent');
                if (postContent) {
                    postContent.focus();
                }
            };
        } else {
            addPostBtn.style.display = 'none';
        }
    }
    
    // Clean up orphaned files before loading any section
    const orphanedCount = cleanupOrphanedFiles();
    if (orphanedCount > 0) {
        console.log(`Automatically removed ${orphanedCount} orphaned files`);
    }
    
    // Handle different sections
    switch(section) {
        case 'files':
            loadAvailableFiles();
            break;
        case 'feedback':
            loadFeedbackSection();
            break;
        case 'events':
            loadEventsSection();
            break;
        default:
            loadDefaultSection(section);
    }
}

// Load default sections (announcements, rules, etc.)
function loadDefaultSection(section) {
    let sectionPosts = posts.filter(post => post.section === section);
    let sectionFiles = uploadedFiles.filter(file => file.section === section);
    
    let contentHTML = '';
    
    // Add post form for admin (only for non-file, non-feedback sections)
    if (currentUser.role === 'admin') {
        contentHTML += `
            <div class="post-form" id="postForm">
                <h3><i class="fas fa-plus-circle"></i> Create New ${sectionTitles[section]}</h3>
                <textarea id="postContent" placeholder="Enter your ${sectionTitles[section].toLowerCase()} here..." style="width: 100%; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; min-height: 120px; font-family: inherit; resize: vertical;"></textarea>
                
                <div class="file-upload" style="margin: 1rem 0;">
                    <label for="postFiles" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);">
                        <i class="fas fa-paperclip"></i> Attach Files (Optional - Multiple files allowed)
                    </label>
                    <input type="file" id="postFiles" multiple style="width: 100%; padding: 0.8rem; border: 2px solid #e2e8f0; border-radius: 8px;">
                    <small style="display: block; margin-top: 0.5rem; color: var(--text-secondary);">Supported files: Images, PDF, Text documents (Max: 5MB per file)</small>
                    <div id="fileList" class="file-list" style="margin-top: 0.5rem;"></div>
                </div>
                
                <button type="button" class="btn-primary" id="submitPost" style="padding: 1rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-paper-plane"></i> Post
                </button>
            </div>
        `;
    }
    
    // Display posts
    if (sectionPosts.length > 0) {
        contentHTML += `
            <div class="posts-section" style="margin-top: 2rem;">
                <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-newspaper"></i> ${sectionTitles[section]} (${sectionPosts.length})
                </h3>
                ${sectionPosts.map(post => {
                    const postFiles = uploadedFiles.filter(file => post.fileIds && post.fileIds.includes(file.id));
                    const imageFiles = postFiles.filter(f => f.type.startsWith('image/'));
                    const otherFiles = postFiles.filter(f => !f.type.startsWith('image/'));
                    
                    const isOwnPost = currentUser && currentUser.role === 'admin';
                    
                    return `
                        <div class="post-item" style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div class="post-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                                <div class="post-author-info" style="display: flex; flex-direction: column; gap: 0.3rem; flex: 1;">
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;"><i class="fas fa-user"></i> Posted by: ${post.author}</span>
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;"><i class="fas fa-calendar"></i> Date: ${post.date}</span>
                                    ${post.lastEdited ? `<span style="color: var(--text-secondary); font-size: 0.9rem;"><i class="fas fa-edit"></i> Edited: ${post.lastEdited}</span>` : ''}
                                    ${post.fileIds && post.fileIds.length > 0 ? `<span style="color: var(--text-secondary); font-size: 0.9rem;"><i class="fas fa-paperclip"></i> ${post.fileIds.length} file(s)</span>` : ''}
                                </div>
                                ${isOwnPost ? `
                                <div class="post-actions" style="display: flex; gap: 0.5rem;">
                                    <button class="btn-edit" onclick="editPost(${post.id})" style="background: var(--warning); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn-delete" onclick="deletePost(${post.id})" style="background: var(--danger); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                                ` : ''}
                            </div>
                            <div class="post-content" style="color: var(--text-primary); line-height: 1.6; margin-bottom: 1rem;">
                                ${post.content.replace(/\n/g, '<br>')}
                            </div>
                            
                            ${imageFiles.length > 0 ? displayImageGallery(imageFiles.map(f => f.id)) : ''}
                            
                            ${otherFiles.length > 0 ? `
                            <div class="post-attachments" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                                <h4 style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px; color: var(--text-primary);">
                                    <i class="fas fa-paperclip"></i> Attachments (${otherFiles.length}):
                                </h4>
                                ${otherFiles.map(file => `
                                    <div class="attachment-item" style="display: flex; align-items: center; gap: 10px; padding: 0.8rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                                        ${getFileIcon(file.type)}
                                        <span style="flex: 1; word-break: break-word; color: var(--text-primary);">${file.name}</span>
                                        <div class="attachment-actions" style="display: flex; gap: 0.5rem;">
                                            <button class="btn-small" onclick="previewFile(${file.id})" style="background: var(--primary); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                                <i class="fas fa-eye"></i> View
                                            </button>
                                            <button class="btn-small" onclick="downloadFile(${file.id})" style="background: var(--secondary); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                                <i class="fas fa-download"></i> Download
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        contentHTML += `
            <div class="welcome-message" style="text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-inbox" style="font-size: 4rem; margin-bottom: 1.5rem; color: var(--primary); opacity: 0.7;"></i>
                <h3 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary);">No ${sectionTitles[section].toLowerCase()} yet</h3>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">Check back later for updates.</p>
            </div>
        `;
    }
    
    contentBody.innerHTML = contentHTML;
    
    // Add event listener for post submission (admin only)
    if (currentUser.role === 'admin') {
        const submitPostBtn = document.getElementById('submitPost');
        const fileInput = document.getElementById('postFiles');
        const fileList = document.getElementById('fileList');
        
        // Show selected files
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                fileList.innerHTML = '';
                if (this.files.length > 0) {
                    fileList.innerHTML = `<strong>Selected files (${this.files.length}):</strong>`;
                    Array.from(this.files).forEach(file => {
                        const fileItem = document.createElement('div');
                        fileItem.className = 'file-list-item';
                        fileItem.innerHTML = `
                            <span>📄 ${file.name} (${formatFileSize(file.size)})</span>
                        `;
                        fileList.appendChild(fileItem);
                    });
                }
            });
        }
        
        if (submitPostBtn) {
            submitPostBtn.addEventListener('click', async function() {
                const postContent = document.getElementById('postContent').value;
                const postFiles = document.getElementById('postFiles').files;
                
                if (!postContent.trim()) {
                    alert('Please enter some content for your post');
                    return;
                }
                
                // Validate file sizes
                let validFiles = true;
                Array.from(postFiles).forEach(file => {
                    if (file.size > 5 * 1024 * 1024) {
                        alert(`File "${file.name}" exceeds 5MB limit`);
                        validFiles = false;
                    }
                });
                
                if (!validFiles) return;
                
                // Show loading state
                const originalText = submitPostBtn.innerHTML;
                submitPostBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
                submitPostBtn.disabled = true;
                
                try {
                    // Upload files if present
                    let fileDataArray = [];
                    if (postFiles.length > 0) {
                        try {
                            fileDataArray = await handleFileUpload(postFiles, section);
                        } catch (error) {
                            alert('Error uploading files: ' + error.message);
                            return;
                        }
                    }
                    
                    const newPost = {
                        id: Date.now(),
                        section: section,
                        content: postContent,
                        author: currentUser.username,
                        date: new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fileIds: fileDataArray.map(file => file.id)
                    };
                    
                    posts.push(newPost);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    
                    // Clear form
                    document.getElementById('postContent').value = '';
                    document.getElementById('postFiles').value = '';
                    fileList.innerHTML = '';
                    
                    // Reload section to show new post
                    loadSection(section);
                    
                    // Show success message
                    showNotification(`Post created successfully with ${fileDataArray.length} files!`, 'success');
                    
                } catch (error) {
                    console.error('Error creating post:', error);
                    showNotification('Error creating post. Please try again.', 'error');
                } finally {
                    // Restore button state
                    submitPostBtn.innerHTML = originalText;
                    submitPostBtn.disabled = false;
                }
            });
        }
    }
}

// Enhanced file upload handler
function handleFileUpload(files, section) {
    return new Promise((resolve, reject) => {
        if (!files || files.length === 0) {
            resolve([]);
            return;
        }
        
        const uploadPromises = Array.from(files).map(file => {
            return new Promise((fileResolve, fileReject) => {
                // Validate file size
                if (file.size > 5 * 1024 * 1024) {
                    fileReject(new Error(`File "${file.name}" exceeds 5MB limit`));
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileData = {
                        id: Date.now() + Math.random(), // Unique ID
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        content: e.target.result,
                        section: section,
                        uploadDate: new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        uploadedBy: currentUser.username
                    };
                    fileResolve(fileData);
                };
                reader.onerror = () => fileReject(new Error(`Failed to read file: ${file.name}`));
                reader.readAsDataURL(file);
            });
        });
        
        Promise.all(uploadPromises)
            .then(fileDataArray => {
                uploadedFiles.push(...fileDataArray);
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                resolve(fileDataArray);
            })
            .catch(reject);
    });
}

// File download handler
function downloadFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) {
        alert('File not found!');
        return;
    }
    
    try {
        // Create a temporary link for download
        const link = document.createElement('a');
        link.href = file.content;
        link.download = file.name;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`Download started: ${file.name}`, 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Error downloading file. Please try again.', 'error');
    }
}

// Delete file completely from system
function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file? This will remove it from all posts and cannot be undone.')) {
        return;
    }
    
    // Remove file from uploadedFiles
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    
    // Remove file references from all posts
    posts.forEach(post => {
        if (post.fileIds && post.fileIds.includes(fileId)) {
            post.fileIds = post.fileIds.filter(id => id !== fileId);
        }
    });
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Remove file references from all events
    events.forEach(event => {
        if (event.fileIds && event.fileIds.includes(fileId)) {
            event.fileIds = event.fileIds.filter(id => id !== fileId);
        }
    });
    localStorage.setItem('events', JSON.stringify(events));
    
    // Reload current section
    const activeSection = document.querySelector('.sidebar-menu a.active')?.getAttribute('data-section') || 'announcements';
    loadSection(activeSection);
    
    // If we're in the files section, reload it to reflect changes
    if (activeSection === 'files') {
        loadAvailableFiles();
    }
    
    showNotification('File deleted successfully!', 'success');
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to get file type description
function getFileTypeDescription(fileType) {
    const typeMap = {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word Document (.docx)',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel Spreadsheet (.xlsx)',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint Presentation (.pptx)',
        'application/msword': 'Microsoft Word Document (.doc)',
        'application/vnd.ms-excel': 'Microsoft Excel Spreadsheet (.xls)',
        'application/vnd.ms-powerpoint': 'Microsoft PowerPoint Presentation (.ppt)',
        'application/zip': 'ZIP Archive',
        'application/x-rar-compressed': 'RAR Archive',
        'audio/mpeg': 'MP3 Audio File',
        'video/mp4': 'MP4 Video File',
        'text/csv': 'CSV File',
        'application/json': 'JSON File',
        'text/plain': 'Text File',
        'text/html': 'HTML File',
        'text/css': 'CSS File',
        'application/javascript': 'JavaScript File'
    };
    
    return typeMap[fileType] || fileType || 'Unknown File Type';
}

// Enhanced file icon function
function getFileIcon(fileType) {
    const iconMap = {
        // Images
        'image/': 'fa-file-image',
        
        // Documents
        'application/pdf': 'fa-file-pdf',
        'application/msword': 'fa-file-word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
        
        // Spreadsheets
        'application/vnd.ms-excel': 'fa-file-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa-file-excel',
        
        // Presentations
        'application/vnd.ms-powerpoint': 'fa-file-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa-file-powerpoint',
        
        // Text
        'text/': 'fa-file-alt',
        
        // Code
        'application/json': 'fa-file-code',
        'application/javascript': 'fa-file-code',
        'text/html': 'fa-file-code',
        'text/css': 'fa-file-code',
        
        // Archives
        'application/zip': 'fa-file-archive',
        'application/x-rar-compressed': 'fa-file-archive',
        
        // Audio
        'audio/': 'fa-file-audio',
        
        // Video
        'video/': 'fa-file-video'
    };

    for (const [pattern, icon] of Object.entries(iconMap)) {
        if (pattern.endsWith('/') && fileType.startsWith(pattern.slice(0, -1))) {
            return `<i class="fas ${icon}"></i>`;
        } else if (fileType === pattern) {
            return `<i class="fas ${icon}"></i>`;
        }
    }
    
    return '<i class="fas fa-file"></i>';
}

// Enhanced File Preview Handler - Google Classroom Style with multiple file type support
function previewFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) {
        alert('File not found!');
        return;
    }

    // Create Google Classroom style preview modal
    const previewModal = document.createElement('div');
    previewModal.className = 'modal google-classroom-modal';
    previewModal.style.display = 'block';
    
    previewModal.innerHTML = `
        <div class="modal-content google-classroom-preview">
            <div class="gc-header">
                <div class="gc-header-left">
                    <button class="gc-close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <div class="gc-file-info">
                        <div class="gc-file-icon">${getFileIcon(file.type)}</div>
                        <div class="gc-file-details">
                            <h3 class="gc-filename">${file.name}</h3>
                            <div class="gc-file-meta">
                                <span>${formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span>${getFileTypeDescription(file.type)}</span>
                                <span>•</span>
                                <span>Uploaded by ${file.uploadedBy}</span>
                                <span>•</span>
                                <span>${file.uploadDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="gc-header-right">
                    <button class="gc-download-btn" onclick="downloadFile(${file.id})">
                        <i class="fas fa-download"></i>
                        <span>Download</span>
                    </button>
                    ${currentUser.role === 'admin' ? `
                    <button class="gc-delete-btn" onclick="deleteFile(${file.id})" style="background: var(--danger); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                        <i class="fas fa-trash"></i>
                        <span>Delete</span>
                    </button>
                    ` : ''}
                    <button class="gc-close-full" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="gc-preview-container">
                <div class="gc-preview-content" id="gcPreviewContent">
                    ${createEnhancedFilePreview(file)}
                </div>
                
                <div class="gc-preview-fallback" id="previewFallback" style="display: none;">
                    <div class="gc-fallback-content">
                        <div class="gc-fallback-icon">
                            <i class="fas fa-file"></i>
                        </div>
                        <h3>No preview available</h3>
                        <p>This file type can't be previewed in the browser. You can download it to view on your device.</p>
                        <button class="gc-download-fallback" onclick="downloadFile(${file.id})">
                            <i class="fas fa-download"></i> Download file
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="gc-footer">
                <div class="gc-footer-info">
                    <span>You're viewing a preview of "${file.name}"</span>
                </div>
                <div class="gc-footer-actions">
                    <button class="gc-footer-btn" onclick="downloadFile(${file.id})">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(previewModal);

    // Close modal with Escape key
    const closeModalHandler = function(e) {
        if (e.key === 'Escape') {
            previewModal.remove();
            document.removeEventListener('keydown', closeModalHandler);
        }
    };
    document.addEventListener('keydown', closeModalHandler);
}

// Enhanced file preview content based on file type
function createEnhancedFilePreview(file) {
    const textBasedTypes = [
        'text/plain', 'text/html', 'text/css', 'text/javascript',
        'application/json', 'application/javascript'
    ];

    const codeTypes = [
        'text/html', 'text/css', 'text/javascript', 'application/javascript',
        'application/json'
    ];

    // Image files
    if (file.type.startsWith('image/')) {
        return `
            <div class="gc-image-preview">
                <img src="${file.content}" alt="${file.name}" 
                     onload="this.style.display='block'; document.getElementById('previewFallback').style.display='none';" 
                     onerror="showPreviewFallback()"
                     style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
        `;
    }
    
    // PDF files
    else if (file.type === 'application/pdf') {
        return `
            <div class="gc-pdf-preview">
                <iframe src="${file.content}" 
                        title="${file.name}"
                        style="width: 100%; height: 100%; border: none;"
                        onload="this.style.display='block'; document.getElementById('previewFallback').style.display='none';" 
                        onerror="showPreviewFallback()"></iframe>
            </div>
        `;
    }
    
    // Text files with syntax highlighting
    else if (textBasedTypes.includes(file.type)) {
        try {
            const base64Content = file.content.split(',')[1];
            const textContent = atob(base64Content);
            const language = getCodeLanguage(file.type, file.name);
            
            return `
                <div class="gc-text-preview">
                    <div class="code-header">
                        <span class="code-language">${language}</span>
                        <button class="btn-small" onclick="copyTextToClipboard(this.parentElement.parentElement.querySelector('pre').textContent)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <pre class="language-${language}"><code>${escapeHtml(textContent)}</code></pre>
                </div>
            `;
        } catch (error) {
            return createFallbackPreview(file);
        }
    }
    
    // Microsoft Office files (limited preview)
    else if (isOfficeFile(file.type)) {
        return createOfficeFilePreview(file);
    }
    
    // CSV files
    else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        return createCSVPreview(file);
    }
    
    // Unsupported files
    else {
        setTimeout(showPreviewFallback, 100);
        return '<div style="display:none;"></div>';
    }
}

// Check if file is Microsoft Office file
function isOfficeFile(fileType) {
    const officeTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint'
    ];
    return officeTypes.includes(fileType);
}

// Create preview for Office files
function createOfficeFilePreview(file) {
    const fileTypeMap = {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
        'application/msword': 'Word Document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
        'application/vnd.ms-excel': 'Excel Spreadsheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
        'application/vnd.ms-powerpoint': 'PowerPoint Presentation'
    };
    
    const fileType = fileTypeMap[file.type] || 'Office Document';
    
    return `
        <div class="gc-office-preview">
            <div class="office-preview-content">
                <div class="office-icon">
                    <i class="fas fa-file-${getOfficeFileIcon(file.type)}" style="font-size: 4rem; color: #1a73e8;"></i>
                </div>
                <h3>${fileType}</h3>
                <p>${file.name}</p>
                <div class="office-preview-info">
                    <p><strong>File Type:</strong> ${fileType}</p>
                    <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                    <p>To view this file, please download it and open with the appropriate application.</p>
                </div>
                <div class="office-preview-actions">
                    <button class="gc-download-btn" onclick="downloadFile(${file.id})" style="margin: 10px;">
                        <i class="fas fa-download"></i> Download ${fileType}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get Office file icon
function getOfficeFileIcon(fileType) {
    if (fileType.includes('word') || fileType.includes('document')) {
        return 'word';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
        return 'excel';
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
        return 'powerpoint';
    }
    return 'file';
}

// Create CSV preview
function createCSVPreview(file) {
    try {
        const base64Content = file.content.split(',')[1];
        const csvContent = atob(base64Content);
        const rows = csvContent.split('\n').slice(0, 50); // Limit to first 50 rows for performance
        
        let tableHTML = '<div class="csv-preview-container">';
        tableHTML += '<div class="csv-header"><h4>CSV Preview (First 50 rows)</h4></div>';
        tableHTML += '<div class="csv-table-container">';
        tableHTML += '<table class="csv-table">';
        
        rows.forEach((row, index) => {
            const cells = row.split(',').map(cell => cell.trim());
            tableHTML += '<tr>';
            cells.forEach(cell => {
                if (index === 0) {
                    tableHTML += `<th>${escapeHtml(cell)}</th>`;
                } else {
                    tableHTML += `<td>${escapeHtml(cell)}</td>`;
                }
            });
            tableHTML += '</tr>';
        });
        
        tableHTML += '</table></div>';
        tableHTML += '<div class="csv-footer">';
        tableHTML += `<p>Showing ${rows.length} rows. Download to see full file.</p>`;
        tableHTML += '</div></div>';
        
        return tableHTML;
    } catch (error) {
        return createFallbackPreview(file);
    }
}

// Get programming language for code highlighting
function getCodeLanguage(fileType, fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    const languageMap = {
        'js': 'javascript',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'txt': 'text',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'php': 'php',
        'xml': 'xml',
        'sql': 'sql'
    };
    
    if (fileType === 'text/html') return 'html';
    if (fileType === 'text/css') return 'css';
    if (fileType === 'application/json') return 'json';
    if (fileType === 'text/javascript' || fileType === 'application/javascript') return 'javascript';
    
    return languageMap[extension] || 'text';
}

// Create fallback preview
function createFallbackPreview(file) {
    return `
        <div class="gc-fallback-preview">
            <div class="fallback-content">
                <div class="fallback-icon">
                    ${getFileIcon(file.type)}
                </div>
                <h3>Limited Preview Available</h3>
                <p>This file type (${getFileTypeDescription(file.type)}) cannot be fully previewed in the browser.</p>
                <div class="fallback-file-info">
                    <p><strong>File Name:</strong> ${file.name}</p>
                    <p><strong>File Type:</strong> ${getFileTypeDescription(file.type)}</p>
                    <p><strong>File Size:</strong> ${formatFileSize(file.size)}</p>
                </div>
                <button class="gc-download-fallback" onclick="downloadFile(${file.id})">
                    <i class="fas fa-download"></i>
                    Download File
                </button>
            </div>
        </div>
    `;
}

// Show fallback when preview fails
function showPreviewFallback() {
    const fallback = document.getElementById('previewFallback');
    const previewContent = document.querySelector('.gc-preview-content');
    if (fallback && previewContent) {
        previewContent.style.display = 'none';
        fallback.style.display = 'flex';
    }
}

// Copy text to clipboard
function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Text copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy text', 'error');
    });
}

// Display image gallery for posts with multiple images
function displayImageGallery(fileIds) {
    const files = uploadedFiles.filter(f => fileIds.includes(f.id));
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return '';
    
    if (imageFiles.length === 1) {
        // Single image - show full size
        return `
            <div class="post-image-single">
                <img src="${imageFiles[0].content}" alt="${imageFiles[0].name}" 
                     onclick="previewFile(${imageFiles[0].id})"
                     style="max-width: 100%; max-height: 400px; cursor: pointer; border-radius: 8px;">
            </div>
        `;
    } else {
        // Multiple images - show gallery
        return `
            <div class="post-image-gallery">
                <h5><i class="fas fa-images"></i> Image Gallery (${imageFiles.length} images)</h5>
                <div class="gallery-grid">
                    ${imageFiles.map(file => `
                        <div class="gallery-item" onclick="previewFile(${file.id})">
                            <img src="${file.content}" alt="${file.name}" 
                                 style="width: 100px; height: 100px; object-fit: cover; cursor: pointer; border-radius: 4px;">
                            <div class="gallery-overlay">
                                <i class="fas fa-search-plus"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Delete post function
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return;
    }
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    
    const post = posts[postIndex];
    
    // Remove post from array
    posts.splice(postIndex, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Check if any files from this post are no longer used in any other posts
    if (post.fileIds && post.fileIds.length > 0) {
        post.fileIds.forEach(fileId => {
            const isFileUsed = posts.some(p => p.fileIds && p.fileIds.includes(fileId));
            if (!isFileUsed) {
                // Remove orphaned file from uploadedFiles
                uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
            }
        });
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }
    
    // Reload current section
    const activeSection = document.querySelector('.sidebar-menu a.active')?.getAttribute('data-section') || 'announcements';
    loadSection(activeSection);
    
    // If we're in the files section, reload it to reflect changes
    if (activeSection === 'files') {
        loadAvailableFiles();
    }
    
    showNotification('Post deleted successfully!', 'success');
}

// Edit post function
function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Create edit modal
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.style.display = 'block';
    
    const postFiles = uploadedFiles.filter(f => post.fileIds && post.fileIds.includes(f.id));
    
    editModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Edit Post</h2>
            
            <div class="form-group">
                <label for="editPostContent">Post Content</label>
                <textarea id="editPostContent" rows="6" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;">${post.content}</textarea>
            </div>
            
            <div class="file-upload">
                <label for="editPostFiles">
                    <i class="fas fa-paperclip"></i> Update Files (Optional)
                </label>
                <input type="file" id="editPostFiles" multiple>
                <small>Add new files or keep existing ones</small>
                
                ${postFiles.length > 0 ? `
                <div class="current-files" style="margin-top: 1rem;">
                    <strong>Current Files:</strong>
                    ${postFiles.map(file => `
                        <div class="current-file-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #f5f5f5; margin: 0.3rem 0; border-radius: 4px;">
                            <span>${file.name}</span>
                            <button type="button" class="btn-small btn-danger" onclick="removeFileFromPost(${post.id}, ${file.id})" style="background: var(--danger); color: white; border: none; padding: 0.2rem 0.5rem; border-radius: 3px; cursor: pointer;">
                                <i class="fas fa-times"></i> Remove
                            </button>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                <div id="editFileList" class="file-list" style="margin-top: 0.5rem;"></div>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button type="button" class="btn-primary" onclick="savePostEdit(${post.id})">
                    <i class="fas fa-save"></i> Save Changes
                </button>
                <button type="button" class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(editModal);
    
    // Show selected files for edit
    const fileInput = document.getElementById('editPostFiles');
    const fileList = document.getElementById('editFileList');
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            fileList.innerHTML = '';
            if (this.files.length > 0) {
                fileList.innerHTML = `<strong>New files to add (${this.files.length}):</strong>`;
                Array.from(this.files).forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-list-item';
                    fileItem.innerHTML = `
                        <span>📄 ${file.name} (${formatFileSize(file.size)})</span>
                    `;
                    fileList.appendChild(fileItem);
                });
            }
        });
    }
    
    // Close modal when clicking outside
    editModal.onclick = function(e) {
        if (e.target === editModal) {
            editModal.remove();
        }
    };
}

// Remove file from post
function removeFileFromPost(postId, fileId) {
    if (!confirm('Are you sure you want to remove this file from the post?')) {
        return;
    }
    
    const post = posts.find(p => p.id === postId);
    if (!post || !post.fileIds) return;
    
    // Remove file ID from post
    post.fileIds = post.fileIds.filter(id => id !== fileId);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Check if the file is still used in any other posts
    const isFileUsed = posts.some(p => p.fileIds && p.fileIds.includes(fileId));
    if (!isFileUsed) {
        // Remove orphaned file from uploadedFiles
        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }
    
    // Refresh the edit modal by closing and reopening
    document.querySelector('.modal').remove();
    editPost(postId);
    
    // If we're in the files section, reload it to reflect changes
    const activeSection = document.querySelector('.sidebar-menu a.active')?.getAttribute('data-section') || 'announcements';
    if (activeSection === 'files') {
        loadAvailableFiles();
    }
    
    showNotification('File removed from post!', 'success');
}

// Save post edits
async function savePostEdit(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newContent = document.getElementById('editPostContent').value;
    const newFiles = document.getElementById('editPostFiles').files;
    
    if (!newContent.trim()) {
        alert('Please enter post content');
        return;
    }
    
    // Validate new file sizes
    let validFiles = true;
    Array.from(newFiles).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`File "${file.name}" exceeds 5MB limit`);
            validFiles = false;
        }
    });
    
    if (!validFiles) return;
    
    // Store old file IDs to check for orphaned files later
    const oldFileIds = [...(post.fileIds || [])];
    
    // Upload new files if any
    let newFileDataArray = [];
    if (newFiles.length > 0) {
        try {
            newFileDataArray = await handleFileUpload(newFiles, post.section);
        } catch (error) {
            alert('Error uploading files: ' + error.message);
            return;
        }
    }
    
    // Update post
    post.content = newContent;
    if (newFileDataArray.length > 0) {
        // Add new files to existing file IDs
        post.fileIds = [...(post.fileIds || []), ...newFileDataArray.map(file => file.id)];
    }
    post.lastEdited = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Check for orphaned files (files that were removed during edit and are no longer used)
    const removedFileIds = oldFileIds.filter(oldId => !post.fileIds.includes(oldId));
    if (removedFileIds.length > 0) {
        removedFileIds.forEach(fileId => {
            const isFileUsed = posts.some(p => p.fileIds && p.fileIds.includes(fileId));
            if (!isFileUsed) {
                // Remove orphaned file from uploadedFiles
                uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
            }
        });
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }
    
    // Close modal
    document.querySelector('.modal').remove();
    
    // Reload current section
    const activeSection = document.querySelector('.sidebar-menu a.active')?.getAttribute('data-section') || 'announcements';
    loadSection(activeSection);
    
    // If we're in the files section, reload it to reflect changes
    if (activeSection === 'files') {
        loadAvailableFiles();
    }
    
    showNotification('Post updated successfully!', 'success');
}

// Helper function to clean up orphaned files
function cleanupOrphanedFiles() {
    const usedFileIds = new Set();
    
    // Collect all file IDs currently used in posts
    posts.forEach(post => {
        if (post.fileIds) {
            post.fileIds.forEach(fileId => usedFileIds.add(fileId));
        }
    });
    
    // Collect all file IDs currently used in events
    events.forEach(event => {
        if (event.fileIds) {
            event.fileIds.forEach(fileId => usedFileIds.add(fileId));
        }
    });
    
    // Remove files that are not used in any posts or events
    const orphanedFiles = uploadedFiles.filter(file => !usedFileIds.has(file.id));
    
    if (orphanedFiles.length > 0) {
        uploadedFiles = uploadedFiles.filter(file => usedFileIds.has(file.id));
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
        console.log(`Cleaned up ${orphanedFiles.length} orphaned files`);
    }
    
    return orphanedFiles.length;
}

// Load Available Files section
function loadAvailableFiles() {
    let contentHTML = '';
    
    // Get all unique file IDs from posts and events to check which files are actually used
    const usedFileIds = new Set();
    posts.forEach(post => {
        if (post.fileIds) {
            post.fileIds.forEach(fileId => usedFileIds.add(fileId));
        }
    });
    
    events.forEach(event => {
        if (event.fileIds) {
            event.fileIds.forEach(fileId => usedFileIds.add(fileId));
        }
    });
    
    // Filter out orphaned files (files not used in any posts or events)
    const activeFiles = uploadedFiles.filter(file => usedFileIds.has(file.id));
    
    // Update uploadedFiles to remove orphaned files
    if (activeFiles.length !== uploadedFiles.length) {
        uploadedFiles = activeFiles;
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }
    
    if (uploadedFiles.length > 0) {
        contentHTML += `
            <div class="files-section">
                <h3><i class="fas fa-folder-open"></i> All Available Files (${uploadedFiles.length})</h3>
                <p style="margin-bottom: 1rem; opacity: 0.8; font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> These files are currently being used in posts or events. Files removed from all posts and events will be automatically deleted.
                </p>
                <div class="files-grid">
                    ${uploadedFiles.map(file => {
                        // Find which posts and events use this file
                        const postsUsingFile = posts.filter(post => 
                            post.fileIds && post.fileIds.includes(file.id)
                        );
                        
                        const eventsUsingFile = events.filter(event => 
                            event.fileIds && event.fileIds.includes(file.id)
                        );
                        
                        const totalUses = postsUsingFile.length + eventsUsingFile.length;
                        
                        return `
                            <div class="file-card">
                                <div class="file-icon">
                                    ${getFileIcon(file.type)}
                                </div>
                                <div class="file-info">
                                    <h4>${file.name}</h4>
                                    <p><strong>Section:</strong> ${file.section}</p>
                                    <p><strong>Uploaded by:</strong> ${file.uploadedBy}</p>
                                    <p><strong>Date:</strong> ${file.uploadDate}</p>
                                    <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                                    <p><strong>Type:</strong> ${getFileTypeDescription(file.type)}</p>
                                    <p><strong>Used in:</strong> ${totalUses} item(s)</p>
                                </div>
                                <div class="file-actions">
                                    <button class="btn-primary" onclick="previewFile(${file.id})">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    <button class="btn-secondary" onclick="downloadFile(${file.id})">
                                        <i class="fas fa-download"></i> Download
                                    </button>
                                    ${currentUser.role === 'admin' ? `
                                    <button class="btn-danger" onclick="deleteFile(${file.id})" style="background: var(--danger); color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else {
        contentHTML += `
            <div class="welcome-message">
                <i class="fas fa-folder-open"></i>
                <h3>No Files Available</h3>
                <p>Files will appear here once they are uploaded to posts or events.</p>
            </div>
        `;
    }
    
    contentBody.innerHTML = contentHTML;
}

// Load Feedback Section (Simple version without emails)
function loadFeedbackSection() {
    let contentHTML = '';
    
    if (currentUser.role === 'admin') {
        // ADMIN VIEW: Feedback Management Dashboard
        if (feedbacks.length > 0) {
            contentHTML += `
                <div class="feedback-section">
                    <h3><i class="fas fa-comments"></i> Student Feedback Management</h3>
                    <div class="feedback-stats" style="margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div class="stat-card" style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                            <h4>Total Feedback</h4>
                            <p style="font-size: 2rem; margin: 0.5rem 0;">${feedbacks.length}</p>
                        </div>
                        <div class="stat-card" style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                            <h4>Pending Response</h4>
                            <p style="font-size: 2rem; margin: 0.5rem 0;">${feedbacks.filter(f => !f.responded).length}</p>
                        </div>
                        <div class="stat-card" style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                            <h4>Responded</h4>
                            <p style="font-size: 2rem; margin: 0.5rem 0;">${feedbacks.filter(f => f.responded).length}</p>
                        </div>
                    </div>
                    
                    <div class="feedback-filters" style="margin-bottom: 1rem;">
                        <button class="btn-small" onclick="filterFeedbacks('all')">All</button>
                        <button class="btn-small" onclick="filterFeedbacks('pending')">Pending</button>
                        <button class="btn-small" onclick="filterFeedbacks('responded')">Responded</button>
                    </div>
                    
                    <div class="feedback-list">
                        ${feedbacks.map(feedback => `
                            <div class="feedback-item ${feedback.responded ? 'responded' : 'pending'}" data-status="${feedback.responded ? 'responded' : 'pending'}">
                                <div class="feedback-header">
                                    <div class="feedback-meta">
                                        <span><strong>From:</strong> ${feedback.name}</span>
                                        <span><strong>Email:</strong> ${feedback.email}</span>
                                        <span><strong>Date:</strong> ${feedback.date}</span>
                                        ${feedback.responded ? `<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Responded</span>` : `<span style="color: var(--warning);"><i class="fas fa-clock"></i> Pending</span>`}
                                    </div>
                                    <div class="feedback-actions">
                                        ${!feedback.responded ? `
                                        <button class="btn-small btn-primary" onclick="openResponseModal(${feedback.id})">
                                            <i class="fas fa-reply"></i> Respond
                                        </button>
                                        ` : `
                                        <button class="btn-small btn-secondary" onclick="viewResponse(${feedback.id})">
                                            <i class="fas fa-eye"></i> View Response
                                        </button>
                                        `}
                                        <button class="btn-small btn-danger" onclick="deleteFeedback(${feedback.id})">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                                <div class="feedback-content">
                                    <h4>${feedback.subject}</h4>
                                    <p>${feedback.message}</p>
                                </div>
                                ${feedback.response ? `
                                <div class="feedback-response">
                                    <h5><i class="fas fa-reply"></i> Admin Response:</h5>
                                    <p>${feedback.response}</p>
                                    <small>Responded on: ${feedback.responseDate}</small>
                                </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            contentHTML += `
                <div class="welcome-message">
                    <i class="fas fa-comments"></i>
                    <h3>No Feedback Yet</h3>
                    <p>Student feedback will appear here once they submit through their dashboard.</p>
                </div>
            `;
        }
    } else {
        // STUDENT VIEW: Feedback Submission Form
        contentHTML += `
            <div class="student-feedback-section">
                <h3><i class="fas fa-comment-dots"></i> Send Feedback to Student Council</h3>
                <p style="margin-bottom: 1.5rem; opacity: 0.8;">Have suggestions, questions, or feedback? Let us know! You can view responses in your feedback history.</p>
                
                <div class="feedback-form-container">
                    <form id="studentFeedbackForm">
                        <div class="form-group">
                            <label for="studentFeedbackName">Your Name *</label>
                            <input type="text" id="studentFeedbackName" name="name" value="${currentUser.username}" required>
                        </div>
                        <div class="form-group">
                            <label for="studentFeedbackEmail">Your Email *</label>
                            <input type="email" id="studentFeedbackEmail" name="email" value="${currentUser.email}" required>
                        </div>
                        <div class="form-group">
                            <label for="studentFeedbackSubject">Subject *</label>
                            <input type="text" id="studentFeedbackSubject" name="subject" required placeholder="What is your feedback about?">
                        </div>
                        <div class="form-group">
                            <label for="studentFeedbackMessage">Your Message *</label>
                            <textarea id="studentFeedbackMessage" name="message" rows="6" required placeholder="Please share your feedback, questions, or suggestions..."></textarea>
                        </div>
                        <button type="submit" class="btn-primary" id="submitStudentFeedbackBtn">
                            <i class="fas fa-paper-plane"></i> Submit Feedback
                        </button>
                    </form>
                    <p id="studentFeedbackMessageStatus" style="margin-top: 1rem; text-align: center;"></p>
                </div>
                
                ${feedbacks.filter(f => f.email === currentUser.email).length > 0 ? `
                <div class="my-feedback-history" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <h4><i class="fas fa-history"></i> My Feedback History</h4>
                    <div class="feedback-list">
                        ${feedbacks.filter(f => f.email === currentUser.email).map(feedback => `
                            <div class="feedback-item ${feedback.responded ? 'responded' : 'pending'}" style="margin-bottom: 1rem;">
                                <div class="feedback-header">
                                    <div class="feedback-meta">
                                        <span><strong>Subject:</strong> ${feedback.subject}</span>
                                        <span><strong>Date:</strong> ${feedback.date}</span>
                                        ${feedback.responded ? `<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Responded</span>` : `<span style="color: var(--warning);"><i class="fas fa-clock"></i> Pending Response</span>`}
                                    </div>
                                </div>
                                <div class="feedback-content">
                                    <p>${feedback.message}</p>
                                </div>
                                ${feedback.response ? `
                                <div class="feedback-response">
                                    <h5><i class="fas fa-reply"></i> Admin Response:</h5>
                                    <p>${feedback.response}</p>
                                    <small>Responded on: ${feedback.responseDate}</small>
                                </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : `
                <div class="welcome-message" style="margin-top: 2rem;">
                    <i class="fas fa-inbox"></i>
                    <h4>No Feedback Submitted Yet</h4>
                    <p>Your feedback submissions will appear here once you submit them.</p>
                </div>
                `}
            </div>
        `;
    }
    
    contentBody.innerHTML = contentHTML;
    
    // Add event listener for student feedback form
    if (currentUser.role === 'student') {
        const studentFeedbackForm = document.getElementById('studentFeedbackForm');
        if (studentFeedbackForm) {
            studentFeedbackForm.addEventListener('submit', handleStudentFeedbackSubmit);
        }
    }
}

// Handle student feedback form submission
function handleStudentFeedbackSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitStudentFeedbackBtn');
    const statusMessage = document.getElementById('studentFeedbackMessageStatus');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    const feedbackData = {
        name: document.getElementById('studentFeedbackName').value.trim(),
        email: document.getElementById('studentFeedbackEmail').value.trim(),
        subject: document.getElementById('studentFeedbackSubject').value.trim(),
        message: document.getElementById('studentFeedbackMessage').value.trim()
    };
    
    // Basic validation
    if (!feedbackData.name || !feedbackData.email || !feedbackData.subject || !feedbackData.message) {
        statusMessage.textContent = 'Please fill in all required fields.';
        statusMessage.style.color = 'var(--danger)';
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedbackData.email)) {
        statusMessage.textContent = 'Please enter a valid email address.';
        statusMessage.style.color = 'var(--danger)';
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    try {
        // Submit feedback (no email)
        const success = submitFeedback(feedbackData);
        
        if (success) {
            statusMessage.textContent = 'Thank you for your feedback! You can check back here for responses.';
            statusMessage.style.color = 'var(--success)';
            document.getElementById('studentFeedbackForm').reset();
            // Restore user's name and email
            document.getElementById('studentFeedbackName').value = currentUser.username;
            document.getElementById('studentFeedbackEmail').value = currentUser.email;
            
            // Reload the section to show the new feedback in history
            setTimeout(() => {
                loadFeedbackSection();
            }, 1500);
        } else {
            statusMessage.textContent = 'Error submitting feedback. Please try again.';
            statusMessage.style.color = 'var(--danger)';
        }
    } catch (error) {
        console.error('Feedback submission error:', error);
        statusMessage.textContent = 'Error submitting feedback. Please try again.';
        statusMessage.style.color = 'var(--danger)';
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Filter feedbacks
function filterFeedbacks(filter) {
    const feedbackItems = document.querySelectorAll('.feedback-item');
    feedbackItems.forEach(item => {
        switch(filter) {
            case 'pending':
                item.style.display = item.dataset.status === 'pending' ? 'block' : 'none';
                break;
            case 'responded':
                item.style.display = item.dataset.status === 'responded' ? 'block' : 'none';
                break;
            default:
                item.style.display = 'block';
        }
    });
}

// Open response modal
function openResponseModal(feedbackId) {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    if (!feedback) return;

    const responseModal = document.createElement('div');
    responseModal.className = 'modal';
    responseModal.style.display = 'block';
    
    responseModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Respond to Feedback</h2>
            
            <div class="feedback-preview" style="background: #f5f5f5; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
                <h4>Original Feedback:</h4>
                <p><strong>From:</strong> ${feedback.name} (${feedback.email})</p>
                <p><strong>Subject:</strong> ${feedback.subject}</p>
                <p><strong>Message:</strong> ${feedback.message}</p>
            </div>
            
            <div class="form-group">
                <label for="responseMessage">Your Response</label>
                <textarea id="responseMessage" rows="6" placeholder="Type your response here..." style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button type="button" class="btn-primary" onclick="sendResponse(${feedbackId})">
                    <i class="fas fa-check"></i> Save Response
                </button>
                <button type="button" class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(responseModal);
    
    // Close modal when clicking outside
    responseModal.onclick = function(e) {
        if (e.target === responseModal) {
            responseModal.remove();
        }
    };
}

// Send response (no email)
function sendResponse(feedbackId) {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    const responseMessage = document.getElementById('responseMessage').value;
    
    if (!responseMessage.trim()) {
        alert('Please enter a response message');
        return;
    }
    
    // Show loading state
    const sendButton = document.querySelector('.btn-primary');
    const originalText = sendButton.innerHTML;
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    sendButton.disabled = true;
    
    try {
        // Update feedback with response (no email)
        feedback.response = responseMessage;
        feedback.responseDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        feedback.responded = true;
        
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        
        // Close modal
        document.querySelector('.modal').remove();
        
        // Reload feedback section
        loadFeedbackSection();
        
        showNotification('Response saved successfully! Student can view it in their feedback history.', 'success');
        
    } catch (error) {
        console.error('Error saving response:', error);
        showNotification('Error saving response. Please try again.', 'error');
    } finally {
        // Restore button state
        sendButton.innerHTML = originalText;
        sendButton.disabled = false;
    }
}

// View response
function viewResponse(feedbackId) {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    if (!feedback || !feedback.response) return;
    
    alert(`Admin Response:\n\n${feedback.response}\n\nResponded on: ${feedback.responseDate}`);
}

// Delete feedback
function deleteFeedback(feedbackId) {
    if (!confirm('Are you sure you want to delete this feedback?')) {
        return;
    }
    
    feedbacks = feedbacks.filter(f => f.id !== feedbackId);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    loadFeedbackSection();
    showNotification('Feedback deleted successfully!', 'success');
}

// Submit feedback function (no email)
function submitFeedback(feedbackData) {
    const newFeedback = {
        id: Date.now(),
        ...feedbackData,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        responded: false,
        response: null,
        responseDate: null
    };
    
    // Save to localStorage
    feedbacks.push(newFeedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    showNotification('Thank you for your feedback! You can check back for responses.', 'success');
    
    return true;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.download-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `download-notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--accent)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
        ">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
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

// ============================
// PROGRAMS & EVENTS SECTION
// ============================

// Enhanced Events Section with Calendar Integration
function loadEventsSection() {
    let contentHTML = '';
    
    if (currentUser.role === 'admin') {
        contentHTML += `
            <div class="events-management-section">
                <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h3><i class="fas fa-calendar-alt"></i> Programs & Events Management</h3>
                    <button class="btn-primary" id="addEventBtnMain">
                        <i class="fas fa-plus"></i> Add New Event
                    </button>
                </div>
                
                <!-- Calendar View Toggle -->
                <div class="calendar-view-toggle" style="margin-bottom: 2rem;">
                    <button class="btn-small ${currentCalendarView === 'month' ? 'active' : ''}" data-view="month">
                        <i class="fas fa-calendar-alt"></i> Calendar View
                    </button>
                    <button class="btn-small ${currentCalendarView === 'list' ? 'active' : ''}" data-view="list">
                        <i class="fas fa-list"></i> List View
                    </button>
                </div>
                
                <!-- Calendar Navigation for Admin -->
                <div class="calendar-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <div class="calendar-nav">
                        <button class="btn-small" id="prevBtn">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h4 id="currentMonthYear" style="margin: 0 1rem; color: var(--text-primary);">${formatMonthYear(currentDate)}</h4>
                        <button class="btn-small" id="nextBtn">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="btn-small" id="todayBtn" style="margin-left: 1rem;">
                            Today
                        </button>
                    </div>
                    
                    <div class="events-controls" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div class="events-filter">
                            <label for="eventsFilter">Filter by Category:</label>
                            <select id="eventsFilter" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd;">
                                <option value="all">All Categories</option>
                                <option value="general">General</option>
                                <option value="academic">Academic</option>
                                <option value="sports">Sports</option>
                                <option value="cultural">Cultural</option>
                                <option value="social">Social</option>
                                <option value="meeting">Meeting</option>
                            </select>
                        </div>
                        <button class="btn-secondary" id="exportEventsBtn">
                            <i class="fas fa-download"></i> Export Events
                        </button>
                    </div>
                </div>
        `;
    } else {
        contentHTML += `
            <div class="events-student-section">
                <h3><i class="fas fa-calendar-alt"></i> Programs & Events</h3>
                <p style="margin-bottom: 1.5rem; opacity: 0.8;">View all upcoming programs and events organized by the student council.</p>
                
                <!-- Calendar View Toggle for Students -->
                <div class="calendar-view-toggle" style="margin-bottom: 2rem;">
                    <button class="btn-small ${currentCalendarView === 'month' ? 'active' : ''}" data-view="month">
                        <i class="fas fa-calendar-alt"></i> Calendar View
                    </button>
                    <button class="btn-small ${currentCalendarView === 'list' ? 'active' : ''}" data-view="list">
                        <i class="fas fa-list"></i> List View
                    </button>
                </div>
                
                <!-- Filter for Students -->
                <div class="events-controls" style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                    <div class="events-filter">
                        <label for="eventsFilter">Filter by Category:</label>
                        <select id="eventsFilter" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd;">
                            <option value="all">All Categories</option>
                            <option value="general">General</option>
                            <option value="academic">Academic</option>
                            <option value="sports">Sports</option>
                            <option value="cultural">Cultural</option>
                            <option value="social">Social</option>
                            <option value="meeting">Meeting</option>
                        </select>
                    </div>
                </div>
        `;
    }
    
    // Display either calendar or list view
    contentHTML += `
        <div id="eventsView">
            ${currentCalendarView === 'month' ? generateCalendarView() : generateEventsListView()}
        </div>
    `;
    
    contentHTML += `</div>`; // Close the main div
    
    contentBody.innerHTML = contentHTML;
    
    // Add event listeners
    if (currentUser.role === 'admin') {
        document.getElementById('addEventBtnMain').addEventListener('click', () => openEventModal());
        document.getElementById('exportEventsBtn').addEventListener('click', exportEvents);
        
        // Calendar navigation
        document.getElementById('prevBtn').addEventListener('click', previousPeriod);
        document.getElementById('nextBtn').addEventListener('click', nextPeriod);
        document.getElementById('todayBtn').addEventListener('click', goToToday);
    }
    
    // View toggle for both admin and students
    document.querySelectorAll('.calendar-view-toggle button').forEach(btn => {
        btn.addEventListener('click', function() {
            currentCalendarView = this.getAttribute('data-view');
            loadEventsSection();
        });
    });
    
    // Filter event listeners for both admin and students
    const eventsFilter = document.getElementById('eventsFilter');
    if (eventsFilter) {
        eventsFilter.addEventListener('change', function() {
            // For calendar view, we need to reload the section
            if (currentCalendarView === 'month') {
                loadEventsSection();
            } else {
                // For list view, we can just regenerate the list
                generateEventsListContent();
            }
        });
    }
}

// Generate enhanced events list view
function generateEventsListView() {
    const filteredEvents = filterAndSortEvents();
    
    if (filteredEvents.length > 0) {
        return `
            <div class="events-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: var(--primary); color: white; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <h4>Total Events</h4>
                    <p style="font-size: 2rem; margin: 0.5rem 0;">${events.length}</p>
                </div>
                <div class="stat-card" style="background: #4caf50; color: white; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <h4>Upcoming</h4>
                    <p style="font-size: 2rem; margin: 0.5rem 0;">${events.filter(e => new Date(e.date + 'T' + e.time) > new Date()).length}</p>
                </div>
                <div class="stat-card" style="background: #ff9800; color: white; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <h4>This Month</h4>
                    <p style="font-size: 2rem; margin: 0.5rem 0;">${getThisMonthEvents().length}</p>
                </div>
                <div class="stat-card" style="background: #9c27b0; color: white; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <h4>Categories</h4>
                    <p style="font-size: 2rem; margin: 0.5rem 0;">${new Set(events.map(e => e.category)).size}</p>
                </div>
            </div>
            
            <div class="events-grid">
                ${filteredEvents.map(event => generateEventCard(event, true)).join('')}
            </div>
        `;
    } else {
        return `
            <div class="welcome-message">
                <i class="fas fa-calendar-plus"></i>
                <h3>No Events Scheduled</h3>
                <p>${currentUser.role === 'admin' ? 'Create your first event to get started!' : 'Check back later for upcoming events.'}</p>
                ${currentUser.role === 'admin' ? `
                <button class="btn-primary" id="addFirstEventBtn" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Create Your First Event
                </button>
                ` : ''}
            </div>
        `;
    }
}

// Filter and sort events for list view - FIXED VERSION
function filterAndSortEvents() {
    const eventsFilter = document.getElementById('eventsFilter');
    const filterValue = eventsFilter ? eventsFilter.value : 'all';
    
    let filteredEvents = [...events];
    
    // Apply filter
    if (filterValue !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.category === filterValue);
    }
    
    // Apply sort - upcoming events first, then past events
    filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        const now = new Date();
        
        // Both events are in the future or both are in the past
        if ((dateA >= now && dateB >= now) || (dateA < now && dateB < now)) {
            return dateA - dateB;
        }
        // One is future, one is past - future comes first
        return dateA >= now ? -1 : 1;
    });
    
    return filteredEvents;
}

// Generate events list content dynamically (for filter updates without full reload)
function generateEventsListContent() {
    const eventsView = document.getElementById('eventsView');
    if (!eventsView) return;
    
    eventsView.innerHTML = generateEventsListView();
    
    // Re-attach event listeners for the new content
    if (currentUser.role === 'admin') {
        const addFirstEventBtn = document.getElementById('addFirstEventBtn');
        if (addFirstEventBtn) {
            addFirstEventBtn.addEventListener('click', () => openEventModal());
        }
    }
}

// Generate Calendar Month View with filtering support
function generateCalendarView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Get filtered events for the current view
    const eventsFilter = document.getElementById('eventsFilter');
    const filterValue = eventsFilter ? eventsFilter.value : 'all';
    let filteredEvents = events;
    
    if (filterValue !== 'all') {
        filteredEvents = events.filter(event => event.category === filterValue);
    }
    
    let calendarHTML = '<div class="calendar-grid">';
    
    // Weekday headers
    calendarHTML += '<div class="calendar-weekdays">';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        calendarHTML += `<div class="calendar-weekday">${day}</div>`;
    });
    calendarHTML += '</div>';
    
    // Calendar days
    calendarHTML += '<div class="calendar-days">';
    
    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
        const date = prevMonthLastDay - i;
        const dateObj = new Date(year, month - 1, date);
        const isOtherMonth = true;
        const isToday = false;
        calendarHTML += generateCalendarDay(dateObj, isOtherMonth, filteredEvents, isToday);
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isOtherMonth = false;
        const isToday = date.toDateString() === today.toDateString();
        calendarHTML += generateCalendarDay(date, isOtherMonth, filteredEvents, isToday);
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(year, month + 1, day);
        const isOtherMonth = true;
        const isToday = false;
        calendarHTML += generateCalendarDay(date, isOtherMonth, filteredEvents, isToday);
    }
    
    calendarHTML += '</div></div>';
    
    return calendarHTML;
}

// Generate Calendar Day with filtered events - FIXED VERSION
function generateCalendarDay(date, isOtherMonth = false, filteredEvents = events, isToday = false) {
    const day = date.getDate();
    const dateString = date.toISOString().split('T')[0];
    const dayEvents = filteredEvents.filter(event => event.date === dateString);
    
    let dayClass = 'calendar-day';
    if (isOtherMonth) dayClass += ' other-month';
    if (isToday) dayClass += ' today';
    if (dayEvents.length > 0) dayClass += ' has-events';
    
    let dayHTML = `<div class="${dayClass}" data-date="${dateString}">`;
    dayHTML += `<div class="calendar-date">${day}</div>`;
    
    if (dayEvents.length > 0) {
        dayHTML += '<div class="calendar-events">';
        dayEvents.slice(0, 3).forEach(event => {
            dayHTML += `<div class="calendar-event ${event.category}" data-event-id="${event.id}" onclick="viewEvent(${event.id})">${event.title}</div>`;
        });
        if (dayEvents.length > 3) {
            dayHTML += `<div class="calendar-event" onclick="showDayEvents('${dateString}')">+${dayEvents.length - 3} more</div>`;
        }
        dayHTML += '</div>';
    }
    
    dayHTML += '</div>';
    return dayHTML;
}

// Show events for a specific day
function showDayEvents(dateString) {
    const eventsFilter = document.getElementById('eventsFilter');
    const filterValue = eventsFilter ? eventsFilter.value : 'all';
    
    let dayEvents = events.filter(event => event.date === dateString);
    
    if (filterValue !== 'all') {
        dayEvents = dayEvents.filter(event => event.category === filterValue);
    }
    
    if (dayEvents.length === 0) return;
    
    const eventList = dayEvents.map(event => `
        <div class="event-item" style="padding: 0.5rem; border-bottom: 1px solid #eee; cursor: pointer;" onclick="viewEvent(${event.id})">
            <strong>${event.title}</strong> (${formatTime(event.time)})
        </div>
    `).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Events on ${formatEventDate(dateString)}</h2>
            <div class="day-events-list">
                ${eventList}
            </div>
            <div style="margin-top: 1rem; text-align: center;">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// Generate Event Card - UPDATED to remove View Details button
function generateEventCard(event, showActions = true) {
    const eventDate = new Date(event.date + 'T' + event.time);
    const isPast = eventDate < new Date();
    const isToday = eventDate.toDateString() === new Date().toDateString();
    
    const eventFiles = uploadedFiles.filter(f => event.fileIds && event.fileIds.includes(f.id));
    
    return `
        <div class="event-card ${isPast ? 'past-event' : ''} ${isToday ? 'today-event' : ''}" data-event-id="${event.id}">
            <div class="event-card-header">
                <div class="event-info">
                    <div class="event-title">${escapeHtml(event.title)}</div>
                    <div class="event-meta">
                        <div class="event-meta-item">
                            <i class="fas fa-calendar"></i>
                            ${formatEventDate(event.date)}
                        </div>
                        <div class="event-meta-item">
                            <i class="fas fa-clock"></i>
                            ${formatTime(event.time)}
                        </div>
                        <div class="event-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${escapeHtml(event.venue)}
                        </div>
                        ${event.author ? `
                        <div class="event-meta-item">
                            <i class="fas fa-user"></i>
                            ${event.author}
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="event-category ${event.category}">
                    ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    ${isToday ? '<span class="event-badge today-badge">Today</span>' : ''}
                    ${isPast ? '<span class="event-badge past-badge">Past</span>' : ''}
                </div>
            </div>
            
            ${event.description ? `
            <div class="event-description">
                ${escapeHtml(event.description)}
            </div>
            ` : ''}
            
            ${eventFiles.length > 0 ? `
            <div class="event-attachments">
                <strong><i class="fas fa-paperclip"></i> Attachments (${eventFiles.length}):</strong>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                    ${eventFiles.map(file => `
                        <button class="btn-small" onclick="previewFile(${file.id})" style="font-size: 0.8rem;">
                            <i class="fas fa-file"></i> ${file.name}
                        </button>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${showActions && currentUser.role === 'admin' ? `
            <div class="event-actions">
                <button class="btn-small btn-edit" onclick="editEvent(${event.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-small btn-delete" onclick="deleteEvent(${event.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
            ` : ''}
        </div>
    `;
}

// Calendar Navigation
function previousPeriod() {
    if (currentCalendarView === 'month') {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
        currentDate.setDate(currentDate.getDate() - 7);
    }
    loadEventsSection();
}

function nextPeriod() {
    if (currentCalendarView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
        currentDate.setDate(currentDate.getDate() + 7);
    }
    loadEventsSection();
}

function goToToday() {
    currentDate = new Date();
    loadEventsSection();
}

// Event Modal Functions
function openEventModal(event = null) {
    const modal = document.getElementById('eventModal');
    const title = document.getElementById('eventModalTitle');
    const form = document.getElementById('eventForm');
    
    if (event) {
        title.textContent = 'Edit Event';
        populateEventForm(event);
    } else {
        title.textContent = 'Create New Event';
        form.reset();
        document.getElementById('eventFileList').innerHTML = '';
        
        // Set default date to today, time to next hour
        const now = new Date();
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        document.getElementById('eventDate').value = now.toISOString().split('T')[0];
        document.getElementById('eventTime').value = nextHour.toISOString().split('T')[1].substring(0, 5);
    }
    
    openModal(modal);
    
    // Store current event ID for editing
    form.dataset.editingEventId = event ? event.id : '';
}

function populateEventForm(event) {
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventVenue').value = event.venue;
    document.getElementById('eventCategory').value = event.category || 'general';
    
    // Show current files
    const fileList = document.getElementById('eventFileList');
    fileList.innerHTML = '';
    if (event.fileIds && event.fileIds.length > 0) {
        fileList.innerHTML = '<strong>Current Files:</strong>';
        event.fileIds.forEach(fileId => {
            const file = uploadedFiles.find(f => f.id === fileId);
            if (file) {
                fileList.innerHTML += `
                    <div class="current-file-item">
                        <span>📄 ${file.name}</span>
                        <button type="button" class="btn-small btn-danger" onclick="removeFileFromEvent(${event.id}, ${fileId})">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </div>
                `;
            }
        });
    }
}

// Enhanced Event Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveEvent();
        });
    }
    
    // Event file upload handling
    const eventFilesInput = document.getElementById('eventFiles');
    if (eventFilesInput) {
        eventFilesInput.addEventListener('change', function() {
            const fileList = document.getElementById('eventFileList');
            fileList.innerHTML = '';
            if (this.files.length > 0) {
                fileList.innerHTML = `<strong>New files to add (${this.files.length}):</strong>`;
                Array.from(this.files).forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-list-item';
                    fileItem.innerHTML = `<span>📄 ${file.name} (${formatFileSize(file.size)})</span>`;
                    fileList.appendChild(fileItem);
                });
            }
        });
    }
});

async function saveEvent() {
    const form = document.getElementById('eventForm');
    const editingEventId = form.dataset.editingEventId;
    
    const eventData = {
        title: document.getElementById('eventTitle').value.trim(),
        description: document.getElementById('eventDescription').value.trim(),
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        venue: document.getElementById('eventVenue').value.trim(),
        category: document.getElementById('eventCategory').value
    };
    
    // Enhanced validation
    if (!eventData.title) {
        alert('Please enter an event title');
        document.getElementById('eventTitle').focus();
        return;
    }
    
    if (!eventData.date) {
        alert('Please select an event date');
        document.getElementById('eventDate').focus();
        return;
    }
    
    if (!eventData.time) {
        alert('Please select an event time');
        document.getElementById('eventTime').focus();
        return;
    }
    
    if (!eventData.venue) {
        alert('Please enter a venue');
        document.getElementById('eventVenue').focus();
        return;
    }
    
    // Validate date is not in the past
    const eventDateTime = new Date(eventData.date + 'T' + eventData.time);
    if (eventDateTime < new Date() && !confirm('This event is scheduled in the past. Are you sure you want to save it?')) {
        return;
    }
    
    const eventFiles = document.getElementById('eventFiles').files;
    
    // Validate file sizes
    let validFiles = true;
    Array.from(eventFiles).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`File "${file.name}" exceeds 5MB limit`);
            validFiles = false;
        }
    });
    
    if (!validFiles) return;
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    try {
        // Upload files if any
        let newFileDataArray = [];
        if (eventFiles.length > 0) {
            try {
                newFileDataArray = await handleFileUpload(eventFiles, 'events');
            } catch (error) {
                alert('Error uploading files: ' + error.message);
                return;
            }
        }
        
        if (editingEventId) {
            // Update existing event
            const eventIndex = events.findIndex(e => e.id === parseInt(editingEventId));
            if (eventIndex !== -1) {
                const oldFileIds = [...(events[eventIndex].fileIds || [])];
                
                events[eventIndex] = {
                    ...events[eventIndex],
                    ...eventData,
                    fileIds: [...(events[eventIndex].fileIds || []), ...newFileDataArray.map(file => file.id)],
                    lastEdited: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
                
                // Check for orphaned files
                const removedFileIds = oldFileIds.filter(oldId => !events[eventIndex].fileIds.includes(oldId));
                if (removedFileIds.length > 0) {
                    removedFileIds.forEach(fileId => {
                        const isFileUsed = events.some(e => e.id !== parseInt(editingEventId) && e.fileIds && e.fileIds.includes(fileId));
                        if (!isFileUsed) {
                            uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
                        }
                    });
                    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                }
            }
        } else {
            // Create new event
            const newEvent = {
                id: Date.now(),
                ...eventData,
                author: currentUser.username,
                created: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                fileIds: newFileDataArray.map(file => file.id)
            };
            events.push(newEvent);
        }
        
        localStorage.setItem('events', JSON.stringify(events));
        
        // Close modal and reload section
        closeModal(document.getElementById('eventModal'));
        
        // Reload the appropriate section based on where we came from
        const activeSection = document.querySelector('.sidebar-menu a.active')?.getAttribute('data-section') || 'events';
        if (activeSection === 'events') {
            loadSection(activeSection);
        }
        
        showNotification(`Event ${editingEventId ? 'updated' : 'created'} successfully!`, 'success');
        
    } catch (error) {
        console.error('Error saving event:', error);
        showNotification('Error saving event. Please try again.', 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Event Management Functions
function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        openEventModal(event);
    }
}

function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        const event = events[eventIndex];
        
        // Remove event files if not used elsewhere
        if (event.fileIds && event.fileIds.length > 0) {
            event.fileIds.forEach(fileId => {
                const isFileUsed = events.some(e => e.id !== eventId && e.fileIds && e.fileIds.includes(fileId));
                if (!isFileUsed) {
                    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
                }
            });
            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
        }
        
        events.splice(eventIndex, 1);
        localStorage.setItem('events', JSON.stringify(events));
        
        // Reload current section
        const activeSection = document.querySelector('.sidebar-menu a.active')?.getAttribute('data-section') || 'events';
        loadSection(activeSection);
        
        showNotification('Event deleted successfully!', 'success');
    }
}

function removeFileFromEvent(eventId, fileId) {
    if (!confirm('Are you sure you want to remove this file from the event?')) {
        return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (event && event.fileIds) {
        event.fileIds = event.fileIds.filter(id => id !== fileId);
        
        // Check if file is used in any other events
        const isFileUsed = events.some(e => e.id !== eventId && e.fileIds && e.fileIds.includes(fileId));
        if (!isFileUsed) {
            uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
        }
        
        localStorage.setItem('events', JSON.stringify(events));
        
        // Refresh the modal
        document.getElementById('eventModal').style.display = 'none';
        setTimeout(() => openEventModal(event), 100);
        
        showNotification('File removed from event!', 'success');
    }
}

// Enhanced View Event Function with all details
function viewEvent(eventId) {
    console.log('View Event clicked for ID:', eventId);
    
    const event = events.find(e => e.id === eventId);
    if (!event) {
        console.error('Event not found with ID:', eventId);
        showNotification('Event not found!', 'error');
        return;
    }

    const eventFiles = uploadedFiles.filter(f => event.fileIds && event.fileIds.includes(f.id));
    
    const viewModal = document.createElement('div');
    viewModal.className = 'modal';
    viewModal.style.display = 'block';
    viewModal.style.zIndex = '2000';
    
    viewModal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; margin: 5% auto;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2 style="color: var(--text-primary); margin-bottom: 1.5rem; border-bottom: 2px solid var(--primary); padding-bottom: 0.5rem;">
                ${escapeHtml(event.title)}
            </h2>
            
            <!-- Event Details Grid -->
            <div class="event-details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div class="detail-item" style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div class="detail-icon" style="background: var(--primary); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;">Date</strong>
                        <div style="color: var(--text-secondary); font-size: 1.1rem; font-weight: 500;">${formatEventDate(event.date)}</div>
                    </div>
                </div>
                
                <div class="detail-item" style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div class="detail-icon" style="background: #4caf50; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;">Time</strong>
                        <div style="color: var(--text-secondary); font-size: 1.1rem; font-weight: 500;">${formatTime(event.time)}</div>
                    </div>
                </div>
                
                <div class="detail-item" style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div class="detail-icon" style="background: #ff9800; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;">Venue</strong>
                        <div style="color: var(--text-secondary); font-size: 1.1rem; font-weight: 500;">${escapeHtml(event.venue)}</div>
                    </div>
                </div>
                
                <div class="detail-item" style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div class="detail-icon" style="background: #9c27b0; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-tag"></i>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;">Category</strong>
                        <div>
                            <span class="event-category ${event.category}" style="display: inline-block; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 500; text-transform: capitalize; background: var(--primary); color: white;">
                                ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Event Description -->
            ${event.description ? `
            <div class="event-description-section" style="margin-bottom: 2rem;">
                <h3 style="color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-align-left" style="color: var(--primary);"></i>
                    Event Description
                </h3>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <p style="margin: 0; line-height: 1.6; color: var(--text-secondary); white-space: pre-line;">${escapeHtml(event.description)}</p>
                </div>
            </div>
            ` : ''}

            <!-- Event Attachments -->
            ${eventFiles.length > 0 ? `
            <div class="event-attachments-section">
                <h3 style="color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-paperclip" style="color: var(--primary);"></i>
                    Event Attachments (${eventFiles.length})
                </h3>
                <div style="display: grid; gap: 0.8rem;">
                    ${eventFiles.map(file => `
                        <div class="attachment-item" style="display: flex; align-items: center; gap: 12px; padding: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 8px; transition: all 0.3s ease;">
                            <div style="font-size: 1.5rem; color: var(--primary);">
                                ${getFileIcon(file.type)}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 500; color: var(--text-primary); margin-bottom: 0.2rem;">${file.name}</div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                    ${formatFileSize(file.size)} • ${getFileTypeDescription(file.type)}
                                </div>
                            </div>
                            <div class="attachment-actions" style="display: flex; gap: 0.5rem;">
                                <button class="btn-small" onclick="previewFile(${file.id})" style="background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 0.8rem;">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="btn-small" onclick="downloadFile(${file.id})" style="background: var(--secondary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 0.8rem;">
                                    <i class="fas fa-download"></i> Download
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Event Metadata -->
            <div class="event-metadata" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        <strong>Posted by:</strong> ${event.author} • 
                        <strong>Created:</strong> ${event.created}
                        ${event.lastEdited ? ` • <strong>Last Edited:</strong> ${event.lastEdited}` : ''}
                    </div>
                    
                    ${currentUser.role === 'admin' ? `
                    <div style="display: flex; gap: 0.8rem;">
                        <button class="btn-primary" onclick="editEvent(${event.id}); this.closest('.modal').remove();" style="padding: 0.7rem 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-edit"></i> Edit Event
                        </button>
                        <button class="btn-danger" onclick="deleteEvent(${event.id}); this.closest('.modal').remove();" style="background: var(--danger); color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-trash"></i> Delete Event
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewModal);
    
    // Close modal when clicking outside
    viewModal.onclick = function(e) {
        if (e.target === viewModal) {
            viewModal.remove();
        }
    };
    
    // Close modal with Escape key
    const closeModalHandler = function(e) {
        if (e.key === 'Escape') {
            viewModal.remove();
            document.removeEventListener('keydown', closeModalHandler);
        }
    };
    document.addEventListener('keydown', closeModalHandler);
}

// Get events for this month
function getThisMonthEvents() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
}

// Export events functionality
function exportEvents() {
    const exportData = events.map(event => ({
        Title: event.title,
        Description: event.description || '',
        Date: event.date,
        Time: event.time,
        Venue: event.venue,
        Category: event.category,
        Author: event.author,
        Created: event.created,
        'Last Edited': event.lastEdited || ''
    }));
    
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Events exported successfully!', 'success');
}

// Convert data to CSV
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

// Utility Functions for Calendar
function formatMonthYear(date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatEventDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}
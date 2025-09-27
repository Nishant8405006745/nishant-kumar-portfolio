// ========================================
// Simple Portfolio JavaScript
// Clean, Minimal Functionality
// ========================================

// DOM Elements - will be initialized after DOM loads
let themeToggle, hamburger, navMenu, navLinks, contactForm, profileContainer, profileImage, viewResumeBtn, downloadResumeNavBtn, shareBtn, shareModal, closeShare;

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        hamburger.addEventListener('click', () => this.toggleMobileMenu());

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                this.closeMobileMenu();
                this.setActiveLink(link);
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    closeMobileMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }

    setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            // Simulate API call
            await this.simulateFormSubmission(data);
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            // Show error message
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    console.log('Form submitted:', data);
                    resolve(data);
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
            <button class="notification-close">×</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 400px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                this.closeNotification(notification);
            }
        }, 5000);
    }

    closeNotification(notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            }, 300);
    }
}

// Resume Download Manager
class ResumeDownloadManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (downloadResumeNavBtn) {
            downloadResumeNavBtn.addEventListener('click', () => this.downloadResumeWithConfirmation());
        }
    }

    downloadResumeWithConfirmation() {
        // Show confirmation dialog
        const confirmed = confirm('Are you sure you want to download the resume?');
        
        if (confirmed) {
            this.downloadResume();
        }
    }

    downloadResume() {
        try {
            console.log('Download resume clicked');
            
            // Show loading state
            if (downloadResumeNavBtn) {
                downloadResumeNavBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
                downloadResumeNavBtn.disabled = true;
            }

            // Create a direct download link
            const link = document.createElement('a');
            link.href = 'Nishant_Kumar_Resume.pdf';
            link.download = 'Nishant_Kumar_Resume.pdf';
            link.target = '_blank';
            
            // Add to DOM, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success notification
            this.showNotification('Resume download started!', 'success');
            
            // Reset button after a short delay
            setTimeout(() => {
                if (downloadResumeNavBtn) {
                    downloadResumeNavBtn.innerHTML = '<i class="fas fa-download"></i> Download Resume';
                    downloadResumeNavBtn.disabled = false;
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error downloading resume:', error);
            this.showNotification('Failed to download resume. Please try again.', 'error');
            
            // Reset button on error
            if (downloadResumeNavBtn) {
                downloadResumeNavBtn.innerHTML = '<i class="fas fa-download"></i> Download Resume';
                downloadResumeNavBtn.disabled = false;
            }
        }
    }

    createAndDownloadFile(content, filename) {
        // Create a blob with the content
        const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        window.URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
            <button class="notification-close">×</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 400px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                this.closeNotification(notification);
            }
        }, 5000);
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    themeToggle = document.getElementById('theme-toggle');
    hamburger = document.getElementById('hamburger');
    navMenu = document.querySelector('.nav-menu');
    navLinks = document.querySelectorAll('.nav-link');
    contactForm = document.getElementById('contact-form');
    profileContainer = document.getElementById('profile-container');
    profileImage = document.getElementById('profile-image');
    viewResumeBtn = document.getElementById('view-resume');
    downloadResumeNavBtn = document.getElementById('download-resume-nav');
    shareBtn = document.getElementById('share-btn');
    shareModal = document.getElementById('share-modal');
    closeShare = document.getElementById('close-share');
    
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new FormHandler();
    new ResumeDownloadManager();
    
    // Initialize Share functionality
    if (shareBtn && shareModal && closeShare) {
        // Open share modal
        shareBtn.addEventListener('click', () => {
            shareModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Close share modal
        closeShare.addEventListener('click', () => {
            shareModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Handle share options
        const shareOptions = document.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.getAttribute('data-platform');
                sharePortfolio(platform);
            });
        });
    }

    console.log('🚀 Simple Portfolio loaded successfully!');
    console.log('Resume buttons found:', { viewResumeBtn, downloadResumeNavBtn });
    console.log('Share elements found:', { shareBtn, shareModal, closeShare });
});

// Share Portfolio Function
function sharePortfolio(platform) {
    const url = window.location.href;
    const title = "Er. Nishant Kumar - Software Engineer & Data Engineer";
    const description = "Check out Nishant Kumar's portfolio - Software Engineer & Data Engineer with 2+ years of experience";
    
    let shareUrl = '';
    
    switch(platform) {
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Portfolio link copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Portfolio link copied to clipboard!', 'success');
            });
            return;
            
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`;
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
            break;
            
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
            
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + ' - ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        shareModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Notification function for share feedback
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
// ============================================
// SARAL SEVA AI - JAVASCRIPT FUNCTIONALITY
// ============================================

// ============================================
// LOADING SCREEN
// ============================================

// Show loading screen on page load
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Add fade out animation
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';

        // Remove loading screen after fade out
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }
});

// On Page Load - Check for registered user and auto-fill login
document.addEventListener('DOMContentLoaded', function() {
    // Ensure body is scrollable
    document.body.style.overflow = 'auto';

    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (savedUser) {
        // Auto-fill login form with saved credentials
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');

        if (loginEmail) loginEmail.value = savedUser.email;
        if (loginPassword) loginPassword.value = savedUser.password;

        // Check if user is already logged in
        const loggedInEmail = localStorage.getItem('userEmail');
        if (loggedInEmail && loggedInEmail === savedUser.email) {
            updateUIAfterLogin(savedUser.name, savedUser.email);
        }
    }

    // Initialize Sparkles Animation
    initSparkles();
});

// ============================================
// SPARKLES ANIMATION
// ============================================

function initSparkles() {
    const canvas = document.getElementById('sparkles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Set canvas size
    function resizeCanvas() {
        const hero = document.getElementById('home');
        if (hero) {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random();
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            this.fadeSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Twinkle effect
            this.opacity += this.fadeDirection * this.fadeSpeed;
            if (this.opacity >= 1) {
                this.opacity = 1;
                this.fadeDirection = -1;
            } else if (this.opacity <= 0.1) {
                this.opacity = 0.1;
                this.fadeDirection = 1;
            }

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(800, Math.floor((canvas.width * canvas.height) / 2000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// Navigation Hamburger Menu
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.classList.toggle('active');
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
}

// Smooth Scroll to Section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Update Active Nav Link (Glass Radio Group)
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navHeight = document.querySelector('.navbar').offsetHeight;

    const sectionRadioMap = {
        'home': 'glass-home',
        'services': 'glass-services',
        'features': 'glass-features',
        'how-it-works': 'glass-how',
        'contact': 'glass-contact'
    };

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update active radio button
    if (currentSection && sectionRadioMap[currentSection]) {
        const radioId = sectionRadioMap[currentSection];
        const radio = document.getElementById(radioId);
        if (radio) {
            radio.checked = true;
        }
    }
});

// ============================================
// MODAL FUNCTIONS
// ============================================

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');

    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

// Show Login Modal
function showLogin() {
    closeRegister();
    closeDemo();
    document.getElementById('loginModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Login Modal
function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show Register Modal
function showRegister() {
    closeLogin();
    closeDemo();
    document.getElementById('registerModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Register Modal
function closeRegister() {
    document.getElementById('registerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show Demo Modal
function showDemo() {
    closeLogin();
    closeRegister();
    document.getElementById('demoModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Demo Modal
function closeDemo() {
    document.getElementById('demoModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const demoModal = document.getElementById('demoModal');

    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === registerModal) {
        closeRegister();
    }
    if (event.target === demoModal) {
        closeDemo();
    }
});

// Switch between Login and Register
function switchToLogin() {
    closeRegister();
    showLogin();
}

function switchToRegister() {
    closeLogin();
    showRegister();
}

// ============================================
// FORM HANDLING
// ============================================

// Handle Login Form
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Check if user exists in localStorage
    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (savedUser) {
        if (email === savedUser.email && password === savedUser.password) {
            // Store in localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('userEmail', email);
                localStorage.setItem('rememberMe', 'true');
            }
            alert(`Welcome back, ${savedUser.name}! Login successful.`);
            closeLogin();
            updateUIAfterLogin(savedUser.name, email);
        } else {
            alert('Invalid email or password. Please try again.');
        }
    } else {
        alert('No account found. Please register first.');
    }
}

// Handle Register Form
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const language = document.getElementById('registerLanguage').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!name || !phone || !language || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (!agreeTerms) {
        alert('Please agree to the Terms of Service');
        return;
    }

    // Phone validation (basic)
    if (phone.length < 10) {
        alert('Please enter a valid phone number');
        return;
    }

    // Store user data for login
    const registeredUser = {
        name,
        phone,
        language,
        email,
        password
    };

    localStorage.setItem('registeredUser', JSON.stringify(registeredUser));
    localStorage.setItem('userEmail', email);

    console.log('Registration successful:', registeredUser);
    alert(`Welcome ${name}! Your account has been created.\n\nYou can now login with:\nEmail: ${email}\nPassword: ${password}`);
    closeRegister();

    // Auto-fill login form with registered credentials
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;

    updateUIAfterLogin(name, email);
}

// Update UI After Login/Register
function updateUIAfterLogin(name, email) {
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons) {
        navButtons.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; color: white;">
                <span>👤 ${name}</span>
                <button class="btn-register" onclick="handleLogout()">Logout</button>
            </div>
        `;
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    location.reload();
}

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

// Set Query in Chat Input
function setQuery(query) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = query;
}

// Send Chat Message
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) {
        alert('Please type a message');
        return;
    }

    // Add user message to chat
    addMessageToChat('user', message);

    // Clear input
    chatInput.value = '';

    // Simulate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessageToChat('bot', aiResponse);
    }, 500);
}

// Add Message to Chat
function addMessageToChat(sender, message) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;

    if (sender === 'user') {
        messageElement.innerHTML = `<p>${escapeHtml(message)}</p>`;
    } else {
        messageElement.innerHTML = `<p>${message}</p>`;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate AI Response (Mock)
function generateAIResponse(userQuery) {
    const query = userQuery.toLowerCase();

    // Service-specific responses
    if (query.includes('eb') || query.includes('electricity') || query.includes('bill')) {
        return `
            <strong>EB Bill Service - How Can I Help?</strong>
            <ul class="bot-steps">
                <li><strong>Common Services:</strong></li>
                <li>✓ Name Change in Bill</li>
                <li>✓ Address Update</li>
                <li>✓ Bill Correction</li>
                <li>✓ New Connection</li>
                <li>✓ Disconnection/Reconnection</li>
                <li style="margin-top: 0.8rem; color: #6b7280;">What specific help do you need?</li>
            </ul>
        `;
    }

    if (query.includes('ration') || query.includes('card')) {
        return `
            <strong>Ration Card Services</strong>
            <ul class="bot-steps">
                <li><strong>Available Services:</strong></li>
                <li>✓ Address Update</li>
                <li>✓ Add Family Members</li>
                <li>✓ Document Verification</li>
                <li>✓ Subsidy Tracking</li>
                <li>✓ Card Replacement</li>
                <li style="margin-top: 0.8rem; color: #6b7280;">Tell me your specific requirement.</li>
            </ul>
        `;
    }

    if (query.includes('water') || query.includes('connection')) {
        return `
            <strong>Water Connection Services</strong>
            <ul class="bot-steps">
                <li><strong>Services Available:</strong></li>
                <li>✓ New Connection Application</li>
                <li>✓ Bill Issues & Complaints</li>
                <li>✓ Meter Reading Disputes</li>
                <li>✓ Service Requests</li>
                <li>✓ Connection Upgrade</li>
                <li style="margin-top: 0.8rem; color: #6b7280;">How can I assist you today?</li>
            </ul>
        `;
    }

    if (query.includes('police') || query.includes('complaint')) {
        return `
            <strong>Police Complaint Services</strong>
            <ul class="bot-steps">
                <li><strong>Available Options:</strong></li>
                <li>✓ File FIR (First Information Report)</li>
                <li>✓ Track Complaint Status</li>
                <li>✓ Lost & Found</li>
                <li>✓ Document Assistance</li>
                <li>✓ Legal Guidance</li>
                <li style="margin-top: 0.8rem; color: #6b7280;">What type of complaint do you need to file?</li>
            </ul>
        `;
    }

    if (query.includes('property') || query.includes('tax')) {
        return `
            <strong>Property Tax Services</strong>
            <ul class="bot-steps">
                <li><strong>Services Offered:</strong></li>
                <li>✓ Tax Calculation</li>
                <li>✓ Property Registration</li>
                <li>✓ Payment Status Check</li>
                <li>✓ Tax Exemptions</li>
                <li>✓ Certificate Generation</li>
                <li style="margin-top: 0.8rem; color: #6b7280;">Please describe your requirement.</li>
            </ul>
        `;
    }

    // Default response
    return `
        <strong>How Can I Help You?</strong>
        <ul class="bot-steps">
            <li>I can assist you with:</li>
            <li>💡 EB Bill Management</li>
            <li>📄 Ration Card Services</li>
            <li>💧 Water Connections</li>
            <li>🏠 Property Tax</li>
            <li>⚠️ Police Complaints</li>
            <li>🏛️ Civic Services</li>
            <li style="margin-top: 0.8rem; color: #6b7280;">Choose a service or describe your issue.</li>
        </ul>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// SERVICE EXPLORATION
// ============================================

function exploreService(serviceType) {
    // Show service details modal instead of redirecting to login
    showServiceModal(serviceType);
    // Store selected service
    sessionStorage.setItem('selectedService', serviceType);
}

// Service details data
const serviceDetails = {
    'EB Bill Management': {
        icon: 'fas fa-bolt',
        color: '#f59e0b',
        description: 'Complete assistance for all electricity bill related issues and services.',
        features: [
            'Name change on EB bill',
            'Bill correction and disputes',
            'New connection application',
            'Payment guidance and tracking',
            'Meter reading issues',
            'Tariff category changes'
        ],
        documents: ['Aadhaar Card', 'Property Documents', 'Previous Bill Copy', 'ID Proof'],
        helpline: '1912'
    },
    'Ration Card Services': {
        icon: 'fas fa-file-alt',
        color: '#10b981',
        description: 'Manage your ration card services with ease and get your entitlements.',
        features: [
            'Address update',
            'Add/remove family members',
            'Document verification',
            'Check subsidy status',
            'Apply for new card',
            'Card type conversion'
        ],
        documents: ['Aadhaar Card', 'Income Certificate', 'Residence Proof', 'Family Photos'],
        helpline: '1967'
    },
    'Water Connection': {
        icon: 'fas fa-water',
        color: '#3b82f6',
        description: 'Get help with water connection applications and bill management.',
        features: [
            'New connection application',
            'Bill payment assistance',
            'Complaint registration',
            'Service request tracking',
            'Meter issues',
            'Connection transfer'
        ],
        documents: ['Property Documents', 'ID Proof', 'Address Proof', 'NOC if applicable'],
        helpline: '1916'
    },
    'Property Tax': {
        icon: 'fas fa-home',
        color: '#8b5cf6',
        description: 'Property registration, tax calculation and payment made simple.',
        features: [
            'Tax calculation',
            'Property registration',
            'Payment status check',
            'Apply for exemptions',
            'Ownership transfer',
            'Assessment appeals'
        ],
        documents: ['Sale Deed', 'Encumbrance Certificate', 'ID Proof', 'Previous Tax Receipts'],
        helpline: '1800-XXX-XXXX'
    },
    'Police Complaints': {
        icon: 'fas fa-exclamation-triangle',
        color: '#ef4444',
        description: 'File complaints, track status and get legal guidance assistance.',
        features: [
            'File FIR online',
            'Track complaint status',
            'Document assistance',
            'Legal guidance',
            'Women helpline',
            'Cyber crime reporting'
        ],
        documents: ['ID Proof', 'Evidence Documents', 'Witness Details', 'Incident Details'],
        helpline: '100 / 112'
    },
    'Civic Services': {
        icon: 'fas fa-city',
        color: '#06b6d4',
        description: 'Municipal services, road complaints, sanitation and public utilities.',
        features: [
            'Road repair complaints',
            'Sanitation issues',
            'Public utility problems',
            'Building permits',
            'Trade license',
            'Birth/Death certificates'
        ],
        documents: ['ID Proof', 'Address Proof', 'Application Form', 'Photos if required'],
        helpline: '1800-XXX-XXXX'
    }
};

function showServiceModal(serviceType) {
    const service = serviceDetails[serviceType];
    if (!service) return;

    // Remove existing modal if any
    const existingModal = document.getElementById('serviceModal');
    if (existingModal) existingModal.remove();

    const featuresHTML = service.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('');
    const documentsHTML = service.documents.map(d => `<span class="doc-tag">${d}</span>`).join('');

    const modalHTML = `
        <div id="serviceModal" class="service-modal-overlay" onclick="closeServiceModal(event)">
            <div class="service-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeServiceModal()">&times;</button>
                <div class="modal-header" style="--service-color: ${service.color}">
                    <div class="modal-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    <h2>${serviceType}</h2>
                    <p>${service.description}</p>
                </div>
                <div class="modal-body">
                    <div class="modal-section">
                        <h3><i class="fas fa-list-check"></i> Services We Help With</h3>
                        <ul class="features-list">
                            ${featuresHTML}
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h3><i class="fas fa-folder-open"></i> Documents Required</h3>
                        <div class="documents-tags">
                            ${documentsHTML}
                        </div>
                    </div>
                    <div class="modal-section helpline">
                        <h3><i class="fas fa-phone"></i> Helpline</h3>
                        <p class="helpline-number">${service.helpline}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-get-started" onclick="getStartedWithService('${serviceType}')">
                        <i class="fas fa-rocket"></i> Get Started
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Trigger animation
    setTimeout(() => {
        document.getElementById('serviceModal').classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeServiceModal(event) {
    if (event && event.target !== event.currentTarget) return;
    
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function getStartedWithService(serviceType) {
    closeServiceModal();
    // Scroll to the chatbot section or how-it-works section
    scrollToSection('how-it-works');
    // Show notification
    showNotification(`Ready to help you with ${serviceType}! Follow the steps to get started.`, 'success');
}

// ============================================
// DOCUMENT UPLOAD HANDLING
// ============================================

function handleFileUpload(event) {
    const files = event.target.files;
    const uploadStatus = document.getElementById('uploadStatus');

    if (files.length === 0) {
        return;
    }

    // Check file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];
    const file = files[0];

    if (!allowedTypes.includes(file.type)) {
        uploadStatus.style.display = 'block';
        uploadStatus.innerHTML = '❌ Invalid file type. Please upload PDF, JPG, PNG, or DOC files.';
        uploadStatus.style.color = '#ef4444';
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        uploadStatus.style.display = 'block';
        uploadStatus.innerHTML = '❌ File is too large. Maximum size is 5MB.';
        uploadStatus.style.color = '#ef4444';
        return;
    }

    // Simulate upload
    uploadStatus.style.display = 'block';
    uploadStatus.innerHTML = '⏳ Processing document...';
    uploadStatus.style.color = '#f59e0b';

    setTimeout(() => {
        uploadStatus.innerHTML = `✅ ${file.name} uploaded successfully!<br>Document Status: Verified and Ready<br>All required information present ✓`;
        uploadStatus.style.color = '#10b981';
    }, 1500);
}

// ============================================
// OFFICE LOCATOR
// ============================================

// Filter Offices
function filterOffices() {
    const searchInput = document.getElementById('officeSearch').value.toLowerCase();
    const officeItems = document.querySelectorAll('.office-item');

    officeItems.forEach(office => {
        const text = office.textContent.toLowerCase();
        office.style.display = text.includes(searchInput) ? 'block' : 'none';
    });
}

// Find Nearest Office
function findNearestOffice() {
    const mapOverlay = document.getElementById('mapOverlay');
    const officeMap = document.getElementById('officeMap');
    
    if (navigator.geolocation) {
        // Show loading overlay
        if (mapOverlay) mapOverlay.classList.add('loading');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log(`User location: ${lat}, ${lng}`);
                
                // Update map to user's location
                updateMapLocation(lat, lng);
                
                // Hide loading overlay
                if (mapOverlay) mapOverlay.classList.remove('loading');
                
                showNotification('📍 Found your location! Map updated with nearby offices.', 'success');
            },
            (error) => {
                if (mapOverlay) mapOverlay.classList.remove('loading');
                showNotification('Location access denied. Please enable location services.', 'error');
            }
        );
    } else {
        showNotification('Geolocation is not supported by your browser.', 'error');
    }
}

// Update map to specific location
function updateMapLocation(lat, lng) {
    const officeMap = document.getElementById('officeMap');
    if (officeMap) {
        // Calculate bounding box around the location
        const delta = 0.05;
        const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
        officeMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
    }
}

// Toggle map fullscreen
function toggleMapFullscreen() {
    const mapWrapper = document.getElementById('map');
    const fullscreenBtn = mapWrapper.querySelector('.map-fullscreen-btn i');
    
    if (mapWrapper.classList.contains('fullscreen')) {
        mapWrapper.classList.remove('fullscreen');
        fullscreenBtn.classList.remove('fa-compress');
        fullscreenBtn.classList.add('fa-expand');
        document.body.style.overflow = '';
    } else {
        mapWrapper.classList.add('fullscreen');
        fullscreenBtn.classList.remove('fa-expand');
        fullscreenBtn.classList.add('fa-compress');
        document.body.style.overflow = 'hidden';
    }
}

// Get Directions - Opens in Google Maps
function getDirections(address) {
    const defaultAddress = '123 Power Street, City Center';
    const destination = address || defaultAddress;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // Open Google Maps with directions
                const url = `https://www.google.com/maps/dir/${lat},${lng}/${encodeURIComponent(destination)}`;
                window.open(url, '_blank');
            },
            (error) => {
                // Open Google Maps without starting location
                const url = `https://www.google.com/maps/search/${encodeURIComponent(destination)}`;
                window.open(url, '_blank');
            }
        );
    } else {
        const url = `https://www.google.com/maps/search/${encodeURIComponent(destination)}`;
        window.open(url, '_blank');
    }
}

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    const mapOverlay = document.getElementById('mapOverlay');
    const officeMap = document.getElementById('officeMap');
    
    if (officeMap) {
        officeMap.addEventListener('load', function() {
            if (mapOverlay) mapOverlay.classList.remove('loading');
        });
    }
    
    // Close fullscreen map on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mapWrapper = document.getElementById('map');
            if (mapWrapper && mapWrapper.classList.contains('fullscreen')) {
                toggleMapFullscreen();
            }
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Observe all service cards and feature items
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .testimonial-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Load saved user data on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe');

    if (savedEmail && rememberMe) {
        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail) {
            loginEmail.value = savedEmail;
        }
        updateUIAfterLogin(savedEmail);
    }

    // Add animation to hero floating card
    const floatingCard = document.querySelector('.floating-card');
    if (floatingCard) {
        floatingCard.style.animation = 'float 3s ease-in-out infinite';
    }
});

// Prevent form submission on Enter in modals
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        event.preventDefault();
    }
});

// Handle chat input on Enter
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && event.target.id === 'chatInput') {
        sendMessage();
    }
});

// ============================================
// PRINT FRIENDLY STYLES
// ============================================

if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener((mql) => {
        if (mql.matches) {
            document.body.style.background = 'white';
            document.querySelector('.navbar').style.display = 'none';
            document.querySelector('.footer').style.display = 'none';
        }
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images (future enhancement)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    // In production, send to error tracking service
});

// Handle promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// ============================================
// ANALYTICS & TRACKING (Placeholder)
// ============================================

// Track button clicks
document.addEventListener('click', (event) => {
    if (event.target.closest('button')) {
        const button = event.target.closest('button');
        console.log('Button clicked:', button.textContent);
        // In production: send to analytics service
    }
});

// ============================================
// ACCESSIBILITY
// ============================================

// Announce to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    document.body.appendChild(announcement);

    setTimeout(() => announcement.remove(), 1000);
}

// ============================================
// SERVICE WORKER (Future Enhancement)
// ============================================

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js');
    // });
}

// ============================================
// DARK MODE SUPPORT (Future Enhancement)
// ============================================

// Check for dark mode preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function toggleDarkMode() {
    const html = document.documentElement;
    if (prefersDarkScheme.matches) {
        // Apply dark theme
        html.style.colorScheme = 'dark';
    }
}

// Watch for dark mode preference changes
prefersDarkScheme.addListener(toggleDarkMode);

console.log('SaralSeva AI - Frontend initialized successfully!');
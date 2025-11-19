// Configuration will be loaded from data.json
let config = {};

// DOM elements
let navbar, navToggle, navMenu, contactForm, formMessage;
let serviceModal, modalCloseBtn, modalCloseBtnFooter;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadConfigurationFromJSON().then(() => {
        loadContent();
        setupEventListeners();
        initializeFeatherIcons();
        setupScrollEffects();
        setupNavigation();
        setupContactForm();
        setupServiceModal();
        setTimeout(() => {
            addLoadingAnimations();
        }, 100);
    }).catch(error => {
        console.error('Failed to load configuration:', error);
        useDefaultConfig();
        loadContent();
        setupEventListeners();
        initializeFeatherIcons();
        setupScrollEffects();
        setupNavigation();
        setupContactForm();
        setupServiceModal();
        setTimeout(() => {
            addLoadingAnimations();
        }, 100);
    });
});

// Load configuration from external JSON file
async function loadConfigurationFromJSON() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        config = await response.json();
        console.log('Configuration loaded successfully');
    } catch (error) {
        console.error('Error loading configuration from JSON:', error);
        throw error;
    }
}

// Fallback configuration in case JSON loading fails
function useDefaultConfig() {
    config = {
        "firmName": "Legal O Flex",
        "tagline": "Expert Legal Solutions for the Digital Age",
        "heroSubtitle": "Professional virtual law firm providing comprehensive legal services with modern technology and personalized attention.",
        "about": {
            "title": "About Our Firm",
            "description": "Legal O Flex is a forward-thinking virtual law firm committed to providing exceptional legal representation and counsel. We leverage modern technology to deliver efficient, cost-effective legal solutions while maintaining the highest standards of professional service.",
            "lawyerName": "Our Legal Team",
            "lawyerBio": "With extensive experience in various areas of law, Legal O Flex brings a client-focused approach to legal practice. Specializing in modern legal challenges, we provide strategic counsel and representation tailored to each client's unique needs.",
            "credentials": [
                "Licensed Legal Practitioners",
                "Member of Bar Council",
                "10+ Years of Legal Experience",
                "Virtual Law Practice Pioneer"
            ]
        },
        "services": [
            {
                "title": "Corporate Law",
                "description": "<p>Comprehensive corporate legal services including business formation, contracts, compliance, and corporate governance.</p>",
                "icon": "briefcase"
            },
            {
                "title": "Contract Law",
                "description": "<p>Expert contract drafting, review, negotiation, and dispute resolution for businesses and individuals.</p>",
                "icon": "file-text"
            },
            {
                "title": "Intellectual Property",
                "description": "<p>Protection and enforcement of intellectual property rights including trademarks, copyrights, and patents.</p>",
                "icon": "shield"
            },
            {
                "title": "Employment Law",
                "description": "<p>Comprehensive employment legal services for both employers and employees, including policy development and dispute resolution.</p>",
                "icon": "users"
            },
            {
                "title": "Dispute Resolution",
                "description": "<p>Expert representation in litigation, arbitration, and mediation for commercial and civil disputes.</p>",
                "icon": "scale"
            },
            {
                "title": "Legal Consultation",
                "description": "<p>Strategic legal advice and consultation for businesses and individuals on various legal matters.</p>",
                "icon": "message-circle"
            }
        ],
        "contact": {
            "phone": "+91 98765 43210",
            "email": "contact@legaloflex.com",
            "address": "Virtual Office - Serving Clients Nationwide",
            "hours": "Monday - Friday: 9:00 AM - 6:00 PM",
            "emergencyContact": "Available 24/7 for urgent matters"
        },
        "socialMedia": {
            "linkedin": "https://linkedin.com/company/legal-o-flex",
            "twitter": "https://twitter.com/legaloflex",
            "facebook": "https://facebook.com/legaloflex"
        }
    };
}

// Initialize DOM elements
function initializeElements() {
    navbar = document.getElementById('navbar');
    navToggle = document.getElementById('nav-toggle');
    navMenu = document.getElementById('nav-menu');
    contactForm = document.getElementById('contact-form');
    formMessage = document.getElementById('form-message');
    serviceModal = document.getElementById('service-modal');
    modalCloseBtn = document.getElementById('modal-close-btn');
    modalCloseBtnFooter = document.getElementById('modal-close-btn-footer');
}

// Load content from configuration
function loadContent() {
    try {
        updateElement('nav-firm-name', config.firmName);
        updateElement('hero-title', config.firmName);
        updateElement('hero-tagline', config.tagline);
        updateElement('hero-subtitle', config.heroSubtitle);
        updateElement('footer-firm-name', config.firmName);
        updateElement('about-title', config.about.title);
        updateElement('about-description', config.about.description);
        updateElement('lawyer-name', config.about.lawyerName);
        updateElement('lawyer-bio', config.about.lawyerBio);
        loadCredentials();
        loadServices();
        updateElement('contact-phone', config.contact.phone);
        updateElement('contact-email', config.contact.email);
        updateElement('contact-address', config.contact.address);
        updateElement('contact-hours', config.contact.hours);
        updateElement('emergency-contact', config.contact.emergencyContact);
        updateElement('footer-phone', config.contact.phone);
        updateElement('footer-email', config.contact.email);
        updateSocialLinks();
        loadFooterServices();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element && content) {
        element.textContent = content;
    }
}

function loadCredentials() {
    const credentialsList = document.getElementById('credentials-list');
    if (credentialsList && config.about && config.about.credentials) {
        credentialsList.innerHTML = '';
        config.about.credentials.forEach(credential => {
            const li = document.createElement('li');
            li.textContent = credential;
            credentialsList.appendChild(li);
        });
    }
}

function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && config.services) {
        servicesGrid.innerHTML = '';
        config.services.forEach((service, index) => {
            const serviceBtn = createServiceButton(service, index);
            servicesGrid.appendChild(serviceBtn);
        });
    }
}

function createServiceButton(service, index) {
    const btn = document.createElement('button');
    btn.className = 'service-btn loading';
    btn.type = 'button';
    btn.innerHTML = `
        <div class="service-icon">
            <i data-feather="${service.icon}"></i>
        </div>
        <h3>${service.title}</h3>
    `;
    btn.addEventListener('click', () => openServiceModal(service));
    return btn;
}

function openServiceModal(service) {
    document.getElementById('modal-service-title').textContent = service.title;
    // Use innerHTML to support multiple paragraphs and HTML formatting
    document.getElementById('modal-service-description').innerHTML = service.description;
    
    // Update the icon
    const iconElement = document.getElementById('modal-service-icon');
    iconElement.innerHTML = `<i data-feather="${service.icon}"></i>`;
    
    serviceModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Reinitialize feather icons for the modal
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function closeServiceModal() {
    serviceModal.classList.remove('show');
    document.body.style.overflow = '';
}

function setupServiceModal() {
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeServiceModal);
    }
    if (modalCloseBtnFooter) {
        modalCloseBtnFooter.addEventListener('click', closeServiceModal);
    }
    
    // Close modal when clicking outside the modal content
    if (serviceModal) {
        serviceModal.addEventListener('click', (e) => {
            if (e.target === serviceModal) {
                closeServiceModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('show')) {
            closeServiceModal();
        }
    });
}

function updateSocialLinks() {
    const socialLinks = {
        'social-linkedin': config.socialMedia?.linkedin,
        'social-twitter': config.socialMedia?.twitter,
        'social-facebook': config.socialMedia?.facebook
    };
    Object.entries(socialLinks).forEach(([id, url]) => {
        const element = document.getElementById(id);
        if (element && url) {
            element.href = url;
        }
    });
}

function loadFooterServices() {
    const footerServices = document.getElementById('footer-services');
    if (footerServices && config.services) {
        footerServices.innerHTML = '';
        config.services.slice(0, 4).forEach(service => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#services';
            a.textContent = service.title;
            a.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToSection('services');
            });
            li.appendChild(a);
            footerServices.appendChild(li);
        });
    }
}

function setupEventListeners() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function initializeFeatherIcons() {
    if (typeof feather !== 'undefined') {
        feather.replace();
        setTimeout(() => {
            feather.replace();
        }, 200);
    }
}

function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        updateActiveNavLinkOnScroll();
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            updateActiveNavLink(`#${targetId}`);
            closeMobileMenu();
        });
    });
    const heroBtns = document.querySelectorAll('.hero-buttons .btn');
    heroBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                scrollToSection(targetId);
                updateActiveNavLink(href);
            }
        });
    });
}

function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function toggleMobileMenu() {
    if (navMenu && navToggle) {
        const isActive = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileMenu() {
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleScroll() {
    const scrolled = window.scrollY > 50;
    if (navbar) {
        navbar.classList.toggle('scrolled', scrolled);
    }
}

function handleResize() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;
    let activeSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = `#${sectionId}`;
        }
    });
    if (activeSection) {
        updateActiveNavLink(activeSection);
    }
}

function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        const formControls = contactForm.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.addEventListener('blur', validateField);
            control.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    if (validateForm()) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        setTimeout(() => {
            showFormMessage('Thank you for contacting us! We will get back to you within 24 hours.', 'success');
            contactForm.reset();
            clearAllFieldErrors();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    clearFieldError(e);
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    if (field.name === 'message' && value) {
        if (value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
            isValid = false;
        }
    }
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        field.classList.add('valid');
    }
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('invalid');
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearAllFieldErrors() {
    const fields = contactForm.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.classList.remove('invalid', 'valid');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.classList.remove('hidden');
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
}

function addLoadingAnimations() {
    const elements = document.querySelectorAll('.loading');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('loaded');
        }, index * 150);
    });
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        const serviceButtons = document.querySelectorAll('.service-btn');
        serviceButtons.forEach(btn => {
            observer.observe(btn);
        });
    }
}

function updateConfig(newConfig) {
    Object.assign(config, newConfig);
    loadContent();
    setTimeout(() => {
        initializeFeatherIcons();
    }, 100);
}

window.LegalOFlex = {
    updateConfig,
    config,
    scrollToSection
};
// ========================================
// Custom JavaScript for Portfolio Website
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Navbar scroll effect
    initNavbarScroll();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Back to top button
    initBackToTopButton();
    
    // Skills animation
    initSkillsAnimation();
    
    // Contact form enhancement
    initContactForm();
    
    // Typing animation for hero section
    initTypingAnimation();
    
    // Parallax effect
    initParallaxEffect();
    
    // Project cards animation
    initProjectCards();
    
    // Initialize tooltips
    initTooltips();
});


// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}


// Smooth scrolling for navigation links (✅ FIXED collapse bug)
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"], a[href*="#"]');

    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // ✅ FIXED here
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}


// Back to top button
function initBackToTopButton() {
    const backToTopBtn = document.getElementById('btn-back-to-top');
    
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('show', window.scrollY > 300);
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// Skills animation
function initSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillsSection.classList.add('skills-animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    }
}


// Contact form with AJAX feedback
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(r => r.json())
        .then(data => {
            showMessage(
                data.success ? 'Message sent successfully!' : 'Please correct the errors.',
                data.success ? 'success' : 'error'
            );
            if (data.success) contactForm.reset();
        })
        .catch(() => showMessage('Error! Try again.', 'error'))
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}


function showMessage(msg, type) {
    const container = document.querySelector('.messages-container') || createMessagesContainer();
    const alertDiv = document.createElement('div');

    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} message-alert`;
    alertDiv.innerHTML = msg;

    container.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

function createMessagesContainer() {
    const container = document.createElement('div');
    container.className = 'messages-container';
    document.body.appendChild(container);
    return container;
}


// Typing animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = typingElement.getAttribute('data-texts').split(',');
    let i = 0, j = 0, deleting = false;

    function type() {
        typingElement.textContent = texts[i].slice(0, j);

        if (!deleting && j < texts[i].length) j++;
        else if (deleting && j > 0) j--;
        else { deleting = !deleting; if (!deleting) i = (i + 1) % texts.length; }

        setTimeout(type, deleting ? 70 : 150);
    }

    type();
}


// Parallax
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.parallax').forEach(el => {
            el.style.transform = `translateY(${window.pageYOffset * -0.5}px)`;
        });
    });
}


// Projects hover animation
function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-8px)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
    });
}


// Tooltip initializer
function initTooltips() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
}

// ============================================
// SCRIPT.JS - Dual Mode Portfolio
// Light/Dark Mode + Reversible Slide Switch
// Priyanshu Sharma
// ============================================

document.addEventListener("DOMContentLoaded", function() {
    
    // ========== SCROLL REVEAL ANIMATION ==========
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Trigger initial reveals
    window.addEventListener('load', () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('active');
            }
        });
    });
    
    // ========== LIGHT / DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('portfolioTheme');
    
    // Apply stored theme on load
    if (storedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️ Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.textContent = '🌙 Dark Mode';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('portfolioTheme', isDark ? 'dark' : 'light');
            themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        });
    }
    
    // ========== MOBILE HAMBURGER MENU ==========
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navLinks');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        const navItems = navMenu.querySelectorAll('a');
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (menuBtn) menuBtn.textContent = '☰';
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuBtn) menuBtn.textContent = '☰';
            }
        });
    }
    
    // ========== ACTIVE LINK ON SCROLL ==========
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a:not(.theme-btn)');
    
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active-link');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
    
    // ========== SMOOTH SCROLLING ==========
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = 80;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - navbarHeight,
                    behavior: "smooth"
                });
                
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuBtn) menuBtn.textContent = '☰';
                }
            }
        });
    });
    
    // ========== REVERSIBLE SLIDE SWITCH (TOGGLE CONTACT) ==========
    const slideWrapper = document.getElementById('slideSwitchWrapper');
    const thumb = document.getElementById('slideThumb');
    const slideLabel = document.getElementById('slideLabel');
    const statusMsg = document.getElementById('slideStatusMsg');
    const contactInfo = document.getElementById('contactInfo');
    
    let isContactVisible = false;
    let isDragging = false;
    let startX = 0;
    let currentLeft = 0;
    let maxLeft = 0;
    
    // Get track element
    const track = slideWrapper ? slideWrapper.querySelector('.slide-switch-track') : null;
    
    function updateDimensions() {
        if (!track || !thumb) return;
        const trackWidth = track.clientWidth;
        const thumbWidth = thumb.offsetWidth;
        maxLeft = trackWidth - thumbWidth - 8;
    }
    
    function setThumbPosition(visible) {
        if (!thumb) return;
        if (visible) {
            // Contact visible: thumb moves to the right
            thumb.style.left = maxLeft + 'px';
            currentLeft = maxLeft;
            if (slideLabel) slideLabel.textContent = 'slide to hide contact';
            if (statusMsg) statusMsg.textContent = '👆 Slide back to hide';
        } else {
            // Contact hidden: thumb at left
            thumb.style.left = '0px';
            currentLeft = 0;
            if (slideLabel) slideLabel.textContent = 'slide to show contact';
            if (statusMsg) statusMsg.textContent = '';
        }
    }
    
    function showContact() {
        if (!isContactVisible) {
            isContactVisible = true;
            contactInfo.classList.add('show');
            setThumbPosition(true);
            // Add style to make contact visible (CSS handles opacity)
        }
    }
    
    function hideContact() {
        if (isContactVisible) {
            isContactVisible = false;
            contactInfo.classList.remove('show');
            setThumbPosition(false);
        }
    }
    
    // Toggle based on thumb position
    function toggleContactFromPosition() {
        if (!thumb) return;
        const leftPos = parseFloat(thumb.style.left);
        const isNearRight = leftPos >= maxLeft * 0.85;
        
        if (isNearRight && !isContactVisible) {
            showContact();
        } else if (!isNearRight && isContactVisible) {
            hideContact();
        }
    }
    
    // Drag handlers
    function handleStart(e) {
        if (!thumb) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startX = clientX;
        isDragging = true;
        thumb.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging || !thumb) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let deltaX = clientX - startX;
        let newLeft = currentLeft + deltaX;
        
        if (newLeft < 0) newLeft = 0;
        if (newLeft > maxLeft) newLeft = maxLeft;
        
        thumb.style.left = newLeft + 'px';
        e.preventDefault();
    }
    
    function handleEnd() {
        if (!isDragging || !thumb) {
            isDragging = false;
            return;
        }
        isDragging = false;
        thumb.style.cursor = 'grab';
        
        const finalLeft = parseFloat(thumb.style.left);
        const shouldBeVisible = finalLeft >= maxLeft * 0.5;
        
        if (shouldBeVisible && !isContactVisible) {
            showContact();
        } else if (!shouldBeVisible && isContactVisible) {
            hideContact();
        } else if (shouldBeVisible && isContactVisible) {
            // Already visible, ensure thumb is at max
            thumb.style.left = maxLeft + 'px';
            currentLeft = maxLeft;
        } else if (!shouldBeVisible && !isContactVisible) {
            // Already hidden, ensure thumb at 0
            thumb.style.left = '0px';
            currentLeft = 0;
        }
    }
    
    // Click on track to toggle
    function handleTrackClick(e) {
        if (!track || !thumb) return;
        // Don't trigger if clicking on thumb
        if (e.target === thumb || thumb.contains(e.target)) return;
        
        // Toggle contact visibility directly
        if (isContactVisible) {
            hideContact();
        } else {
            showContact();
        }
    }
    
    // Initialize slide switch
    if (thumb && track) {
        updateDimensions();
        window.addEventListener('resize', () => {
            updateDimensions();
            if (isContactVisible) {
                thumb.style.left = maxLeft + 'px';
                currentLeft = maxLeft;
            } else {
                thumb.style.left = '0px';
                currentLeft = 0;
            }
        });
        
        // Mouse/Touch events for dragging
        thumb.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        thumb.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        thumb.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Click on track to toggle
        track.addEventListener('click', handleTrackClick);
        
        // Set initial state (contact hidden)
        contactInfo.classList.remove('show');
        setThumbPosition(false);
    }
    
    // Add show/hide transition to contact info via CSS
    // Ensure contact-info has transition in CSS
    const style = document.createElement('style');
    style.textContent = `
        .contact-info {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
            pointer-events: none;
        }
        .contact-info.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        .slide-switch-thumb {
            transition: left 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
    `;
    document.head.appendChild(style);
    
    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 800 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuBtn) menuBtn.textContent = '☰';
        }
    });
    
    // Project hover effect enhancement
    const projectPanels = document.querySelectorAll('.project-panel');
    projectPanels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            const title = panel.querySelector('.project-title');
            if (title) {
                title.style.transition = 'text-shadow 0.2s';
                title.style.textShadow = `0 0 8px var(--accent-glow)`;
            }
        });
        panel.addEventListener('mouseleave', () => {
            const title = panel.querySelector('.project-title');
            if (title) {
                title.style.textShadow = 'none';
            }
        });
    });
});
// ============================================
// SCRIPT.JS - Interactive Features
// Neon Glow Portfolio | Priyanshu Sharma
// ============================================

document.addEventListener("DOMContentLoaded", function() {
    
    // -------------------- SCROLL REVEAL ANIMATION --------------------
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -10px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    window.addEventListener('load', () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });
    });
    
    // -------------------- HAMBURGER MENU --------------------
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
        
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !menuBtn.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuBtn) menuBtn.textContent = '☰';
            }
        });
    }
    
    // -------------------- THEME TOGGLE --------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('portfolioTheme');
    
    if (storedTheme === 'light') {
        document.body.classList.add('light-theme');
        if(themeToggleBtn) themeToggleBtn.textContent = '⏾ Dark Mode';
    } else if (storedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        if(themeToggleBtn) themeToggleBtn.textContent = '☀︎ Light Mode';
    } else {
        if(themeToggleBtn) themeToggleBtn.textContent = '☀︎ Light Mode';
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('portfolioTheme', isLight ? 'light' : 'dark');
            themeToggleBtn.textContent = isLight ? '⏾ Dark Mode' : '☀︎ Light Mode';
        });
    }
    
    // -------------------- RESPONSIVE RESIZE --------------------
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if(menuBtn) menuBtn.textContent = '☰';
        }
    });
    
    // -------------------- SMOOTH SCROLLING --------------------
    const allInternalLinks = document.querySelectorAll('a[href^="#"]');
    allInternalLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#" || targetId === "") return;
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
                    if(menuBtn) menuBtn.textContent = '☰';
                }
            }
        });
    });
    
    // -------------------- ACTIVE LINK ON SCROLL --------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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
    
    // -------------------- SLIDE TO ANSWER EFFECT --------------------
    const slideContainer = document.getElementById('slideToUnlock');
    const thumb = document.getElementById('slideThumb');
    const successMsg = document.getElementById('slideSuccessMsg');
    const contactInfoDiv = document.getElementById('contactInfo');
    
    let isDragging = false;
    let startX = 0;
    let currentLeft = 0;
    let maxLeft = 0;
    let isUnlocked = false;
    
    function initSlideDimensions() {
        if (!slideContainer || !thumb || isUnlocked) return;
        const trackWidth = slideContainer.querySelector('.slide-track').clientWidth;
        const thumbWidth = thumb.offsetWidth;
        maxLeft = trackWidth - thumbWidth - 8;
        if (!isUnlocked) {
            thumb.style.left = '0px';
            currentLeft = 0;
        }
    }
    
    function handleStart(e) {
        if (isUnlocked || !thumb) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startX = clientX;
        isDragging = true;
        thumb.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging || isUnlocked || !thumb) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let deltaX = clientX - startX;
        let newLeft = currentLeft + deltaX;
        if (newLeft < 0) newLeft = 0;
        if (newLeft > maxLeft) newLeft = maxLeft;
        thumb.style.left = newLeft + 'px';
        e.preventDefault();
    }
    
    function handleEnd() {
        if (!isDragging || isUnlocked || !thumb) {
            isDragging = false;
            return;
        }
        isDragging = false;
        thumb.style.cursor = 'grab';
        const finalLeft = parseFloat(thumb.style.left);
        
        if (finalLeft >= maxLeft * 0.85) {
            // UNLOCK
            isUnlocked = true;
            thumb.style.left = maxLeft + 'px';
            currentLeft = maxLeft;
            
            // reveal contact info
            contactInfoDiv.classList.add('show');
            successMsg.classList.add('show');
            
            // update label text
            const label = document.querySelector('.slide-label');
            if (label) label.textContent = '✓ unlocked';
            
            // disable further dragging
            thumb.style.pointerEvents = 'none';
            
            // remove event listeners
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
        } else {
            // reset to start
            thumb.style.left = '0px';
            currentLeft = 0;
        }
    }
    
    if (thumb && slideContainer) {
        initSlideDimensions();
        window.addEventListener('resize', () => {
            if (!isUnlocked) {
                initSlideDimensions();
            }
        });
        
        thumb.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        thumb.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        
        thumb.addEventListener('dragstart', (e) => e.preventDefault());
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Element Selectors ---
    const body = document.body;
    const toggleBtn = document.getElementById('toggleBtn');
    const sidebar = document.getElementById('contactSidebar');
    const closeBtn = document.getElementById('closeSidebarBtn');
    
    // Select all buttons that should open the sidebar
    const openButtons = document.querySelectorAll('.btn-primary, .pill-badge, .open-contact');

    // --- 2. Theme Toggle Logic ---
    toggleBtn?.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        // Optional: Save preference to local storage
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    // --- 3. Intersection Observer (Scroll Animations) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

    // --- 4. Sliding Sidebar Logic ---
    const toggleSidebar = (state) => {
        if (sidebar) {
            sidebar.classList.toggle('active', state);
            // Toggle a class on body to prevent scrolling when sidebar is open
            body.style.overflow = state ? 'hidden' : 'initial';
        }
    };

    // Open Sidebar Trigger
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Only trigger if it's a "Contact" or "Get Started" button
            if (btn.textContent.includes('Contact') || btn.textContent.includes('Get Started')) {
                e.preventDefault();
                toggleSidebar(true);
            }
        });
    });

    // Close Sidebar (X Button)
    closeBtn?.addEventListener('click', () => toggleSidebar(false));

    // Close on Outside Click or Escape Key
    document.addEventListener('click', (e) => {
        const isClickInsideSidebar = sidebar?.contains(e.target);
        const isTrigger = Array.from(openButtons).some(btn => btn.contains(e.target));

        if (sidebar?.classList.contains('active') && !isClickInsideSidebar && !isTrigger) {
            toggleSidebar(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleSidebar(false);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Toggle Logic ---
    const toggleBtn = document.getElementById('toggleBtn');
    const body = document.body;

    toggleBtn?.addEventListener('click', () => {
        body.classList.toggle('light-mode');
    });

    // --- 2. Intersection Observer (Scroll Animations) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Performance: stop observing once visible
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

    // --- 3. Sliding Sidebar Logic ---
    const sidebar = document.getElementById('contactSidebar');
    const closeBtn = document.getElementById('closeSidebarBtn');
    
    // Select all potential triggers (including the new floating button if you added it)
    const openButtons = document.querySelectorAll('button, a.btn, .open-contact');

    const toggleSidebar = (state) => {
        sidebar?.classList.toggle('active', state);
    };

    openButtons.forEach(btn => {
        if (btn.textContent.includes('Contact Me') || btn.textContent.includes('Get Started') || btn.classList.contains('open-contact')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSidebar(true);
            });
        }
    });

    closeBtn?.addEventListener('click', () => toggleSidebar(false));

    // Close sidebar if user clicks completely outside of it
    document.addEventListener('click', (e) => {
        const isTrigger = Array.from(openButtons).some(btn => btn.contains(e.target));
        const isClickInsideSidebar = sidebar?.contains(e.target);

        if (sidebar?.classList.contains('active') && !isClickInsideSidebar && !isTrigger) {
            toggleSidebar(false);
        }
    });
});
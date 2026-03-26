document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle Logic ---
    const toggleBtn = document.getElementById('toggleBtn');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
    });

    // --- 2. Intersection Observer (Scroll Animations) ---
    const animatedElements = document.querySelectorAll('.animate-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
    });

    animatedElements.forEach(el => observer.observe(el));


    // --- 3. Sliding Sidebar Logic ---
    const sidebar = document.getElementById('contactSidebar');
    const closeBtn = document.getElementById('closeSidebarBtn');

    // Find all buttons or anchor tags that contain the target phrases
    const openButtons = document.querySelectorAll('button, a.btn');

    openButtons.forEach(btn => {
        if(btn.textContent.includes('Contact Me') || btn.textContent.includes('Get Started')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Stop page reload/jump
                sidebar.classList.add('active');
            });
        }
    });

    // Close sidebar when clicking the X button
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // Close sidebar if user clicks completely outside of it
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !e.target.textContent.includes('Contact Me') && 
            !e.target.textContent.includes('Get Started')) {
            
            sidebar.classList.remove('active');
        }
    });

});
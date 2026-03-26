document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Toggle Logic
    const toggleBtn = document.getElementById('toggleBtn');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
    });

    // 2. Scroll Animation Logic (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once it's visible so it doesn't animate out
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
});
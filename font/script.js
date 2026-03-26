document.addEventListener('DOMContentLoaded', () => {

    // Theme Toggle Functionality
    const toggleBtn = document.getElementById('toggleBtn');
    const body = document.body;
    
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
    });
    
    // Intersection Observer for Scroll Animations
    const animatedElements = document.querySelectorAll('.animate-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger the CSS transition
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1, // Triggers when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before the element fully enters the viewport
    });
    
    // Attach observer to all elements with the animation class
    animatedElements.forEach(el => observer.observe(el));
    
});
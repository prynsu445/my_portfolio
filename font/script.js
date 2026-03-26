// Simple Intersection Observer to trigger entrance animations when elements scroll into view
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'visible' class when the element comes into the viewport
                entry.target.classList.add('visible');
                
                // Unobserve after animating so it only happens once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom of the screen
    });

    // Attach the observer to all elements with the .animate-up class
    animatedElements.forEach(el => observer.observe(el));
});
// Dynamic scroll animation using Intersection Observer
document.addEventListener("DOMContentLoaded", function() {
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                 entry.target.classList.remove("active");
            }
        });
    }, {
        root: null, 
        threshold: 0.15, 
        rootMargin: "0px"
    });

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeToggle.textContent = '⏾ Dark Mode';
        } else {
            themeToggle.textContent = '☀︎ Light Mode';
        }
    });
});
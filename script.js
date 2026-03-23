
/* MOUSE FOLLOWER GLOW */

const glow = document.querySelector(".mouse-glow");

document.addEventListener("mousemove", e => {

glow.style.left = e.clientX - 200 + "px";
glow.style.top = e.clientY - 200 + "px";

});


/* AOS SCROLL ANIMATION USING INTERSECTION OBSERVER */

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},
{
threshold:0.2
});

document.querySelectorAll(".fade").forEach(el => observer.observe(el));

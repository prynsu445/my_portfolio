function openDrawer(){

document.getElementById("drawer").classList.add("open");

document.getElementById("drawerOverlay").classList.add("open");

}


function closeDrawer(){

document.getElementById("drawer").classList.remove("open");

document.getElementById("drawerOverlay").classList.remove("open");

}



/* scroll animation */

const observer=new IntersectionObserver(

entries=>{

entries.forEach(e=>{

if(e.isIntersecting){

e.target.classList.add("visible");

}

});

}

);


document.querySelectorAll(".fade-up")

.forEach(el=>observer.observe(el));



/* smooth scroll */

function scrollToSection(id){

document.getElementById(id)

.scrollIntoView({

behavior:"smooth"

});

}
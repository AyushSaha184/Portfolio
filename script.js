/**
 * MOBILE NAVIGATION LOGIC
 */
const hamburger = document.querySelector("#hamburger");
const navLinks = document.querySelector("#nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-item").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });
}

/**
 * NAVBAR SCROLL EFFECT
 */
const navbar = document.querySelector("#navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.padding = "1rem 0";
        navbar.style.backgroundColor = "rgba(10, 10, 10, 0.95)";
    } else {
        navbar.style.padding = "1.5rem 0";
        navbar.style.backgroundColor = "rgba(10, 10, 10, 0.8)";
    }
});

/**
 * REVEAL ON SCROLL (SUBTLE)
 */
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Apply to sections and cards
document.querySelectorAll(".hero-text-content, .hero-image-content, .logo-card, .skill-category, .project-card, .section-title").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    observer.observe(el);
});

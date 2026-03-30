const hamburger = document.querySelector("#hamburger");
const navLinks = document.querySelector("#nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        const isOpen = hamburger.classList.toggle("active");
        navLinks.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });
}

const navbar = document.querySelector("#navbar");
const applyScrollState = () => {
    if (!navbar) {
        return;
    }
    navbar.classList.toggle("is-scrolled", window.scrollY > 16);
};

applyScrollState();
window.addEventListener("scroll", applyScrollState, { passive: true });

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

revealElements.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 45, 220)}ms`;
    revealObserver.observe(el);
});

const yearNode = document.querySelector("#current-year");
if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
}

const canvas = document.getElementById("starfield");
const context = canvas ? canvas.getContext("2d") : null;

const STAR_COUNT = 140;
const stars = [];
let rafId = 0;

function resizeCanvas() {
    if (!canvas || !context) {
        return;
    }

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedStars() {
    stars.length = 0;

    for (let i = 0; i < STAR_COUNT; i += 1) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.45 + 0.3,
            alpha: Math.random() * 0.65 + 0.2,
            twinkle: Math.random() * 0.025 + 0.004,
            drift: (Math.random() - 0.5) * 0.15
        });
    }
}

function drawStarfield() {
    if (!context || !canvas) {
        return;
    }

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const star of stars) {
        star.alpha += (Math.random() - 0.5) * star.twinkle;
        star.alpha = Math.max(0.1, Math.min(0.95, star.alpha));
        star.y += star.drift;

        if (star.y < -2) {
            star.y = window.innerHeight + 2;
        } else if (star.y > window.innerHeight + 2) {
            star.y = -2;
        }

        context.beginPath();
        context.fillStyle = `rgba(220, 229, 236, ${star.alpha})`;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
    }

    rafId = window.requestAnimationFrame(drawStarfield);
}

if (canvas && context) {
    resizeCanvas();
    seedStars();
    drawStarfield();

    window.addEventListener("resize", () => {
        resizeCanvas();
        seedStars();
    });
}

window.addEventListener("beforeunload", () => {
    if (rafId) {
        window.cancelAnimationFrame(rafId);
    }
});

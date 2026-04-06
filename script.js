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

/* ═══════════════════════════════════════════
   BENTO BOX REVEAL — scroll-triggered
   Staggered slide-up + fade + scale(0.95 → 1)
   once: true equivalent (unobserve after reveal)
   ═══════════════════════════════════════════ */
const revealEls = document.querySelectorAll(".reveal");
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

revealEls.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 45, 220)}ms`;
    revealObserver.observe(el);
});

/* Bento stagger grids — also bento-stagger children */
const bentoGrids = document.querySelectorAll(".bento-stagger");
const bentoObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                bentoObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
);

bentoGrids.forEach((grid) => bentoObserver.observe(grid));

/* ═══════════════════════════════════════════
   RADIAL GLOW MOUSE FOLLOWER
   Tracks cursor on cards & section shell,
   sets --card-mx / --card-my / --card-glow
   custom properties for radial-gradient spotlight
   ═══════════════════════════════════════════ */
const glowTargets = document.querySelectorAll(".skill-category, .project-card, .section-shell");

glowTargets.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty("--card-mx", `${x}px`);
        el.style.setProperty("--card-my", `${y}px`);
        el.style.setProperty("--card-glow", "1");
    });

    el.addEventListener("mouseleave", () => {
        el.style.setProperty("--card-glow", "0");
    });
});

const disabledProjectLinks = document.querySelectorAll(".project-link-disabled[aria-disabled='true']");
disabledProjectLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
    });
});

/* ═══════════════════════════════════════════
   PROJECT CARD TILT
   Pointer-driven 3D tilt + subtle inner parallax
   ═══════════════════════════════════════════ */
const supportsHoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsHoverPointer && !prefersReducedMotion) {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            const ratioX = (offsetX / rect.width) - 0.5;
            const ratioY = (offsetY / rect.height) - 0.5;
            const tiltY = ratioX * 8;
            const tiltX = -ratioY * 7;
            const shiftX = ratioX * 8;
            const shiftY = ratioY * 8;

            card.classList.add("is-tilting");
            card.style.transform = `perspective(1100px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.01)`;
            card.style.setProperty("--card-mx", `${offsetX}px`);
            card.style.setProperty("--card-my", `${offsetY}px`);
            card.style.setProperty("--card-glow", "1");

            const iconLinks = card.querySelectorAll(".project-links a");
            iconLinks.forEach((link) => {
                link.style.transform = `translate3d(${shiftX * 0.2}px, ${shiftY * 0.2}px, 22px)`;
            });
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
            card.style.setProperty("--card-glow", "0");
            card.classList.remove("is-tilting");

            const iconLinks = card.querySelectorAll(".project-links a");
            iconLinks.forEach((link) => {
                link.style.transform = "translateZ(22px)";
            });
        });
    });
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
const yearNode = document.querySelector("#current-year");
if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
}

/* ═══════════════════════════════════════════
   STARFIELD (background canvas layer)
   ═══════════════════════════════════════════ */
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

// ─── ANIMATED GEOMETRIC BACKGROUND (Canvas) ───
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }
    update(time) {
        this.x += this.speedX;
        this.y += this.speedY;
        // Wrap around edges
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
        // Pulse opacity
        this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;
        this.currentOpacity = Math.max(0.05, Math.min(0.7, this.currentOpacity));
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${this.currentOpacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 150);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

// Draw connection lines between nearby particles
function drawConnections(ctx, particles, time) {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                const alpha = (1 - dist / maxDist) * 0.18;
                const gradient = ctx.createLinearGradient(
                    particles[i].x, particles[i].y,
                    particles[j].x, particles[j].y
                );
                gradient.addColorStop(0, `rgba(201,169,110,${alpha})`);
                gradient.addColorStop(0.5, `rgba(180,150,100,${alpha * 0.6})`);
                gradient.addColorStop(1, `rgba(201,169,110,${alpha})`);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = timestamp || 0;
    particles.forEach(p => {
        p.update(time);
        p.draw(ctx);
    });
    drawConnections(ctx, particles, time);
    animationId = requestAnimationFrame(animate);
}
animate(0);

// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ─── MOBILE MENU TOGGLE ───
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
});
// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
    });
});

// ─── SCROLL FADE-IN ANIMATION ───
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));

// ─── COUNTER ANIMATION ───
const counters = document.querySelectorAll('.highlight-number[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = target === 24 ? 'h' : '+';
            animateCounter(el, target, suffix);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.6 });

function animateCounter(el, target, suffix) {
    let current = 0;
    const duration = 1800;
    const step = Math.max(1, Math.floor(target / (duration / 20)));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current + suffix;
    }, 20);
}
counters.forEach(el => counterObserver.observe(el));

// ─── CONTACT FORM HANDLING ───
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();

    if (!name || !email || !message) {
        showToast('⚠️ Please fill in all required fields.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('⚠️ Please enter a valid email address.');
        return;
    }

    // Simulate sending (in a real scenario, you'd POST to a server or use a service)
    console.log('Form submitted:', { name, email, subject: document.getElementById('subjectInput').value, message });
    showToast('✅ Message sent successfully! I\'ll get back to you soon.');
    contactForm.reset();
});

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ─── SMOOTH NAV LINK ACTIVE STATE ───
const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    allNavLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--gold-light)';
        }
    });
});

console.log('%c👋 Welcome to my portfolio! %cCivil Engineer & Virtual Assistant',
    'font-size:1.2em;color:#c9a96e;', 'color:#b0ada8;');
console.log('%cOpen to opportunities — let\'s build something great together.',
    'color:#7a7671;');

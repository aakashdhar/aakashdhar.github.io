// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// 1. Check LocalStorage. Default is Light (no 'dark' class)
if (localStorage.theme === 'dark') {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

// 2. Toggle Function
themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');

    // Save preference
    if (htmlElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
});

// Mobile Menu Logic
const menuBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-menu-btn');
const menu = document.getElementById('mobile-menu');
const links = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
    document.body.classList.toggle('overflow-hidden');
}

menuBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

links.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Enhanced Scroll Animations with Reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all elements with 'reveal' class
document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add parallax effect to background blobs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const blobs = document.querySelectorAll('.animate-blob');
    blobs.forEach((blob, index) => {
        const speed = 0.1 + (index * 0.05);
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
});
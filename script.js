// ── Theme ─────────────────────────────────────────────────────────────────────
const html = document.documentElement;

try {
    if (localStorage.getItem('theme') === 'dark') html.classList.add('dark');
} catch (e) {}

const thmBtn = document.getElementById('thm');
if (thmBtn) {
    thmBtn.addEventListener('click', function () {
        html.classList.toggle('dark');
        try {
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        } catch (e) {}
    });
}

// ── Nav scroll behaviour ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
}

// ── Mobile menu ───────────────────────────────────────────────────────────────
const ham  = document.getElementById('ham');
const mobx = document.getElementById('mobx');
const mob  = document.getElementById('mob');

if (ham && mob)  ham.onclick  = () => mob.classList.add('open');
if (mobx && mob) mobx.onclick = () => mob.classList.remove('open');
if (mob) {
    document.querySelectorAll('.ml').forEach(l => l.onclick = () => mob.classList.remove('open'));
}

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.rv').forEach(el => observer.observe(el));

// ── Smooth scroll ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

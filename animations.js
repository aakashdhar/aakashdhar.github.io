/* ═══════════════════════════════════════════════════════════════
   ANIMATIONS.JS — Portfolio animation layer
   Vanilla JS only · ES6+ · All motion gated on prefers-reduced-motion
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TOUCH   = !window.matchMedia('(hover: hover)').matches;

    /* ── 10. SCROLL PROGRESS BAR ─────────────────────────────── */
    const initScrollProgress = () => {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress';
        document.body.insertBefore(bar, document.body.firstChild);

        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0%';
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    };
    initScrollProgress();

    if (REDUCED) {
        // Show all hidden elements immediately then stop
        document.querySelectorAll('.rv').forEach(el => el.classList.add('vis'));
        return;
    }

    /* ── 1. CUSTOM CURSOR + TRAIL ─────────────────────────────── */
    const initCursor = () => {
        if (TOUCH) return;

        const dot   = document.createElement('div'); dot.id   = 'cursor-dot';
        const ring  = document.createElement('div'); ring.id  = 'cursor-ring';
        document.body.append(dot, ring);

        // 3 ghost trails with increasing lag
        const LAGS    = [0.08, 0.05, 0.03];
        const SIZES   = [4, 3, 2];
        const OPACITIES = [0.5, 0.35, 0.2];
        const trails  = LAGS.map((lag, i) => {
            const t = document.createElement('div');
            t.className = 'cursor-trail';
            t.style.cssText = `width:${SIZES[i]}px;height:${SIZES[i]}px;opacity:${OPACITIES[i]};`;
            document.body.append(t);
            return { el: t, x: window.innerWidth / 2, y: window.innerHeight / 2, lag };
        });

        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;
        let rafId;

        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

        const lerp = (a, b, t) => a + (b - a) * t;

        const tick = () => {
            // Dot: instant
            dot.style.left  = mx + 'px';
            dot.style.top   = my + 'px';

            // Ring: lerp lag 0.12
            rx = lerp(rx, mx, 0.12);
            ry = lerp(ry, my, 0.12);
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';

            // Trails: increasing lag
            trails.forEach(tr => {
                tr.x = lerp(tr.x, mx, tr.lag);
                tr.y = lerp(tr.y, my, tr.lag);
                tr.el.style.left = tr.x + 'px';
                tr.el.style.top  = tr.y + 'px';
            });

            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        // Expand ring on interactive elements
        const interactSel = 'a, button, .mi, .ec, .lc, .ic, .ht, .who-proof-item, [data-magnetic]';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(interactSel)) {
                ring.classList.add('expanded');
                ring.style.transform = 'translate(-50%, -50%) scale(2.5)';
            }
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(interactSel)) {
                ring.classList.remove('expanded');
                ring.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(rafId);
            else rafId = requestAnimationFrame(tick);
        });
    };
    initCursor();

    /* ── 2. PARTICLE CONSTELLATION (hero background) ─────────── */
    const initParticles = () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'particle-bg';
        hero.insertBefore(canvas, hero.firstChild);

        const ctx = canvas.getContext('2d');
        let w, h, particles, rafId;

        const resize = () => {
            w = canvas.width  = hero.offsetWidth;
            h = canvas.height = hero.offsetHeight;
        };

        const getColor = () => {
            const s = getComputedStyle(document.documentElement);
            return s.getPropertyValue('--t1').trim() || '#1C1815';
        };

        const rand = (min, max) => Math.random() * (max - min) + min;

        const make = () => {
            particles = Array.from({ length: 80 }, () => ({
                x:  rand(0, w),  y:  rand(0, h),
                vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
                r:  rand(1.5, 3),
                o:  rand(0.15, 0.4),
            }));
        };

        let mx = -999, my = -999;
        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            mx = e.clientX - rect.left;
            my = e.clientY - rect.top;
        }, { passive: true });
        hero.addEventListener('mouseleave', () => { mx = -999; my = -999; });

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const col = getColor();

            particles.forEach(p => {
                // Repel from cursor
                const dx = p.x - mx, dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100 && dist > 0) {
                    const force = 1 / (dist * dist) * 800;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Dampen velocity
                p.vx *= 0.98; p.vy *= 0.98;
                // Clamp speed
                const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (spd > 1.8) { p.vx = p.vx / spd * 1.8; p.vy = p.vy / spd * 1.8; }

                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = col;
                ctx.globalAlpha = p.o;
                ctx.fill();
            });

            // Draw lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = col;
                        ctx.lineWidth   = 0.3;
                        ctx.globalAlpha = (1 - d / 120) * 0.25;
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
            rafId = requestAnimationFrame(draw);
        };

        resize(); make(); draw();
        window.addEventListener('resize', () => { resize(); make(); }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(rafId);
            else rafId = requestAnimationFrame(draw);
        });
    };
    initParticles();

    /* ── 12. FILM GRAIN OVERLAY (hero) ───────────────────────── */
    const initGrain = () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'grain';
        canvas.width  = 200;
        canvas.height = 200;
        hero.insertBefore(canvas, hero.firstChild);

        const ctx   = canvas.getContext('2d');
        const img   = ctx.createImageData(200, 200);
        const data  = img.data;
        let frame   = 0;
        let rafId;

        const gen = () => {
            for (let i = 0; i < data.length; i += 4) {
                const v = Math.random() * 255 | 0;
                data[i] = data[i+1] = data[i+2] = v;
                data[i+3] = 255;
            }
            ctx.putImageData(img, 0, 0);
        };
        gen();

        const tick = () => {
            frame++;
            if (frame % 2 === 0) {
                const ox = (Math.random() * 200) | 0;
                const oy = (Math.random() * 200) | 0;
                canvas.style.backgroundPosition = `${ox}px ${oy}px`;
                gen();
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(rafId);
            else rafId = requestAnimationFrame(tick);
        });
    };
    initGrain();

    /* ── 3. TEXT SCRAMBLE — HERO TAGS ────────────────────────── */
    const initScramble = () => {
        const tagsEl = document.querySelector('.hero-tags');
        if (!tagsEl) return;

        const spans   = Array.from(tagsEl.querySelectorAll('span'));
        const roles   = spans.map(s => s.textContent.trim());
        const CHARS   = '!@#$%^&*ABCDEFabcdef0123456789';
        let current   = 0;

        // Replace with a single cycling element
        tagsEl.innerHTML = '';
        const display = document.createElement('span');
        display.style.fontFamily = "'IBM Plex Mono', monospace";
        display.style.fontSize   = '0.78rem';
        display.style.color      = 'var(--t3)';
        tagsEl.append(display);

        // Also keep the other roles faintly present (hidden) for screen readers
        roles.forEach((r, i) => {
            if (i === 0) return;
            const sr = document.createElement('span');
            sr.textContent = r;
            sr.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:0;height:0;overflow:hidden;';
            sr.setAttribute('aria-hidden', 'true');
            tagsEl.append(sr);
        });

        let scrambleTimer = null;
        let cycleTimer    = null;

        const scramble = (full) => {
            // Split "// Word" — keep "//" static
            const prefix = full.startsWith('//') ? '// ' : '';
            const word   = full.slice(prefix.length);
            const chars  = word.split('');
            let  resolved = 0;
            const total   = chars.length;
            const startMs = performance.now();

            if (scrambleTimer) clearInterval(scrambleTimer);

            scrambleTimer = setInterval(() => {
                const elapsed = performance.now() - startMs;
                // Resolve one char every 40ms left-to-right
                resolved = Math.min(total, Math.floor(elapsed / 40));

                const out = chars.map((c, i) => {
                    if (i < resolved) return c;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join('');

                display.textContent = prefix + out;

                if (resolved >= total) {
                    clearInterval(scrambleTimer);
                    display.textContent = full;
                }
            }, 30);
        };

        const cycle = () => {
            current = (current + 1) % roles.length;
            scramble(roles[current]);
            cycleTimer = setTimeout(cycle, 3200);
        };

        // Show first role immediately
        display.textContent = roles[0];
        cycleTimer = setTimeout(cycle, 3200);
    };
    initScramble();

    /* ── 8. TYPEWRITER HERO SUBTITLE ─────────────────────────── */
    const initTypewriter = () => {
        const roleEl = document.querySelector('.hero-role');
        if (!roleEl) return;

        const ROLES = ['Project Manager', 'Problem Solver', 'AI Architect', 'Code Reader', 'PM + Engineer'];
        let idx     = 0;

        // Wrap: "Technical " stays, cycling part gets a <span>
        roleEl.innerHTML = 'Technical<br><span id="tw-word"></span><span class="tw-cursor"></span>';
        const wordEl = document.getElementById('tw-word');
        if (!wordEl) return;

        const typeIn  = (str) => new Promise(res => {
            let i = 0;
            const t = setInterval(() => {
                wordEl.textContent = str.slice(0, ++i);
                if (i >= str.length) { clearInterval(t); setTimeout(res, 2200); }
            }, 70);
        });

        const typeOut = (str) => new Promise(res => {
            let i = str.length;
            const t = setInterval(() => {
                wordEl.textContent = str.slice(0, --i);
                if (i <= 0) { clearInterval(t); res(); }
            }, 50);
        });

        const run = async () => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const role = ROLES[idx % ROLES.length];
                await typeIn(role);
                await typeOut(role);
                idx++;
            }
        };

        // Start with first role typed in
        wordEl.textContent = '';
        run();
    };
    initTypewriter();

    /* ── 4. ANIMATED STAT COUNTERS ───────────────────────────── */
    const initCounters = () => {
        const items = document.querySelectorAll('.hs-item');
        if (!items.length) return;

        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        const animateCounter = (el, target, suffix) => {
            const start = performance.now();
            const dur   = 1800;

            el.style.willChange = 'color';

            const tick = (now) => {
                const progress = Math.min((now - start) / dur, 1);
                const val      = Math.round(easeOutCubic(progress) * target);
                el.textContent = val + suffix;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + suffix;
                    el.classList.add('flash');
                    setTimeout(() => {
                        el.classList.remove('flash');
                        el.style.willChange = 'auto';
                    }, 350);
                }
            };
            requestAnimationFrame(tick);
        };

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                obs.disconnect();

                items.forEach(item => {
                    const numEl  = item.querySelector('.hs-num');
                    if (!numEl) return;
                    const raw    = numEl.textContent.trim();
                    const suffix = raw.replace(/[0-9]/g, '');
                    const target = parseInt(raw, 10);
                    if (!isNaN(target)) animateCounter(numEl, target, suffix);
                });
            });
        }, { threshold: 0.5 });

        const statsEl = document.querySelector('.hero-stats');
        if (statsEl) obs.observe(statsEl);
    };
    initCounters();

    /* ── 5. SCROLL-TRIGGERED STAGGER REVEALS ────────────────── */
    const initReveal = () => {
        // Tag all target elements with data-reveal (avoid double-tagging .rv elements)
        const sel = [
            '.sec h2:not(.rv)', '.sec h3:not(.rv)', '.sec p:not(.rv)',
            '.ec:not(.rv)', '.lc:not(.rv)', '.ic:not(.rv)', '.cr:not(.rv)',
            '.tle:not(.rv)', '.poc:not(.rv)', '.ht:not(.rv)',
        ].join(', ');

        document.querySelectorAll(sel).forEach(el => {
            el.setAttribute('data-reveal', '');
        });

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el      = entry.target;
                // Stagger by sibling index among [data-reveal] siblings
                const parent  = el.parentElement;
                const siblings = parent ? Array.from(parent.querySelectorAll('[data-reveal]')) : [];
                const idx     = siblings.indexOf(el);
                el.style.transitionDelay = (idx * 80) + 'ms';
                el.classList.add('revealed');
                obs.unobserve(el);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    };
    initReveal();

    /* ── 6. MAGNETIC BUTTONS ─────────────────────────────────── */
    const initMagnetic = () => {
        if (TOUCH) return;

        const sel = '.btn, [data-magnetic], .ncta, .fb';
        document.querySelectorAll(sel).forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.willChange = 'transform';

                const onMove = (e) => {
                    const rect = btn.getBoundingClientRect();
                    const cx   = rect.left + rect.width  / 2;
                    const cy   = rect.top  + rect.height / 2;
                    const dx   = (e.clientX - cx) * 0.35;
                    const dy   = (e.clientY - cy) * 0.35;
                    btn.style.transition = 'transform 0.2s ease';
                    btn.style.transform  = `translate(${dx}px, ${dy}px)`;
                };

                btn._onMove = onMove;
                btn.addEventListener('mousemove', onMove);
            });

            btn.addEventListener('mouseleave', () => {
                btn.removeEventListener('mousemove', btn._onMove);
                btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                btn.style.transform  = 'translate(0, 0)';
                setTimeout(() => { btn.style.willChange = 'auto'; }, 550);
            });
        });
    };
    initMagnetic();

    /* ── 7. 3D CARD TILT ─────────────────────────────────────── */
    const initTilt = () => {
        if (TOUCH) return;

        const sel = '.mi, .ec, .lc, .ic, .who-proof-item';
        document.querySelectorAll(sel).forEach(card => {
            // Inject highlight layer
            const hl = document.createElement('div');
            hl.className = 'tilt-highlight';
            card.insertBefore(hl, card.firstChild);

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const nx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // -1 to 1
                const ny   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
                card.style.willChange = 'transform';
                card.style.transition = 'transform 0.1s ease';
                card.style.transform  = `perspective(800px) rotateX(${-ny * 8}deg) rotateY(${nx * 8}deg)`;
                // Highlight moves opposite to tilt
                hl.style.background   = `radial-gradient(circle at ${50 - nx * 30}% ${50 - ny * 30}%, rgba(255,255,255,0.13) 0%, transparent 65%)`;
                hl.style.opacity      = '1';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0)';
                hl.style.opacity      = '0';
                setTimeout(() => { card.style.willChange = 'auto'; }, 650);
            });
        });
    };
    initTilt();

    /* ── 9. ANIMATED SKILL PIPELINE ──────────────────────────── */
    const initPipeline = () => {
        // Find the pill row inside the first .mi in #ai-systems
        const aiSection = document.querySelector('#ai-systems');
        if (!aiSection) return;
        const firstCard = aiSection.querySelector('.mi');
        if (!firstCard) return;

        // The skills pill row (first .pills in the card)
        const pillsRow = firstCard.querySelector('.pills');
        if (!pillsRow) return;

        const SKILL_TIPS = {
            brainstorm: 'Validate idea & define scope',
            architect:  'Plan structure & patterns',
            new:        'Scaffold the project',
            feature:    'Add new functionality',
            design:     'Style & UI polish',
            bug:        'Diagnose & fix issues',
            change:     'Scope change workflow',
            review:     'Quality gate & audit',
            progress:   'Live ASCII dashboard',
        };

        const skills = [];
        pillsRow.querySelectorAll('.pill').forEach(p => {
            const name = p.textContent.trim();
            if (SKILL_TIPS[name]) skills.push(name);
        });
        if (!skills.length) return;

        // Build pipeline element
        const pipeline = document.createElement('div');
        pipeline.className = 'skill-pipeline';

        skills.forEach((name, i) => {
            const node = document.createElement('span');
            node.className   = 'sp-node';
            node.textContent = name;
            node.setAttribute('data-tip', SKILL_TIPS[name] || '');
            pipeline.append(node);

            if (i < skills.length - 1) {
                const conn = document.createElement('span');
                conn.className = 'sp-connector';
                const line = document.createElement('span');
                line.className = 'sp-connector-line';
                // Each connector gets its own packet with a staggered delay
                const pkt = document.createElement('span');
                pkt.className = 'sp-packet';
                pkt.style.animationDelay = (i * (3000 / skills.length)) + 'ms';
                line.append(pkt);
                conn.append(line);
                pipeline.append(conn);
            }
        });

        // Active node cycles with the data packets
        let activeIdx = 0;
        const nodes   = pipeline.querySelectorAll('.sp-node');
        const cycle = () => {
            nodes.forEach(n => n.classList.remove('sp-active'));
            nodes[activeIdx % nodes.length].classList.add('sp-active');
            activeIdx++;
        };
        cycle();
        setInterval(cycle, 3000 / skills.length * (skills.length));

        // Replace the original pills row
        pillsRow.replaceWith(pipeline);
    };
    initPipeline();

    /* ── 11. NAV ACTIVE SECTION HIGHLIGHT ───────────────────── */
    const initNavHighlight = () => {
        const navLinks = document.querySelectorAll('.nl a[href^="#"]');
        if (!navLinks.length) return;

        const sectionIds = Array.from(navLinks)
            .map(a => a.getAttribute('href').slice(1))
            .filter(id => id && document.getElementById(id));

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id   = entry.target.id;
                const link = document.querySelector(`.nl a[href="#${id}"]`);
                if (!link) return;
                if (entry.isIntersecting) link.classList.add('nav-active');
                else                      link.classList.remove('nav-active');
            });
        }, { threshold: [0.3] });

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
    };
    initNavHighlight();

}); // end DOMContentLoaded

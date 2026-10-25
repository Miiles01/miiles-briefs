gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Smooth scroll */
const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(500, 33);
lenis.stop();

/* Preloader: el nombre en script aparece y se va, el panel sube y entra el hero */
const intro = () => {
  const hero = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.to('.reveal-lines .line > span', { yPercent: 0, duration: 1.4 })
      .to('.fade-up', { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, '-=1.0');
  return hero;
};
if (reduce) {
  document.querySelector('.preloader').style.display = 'none';
  lenis.start();
} else {
  gsap.set('.reveal-lines .line > span', { y: 0, yPercent: 110 });
  gsap.set('.fade-up', { y: 24 });
  const pre = gsap.timeline({
    onComplete: () => { document.querySelector('.preloader').style.display = 'none'; gsap.ticker.lagSmoothing(0); lenis.start(); },
    onStart: () => { window.__introStarted = true; },
  });
  const ready = Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]);
  ready.then(() => {
    pre.to('.preload-text', { opacity: 1, duration: 0.5 })
       .to('.preload-text', { opacity: 0, duration: 0.4, delay: 0.5 })
       .to('.preloader', { yPercent: -102, duration: 1, ease: 'expo.inOut' }, '+=0.05')
       .add(intro(), '-=0.45');
  });
}

/* Anclas con Lenis */
document.querySelectorAll('a.go').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (!id || !id.startsWith('#')) return;
  e.preventDefault();
  closeMenu(() => lenis.scrollTo(id === '#inicio' ? 0 : id, { offset: 0, duration: 1.4 }));
}));

if (!reduce) {
  const vids = gsap.utils.toArray('.hero-video');
  [6, -10, 8, -6].forEach((y, i) => vids[i] && gsap.to(vids[i], { yPercent: y, ease: 'none',
    scrollTrigger: { trigger: '.hero-videos', start: 'top bottom', end: 'bottom top', scrub: 0.8 } }));

  const trit = gsap.utils.toArray('.trittico .image-frame');
  [10, -8, 4].forEach((y, i) => trit[i] && gsap.to(trit[i], { yPercent: y, ease: 'none',
    scrollTrigger: { trigger: '.trittico', start: 'top bottom', end: 'bottom top', scrub: 0.8 } }));

  document.querySelectorAll('.image-frame .image-inner').forEach(img => gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none',
    scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }));

  gsap.fromTo('.parallax', { yPercent: -16 }, { yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.image-frame_featured', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

  const comp = gsap.utils.toArray('.composition > *');
  [-20, 10].forEach((y, i) => comp[i] && gsap.to(comp[i], { yPercent: y, ease: 'none',
    scrollTrigger: { trigger: '.composition', start: 'top bottom', end: 'bottom top', scrub: 0.8 } }));

  gsap.fromTo('.image-section .hero-image_inner', { yPercent: -10 }, { yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '.image-section', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

  // Títulos y bloques entran con un fade suave
  const lightUp = matchMedia('(min-width: 768px)').matches;
  gsap.utils.toArray(`.section h2, ${lightUp ? '' : '.narrow p, '}.works__head p, .quote, .brands, .niches, .footer-actions`).forEach(el =>
    gsap.from(el, { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
}

/* Logo del nav aparece cuando el nombre del hero sale de la vista */
ScrollTrigger.create({ trigger: '.hero_home h1', start: 'bottom top',
  onEnter: () => gsap.to('.logo', { opacity: 1, duration: 0.8 }),
  onLeaveBack: () => gsap.to('.logo', { opacity: 0, duration: 0.3 }) });

/* Botón: la línea sale por la derecha y vuelve a entrar */
document.querySelectorAll('.button').forEach(b => {
  const line = b.querySelector('.button_line');
  b.addEventListener('mouseenter', () => gsap.timeline()
    .to(line, { xPercent: 102, duration: 0.3, ease: 'quint.out' })
    .set(line, { xPercent: -102 })
    .to(line, { xPercent: 0, duration: 0.3, ease: 'quint.out' }));
});

/* Links del footer: la línea entra por la izquierda y sale por la derecha */
document.querySelectorAll('.footer-link').forEach(l => {
  const line = l.querySelector('.button_line-alt');
  l.addEventListener('mouseenter', () => gsap.fromTo(line, { xPercent: -102 }, { xPercent: 0, duration: 0.3, ease: 'quart.out', overwrite: true }));
  l.addEventListener('mouseleave', () => gsap.to(line, { xPercent: 102, duration: 0.3, ease: 'quart.inOut', overwrite: true,
    onComplete: () => gsap.set(line, { xPercent: -102 }) }));
});

/* Menú: panel lateral a media pantalla, capas escalonadas con expo.inOut */
const menu = document.querySelector('.menu');
const burger = document.querySelector('.hamburger');
let menuOpen = false;
function openMenu() {
  if (menuOpen) return;
  menuOpen = true;
  menu.classList.add('is-open');
  menu.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  lenis.stop();
  gsap.timeline()
    .set('.menu__base, .menu__panel', { x: 0, xPercent: -102 })
    .set('.menu__links, .menu__social', { opacity: 0, y: 20 })
    .to('.menu__overlay', { opacity: 1, duration: 0.8 }, 0)
    .to('.menu__base', { xPercent: 0, duration: 1.1, ease: 'expo.inOut' }, 0)
    .to('.menu__panel', { xPercent: 0, duration: 1.1, ease: 'expo.inOut' }, 0.15)
    .to('.menu__links, .menu__social', { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0.85);
}
function closeMenu(after) {
  if (!menuOpen) { after?.(); return; }
  menuOpen = false;
  burger.setAttribute('aria-expanded', 'false');
  gsap.timeline({ onComplete: () => { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); lenis.start(); after?.(); } })
    .to('.menu__links, .menu__social', { opacity: 0, duration: 0.3 }, 0)
    .to('.menu__panel', { xPercent: -102, duration: 0.9, ease: 'expo.inOut' }, 0.1)
    .to('.menu__base', { xPercent: -102, duration: 0.9, ease: 'expo.inOut' }, 0.2)
    .to('.menu__overlay', { opacity: 0, duration: 0.6 }, 0.4);
}
burger.addEventListener('click', openMenu);
document.querySelector('.menu__close').addEventListener('click', () => closeMenu());
document.querySelector('.menu__overlay').addEventListener('click', () => closeMenu());
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* Mi trabajo: la cuadrícula 3D (three.js) solo se carga cuando la sección se acerca, para no pesar al inicio.
   Sin GPU o con movimiento reducido se queda la cuadrícula normal. */
if (!reduce) {
  const works = document.querySelector('.works');
  const io = new IntersectionObserver(entries => {
    if (!entries.some(en => en.isIntersecting)) return;
    io.disconnect();
    import(`./grid.js?v=${window.__v || ''}`)
      .then(mod => mod.createStage())
      .then(stage => stage.show())
      .catch(err => console.warn(`La cuadrícula se muestra sin WebGL (${err.message}).`));
  }, { rootMargin: '150% 0px' });
  io.observe(works);
}

/* Videos: sin audio, solo se reproducen mientras están en pantalla */
const videoIO = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
  if (isIntersecting && !reduce) { target.preload = 'auto'; target.play().catch(() => {}); }
  else target.pause();
}), { threshold: 0.2 });
document.querySelectorAll('.hero-video video').forEach(v => { v.muted = true; videoIO.observe(v); });

// Footer: "Diana" entra letra por letra desde abajo
(() => {
  const letters = document.querySelectorAll('.footer-name .fn-l');
  if (!letters.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.set(letters, { y: 0, yPercent: 105 });
  ScrollTrigger.create({
    trigger: '.footer-name', start: 'top 92%', once: true,
    onEnter: () => gsap.to(letters, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 })
  });
})();

// Sobre mí (desktop): cada palabra se enciende y se desenfoca al hacer scroll; en celular queda el fade normal
(() => {
  if (reduce || !matchMedia('(min-width: 768px)').matches) return;
  const paras = document.querySelectorAll('.narrow p');
  const words = [];
  paras.forEach(p => {
    p.setAttribute('aria-label', p.textContent);
    p.innerHTML = p.textContent.split(/(\s+)/).map(t => /^\s+$/.test(t) ? t : `<span class="lw" aria-hidden="true">${t}</span>`).join('');
    words.push(...p.querySelectorAll('.lw'));
  });
  if (!words.length) return;
  gsap.set(words, { color: 'rgba(255,255,255,0.15)', filter: 'blur(6px)' });
  gsap.to(words, {
    color: '#fff', filter: 'blur(0px)', ease: 'none', stagger: 0.1,
    scrollTrigger: { trigger: '.narrow', start: 'top center', end: 'bottom center', scrub: true }
  });
})();

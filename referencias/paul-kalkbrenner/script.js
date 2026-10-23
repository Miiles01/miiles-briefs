/**
 * Paul Kalkbrenner — Official Website Architecture
 * Functional animations, Lenis smooth scroll, GSAP ScrollTrigger,
 * Custom Reactive Cursor & Web Audio API Berlin Techno Synthesizer
 * 
 * Strictly ZERO raster images — Pure Vector, Canvas and Procedural Audio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = initLenis();

  // 2. Setup Web Audio API Synthesizer & Oscilloscope
  const audioSystem = initWebAudioSynth();

  // 3. Initialize Custom Reactive Cursor
  initCustomCursor();

  // 4. Initialize GSAP ScrollTrigger Animations
  initScrollAnimations();

  // 5. Initialize Button Character Roll-up Animations
  initButtonCharSplits();

  // 6. Interactive Tour Dates Filter
  initTourFilter();

  // 7. Interactive Vinyl & Track Previews
  initVinylTrackPlayers(audioSystem);

  // 8. Mobile Menu Drawer
  initMenuDrawer();

  // 9. Newsletter Form Interaction
  initNewsletter();

  // 10. Hardware Console Interactive Meter Animation
  initConsoleFaders();
});

/* ========================================================
   1. Lenis Smooth Scroll Integration
   ======================================================== */
function initLenis() {
  if (typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  // Sync Lenis with GSAP ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // Sticky nav background on scroll
  const nav = document.querySelector('.nav');
  lenis.on('scroll', (e) => {
    if (nav) {
      if (e.animatedScroll > 40) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }
  });

  return lenis;
}

/* ========================================================
   2. Web Audio API Procedural Berlin Synth & Oscilloscope
   ======================================================== */
function initWebAudioSynth() {
  let audioCtx = null;
  let isPlaying = false;
  let intervalId = null;
  let analyser = null;
  let masterGain = null;

  const soundBtn = document.querySelector('[data-sound-toggle]');
  const soundStateText = document.getElementById('sound-state-text');
  const canvas = document.getElementById('hero-oscilloscope');
  const hudHz = document.getElementById('hud-frequency');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // Setup Audio Context on First User Gesture
  function setupAudioContext() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  // Synthesizes a tight minimal Berlin electronic beat loop
  function startBeatLoop() {
    if (!audioCtx) setupAudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Fade in master gain smoothly
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.6);

    let step = 0;
    const bpm = 128;
    const stepInterval = (60 / bpm / 4) * 1000; // 16th notes

    intervalId = setInterval(() => {
      const time = audioCtx.currentTime;

      // Kick drum on beats (step 0, 4, 8, 12)
      if (step % 4 === 0) {
        playSynthKick(time);
      }

      // Off-beat Hi-Hat (step 2, 6, 10, 14)
      if (step % 4 === 2) {
        playSynthHiHat(time);
      }

      // Sub-bass pulse on 16ths
      if (step % 2 === 0) {
        playSubBass(time, step);
      }

      step = (step + 1) % 16;
    }, stepInterval);
  }

  function stopBeatLoop() {
    if (!audioCtx || !masterGain) return;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);

    setTimeout(() => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }, 450);
  }

  // Procedural Analog Kick Drum
  function playSynthKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.24);
  }

  // Procedural Crisp Hi-Hat
  function playSynthHiHat(time) {
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  // Melodic Hypnotic Bassline
  const bassNotes = [55, 55, 65.4, 55, 49, 55, 73.4, 55]; // A1, C2, B1, D2
  function playSubBass(time, step) {
    const note = bassNotes[(step / 2) % bassNotes.length];
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(note, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, time);
    filter.frequency.exponentialRampToValueAtTime(90, time + 0.15);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  // Play melodic track preview (e.g. Sky and Sand arpeggio)
  function playTrackSnippet(trackId) {
    setupAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime);

    // Arpeggiator notes
    const chords = [220, 261.63, 329.63, 392, 440]; // Am7 chord
    chords.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const time = audioCtx.currentTime + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  // Toggle button handler
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      soundBtn.setAttribute('data-sound-active', isPlaying ? 'true' : 'false');
      if (soundStateText) {
        soundStateText.textContent = isPlaying ? 'ON' : 'OFF';
      }

      if (isPlaying) {
        startBeatLoop();
      } else {
        stopBeatLoop();
      }
    });
  }

  // Render Oscilloscope Waveform on Canvas
  function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope);
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    if (analyser && isPlaying) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#a7ff9c';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(167, 255, 156, 0.8)';
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (hudHz) {
        hudHz.textContent = `${Math.round(430 + Math.random() * 20)} Hz`;
      }
    } else {
      // Idle heartbeat wave
      const time = Date.now() * 0.003;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(167, 255, 156, 0.4)';
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.06 + time) * 8 * Math.sin(x * 0.015);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (hudHz) hudHz.textContent = 'STANDBY';
    }
  }

  drawOscilloscope();

  return {
    playTrackSnippet,
  };
}

/* ========================================================
   3. Custom Reactive Cursor
   ======================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('[data-cursor]');
  const cursorText = document.querySelector('[data-cursor-text-target]');
  if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const quickX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const quickY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    quickX(e.clientX);
    quickY(e.clientY);

    // Detect hover targets
    const target = e.target.closest('[data-cursor-hover]');
    if (target) {
      cursor.setAttribute('data-cursor', 'active');
      const text = target.getAttribute('data-cursor-text');
      if (cursorText && text) {
        cursorText.textContent = text;
      }
    } else {
      cursor.setAttribute('data-cursor', '');
    }
  });

  window.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

/* ========================================================
   4. GSAP ScrollTrigger Animations
   ======================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // A. Hero Entrance Kinetic Headline
  const heroTL = gsap.timeline();
  heroTL
    .from('.hero-meta-row', {
      opacity: 0,
      y: -15,
      duration: 0.8,
      ease: 'power3.out',
    })
    .from(
      '.hero-name-first',
      {
        opacity: 0,
        x: -40,
        duration: 1,
        ease: 'power4.out',
      },
      '-=0.5'
    )
    .from(
      '.hero-inline-visual',
      {
        opacity: 0,
        scale: 0.85,
        duration: 0.8,
        ease: 'back.out(1.5)',
      },
      '-=0.7'
    )
    .from(
      '.hero-name-last',
      {
        opacity: 0,
        x: 40,
        duration: 1,
        ease: 'power4.out',
      },
      '-=0.7'
    )
    .from(
      ['.hero-lead', '.hero-cta-group', '.hero-scroll-indicator'],
      {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.4'
    );

  // B. Experience Horizontal Scrub Section (data-experience-wrap)
  const expWrap = document.querySelector('[data-experience-wrap]');
  const expTrack = document.querySelector('[data-experience-track]');

  if (expWrap && expTrack) {
    const isMobile = window.innerWidth < 768;
    const distance = isMobile ? -350 : -220;

    gsap.to(expTrack, {
      x: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: expWrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  // C. Tour Table Rows Staggered Reveal
  const tourRows = document.querySelectorAll('.tour-row');
  if (tourRows.length > 0) {
    gsap.from(tourRows, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.tour-table',
        start: 'top 80%',
      },
    });
  }

  // D. Album Cards Entrance
  const albumCards = document.querySelectorAll('.album-card');
  if (albumCards.length > 0) {
    gsap.from(albumCards, {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.albums-grid',
        start: 'top 80%',
      },
    });
  }

  // E. Footer Parallax Brand Title
  const footerTitle = document.querySelector('.footer-title');
  if (footerTitle) {
    gsap.from(footerTitle, {
      yPercent: -25,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
  }
}

/* ========================================================
   5. Button Character Roll-up Splitting
   ======================================================== */
function initButtonCharSplits() {
  const buttons = document.querySelectorAll('[data-button]');

  buttons.forEach((btn) => {
    const textSpan = btn.querySelector('[data-button-text]');
    if (!textSpan) return;

    const originalText = textSpan.textContent.trim();
    textSpan.innerHTML = '';

    originalText.split('').forEach((char, index) => {
      const charSpan = document.createElement('span');
      charSpan.classList.add('button-char');
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      charSpan.style.transitionDelay = `${index * 0.015}s`;
      textSpan.appendChild(charSpan);
    });

    btn.addEventListener('mouseenter', () => {
      const chars = btn.querySelectorAll('.button-char');
      chars.forEach((c) => {
        c.style.transform = 'translateY(-3px)';
      });
    });

    btn.addEventListener('mouseleave', () => {
      const chars = btn.querySelectorAll('.button-char');
      chars.forEach((c) => {
        c.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ========================================================
   6. Tour Dates Filtering
   ======================================================== */
function initTourFilter() {
  const tabs = document.querySelectorAll('.tour-tab');
  const rows = document.querySelectorAll('.tour-row');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      rows.forEach((row) => {
        const type = row.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          gsap.to(row, {
            display: 'grid',
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
          });
        } else {
          gsap.to(row, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              row.style.display = 'none';
            },
          });
        }
      });
    });
  });
}

/* ========================================================
   7. Interactive Vinyl & Track Previews
   ======================================================== */
function initVinylTrackPlayers(audioSystem) {
  const playBtns = document.querySelectorAll('.track-play-btn');

  playBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackItem = btn.closest('.track-item');
      const albumCard = btn.closest('.album-card');
      const trackId = trackItem.getAttribute('data-track');

      // Toggle active states
      document.querySelectorAll('.track-item').forEach((item) => {
        if (item !== trackItem) {
          item.classList.remove('track-playing');
          const otherBtn = item.querySelector('.track-play-btn');
          if (otherBtn) otherBtn.textContent = '▶';
        }
      });

      const isPlaying = trackItem.classList.toggle('track-playing');
      btn.textContent = isPlaying ? '⏸' : '▶';

      // Animate vinyl disc
      const vinyl = albumCard.querySelector('.vinyl-disc-vector');
      if (vinyl) {
        if (isPlaying) {
          gsap.to(vinyl, {
            xPercent: 45,
            rotation: '+=360',
            duration: 1,
            ease: 'power2.out',
          });
          // Play synthesized snippet
          if (audioSystem && audioSystem.playTrackSnippet) {
            audioSystem.playTrackSnippet(trackId);
          }
        } else {
          gsap.to(vinyl, {
            xPercent: 0,
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      }
    });
  });
}

/* ========================================================
   8. Fullscreen Mobile Menu Drawer
   ======================================================== */
function initMenuDrawer() {
  const openBtn = document.querySelector('[data-menu-toggle]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const overlay = document.querySelector('[data-menu-wrap]');
  const links = document.querySelectorAll('[data-menu-item]');

  function openMenu() {
    if (!overlay) return;
    overlay.classList.add('menu-open');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(
      links,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );
  }

  function closeMenu() {
    if (!overlay) return;
    overlay.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ========================================================
   9. Newsletter Form Interaction
   ======================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input.value.trim();

      if (email) {
        feedback.className = 'form-feedback success';
        feedback.textContent = `✓ REGISTRATION CONFIRMED FOR ${email.toUpperCase()} // WELCOME TO THE PK ARCHIVE.`;
        input.value = '';
        input.disabled = true;

        const btn = form.querySelector('.btn-submit');
        if (btn) {
          btn.textContent = 'CONFIRMED';
          btn.style.backgroundColor = '#a7ff9c';
          btn.style.color = '#000';
        }
      }
    });
  }
}

/* ========================================================
   10. Hardware Console Interactive Meter Animation
   ======================================================== */
function initConsoleFaders() {
  const meters = document.querySelectorAll('.meter-fill');
  if (meters.length === 0) return;

  // Subtle living fluctuation on console fader meters
  setInterval(() => {
    meters.forEach((meter) => {
      const base = 50 + Math.random() * 45;
      meter.style.height = `${base}%`;
    });
  }, 180);
}

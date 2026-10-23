/**
 * dsgn interior — Animation Recreation
 * Extracted and adapted from https://dsgninterior.se/en
 *
 * Technologies: GSAP 3 + Swiper 11 Parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Prepare Split Lines for Typography Animation
  splitLines();

  // 2. Initialize Swiper Vertical Parallax Slider
  const swiper = initSwiper();

  // 3. Run Welcome Entrance Timeline
  playWelcomeAnimation();

  // 4. Bind UI Controls (Replay, Next, Prev, Slide Indicator)
  setupControls(swiper);
});

/**
 * Splits text with <br> into individual line masks:
 * <div class="split-line-wrapper"><div class="split-line-inner">line text</div></div>
 */
function splitLines() {
  const splitElements = document.querySelectorAll('.split');

  splitElements.forEach((el) => {
    // Preserve HTML line breaks
    const rawHTML = el.innerHTML.trim();
    const lines = rawHTML.split(/<br\s*[\/]?>/gi);

    el.innerHTML = lines
      .map(
        (line) => `
        <span class="split-line-wrapper">
          <span class="split-line-inner">${line.trim()}</span>
        </span>`
      )
      .join('');
  });
}

/**
 * Exact replica of dsgninterior.se entrance animation:
 * - .home-banners fade-in (2s, power2.out)
 * - Text lines reveal downwards: yPercent -15% -> 0% (1s, power3.out, stagger: 0.1s)
 * - Header & Footer fade-in (1.5s, power2.out)
 */
function playWelcomeAnimation(onCompleteCallback) {
  const home = document.querySelector('.homepage');
  if (!home) return;

  home.classList.add('welcome');

  // GSAP Timeline matching dsgninterior.se original parameters
  const tl = gsap.timeline({
    onComplete: () => {
      home.classList.remove('welcome');
      if (onCompleteCallback) onCompleteCallback();
    },
  });

  tl.fromTo(
    '.home-banners',
    { opacity: 0 },
    { opacity: 1, duration: 2, ease: 'power2.out' }
  )
    .fromTo(
      'header.banner .split-line-inner',
      { yPercent: -15, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1 },
      '<.3'
    )
    .fromTo(
      '.header',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' },
      '<.4'
    )
    .fromTo(
      '.footer',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' },
      '<'
    );

  return tl;
}

/**
 * Initializes Swiper with vertical parallax and dynamic pagination
 */
function initSwiper() {
  const swiperContainer = document.querySelector('.home-banners');
  if (!swiperContainer) return null;

  const swiper = new Swiper(swiperContainer, {
    direction: 'vertical',
    slidesPerView: 1,
    speed: 650,
    resistanceRatio: 0,
    parallax: true,
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
      thresholdDelta: 15,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    on: {
      slideChange: function (s) {
        updatePagination(s);
        updateIndicator(s);
      },
    },
  });

  // Clicking first banner title smoothly advances to next slide (just like original)
  const heroTitle = document.querySelector('#banner-0 .banner-title');
  if (heroTitle) {
    heroTitle.addEventListener('click', () => {
      swiper.slideTo(1);
    });
  }

  return swiper;
}

/**
 * Updates dynamic vertical pagination bullets smoothly with GSAP
 */
function updatePagination(swiper) {
  const bulletsWrapper = document.querySelector('.swiper-pagination');
  if (!bulletsWrapper) return;

  const realIndex = swiper.realIndex;
  const totalSlides = swiper.slides.length;
  const bullets = bulletsWrapper.querySelectorAll('.swiper-pagination-bullet');

  let offset = 0;
  if (realIndex <= 1) {
    offset = 0;
  } else if (realIndex >= totalSlides - 2) {
    offset = -15 * (bullets.length - 3);
  } else {
    offset = -15 * (realIndex - 1);
  }

  gsap.to(bulletsWrapper, {
    y: offset,
    duration: 0.5,
    ease: 'power2.out',
  });
}

/**
 * Updates slide counter in the demo controller
 */
function updateIndicator(swiper) {
  const indicator = document.getElementById('slide-indicator');
  if (indicator) {
    indicator.textContent = `${swiper.realIndex + 1} / ${swiper.slides.length}`;
  }
}

/**
 * Interactive Controls for demoing and testing
 */
function setupControls(swiper) {
  const btnReplay = document.getElementById('btn-replay');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      if (!swiper) return;
      swiper.slideTo(0, 300);
      setTimeout(() => {
        playWelcomeAnimation();
      }, 350);
    });
  }

  if (btnPrev && swiper) {
    btnPrev.addEventListener('click', () => swiper.slidePrev());
  }

  if (btnNext && swiper) {
    btnNext.addEventListener('click', () => swiper.slideNext());
  }
}

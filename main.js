(function () {
  'use strict';

  /* ---- Gallery Data ---- */
  const galleryCards = document.querySelectorAll('.memory-card');
  const photos = Array.from(galleryCards).map((card) => ({
    src: card.querySelector('img').src,
    alt: card.querySelector('img').alt,
    caption: card.querySelector('.memory-card__caption').textContent,
  }));

  let currentIndex = 0;

  /* ---- DOM Refs ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxContent = document.getElementById('lightboxContent');

  const musicToggle = document.getElementById('musicToggle');
  const musicIconPlay = document.getElementById('musicIconPlay');
  const musicIconPause = document.getElementById('musicIconPause');
  const bgMusic = document.getElementById('bgMusic');

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* Hero entrance on load */
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
  });

  /* ---- Floating Particles ---- */
  function createParticles() {
    const container = document.getElementById('particles');
    const confettiContainer = document.getElementById('confetti');
    const hearts = ['💕', '💖', '💗', '✨', '♥'];

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'particle particle--sparkle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = 8 + Math.random() * 12 + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      container.appendChild(p);
    }

    for (let i = 0; i < 10; i++) {
      const h = document.createElement('span');
      h.className = 'particle particle--heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = Math.random() * 100 + '%';
      h.style.animationDuration = 10 + Math.random() * 10 + 's';
      h.style.animationDelay = Math.random() * 8 + 's';
      container.appendChild(h);
    }

    const colors = ['#f8e8ee', '#e8d5a3', '#e8dff5', '#e8c4d4', '#c9a962'];
    for (let i = 0; i < 25; i++) {
      const c = document.createElement('span');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = 6 + Math.random() * 8 + 's';
      c.style.animationDelay = Math.random() * 6 + 's';
      confettiContainer.appendChild(c);
    }
  }

  /* ---- Hero Hearts ---- */
  function createHeroHearts() {
    const container = document.getElementById('heroHearts');
    const symbols = ['💕', '💖', '✨', '♥', '🌸'];

    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('span');
      heart.className = 'hero-heart';
      heart.textContent = symbols[i % symbols.length];
      heart.style.left = 5 + Math.random() * 90 + '%';
      heart.style.top = 20 + Math.random() * 60 + '%';
      heart.style.animationDelay = Math.random() * 8 + 's';
      heart.style.animationDuration = 6 + Math.random() * 6 + 's';
      heart.style.fontSize = 0.8 + Math.random() * 0.8 + 'rem';
      container.appendChild(heart);
    }
  }

  createParticles();
  createHeroHearts();

  /* ---- Lightbox ---- */
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage(false);
    lightbox.hidden = false;
    requestAnimationFrame(() => {
      lightbox.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightbox.hidden = true;
    }, 600);
  }

  function updateLightboxImage(animate) {
    const photo = photos[currentIndex];
    if (animate) {
      lightboxContent.style.transition = 'none';
      lightboxContent.style.opacity = '0';
      lightboxContent.style.transform = 'scale(0.92)';

      requestAnimationFrame(() => {
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightboxCaption.textContent = photo.caption;
        lightboxContent.style.transition = '';
        requestAnimationFrame(() => {
          lightboxContent.style.opacity = '';
          lightboxContent.style.transform = '';
        });
      });
    } else {
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt;
      lightboxCaption.textContent = photo.caption;
    }
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateLightboxImage(true);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % photos.length;
    updateLightboxImage(true);
  }

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      openLightbox(parseInt(card.dataset.index, 10));
    });

    /* Touch feedback */
    card.addEventListener('touchstart', () => {
      card.classList.add('is-touching');
    }, { passive: true });

    card.addEventListener('touchend', () => {
      setTimeout(() => card.classList.remove('is-touching'), 300);
    }, { passive: true });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ---- Swipe Support ---- */
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < threshold) return;
    if (diff > 0) showNext();
    else showPrev();
  }

  /* ---- Music Toggle with Fade ---- */
  let fadeInterval = null;
  const FADE_STEP = 0.05;
  const FADE_MS = 50;
  const TARGET_VOLUME = 0.4;

  function fadeInMusic() {
    clearInterval(fadeInterval);
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeInterval = setInterval(() => {
      if (bgMusic.volume < TARGET_VOLUME - FADE_STEP) {
        bgMusic.volume = Math.min(bgMusic.volume + FADE_STEP, TARGET_VOLUME);
      } else {
        bgMusic.volume = TARGET_VOLUME;
        clearInterval(fadeInterval);
      }
    }, FADE_MS);
  }

  function fadeOutMusic() {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
      if (bgMusic.volume > FADE_STEP) {
        bgMusic.volume = Math.max(bgMusic.volume - FADE_STEP, 0);
      } else {
        bgMusic.volume = 0;
        bgMusic.pause();
        clearInterval(fadeInterval);
      }
    }, FADE_MS);
  }

  function setMusicUI(playing) {
    musicToggle.classList.toggle('is-playing', playing);
    musicIconPlay.classList.toggle('hidden', playing);
    musicIconPause.classList.toggle('hidden', !playing);
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      fadeInMusic();
      setMusicUI(true);
    } else {
      fadeOutMusic();
      setMusicUI(false);
    }
  });

  bgMusic.volume = 0;
})();

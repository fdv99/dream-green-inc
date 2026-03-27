/* ============================================================
   Dream Green Land Clearing and Grading — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Sticky Header
  ---------------------------------------------------------- */
  const header = document.querySelector('.site-header');

  function updateHeader() {
    if (!header) return;
    if (header.classList.contains('solid')) return; // inner pages keep solid
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (header) {
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ----------------------------------------------------------
     Mobile Nav
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function openMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  // Close on overlay click
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) closeMobileNav();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeLightbox();
    }
  });

  /* ----------------------------------------------------------
     Mobile Submenu Toggles
  ---------------------------------------------------------- */
  document.querySelectorAll('.mobile-nav-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenuId = this.getAttribute('data-submenu');
      const submenu = document.getElementById(submenuId);
      if (!submenu) return;
      const isOpen = submenu.classList.contains('open');
      // Close all submenus
      document.querySelectorAll('.mobile-submenu').forEach(function (s) {
        s.classList.remove('open');
      });
      document.querySelectorAll('.mobile-nav-toggle').forEach(function (t) {
        t.querySelector('.submenu-arrow') && (t.querySelector('.submenu-arrow').textContent = '›');
      });
      if (!isOpen) {
        submenu.classList.add('open');
        const arrow = this.querySelector('.submenu-arrow');
        if (arrow) arrow.textContent = '⌄';
      }
    });
  });

  /* ----------------------------------------------------------
     Smooth Scroll for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     FAQ Accordion
  ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ----------------------------------------------------------
     Gallery Lightbox
  ---------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let galleryImages = [];
  let currentIndex = 0;

  function buildGalleryArray() {
    galleryImages = [];
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      const img = item.querySelector('img');
      if (img) {
        galleryImages.push({
          src: img.getAttribute('data-full') || img.src,
          alt: img.alt
        });
      }
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateLightboxNav();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  function showPrev() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
    updateLightboxNav();
  }

  function showNext() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
    updateLightboxNav();
  }

  function updateLightboxNav() {
    // Hide nav if only one image
    if (lightboxPrev) lightboxPrev.style.display = galleryImages.length > 1 ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = galleryImages.length > 1 ? 'flex' : 'none';
  }

  if (lightbox) {
    buildGalleryArray();

    document.querySelectorAll('.gallery-item').forEach(function (item, index) {
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  /* ----------------------------------------------------------
     Intersection Observer — Fade in sections
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .area-card, .feature-item, .faq-item').forEach(function (el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

})();

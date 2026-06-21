(function () {
  'use strict';

  const root = document.documentElement;
  const preloader = document.querySelector('.preloader');
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  const themeToggle = document.querySelector('#themeToggle');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark'
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  setTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  window.addEventListener('load', () => {
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 250);
    }
  });

  const onScroll = () => {
    navbar?.classList.toggle('glow', window.scrollY > 8);
    backToTop?.classList.toggle('show', window.scrollY > 480);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const typingEl = document.querySelector('.typing-box');
  const roles = [
    'Senior Android Engineer',
    'Kotlin • Jetpack Compose • MVVM',
    'Firebase • Room • Retrofit • CI/CD',
    'Secure, scalable mobile products'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const current = roles[roleIndex];
    typingEl.textContent = deleting
      ? current.slice(0, Math.max(0, charIndex - 1))
      : current.slice(0, charIndex + 1);

    charIndex += deleting ? -1 : 1;

    if (!deleting && charIndex >= current.length) {
      deleting = true;
      setTimeout(typeLoop, 1050);
      return;
    }

    if (deleting && charIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, 260);
      return;
    }

    setTimeout(typeLoop, deleting ? 28 : 44);
  }

  if (typingEl) setTimeout(typeLoop, 500);

  const counters = document.querySelectorAll('.counter-target');
  function animateCounter(el) {
    const target = Number(el.dataset.target || '0');
    const duration = 950;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * progress).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));

  const skillBars = document.querySelectorAll('.skill-progress');
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${Number(entry.target.dataset.width || 0)}%`;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(bar => barObserver.observe(bar));

  const fadeSections = document.querySelectorAll('.fade-in-section');
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeSections.forEach(section => fadeObserver.observe(section));

  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const parallaxTick = () => {
    const y = window.scrollY;
    parallaxLayers.forEach(layer => {
      const speed = Number(layer.dataset.speed || '0.08');
      layer.style.transform = `translateY(${y * speed}px)`;
    });
  };

  window.addEventListener('scroll', parallaxTick, { passive: true });
  parallaxTick();

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.querySelector('.navbar-collapse.show');
      if (window.innerWidth < 992 && collapse) {
        document.querySelector('.navbar-toggler')?.click();
      }
    });
  });

  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    const markInvalid = (input, message) => {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      const feedback = input.parentElement.querySelector('.invalid-feedback');
      if (feedback) feedback.textContent = message;
    };

    const markValid = (input) => {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      const feedback = input.parentElement.querySelector('.invalid-feedback');
      if (feedback) feedback.textContent = '';
    };

    contactForm.addEventListener('submit', (e) => {
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');
      let ok = true;

      if (!name || name.value.trim().length < 2) { markInvalid(name, 'Please enter your full name.'); ok = false; } else markValid(name);
      if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(email?.value || '')) { markInvalid(email, 'Please enter a valid email address.'); ok = false; } else markValid(email);
      if (subject && subject.value.trim().length < 3) { markInvalid(subject, 'Please add a clear subject.'); ok = false; } else if (subject) markValid(subject);
      if (!message || message.value.trim().length < 15) { markInvalid(message, 'Please write at least 15 characters.'); ok = false; } else markValid(message);

      if (!ok) {
        e.preventDefault();
        contactForm.querySelector('.is-invalid')?.focus();
      }
    });
  }

  const heroCanvas = document.querySelector('.hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let w = 0, h = 0, dots = [];

    function resize() {
      w = heroCanvas.width = heroCanvas.offsetWidth;
      h = heroCanvas.height = heroCanvas.offsetHeight;
      dots = Array.from({ length: Math.min(48, Math.floor(w / 22)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(75,231,255,0.28)';
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }
})();

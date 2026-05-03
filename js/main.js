/* MathsWonder — main.js
   Nav toggle · FAQ accordion · Counter animation · Form handling
   ================================================================ */

(function () {
  'use strict';

  /* ── Mobile nav ── */
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Active nav link ── */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (o) {
        o.classList.remove('is-open');
      });
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ── Counter animation ── */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var decimals = target % 1 !== 0 ? 1 : 0;
    var duration = 4000;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var value = target * ease;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { obs.observe(c); });
  }

  /* ── Playlist tab switcher (learning.html) ── */
  var playlistTabs = document.querySelectorAll('.playlist-tab');
  var playlistFrame = document.getElementById('playlist-frame');
  if (playlistTabs.length && playlistFrame) {
    playlistTabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        playlistTabs.forEach(function (b) {
          b.style.background = 'transparent';
          b.style.color = b.dataset.color;
          b.style.borderColor = b.dataset.color;
        });
        btn.style.background = btn.dataset.color;
        btn.style.color = '#fff';
        btn.style.borderColor = btn.dataset.color;
        playlistFrame.src = 'https://www.youtube.com/embed/videoseries?list=' + btn.dataset.list + '&rel=0';
      });
    });
  }

  /* ── Web3Forms contact form ── */
  var form = document.getElementById('contactForm');
  var result = document.getElementById('formResult');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      result.className = '';
      result.style.display = 'none';

      var data = new FormData(form);
      try {
        var res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data
        });
        var json = await res.json();
        if (json.success) {
          result.textContent = '✓ Message sent! I will reply within 24 hours.';
          result.className = 'success';
          form.reset();
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      } catch (err) {
        result.textContent = '✗ Something went wrong. Please WhatsApp or email directly.';
        result.className = 'error';
      } finally {
        result.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    });
  }

  /* ── Smooth reveal on scroll ── */
  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent = '.reveal{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}.reveal.visible{opacity:1;transform:none}';
    document.head.appendChild(style);
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.card, .blog-card, .grade-card, .credential-item, .compare-card').forEach(function (el) {
      el.classList.add('reveal');
      revObs.observe(el);
    });
  }

})();

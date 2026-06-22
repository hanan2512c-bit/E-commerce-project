// ── SIMPLON ANIMATIONS ──
// Runs on every page after DOM is ready

document.addEventListener('DOMContentLoaded', function () {

  // 1) SCROLL REVEAL — any element with data-reveal attribute or common selectors
  var revealEls = document.querySelectorAll(
    '.prod-card, .contact-card, .value-card, .team-card, .testi-card, ' +
    '.review-card, .tl-item, .stat-block, .feat-item, .gallery-item, ' +
    '.g-item, .picker-card, .cart-row, .about-box, .fb-card, [data-reveal]'
  );

  // Set initial hidden state
  revealEls.forEach(function (el) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        var siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [];
        var idx = siblings.indexOf(entry.target);
        var delay = Math.min(idx * 80, 400); // max 400ms stagger
        setTimeout(function () {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { observer.observe(el); });


  // 2) HERO / PAGE-HERO fade-in
  var hero = document.querySelector('#hero > div, .page-hero');
  if (hero) {
    hero.style.opacity   = '0';
    hero.style.transform = 'translateY(20px)';
    hero.style.transition= 'opacity .8s ease, transform .8s ease';
    setTimeout(function () {
      hero.style.opacity   = '1';
      hero.style.transform = 'translateY(0)';
    }, 100);
  }


  // 3) NAVBAR LINKS — slide in from top
  document.querySelectorAll('.nav-link').forEach(function (el, i) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(-10px)';
    el.style.transition= 'opacity .4s ease ' + (i * 60) + 'ms, transform .4s ease ' + (i * 60) + 'ms';
    setTimeout(function () {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 60);
  });


  // 4) STAT COUNTERS — animate numbers up
  var statEls = document.querySelectorAll('.stat-block h2, .stat-box h3');
  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(function (el) { statObserver.observe(el); });

  function animateCount(el) {
    var raw    = el.textContent.replace(/[^0-9]/g, '');
    var suffix = el.textContent.replace(/[0-9]/g, '');
    var target = parseInt(raw, 10);
    if (isNaN(target)) return;
    var start    = 0;
    var duration = 1200;
    var step     = Math.ceil(target / (duration / 16));
    var timer = setInterval(function () {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = start + suffix;
    }, 16);
  }


  // 5) BUTTONS — pulse on hover
  document.querySelectorAll('.btn-gold, .btn-rose, .add-btn, .qty-btn').forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
      this.style.transition = 'all .25s ease';
    });
    btn.addEventListener('click', function () {
      var el = this;
      el.style.transform = 'scale(.94)';
      setTimeout(function () { el.style.transform = ''; }, 180);
    });
  });


  // 6) GALLERY ITEMS — scale in
  document.querySelectorAll('.g-item, .gallery-item').forEach(function (el, i) {
    el.style.transition = 'transform .4s ease, box-shadow .4s ease, opacity .5s ease ' + (i * 50) + 'ms';
  });


  // 7) PICKER CARDS (order page) — slide in from left
  document.querySelectorAll('.picker-card').forEach(function (el, i) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(-20px)';
    el.style.transition = 'opacity .45s ease ' + (i * 40) + 'ms, transform .45s ease ' + (i * 40) + 'ms';
    setTimeout(function () {
      el.style.opacity   = '1';
      el.style.transform = 'translateX(0)';
    }, 300 + i * 40);
  });


  // 8) PAGE HERO TEXT — word by word shimmer on load
  var heroH1 = document.querySelector('.page-hero h1, #hero h1');
  if (heroH1) {
    heroH1.style.animation = 'none';
    heroH1.style.transition= 'color .6s ease';
  }


  // 9) SECTION TITLES — underline draw animation
  document.querySelectorAll('.sec-line').forEach(function (el) {
    el.style.width      = '0';
    el.style.transition = 'width .7s ease';
    var lineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = '48px';
          lineObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    lineObserver.observe(el);
  });


  // 10) PRODUCT CARDS — tilt on mousemove
  document.querySelectorAll('.prod-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      var y    = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      card.style.transform = 'translateY(-6px) rotateX(' + y + 'deg) rotateY(' + x + 'deg)';
      card.style.transition= 'transform .1s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition= 'transform .4s ease';
    });
  });


  // 11) SMOOTH PAGE TRANSITIONS — fade out on link click
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.style.transition = 'opacity .3s ease';
      document.body.style.opacity    = '0';
      setTimeout(function () { window.location.href = href; }, 300);
    });
  });

  // Fade in on load
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity .4s ease';
  setTimeout(function () { document.body.style.opacity = '1'; }, 50);

});

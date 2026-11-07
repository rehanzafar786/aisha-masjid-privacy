/* Aisha Masjid site: motion and small helpers. Every page reads fully without this file. */
(function () {
  var d = document.documentElement;
  try {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches,
      fine = matchMedia('(hover: hover) and (pointer: fine)').matches,
      bar = document.querySelector('.progress span'),
      toTop = document.querySelector('.totop'),
      head = document.querySelector('.topbar'),
      ticking = false;

    function prog() {
      var h = d.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, scrollY / h) : 0;
      if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (toTop) { toTop.style.setProperty('--p', p); toTop.classList.toggle('show', scrollY > 600); }
      if (head) head.classList.toggle('scrolled', scrollY > 20);
      ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(prog); } }, { passive: true });
    prog();

    /* copy email */
    document.querySelectorAll('[data-copy]').forEach(function (b) {
      b.hidden = false;
      b.addEventListener('click', function () {
        var text = b.getAttribute('data-copy'), label = b.querySelector('.lbl');
        function done() { if (label) { label.textContent = 'Copied'; b.classList.add('ok'); setTimeout(function () { label.textContent = 'Copy'; b.classList.remove('ok'); }, 1800); } }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
      });
    });

    /* message composer: opens the visitor's own mail app with the message filled in; nothing is sent from this page */
    var form = document.getElementById('composer');
    if (form) {
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!form.reportValidity()) return;
        var f = form.elements, to = form.getAttribute('data-to');
        var subject = 'Aisha Masjid app: ' + f.topic.value;
        var body = f.message.value.trim() + '\n\n—\nName: ' + f.name.value.trim() + '\nAccount email: ' + f.email.value.trim();
        location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        var note = document.getElementById('composer-note');
        if (note) note.hidden = false;
      });
    }

    if (!('IntersectionObserver' in window)) { d.classList.remove('js'); return; }

    document.querySelectorAll('.stagger').forEach(function (g) {
      [].forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
    });

    function count(n) {
      var to = +n.getAttribute('data-count'), t0 = 0;
      n.textContent = '0';
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 1300);
        n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function reveal(el) {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
      setTimeout(function () { el.classList.add('done'); }, 1900);
      var n = el.querySelector('[data-count]');
      if (n && !reduce) setTimeout(function () { count(n); }, 350);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    if (location.hash) {
      var t = document.getElementById(location.hash.slice(1));
      if (t) { reveal(t.closest('.reveal') || t); if (t.tagName === 'DETAILS') t.open = true; }
    }

    var links = {};
    document.querySelectorAll('.toc-side a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) for (var k in links) links[k].classList.toggle('active', k === e.target.id);
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    document.querySelectorAll('section.policy').forEach(function (s) { spy.observe(s); });
    document.querySelectorAll('.toc-mobile a').forEach(function (a) {
      a.addEventListener('click', function () { a.closest('details').open = false; });
    });

    if (!fine) return;
    document.querySelectorAll('.spot').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--x', (ev.clientX - r.left) + 'px');
        el.style.setProperty('--y', (ev.clientY - r.top) + 'px');
      });
    });
    if (reduce) return;
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .15s ease-out';
        el.style.transform = 'perspective(800px) rotateX(' + (-y * 9).toFixed(2) + 'deg) rotateY(' + (x * 11).toFixed(2) + 'deg) translateY(-6px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform .7s cubic-bezier(.2,.7,.2,1)';
        el.style.transform = '';
      });
    });
    document.querySelectorAll('.btn,.mailbig').forEach(function (b) {
      b.addEventListener('pointermove', function (ev) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((ev.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px ' + ((ev.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('pointermove', function (ev) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (((ev.clientX - r.left) / r.width - .5) * 2).toFixed(3));
        hero.style.setProperty('--my', (((ev.clientY - r.top) / r.height - .5) * 2).toFixed(3));
      });
      hero.addEventListener('pointerleave', function () { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
    }
  } catch (err) { d.classList.remove('js'); }
})();

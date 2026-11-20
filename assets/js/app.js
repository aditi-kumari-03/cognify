/* ==========================================================================
   COGNIFY · app.js
   Page wiring: navigation, reveals, feature overlay slider, exam grid,
   FAQ, the worksheet builder and all exports.
   ========================================================================== */
(function (w, doc) {
  'use strict';
  var C = (w.COGNIFY = w.COGNIFY || {});
  var D = C.data;

  function $(id) { return doc.getElementById(id); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }

  var current = null;            // the worksheet object on screen
  var lastConfig = null;         // config used to build it
  var keyHidden = false;

  /* ============================== TOAST ============================== */
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.hidden = true; }, 320);
    }, 2600);
  }

  /* =========================== NAV & SCROLL =========================== */
  function initNav() {
    var nav = $('nav'), links = $('navLinks'), burger = $('hamburger');
    var sections = ['home', 'features', 'exams', 'generate', 'how', 'faq'];

    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    $$('a[data-scroll]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.charAt(0) !== '#') return;
        var target = doc.querySelector(id);
        if (!target) return;
        e.preventDefault();
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      });
    });

    function onScroll() {
      var y = w.scrollY || doc.documentElement.scrollTop;
      nav.classList.toggle('stuck', y > 20);

      var h = doc.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var bar = $('scrollBar');
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

      var active = sections[0], mid = y + w.innerHeight * 0.32;
      sections.forEach(function (id) {
        var s = doc.getElementById(id);
        if (s && s.offsetTop <= mid) active = id;
      });
      $$('.nav-links a').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + active);
      });
    }
    w.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================= REVEALS ============================= */
  function initReveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in w)) { items.forEach(function (i) { i.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = parseInt(en.target.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { en.target.classList.add('in'); }, d);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (i) { io.observe(i); });
  }

  function initCounters() {
    var nums = $$('[data-count]');
    if (!('IntersectionObserver' in w)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var node = en.target, target = parseInt(node.getAttribute('data-count'), 10);
        var suffix = node.getAttribute('data-suffix') || '', t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1100);
          node.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(node);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ============================== ICONS ============================== */
  var ICONS = {
    spark: '<path d="M12 2l2.2 6.2L20.5 10l-6.3 1.8L12 18l-2.2-6.2L3.5 10l6.3-1.8z"/><circle cx="18.5" cy="18.5" r="2"/><circle cx="5.5" cy="17.5" r="1.4"/>',
    target: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.6"/>',
    chat: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.2-4.2A8 8 0 1 1 21 12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="12" r="1.2"/><circle cx="13" cy="12" r="1.2"/><circle cx="17" cy="12" r="1.2"/>',
    key: '<path d="M15 7a4 4 0 1 1-3.4 6.1L7 18l-2 0 0-2 .9-.9 1.6 0 0-1.6 1.1-1.1A4 4 0 0 1 15 7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="16.2" cy="9.8" r="1.1"/>',
    download: '<path d="M12 3v11M7.5 10.5L12 15l4.5-4.5M4 18.5h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    slider: '<path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h12M20 17h0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="17" r="2"/>',
    clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5.2l3.4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    wifi: '<path d="M3.5 9.5a13 13 0 0 1 17 0M6.5 13a8.6 8.6 0 0 1 11 0M9.5 16.4a4.2 4.2 0 0 1 5 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="19.5" r="1.4"/>',
    layers: '<path d="M12 3l9 4.5-9 4.5-9-4.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 12.5L12 17l9-4.5M3 16.8L12 21.3l9-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  };
  function icon(name, cls) {
    return '<svg viewBox="0 0 24 24" class="' + (cls || '') + '" fill="currentColor" aria-hidden="true">' + (ICONS[name] || ICONS.spark) + '</svg>';
  }

  /* ========================== FEATURE CARDS ========================== */
  function initFeatures() {
    var grid = $('featureGrid');
    grid.innerHTML = D.FEATURES.map(function (f, i) {
      return '<button type="button" class="f-card reveal" data-slide="' + i + '" data-delay="' + (i % 3) * 70 + '">' +
        '<span class="f-ico">' + icon(f.icon) + '</span>' +
        '<h4>' + C.render.esc(f.title) + '</h4>' +
        '<p>' + C.render.esc(f.short) + '</p>' +
        '<span class="f-more">Read more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '</button>';
    }).join('');
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-slide]');
      if (card) overlay.open(parseInt(card.getAttribute('data-slide'), 10));
    });
  }

  /* ========================= OVERLAY SLIDER ========================= */
  var ART = {
    spark: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M60 14l10 28 28 10-28 10-10 28-10-28-28-10 28-10z"/><circle cx="96" cy="26" r="6"/><circle cx="24" cy="92" r="5"/></svg>',
    target: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4"><circle cx="60" cy="60" r="44"/><circle cx="60" cy="60" r="27"/><circle cx="60" cy="60" r="10" fill="currentColor"/><path d="M60 4v16M60 100v16M4 60h16M100 60h16"/></svg>',
    chat: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M104 58a36 36 0 0 1-36 36H40L18 110l6-20A36 36 0 1 1 104 58z"/><circle cx="46" cy="58" r="5" fill="currentColor"/><circle cx="64" cy="58" r="5" fill="currentColor"/><circle cx="82" cy="58" r="5" fill="currentColor"/></svg>',
    key: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><circle cx="78" cy="42" r="22"/><circle cx="78" cy="42" r="6" fill="currentColor"/><path d="M62 58L24 96v14h14l6-8h10v-10h10l8-8"/></svg>',
    download: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M60 16v56M38 52l22 22 22-22M20 98h80"/><rect x="28" y="12" width="64" height="18" rx="4" opacity=".35"/></svg>',
    slider: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M18 34h50M88 34h14M18 60h22M60 60h42M18 86h66M104 86h0"/><circle cx="78" cy="34" r="10" fill="currentColor"/><circle cx="50" cy="60" r="10" fill="currentColor"/><circle cx="94" cy="86" r="10" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><circle cx="60" cy="62" r="42"/><path d="M60 36v28l18 11M44 12h32"/></svg>',
    wifi: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><path d="M14 46a66 66 0 0 1 92 0M30 66a44 44 0 0 1 60 0M46 86a22 22 0 0 1 28 0"/><circle cx="60" cy="102" r="6" fill="currentColor"/></svg>',
    layers: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M60 14l46 22-46 22-46-22z"/><path d="M14 60l46 22 46-22M14 82l46 22 46-22"/></svg>'
  };

  var overlay = (function () {
    var box, track, dots, prog, idx = 0, timer = null, AUTOPLAY = 7000;

    function build() {
      track.innerHTML = D.FEATURES.map(function (f, i) {
        return '<section class="o-slide" data-i="' + i + '" aria-hidden="true">' +
          '<div class="o-copy">' +
            '<span class="o-step">Feature ' + (i + 1) + ' of ' + D.FEATURES.length + '</span>' +
            '<h3>' + C.render.esc(f.title) + '</h3>' +
            '<p>' + C.render.esc(f.body) + '</p>' +
            '<ul class="o-points">' + f.points.map(function (p) { return '<li>' + C.render.esc(p) + '</li>'; }).join('') + '</ul>' +
            '<div class="o-cta">' +
              '<button type="button" class="btn btn-primary" data-act="build">Try the builder</button>' +
              '<button type="button" class="btn btn-ghost" data-act="chat">Ask the bot</button>' +
            '</div>' +
          '</div>' +
          '<div class="o-art">' + (ART[f.art] || ART.spark) + '</div>' +
        '</section>';
      }).join('');

      dots.innerHTML = D.FEATURES.map(function (f, i) {
        return '<button type="button" data-i="' + i + '" aria-label="Feature ' + (i + 1) + '"></button>';
      }).join('');
    }

    function go(n, dir) {
      var slides = $$('.o-slide', track);
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('on', i === idx);
        s.classList.toggle('prev', dir === -1 && i !== idx);
        s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
      });
      $$('button', dots).forEach(function (b, i) { b.classList.toggle('on', i === idx); });
      restart();
    }

    function restart() {
      clearInterval(timer);
      if (prog) { prog.style.transition = 'none'; prog.style.width = '0%'; }
      requestAnimationFrame(function () {
        if (prog) { prog.style.transition = 'width ' + AUTOPLAY + 'ms linear'; prog.style.width = '100%'; }
      });
      timer = setInterval(function () { go(idx + 1, 1); }, AUTOPLAY);
    }

    function open(n) {
      box.hidden = false;
      box.setAttribute('aria-hidden', 'false');
      doc.body.style.overflow = 'hidden';
      go(n || 0, 1);
    }
    function close() {
      box.hidden = true;
      box.setAttribute('aria-hidden', 'true');
      doc.body.style.overflow = '';
      clearInterval(timer);
    }

    function init() {
      box = $('overlay'); track = $('overlayTrack'); dots = $('overlayDots'); prog = $('overlayProgress');
      build();
      $('overlayPrev').addEventListener('click', function () { go(idx - 1, -1); });
      $('overlayNext').addEventListener('click', function () { go(idx + 1, 1); });
      $('overlayClose').addEventListener('click', close);
      box.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) close(); });
      dots.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-i]');
        if (b) go(parseInt(b.getAttribute('data-i'), 10), 1);
      });
      track.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (!b) return;
        close();
        if (b.getAttribute('data-act') === 'build') {
          $('generate').scrollIntoView({ behavior: 'smooth' });
        } else {
          C.chat.open();
        }
      });
      doc.addEventListener('keydown', function (e) {
        if (box.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') go(idx + 1, 1);
        if (e.key === 'ArrowLeft') go(idx - 1, -1);
      });

      // touch swipe
      var x0 = null;
      track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 48) go(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        x0 = null;
      }, { passive: true });
    }

    return { init: init, open: open, close: close };
  })();

  /* ============================ EXAM GRID ============================ */
  function initExams() {
    var grid = $('examGrid');
    grid.innerHTML = D.EXAMS.map(function (e, i) {
      var subs = Object.keys(e.subjects);
      return '<button type="button" class="exam-card reveal' + (i % 2 ? ' pinkish' : '') + '" data-exam="' + e.id + '" data-delay="' + (i % 4) * 60 + '">' +
        '<div class="exam-top"><span class="exam-abbr">' + C.render.esc(e.abbr) + '</span><span class="exam-tag">' + C.render.esc(e.tag) + '</span></div>' +
        '<p class="exam-full">' + C.render.esc(e.full) + '</p>' +
        '<div class="exam-subs">' + subs.slice(0, 4).map(function (s) { return '<span>' + C.render.esc(s) + '</span>'; }).join('') +
          (subs.length > 4 ? '<span>+' + (subs.length - 4) + ' more</span>' : '') + '</div>' +
        '<div class="exam-foot"><span>+' + e.marks + (e.negative ? ' / −' + e.negative : '') + ' per question</span><b>Build sheet →</b></div>' +
        '</button>';
    }).join('');
    grid.addEventListener('click', function (ev) {
      var card = ev.target.closest('[data-exam]');
      if (!card) return;
      var id = card.getAttribute('data-exam');
      $('fExam').value = id;
      onExamChange();
      $('generate').scrollIntoView({ behavior: 'smooth' });
      toast(D.examById(id).abbr + ' loaded into the builder');
    });
  }

  /* =============================== FAQ =============================== */
  function initFAQ() {
    var acc = $('accordion');
    acc.innerHTML = D.FAQ.map(function (row, i) {
      return '<div class="acc-item reveal" data-delay="' + (i % 4) * 50 + '">' +
        '<button type="button" class="acc-q" aria-expanded="false">' + C.render.esc(row[0]) +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>' +
        '<div class="acc-a"><p>' + C.render.esc(row[1]) + '</p></div></div>';
    }).join('');
    acc.addEventListener('click', function (e) {
      var btn = e.target.closest('.acc-q');
      if (!btn) return;
      var item = btn.parentNode, panel = item.querySelector('.acc-a');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      // close siblings
      $$('.acc-item.open', acc).forEach(function (other) {
        if (other === item) return;
        other.classList.remove('open');
        other.querySelector('.acc-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.acc-a').style.maxHeight = '0px';
      });
    });
  }

  /* ============================= BUILDER ============================= */
  var selectedTopics = [];

  function readForm() {
    var diffBtn = doc.querySelector('#fDifficulty button.on');
    return {
      examId: $('fExam').value,
      levelIndex: parseInt($('fLevel').value, 10) || 0,
      subject: $('fSubject').value,
      count: parseInt($('fCount').value, 10),
      difficulty: diffBtn ? diffBtn.getAttribute('data-val') : 'mixed',
      time: parseInt($('fTime').value, 10),
      title: $('fTitle').value,
      includeKey: $('fKey').checked,
      includeSolutions: $('fSolutions').checked,
      showNegative: $('fNegative').checked,
      shuffleOptions: $('fShuffle').checked,
      topics: selectedTopics.slice()
    };
  }

  function fillSelect(sel, items, valueFn, labelFn, keep) {
    var prev = keep ? sel.value : null;
    sel.innerHTML = items.map(function (it, i) {
      return '<option value="' + C.render.esc(valueFn(it, i)) + '">' + C.render.esc(labelFn(it, i)) + '</option>';
    }).join('');
    if (prev !== null && items.some(function (it, i) { return String(valueFn(it, i)) === prev; })) sel.value = prev;
  }

  function onExamChange() {
    var exam = D.examById($('fExam').value);
    fillSelect($('fLevel'), exam.levels, function (l, i) { return i; }, function (l) { return l; });
    $('fLevel').value = exam.defaultLevel;
    fillSelect($('fSubject'), Object.keys(exam.subjects), function (s) { return s; }, function (s) { return s; });
    $('examHint').textContent = exam.blurb;
    selectedTopics = [];
    onSubjectChange();
  }

  function onSubjectChange() {
    var exam = D.examById($('fExam').value);
    var subject = $('fSubject').value || Object.keys(exam.subjects)[0];
    var ids = C.engine.usableTopics(exam.subjects[subject] || []);
    var box = $('topicChips');
    box.innerHTML = ids.map(function (id) {
      return '<button type="button" class="chip' + (selectedTopics.indexOf(id) > -1 ? ' on' : '') + '" data-topic="' + id + '">' +
        C.render.esc(D.topicName(id)) + '</button>';
    }).join('') || '<span class="hint">No separate topics for this subject — the whole syllabus will be mixed.</span>';
    syncTime();
    updatePreview();
  }

  function syncTime() {
    var exam = D.examById($('fExam').value);
    var n = parseInt($('fCount').value, 10);
    $('fTime').value = Math.max(5, Math.round(n * (exam.perQ || 1)));
  }

  function updatePreview() {
    var cfg = readForm();
    var exam = D.examById(cfg.examId);
    var list = $('previewKV');
    var topicsLabel = cfg.topics.length ? cfg.topics.length + ' selected' : 'Whole subject';
    list.innerHTML = [
      ['Exam', exam.abbr],
      ['Level', exam.levels[cfg.levelIndex] || '—'],
      ['Subject', cfg.subject],
      ['Topics', topicsLabel],
      ['Questions', cfg.count],
      ['Difficulty', C.render.diffLabel(cfg.difficulty)],
      ['Max marks', Math.round(cfg.count * exam.marks * 100) / 100],
      ['Time', cfg.time + ' min'],
      ['Marking', '+' + exam.marks + (exam.negative ? ' / −' + exam.negative : '')]
    ].map(function (r) {
      return '<li><span>' + C.render.esc(r[0]) + '</span><b>' + C.render.esc(r[1]) + '</b></li>';
    }).join('');
  }

  function rangeFill() {
    var r = $('fCount');
    var pct = ((r.value - r.min) / (r.max - r.min)) * 100;
    r.style.setProperty('--fill', pct + '%');
    $('countOut').textContent = r.value;
  }

  function generate(scroll) {
    var cfg = readForm();
    lastConfig = cfg;
    var ws = C.engine.build(cfg);
    if (!ws.questions.length) { toast('No questions available for that combination'); return null; }
    current = ws;
    keyHidden = false;
    paint();
    if (scroll !== false) {
      setTimeout(function () { $('output').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
    }
    $('regenBtn').disabled = false;
    return ws;
  }

  function paint() {
    var out = $('output');
    out.hidden = false;
    $('worksheetPaper').innerHTML = C.render.worksheetHTML(current, { keyHidden: keyHidden });
    $('outTitle').textContent = current.meta.title;
    $('outSub').textContent = current.meta.examAbbr + ' · ' + current.meta.subject + ' · ' +
      current.meta.count + ' questions · ' + current.meta.totalMarks + ' marks · ' + current.meta.time + ' min · ' + current.meta.setCode;
    var btn = $('toggleKeyBtn');
    var has = current.meta.includeKey || current.meta.includeSolutions;
    btn.hidden = !has;
    btn.textContent = keyHidden ? 'Show answer key' : 'Hide answer key';
  }

  function initBuilder() {
    fillSelect($('fExam'), D.EXAMS, function (e) { return e.id; }, function (e) { return e.abbr + ' — ' + e.full; });
    $('fExam').value = 'nimcet';
    onExamChange();
    rangeFill();

    $('fExam').addEventListener('change', onExamChange);
    $('fSubject').addEventListener('change', function () { selectedTopics = []; onSubjectChange(); });
    $('fLevel').addEventListener('change', updatePreview);
    $('fCount').addEventListener('input', function () { rangeFill(); syncTime(); updatePreview(); });
    $('fTime').addEventListener('input', updatePreview);
    $('fKey').addEventListener('change', updatePreview);

    $('topicChips').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-topic]');
      if (!chip) return;
      var id = chip.getAttribute('data-topic');
      var i = selectedTopics.indexOf(id);
      if (i > -1) selectedTopics.splice(i, 1); else selectedTopics.push(id);
      chip.classList.toggle('on');
      updatePreview();
    });

    $('fDifficulty').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-val]');
      if (!b) return;
      $$('#fDifficulty button').forEach(function (x) {
        var on = x === b;
        x.classList.toggle('on', on);
        x.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      updatePreview();
    });

    $('builderForm').addEventListener('submit', function (e) {
      e.preventDefault();
      generate(true);
      toast('Worksheet generated');
    });

    $('regenBtn').addEventListener('click', function () {
      if (!lastConfig) return;
      current = C.engine.build(lastConfig);
      keyHidden = false;
      paint();
      toast('New set with the same settings');
    });

    $('resetBtn').addEventListener('click', function () {
      setTimeout(function () {
        $('fExam').value = 'nimcet';
        selectedTopics = [];
        onExamChange();
        rangeFill();
        $('fTitle').value = '';
        $$('#fDifficulty button').forEach(function (x) {
          var on = x.getAttribute('data-val') === 'mixed';
          x.classList.toggle('on', on);
          x.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        updatePreview();
      }, 0);
    });
  }

  /* ============================= OUTPUT ============================= */
  function initOutput() {
    $('toggleKeyBtn').addEventListener('click', function () {
      keyHidden = !keyHidden;
      var block = doc.getElementById('wsKeyBlock');
      if (block) block.classList.toggle('hidden', keyHidden);
      this.textContent = keyHidden ? 'Show answer key' : 'Hide answer key';
    });

    $('printBtn').addEventListener('click', function () {
      if (!current) return;
      C.render.exportAs('pdf', current);
    });

    var dl = $('dlBtn'), menu = $('dlMenu');
    dl.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('open');
      dl.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    doc.addEventListener('click', function () {
      menu.classList.remove('open');
      dl.setAttribute('aria-expanded', 'false');
    });
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dl]');
      if (!b || !current) return;
      var kind = b.getAttribute('data-dl');
      C.render.exportAs(kind, current);
      menu.classList.remove('open');
      toast(kind === 'pdf' ? 'Opening the print dialog — choose “Save as PDF”' : 'Download started');
    });
  }

  /* ============================== TIPS ============================== */
  function initTips() {
    var i = Math.floor(Math.random() * D.TIPS.length);
    $('studyTip').textContent = D.TIPS[i];
    $('newTipBtn').addEventListener('click', function () {
      i = (i + 1 + Math.floor(Math.random() * (D.TIPS.length - 1))) % D.TIPS.length;
      var p = $('studyTip');
      p.style.opacity = '0';
      setTimeout(function () { p.textContent = D.TIPS[i]; p.style.opacity = '1'; }, 160);
    });
    $('studyTip').style.transition = 'opacity .16s ease';
  }

  /* =========================== CHAT BRIDGE =========================== */
  function applyChatConfig(cfg) {
    var exam = D.examById(cfg.examId);
    $('fExam').value = exam.id;
    onExamChange();
    if (typeof cfg.levelIndex === 'number' && exam.levels[cfg.levelIndex]) $('fLevel').value = cfg.levelIndex;
    if (cfg.subject && exam.subjects[cfg.subject]) $('fSubject').value = cfg.subject;
    selectedTopics = (cfg.topics || []).slice();
    onSubjectChange();
    if (cfg.count) { $('fCount').value = cfg.count; rangeFill(); syncTime(); }
    if (cfg.difficulty) {
      $$('#fDifficulty button').forEach(function (x) {
        var on = x.getAttribute('data-val') === cfg.difficulty;
        x.classList.toggle('on', on);
        x.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
    updatePreview();
    return generate(true);
  }

  /* ============================== BOOT ============================== */
  function init() {
    $('year').textContent = new Date().getFullYear();

    initNav();
    initFeatures();
    overlay.init();
    initExams();
    initFAQ();
    initBuilder();
    initOutput();
    initTips();
    initReveal();
    initCounters();
    C.chat.init();

    ['navTourBtn', 'heroTourBtn', 'featuresTourBtn', 'footerTourBtn'].forEach(function (id) {
      var b = $(id);
      if (b) b.addEventListener('click', function () { overlay.open(0); });
    });
    ['openChatBtn', 'footerChatBtn'].forEach(function (id) {
      var b = $(id);
      if (b) b.addEventListener('click', function () { C.chat.open(); });
    });
    var ak = $('aiKeyBtn');
    if (ak) ak.addEventListener('click', function () { C.chat.openSettings(); });
  }

  C.app = {
    toast: toast,
    applyChatConfig: applyChatConfig,
    regenerate: function () {
      if (!lastConfig) return null;
      current = C.engine.build(lastConfig);
      keyHidden = false;
      paint();
      return current;
    },
    getWorksheet: function () { return current; }
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);

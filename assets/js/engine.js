/* ==========================================================================
   COGNIFY · engine.js
   Turns a builder configuration into a finished worksheet object.
   ========================================================================== */
(function (w) {
  'use strict';
  var C = (w.COGNIFY = w.COGNIFY || {});
  var D = C.data, GEN = C.GEN, BANK = C.BANK;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var DIFF_LEVEL = { easy: 1, moderate: 2, advanced: 3 };

  /* which topics in a subject can actually produce questions */
  function usableTopics(ids) {
    var out = [];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], meta = D.TOPICS[id];
      if (!meta) continue;
      if (meta.kind === 'gen' && typeof GEN[id] === 'function') out.push(id);
      else if (meta.kind === 'bank' && BANK[id] && BANK[id].length) out.push(id);
      else if (typeof GEN[id] === 'function') out.push(id);
    }
    return out;
  }

  /* the base difficulty implied by the exam + class/level choice */
  function baseLevel(exam, levelIndex) {
    if (exam.id === 'school') return levelIndex <= 2 ? 1 : levelIndex <= 4 ? 2 : 3;   // 6–8, 9–10, 11–12
    return levelIndex === 0 ? 1 : levelIndex === 1 ? 2 : 3;
  }

  /* pick a difficulty number for question i */
  function pickLevel(mode, base, i, total) {
    if (DIFF_LEVEL[mode]) return DIFF_LEVEL[mode];
    // mixed: ~40% at base-1, 40% at base, 20% at base+1, ordered easy → hard
    var frac = total > 1 ? i / (total - 1) : 0;
    var lv = frac < 0.4 ? base - 1 : frac < 0.8 ? base : base + 1;
    return Math.max(1, Math.min(3, lv));
  }

  /* draw one question from a bank topic, avoiding repeats inside this sheet */
  function fromBank(topicId, level, used) {
    var pool = BANK[topicId] || [];
    if (!pool.length) return null;
    var exact = [], near = [], any = [];
    for (var i = 0; i < pool.length; i++) {
      var key = topicId + '#' + i;
      if (used[key]) continue;
      var dl = pool[i][4] || 2;
      any.push(i);
      if (dl === level) exact.push(i);
      else if (Math.abs(dl - level) === 1) near.push(i);
    }
    var list = exact.length ? exact : near.length ? near : any;
    if (!list.length) return null;
    var idx = list[Math.floor(Math.random() * list.length)];
    used[topicId + '#' + idx] = 1;
    var row = pool[idx];
    return {
      q: row[0],
      options: row[1].slice(),
      answer: row[2],
      solution: row[3] || '',
      difficulty: row[4] || 2
    };
  }

  function fromGen(topicId, level) {
    try {
      var q = GEN[topicId](level);
      if (!q || !q.options || q.options.length < 2) return null;
      return q;
    } catch (e) {
      return null;
    }
  }

  function shuffleOptions(q) {
    var pairs = q.options.map(function (o, i) { return { o: o, correct: i === q.answer }; });
    pairs = shuffle(pairs);
    q.options = pairs.map(function (p) { return p.o; });
    for (var i = 0; i < pairs.length; i++) if (pairs[i].correct) q.answer = i;
    return q;
  }

  /* ------------------------------------------------------------------
     MAIN
     ------------------------------------------------------------------ */
  function build(cfg) {
    var exam = D.examById(cfg.examId);
    var subject = cfg.subject && exam.subjects[cfg.subject] ? cfg.subject : Object.keys(exam.subjects)[0];
    var all = usableTopics(exam.subjects[subject]);
    var chosen = (cfg.topics && cfg.topics.length) ? usableTopics(cfg.topics) : [];
    var pool = chosen.length ? chosen : all;
    if (!pool.length) pool = usableTopics(exam.subjects[Object.keys(exam.subjects)[0]]);

    var count = Math.max(1, Math.min(60, parseInt(cfg.count, 10) || 20));
    var base = baseLevel(exam, typeof cfg.levelIndex === 'number' ? cfg.levelIndex : exam.defaultLevel);
    var mode = cfg.difficulty || 'mixed';

    var questions = [], seen = {}, usedBank = {};
    var order = shuffle(pool), cursor = 0, guard = 0;

    while (questions.length < count && guard < count * 40) {
      guard++;
      if (cursor >= order.length) { order = shuffle(pool); cursor = 0; }
      var topicId = order[cursor++];
      var level = pickLevel(mode, base, questions.length, count);
      var meta = D.TOPICS[topicId] || { kind: 'gen' };
      var q = (meta.kind === 'bank') ? fromBank(topicId, level, usedBank) : fromGen(topicId, level);
      if (!q && meta.kind !== 'bank' && BANK[topicId]) q = fromBank(topicId, level, usedBank);
      if (!q) continue;

      var sig = String(q.q).replace(/\s+/g, ' ').trim().toLowerCase();
      if (seen[sig]) continue;
      seen[sig] = 1;

      q.topic = topicId;
      q.topicName = D.topicName(topicId);
      if (cfg.shuffleOptions !== false) shuffleOptions(q);
      questions.push(q);
    }

    var marks = exam.marks || 1;
    var total = Math.round(questions.length * marks * 100) / 100;
    var suggested = Math.max(5, Math.round(questions.length * (exam.perQ || 1)));

    var levels = exam.levels || [];
    var levelName = levels[typeof cfg.levelIndex === 'number' ? cfg.levelIndex : exam.defaultLevel] || levels[0] || '';

    var title = (cfg.title && String(cfg.title).trim()) ||
      (exam.abbr + ' · ' + subject + ' Practice Worksheet');

    return {
      meta: {
        title: title,
        examId: exam.id,
        examAbbr: exam.abbr,
        examFull: exam.full,
        subject: subject,
        level: levelName,
        difficulty: mode,
        count: questions.length,
        marksPerQ: marks,
        negative: exam.negative || 0,
        showNegative: !!cfg.showNegative,
        totalMarks: total,
        time: parseInt(cfg.time, 10) || suggested,
        suggestedTime: suggested,
        includeKey: cfg.includeKey !== false,
        includeSolutions: cfg.includeSolutions !== false,
        topics: (chosen.length ? chosen : pool).map(D.topicName),
        topicsPicked: chosen.length > 0,
        generatedAt: new Date(),
        setCode: 'SET-' + Math.random().toString(36).slice(2, 6).toUpperCase()
      },
      questions: questions
    };
  }

  /* how many questions can a subject realistically supply without repeats */
  function capacity(examId, subject, topics) {
    var exam = D.examById(examId);
    var ids = (topics && topics.length) ? topics : (exam.subjects[subject] || []);
    var list = usableTopics(ids), n = 0, hasGen = false;
    for (var i = 0; i < list.length; i++) {
      var m = D.TOPICS[list[i]];
      if (m && m.kind === 'bank') n += (BANK[list[i]] || []).length;
      else { hasGen = true; n += 40; }
    }
    return hasGen ? Math.max(n, 60) : n;
  }

  C.engine = { build: build, capacity: capacity, usableTopics: usableTopics, baseLevel: baseLevel };
})(window);

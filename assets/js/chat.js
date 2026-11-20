/* ==========================================================================
   COGNIFY · chat.js
   Floating assistant: a guided worksheet flow + an offline study brain,
   with optional upgrade to a real Claude model via an API key.
   ========================================================================== */
(function (w) {
  'use strict';
  var C = (w.COGNIFY = w.COGNIFY || {});
  var D = C.data;

  var el = {};
  var state = {
    mode: 'worksheet',        // 'worksheet' | 'ask'
    step: 'idle',             // idle | exam | level | subject | count | difficulty | confirm | done
    draft: {},
    busy: false,
    history: []               // for the API path
  };

  var LS_KEY = 'cognify.ai.key';
  var LS_MODEL = 'cognify.ai.model';

  /* ================================ DOM ================================ */
  function $(id) { return document.getElementById(id); }

  function scrollDown() {
    if (el.body) el.body.scrollTop = el.body.scrollHeight;
  }

  function bubble(who, html) {
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    d.innerHTML = '<div class="text">' + html + '</div>';
    el.body.appendChild(d);
    scrollDown();
    return d;
  }

  function typing() {
    var d = document.createElement('div');
    d.className = 'msg bot';
    d.innerHTML = '<div class="text typing"><i></i><i></i><i></i></div>';
    el.body.appendChild(d);
    scrollDown();
    return d;
  }

  function say(html, delay) {
    return new Promise(function (resolve) {
      var t = typing();
      setTimeout(function () {
        t.remove();
        bubble('bot', html);
        resolve();
      }, delay === undefined ? Math.min(900, 260 + html.length * 6) : delay);
    });
  }

  function me(text) { bubble('me', C.render.esc(text)); }

  function quick(list) {
    el.quick.innerHTML = '';
    (list || []).forEach(function (item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'qbtn' + (item.alt ? ' alt' : '');
      b.textContent = item.label;
      b.addEventListener('click', function () {
        clearQuick();
        me(item.label);
        handle(item.value !== undefined ? item.value : item.label, item);
      });
      el.quick.appendChild(b);
    });
  }
  function clearQuick() { el.quick.innerHTML = ''; }

  /* ============================== PARSING ============================== */
  var EXAM_ALIASES = {
    nimcet: ['nimcet', 'nit mca', 'mca entrance'],
    jee: ['jee', 'jee main', 'jee mains', 'mains', 'iit', 'bitsat'],
    neet: ['neet', 'medical entrance', 'mbbs'],
    gate: ['gate', 'psu exam'],
    ssc: ['ssc', 'cgl', 'chsl', 'mts', 'staff selection'],
    banking: ['bank', 'banking', 'ibps', 'sbi', 'po exam', 'clerk', 'rbi'],
    railway: ['railway', 'rrb', 'ntpc', 'group d', 'alp', 'railways'],
    cat: ['cat exam', 'cat', 'mba', 'xat', 'mat exam'],
    nda: ['nda', 'defence', 'naval academy'],
    cuet: ['cuet', 'cuet ug'],
    school: ['school', 'class', 'cbse', 'icse', 'board exam', 'boards']
  };

  var SUBJECT_HINTS = [
    [/\b(maths?|mathematics|quant|quantitative|arithmetic|algebra)\b/i, ['Mathematics', 'Quantitative Aptitude', 'Quantitative Ability', 'Engineering Mathematics']],
    [/\b(reasoning|logical|aptitude test|di ?lr|logic)\b/i, ['Logical Reasoning', 'Reasoning Ability', 'General Intelligence & Reasoning', 'Data Interpretation & LR']],
    [/\b(english|verbal|grammar|vocab|comprehension)\b/i, ['General English', 'English Comprehension', 'English Language', 'Verbal Ability & RC', 'English', 'General Ability — English']],
    [/\b(computer|cs|it\b|programming|coding)\b/i, ['Computer Awareness', 'Computer Aptitude', 'Computer Science & IT', 'Computer Science']],
    [/\b(physics)\b/i, ['Physics']],
    [/\b(chemistry|chem)\b/i, ['Chemistry']],
    [/\b(bio|biology|botany|zoology)\b/i, ['Biology']],
    [/\b(science)\b/i, ['General Science', 'Science', 'General Ability — Science']],
    [/\b(gk|general knowledge|awareness|current affairs|ga\b|banking awareness)\b/i, ['General Awareness', 'General & Banking Awareness', 'General Ability — GK', 'General Test']],
    [/\b(social|history|civics|polity|geography)\b/i, ['Social Science']]
  ];

  function findExam(t) {
    t = ' ' + t.toLowerCase() + ' ';
    var best = null, bestLen = 0;
    for (var id in EXAM_ALIASES) {
      EXAM_ALIASES[id].forEach(function (a) {
        if (t.indexOf(a) > -1 && a.length > bestLen) { best = id; bestLen = a.length; }
      });
    }
    return best;
  }

  function findSubject(t, examId) {
    var exam = D.examById(examId);
    var names = Object.keys(exam.subjects);
    var low = t.toLowerCase();
    for (var i = 0; i < names.length; i++) {
      if (low.indexOf(names[i].toLowerCase()) > -1) return names[i];
    }
    for (var j = 0; j < SUBJECT_HINTS.length; j++) {
      if (SUBJECT_HINTS[j][0].test(t)) {
        var cands = SUBJECT_HINTS[j][1];
        for (var k = 0; k < cands.length; k++) if (names.indexOf(cands[k]) > -1) return cands[k];
      }
    }
    return null;
  }

  function findCount(t) {
    var m = t.match(/(\d{1,2})\s*(?:questions?|qs?|ques|items)\b/i);
    if (m) return clampCount(parseInt(m[1], 10));
    m = t.match(/\b(?:set of|give me|make|create|generate)\s*(\d{1,2})\b/i);
    if (m) return clampCount(parseInt(m[1], 10));
    m = t.match(/^\s*(\d{1,2})\s*$/);
    if (m) return clampCount(parseInt(m[1], 10));
    return null;
  }
  function clampCount(n) {
    if (!n || n < 5) return 5;
    if (n > 50) return 50;
    return Math.round(n / 5) * 5;
  }

  function findDifficulty(t) {
    if (/\b(easy|basic|beginner|simple|foundation)\b/i.test(t)) return 'easy';
    if (/\b(moderate|medium|average|normal)\b/i.test(t)) return 'moderate';
    if (/\b(advanced|hard|tough|difficult|expert)\b/i.test(t)) return 'advanced';
    if (/\b(mixed|mix|varied|all levels)\b/i.test(t)) return 'mixed';
    return null;
  }

  function findClass(t) {
    var m = t.match(/\bclass\s*(\d{1,2})\b/i) || t.match(/\b(\d{1,2})\s*th\s*(?:class|standard|std)\b/i);
    if (m) {
      var n = parseInt(m[1], 10);
      if (n >= 6 && n <= 12) return n;
    }
    return null;
  }

  function findTopics(t, examId, subject) {
    var exam = D.examById(examId);
    var ids = (subject && exam.subjects[subject]) || [];
    var low = t.toLowerCase(), out = [];
    ids.forEach(function (id) {
      var nm = (D.TOPICS[id] && D.TOPICS[id].name || '').toLowerCase();
      if (!nm) return;
      var core = nm.split(/[(&,]/)[0].trim();
      if (core.length > 3 && low.indexOf(core) > -1) out.push(id);
    });
    return out;
  }

  function wantsWorksheet(t) {
    return /\b(worksheet|generate|create|make|give me|practice set|question set|questions on|practise|mock|test paper|paper)\b/i.test(t);
  }

  /* ============================ GUIDED FLOW ============================ */
  function examChips() {
    return D.EXAMS.map(function (e) { return { label: e.abbr, value: 'exam:' + e.id }; });
  }
  function levelChips(examId) {
    var e = D.examById(examId);
    return e.levels.map(function (l, i) { return { label: l, value: 'level:' + i }; });
  }
  function subjectChips(examId) {
    var e = D.examById(examId);
    return Object.keys(e.subjects).map(function (s) { return { label: s, value: 'subject:' + s }; });
  }
  function countChips() {
    return [10, 15, 20, 25, 30, 50].map(function (n) { return { label: n + ' questions', value: 'count:' + n }; });
  }
  function difficultyChips() {
    return [['Easy', 'easy'], ['Moderate', 'moderate'], ['Advanced', 'advanced'], ['Mixed', 'mixed']]
      .map(function (p) { return { label: p[0], value: 'difficulty:' + p[1] }; });
  }

  function startFlow(prefill) {
    state.mode = 'worksheet';
    state.draft = prefill || {};
    nextStep();
  }

  function summary() {
    var d = state.draft, e = D.examById(d.examId);
    var bits = ['<b>' + e.abbr + '</b>'];
    if (typeof d.levelIndex === 'number' && e.levels[d.levelIndex]) bits.push(e.levels[d.levelIndex]);
    if (d.subject) bits.push(d.subject);
    bits.push(d.count + ' questions');
    bits.push(C.render.diffLabel(d.difficulty || 'mixed'));
    if (d.topics && d.topics.length) bits.push(d.topics.map(D.topicName).join(', '));
    return bits.join(' · ');
  }

  function nextStep() {
    var d = state.draft;
    if (!d.examId) {
      state.step = 'exam';
      say('Which exam are you preparing for? Tap one below, or just type its name.').then(function () { quick(examChips()); });
      return;
    }
    if (typeof d.levelIndex !== 'number') {
      state.step = 'level';
      var e = D.examById(d.examId);
      say('Good — <b>' + e.abbr + '</b>. Which level should I pitch it at?').then(function () { quick(levelChips(d.examId)); });
      return;
    }
    if (!d.subject) {
      state.step = 'subject';
      say('Which subject?').then(function () { quick(subjectChips(d.examId)); });
      return;
    }
    if (!d.count) {
      state.step = 'count';
      say('How many questions do you want on the sheet?').then(function () { quick(countChips()); });
      return;
    }
    if (!d.difficulty) {
      state.step = 'difficulty';
      say('Last one — how hard should it be?').then(function () { quick(difficultyChips()); });
      return;
    }
    state.step = 'confirm';
    say('Here is the plan:<br><br>' + summary() + '<br><br>Shall I generate it?').then(function () {
      quick([
        { label: 'Generate it', value: 'go' },
        { label: 'Change subject', value: 'edit:subject', alt: true },
        { label: 'Change count', value: 'edit:count', alt: true },
        { label: 'Start over', value: 'reset', alt: true }
      ]);
    });
  }

  function doGenerate() {
    var d = state.draft;
    state.step = 'done';
    clearQuick();
    say('Building your worksheet…', 450).then(function () {
      var ok = C.app && C.app.applyChatConfig ? C.app.applyChatConfig({
        examId: d.examId,
        levelIndex: d.levelIndex,
        subject: d.subject,
        count: d.count,
        difficulty: d.difficulty || 'mixed',
        topics: d.topics || []
      }) : null;
      if (!ok) { say('Something went wrong while generating. Try the builder form on the page.'); return; }
      say('Done — your <b>' + ok.meta.count + '-question ' + C.render.esc(ok.meta.examAbbr) + ' ' + C.render.esc(ok.meta.subject) +
        '</b> worksheet is on the page (' + ok.meta.totalMarks + ' marks, ' + ok.meta.time + ' min). ' +
        'Use the Download button above it for PDF, HTML, TXT or CSV.').then(function () {
          quick([
            { label: 'Another set, same settings', value: 'again' },
            { label: 'New worksheet', value: 'reset', alt: true },
            { label: 'Ask a question instead', value: 'mode:ask', alt: true }
          ]);
        });
    });
  }

  /* =========================== OFFLINE BRAIN =========================== */
  function examFact(e) {
    return '<b>' + e.abbr + '</b> — ' + e.full + '.<br>' + e.blurb +
      '<br><br><b>Subjects:</b> ' + Object.keys(e.subjects).join(', ') +
      '<br><b>Marking:</b> +' + e.marks + (e.negative ? ' / −' + e.negative : ' with no negative marking') + ' per question.';
  }

  var KB = [
    {
      k: ['what can you do', 'help', 'who are you', 'what is cognify', 'how do you work'],
      a: 'I am the COGNIFY assistant. Two things I do well:<br><ul>' +
         '<li><b>Build worksheets</b> — tell me the exam, subject and how many questions, and the sheet appears on this page with an answer key, solutions and download options.</li>' +
         '<li><b>Answer prep questions</b> — pattern, subjects, marking scheme, strategy and time management for NIMCET, JEE, NEET, GATE, SSC, Banking, Railway, CAT, NDA, CUET and school classes 6–12.</li></ul>' +
         'Try: “20 moderate questions on probability for JEE” or “what is the NIMCET pattern?”.'
    },
    {
      k: ['negative marking', 'penalty', 'should i guess', 'guessing'],
      a: 'Negative marking punishes blind guessing, not informed attempts. With +4/−1 (JEE, NIMCET, NEET), a pure guess among four options has expected value (1×4 − 3×1)/4 = +0.25, so it is marginally positive — but eliminating even one option makes it clearly worth attempting. With +2/−0.5 (SSC) or +1/−0.25 (Banking) the ratio is the same 4:1, so the same logic holds. The real rule: attempt if you can eliminate at least one option, skip if you are choosing at random under time pressure.'
    },
    {
      k: ['time management', 'how much time', 'pace', 'speed'],
      a: 'Pace per question, by exam:<br><ul><li><b>SSC CGL Tier-I</b> — 100 Q in 60 min ≈ 36 seconds each.</li><li><b>Banking Prelims</b> — 100 Q in 60 min with sectional timing ≈ 36 seconds each.</li><li><b>NIMCET</b> — 120 Q in 120 min = 1 minute each.</li><li><b>JEE Main</b> — 75 Q in 180 min ≈ 2.4 minutes each.</li><li><b>GATE</b> — 65 Q in 180 min ≈ 2.8 minutes each.</li><li><b>CAT</b> — 22 Q per 40-minute section ≈ 1.8 minutes each.</li></ul>Practise at that pace, not at a comfortable one. Set the time limit in the builder to match.'
    },
    {
      k: ['how to prepare', 'strategy', 'study plan', 'how to study', 'preparation tips', 'tips'],
      a: 'A plan that works for most competitive exams:<br><ul>' +
         '<li><b>Diagnose first.</b> Generate one 20-question mixed sheet per subject. Your accuracy tells you where the marks are hiding.</li>' +
         '<li><b>Two weak topics a week.</b> Theory on day 1, a 10-question easy sheet on day 2, a 15-question moderate sheet on day 4, an advanced sheet on day 7.</li>' +
         '<li><b>Keep an error log.</b> Topic, the mistake, the correct route. Re-generate that topic a week later.</li>' +
         '<li><b>One full-length mock a week</b>, same time of day as the real exam.</li>' +
         '<li><b>Revise by retrieval</b>, not by re-reading. A generated sheet beats a formula list.</li></ul>'
    },
    {
      k: ['revision', 'last minute', 'night before', 'one day before'],
      a: 'The night before an exam: no new topics. Do one short, easy sheet (10–15 questions) to warm up the pattern recognition, skim your error log and formula sheet, then sleep. Fatigue costs more marks than one extra chapter earns.'
    },
    {
      k: ['which subject', 'weightage', 'most important subject', 'scoring'],
      a: 'Highest-leverage sections by exam:<br><ul><li><b>NIMCET</b> — Mathematics is 50 of 120 questions. Nothing else comes close.</li><li><b>JEE Main</b> — equal weight, but Chemistry is the fastest to secure.</li><li><b>NEET</b> — Biology is 90 of 180 questions.</li><li><b>GATE</b> — the 2-mark questions decide the rank; accuracy beats coverage.</li><li><b>SSC</b> — General Awareness is the quickest section; it buys time for Quant.</li><li><b>Banking</b> — Reasoning and Quant decide the prelims; Awareness decides the mains.</li><li><b>CAT</b> — sectional cut-offs mean you cannot ignore your weakest of the three.</li></ul>'
    },
    {
      k: ['download', 'pdf', 'print', 'save worksheet', 'export'],
      a: 'Generate a sheet, then use the <b>Download</b> menu above it. “PDF / Print” opens the browser print dialog — pick “Save as PDF”. You can also export a styled standalone HTML page, plain text, a CSV of all questions with answers, or just the answer key as a separate file.'
    },
    {
      k: ['answer key', 'solutions', 'hide answers'],
      a: 'Both are on by default. Turn off “Include answer key” or “Include solutions” in the builder before generating, or use the <b>Hide answer key</b> button above the sheet while you attempt it. There is also a key-only export in the Download menu.'
    },
    {
      k: ['topics', 'chapters', 'syllabus'],
      a: 'Pick an exam and subject in the builder and the topic chips appear underneath — tick as many as you want, or leave them all untouched to mix the whole subject. Tell me a topic directly too: “15 questions on time and work for SSC”.'
    },
    {
      k: ['api key', 'claude', 'real ai', 'llm', 'connect ai'],
      a: 'The gear icon at the top of this window lets you paste an Anthropic API key. That upgrades <b>Ask anything</b> from my built-in offline brain to a full Claude model. The key is stored only in this browser and is sent only to the model provider. Everything else — worksheet generation included — works without it.'
    },
    {
      k: ['free', 'cost', 'price', 'sign up', 'account', 'login'],
      a: 'There is no account, no sign-up and no cost. Everything runs in your browser — you can even open the folder offline and it still generates worksheets.'
    },
    {
      k: ['repeat', 'same questions', 'unique'],
      a: 'Numeric and reasoning questions are composed fresh each time with new values, so the same settings practically never produce the same paper. Conceptual pools (awareness, English, theory) are sampled without repetition within a single sheet. Hit “New set, same settings” for another one.'
    },
    {
      k: ['thank', 'thanks', 'great', 'awesome', 'nice', 'cool'],
      a: 'Glad it helped. Want another worksheet, or shall I answer something else?'
    },
    {
      k: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'],
      a: 'Hello. Ask me about any exam on this page, or say “make me a worksheet” and I will build one.'
    }
  ];

  function brainAnswer(text) {
    var t = text.toLowerCase().trim();

    // exam-specific question
    var ex = findExam(t);
    if (ex && /\b(pattern|syllabus|subject|marking|about|what is|tell me|detail|exam|marks|structure)\b/i.test(t)) {
      return examFact(D.examById(ex));
    }

    // keyword knowledge base, scored by longest match
    var best = null, score = 0;
    KB.forEach(function (entry) {
      entry.k.forEach(function (key) {
        if (t.indexOf(key) > -1 && key.length > score) { best = entry; score = key.length; }
      });
    });
    if (best) return best.a;

    if (ex) return examFact(D.examById(ex));

    // topic mentioned?
    var low = ' ' + t + ' ';
    for (var id in D.TOPICS) {
      var nm = D.TOPICS[id].name.toLowerCase().split(/[(&,]/)[0].trim();
      if (nm.length > 4 && low.indexOf(nm) > -1) {
        return 'I can build you a sheet on <b>' + C.render.esc(D.TOPICS[id].name) + '</b>. Tell me the exam and how many questions — for example “20 questions on ' +
          C.render.esc(nm) + ' for SSC” — or tap below.';
      }
    }

    return 'I did not quite catch that. I am strongest on three things: <b>building worksheets</b>, <b>exam patterns and syllabus</b>, and <b>preparation strategy</b>. ' +
      'Try “what is the GATE pattern?”, “how should I pace SSC?”, or “give me 20 moderate reasoning questions for banking”. ' +
      'For open-ended conversation, add an API key via the gear icon.';
  }

  /* ============================== REAL AI ============================== */
  function apiKey() { try { return localStorage.getItem(LS_KEY) || ''; } catch (e) { return ''; } }
  function apiModel() { try { return localStorage.getItem(LS_MODEL) || 'claude-sonnet-5'; } catch (e) { return 'claude-sonnet-5'; } }

  var SYSTEM_PROMPT =
    'You are the study assistant inside COGNIFY, a browser app that generates practice worksheets for Indian competitive exams ' +
    '(NIMCET, JEE Main, NEET, GATE, SSC, Banking/IBPS, Railway/RRB, CAT, NDA, CUET) and school classes 6 to 12. ' +
    'Help students with syllabus, exam pattern, marking schemes, topic doubts, worked solutions and study planning. ' +
    'Be concise and concrete — short paragraphs or tight bullet lists, no filler. Use plain text with simple HTML tags ' +
    '(<b>, <br>, <ul>, <li>) only; never use markdown. If the student wants practice questions, tell them to say something like ' +
    '"20 moderate questions on probability for JEE" and the app will generate the worksheet for them.';

  function askAPI(text) {
    var key = apiKey();
    state.history.push({ role: 'user', content: text });
    if (state.history.length > 16) state.history = state.history.slice(-16);

    var t = typing();
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: apiModel(),
        max_tokens: 900,
        system: SYSTEM_PROMPT,
        messages: state.history
      })
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, j: j }; });
    }).then(function (res) {
      t.remove();
      if (!res.ok) {
        var msg = (res.j && res.j.error && res.j.error.message) || 'the request was rejected';
        bubble('bot', 'The model call failed — ' + C.render.esc(msg) +
          '.<br><br>Falling back to my built-in brain:<br><br>' + brainAnswer(text));
        return;
      }
      var out = '';
      (res.j.content || []).forEach(function (b) { if (b.type === 'text') out += b.text; });
      out = out.trim() || 'No reply came back.';
      state.history.push({ role: 'assistant', content: out });
      bubble('bot', out.replace(/\n/g, '<br>'));
    }).catch(function (err) {
      t.remove();
      bubble('bot', 'Could not reach the model (' + C.render.esc(err.message || 'network error') +
        ').<br><br>Here is what I know offline:<br><br>' + brainAnswer(text));
    });
  }

  /* ============================== ROUTER ============================== */
  function handle(raw, chip) {
    var text = String(raw || '').trim();
    if (!text) return;

    /* ---- chip commands ---- */
    if (text === 'reset') { resetConversation(); return; }
    if (text === 'again') {
      if (C.app && C.app.regenerate) {
        var ws = C.app.regenerate();
        say('Fresh set generated — ' + (ws ? ws.meta.count + ' new questions' : 'done') + '. Scroll up to the sheet.');
      }
      return;
    }
    if (text.indexOf('mode:') === 0) { setMode(text.slice(5)); return; }
    if (text === 'go') { doGenerate(); return; }
    if (text.indexOf('edit:') === 0) {
      var f = text.slice(5);
      delete state.draft[f === 'count' ? 'count' : f];
      if (f === 'subject') { delete state.draft.topics; }
      nextStep(); return;
    }
    if (text.indexOf('exam:') === 0) {
      state.draft.examId = text.slice(5);
      var e0 = D.examById(state.draft.examId);
      if (state.draft.subject && !e0.subjects[state.draft.subject]) delete state.draft.subject;
      nextStep(); return;
    }
    if (text.indexOf('level:') === 0) { state.draft.levelIndex = parseInt(text.slice(6), 10); nextStep(); return; }
    if (text.indexOf('subject:') === 0) { state.draft.subject = text.slice(8); nextStep(); return; }
    if (text.indexOf('count:') === 0) { state.draft.count = parseInt(text.slice(6), 10); nextStep(); return; }
    if (text.indexOf('difficulty:') === 0) { state.draft.difficulty = text.slice(11); nextStep(); return; }

    /* ---- free text ---- */
    if (state.mode === 'ask') {
      if (wantsWorksheet(text) && (findExam(text) || findCount(text))) {
        setMode('worksheet', true);
        return absorbAndContinue(text);
      }
      if (apiKey()) { askAPI(text); return; }
      say(brainAnswer(text)).then(function () {
        if (state.step === 'idle') quick([{ label: 'Build me a worksheet', value: 'mode:worksheet' }]);
      });
      return;
    }

    absorbAndContinue(text);
  }

  function absorbAndContinue(text) {
    var d = state.draft, got = false;

    var ex = findExam(text);
    if (ex && (state.step === 'exam' || state.step === 'idle' || !d.examId || wantsWorksheet(text))) {
      if (d.examId !== ex) { d.examId = ex; delete d.subject; delete d.topics; }
      got = true;
    }

    var cls = findClass(text);
    if (cls) {
      d.examId = d.examId || 'school';
      if (d.examId === 'school') { d.levelIndex = cls - 6; got = true; }
    }

    if (d.examId) {
      var sub = findSubject(text, d.examId);
      if (sub) { d.subject = sub; got = true; }
      if (d.subject) {
        var tps = findTopics(text, d.examId, d.subject);
        if (tps.length) { d.topics = tps; got = true; }
      }
    }

    var cnt = findCount(text);
    if (cnt) { d.count = cnt; got = true; }

    var diff = findDifficulty(text);
    if (diff) { d.difficulty = diff; got = true; }

    if (state.step === 'level' && typeof d.levelIndex !== 'number') {
      var e = D.examById(d.examId), low = text.toLowerCase();
      for (var i = 0; i < e.levels.length; i++) {
        if (low.indexOf(e.levels[i].toLowerCase()) > -1) { d.levelIndex = i; got = true; break; }
      }
      if (typeof d.levelIndex !== 'number' && /^\s*\d\s*$/.test(text)) {
        var n = parseInt(text, 10) - 1;
        if (n >= 0 && n < e.levels.length) { d.levelIndex = n; got = true; }
      }
    }

    if (state.step === 'confirm' && /\b(yes|yeah|yep|ok|okay|sure|go|do it|generate)\b/i.test(text)) { doGenerate(); return; }
    if (/\b(start over|restart|reset|clear)\b/i.test(text)) { resetConversation(); return; }

    if (!got) {
      if (state.step === 'idle' || state.step === 'done') {
        say(brainAnswer(text)).then(function () {
          quick([{ label: 'Build me a worksheet', value: 'mode:worksheet' }, { label: 'Ask something else', value: 'mode:ask', alt: true }]);
        });
        return;
      }
      say('I did not catch that one — tap an option below, or type it in plain words.').then(function () { repeatStep(); });
      return;
    }

    if (typeof d.levelIndex !== 'number' && d.examId) {
      var ee = D.examById(d.examId);
      if (d.subject && d.count) d.levelIndex = ee.defaultLevel;   // enough context, don't nag
    }

    nextStep();
  }

  function repeatStep() {
    if (state.step === 'exam') quick(examChips());
    else if (state.step === 'level') quick(levelChips(state.draft.examId));
    else if (state.step === 'subject') quick(subjectChips(state.draft.examId));
    else if (state.step === 'count') quick(countChips());
    else if (state.step === 'difficulty') quick(difficultyChips());
  }

  /* ============================== MODES ============================== */
  function setMode(mode, silent) {
    state.mode = mode;
    Array.prototype.forEach.call(el.tabs.children, function (b) {
      var on = b.getAttribute('data-mode') === mode;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (silent) return;
    clearQuick();
    if (mode === 'worksheet') {
      state.step = 'idle';
      state.draft = {};
      say('Let’s build a worksheet. Which exam are you preparing for?').then(function () {
        state.step = 'exam';
        quick(examChips());
      });
    } else {
      state.step = 'idle';
      var hasKey = !!apiKey();
      say('Ask me anything about exam patterns, syllabus, marking or strategy.' +
        (hasKey ? ' A Claude model is connected, so open-ended questions work too.' : '')).then(function () {
          quick([
            { label: 'NIMCET pattern', value: 'What is the NIMCET pattern?' },
            { label: 'How should I pace SSC?', value: 'time management for ssc' },
            { label: 'Is guessing worth it?', value: 'negative marking' },
            { label: 'Give me a study plan', value: 'how to prepare' },
            { label: 'Build a worksheet', value: 'mode:worksheet', alt: true }
          ]);
        });
    }
  }

  function resetConversation() {
    state.draft = {};
    state.step = 'idle';
    state.history = [];
    el.body.innerHTML = '';
    clearQuick();
    greet();
  }

  function greet() {
    bubble('bot', 'Hi, I am the <b>COGNIFY assistant</b>. I can build an exam-ready worksheet for you in about four taps, or answer questions about any exam on this page.');
    setTimeout(function () {
      quick([
        { label: 'Make me a worksheet', value: 'mode:worksheet' },
        { label: 'Ask about an exam', value: 'mode:ask', alt: true }
      ]);
    }, 500);
  }

  /* ============================ API KEY UI ============================ */
  function refreshKeyNote() {
    var k = apiKey();
    el.keyNote.textContent = k
      ? 'Key saved in this browser (' + k.slice(0, 7) + '…' + k.slice(-4) + '). Ask anything now runs on ' + apiModel() + '.'
      : 'No key saved — running the built-in assistant.';
    el.status.textContent = k ? 'Online · ' + apiModel() : 'Online · offline-smart mode';
    if (el.modelSel) el.modelSel.value = apiModel();
  }

  /* ============================== PUBLIC ============================== */
  function open(prefill) {
    el.win.hidden = false;
    el.launcher.classList.add('open');
    el.nudge.classList.add('hide');
    if (!el.body.children.length) greet();
    setTimeout(function () { el.input.focus(); scrollDown(); }, 60);
    if (prefill) { setMode('worksheet', true); startFlow(prefill); }
  }
  function close() {
    el.win.hidden = true;
    el.launcher.classList.remove('open');
  }
  function toggle() { if (el.win.hidden) open(); else close(); }

  function init() {
    el.launcher = $('chatLauncher');
    el.win = $('chatWindow');
    el.body = $('chatBody');
    el.quick = $('chatQuick');
    el.input = $('chatInput');
    el.form = $('chatForm');
    el.tabs = document.querySelector('.chat-tabs');
    el.nudge = $('chatNudge');
    el.status = $('chatStatus');
    el.settings = $('chatSettingsPanel');
    el.keyInput = $('aiKeyInput');
    el.keyNote = $('aiKeyNote');
    el.modelSel = $('aiModel');
    if (!el.launcher || !el.win) return;

    el.launcher.addEventListener('click', toggle);
    el.launcher.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    $('chatClose').addEventListener('click', close);
    $('chatReset').addEventListener('click', resetConversation);
    $('chatSettings').addEventListener('click', function () {
      el.settings.hidden = !el.settings.hidden;
      if (!el.settings.hidden) refreshKeyNote();
    });

    el.tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mode]');
      if (b) setMode(b.getAttribute('data-mode'));
    });

    el.form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = el.input.value.trim();
      if (!v) return;
      el.input.value = '';
      clearQuick();
      me(v);
      handle(v);
    });

    $('aiKeySave').addEventListener('click', function () {
      var v = el.keyInput.value.trim();
      if (!v) { C.app && C.app.toast('Paste a key first'); return; }
      try {
        localStorage.setItem(LS_KEY, v);
        localStorage.setItem(LS_MODEL, el.modelSel.value);
      } catch (err) { /* private mode */ }
      el.keyInput.value = '';
      refreshKeyNote();
      C.app && C.app.toast('AI key saved to this browser');
    });
    $('aiKeyClear').addEventListener('click', function () {
      try { localStorage.removeItem(LS_KEY); } catch (err) {}
      refreshKeyNote();
      C.app && C.app.toast('AI key removed');
    });
    el.modelSel.addEventListener('change', function () {
      try { localStorage.setItem(LS_MODEL, el.modelSel.value); } catch (err) {}
      refreshKeyNote();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !el.win.hidden) close();
    });

    refreshKeyNote();

    // retire the nudge after a while
    setTimeout(function () { if (el.win.hidden) el.nudge.classList.add('hide'); }, 11000);
  }

  C.chat = {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
    openSettings: function () { open(); el.settings.hidden = false; refreshKeyNote(); },
    startWorksheet: function (prefill) { open(); setMode('worksheet', true); clearQuick(); state.draft = prefill || {}; state.step = 'idle'; nextStep(); }
  };
})(window);

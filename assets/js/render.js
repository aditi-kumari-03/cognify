/* ==========================================================================
   COGNIFY · render.js
   Paints a worksheet object onto the page and exports it.
   ========================================================================== */
(function (w) {
  'use strict';
  var C = (w.COGNIFY = w.COGNIFY || {});
  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escLines(s) { return esc(s).replace(/\n/g, '<br>'); }

  function dateStr(d) {
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }
  function timeStr(d) {
    var h = d.getHours(), mm = d.getMinutes();
    var ap = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + ':' + (mm < 10 ? '0' + mm : mm) + ' ' + ap;
  }
  function diffLabel(k) {
    return { easy: 'Easy', moderate: 'Moderate', advanced: 'Advanced', mixed: 'Mixed' }[k] || 'Mixed';
  }

  var LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="3"/>' +
    '<path d="M31 16.5a11 11 0 1 0 0 15" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="33" cy="24" r="3.4" fill="currentColor"/></svg>';

  /* ------------------------------------------------------------------
     HTML for the on-page worksheet
     ------------------------------------------------------------------ */
  function worksheetHTML(ws, opts) {
    opts = opts || {};
    var m = ws.meta, h = [];

    h.push('<div class="ws-head">');
    h.push('<div class="ws-brand"><div class="ws-logo">' + LOGO + '<span>COGNIFY</span></div>');
    h.push('<div class="ws-stamp">' + esc(m.setCode) + '<br>' + esc(dateStr(m.generatedAt)) + ' · ' + esc(timeStr(m.generatedAt)) + '</div></div>');
    h.push('<h2 class="ws-title">' + esc(m.title) + '</h2>');
    h.push('<p class="ws-sub">' + esc(m.examFull) + (m.level ? ' · ' + esc(m.level) : '') + '</p>');
    h.push('<div class="ws-metabar">');
    h.push('<span>Subject: <b>' + esc(m.subject) + '</b></span>');
    h.push('<span>Questions: <b>' + m.count + '</b></span>');
    h.push('<span>Max marks: <b>' + m.totalMarks + '</b></span>');
    h.push('<span>Time: <b>' + m.time + ' min</b></span>');
    h.push('<span>Level: <b>' + esc(diffLabel(m.difficulty)) + '</b></span>');
    if (m.showNegative && m.negative) h.push('<span>Negative: <b>−' + m.negative + '</b></span>');
    h.push('</div>');
    h.push('<div class="ws-fill"><span>Name: <i></i></span><span>Class/Batch: <i></i></span><span>Date: <i></i></span><span>Score: <i></i></span></div>');
    h.push('</div>');

    h.push('<div class="ws-instructions"><h5>Instructions</h5><ol>');
    h.push('<li>All questions are compulsory and carry <b>' + m.marksPerQ + '</b> mark(s) each.</li>');
    if (m.showNegative && m.negative) h.push('<li><b>' + m.negative + '</b> mark(s) will be deducted for every incorrect response.</li>');
    h.push('<li>Choose the single most appropriate option for each question.</li>');
    h.push('<li>Attempt the paper in <b>' + m.time + ' minutes</b> without referring to the answer key.</li>');
    h.push('<li>Use of a calculator is not permitted unless your exam allows it.</li>');
    h.push('</ol></div>');

    h.push('<div class="ws-section-title">Section A — Objective Questions (' + m.count + ' × ' + m.marksPerQ + ' = ' + m.totalMarks + ' marks)</div>');

    ws.questions.forEach(function (q, i) {
      h.push('<div class="ws-q">');
      h.push('<div class="ws-q-text"><span class="ws-q-num">' + (i + 1) + '.</span><span>' + escLines(q.q) +
        '<span class="ws-q-topic">' + esc(q.topicName || '') + '</span></span></div>');
      h.push('<div class="ws-opts">');
      q.options.forEach(function (o, j) {
        h.push('<div class="ws-opt"><b>(' + LETTERS[j] + ')</b><span>' + escLines(o) + '</span></div>');
      });
      h.push('</div>');
      if (opts.workspace) h.push('<div class="ws-workspace"></div>');
      h.push('</div>');
    });

    if (m.includeKey || m.includeSolutions) {
      h.push('<div class="ws-keyblock' + (opts.keyHidden ? ' hidden' : '') + '" id="wsKeyBlock">');
      if (m.includeKey) {
        h.push('<div class="ws-section-title">Answer Key</div><div class="ws-key-grid">');
        ws.questions.forEach(function (q, i) {
          h.push('<div>' + (i + 1) + '. <b>' + LETTERS[q.answer] + '</b></div>');
        });
        h.push('</div>');
      }
      if (m.includeSolutions) {
        h.push('<div class="ws-section-title">Solutions</div>');
        ws.questions.forEach(function (q, i) {
          h.push('<div class="ws-sol"><b>' + (i + 1) + '. (' + LETTERS[q.answer] + ') ' + escLines(q.options[q.answer]) + '</b>' +
            (q.solution ? ' — ' + escLines(q.solution) : '') + '</div>');
        });
      }
      h.push('</div>');
    }

    h.push('<div class="ws-foot"><span>Generated by COGNIFY · ' + esc(m.examAbbr) + ' · ' + esc(m.setCode) + '</span>' +
      '<span>Cross-check with your official syllabus.</span></div>');

    return h.join('');
  }

  /* ------------------------------------------------------------------
     TEXT / CSV exports
     ------------------------------------------------------------------ */
  function toText(ws, keyOnly) {
    var m = ws.meta, L = [];
    L.push('COGNIFY — ' + m.title);
    L.push('='.repeat(Math.min(72, m.title.length + 11)));
    L.push(m.examFull + (m.level ? ' | ' + m.level : ''));
    L.push('Subject: ' + m.subject + ' | Questions: ' + m.count + ' | Max marks: ' + m.totalMarks +
      ' | Time: ' + m.time + ' min | Level: ' + diffLabel(m.difficulty));
    if (m.showNegative && m.negative) L.push('Negative marking: -' + m.negative + ' per wrong answer');
    L.push(m.setCode + ' | Generated ' + dateStr(m.generatedAt) + ' ' + timeStr(m.generatedAt));
    L.push('');
    L.push('Name: ______________________   Class: ____________   Date: ____________   Score: ________');
    L.push('');

    if (!keyOnly) {
      L.push('--- SECTION A : OBJECTIVE QUESTIONS ---');
      L.push('');
      ws.questions.forEach(function (q, i) {
        L.push((i + 1) + '. ' + String(q.q).replace(/\n/g, '\n    ') + '   [' + (q.topicName || '') + ']');
        q.options.forEach(function (o, j) { L.push('    (' + LETTERS[j] + ') ' + o); });
        L.push('');
      });
    }

    if (m.includeKey || keyOnly) {
      L.push('--- ANSWER KEY ---');
      var row = [];
      ws.questions.forEach(function (q, i) {
        row.push((i + 1) + '-' + LETTERS[q.answer]);
        if (row.length === 10) { L.push('  ' + row.join('   ')); row = []; }
      });
      if (row.length) L.push('  ' + row.join('   '));
      L.push('');
    }
    if (m.includeSolutions || keyOnly) {
      L.push('--- SOLUTIONS ---');
      ws.questions.forEach(function (q, i) {
        L.push((i + 1) + '. (' + LETTERS[q.answer] + ') ' + q.options[q.answer] + (q.solution ? ' — ' + q.solution : ''));
      });
      L.push('');
    }
    L.push('Generated by COGNIFY. Cross-check with your official syllabus.');
    return L.join('\n');
  }

  function csvCell(v) {
    v = String(v === undefined || v === null ? '' : v).replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return '"' + v + '"';
  }
  function toCSV(ws) {
    var rows = [['No', 'Topic', 'Difficulty', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Answer', 'Solution']];
    ws.questions.forEach(function (q, i) {
      rows.push([i + 1, q.topicName || '', q.difficulty || '', q.q,
        q.options[0] || '', q.options[1] || '', q.options[2] || '', q.options[3] || '',
        LETTERS[q.answer], q.solution || '']);
    });
    return rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
  }

  /* self-contained HTML file */
  function toStandaloneHTML(ws) {
    var css = [
      'body{font-family:"Segoe UI",system-ui,sans-serif;color:#15282c;background:#E3FDFD;margin:0;padding:24px;line-height:1.6}',
      '.sheet{background:#fff;max-width:860px;margin:0 auto;padding:40px;border-radius:14px;box-shadow:0 20px 50px -24px rgba(29,63,69,.4)}',
      '.ws-head{border-bottom:3px double #71C9CE;padding-bottom:16px;margin-bottom:20px}',
      '.ws-brand{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:12px}',
      '.ws-logo{display:flex;align-items:center;gap:8px;font-weight:700;letter-spacing:.1em;color:#36858B}',
      '.ws-logo svg{width:26px;height:26px}',
      '.ws-stamp{font-size:11px;font-weight:700;color:#6E8B8F;text-align:right}',
      '.ws-title{text-align:center;font-size:24px;margin:0 0 6px}',
      '.ws-sub{text-align:center;font-size:13px;color:#44686D;margin:0 0 14px}',
      '.ws-metabar{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}',
      '.ws-metabar span{font-size:11.5px;font-weight:700;background:#E3FDFD;border:1px solid rgba(113,201,206,.3);padding:4px 10px;border-radius:999px;color:#44686D}',
      '.ws-fill{display:flex;flex-wrap:wrap;gap:22px;margin-top:14px;font-size:12.5px;font-weight:600;color:#44686D}',
      '.ws-fill i{display:inline-block;border-bottom:1px dotted #6E8B8F;min-width:130px}',
      '.ws-instructions{background:#F8E8EE;border-left:4px solid #F2BED1;padding:14px 16px;margin-bottom:22px;border-radius:0 8px 8px 0}',
      '.ws-instructions h5{margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#B9697F}',
      '.ws-instructions ol{padding-left:18px;font-size:12.5px;color:#44686D;margin:0}',
      '.ws-section-title{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#36858B;margin:26px 0 14px;padding-bottom:5px;border-bottom:1.5px solid #A6E3E9}',
      '.ws-q{margin-bottom:18px;page-break-inside:avoid}',
      '.ws-q-text{display:flex;gap:10px;font-size:14px;font-weight:600;margin-bottom:7px}',
      '.ws-q-num{min-width:26px;font-weight:800;color:#36858B}',
      '.ws-q-topic{display:inline-block;font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6E8B8F;background:#E3FDFD;border-radius:999px;padding:2px 7px;margin-left:7px}',
      '.ws-opts{display:grid;grid-template-columns:1fr 1fr;gap:5px 14px;padding-left:36px}',
      '.ws-opt{display:flex;gap:7px;font-size:13px;color:#44686D}',
      '.ws-opt b{color:#15282c}',
      '.ws-keyblock{margin-top:34px;padding-top:20px;border-top:3px double #71C9CE;page-break-before:always}',
      '.ws-key-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:6px;margin-bottom:22px}',
      '.ws-key-grid div{background:#E3FDFD;border:1px solid rgba(113,201,206,.25);border-radius:7px;padding:5px 3px;text-align:center;font-size:12.5px;font-weight:700}',
      '.ws-key-grid b{color:#36858B}',
      '.ws-sol{font-size:12.5px;margin-bottom:10px;color:#44686D;page-break-inside:avoid}',
      '.ws-sol b{color:#15282c}',
      '.ws-foot{margin-top:28px;padding-top:12px;border-top:1px dashed rgba(113,201,206,.4);display:flex;justify-content:space-between;font-size:10.5px;color:#6E8B8F;font-weight:600;gap:10px;flex-wrap:wrap}',
      '@media print{body{background:#fff;padding:0}.sheet{box-shadow:none;max-width:none;padding:0;border-radius:0}@page{size:A4;margin:14mm}}'
    ].join('');
    return '<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + esc(ws.meta.title) + ' · COGNIFY</title><style>' + css + '</style></head>' +
      '<body><div class="sheet">' + worksheetHTML(ws, {}) + '</div></body></html>';
  }

  /* ------------------------------------------------------------------
     download helpers
     ------------------------------------------------------------------ */
  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'worksheet';
  }
  function download(filename, content, mime) {
    var blob = new Blob([content], { type: mime + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
  }

  function exportAs(kind, ws) {
    if (!ws) return false;
    var name = slug(ws.meta.examAbbr + '-' + ws.meta.subject + '-' + ws.meta.setCode);
    if (kind === 'pdf') { window.print(); return true; }
    if (kind === 'html') { download(name + '.html', toStandaloneHTML(ws), 'text/html'); return true; }
    if (kind === 'txt') { download(name + '.txt', toText(ws, false), 'text/plain'); return true; }
    if (kind === 'csv') { download(name + '.csv', '﻿' + toCSV(ws), 'text/csv'); return true; }
    if (kind === 'key') { download(name + '-answer-key.txt', toText(ws, true), 'text/plain'); return true; }
    return false;
  }

  C.render = {
    worksheetHTML: worksheetHTML,
    toText: toText,
    toCSV: toCSV,
    toStandaloneHTML: toStandaloneHTML,
    exportAs: exportAs,
    download: download,
    letters: LETTERS,
    diffLabel: diffLabel,
    esc: esc
  };
})(window);

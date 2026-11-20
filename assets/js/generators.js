/* ==========================================================================
   COGNIFY · generators.js
   Procedural question engines. Each engine takes a difficulty level
   (1 = easy, 2 = moderate, 3 = advanced) and returns:
     { q, options:[4 strings], answer:<index into options>, solution, difficulty }
   The correct option is always produced at index 0; engine.js shuffles.
   ========================================================================== */
(function (w) {
  'use strict';
  var C = (w.COGNIFY = w.COGNIFY || {});

  /* ----------------------------- helpers ----------------------------- */
  function R(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function N(v) {
    if (v === null || v === undefined || !isFinite(v)) return '—';
    var r = Math.round(v * 1000) / 1000;
    if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
    r = Math.round(v * 100) / 100;
    return String(r);
  }
  function U(v, u) {
    if (!u) return N(v);
    if (u === '₹') return '₹' + N(v);                 // currency sits in front
    if (u === '%' || u === '°') return N(v) + u;      // these bind tight
    return N(v) + ' ' + u;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function nCr(n, r) { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); var num = 1; for (var i = 1; i <= r; i++) num = num * (n - r + i) / i; return Math.round(num); }
  function nPr(n, r) { var x = 1; for (var i = 0; i < r; i++) x *= (n - i); return x; }
  function frac(n, d) { var g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + '/' + d; }

  /* numeric distractors around a correct value */
  function distract(v, unit, allowNeg) {
    var mag = Math.abs(v);
    var step = mag > 40 ? Math.max(1, Math.round(mag * 0.12))
             : mag >= 4 ? Math.max(1, Math.round(mag * 0.2))
             : mag > 0 ? Math.max(0.1, Math.round(mag * 25) / 100) : 1;
    var cands = [v + step, v - step, v + 2 * step, v - 2 * step, v * 2, v / 2,
                 v * 1.5, v * 0.8, v + 3 * step, v - 3 * step, v + step / 2];
    var seen = {}, out = [];
    seen[N(v)] = 1;
    for (var i = 0; i < cands.length && out.length < 3; i++) {
      var c = cands[i];
      if (!isFinite(c)) continue;
      if (!allowNeg && v > 0 && c <= 0) continue;
      var k = N(c);
      if (seen[k]) continue;
      seen[k] = 1; out.push(U(c, unit));
    }
    var extra = 4;
    while (out.length < 3) { var c2 = v + extra * step; if (!seen[N(c2)]) { seen[N(c2)] = 1; out.push(U(c2, unit)); } extra++; }
    return out;
  }

  /* build a numeric question */
  function numQ(text, value, unit, sol, diff, allowNeg) {
    return { q: text, options: [U(value, unit)].concat(distract(value, unit, allowNeg)), answer: 0, solution: sol, difficulty: diff || 2 };
  }
  /* last-resort options — standard in Indian objective papers */
  var FILLERS = ['None of these', 'Cannot be determined', 'Data inadequate', 'All of the above'];

  /* build a question with explicit wrong options */
  function mk(text, correct, wrongs, sol, diff) {
    var seen = {}, out = [], i;
    correct = String(correct);
    seen[correct] = 1;
    for (i = 0; i < wrongs.length && out.length < 3; i++) {
      var ww = String(wrongs[i]);
      if (!seen[ww]) { seen[ww] = 1; out.push(ww); }
    }
    for (i = 0; i < FILLERS.length && out.length < 3; i++) {
      if (!seen[FILLERS[i]]) { seen[FILLERS[i]] = 1; out.push(FILLERS[i]); }
    }
    return { q: text, options: [correct].concat(out), answer: 0, solution: sol, difficulty: diff || 2 };
  }

  /* pretty-print a 3D vector with correct signs */
  function vec(x, y, z) {
    function part(v, u, first) {
      var s = v < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ');
      return s + Math.abs(v) + u;
    }
    return part(x, 'î', true) + part(y, 'ĵ', false) + part(z, 'k̂', false);
  }

  var NAMES = ['Ravi', 'Priya', 'Arjun', 'Neha', 'Rahul', 'Ananya', 'Vikram', 'Kavya', 'Rohit', 'Meera', 'Sanjay', 'Divya', 'Aditya', 'Pooja'];
  var ITEMS = ['a watch', 'a chair', 'a bicycle', 'a mobile phone', 'a book', 'a table', 'a laptop', 'a shirt'];

  /* ======================================================================
     QUANTITATIVE APTITUDE
     ====================================================================== */
  var G = {};

  G.simplification = function (d) {
    if (d === 1) {
      var a = R(12, 40), b = R(3, 9), c = R(2, 9), e = R(5, 25);
      var v = a + b * c - e;
      return numQ('Simplify: ' + a + ' + ' + b + ' × ' + c + ' − ' + e, v, '',
        'BODMAS: multiply first → ' + b + ' × ' + c + ' = ' + (b * c) + '. Then ' + a + ' + ' + (b * c) + ' − ' + e + ' = ' + v + '.', 1, true);
    }
    if (d === 2) {
      var p = R(2, 9), q = R(2, 9), r = R(2, 6), s = R(10, 40);
      var v2 = (p + q) * r + s;
      return numQ('Simplify: (' + p + ' + ' + q + ') × ' + r + ' + ' + s, v2, '',
        'Brackets first: ' + (p + q) + ' × ' + r + ' = ' + ((p + q) * r) + ', then + ' + s + ' = ' + v2 + '.', 2, true);
    }
    var x = R(3, 9) * 4, y = R(2, 6), z = R(10, 30) * 2;
    var v3 = Math.round((x / y + z * 0.5) * 100) / 100;
    return numQ('Simplify: ' + x + ' ÷ ' + y + ' + 50% of ' + z, v3, '',
      x + ' ÷ ' + y + ' = ' + N(x / y) + ' and 50% of ' + z + ' = ' + N(z * 0.5) + '. Sum = ' + N(v3) + '.', 3, true);
  };

  G.numsys = function (d) {
    var t = d === 1 ? 1 : R(1, 3);
    if (t === 1) {
      var m = R(6, 13), rem = R(1, m - 1), num = R(20, 90) * m + rem;
      return numQ('Find the remainder when ' + num + ' is divided by ' + m + '.', rem, '',
        num + ' = ' + m + ' × ' + Math.floor(num / m) + ' + ' + rem + ', so the remainder is ' + rem + '.', 1);
    }
    if (t === 2) {
      var base = R(2, 9), exp = R(10, 40);
      var cyc = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 4: [4, 6], 5: [5], 6: [6], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6], 9: [9, 1] }[base] || [base];
      var u = cyc[(exp - 1) % cyc.length];
      return numQ('What is the unit digit of ' + base + '^' + exp + '?', u, '',
        'The unit digits of powers of ' + base + ' repeat in the cycle ' + cyc.join(', ') + ' (length ' + cyc.length + '). Since ' + exp + ' mod ' + cyc.length + ' = ' + (exp % cyc.length) + ', the unit digit is ' + u + '.', d === 1 ? 2 : 3);
    }
    var k = R(3, 9), big = k * R(100, 400) + R(1, k - 1);
    return numQ('Find the remainder when ' + big + ' is divided by ' + k + '.', big % k, '',
      big + ' = ' + k + ' × ' + Math.floor(big / k) + ' + ' + (big % k) + ', so the remainder is ' + (big % k) + '.', 2);
  };

  G.hcflcm = function (d) {
    var a = R(2, 9) * R(2, 7), b = R(2, 9) * R(2, 7);
    if (d >= 2 && Math.random() < 0.5) {
      var h = gcd(a, b), l = lcm(a, b);
      return numQ('Find the LCM of ' + a + ' and ' + b + '.', l, '',
        'HCF(' + a + ', ' + b + ') = ' + h + '. LCM = (' + a + ' × ' + b + ') ÷ ' + h + ' = ' + l + '.', d);
    }
    return numQ('Find the HCF of ' + a + ' and ' + b + '.', gcd(a, b), '',
      'By the Euclidean algorithm, HCF(' + a + ', ' + b + ') = ' + gcd(a, b) + '.', d === 3 ? 2 : 1);
  };

  G.pct = function (d) {
    if (d === 1) {
      var p = pick([10, 20, 25, 40, 50, 60, 75]), n = R(4, 20) * 20;
      return numQ('What is ' + p + '% of ' + n + '?', n * p / 100, '', p + '% of ' + n + ' = ' + n + ' × ' + p + '/100 = ' + N(n * p / 100) + '.', 1);
    }
    if (d === 2) {
      var orig = R(10, 40) * 25, inc = pick([10, 15, 20, 25, 30]);
      return numQ('The price of an article is ₹' + orig + '. If it rises by ' + inc + '%, find the new price.', orig * (1 + inc / 100), '₹',
        'Increase = ' + inc + '% of ' + orig + ' = ₹' + N(orig * inc / 100) + '. New price = ₹' + N(orig * (1 + inc / 100)) + '.', 2);
    }
    var a = pick([10, 20, 25]), b = pick([10, 20, 25]);
    var factor = (1 + a / 100) * (1 - b / 100);
    var net = factor * 100 - 100;
    return numQ('A number is increased by ' + a + '% and the result is then decreased by ' + b + '%. Find the net percentage change.', net, '%',
      'Net factor = (1 + ' + a + '/100)(1 − ' + b + '/100) = ' + factor.toFixed(4).replace(/0+$/, '') +
      ', i.e. a net change of ' + N(net) + '%.', 3, true);
  };

  G.ratio = function (d) {
    var a = R(2, 7), b = R(2, 9), total = (a + b) * R(5, 25);
    if (d === 3) {
      var c = R(2, 6), tot3 = (a + b + c) * R(4, 15);
      return numQ('₹' + tot3 + ' is divided among three people in the ratio ' + a + ' : ' + b + ' : ' + c + '. Find the largest share.',
        tot3 * Math.max(a, b, c) / (a + b + c), '₹',
        'One part = ' + tot3 + ' ÷ ' + (a + b + c) + ' = ₹' + N(tot3 / (a + b + c)) + '. Largest share = ' + Math.max(a, b, c) + ' parts = ₹' + N(tot3 * Math.max(a, b, c) / (a + b + c)) + '.', 3);
    }
    return numQ('₹' + total + ' is divided between two people in the ratio ' + a + ' : ' + b + '. Find the smaller share.',
      total * Math.min(a, b) / (a + b), '₹',
      'Total parts = ' + (a + b) + ', one part = ₹' + N(total / (a + b)) + '. Smaller share = ' + Math.min(a, b) + ' × ' + N(total / (a + b)) + ' = ₹' + N(total * Math.min(a, b) / (a + b)) + '.', d);
  };

  G.average = function (d) {
    if (d === 1) {
      var arr = []; for (var i = 0; i < 5; i++) arr.push(R(10, 90));
      var s = arr.reduce(function (x, y) { return x + y; }, 0);
      return numQ('Find the average of ' + arr.join(', ') + '.', s / 5, '', 'Sum = ' + s + '. Average = ' + s + ' ÷ 5 = ' + N(s / 5) + '.', 1);
    }
    var n = R(8, 15), avg = R(20, 60), extra = R(30, 90);
    var newAvg = (n * avg + extra) / (n + 1);
    return numQ('The average of ' + n + ' numbers is ' + avg + '. A new number ' + extra + ' is added. Find the new average.', newAvg, '',
      'Old sum = ' + n + ' × ' + avg + ' = ' + (n * avg) + '. New sum = ' + (n * avg + extra) + ' over ' + (n + 1) + ' numbers = ' + N(newAvg) + '.', d);
  };

  G.ages = function (d) {
    var son = R(8, 18), k = R(2, 5), father = son * k;
    if (d === 3) {
      var y = R(4, 10);
      var g2 = gcd(father + y, son + y);
      var ratio = ((father + y) / g2) + ' : ' + ((son + y) / g2);
      return mk('The present ages of a father and his son are ' + father + ' and ' + son + ' years. What will be the ratio of their ages after ' + y + ' years?',
        ratio,
        [((son + y) / g2) + ' : ' + ((father + y) / g2), (father + y) + ' : ' + son, father + ' : ' + (son + y)],
        'After ' + y + ' years the ages are ' + (father + y) + ' and ' + (son + y) + '. Dividing both by their HCF (' + g2 + ') gives ' + ratio + '.', 3);
    }
    var yrs = R(3, 8);
    return numQ('A father is ' + k + ' times as old as his son, who is ' + son + ' years old. What will be the father’s age after ' + yrs + ' years?',
      father + yrs, 'years',
      'Father’s present age = ' + k + ' × ' + son + ' = ' + father + '. After ' + yrs + ' years = ' + (father + yrs) + ' years.', d);
  };

  G.profitloss = function (d) {
    var cp = R(8, 50) * 25, p = pick([8, 10, 12, 15, 20, 25]);
    if (d === 1) {
      return numQ('An article bought for ₹' + cp + ' is sold at a profit of ' + p + '%. Find the selling price.', cp * (1 + p / 100), '₹',
        'Profit = ' + p + '% of ₹' + cp + ' = ₹' + N(cp * p / 100) + '. SP = ₹' + N(cp * (1 + p / 100)) + '.', 1);
    }
    if (d === 2) {
      var sp = Math.round(cp * (1 + p / 100));
      return numQ('An article costing ₹' + cp + ' is sold for ₹' + sp + '. Find the profit percentage.', (sp - cp) / cp * 100, '%',
        'Profit = ₹' + (sp - cp) + '. Profit % = (' + (sp - cp) + ' / ' + cp + ') × 100 = ' + N((sp - cp) / cp * 100) + '%.', 2);
    }
    var mp = cp * 1.5, disc = pick([10, 15, 20, 25]);
    var sp2 = mp * (1 - disc / 100);
    return numQ('A trader marks ' + pick(ITEMS) + ' 50% above its cost price of ₹' + cp + ' and then allows a discount of ' + disc + '%. Find his profit percentage.',
      (sp2 - cp) / cp * 100, '%',
      'MP = ₹' + N(mp) + '. SP after ' + disc + '% discount = ₹' + N(sp2) + '. Profit = ₹' + N(sp2 - cp) + ', i.e. ' + N((sp2 - cp) / cp * 100) + '%.', 3, true);
  };

  G.si = function (d) {
    var p = R(4, 40) * 500, r = pick([4, 5, 6, 7.5, 8, 10, 12]), t = R(2, 6);
    if (d === 3) {
      var si = p * r * t / 100;
      return numQ('A sum of ₹' + p + ' amounts to ₹' + N(p + si) + ' in ' + t + ' years under simple interest. Find the rate of interest per annum.', r, '%',
        'SI = ₹' + N(si) + '. R = (SI × 100)/(P × T) = (' + N(si) + ' × 100)/(' + p + ' × ' + t + ') = ' + N(r) + '%.', 3);
    }
    return numQ('Find the simple interest on ₹' + p + ' at ' + r + '% per annum for ' + t + ' years.', p * r * t / 100, '₹',
      'SI = P × R × T / 100 = ' + p + ' × ' + r + ' × ' + t + ' / 100 = ₹' + N(p * r * t / 100) + '.', d === 1 ? 1 : 2);
  };

  G.ci = function (d) {
    var p = R(4, 20) * 1000, r = pick([5, 10, 12, 15, 20]), t = d === 3 ? 3 : 2;
    var amt = p * Math.pow(1 + r / 100, t);
    if (d >= 2 && Math.random() < 0.4) {
      var si = p * r * t / 100;
      return numQ('Find the difference between the compound interest and the simple interest on ₹' + p + ' at ' + r + '% per annum for ' + t + ' years.',
        (amt - p) - si, '₹',
        'CI = ₹' + N(amt - p) + ', SI = ₹' + N(si) + '. Difference = ₹' + N((amt - p) - si) + '.', 3);
    }
    return numQ('Find the compound interest on ₹' + p + ' at ' + r + '% per annum compounded annually for ' + t + ' years.', amt - p, '₹',
      'A = P(1 + R/100)^T = ' + p + ' × (1.' + (r < 10 ? '0' + r : r) + ')^' + t + ' = ₹' + N(amt) + '. CI = A − P = ₹' + N(amt - p) + '.', d);
  };

  G.partnership = function (d) {
    var a = R(2, 9) * 1000, b = R(2, 9) * 1000, profit = R(5, 30) * 500;
    if (d === 3) {
      var ta = R(6, 12), tb = R(6, 12);
      var sa = a * ta, sb = b * tb;
      return numQ('A invests ₹' + a + ' for ' + ta + ' months and B invests ₹' + b + ' for ' + tb + ' months. If the total profit is ₹' + profit + ', find A’s share.',
        profit * sa / (sa + sb), '₹',
        'Capital × time: A = ' + sa + ', B = ' + sb + '. A’s share = ' + profit + ' × ' + sa + '/(' + sa + ' + ' + sb + ') = ₹' + N(profit * sa / (sa + sb)) + '.', 3);
    }
    return numQ('A and B invest ₹' + a + ' and ₹' + b + ' in a business. If the profit is ₹' + profit + ', find B’s share.',
      profit * b / (a + b), '₹',
      'Profit is shared in the ratio of capitals ' + a + ' : ' + b + '. B’s share = ' + profit + ' × ' + b + '/' + (a + b) + ' = ₹' + N(profit * b / (a + b)) + '.', d);
  };

  G.mixture = function (d) {
    var c1 = R(10, 30), c2 = R(40, 80);
    var mean = Math.round((c1 + c2) / 2) + pick([-5, -4, -3, 3, 4, 5]);   // never the exact midpoint
    if (mean <= c1 + 1) mean = c1 + 3;
    if (mean >= c2 - 1) mean = c2 - 3;
    var r1 = c2 - mean, r2 = mean - c1;
    var g = gcd(r1, r2) || 1;
    var a = r1 / g, b = r2 / g;
    return mk('Two varieties of rice costing ₹' + c1 + ' and ₹' + c2 + ' per kg are mixed so that the mixture costs ₹' + mean + ' per kg. Find the ratio in which they are mixed.',
      a + ' : ' + b,
      [b + ' : ' + a, (a + 1) + ' : ' + b, a + ' : ' + (b + 1), c1 + ' : ' + c2],
      'By alligation, ratio = (' + c2 + ' − ' + mean + ') : (' + mean + ' − ' + c1 + ') = ' + r1 + ' : ' + r2 + ' = ' + a + ' : ' + b + '.', d === 1 ? 2 : 3);
  };

  G.timework = function (d) {
    var a = R(6, 20), b = R(6, 24);
    if (d === 1) {
      return mk(pick(NAMES) + ' can finish a piece of work in ' + a + ' days. What fraction of the work is done in 1 day?',
        '1/' + a, ['1/' + (a - 1), '1/' + (a + 1), a + '/1', '2/' + a],
        'If the whole work takes ' + a + ' days, one day’s work is 1/' + a + ' of it.', 1);
    }
    var t = (a * b) / (a + b);
    if (d === 3) {
      var c = R(10, 30);
      var tt = 1 / (1 / a + 1 / b + 1 / c);
      return numQ('A, B and C can complete a work in ' + a + ', ' + b + ' and ' + c + ' days respectively. Working together, in how many days will they finish it?',
        tt, 'days',
        'Combined one-day work = 1/' + a + ' + 1/' + b + ' + 1/' + c + ' = ' + N(1 / a + 1 / b + 1 / c) + '. Time = ' + N(tt) + ' days.', 3);
    }
    return numQ('A can do a work in ' + a + ' days and B in ' + b + ' days. Working together, how long will they take?', t, 'days',
      'Together they do 1/' + a + ' + 1/' + b + ' = ' + N(1 / a + 1 / b) + ' of the work per day, so time = ' + N(t) + ' days.', 2);
  };

  G.pipes = function (d) {
    var a = R(4, 15), b = R(5, 20);
    if (d === 3) {
      var c = R(20, 40);
      var rate = 1 / a + 1 / b - 1 / c;
      return numQ('Two pipes fill a tank in ' + a + ' and ' + b + ' hours, while an outlet pipe empties it in ' + c + ' hours. If all three are open, how long does the tank take to fill?',
        1 / rate, 'hours',
        'Net rate = 1/' + a + ' + 1/' + b + ' − 1/' + c + ' = ' + N(rate) + ' tank/hour, so time = ' + N(1 / rate) + ' hours.', 3);
    }
    return numQ('Pipe A fills a tank in ' + a + ' hours and pipe B in ' + b + ' hours. If both are opened together, how long will the tank take to fill?',
      a * b / (a + b), 'hours',
      'Combined rate = 1/' + a + ' + 1/' + b + '. Time = ' + a + '×' + b + '/(' + a + '+' + b + ') = ' + N(a * b / (a + b)) + ' hours.', d);
  };

  G.tsd = function (d) {
    var s = R(3, 18) * 5, t = R(2, 9);
    if (d === 1) return numQ('A car travels at ' + s + ' km/h for ' + t + ' hours. Find the distance covered.', s * t, 'km',
      'Distance = speed × time = ' + s + ' × ' + t + ' = ' + (s * t) + ' km.', 1);
    if (d === 2) {
      var dist = s * t;
      return numQ('A train covers ' + dist + ' km in ' + t + ' hours. Find its average speed.', dist / t, 'km/h',
        'Speed = distance ÷ time = ' + dist + ' ÷ ' + t + ' = ' + N(dist / t) + ' km/h.', 2);
    }
    var s1 = R(4, 12) * 5, s2 = s1 + R(2, 8) * 5;
    var avg = 2 * s1 * s2 / (s1 + s2);
    return numQ('A man covers a distance at ' + s1 + ' km/h and returns along the same route at ' + s2 + ' km/h. Find his average speed for the whole journey.',
      avg, 'km/h',
      'Average speed = 2xy/(x+y) = 2 × ' + s1 + ' × ' + s2 + ' / (' + s1 + ' + ' + s2 + ') = ' + N(avg) + ' km/h.', 3);
  };

  G.trains = function (d) {
    var len = R(10, 30) * 10, sp = R(8, 20) * 5;
    if (d <= 2) {
      var tm = len / (sp * 5 / 18);
      return numQ('A train ' + len + ' m long is running at ' + sp + ' km/h. How long will it take to pass a pole?', tm, 'seconds',
        'Speed = ' + sp + ' × 5/18 = ' + N(sp * 5 / 18) + ' m/s. Time = ' + len + ' ÷ ' + N(sp * 5 / 18) + ' = ' + N(tm) + ' s.', d);
    }
    var plat = R(10, 40) * 10;
    var t2 = (len + plat) / (sp * 5 / 18);
    return numQ('A train ' + len + ' m long travelling at ' + sp + ' km/h crosses a platform ' + plat + ' m long. Find the time taken.', t2, 'seconds',
      'Total distance = ' + len + ' + ' + plat + ' = ' + (len + plat) + ' m. Speed = ' + N(sp * 5 / 18) + ' m/s. Time = ' + N(t2) + ' s.', 3);
  };

  G.boats = function (d) {
    var b = R(6, 20), s = R(1, 5);
    if (d === 3) {
      var dn = b + s, up = b - s, dist = R(2, 10) * up;
      return numQ('A boat covers ' + dist + ' km downstream and the same distance upstream. If the speed in still water is ' + b + ' km/h and the stream flows at ' + s + ' km/h, find the total time taken.',
        dist / dn + dist / up, 'hours',
        'Downstream speed = ' + dn + ' km/h, upstream = ' + up + ' km/h. Time = ' + dist + '/' + dn + ' + ' + dist + '/' + up + ' = ' + N(dist / dn + dist / up) + ' hours.', 3);
    }
    return numQ('The speed of a boat in still water is ' + b + ' km/h and the speed of the stream is ' + s + ' km/h. Find the downstream speed.',
      b + s, 'km/h', 'Downstream speed = boat speed + stream speed = ' + b + ' + ' + s + ' = ' + (b + s) + ' km/h.', d === 1 ? 1 : 2);
  };

  G.mensuration2d = function (d) {
    var t = R(1, 4);
    if (t === 1) { var l = R(5, 30), b = R(4, 25); return numQ('Find the area of a rectangle of length ' + l + ' cm and breadth ' + b + ' cm.', l * b, 'cm²', 'Area = l × b = ' + l + ' × ' + b + ' = ' + (l * b) + ' cm².', 1); }
    if (t === 2) { var r = R(3, 21); return numQ('Find the area of a circle of radius ' + r + ' cm. (Take π = 22/7)', 22 / 7 * r * r, 'cm²', 'Area = πr² = 22/7 × ' + r + '² = ' + N(22 / 7 * r * r) + ' cm².', 2); }
    if (t === 3) { var bs = R(6, 24), h = R(4, 20); return numQ('Find the area of a triangle with base ' + bs + ' cm and height ' + h + ' cm.', bs * h / 2, 'cm²', 'Area = ½ × base × height = ½ × ' + bs + ' × ' + h + ' = ' + N(bs * h / 2) + ' cm².', 1); }
    var s = R(5, 25); return numQ('Find the perimeter of a square whose area is ' + (s * s) + ' cm².', 4 * s, 'cm',
      'Side = √' + (s * s) + ' = ' + s + ' cm, so perimeter = 4 × ' + s + ' = ' + (4 * s) + ' cm.', d === 1 ? 1 : 2);
  };

  G.mensuration3d = function (d) {
    var t = R(1, 3);
    if (t === 1) { var l = R(3, 15), b = R(3, 12), h = R(2, 10); return numQ('Find the volume of a cuboid of dimensions ' + l + ' cm × ' + b + ' cm × ' + h + ' cm.', l * b * h, 'cm³', 'Volume = lbh = ' + l + ' × ' + b + ' × ' + h + ' = ' + (l * b * h) + ' cm³.', 1); }
    if (t === 2) { var r = R(3, 14), hh = R(5, 20); return numQ('Find the volume of a cylinder of radius ' + r + ' cm and height ' + hh + ' cm. (π = 22/7)', 22 / 7 * r * r * hh, 'cm³', 'V = πr²h = 22/7 × ' + r + '² × ' + hh + ' = ' + N(22 / 7 * r * r * hh) + ' cm³.', 2); }
    var R3 = R(3, 12); return numQ('Find the volume of a sphere of radius ' + R3 + ' cm. (π = 22/7)', 4 / 3 * 22 / 7 * Math.pow(R3, 3), 'cm³',
      'V = (4/3)πr³ = (4/3) × 22/7 × ' + R3 + '³ = ' + N(4 / 3 * 22 / 7 * Math.pow(R3, 3)) + ' cm³.', d === 1 ? 2 : 3);
  };

  G.di = function (d) {
    var yrs = [2019, 2020, 2021, 2022];
    var vals = yrs.map(function () { return R(20, 90) * 10; });
    var total = vals.reduce(function (a, b) { return a + b; }, 0);
    var table = 'Sales (in units) — ' + yrs.map(function (y, i) { return y + ': ' + vals[i]; }).join(' | ');
    var t = R(1, 3);
    if (t === 1) return numQ(table + '\nWhat is the average yearly sales over the four years?', total / 4, 'units',
      'Total = ' + total + ', average = ' + total + ' ÷ 4 = ' + N(total / 4) + ' units.', d);
    if (t === 2) {
      var i = R(1, 3);
      return numQ(table + '\nFind the percentage change in sales from ' + yrs[i - 1] + ' to ' + yrs[i] + '.',
        (vals[i] - vals[i - 1]) / vals[i - 1] * 100, '%',
        'Change = ' + (vals[i] - vals[i - 1]) + ' on a base of ' + vals[i - 1] + ', i.e. ' + N((vals[i] - vals[i - 1]) / vals[i - 1] * 100) + '%.', d === 1 ? 2 : 3, true);
    }
    var mx = Math.max.apply(null, vals);
    return numQ(table + '\nWhat percentage of the four-year total was contributed by the best year?', mx / total * 100, '%',
      'Best year = ' + mx + ' units out of ' + total + ', i.e. ' + N(mx / total * 100) + '%.', d === 1 ? 2 : 3);
  };

  G.statistics = function (d) {
    var n = d === 1 ? 5 : 7, arr = [];
    for (var i = 0; i < n; i++) arr.push(R(10, 60));
    var sum = arr.reduce(function (a, b) { return a + b; }, 0);
    var sorted = arr.slice().sort(function (a, b) { return a - b; });
    var t = d === 1 ? 1 : R(1, 3);
    if (t === 1) return numQ('Find the mean of: ' + arr.join(', '), sum / n, '', 'Mean = ' + sum + ' ÷ ' + n + ' = ' + N(sum / n) + '.', 1);
    if (t === 2) return numQ('Find the median of: ' + arr.join(', '), sorted[(n - 1) / 2], '',
      'Arranged in order: ' + sorted.join(', ') + '. The middle value is ' + sorted[(n - 1) / 2] + '.', 2);
    var mean = sum / n;
    var varc = arr.reduce(function (a, x) { return a + (x - mean) * (x - mean); }, 0) / n;
    return numQ('Find the standard deviation of: ' + arr.join(', ') + ' (to two decimal places).', Math.sqrt(varc), '',
      'Mean = ' + N(mean) + '. Variance = Σ(x − x̄)²/n = ' + N(varc) + '. SD = √' + N(varc) + ' = ' + N(Math.sqrt(varc)) + '.', 3);
  };

  /* ---------------------- algebra & higher maths ---------------------- */
  G.algebra_basic = function (d) {
    var a = R(2, 9), b = R(2, 15), x = R(2, 12);
    if (d === 1) return numQ('If ' + a + 'x = ' + (a * x) + ', find the value of x.', x, '', 'x = ' + (a * x) + ' ÷ ' + a + ' = ' + x + '.', 1);
    if (d === 2) return numQ('If ' + a + 'x + ' + b + ' = ' + (a * x + b) + ', find x.', x, '',
      'Subtract ' + b + ': ' + a + 'x = ' + (a * x) + ', so x = ' + x + '.', 2);
    var s = R(3, 9);
    return numQ('If x + 1/x = ' + s + ', find the value of x² + 1/x².', s * s - 2, '',
      'x² + 1/x² = (x + 1/x)² − 2 = ' + (s * s) + ' − 2 = ' + (s * s - 2) + '.', 3);
  };

  G.linear_eq = function (d) {
    var x = R(2, 10), y = R(2, 10), a = R(1, 6), b = R(1, 6), c = R(1, 6), e = R(1, 6);
    if (a * e - b * c === 0) a = a + 1;
    var p = a * x + b * y, q = c * x + e * y;
    return numQ('Solve: ' + a + 'x + ' + b + 'y = ' + p + ' and ' + c + 'x + ' + e + 'y = ' + q + '. Find the value of x.', x, '',
      'Eliminating y gives x = ' + x + ' and y = ' + y + '. (Check: ' + a + '×' + x + ' + ' + b + '×' + y + ' = ' + p + '.)', d === 1 ? 2 : d);
  };

  G.fractions = function (d) {
    var a = R(1, 9), b = R(2, 12), c = R(1, 9), e = R(2, 12);
    var num = a * e + c * b, den = b * e, g = gcd(num, den);
    if (d === 1) return mk('Simplify: ' + a + '/' + b + ' + ' + c + '/' + e,
      frac(num, den), [frac(a + c, b + e), frac(num + 1, den), frac(a * c, b * e)],
      'LCM of denominators = ' + den + '. Sum = (' + (a * e) + ' + ' + (c * b) + ')/' + den + ' = ' + frac(num, den) + '.', 1);
    var v = (a / b) * (c / e);
    return numQ('Evaluate ' + a + '/' + b + ' × ' + c + '/' + e + ' as a decimal (two decimal places).', v, '',
      'Product = ' + (a * c) + '/' + (b * e) + ' = ' + N(v) + '.', d);
  };

  G.integers = function (d) {
    var a = R(-30, 30), b = R(-20, 20);
    if (d === 1) return numQ('Evaluate: (' + a + ') + (' + b + ')', a + b, '', 'Adding the two integers gives ' + (a + b) + '.', 1, true);
    var c = R(-9, 9) || 3;
    return numQ('Evaluate: (' + a + ') × (' + c + ') − (' + b + ')', a * c - b, '',
      'First (' + a + ') × (' + c + ') = ' + (a * c) + ', then subtract (' + b + ') to get ' + (a * c - b) + '.', d, true);
  };

  G.unitary = function (d) {
    var items = R(3, 12), cost = items * R(5, 40), want = R(2, 20);
    return numQ('If ' + items + ' pens cost ₹' + cost + ', what is the cost of ' + want + ' such pens?', cost / items * want, '₹',
      'Cost of one pen = ₹' + N(cost / items) + '. Cost of ' + want + ' pens = ₹' + N(cost / items * want) + '.', d === 3 ? 2 : 1);
  };

  G.permutation = function (d) {
    if (d === 1) {
      var n = R(4, 7);
      return numQ('In how many ways can ' + n + ' different books be arranged on a shelf?', fact(n), '', 'The number of arrangements is ' + n + '! = ' + fact(n) + '.', 1);
    }
    if (d === 2) {
      var n2 = R(6, 10), r = R(2, 4);
      return numQ('Find the number of ways of arranging ' + r + ' people out of ' + n2 + ' in a row.', nPr(n2, r), '',
        'ⁿPᵣ = ' + n2 + '!/(' + n2 + '−' + r + ')! = ' + nPr(n2, r) + '.', 2);
    }
    var word = pick(['LEVEL', 'BANANA', 'SUCCESS', 'BALLOON', 'LETTER']);
    var counts = {}; for (var i = 0; i < word.length; i++) counts[word[i]] = (counts[word[i]] || 0) + 1;
    var den = 1, parts = [];
    for (var k in counts) if (counts[k] > 1) { den *= fact(counts[k]); parts.push(counts[k] + '! for ' + k); }
    var val = fact(word.length) / den;
    return numQ('How many distinct arrangements can be made of the letters of the word ' + word + '?', val, '',
      word.length + '! ÷ (' + (parts.join(' × ') || '1') + ') = ' + val + '.', 3);
  };

  G.combination = function (d) {
    var n = R(6, 12), r = R(2, 4);
    if (d === 3) {
      var m = R(4, 7), g = R(3, 6), sm = R(2, 3), sg = R(2, 3);
      var v = nCr(m, sm) * nCr(g, sg);
      return numQ('From ' + m + ' boys and ' + g + ' girls, in how many ways can a team of ' + sm + ' boys and ' + sg + ' girls be formed?', v, '',
        'C(' + m + ',' + sm + ') × C(' + g + ',' + sg + ') = ' + nCr(m, sm) + ' × ' + nCr(g, sg) + ' = ' + v + '.', 3);
    }
    return numQ('In how many ways can ' + r + ' people be selected from a group of ' + n + '?', nCr(n, r), '',
      'ⁿCᵣ = ' + n + '!/(' + r + '! × ' + (n - r) + '!) = ' + nCr(n, r) + '.', d);
  };

  G.probability = function (d) {
    var t = d === 1 ? 1 : R(1, 3);
    if (t === 1) {
      var fav = R(2, 5), other = R(2, 8);
      if (other === fav) other = fav + 2;                   // avoid a 1 : 1 split
      var tot = fav + other;
      return mk('A bag contains ' + fav + ' red and ' + other + ' blue balls. One ball is drawn at random. What is the probability that it is red?',
        frac(fav, tot), [frac(other, tot), frac(fav, other), frac(1, tot), frac(fav + 1, tot)],
        'P(red) = favourable/total = ' + fav + '/' + tot + ' = ' + frac(fav, tot) + '.', 1);
    }
    if (t === 2) {
      return mk('Two fair dice are thrown. What is the probability that the sum is 8?',
        frac(5, 36), [frac(1, 6), frac(1, 9), frac(5, 18)],
        'Favourable pairs: (2,6), (3,5), (4,4), (5,3), (6,2) — 5 out of 36 outcomes.', 2);
    }
    var r2 = R(2, 5), b2 = R(2, 6);
    if (b2 === r2) b2 = r2 + 2;                             // keep the two colour counts different
    var n2 = r2 + b2;
    var p = nCr(r2, 2) / nCr(n2, 2);
    return mk('A bag has ' + r2 + ' red and ' + b2 + ' black balls. Two balls are drawn together. Find the probability that both are red.',
      frac(nCr(r2, 2), nCr(n2, 2)),
      [frac(nCr(b2, 2), nCr(n2, 2)), frac(r2, n2), frac(r2 * (r2 - 1), n2 * n2), frac(r2 * b2, nCr(n2, 2))],
      'P = C(' + r2 + ',2)/C(' + n2 + ',2) = ' + nCr(r2, 2) + '/' + nCr(n2, 2) + ' = ' + frac(nCr(r2, 2), nCr(n2, 2)) + ' ≈ ' + N(p) + '.', 3);
  };

  /* " + 3x", " − x", "" for a zero coefficient */
  function term(coef, sym) {
    if (coef === 0) return '';
    var mag = Math.abs(coef);
    var num = (mag === 1 && sym) ? '' : String(mag);
    return (coef > 0 ? ' + ' : ' − ') + num + sym;
  }

  G.quadratic = function (d) {
    var r1 = R(-9, 9) || 2, r2 = R(-9, 9) || 3;
    var b = -(r1 + r2), c = r1 * r2;
    var eq = 'x²' + term(b, 'x') + term(c, '') + ' = 0';
    if (d === 3) {
      return numQ('If α and β are the roots of ' + eq + ', find the value of α² + β².', (r1 + r2) * (r1 + r2) - 2 * c, '',
        'α + β = ' + (r1 + r2) + ', αβ = ' + c + '. α² + β² = (α + β)² − 2αβ = ' + ((r1 + r2) * (r1 + r2)) + ' − ' + (2 * c) + ' = ' + ((r1 + r2) * (r1 + r2) - 2 * c) + '.', 3, true);
    }
    return mk('Solve for x: ' + eq,
      'x = ' + r1 + ', ' + r2, ['x = ' + (-r1) + ', ' + (-r2), 'x = ' + r1 + ', ' + (-r2), 'x = ' + (r1 + 1) + ', ' + (r2 - 1)],
      'Factorising: (x − ' + r1 + ')(x − ' + r2 + ') = 0, so x = ' + r1 + ' or ' + r2 + '.', d === 1 ? 2 : d);
  };

  G.ap = function (d) {
    var a = R(1, 15), diff = R(2, 9), n = R(8, 25);
    if (d === 3) {
      var s = n / 2 * (2 * a + (n - 1) * diff);
      return numQ('Find the sum of the first ' + n + ' terms of the AP ' + a + ', ' + (a + diff) + ', ' + (a + 2 * diff) + ', …', s, '',
        'Sₙ = n/2 [2a + (n−1)d] = ' + n + '/2 [2×' + a + ' + ' + (n - 1) + '×' + diff + '] = ' + s + '.', 3);
    }
    return numQ('Find the ' + n + 'th term of the AP ' + a + ', ' + (a + diff) + ', ' + (a + 2 * diff) + ', …', a + (n - 1) * diff, '',
      'aₙ = a + (n−1)d = ' + a + ' + ' + (n - 1) + ' × ' + diff + ' = ' + (a + (n - 1) * diff) + '.', d === 1 ? 1 : 2);
  };

  G.gp = function (d) {
    var a = R(1, 6), r = R(2, 4), n = R(4, 8);
    if (d === 3) {
      var s = a * (Math.pow(r, n) - 1) / (r - 1);
      return numQ('Find the sum of the first ' + n + ' terms of the GP ' + a + ', ' + (a * r) + ', ' + (a * r * r) + ', …', s, '',
        'Sₙ = a(rⁿ − 1)/(r − 1) = ' + a + '(' + r + '^' + n + ' − 1)/' + (r - 1) + ' = ' + s + '.', 3);
    }
    return numQ('Find the ' + n + 'th term of the GP ' + a + ', ' + (a * r) + ', ' + (a * r * r) + ', …', a * Math.pow(r, n - 1), '',
      'aₙ = ar^(n−1) = ' + a + ' × ' + r + '^' + (n - 1) + ' = ' + (a * Math.pow(r, n - 1)) + '.', d === 1 ? 2 : 2);
  };

  G.logarithm = function (d) {
    var b = pick([2, 3, 5, 10]), e = R(2, 6);
    if (d === 1) return numQ('Evaluate log' + b + ' ' + Math.pow(b, e), e, '',
      'Since ' + b + '^' + e + ' = ' + Math.pow(b, e) + ', the logarithm is ' + e + '.', 1);
    if (d === 2) {
      var m = R(2, 9), n = R(3, 9);
      if (n === m) n = m + 1;
      if (m + n === m * n) n = n + 1;                       // 2 + 2 = 2 × 2 would collide
      return mk('Simplify: log ' + m + ' + log ' + n,
        'log ' + (m * n), ['log ' + (m + n), 'log ' + m + ' × log ' + n, 'log ' + Math.abs(n - m), 'log ' + (m * n + 1)],
        'log a + log b = log(ab) = log ' + (m * n) + '.', 2);
    }
    var x = R(2, 5);
    return numQ('If log₂ x = ' + x + ', find the value of x.', Math.pow(2, x), '',
      'x = 2^' + x + ' = ' + Math.pow(2, x) + '.', 3);
  };

  G.surds = function (d) {
    var a = R(2, 9), m = R(2, 6), n = R(2, 6);
    if (d === 1) return numQ('Evaluate: ' + a + '^' + m + ' ÷ ' + a + '^' + (m - 1), a, '',
      'aᵐ ÷ aⁿ = a^(m−n) = ' + a + '^1 = ' + a + '.', 1);
    if (d === 2) return numQ('Simplify: (' + a + '^' + m + ')^' + n + ' expressed as ' + a + '^k. Find k.', m * n, '',
      '(aᵐ)ⁿ = a^(mn), so k = ' + m + ' × ' + n + ' = ' + (m * n) + '.', 2);
    var sq = R(2, 12);
    return numQ('Simplify √' + (sq * sq * R(2, 3)) + ' to the form k√p and find k.', sq, '',
      '√' + (sq * sq) + ' × √p = ' + sq + '√p, so k = ' + sq + '.', 3);
  };

  G.binomial = function (d) {
    var n = R(5, 10), r = R(1, 4);
    if (d === 3) {
      return numQ('Find the coefficient of x^' + r + ' in the expansion of (1 + x)^' + n + '.', nCr(n, r), '',
        'The general term is C(' + n + ', r)xʳ, so the coefficient of x^' + r + ' is C(' + n + ',' + r + ') = ' + nCr(n, r) + '.', 3);
    }
    return numQ('How many terms are there in the expansion of (a + b)^' + n + '?', n + 1, '',
      'The expansion of (a + b)ⁿ has n + 1 terms, i.e. ' + (n + 1) + '.', d === 1 ? 1 : 2);
  };

  G.complex = function (d) {
    var a = R(1, 8), b = R(1, 8);
    if (d === 1) return numQ('Find the modulus of the complex number ' + a + ' + ' + b + 'i.', Math.sqrt(a * a + b * b), '',
      '|z| = √(a² + b²) = √(' + (a * a) + ' + ' + (b * b) + ') = ' + N(Math.sqrt(a * a + b * b)) + '.', 1);
    if (d === 2) {
      var c = R(1, 8), e = R(1, 8);
      return mk('Multiply: (' + a + ' + ' + b + 'i)(' + c + ' + ' + e + 'i)',
        (a * c - b * e) + ' + ' + (a * e + b * c) + 'i',
        [(a * c + b * e) + ' + ' + (a * e + b * c) + 'i', (a * c - b * e) + ' − ' + (a * e + b * c) + 'i', (a * c) + ' + ' + (b * e) + 'i'],
        'Using i² = −1: real part = ' + a + '×' + c + ' − ' + b + '×' + e + ' = ' + (a * c - b * e) + '; imaginary part = ' + a + '×' + e + ' + ' + b + '×' + c + ' = ' + (a * e + b * c) + '.', 2);
    }
    var p = R(1, 4) * 4;
    return numQ('Find the value of i^' + p + ' where i = √(−1).', 1, '',
      'The powers of i repeat with period 4 and ' + p + ' is a multiple of 4, so i^' + p + ' = 1.', 3);
  };

  G.matrix = function (d) {
    var a = R(1, 9), b = R(1, 9), c = R(1, 9), e = R(1, 9);
    if (d <= 2) return numQ('Find the determinant of the matrix [[' + a + ', ' + b + '], [' + c + ', ' + e + ']].', a * e - b * c, '',
      'det = ad − bc = (' + a + ' × ' + e + ') − (' + b + ' × ' + c + ') = ' + (a * e - b * c) + '.', d, true);
    /* a 3×3 with two zeros so the expansion stays clean */
    var f = R(1, 5), g = R(1, 5), h = R(1, 5);
    var D = a * (e * h - f * g) - b * (c * h);
    return numQ('Find the determinant of [[' + a + ', ' + b + ', 0], [' + c + ', ' + e + ', ' + f + '], [0, ' + g + ', ' + h + ']].', D, '',
      'Expanding along the first row: ' + a + '(' + e + '×' + h + ' − ' + f + '×' + g + ') − ' + b + '(' + c + '×' + h + ' − 0) = ' + D + '.', 3, true);
  };

  G.sets = function (d) {
    var a = R(15, 40), b = R(15, 40), both = R(5, Math.min(a, b) - 2);
    if (d === 1) {
      var n = R(3, 6);
      return numQ('How many subsets does a set with ' + n + ' elements have?', Math.pow(2, n), '',
        'A set of n elements has 2ⁿ subsets = 2^' + n + ' = ' + Math.pow(2, n) + '.', 1);
    }
    return numQ('In a class, ' + a + ' students like Mathematics, ' + b + ' like Physics and ' + both + ' like both. How many like at least one of the two subjects?',
      a + b - both, 'students',
      'n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ' + a + ' + ' + b + ' − ' + both + ' = ' + (a + b - both) + '.', d);
  };

  G.functions = function (d) {
    var a = R(2, 6), b = R(1, 9), x = R(1, 7);
    if (d === 1) return numQ('If f(x) = ' + a + 'x + ' + b + ', find f(' + x + ').', a * x + b, '',
      'f(' + x + ') = ' + a + '×' + x + ' + ' + b + ' = ' + (a * x + b) + '.', 1);
    if (d === 2) {
      var c = R(2, 5);
      return numQ('If f(x) = ' + a + 'x + ' + b + ' and g(x) = x + ' + c + ', find f(g(' + x + ')).', a * (x + c) + b, '',
        'g(' + x + ') = ' + (x + c) + '. Then f(' + (x + c) + ') = ' + a + '×' + (x + c) + ' + ' + b + ' = ' + (a * (x + c) + b) + '.', 2);
    }
    return numQ('If f(x) = ' + a + 'x + ' + b + ', find f⁻¹(' + (a * x + b) + ').', x, '',
      'f⁻¹(y) = (y − ' + b + ')/' + a + ' = (' + (a * x + b) + ' − ' + b + ')/' + a + ' = ' + x + '.', 3);
  };

  G.trig = function (d) {
    if (d === 1) {
      var ang = pick([[0, 'sin 0°', '0'], [30, 'sin 30°', '1/2'], [45, 'cos 45°', '1/√2'], [60, 'tan 60°', '√3'], [90, 'cos 90°', '0'], [30, 'cos 30°', '√3/2'], [45, 'tan 45°', '1']]);
      return mk('Evaluate: ' + ang[1], ang[2], ['1', '0', '1/2'].filter(function (v) { return v !== ang[2]; }).concat(['√3/2', '1/√2']),
        'Standard trigonometric value: ' + ang[1] + ' = ' + ang[2] + '.', 1);
    }
    if (d === 2) {
      return mk('Simplify: sin²θ + cos²θ', '1', ['0', '2', 'sin 2θ'], 'This is the fundamental Pythagorean identity.', 2);
    }
    var k = R(3, 12), hyp = R(13, 25);
    var opp = k, adj = Math.sqrt(hyp * hyp - opp * opp);
    return numQ('In a right triangle, the hypotenuse is ' + hyp + ' cm and one side is ' + opp + ' cm. Find the third side (two decimals).', adj, 'cm',
      'By Pythagoras: third side = √(' + hyp + '² − ' + opp + '²) = √' + (hyp * hyp - opp * opp) + ' = ' + N(adj) + ' cm.', 3);
  };

  G.heights = function (d) {
    var h = R(10, 60), ang = pick([30, 45, 60]);
    var tanv = ang === 30 ? 1 / Math.sqrt(3) : ang === 45 ? 1 : Math.sqrt(3);
    return numQ('The angle of elevation of the top of a tower from a point on the ground is ' + ang + '°. If the tower is ' + h + ' m high, find the distance of the point from the base.',
      h / tanv, 'm',
      'tan ' + ang + '° = height/distance, so distance = ' + h + ' / tan ' + ang + '° = ' + N(h / tanv) + ' m.', d === 1 ? 2 : d);
  };

  G.straightline = function (d) {
    var x1 = R(-6, 6), y1 = R(-6, 6), x2 = R(-6, 6), y2 = R(-6, 6);
    if (x2 === x1) x2 = x1 + 2;
    if (d === 1) return numQ('Find the distance between the points (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').',
      Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)), '',
      'Distance = √[(' + (x2 - x1) + ')² + (' + (y2 - y1) + ')²] = ' + N(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))) + '.', 1);
    if (d === 2) return numQ('Find the slope of the line joining (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ').',
      (y2 - y1) / (x2 - x1), '',
      'Slope m = (y₂ − y₁)/(x₂ − x₁) = (' + (y2 - y1) + ')/(' + (x2 - x1) + ') = ' + N((y2 - y1) / (x2 - x1)) + '.', 2, true);
    var a = R(1, 6), b = R(1, 6), c = R(1, 12), px = R(-4, 4), py = R(-4, 4);
    var dist = Math.abs(a * px + b * py + c) / Math.sqrt(a * a + b * b);
    return numQ('Find the perpendicular distance of the point (' + px + ', ' + py + ') from the line ' + a + 'x + ' + b + 'y + ' + c + ' = 0.', dist, '',
      'd = |ax₁ + by₁ + c| / √(a² + b²) = |' + (a * px + b * py + c) + '| / √' + (a * a + b * b) + ' = ' + N(dist) + '.', 3);
  };

  G.circlegeom = function (d) {
    var r = R(2, 9);
    if (d <= 2) return numQ('Find the radius of the circle x² + y² = ' + (r * r) + '.', r, '',
      'Comparing with x² + y² = r², we get r = √' + (r * r) + ' = ' + r + '.', d);
    /* centre coordinates must be non-zero and unequal so the distractors stay distinct */
    var h = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    var k = pick([-5, -4, -3, -2, 2, 3, 4, 5].filter(function (v) { return v !== h; }));
    var c = h * h + k * k - r * r;
    return mk('Find the centre of the circle x² + y²' + term(-2 * h, 'x') + term(-2 * k, 'y') + term(c, '') + ' = 0.',
      '(' + h + ', ' + k + ')', ['(' + (-h) + ', ' + (-k) + ')', '(' + k + ', ' + h + ')', '(' + (2 * h) + ', ' + (2 * k) + ')'],
      'For x² + y² + 2gx + 2fy + c = 0 the centre is (−g, −f), which gives (' + h + ', ' + k + ').', 3);
  };

  G.conic = function (d) {
    var a = R(2, 8), b = R(1, 7);
    if (b >= a) b = a - 1 || 1;
    if (d <= 2) return numQ('Find the length of the latus rectum of the parabola y² = ' + (4 * a) + 'x.', 4 * a, '',
      'For y² = 4ax, the latus rectum is 4a = ' + (4 * a) + '.', 2);
    var ecc = Math.sqrt(1 - (b * b) / (a * a));
    return numQ('Find the eccentricity of the ellipse x²/' + (a * a) + ' + y²/' + (b * b) + ' = 1 (two decimals).', ecc, '',
      'e = √(1 − b²/a²) = √(1 − ' + (b * b) + '/' + (a * a) + ') = ' + N(ecc) + '.', 3);
  };

  G.vectors = function (d) {
    var a = R(1, 6), b = R(1, 6), c = R(1, 6), p = R(1, 6), q = R(1, 6), r = R(1, 6);
    if (d === 1) return numQ('Find the magnitude of the vector ' + vec(a, b, c) + '.', Math.sqrt(a * a + b * b + c * c), '',
      '|v| = √(' + (a * a) + ' + ' + (b * b) + ' + ' + (c * c) + ') = ' + N(Math.sqrt(a * a + b * b + c * c)) + '.', 1);
    if (d === 2) return numQ('Find the dot product of ' + vec(a, b, c) + ' and ' + vec(p, q, r) + '.',
      a * p + b * q + c * r, '',
      'a·b = ' + a + '×' + p + ' + ' + b + '×' + q + ' + ' + c + '×' + r + ' = ' + (a * p + b * q + c * r) + '.', 2);
    /* reroll until the cross product is non-degenerate (vectors not parallel) */
    var i, j, kk, guard = 0;
    do {
      i = b * r - c * q; j = c * p - a * r; kk = a * q - b * p;
      if (i || j || kk) break;
      p = R(1, 6); q = R(1, 6); r = R(1, 6);
    } while (++guard < 12);
    return mk('Find the cross product (' + vec(a, b, c) + ') × (' + vec(p, q, r) + ').',
      vec(i, j, kk),
      [vec(-i, -j, -kk), vec(a * p, b * q, c * r), vec(j, kk, i), vec(i + 1, j, kk)],
      'Expanding the determinant gives î(' + b + '×' + r + ' − ' + c + '×' + q + ') − ĵ(' + a + '×' + r + ' − ' + c + '×' + p + ') + k̂(' + a + '×' + q + ' − ' + b + '×' + p + ') = ' + vec(i, j, kk) + '.', 3);
  };

  G.limits = function (d) {
    var n = R(2, 6), a = R(2, 6);
    if (d === 1) {
      var c = R(1, 6), e = R(1, 9);
      return numQ('Evaluate: lim(x→' + c + ') (' + a + 'x + ' + e + ')', a * c + e, '',
        'The function is continuous, so substitute x = ' + c + ': ' + a + '×' + c + ' + ' + e + ' = ' + (a * c + e) + '.', 1);
    }
    if (d === 2) {
      return mk('Evaluate: lim(x→0) sin(' + a + 'x)/x', String(a), ['1', '0', String(1 / a)],
        'lim(x→0) sin(kx)/x = k, so the limit is ' + a + '.', 2);
    }
    return numQ('Evaluate: lim(x→' + a + ') (xⁿ − ' + a + 'ⁿ)/(x − ' + a + ') where n = ' + n + '.', n * Math.pow(a, n - 1), '',
      'The standard limit gives n·a^(n−1) = ' + n + ' × ' + a + '^' + (n - 1) + ' = ' + (n * Math.pow(a, n - 1)) + '.', 3);
  };

  G.derivative = function (d) {
    var n = R(2, 7), a = R(2, 9);
    if (d === 1) {
      return mk('Differentiate with respect to x: ' + a + 'x^' + n,
        (a * n) + 'x^' + (n - 1),
        [(a * n) + 'x^' + n, a + 'x^' + (n - 1), (a * n) + 'x^' + (n + 1), (a * (n + 1)) + 'x^' + n],
        'd/dx (axⁿ) = anx^(n−1) = ' + (a * n) + 'x^' + (n - 1) + '.', 1);
    }
    if (d === 2) {
      return mk('Differentiate: sin(' + a + 'x)', a + ' cos(' + a + 'x)', ['cos(' + a + 'x)', '−' + a + ' cos(' + a + 'x)', a + ' sin(' + a + 'x)'],
        'By the chain rule, d/dx sin(kx) = k cos(kx).', 2);
    }
    var x0 = R(1, 4);
    return numQ('If f(x) = ' + a + 'x^' + n + ', find f′(' + x0 + ').', a * n * Math.pow(x0, n - 1), '',
      'f′(x) = ' + (a * n) + 'x^' + (n - 1) + ', so f′(' + x0 + ') = ' + (a * n) + ' × ' + x0 + '^' + (n - 1) + ' = ' + (a * n * Math.pow(x0, n - 1)) + '.', 3);
  };

  G.application_der = function (d) {
    var a = R(1, 5), b = R(2, 12);
    var vertex = b / (2 * a);
    return numQ('Find the value of x at which f(x) = ' + a + 'x² − ' + b + 'x + ' + R(1, 9) + ' attains its minimum.', vertex, '',
      'f′(x) = ' + (2 * a) + 'x − ' + b + ' = 0 gives x = ' + b + '/' + (2 * a) + ' = ' + N(vertex) + '. Since f″(x) = ' + (2 * a) + ' > 0, this is a minimum.', d === 1 ? 2 : d);
  };

  G.integral = function (d) {
    var n = R(1, 6), a = R(2, 9);
    if (d === 1) {
      return mk('Evaluate: ∫ x^' + n + ' dx', 'x^' + (n + 1) + '/' + (n + 1) + ' + C',
        ['x^' + (n - 1) + '/' + (n - 1) + ' + C', (n + 1) + 'x^' + n + ' + C', 'x^' + n + '/' + n + ' + C'],
        '∫xⁿ dx = x^(n+1)/(n+1) + C.', 1);
    }
    if (d === 2) {
      return mk('Evaluate: ∫ ' + a + ' cos(x) dx', a + ' sin(x) + C', ['−' + a + ' sin(x) + C', a + ' cos(x) + C', 'sin(x) + C'],
        '∫cos x dx = sin x + C, and constants pull out.', 2);
    }
    var up = R(1, 4);
    var val = Math.pow(up, n + 1) / (n + 1);
    return numQ('Evaluate the definite integral ∫₀^' + up + ' x^' + n + ' dx.', val, '',
      '[x^' + (n + 1) + '/' + (n + 1) + ']₀^' + up + ' = ' + up + '^' + (n + 1) + '/' + (n + 1) + ' = ' + N(val) + '.', 3);
  };

  G.diffeq = function (d) {
    var k = R(2, 6);
    if (d <= 2) {
      return mk('Find the order of the differential equation d²y/dx² + ' + k + ' dy/dx + y = 0.',
        '2', ['1', '3', '0'], 'The order is the highest derivative present, which is the second derivative.', d);
    }
    return mk('Solve: dy/dx = ' + k + 'y', 'y = Ce^(' + k + 'x)', ['y = ' + k + 'x + C', 'y = Ce^(−' + k + 'x)', 'y = ' + k + 'e^x'],
      'Separating variables: dy/y = ' + k + ' dx → ln y = ' + k + 'x + c → y = Ce^(' + k + 'x).', 3);
  };

  /* ======================================================================
     REASONING
     ====================================================================== */
  G.numseries = function (d) {
    var type = d === 1 ? R(1, 2) : R(1, 5);
    var a, diff, r, s = [], i, nxt;
    if (type === 1) { a = R(2, 15); diff = R(3, 11); for (i = 0; i < 5; i++) s.push(a + i * diff); nxt = a + 5 * diff;
      return numQ('Find the next term: ' + s.join(', ') + ', ?', nxt, '', 'The series increases by a constant ' + diff + ' each time.', 1); }
    if (type === 2) { a = R(2, 6); r = R(2, 4); for (i = 0; i < 5; i++) s.push(a * Math.pow(r, i)); nxt = a * Math.pow(r, 5);
      return numQ('Find the next term: ' + s.join(', ') + ', ?', nxt, '', 'Each term is ' + r + ' times the previous one.', 2); }
    if (type === 3) {
      var cur = R(3, 10); s = [cur];
      for (i = 1; i <= 4; i++) { cur += i * 2; s.push(cur); }
      nxt = cur + 10;
      return numQ('Find the next term: ' + s.join(', ') + ', ?', nxt, '', 'The differences are 2, 4, 6, 8, 10 — increasing by 2 each time.', 2);
    }
    if (type === 4) { s = []; for (i = 1; i <= 5; i++) s.push(i * i); nxt = 36;
      return numQ('Find the next term: ' + s.join(', ') + ', ?', nxt, '', 'These are perfect squares: 1², 2², 3², 4², 5², so the next is 6² = 36.', 2); }
    var f = [1, 1]; for (i = 2; i < 7; i++) f.push(f[i - 1] + f[i - 2]);
    var st = R(0, 1);
    return numQ('Find the next term: ' + f.slice(st, st + 5).join(', ') + ', ?', f[st + 5], '',
      'Each term is the sum of the previous two (Fibonacci pattern).', 3);
  };

  G.letterseries = function (d) {
    var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var start = R(0, 10), step = R(2, 5);
    var s = [];
    for (var i = 0; i < 4; i++) s.push(A[(start + i * step) % 26]);
    var nxt = A[(start + 4 * step) % 26];
    if (d === 3) {
      var p = R(0, 8), q = R(2, 4);
      var pairs = [];
      for (var j = 0; j < 4; j++) pairs.push(A[(p + j * q) % 26] + A[(p + j * q + 1) % 26]);
      var nx2 = A[(p + 4 * q) % 26] + A[(p + 4 * q + 1) % 26];
      return mk('Find the next term: ' + pairs.join(', ') + ', ?', nx2,
        [A[(p + 4 * q + 1) % 26] + A[(p + 4 * q + 2) % 26], A[(p + 3 * q) % 26] + A[(p + 3 * q + 1) % 26], A[(p + 5 * q) % 26] + A[(p + 5 * q + 1) % 26]],
        'The first letter advances by ' + q + ' each time and the second letter immediately follows it.', 3);
    }
    return mk('Find the next letter: ' + s.join(', ') + ', ?', nxt,
      [A[(start + 5 * step) % 26], A[(start + 4 * step + 1) % 26], A[(start + 3 * step) % 26]],
      'Each letter skips ' + (step - 1) + ' letter(s), i.e. advances by ' + step + ' positions.', d === 1 ? 1 : 2);
  };

  G.coding = function (d) {
    var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var words = ['TABLE', 'CHAIR', 'MOUSE', 'PAPER', 'LIGHT', 'WATER', 'PLANT', 'STONE', 'BRAIN', 'CLOUD'];
    var w1 = pick(words), w2 = pick(words.filter(function (x) { return x !== w1; }));
    var k = d === 3 ? R(2, 5) : 1;
    function shift(s, k) { return s.split('').map(function (ch) { return A[(A.indexOf(ch) + k + 26) % 26]; }).join(''); }
    var dir = Math.random() < 0.5 ? k : -k;
    return mk('In a certain code, ' + w1 + ' is written as ' + shift(w1, dir) + '. How is ' + w2 + ' written in that code?',
      shift(w2, dir), [shift(w2, -dir), shift(w2, dir + 1), w2.split('').reverse().join('')],
      'Each letter is shifted ' + Math.abs(dir) + ' place(s) ' + (dir > 0 ? 'forward' : 'backward') + ' in the alphabet.', d);
  };

  G.bloodrel = function (d) {
    var set = [
      ['Pointing to a man, a woman said, "His mother is the only daughter of my mother." How is the woman related to the man?', 'Mother', ['Sister', 'Aunt', 'Grandmother'], 'The only daughter of her mother is the woman herself, so she is the man’s mother.'],
      ['A is B’s brother, C is A’s father, D is C’s sister. How is D related to B?', 'Aunt', ['Mother', 'Sister', 'Niece'], 'C is B’s father, so C’s sister D is B’s aunt.'],
      ['P is the son of Q. R is the father of Q. How is R related to P?', 'Grandfather', ['Father', 'Uncle', 'Brother'], 'R is the father of P’s father, i.e. P’s grandfather.'],
      ['X said, "She is the daughter of my grandfather’s only son." How is she related to X?', 'Sister', ['Daughter', 'Cousin', 'Niece'], 'The grandfather’s only son is X’s father, so she is X’s sister.'],
      ['M is the wife of N. O is the son of N. P is the brother of M. How is P related to O?', 'Maternal uncle', ['Father', 'Brother', 'Grandfather'], 'P is O’s mother’s brother, i.e. his maternal uncle.'],
      ['A + B means A is the father of B. A − B means A is the wife of B. If P + Q − R, how is P related to R?', 'Father-in-law', ['Father', 'Brother', 'Son'], 'P is Q’s father and Q is R’s wife, so P is R’s father-in-law.']
    ];
    var s = pick(set);
    return mk(s[0], s[1], s[2], s[3], d === 1 ? 1 : d);
  };

  G.direction = function (d) {
    var a = R(3, 15), b = R(3, 15);
    if (d <= 2) {
      var dist = Math.sqrt(a * a + b * b);
      return numQ('A man walks ' + a + ' km towards the north, then turns right and walks ' + b + ' km. How far is he from the starting point?',
        dist, 'km',
        'The two legs are perpendicular, so distance = √(' + a + '² + ' + b + '²) = √' + (a * a + b * b) + ' = ' + N(dist) + ' km.', d);
    }
    var c = R(2, 8);
    var net = a - c;
    return numQ('A person walks ' + a + ' m north, then ' + b + ' m east, then ' + c + ' m south. How far is he from the starting point?',
      Math.sqrt(net * net + b * b), 'm',
      'Net north displacement = ' + a + ' − ' + c + ' = ' + net + ' m, east = ' + b + ' m. Distance = √(' + (net * net) + ' + ' + (b * b) + ') = ' + N(Math.sqrt(net * net + b * b)) + ' m.', 3);
  };

  G.ranking = function (d) {
    var n = R(20, 60), left = R(5, 15);
    if (d <= 2) return numQ('In a row of ' + n + ' students, Ravi is ' + left + 'th from the left. What is his position from the right?',
      n - left + 1, '', 'Position from right = total − position from left + 1 = ' + n + ' − ' + left + ' + 1 = ' + (n - left + 1) + '.', d === 1 ? 1 : 2);
    var right = R(5, 15);
    while (left + right > n) right = R(3, 10);
    return numQ('In a row, Amit is ' + left + 'th from the left and ' + right + 'th from the right. How many students are in the row?',
      left + right - 1, '', 'Total = ' + left + ' + ' + right + ' − 1 = ' + (left + right - 1) + ' (Amit is counted twice).', 3);
  };

  G.clock = function (d) {
    var h = R(1, 11), m = pick([0, 10, 20, 30, 40, 50]);
    var ang = Math.abs(30 * h - 5.5 * m);
    if (ang > 180) ang = 360 - ang;
    if (d === 1) {
      return numQ('What is the angle between the hands of a clock at ' + h + ':00?', Math.min(30 * h, 360 - 30 * h), '°',
        'Each hour mark is 30°, so the angle is ' + Math.min(30 * h, 360 - 30 * h) + '°.', 1);
    }
    return numQ('What is the angle between the hour and minute hands at ' + h + ':' + (m < 10 ? '0' + m : m) + '?', ang, '°',
      'Angle = |30H − 5.5M| = |30×' + h + ' − 5.5×' + m + '| = ' + N(Math.abs(30 * h - 5.5 * m)) + '°' + (Math.abs(30 * h - 5.5 * m) > 180 ? ', and taking the smaller angle gives ' + N(ang) + '°' : '') + '.', d);
  };

  G.calendar = function (d) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var start = R(0, 6), gap = R(10, 200);
    var ansIdx = (start + gap) % 7;
    if (d === 1) {
      var g2 = R(2, 6);
      return mk('If today is ' + days[start] + ', what day will it be after ' + g2 + ' days?', days[(start + g2) % 7],
        [days[(start + g2 + 1) % 7], days[(start + g2 - 1 + 7) % 7], days[(start + g2 + 3) % 7]],
        'Add ' + g2 + ' days to ' + days[start] + '.', 1);
    }
    return mk('If today is ' + days[start] + ', what day of the week will it be after ' + gap + ' days?', days[ansIdx],
      [days[(ansIdx + 1) % 7], days[(ansIdx + 6) % 7], days[(ansIdx + 3) % 7]],
      gap + ' ÷ 7 leaves a remainder of ' + (gap % 7) + ' odd days, so the day is ' + days[ansIdx] + '.', d);
  };

  /* ======================================================================
     PHYSICS
     ====================================================================== */
  G.units_dim = function (d) {
    var set = [
      ['The dimensional formula of force is:', '[MLT⁻²]', ['[ML²T⁻²]', '[MLT⁻¹]', '[ML⁻¹T⁻²]'], 'Force = mass × acceleration = M × LT⁻².'],
      ['The dimensional formula of work is:', '[ML²T⁻²]', ['[MLT⁻²]', '[ML²T⁻³]', '[MLT⁻¹]'], 'Work = force × distance = MLT⁻² × L.'],
      ['The SI unit of pressure is:', 'Pascal', ['Newton', 'Joule', 'Watt'], '1 Pa = 1 N/m².'],
      ['The dimensional formula of power is:', '[ML²T⁻³]', ['[ML²T⁻²]', '[MLT⁻²]', '[ML²T⁻¹]'], 'Power = work/time = ML²T⁻² / T.'],
      ['Which pair has the same dimensions?', 'Work and torque', ['Force and power', 'Impulse and energy', 'Pressure and force'], 'Both work and torque have dimensions [ML²T⁻²].'],
      ['The dimensional formula of momentum is:', '[MLT⁻¹]', ['[MLT⁻²]', '[ML²T⁻¹]', '[ML²T⁻²]'], 'Momentum = mass × velocity.']
    ];
    var s = pick(set);
    return mk(s[0], s[1], s[2], s[3], d === 1 ? 1 : 2);
  };

  G.kinematics = function (d) {
    var u = d === 1 ? 0 : R(2, 20), a = R(2, 10), t = R(2, 10);
    if (d === 1) {
      return numQ('A body starts from rest with a uniform acceleration of ' + a + ' m/s². Find the distance covered in ' + t + ' s.',
        0.5 * a * t * t, 'm', 's = ut + ½at² = 0 + ½ × ' + a + ' × ' + t + '² = ' + N(0.5 * a * t * t) + ' m.', 1);
    }
    if (d === 2) {
      return numQ('A body moving with an initial velocity of ' + u + ' m/s accelerates at ' + a + ' m/s² for ' + t + ' s. Find its final velocity.',
        u + a * t, 'm/s', 'v = u + at = ' + u + ' + ' + a + ' × ' + t + ' = ' + (u + a * t) + ' m/s.', 2);
    }
    var v = u + a * t;
    return numQ('A body accelerates uniformly from ' + u + ' m/s to ' + v + ' m/s at ' + a + ' m/s². Find the distance travelled.',
      (v * v - u * u) / (2 * a), 'm',
      'v² = u² + 2as → s = (' + (v * v) + ' − ' + (u * u) + ')/(2 × ' + a + ') = ' + N((v * v - u * u) / (2 * a)) + ' m.', 3);
  };

  G.projectile = function (d) {
    var u = R(10, 50), ang = pick([30, 45, 60]), g = 10;
    var rad = ang * Math.PI / 180;
    if (d <= 2) {
      var T = 2 * u * Math.sin(rad) / g;
      return numQ('A projectile is launched at ' + u + ' m/s at ' + ang + '° to the horizontal. Find its time of flight. (g = 10 m/s²)',
        T, 's', 'T = 2u sinθ/g = 2 × ' + u + ' × sin ' + ang + '°/10 = ' + N(T) + ' s.', d);
    }
    var Rg = u * u * Math.sin(2 * rad) / g;
    return numQ('Find the horizontal range of a projectile thrown at ' + u + ' m/s at ' + ang + '° to the horizontal. (g = 10 m/s²)',
      Rg, 'm', 'R = u² sin2θ/g = ' + (u * u) + ' × sin ' + (2 * ang) + '°/10 = ' + N(Rg) + ' m.', 3);
  };

  G.laws_motion = function (d) {
    var m = R(2, 30), a = R(1, 10);
    if (d === 1) return numQ('Find the force required to accelerate a body of mass ' + m + ' kg at ' + a + ' m/s².', m * a, 'N',
      'F = ma = ' + m + ' × ' + a + ' = ' + (m * a) + ' N.', 1);
    if (d === 2) {
      var mu = pick([0.2, 0.25, 0.3, 0.4, 0.5]);
      return numQ('A block of mass ' + m + ' kg rests on a surface with coefficient of friction ' + mu + '. Find the limiting friction. (g = 10 m/s²)',
        mu * m * 10, 'N', 'f = μN = μmg = ' + mu + ' × ' + m + ' × 10 = ' + N(mu * m * 10) + ' N.', 2);
    }
    var m1 = R(2, 10), m2 = R(2, 10);
    var acc = Math.abs(m1 - m2) * 10 / (m1 + m2);
    return numQ('Two masses of ' + m1 + ' kg and ' + m2 + ' kg hang on either side of a frictionless pulley. Find the acceleration of the system. (g = 10 m/s²)',
      acc, 'm/s²', 'a = (m₁ − m₂)g/(m₁ + m₂) = |' + m1 + ' − ' + m2 + '| × 10/' + (m1 + m2) + ' = ' + N(acc) + ' m/s².', 3);
  };

  G.work_energy = function (d) {
    var F = R(5, 50), s = R(2, 20), m = R(2, 20), v = R(2, 15);
    if (d === 1) return numQ('A force of ' + F + ' N moves a body through ' + s + ' m in its own direction. Find the work done.', F * s, 'J',
      'W = F × s = ' + F + ' × ' + s + ' = ' + (F * s) + ' J.', 1);
    if (d === 2) return numQ('Find the kinetic energy of a body of mass ' + m + ' kg moving at ' + v + ' m/s.', 0.5 * m * v * v, 'J',
      'KE = ½mv² = ½ × ' + m + ' × ' + v + '² = ' + N(0.5 * m * v * v) + ' J.', 2);
    var t = R(2, 10);
    return numQ('A machine does ' + (F * s) + ' J of work in ' + t + ' s. Find its power.', F * s / t, 'W',
      'P = W/t = ' + (F * s) + '/' + t + ' = ' + N(F * s / t) + ' W.', 3);
  };

  G.circular = function (d) {
    var m = R(1, 10), v = R(2, 20), r = R(2, 15);
    return numQ('A body of mass ' + m + ' kg moves in a circle of radius ' + r + ' m with speed ' + v + ' m/s. Find the centripetal force.',
      m * v * v / r, 'N', 'F = mv²/r = ' + m + ' × ' + (v * v) + '/' + r + ' = ' + N(m * v * v / r) + ' N.', d === 1 ? 2 : d);
  };

  G.rotational = function (d) {
    var m = R(1, 10), r = R(1, 8);
    if (d <= 2) return numQ('Find the moment of inertia of a solid sphere of mass ' + m + ' kg and radius ' + r + ' m about a diameter.',
      0.4 * m * r * r, 'kg·m²', 'I = (2/5)mr² = 0.4 × ' + m + ' × ' + (r * r) + ' = ' + N(0.4 * m * r * r) + ' kg·m².', 2);
    var wv = R(2, 12);
    return numQ('A disc of mass ' + m + ' kg and radius ' + r + ' m rotates at ' + wv + ' rad/s about its axis. Find its rotational kinetic energy.',
      0.5 * (0.5 * m * r * r) * wv * wv, 'J',
      'I = ½mr² = ' + N(0.5 * m * r * r) + ' kg·m². KE = ½Iω² = ' + N(0.5 * (0.5 * m * r * r) * wv * wv) + ' J.', 3);
  };

  G.gravitation = function (d) {
    if (d === 1) {
      return mk('The value of acceleration due to gravity at the surface of the Earth is about:', '9.8 m/s²', ['6.67 m/s²', '11.2 m/s²', '1.6 m/s²'],
        'g ≈ 9.8 m/s² at sea level.', 1);
    }
    var m = R(10, 90), h = R(1, 5);
    if (d === 2) return numQ('Find the gravitational potential energy of a ' + m + ' kg body raised ' + h + ' m above the ground. (g = 10 m/s²)',
      m * 10 * h, 'J', 'PE = mgh = ' + m + ' × 10 × ' + h + ' = ' + (m * 10 * h) + ' J.', 2);
    var R0 = 6400, hh = R(1, 5) * 100;
    var gh = 9.8 * Math.pow(R0 / (R0 + hh), 2);
    return numQ('Find the acceleration due to gravity at a height of ' + hh + ' km above the Earth’s surface (R = 6400 km, g = 9.8 m/s²).',
      gh, 'm/s²', 'gₕ = g[R/(R+h)]² = 9.8 × (6400/' + (R0 + hh) + ')² = ' + N(gh) + ' m/s².', 3);
  };

  G.fluids = function (d) {
    var rho = pick([1000, 800, 1200, 13600]), h = R(1, 20), g = 10;
    if (d <= 2) return numQ('Find the pressure at a depth of ' + h + ' m in a liquid of density ' + rho + ' kg/m³. (g = 10 m/s²)',
      rho * g * h, 'Pa', 'P = ρgh = ' + rho + ' × 10 × ' + h + ' = ' + (rho * g * h) + ' Pa.', d);
    var V = R(100, 900);
    return numQ('A body of volume ' + V + ' cm³ is fully immersed in water (ρ = 1000 kg/m³). Find the buoyant force. (g = 10 m/s²)',
      1000 * 10 * V / 1e6, 'N', 'F = ρVg = 1000 × ' + (V / 1e6) + ' × 10 = ' + N(1000 * 10 * V / 1e6) + ' N.', 3);
  };

  G.thermo_phy = function (d) {
    var m = R(1, 10), c = pick([4200, 900, 390, 500]), dT = R(5, 60);
    if (d <= 2) return numQ('Find the heat required to raise the temperature of ' + m + ' kg of a substance (specific heat ' + c + ' J/kg·K) by ' + dT + ' K.',
      m * c * dT, 'J', 'Q = mcΔT = ' + m + ' × ' + c + ' × ' + dT + ' = ' + (m * c * dT) + ' J.', d);
    var cel = R(20, 90);
    return numQ('Convert ' + cel + ' °C to kelvin.', cel + 273, 'K', 'K = °C + 273 = ' + cel + ' + 273 = ' + (cel + 273) + ' K.', d === 3 ? 2 : 2);
  };

  G.shm = function (d) {
    var k = R(50, 400), m = R(1, 10);
    var T = 2 * Math.PI * Math.sqrt(m / k);
    if (d <= 2) return numQ('A mass of ' + m + ' kg on a spring of stiffness ' + k + ' N/m oscillates. Find the time period (two decimals).',
      T, 's', 'T = 2π√(m/k) = 2π√(' + m + '/' + k + ') = ' + N(T) + ' s.', d);
    var A = R(2, 15), omega = R(2, 10);
    return numQ('A particle in SHM has amplitude ' + A + ' cm and angular frequency ' + omega + ' rad/s. Find its maximum speed.',
      A * omega, 'cm/s', 'v_max = Aω = ' + A + ' × ' + omega + ' = ' + (A * omega) + ' cm/s.', 3);
  };

  G.waves = function (d) {
    var f = R(50, 900), lam = R(1, 20);
    if (d <= 2) return numQ('A wave has frequency ' + f + ' Hz and wavelength ' + lam + ' m. Find its speed.', f * lam, 'm/s',
      'v = fλ = ' + f + ' × ' + lam + ' = ' + (f * lam) + ' m/s.', d);
    var L = R(1, 5);
    return numQ('Find the fundamental frequency of a string of length ' + L + ' m in which the wave speed is ' + (f * lam) + ' m/s.',
      (f * lam) / (2 * L), 'Hz', 'f₁ = v/2L = ' + (f * lam) + '/(2 × ' + L + ') = ' + N((f * lam) / (2 * L)) + ' Hz.', 3);
  };

  G.electrostatics = function (d) {
    var q1 = R(1, 9), q2 = R(1, 9), r = R(1, 6);
    var F = 9e9 * q1 * q2 * 1e-12 / (r * r);
    if (d <= 2) return numQ('Two charges of ' + q1 + ' μC and ' + q2 + ' μC are placed ' + r + ' m apart in air. Find the force between them. (k = 9 × 10⁹)',
      F, 'N', 'F = kq₁q₂/r² = 9×10⁹ × ' + q1 + '×10⁻⁶ × ' + q2 + '×10⁻⁶ / ' + (r * r) + ' = ' + N(F) + ' N.', d);
    var V = 9e9 * q1 * 1e-6 / r;
    return numQ('Find the electric potential at a distance of ' + r + ' m from a point charge of ' + q1 + ' μC. (k = 9 × 10⁹)',
      V, 'V', 'V = kq/r = 9×10⁹ × ' + q1 + '×10⁻⁶ / ' + r + ' = ' + N(V) + ' V.', 3);
  };

  G.current_elec = function (d) {
    var V = R(2, 24), Rr = R(2, 20);
    if (d === 1) return numQ('Find the current through a resistor of ' + Rr + ' Ω connected across ' + V + ' V.', V / Rr, 'A',
      'I = V/R = ' + V + '/' + Rr + ' = ' + N(V / Rr) + ' A.', 1);
    if (d === 2) {
      var R2 = R(2, 20);
      return numQ('Two resistors of ' + Rr + ' Ω and ' + R2 + ' Ω are connected in parallel. Find the equivalent resistance.',
        Rr * R2 / (Rr + R2), 'Ω', '1/R = 1/' + Rr + ' + 1/' + R2 + ', so R = ' + Rr + '×' + R2 + '/(' + Rr + '+' + R2 + ') = ' + N(Rr * R2 / (Rr + R2)) + ' Ω.', 2);
    }
    var t = R(10, 120);
    return numQ('A ' + Rr + ' Ω resistor carries ' + N(V / Rr) + ' A for ' + t + ' s. Find the heat produced.',
      (V / Rr) * (V / Rr) * Rr * t, 'J', 'H = I²Rt = ' + N((V / Rr) * (V / Rr)) + ' × ' + Rr + ' × ' + t + ' = ' + N((V / Rr) * (V / Rr) * Rr * t) + ' J.', 3);
  };

  G.magnetism = function (d) {
    var B = R(1, 9) / 10, I = R(1, 10), L = R(1, 10);
    if (d <= 2) return numQ('A straight wire of length ' + L + ' m carries ' + I + ' A perpendicular to a magnetic field of ' + N(B) + ' T. Find the force on it.',
      B * I * L, 'N', 'F = BIL sin90° = ' + N(B) + ' × ' + I + ' × ' + L + ' = ' + N(B * I * L) + ' N.', d);
    var Nt = R(50, 400), dphi = R(1, 9) / 100, dt = R(1, 5) / 10;
    return numQ('A coil of ' + Nt + ' turns experiences a flux change of ' + N(dphi) + ' Wb in ' + N(dt) + ' s. Find the induced emf.',
      Nt * dphi / dt, 'V', '|ε| = N dΦ/dt = ' + Nt + ' × ' + N(dphi) + '/' + N(dt) + ' = ' + N(Nt * dphi / dt) + ' V.', 3);
  };

  G.optics = function (d) {
    var f = R(5, 40), u = f + R(5, 40);
    var v = 1 / (1 / f - 1 / u);
    if (d === 1) return numQ('Find the power of a lens of focal length ' + f + ' cm.', 100 / f, 'D',
      'P = 100/f(cm) = 100/' + f + ' = ' + N(100 / f) + ' dioptre.', 1);
    if (d === 2) return numQ('An object is placed ' + u + ' cm from a convex lens of focal length ' + f + ' cm. Find the image distance.',
      v, 'cm', '1/v − 1/u = 1/f with u = −' + u + ' gives v = ' + N(v) + ' cm.', 2);
    return numQ('Find the magnification produced when an object at ' + u + ' cm forms an image at ' + N(v) + ' cm through a lens.',
      v / u, '', 'm = v/u = ' + N(v) + '/' + u + ' = ' + N(v / u) + ' (magnitude).', 3);
  };

  G.modern_phy = function (d) {
    if (d === 1) {
      return mk('The energy of a photon is given by:', 'E = hν', ['E = mc', 'E = hv²', 'E = h/ν'],
        'Planck’s relation: E = hν where h is Planck’s constant.', 1);
    }
    if (d === 2) {
      var hl = R(2, 20), n = R(2, 5);
      return numQ('A radioactive sample has a half-life of ' + hl + ' days. What fraction of the original amount remains after ' + (n * hl) + ' days?',
        1 / Math.pow(2, n), '', 'After ' + n + ' half-lives the remaining fraction is (1/2)^' + n + ' = ' + N(1 / Math.pow(2, n)) + '.', 2);
    }
    var V = R(50, 400);
    var lam = 12.27 / Math.sqrt(V);
    return numQ('Find the de Broglie wavelength of an electron accelerated through ' + V + ' V (use λ = 12.27/√V Å).',
      lam, 'Å', 'λ = 12.27/√' + V + ' = ' + N(lam) + ' Å.', 3);
  };

  /* ======================================================================
     CHEMISTRY
     ====================================================================== */
  G.mole = function (d) {
    var subs = [['H₂O', 18], ['CO₂', 44], ['NaCl', 58.5], ['CaCO₃', 100], ['H₂SO₄', 98], ['NH₃', 17], ['O₂', 32], ['CH₄', 16]];
    var s = pick(subs), g = R(2, 20) * 5;
    if (d === 1) return numQ('Find the number of moles in ' + g + ' g of ' + s[0] + ' (molar mass = ' + s[1] + ' g/mol).',
      g / s[1], 'mol', 'n = mass/molar mass = ' + g + '/' + s[1] + ' = ' + N(g / s[1]) + ' mol.', 1);
    if (d === 2) return numQ('How many molecules are present in ' + N(g / s[1]) + ' mol of ' + s[0] + '? (Nₐ = 6.022 × 10²³) Give the answer in units of 10²³.',
      g / s[1] * 6.022, '× 10²³', 'Number = n × Nₐ = ' + N(g / s[1]) + ' × 6.022 × 10²³ = ' + N(g / s[1] * 6.022) + ' × 10²³.', 2);
    return numQ('What volume (in litres) would ' + N(g / s[1]) + ' mol of ' + s[0] + ' gas occupy at STP?',
      g / s[1] * 22.4, 'L', 'At STP, 1 mol occupies 22.4 L, so V = ' + N(g / s[1]) + ' × 22.4 = ' + N(g / s[1] * 22.4) + ' L.', 3);
  };

  G.concentration = function (d) {
    var n = R(1, 10) / 2, V = R(1, 10) / 2;
    if (d <= 2) return numQ('Find the molarity of a solution containing ' + N(n) + ' mol of solute in ' + N(V) + ' L of solution.',
      n / V, 'M', 'M = moles/volume(L) = ' + N(n) + '/' + N(V) + ' = ' + N(n / V) + ' M.', d);
    var m1 = R(1, 10), v1 = R(10, 100), v2 = v1 + R(20, 200);
    return numQ('A ' + m1 + ' M solution of volume ' + v1 + ' mL is diluted to ' + v2 + ' mL. Find the new molarity.',
      m1 * v1 / v2, 'M', 'M₁V₁ = M₂V₂ → M₂ = ' + m1 + ' × ' + v1 + '/' + v2 + ' = ' + N(m1 * v1 / v2) + ' M.', 3);
  };

  G.gaslaws = function (d) {
    var p1 = R(1, 5), v1 = R(2, 20), v2 = R(2, 20);
    if (v2 === v1) v2 = v1 + 2;
    if (d <= 2) return numQ('A gas at ' + p1 + ' atm occupies ' + v1 + ' L. At constant temperature, find the pressure when the volume becomes ' + v2 + ' L.',
      p1 * v1 / v2, 'atm', 'Boyle’s law: P₁V₁ = P₂V₂ → P₂ = ' + p1 + ' × ' + v1 + '/' + v2 + ' = ' + N(p1 * v1 / v2) + ' atm.', d);
    var t1 = R(200, 400), t2 = R(200, 500);
    return numQ('A gas at ' + t1 + ' K occupies ' + v1 + ' L. At constant pressure, find the volume at ' + t2 + ' K.',
      v1 * t2 / t1, 'L', 'Charles’s law: V₁/T₁ = V₂/T₂ → V₂ = ' + v1 + ' × ' + t2 + '/' + t1 + ' = ' + N(v1 * t2 / t1) + ' L.', 3);
  };

  G.ph = function (d) {
    var p = R(1, 13);
    if (d === 1) return mk('A solution with pH ' + p + ' is:', p < 7 ? 'Acidic' : p > 7 ? 'Basic' : 'Neutral',
      ['Neutral', 'Basic', 'Acidic'].filter(function (x) { return x !== (p < 7 ? 'Acidic' : p > 7 ? 'Basic' : 'Neutral'); }).concat(['Amphoteric']),
      'pH below 7 is acidic, above 7 basic, exactly 7 neutral.', 1);
    if (d === 2) {
      var k = R(1, 6);
      return numQ('Find the pH of a solution with [H⁺] = 1 × 10⁻' + k + ' M.', k, '',
        'pH = −log[H⁺] = −log(10⁻' + k + ') = ' + k + '.', 2);
    }
    var poh = R(1, 6);
    return numQ('A solution has pOH = ' + poh + '. Find its pH at 25 °C.', 14 - poh, '',
      'pH + pOH = 14, so pH = 14 − ' + poh + ' = ' + (14 - poh) + '.', 3);
  };

  G.kinetics = function (d) {
    var hl = R(5, 60);
    if (d <= 2) return numQ('For a first-order reaction with half-life ' + hl + ' minutes, find the rate constant k (use k = 0.693/t½).',
      0.693 / hl, 'min⁻¹', 'k = 0.693/t½ = 0.693/' + hl + ' = ' + N(0.693 / hl) + ' min⁻¹.', d);
    var n = R(2, 5);
    return numQ('A first-order reaction has a half-life of ' + hl + ' minutes. What percentage of the reactant remains after ' + (n * hl) + ' minutes?',
      100 / Math.pow(2, n), '%', 'After ' + n + ' half-lives, remaining = 100/2^' + n + ' = ' + N(100 / Math.pow(2, n)) + '%.', 3);
  };

  G.electrochem = function (d) {
    var set = [
      ['In electrolysis, oxidation occurs at the:', 'Anode', ['Cathode', 'Salt bridge', 'Electrolyte'], 'Oxidation always occurs at the anode.'],
      ['The SI unit of electric charge used in Faraday’s laws is the:', 'Coulomb', ['Ampere', 'Volt', 'Ohm'], 'Charge Q = It is measured in coulombs.'],
      ['One faraday is approximately:', '96500 C', ['6500 C', '1000 C', '9650 C'], 'The charge on one mole of electrons.'],
      ['In a galvanic cell, electrons flow from:', 'Anode to cathode through the external circuit', ['Cathode to anode externally', 'Salt bridge to anode', 'Cathode to salt bridge'], 'The anode is negative in a galvanic cell.']
    ];
    if (d === 3) {
      var I = R(1, 10), t = R(10, 120);
      return numQ('A current of ' + I + ' A flows for ' + t + ' minutes. Find the charge passed.', I * t * 60, 'C',
        'Q = It = ' + I + ' × ' + (t * 60) + ' s = ' + (I * t * 60) + ' C.', 3);
    }
    var s = pick(set);
    return mk(s[0], s[1], s[2], s[3], d);
  };

  /* ======================================================================
     COMPUTER
     ====================================================================== */
  G.basecon = function (d) {
    var n = d === 1 ? R(4, 31) : d === 2 ? R(32, 255) : R(256, 4095);
    var to = d === 3 ? pick(['binary', 'hexadecimal', 'octal']) : pick(['binary', 'octal']);
    var base = to === 'binary' ? 2 : to === 'octal' ? 8 : 16;
    var ans = n.toString(base).toUpperCase();
    return mk('Convert the decimal number ' + n + ' into ' + to + '.', ans,
      [(n + 1).toString(base).toUpperCase(), (n - 1).toString(base).toUpperCase(), n.toString(base === 2 ? 8 : 2).toUpperCase()],
      'Repeatedly dividing ' + n + ' by ' + base + ' and reading the remainders upward gives ' + ans + '.', d);
  };

  G.binarith = function (d) {
    var a = R(3, d === 3 ? 120 : 30), b = R(3, d === 3 ? 120 : 30);
    var op = d === 1 ? '+' : pick(['+', '−']);
    if (op === '−' && b > a) { var t = a; a = b; b = t; }
    var res = op === '+' ? a + b : a - b;
    return mk('Evaluate in binary: ' + a.toString(2) + ' ' + op + ' ' + b.toString(2),
      res.toString(2),
      [(res + 1).toString(2), (res + 2).toString(2), (res * 2).toString(2), (res + 4).toString(2), (res + 8).toString(2)],
      'In decimal this is ' + a + ' ' + op + ' ' + b + ' = ' + res + ', which is ' + res.toString(2) + ' in binary.', d);
  };

  G.boolean = function (d) {
    var set = [
      ['The output of an AND gate is 1 only when:', 'All inputs are 1', ['Any input is 1', 'All inputs are 0', 'Inputs are different'], 'AND returns 1 only for an all-1 input.'],
      ['Simplify the Boolean expression A + A·B.', 'A', ['B', 'A·B', 'A + B'], 'By the absorption law, A + AB = A(1 + B) = A.'],
      ['Which gate is known as the universal gate?', 'NAND', ['AND', 'OR', 'XOR'], 'Any logic function can be built from NAND gates alone (NOR also qualifies).'],
      ['The output of an XOR gate is 1 when:', 'The inputs are different', ['Both inputs are 1', 'Both inputs are 0', 'Any input is 1'], 'XOR detects inequality of inputs.'],
      ['According to De Morgan’s theorem, (A·B)′ equals:', 'A′ + B′', ['A′·B′', 'A + B', '(A + B)′'], 'The complement of a product is the sum of complements.'],
      ['The Boolean expression A + A′ simplifies to:', '1', ['0', 'A', 'A′'], 'A variable OR its complement is always true.'],
      ['How many rows are there in the truth table of a 4-variable function?', '16', ['8', '4', '32'], '2⁴ = 16 rows.']
    ];
    var s = pick(set);
    return mk(s[0], s[1], s[2], s[3], d === 1 ? 1 : d);
  };

  G.complexity = function (d) {
    var set = [
      ['What is the time complexity of binary search on a sorted array of n elements?', 'O(log n)', ['O(n)', 'O(n log n)', 'O(1)'], 'The search space halves each step.'],
      ['What is the average time complexity of merge sort?', 'O(n log n)', ['O(n²)', 'O(n)', 'O(log n)'], 'log n levels of merging, each costing O(n).'],
      ['What is the time complexity of linear search in the worst case?', 'O(n)', ['O(log n)', 'O(1)', 'O(n²)'], 'Every element may need to be checked.'],
      ['What is the worst-case complexity of insertion sort?', 'O(n²)', ['O(n log n)', 'O(n)', 'O(log n)'], 'A reverse-sorted input forces n²/2 shifts.'],
      ['What is the time complexity of accessing an element in an array by index?', 'O(1)', ['O(n)', 'O(log n)', 'O(n log n)'], 'Address arithmetic takes constant time.'],
      ['The recurrence T(n) = 2T(n/2) + n solves to:', 'O(n log n)', ['O(n)', 'O(n²)', 'O(log n)'], 'By the Master theorem, case 2.'],
      ['What is the space complexity of a recursive factorial function for input n?', 'O(n)', ['O(1)', 'O(log n)', 'O(n²)'], 'The call stack grows linearly with n.']
    ];
    var s = pick(set);
    return mk(s[0], s[1], s[2], s[3], d === 3 ? 3 : 2);
  };

  C.GEN = G;
  C.util = { R: R, pick: pick, shuffle: shuffle, N: N, gcd: gcd, nCr: nCr, fact: fact };
})(window);

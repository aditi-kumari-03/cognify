/* ==========================================================================
   COGNIFY · exams.js
   Exam patterns, subject → topic maps, and all static site copy.
   Exposes window.COGNIFY.data
   ========================================================================== */
(function (w) {
  'use strict';
  var C = (w.COGNIFY = w.COGNIFY || {});

  /* ---------------------------------------------------------------
     TOPIC CATALOGUE
     kind 'gen'  → procedural generator registered in generators.js
     kind 'bank' → static question pool in bank.js
     --------------------------------------------------------------- */
  var TOPICS = {
    /* ---- quantitative / mathematics ---- */
    simplification:  { name: 'Simplification & BODMAS',      kind: 'gen' },
    numsys:          { name: 'Number System',                kind: 'gen' },
    hcflcm:          { name: 'HCF & LCM',                    kind: 'gen' },
    pct:             { name: 'Percentage',                   kind: 'gen' },
    ratio:           { name: 'Ratio & Proportion',           kind: 'gen' },
    average:         { name: 'Average',                      kind: 'gen' },
    ages:            { name: 'Problems on Ages',             kind: 'gen' },
    profitloss:      { name: 'Profit, Loss & Discount',      kind: 'gen' },
    si:              { name: 'Simple Interest',              kind: 'gen' },
    ci:              { name: 'Compound Interest',            kind: 'gen' },
    partnership:     { name: 'Partnership',                  kind: 'gen' },
    mixture:         { name: 'Mixture & Alligation',         kind: 'gen' },
    timework:        { name: 'Time & Work',                  kind: 'gen' },
    pipes:           { name: 'Pipes & Cisterns',             kind: 'gen' },
    tsd:             { name: 'Time, Speed & Distance',       kind: 'gen' },
    trains:          { name: 'Problems on Trains',           kind: 'gen' },
    boats:           { name: 'Boats & Streams',              kind: 'gen' },
    mensuration2d:   { name: 'Mensuration (2D)',             kind: 'gen' },
    mensuration3d:   { name: 'Mensuration (3D)',             kind: 'gen' },
    di:              { name: 'Data Interpretation',          kind: 'gen' },
    statistics:      { name: 'Statistics',                   kind: 'gen' },
    permutation:     { name: 'Permutations',                 kind: 'gen' },
    combination:     { name: 'Combinations',                 kind: 'gen' },
    probability:     { name: 'Probability',                  kind: 'gen' },
    quadratic:       { name: 'Quadratic Equations',          kind: 'gen' },
    ap:              { name: 'Arithmetic Progression',       kind: 'gen' },
    gp:              { name: 'Geometric Progression',        kind: 'gen' },
    logarithm:       { name: 'Logarithms',                   kind: 'gen' },
    surds:           { name: 'Surds & Indices',              kind: 'gen' },
    binomial:        { name: 'Binomial Theorem',             kind: 'gen' },
    complex:         { name: 'Complex Numbers',              kind: 'gen' },
    matrix:          { name: 'Matrices & Determinants',      kind: 'gen' },
    sets:            { name: 'Sets & Venn Diagrams',         kind: 'gen' },
    functions:       { name: 'Relations & Functions',        kind: 'gen' },
    trig:            { name: 'Trigonometry',                 kind: 'gen' },
    heights:         { name: 'Heights & Distances',          kind: 'gen' },
    straightline:    { name: 'Straight Lines',               kind: 'gen' },
    circlegeom:      { name: 'Circles (Coordinate)',         kind: 'gen' },
    conic:           { name: 'Conic Sections',               kind: 'gen' },
    vectors:         { name: 'Vectors & 3D Geometry',        kind: 'gen' },
    limits:          { name: 'Limits & Continuity',          kind: 'gen' },
    derivative:      { name: 'Differentiation',              kind: 'gen' },
    application_der: { name: 'Application of Derivatives',   kind: 'gen' },
    integral:        { name: 'Integration',                  kind: 'gen' },
    diffeq:          { name: 'Differential Equations',       kind: 'gen' },
    geometry_basic:  { name: 'Lines, Angles & Triangles',    kind: 'bank' },
    algebra_basic:   { name: 'Basic Algebra',                kind: 'gen' },
    linear_eq:       { name: 'Linear Equations',             kind: 'gen' },
    fractions:       { name: 'Fractions & Decimals',         kind: 'gen' },
    integers:        { name: 'Integers',                     kind: 'gen' },
    unitary:         { name: 'Unitary Method',               kind: 'gen' },

    /* ---- reasoning ---- */
    numseries:       { name: 'Number Series',                kind: 'gen' },
    letterseries:    { name: 'Letter & Alphabet Series',     kind: 'gen' },
    coding:          { name: 'Coding–Decoding',              kind: 'gen' },
    bloodrel:        { name: 'Blood Relations',              kind: 'gen' },
    direction:       { name: 'Direction Sense',              kind: 'gen' },
    ranking:         { name: 'Order & Ranking',              kind: 'gen' },
    clock:           { name: 'Clocks',                       kind: 'gen' },
    calendar:        { name: 'Calendars',                    kind: 'gen' },
    analogy:         { name: 'Analogy',                      kind: 'bank' },
    oddone:          { name: 'Odd One Out',                  kind: 'bank' },
    syllogism:       { name: 'Syllogism',                    kind: 'bank' },
    seating:         { name: 'Seating Arrangement',          kind: 'bank' },
    statement_arg:   { name: 'Statement & Conclusion',       kind: 'bank' },
    puzzle_misc:     { name: 'Mixed Puzzles',                kind: 'bank' },
    nonverbal:       { name: 'Non-Verbal Reasoning',         kind: 'bank' },

    /* ---- physics ---- */
    units_dim:       { name: 'Units & Dimensions',           kind: 'gen' },
    kinematics:      { name: 'Kinematics',                   kind: 'gen' },
    projectile:      { name: 'Projectile Motion',            kind: 'gen' },
    laws_motion:     { name: 'Laws of Motion',               kind: 'gen' },
    work_energy:     { name: 'Work, Energy & Power',         kind: 'gen' },
    circular:        { name: 'Circular Motion',              kind: 'gen' },
    rotational:      { name: 'Rotational Motion',            kind: 'gen' },
    gravitation:     { name: 'Gravitation',                  kind: 'gen' },
    fluids:          { name: 'Fluid Mechanics',              kind: 'gen' },
    thermo_phy:      { name: 'Heat & Thermodynamics',        kind: 'gen' },
    shm:             { name: 'Simple Harmonic Motion',       kind: 'gen' },
    waves:           { name: 'Waves & Sound',                kind: 'gen' },
    electrostatics:  { name: 'Electrostatics',               kind: 'gen' },
    current_elec:    { name: 'Current Electricity',          kind: 'gen' },
    magnetism:       { name: 'Magnetism & EMI',              kind: 'gen' },
    optics:          { name: 'Ray & Wave Optics',            kind: 'gen' },
    modern_phy:      { name: 'Modern Physics',               kind: 'gen' },
    phy_concepts:    { name: 'Physics Concepts',             kind: 'bank' },

    /* ---- chemistry ---- */
    mole:            { name: 'Mole Concept',                 kind: 'gen' },
    concentration:   { name: 'Solutions & Concentration',    kind: 'gen' },
    gaslaws:         { name: 'Gaseous State',                kind: 'gen' },
    ph:              { name: 'Ionic Equilibrium & pH',       kind: 'gen' },
    kinetics:        { name: 'Chemical Kinetics',            kind: 'gen' },
    electrochem:     { name: 'Electrochemistry',             kind: 'gen' },
    atomic:          { name: 'Atomic Structure',             kind: 'bank' },
    periodic:        { name: 'Periodic Table',               kind: 'bank' },
    bonding:         { name: 'Chemical Bonding',             kind: 'bank' },
    organic:         { name: 'Organic Chemistry',            kind: 'bank' },
    inorganic:       { name: 'Inorganic Chemistry',          kind: 'bank' },
    chem_concepts:   { name: 'Chemistry Concepts',           kind: 'bank' },

    /* ---- biology / science ---- */
    bio_cell:        { name: 'Cell & Cell Division',         kind: 'bank' },
    bio_human:       { name: 'Human Physiology',             kind: 'bank' },
    bio_plant:       { name: 'Plant Biology',                kind: 'bank' },
    bio_genetics:    { name: 'Genetics & Evolution',         kind: 'bank' },
    bio_ecology:     { name: 'Ecology & Environment',        kind: 'bank' },
    gen_science:     { name: 'General Science',              kind: 'bank' },

    /* ---- computer ---- */
    basecon:         { name: 'Number Base Conversion',       kind: 'gen' },
    binarith:        { name: 'Binary Arithmetic',            kind: 'gen' },
    boolean:         { name: 'Boolean Algebra & Logic Gates',kind: 'gen' },
    comp_fund:       { name: 'Computer Fundamentals',        kind: 'bank' },
    comp_office:     { name: 'MS Office & Shortcuts',        kind: 'bank' },
    comp_net:        { name: 'Networking & Internet',        kind: 'bank' },
    comp_security:   { name: 'Cyber Security',               kind: 'bank' },
    ds_algo:         { name: 'Data Structures & Algorithms', kind: 'bank' },
    os_topic:        { name: 'Operating Systems',            kind: 'bank' },
    dbms:            { name: 'DBMS',                         kind: 'bank' },
    toc:             { name: 'Theory of Computation',        kind: 'bank' },
    coa:             { name: 'Computer Organisation',        kind: 'bank' },
    cn_topic:        { name: 'Computer Networks',            kind: 'bank' },
    programming:     { name: 'Programming in C',             kind: 'bank' },
    complexity:      { name: 'Time Complexity',              kind: 'gen' },

    /* ---- english ---- */
    synonyms:        { name: 'Synonyms',                     kind: 'bank' },
    antonyms:        { name: 'Antonyms',                     kind: 'bank' },
    error_spot:      { name: 'Spotting Errors',              kind: 'bank' },
    fill_blanks:     { name: 'Fill in the Blanks',           kind: 'bank' },
    idioms:          { name: 'Idioms & Phrases',             kind: 'bank' },
    one_word:        { name: 'One Word Substitution',        kind: 'bank' },
    spelling:        { name: 'Spelling Check',               kind: 'bank' },
    sentence_imp:    { name: 'Sentence Improvement',         kind: 'bank' },
    grammar:         { name: 'Grammar & Usage',              kind: 'bank' },
    voice_speech:    { name: 'Voice & Narration',            kind: 'bank' },
    para_jumble:     { name: 'Para Jumbles',                 kind: 'bank' },
    comprehension:   { name: 'Reading Comprehension',        kind: 'bank' },

    /* ---- awareness ---- */
    gk_history:      { name: 'Indian History',               kind: 'bank' },
    gk_polity:       { name: 'Polity & Constitution',        kind: 'bank' },
    gk_geo:          { name: 'Geography',                    kind: 'bank' },
    gk_eco:          { name: 'Economy',                      kind: 'bank' },
    gk_static:       { name: 'Static GK',                    kind: 'bank' },
    gk_sports:       { name: 'Sports & Awards',              kind: 'bank' },
    banking_aware:   { name: 'Banking Awareness',            kind: 'bank' },
    railway_gk:      { name: 'Railway Awareness',            kind: 'bank' },
    social_science:  { name: 'Social Science',               kind: 'bank' }
  };

  /* ---------------------------------------------------------------
     REUSABLE TOPIC BUNDLES
     --------------------------------------------------------------- */
  var QUANT_CORE = ['simplification','numsys','hcflcm','pct','ratio','average','ages','profitloss','si','ci',
    'partnership','mixture','timework','pipes','tsd','trains','boats','mensuration2d','mensuration3d','di','statistics'];

  var REASONING_CORE = ['numseries','letterseries','coding','bloodrel','direction','ranking','clock','calendar',
    'analogy','oddone','syllogism','seating','statement_arg','puzzle_misc','nonverbal'];

  var ENGLISH_CORE = ['synonyms','antonyms','error_spot','fill_blanks','idioms','one_word','spelling',
    'sentence_imp','grammar','voice_speech','para_jumble','comprehension'];

  var ADV_MATH = ['permutation','combination','probability','quadratic','ap','gp','logarithm','surds','binomial',
    'complex','matrix','sets','functions','trig','straightline','circlegeom','conic','vectors','limits',
    'derivative','application_der','integral','diffeq','statistics'];

  var PHYSICS_FULL = ['units_dim','kinematics','projectile','laws_motion','work_energy','circular','rotational',
    'gravitation','fluids','thermo_phy','shm','waves','electrostatics','current_elec','magnetism','optics',
    'modern_phy','phy_concepts'];

  var CHEM_FULL = ['mole','concentration','gaslaws','ph','kinetics','electrochem','atomic','periodic','bonding',
    'organic','inorganic','chem_concepts'];

  var BIO_FULL = ['bio_cell','bio_human','bio_plant','bio_genetics','bio_ecology'];

  /* ---------------------------------------------------------------
     EXAMS
     --------------------------------------------------------------- */
  var EXAMS = [
    {
      id: 'nimcet', abbr: 'NIMCET', full: 'NIT MCA Common Entrance Test',
      tag: 'MCA', blurb: '120 questions · 2 hours · +4 / −1. Mathematics carries half the paper.',
      levels: ['Foundation', 'Exam level', 'Advanced'], defaultLevel: 1,
      marks: 4, negative: 1, perQ: 1,
      subjects: {
        'Mathematics': ['sets','functions','complex','quadratic','ap','gp','logarithm','surds','binomial','matrix',
                        'permutation','combination','probability','trig','straightline','circlegeom','conic','vectors',
                        'limits','derivative','application_der','integral','diffeq','statistics','pct','ratio','average'],
        'Logical Reasoning': REASONING_CORE,
        'Computer Awareness': ['basecon','binarith','boolean','comp_fund','comp_office','comp_net','comp_security','ds_algo','os_topic','programming'],
        'General English': ENGLISH_CORE
      }
    },
    {
      id: 'jee', abbr: 'JEE Main', full: 'Joint Entrance Examination (Main) — B.E./B.Tech',
      tag: 'Engineering', blurb: '75 questions · 3 hours · +4 / −1 across Physics, Chemistry and Mathematics.',
      levels: ['Class 11', 'Class 12', 'Full syllabus'], defaultLevel: 2,
      marks: 4, negative: 1, perQ: 2.4,
      subjects: {
        'Physics': PHYSICS_FULL,
        'Chemistry': CHEM_FULL,
        'Mathematics': ADV_MATH.concat(['mensuration3d'])
      }
    },
    {
      id: 'neet', abbr: 'NEET UG', full: 'National Eligibility cum Entrance Test (UG)',
      tag: 'Medical', blurb: '180 questions · 200 minutes · +4 / −1. Biology is 50% of the paper.',
      levels: ['Class 11', 'Class 12', 'Full syllabus'], defaultLevel: 2,
      marks: 4, negative: 1, perQ: 1.1,
      subjects: {
        'Physics': PHYSICS_FULL,
        'Chemistry': CHEM_FULL,
        'Biology': BIO_FULL.concat(['gen_science'])
      }
    },
    {
      id: 'gate', abbr: 'GATE', full: 'Graduate Aptitude Test in Engineering (CS & IT)',
      tag: 'PG / PSU', blurb: '65 questions · 3 hours · 1 and 2 mark questions with 1/3 negative marking.',
      levels: ['Core', 'Exam level', 'Advanced'], defaultLevel: 1,
      marks: 2, negative: 0.67, perQ: 2.8,
      subjects: {
        'General Aptitude': ['pct','ratio','average','numseries','direction','bloodrel','analogy','oddone','di','statistics','grammar','synonyms','error_spot'],
        'Engineering Mathematics': ['matrix','probability','statistics','limits','derivative','integral','diffeq','vectors','sets','functions','complex','permutation','combination'],
        'Computer Science & IT': ['ds_algo','os_topic','dbms','toc','coa','cn_topic','programming','complexity','boolean','basecon','binarith']
      }
    },
    {
      id: 'ssc', abbr: 'SSC', full: 'Staff Selection Commission (CGL / CHSL / MTS)',
      tag: 'Government', blurb: '100 questions · 60 minutes · +2 / −0.5 across four equal sections.',
      levels: ['MTS / CHSL', 'CGL Tier-I', 'CGL Tier-II'], defaultLevel: 1,
      marks: 2, negative: 0.5, perQ: 0.6,
      subjects: {
        'Quantitative Aptitude': QUANT_CORE.concat(['geometry_basic','trig','heights','algebra_basic']),
        'General Intelligence & Reasoning': REASONING_CORE,
        'English Comprehension': ENGLISH_CORE,
        'General Awareness': ['gk_history','gk_polity','gk_geo','gk_eco','gk_static','gk_sports','gen_science','comp_fund']
      }
    },
    {
      id: 'banking', abbr: 'Banking', full: 'IBPS / SBI PO & Clerk',
      tag: 'Banking', blurb: 'Prelims 100 questions · 60 minutes · +1 / −0.25, sectional timing.',
      levels: ['Clerk / Prelims', 'PO Prelims', 'PO Mains'], defaultLevel: 1,
      marks: 1, negative: 0.25, perQ: 0.6,
      subjects: {
        'Quantitative Aptitude': QUANT_CORE.concat(['quadratic','permutation','combination','probability']),
        'Reasoning Ability': REASONING_CORE,
        'English Language': ENGLISH_CORE,
        'General & Banking Awareness': ['banking_aware','gk_eco','gk_polity','gk_static','gk_sports','gk_history','gk_geo'],
        'Computer Aptitude': ['comp_fund','comp_office','comp_net','comp_security','basecon','ds_algo']
      }
    },
    {
      id: 'railway', abbr: 'RRB', full: 'Railway Recruitment Board (NTPC / Group D / ALP)',
      tag: 'Railways', blurb: '100 questions · 90 minutes · +1 / −1/3. General Science matters here.',
      levels: ['Group D', 'NTPC', 'ALP / Technician'], defaultLevel: 1,
      marks: 1, negative: 0.33, perQ: 0.9,
      subjects: {
        'Mathematics': QUANT_CORE.concat(['geometry_basic','trig','algebra_basic']),
        'General Intelligence & Reasoning': REASONING_CORE,
        'General Science': ['gen_science','phy_concepts','chem_concepts','bio_human','bio_cell','bio_ecology'],
        'General Awareness': ['gk_history','gk_polity','gk_geo','gk_eco','gk_static','gk_sports','railway_gk','comp_fund']
      }
    },
    {
      id: 'cat', abbr: 'CAT', full: 'Common Admission Test (MBA)',
      tag: 'MBA', blurb: '66 questions · 120 minutes · +3 / −1. Three sections, 40 minutes each.',
      levels: ['Foundation', 'Exam level', 'Advanced'], defaultLevel: 1,
      marks: 3, negative: 1, perQ: 1.8,
      subjects: {
        'Quantitative Ability': QUANT_CORE.concat(['quadratic','ap','gp','logarithm','surds','permutation','combination','probability','functions','geometry_basic']),
        'Data Interpretation & LR': ['di','statistics','seating','puzzle_misc','ranking','numseries','syllogism','direction','bloodrel','sets'],
        'Verbal Ability & RC': ENGLISH_CORE
      }
    },
    {
      id: 'nda', abbr: 'NDA', full: 'National Defence Academy & Naval Academy',
      tag: 'Defence', blurb: 'Mathematics 120 Q (+2.5 / −0.83) and GAT 150 Q (+4 / −1.33).',
      levels: ['Foundation', 'Exam level', 'Advanced'], defaultLevel: 1,
      marks: 2.5, negative: 0.83, perQ: 1.25,
      subjects: {
        'Mathematics': ADV_MATH.concat(QUANT_CORE),
        'General Ability — English': ENGLISH_CORE,
        'General Ability — Science': ['phy_concepts','chem_concepts','gen_science','bio_human','bio_cell'],
        'General Ability — GK': ['gk_history','gk_polity','gk_geo','gk_eco','gk_static','gk_sports']
      }
    },
    {
      id: 'cuet', abbr: 'CUET', full: 'Common University Entrance Test (UG)',
      tag: 'UG Admission', blurb: 'Domain subjects + General Test · +5 / −1 per question.',
      levels: ['Class 11', 'Class 12', 'Full syllabus'], defaultLevel: 2,
      marks: 5, negative: 1, perQ: 1,
      subjects: {
        'General Test': QUANT_CORE.concat(REASONING_CORE, ['gk_history','gk_polity','gk_geo','gk_static','gen_science']),
        'Mathematics': ADV_MATH,
        'Physics': PHYSICS_FULL,
        'Chemistry': CHEM_FULL,
        'Biology': BIO_FULL,
        'English': ENGLISH_CORE
      }
    },
    {
      id: 'school', abbr: 'School', full: 'CBSE / ICSE / State Board — Classes 6 to 12',
      tag: 'Classes 6–12', blurb: 'Chapter-wise practice sheets tuned to the class you pick.',
      levels: ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'], defaultLevel: 4,
      marks: 1, negative: 0, perQ: 1.5,
      subjects: {
        'Mathematics': ['integers','fractions','unitary','pct','ratio','average','profitloss','si','ci','algebra_basic',
                        'linear_eq','quadratic','ap','gp','geometry_basic','mensuration2d','mensuration3d','trig',
                        'heights','statistics','probability','sets','functions','matrix','limits','derivative','integral','straightline'],
        'Science': ['gen_science','phy_concepts','chem_concepts','bio_cell','bio_human','bio_plant','bio_ecology'],
        'Physics': PHYSICS_FULL,
        'Chemistry': CHEM_FULL,
        'Biology': BIO_FULL,
        'English': ENGLISH_CORE,
        'Social Science': ['gk_history','gk_polity','gk_geo','gk_eco','social_science'],
        'Computer Science': ['comp_fund','comp_office','comp_net','comp_security','basecon','binarith','boolean','programming','ds_algo']
      }
    }
  ];

  /* ---------------------------------------------------------------
     FEATURE SLIDES (cards + overlay slider share this)
     --------------------------------------------------------------- */
  var FEATURES = [
    {
      icon: 'spark', title: 'Infinite question engine',
      short: 'Over 85 topic generators compose questions with fresh numbers, so the same settings never give you the same paper twice.',
      body: 'Most worksheet sites hand you the same stale PDF. COGNIFY builds every question at the moment you ask for it — numbers, names, options and the correct answer are composed together, then the options are shuffled.',
      points: ['85+ procedural topic engines across Maths, Reasoning, Physics, Chemistry and Computers',
               'Distractors are built from realistic mistakes, not random noise',
               'Hit “New set, same settings” for an unlimited supply of practice'],
      art: 'spark'
    },
    {
      icon: 'target', title: 'Real exam patterns',
      short: 'Eleven exam blueprints — NIMCET, JEE, NEET, GATE, SSC, Banking, Railway, CAT, NDA, CUET and school boards.',
      body: 'Each exam carries its own subject list, marks per question, negative marking and pacing. Pick NIMCET and you get Mathematics, Logical Reasoning, Computer Awareness and English with +4 / −1. Pick SSC and the clock tightens to roughly 36 seconds a question.',
      points: ['Marking scheme and suggested time auto-fill from the exam',
               'Subject lists mirror the official pattern',
               'School mode covers classes 6 to 12 chapter-wise'],
      art: 'target'
    },
    {
      icon: 'chat', title: 'A chatbot that builds the sheet',
      short: 'The floating bot asks for exam, class, subject and question count, then drops the worksheet straight onto the page.',
      body: 'Tap the bubble in the bottom-right corner. It walks you through exam → class → subject → count → difficulty with tap-to-answer chips, confirms the plan, and generates. No form filling needed — and everything it chooses is mirrored back into the builder.',
      points: ['Tap-to-answer chips, or just type “20 moderate questions on probability for JEE”',
               'Switch to “Ask anything” for syllabus, strategy and pattern questions',
               'Optional: plug in an API key to run a full Claude model'],
      art: 'chat'
    },
    {
      icon: 'key', title: 'Answer key + worked solutions',
      short: 'Every sheet can carry a compact answer grid and a step-by-step solution for each question.',
      body: 'Solutions explain the route, not just the result — the formula used, the substitution and the answer. Hide the key while you attempt, reveal it when you are done, or export a key-only file for a teacher.',
      points: ['One-tap hide / reveal while practising',
               'Answer key exports as its own file',
               'Solutions print on a separate page so the sheet stays clean'],
      art: 'key'
    },
    {
      icon: 'download', title: 'Download in four formats',
      short: 'Print-ready PDF, a self-contained HTML page, plain text, or CSV for your question bank.',
      body: 'The PDF export uses a dedicated print stylesheet — no navigation, no colours bleeding, A4 margins and clean page breaks. HTML gives you an offline copy with styling baked in. CSV drops straight into Excel or Google Sheets.',
      points: ['A4 print layout with page-break-safe questions',
               'HTML export works offline with zero dependencies',
               'CSV includes question, options, answer and solution columns'],
      art: 'download'
    },
    {
      icon: 'slider', title: 'Dial in the difficulty',
      short: 'Easy, Moderate, Advanced or Mixed — and the numbers, not just the labels, actually change.',
      body: 'Difficulty is baked into the generators. Easy keeps values small and single-step. Advanced pulls in multi-step setups, awkward numbers and the harder variants of each topic. Mixed gives you a realistic spread, the way a real paper does.',
      points: ['Difficulty changes the question, not the wording',
               'Class level further scales school worksheets',
               'Pick specific topics, or let the whole subject mix'],
      art: 'slider'
    },
    {
      icon: 'clock', title: 'Timed, exam-style practice',
      short: 'Suggested time limits are computed from the exam pattern; override them whenever you want.',
      body: 'A 20-question SSC sheet suggests roughly 12 minutes because that is the real pace. The time, total marks and negative marking all print on the sheet so a practice run feels like the real thing.',
      points: ['Auto time limit from the exam’s per-question pace',
               'Total marks and negative marking printed on the header',
               'Optional rough-work ruling under every question'],
      art: 'clock'
    },
    {
      icon: 'wifi', title: 'Works with the Wi-Fi off',
      short: 'No build step, no server, no sign-up. Open the file and it runs.',
      body: 'The whole app is static HTML, CSS and JavaScript. Question generation happens in your browser, so a worksheet takes milliseconds and costs nothing. Your settings are remembered locally between visits.',
      points: ['No account, no tracking, no backend',
               'Settings and chat preferences stored in your own browser',
               'Drop the folder on a pen drive and it still works'],
      art: 'wifi'
    },
    {
      icon: 'layers', title: 'One page, one scroll',
      short: 'Landing, features, exam library, builder and output all live on a single scrolling surface.',
      body: 'No tabs, no page loads, no losing your place. The navigation scroll-spies as you move, the builder sticks its summary beside you, and the generated worksheet appears right where you were looking.',
      points: ['Sticky toolbar follows the worksheet while you read',
               'Scroll-spy navigation and a top progress bar',
               'Fully responsive down to a phone screen'],
      art: 'layers'
    }
  ];

  /* ---------------------------------------------------------------
     FAQ
     --------------------------------------------------------------- */
  var FAQ = [
    ['Where do the questions come from?',
     'Numeric and reasoning questions are composed on the spot by topic engines — the formula is known, so the answer is computed rather than looked up. Conceptual topics (General Awareness, English, Biology, core CS theory) come from a curated static pool. Always cross-check against your official syllabus before relying on a sheet for revision.'],
    ['Will I get the same worksheet twice?',
     'Practically never for numeric topics — values are randomised each run and options are reshuffled. For curated pools, questions are sampled without repetition inside a single sheet.'],
    ['Can I choose specific chapters?',
     'Yes. Pick a subject and the topic chips appear below the form. Tick one or many; leave them all untouched and the whole subject gets mixed.'],
    ['How do I download the worksheet?',
     'Use the Download menu above the sheet. “PDF / Print” opens your browser’s print dialog — choose “Save as PDF”. You can also export a styled HTML page, plain text, or a CSV of the whole question set.'],
    ['Does the answer key have to be on the sheet?',
     'No. Turn off “Include answer key” before generating, or use the Hide answer key button after. There is also a key-only export if you want to keep it separate.'],
    ['What does the chatbot actually do?',
     'Two things. “Worksheet bot” walks you through exam, class, subject, count and difficulty, then generates the sheet for you. “Ask anything” answers syllabus, pattern, marking and strategy questions for every exam listed here, and can trigger a worksheet mid-conversation.'],
    ['Do I need an API key?',
     'No. The assistant ships with an offline brain that handles exam questions, worksheet requests and study planning. Adding an Anthropic API key in the chat settings upgrades free-form conversation to a full Claude model — the key stays in your browser.'],
    ['Is my data stored anywhere?',
     'Only in your own browser. Builder preferences and the optional API key live in localStorage on this device. Nothing is uploaded, and there is no account or analytics.']
  ];

  /* ---------------------------------------------------------------
     STUDY TIPS
     --------------------------------------------------------------- */
  var TIPS = [
    'Attempt the sheet with the answer key hidden and a timer running. Reviewing a timed attempt teaches more than re-reading notes.',
    'For NIMCET, Mathematics is 50 of 120 questions. If your maths accuracy is below 80%, that is where the next 20 marks live.',
    'Negative marking punishes guessing, not attempting. If you can eliminate two options, the expected value turns positive.',
    'Do one 10-question sheet of a weak topic every day for a week. Short and daily beats long and occasional.',
    'In SSC Tier-I you get roughly 36 seconds a question. Practise at that pace, not at a comfortable one.',
    'Keep an error log: topic, why you got it wrong, and the correct route. Re-generate that topic a week later.',
    'For GATE, the 2-mark questions decide the rank. Accuracy on multi-step numericals matters more than coverage.',
    'Banking prelims is a speed test. Simplification and number series should take under 25 seconds each.',
    'Before a mock, do a 15-question warm-up sheet of easy questions. Starting cold costs marks in the first section.',
    'Revise formulas by generating a sheet, not by reading a formula list. Retrieval beats recognition.',
    'For JEE, alternate subjects between sheets. Three physics sheets in a row builds fatigue, not ability.',
    'If a topic takes you more than 2 minutes per question, it is a concept gap, not a speed gap. Go back to the theory first.'
  ];

  C.data = {
    TOPICS: TOPICS,
    EXAMS: EXAMS,
    FEATURES: FEATURES,
    FAQ: FAQ,
    TIPS: TIPS,
    examById: function (id) {
      for (var i = 0; i < EXAMS.length; i++) if (EXAMS[i].id === id) return EXAMS[i];
      return EXAMS[0];
    },
    topicName: function (id) {
      return (TOPICS[id] && TOPICS[id].name) || id;
    }
  };
})(window);

# COGNIFY — Smart Worksheet Generator

A single-page, single-scroll web app that generates exam-patterned practice worksheets for
Indian competitive exams and school classes 6–12, with a floating AI study assistant.

## Running it

No build step, no server, no dependencies. **Double-click `index.html`.**

It works fully offline. If you'd rather serve it, any static server will do:

```bash
python -m http.server 8000     # then open http://localhost:8000
```

##Live Demo
Visit Cognify: [Open Website](https://aditi-kumari-03.github.io/cognify/)


## What's in it

| Section | What it does |
|---|---|
| **Landing / hero** | Headline, live stat counters, animated worksheet mock-up, scrolling exam marquee |
| **Features** | 9 cards; tapping any one opens the **overlay slider** (autoplay, dots, arrows, keyboard ←/→, swipe, Esc) |
| **Exam library** | 11 exam blueprints; tapping one loads it into the builder |
| **Builder** | Exam, class/level, subject, topic chips, question count, difficulty, time limit, answer-key/solution/negative-marking/shuffle toggles, live paper preview |
| **Output** | The generated worksheet, sticky toolbar, hide/show answer key, 5 export formats |
| **How it works / FAQ / Footer** | Steps, accordion, navigation |
| **Chat widget** | Bottom-right floating bubble (bobbing + pulse ring + nudge). Two modes: guided worksheet builder and free-form Q&A |

## The chat widget

Bottom-right corner, animated. Two tabs:

- **Worksheet bot** — asks for exam → class/level → subject → question count → difficulty with
  tap-to-answer chips, confirms the plan, then generates the sheet onto the page and mirrors
  every choice back into the builder form. You can also just type
  `"20 moderate questions on probability for JEE"` and it fills in the slots it can parse.
- **Ask anything** — an offline knowledge base covering exam patterns, marking schemes,
  weightage, pacing, negative-marking maths and study planning for every listed exam.

**Optional real LLM.** The gear icon in the chat header accepts an Anthropic API key. With a key
saved, *Ask anything* calls a Claude model (Sonnet 5 / Opus 5 / Haiku 4.5, selectable) directly
from the browser. The key lives in `localStorage` on your device only and is sent nowhere but the
model provider. Without a key, everything still works — worksheet generation never needs one.

## Exams covered

NIMCET · JEE Main · NEET UG · GATE (CS & IT) · SSC (CGL/CHSL/MTS) · Banking (IBPS/SBI) ·
Railway (RRB NTPC/Group D/ALP) · CAT · NDA · CUET · School (CBSE/ICSE, Classes 6–12)

Each carries its own subject list, marks per question, negative marking and per-question pacing,
so the generated header and suggested time match the real paper.

## How questions are made

- **85 procedural engines** (`assets/js/generators.js`) compose numeric and reasoning questions
  from scratch each run — the formula is known, so the answer is *computed*, not looked up.
  Distractors are built from realistic mistakes, then the options are shuffled. Same settings
  practically never yield the same paper.
- **53 curated pools** (`assets/js/bank.js`) cover topics procedural generation can't do well:
  General Awareness, English, Biology, Chemistry/Physics theory, and CS theory (OS, DBMS, TOC,
  Networks). Sampled without repetition inside a single sheet.
- Difficulty (Easy / Moderate / Advanced / Mixed) changes the *question*, not just the label.
  Class level further scales school worksheets. **Mixed** ramps easy → hard across the sheet.

## Exports

| Format | Notes |
|---|---|
| **PDF / Print** | Dedicated print stylesheet — A4, 14 mm margins, no navigation, page-break-safe questions, solutions on a fresh page. Choose "Save as PDF" in the dialog. |
| **HTML** | Self-contained styled page, zero dependencies, opens offline |
| **TXT** | Plain text with a compact answer grid |
| **CSV** | Question, 4 options, answer and solution columns — opens in Excel/Sheets |
| **Answer key only** | Key + solutions as a separate file |

## Palette

```
#E3FDFD  #CBF1F5  #A6E3E9  #71C9CE  #F9F5F6  #F8E8EE  #FDCEDF  #F2BED1
```

Aqua tones carry structure and primary actions; pink tones carry secondary actions, accents and
alternating sections; `#F9F5F6` is the card/paper surface. Ink colours are darkened members of the
same aqua family so contrast stays readable.

## Files

```
index.html
assets/css/styles.css      design system, layout, print stylesheet
assets/js/exams.js         exam blueprints, topic catalogue, site copy, FAQ, tips
assets/js/bank.js          curated question pools (53 topics)
assets/js/generators.js    procedural question engines (85 topics)
assets/js/engine.js        config → finished worksheet (topic mixing, difficulty, dedupe)
assets/js/render.js        worksheet HTML + TXT/CSV/HTML exports and downloads
assets/js/chat.js          chat widget, guided flow, offline brain, optional Claude API
assets/js/app.js           page wiring: nav, reveals, overlay slider, builder, exports
```
## 🚀 Getting Started

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in your web browser.

## 🎓 Target Audience

- Competitive examination aspirants.
- School and college students.
- Students looking for structured practice materials.


## 🔮 Future Enhancements

- Additional examination categories.
- More subject-wise worksheets.
- Downloadable worksheet formats.
- Performance tracking and progress monitoring.


## Developer
Developed as an educational web application.
  
---
**Cognify — Learn. Practice. Excel.**

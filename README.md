# Brainstormer

Talk into your phone all day. It writes the text, you tap **Submit**, and when you're done it turns the
whole pile of random thoughts into ONE organized build plan you can paste straight into a coding agent.

**Open it:** https://simzy420.github.io/brainstormer/

## How it works

1. **🎙 Talk** — tap the mic, speak, tap again to stop. Tap **Submit thought**. Repeat all day.
   (No speech engine in the browser? Tap the box and use the mic key on your iPhone keyboard.)
2. **📋 Thoughts** — every submission is listed with a time stamp. Edit, reorder, delete, search,
   export/import JSON. Every thought has a **🔊 read back** button: one tap reads *that* thought
   aloud in your chosen language, the row lights up while it talks, tap again to stop. No more
   select-all-then-hit-Speak. Everything lives in `localStorage` on the phone — nothing is uploaded.
3. **🧩 Plan** — press **Build plan**. It splits your rambling into separate points, throws out the
   repeats, sorts each point into top priority / features / fixes / look and feel / data / words /
   rules / open questions, pulls out the must-haves and an acceptance-criteria checklist, and writes
   it as a spec. Then **📋 Copy for an agent** wraps it in a "build exactly this, prove each
   requirement" instruction.

## Why it is shaped this way

- **One self-contained `index.html`** — no build step, no server, no API key, works offline once loaded.
- **Grouping is local and instant** — a keyword-weighted classifier instead of a model call, so the
  plan is deterministic and free. Near-duplicate points are folded together (Jaccard + containment on
  stemmed synonym tokens), so saying the same thing twice does not pad the spec.
- **Nothing is thrown away** — every original thought is appended verbatim at the bottom of the plan.
- **iPhone first** — big tap targets, dark theme, safe-area padding, sticky tabs.

## Files

| file | what |
|---|---|
| `index.html` | the whole app |
| `manifest.json` | add-to-home-screen metadata |
| `icon-180.png`, `icon-512.png` | app icons |

Static GitHub Pages host. Copy it, fork it, do whatever.

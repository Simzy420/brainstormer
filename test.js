/* Headless test for the Brainstormer organizer.
   Extracts the inlined app JS from index.html, runs it against a tiny DOM stub,
   feeds realistic rambling thoughts, builds the plan, and prints it.
   Usage: node test.js            (from the repo root)
*/
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];

function mkEl(id, attrs) {
  return {
    id, value: "", textContent: "", innerHTML: "", checked: false,
    tagName: "DIV", style: {}, dataset: {}, _attrs: attrs || {}, _h: {}, _kids: [],
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
      toggle(c, f) { if (f === undefined) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); } else { f ? this._s.add(c) : this._s.delete(c); } }
    },
    addEventListener(t, f) { (this._h[t] = this._h[t] || []).push(f); },
    getAttribute(k) { return this._attrs[k]; },
    setAttribute(k, v) { this._attrs[k] = v; },
    click() { (this._h.click || []).forEach(f => f.call(this, { target: this })); },
    focus() {}, remove() {}, scrollIntoView() {},
    dispatchEvent(e) { (this._h[e.type] || []).forEach(f => f.call(this, e)); },
    appendChild(c) { this._kids.push(c); return c; },
    querySelectorAll() { return []; }, querySelector() { return null; },
    insertBefore(c) { this._kids.unshift(c); return c; }, removeChild() {}
  };
}

const els = {};
const byId = id => els[id] || (els[id] = mkEl(id));
const tabs = ["capture", "list", "plan"].map(v => mkEl("tab-" + v, { "data-view": v }));

global.document = {
  getElementById: byId,
  querySelectorAll: sel => sel === ".tab" ? tabs : [],
  querySelector: () => null,
  addEventListener: () => {},
  createElement: t => mkEl("", {}),
  body: mkEl("body")
};
global.window = { scrollTo() {}, addEventListener() {} };
global.navigator = { vibrate() {}, language: "en-US" };
global.localStorage = { _d: {}, getItem(k) { return k in this._d ? this._d[k] : null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };

const timers = [];
global.setTimeout = (f) => { timers.push(f); return timers.length; };
global.clearTimeout = () => {};
function flush(n) { let i = 0; while (timers.length && i++ < (n || 80)) { const f = timers.shift(); try { f(); } catch (e) { /* ignore async noise */ } } }

eval(js);
flush();

const THOUGHTS = [
  "ok so the app should be called Grub Radar and it needs to work on my iphone",
  "urgent: the search is broken, it crashes when i type a space",
  "add a big green button at the top that refreshes the balance",
  "the green button needs to be big and bold and dark mode only, make the font bigger",
  "can you make it save everything to localstorage so it works offline",
  "it should refresh the balance automatically every two minutes",
  "add a button that copies the whole list as text",
  "the copy button copy the list as plain text",
  "dont ask me to sign in, keep it password only",
  "it save everything to localstorage and it works offline",
  "is it possible to get directions straight into apple maps",
  "the balance thing is broken it doesnt work when i load the page on safari",
  "i want a list of restaurants sorted by how close they are",
  "prompt should say find food near me, not search restaurants",
  "maybe later do a map view, someday"
];

const ta = byId("text");
THOUGHTS.forEach(t => { ta.value = t; ta.dispatchEvent({ type: "input" }); byId("submit").click(); flush(); });
byId("build").click(); flush();

const strip = h => String(h).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
const plan = strip(byId("planOut").innerHTML);
const plain = byId("planPlain").value;

console.log("=== stats ===\n" + byId("planStats").textContent);
console.log("\n=== section headings ===");
plan.split("\n").filter(l => /^#{1,4} /.test(l)).forEach(l => console.log("  " + l));
const need = ["Top priority", "Features to build", "Fixes", "Rules", "Acceptance criteria", "Open questions"];
const missing = need.filter(n => !plan.includes(n));
console.log("\n=== assertions ===");
console.log("  thoughts stored:", byId("count").textContent);
console.log("  plan chars:", plan.length, "| agent-wrapped chars:", plain.length);
console.log("  missing sections:", missing.length ? missing.join(", ") : "none");
console.log("  urgent flagged first:", /Top priority[\s\S]{0,120}search is broken/.test(plan));
console.log("\n=== plan ===\n" + plan.slice(0, 2400));
if (missing.length) process.exitCode = 1;

/* Sjekking av øvinger: kjøring av JS i sandkasse, sjekkliste for Java/tekst, og endepunkt-tabeller. */
window.Runner = (() => {

  /* ---------- JS: kjør koden i en sandkasse-iframe ---------- */

  const HARNESS = String.raw`
window.__errors = [];
window.addEventListener("error", e => { __errors.push(e.message || String(e.error)); });
window.addEventListener("unhandledrejection", e => { __errors.push("Unhandled rejection: " + (e.reason && e.reason.message || e.reason)); });
window.__logs = [];
const __origLog = console.log.bind(console);
console.log = (...a) => { __logs.push(a.map(x => typeof x === "string" ? x : (() => { try { return JSON.stringify(x); } catch (e) { return String(x); } })()).join(" ")); __origLog(...a); };
const __shadows = new WeakMap();
const __attach = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (init) { const r = __attach.call(this, init); __shadows.set(this, r); return r; };
function shadowOf(el) { return el && (__shadows.get(el) || el.shadowRoot); }
let __fetchHandler = null;
function mockFetch(fn) { __fetchHandler = fn; }
window.fetch = async (url, opts) => {
  if (!__fetchHandler) throw new TypeError("Failed to fetch (ingen server i sandkassen)");
  return __fetchHandler(String(url), opts);
};
function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { "Content-Type": "application/json" } });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function assert(c, m) { if (!c) throw new Error(m || "Påstand feilet"); }
const __tests = [];
function test(name, fn) { __tests.push({ name, fn }); }
/* Simulert Web Worker: koden kjøres i et eget scope uten DOM, meldinger leveres asynkront */
window.__workers = [];
window.Worker = class {
  #l = { message: [] }; #scope;
  constructor(url) {
    __workers.push(this);
    const outer = this;
    const scope = {
      _l: { message: [] },
      addEventListener(t, f) { (this._l[t] = this._l[t] || []).push(f); },
      removeEventListener() {},
      postMessage(d) { setTimeout(() => outer.#dispatch({ data: structuredClone(d) }), 0); },
      set onmessage(f) { this._l.message = [f]; },
      get onmessage() { return this._l.message[0]; },
      importScripts() {}, close() {},
      document: undefined, window: undefined
    };
    scope.self = scope;
    this.#scope = scope;
    try { new Function("scope", "with (scope) {\n" + (window.__workerCode || "") + "\n}")(scope); }
    catch (e) { __errors.push("Worker: " + e.message); }
  }
  addEventListener(t, f) { (this.#l[t] = this.#l[t] || []).push(f); }
  removeEventListener() {}
  set onmessage(f) { this.#l.message = [f]; }
  postMessage(d) { setTimeout(() => (this.#scope._l.message || []).forEach(f => f({ data: structuredClone(d) })), 0); }
  #dispatch(ev) { (this.#l.message || []).forEach(f => f(ev)); }
  terminate() {}
};
`;

  const RUN_TESTS = String.raw`
(async () => {
  const results = [];
  for (const t of __tests) {
    try {
      await Promise.race([t.fn(), sleep(5000).then(() => { throw new Error("Tidsavbrudd (5 s)"); })]);
      results.push({ name: t.name, ok: true });
    } catch (e) {
      results.push({ name: t.name, ok: false, msg: e && e.message ? e.message : String(e) });
    }
  }
  parent.postMessage({ __dat152: window.__runId, results, errors: __errors, logs: __logs.slice(0, 50) }, "*");
})();
`;

  const safe = s => String(s || "").replace(/<\/script/gi, "<\\/script");

  function runJs(ex, code, iframe) {
    return new Promise(resolve => {
      const runId = "r" + Math.random().toString(36).slice(2);
      let main = code, worker = "";
      if (ex.worker) {
        const parts = code.split(/\/\/\s*===\s*worker\.js\s*===/);
        main = parts[0];
        worker = parts[1] || "";
      }
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:system-ui,sans-serif;font-size:14px;margin:8px;color:#1c2230;background:#fff}</style></head><body>
<script>window.__runId=${JSON.stringify(runId)};window.__workerCode=${JSON.stringify(worker).replace(/<\/script/gi, "<\\/script")};<\/script>
<script>${safe(HARNESS)}<\/script>
${ex.setup ? `<script>${safe(ex.setup)}<\/script>` : ""}
<script>${safe(main)}<\/script>
<script>${safe(ex.tests)}\n${safe(RUN_TESTS)}<\/script>
</body></html>`;
      let done = false;
      const onMsg = (e) => {
        if (!e.data || e.data.__dat152 !== runId) return;
        done = true;
        window.removeEventListener("message", onMsg);
        resolve(e.data);
      };
      window.addEventListener("message", onMsg);
      iframe.srcdoc = html;
      setTimeout(() => {
        if (!done) {
          window.removeEventListener("message", onMsg);
          resolve({ results: [{ name: "Kjøring", ok: false, msg: "Koden svarte ikke innen 40 s (uendelig løkke?)" }], errors: [], logs: [] });
        }
      }, 40000);
    });
  }

  /* ---------- Sjekkliste (regex) ---------- */

  function stripJavaComments(code) {
    return code.replace(/("(?:\\.|[^"\\\n])*")|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (m, str) => str || "");
  }

  function methodChunks(code) {
    const lines = code.split("\n");
    const starts = [];
    lines.forEach((l, i) => {
      if (/^\s*(public|private|protected)\s+(?!class\b|interface\b)[\w<>\[\],\s?]+\s+\w+\s*\(/.test(l)) {
        let s = i;
        while (s > 0 && /^\s*(@|$)/.test(lines[s - 1]) && !(starts.length && s - 1 <= starts[starts.length - 1])) s--;
        starts.push(s);
      }
    });
    if (!starts.length) return [code];
    return starts.map((s, k) => lines.slice(s, k + 1 < starts.length ? starts[k + 1] : lines.length).join("\n"));
  }

  function parseProps(text) {
    const sections = [];
    let cur = null;
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      const m = /^#\s*(\S*messages?\S*|\S+\.properties)/i.exec(line);
      if (m) { cur = { name: m[1], keys: new Set() }; sections.push(cur); continue; }
      if (!line || line.startsWith("#") || line.startsWith("!")) continue;
      const kv = /^([^=:\s]+)\s*[=:]/.exec(line);
      if (kv) {
        if (!cur) { cur = { name: "(uten navn)", keys: new Set() }; sections.push(cur); }
        cur.keys.add(kv[1]);
      }
    }
    return sections;
  }

  const CUSTOM = {
    propsKeysMatch(text) {
      const s = parseProps(text);
      if (s.length < 2) return { ok: false, hint: "Fant ikke to filer – bruk kommentarlinjer som # messages_en.properties" };
      const [a, b] = s;
      const missingB = [...a.keys].filter(k => !b.keys.has(k));
      const missingA = [...b.keys].filter(k => !a.keys.has(k));
      if (!a.keys.size) return { ok: false, hint: "Ingen nøkler funnet" };
      if (missingA.length || missingB.length) return { ok: false, hint: "Ulike nøkler: " + [...missingB, ...missingA].slice(0, 6).join(", ") };
      return { ok: true };
    },
    propsMinKeys8(text) { const s = parseProps(text); const n = s.length ? Math.min(...s.map(x => x.keys.size)) : 0; return { ok: n >= 8, hint: `Fant ${n} nøkler i minste fil` }; },
    propsMinKeys6(text) { const s = parseProps(text); const n = s.length ? Math.min(...s.map(x => x.keys.size)) : 0; return { ok: n >= 6, hint: `Fant ${n} nøkler i minste fil` }; }
  };

  function checkRubric(ex, code) {
    const src = ex.lang === "java" ? stripJavaComments(code) : code;
    const chunks = methodChunks(src);
    const out = [];
    let total = 0, got = 0;
    for (const c of ex.checks) {
      const w = c.weight ?? 1;
      total += w;
      let ok = false, hint = "";
      const flags = c.flags || "";
      if (c.custom) {
        const r = CUSTOM[c.custom](src);
        ok = r.ok; hint = r.ok ? "" : (r.hint || "");
      } else if (c.method) {
        const res = c.method.map(r => new RegExp(r, flags));
        ok = chunks.some(ch => res.every(re => re.test(ch)));
        if (!ok) {
          const head = res[0];
          const found = chunks.find(ch => head.test(ch));
          hint = found ? "Fant metoden, men mangler: " + c.method.slice(1).filter(r => !new RegExp(r, flags).test(found)).map(r => r.replace(/\\s\*|\\\(|\\s\+|\\/g, "").slice(0, 40)).join(" · ")
                       : "Fant ingen metode med riktig mapping/URI";
        }
      } else if (c.not) {
        ok = !new RegExp(c.not, flags).test(src);
      } else {
        ok = new RegExp(c.re, flags).test(src);
      }
      if (ok) got += w;
      out.push({ label: c.label, ok, hint, weight: w });
    }
    return { items: out, score: total ? got / total : 0 };
  }

  /* ---------- Endepunkt-tabell ---------- */

  function normUri(s) {
    let u = String(s || "").trim().toLowerCase();
    u = u.replace(/^https?:\/\/[^/]+/, "");
    u = u.replace(/\?.*$/, "");
    const i = u.indexOf("/api/v1");
    if (i >= 0) u = u.slice(i + 7);
    u = u.replace(/\{[^}]*\}/g, "{}").replace(/:\w+/g, "{}").replace(/<[^>]*>/g, "{}");
    u = u.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
    return u;
  }

  function checkEndpoints(ex, answers) {
    let got = 0;
    const rows = ex.rows.map((r, i) => {
      const a = answers[i] || {};
      const uriOk = r.accept.includes(normUri(a.uri));
      const methodOk = (a.http || "") === r.method || (r.alsoMethod || []).includes(a.http);
      const nameOk = /^[a-z][A-Za-z0-9]+$/.test((a.name || "").trim());
      if (uriOk) got += 0.5;
      if (methodOk) got += 0.5;
      return { uriOk, methodOk, nameOk };
    });
    return { rows, score: got / ex.rows.length };
  }

  /* ---------- Skriftlige svar ---------- */

  function checkWritten(item, text) {
    const t = String(text || "");
    const items = item.points.map(p => ({ label: p.label, ok: p.any.some(r => new RegExp(r, "i").test(t)) }));
    const score = items.filter(x => x.ok).length / items.length;
    return { items, score };
  }

  return { runJs, checkRubric, checkEndpoints, checkWritten, normUri };
})();

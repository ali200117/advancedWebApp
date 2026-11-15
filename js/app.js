/* DAT152 eksamenstrening: eksamener med svarfelt, teorispørsmål og pugg-sider. */
(() => {
  "use strict";

  /* ---------------- Lagring ---------------- */
  const Store = {
    key: "dat152-v2",
    data: {},
    load() {
      try { this.data = JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { this.data = {}; }
      this.data.answers ??= {};   // { eksamenId: { oppgaveId: tekst } }
      this.data.tq ??= {};        // { spørsmålId: tekst }
      this.data.known ??= {};     // { spørsmålId: true }
    },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* lagring utilgjengelig */ } }
  };
  Store.load();

  /* ---------------- Hjelpere ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const app = $("#app");
  const FENCE = /~~~(\w*)\n([\s\S]*?)~~~/g;

  const KW = new Set(("abstract async await boolean break case catch class const continue default delete do else export extends false final finally for from function get if implements import in instanceof interface let new null of private protected public return set static super switch this throw throws true try typeof undefined var void while yield Long String int double long Set List Map Optional Object").split(" "));
  function hl(code, lang) {
    const e = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (lang === "text" || lang === "json") return e(code);
    const span = (cls, m) => `<span class="tok-${cls}">${e(m[0])}</span>`;
    let re, fn;
    if (lang === "properties") {
      re = /(#[^\n]*)|^(\s*[\w.\-]+)(?=\s*[:=])/gm;
      fn = m => span(m[1] ? "com" : "kw", m);
    } else if (lang === "html") {
      re = /(<!--[\s\S]*?-->)|("[^"\n]*")|(<\/?[\w-]+)/g;
      fn = m => span(m[1] ? "com" : m[2] ? "str" : "kw", m);
    } else {
      re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(@[A-Za-z]\w*)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$#][\w$]*)/g;
      fn = m => m[1] ? span("com", m) : m[2] ? span("str", m) : m[3] ? span("ann", m) : m[4] ? span("num", m)
        : KW.has(m[0]) ? span("kw", m) : e(m[0]);
    }
    let out = "", last = 0, m;
    while ((m = re.exec(code)) !== null) {
      if (m[0] === "") { re.lastIndex++; continue; }
      out += e(code.slice(last, m.index)) + fn(m);
      last = m.index + m[0].length;
    }
    return out + e(code.slice(last));
  }
  const codeBlock = (code, lang) => `<pre><code>${hl(code.replace(/\n$/, ""), lang)}</code></pre>`;
  /* HTML med ~~~språk-kodeblokker */
  const renderContent = html => html.replace(FENCE, (_, lang, code) => codeBlock(code, lang));
  /* Ren tekst med ~~~språk-kodeblokker (teorispørsmålene) */
  function renderPlain(text) {
    let out = "", last = 0, m;
    FENCE.lastIndex = 0;
    while ((m = FENCE.exec(text)) !== null) {
      out += `<p>${esc(text.slice(last, m.index).trim())}</p>` + codeBlock(m[2], m[1]);
      last = m.index + m[0].length;
    }
    const rest = text.slice(last).trim();
    return out + (rest ? `<p>${esc(rest)}</p>` : "");
  }
  /* Løsning: "@nøkkel", html eller en liste av disse */
  function solutionHtml(sol) {
    const parts = Array.isArray(sol) ? sol : [sol];
    return parts.map(p => renderContent(typeof p === "string" && p.startsWith("@") ? (DAT.ans[p.slice(1)] ?? `<p>(mangler: ${esc(p)})</p>`) : p)).join("");
  }

  /* HTML -> ren tekst til nedlasting av svar */
  function htmlToText(html) {
    const codes = [];
    const safe = html.replace(FENCE, (_, lang, code) => { codes.push(code); return `<pre data-code="${codes.length - 1}"></pre>`; });
    const root = document.createElement("div");
    root.innerHTML = safe;
    const BLOCK = new Set(["P", "DIV", "LI", "TR", "TABLE", "UL", "OL", "H1", "H2", "H3", "H4", "FIELDSET", "PRE", "BR"]);
    let out = "";
    const walk = node => {
      for (const n of node.childNodes) {
        if (n.nodeType === Node.TEXT_NODE) { out += n.textContent.replace(/\s+/g, " "); continue; }
        if (n.nodeType !== Node.ELEMENT_NODE) continue;
        const tag = n.tagName;
        if (tag === "PRE") { out += "\n" + (n.dataset.code !== undefined ? codes[n.dataset.code] : n.textContent).replace(/\n$/, "") + "\n"; continue; }
        if (tag === "LI") out += "\n- ";
        else if (BLOCK.has(tag)) out += "\n";
        walk(n);
        if (tag === "TD" || tag === "TH") out += " | ";
        if (BLOCK.has(tag) && tag !== "BR") out += "\n";
      }
    };
    walk(root);
    return out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function download(filename, text) {
    const blob = new Blob(["﻿" + text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* prøv gammel metode */ }
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  const stamp = () => new Date().toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" });
  const fileDate = () => new Date().toISOString().slice(0, 10);

  /* ---------------- Eksamener ---------------- */
  /* Flat liste over deloppgavene i en eksamen, med id som "1a", "4d", "5f (10%)" */
  function tasksOf(exam) {
    const list = [];
    exam.questions.forEach((q, qi) => {
      const num = (/Question (\d+)/.exec(q.title) || [, qi + 1])[1];
      q.tasks.forEach(t => list.push({ ...t, id: num + t.label, question: q }));
    });
    return list;
  }
  const answerOf = (exam, t) => Store.data.answers[exam.id]?.[t.id];
  const isAnswered = (exam, t) => {
    const a = answerOf(exam, t);
    return a !== undefined && a.trim() !== "" && a.trim() !== (t.starter || "").trim();
  };
  const progress = exam => { const ts = tasksOf(exam); return { done: ts.filter(t => isAnswered(exam, t)).length, total: ts.length }; };

  function viewHome() {
    const card = x => { const p = progress(x); return `<a class="card" href="#/eksamen/${x.id}"><h3>${esc(x.title)}</h3>
<div class="progress"><span style="width:${p.total ? p.done / p.total * 100 : 0}%"></span></div><p class="small muted">${p.done} av ${p.total} deloppgaver besvart</p></a>`; };
    const order = ["v26", "h25", "h24", "v24", "h23", "h22", "h21"];
    const past = order.map(id => DAT.exams.find(x => x.id === id)).filter(Boolean);
    const fresh = DAT.exams.filter(x => x.kind === "new");
    return `<h1>DAT152 – eksamenstrening</h1>
<ol class="howto">
<li>Velg en eksamen og skriv svarene dine i feltene. Alt lagres automatisk i nettleseren.</li>
<li>Trykk <b>Last ned svar</b> når du er ferdig, og send filen til Claude for retting og karakter.</li>
<li>Øv på det du bommet på under <a href="#/teori">Teorispørsmål</a> og <a href="#/pugg">Pugg</a>, og ta eksamenen på nytt.</li>
</ol>
<h2>Tidligere eksamener</h2>
<div class="grid">${past.map(card).join("")}</div>
<h2>Øvingseksamener</h2>
<p class="muted">Nye oppgavesett i samme format som h25/v26. Samme oppgavetyper som læreren har gitt, med nye scenarioer.</p>
<div class="grid">${fresh.map(card).join("")}</div>`;
  }

  function viewExam(id) {
    const exam = DAT.exams.find(x => x.id === id);
    if (!exam) return notFound();
    const p = progress(exam);
    const taskHtml = (t) => {
      const value = answerOf(exam, t) ?? t.starter ?? "";
      const code = t.type === "code";
      return `<section class="task-block" data-task="${esc(t.id)}">
<h3 class="task-label">${esc(t.id)}</h3>
<div class="task-q">${renderContent(t.q)}</div>
<textarea class="${code ? "code" : "answer"}" ${code ? 'wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off"' : ""} data-min="${code ? 140 : 110}"
 placeholder="${code ? "Skriv koden din her" : "Skriv svaret ditt her"}" aria-label="Svar på oppgave ${esc(t.id)}">${esc(value)}</textarea>
<div class="btn-row"><button type="button" data-sol="${esc(t.id)}">Vis løsningsforslag</button></div>
<div class="sol hidden" id="sol-${esc(t.id)}"></div>
</section>`;
    };
    const tasks = tasksOf(exam);
    return `<p class="small"><a href="#/">← Eksamener</a></p>
<h1>${esc(exam.title)}</h1>
${exam.note ? `<p class="muted">${esc(exam.note)}</p>` : ""}
<div class="toolbar">
<span id="progress-text">Besvart ${p.done} av ${p.total}</span>
<button type="button" class="primary" id="dl">Last ned svar</button>
<button type="button" id="copy">Kopier alle svar</button>
<button type="button" id="reset">Start på nytt</button>
<span class="small muted" id="saved"></span>
</div>
${exam.questions.map(q => `<h2>${esc(q.title)} <span class="weight">(${q.weight}% ~ ${Math.round(q.weight * 2.4)} minutter)</span></h2>
${q.intro ? `<div class="intro">${renderContent(q.intro)}</div>` : ""}
${tasks.filter(t => t.question === q).map(taskHtml).join("")}`).join("")}
${exam.appendix ? `<details class="appendix"><summary>Vedlegg (hjelpesidene bakerst i oppgavesettet)</summary><div>${exam.appendix.map(a => renderContent(DAT.appendix[a] || "")).join("")}</div></details>` : ""}`;
  }

  function exportExam(exam) {
    const tasks = tasksOf(exam);
    const p = progress(exam);
    const lines = [`DAT152 – ${exam.title} – mine svar`, `Eksportert: ${stamp()}`, `Besvart: ${p.done} av ${p.total} deloppgaver`, ""];
    for (const q of exam.questions) {
      lines.push("=".repeat(70), `${q.title} (${q.weight}%)`, "=".repeat(70), "");
      if (q.intro) lines.push(htmlToText(q.intro), "");
      for (const t of tasks.filter(x => x.question === q)) {
        const a = answerOf(exam, t);
        lines.push(`--- Oppgave ${t.id} ---`, "OPPGAVE:", htmlToText(t.q), "", "MITT SVAR:", isAnswered(exam, t) ? a.replace(/\s+$/, "") : "(ikke besvart)", "", "");
      }
    }
    return lines.join("\n");
  }

  function bindExam(id) {
    const exam = DAT.exams.find(x => x.id === id);
    if (!exam) return;
    const tasks = tasksOf(exam);
    const byId = Object.fromEntries(tasks.map(t => [t.id, t]));
    let timer;
    $$(".task-block").forEach(block => {
      const t = byId[block.dataset.task];
      const ta = $("textarea", block);
      Editor.attach(ta, t.type === "code");
      ta.addEventListener("input", () => {
        (Store.data.answers[exam.id] ??= {})[t.id] = ta.value;
        clearTimeout(timer);
        timer = setTimeout(() => {
          Store.save();
          const p = progress(exam);
          $("#progress-text").textContent = `Besvart ${p.done} av ${p.total}`;
          $("#saved").textContent = "Lagret " + new Date().toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
        }, 300);
      });
    });
    $$("[data-sol]").forEach(btn => btn.addEventListener("click", () => {
      const box = document.getElementById("sol-" + btn.dataset.sol);
      if (!box.innerHTML) box.innerHTML = `<div class="sol-title">Løsningsforslag</div>` + solutionHtml(byId[btn.dataset.sol].sol);
      const hidden = box.classList.toggle("hidden");
      btn.textContent = hidden ? "Vis løsningsforslag" : "Skjul løsningsforslag";
    }));
    $("#dl").addEventListener("click", () => { Store.save(); download(`DAT152_svar_${exam.id}_${fileDate()}.txt`, exportExam(exam)); });
    $("#copy").addEventListener("click", async () => {
      Store.save();
      const ok = await copyText(exportExam(exam));
      $("#saved").textContent = ok ? "Kopiert til utklippstavlen" : "Kunne ikke kopiere – bruk Last ned svar";
    });
    $("#reset").addEventListener("click", () => {
      if (!confirm("Slette alle svarene dine på denne eksamenen og starte på nytt? Last ned svarene først hvis du vil beholde dem.")) return;
      delete Store.data.answers[exam.id];
      Store.save();
      render();
    });
  }

  /* ---------------- Teorispørsmål ---------------- */
  let tqGroup = "all";
  const topicsIn = g => DAT.learn.filter(l => g === "all" || l.group === g);

  function viewTheory() {
    const hide = !!Store.data.hideKnown;
    const known = DAT.tq.filter(q => Store.data.known[q.id]).length;
    const item = q => `<section class="task-block ${Store.data.known[q.id] ? "known" : ""}" data-q="${q.id}">
<span class="pill">${esc(q.seen)}</span>
<div class="task-q">${renderPlain(q.q)}</div>
<textarea class="answer" data-min="90" placeholder="Skriv svaret ditt her" aria-label="Svar">${esc(Store.data.tq[q.id] || "")}</textarea>
<div class="btn-row"><button type="button" data-show="${q.id}">Vis svar</button>
<label class="check"><input type="checkbox" data-known="${q.id}" ${Store.data.known[q.id] ? "checked" : ""}> Kan dette</label></div>
<div class="sol hidden" id="sol-${q.id}"></div>
</section>`;
    const body = topicsIn(tqGroup).map(topic => {
      const qs = DAT.tq.filter(q => q.topic === topic.id && !(hide && Store.data.known[q.id]));
      return qs.length ? `<h2>${esc(topic.title)} <a class="small" href="#/pugg/${topic.id}">les om dette</a></h2>${qs.map(item).join("")}` : "";
    }).join("");
    return `<h1>Teorispørsmål</h1>
<p class="muted">Teorispørsmålene fra eksamenene og fra pensumlista, uten kodeoppgaver. Skriv svaret ditt, og trykk «Vis svar» for å sammenligne.</p>
<div class="toolbar">
${[{ id: "all", name: "Alle" }, ...DAT.groups].map(g => `<button type="button" data-group="${g.id}" class="${tqGroup === g.id ? "active" : ""}">${esc(g.name)}</button>`).join("")}
<label class="check"><input type="checkbox" id="hide-known" ${hide ? "checked" : ""}> Skjul de jeg kan</label>
<span id="known-text">Kan ${known} av ${DAT.tq.length}</span>
<button type="button" id="dl">Last ned svar</button>
</div>
${body || `<p class="muted">Ingen spørsmål igjen her.</p>`}`;
  }

  function exportTheory() {
    const lines = ["DAT152 – teorispørsmål – mine svar", `Eksportert: ${stamp()}`, ""];
    for (const topic of DAT.learn) {
      const qs = DAT.tq.filter(q => q.topic === topic.id && (Store.data.tq[q.id] || "").trim());
      if (!qs.length) continue;
      lines.push("=".repeat(70), topic.title, "=".repeat(70), "");
      for (const q of qs) lines.push("SPØRSMÅL:", q.q.replace(FENCE, (_, l, code) => "\n" + code), "", "MITT SVAR:", Store.data.tq[q.id].replace(/\s+$/, ""), "", "");
    }
    return lines.join("\n");
  }

  function bindTheory() {
    let timer;
    $$(".task-block[data-q]").forEach(block => {
      const ta = $("textarea", block);
      Editor.attach(ta, false);
      ta.addEventListener("input", () => {
        Store.data.tq[block.dataset.q] = ta.value;
        clearTimeout(timer);
        timer = setTimeout(() => Store.save(), 300);
      });
    });
    $$("[data-show]").forEach(btn => btn.addEventListener("click", () => {
      const q = DAT.tq.find(x => x.id === btn.dataset.show);
      const box = document.getElementById("sol-" + q.id);
      if (!box.innerHTML) box.innerHTML = `<div class="sol-title">Svar</div>` + solutionHtml(q.ans.map(k => "@" + k));
      const hidden = box.classList.toggle("hidden");
      btn.textContent = hidden ? "Vis svar" : "Skjul svar";
    }));
    $$("[data-known]").forEach(cb => cb.addEventListener("change", () => {
      if (cb.checked) Store.data.known[cb.dataset.known] = true; else delete Store.data.known[cb.dataset.known];
      Store.save();
      cb.closest(".task-block").classList.toggle("known", cb.checked);
      $("#known-text").textContent = `Kan ${DAT.tq.filter(q => Store.data.known[q.id]).length} av ${DAT.tq.length}`;
    }));
    $$("[data-group]").forEach(b => b.addEventListener("click", () => { Store.save(); tqGroup = b.dataset.group; render(); }));
    $("#hide-known").addEventListener("change", ev => { Store.data.hideKnown = ev.target.checked; Store.save(); render(); });
    $("#dl").addEventListener("click", () => { Store.save(); download(`DAT152_teorisvar_${fileDate()}.txt`, exportTheory()); });
  }

  /* ---------------- Pugg ---------------- */
  function viewLearnList() {
    return `<h1>Pugg</h1>
<p class="muted">Korte forklaringer med eksempler på det eksamen spør om. Hver side slutter med eksamensspørsmålene om temaet.</p>
${DAT.groups.map(g => `<h2>${esc(g.name)} <span class="weight">(${g.weight}%)</span></h2>
<div class="grid">${DAT.learn.filter(l => l.group === g.id).map(l => `<a class="card" href="#/pugg/${l.id}"><h3>${esc(l.title)}</h3>
<p class="small muted">${DAT.tq.filter(q => q.topic === l.id).length} eksamensspørsmål</p></a>`).join("")}</div>`).join("")}`;
  }

  function viewLearn(id) {
    const i = DAT.learn.findIndex(l => l.id === id);
    const topic = DAT.learn[i];
    if (!topic) return notFound();
    const qs = DAT.tq.filter(q => q.topic === id);
    const prev = DAT.learn[i - 1], next = DAT.learn[i + 1];
    return `<p class="small"><a href="#/pugg">← Pugg</a></p>
<h1>${esc(topic.title)}</h1>
<article class="learn">${renderContent(topic.html)}</article>
${qs.length ? `<h2>Eksamensspørsmål om dette</h2>
${qs.map(q => `<details><summary>${esc(q.q.replace(FENCE, " […] ").slice(0, 170))}${q.q.length > 170 ? "…" : ""} <span class="pill">${esc(q.seen)}</span></summary>
<div>${renderPlain(q.q)}<div class="sol"><div class="sol-title">Svar</div>${solutionHtml(q.ans.map(k => "@" + k))}</div></div></details>`).join("")}` : ""}
<div class="btn-row" style="margin-top:24px">
${prev ? `<a class="btn" href="#/pugg/${prev.id}">← ${esc(prev.title)}</a>` : ""}
${next ? `<a class="btn" href="#/pugg/${next.id}">${esc(next.title)} →</a>` : ""}
</div>`;
  }

  const notFound = () => `<h1>Fant ikke siden</h1><p><a href="#/">Til eksamenene</a></p>`;

  /* ---------------- Router ---------------- */
  function render() {
    const [page, id] = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    let html, bind = () => {};
    if (!page) html = viewHome();
    else if (page === "eksamen" && id) { html = viewExam(id); bind = () => bindExam(id); }
    else if (page === "teori") { html = viewTheory(); bind = bindTheory; }
    else if (page === "pugg") html = id ? viewLearn(id) : viewLearnList();
    else html = notFound();
    app.innerHTML = html;
    bind();
    const section = page === "eksamen" ? "" : (page || "");
    $$("#nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href").replace(/^#\/?/, "") === section));
    $("#sidebar").classList.remove("open");
  }

  window.addEventListener("hashchange", () => { Store.save(); window.scrollTo(0, 0); render(); });
  window.addEventListener("beforeunload", () => Store.save());

  const applyTheme = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  try { applyTheme(localStorage.getItem("dat152-theme")); } catch (e) { /* ingen lagring */ }
  $("#theme-btn").addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("dat152-theme", next); } catch (e) { /* ingen lagring */ }
  });
  $("#menu-btn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

  render();
})();

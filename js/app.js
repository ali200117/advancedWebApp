/* DAT152 studieside – hash-router og visninger (denne siden er selv en SPA med hash-routing!) */
(() => {
  "use strict";

  /* ---------------- Lagring ---------------- */
  const Store = {
    key: "dat152-studieside-v1",
    data: {},
    load() {
      try { this.data = JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { this.data = {}; }
      const d = this.data;
      d.plan ??= {}; d.ex ??= {}; d.written ??= {}; d.read ??= {}; d.drafts ??= {};
      d.quiz ??= { answered: 0, correct: 0, wrong: {} };
      d.timers ??= {};
    },
    save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* privat modus */ } }
  };
  Store.load();

  /* ---------------- Hjelpere ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const app = $("#app");
  const A = DAT.areas;
  const areaPill = a => `<span class="pill ${a}">${esc(A[a]?.name || a)}</span>`;
  const pct = x => Math.round((x || 0) * 100) + " %";
  const scoreClass = x => x >= 0.85 ? "good" : x >= 0.5 ? "mid" : "bad";
  const areaOrder = ["wf", "sec", "js", "g11n", "ud"];

  function linkFor(l) {
    if (!l) return null;
    const [k, v] = [l.slice(0, 1), l.slice(2)];
    return { t: "#/teori/", e: "#/oving/", w: "#/skriv/", q: "#/quiz/", x: "#/eksamen/", p: "#/" }[k] + v;
  }
  function statusFor(l) {
    if (!l) return "";
    const v = l.slice(2);
    if (l.startsWith("e:") && Store.data.ex[v] !== undefined) return `<span class="pill ${Store.data.ex[v] >= 1 ? "done" : ""}">${pct(Store.data.ex[v])}</span>`;
    if (l.startsWith("w:") && Store.data.written[v]) return `<span class="pill ${Store.data.written[v].score >= 0.8 ? "done" : ""}">${pct(Store.data.written[v].score)}</span>`;
    if (l.startsWith("t:") && Store.data.read[v]) return `<span class="pill done">lest</span>`;
    return "";
  }

  /* ---------------- Syntaksutheving ---------------- */
  const KW = new Set(("abstract async await boolean break case catch class const continue default delete do else export extends false final finally for from function get if implements import in instanceof interface let new null of private protected public return set static super switch this throw throws true try typeof undefined var void while yield Long String int double long Set List Map Optional Object").split(" "));
  function hl(code, lang) {
    const e = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let re, fn;
    if (lang === "yaml" || lang === "properties") {
      re = /(#[^\n]*)|("(?:\\.|[^"\\\n])*"|'[^'\n]*')|^(\s*-?\s*[\w.\-]+)(?=\s*[:=])/gm;
      fn = m => m[1] ? `<span class="tok-com">${e(m[0])}</span>` : m[2] ? `<span class="tok-str">${e(m[0])}</span>` : `<span class="tok-kw">${e(m[0])}</span>`;
    } else if (lang === "html") {
      re = /(<!--[\s\S]*?-->)|("[^"\n]*")|(<\/?[\w-]+)/g;
      fn = m => m[1] ? `<span class="tok-com">${e(m[0])}</span>` : m[2] ? `<span class="tok-str">${e(m[0])}</span>` : `<span class="tok-kw">${e(m[0])}</span>`;
    } else if (lang === "sql") {
      re = /(--[^\n]*)|('(?:''|[^'\n])*')|\b(SELECT|FROM|WHERE|AND|OR|UNION|ORDER|BY|INSERT|INTO|VALUES|UPDATE|DELETE|DROP|TABLE|ASC|DESC|IF|SLEEP|SUBSTRING|LOAD_FILE)\b/gi;
      fn = m => m[1] ? `<span class="tok-com">${e(m[0])}</span>` : m[2] ? `<span class="tok-str">${e(m[0])}</span>` : `<span class="tok-kw">${e(m[0])}</span>`;
    } else {
      re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(@[A-Za-z]\w*)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$#][\w$]*)/g;
      fn = m => m[1] ? `<span class="tok-com">${e(m[0])}</span>`
        : m[2] ? `<span class="tok-str">${e(m[0])}</span>`
        : m[3] ? `<span class="tok-ann">${e(m[0])}</span>`
        : m[4] ? `<span class="tok-num">${e(m[0])}</span>`
        : KW.has(m[0]) ? `<span class="tok-kw">${e(m[0])}</span>` : e(m[0]);
    }
    let out = "", last = 0, m;
    while ((m = re.exec(code)) !== null) {
      if (m[0] === "") { re.lastIndex++; continue; }
      out += e(code.slice(last, m.index)) + fn(m);
      last = m.index + m[0].length;
    }
    return out + e(code.slice(last));
  }
  const codeBlock = (code, lang) => `<pre><code class="lang-${esc(lang || "")}">${hl(code.replace(/\n$/, ""), lang)}</code></pre>`;
  function renderContent(html) {
    return html.replace(/~~~(\w*)\n([\s\S]*?)~~~/g, (_, lang, code) => codeBlock(code, lang));
  }

  /* ---------------- Nedtelling ---------------- */
  function daysLeft() {
    const ms = new Date(DAT.examDate) - new Date();
    return Math.max(0, Math.ceil(ms / 86400000));
  }
  function renderMiniCountdown() {
    const d = daysLeft();
    $("#countdown-mini").innerHTML = d > 0 ? `<b>${d} dager</b>til eksamen 12. des` : `<b>Lykke til! 🍀</b>Eksamensdag`;
  }

  /* ---------------- Statistikk ---------------- */
  function stats() {
    const allTasks = DAT.plan.flatMap(w => w.days.flatMap(d => d.tasks.map((t, i) => d.date + "#" + i)));
    const planDone = allTasks.filter(k => Store.data.plan[k]).length;
    const exScores = DAT.exercises.map(e => Store.data.ex[e.id] || 0);
    const exDone = exScores.filter(s => s >= 1).length;
    const wr = DAT.written.map(w => Store.data.written[w.id]?.score || 0);
    const wrDone = wr.filter(s => s >= 0.8).length;
    const read = DAT.theory.filter(t => Store.data.read[t.id]).length;
    const q = Store.data.quiz;
    return { planDone, planTotal: allTasks.length, exDone, exTotal: DAT.exercises.length, wrDone, wrTotal: DAT.written.length, read, readTotal: DAT.theory.length, quizAcc: q.answered ? q.correct / q.answered : 0, quizN: q.answered };
  }
  function areaMastery(area) {
    const ex = DAT.exercises.filter(e => e.area === area).map(e => Store.data.ex[e.id] || 0);
    const wr = DAT.written.filter(w => w.area === area).map(w => Store.data.written[w.id]?.score || 0);
    const th = DAT.theory.filter(t => t.area === area).map(t => Store.data.read[t.id] ? 1 : 0);
    const all = [...ex, ...wr, ...th];
    return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
  }

  /* ---------------- Visninger ---------------- */

  function viewHome() {
    const s = stats();
    const today = new Date().toISOString().slice(0, 10);
    const day = DAT.plan.flatMap(w => w.days).find(d => d.date === today) || DAT.plan.flatMap(w => w.days).find(d => d.date > today);
    const weights = areaOrder.map(a => `<div style="width:${A[a].weight}%;background:${A[a].color}" title="${A[a].name} ${A[a].weight}%">${A[a].weight >= 10 ? A[a].short + " " : ""}${A[a].weight}%</div>`).join("");
    const freq = DAT.frequency;
    const freqRows = freq.rows.map(([name, area, hits]) => {
      const n = hits.reduce((a, b) => a + b, 0);
      const last2 = hits.slice(-2).reduce((a, b) => a + b, 0);
      const verdict = n >= 6 ? "🔥 Nesten sikker" : (n >= 3 && last2 === 0) ? "⚠️ «Tid for igjen»" : n >= 4 ? "Svært sannsynlig" : n >= 2 ? "Mulig" : "Pensum – vær forberedt";
      return `<tr><td>${areaPill(area)} ${esc(name)}</td>${hits.map(h => `<td style="text-align:center">${h ? "✓" : ""}</td>`).join("")}<td>${verdict}</td></tr>`;
    }).join("");
    return `
<h1>DAT152 – eksamensforberedelse</h1>
<p class="lead">Skriftlig eksamen 4 timer · Mål: A eller B. Siden lagrer fremgangen din i nettleseren.</p>
<div class="stat-row">
  <div class="stat"><b>${daysLeft()}</b><span>dager igjen</span></div>
  <div class="stat"><b>${s.planDone}/${s.planTotal}</b><span>planoppgaver</span><div class="progress"><span style="width:${s.planDone / s.planTotal * 100}%"></span></div></div>
  <div class="stat"><b>${s.read}/${s.readTotal}</b><span>teoritemaer lest</span></div>
  <div class="stat"><b>${s.exDone}/${s.exTotal}</b><span>kodeøvinger 100 %</span></div>
  <div class="stat"><b>${s.wrDone}/${s.wrTotal}</b><span>skriftlige ≥ 80 %</span></div>
  <div class="stat"><b>${s.quizN ? pct(s.quizAcc) : "–"}</b><span>quiz-treff (${s.quizN} svar)</span></div>
</div>

${day ? `<div class="card"><h3>📌 ${day.date === today ? "I dag" : "Neste studiedag"}: ${esc(day.title)}</h3>
${day.tasks.map((t, i) => taskHtml(day, t, i)).join("")}
<p class="small"><a href="#/plan">Se hele planen →</a></p></div>` : ""}

<h2>Eksamensformatet</h2>
<div class="weight-bar">${weights}</div>
<div class="table-wrap"><table>
<tr><th>Område</th><th>Vekt</th><th>Tid</th><th>Din mestring</th></tr>
${areaOrder.map(a => { const m = areaMastery(a); return `<tr><td>${areaPill(a)}</td><td>${A[a].weight} %</td><td>${Math.round(A[a].weight * 2.4)} min</td><td><div class="progress"><span style="width:${m * 100}%;background:${A[a].color}"></span></div><span class="small muted">${pct(m)}</span></td></tr>`; }).join("")}
</table></div>

<div class="split">
<div class="callout bad"><span class="callout-title">❌ Kommer IKKE i år</span>
<ul><li>JSP og JSTL (partb-info: «No jsp»)</li><li>Custom tags (SimpleTagSupport, tag-filer)</li></ul>
<p class="small">Hopp over de deloppgavene i h21–h24. Prinsippene i i18n-oppgavene (property-filer med parametere) gjelder fortsatt.</p></div>
<div class="callout good"><span class="callout-title">✅ Kommer garantert (alle 7 siste eksamener)</span>
<ul><li>REST endepunkt-tabell</li><li>g11n-definisjoner + property-filer</li><li>WCAG + ett prinsipp</li><li>Passordlagring + SQL injection</li><li>En JS web-komponent (10 %)</li></ul></div>
</div>

<h2>Mønsteret i eksamenene</h2>
<p>Hva har blitt spurt om de siste 7 gangene. Bruk dette til å prioritere.</p>
<div class="table-wrap"><table>
<tr><th>Tema</th>${freq.cols.map(c => `<th>${c}</th>`).join("")}<th>Vurdering</th></tr>
${freqRows}
</table></div>

<h2>Kom i gang</h2>
<div class="grid">
<a class="card" href="#/teknikk"><h3>🎯 Eksamensteknikk</h3><p class="small muted">Hva skiller A fra C hos sensor, og tidsbruk.</p></a>
<a class="card" href="#/teori"><h3>📖 Teori</h3><p class="small muted">${DAT.theory.length} temaer med «eksamenssvar»-bokser.</p></a>
<a class="card" href="#/oving"><h3>💻 Kodeøvinger</h3><p class="small muted">${DAT.exercises.length} øvinger – JS kjøres og testes automatisk.</p></a>
<a class="card" href="#/skriv"><h3>✍️ Skriftlige spørsmål</h3><p class="small muted">${DAT.written.length} ekte eksamensspørsmål med nøkkelpunkt-sjekk.</p></a>
<a class="card" href="#/quiz"><h3>❓ Quiz</h3><p class="small muted">${DAT.quiz.length} flervalgsspørsmål med forklaring.</p></a>
<a class="card" href="#/eksamen"><h3>⏱️ Prøveeksamen</h3><p class="small muted">Tidtaker + oppgavene koblet til øvinger.</p></a>
</div>`;
  }

  function taskHtml(day, t, i) {
    const key = day.date + "#" + i;
    const done = !!Store.data.plan[key];
    const href = linkFor(t.link);
    return `<div class="task ${done ? "done" : ""}"><input type="checkbox" id="task-${key}" data-task="${key}" ${done ? "checked" : ""}>
<label for="task-${key}">${href ? `<a href="${href}">${esc(t.text)}</a>` : esc(t.text)} ${statusFor(t.link)}</label></div>`;
  }

  function bindTasks() {
    $$("input[data-task]").forEach(cb => cb.addEventListener("change", () => {
      Store.data.plan[cb.dataset.task] = cb.checked;
      Store.save();
      cb.closest(".task").classList.toggle("done", cb.checked);
    }));
  }

  function viewPlan() {
    const today = new Date().toISOString().slice(0, 10);
    return `<h1>Studieplan: 13. nov → 12. des</h1>
<p class="lead">4 uker, prioritert etter vekt på eksamen. Ca. 2–3 timer per dag. Kryss av underveis – lenkene tar deg rett til teori/øving. Prosent-merkene oppdateres automatisk når du løser øvinger.</p>
<div class="callout"><span class="callout-title">Prinsippene bak planen</span>
<ul><li><b>Aktiv øving, ikke bare lesing</b>: hver teoridag avsluttes med kode eller et skriftlig svar.</li>
<li><b>Vekt styrer tid</b>: Web Frameworks (40 %) får en hel uke; UD (5 %) får én kveld.</li>
<li><b>Prøveeksamener i uke 4</b> under ekte forhold avslører hullene mens det fortsatt er tid.</li>
<li><b>Ligger du etter?</b> Hopp over «valgfritt», men aldri over prøveeksamenene.</li></ul></div>
${DAT.plan.map(w => `<div class="week"><h2>${esc(w.week)}</h2><p class="muted">${esc(w.goal)}</p>
${w.days.map(d => {
  const dt = new Date(d.date + "T12:00:00");
  const label = dt.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });
  const n = d.tasks.filter((t, i) => Store.data.plan[d.date + "#" + i]).length;
  return `<div class="day ${d.date === today ? "today" : ""}" ${d.date === today ? 'id="today"' : ""}><div class="day-head"><span>${esc(d.title)}</span><span class="date">${label} · ${n}/${d.tasks.length}</span></div>
${d.tasks.map((t, i) => taskHtml(d, t, i)).join("")}</div>`;
}).join("")}</div>`).join("")}`;
  }

  function viewTheoryList() {
    return `<h1>Teori</h1><p class="lead">Les temaene i rekkefølge. Grønne bokser = slik kan du formulere svaret på eksamen. Røde bokser = konsekvenser hvis man ikke beskytter seg.</p>
${areaOrder.map(a => `<h2>${esc(A[a].name)} <span class="pill ${a}">${A[a].weight} %</span></h2>
<div class="grid">${DAT.theory.filter(t => t.area === a).map(t => `<a class="card" href="#/teori/${t.id}"><h3>${esc(t.title)} ${Store.data.read[t.id] ? '<span class="pill done">lest</span>' : ""}</h3><p class="small muted">${esc(t.summary)}</p></a>`).join("")}</div>`).join("")}`;
  }

  function viewTheory(id) {
    const ordered = areaOrder.flatMap(a => DAT.theory.filter(t => t.area === a));
    const i = ordered.findIndex(t => t.id === id);
    const t = ordered[i];
    if (!t) return notFound();
    const prev = ordered[i - 1], next = ordered[i + 1];
    const relEx = DAT.exercises.filter(e => e.solutionRef === id || (e.area === t.area && e.title && relatedByWords(t, e)));
    const relW = DAT.written.filter(w => w.theory === id);
    return `<p class="small"><a href="#/teori">← Teori</a> · ${areaPill(t.area)}</p>
<h1>${esc(t.title)}</h1>
<div id="toc" class="toc card small"></div>
<article id="theory-body">${renderContent(t.html)}</article>
${relW.length || relEx.length ? `<h2>Øv på dette</h2><div class="grid">
${relW.map(w => `<a class="card" href="#/skriv/${w.id}"><span class="pill">Skriftlig</span> ${statusFor("w:" + w.id)}<p class="small">${esc(w.q.slice(0, 120))}${w.q.length > 120 ? "…" : ""}</p></a>`).join("")}
${relEx.map(e => `<a class="card" href="#/oving/${e.id}"><span class="pill">Kode</span> ${statusFor("e:" + e.id)}<p class="small"><b>${esc(e.title)}</b></p></a>`).join("")}
</div>` : ""}
<div class="btn-row" style="margin-top:28px">
<button type="button" class="primary" id="mark-read">${Store.data.read[id] ? "✓ Lest" : "Marker som lest"}</button>
${prev ? `<a class="btn" href="#/teori/${prev.id}">← ${esc(prev.title)}</a>` : ""}
${next ? `<a class="btn" href="#/teori/${next.id}">${esc(next.title)} →</a>` : ""}
</div>`;
  }
  function relatedByWords(t, e) {
    const map = { sqli: /sqli/, session: /logout|fixation/, xss: /xss/, csrf: /csrf/, passwords: /password|pwhash/, jwt: /jwt/, "rest-rmm": /^ep-/, controllers: /controller|service/, "spring-security": /preauthorize|productcontroller/, cicd: /cicd/, "spring-i18n": /i18n|props/, gilt: /props/, async: /promise/, workers: /worker/, webcomponents: /messagelist|quiztool|shopping|productinfo|courseinfo|lifecycle|examlist|storagemanager/, spa: /router/, ecma: /defineprop/ };
    return map[t.id] ? map[t.id].test(e.id) : false;
  }
  function bindTheory(id) {
    const body = $("#theory-body");
    const heads = $$("h2", body);
    heads.forEach((h, i) => h.id = "s" + i);
    $("#toc").innerHTML = heads.length > 2 ? "<b>Innhold:</b> " + heads.map((h, i) => `<a href="javascript:void 0" data-sec="s${i}">${esc(h.textContent)}</a>`).join(" · ") : "";
    if (heads.length <= 2) $("#toc").remove();
    $$("[data-sec]").forEach(a => a.addEventListener("click", () => document.getElementById(a.dataset.sec).scrollIntoView({ behavior: "smooth" })));
    $("#mark-read").addEventListener("click", (ev) => {
      Store.data.read[id] = !Store.data.read[id];
      Store.save();
      ev.target.textContent = Store.data.read[id] ? "✓ Lest" : "Marker som lest";
    });
  }

  /* ---------- Øvinger ---------- */
  let exFilter = "all";
  function viewExList() {
    const list = DAT.exercises.filter(e => exFilter === "all" || e.area === exFilter);
    const typeName = { js: "Kjøres + testes", rubric: "Sjekkliste", endpoints: "Tabell" };
    return `<h1>Kodeøvinger</h1>
<p class="lead">Ekte eksamensoppgaver. <b>JavaScript</b> kjøres i en sandkasse og testes automatisk. <b>Java/Spring/SQL/properties</b> sjekkes mot en sjekkliste med det sensor ser etter (syntaksfeil teller lite – det gjør det på eksamen også).</p>
<div class="filter-row">${["all", ...areaOrder].map(a => `<button type="button" data-f="${a}" class="${exFilter === a ? "active" : ""}">${a === "all" ? "Alle" : esc(A[a].name)}</button>`).join("")}</div>
<div class="grid">${list.map(e => `<a class="card" href="#/oving/${e.id}">${areaPill(e.area)} <span class="pill">${typeName[e.type]}</span> ${statusFor("e:" + e.id)}
<h3 style="margin-top:8px">${esc(e.title)}</h3><p class="small muted">${esc(e.source)} · ${"★".repeat(e.level)}${"☆".repeat(3 - e.level)}</p></a>`).join("")}</div>`;
  }
  function bindExList() {
    $$("[data-f]").forEach(b => b.addEventListener("click", () => { exFilter = b.dataset.f; render(); }));
  }

  function viewEx(id) {
    const ex = DAT.exercises.find(e => e.id === id);
    if (!ex) return notFound();
    const best = Store.data.ex[id];
    const head = `<p class="small"><a href="#/oving">← Øvinger</a> · ${areaPill(ex.area)} <span class="pill">${esc(ex.source)}</span> ${best !== undefined ? `<span class="pill ${best >= 1 ? "done" : ""}">Beste: ${pct(best)}</span>` : ""}</p>
<h1>${esc(ex.title)}</h1><div class="card">${ex.prompt}</div>`;
    if (ex.type === "endpoints") {
      const saved = Store.data.drafts[id] || [];
      return head + `<div class="table-wrap"><table class="ep-table" id="ep-table">
<tr><th>Service</th><th>API Method</th><th>Endpoint (URI)</th><th>HTTP</th></tr>
${ex.rows.map((r, i) => `<tr><td>${esc(r.service)}</td>
<td><input type="text" data-i="${i}" data-k="name" value="${esc(saved[i]?.name || "")}" placeholder="getStudent" spellcheck="false"></td>
<td><input type="text" data-i="${i}" data-k="uri" value="${esc(saved[i]?.uri || "")}" placeholder="/students/{sid}" spellcheck="false"></td>
<td><select data-i="${i}" data-k="http">${["", "GET", "POST", "PUT", "PATCH", "DELETE"].map(m => `<option ${saved[i]?.http === m ? "selected" : ""}>${m}</option>`).join("")}</select></td></tr>`).join("")}
</table></div>
<div class="btn-row"><button type="button" class="primary" id="check">Sjekk</button><button type="button" id="show-sol">Vis fasit</button><button type="button" id="reset">Tøm</button></div>
<div id="result" class="result"></div><div id="solution"></div>`;
    }
    const draft = Store.data.drafts[id] ?? ex.starter;
    const lang = ex.lang || "javascript";
    return head + `
<div>
<div>
<textarea class="code" id="code" wrap="off" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Kode">${esc(draft)}</textarea>
<div class="btn-row">
<button type="button" class="primary" id="check">${ex.type === "js" ? "▶ Kjør tester" : "✔ Sjekk"}</button>
<button type="button" id="show-sol">Vis løsning</button>
<button type="button" id="reset">Tilbakestill</button>
<span class="small muted" style="align-self:center"><span class="kbd">Tab</span> gir innrykk · <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> kjører · utkast lagres automatisk</span>
</div>
</div>
</div>
<div id="result" class="result"></div>
${ex.type === "js" ? `<div class="small muted" style="margin-top:12px">Forhåndsvisning – testene bygger komponenten her:</div>
<iframe id="preview" sandbox="allow-scripts" title="Forhåndsvisning" style="width:100%;height:240px;border:1px solid var(--border);border-radius:10px;background:#fff"></iframe>` : ""}
<div id="solution"></div>
<p class="small muted">Språk: ${esc(lang)}. ${ex.type === "rubric" ? "Sjekklisten leter etter nøkkelelementene en sensor ser etter – den forstår ikke all Java, så les også løsningen." : ""}</p>`;
  }

  function bindEx(id) {
    const ex = DAT.exercises.find(e => e.id === id);
    if (!ex) return;
    const result = $("#result");
    const solution = $("#solution");
    const recordScore = s => {
      Store.data.ex[id] = Math.max(Store.data.ex[id] || 0, s);
      Store.save();
    };

    if (ex.type === "endpoints") {
      const collect = () => {
        const ans = [];
        $$("[data-i]").forEach(el => { (ans[el.dataset.i] ??= {})[el.dataset.k] = el.value; });
        return ans;
      };
      $$("[data-i]").forEach(el => el.addEventListener("input", () => { Store.data.drafts[id] = collect(); Store.save(); }));
      $("#check").addEventListener("click", () => {
        const res = Runner.checkEndpoints(ex, collect());
        const trs = $$("#ep-table tr").slice(1);
        res.rows.forEach((r, i) => {
          const tds = trs[i].children;
          tds[1].className = r.nameOk ? "ok" : "no";
          tds[2].className = r.uriOk ? "ok" : "no";
          tds[3].className = r.methodOk ? "ok" : "no";
        });
        recordScore(res.score);
        result.innerHTML = `<div class="card"><span class="score ${scoreClass(res.score)}">${pct(res.score)}</span> riktige URI + metoder.
<p class="small muted">Grønt = riktig. API-metodenavnet sjekkes bare for at det er camelCase (f.eks. <code>getCourses</code>). Base-URL og navnet på id-variabelen spiller ingen rolle.</p></div>`;
      });
      $("#show-sol").addEventListener("click", () => {
        solution.innerHTML = `<h3>Fasit</h3><div class="table-wrap"><table><tr><th>Service</th><th>Endpoint</th><th>HTTP</th></tr>
${ex.rows.map(r => `<tr><td>${esc(r.service)}</td><td><code>/${esc(r.accept.join("  eller  /"))}</code></td><td>${r.method}${r.alsoMethod ? " (" + r.alsoMethod.join("/") + " godtas)" : ""}</td></tr>`).join("")}</table></div>
<p class="small muted"><code>{}</code> = en id, f.eks. <code>{sid}</code>.</p>`;
      });
      $("#reset").addEventListener("click", () => { delete Store.data.drafts[id]; Store.save(); render(); });
      return;
    }

    const ta = $("#code");
    let t;
    ta.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { Store.data.drafts[id] = ta.value; Store.save(); }, 400); });
    ta.addEventListener("keydown", ev => {
      if (ev.key === "Tab") {
        ev.preventDefault();
        const s = ta.selectionStart, e = ta.selectionEnd;
        ta.setRangeText("    ", s, e, "end");
        ta.dispatchEvent(new Event("input"));
      } else if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        $("#check").click();
      }
    });

    $("#check").addEventListener("click", async () => {
      Store.data.drafts[id] = ta.value; Store.save();
      if (ex.type === "js") {
        const btn = $("#check");
        btn.disabled = true; btn.textContent = "Kjører …";
        const forbidden = (ex.forbid || []).filter(f => new RegExp(f.re).test(ta.value));
        const res = await Runner.runJs(ex, ta.value, $("#preview"));
        btn.disabled = false; btn.textContent = "▶ Kjør tester";
        const items = [...forbidden.map(f => ({ name: f.msg, ok: false })), ...res.results];
        const score = items.length ? items.filter(r => r.ok).length / items.length : 0;
        recordScore(score);
        result.innerHTML = `<div class="card"><span class="score ${scoreClass(score)}">${pct(score)}</span> – ${items.filter(r => r.ok).length} av ${items.length} tester bestått
${res.errors && res.errors.length ? `<div class="callout bad"><span class="callout-title">Feil i koden</span>${res.errors.map(e => `<div><code>${esc(e)}</code></div>`).join("")}</div>` : ""}
<ul class="check-list">${items.map(r => `<li class="${r.ok ? "ok" : "no"}">${esc(r.name)}</li>${!r.ok && r.msg ? `<li class="hint">${esc(r.msg)}</li>` : ""}`).join("")}</ul>
${res.logs && res.logs.length ? `<details><summary>console.log (${res.logs.length})</summary><div><pre>${esc(res.logs.join("\n"))}</pre></div></details>` : ""}
${score === 1 ? `<div class="callout good">Alle tester bestått! Sammenlign likevel med løsningen – sensor ser også på lesbarhet og moderne JS.</div>` : ""}</div>`;
      } else {
        const res = Runner.checkRubric(ex, ta.value);
        recordScore(res.score);
        result.innerHTML = `<div class="card"><span class="score ${scoreClass(res.score)}">${pct(res.score)}</span> av sjekklisten
<ul class="check-list">${res.items.map(r => `<li class="${r.ok ? "ok" : "no"}">${esc(r.label)}${r.weight < 1 ? ' <span class="pill">bonus</span>' : ""}</li>${!r.ok && r.hint ? `<li class="hint">${esc(r.hint)}</li>` : ""}`).join("")}</ul></div>`;
      }
    });

    $("#show-sol").addEventListener("click", () => {
      const lang = ex.lang || "javascript";
      if (ex.solution || ex.solutionText) {
        solution.innerHTML = `<h3>Løsningsforslag</h3>${codeBlock(ex.solution || ex.solutionText, lang)}`;
      } else if (ex.solutionRef) {
        const th = DAT.theory.find(x => x.id === ex.solutionRef);
        const blocks = [...(th?.html || "").matchAll(/~~~(\w*)\n([\s\S]*?)~~~/g)].map(m => ({ lang: m[1], code: m[2] }));
        const scored = blocks.map(b => ({ ...b, s: Runner.checkRubric(ex, b.code).score })).sort((a, b) => b.s - a.s);
        const show = scored.length && scored[0].s >= 0.75 ? [scored[0]] : scored.filter(b => b.s > 0);
        solution.innerHTML = `<h3>Løsningsforslag</h3>${show.map(b => codeBlock(b.code, b.lang)).join("")}
<p class="small muted">Fra teorien: <a href="#/teori/${ex.solutionRef}">${esc(th?.title || ex.solutionRef)}</a> – der står også forklaringen.</p>`;
      }
      solution.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("#reset").addEventListener("click", () => {
      if (!confirm("Tilbakestille koden til startkoden? Utkastet ditt slettes.")) return;
      delete Store.data.drafts[id]; Store.save(); render();
    });
  }

  /* ---------- Skriftlige ---------- */
  let wrFilter = "all";
  function viewWrittenList() {
    const list = DAT.written.filter(w => wrFilter === "all" || w.area === wrFilter);
    return `<h1>Skriftlige spørsmål</h1>
<p class="lead">Ekte teorispørsmål fra tidligere eksamener. Skriv svaret ditt (norsk eller engelsk), og få det sjekket mot nøkkelpunktene sensor ser etter. Nøkkelord-sjekken er grov – den viser hva du har <i>nevnt</i>, ikke om forklaringen er god. Les alltid teorisiden etterpå.</p>
<div class="filter-row">${["all", ...areaOrder].map(a => `<button type="button" data-f="${a}" class="${wrFilter === a ? "active" : ""}">${a === "all" ? "Alle" : esc(A[a].name)}</button>`).join("")}</div>
<div class="grid">${list.map(w => `<a class="card" href="#/skriv/${w.id}">${areaPill(w.area)} ${statusFor("w:" + w.id)} ${Store.data.written[w.id]?.self ? `<span class="pill">${esc(Store.data.written[w.id].self)}</span>` : ""}
<p class="small" style="margin-bottom:4px">${esc(w.q.length > 150 ? w.q.slice(0, 150) + "…" : w.q)}</p><p class="small muted" style="margin:0">${esc(w.source)}</p></a>`).join("")}</div>`;
  }
  function bindWrittenList() {
    $$("[data-f]").forEach(b => b.addEventListener("click", () => { wrFilter = b.dataset.f; render(); }));
  }
  function viewWritten(id) {
    const w = DAT.written.find(x => x.id === id);
    if (!w) return notFound();
    const i = DAT.written.indexOf(w);
    const next = DAT.written[i + 1];
    const draft = Store.data.drafts["w:" + id] || "";
    return `<p class="small"><a href="#/skriv">← Skriftlige</a> · ${areaPill(w.area)} <span class="pill">${esc(w.source)}</span></p>
<div class="card"><b>${esc(w.q)}</b></div>
<textarea class="answer" id="answer" placeholder="Skriv svaret ditt her – som på eksamen. Tips: definisjon → mekanisme → konsekvens → eksempel → tiltak.">${esc(draft)}</textarea>
<div class="btn-row"><button type="button" class="primary" id="check">Sjekk nøkkelpunkter</button>
<button type="button" id="reveal">Vis hva sensor ser etter</button>
<a class="btn" href="#/teori/${w.theory}">Åpne teorien</a>
${next ? `<a class="btn" href="#/skriv/${next.id}">Neste →</a>` : ""}</div>
<div id="result" class="result"></div>
<div class="card small"><b>Egenvurdering etter å ha lest teorien:</b>
<div class="btn-row">${["Kunne det", "Delvis", "Må øve mer"].map(s => `<button type="button" data-self="${s}" class="${Store.data.written[id]?.self === s ? "primary" : ""}">${s}</button>`).join("")}</div></div>`;
  }
  function bindWritten(id) {
    const w = DAT.written.find(x => x.id === id);
    if (!w) return;
    const ta = $("#answer");
    ta.addEventListener("input", () => { Store.data.drafts["w:" + id] = ta.value; Store.save(); });
    const show = (reveal) => {
      const res = Runner.checkWritten(w, ta.value);
      if (!reveal) {
        const prev = Store.data.written[id] || {};
        Store.data.written[id] = { ...prev, score: Math.max(prev.score || 0, res.score) };
        Store.save();
      }
      $("#result").innerHTML = `<div class="card">${reveal ? "<b>Nøkkelpunkter et fullt svar bør dekke:</b>" : `<span class="score ${scoreClass(res.score)}">${pct(res.score)}</span> av nøkkelpunktene nevnt`}
<ul class="check-list">${res.items.map(r => `<li class="${reveal ? "" : r.ok ? "ok" : "no"}">${esc(r.label)}</li>`).join("")}</ul>
<p class="small muted">Full forklaring og formulering: <a href="#/teori/${w.theory}">teorisiden</a> (se de grønne «Eksamenssvar»-boksene).</p></div>`;
    };
    $("#check").addEventListener("click", () => show(false));
    $("#reveal").addEventListener("click", () => show(true));
    $$("[data-self]").forEach(b => b.addEventListener("click", () => {
      Store.data.written[id] = { ...(Store.data.written[id] || { score: 0 }), self: b.dataset.self };
      Store.save();
      $$("[data-self]").forEach(x => x.classList.toggle("primary", x === b));
    }));
  }

  /* ---------- Quiz ---------- */
  let quiz = null;
  function startQuiz(area) {
    let pool = DAT.quiz.map((q, i) => ({ ...q, i }));
    if (area === "wrong") pool = pool.filter(q => Store.data.quiz.wrong[q.i]);
    else if (area === "g11n") pool = pool.filter(q => q.area === "g11n" || q.area === "ud");
    else if (area !== "all") pool = pool.filter(q => q.area === area);
    pool.sort(() => Math.random() - 0.5);
    quiz = { area, list: pool.slice(0, area === "wrong" ? pool.length : 12), pos: 0, right: 0, answered: false, picked: new Set() };
  }
  function viewQuizHome() {
    const wrongN = Object.keys(Store.data.quiz.wrong).length;
    return `<h1>Quiz</h1><p class="lead">Flervalg fra tidligere eksamener (h21/h22 hadde egne MC-deler) og fra pensum. 12 tilfeldige spørsmål per runde. Feil du svarer havner i «Øv på feil».</p>
<div class="grid">
<a class="card" href="#/quiz/all"><h3>🎲 Alle områder</h3><p class="small muted">${DAT.quiz.length} spørsmål totalt</p></a>
${areaOrder.filter(a => a !== "ud").map(a => `<a class="card" href="#/quiz/${a}"><h3>${esc(a === "g11n" ? "Globalization + UD" : A[a].name)}</h3><p class="small muted">${DAT.quiz.filter(q => q.area === a || (a === "g11n" && q.area === "ud")).length} spørsmål</p></a>`).join("")}
<a class="card" href="#/quiz/wrong"><h3>🔁 Øv på feil</h3><p class="small muted">${wrongN} spørsmål du har svart feil på</p></a>
</div>
<p class="small muted">Totalt: ${Store.data.quiz.answered} svar, ${Store.data.quiz.answered ? pct(Store.data.quiz.correct / Store.data.quiz.answered) : "–"} riktige.</p>`;
  }
  function viewQuiz(area) {
    if (!quiz || quiz.area !== area) startQuiz(area);
    if (!quiz.list.length) return `<h1>Quiz</h1><div class="callout good">${area === "wrong" ? "Ingen feil å øve på – bra!" : "Ingen spørsmål her."}</div><a class="btn" href="#/quiz">← Tilbake</a>`;
    if (quiz.pos >= quiz.list.length) {
      const s = quiz.right / quiz.list.length;
      return `<h1>Resultat</h1><div class="card"><span class="score ${scoreClass(s)}">${quiz.right} / ${quiz.list.length} (${pct(s)})</span>
<p>${s >= 0.85 ? "Sterkt! 💪" : s >= 0.6 ? "Bra – les forklaringene på de du bommet på." : "Les teorien for dette området og prøv igjen."}</p></div>
<div class="btn-row"><button type="button" class="primary" id="again">Ny runde</button><a class="btn" href="#/quiz">Velg område</a></div>`;
    }
    const q = quiz.list[quiz.pos];
    const multi = q.correct.length > 1;
    return `<p class="small"><a href="#/quiz">← Quiz</a> · ${areaPill(q.area)} · Spørsmål ${quiz.pos + 1} av ${quiz.list.length}</p>
<div class="progress" style="margin-bottom:16px"><span style="width:${quiz.pos / quiz.list.length * 100}%"></span></div>
<div class="card"><div class="quiz-q">${esc(q.q)}</div>${multi ? '<p class="small muted">Velg <b>alle</b> riktige, og trykk «Svar».</p>' : ""}
${q.options.map((o, i) => `<button type="button" class="opt" data-o="${i}">${esc(o)}</button>`).join("")}
${multi ? '<div class="btn-row"><button type="button" class="primary" id="submit">Svar</button></div>' : ""}
<div id="feedback"></div></div>`;
  }
  function bindQuiz(area) {
    const again = $("#again");
    if (again) { again.addEventListener("click", () => { startQuiz(area); render(); }); return; }
    if (!quiz || !quiz.list.length || quiz.pos >= quiz.list.length) return;
    const q = quiz.list[quiz.pos];
    const multi = q.correct.length > 1;
    const finish = () => {
      if (quiz.answered) return;
      quiz.answered = true;
      const picked = [...quiz.picked].sort().join(",");
      const ok = picked === [...q.correct].sort().join(",");
      if (ok) quiz.right++;
      const st = Store.data.quiz;
      st.answered++; if (ok) { st.correct++; delete st.wrong[q.i]; } else st.wrong[q.i] = true;
      Store.save();
      $$(".opt").forEach(b => {
        const i = +b.dataset.o;
        b.classList.remove("picked");
        if (q.correct.includes(i)) b.classList.add("correct");
        else if (quiz.picked.has(i)) b.classList.add("wrong");
        b.disabled = true;
      });
      $("#submit")?.remove();
      $("#feedback").innerHTML = `<div class="callout ${ok ? "good" : "bad"}"><span class="callout-title">${ok ? "Riktig!" : "Feil"}</span>${esc(q.explain)}</div>
<div class="btn-row"><button type="button" class="primary" id="next">${quiz.pos + 1 < quiz.list.length ? "Neste →" : "Se resultat"}</button></div>`;
      $("#next").addEventListener("click", () => { quiz.pos++; quiz.answered = false; quiz.picked = new Set(); render(); });
      $("#next").focus();
    };
    $$(".opt").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.o;
      if (multi) {
        quiz.picked.has(i) ? quiz.picked.delete(i) : quiz.picked.add(i);
        b.classList.toggle("picked");
      } else { quiz.picked = new Set([i]); finish(); }
    }));
    $("#submit")?.addEventListener("click", finish);
  }

  /* ---------- Prøveeksamen ---------- */
  let timerInt = null;
  function viewExams() {
    return `<h1>Prøveeksamen</h1>
<p class="lead">Ta en hel eksamen under ekte forhold: 4 timer, ingen hjelpemidler, skriv i et tomt dokument. Rett deg selv etterpå med øvingene og teorien som er koblet til hver deloppgave.</p>
<div class="callout warn">PDF-lenkene peker til filene i mappen over studiesiden (<code>DAT152/2026</code>). Custom tags-oppgavene i h23–h24 kan du hoppe over.</div>
<div class="grid">${DAT.exams.map(x => {
  const linked = x.tasks.filter(t => t.link && (t.link.startsWith("e:") || t.link.startsWith("w:")));
  const done = linked.filter(t => (t.link.startsWith("e:") ? Store.data.ex[t.link.slice(2)] : Store.data.written[t.link.slice(2)]?.score) >= 0.8).length;
  return `<a class="card" href="#/eksamen/${x.id}"><h3>${esc(x.name)}</h3><p class="small muted">${x.tasks.length} deloppgaver · ${done}/${linked.length} øvd på</p></a>`;
}).join("")}</div>`;
  }
  function viewExam(id) {
    const x = DAT.exams.find(e => e.id === id);
    if (!x) return notFound();
    return `<p class="small"><a href="#/eksamen">← Prøveeksamener</a></p>
<h1>${esc(x.name)}</h1>
<div class="card"><div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
<div><div class="small muted">Gjenstående tid</div><div class="timer" id="timer">4:00:00</div></div>
<div class="btn-row"><button type="button" class="primary" id="t-start">Start</button><button type="button" id="t-pause">Pause</button><button type="button" id="t-reset">Nullstill</button></div></div>
<p class="small muted">Tidtakeren fortsetter selv om du lukker siden.</p></div>
<div class="btn-row"><a class="btn" href="${esc(x.pdf)}" target="_blank" rel="noopener">📄 Åpne oppgavesettet (PDF)</a>${x.solution ? `<a class="btn" href="${esc(x.solution)}" target="_blank" rel="noopener">✅ Løsning / sensorveiledning</a>` : ""}</div>
<div class="table-wrap"><table><tr><th>Deloppgave</th><th>Vekt</th><th>Tidsbudsjett</th><th>Øv / rett</th></tr>
${x.tasks.map(t => `<tr><td>${esc(t.label)}</td><td>${t.pct ? t.pct + " %" : "–"}</td><td>${t.pct ? Math.round(t.pct * 2.4) + " min" : "–"}</td><td>${t.link ? `<a href="${linkFor(t.link)}">Åpne</a> ${statusFor(t.link)}` : "–"}</td></tr>`).join("")}
</table></div>`;
  }
  function bindExam(id) {
    const T = Store.data.timers[id] ??= { remaining: 4 * 3600, startedAt: null };
    const left = () => T.startedAt ? Math.max(0, T.remaining - (Date.now() - T.startedAt) / 1000) : T.remaining;
    const fmt = s => { s = Math.round(s); return `${Math.floor(s / 3600)}:${String(Math.floor(s % 3600 / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
    const tick = () => { const el = $("#timer"); if (!el) { clearInterval(timerInt); return; } el.textContent = fmt(left()); };
    clearInterval(timerInt);
    timerInt = setInterval(tick, 1000); tick();
    $("#t-start").addEventListener("click", () => { if (!T.startedAt) { T.startedAt = Date.now(); Store.save(); } });
    $("#t-pause").addEventListener("click", () => { if (T.startedAt) { T.remaining = left(); T.startedAt = null; Store.save(); tick(); } });
    $("#t-reset").addEventListener("click", () => { T.remaining = 4 * 3600; T.startedAt = null; Store.save(); tick(); });
  }

  /* ---------- JWT-lab ---------- */
  const enc = new TextEncoder();
  const b64u = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const b64uStr = s => b64u(enc.encode(s));
  const fromB64u = s => {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0)));
  };
  const SHA = (() => {
    const primes = []; for (let n = 2; primes.length < 64; n++) if (primes.every(p => n % p)) primes.push(n);
    const frac = x => Math.floor((x - Math.floor(x)) * 4294967296) >>> 0;
    const K = primes.map(p => frac(Math.cbrt(p)));
    const H0 = primes.slice(0, 8).map(p => frac(Math.sqrt(p)));
    const ror = (x, n) => (x >>> n) | (x << (32 - n));
    return function sha256(bytes) {
      const l = bytes.length, total = ((l + 9 + 63) >> 6) << 6;
      const buf = new Uint8Array(total); buf.set(bytes); buf[l] = 0x80;
      const dv = new DataView(buf.buffer);
      dv.setUint32(total - 4, (l * 8) >>> 0); dv.setUint32(total - 8, Math.floor(l * 8 / 4294967296));
      const H = H0.slice(), W = new Uint32Array(64);
      for (let i = 0; i < total; i += 64) {
        for (let t = 0; t < 16; t++) W[t] = dv.getUint32(i + t * 4);
        for (let t = 16; t < 64; t++) {
          const s0 = ror(W[t - 15], 7) ^ ror(W[t - 15], 18) ^ (W[t - 15] >>> 3);
          const s1 = ror(W[t - 2], 17) ^ ror(W[t - 2], 19) ^ (W[t - 2] >>> 10);
          W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
        }
        let [a, b, c, d, e, f, g, h] = H;
        for (let t = 0; t < 64; t++) {
          const t1 = (h + (ror(e, 6) ^ ror(e, 11) ^ ror(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + W[t]) >>> 0;
          const t2 = ((ror(a, 2) ^ ror(a, 13) ^ ror(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
          h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
        }
        [a, b, c, d, e, f, g, h].forEach((v, k) => H[k] = (H[k] + v) >>> 0);
      }
      const out = new Uint8Array(32); const odv = new DataView(out.buffer);
      H.forEach((v, k) => odv.setUint32(k * 4, v));
      return out;
    };
  })();
  function hmac(keyStr, msgStr) {
    let key = enc.encode(keyStr);
    if (key.length > 64) key = SHA(key);
    const k = new Uint8Array(64); k.set(key);
    const ipad = k.map(x => x ^ 0x36), opad = k.map(x => x ^ 0x5c);
    const msg = enc.encode(msgStr);
    const inner = new Uint8Array(64 + msg.length); inner.set(ipad); inner.set(msg, 64);
    const ih = SHA(inner);
    const outer = new Uint8Array(96); outer.set(opad); outer.set(ih, 64);
    return SHA(outer);
  }
  const signHS256 = (header, payload, secret) => {
    const data = b64uStr(JSON.stringify(header)) + "." + b64uStr(JSON.stringify(payload));
    return data + "." + b64u(hmac(secret, data));
  };
  window.__dat152sha = { SHA, hmac };   // for selvtest i konsollen

  const SERVER_SECRET = "sentrum";
  const WORDLIST = "123456 password admin secret qwerty letmein welcome oslo bergen trondheim stavanger tromso kronstad fana hvl dat152 dat151 java spring jwt token victory sommer vinter regn fjell fjord sentrum bryggen ulriken floyen nordnes sandviken laksevag asane arna".split(" ");

  function viewJwt() {
    const tok = signHS256({ alg: "HS256", typ: "JWT" }, { sub: "bob", role: "USER", iss: "dat152-idp", iat: 1730803010, exp: 1893456000 }, SERVER_SECRET);
    return `<h1>JWT-lab</h1>
<p class="lead">Lær JWT ved å gjøre angrepene selv. Alt skjer lokalt i nettleseren. Serveren i laben bruker den svake HS256-hemmeligheten fra eksamen v26.</p>

<h2>1. Dekod en token</h2>
<p>Lim inn en JWT. Legg merke til at header og payload bare er <b>Base64URL-kodet</b> – hvem som helst kan lese dem.</p>
<textarea class="code" id="jwt-in" style="min-height:90px">${esc(tok)}</textarea>
<div id="jwt-out"></div>

<h2>2. Knekk den svake hemmeligheten (offline brute force)</h2>
<p>Angriperen har fanget tokenen over. Hun prøver hvert ord i en ordliste: beregner <code>HMAC-SHA256(ord, header.payload)</code> og sammenligner med signaturen. Ingen kontakt med serveren trengs.</p>
<textarea class="code" id="wordlist" style="min-height:80px">${esc(WORDLIST.join("\n"))}</textarea>
<div class="btn-row"><button type="button" class="primary" id="crack">🔨 Start brute force</button></div>
<div id="crack-out"></div>

<h2>3. alg: "none"-angrepet</h2>
<p>Endre <code>role</code> til <code>ADMIN</code>, sett <code>alg</code> til <code>none</code> og fjern signaturen (behold siste punktum).</p>
<div class="btn-row"><button type="button" id="mk-none">Lag alg:none-token med role ADMIN</button><button type="button" id="mk-tamper">Lag RS/HS-token med endret payload (gammel signatur)</button></div>
<textarea class="code" id="attack-tok" style="min-height:80px" placeholder="Angrepstoken kommer her – eller lim inn din egen"></textarea>
<div class="btn-row"><button type="button" id="srv-parse">Server bruker parse(token)</button><button type="button" id="srv-claims">Server bruker parseClaimsJws(token)</button></div>
<div id="srv-out"></div>
<div class="callout"><span class="callout-title">Koden på serveren (som i eksamensoppgaven)</span>
${codeBlock(`try {
    Jwt jwt = Jwts.parser().setSigningKey(KEY).parse(accessToken);   // or parseClaimsJws
    Claims claims = (Claims) jwt.getBody();
    String role = (String) claims.get("role");
    if (role.equals("ADMIN")) {
        deleteAllUsers();                                      // (2)
    } else {
        log.error("You are not an admin user");               // (3)
    }
} catch (JwtException e) {
    throw new InvalidTokenException(e);                        // (1)
}`, "java")}</div>`;
  }
  function bindJwt() {
    const decode = () => {
      const v = $("#jwt-in").value.trim();
      const parts = v.split(".");
      try {
        const h = JSON.parse(fromB64u(parts[0])), p = JSON.parse(fromB64u(parts[1]));
        let verdict = "";
        if (h.alg === "HS256" && parts[2]) {
          const ok = b64u(hmac(SERVER_SECRET, parts[0] + "." + parts[1])) === parts[2];
          verdict = ok ? `<div class="callout good">Signaturen er gyldig for serverens hemmelighet.</div>` : `<div class="callout bad">Signaturen stemmer ikke med serverens hemmelighet (endret token eller annen nøkkel).</div>`;
        }
        $("#jwt-out").innerHTML = `<div class="card"><div class="jwt-part"><span class="jwt-h">${esc(parts[0])}</span>.<span class="jwt-p">${esc(parts[1])}</span>.<span class="jwt-s">${esc(parts[2] || "")}</span></div>
<div class="split"><div><b class="jwt-h">Header</b>${codeBlock(JSON.stringify(h, null, 2), "json")}</div><div><b class="jwt-p">Payload</b>${codeBlock(JSON.stringify(p, null, 2), "json")}</div></div>
${p.exp ? `<p class="small">exp = ${new Date(p.exp * 1000).toLocaleString("nb-NO")}${p.exp * 1000 < Date.now() ? " – <b>UTLØPT</b>" : ""}</p>` : ""}${verdict}</div>`;
      } catch (e) {
        $("#jwt-out").innerHTML = `<div class="callout bad">Kunne ikke dekode: ${esc(e.message)}</div>`;
      }
    };
    $("#jwt-in").addEventListener("input", decode);
    decode();

    $("#crack").addEventListener("click", async () => {
      const tok = $("#jwt-in").value.trim().split(".");
      const words = $("#wordlist").value.split(/\s+/).filter(Boolean);
      const out = $("#crack-out");
      const t0 = performance.now();
      let found = null, tried = 0;
      for (const w of words) {
        tried++;
        if (b64u(hmac(w, tok[0] + "." + tok[1])) === tok[2]) { found = w; break; }
        if (tried % 5 === 0) { out.innerHTML = `<p class="small">Prøver «${esc(w)}» … (${tried})</p>`; await new Promise(r => setTimeout(r, 30)); }
      }
      const ms = Math.round(performance.now() - t0);
      if (!found) { out.innerHTML = `<div class="callout warn">Ikke funnet etter ${tried} forsøk (${ms} ms). Prøv en større ordliste.</div>`; return; }
      const p = JSON.parse(fromB64u(tok[1]));
      const forged = signHS256(JSON.parse(fromB64u(tok[0])), { ...p, role: "ADMIN" }, found);
      out.innerHTML = `<div class="callout bad"><span class="callout-title">Hemmeligheten er «${esc(found)}» – funnet etter ${tried} forsøk på ${ms} ms</span>
Med ekte verktøy (hashcat på GPU) testes <b>milliarder</b> per sekund – alle ordbok-ord knekkes umiddelbart.
<p>Forfalsket token med <code>role: ADMIN</code>, <b>gyldig signert</b>:</p><div class="jwt-part">${esc(forged)}</div>
<p class="small">Lim den inn i felt 1 – den verifiserer mot serveren. Serveren kan ikke skille den fra en ekte token.</p></div>
<div class="callout good"><b>Tiltak:</b> lang tilfeldig hemmelighet (≥ 256 bit fra SecureRandom), eller asymmetrisk signering (RS256) der bare IdP har den private nøkkelen.</div>`;
    });

    const baseParts = () => $("#jwt-in").value.trim().split(".");
    $("#mk-none").addEventListener("click", () => {
      const p = JSON.parse(fromB64u(baseParts()[1]));
      $("#attack-tok").value = b64uStr(JSON.stringify({ alg: "none" })) + "." + b64uStr(JSON.stringify({ ...p, role: "ADMIN" })) + ".";
    });
    $("#mk-tamper").addEventListener("click", () => {
      const [h, pl, s] = baseParts();
      const p = JSON.parse(fromB64u(pl));
      $("#attack-tok").value = h + "." + b64uStr(JSON.stringify({ ...p, role: "ADMIN" })) + "." + s;
    });
    const simulate = (mode) => {
      const v = $("#attack-tok").value.trim() || $("#jwt-in").value.trim();
      const [h, p, s] = v.split(".");
      let header, claims;
      try { header = JSON.parse(fromB64u(h)); claims = JSON.parse(fromB64u(p)); }
      catch (e) { $("#srv-out").innerHTML = `<div class="callout bad">(1) InvalidTokenException – MalformedJwtException</div>`; return; }
      const signed = !!s;
      let outcome, why;
      if (!signed) {
        if (mode === "parse") { outcome = claims.role === "ADMIN" ? "(2) deleteAllUsers() 💥" : "(3) logger «You are not an admin user»"; why = "parse() ser at tokenen ikke har signatur og returnerer claims <b>uten verifisering</b>. Angriperen bestemmer selv rollen → privilege escalation."; }
        else { outcome = "(1) InvalidTokenException"; why = "parseClaimsJws() forventer en <b>signert</b> JWS og kaster UnsupportedJwtException for usignerte tokens."; }
      } else {
        const ok = header.alg === "HS256" && b64u(hmac(SERVER_SECRET, h + "." + p)) === s;
        if (!ok) { outcome = "(1) InvalidTokenException"; why = "Tokenen har signatur, så den verifiseres – men signaturen stemmer ikke med header+payload (payload er endret, eller feil nøkkel) → SignatureException. Gjelder både parse() og parseClaimsJws()."; }
        else { outcome = claims.role === "ADMIN" ? "(2) deleteAllUsers()" : "(3) logger «You are not an admin user»"; why = "Gyldig signatur. Hvis dette er en forfalsket ADMIN-token fra brute force-steget, har angriperen vunnet fordi hemmeligheten var svak."; }
      }
      $("#srv-out").innerHTML = `<div class="callout ${outcome.startsWith("(1)") ? "good" : outcome.includes("delete") ? "bad" : ""}"><span class="callout-title">${mode === "parse" ? "parse()" : "parseClaimsJws()"} → ${outcome}</span>${why}</div>`;
    };
    $("#srv-parse").addEventListener("click", () => simulate("parse"));
    $("#srv-claims").addEventListener("click", () => simulate("claims"));
  }

  /* ---------- Statiske sider ---------- */
  const viewTechnique = () => DAT.technique;
  const viewCheat = () => DAT.cheatsheet;
  const notFound = () => `<h1>Fant ikke siden</h1><p><a href="#/">Til oversikten</a></p>`;

  /* ---------------- Router ---------------- */
  function render() {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
    const [page, id] = parts;
    let html, bind = () => {};
    switch (page) {
      case undefined: html = viewHome(); bind = bindTasks; break;
      case "plan": html = viewPlan(); bind = () => { bindTasks(); $("#today")?.scrollIntoView({ block: "center" }); }; break;
      case "teknikk": html = viewTechnique(); break;
      case "jukselapp": html = viewCheat(); break;
      case "teori": html = id ? viewTheory(id) : viewTheoryList(); bind = id ? () => bindTheory(id) : bind; break;
      case "oving": html = id ? viewEx(id) : viewExList(); bind = id ? () => bindEx(id) : bindExList; break;
      case "skriv": html = id ? viewWritten(id) : viewWrittenList(); bind = id ? () => bindWritten(id) : bindWrittenList; break;
      case "quiz": html = id ? viewQuiz(id) : viewQuizHome(); bind = id ? () => bindQuiz(id) : bind; break;
      case "eksamen": html = id ? viewExam(id) : viewExams(); bind = id ? () => bindExam(id) : bind; break;
      case "jwt": html = viewJwt(); bind = bindJwt; break;
      default: html = notFound();
    }
    app.innerHTML = renderContent(html);
    bind();
    $$("#nav a").forEach(a => {
      const target = a.getAttribute("href").replace(/^#\/?/, "").split("/")[0];
      a.classList.toggle("active", target === (page || ""));
    });
    $("#sidebar").classList.remove("open");
    renderMiniCountdown();
  }

  let lastPage = null;
  window.addEventListener("hashchange", () => {
    const page = location.hash.split("/").slice(0, 3).join("/");
    if (page !== lastPage) window.scrollTo(0, 0);
    lastPage = page;
    if (!location.hash.startsWith("#/quiz/")) quiz = null;
    render();
  });

  /* Tema */
  const applyTheme = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  try { applyTheme(localStorage.getItem("dat152-theme")); } catch (e) { }
  $("#theme-btn").addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("dat152-theme", next); } catch (e) { }
  });
  $("#menu-btn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

  render();
})();

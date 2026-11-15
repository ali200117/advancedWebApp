/* Enkel kodeeditor på en <textarea>: lukker parenteser og anførselstegn, holder innrykk, Tab/Shift+Tab.
   Ingen kodeforslag. */
window.Editor = (() => {
  const PAIRS = { "(": ")", "{": "}", "[": "]", '"': '"', "'": "'", "`": "`" };
  const CLOSERS = new Set([")", "}", "]"]);
  const INDENT = "    ";

  /* Setter inn tekst på markøren slik at Ctrl+Z fortsatt virker. */
  function insert(ta, text, caretStart, caretEnd) {
    const start = ta.selectionStart;
    let ok = false;
    try { ok = document.execCommand("insertText", false, text); } catch (e) { ok = false; }
    if (!ok) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (caretStart !== undefined) {
      ta.selectionStart = start + caretStart;
      ta.selectionEnd = start + (caretEnd ?? caretStart);
    }
  }

  function lineStart(value, pos) { return value.lastIndexOf("\n", pos - 1) + 1; }

  function onKeydown(ev) {
    const ta = ev.target;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const prev = v[s - 1], next = v[e];
    const hasSel = s !== e;

    if (ev.key === "Tab") {
      ev.preventDefault();
      if (!hasSel && !ev.shiftKey) { insert(ta, INDENT); return; }
      // flere linjer: rykk inn / ut hele linjene
      const from = lineStart(v, s);
      const block = v.slice(from, e);
      const lines = block.split("\n");
      const changed = lines.map(l => ev.shiftKey ? l.replace(/^( {1,4}|\t)/, "") : INDENT + l).join("\n");
      ta.selectionStart = from; ta.selectionEnd = e;
      insert(ta, changed, 0, changed.length);
      return;
    }

    if (ev.key === "Enter") {
      ev.preventDefault();
      const ls = lineStart(v, s);
      const indent = /^[ \t]*/.exec(v.slice(ls, s))[0];
      const opens = prev === "{" || prev === "(" || prev === "[";
      if (opens && next === PAIRS[prev]) {
        // {|}  ->  {\n    |\n}
        const text = "\n" + indent + INDENT + "\n" + indent;
        insert(ta, text, 1 + indent.length + INDENT.length);
      } else {
        insert(ta, "\n" + indent + (opens ? INDENT : ""));
      }
      return;
    }

    if (ev.key === "Backspace" && !hasSel) {
      if (prev && PAIRS[prev] === next && next !== undefined) {
        // fjern et tomt par: (|) -> |
        ev.preventDefault();
        ta.selectionStart = s - 1; ta.selectionEnd = s + 1;
        insert(ta, "");
        return;
      }
      const ls = lineStart(v, s);
      const before = v.slice(ls, s);
      if (before.length >= 4 && /^ +$/.test(before) && before.length % 4 === 0) {
        // backspace i innrykk fjerner ett helt nivå
        ev.preventDefault();
        ta.selectionStart = s - 4; ta.selectionEnd = s;
        insert(ta, "");
      }
      return;
    }

    // skriv over en lukkeparentes som allerede står der
    if ((CLOSERS.has(ev.key) || ev.key === '"' || ev.key === "'" || ev.key === "`") && !hasSel && next === ev.key) {
      if (CLOSERS.has(ev.key) || prev !== "\\") {
        ev.preventDefault();
        ta.selectionStart = ta.selectionEnd = s + 1;
        return;
      }
    }

    if (ev.key === "}" && !hasSel) {
      const ls = lineStart(v, s);
      const before = v.slice(ls, s);
      const after = /^([ \t]*)\n([ \t]*)\}/.exec(v.slice(s));
      if (/^[ \t]*$/.test(before) && after && ls > 0) {
        // tom linje rett over en } som allerede står der: fjern linjen og hopp forbi parentesen
        ev.preventDefault();
        ta.selectionStart = ls - 1; ta.selectionEnd = s + after[1].length;
        insert(ta, "");
        ta.selectionStart = ta.selectionEnd = ls - 1 + 1 + after[2].length + 1;
        return;
      }
      // } på en tom linje: ett innrykk ut
      if (/^ +$/.test(before) && before.length >= 4) {
        ev.preventDefault();
        ta.selectionStart = s - 4; ta.selectionEnd = s;
        insert(ta, "}");
        return;
      }
    }

    if (PAIRS[ev.key]) {
      const close = PAIRS[ev.key];
      if (hasSel) {
        // pakk inn markert tekst
        ev.preventDefault();
        const sel = v.slice(s, e);
        insert(ta, ev.key + sel + close, 1, 1 + sel.length);
        return;
      }
      const isQuote = ev.key === close;
      // apostrof inne i et ord (don't) skal ikke dobles
      if (isQuote && prev && /[\w\\]/.test(prev)) return;
      // ikke lukk hvis det står tekst rett etter markøren
      if (next !== undefined && /[\w"'`]/.test(next)) return;
      ev.preventDefault();
      insert(ta, ev.key + close, 1);
    }
  }

  function autosize(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.max(ta.scrollHeight + 4, ta.dataset.min ? +ta.dataset.min : 90) + "px";
  }

  /* code = true gir editor-oppførsel; alle felt vokser med innholdet. */
  function attach(ta, code) {
    if (code) ta.addEventListener("keydown", onKeydown);
    ta.addEventListener("input", () => autosize(ta));
    autosize(ta);
  }

  return { attach, autosize };
})();

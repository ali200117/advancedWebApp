/* Teori: JavaScript (20 %) */
window.DAT = window.DAT || {};
DAT.theory = DAT.theory || [];

DAT.theory.push({
  id: "async",
  area: "js",
  title: "Asynkron JavaScript, event loop og Promises",
  summary: "Én tråd, event loop, callbacks, Promise, async/await, fetch, hva blokkerende kode gjør.",
  html: `
<h2>JavaScript har én hovedtråd</h2>
<p>All JS-kode på en side (inkludert all DOM-tilgang og rendering) kjører på <b>én hovedtråd</b>. Asynkron kode betyr <b>ikke</b> flere tråder – det betyr at kode registreres for å kjøres <b>senere</b>, når en hendelse inntreffer.</p>
<div class="callout bad"><span class="callout-title">Sensorveiledningen h23</span>«Det gis ingen uttelling dersom det settes likhet mellom asynkron oppførsel og bruk av tråder.» Asynkron ≠ flertrådet!</div>

<h2>Event loop</h2>
<ol class="flow">
<li>Call stack kjører synkron kode til den er tom.</li>
<li>Nettleseren (Web APIs) venter på hendelser: klikk, timer, nettverksrespons.</li>
<li>Når en hendelse skjer, legges callbacken i en <b>kø</b> (task queue; Promise-callbacks i microtask queue, som har prioritet).</li>
<li>Når stacken er tom, tar event loop neste callback fra køen og kjører den <b>til slutt</b> (run-to-completion).</li>
<li>Mellom tasks kan nettleseren rendre siden på nytt.</li>
</ol>

<h2>Eksempler på asynkron kjøring (h23 6a i)</h2>
<ul>
<li><b>Event listeners</b>: <code>button.addEventListener("click", handler)</code> – handler kjører først når brukeren klikker, så lenge siden lever. (Sensor vil se addEventListener!)</li>
<li><b>Timere</b>: <code>setTimeout(fn, 1000)</code> – fn kjører tidligst etter 1 s når stacken er ledig.</li>
<li><b>Nettverk</b>: <code>fetch(url)</code> returnerer straks en Promise; <code>then</code>-koden kjører når responsen kommer.</li>
<li><b>Web Worker-meldinger</b>: <code>worker.addEventListener("message", …)</code>.</li>
<li>Andre: <code>requestAnimationFrame</code>, IndexedDB, filelesing, WebSocket-meldinger.</li>
</ul>

<h2>Blokkerende kode (h23, v26)</h2>
<div class="exam-answer"><p>The browser runs JavaScript, event handling and rendering of a page on a <b>single main thread</b>. An asynchronous callback is still executed on this thread, and it runs to completion. If that code is blocking (e.g. a long loop or heavy computation), the event loop cannot process any other events while it runs: clicks, keyboard input, timers and network callbacks are queued but not handled, and the page is not re-rendered. The page/browser tab <b>freezes</b> and becomes unresponsive, animations stop, and the browser may eventually show a "page unresponsive" dialog. Asynchronous code does not run in parallel – it only runs later. To avoid this, heavy work should be moved to a <b>Web Worker</b> or split into smaller chunks.</p></div>

<h2>Promise</h2>
<p>En <b>Promise</b> er et objekt som representerer et fremtidig resultat av en asynkron operasjon. Tilstander: <b>pending</b> → <b>fulfilled</b> (resolve) eller <b>rejected</b> (reject). Den kan bare avgjøres én gang.</p>
~~~javascript
// A Promise resolved by asynchronous code (v26 5b, h23 6a iii)
function waitforSomething() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Done waiting");           // resolved later, by a timer
        }, 1000);
    });
}

// Using fetch: return the Promise WITHOUT await (sensor note h23)
function waitforSomething2() {
    return fetch("../api/count");
}

// Promise resolved by a user event
function waitForClick(button) {
    return new Promise(resolve => {
        button.addEventListener("click", event => resolve(event), { once: true });
    });
}
~~~

<h3>then/catch vs. async/await</h3>
~~~javascript
waitforSomething()
    .then(answer => console.log("Resolved with " + answer))
    .catch(e => console.log("Rejected with " + e.message));

async function myFunction() {
    try {
        const answer = await waitforSomething();   // pauses this function only
        console.log("Resolved with " + answer);
    } catch (e) {
        console.log("Rejected with " + e.message);
    }
}
~~~
<div class="exam-answer"><p>The object after <code>await</code> must be a <b>Promise</b> (or a thenable). If the value is not a Promise, it is wrapped in a Promise that resolves immediately. A Promise represents the eventual result of asynchronous code: it is pending until it is fulfilled (resolve) or rejected (reject). With <code>await</code>, the code after the await acts as the <code>then</code> part and the value of the expression is the resolved value; a rejection throws and is handled by <code>catch</code>. An <code>async</code> function always returns a Promise.</p></div>

<h2>fetch – mønsteret fra eksamen</h2>
~~~javascript
async #fetchCount() {
    try {
        const response = await fetch("../api/count", { method: "GET" });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const countResponse = await response.json();   // also a Promise
        if (countResponse.responseStatus) {
            this.#countElm.textContent = countResponse.count;
        }
    } catch (error) {
        console.log(error.message);                   // network error or bad JSON
    }
}
~~~
<p>Merk: <code>fetch</code> rejecter bare ved <b>nettverksfeil</b>, ikke ved HTTP 404/500 – sjekk <code>response.ok</code>.</p>
`
});

DAT.theory.push({
  id: "workers",
  area: "js",
  title: "Web Workers og tråder",
  summary: "Hva en worker er, hvorfor den ikke har DOM-tilgang, postMessage/message, og maks antall tråder mot DOM.",
  html: `
<h2>Hva er en Web Worker?</h2>
<p>En Web Worker kjører JavaScript i en <b>egen bakgrunnstråd</b>, separat fra hovedtråden. Brukes til tunge beregninger (bildeprosessering, kryptering, store datasett) slik at brukergrensesnittet ikke fryser.</p>
<ul>
<li>Har <b>ikke tilgang til DOM</b> (ingen <code>document</code>, <code>window</code>).</li>
<li>Kan bruke <code>fetch</code>, timere, <code>self</code>.</li>
<li>Kommuniserer kun med <b>meldinger</b>: <code>postMessage()</code> og <code>message</code>-hendelsen. Data <b>kopieres</b> (structured clone), deles ikke.</li>
</ul>

<h2>Kode (v26 5a: «Welcome to DAT152»)</h2>
~~~javascript
// main.js (main thread)
const worker = new Worker("./js/worker.js");
worker.addEventListener("message", (event) => {
    console.log(event.data);            // "Welcome to DAT152"
});
worker.postMessage("start");            // optional: ask the worker to start
~~~
~~~javascript
// worker.js (worker thread)
self.addEventListener("message", (event) => {
    self.postMessage("Welcome to DAT152");
});
// or simply, without waiting for a message:
// self.postMessage("Welcome to DAT152");
~~~

<h3>Summere tall (h21)</h3>
~~~javascript
// worker.js – ignore elements that are not numbers, iterate only once
self.addEventListener("message", (e) => {
    const sum = e.data.reduce(
        (acc, x) => (typeof x === "number" && !Number.isNaN(x)) ? acc + x : acc, 0);
    self.postMessage(sum);
});
~~~

<h2>Maks antall tråder som kan aksessere DOM (h21, v26)</h2>
<div class="exam-answer"><p>The maximum number is <b>one</b>. Only the main JavaScript thread of the page has access to the DOM. Web Workers run in separate threads but have no access to the DOM (no <code>document</code>/<code>window</code>); they can only communicate with the main thread by posting messages, and the main thread must update the DOM. This avoids race conditions on the DOM, since the DOM is not thread-safe.</p></div>
`
});

DAT.theory.push({
  id: "webcomponents",
  area: "js",
  title: "Web Components: custom elements, shadow DOM, template, slot",
  summary: "Kjernen i 10 %-kodeoppgaven. Livssyklus, define(), cloneNode, open/closed, slot, kommunikasjon parent→child og callbacks.",
  html: `
<h2>Grunnmuren</h2>
~~~javascript
const template = document.createElement("template");
template.innerHTML = \`
    <style> p { color: steelblue; } </style>
    <p>Course is <span></span></p>\`;

class CourseInfo extends HTMLElement {
    #shadow;                                   // private field
    #span;

    constructor() {
        super();                               // ALWAYS first
        this.#shadow = this.attachShadow({ mode: "closed" });
        const content = template.content.cloneNode(true);
        this.#shadow.appendChild(content);
        this.#span = this.#shadow.querySelector("span");
    }

    connectedCallback() {                      // added to the document
        this.#span.textContent = this.dataset.course ?? "";
    }

    disconnectedCallback() {                   // removed from the document
        console.log("Cleanup: remove listeners, stop timers");
    }

    static get observedAttributes() { return ["data-course"]; }
    attributeChangedCallback(name, oldValue, newValue) {
        this.#span.textContent = newValue;
    }

    setCourse(course) {                        // public API method
        this.#span.textContent = course;
    }
}
customElements.define("course-info", CourseInfo);
~~~

<h2>customElements.define() (h25 5a)</h2>
<div class="exam-answer"><p><code>customElements.define('message-element', MessageElement)</code> registers a new HTML tag <b>message-element</b> in the browser's custom element registry and associates it with the class <b>MessageElement</b>. From then on, <b>every use</b> of the tag <code>&lt;message-element&gt;</code> in the document (in HTML or created with <code>document.createElement</code>) creates a <b>new instance</b> of MessageElement: the constructor runs, and elements already in the page are upgraded. The tag name must contain a hyphen, and a name can only be defined once.</p></div>

<h2>Livssyklus-callbacks (h25 5b)</h2>
<div class="table-wrap"><table>
<tr><th>Callback</th><th>Kjøres når</th></tr>
<tr><td><code>constructor()</code></td><td>Instansen lages (elementet opprettes/oppgraderes). Sett opp shadow DOM, felter. Ikke les attributter/barn her.</td></tr>
<tr><td><code>connectedCallback()</code></td><td>Elementet <b>settes inn i DOM-en / dokumentet</b> (kan skje flere ganger hvis det flyttes). Godt sted for å hente data (fetch) og lese attributter.</td></tr>
<tr><td><code>disconnectedCallback()</code></td><td>Elementet <b>fjernes fra DOM-en / dokumentet</b>. Rydd opp: fjern listeners, stopp timere, lukk WebSocket.</td></tr>
<tr><td><code>attributeChangedCallback(name, old, new)</code></td><td>Et attributt listet i <code>static observedAttributes</code> endres.</td></tr>
<tr><td><code>adoptedCallback()</code></td><td>Flyttet til et nytt dokument (iframe).</td></tr>
</table></div>
~~~javascript
// Code that makes the BROWSER run disconnectedCallback (we never call it ourselves)
const elm = document.createElement("message-element");
document.body.appendChild(elm);     // -> connectedCallback runs
elm.remove();                       // -> disconnectedCallback runs
// alternatives: document.body.removeChild(elm); parent.replaceChildren(); el.innerHTML = "";
~~~
<p class="small">Sensor: må nevne <b>DOM/dokumentet</b> for å få uttelling, og kode + forklaring teller 50/50.</p>

<h2>Hvorfor cloneNode()? (h25 5c)</h2>
<div class="exam-answer"><p><code>template.content</code> is a single DocumentFragment shared by all instances of the component. <code>cloneNode(true)</code> makes a <b>deep copy</b> for each instance, so every component gets its own DOM nodes and the template stays unchanged and reusable.</p>
<p>Without cloneNode, <code>appendChild(template.content)</code> <b>moves</b> the nodes out of the fragment into the shadow DOM of the <b>first</b> MessageElement. The template content is then <b>empty</b>, so every later instance gets an empty shadow DOM and displays nothing ("Welcome to DAT152" only appears once). Also, since nodes are not copied, an instance could modify what other instances would use.</p></div>

<h2>Shadow DOM (h24 6a, h22)</h2>
<div class="exam-answer"><p>A shadow DOM is a separate, encapsulated DOM tree attached to an element (the shadow host) in the normal DOM. Its internals are hidden from the main document: the main document's CSS and JavaScript (e.g. <code>document.querySelector</code>) do not see or affect elements inside the shadow DOM, and the shadow DOM's styles do not leak out. IDs and styles therefore do not clash with the rest of the page – this gives encapsulation for reusable components.</p>
<p><b>open</b> mode: the shadow root is reachable from outside through <code>element.shadowRoot</code>. <b>closed</b> mode: <code>element.shadowRoot</code> returns null; only the component keeps a reference (e.g. in a private field). Closed does not give absolute security – the component can still expose access through public methods.</p></div>
~~~javascript
// Utilising open mode from outside the component (h24)
const element = document.querySelector("shopping-list");
const table = element.shadowRoot.querySelector("table");
table.remove();
~~~

<h2>&lt;slot&gt;</h2>
<p>En <b>plassholder</b> i shadow DOM som fylles med innhold («light DOM») som foreldre-siden legger inne i custom-taggen. Uten innhold vises slotens fallback.</p>
~~~html
<!-- inside the component template -->
<p>Course is <slot name="course"><span>to be decided</span></slot></p>

<!-- usage -->
<course-info><span slot="course">DAT152</span></course-info>
~~~

<h2>Hvordan forelderen kan gi data til barnet (h24 6a iv)</h2>
<ol>
<li><b>Slot</b>: <code>&lt;course-info&gt;&lt;span slot="course"&gt;DAT152&lt;/span&gt;&lt;/course-info&gt;</code></li>
<li><b>Innhold/textContent</b>: <code>&lt;course-info&gt;DAT152&lt;/course-info&gt;</code> og komponenten leser <code>this.textContent</code>.</li>
<li><b>Attributt / data-attributt</b>: <code>&lt;course-info data-course="DAT152"&gt;</code>, lest med <code>this.dataset.course</code> / <code>getAttribute</code> (+ observedAttributes for endringer).</li>
<li><b>Offentlig API-metode</b>: <code>courseElm.setCourse("DAT152")</code>.</li>
<li>(Property-setter: <code>set course(v) {…}</code>.)</li>
</ol>
<div class="callout warn"><span class="callout-title">Felle: komponent inne i en komponent</span>
Når en forelder kloner en template som inneholder <code>&lt;product-info&gt;</code>, blir barnet først <b>oppgradert</b> (får klassen sin og metodene) når det kobles til dokumentet. Kaller forelderen <code>this.#pinfo.setproductcallback(…)</code> i konstruktøren mens forelderen selv ikke er i DOM-en ennå, finnes ikke metoden. Løsning: <code>customElements.upgrade(this.#pinfo)</code> før kallet. I vanlig bruk (taggen står i HTML og scriptet er en modul) er forelderen allerede i DOM-en og det fungerer uten.</div>
<p>Barn → forelder: <b>callbacks</b> (som i eksamensoppgavene) eller <code>this.dispatchEvent(new CustomEvent("removeitem", { detail: { id } }))</code>.</p>

<h2>Callback-mønsteret fra kursets løsninger</h2>
~~~javascript
#callbacks = new Map();

addremoveitemcallback(callback) {
    const id = Symbol("removeitemcallback");   // unique key
    this.#callbacks.set(id, callback);
    return id;                                 // lets the caller remove it later
}

#onremove(id) {
    this.#callbacks.forEach(callback => callback(id));
}
~~~

<h2>DOM-API-er du trenger i kodeoppgaven</h2>
<div class="table-wrap"><table>
<tr><th>Oppgave</th><th>Kode</th></tr>
<tr><td>Finn element i shadow</td><td><code>this.#shadow.querySelector("#number")</code>, <code>getElementById</code></td></tr>
<tr><td>Sett tekst (trygt!)</td><td><code>elm.textContent = message.text</code> (aldri innerHTML med data → XSS)</td></tr>
<tr><td>Klon rad-mal</td><td><code>const row = rowtemplate.content.cloneNode(true).firstElementChild</code></td></tr>
<tr><td>Lagre id</td><td><code>row.dataset.id = item.id</code> → <code>data-id="3"</code></td></tr>
<tr><td>Finn via id</td><td><code>list.querySelector(\`[data-id="\${id}"]\`)</code></td></tr>
<tr><td>Sett inn øverst</td><td><code>list.prepend(row)</code> eller <code>list.insertBefore(row, list.firstElementChild)</code></td></tr>
<tr><td>Sett inn nederst</td><td><code>list.append(row)</code></td></tr>
<tr><td>Fjern</td><td><code>row.remove()</code></td></tr>
<tr><td>Tabellceller</td><td><code>row.cells[0]</code>, <code>tbody.rows</code>, <code>tbody.insertRow(index)</code></td></tr>
<tr><td>Lytte på klikk</td><td><code>btn.addEventListener("click", () =&gt; this.#next())</code></td></tr>
<tr><td>Input-verdi</td><td><code>input.value.trim()</code></td></tr>
</table></div>
<div class="callout warn"><span class="callout-title">Trekk-feller (sensor)</span>
<ul><li>Ikke bruke de oppgitte templatene → trekk.</li>
<li>Bare kopiere koden fra oppgaveteksten → 0 poeng.</li>
<li>Utdatert JS (<code>var</code>, <code>function</code>-callbacks med <code>.bind</code> overalt, <code>_private</code> i stedet for <code>#private</code>) → «endel trekk». Bruk <code>const/let</code>, arrow functions, <code>#private</code>, <code>async/await</code>.</li></ul></div>
`
});

DAT.theory.push({
  id: "modules",
  area: "js",
  title: "ES-moduler og script-lasting",
  summary: "export/export default, import, type=\"module\" (defer, strict, eget scope), hvor script-taggen skal stå.",
  html: `
<h2>export og import</h2>
~~~javascript
// modules/util.js
export default {                       // ONE default export per module
    metrestofeet(m) { return m * 3.28084; }
};
export const VERSION = "1.0";          // named export(s)
export function feettometres(f) { return f / 3.28084; }

// main.js
import util from "./modules/util.js";              // default: any local name
import { VERSION, feettometres } from "./modules/util.js";   // named: exact names
console.log(util.metrestofeet(10));
~~~
<p><b>export default</b>: modulen har (maks) én standard-eksport, som er det som importeres når man ikke navngir hva som skal importeres (<code>import x from …</code>). Importøren velger selv navnet.</p>

<h2>type="module" (h21, h25 5d)</h2>
<div class="exam-answer"><p>The attribute <code>type="module"</code> makes the browser treat the script as an <b>ECMAScript module</b>:</p>
<ul>
<li>It can use <code>import</code>/<code>export</code> (without it, import statements give a syntax error).</li>
<li>Module scripts are <b>deferred</b> by default: the file is fetched in parallel with HTML parsing, but executed only <b>after the document has been parsed</b>, so the DOM is ready.</li>
<li>The code runs in <b>strict mode</b> automatically.</li>
<li>Top-level variables are <b>local to the module</b> (module scope), not global.</li>
<li>A module is executed only <b>once</b>, even if imported many times.</li>
<li>Loaded with CORS; does not work from file:// in most browsers.</li>
</ul></div>

<h2>Hvor skal script-taggen stå?</h2>
<div class="exam-answer"><p>Put it in the <code>&lt;head&gt;</code>. Since module scripts are deferred, the browser starts downloading the script early, in parallel with parsing the rest of the HTML, and runs it when the DOM is complete. This gives the best <b>performance</b> (download starts as early as possible without blocking parsing). It also improves <b>readability</b>, because all resources are declared in one place. (A classic script without defer should instead be placed at the end of body, because it blocks parsing and needs the DOM.)</p></div>
<p class="small">Sensor h25: begrunnelse med <b>ytelse</b> = 100 %, bare lesbarhet = 40 %, ingen begrunnelse = 0.</p>
<div class="table-wrap"><table>
<tr><th>Variant</th><th>Last ned</th><th>Kjøres</th></tr>
<tr><td><code>&lt;script&gt;</code></td><td>Blokkerer parsing</td><td>Straks</td></tr>
<tr><td><code>&lt;script defer&gt;</code></td><td>Parallelt</td><td>Etter parsing, i rekkefølge</td></tr>
<tr><td><code>&lt;script async&gt;</code></td><td>Parallelt</td><td>Straks den er lastet (uforutsigbar rekkefølge)</td></tr>
<tr><td><code>&lt;script type="module"&gt;</code></td><td>Parallelt</td><td>Som defer</td></tr>
</table></div>
`
});

DAT.theory.push({
  id: "spa",
  area: "js",
  title: "SPA, rammeverk, routing og state/view-synkronisering",
  summary: "Hva en SPA er, hva rammeverk gir, hash-routing og History API, state vs view, React-grunnbegreper.",
  html: `
<h2>SPA vs MPA</h2>
<p><b>SPA</b>: én HTML-side for hele applikasjonen. Data hentes med Ajax/fetch eller WebSocket, og JavaScript endrer visningen. Navigasjon laster <b>ikke</b> ny side fra serveren. <b>MPA</b>: hver navigasjon laster en ny side fra serveren; gjeldende side kastes.</p>
<p><b>SPA-rammeverk gir typisk:</b> gjenbrukbare komponenter, template-system, <b>synkronisering av state og view</b>, <b>routing</b> (og ofte state management, dependency injection, byggverktøy).</p>

<h2>State og view (h25 5e, v24)</h2>
<div class="exam-answer"><p><b>State</b> is the application's data model in JavaScript – e.g. the list of messages, the current question number, whether a user is logged in. <b>View</b> is what the user sees: the DOM / HTML elements on the page. <b>Synchronization of view from state</b> means that when the state changes, the view is automatically updated to reflect it. <b>Synchronization of state from view</b> means that user changes in the view (typing in an input) automatically update the state (two-way binding).</p></div>
~~~javascript
// React: view is synchronised from state automatically
function Counter() {
    const [count, setCount] = React.useState(0);          // state
    return (
        <button onClick={() => setCount(count + 1)}>      {/* view */}
            Clicked {count} times
        </button>
    );                    // setCount -> React re-renders -> view shows new count
}
~~~
~~~javascript
// Plain JS: a setter that updates the view from state
class QuestionNumber {
    #state = { number: 0 };
    #elm;
    constructor(elm) { this.#elm = elm; }
    set number(n) {
        this.#state.number = n;
        this.#elm.textContent = n;     // view follows state
    }
}
~~~

<h2>Routing (v24, h21, v26 5e)</h2>
<div class="exam-answer"><p>In a SPA, routing means that each state/view of the application has its <b>own URL</b>. When the URL changes, JavaScript updates the view instead of loading a new page from the server. We need routing so that application states can be <b>bookmarked and shared</b>, so that the <b>browser history</b> and back/forward buttons work between views, and so that a page reload returns to the same view.</p>
<p><b>Approaches in plain JavaScript:</b> (1) <b>Hash-based routing</b>: changing only the part after <code>#</code> does not load a new page; the <code>hashchange</code> event fires on <code>window</code>, and the handler reads <code>location.hash</code> and renders the matching view. (2) <b>History API</b>: intercept link clicks with <code>event.preventDefault()</code>, update the URL with <code>history.pushState()</code>, render the view, and listen to the <code>popstate</code> event for back/forward. (The server must return index.html for all application URLs.)</p></div>
~~~javascript
const routes = {
    "#/":        () => "<h1>Home</h1>",
    "#/courses": () => "<h1>Courses</h1>"
};
function render() {
    const view = routes[location.hash] ?? routes["#/"];
    document.querySelector("main").innerHTML = view();
}
window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);
~~~
<p class="small">Denne studiesiden bruker selv hash-routing – se adresselinja: <code>#/teori/spa</code>.</p>

<h2>React (kort, ble forelest)</h2>
<ul>
<li><b>Komponenter</b> er funksjoner som returnerer JSX.</li>
<li><b>Props</b>: data inn fra forelder (read-only). <b>State</b> (<code>useState</code>): komponentens egne data; endring → re-render.</li>
<li><b>useEffect</b>: sideeffekter (fetch ved mount).</li>
<li><b>Virtual DOM</b>: React sammenligner ny og gammel virtuell DOM og oppdaterer bare det som endret seg.</li>
<li>Enveis dataflyt: state → view. Hendelser → setState.</li>
</ul>
`
});

DAT.theory.push({
  id: "ecma",
  area: "js",
  title: "Moderne ECMAScript (ES6+)",
  summary: "Object.defineProperty, klasser og private felter, Symbol, Map, destrukturering, Intl, this i arrow functions.",
  html: `
<h2>Property-attributter (v24)</h2>
~~~javascript
const student = { surename: "Nordmann" };
Object.defineProperty(student, "surename", { writable: false });
student.surename = "Hansen";      // ignored (TypeError in strict mode / modules)

Object.defineProperty(student, "id", {
    value: 42,
    writable: false,      // can't be changed
    enumerable: false,    // not visible in for...in / Object.keys / JSON.stringify
    configurable: false   // can't be deleted or redefined
});
~~~
<p><b>Enumerable</b>: egenskapen kommer med når man looper gjennom objektet (<code>for…in</code>, <code>Object.keys</code>, spread, <code>JSON.stringify</code>). Ikke-enumerable egenskaper er «skjult» fra slike løkker.</p>

<h2>Klasser</h2>
~~~javascript
class Person {
    #name;                       // truly private (ES2022)
    static count = 0;            // static field
    constructor(name) { this.#name = name; Person.count++; }
    get name() { return this.#name; }          // getter
    set name(v) { this.#name = v.trim(); }     // setter
    #helper() { }                              // private method
}
class Student extends Person {
    constructor(name, sid) { super(name); this.sid = sid; }
}
~~~

<h2>Annet du bør kjenne</h2>
<ul>
<li><code>let</code>/<code>const</code> (block scope) – ikke <code>var</code>.</li>
<li>Arrow functions arver <code>this</code> fra omgivelsene → perfekt i event listeners i klasser: <code>btn.addEventListener("click", () =&gt; this.#next())</code>.</li>
<li>Template literals: <code>\`Question \${n} of \${count}\`</code>.</li>
<li>Destrukturering: <code>const { id, text } = response.question;</code></li>
<li>Spread/rest: <code>[...list]</code>, <code>{ ...obj, id: 3 }</code>, <code>function f(...args)</code>.</li>
<li><code>Map</code>/<code>Set</code>; <code>Symbol()</code> gir unike nøkler.</li>
<li>Optional chaining/nullish: <code>obj?.question?.text ?? ""</code>.</li>
<li>Array-metoder: <code>map</code>, <code>filter</code>, <code>reduce</code>, <code>find</code>, <code>findIndex</code>, <code>Array.from(htmlCollection)</code>.</li>
<li><code>Intl</code> / <code>toLocaleDateString(navigator.language, { weekday: "long" })</code> – lokaliserte datoer/tall på klienten (kobling til globalization!).</li>
</ul>
`
});

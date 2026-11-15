/* Felles løsningsforslag (sensor-nivå), brukt både i eksamenene og i teorispørsmålene. */
window.DAT = window.DAT || {};
DAT.ans = {

/* ---------------- Web frameworks ---------------- */
csrssr: `<ul>
<li><b>Initial page load time:</b> SSR is faster. The server sends a complete HTML page that can be shown immediately. With CSR the browser must first download and run the JavaScript bundle and then fetch data before anything is shown.</li>
<li><b>Subsequent page load time:</b> CSR is faster. Only data (JSON) is fetched and the page is updated by JavaScript, no full page reload. With SSR every navigation loads a new full page from the server.</li>
<li><b>Throughput:</b> CSR gives higher server throughput because the server only returns data. With SSR the server must render HTML for every request, which uses more server resources.</li>
<li><b>Bandwidth:</b> SSR uses more bandwidth over time because the whole page (layout, menus, etc.) is sent on every request. CSR has a larger first download (the JS bundle), but after that only small JSON responses are sent.</li>
</ul>`,

rmm: `<p>The Richardson Maturity Model has four levels:</p>
<ul>
<li><b>Level 0 – Swamp of POX:</b> one URI/endpoint and usually one HTTP method (POST) for everything. HTTP is only used as a transport (like RPC/SOAP).</li>
<li><b>Level 1 – Resources:</b> each resource has its own URI (e.g. <code>/students/1</code>), but HTTP methods are not used correctly.</li>
<li><b>Level 2 – HTTP verbs:</b> the HTTP methods are used correctly (GET read, POST create, PUT update, DELETE delete) together with correct status codes (200, 201, 204, 404).</li>
<li><b>Level 3 – Hypermedia controls (HATEOAS):</b> the responses contain links to related resources and possible next actions, so the client can discover the API.</li>
</ul>`,

hateoas: `<p>HATEOAS (RMM level 3) means that a response contains <b>links</b> to related resources and to the actions that are possible from the current state, e.g. a course response with links "self", "students" and "delete". The client only needs the entry URI and can follow the links. Benefits: looser coupling between client and server (URIs can change), self-describing API. Drawback: bigger responses and more work on the server. In Spring: <code>linkTo(methodOn(Controller.class).method(id)).withSelfRel()</code>.</p>`,

mvcLayers: `<ul>
<li><b>Presentation layer</b> – <code>@Controller</code>/<code>@RestController</code>: receives the HTTP request, calls the service and returns a view or JSON.</li>
<li><b>Business layer</b> – <code>@Service</code>: business logic and rules, throws exceptions like <code>StudentNotFoundException</code>.</li>
<li><b>Persistence layer</b> – <code>@Repository</code> / <code>CrudRepository</code> (JPA): saves and reads data.</li>
<li><b>Database</b> – stores the data.</li>
</ul>
<p>Each layer only uses the layer below (controller → service → repository → database). The layers are connected with dependency injection (<code>@Autowired</code>).</p>`,

cicd: `<p><b>CI (Continuous Integration):</b> developers merge code to a shared branch often, and every push automatically triggers build and tests. Steps: checkout code, build/compile, unit tests, static analysis (code quality/SAST), integration tests, build an artifact (jar/Docker image).</p>
<p><b>CD:</b> <i>Continuous Delivery</i> – every change that passes the pipeline is automatically deployed to a test/staging environment and is ready for release, but release to production needs a manual approval. <i>Continuous Deployment</i> – everything that passes all tests is automatically deployed all the way to production. Activities: publish artifact, deploy to staging, acceptance/security tests, deploy to production, monitoring.</p>
<p><b>A CI/CD YAML file</b> describes the pipeline: <i>when</i> it runs (trigger, e.g. on push to the main branch), <i>where</i> it runs (the runner/image), and the <i>jobs/stages with their steps</i> in order: check out the code, set up Java, build and run the tests (e.g. <code>mvn test</code> / <code>mvn package</code>), build the artifact/Docker image, and deploy.</p>`,

codeVsImplicit: `<p>In the <b>authorization code flow</b> the authorization server first returns an <b>authorization code</b> to the client (through a redirect in the browser). The client then exchanges the code for the access token by sending the code directly to the authorization server (server to server), and authenticates itself with its client secret. The access token is never exposed in the browser.</p>
<p>In the <b>implicit flow</b> there is no authorization code and no code exchange: the access token is returned <b>directly</b> to the client in the redirect URL, and the client is not authenticated. The token is exposed in the browser (URL, history) and can be stolen, so the implicit flow is less secure than the authorization code flow.</p>`,

authcodeFlow: `<p>The steps (same as the figure in the official solution: Resource Owner – Application – Authorization Server – Resource Server):</p>
<ol>
<li><b>Access application:</b> the resource owner (user) accesses the application (client).</li>
<li><b>Authentication and request authorization:</b> the application redirects the user to the authorization server (IdP) to log in and authorize the application.</li>
<li><b>Authentication and grant authorization:</b> the user authenticates at the authorization server and grants the application access.</li>
<li><b>Send authorization code:</b> the authorization server sends an authorization code back to the application (redirect).</li>
<li><b>Request code exchange for token:</b> the application sends the authorization code (with its client id and secret) to the authorization server.</li>
<li><b>Issue access token:</b> the authorization server validates the code and issues an access token to the application.</li>
<li><b>Request resource with access token:</b> the application sends the request with the access token to the resource server.</li>
<li><b>Return resource:</b> the resource server validates the token and returns the resource.</li>
</ol>`,

passwordGrant: `<ol>
<li>The resource owner gives his username and password directly to the client.</li>
<li>The client sends the credentials (and its client_id/secret) to the IdP's token endpoint with grant_type=password.</li>
<li>The IdP validates the credentials and returns an access token (and refresh token).</li>
<li>The client uses the access token to access the resource server.</li>
</ol>
<p>Should only be used with highly trusted clients, since the client sees the user's password.</p>`,

/* ---------------- Globalization ---------------- */
g11n: `<p><b>Globalization:</b> the process of making an application available globally. It includes internationalization and localization.</p>
<p><b>Internationalization (i18n):</b> the process of enabling the application, from a technical perspective, to support multiple languages without having to change the design/code when a new language is added (e.g. all texts in resource bundles/property files).</p>
<p><b>Localization (l10n):</b> the process of adapting the application to a specific language and region (locale). It includes translation of texts and formatting of dates, numbers and currency.</p>`,

sessionVsCookie: `<p><b>SessionLocaleResolver</b> stores the chosen locale in the user's HTTP session on the server. It is lost when the session ends (timeout, logout, browser closed).</p>
<p><b>CookieLocaleResolver</b> stores the chosen locale in a cookie in the browser. It is remembered also after the session has ended, until the cookie expires, and does not use server memory.</p>`,

i18nSteps: `<ol>
<li>Create property files (resource bundles) for each language, e.g. <code>messages_en.properties</code> and <code>messages_no.properties</code>, with the same keys. Use parameters <code>{0}</code> for numbers/dates.</li>
<li>Tell Spring where the property files are (the message source, basename e.g. "messages").</li>
<li>Define a <code>LocaleResolver</code> that decides where the user's locale is stored: <code>SessionLocaleResolver</code> (in the session) or <code>CookieLocaleResolver</code> (in a cookie).</li>
<li>Handle the change of language: a controller (or Spring's <code>LocaleChangeInterceptor</code>) reads the language parameter from the request (e.g. <code>?lang=no</code>) and sets the new locale.</li>
<li>Replace the hard-coded texts in the view with the keys, e.g. in Thymeleaf <code>th:text="#{welcome.title}"</code>.</li>
<li>Add links in the page to change language (EN | NO).</li>
</ol>`,

i18nController: `<p>The controller handles the user's <b>choice of language</b>. When the user selects a language (e.g. clicks EN | NO, which sends a request with a parameter like <code>?locale=no</code>), the controller reads the selected locale from the request, stores it as the user's locale (in the session and/or in a cookie, so it is remembered), and redirects back to the page. The page is then shown with the resource bundle (property file) for the selected locale.</p>
<p class="small">I kursets demo (LibraryClientI18n) er dette <code>ConfigLanguage</code>-controlleren: den leser <code>locale</code>-parameteren, setter locale i sesjonen, lagrer den i en cookie og redirecter tilbake.</p>`,

/* ---------------- Universal design ---------------- */
ud: `<p>Universal Design is "the design of products and environments to be usable by all people, to the greatest extent possible, without the need for adaptation or specialized design."</p>`,

ud3: `<p>Any 3 of the 7 principles:</p>
<ul>
<li><b>Equitable use</b> – useful for people with diverse abilities; same solution for all.</li>
<li><b>Flexibility in use</b> – supports different preferences and abilities (mouse, keyboard, touch).</li>
<li><b>Simple and intuitive use</b> – easy to understand regardless of experience or language.</li>
<li><b>Perceptible information</b> – information is communicated effectively, e.g. both text and image/sound.</li>
<li><b>Tolerance for error</b> – minimizes the consequences of mistakes (confirm/undo).</li>
<li><b>Low physical effort</b> – can be used efficiently with little effort.</li>
<li><b>Size and space for approach and use</b> – enough size and space (e.g. big enough buttons).</li>
</ul>`,

wcag: `<p>WCAG (Web Content Accessibility Guidelines) is a standard from W3C that defines how to make web pages and content more accessible to a wider range of people with disabilities. It has 4 principles (Perceivable, Operable, Understandable, Robust), each with guidelines and testable success criteria at three levels: A, AA and AAA. In Norway WCAG 2.1 level A and AA is required by law.</p>`,

wcagWho: `<p>WCAG is primarily meant for web page/content developers (page authors, designers), web authoring tool developers, web accessibility evaluation tool developers, and others who need a standard for web accessibility. It is developed by W3C to give one shared international standard, so web content becomes accessible for people with disabilities.</p>`,

perceivable: `<p><b>Perceivable:</b> information and user interface components must be presentable to users in ways they can perceive.</p>
<p>Perceivable has 4 guidelines:</p>
<ul>
<li><b>Text alternatives:</b> provide text alternatives for non-text content (e.g. alt text on images).</li>
<li><b>Time-based media:</b> provide captions and other alternatives for multimedia.</li>
<li><b>Adaptable:</b> create content that can be presented in different ways (e.g. by assistive technologies) without losing meaning or structure.</li>
<li><b>Distinguishable:</b> make it easier for users to see and hear content (e.g. good contrast).</li>
</ul>`,

operable: `<p><b>Operable:</b> the user interface components and navigation must be operable. Users must be able to operate the interface; it cannot require actions that a user cannot perform.</p>
<p>Operable has 5 guidelines:</p>
<ul>
<li><b>Keyboard accessible:</b> all functionality available from a keyboard.</li>
<li><b>Enough time:</b> give users enough time to read and use content.</li>
<li><b>Seizures and physical reactions:</b> do not design content that is known to cause seizures (e.g. flashing).</li>
<li><b>Navigable:</b> help users navigate, find content and know where they are.</li>
<li><b>Input modalities:</b> make it easier to operate functionality through other inputs than keyboard.</li>
</ul>
<p>Example of failure: a menu that can only be opened with mouse hover cannot be used by keyboard users.</p>`,

understandable: `<p><b>Understandable:</b> information and the operation of the user interface must be understandable.</p>
<ul>
<li><b>Readable:</b> make text readable and understandable, e.g. set the language of the page (<code>&lt;html lang="no"&gt;</code>).</li>
<li><b>Predictable:</b> pages appear and operate in predictable ways (consistent navigation, no unexpected changes).</li>
<li><b>Input assistance:</b> help users avoid and correct mistakes (labels, clear error messages).</li>
</ul>
<p>Example of failure: a form that only says "error" without telling which field is wrong. Connection to i18n: the language of the page must be set correctly for each locale so screen readers pronounce it correctly.</p>`,

robust: `<p><b>Robust:</b> content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies (screen readers).</p>
<ul><li><b>Compatible:</b> maximize compatibility with current and future user agents – valid HTML, and name, role and value available for all UI components (use native elements or correct ARIA).</li></ul>
<p>Example of failure: a "button" made of a <code>&lt;div&gt;</code> with a click handler, which a screen reader does not recognize as a button.</p>`,

/* ---------------- Security ---------------- */
sastDast: `<p><b>SAST</b> (static) analyses the source code without running the program (white-box). It is done early (implementation phase) and points to the exact line, but gives many false positives. Example tools: SonarQube, SpotBugs.</p>
<p><b>DAST</b> (dynamic) tests the running application from the outside by sending requests (black-box). It is done later (testing phase) and finds vulnerabilities that can actually be exploited at runtime (e.g. XSS, configuration errors), but does not show where in the code the problem is. Example tools: OWASP ZAP, Burp Suite.</p>`,

ssdlc: `<ul>
<li><b>Requirements:</b> security requirements and misuse/abuse cases.</li>
<li><b>Design:</b> threat modelling.</li>
<li><b>Implementation:</b> code review and static analysis (SAST).</li>
<li><b>Testing:</b> penetration testing / dynamic testing (DAST).</li>
<li><b>Deployment/release:</b> configuration review and final security review.</li>
</ul>`,

sqliWhy: `<p>The untrusted data (username and password) is concatenated into the SQL string <b>before</b> it is passed to <code>prepareStatement</code>. The input becomes part of the SQL code, so the PreparedStatement gives no protection. Input like <code>' OR '1'='1</code> or <code>admin' --</code> changes the logic of the query (e.g. log in without password).</p>`,

sqliFix: `~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = ? AND PASSWORD = ?";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.setString(1, username);
stmt.setString(2, password);
ResultSet rs = stmt.executeQuery();
~~~`,

sqliOrderBy: `<p>The column name in ORDER BY cannot be a <code>?</code> parameter, so <code>sortkey</code> must be validated against an allow-list. The username is bound as a parameter.</p>
~~~java
public List<SearchItem> getSearchHistoryForUser(String username, String sortkey) {
    String column;
    if (sortkey.equals("datetime") || sortkey.equals("searchkey")) {
        column = sortkey;
    } else {
        column = "datetime";      // or throw exception / log invalid input
    }
    String sql = "SELECT * FROM SecOblig.History WHERE username = ? ORDER BY "
               + column + " ASC";
    PreparedStatement stmt = conn.prepareStatement(sql);
    stmt.setString(1, username);
    ResultSet rs = stmt.executeQuery();
    ...
}
~~~`,

sqliTypes: `<ul>
<li><b>In-band:</b> the result comes in the same response. <i>Error-based</i> (database errors leak information) and <i>union-based</i> (<code>UNION SELECT</code> reads other tables; needs same number of columns).</li>
<li><b>Blind (inferential):</b> no data shown; the attacker asks true/false questions. <i>Boolean-based</i> (page differs) and <i>time-based</i> (<code>SLEEP(5)</code>).</li>
<li><b>Out-of-band:</b> data is sent through another channel (DNS/HTTP from the DB server).</li>
</ul>
<p>Consequences: authentication bypass, reading/modifying/deleting data, and in some cases taking over the server.</p>`,

xssScenario: `<p>This is a <b>stored (persistent) XSS</b>. The script is saved in the blog's database as part of a comment and runs in the browser of every user who views it. The <code>img</code> has an invalid src, so <code>onerror</code> runs and sends <code>document.cookie</code> to the attacker's site justpassingby.com. The attacker aims to <b>steal the session cookie</b> of the blog users and hijack their sessions.</p>`,

xssTypes: `<ul>
<li><b>Reflected XSS:</b> the payload is in the request (e.g. URL parameter) and is reflected back in the response. The victim must click a crafted link.</li>
<li><b>Stored XSS:</b> the payload is stored on the server (database, e.g. a comment) and runs for everyone who views the page.</li>
<li><b>DOM-based XSS:</b> client-side JavaScript writes untrusted data (e.g. <code>location.hash</code>) into a dangerous sink like <code>innerHTML</code>.</li>
</ul>`,

xssVsCsrf: `<p><b>XSS:</b> the attacker injects malicious script into a trusted website, and the script runs in the victim's browser (can read data, steal cookies and act as the user). It exploits the user's trust in the website.</p>
<p><b>CSRF:</b> the attacker tricks an authenticated victim's browser into sending a forged request (the browser adds the session cookie automatically) that performs an action the victim did not intend. It exploits the website's trust in the user's browser. The attacker cannot read the response.</p>`,

outputEncoding: `<p>Output encoding converts special characters in untrusted data to their encoded form before the data is written to the page, e.g. <code>&lt;</code> → <code>&amp;lt;</code>, <code>&gt;</code> → <code>&amp;gt;</code>, <code>"</code> → <code>&amp;quot;</code>. The browser then displays the data as text instead of executing it as code. The encoding must match the context (HTML body, attribute, JavaScript, URL), e.g. <code>Encode.forHtml(data)</code>.</p>`,

syncToken: `<p>The server generates a random, unpredictable CSRF token (per session or per request) and stores it in the session. The token is added as a hidden field in every form. When the form is submitted, the server compares the token in the request with the token in the session, and rejects the request if they do not match. An attacker cannot know the token, so he cannot create a valid forged request.</p>`,

csrfConditions: `<ul>
<li><b>A relevant action:</b> there is an action the attacker wants to trigger (e.g. transfer money, change e-mail/password).</li>
<li><b>Cookie-based session handling:</b> the application only uses session cookies (sent automatically by the browser) to identify the user.</li>
<li><b>No unpredictable request parameters:</b> the attacker can know or guess all parameters of the request (no CSRF token, no password needed).</li>
<li>The victim is logged in and is tricked into visiting the attacker's page/link.</li>
</ul>`,

challengeResponse: `<p>This is the <b>challenge-response</b> pattern: before the transaction is done, the application asks the user for a form of authentication (something he knows – the password). An attacker who forges the request does not know the password, so the forged request will not be completed.</p>`,

cookieProtect: `<ul>
<li>Set the <b>HttpOnly</b> flag: JavaScript cannot access the cookie (<code>document.cookie</code>), so it cannot be stolen with XSS.</li>
<li>Set the <b>Secure</b> flag: the cookie is not sent over non-encrypted communication (only HTTPS). If the traffic is sniffed, the session token is encrypted and protected from disclosure.</li>
</ul>`,

logoutVuln: `<p><b>Vulnerability:</b> the logout does not invalidate the session. Only the "user" attribute is removed, so the session (and the session id) is still valid and other attributes can still be used/leaked.</p>
~~~java
request.getSession().invalidate();
request.getRequestDispatcher("index.jsp").forward(request, response);
~~~`,

fixation: `<p><b>Session fixation.</b> The session id is not changed after successful login. An attacker can give the victim a known session id, and when the victim logs in, the attacker can use the same session id as an authenticated user.</p>
<p><b>Fix:</b> invalidate the old session and create a new one after login (or <code>request.changeSessionId()</code>).</p>
~~~java
if (authUser != null) {
    request.getSession().invalidate();
    HttpSession session = request.getSession(true);
    session.setAttribute("user", authUser);
}
~~~`,

jwtSig: `<ul>
<li><b>HMAC (symmetric):</b> a secret key is used with the base64url encoding of header and claims: <code>Signature = HMAC(secretKey, base64(header) + "." + base64(claims))</code>. The same secret is used to verify.</li>
<li><b>Public key cryptography (asymmetric):</b> the private key signs the base64url encoding of header and claims: <code>Signature = sign(privateKey, base64(header) + "." + base64(claims))</code>. Anyone can verify with the public key.</li>
</ul>`,

jwtWeak: `<p>The secret is a short dictionary word with low entropy. An attacker who has a token can <b>brute-force/guess the secret offline</b> with a wordlist (e.g. hashcat): compute the HMAC with each word until it matches the signature. When the secret is found, the attacker can <b>forge valid tokens</b> with any claims, e.g. change the role to admin or act as another user. Use a long random secret (or asymmetric keys).</p>`,

jwtParseClaims: `<p>Code with <b>parseClaimsJws()</b>:</p>
<ul>
<li><b>JWT #1 (alg none):</b> throws InvalidTokenException in line 12, because parseClaimsJws requires a signed token and verifies the signature – the signature was removed.</li>
<li><b>JWT #2 (RS256, changed payload):</b> throws InvalidTokenException in line 12, because the signature is not valid for the changed payload.</li>
</ul>`,

jwtParse: `<p>Code with <b>parse()</b>:</p>
<ul>
<li><b>JWT #1 (alg none, no signature):</b> invokes <code>deleteAllUsers()</code> in line 7. <code>parse()</code> accepts unsigned tokens – it only verifies the signature if there is one. The role was changed to ADMIN, so the attacker gets admin rights (privilege escalation).</li>
<li><b>JWT #2 (RS256, changed payload):</b> throws InvalidTokenException in line 12. The token has a signature, so it is verified, and the signature does not match the modified payload.</li>
</ul>
<p>Fix: use <code>parseClaimsJws()</code>, which rejects unsigned tokens.</p>`,

trust: `<p>The SP (resource server) must know with certainty that the token is issued by the IdP (authorization server) and has not been tampered with. The trust is established with cryptographic keys:</p>
<ol><li>The IdP signs the token with its <b>private key</b>.</li>
<li>The SP uses the <b>public key (certificate)</b> of the IdP to verify the authenticity and integrity of the token.</li></ol>
<p>If symmetric keys are used, the secret key must be shared securely between IdP and SP before any transactions.</p>`,

rsChecks: `<ul>
<li>Verify that the JWT has a valid <b>signature</b>.</li>
<li>Verify that the token has not <b>expired</b> (exp) – an expired token still has a valid signature.</li>
<li>Verify the <b>issuer</b> (iss) and the <b>audience</b> (aud).</li>
<li>Check that the token has the necessary <b>claims</b> (roles/scope) to access the resource.</li>
</ul>`,

asActions: `<p>The authorization server must include the mandatory fields:</p>
<ul>
<li><b>iss</b> – issuer (the AS), <b>aud</b> – audience (the client_id it is meant for), <b>sub</b> – unique id of the user,</li>
<li><b>exp</b> – expiration time, <b>iat</b> – issued at,</li>
<li>the claims the resource server needs (roles, etc.),</li>
<li>and the token <b>must be signed</b>.</li>
</ul>`,

pw4: `<ul>
<li><b>Cryptographically secure hash:</b> the password is only verifiable and not recoverable (one-way).</li>
<li><b>Slow hash:</b> slows down attackers by making it take longer to compute each hash, so it takes much longer to crack a password (brute force/dictionary).</li>
<li><b>Unique salt:</b> two users with the same password get different hashes, and rainbow tables become useless (must be computed per salt).</li>
<li><b>Pepper:</b> a secret that is not stored in the database and is combined with the password. If only the database is stolen, offline dictionary and rainbow-table attacks fail.</li>
</ul>`,

pwStore: `<ul>
<li><b>Plaintext</b> – no protection if the database is stolen.</li>
<li><b>Encrypted (two-way)</b> – the key must be stored somewhere; whoever has the key (admin/attacker) can decrypt all passwords.</li>
<li><b>Hashed (one-way)</b> – same password gives same hash; fast hashes can be brute-forced and looked up in rainbow tables.</li>
<li><b>Hashed + salt</b> – same passwords get different hashes, rainbow tables do not work.</li>
<li><b>Slow hash + salt</b> (bcrypt, PBKDF2, scrypt, Argon2) – <b>best</b>: adds a work factor so cracking takes much longer.</li>
</ul>`,

pwAttacks: `<ul>
<li><b>Brute-force:</b> tries every possible combination of characters.</li>
<li><b>Dictionary attack:</b> tries words from a list of common/leaked passwords.</li>
<li><b>Rainbow table:</b> looks up the hash in a precomputed table of hashes for a password dictionary.</li>
</ul>
<p>Enforce strong passwords at registration (on the server): minimum length (e.g. 8–12+), require upper/lower case, digits and special characters, and reject common/leaked passwords and passwords containing the username.</p>`,

refreshToken: `<p>The attacker can use <b>his own refresh token</b> to get a new access token for another (victim) client, because the refresh token is not tied to the client. Fix: make sure there is an association between the refresh token and the client (client_id) / access token, and reject the request if they do not match.</p>`,

/* ---------------- JavaScript ---------------- */
blocking: `<p>The browser runs JavaScript on <b>one main thread</b>, and asynchronous code also runs on this thread, only later. While the blocking code runs, no other events can be handled (clicks, input, timers, network responses) and the page is not updated. The browser tab <b>freezes</b> and the application does not respond until the code is finished. Heavy work should be moved to a Web Worker.</p>`,

asyncExamples: `<ul>
<li><b>Event listeners</b> (<code>addEventListener("click", …)</code>): the code is registered now but runs later, every time the user clicks.</li>
<li><b>Timers</b> (<code>setTimeout</code>): the function runs after the given time, when the main thread is free.</li>
<li><b>Network requests</b> (<code>fetch</code>/Ajax): fetch returns a Promise immediately; the then-code runs when the response arrives.</li>
</ul>
<p>The code does not run in parallel – the callbacks are put in a queue and run one by one on the main thread by the event loop.</p>`,

promiseObj: `<p>It must return a <b>Promise</b> (if not, the value is wrapped in a Promise that resolves immediately). A Promise represents the result of asynchronous code that will eventually <b>resolve</b> (fulfil) or <b>reject</b> (fail). <code>then</code> gives a function to run on resolve and <code>catch</code> on reject. With await, the code after the await is the then-code, and await returns the resolved value; a reject is caught by try/catch.</p>`,

promiseCode: `~~~javascript
function waitforSomething() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Done");
        }, 1000);
    });
}
// or: function waitforSomething() { return fetch("data.json"); }
~~~`,

domThreads: `<p>The maximum is <b>one</b>. Only the main JavaScript thread can access the DOM. Web Workers run in separate threads but do not have access to the DOM; they can only send messages to the main thread.</p>`,

worker: `<p>A Web Worker runs JavaScript in a background thread, separate from the main thread. It has no access to the DOM, but can do calculations and Ajax requests without blocking the main thread. Used for heavy work that otherwise would freeze the page.</p>`,

workerCode: `~~~javascript
// main.js
const worker = new Worker("worker.js");
worker.addEventListener("message", (event) => {
    console.log(event.data);
});
worker.postMessage("start");

// worker.js
self.addEventListener("message", (event) => {
    self.postMessage("Welcome to DAT152");
});
~~~`,

define: `<p>It creates a new HTML tag <code>message-element</code> and associates it with the class <code>MessageElement</code>. Every use of the tag <code>&lt;message-element&gt;</code> in the document creates a <b>new instance</b> of the class MessageElement.</p>`,

lifecycle: `<p><b>connectedCallback()</b> runs when the element is inserted into the DOM (the document). <b>disconnectedCallback()</b> runs when the element is removed from the DOM.</p>
~~~javascript
const elm = document.createElement("message-element");
document.body.appendChild(elm);   // connectedCallback runs
elm.remove();                     // disconnectedCallback runs
~~~`,

clonenode: `<p>The template content is shared by all instances. <code>cloneNode(true)</code> makes a copy for each instance, so the template is unchanged and can be reused.</p>
<p>Without cloneNode, appending <code>template.content</code> <b>moves</b> the nodes into the shadow DOM of the first MessageElement. The template is then <b>empty</b>, so all later MessageElement instances get nothing ("Welcome to DAT152" is only shown once). An instance could also change the template content.</p>`,

scriptModule: `<p><b>i.</b> In the HTML <code>&lt;head&gt;</code>. A module script is deferred, so the browser can start downloading it early, in parallel with parsing the HTML, and runs it when the document is parsed. This gives better <b>performance</b>.</p>
<p><b>ii.</b> The script is treated as a JavaScript module: it can use <code>import</code>/<code>export</code>, it is deferred (runs after the document is parsed, so the DOM is ready), it runs in strict mode, and top-level variables are local to the module (not global).</p>`,

stateView: `<p><b>State</b> is the application's data in JavaScript (e.g. a list of messages). <b>View</b> is what the user sees – the HTML/DOM.</p>
<p>Synchronization of view from state: when the state changes, the view is automatically updated. Example in React: <code>const [count, setCount] = useState(0)</code> – calling <code>setCount(count + 1)</code> changes the state and React re-renders so the new count is shown.</p>`,

routing: `<p><b>Routing</b> in a SPA means that each state/view of the application has its own URL. When the URL changes, JavaScript updates the view instead of loading a new page from the server. We need it so the states can be bookmarked, and so the browser history and back/forward buttons work.</p>
<p><b>Plain JavaScript:</b> (1) Hash: only changing the part after <code>#</code> does not load a new page; the window event <code>hashchange</code> fires, and the handler updates the view from <code>location.hash</code>. (2) History API: stop page loading with <code>preventDefault</code>, change the URL with <code>history.pushState</code>, and listen to <code>popstate</code>.</p>`,

spa: `<p>A <b>SPA</b> uses a single web page for the whole application. Data is fetched with Ajax/fetch and JavaScript updates the view – navigation does not load a new page. In a <b>MPA</b> the browser loads a new page from the server on every navigation. SPA frameworks usually give reusable components, a template system, synchronization of state and view, and routing.</p>`,

shadowDom: `<p>A shadow DOM is a separate DOM tree attached to an element in the normal DOM. It is hidden from the main document: the main document's CSS and JavaScript do not see it, and its CSS does not affect the main document, so IDs and styles do not clash.</p>
<p><b>open:</b> the shadow DOM can be accessed from outside with <code>element.shadowRoot</code>. <b>closed:</b> <code>shadowRoot</code> is null – only the component has access (but public methods can still give access).</p>`,

slot: `<p><code>&lt;slot&gt;</code> is a placeholder inside a component that is replaced by content from the parent (the content inside the custom tag). With several slots, each slot has a name, and the content uses the <code>slot</code> attribute.</p>
~~~html
<!-- in the component -->
<p>Course is <slot name="course">to be decided</slot></p>
<!-- use -->
<course-info><span slot="course">DAT152</span></course-info>
~~~`,

parentChild: `<ol>
<li><b>Slot:</b> <code>&lt;course-info&gt;&lt;span slot="course"&gt;DAT152&lt;/span&gt;&lt;/course-info&gt;</code></li>
<li><b>Content of the tag:</b> <code>&lt;course-info&gt;DAT152&lt;/course-info&gt;</code>, read with <code>this.textContent</code>.</li>
<li><b>Attribute:</b> <code>&lt;course-info data-course="DAT152"&gt;</code>, read with <code>this.dataset.course</code> or <code>getAttribute</code>.</li>
<li><b>Public method:</b> <code>courseElm.setCourse("DAT152")</code>.</li>
</ol>`,

exportDefault: `<p>A module can have one <code>export default</code>. It is what is imported when you do not name what to import, and the importer chooses the name:</p>
~~~javascript
// main.js (in js/), util.js in js/modules/
import util from './modules/util.js';
console.log(util.metrestofeet(10));
~~~`,

defineProperty: `~~~javascript
Object.defineProperty(student, "surename", { writable: false });
~~~
<p>If a property is <b>enumerable</b>, it is included when looping through the object (<code>for…in</code>, <code>Object.keys</code>). Non-enumerable properties are skipped.</p>`,

frontController: `<p><b>Front Controller:</b> one central controller (a servlet) receives all requests from the client. It invokes the right command and then dispatches to a view.</p>
<p><b>Command:</b> each action is a class that implements a common interface (Action) with a method <code>execute()</code>.</p>
<p><b>As a web framework:</b> the front controller has a Map from request (URL) to command. For each request it resolves the command from the map, invokes <code>execute()</code>, and dispatches to the view that should show the result. New functionality is added by writing a new command and adding it to the map. (The official solution explains this with two figures: Client → FrontController → Command, and FrontController → View.)</p>`,

actionVsComponent: `<p><b>Action-based framework:</b> you write classes/methods that represent user actions (e.g. "submit an order"), which get the data from the HTTP request and process it. Examples: Spring Web MVC, Struts.</p>
<p><b>Component-based framework:</b> the page is built of UI components (text fields, buttons) that hide the HTTP request/response details and keep their own state. Examples: JSF, Wicket.</p>`
};

/* Vedlegg som følger med eksamen (hjelpesidene bakerst i oppgavesettet). */
DAT.appendix = {
spring: `<h4>Help for question 1 (REST API using Spring Framework)</h4>
<pre><code>org.springframework.web.bind.annotation.GetMapping
org.springframework.web.bind.annotation.PutMapping
org.springframework.web.bind.annotation.DeleteMapping
org.springframework.web.bind.annotation.PostMapping
org.springframework.http.ResponseEntity(HttpStatusCode status)
org.springframework.http.ResponseEntity(T body, HttpStatusCode status)
org.springframework.web.bind.annotation.PathVariable
org.springframework.web.bind.annotation.RequestBody
org.springframework.http.HttpStatus
    HttpStatus.OK
    HttpStatus.CREATED
    HttpStatus.NO_CONTENT
    HttpStatus.NOT_FOUND
    HttpStatus.NOT_MODIFIED
org.springframework.web.bind.annotation.RequestParam
org.springframework.security.access.prepost.PreAuthorize
org.springframework.beans.factory.annotation.Autowired</code></pre>`,
js: `<h4>Help for the JavaScript question</h4>
<ul>
<li><b>Node: textContent</b> – the text content of the node and its descendants.</li>
<li><b>HTMLInputElement: value</b> – the current value of the element as a string.</li>
<li><b>Document/DocumentFragment: getElementById()</b> – returns the element whose id matches the string.</li>
<li><b>querySelector()</b> – returns the first element that matches the selector, or null. <code>body.querySelector("P")</code>, <code>body.querySelector("#question")</code>, <code>body.querySelector(".question")</code>, <code>body.querySelector(\`[data-id="\${id}"]\`)</code>, <code>tbody.querySelector(\`tr[data-id="\${id}"]\`)</code></li>
<li><b>Element: getElementsByTagName()</b> – returns a live HTMLCollection of elements with the given tag name.</li>
<li><b>Element: firstElementChild</b> – the element's first child element, or null.</li>
<li><b>Node: insertBefore(newNode, referenceNode)</b> – inserts newNode before referenceNode as a child of the node. If referenceNode is null, newNode is inserted at the end.</li>
<li><b>Element: append()</b> – inserts nodes or strings after the last child. <b>Element: before()</b> – inserts nodes just before this element.</li>
<li><b>Element: remove()</b> – removes the element from its parent node.</li>
<li><b>HTMLTableElement / HTMLTableSectionElement: rows</b> – live HTMLCollection of all the rows. <b>HTMLTableRowElement: cells</b> – the cells in the row.</li>
<li><b>EventTarget: addEventListener(type, listener)</b> – sets up a function that is called when the event is delivered to the target, e.g. <code>button.addEventListener("click", listener)</code>.</li>
<li><b>Date: getTime()</b> – milliseconds since January 1, 1970.</li>
</ul>`
};

Object.assign(DAT.ans, {
csrssrQuality: `<ul>
<li><b>User experience:</b> With SSR the first page is shown quickly, but every navigation loads a new full page from the server (the page reloads). With CSR the first load is slower, but after that the application feels fast and smooth, because only data is fetched and the page is updated without reload.</li>
<li><b>Development effort:</b> SSR is simpler: one application where the server renders the pages (e.g. Spring MVC with Thymeleaf). CSR needs more effort: a REST API on the server plus a JavaScript client application (components, state and routing).</li>
<li><b>Compatibility:</b> SSR works in all browsers, also old browsers and when JavaScript is disabled, since the browser only receives HTML. CSR requires a modern browser with JavaScript enabled.</li>
</ul>`,

rmm23: `<p><b>Level 2 – HTTP verbs:</b> every resource has its own URI, and the HTTP methods are used correctly on the resources: GET to read, POST to create, PUT to update and DELETE to delete. The API also returns correct HTTP status codes (200 OK, 201 Created, 204 No Content, 404 Not Found).</p>
<p><b>Level 3 – Hypermedia controls (HATEOAS):</b> in addition to level 2, the responses contain <b>links</b> to related resources and to the actions that are possible next (e.g. an order with links "self", "all-orders" and "delete"). The client only needs to know the entry URI and can follow the links, which gives looser coupling between client and server.</p>`,

orderByWhy: `<p>A placeholder (<code>?</code>) in a PreparedStatement can only be used for <b>values</b>, not for column names. The sort column in ORDER BY can therefore not be bound as a parameter. Mitigation: 1) validate the sort key against the valid column names (allow-list) – reject or log anything else, and 2) use a PreparedStatement for the other untrusted values (e.g. the username).</p>`,

jwtManipulate: `<p><b>1.</b> Decode the token and change the header to <code>"alg": "none"</code> and the role to <code>"admin"</code>. Base64-encode header and payload again and remove the signature part, but keep the dot: <code>Header.Payload.</code></p>
<p><b>2.</b> For the attack to succeed, the SP either does not verify the signature, or it uses a JWT parser that allows unsigned tokens (e.g. <code>parse(jwt)</code> instead of <code>parseClaimsJws(jwt)</code>).</p>`,

spaFeatures: `<p>SPA frameworks usually provide: reusable components, a template system, synchronization of state and view, and routing.</p>`
});

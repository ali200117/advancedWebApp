/* Studieplan, eksamensteknikk, jukselapp, prøveeksamener og temafrekvens.
   Lenkeformat i oppgaver: t:<teori-id>, e:<øving-id>, w:<skriftlig-id>, q:<område>, x:<eksamen-id>, p:<side> */
window.DAT = window.DAT || {};

DAT.examDate = "2026-12-12T09:00:00";

DAT.areas = {
  wf:   { name: "Web Frameworks & Services", short: "Frameworks", weight: 40, color: "#2f5fd0" },
  sec:  { name: "Web Security", short: "Security", weight: 25, color: "#c0392b" },
  js:   { name: "JavaScript", short: "JavaScript", weight: 20, color: "#b7791f" },
  g11n: { name: "Globalization", short: "G11n", weight: 10, color: "#1f8a4c" },
  ud:   { name: "Universal Design", short: "UD", weight: 5, color: "#6a3fb5" }
};

DAT.plan = [
  { week: "Uke 1 – Web Frameworks & Services (40 %)", goal: "Den største delen. Mål: du kan lage endepunkt-tabell, skrive en hel controller med statuskoder og @PreAuthorize, og forklare OAuth2-flytene uten å se.", days: [
    { date: "2026-11-13", title: "Oppstart + CSR vs SSR", tasks: [
      { text: "Les Eksamensteknikk-siden (hvordan sensor gir A)", link: "p:teknikk" },
      { text: "Les Oversikt: mønsteret i eksamenene", link: "p:" },
      { text: "Teori: CSR vs. SSR", link: "t:csr-ssr" },
      { text: "Skriv: sammenlign CSR/SSR på 4 metrikker", link: "w:w-csr-ssr" }
    ]},
    { date: "2026-11-14", title: "MVC og Spring", tasks: [
      { text: "Teori: MVC og Spring Web MVC", link: "t:mvc-spring" },
      { text: "Skriv: lagene i Spring MVC", link: "w:w-mvc-layers" },
      { text: "Se over controllerne i din egen dat152-project2 (UserController m.fl.)", link: "" }
    ]},
    { date: "2026-11-15", title: "REST og RMM", tasks: [
      { text: "Teori: REST, RMM og endepunktdesign", link: "t:rest-rmm" },
      { text: "Øving: endepunkter Student–Course", link: "e:ep-student" },
      { text: "Øving: endepunkter E-shop", link: "e:ep-shop" },
      { text: "Skriv: RMM-nivåene", link: "w:w-rmm" }
    ]},
    { date: "2026-11-16", title: "Controller-koden", tasks: [
      { text: "Teori: Skrive Controller- og Service-klasser", link: "t:controllers" },
      { text: "Øving: StudentController (skriv ALT selv, ikke se på løsningen)", link: "e:sp-studentcontroller" },
      { text: "Øving: endepunkter HotelOnline", link: "e:ep-hotel" }
    ]},
    { date: "2026-11-17", title: "Spring Security", tasks: [
      { text: "Teori: Autentisering og autorisasjon i Spring", link: "t:spring-security" },
      { text: "Øving: @PreAuthorize på StudentController", link: "e:sp-preauthorize" },
      { text: "Øving: ProductController med sikkerhet", link: "e:sp-productcontroller" }
    ]},
    { date: "2026-11-18", title: "OAuth2 og SSO", tasks: [
      { text: "Teori: OAuth2, OIDC og grant types", link: "t:oauth2" },
      { text: "Skriv: authorization code vs implicit", link: "w:w-code-implicit" },
      { text: "Skriv: authorization code-flyten steg for steg", link: "w:w-authcode-flow" },
      { text: "Skriv: password grant", link: "w:w-password-grant" }
    ]},
    { date: "2026-11-19", title: "HATEOAS, JPA, CI/CD + repetisjon", tasks: [
      { text: "Teori: HATEOAS og JPA", link: "t:hateoas-jpa" },
      { text: "Teori: CI/CD og YAML", link: "t:cicd" },
      { text: "Øving: CI/CD-pipeline", link: "e:wf-cicd" },
      { text: "Øving: CustomerService", link: "e:sp-customerservice" },
      { text: "Quiz: Web Frameworks (mål ≥ 85 %)", link: "q:wf" }
    ]}
  ]},
  { week: "Uke 2 – Web Security (25 %)", goal: "Mål: for hver sårbarhet kan du si HVA den er, HVORDAN den utnyttes, KONSEKVENSEN, og skrive MITIGERINGSKODEN.", days: [
    { date: "2026-11-20", title: "SSDLC og testing", tasks: [
      { text: "Teori: SSDLC, OWASP Top 10, SAST/DAST", link: "t:ssdlc" },
      { text: "Skriv: SAST vs DAST", link: "w:w-sast-dast" },
      { text: "Skriv: ett tiltak per SDLC-fase", link: "w:w-ssdlc" },
      { text: "Les din egen Oblig 4-rapport (Assignment4Group57.pdf) – du har funnet ekte sårbarheter!", link: "" }
    ]},
    { date: "2026-11-21", title: "SQL injection", tasks: [
      { text: "Teori: SQL Injection", link: "t:sqli" },
      { text: "Øving: PreparedStatement-fella", link: "e:sec-sqli-login" },
      { text: "Øving: INSERT", link: "e:sec-sqli-insert" },
      { text: "Øving: ORDER BY", link: "e:sec-sqli-orderby" },
      { text: "Skriv: hvorfor sårbar + konsekvenser", link: "w:w-sqli-why" },
      { text: "Skriv: typer SQLi + ORDER BY", link: "w:w-sqli-types" }
    ]},
    { date: "2026-11-22", title: "Sesjoner og cookies", tasks: [
      { text: "Teori: Sesjonshåndtering og cookies", link: "t:session" },
      { text: "Øving: logout", link: "e:sec-logout" },
      { text: "Øving: session fixation", link: "e:sec-fixation" },
      { text: "Skriv: beskytte session-cookies", link: "w:w-cookie" },
      { text: "Skriv: fixation + logout-sårbarhet", link: "w:w-session-vulns" }
    ]},
    { date: "2026-11-23", title: "XSS", tasks: [
      { text: "Teori: Cross-Site Scripting", link: "t:xss" },
      { text: "Øving: fiks DOM-XSS (kjørbar)", link: "e:js-xss-fix" },
      { text: "Øving: fiks reflected XSS i servlet", link: "e:sec-xss-java" },
      { text: "Skriv: gossip.blog-scenarioet", link: "w:w-xss-scenario" }
    ]},
    { date: "2026-11-24", title: "CSRF", tasks: [
      { text: "Teori: CSRF", link: "t:csrf" },
      { text: "Øving: synchronizer token", link: "e:sec-csrf" },
      { text: "Skriv: forutsetninger for CSRF", link: "w:w-csrf-conditions" },
      { text: "Skriv: XSS vs CSRF + encoding + token", link: "w:w-xss-vs-csrf" }
    ]},
    { date: "2026-11-25", title: "JWT, SSO og tillit", tasks: [
      { text: "Teori: JWT, SSO og tillit", link: "t:jwt" },
      { text: "JWT-laben: dekod, knekk svak hemmelighet, alg:none", link: "p:jwt" },
      { text: "Skriv: to måter å signere", link: "w:w-jwt-sig" },
      { text: "Skriv: svak hemmelighet «sentrum»", link: "w:w-jwt-weak" },
      { text: "Skriv: parse() vs parseClaimsJws()", link: "w:w-jwt-parse" },
      { text: "Skriv: tillit IdP–SP", link: "w:w-trust" },
      { text: "Skriv: hva RS må sjekke", link: "w:w-rs-checks" },
      { text: "Skriv: hva AS må gjøre", link: "w:w-as-actions" },
      { text: "Øving: verifiser JWT i Java", link: "e:sec-jwtverify" }
    ]},
    { date: "2026-11-26", title: "Passord + repetisjon sikkerhet", tasks: [
      { text: "Teori: Passordsikkerhet", link: "t:passwords" },
      { text: "Skriv: de 4 egenskapene (kommer HVERT år!)", link: "w:w-pw4" },
      { text: "Skriv: lagring, angrep og policy", link: "w:w-pw-attacks" },
      { text: "Øving: passordpolicy (kjørbar)", link: "e:js-password" },
      { text: "Øving: slow hash + salt + pepper", link: "e:sec-pwhash" },
      { text: "Quiz: Web Security (mål ≥ 85 %)", link: "q:sec" }
    ]}
  ]},
  { week: "Uke 3 – JavaScript (20 %), Globalization (10 %), UD (5 %)", goal: "Mål: skrive en komplett web-komponent på 30 min med templates, private felter, fetch og callbacks. Kunne g11n- og WCAG-svarene utenat.", days: [
    { date: "2026-11-27", title: "Asynkron JS", tasks: [
      { text: "Teori: Asynkron JS, event loop, Promises", link: "t:async" },
      { text: "Øving: Promise som resolves asynkront", link: "e:js-promise" },
      { text: "Skriv: blokkerende kode", link: "w:w-blocking" },
      { text: "Skriv: eksempler på asynkron kjøring", link: "w:w-async-examples" },
      { text: "Skriv: hva await krever (Promise)", link: "w:w-promise" }
    ]},
    { date: "2026-11-28", title: "Workers og moduler", tasks: [
      { text: "Teori: Web Workers", link: "t:workers" },
      { text: "Teori: ES-moduler og script-lasting", link: "t:modules" },
      { text: "Øving: Web Worker", link: "e:js-worker" },
      { text: "Skriv: maks tråder mot DOM", link: "w:w-dom-threads" },
      { text: "Skriv: type=module og plassering", link: "w:w-module" }
    ]},
    { date: "2026-11-29", title: "Web Components – teori", tasks: [
      { text: "Teori: Web Components", link: "t:webcomponents" },
      { text: "Teori: Moderne ECMAScript", link: "t:ecma" },
      { text: "Øving: course-info", link: "e:js-courseinfo" },
      { text: "Øving: livssyklus", link: "e:js-lifecycle" },
      { text: "Øving: defineProperty", link: "e:js-defineprop" },
      { text: "Skriv: customElements.define()", link: "w:w-define" },
      { text: "Skriv: lifecycle-callbacks", link: "w:w-lifecycle" },
      { text: "Skriv: cloneNode", link: "w:w-clonenode" },
      { text: "Skriv: shadow DOM open/closed", link: "w:w-shadow" }
    ]},
    { date: "2026-11-30", title: "Komponent-oppgaver 1", tasks: [
      { text: "Øving: MessageList (h25) – på tid, 30 min", link: "e:js-messagelist" },
      { text: "Øving: ProductInfo (v24)", link: "e:js-productinfo" }
    ]},
    { date: "2026-12-01", title: "Komponent-oppgaver 2 + SPA", tasks: [
      { text: "Øving: QuizTool (v26) – på tid, 30 min", link: "e:js-quiztool" },
      { text: "Øving: ShoppingList (h24)", link: "e:js-shoppinglist" },
      { text: "Teori: SPA, routing, state/view", link: "t:spa" },
      { text: "Øving: hash-router", link: "e:js-router" },
      { text: "Skriv: routing", link: "w:w-routing" },
      { text: "Skriv: state og view", link: "w:w-state-view" }
    ]},
    { date: "2026-12-02", title: "Globalization", tasks: [
      { text: "Teori: GILT", link: "t:gilt" },
      { text: "Teori: i18n i Spring MVC", link: "t:spring-i18n" },
      { text: "Skriv: g11n/i18n/l10n", link: "w:w-g11n" },
      { text: "Skriv: Session vs CookieLocaleResolver + stegene", link: "w:w-locale-resolver" },
      { text: "Øving: properties for kursside (h25)", link: "e:g-props-h25" },
      { text: "Øving: properties for e-Library (v26)", link: "e:g-props-v26" },
      { text: "Øving: i18n-konfigurasjon", link: "e:sp-i18n" }
    ]},
    { date: "2026-12-03", title: "Universal Design + quiz", tasks: [
      { text: "Teori: Universell utforming og WCAG", link: "t:ud" },
      { text: "Skriv: UD + 3 prinsipper", link: "w:w-ud" },
      { text: "Skriv: hva er WCAG", link: "w:w-wcag" },
      { text: "Skriv: Perceivable", link: "w:w-perceivable" },
      { text: "Skriv: Operable", link: "w:w-operable" },
      { text: "Quiz: JavaScript", link: "q:js" },
      { text: "Quiz: Globalization + UD", link: "q:g11n" }
    ]}
  ]},
  { week: "Uke 4 – Prøveeksamener og finpuss", goal: "Mål: simuler eksamen under ekte forhold (4 timer, ingen hjelpemidler). Rett deg selv mot løsningen og sensorveiledningen. Øv mest på det du taper poeng på.", days: [
    { date: "2026-12-04", title: "Prøveeksamen 1: vår 2026", tasks: [
      { text: "Ta v26 på tid (4 t), skriv i et tomt dokument", link: "x:v26" },
      { text: "Rett: sammenlign med teorisidene og øvingsløsningene", link: "" }
    ]},
    { date: "2026-12-05", title: "Lær av feilene", tasks: [
      { text: "Gjør om alle v26-deloppgaver du fikk under 70 % på", link: "x:v26" },
      { text: "Quiz: «Øv på feil»", link: "q:wrong" }
    ]},
    { date: "2026-12-06", title: "Prøveeksamen 2: høst 2025", tasks: [
      { text: "Ta h25 på tid (4 t)", link: "x:h25" },
      { text: "Rett mot sensorveiledningen (Sensorveiledning_bokmål_h25)", link: "" }
    ]},
    { date: "2026-12-07", title: "Rett h25 + ekstra komponenter", tasks: [
      { text: "Øving: StorageManager (forelder-komponent)", link: "e:js-storagemanager" },
      { text: "Øving: ExamList", link: "e:js-examlist" },
      { text: "Øving: endepunkter SensorLoc", link: "e:ep-sensor" }
    ]},
    { date: "2026-12-08", title: "Prøveeksamen 3: høst 2024", tasks: [
      { text: "Ta h24 på tid (hopp over custom tags)", link: "x:h24" },
      { text: "Rett mot DAT152_solution_h24", link: "" }
    ]},
    { date: "2026-12-09", title: "Repetisjon", tasks: [
      { text: "Les hele jukselappen", link: "p:jukselapp" },
      { text: "Les alle «Eksamenssvar»-boksene høyt i teorien", link: "p:teori" },
      { text: "Quiz: alle områder (mål ≥ 90 %)", link: "q:all" }
    ]},
    { date: "2026-12-10", title: "Svake punkter", tasks: [
      { text: "Gjør alle øvinger der du har < 100 % på nytt", link: "p:oving" },
      { text: "Gjør alle skriftlige spørsmål på nytt uten å se i teorien", link: "p:skriv" },
      { text: "v24 eller h23 som ekstra prøveeksamen (valgfritt)", link: "x:v24" }
    ]},
    { date: "2026-12-11", title: "Lett dag", tasks: [
      { text: "Jukselapp en siste gang", link: "p:jukselapp" },
      { text: "Quiz: «Øv på feil»", link: "q:wrong" },
      { text: "Pakk sekk, legg deg tidlig 😴", link: "" }
    ]},
    { date: "2026-12-12", title: "EKSAMEN 🎓", tasks: [
      { text: "Lagre dokumentet i Wiseflow FØR du begynner å skrive (autosave)", link: "" },
      { text: "Følg tidsplanen: % × 2,4 = minutter per oppgave", link: "p:teknikk" }
    ]}
  ]}
];

DAT.exams = [
  { id: "v26", name: "Vår 2026 (juni)", pdf: "../DAT152_eksamen_v26.pdf", solution: null, tasks: [
    { label: "1a RMM-nivåer", pct: 6, link: "w:w-rmm" },
    { label: "1b Endepunkter Student–Course", pct: 8, link: "e:ep-student" },
    { label: "1c StudentController", pct: 14, link: "e:sp-studentcontroller" },
    { label: "1d I Code vs implicit", pct: 6, link: "w:w-code-implicit" },
    { label: "1d II @PreAuthorize (egne kurs)", pct: 6, link: "e:sp-preauthorize" },
    { label: "2a g11n/i18n/l10n", pct: 4, link: "w:w-g11n" },
    { label: "2b Property-filer e-Library", pct: 6, link: "e:g-props-v26" },
    { label: "3a WCAG", pct: 2, link: "w:w-wcag" },
    { label: "3b Perceivable", pct: 3, link: "w:w-perceivable" },
    { label: "4a SQLi (PreparedStatement-fella)", pct: 4, link: "e:sec-sqli-login" },
    { label: "4b JWT signatur + «sentrum»", pct: 4, link: "w:w-jwt-weak" },
    { label: "4c Passord: 4 egenskaper", pct: 4, link: "w:w-pw4" },
    { label: "4d XSS-scenario", pct: 4, link: "w:w-xss-scenario" },
    { label: "4e Tillit IdP–SP", pct: 4, link: "w:w-trust" },
    { label: "4f CSRF-forutsetninger", pct: 5, link: "w:w-csrf-conditions" },
    { label: "5a Web Worker", pct: 2, link: "e:js-worker" },
    { label: "5b Promise", pct: 2, link: "e:js-promise" },
    { label: "5c Blokkerende kode", pct: 2, link: "w:w-blocking" },
    { label: "5d Tråder mot DOM", pct: 2, link: "w:w-dom-threads" },
    { label: "5e Routing", pct: 2, link: "w:w-routing" },
    { label: "5f QuizTool", pct: 10, link: "e:js-quiztool" }
  ]},
  { id: "h25", name: "Høst 2025 (desember)", pdf: "../DAT152_eksamen_h25-1.pdf", solution: "../Sensorveiledning_bokmål_h25-1.pdf", tasks: [
    { label: "1a CSR vs SSR", pct: 6, link: "w:w-csr-ssr" },
    { label: "1b Endepunkter e-shop", pct: 8, link: "e:ep-shop" },
    { label: "1c I CustomerController (+ ordre-regler)", pct: 8, link: "t:controllers" },
    { label: "1c II ProductController", pct: 6, link: "e:sp-productcontroller" },
    { label: "1d I Code vs implicit", pct: 6, link: "w:w-code-implicit" },
    { label: "1d II @PreAuthorize (egne ordre)", pct: 6, link: "e:sp-preauthorize" },
    { label: "2a g11n/i18n/l10n", pct: 4, link: "w:w-g11n" },
    { label: "2b Property-filer kursside", pct: 6, link: "e:g-props-h25" },
    { label: "3a-b UD + 3 prinsipper", pct: 2, link: "w:w-ud" },
    { label: "3c Operable", pct: 3, link: "w:w-operable" },
    { label: "4a SAST vs DAST", pct: 4, link: "w:w-sast-dast" },
    { label: "4b Passord: 4 egenskaper", pct: 4, link: "w:w-pw4" },
    { label: "4c Beskytte cookies", pct: 4, link: "w:w-cookie" },
    { label: "4d SQLi ORDER BY", pct: 5, link: "e:sec-sqli-orderby" },
    { label: "4e CSRF-forutsetninger", pct: 4, link: "w:w-csrf-conditions" },
    { label: "4f JWT parse() + alg none", pct: 4, link: "w:w-jwt-parse" },
    { label: "5a customElements.define", pct: 2, link: "w:w-define" },
    { label: "5b Lifecycle", pct: 2, link: "w:w-lifecycle" },
    { label: "5c cloneNode", pct: 2, link: "w:w-clonenode" },
    { label: "5d type=module", pct: 2, link: "w:w-module" },
    { label: "5e State og view", pct: 2, link: "w:w-state-view" },
    { label: "5f MessageList", pct: 10, link: "e:js-messagelist" }
  ]},
  { id: "h24", name: "Høst 2024", pdf: "../DAT152_eksamen_h24-1.pdf", solution: "../DAT152_solution_h24-1.pdf", tasks: [
    { label: "1a Endepunkter Student–Course (+ staff)", pct: 8, link: "e:ep-student" },
    { label: "1b StudentController + CourseController", pct: 12, link: "e:sp-studentcontroller" },
    { label: "1c I Authorization code-flyten", pct: 5, link: "w:w-authcode-flow" },
    { label: "1c II @PreAuthorize", pct: 5, link: "e:sp-preauthorize" },
    { label: "2 Globalization", pct: 10, link: "w:w-g11n" },
    { label: "3 Custom tags (UTGÅR i år – hopp over)", pct: 0, link: "" },
    { label: "4 UD + Operable", pct: 5, link: "w:w-operable" },
    { label: "5a Cookies", pct: 3, link: "w:w-cookie" },
    { label: "5b Logout-sårbarhet", pct: 4, link: "e:sec-logout" },
    { label: "5c SQLi (to implementasjoner)", pct: 4, link: "e:sec-sqli-login" },
    { label: "5d Passord: 4 egenskaper", pct: 3, link: "w:w-pw4" },
    { label: "5e JWT parseClaimsJws", pct: 4, link: "w:w-jwt-parse" },
    { label: "5f Tillit AS–RS", pct: 3, link: "w:w-trust" },
    { label: "5g Hva AS må gjøre", pct: 4, link: "w:w-as-actions" },
    { label: "6a Shadow DOM, slot, parent→child, Promise", pct: 10, link: "w:w-shadow" },
    { label: "6b ShoppingList", pct: 10, link: "e:js-shoppinglist" }
  ]},
  { id: "v24", name: "Vår 2024", pdf: "../DAT152_eksamen_v24-1.pdf", solution: "../DAT152_solution_v24-1.pdf", tasks: [
    { label: "1a Endepunkter SensorLoc", pct: 8, link: "e:ep-sensor" },
    { label: "1b Sensor- og MeasurementController", pct: 12, link: "t:controllers" },
    { label: "1c Authorization code + @PreAuthorize", pct: 10, link: "w:w-authcode-flow" },
    { label: "2 Globalization", pct: 10, link: "w:w-g11n" },
    { label: "3 Custom tags (UTGÅR)", pct: 0, link: "" },
    { label: "4 WCAG + Perceivable", pct: 5, link: "w:w-perceivable" },
    { label: "5a Passord", pct: 4, link: "w:w-pw4" },
    { label: "5b CSRF challenge-response", pct: 4, link: "t:csrf" },
    { label: "5c XSS-scenario", pct: 4, link: "w:w-xss-scenario" },
    { label: "5d SQLi", pct: 5, link: "e:sec-sqli-login" },
    { label: "5e JWT signatur + «bergen»", pct: 4, link: "w:w-jwt-weak" },
    { label: "5f Hva RS må sjekke", pct: 4, link: "w:w-rs-checks" },
    { label: "6a State/view, routing, defineProperty", pct: 6, link: "w:w-routing" },
    { label: "6b ProductInfo", pct: 8, link: "e:js-productinfo" },
    { label: "6c StorageManager", pct: 6, link: "e:js-storagemanager" }
  ]},
  { id: "h23", name: "Høst 2023", pdf: "../DAT152_eksamen_h23-1.pdf", solution: null, tasks: [
    { label: "1a Endepunkter HotelOnline", pct: 8, link: "e:ep-hotel" },
    { label: "1b CustomerController + CustomerService", pct: 12, link: "e:sp-customerservice" },
    { label: "1c Password grant + @PreAuthorize", pct: 10, link: "w:w-password-grant" },
    { label: "2 Globalization", pct: 10, link: "w:w-g11n" },
    { label: "3 Custom tags (UTGÅR)", pct: 0, link: "" },
    { label: "4 WCAG + Operable", pct: 5, link: "w:w-operable" },
    { label: "5a SSDLC", pct: 3, link: "w:w-ssdlc" },
    { label: "5b SQLi INSERT", pct: 4, link: "e:sec-sqli-insert" },
    { label: "5c XSS vs CSRF", pct: 4, link: "w:w-xss-vs-csrf" },
    { label: "5d Session fixation", pct: 3, link: "e:sec-fixation" },
    { label: "5e JWT signatur + «victory»", pct: 4, link: "w:w-jwt-sig" },
    { label: "5f parseClaimsJws", pct: 4, link: "w:w-jwt-parse" },
    { label: "5g Passord", pct: 3, link: "w:w-pw4" },
    { label: "6a Asynkron JS", pct: 6, link: "w:w-async-examples" },
    { label: "6b ExamManager", pct: 7, link: "e:js-storagemanager" },
    { label: "6c ExamList", pct: 7, link: "e:js-examlist" }
  ]}
];

/* Hvilke temaer har kommet når (✓ = spurt). Grunnlag for «sannsynlig på eksamen». */
DAT.frequency = {
  cols: ["h21", "h22", "h23", "v24", "h24", "h25", "v26"],
  rows: [
    ["REST endepunkt-tabell", "wf", [1,1,1,1,1,1,1]],
    ["Controller-kode", "wf", [0,1,1,1,1,1,1]],
    ["@PreAuthorize / roller", "wf", [0,0,1,1,1,1,1]],
    ["OAuth2 grant-flyt", "wf", [0,0,1,1,1,1,1]],
    ["CSR vs SSR", "wf", [0,0,0,0,0,1,0]],
    ["RMM-nivåer", "wf", [0,1,0,0,0,0,1]],
    ["CI/CD (i pensum, aldri spurt)", "wf", [0,0,0,0,0,0,0]],
    ["g11n/i18n/l10n-definisjon", "g11n", [1,1,1,1,1,1,1]],
    ["Property-filer", "g11n", [1,1,1,1,1,1,1]],
    ["UD-definisjon/prinsipper", "ud", [0,0,0,0,1,1,0]],
    ["WCAG + ett prinsipp", "ud", [1,1,1,1,1,1,1]],
    ["Passordlagring", "sec", [1,1,1,1,1,1,1]],
    ["SQL injection", "sec", [1,1,1,1,1,1,1]],
    ["JWT signatur/svak nøkkel", "sec", [1,0,1,1,0,0,1]],
    ["JWT alg none / parse()", "sec", [0,1,1,0,1,1,0]],
    ["XSS", "sec", [1,1,1,1,0,0,1]],
    ["CSRF", "sec", [1,0,1,1,0,1,1]],
    ["Session/cookies", "sec", [1,0,1,0,1,1,0]],
    ["Tillit IdP–SP / AS–RS", "sec", [0,1,0,0,1,0,1]],
    ["RS/AS-sjekker av token", "sec", [1,0,0,1,1,0,0]],
    ["SSDLC / SAST-DAST", "sec", [1,0,1,0,0,1,0]],
    ["JS-komponent (10 %)", "js", [1,1,1,1,1,1,1]],
    ["Async / Promise", "js", [0,0,1,1,1,0,1]],
    ["Web Workers / tråder", "js", [1,0,0,0,0,0,1]],
    ["SPA / routing", "js", [1,0,0,1,0,0,1]],
    ["Moduler / type=module", "js", [1,1,0,0,0,1,0]],
    ["Shadow DOM / slot / lifecycle", "js", [1,1,0,0,1,1,0]],
    ["State og view", "js", [0,0,0,1,0,1,0]]
  ]
};

DAT.technique = `
<h1>Eksamensteknikk – slik får du A/B</h1>
<p class="lead">Basert på sensorveiledningene for h21, h24 og h25.</p>

<h2>Format</h2>
<ul>
<li>4 timer skriftlig i Wiseflow, kun tospråklig ordbok. <b>Lagre dokumentet før du begynner</b> (starter autosave).</li>
<li>5 oppgaver: Web Frameworks 40 % · Globalization 10 % · UD 5 % · Web Security 25 % · JavaScript 20 %.</li>
<li><b>Ingen JSP og ingen custom tags</b> i år (partb-exam-info). Hopp over de deloppgavene i gamle eksamener.</li>
<li>Vedlegg på slutten gir deg Spring-annotasjoner, HttpStatus-konstanter og DOM-metoder (textContent, querySelector, insertBefore, firstElementChild, remove …). Du trenger ikke pugge signaturene – men du må vite <b>når</b> du skal bruke dem.</li>
</ul>

<h2>Tidsbruk: prosent × 2,4 = minutter</h2>
<div class="table-wrap"><table>
<tr><th>Oppgave</th><th>Vekt</th><th>Tid</th><th>Tips</th></tr>
<tr><td>Q1 Web Frameworks</td><td>40 %</td><td>96 min</td><td>Endepunkt-tabell (~15 min) → controller (~45 min) → OAuth2 + @PreAuthorize (~25 min).</td></tr>
<tr><td>Q2 Globalization</td><td>10 %</td><td>24 min</td><td>Definisjoner (8 min) + property-filer (15 min).</td></tr>
<tr><td>Q3 Universal Design</td><td>5 %</td><td>12 min</td><td>Ren pugg: definisjon + prinsippets retningslinjer.</td></tr>
<tr><td>Q4 Web Security</td><td>25 %</td><td>60 min</td><td>~6 deloppgaver à 10 min.</td></tr>
<tr><td>Q5 JavaScript</td><td>20 %</td><td>48 min</td><td>5 korte teorispørsmål (2 % hver, ~3 min) + komponent 10 % (~30 min).</td></tr>
</table></div>
<p><b>Rekkefølge-tips:</b> Start med det du kan best for å få flyt. Mange tar Q2 + Q3 først (raske poeng, 36 min), så Q4, så Q1 og til slutt Q5. Ikke la én deloppgave spise tiden – «spredningen teller» (sensor: «Er det bare de enkleste spørsmålene som er besvart?»).</p>

<h2>Hva sensor ser etter</h2>
<div class="split">
<div class="card"><h3>A-svar</h3><ul>
<li>Svært god kunnskap og <b>innsikt</b> – forklarer <i>hvorfor</i>, ikke bare <i>hva</i>.</li>
<li><b>Klar struktur</b> og <b>helt korrekte begreper</b>.</li>
<li>Presis, riktig controller/service-kode.</li>
<li>Sikkerhet: finner <b>alle</b> sårbarheter i gitt kode og gir gode løsninger.</li>
<li>JS: <b>oversiktlig og moderne</b> kode (ES2022: <code>#private</code>, <code>const</code>, arrow functions, async/await).</li></ul></div>
<div class="card"><h3>C-svar</h3><ul>
<li>God kunnskap, men noe upresis.</li>
<li>Finner de fleste sårbarhetene.</li>
<li>JS-kode oversiktlig, men kan bruke utdaterte elementer.</li></ul>
<h3>Det du trekkes lite for</h3><ul><li>Syntaksfeil, feil metodenavn, manglende parametere – «det utviklingsverktøyet automatisk ville gitt».</li></ul>
<h3>Det du trekkes mye for</h3><ul><li>Upresise/ufullstendige forklaringer.</li><li>Bare kopiere kode fra oppgaveteksten (0 poeng).</li><li>Ikke bruke oppgitte templates.</li><li>Sette likhet mellom asynkron og tråder (0 poeng).</li><li>Svar uten begrunnelse når «You must explain».</li></ul></div>
</div>

<h2>Oppskrift for teorisvar</h2>
<ol class="flow">
<li><b>Definer</b> begrepet i én presis setning.</li>
<li><b>Forklar mekanismen</b> (hvordan det virker / hvordan angrepet skjer).</li>
<li><b>Konsekvens</b> (hva skjer hvis …) – spesielt i sikkerhet.</li>
<li><b>Eksempel</b> (kort kode eller payload).</li>
<li><b>Mitigering / anbefaling</b>.</li>
</ol>
<div class="callout"><span class="callout-title">Eksempel: «Hva er SQL injection?»</span>
Definisjon (input tolkes som SQL-kode) → mekanisme (konkatenering) → payload (<code>admin' --</code>) → konsekvens (auth-bypass, datalekkasje, sletting) → mitigering (PreparedStatement med <code>?</code>, allow-list for ORDER BY, least privilege).</div>

<h2>Oppskrift for kodeoppgaver</h2>
<ul>
<li>Skriv en <b>kort kommentar</b> før hver metode: hva den gjør og hvilken statuskode.</li>
<li>Gjør antakelser eksplisitt: «Assuming Course has getId()…».</li>
<li>JS-komponent: (1) private felter, (2) finn elementene i konstruktøren, (3) listeners med arrow functions, (4) offentlige metoder, (5) private hjelpemetoder. Bruk <code>textContent</code>, <code>dataset</code>, <code>cloneNode(true)</code>.</li>
<li>Bruk vedleggets metoder – de er hint om hva løsningen trenger (f.eks. <code>insertBefore</code> + <code>firstElementChild</code> = «sett inn øverst»).</li>
</ul>

<h2>Språk</h2>
<p>Oppgavene er på engelsk. Du kan svare på norsk eller engelsk. Mønstersvarene her er på engelsk så du lærer de presise fagbegrepene – bruk dem uansett språk.</p>
`;

DAT.cheatsheet = `
<h1>Jukselapp – siste repetisjon</h1>
<p class="lead">Alt det viktigste på én side. Les denne dagen før eksamen.</p>

<div class="split">
<div class="card"><h3>REST / Spring</h3>
<ul>
<li>POST samling → <b>201</b>. GET → 200 (tom liste 204). PUT → 200. DELETE → 200/204. Ikke funnet → 404.</li>
<li>URI: substantiv, flertall, maks 4 nivå: <code>/students/{sid}/courses/{cid}</code>. Aldri verb.</li>
<li>RMM: 0 POX · 1 ressurser · 2 verb + statuskoder · 3 HATEOAS.</li>
<li><code>@RestController</code>, <code>@RequestMapping("/app/api/v1")</code>, <code>@Autowired</code>, <code>@PathVariable</code>, <code>@RequestBody</code>, <code>@RequestParam</code>.</li>
<li><code>return new ResponseEntity&lt;&gt;(body, HttpStatus.CREATED);</code></li>
<li><code>@PreAuthorize("hasAuthority('ADMIN') or #sid == authentication.details.sid")</code></li>
<li>Lag: Controller → Service → Repository → DB.</li>
</ul></div>
<div class="card"><h3>OAuth2</h3>
<ul>
<li><b>Code</b>: redirect → login/consent → <i>code</i> til redirect_uri → klient bytter code + secret mot token på /token (back-channel) → Bearer mot RS.</li>
<li><b>Implicit</b>: token direkte i URL-fragment, ingen klientautentisering, ingen refresh → utdatert. Bruk code + PKCE.</li>
<li><b>Password</b>: bruker gir passord til klienten → /token. Kun betrodde klienter.</li>
<li><b>Client credentials</b>: maskin-til-maskin.</li>
<li>CSR raskere etter første last, høyere throughput; SSR raskere første last, bedre SEO.</li>
</ul></div>
<div class="card"><h3>Globalization</h3>
<ul>
<li>g11n = i18n + l10n. i18n: teknisk klar for språk uten kodeendring. l10n: tilpasse til én locale (oversette + formater).</li>
<li>Properties: samme nøkler, <code>{0}</code> for tall/datoer/navn.</li>
<li>Spring: properties → MessageSource → LocaleResolver → LocaleChangeInterceptor (?lang=) → <code>th:text="#{key}"</code>.</li>
<li>Session-resolver: på server, dør med sesjonen. Cookie-resolver: i nettleser, huskes.</li>
</ul></div>
<div class="card"><h3>Universal Design</h3>
<ul>
<li>UD: «usable by all people, to the greatest extent possible, without adaptation or specialized design».</li>
<li>7: Equitable · Flexibility · Simple & intuitive · Perceptible info · Tolerance for error · Low physical effort · Size & space.</li>
<li>WCAG (W3C): POUR → guidelines → success criteria (A/AA/AAA). Norge: 2.1 A+AA.</li>
<li><b>P</b>: text alternatives, time-based media, adaptable, distinguishable.</li>
<li><b>O</b>: keyboard, enough time, seizures, navigable, input modalities.</li>
<li><b>U</b>: readable, predictable, input assistance. <b>R</b>: compatible.</li>
</ul></div>
<div class="card"><h3>Sikkerhet 1</h3>
<ul>
<li><b>SQLi</b>: konkatenering FØR prepareStatement = sårbar. Fiks: <code>?</code> + <code>setString</code>. ORDER BY: allow-list. Typer: error, union, blind (boolean/time), OOB, second-order.</li>
<li><b>XSS</b>: reflected / stored / DOM. Fiks: kontekstuell output encoding, textContent, HttpOnly, CSP. Blacklist feiler.</li>
<li><b>CSRF</b>: relevant handling + cookie-sesjon + forutsigbare parametere + innlogget offer. Fiks: synchronizer token, double submit, SameSite, re-auth.</li>
<li><b>Cookie</b>: HttpOnly (JS kan ikke lese), Secure (bare HTTPS), SameSite (CSRF).</li>
<li><b>Fixation</b>: ny session-ID ved login. <b>Logout</b>: <code>session.invalidate()</code>.</li>
</ul></div>
<div class="card"><h3>Sikkerhet 2</h3>
<ul>
<li><b>Passord</b>: hash = verifiserbar ikke gjenopprettbar · slow = work factor, bremser brute force · salt = ulike hasher, knuser rainbow tables · pepper = hemmelighet utenfor DB.</li>
<li><b>JWT</b>: header.payload.signature, Base64URL (ikke kryptert). HMAC(secret) eller privat nøkkel (RSA).</li>
<li>Svak hemmelighet → offline brute force → forfalske tokens.</li>
<li><code>parse()</code> godtar alg none → privilege escalation. <code>parseClaimsJws()</code> avviser usignert og endret.</li>
<li>RS sjekker: signatur, exp, iss, aud, claims. AS inkluderer iss, sub, aud, exp, iat + <b>signerer</b>.</li>
<li>Tillit: IdP signerer med privat nøkkel, SP verifiserer med IdP sitt sertifikat.</li>
<li>SAST: kode, uten kjøring, tidlig, white-box. DAST: kjørende app, black-box.</li>
</ul></div>
<div class="card"><h3>JavaScript 1</h3>
<ul>
<li>Én hovedtråd. Asynkron ≠ tråder. Blokkerende kode → siden fryser.</li>
<li>Maks 1 tråd mot DOM. Workers: ingen DOM, postMessage.</li>
<li>Promise: pending → fulfilled/rejected. await krever Promise.</li>
<li><code>type="module"</code>: import/export, defer, strict, modul-scope. Legg i &lt;head&gt; (ytelse).</li>
<li>Routing: hver tilstand egen URL; hashchange eller pushState/popstate.</li>
<li>State = data, view = DOM. View fra state: state endres → view oppdateres.</li>
</ul></div>
<div class="card"><h3>JavaScript 2 – komponenten</h3>
<ul>
<li><code>customElements.define</code>: ny tag ↔ klasse; hver bruk = ny instans.</li>
<li>connected = satt inn i DOM, disconnected = fjernet fra DOM.</li>
<li><code>cloneNode(true)</code>: ellers flyttes innholdet og templaten blir tom.</li>
<li>Shadow: innkapslet DOM. open → <code>el.shadowRoot</code>; closed → null.</li>
<li><code>#callbacks = new Map()</code>; <code>Symbol()</code> som id; <code>forEach(cb =&gt; cb(data))</code>.</li>
<li><code>row.dataset.id = item.id</code>; <code>querySelector(\`[data-id="\${id}"]\`)</code>.</li>
<li>Øverst: <code>insertBefore(el, list.firstElementChild)</code> / <code>prepend</code>.</li>
<li>Alltid <code>textContent</code> for data.</li>
</ul></div>
</div>
`;

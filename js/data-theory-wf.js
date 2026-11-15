/* Teori: Web Frameworks and Services (40 %) */
window.DAT = window.DAT || {};
DAT.theory = DAT.theory || [];

DAT.theory.push({
  id: "csr-ssr",
  area: "wf",
  title: "CSR vs. SSR og kvalitetsattributter",
  summary: "Hvor HTML-en lages, og hvordan det påvirker ytelse, båndbredde, throughput, UX og utviklingsinnsats.",
  html: `
<p class="lead">Spørsmålet kommer nesten hvert år (h25 Q1a). Du må kunne sammenligne de to på konkrete <b>metrikker</b>, ikke bare si «CSR er raskere».</p>

<h2>Hva er forskjellen?</h2>
<div class="split">
<div class="card"><h3>Server-Side Rendering (SSR)</h3>
<p>Serveren bygger <b>hele HTML-siden</b> for hver forespørsel (f.eks. Spring MVC + Thymeleaf/JSP). Nettleseren viser bare det den får.</p>
<ul><li>Hver navigasjon = ny HTTP-forespørsel og ny full side.</li><li>Logikk og maler kjører på serveren.</li><li>Klassisk «multi-page application» (MPA).</li></ul></div>
<div class="card"><h3>Client-Side Rendering (CSR)</h3>
<p>Serveren sender et nesten tomt HTML-skall + en JavaScript-bunt. JavaScript i nettleseren henter <b>data (JSON)</b> fra et REST-API og bygger DOM-en selv (React, Vue, Web Components).</p>
<ul><li>Typisk «single-page application» (SPA).</li><li>Etter første last: kun data går over nettet.</li></ul></div>
</div>

<h2>Sammenligning på metrikker</h2>
<div class="table-wrap"><table>
<tr><th>Metrikk</th><th>SSR</th><th>CSR</th></tr>
<tr><td><b>Initial page load time</b></td><td><b>Raskere</b> første visning: ferdig HTML kan vises med en gang (god First Contentful Paint).</td><td><b>Tregere</b>: må laste ned, parse og kjøre JS-bunten, og så hente data før noe vises.</td></tr>
<tr><td><b>Subsequent page load time</b></td><td><b>Tregere</b>: hver navigasjon er en full rundtur og full side må lastes og rendres på nytt.</td><td><b>Raskere</b>: bare JSON hentes, DOM oppdateres lokalt. Ingen full reload.</td></tr>
<tr><td><b>Throughput</b> (forespørsler serveren klarer per sek)</td><td><b>Lavere</b>: serveren gjør rendering-arbeid (maler, HTML-bygging) for hver forespørsel → mer CPU per request.</td><td><b>Høyere</b>: serveren returnerer bare data; rendering-arbeidet er flyttet til klientene.</td></tr>
<tr><td><b>Bandwidth</b></td><td><b>Mer</b> totalt over en økt: full HTML (inkl. gjentatt layout/meny) sendes hver gang.</td><td><b>Mindre</b> per interaksjon (bare JSON), men <b>større</b> første nedlasting (JS-bunt).</td></tr>
<tr><td>User experience</td><td>Sideblink ved navigasjon, men rask første visning. Fungerer uten JS.</td><td>Applikasjonsfølelse, jevne overganger, men blank side/«spinner» i starten.</td></tr>
<tr><td>SEO</td><td>God – crawlere får ferdig innhold.</td><td>Svakere uten ekstra tiltak (pre-rendering).</td></tr>
<tr><td>Development effort</td><td>Enklere: én kodebase, ett språk, enklere state.</td><td>Mer: to applikasjoner (API + klient), state-håndtering, routing, bygg-verktøy.</td></tr>
<tr><td>Compatibility</td><td>Fungerer i alle nettlesere, også uten JS.</td><td>Krever moderne nettleser og JS aktivert.</td></tr>
<tr><td>Klientressurser</td><td>Lite krav til klient.</td><td>Tyngre for svake enheter (mobil) – mye JS må kjøres.</td></tr>
</table></div>

<div class="exam-answer">
<p><b>Initial page load:</b> SSR is faster because the server returns a complete HTML page that the browser can display immediately. CSR must first download and execute the JavaScript bundle and then fetch data before anything meaningful is shown.</p>
<p><b>Subsequent page load:</b> CSR is faster because only data (JSON) is fetched and the DOM is updated locally without a full page reload. With SSR every navigation is a new round trip and a full page render.</p>
<p><b>Throughput:</b> CSR gives higher server throughput since the server only serializes data, while SSR spends CPU on rendering templates for every request.</p>
<p><b>Bandwidth:</b> SSR uses more bandwidth over a session because full HTML (including repeated layout) is sent for each page. CSR has a larger initial download (JS bundle) but each later interaction only transfers small JSON payloads.</p>
</div>

<div class="callout"><span class="callout-title">Hybrid</span>Moderne rammeverk (Next.js, Nuxt) kombinerer: SSR for første side + «hydration» slik at resten kjører som CSR. Nevn gjerne dette for å vise innsikt.</div>
`
});

DAT.theory.push({
  id: "mvc-spring",
  area: "wf",
  title: "MVC og Spring Web MVC (lag og annotasjoner)",
  summary: "Model–View–Controller, DispatcherServlet, lagdeling (Presentation/Business/Persistence) og alle annotasjonene du må kunne.",
  html: `
<h2>MVC – arkitekturmønsteret</h2>
<ul>
<li><b>Model</b> – data og forretningslogikk (entiteter, tjenester). Vet ingenting om visning.</li>
<li><b>View</b> – presentasjonen (Thymeleaf-mal, JSON-representasjon). Viser data fra modellen.</li>
<li><b>Controller</b> – tar imot forespørselen, kaller modellen/tjenesten, velger view.</li>
</ul>
<p><b>Hvorfor?</b> Separation of concerns → lettere å teste, vedlikeholde, bytte view (HTML ↔ JSON), og flere utviklere kan jobbe parallelt.</p>

<h2>Spring MVC – flyten for én forespørsel</h2>
<ol class="flow">
<li>HTTP-forespørselen treffer <b>DispatcherServlet</b> (Front Controller).</li>
<li><b>HandlerMapping</b> finner riktig controller-metode ut fra URL + HTTP-metode (<code>@GetMapping</code> osv.).</li>
<li>Controlleren kaller <b>Service</b>-laget (forretningslogikk), som kaller <b>Repository</b> (persistens) → database.</li>
<li>Controlleren returnerer enten et <b>view-navn + Model</b> (@Controller) eller et <b>objekt</b> som serialiseres til JSON (@RestController).</li>
<li><b>ViewResolver</b> finner malen (f.eks. <code>templates/books.html</code>), eller <b>HttpMessageConverter</b> (Jackson) lager JSON.</li>
<li>Responsen sendes tilbake.</li>
</ol>

<h2>Lagene (spurt om i pensumlista)</h2>
<div class="table-wrap"><table>
<tr><th>Lag</th><th>Spring-stereotype</th><th>Ansvar</th></tr>
<tr><td>Presentation layer</td><td><code>@Controller</code> / <code>@RestController</code></td><td>HTTP inn/ut, validering av input, mapping til view eller JSON. Ingen forretningslogikk.</td></tr>
<tr><td>Business layer</td><td><code>@Service</code></td><td>Forretningsregler, transaksjoner, kaster domene-unntak (<code>StudentNotFoundException</code>).</td></tr>
<tr><td>Persistence layer</td><td><code>@Repository</code> / <code>CrudRepository</code>, <code>JpaRepository</code></td><td>Lagre/hente data via JPA/Hibernate.</td></tr>
<tr><td>Database</td><td>H2, MySQL, Postgres …</td><td>Faktisk lagring.</td></tr>
</table></div>
<p>Hvert lag avhenger kun av laget under. Lagene kobles sammen med <b>Dependency Injection</b> (<code>@Autowired</code>): Spring-containeren lager objektene (beans) og «injiserer» dem.</p>

<h2>Annotasjoner du må kunne</h2>
<div class="table-wrap"><table>
<tr><th>Annotasjon</th><th>Hva den gjør</th></tr>
<tr><td><code>@Controller</code></td><td>Klasse som håndterer web-forespørsler og returnerer <b>view-navn</b>.</td></tr>
<tr><td><code>@RestController</code></td><td>= <code>@Controller</code> + <code>@ResponseBody</code> på alle metoder → returverdi skrives som JSON i body.</td></tr>
<tr><td><code>@RequestMapping("/x")</code></td><td>Mapper URL (og evt. metode). På klassen = felles prefiks, f.eks. <code>/studapp/api/v1</code>.</td></tr>
<tr><td><code>@GetMapping</code>, <code>@PostMapping</code>, <code>@PutMapping</code>, <code>@DeleteMapping</code>, <code>@PatchMapping</code></td><td>Snarveier for <code>@RequestMapping(method=…)</code>.</td></tr>
<tr><td><code>@PathVariable</code></td><td>Henter verdi fra URI-stien: <code>/students/{sid}</code> → <code>@PathVariable Long sid</code>.</td></tr>
<tr><td><code>@RequestParam</code></td><td>Henter query-parameter/form-felt: <code>/orders?status=NEW</code> → <code>@RequestParam String status</code>.</td></tr>
<tr><td><code>@RequestBody</code></td><td>Deserialiserer JSON i body til et Java-objekt (POST/PUT).</td></tr>
<tr><td><code>@ResponseBody</code></td><td>Returverdien er selve responsen (ikke et view-navn).</td></tr>
<tr><td><code>@Autowired</code></td><td>Dependency injection av en bean (service/repository).</td></tr>
<tr><td><code>@Service</code>, <code>@Repository</code>, <code>@Component</code></td><td>Registrerer klassen som Spring-bean (stereotyper).</td></tr>
<tr><td><code>@ModelAttribute</code></td><td>Binder skjemafelt til et objekt / legger noe i Model.</td></tr>
<tr><td><code>@PreAuthorize("…")</code></td><td>Metodesikkerhet – sjekker roller/regler før metoden kjøres.</td></tr>
<tr><td><code>@ExceptionHandler</code>, <code>@ControllerAdvice</code></td><td>Sentral håndtering av unntak → riktig statuskode.</td></tr>
<tr><td><code>@Entity</code>, <code>@Id</code>, <code>@GeneratedValue</code>, <code>@OneToMany</code>, <code>@ManyToMany</code></td><td>JPA-mapping av klasser til tabeller.</td></tr>
</table></div>

<h3>@Controller (SSR, Thymeleaf) – eksempel</h3>
~~~java
@Controller
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping("/books")
    public String listBooks(Model model) {
        model.addAttribute("books", bookService.findAll());
        return "books";               // -> templates/books.html
    }

    @PostMapping("/books")
    public String addBook(@ModelAttribute Book book) {
        bookService.save(book);
        return "redirect:/books";     // Post/Redirect/Get
    }
}
~~~

<div class="callout warn"><span class="callout-title">Vanlig feil</span>Å blande <code>@PathVariable</code> og <code>@RequestParam</code>. Identifikator i stien → PathVariable. Filter/valgfritt etter <code>?</code> → RequestParam.</div>
`
});

DAT.theory.push({
  id: "rest-rmm",
  area: "wf",
  title: "REST, Richardson Maturity Model og endepunktdesign",
  summary: "RMM nivå 0–3, HTTP-verb, statuskoder og hvordan du fyller ut endepunkt-tabellen på eksamen.",
  html: `
<h2>REST-prinsipper (kort)</h2>
<ul>
<li><b>Ressurser</b> identifiseres med URI-er (substantiv, flertall): <code>/students/{sid}/courses</code>.</li>
<li><b>Uniformt grensesnitt</b>: standard HTTP-metoder har fast betydning.</li>
<li><b>Stateless</b>: hver forespørsel inneholder alt som trengs (f.eks. JWT i <code>Authorization</code>-header).</li>
<li><b>Representasjoner</b>: JSON/XML av ressursen. Client–server, cacheable, layered system.</li>
</ul>

<h2>Richardson Maturity Model (v26 Q1a)</h2>
<div class="table-wrap"><table>
<tr><th>Nivå</th><th>Navn</th><th>Kjennetegn</th><th>Eksempel</th></tr>
<tr><td>0</td><td>The Swamp of POX</td><td>Ett endepunkt, én metode (ofte POST). HTTP brukes bare som transport (RPC, SOAP).</td><td><code>POST /api</code> med <code>{"action":"getStudent","id":1}</code></td></tr>
<tr><td>1</td><td>Resources</td><td>Flere URI-er, én per ressurs, men fortsatt typisk bare én HTTP-metode.</td><td><code>POST /students/1</code> for alt</td></tr>
<tr><td>2</td><td>HTTP Verbs</td><td>Riktige HTTP-metoder (GET/POST/PUT/DELETE) <b>og</b> riktige statuskoder (200, 201, 204, 404…).</td><td><code>GET /students/1</code> → 200, <code>POST /students</code> → 201</td></tr>
<tr><td>3</td><td>Hypermedia Controls (HATEOAS)</td><td>Responsen inneholder <b>lenker</b> til relaterte ressurser/mulige neste handlinger. Klienten kan «navigere» API-et.</td><td><code>"_links": {"self":…, "courses":…}</code></td></tr>
</table></div>
<div class="exam-answer">
<p>The Richardson Maturity Model grades how RESTful an API is. <b>Level 0</b> uses HTTP only as a transport tunnel: a single endpoint and usually one method (POST) for all operations, like RPC/SOAP. <b>Level 1</b> introduces resources: each resource has its own URI, but the HTTP methods are not used meaningfully. <b>Level 2</b> uses HTTP verbs correctly (GET to read, POST to create, PUT to update, DELETE to remove) together with proper status codes (200, 201, 204, 404). <b>Level 3</b> adds hypermedia controls (HATEOAS): responses contain links to related resources and possible next actions, so clients can discover the API dynamically and are less coupled to hard-coded URIs.</p>
</div>

<h2>HTTP-metoder</h2>
<div class="table-wrap"><table>
<tr><th>Metode</th><th>Brukes til</th><th>Safe?</th><th>Idempotent?</th><th>Typisk status</th></tr>
<tr><td>GET</td><td>Lese</td><td>Ja</td><td>Ja</td><td>200 OK, 204 No Content (tom liste), 404</td></tr>
<tr><td>POST</td><td>Opprette (i en samling)</td><td>Nei</td><td><b>Nei</b></td><td>201 Created</td></tr>
<tr><td>PUT</td><td>Erstatte/oppdatere hele ressursen</td><td>Nei</td><td>Ja</td><td>200 OK (eller 204)</td></tr>
<tr><td>PATCH</td><td>Delvis oppdatering</td><td>Nei</td><td>Ikke nødvendigvis</td><td>200 OK</td></tr>
<tr><td>DELETE</td><td>Slette</td><td>Nei</td><td>Ja</td><td>200 OK / 204 No Content</td></tr>
</table></div>
<p><b>Safe</b> = endrer ikke tilstand. <b>Idempotent</b> = samme forespørsel flere ganger gir samme tilstand som én gang.</p>

<h2>Statuskoder du bør bruke</h2>
<ul>
<li><b>200 OK</b> – vellykket GET/PUT/DELETE med body.</li>
<li><b>201 Created</b> – POST som opprettet noe (helst med <code>Location</code>-header).</li>
<li><b>204 No Content</b> – vellykket, men ingen body (f.eks. tom liste i kursets løsninger, eller etter DELETE).</li>
<li><b>304 Not Modified</b> – brukt i kursets løsningsforslag når sletting/oppdatering «ikke skjedde».</li>
<li><b>400 Bad Request</b> – ugyldig input. <b>401 Unauthorized</b> – ikke autentisert. <b>403 Forbidden</b> – autentisert, men mangler rettighet. <b>404 Not Found</b> – finnes ikke. <b>409 Conflict</b> – f.eks. ikke nok på lager.</li>
</ul>

<h2>Slik fyller du ut endepunkt-tabellen</h2>
<ol>
<li>Finn <b>ressursene</b> (substantiv i modellen): students, courses, customers, orders, products.</li>
<li>Lag samling + element: <code>/students</code> og <code>/students/{sid}</code>.</li>
<li>Relasjoner «eid» av en ressurs blir <b>sub-ressurser</b>: <code>/students/{sid}/courses/{cid}</code> (maks 4 nivåer).</li>
<li>Velg verb: create=POST på samlingen, read=GET, update=PUT på elementet, delete=DELETE på elementet.</li>
<li>Gi hver rad et <b>metodenavn</b> (camelCase, beskrivende).</li>
<li>Aldri verb i URI-en (<code>/getStudent</code>, <code>/deleteCourse</code> er <b>feil</b> på nivå 2).</li>
</ol>

<h3>Mønstersvar: Student–Course (v26)</h3>
<div class="table-wrap"><table>
<tr><th>Service</th><th>API Method</th><th>Endpoint (URI)</th><th>HTTP</th></tr>
<tr><td>Register/create profile</td><td>createStudent</td><td>/students</td><td>POST</td></tr>
<tr><td>View own profile</td><td>getStudentProfile</td><td>/students/{sid}</td><td>GET</td></tr>
<tr><td>Update profile</td><td>updateStudent</td><td>/students/{sid}</td><td>PUT</td></tr>
<tr><td>Register for a new course</td><td>registerCourse</td><td>/students/{sid}/courses</td><td>POST</td></tr>
<tr><td>Withdraw from a course</td><td>withdrawCourse</td><td>/students/{sid}/courses/{cid}</td><td>DELETE</td></tr>
<tr><td>List all registered courses</td><td>getCourses</td><td>/students/{sid}/courses</td><td>GET</td></tr>
<tr><td>View a registered course</td><td>getCourse</td><td>/students/{sid}/courses/{cid}</td><td>GET</td></tr>
</table></div>

<h3>Mønstersvar: E-shop (h25)</h3>
<div class="table-wrap"><table>
<tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>Create profile</td><td>createCustomer</td><td>/customers</td><td>POST</td></tr>
<tr><td>View own profile</td><td>getCustomer</td><td>/customers/{cid}</td><td>GET</td></tr>
<tr><td>Update profile</td><td>updateCustomer</td><td>/customers/{cid}</td><td>PUT</td></tr>
<tr><td>Make an order</td><td>createOrder</td><td>/customers/{cid}/orders</td><td>POST</td></tr>
<tr><td>Update an order</td><td>updateOrder</td><td>/customers/{cid}/orders/{oid}</td><td>PUT</td></tr>
<tr><td>List all orders</td><td>getOrders</td><td>/customers/{cid}/orders</td><td>GET</td></tr>
<tr><td>View an order</td><td>getOrder</td><td>/customers/{cid}/orders/{oid}</td><td>GET</td></tr>
<tr><td>(Delete order)</td><td>deleteOrder</td><td>/customers/{cid}/orders/{oid}</td><td>DELETE</td></tr>
<tr><td>Staff: list customers</td><td>getCustomers</td><td>/customers</td><td>GET</td></tr>
<tr><td>Staff: create product</td><td>createProduct</td><td>/products</td><td>POST</td></tr>
<tr><td>Staff: update product</td><td>updateProduct</td><td>/products/{pid}</td><td>PUT</td></tr>
<tr><td>Staff: delete product</td><td>deleteProduct</td><td>/products/{pid}</td><td>DELETE</td></tr>
<tr><td>Staff: list products</td><td>getProducts</td><td>/products</td><td>GET</td></tr>
<tr><td>Staff: view product</td><td>getProduct</td><td>/products/{pid}</td><td>GET</td></tr>
</table></div>
`
});

DAT.theory.push({
  id: "controllers",
  area: "wf",
  title: "Skrive Controller- og Service-klasser (kodeoppgaven)",
  summary: "Den største kodeoppgaven på eksamen. Mønstre for ResponseEntity, statuskoder, unntak og service-metoder.",
  html: `
<p class="lead">Q1c gir deg en Service-klasse med metodesignaturer, og du skal skrive controlleren. Sensor trekker <b>lite</b> for syntaksfeil, men <b>mye</b> for feil verb, feil URI, manglende statuskode eller manglende annotasjoner.</p>

<h2>Oppskrift for hver metode</h2>
<ol class="flow">
<li>Mapping-annotasjon med URI fra tabellen din: <code>@GetMapping("/students/{sid}")</code>.</li>
<li>(Når sikkerhet spørres) <code>@PreAuthorize(...)</code>.</li>
<li>Returtype <code>ResponseEntity&lt;Object&gt;</code> (eller konkret type).</li>
<li>Parametre: <code>@PathVariable</code> for id-er i stien, <code>@RequestBody</code> for JSON-objektet.</li>
<li><code>throws XNotFoundException</code> hvis servicen kan kaste.</li>
<li>Kall riktig service-metode.</li>
<li>Returner <code>new ResponseEntity&lt;&gt;(body, HttpStatus.XXX)</code> med <b>riktig status</b>.</li>
</ol>

<h2>Fullt mønstersvar – StudentController (v26 c + d)</h2>
~~~java
@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Create profile  -> 201 Created
    @PostMapping("/students")
    public ResponseEntity<Object> createStudent(@RequestBody Student student) {
        Student nstudent = studentService.saveStudent(student);
        return new ResponseEntity<>(nstudent, HttpStatus.CREATED);
    }

    // View own profile -> 200 OK (404 via exception)
    @GetMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
    public ResponseEntity<Object> getStudentProfile(@PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        Student student = studentService.findById(sid);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    // Update profile -> 200 OK
    @PutMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
    public ResponseEntity<Object> updateStudent(@RequestBody Student student,
                                                @PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        Student ustudent = studentService.updateStudent(student, sid);
        return new ResponseEntity<>(ustudent, HttpStatus.OK);
    }

    // Register for a course -> 201 Created
    @PostMapping("/students/{sid}/courses")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
    public ResponseEntity<Object> registerCourse(@PathVariable("sid") Long sid,
                                                 @RequestBody Course course)
            throws StudentNotFoundException {
        Set<Course> courses = studentService.saveCourse(sid, course);
        return new ResponseEntity<>(courses, HttpStatus.CREATED);
    }

    // List courses -> 200 OK, or 204 if empty
    @GetMapping("/students/{sid}/courses")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
    public ResponseEntity<Object> getCourses(@PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        Set<Course> courses = studentService.findCourses(sid);
        if (courses.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    // View one course -> 200 OK
    @GetMapping("/students/{sid}/courses/{cid}")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
    public ResponseEntity<Object> getCourse(@PathVariable("sid") Long sid,
                                            @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        Course course = studentService.findCourse(sid, cid);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    // Withdraw -> 200 OK with remaining courses (or 204)
    @DeleteMapping("/students/{sid}/courses/{cid}")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #sid == authentication.details.sid)")
    public ResponseEntity<Object> withdrawCourse(@PathVariable("sid") Long sid,
                                                 @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        Set<Course> courses = studentService.deleteCourse(sid, cid);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
}
~~~

<div class="callout"><span class="callout-title">Hvorfor <code>#sid == authentication.details.sid</code>?</span>
<code>#sid</code> refererer til metodeparameteren som heter <code>sid</code>. <code>authentication.details.sid</code> er id-en til den innloggede brukeren (fra JWT). Uttrykket sikrer at en student bare kommer til <b>sine egne</b> data (hindrer <b>IDOR / Broken Object Level Authorization</b>), mens <code>ADMIN</code> (staff) får tilgang til alle.</div>

<h2>Unntak → statuskode</h2>
<p>Når servicen kaster <code>StudentNotFoundException</code>, kan en <code>@ControllerAdvice</code> gjøre det om til 404:</p>
~~~java
@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler({StudentNotFoundException.class, CourseNotFoundException.class})
    public ResponseEntity<Object> handleNotFound(Exception ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}
~~~
<p>Alternativ direkte i metoden (også godtatt):</p>
~~~java
try {
    Student s = studentService.findById(sid);
    return new ResponseEntity<>(s, HttpStatus.OK);
} catch (StudentNotFoundException e) {
    return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
}
~~~

<h2>Order med forretningsregler (h25 C.I)</h2>
<p>«Must be possible only if product is in stock, set price based on quantity, reduce stock». Logikken hører hjemme i service-laget, men på eksamen kan du vise den i controlleren hvis servicen ikke har en metode for det:</p>
~~~java
@PostMapping("/customers/{cid}/orders")
@PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #cid == authentication.details.cid)")
public ResponseEntity<Object> createOrder(@PathVariable("cid") Long cid,
                                          @RequestBody Order order)
        throws CustomerNotFoundException, ProductNotFoundException {

    Product product = productService.findProductById(order.getPid());

    // 1. only if product is in stock
    if (product.getQuantity() < order.getQuantity())
        return new ResponseEntity<>("Not enough in stock", HttpStatus.BAD_REQUEST);

    // 2. set order price based on quantity
    order.setTotal_price(product.getPrice() * order.getQuantity());

    // 3. reduce product quantity globally
    product.setQuantity(product.getQuantity() - order.getQuantity());
    productService.updateProduct(product, product.getPid());

    Set<Order> orders = customerService.saveOrder(cid, order);
    return new ResponseEntity<>(orders, HttpStatus.CREATED);
}
~~~

<h2>Service-klasse (h23 b II)</h2>
~~~java
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public Customer findById(Long id) throws CustomerNotFoundException {
        return customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));
    }

    public Customer updateCustomer(Customer customer, Long id) throws CustomerNotFoundException {
        findById(id);                 // throws if not existing
        customer.setId(id);
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) throws CustomerNotFoundException {
        Customer customer = findById(id);
        customerRepository.delete(customer);
    }

    public Set<Booking> findBookings(Long id) throws CustomerNotFoundException {
        return findById(id).getBookings();
    }

    public Set<Booking> addBooking(Long id, Booking booking) throws CustomerNotFoundException {
        Customer customer = findById(id);
        customer.addBooking(booking);
        return customerRepository.save(customer).getBookings();
    }

    public Booking findBooking(Long id, Long bid)
            throws CustomerNotFoundException, BookingNotFoundException {
        return findById(id).getBookings().stream()
            .filter(b -> b.getId().equals(bid))
            .findFirst()
            .orElseThrow(() -> new BookingNotFoundException("Booking " + bid + " not found"));
    }

    public Set<Booking> cancelBooking(Long id, Long bid)
            throws CustomerNotFoundException, BookingNotFoundException {
        Customer customer = findById(id);
        Booking booking = findBooking(id, bid);
        customer.removeBooking(booking);
        return customerRepository.save(customer).getBookings();
    }
}
~~~

<div class="callout good"><span class="callout-title">A-tips</span>
<ul><li>Skriv en kort kommentar over hver metode med statuskoden og hvorfor.</li>
<li>Bruk <code>201 CREATED</code> på POST – dette er det sensor oftest ser etter.</li>
<li>Bruk <code>204 NO_CONTENT</code> når en liste er tom (slik kursets løsninger gjør).</li>
<li>Husk <code>@Autowired private XService xService;</code> – ellers har du ingen service å kalle.</li></ul></div>
`
});

DAT.theory.push({
  id: "hateoas-jpa",
  area: "wf",
  title: "HATEOAS (RMM nivå 3) og JPA",
  summary: "Lenker i responsen, linkTo(methodOn(...)), fordeler/ulemper. JPA-entiteter og relasjoner.",
  html: `
<h2>HATEOAS – Hypermedia As The Engine Of Application State</h2>
<p>På nivå 3 inneholder hver respons <b>lenker</b> til relaterte ressurser og lovlige neste handlinger. Klienten trenger bare inngangs-URI-en og følger lenkene videre – på samme måte som et menneske navigerer en nettside.</p>
~~~json
{
  "id": 7,
  "title": "Advanced Web Applications",
  "_links": {
    "self":     { "href": "/studapp/api/v1/students/1/courses/7" },
    "courses":  { "href": "/studapp/api/v1/students/1/courses" },
    "withdraw": { "href": "/studapp/api/v1/students/1/courses/7" }
  }
}
~~~
<h3>I Spring HATEOAS (som i obligen)</h3>
~~~java
// Model extends RepresentationModel<Order>
for (Order o : user.getOrders()) {
    o.add(linkTo(methodOn(UserController.class).getUserOrder(id, o.getId())).withSelfRel());
    o.add(linkTo(methodOn(UserController.class).getUserOrders(id)).withRel("all-orders"));
    o.add(linkTo(methodOn(UserController.class).deleteUserOrder(id, o.getId())).withRel("delete"));
}
~~~
<h3>Fordeler og ulemper (diskusjon)</h3>
<ul>
<li>✅ <b>Løs kobling</b>: server kan endre URI-struktur uten å knekke klienter.</li>
<li>✅ <b>Selvbeskrivende/oppdagbart</b> API – klienten ser hvilke handlinger som er lov i nåværende tilstand (f.eks. «cancel» bare når ordren ikke er sendt).</li>
<li>✅ Færre hardkodede URI-er i klientkoden.</li>
<li>❌ Større responser, mer kompleksitet på server, få klienter utnytter det fullt ut.</li>
</ul>

<h2>JPA (persistence layer)</h2>
~~~java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToMany
    @JoinTable(name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();
}

public interface StudentRepository extends CrudRepository<Student, Long> {
    List<Student> findByName(String name);   // derived query
}
~~~
<ul>
<li><code>@OneToMany</code>/<code>@ManyToOne</code>: customer → orders. <code>@ManyToMany</code>: student ↔ course (koblingstabell).</li>
<li><code>CrudRepository</code> gir <code>save</code>, <code>findById</code> (Optional), <code>findAll</code>, <code>deleteById</code>, <code>delete</code> gratis.</li>
<li>Spring Data genererer SQL fra metodenavn (derived queries) – og bruker <b>parametriserte spørringer</b>, som beskytter mot SQL injection.</li>
</ul>
`
});

DAT.theory.push({
  id: "spring-security",
  area: "wf",
  title: "Autentisering og autorisasjon i Spring (web vs. REST)",
  summary: "Session-basert vs. token-basert, SecurityFilterChain, @PreAuthorize-uttrykk, hasAuthority vs hasRole.",
  html: `
<h2>Begreper</h2>
<ul>
<li><b>Autentisering</b> – <i>hvem er du?</i> (passord, OIDC-innlogging, token).</li>
<li><b>Autorisasjon</b> – <i>hva har du lov til?</i> (roller/authorities, eierskap).</li>
</ul>

<h2>To tilnærminger (pensumpunkt)</h2>
<div class="split">
<div class="card"><h3>Web-applikasjon (SSR)</h3>
<ul><li><b>Stateful</b>: etter innlogging lagres autentiseringen i en <b>HTTP-session</b> på serveren; nettleseren har en session-cookie (JSESSIONID).</li>
<li>Form login eller <code>oauth2Login()</code> (OIDC – innlogging via Keycloak/Google, SSO).</li>
<li>Trenger CSRF-beskyttelse (cookies sendes automatisk).</li></ul></div>
<div class="card"><h3>REST-tjeneste</h3>
<ul><li><b>Stateless</b>: ingen session. Hver forespørsel har <code>Authorization: Bearer &lt;JWT access token&gt;</code>.</li>
<li>Tjenesten er en <b>OAuth2 Resource Server</b>: verifiserer JWT-signatur (public key fra IdP), utløp, issuer, audience, og leser roller fra claims.</li>
<li>CSRF kan ofte skrus av fordi token ikke sendes automatisk av nettleseren.</li></ul></div>
</div>

<h2>Konfigurasjon (oversikt)</h2>
~~~java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity          // enables @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .csrf(csrf -> csrf.disable())                        // stateless REST API
          .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .authorizeHttpRequests(auth -> auth
              .requestMatchers("/studapp/api/v1/public/**").permitAll()
              .anyRequest().authenticated())
          .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
~~~

<h2>@PreAuthorize-uttrykk (SpEL)</h2>
<div class="table-wrap"><table>
<tr><th>Uttrykk</th><th>Betyr</th></tr>
<tr><td><code>hasAuthority('ADMIN')</code></td><td>Brukeren har authority nøyaktig «ADMIN».</td></tr>
<tr><td><code>hasRole('ADMIN')</code></td><td>Sjekker «ROLE_ADMIN» (Spring legger til prefikset <code>ROLE_</code>).</td></tr>
<tr><td><code>hasAnyAuthority('ADMIN','USER')</code></td><td>En av dem.</td></tr>
<tr><td><code>isAuthenticated()</code></td><td>Hvem som helst innlogget.</td></tr>
<tr><td><code>#sid == authentication.details.sid</code></td><td>Metodeparameteren <code>sid</code> er lik innlogget brukers id → «bare egne data».</td></tr>
</table></div>
<p>Kombiner med <code>and</code>/<code>or</code>:</p>
~~~java
@PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #cid == authentication.details.cid)")
~~~
<p><b>Hvilken regel hvor?</b></p>
<ul>
<li>Staff-funksjoner (opprette/slette produkter, liste alle kunder): <code>hasAuthority('ADMIN')</code>.</li>
<li>Kundens egne ressurser (profil, ordre): <code>hasAuthority('ADMIN') or #cid == authentication.details.cid</code>.</li>
<li>Offentlig lesing (liste produkter): <code>hasAnyAuthority('ADMIN','USER')</code>.</li>
<li>Registrering (POST /customers): ofte åpen (<code>permitAll</code>) – ellers kan ingen registrere seg.</li>
</ul>

<div class="callout bad"><span class="callout-title">Hva skjer hvis du bare sjekker rolle (ikke eierskap)?</span>En innlogget kunde med rollen USER kan endre id-en i URL-en (<code>/customers/2/orders</code>) og lese/slette andres ordre. Dette er <b>Broken Access Control / IDOR</b> – nr. 1 på OWASP Top 10.</div>
`
});

DAT.theory.push({
  id: "oauth2",
  area: "wf",
  title: "OAuth2, OpenID Connect og SSO – grant types",
  summary: "Rollene, authorization code (+PKCE), implicit, password, client credentials, refresh token. Forskjellen code vs implicit.",
  html: `
<h2>Rollene i OAuth2</h2>
<ul>
<li><b>Resource Owner</b> – brukeren som eier dataene.</li>
<li><b>Client</b> – applikasjonen som vil ha tilgang (web-app, SPA, mobilapp).</li>
<li><b>Authorization Server (AS) / IdP</b> – autentiserer brukeren og utsteder tokens (Keycloak, Google, Entra ID).</li>
<li><b>Resource Server (RS)</b> – API-et som beskytter ressursene og validerer access token.</li>
</ul>
<p><b>OAuth2</b> handler om <i>autorisasjon</i> (delegert tilgang, access token). <b>OpenID Connect (OIDC)</b> er et lag oppå som legger til <i>autentisering</i> via et <b>ID token</b> (JWT med info om brukeren). <b>SSO</b>: én innlogging hos IdP gir tilgang til mange Service Providers – IdP har en session, så brukeren slipper å logge inn på nytt.</p>

<h2>Authorization Code Grant (anbefalt)</h2>
<ol class="flow">
<li>Brukeren klikker «Logg inn». Klienten <b>redirecter</b> nettleseren til AS sitt <code>/authorize</code>-endepunkt med <code>response_type=code</code>, <code>client_id</code>, <code>redirect_uri</code>, <code>scope</code>, <code>state</code> (mot CSRF) og evt. <code>code_challenge</code> (PKCE).</li>
<li>AS autentiserer resource owner (innloggingsside) og ber om <b>samtykke</b> (consent).</li>
<li>AS redirecter tilbake til <code>redirect_uri</code> med en kortlevd <b>authorization code</b> (i URL-en).</li>
<li>Klienten sender koden <b>back-channel</b> (server-til-server) til AS sitt <code>/token</code>-endepunkt sammen med <code>client_secret</code> (eller <code>code_verifier</code> for PKCE).</li>
<li>AS validerer og returnerer <b>access token</b> (+ refresh token, + ID token ved OIDC).</li>
<li>Klienten kaller Resource Server med <code>Authorization: Bearer &lt;access token&gt;</code>. RS validerer token og svarer.</li>
</ol>

<h2>Implicit Grant (utdatert)</h2>
<ol class="flow">
<li>Klienten (typisk SPA) redirecter til <code>/authorize</code> med <code>response_type=token</code>.</li>
<li>Brukeren logger inn og gir samtykke.</li>
<li>AS returnerer <b>access token direkte</b> i URL-fragmentet (<code>#access_token=…</code>) – ingen kode, intet token-endepunkt, ingen klientautentisering.</li>
</ol>

<div class="exam-answer">
<p>In the <b>authorization code flow</b> the authorization server first returns a short-lived <b>authorization code</b> to the client via the browser redirect. The client then exchanges this code for tokens through a direct <b>back-channel</b> request to the token endpoint, where the client authenticates itself (client secret or PKCE code verifier). The access token is therefore never exposed in the browser URL/history, and refresh tokens can be issued safely.</p>
<p>In the <b>implicit flow</b> the access token is returned <b>directly in the redirect URL fragment</b> (front channel). There is no code exchange and no client authentication. The token is exposed to the browser (history, referer, logs, malicious scripts) and can be intercepted or injected; refresh tokens are not issued. Because of these weaknesses the implicit flow is deprecated (OAuth 2.1) and SPAs should use authorization code with PKCE instead.</p>
</div>

<h2>Resource Owner Password Credentials (h23)</h2>
<ol class="flow">
<li>Brukeren gir <b>brukernavn og passord direkte til klienten</b>.</li>
<li>Klienten sender dem (+ client_id/secret) til AS sitt <code>/token</code>-endepunkt med <code>grant_type=password</code>.</li>
<li>AS validerer og returnerer access token (+ refresh token).</li>
<li>Klienten bruker access token mot RS.</li>
</ol>
<p><b>Ulempe:</b> klienten ser passordet → bare for høyt betrodde (first-party) klienter; frarådes/fjernet i OAuth 2.1. Støtter ikke MFA/SSO godt.</p>

<h2>Client Credentials</h2>
<p>Maskin-til-maskin, ingen bruker. Klienten autentiserer seg med <code>client_id</code> + <code>client_secret</code> mot <code>/token</code> og får et access token for sine egne tjenester (f.eks. en batchjobb som kaller et API).</p>

<h2>Refresh token</h2>
<p>Access tokens er kortlevde (minutter). Når de utløper bruker klienten <code>grant_type=refresh_token</code> for å få nytt access token uten ny innlogging. <b>Sikkerhet</b>: refresh token må være <b>knyttet til klienten (client_id) og brukeren/access tokenet</b> – ellers kan en angriper bruke sitt eget refresh token for å få access token for en annen klient (h21 Q5e). Refresh tokens bør roteres og kunne tilbakekalles.</p>

<h2>Hvilken grant når?</h2>
<div class="table-wrap"><table>
<tr><th>Situasjon</th><th>Grant</th></tr>
<tr><td>Server-side web-app (Spring MVC)</td><td>Authorization code</td></tr>
<tr><td>SPA / mobilapp (public client)</td><td>Authorization code + PKCE</td></tr>
<tr><td>Tjeneste-til-tjeneste</td><td>Client credentials</td></tr>
<tr><td>Legacy, høyt betrodd egen klient</td><td>Password (frarådet)</td></tr>
<tr><td>Gammel SPA</td><td>Implicit (utdatert)</td></tr>
</table></div>
`
});

DAT.theory.push({
  id: "cicd",
  area: "wf",
  title: "CI/CD og pipeline-YAML",
  summary: "Hva er CI, hva er CD (delivery vs deployment), stegene, og hvordan forklare en GitHub Actions-fil linje for linje.",
  html: `
<p class="lead">Står i pensumlista («be able to explain key steps in a CI/CD yaml file») men har ikke kommet på de siste eksamenene – derfor en god kandidat for neste gang.</p>

<h2>Continuous Integration (CI)</h2>
<p>Utviklere integrerer (merger) kode til felles hovedgren <b>ofte</b>, og <b>hver</b> push/pull request trigger automatisk bygg og test. Målet er å finne feil tidlig, mens endringen er liten.</p>
<p><b>Typiske steg:</b> checkout av kode → sett opp miljø (JDK) → hent avhengigheter → kompiler/bygg (<code>mvn package</code>) → enhetstester → statisk analyse (SAST, lint, SonarQube, avhengighetssjekk) → integrasjonstester → lag artefakt (JAR / Docker-image) → rapporter status (rødt/grønt).</p>

<h2>Continuous Delivery vs. Continuous Deployment (CD)</h2>
<ul>
<li><b>Continuous Delivery</b>: hver endring som passerer pipelinen er <b>klar</b> til å release – artefaktet deployes automatisk til test/staging, men produksjon krever et <b>manuelt godkjenningssteg</b>.</li>
<li><b>Continuous Deployment</b>: alt som passerer alle tester deployes <b>automatisk helt til produksjon</b>, uten manuelt steg.</li>
</ul>
<p><b>CD-aktiviteter:</b> publisere artefakt/image til registry, deploy til staging, akseptanse-/ende-til-ende-tester, DAST/sikkerhetstester, godkjenning, deploy til produksjon (blue-green/canary), overvåking og rollback.</p>

<h2>Eksempel: GitHub Actions</h2>
~~~yaml
name: CI/CD Pipeline              # navnet som vises i GitHub

on:                               # TRIGGER: når kjøres pipelinen?
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:                          # jobb 1
    runs-on: ubuntu-latest        # runner (virtuell maskin)
    steps:
      - uses: actions/checkout@v4             # hent koden
      - name: Set up JDK 21
        uses: actions/setup-java@v4           # ferdig action
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Build and test
        run: mvn -B clean verify              # kompiler + kjør tester
      - name: Build Docker image
        run: docker build -t myapp:\${{ github.sha }} .

  deploy:                         # jobb 2
    needs: build                  # kjører kun hvis build lykkes
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Push image and deploy
        env:
          TOKEN: \${{ secrets.DEPLOY_TOKEN }}  # hemmelighet, aldri i koden
        run: ./deploy.sh
~~~
<div class="table-wrap"><table>
<tr><th>Nøkkel</th><th>Forklaring</th></tr>
<tr><td><code>on</code></td><td>Hendelser som trigger workflowen (push, pull_request, schedule, manuelt).</td></tr>
<tr><td><code>jobs</code></td><td>Én eller flere jobber; kjører parallelt med mindre <code>needs</code> gir rekkefølge.</td></tr>
<tr><td><code>runs-on</code></td><td>Hvilken runner/OS jobben kjører på.</td></tr>
<tr><td><code>steps</code></td><td>Sekvens av steg i en jobb.</td></tr>
<tr><td><code>uses</code></td><td>Gjenbruker en ferdig action (f.eks. checkout).</td></tr>
<tr><td><code>run</code></td><td>Kjører shell-kommando.</td></tr>
<tr><td><code>with</code></td><td>Parametre til en action.</td></tr>
<tr><td><code>needs</code></td><td>Avhengighet mellom jobber (deploy etter build).</td></tr>
<tr><td><code>secrets</code></td><td>Kryptert lagrede hemmeligheter (tokens, passord).</td></tr>
</table></div>
<div class="callout"><span class="callout-title">Fordeler å nevne</span>Raskere feedback, færre integrasjonsproblemer («merge hell»), repeterbare bygg, mindre manuelt arbeid, hyppigere og tryggere releaser, sikkerhetstesting automatisk (DevSecOps).</div>
`
});

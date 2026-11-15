/* Teori: Globalization (10 %) og Universal Design (5 %) */
window.DAT = window.DAT || {};
DAT.theory = DAT.theory || [];

DAT.theory.push({
  id: "gilt",
  area: "g11n",
  title: "GILT: globalization, internationalization, localization",
  summary: "Definisjonene, relasjonen mellom dem, locale, hva som må internasjonaliseres og resource bundles.",
  html: `
<h2>GILT = Globalization, Internationalization, Localization, Translation</h2>
<div class="exam-answer">
<p><b>Globalization (g11n)</b> is the overall process of making an application available to users worldwide, in different languages, regions and cultures. It <b>includes</b> internationalization and localization (g11n = i18n + l10n).</p>
<p><b>Internationalization (i18n)</b> is the technical preparation: designing and engineering the application so it can support multiple languages and regions <b>without changes to the design or source code</b> when a new language is added. All locale-dependent elements (texts, dates, numbers, currency) are externalised, e.g. into resource bundles, and UTF-8 is used. It is done once.</p>
<p><b>Localization (l10n)</b> is adapting the internationalized application to a <b>specific locale</b> (language + region): translating texts, formatting dates, numbers and currency, and adjusting culturally (images, colors, units, text direction). It is done once per locale.</p>
<p><b>Relationship:</b> internationalization makes localization possible; localization adds each new market cheaply; together they achieve globalization. Translation is one part of localization.</p>
</div>
<p class="small muted">Navnene: i<b>18</b>n = 18 bokstaver mellom i og n. l<b>10</b>n, g<b>11</b>n.</p>

<h2>Locale</h2>
<p>En <b>locale</b> = språk + (evt.) region: <code>en_US</code>, <code>en_GB</code>, <code>nb_NO</code>, <code>no_NO</code>. Den bestemmer språk, dato/tid-format (<code>12/15/2025</code> vs <code>15.12.2025</code>), tallformat (<code>1,234.5</code> vs <code>1 234,5</code>), valuta, sortering, flertallsregler og skriveretning (RTL for arabisk/hebraisk).</p>

<h2>Hva må internasjonaliseres?</h2>
<ul>
<li>All statisk tekst (overskrifter, labels, knapper, lenker, feilmeldinger, <code>&lt;title&gt;</code>, alt-tekster).</li>
<li><b>Dynamiske verdier</b> som parametere: datoer, tall, prosent, valuta – aldri hardkodet i teksten!</li>
<li>Bilder med tekst, farger/symboler med kulturell betydning, måleenheter.</li>
<li>Tegnsett: UTF-8 overalt.</li>
<li>Layout som tåler lengre tekster (tysk er ~30 % lengre) og RTL.</li>
</ul>

<h2>Resource bundles (.properties)</h2>
<p>Én fil per språk, samme <b>nøkler</b>, ulike verdier. Fallback: <code>messages_nb_NO</code> → <code>messages_nb</code> → <code>messages</code> (default).</p>
~~~properties
# messages.properties  (default / English)
course.title=DAT152 Advanced Web Applications
course.date=Date: {0}
course.students=This course has between {0} and {1} registered students

# messages_no.properties
course.title=DAT152 Avanserte webapplikasjoner
course.date=Dato: {0}
course.students=Dette emnet har mellom {0} og {1} registrerte studenter
~~~
<p><code>{0}</code>, <code>{1}</code> er <b>parametere</b> (Java <code>MessageFormat</code>). Rekkefølgen kan være forskjellig i ulike språk – derfor parametere i stedet for å lime sammen strenger. Sensor h21: «Points must be deducted if parameters are not used.»</p>
`
});

DAT.theory.push({
  id: "spring-i18n",
  area: "g11n",
  title: "i18n i Spring MVC (stegene, LocaleResolver, Thymeleaf)",
  summary: "Hvordan internasjonalisere en Spring-app steg for steg. SessionLocaleResolver vs CookieLocaleResolver. Rollen til controlleren.",
  html: `
<h2>Stegene (pensumpunkt: «Be able to internationalize a given web app with Spring»)</h2>
<ol class="flow">
<li><b>Lag resource bundles</b> i <code>src/main/resources</code>: <code>messages.properties</code>, <code>messages_en.properties</code>, <code>messages_no.properties</code>. Flytt alle tekster dit som nøkler.</li>
<li><b>Konfigurer MessageSource</b> (Spring Boot gjør det automatisk): <code>spring.messages.basename=messages</code> og <code>spring.messages.encoding=UTF-8</code>.</li>
<li><b>Definer en LocaleResolver-bean</b> – bestemmer hvor valgt locale lagres (session, cookie, Accept-Language-header).</li>
<li><b>Registrer en LocaleChangeInterceptor</b> – fanger opp en request-parameter (f.eks. <code>?lang=no</code>) og bytter locale.</li>
<li><b>Bruk nøklene i view</b>: Thymeleaf <code>th:text="#{key}"</code>, med parametere <code>#{key(\${a}, \${b})}</code>; datoer/tall med <code>#temporals.format</code>/<code>#numbers</code>.</li>
<li><b>Lag språkvelger</b>: lenker <code>?lang=en</code> | <code>?lang=no</code>.</li>
</ol>

~~~java
@Configuration
public class I18nConfig implements WebMvcConfigurer {

    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver slr = new SessionLocaleResolver();
        slr.setDefaultLocale(Locale.ENGLISH);
        return slr;
        // or: CookieLocaleResolver clr = new CookieLocaleResolver("lang");
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
        lci.setParamName("lang");          // ?lang=no
        return lci;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }
}
~~~
~~~html
<!-- Thymeleaf view -->
<h1 th:text="#{welcome.title}">Welcome to e-Library</h1>
<a th:href="@{''(lang=en)}">EN</a> | <a th:href="@{''(lang=no)}">NO</a>
<p th:text="#{welcome.hello(\${#authentication.name})}">Hello user!</p>
<button th:text="#{button.logout}">Log out</button>
~~~

<h2>SessionLocaleResolver vs CookieLocaleResolver</h2>
<div class="table-wrap"><table>
<tr><th></th><th>SessionLocaleResolver</th><th>CookieLocaleResolver</th></tr>
<tr><td>Lagres</td><td>Som attributt i <b>HTTP-sessionen på serveren</b></td><td>I en <b>cookie i nettleseren</b></td></tr>
<tr><td>Varighet</td><td>Kun så lenge sessionen lever (forsvinner ved timeout/logout/ny nettleser)</td><td>Overlever sessionen – huskes til neste besøk (til cookien utløper)</td></tr>
<tr><td>Server-minne</td><td>Bruker session-minne; krever stateful server</td><td>Stateless på server; fungerer på tvers av servere</td></tr>
<tr><td>Krever</td><td>Session</td><td>At brukeren tillater cookies</td></tr>
</table></div>
<p>Andre: <b>AcceptHeaderLocaleResolver</b> (bruker nettleserens <code>Accept-Language</code>, kan ikke byttes av brukeren), <b>FixedLocaleResolver</b>.</p>

<h2>Hva er formålet med en «Controller» ved i18n?</h2>
<p>Controlleren tar imot forespørselen (inkludert språkbytte-forespørselen <code>?lang=no</code>, som interceptoren prosesserer før controlleren kjøres), kan få gjeldende <code>Locale</code> injisert som parameter, hente lokaliserte meldinger via <code>MessageSource</code> (f.eks. for feilmeldinger/flash-meldinger) og legge locale-avhengige data i modellen, og returnerer <b>view-et</b> som rendres med riktig resource bundle. Controlleren skal ikke inneholde hardkodet tekst – da trenger den ikke endres når et nytt språk legges til.</p>
~~~java
@Controller
public class HomeController {
    @Autowired
    private MessageSource messageSource;

    @GetMapping("/")
    public String home(Locale locale, Model model) {
        model.addAttribute("info",
            messageSource.getMessage("course.students", new Object[]{50, 100}, locale));
        return "index";
    }
}
~~~

<h2>Mønstersvar h25 (kursside)</h2>
~~~properties
# messages_en.properties
page.title=DAT152 Advanced Web Applications
page.date=Date: {0,date,dd/MM/yyyy}
page.students=This course has between {0,number} and {1,number} registered students
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
page.date=Dato: {0,date,dd.MM.yyyy}
page.students=Dette emnet har mellom {0,number} og {1,number} registrerte studenter
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
<p class="small">Merk: kursnavnet «DAT152» og personnavn oversettes ikke, men tall og dato er <b>parametere</b> slik at de formateres per locale.</p>

<h2>Mønstersvar v26 (e-Library)</h2>
~~~properties
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
<p class="small">Brukernavnet (anonymousUser) er en <b>parameter</b> {0}, ikke en del av oversettelsen.</p>

<div class="callout"><span class="callout-title">Eldre eksamener brukte JSP/JSTL fmt</span>Partb-infoen sier «No jsp» i år. Prinsippet er det samme: <code>&lt;fmt:message key="…"&gt;&lt;fmt:param&gt;…&lt;/fmt:param&gt;&lt;/fmt:message&gt;</code> tilsvarer <code>#{key(…)}</code> i Thymeleaf, og <code>fmt:formatNumber</code>/<code>fmt:formatDate</code> tilsvarer <code>#numbers</code>/<code>#temporals</code>.</div>
`
});

DAT.theory.push({
  id: "ud",
  area: "ud",
  title: "Universell utforming og WCAG",
  summary: "Definisjon, de 7 prinsippene, WCAG, POUR med alle retningslinjer, nivåer, norsk lov og verktøy.",
  html: `
<h2>Universal Design (UD)</h2>
<div class="exam-answer"><p>Universal Design is "the design of products and environments to be usable by all people, to the greatest extent possible, without the need for adaptation or specialized design" (Ron Mace). The aim is one solution that works for everyone – people with and without disabilities, young and old – instead of special solutions for some groups.</p></div>

<h2>De 7 prinsippene</h2>
<div class="table-wrap"><table>
<tr><th>#</th><th>Prinsipp</th><th>Betyr / web-eksempel</th></tr>
<tr><td>1</td><td><b>Equitable use</b> (like muligheter for bruk)</td><td>Samme løsning for alle, ingen stigmatisering. Samme nettside, ikke en egen «tekstversjon».</td></tr>
<tr><td>2</td><td><b>Flexibility in use</b> (fleksibel bruk)</td><td>Tilpasser seg ulike preferanser/evner: mus, tastatur, touch, tale; høyre-/venstrehendte.</td></tr>
<tr><td>3</td><td><b>Simple and intuitive use</b> (enkel og intuitiv)</td><td>Lett å forstå uansett erfaring, språk, konsentrasjon. Konsistent navigasjon.</td></tr>
<tr><td>4</td><td><b>Perceptible information</b> (forståelig informasjon)</td><td>Info formidles effektivt via flere sanser: alt-tekst, teksting, god kontrast.</td></tr>
<tr><td>5</td><td><b>Tolerance for error</b> (toleranse for feil)</td><td>Minimere konsekvenser av feil: bekreftelse før sletting, angre, tydelige feilmeldinger.</td></tr>
<tr><td>6</td><td><b>Low physical effort</b> (lav fysisk anstrengelse)</td><td>Effektiv bruk uten slitasje: store klikkflater, få steg.</td></tr>
<tr><td>7</td><td><b>Size and space for approach and use</b></td><td>Passende størrelse og plass: knapper store nok på mobil, skalerbar tekst.</td></tr>
</table></div>

<h2>WCAG</h2>
<div class="exam-answer"><p>The <b>Web Content Accessibility Guidelines (WCAG)</b> is an international technical standard from the W3C (Web Accessibility Initiative) that defines how to make web content more accessible to people with disabilities (visual, auditory, motor, cognitive). It is organised in <b>4 principles</b> (Perceivable, Operable, Understandable, Robust – POUR), each with <b>guidelines</b>, and each guideline has testable <b>success criteria</b> at three conformance levels: <b>A</b> (minimum), <b>AA</b> and <b>AAA</b> (highest). It is primarily meant for web developers/content authors, authoring tool and evaluation tool developers, and anyone who needs a shared standard for accessibility. Current versions: WCAG 2.1 (2018) and 2.2 (2023).</p></div>
<p><b>Norge:</b> Likestillings- og diskrimineringsloven + forskrift om universell utforming av IKT krever WCAG 2.1 nivå A og AA (unntatt noen kriterier, til sammen ~48 suksesskriterier) for nettsider. Tilsyn: <b>Uutilsynet</b> (Digdir). Offentlige virksomheter må ha tilgjengelighetserklæring.</p>

<h2>POUR – de fire prinsippene og retningslinjene</h2>

<h3>1. Perceivable (mulig å oppfatte) – v24, v26</h3>
<p><i>Informasjon og UI-komponenter må presenteres slik at brukerne kan oppfatte dem.</i> (Ikke usynlig for alle sansene deres.)</p>
<ul>
<li><b>1.1 Text Alternatives</b> – tekstalternativer for alt ikke-tekstlig innhold (alt-tekst på bilder, labels på ikoner) slik at det kan gjøres om til tale, punktskrift, større skrift.</li>
<li><b>1.2 Time-based Media</b> – alternativer for lyd/video: teksting (captions), transkripsjon, synstolking (audio description).</li>
<li><b>1.3 Adaptable</b> – innhold kan presenteres på ulike måter uten å miste struktur/mening: semantisk HTML (h1–h6, lister, tabeller, label for input), meningsfull rekkefølge, ikke bare avhengig av form/plassering.</li>
<li><b>1.4 Distinguishable</b> – lettere å se og høre: kontrast min 4.5:1 (AA), ikke bare farge for å formidle info, tekst kan forstørres 200 %, reflow, kontroll på lyd.</li>
</ul>

<h3>2. Operable (mulig å betjene) – h22, h23, h24, h25</h3>
<p><i>UI-komponenter og navigasjon må være mulig å betjene.</i> Grensesnittet kan ikke kreve handlinger brukeren ikke kan utføre.</p>
<ul>
<li><b>2.1 Keyboard Accessible</b> – all funksjonalitet tilgjengelig med tastatur, ingen tastaturfeller, synlig fokus.</li>
<li><b>2.2 Enough Time</b> – nok tid til å lese og bruke innhold: kunne forlenge/stoppe tidsfrister, pause bevegelig innhold (karuseller).</li>
<li><b>2.3 Seizures and Physical Reactions</b> – ikke innhold som blinker mer enn 3 ganger per sekund (kan utløse anfall).</li>
<li><b>2.4 Navigable</b> – hjelp brukere å navigere, finne innhold og vite hvor de er: «hopp til hovedinnhold», beskrivende sidetitler, logisk fokusrekkefølge, meningsfulle lenketekster (ikke «klikk her»), overskrifter.</li>
<li><b>2.5 Input Modalities</b> – lettere å bruke andre input enn tastatur: store nok klikkflater, alternativ til komplekse gester (sveip, dra), label i navn stemmer med synlig tekst.</li>
</ul>
<p><b>Eksempel på brudd:</b> en meny som bare åpnes ved mus-hover, eller en <code>&lt;div onclick&gt;</code>-knapp som ikke kan nås med Tab → tastaturbrukere og skjermleserbrukere kan ikke bruke den.</p>

<h3>3. Understandable (forståelig) – h21</h3>
<p><i>Informasjon og betjening av grensesnittet må være forståelig.</i></p>
<ul>
<li><b>3.1 Readable</b> – lesbar tekst; angi språk på siden (<code>&lt;html lang="no"&gt;</code>) og deler med annet språk. <b>Kobling til i18n</b>: riktig <code>lang</code> lar skjermlesere uttale riktig – en internasjonalisert app må sette <code>lang</code> per locale.</li>
<li><b>3.2 Predictable</b> – forutsigbar: ingen uventet kontekstendring ved fokus/input, konsistent navigasjon og identifikasjon.</li>
<li><b>3.3 Input Assistance</b> – hjelp brukeren å unngå og rette feil: labels/instruksjoner, tydelige feilmeldinger med forslag, bekreftelse ved juridiske/økonomiske transaksjoner.</li>
</ul>

<h3>4. Robust</h3>
<p><i>Innhold må være robust nok til å tolkes pålitelig av mange brukeragenter, inkludert hjelpemidler (skjermlesere).</i></p>
<ul>
<li><b>4.1 Compatible</b> – gyldig, semantisk markup; navn, rolle og verdi tilgjengelig for alle UI-komponenter (bruk native elementer eller ARIA riktig); statusmeldinger annonseres (<code>aria-live</code>).</li>
</ul>

<h2>Verktøy for evaluering</h2>
<ul>
<li><b>WAVE</b> (WebAIM) – nettleser-utvidelse, markerer feil (manglende alt, kontrast, tomme lenker) direkte på siden.</li>
<li><b>Lighthouse</b> (Chrome DevTools), <b>axe DevTools</b>.</li>
<li>Manuell testing: kun tastatur, skjermleser (NVDA, VoiceOver), zoom 200 %.</li>
<li>Automatiske verktøy finner bare ~30–40 % av problemene → manuell test er nødvendig.</li>
</ul>
`
});

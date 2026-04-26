import type { Module } from '../cehModules';

export const m11: Module = {
  id: 'm11',
  number: 'M11',
  title: 'Session Hijacking',
  description: 'Learn to intercept, predict, and hijack active user sessions at both the network and application layers. Master techniques for stealing JWTs and Session Cookies, bypassing authentication mechanisms, executing Cross-Site Request Forgery (CSRF), and performing active Man-in-the-Browser (MitB) attacks to defeat Multi-Factor Authentication (MFA).',
  examWeight: '4%',
  estimatedQuestions: 5,
  duration: '2h 30m',
  topics: [
    {
      id: 'm11-t01',
      title: 'Session Hijacking Concepts',
      content: 'Session hijacking involves taking over a valid TCP communication session between two computers, or an active application-layer session (like a logged-in web state). Since authentication (passwords/MFA) typically only happens at the beginning of a session, if an attacker successfully hijacks the active session token, they inherit the privileges of the victim without ever needing to know the password.',
      keyPoints: [
        'Spoofing vs Hijacking: Spoofing is pretending to be someone else from the START of a connection. Hijacking takes over an ALREADY ESTABLISHED connection.',
        'Active Hijacking: The attacker silences the victim (often via a targeted DoS or ARP spoofing) and takes their place in the active session.',
        'Passive Hijacking: The attacker only monitors and records the session (basically sniffing), without injecting data.',
        'Network Level: Hijacking raw TCP/UDP sessions by predicting sequence numbers and injecting packets. Highly complex.',
        'Application Level: Hijacking web sessions by stealing HTTP session cookies or JSON Web Tokens (JWTs). Extremely common.',
      ],
    },
    {
      id: 'm11-t02',
      title: 'Network-Level Hijacking',
      content: 'Network-level hijacking targets the TCP/IP suite. TCP uses Sequence (SEQ) and Acknowledgment (ACK) numbers to keep packets in order. If an attacker can predict or sniff these numbers (via MitM), they can inject packets into the stream that the server will accept as legitimate data originating from the victim.',
      commands: [
        { command: 'shijack eth0 192.168.1.100 22 192.168.1.1 22', description: 'Classic tool to hijack a TCP connection by injecting packets with correct sequence numbers' },
        { command: 'netwox 40 --ip4-src 192.168.1.100 --tcp-seq 12345', description: 'Use Netwox to inject spoofed TCP packets into an established stream' },
      ],
      keyPoints: [
        'TCP Sequence Prediction: Guessing the next SEQ number. If successful, the attacker can inject data before the legitimate user does. Modern OSs use randomized initial sequence numbers to prevent blind guessing.',
        'Blind Hijacking: Injecting malicious data into a TCP session without being able to see the responses (because the attacker is not in a MitM position to sniff the ACKs).',
        'RST Hijacking: Injecting an RST (Reset) packet with the correct sequence number to abruptly terminate the victim\'s connection (a form of targeted DoS).',
        'UDP Hijacking: Much easier than TCP because UDP is connectionless and has no sequence numbers to predict, but less reliable for data injection.',
      ],
    },
    {
      id: 'm11-t03',
      title: 'Application-Level Hijacking (Web Tokens)',
      content: 'Web applications use HTTP, a stateless protocol. To maintain state (keep a user logged in), they use Session IDs (usually stored in cookies) or stateless tokens (JWTs). If an attacker steals or guesses this Session ID, they present it to the server and instantly become the logged-in user.',
      keyPoints: [
        'Session Sniffing: Intercepting the Session ID over an unencrypted network (e.g., HTTP over public WiFi). Mitigated entirely by TLS.',
        'Session Fixation: The attacker generates a valid Session ID and provides it to the victim (e.g., via a phishing link). When the victim logs in using that ID, the attacker (who already knows the ID) can now access the account.',
        'Cross-Site Scripting (XSS): Injecting malicious JavaScript into a website. When the victim views the page, the script steals their `document.cookie` and sends it to the attacker.',
        'Session Prediction: Guessing the Session ID if the application uses weak, predictable generation algorithms (e.g., Base64 encoded usernames or sequential numbers like `session_id=455`).',
        'JSON Web Tokens (JWT): Stateless tokens signed by the server. If the secret signing key is weak, attackers can crack it offline and forge their own admin tokens.',
      ],
    },
    {
      id: 'm11-t04',
      title: 'Man-in-the-Browser (MitB) & MFA Bypass',
      content: 'MitB is an advanced form of session hijacking where a Trojan horse infects the victim\'s web browser. It operates completely on the client side, between the browser\'s UI and the underlying network encryption components. This makes it devastating against modern security controls.',
      keyPoints: [
        'Operation: The malware hooks directly into browser APIs (like WinINet, NSS, or Chromium\'s internal functions).',
        'Bypassing SSL/TLS: MitB defeats HTTPS entirely because it intercepts the data BEFORE it gets encrypted by the browser, and AFTER it gets decrypted.',
        'Bypassing MFA: MitB waits for the user to successfully authenticate using their physical MFA token (e.g., YubiKey, SMS). Once the session is established, the malware piggybacks on it in the background to conduct fraudulent transactions.',
        'Common Targets: Financial institutions. Famous banking trojans include Zeus, TrickBot, and Dridex.',
        'Evilginx2 (AitM): Adversary-in-the-Middle frameworks like Evilginx2 proxy the login process, allowing the user to authenticate normally (including MFA), and then steal the resulting authenticated session cookie.',
      ],
    },
  ],
  keyTools: ['Burp Suite', 'OWASP ZAP', 'Ettercap', 'Bettercap', 'BeEF', 'Evilginx2', 'Hunt'],
  countermeasures: [
    'Enforce HTTPS (HSTS) across the entire application to completely prevent network-level Session ID sniffing.',
    'Set the `Secure` flag on cookies so they are ONLY transmitted over HTTPS connections.',
    'Set the `HttpOnly` flag on cookies to prevent them from being accessed by client-side JavaScript, neutralizing XSS-based cookie theft.',
    'Set the `SameSite=Strict` flag on cookies to prevent Cross-Site Request Forgery (CSRF).',
    'Implement strong, cryptographically secure random number generators for Session IDs.',
    'Regenerate the Session ID immediately upon successful login to prevent Session Fixation attacks.',
    'Use IPSec or enterprise VPNs to encrypt internal network traffic to prevent TCP/UDP level hijacking.',
  ],
  examTips: [
    'Spoofing = BEFORE connection is established. Hijacking = DURING an established connection.',
    'Blind Hijacking is when you can inject packets but cannot see the response (no MitM position).',
    'Session Fixation is when the ATTACKER gives the Session ID to the VICTIM.',
    'XSS steals the cookie using JavaScript. The primary mitigation is the `HttpOnly` flag.',
    'MitB (Man-in-the-Browser) defeats BOTH SSL/HTTPS and Multi-Factor Authentication (MFA) because it acts after decryption and authentication inside the browser.',
    'TCP sequence prediction is the core mathematical mechanism of network-level TCP session hijacking.',
  ],
  realWorldScenarios: [
    'An attacker at an airport uses Bettercap to ARP spoof the open WiFi network, performing SSL Stripping. They capture a cleartext HTTP GET request containing a `PHPSESSID` cookie for a corporate forum. They manually add this cookie to their own browser using an extension and bypass the login screen entirely.',
    'A web application sets the Session ID before the user logs in and does not change it after authentication. An attacker sends a phishing link: `http://bank.com/login?session=12345`. The victim logs in. The attacker then visits `http://bank.com` using the `12345` session ID and gains access to the victim\'s bank account (Session Fixation).',
    'A user\'s PC is infected with a TrickBot banking trojan (MitB). The user logs into their bank using a hardware MFA token and initiates a $100 transfer to a friend. The MitB malware intercepts the DOM request, changes the destination account to the attacker\'s offshore account and the amount to $10,000, while continuing to display the original $100 transfer to the user\'s screen.',
  ],
  prerequisites: ['M08 — Sniffing techniques are fundamentally required to intercept unencrypted session tokens.', 'M14 — Web application architecture knowledge is required to understand Cookies, JWTs, and XSS.'],
};

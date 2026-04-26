import type { Tool } from '../toolTypes';

export const webApplicationTools: Tool[] = [
  {
    id: 'burpsuite',
    name: 'Burp Suite',
    description: 'The absolute industry standard platform for web application security testing. It functions as an intercepting proxy, allowing manual manipulation of all HTTP/HTTPS traffic. Includes a powerful automated scanner, Intruder for advanced brute-forcing/fuzzing, and Repeater for manual request manipulation.',
    category: 'web-application',
    difficulty: 'intermediate',
    tags: ['web', 'proxy', 'scanner', 'must-know', 'professional', 'interception'],
    commands: [
      { command: 'burpsuite', description: 'Launch the Burp Suite Community Edition GUI natively' },
      { command: 'java -jar burpsuite_pro.jar', description: 'Launch the Professional Edition from a raw JAR file' },
      { command: 'java -jar -Xmx4G burpsuite_pro.jar', description: 'Launch Burp allocating 4GB of RAM for heavy state files' },
    ],
    whenToUse: [
      'For comprehensive manual web application penetration testing (the primary tool)',
      'To intercept, inspect, and maliciously modify HTTP/HTTPS requests on the fly',
      'For automated vulnerability scanning utilizing PortSwigger\'s massive payload engine (Pro only)',
      'To perform sniper or pitchfork brute-force attacks on login forms using the Intruder tab',
    ],
    commonFlags: [
      { flag: 'Ctrl+I', description: 'Send current intercepted request to Intruder' },
      { flag: 'Ctrl+R', description: 'Send current intercepted request to Repeater' },
      { flag: 'Ctrl+S', description: 'Send current intercepted request to active Scanner' },
      { flag: 'Ctrl+T', description: 'Toggle Proxy Intercept on/off instantly' },
      { flag: 'Ctrl+U', description: 'URL-encode selected text in the request body' },
      { flag: 'Ctrl+Shift+U', description: 'URL-decode selected text in the request body' },
    ],
    relatedTools: ['owasp-zap', 'fiddler', 'charles'],
    installation: 'Download from portswigger.net (Pre-installed in Kali Linux)',
    website: 'https://portswigger.net/burp',
  },
  {
    id: 'owasp-zap',
    name: 'OWASP ZAP',
    description: 'Zed Attack Proxy (ZAP) is the premier free, open-source penetration testing tool maintained by OWASP. It acts as a Man-in-the-Middle proxy to intercept and modify traffic, featuring an automated scanner, a robust API for CI/CD integration, and support for WebSockets and modern SPA applications.',
    category: 'web-application',
    difficulty: 'beginner',
    tags: ['web', 'proxy', 'scanner', 'owasp', 'open-source', 'ci-cd'],
    commands: [
      { command: 'zaproxy', description: 'Launch the ZAP Desktop GUI interface natively' },
      { command: 'zap-cli quick-scan --self-contained -s xss http://example.com', description: 'Run a headless quick scan exclusively for XSS vulnerabilities' },
      { command: 'zap-cli alerts -l High', description: 'List all high-severity alerts natively via the CLI' },
      { command: 'zaproxy -daemon -port 8080 -host 127.0.0.1', description: 'Run ZAP in headless daemon mode strictly for CI/CD or API integration' },
      { command: 'zap-full-scan.py -t https://example.com', description: 'Execute a full baseline scan using the official ZAP Docker container script' },
    ],
    whenToUse: [
      'As a highly capable, free alternative to Burp Suite Professional for active crawling and scanning',
      'To automate security testing seamlessly within GitHub Actions or Jenkins CI/CD pipelines',
      'To intercept WebSocket traffic, HTTP/2, and deeply nested API requests actively',
      'For rapidly exploring APIs by directly importing OpenAPI/Swagger or GraphQL definitions',
    ],
    commonFlags: [
      { flag: '-daemon', description: 'Starts ZAP in daemon mode without a UI' },
      { flag: '-port', description: 'Override the port ZAP listens on' },
      { flag: '-config', description: 'Override specific configuration settings in the config file' },
    ],
    relatedTools: ['burpsuite', 'mitmproxy'],
    installation: 'sudo apt install zaproxy -y',
    website: 'https://www.zaproxy.org',
  },
  {
    id: 'sqlmap',
    name: 'SQLMap',
    description: 'The most powerful automatic SQL injection and database takeover tool in existence. It supports over 34 database engines and completely automates the process of detecting SQLi, exploiting blind/time-based vulnerabilities, dumping databases, and escalating to OS shell execution.',
    category: 'web-application',
    difficulty: 'intermediate',
    tags: ['sql-injection', 'database', 'automation', 'web', 'exploitation'],
    commands: [
      { command: 'sqlmap -u "http://example.com/page?id=1"', description: 'Execute a basic test against a specific URL parameter for SQL injection' },
      { command: 'sqlmap -u "http://example.com/page?id=1" --dbs', description: 'Enumerate all databases on the vulnerable server' },
      { command: 'sqlmap -u "http://example.com/page?id=1" -D dbname --tables', description: 'List all tables within a specific discovered database' },
      { command: 'sqlmap -u "http://example.com/page?id=1" -D dbname -T users --dump', description: 'Dump all data securely from the users table' },
      { command: 'sqlmap -u "http://example.com/page?id=1" --os-shell', description: 'Attempt to escalate the SQL injection directly into an interactive OS shell' },
      { command: 'sqlmap -r request.txt', description: 'Load a raw HTTP request saved from Burp Suite natively for complex authentications' },
      { command: 'sqlmap -u "http://example.com/" --forms', description: 'Auto-detect and aggressively fuzz all HTML forms on the page' },
      { command: 'sqlmap -u "http://example.com/page?id=1" --level=5 --risk=3', description: 'Execute the absolute maximum detection level and highest risk payloads' },
      { command: 'sqlmap -u "http://example.com/page?id=1" --tamper=space2comment', description: 'Apply a WAF bypass tamper script to obfuscate payloads' },
      { command: 'sqlmap -u "http://example.com/page?id=1" --batch --random-agent', description: 'Run completely non-interactively using randomized User-Agents' },
    ],
    whenToUse: [
      'When you suspect SQL injection vulnerabilities in GET/POST parameters or HTTP Headers',
      'To completely automate tedious database enumeration across Blind or Time-Based SQLi',
      'For extracting massive amounts of data securely and reliably from vulnerable databases',
      'To escalate a simple database flaw into remote code execution via xp_cmdshell or INTO OUTFILE',
    ],
    commonFlags: [
      { flag: '-u', description: 'Target URL' },
      { flag: '-r', description: 'Load HTTP request from a file' },
      { flag: '--dbs', description: 'Enumerate DBMS databases' },
      { flag: '--dump', description: 'Dump database table entries' },
      { flag: '--level', description: 'Level of tests to perform (1-5, default 1)' },
      { flag: '--risk', description: 'Risk of tests to perform (1-3, default 1)' },
      { flag: '--tamper', description: 'Use given script(s) for tampering injection data (WAF bypass)' },
    ],
    relatedTools: ['havij', 'jsql', 'nosqlmap'],
    installation: 'sudo apt install sqlmap -y',
    website: 'https://sqlmap.org',
    interactiveCommands: [
      {
        name: 'SQLMap Payload Generator',
        description: 'Configure advanced automated SQL injection payloads, evasion, and database enumeration.',
        inputs: [
          {
            id: 'target',
            label: 'Target URL',
            type: 'text',
            defaultValue: 'http://example.com/page?id=1',
            placeholder: 'e.g., http://target.com/vuln.php?id=1'
          },
          {
            id: 'technique',
            label: 'Injection Technique',
            type: 'select',
            options: ['All (Default)', 'Boolean-blind (B)', 'Error-based (E)', 'Time-based (T)', 'Union-query (U)'],
            defaultValue: 'All (Default)'
          },
          {
            id: 'enumeration',
            label: 'Enumeration Goal',
            type: 'select',
            options: ['Detect Only', 'Get Databases (--dbs)', 'Get Tables (--tables)', 'Dump All (--dump-all)', 'OS Shell (--os-shell)'],
            defaultValue: 'Get Databases (--dbs)'
          },
          {
            id: 'intensity',
            label: 'Intensity (Level / Risk)',
            type: 'select',
            options: ['Normal (L:1 R:1)', 'Medium (L:3 R:2)', 'Maximum (L:5 R:3)'],
            defaultValue: 'Normal (L:1 R:1)'
          },
          {
            id: 'wafBypass',
            label: 'WAF Bypass & Obfuscation',
            type: 'checkbox',
            defaultValue: 'false',
            placeholder: 'Random Agent + Tamper'
          },
          {
            id: 'batch',
            label: 'Non-Interactive Mode',
            type: 'checkbox',
            defaultValue: 'true',
            placeholder: 'Auto-answer yes (--batch)'
          }
        ],
        generator: (inputs) => {
          const target = inputs.target ? `-u "${inputs.target}"` : '';
          
          let tech = '';
          if (inputs.technique.includes('(B)')) tech = '--technique=B';
          else if (inputs.technique.includes('(E)')) tech = '--technique=E';
          else if (inputs.technique.includes('(T)')) tech = '--technique=T';
          else if (inputs.technique.includes('(U)')) tech = '--technique=U';

          let enumGoal = '';
          if (inputs.enumeration.includes('--dbs')) enumGoal = '--dbs';
          else if (inputs.enumeration.includes('--tables')) enumGoal = '--tables';
          else if (inputs.enumeration.includes('--dump-all')) enumGoal = '--dump-all';
          else if (inputs.enumeration.includes('--os-shell')) enumGoal = '--os-shell';

          let intensity = '';
          if (inputs.intensity.includes('Medium')) intensity = '--level=3 --risk=2';
          else if (inputs.intensity.includes('Maximum')) intensity = '--level=5 --risk=3';

          let waf = inputs.wafBypass === 'true' ? '--random-agent --tamper=space2comment' : '';
          let batch = inputs.batch === 'true' ? '--batch' : '';

          const parts = ['sqlmap', target, tech, enumGoal, intensity, waf, batch].filter(Boolean);
          return parts.join(' ');
        }
      }
    ]
  },
  {
    id: 'wpscan',
    name: 'WPScan',
    description: 'The definitive black-box WordPress security scanner. It enumerates users, themes, and plugins, cross-referencing them against a massive vulnerability database (WPVulnDB). Essential for assessing any CMS built on the WordPress framework.',
    category: 'web-application',
    difficulty: 'beginner',
    tags: ['wordpress', 'cms', 'web', 'scanner', 'recon'],
    commands: [
      { command: 'wpscan --url http://example.com', description: 'Execute a basic non-intrusive WordPress scan' },
      { command: 'wpscan --url http://example.com --enumerate u', description: 'Enumerate author/admin usernames via author archives and REST API' },
      { command: 'wpscan --url http://example.com --enumerate vp', description: 'Enumerate specifically only known vulnerable plugins' },
      { command: 'wpscan --url http://example.com --enumerate ap', description: 'Enumerate all plugins passively and aggressively' },
      { command: 'wpscan --url http://example.com --enumerate t', description: 'Enumerate installed themes' },
      { command: 'wpscan --url http://example.com -U admin -P rockyou.txt', description: 'Brute force the wp-login.php portal directly' },
      { command: 'wpscan --url http://example.com --api-token YOUR_TOKEN', description: 'Query the WPVulnDB API for exact CVE matches' },
      { command: 'wpscan --url http://example.com --stealthy', description: 'Run stealthy scan to bypass basic WAF rules and plugins like Wordfence' },
    ],
    whenToUse: [
      'When auditing any website or blog running the ubiquitous WordPress CMS',
      'To find out-of-date and highly vulnerable WP plugins and themes natively',
      'For enumerating valid authors to launch targeted phishing or brute-force attacks',
      'To brute force wp-admin authentication panels using specific user lists',
    ],
    commonFlags: [
      { flag: '--url', description: 'The WordPress URL to scan' },
      { flag: '--enumerate', description: 'Enumeration processes (vp, ap, vt, at, tt, cb, dbe, u, m)' },
      { flag: '-U', description: 'List of usernames to use during password brute forcing' },
      { flag: '-P', description: 'List of passwords to use during password brute forcing' },
      { flag: '--api-token', description: 'The WPVulnDB API Token to display vulnerability data' },
      { flag: '--stealthy', description: 'Alias for --random-user-agent --format cli-no-color --max-threads 1' },
    ],
    relatedTools: ['joomscan', 'droopescan', 'cmsmap'],
    installation: 'sudo apt install wpscan -y',
    website: 'https://wpscan.com',
  },
  {
    id: 'dirsearch',
    name: 'Dirsearch',
    description: 'An advanced command-line web path scanner that brute-forces directories and files in web servers. Known for its incredible speed via multithreading, advanced filtering based on HTTP status codes or response sizes, and highly readable colorful output.',
    category: 'web-application',
    difficulty: 'beginner',
    tags: ['web', 'directories', 'scanner', 'fast', 'brute-force'],
    commands: [
      { command: 'dirsearch -u http://example.com', description: 'Execute a basic directory scan utilizing the default common payload list' },
      { command: 'dirsearch -u http://example.com -e php,html,js,txt', description: 'Scan aggressively appending specific file extensions to the wordlist' },
      { command: 'dirsearch -u http://example.com -w wordlist.txt -t 20', description: 'Scan using a custom wordlist strictly locked to 20 threads' },
      { command: 'dirsearch -u http://example.com --exclude-status 403,404,500', description: 'Clean output by excluding irrelevant or false-positive status codes' },
      { command: 'dirsearch -u http://example.com -r --recursion-depth 2', description: 'Perform recursive directory discovery down to 2 levels deep' },
      { command: 'dirsearch -u http://example.com -i 200,204,301', description: 'Only show results that exactly match these status codes' },
    ],
    whenToUse: [
      'To discover hidden directories, admin panels, and source files on web environments',
      'For finding critical backup files (e.g. .bak, .old, .zip) quickly through forced extensions',
      'To map the full structural backbone of an entire web application blindly',
      'When you need visually colorful, clean output that simplifies analysis vs Gobuster or Dirb',
    ],
    commonFlags: [
      { flag: '-u', description: 'URL target' },
      { flag: '-e', description: 'Comma separated list of extensions to test' },
      { flag: '-w', description: 'Wordlist path' },
      { flag: '-t', description: 'Number of threads' },
      { flag: '-x / --exclude-status', description: 'Exclude status codes' },
      { flag: '-r', description: 'Bruteforce recursively' },
    ],
    relatedTools: ['gobuster', 'dirb', 'wfuzz', 'ffuf'],
    installation: 'sudo apt install dirsearch -y',
    website: 'https://github.com/maurosoria/dirsearch',
    interactiveCommands: [
      {
        name: 'Dirsearch Fuzzing Generator',
        description: 'Generate an optimized directory brute-forcing command with custom wordlists, extensions, and filtering.',
        inputs: [
          {
            id: 'target',
            label: 'Target URL',
            type: 'text',
            defaultValue: 'http://example.com',
            placeholder: 'e.g., http://target.com'
          },
          {
            id: 'wordlist',
            label: 'Wordlist',
            type: 'select',
            options: ['Default (Dicts)', 'common.txt', 'directory-list-2.3-medium.txt', 'raft-large-directories.txt'],
            defaultValue: 'Default (Dicts)'
          },
          {
            id: 'extensions',
            label: 'Extensions',
            type: 'text',
            defaultValue: 'php,txt,html',
            placeholder: 'e.g., php,bak,zip'
          },
          {
            id: 'threads',
            label: 'Threads',
            type: 'number',
            defaultValue: '20'
          },
          {
            id: 'recursive',
            label: 'Recursive (-r)',
            type: 'checkbox',
            defaultValue: 'false',
            placeholder: 'Enable Recursion'
          },
          {
            id: 'exclude',
            label: 'Exclude Status Codes',
            type: 'text',
            defaultValue: '403,404,500',
            placeholder: 'e.g., 404,500'
          }
        ],
        generator: (inputs) => {
          const target = inputs.target ? `-u ${inputs.target}` : '';
          
          let wordlist = '';
          if (inputs.wordlist === 'common.txt') wordlist = '-w /usr/share/wordlists/dirb/common.txt';
          else if (inputs.wordlist === 'directory-list-2.3-medium.txt') wordlist = '-w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt';
          else if (inputs.wordlist === 'raft-large-directories.txt') wordlist = '-w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt';

          const ext = inputs.extensions ? `-e ${inputs.extensions}` : '';
          const threads = inputs.threads ? `-t ${inputs.threads}` : '';
          const recursive = inputs.recursive === 'true' ? '-r' : '';
          const exclude = inputs.exclude ? `-x ${inputs.exclude}` : '';

          const parts = ['dirsearch', target, ext, wordlist, threads, exclude, recursive].filter(Boolean);
          return parts.join(' ');
        }
      }
    ]
  },
  {
    id: 'xsser',
    name: 'XSSer',
    description: 'A highly automated Cross-Site Scripting (XSS) detection and exploitation framework. It can crawl web pages, extract input vectors, and aggressively inject payloads bypassing various WAF filters and encoding mechanisms to validate XSS flaws natively.',
    category: 'web-application',
    difficulty: 'intermediate',
    tags: ['xss', 'web', 'injection', 'automation', 'exploitation'],
    commands: [
      { command: 'xsser -u "http://example.com/search?q=test"', description: 'Test a single URL parameter via simple payload injection' },
      { command: 'xsser -u "http://example.com/search?q=test" --auto', description: 'Execute automatic advanced XSS detection analyzing reflections' },
      { command: 'xsser --url "http://example.com" --Fp "<script>alert(1)</script>"', description: 'Test the application strictly using a custom payload bypass' },
      { command: 'xsser -c 50 --Cw=1 --Cl -u "http://example.com"', description: 'Crawl the site 50 URLs deep and hunt for XSS concurrently' },
      { command: 'xsser --cookie="session=xyz" -u "http://example.com"', description: 'Test authenticated sections accurately using a session cookie' },
    ],
    whenToUse: [
      'To automate massive injection testing exclusively for cross-site scripting flaws',
      'For testing deeply nested reflected and stored XSS vectors systematically',
      'When attempting to dynamically bypass rudimentary WAF implementations guarding against XSS',
    ],
    commonFlags: [
      { flag: '-u', description: 'Target URL' },
      { flag: '--auto', description: 'Inject a list of provided payloads automatically' },
      { flag: '-c', description: 'Number of URLs to crawl' },
      { flag: '--Fp', description: 'Final payload to inject explicitly' },
      { flag: '--cookie', description: 'Cookie to use for authenticated requests' },
    ],
    relatedTools: ['xsstrike', 'dalfox', 'beef'],
    installation: 'sudo apt install xsser -y',
    website: 'https://github.com/epsylon/xsser',
  },
  {
    id: 'dalfox',
    name: 'DalFox',
    description: 'A blisteringly fast, powerful parameter analysis and XSS scanner written in Go. It focuses heavily on automation, DOM XSS, Blind XSS, and SSRF detection. Its high performance makes it a favorite among bug bounty hunters for scanning massive URL lists pipelined from other tools.',
    category: 'web-application',
    difficulty: 'intermediate',
    tags: ['xss', 'web', 'golang', 'fast', 'bounty'],
    commands: [
      { command: 'dalfox url http://example.com/page?id=1', description: 'Test a single vulnerable parameter dynamically for XSS' },
      { command: 'dalfox file urls.txt', description: 'Scan multiple target URLs loaded from a list concurrently natively' },
      { command: 'dalfox url http://example.com --bind-ssrf', description: 'Check for out-of-band Blind XSS and SSRF concurrently' },
      { command: 'dalfox url http://example.com -w wordlist.txt', description: 'Fuzz application for missing parameters before injecting' },
      { command: 'dalfox url http://example.com -H "Auth: Token"', description: 'Inject custom HTTP headers into all generated payloads' },
      { command: 'cat urls.txt | dalfox pipe', description: 'Accept URLs directly from standard input natively (Unix Pipeline)' },
    ],
    whenToUse: [
      'To surgically detect XSS vulnerabilities with unmatched speed and accuracy',
      'For finding hidden Blind XSS endpoints effectively using external payload handlers (XSS Hunter)',
      'When pipelining extracted parameters out of tools like unfurl or ParamSpider directly into a scanner',
      'During Bug Bounty programs processing massive scopes requiring high concurrency',
    ],
    commonFlags: [
      { flag: 'url', description: 'Scan a single URL' },
      { flag: 'file', description: 'Scan multiple URLs from file' },
      { flag: 'pipe', description: 'Read URLs from standard input' },
      { flag: '-b / --blind', description: 'Add your Blind XSS payload (e.g. xsshunter payload)' },
      { flag: '-w / --custom-payload', description: 'Use custom payloads wordlist' },
      { flag: '-H / --header', description: 'Add custom headers' },
    ],
    relatedTools: ['xsser', 'xsstrike', 'paramspider'],
    installation: 'go install github.com/hahwul/dalfox/v2@latest',
    website: 'https://github.com/hahwul/dalfox',
  },
  {
    id: 'commix',
    name: 'Commix',
    description: 'An automated, all-in-one OS command injection and exploitation tool. Written in Python, it automates the tedious process of finding blind or echoing command injection vulnerabilities in web parameters and escalating them into interactive reverse shells seamlessly.',
    category: 'web-application',
    difficulty: 'advanced',
    tags: ['command-injection', 'os', 'automation', 'web', 'rce'],
    commands: [
      { command: 'commix -u "http://example.com/vulnerabilities/exec/?ip=127.0.0.1"', description: 'Execute a basic command injection test on a GET parameter natively' },
      { command: 'commix -u "http://example.com/exec/" --data="ip=127.0.0.1"', description: 'Test specifically against POST parameters' },
      { command: 'commix -u "http://example.com" --cookie="security=low; PHPSESSID=..."', description: 'Attack authenticated session areas requiring cookies' },
      { command: 'commix -u "http://example.com" --os-cmd="whoami"', description: 'Execute a specific OS command directly after injection is confirmed' },
      { command: 'commix -r req.txt', description: 'Load a full raw HTTP request payload generated by Burp Suite natively' },
      { command: 'commix -u "http://example.com/?id=1" --all', description: 'Run all checks, including time-based blind injection techniques' },
    ],
    whenToUse: [
      'When you suspect raw OS command execution (e.g. ping utilities, domain lookups, image converters)',
      'To automate out-of-band execution bypasses over strict filtering WAFs natively',
      'To convert time-based blind command injections directly into stable reverse shells easily',
    ],
    commonFlags: [
      { flag: '-u', description: 'Target URL' },
      { flag: '--data', description: 'Data string to be sent through POST' },
      { flag: '--cookie', description: 'HTTP Cookie header data' },
      { flag: '--os-cmd', description: 'Execute a single OS command explicitly' },
      { flag: '--all', description: 'Enable all injection techniques and bypasses' },
      { flag: '--batch', description: 'Never ask for user input, use default behavior' },
    ],
    relatedTools: ['sqlmap', 'tplmap'],
    installation: 'sudo apt install commix -y',
    website: 'https://github.com/commixproject/commix',
  },
  {
    id: 'wfuzz',
    name: 'Wfuzz',
    description: 'A highly flexible web fuzzer designed for brute-forcing web applications. Instead of just directories, Wfuzz allows injecting payloads into any part of the HTTP request (headers, POST data, cookies). Excellent for discovering IDOR vulnerabilities and hidden VHosts.',
    category: 'web-application',
    difficulty: 'intermediate',
    tags: ['fuzzer', 'web', 'brute-force', 'python', 'idor'],
    commands: [
      { command: 'wfuzz -c -z file,wordlist.txt --hc 404 http://example.com/FUZZ', description: 'Fuzz directories natively masking 404 responses' },
      { command: 'wfuzz -c -z file,users.txt -z file,pass.txt -d "user=FUZZ&pass=FUZ2Z" http://example.com/login', description: 'Simultaneous multi-parameter fuzzzing targeting login forms' },
      { command: 'wfuzz -c -H "Host: FUZZ.example.com" -z file,subdomains.txt http://example.com', description: 'Virtual Host (VHost) enumeration by fuzzing the Host header explicitly' },
      { command: 'wfuzz -c -z list,1-100 http://example.com/item.php?id=FUZZ', description: 'Number iteration fuzzing natively to discover IDOR vulnerabilities' },
      { command: 'wfuzz -c -z file,wordlist.txt --hw 10 http://example.com/FUZZ', description: 'Hide responses that contain exactly 10 words (useful for filtering default pages)' },
    ],
    whenToUse: [
      'For dynamic parameter fuzzing using complex chained wordlists natively',
      'To iterate ID parameters automatically to uncover Insecure Direct Object References (IDOR)',
      'To perform HTTP header fuzzing (e.g., Host, User-Agent, X-Forwarded-For)',
      'When you need advanced logic filtering (hiding output based explicitly on word count, lines, or chars)',
    ],
    commonFlags: [
      { flag: '-c', description: 'Output with colors' },
      { flag: '-z', description: 'Specify a payload (type,parameters)' },
      { flag: '--hc', description: 'Hide responses with the specified HTTP code(s)' },
      { flag: '--hw', description: 'Hide responses with the specified word count' },
      { flag: '-H', description: 'Use specified header' },
      { flag: '-d', description: 'Use specified post data' },
    ],
    relatedTools: ['ffuf', 'gobuster', 'dirsearch'],
    installation: 'sudo apt install wfuzz -y',
    website: 'https://github.com/xmendez/wfuzz',
  },
  {
    id: 'arjun',
    name: 'Arjun',
    description: 'An intelligent HTTP parameter discovery suite. It brute-forces hidden GET, POST, and JSON parameters by analyzing server responses heuristically. It ignores massive false positives, providing clean entry points for tools like SQLMap or DalFox to attack.',
    category: 'web-application',
    difficulty: 'intermediate',
    tags: ['parameters', 'discovery', 'web', 'python', 'fuzzer'],
    commands: [
      { command: 'arjun -u http://example.com', description: 'Discover hidden GET parameters passively' },
      { command: 'arjun -u http://example.com -m POST', description: 'Discover hidden POST parameters actively via data injection' },
      { command: 'arjun -u http://example.com -m JSON', description: 'Test for hidden JSON endpoints mapping complex APIs' },
      { command: 'arjun -i urls.txt -oT export.txt', description: 'Discover parameter bounds on massive lists of endpoints concurrently' },
      { command: 'arjun -u http://example.com --include="<pattern>"', description: 'Filter exclusively by a specific regex string in the response body' },
    ],
    whenToUse: [
      'To find hidden, debug, or legacy HTTP parameters (e.g., debug=true, ref=dev, admin=1)',
      'When API documentation is completely missing but REST endpoints are exposed',
      'As a feeder script to SQLMap or Dalfox by locating valid injection vectors efficiently',
    ],
    commonFlags: [
      { flag: '-u', description: 'Target URL' },
      { flag: '-m', description: 'HTTP method to use (GET, POST, JSON)' },
      { flag: '-i', description: 'Input file containing multiple URLs' },
      { flag: '-t', description: 'Number of concurrent threads' },
      { flag: '-oT / -oJ', description: 'Output results to text or JSON file' },
    ],
    relatedTools: ['paramspider', 'dalfox'],
    installation: 'pip3 install arjun',
    website: 'https://github.com/s0md3v/Arjun',
  },
  {
    id: 'paramspider',
    name: 'ParamSpider',
    description: 'A reconnaissance script that mines URLs from the dark corners of the Wayback Machine (Web Archive). It specifically extracts URLs containing parameters, allowing testers to quickly build massive target lists for automated injection testing without ever touching the target server.',
    category: 'web-application',
    difficulty: 'beginner',
    tags: ['osint', 'parameters', 'mining', 'xss', 'recon'],
    commands: [
      { command: 'python3 paramspider.py -d example.com', description: 'Fetch deeply archived parameters for the exact target domain natively' },
      { command: 'python3 paramspider.py -d example.com --exclude php,jpg,svg', description: 'Filter out specific static extensions to isolate dynamic endpoints' },
      { command: 'python3 paramspider.py -d example.com --level high', description: 'Perform recursive subdomain mining across the entire domain scope' },
    ],
    whenToUse: [
      'To passively build a massive list of parameters via Wayback Machine without triggering IDSs',
      'When setting up fuzz pipelines for XSS/SQLi at bug bounty scales natively',
      'To test endpoints that may have been decommissioned but still accept parameters passively (Zombie APIs)',
    ],
    commonFlags: [
      { flag: '-d', description: 'Domain to scan' },
      { flag: '--exclude', description: 'Extensions to exclude (comma separated)' },
      { flag: '--level', description: 'Mining depth level (high includes subdomains)' },
      { flag: '--quiet', description: 'Do not print URLs to the terminal' },
    ],
    relatedTools: ['arjun', 'waybackurls', 'gau'],
    installation: 'git clone https://github.com/devanshbatham/ParamSpider && cd ParamSpider && pip3 install -r requirements.txt',
    website: 'https://github.com/devanshbatham/ParamSpider',
  },
  {
    id: 'eyewitness',
    name: 'EyeWitness',
    description: 'A rapid screenshot automation tool. It takes a massive list of URLs or an Nmap XML file, takes screenshots of every web service, collects server headers, identifies default credentials, and compiles a comprehensive, navigable HTML report for visual triage.',
    category: 'web-application',
    difficulty: 'beginner',
    tags: ['screenshots', 'recon', 'reporting', 'automation'],
    commands: [
      { command: 'eyewitness -f urls.txt --web', description: 'Screenshot web interfaces of URLs provided via text file natively' },
      { command: 'eyewitness -x nmap.xml --web', description: 'Consume Nmap output automatically and screenshot exclusively live web services' },
      { command: 'eyewitness -f urls.txt --web --resolve', description: 'Resolve hostnames to IPs explicitly before attempting screenshots' },
      { command: 'eyewitness -d output/ -f urls.txt --web', description: 'Define a custom output directory for the HTML report' },
      { command: 'eyewitness -f urls.txt --web --timeout 15', description: 'Set a custom timeout for rendering slow web pages' },
    ],
    whenToUse: [
      'When triaging extremely large infrastructures visually to find obvious login panels natively',
      'To prove vulnerabilities and open panels visually in final penetration test reports',
      'To identify visually identical login portals across massive IP ranges (e.g., standard router configs)',
      'As an automated visual crawler complementing Nmap port scans natively',
    ],
    commonFlags: [
      { flag: '-f', description: 'File containing URLs to scan' },
      { flag: '-x', description: 'Nmap XML file to consume' },
      { flag: '--web', description: 'Take screenshots using a headless browser' },
      { flag: '-d', description: 'Directory to write results to' },
      { flag: '--resolve', description: 'Resolve IP/Hostname for each target' },
    ],
    relatedTools: ['aquatone', 'gowitness'],
    installation: 'sudo apt install eyewitness -y',
    website: 'https://github.com/RedSiege/EyeWitness',
  },
  {
    id: 'sublist3r',
    name: 'Sublist3r',
    description: 'A fast subdomains enumeration tool that aggregates results from multiple OSINT search engines (Google, Yahoo, Bing, Baidu) and APIs (VirusTotal, ThreatCrowd). It maps out the external attack surface of a domain passively before active scanning begins.',
    category: 'web-application',
    difficulty: 'beginner',
    tags: ['recon', 'subdomains', 'osint', 'python', 'passive'],
    commands: [
      { command: 'sublist3r -d example.com', description: 'Execute fast standard enumeration natively across all search engines' },
      { command: 'sublist3r -d example.com -b', description: 'Enumerate using OSINT but activate brute force fallback module for hidden domains' },
      { command: 'sublist3r -d example.com -p 80,443', description: 'Scan explicitly discovered subdomains for specific live ports natively' },
      { command: 'sublist3r -d example.com -o results.txt', description: 'Output discovered subdomains directly to a specific text file' },
    ],
    whenToUse: [
      'When you need a quick mapping of target subdomains natively using Python',
      'Before fuzzing web spaces to identify all possible entry points and virtual hosts',
      'For OSINT intelligence gathering bypassing active connection queries strictly',
    ],
    commonFlags: [
      { flag: '-d', description: 'Domain name to enumerate' },
      { flag: '-b', description: 'Enable subbrute bruteforce module' },
      { flag: '-p', description: 'Scan the found subdomains against specified tcp ports' },
      { flag: '-v', description: 'Enable verbose output' },
      { flag: '-t', description: 'Number of threads to use for bruteforce (default 30)' },
      { flag: '-o', description: 'Save the results to text file' },
    ],
    relatedTools: ['amass', 'assetfinder', 'findomain'],
    installation: 'sudo apt install sublist3r -y',
    website: 'https://github.com/aboul3la/Sublist3r',
  },
  {
    id: 'httprobe',
    name: 'httprobe',
    description: 'A lightning-fast, simple Go tool that takes a massive list of raw subdomains (usually generated by tools like Amass or Sublist3r) and probes them to identify which ones actually host active HTTP or HTTPS web servers natively.',
    category: 'web-application',
    difficulty: 'beginner',
    tags: ['probing', 'recon', 'golang', 'fast', 'filtering'],
    commands: [
      { command: 'cat domains.txt | httprobe', description: 'Probe standard 80/443 ports for live HTTP/HTTPS servers natively' },
      { command: 'cat domains.txt | httprobe -p http:8080 -p https:8443', description: 'Probe additional non-standard ports natively mapping complex infrastructures' },
      { command: 'cat domains.txt | httprobe -c 50', description: 'Set concurrency level explicitly to 50 for faster probing' },
      { command: 'cat domains.txt | httprobe --prefer-https', description: 'Force prefer HTTPS resolutions to deduplicate HTTP responses' },
    ],
    whenToUse: [
      'To rapidly filter down massive subdomain lists (e.g. from Amass/Sublist3r) to only live web assets',
      'To thoroughly prepare valid target lists for tools like Dirsearch, Gobuster, or Nuclei',
      'To strip generic garbage domain responses directly through Unix piping elegantly',
    ],
    commonFlags: [
      { flag: '-p', description: 'Add additional probe parameters (e.g., http:8080)' },
      { flag: '-c', description: 'Concurrency level (default 20)' },
      { flag: '-t', description: 'Timeout in milliseconds (default 10000)' },
      { flag: '--prefer-https', description: 'Only show HTTPS if both HTTP and HTTPS succeed' },
    ],
    relatedTools: ['httpx', 'curl'],
    installation: 'go install github.com/tomnomnom/httprobe@latest',
    website: 'https://github.com/tomnomnom/httprobe',
  }
];

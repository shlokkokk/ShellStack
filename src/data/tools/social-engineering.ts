import type { Tool } from '../toolTypes';

export const socialEngineeringTools: Tool[] = [
  {
    id: 'set',
    name: 'Social-Engineer Toolkit (SET)',
    description: 'The industry-standard open-source penetration testing framework designed specifically for social engineering attacks. Built by TrustedSec, SET automates phishing, credential harvesting, payload delivery, and HTA/PowerShell attack vectors through an interactive menu-driven interface.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['phishing', 'social-engineering', 'automation', 'credential-harvesting', 'must-know'],
    commands: [
      { command: 'setoolkit', description: 'Launch the SET interactive menu — all attacks are selected through numbered options' },
      { command: '1) Social-Engineering Attacks', description: 'Main attack menu — contains website cloning, phishing, HTA attacks, and more' },
      { command: '1 → 2 → 3 → 2', description: 'Credential Harvester via Site Cloner — clones a login page (Gmail, Facebook, etc.) and captures credentials when the victim logs in' },
      { command: '1 → 2 → 1 → 2', description: 'Java Applet Attack — serves a malicious Java applet that executes a payload when the victim accepts the prompt' },
      { command: '1 → 9 → 1', description: 'PowerShell Alphanumeric Shellcode Attack — generates an encoded PowerShell one-liner that bypasses most AV' },
      { command: '1 → 1', description: 'Spear-Phishing Attack — craft a targeted email with a malicious attachment (PDF, macro doc, etc.)' },
      { command: '1 → 2 → 5', description: 'Web Jacking Attack — ARP redirects the victim to your cloned page transparently' },
    ],
    whenToUse: [
      'To simulate realistic phishing attacks during security awareness assessments',
      'To clone login pages and harvest credentials in authorized engagements',
      'For generating encoded payloads that bypass basic AV detection',
      'To test employee susceptibility to social engineering via spear-phishing emails',
      'When you need a quick credential harvesting page without manual HTML/PHP work',
      'For Red Team operations requiring automated social engineering attack chains',
    ],
    commonFlags: [
      { flag: 'Menu 1', description: 'Social-Engineering Attacks (phishing, cloning, payloads)' },
      { flag: 'Menu 2', description: 'Penetration Testing (Fast-Track)' },
      { flag: 'Menu 3', description: 'Third Party Modules' },
      { flag: 'Menu 4', description: 'Update the Social-Engineer Toolkit' },
      { flag: 'Menu 5', description: 'Update SET configuration' },
    ],
    relatedTools: ['gophish', 'king-phisher', 'evilginx2', 'beef'],
    installation: 'sudo apt install set -y   # Pre-installed on Kali Linux',
    website: 'https://github.com/trustedsec/social-engineer-toolkit',
    interactiveCommands: [
      {
        name: 'SET Attack Automation',
        description: 'While SET is menu-driven, use this to document your intended attack paths or quick-launch flags.',
        inputs: [
          { id: 'module', label: 'Attack Module', type: 'select', options: ['Interactive Menu', 'Spear-Phishing Attack', 'Website Cloner (Cred Harvester)', 'Payload Generator'], defaultValue: 'Interactive Menu' },
          { id: 'targetIp', label: 'LHOST (Your IP)', type: 'text', defaultValue: '192.168.1.100', placeholder: 'For reverse shells' },
          { id: 'cloneUrl', label: 'Clone URL', type: 'text', defaultValue: 'https://login.microsoft.com', placeholder: 'Site to clone' }
        ],
        generator: (inputs) => {
          if (inputs.module === 'Website Cloner (Cred Harvester)') {
             return `# Run: setoolkit\n# Then follow: 1 -> 2 -> 3 -> 2\n# IP to POST to: ${inputs.targetIp}\n# URL to clone: ${inputs.cloneUrl}`;
          }
          if (inputs.module === 'Payload Generator') {
             return `# Run: setoolkit\n# Then follow: 1 -> 4\n# LHOST: ${inputs.targetIp}`;
          }
          if (inputs.module === 'Spear-Phishing Attack') {
             return `# Run: setoolkit\n# Then follow: 1 -> 1`;
          }
          return 'setoolkit';
        }
      }
    ]
  },
  {
    id: 'gophish',
    name: 'Gophish',
    description: 'Professional-grade open-source phishing simulation platform with a modern web dashboard. Manages email templates, landing pages, sending profiles, and target groups. Tracks opens, clicks, and credential submissions in real-time with detailed campaign analytics and exportable reports.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['phishing', 'campaigns', 'reporting', 'professional', 'dashboard'],
    commands: [
      { command: './gophish', description: 'Start the Gophish server — admin panel runs on https://localhost:3333 (default creds: admin/gophish)' },
      { command: 'Sending Profiles → New Profile', description: 'Configure SMTP settings for sending phishing emails (Gmail SMTP, custom relay, etc.)' },
      { command: 'Landing Pages → Import Site', description: 'Clone any website as a credential harvesting page — enter the URL and Gophish clones it' },
      { command: 'Email Templates → New Template', description: 'Create the phishing email body — supports HTML, attachments, and tracking pixels' },
      { command: 'Users & Groups → New Group', description: 'Import target email addresses from CSV — columns: First Name, Last Name, Email, Position' },
      { command: 'Campaigns → New Campaign', description: 'Launch a campaign — combines template + landing page + sending profile + target group' },
      { command: 'Dashboard → Campaign Results', description: 'Real-time tracking: email sent → opened → clicked link → submitted credentials' },
    ],
    whenToUse: [
      'For professional security awareness assessments that require detailed reporting',
      'When you need to track exactly who opened, clicked, and submitted credentials',
      'For compliance-driven phishing simulations (SOC2, ISO 27001 requirements)',
      'When running large-scale campaigns against hundreds/thousands of employees',
      'To generate executive-friendly reports with click rates and submission statistics',
    ],
    commonFlags: [
      { flag: '--admin_listen_url', description: 'Set admin panel listen address (default: https://0.0.0.0:3333)' },
      { flag: '--phish_listen_url', description: 'Set phishing server listen address (default: http://0.0.0.0:80)' },
      { flag: 'config.json', description: 'Main configuration file — edit SMTP settings, listen addresses, database path' },
    ],
    relatedTools: ['set', 'evilginx2', 'king-phisher'],
    installation: 'Download binary from https://github.com/gophish/gophish/releases — single binary, no dependencies',
    website: 'https://getgophish.com',
    interactiveCommands: [
      {
        name: 'Gophish Server Configuration',
        description: 'Generate launch commands for Gophish with custom admin and listener bindings.',
        inputs: [
          { id: 'adminUrl', label: 'Admin Listen URL', type: 'text', defaultValue: '127.0.0.1:3333', placeholder: 'e.g., 0.0.0.0:3333' },
          { id: 'phishUrl', label: 'Phish Listen URL', type: 'text', defaultValue: '0.0.0.0:80', placeholder: 'e.g., 0.0.0.0:80' },
          { id: 'config', label: 'Config File', type: 'text', defaultValue: '', placeholder: 'Path to config.json' }
        ],
        generator: (inputs) => {
          let cmd = './gophish';
          
          if (inputs.adminUrl && inputs.adminUrl !== '127.0.0.1:3333') cmd += ` --admin_listen_url ${inputs.adminUrl}`;
          if (inputs.phishUrl && inputs.phishUrl !== '0.0.0.0:80') cmd += ` --phish_listen_url ${inputs.phishUrl}`;
          if (inputs.config) cmd += ` --config ${inputs.config}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'evilginx2',
    name: 'Evilginx2',
    description: 'Advanced man-in-the-middle reverse proxy framework that intercepts credentials AND session cookies in real-time. Defeats 2FA/MFA by proxying the entire authentication flow — the victim interacts with the real site through your proxy, giving you their fully authenticated session token.',
    category: 'social-engineering',
    difficulty: 'advanced',
    tags: ['phishing', '2fa-bypass', 'mitm', 'session-hijacking', 'advanced'],
    commands: [
      { command: 'evilginx2', description: 'Start Evilginx2 interactive console' },
      { command: 'config domain yourdomain.com', description: 'Set your phishing domain — must have DNS A records pointing to your server' },
      { command: 'config ip 1.2.3.4', description: 'Set the external IP of your VPS/server' },
      { command: 'phishlets hostname linkedin linkedin.yourdomain.com', description: 'Map the LinkedIn phishlet to your subdomain' },
      { command: 'phishlets enable linkedin', description: 'Enable the LinkedIn phishlet — auto-generates Let\'s Encrypt TLS certificates' },
      { command: 'lures create linkedin', description: 'Create a phishing lure URL that you send to the target' },
      { command: 'lures get-url 0', description: 'Get the actual phishing URL to send to the victim (lure ID 0)' },
      { command: 'sessions', description: 'List all captured sessions — shows credentials + session cookies' },
      { command: 'sessions 1', description: 'View details of session #1 — copy the session cookie to hijack the account' },
    ],
    whenToUse: [
      'When the target uses 2FA/MFA and standard credential phishing is insufficient',
      'To capture fully authenticated session cookies that bypass TOTP/push notification 2FA',
      'For Red Team operations simulating advanced nation-state phishing techniques',
      'When you need to access a target\'s account without triggering 2FA re-authentication',
      'To demonstrate to clients that MFA alone does not stop sophisticated phishing',
    ],
    commonFlags: [
      { flag: 'config', description: 'Set global configuration (domain, IP, DNS)' },
      { flag: 'phishlets', description: 'Manage phishlet templates (enable, disable, hostname)' },
      { flag: 'lures', description: 'Create and manage phishing lure URLs' },
      { flag: 'sessions', description: 'View captured credentials and session tokens' },
      { flag: 'blacklist', description: 'Block IPs/user-agents (block scanners, researchers)' },
    ],
    relatedTools: ['set', 'gophish', 'modlishka'],
    installation: 'go install github.com/kgretzky/evilginx2@latest\n# Requires: VPS with public IP, custom domain, DNS configured',
    website: 'https://github.com/kgretzky/evilginx2',
    interactiveCommands: [
      {
        name: 'Evilginx2 Configuration Guide',
        description: 'Generate the exact sequence of commands needed to configure an Evilginx2 2FA-bypass phishing domain.',
        inputs: [
          { id: 'domain', label: 'Phishing Domain', type: 'text', defaultValue: 'yourdomain.com', placeholder: 'Domain registered for attack' },
          { id: 'ip', label: 'VPS External IP', type: 'text', defaultValue: '1.2.3.4', placeholder: 'Your server IP' },
          { id: 'phishlet', label: 'Phishlet', type: 'select', options: ['linkedin', 'office365', 'github', 'custom'], defaultValue: 'linkedin' },
          { id: 'subdomain', label: 'Subdomain Prefix', type: 'text', defaultValue: 'login', placeholder: 'e.g., login' }
        ],
        generator: (inputs) => {
          const fqdn = `${inputs.subdomain}.${inputs.domain}`;
          return [
            `evilginx2`,
            `config domain ${inputs.domain}`,
            `config ip ${inputs.ip}`,
            `phishlets hostname ${inputs.phishlet} ${fqdn}`,
            `phishlets enable ${inputs.phishlet}`,
            `lures create ${inputs.phishlet}`,
            `lures get-url 0`
          ].join('\\n');
        }
      }
    ]
  },
  {
    id: 'king-phisher',
    name: 'King Phisher',
    description: 'Feature-rich phishing campaign toolkit with a GTK GUI client and dedicated server. Supports Jinja2 email/page templates, embedded image tracking, two-factor credential harvesting, and granular per-target analytics with geolocation tracking.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['phishing', 'campaigns', 'gui', 'geolocation', 'analytics'],
    commands: [
      { command: '/opt/king-phisher/KingPhisherServer', description: 'Start the King Phisher server daemon — handles page hosting, tracking, and credential capture' },
      { command: '/opt/king-phisher/KingPhisher', description: 'Start the GUI client — connects to the server for campaign management' },
      { command: 'king-phisher-server --config server_config.yml', description: 'Start server with a custom configuration file' },
      { command: 'king-phisher-client', description: 'Launch the GTK GUI client for campaign creation and monitoring' },
    ],
    whenToUse: [
      'When you need a mature GUI-based phishing framework with strong template support',
      'To track granular statistics: link clicks, credential submissions, geolocation, browser fingerprints',
      'For campaigns requiring Jinja2 dynamic templates that personalize emails per-target',
      'When Gophish is too basic and you need more advanced tracking and customization',
    ],
    commonFlags: [
      { flag: '--config', description: 'Path to server configuration YAML file' },
      { flag: '--verify-config', description: 'Verify the configuration file without starting the server' },
      { flag: '--log-level', description: 'Set logging verbosity (debug, info, warning, error)' },
    ],
    relatedTools: ['gophish', 'set', 'evilginx2'],
    installation: 'git clone https://github.com/securestate/king-phisher\ncd king-phisher && sudo ./tools/install.sh',
    website: 'https://github.com/securestate/king-phisher',
    interactiveCommands: [
      {
        name: 'King Phisher Daemon Control',
        description: 'Construct the King Phisher server daemon launch command with necessary configurations.',
        inputs: [
          { id: 'config', label: 'Server Config (--config)', type: 'text', defaultValue: 'server_config.yml', placeholder: 'Path to config yaml' },
          { id: 'verify', label: 'Verify Config (--verify-config)', type: 'checkbox', defaultValue: 'false', placeholder: 'Check syntax only' },
          { id: 'logLevel', label: 'Log Level (--log-level)', type: 'select', options: ['info', 'debug', 'warning', 'error'], defaultValue: 'info' }
        ],
        generator: (inputs) => {
          let cmd = '/opt/king-phisher/KingPhisherServer';
          
          if (inputs.config) cmd += ` --config ${inputs.config}`;
          if (inputs.verify === 'true') cmd += ' --verify-config';
          if (inputs.logLevel !== 'info') cmd += ` --log-level ${inputs.logLevel}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'maltego',
    name: 'Maltego',
    description: 'Visual link analysis and OSINT platform that maps relationships between people, companies, domains, IP addresses, social media accounts, and infrastructure. Uses "transforms" to automatically query data sources and build intelligence graphs that reveal hidden connections.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['osint', 'visualization', 'intelligence', 'graph', 'reconnaissance'],
    commands: [
      { command: 'maltego', description: 'Launch Maltego GUI — Community Edition (CE) is free, higher tiers require license' },
      { command: 'New Graph → Person Entity', description: 'Start investigation: drag a Person entity onto the graph, enter the target name' },
      { command: 'Right-click → Run All Transforms', description: 'Execute all available transforms on an entity — queries dozens of data sources automatically' },
      { command: 'Right-click → Email Address Transforms', description: 'Find all email addresses associated with a person or domain' },
      { command: 'Right-click → Domain Transforms', description: 'Enumerate subdomains, DNS records, WHOIS data, and related infrastructure' },
      { command: 'Right-click → Phone Number Transforms', description: 'Look up phone number owner, carrier, and associated social profiles' },
    ],
    whenToUse: [
      'For OSINT investigations — mapping a target\'s digital footprint across the internet',
      'To visually map relationships between people, organizations, and infrastructure',
      'During social engineering reconnaissance — find email patterns, social media, phone numbers',
      'To discover shadow IT and unknown assets connected to an organization',
      'For threat intelligence — trace attacker infrastructure and campaign overlaps',
    ],
    commonFlags: [
      { flag: 'Community Edition', description: 'Free tier — limited transforms, max 12 entities per transform' },
      { flag: 'Professional', description: 'Full features — unlimited entities, all transforms, export options' },
      { flag: 'Transforms Hub', description: 'Marketplace for additional data source integrations (Shodan, VirusTotal, etc.)' },
    ],
    relatedTools: ['spiderfoot', 'recon-ng', 'theharvester', 'sherlock'],
    installation: 'Download from https://www.maltego.com/downloads/ — Java-based, cross-platform',
    website: 'https://www.maltego.com',
    interactiveCommands: [
      {
        name: 'Maltego GUI Launcher',
        description: 'Basic Maltego launch command (Maltego is entirely GUI-driven).',
        inputs: [
          { id: 'version', label: 'Launch Version', type: 'select', options: ['maltego (GUI)'], defaultValue: 'maltego (GUI)' }
        ],
        generator: () => {
          return 'maltego';
        }
      }
    ]
  },
  {

    id: 'sherlock',
    name: 'Sherlock',
    description: 'Hunt down social media accounts by username across 300+ social networks. Given a single username, Sherlock checks Twitter, Instagram, Reddit, GitHub, TikTok, LinkedIn, and hundreds more to build a complete social footprint of a person — essential for targeted social engineering reconnaissance.',
    category: 'social-engineering',
    difficulty: 'beginner',
    tags: ['osint', 'username', 'social-media', 'reconnaissance'],
    commands: [
      { command: 'python3 sherlock target_username', description: 'Search for a username across all 300+ supported platforms' },
      { command: 'python3 sherlock username1 username2 username3', description: 'Search for multiple usernames at once (batch mode)' },
      { command: 'python3 sherlock target --csv', description: 'Export all found accounts to a CSV file for documentation' },
      { command: 'python3 sherlock target --print-found', description: 'Only print found accounts (suppress "Not Found" lines for cleaner output)' },
      { command: 'python3 sherlock target --site twitter --site github', description: 'Only check specific sites instead of all 300+' },
    ],
    whenToUse: [
      'During social engineering recon to build a complete digital profile of a target person',
      'To find a target\'s real email via GitHub profile, social media bios, or forum posts',
      'For corporate security assessments — check if employees use the same usernames on personal/professional accounts',
    ],
    commonFlags: [
      { flag: '--csv', description: 'Save results to a CSV file' },
      { flag: '--print-found', description: 'Only display sites where the account was found' },
      { flag: '--timeout', description: 'Maximum seconds to wait for a response from each site' },
      { flag: '--site', description: 'Limit the search to one or more specific sites' },
    ],
    outputExample: [
      '[*] Checking username: hacker_handle',
      '[+] Twitter: https://twitter.com/hacker_handle',
      '[+] GitHub: https://github.com/hacker_handle',
      '[+] Reddit: https://reddit.com/user/hacker_handle',
      '[+] HackerNews: https://news.ycombinator.com/user?id=hacker_handle',
      '[-] Instagram: Not Found!',
      '[*] Total Websites Username Detected On: 127'
    ],
    relatedTools: ['maltego', 'theharvester', 'spiderfoot'],
    installation: 'git clone https://github.com/sherlock-project/sherlock && cd sherlock && pip3 install -r requirements.txt',
    website: 'https://github.com/sherlock-project/sherlock',
    interactiveCommands: [
      {
        name: 'Sherlock Social Footprinter',
        description: 'Generate advanced Sherlock username searches filtering specific platforms and saving output.',
        inputs: [
          { id: 'username', label: 'Target Username(s)', type: 'text', defaultValue: 'john_doe', placeholder: 'Space separated' },
          { id: 'csv', label: 'Export to CSV (--csv)', type: 'checkbox', defaultValue: 'true', placeholder: 'Save structured results' },
          { id: 'printFound', label: 'Print Found Only (--print-found)', type: 'checkbox', defaultValue: 'true', placeholder: 'Cleaner CLI output' },
          { id: 'timeout', label: 'Timeout (--timeout)', type: 'text', defaultValue: '60', placeholder: 'Per-site timeout' },
          { id: 'sites', label: 'Specific Sites (--site)', type: 'text', defaultValue: '', placeholder: 'e.g., twitter github reddit' }
        ],
        generator: (inputs) => {
          let cmd = 'python3 sherlock';
          
          if (inputs.csv === 'true') cmd += ' --csv';
          if (inputs.printFound === 'true') cmd += ' --print-found';
          if (inputs.timeout && inputs.timeout !== '60') cmd += ` --timeout ${inputs.timeout}`;
          
          if (inputs.sites) {
             const siteList = inputs.sites.split(' ');
             siteList.forEach(s => {
               cmd += ` --site ${s.trim()}`;
             });
          }
          
          cmd += ` ${inputs.username}`;
          return cmd;
        }
      }
    ]
  },
  {
    id: 'spiderfoot',
    name: 'SpiderFoot',
    description: 'An automated OSINT platform with 200+ modules to collect intelligence from dozens of data sources (Shodan, HaveIBeenPwned, VirusTotal, PassiveTotal, etc.). Operates via a web UI or CLI, building a comprehensive network graph of a target\'s infrastructure, email addresses, social profiles, and data breach exposure.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['osint', 'automated', 'intelligence', 'reconnaissance', 'infrastructure'],
    commands: [
      { command: 'python3 sf.py -l 127.0.0.1:5001', description: 'Start SpiderFoot web UI server — access at http://127.0.0.1:5001' },
      { command: 'python3 sf.py -s example.com -t INTERNET_NAME -m sfp_shodan,sfp_dns,sfp_whois', description: 'Run CLI scan against example.com using specific modules' },
      { command: 'python3 sfcli.py -s example.com -t INTERNET_NAME -o csv', description: 'Run scan via CLI and export results to CSV format' },
    ],
    whenToUse: [
      'For deep, automated OSINT collection against an organization at the start of an engagement',
      'To automatically aggregate target data from Shodan, HaveIBeenPwned, DNS records, WHOIS, and more',
      'To check if any target email addresses appear in known data breaches (credential stuffing prep)',
    ],
    commonFlags: [
      { flag: '-s', description: 'Target to scan (domain, IP, email, person, username)' },
      { flag: '-t', description: 'Target type (INTERNET_NAME, IP_ADDRESS, EMAIL_ADDRESS, etc.)' },
      { flag: '-m', description: 'Comma-separated list of specific modules to use' },
      { flag: '-l', description: 'Listen address and port for the web UI' },
      { flag: '-o', description: 'Output format (csv, json, tab)' },
    ],
    outputExample: [
      'SpiderFoot 4.0: Correlating data...',
      '',
      'Source         Type              Data',
      '----------     ------            ----',
      'sfp_shodan     OPEN PORT         example.com: 22, 80, 443, 8080',
      'sfp_hibp       EMAILADDR_COMP    john.doe@example.com found in 3 breaches',
      'sfp_dns        DNS_TEXT          "v=spf1 include:google.com ~all"',
      'sfp_whois      WHOIS_REGISTRAR   GoDaddy LLC'
    ],
    relatedTools: ['maltego', 'recon-ng', 'theharvester'],
    installation: 'pip install spiderfoot   # or: git clone https://github.com/smicallef/spiderfoot',
    website: 'https://www.spiderfoot.net',
    interactiveCommands: [
      {
        name: 'SpiderFoot CLI Automation',
        description: 'Construct automated OSINT scan commands utilizing specific SpiderFoot modules.',
        inputs: [
          { id: 'target', label: 'Target (-s)', type: 'text', defaultValue: 'example.com', placeholder: 'Domain, IP, or Username' },
          { id: 'type', label: 'Target Type (-t)', type: 'select', options: ['INTERNET_NAME', 'IP_ADDRESS', 'EMAIL_ADDRESS', 'HUMAN_NAME', 'USERNAME'], defaultValue: 'INTERNET_NAME' },
          { id: 'modules', label: 'Modules (-m)', type: 'text', defaultValue: 'all', placeholder: 'e.g., sfp_shodan,sfp_dns' },
          { id: 'output', label: 'Output Format (-o)', type: 'select', options: ['tab', 'csv', 'json'], defaultValue: 'csv' },
          { id: 'outFile', label: 'Output File', type: 'text', defaultValue: 'sf_report.csv', placeholder: 'File to save to' },
          { id: 'web', label: 'Start Web UI Instead', type: 'checkbox', defaultValue: 'false', placeholder: 'Ignores other settings' },
          { id: 'listen', label: 'Web Listen Address (-l)', type: 'text', defaultValue: '127.0.0.1:5001', placeholder: 'For Web UI' }
        ],
        generator: (inputs) => {
          if (inputs.web === 'true') {
             return `python3 sf.py -l ${inputs.listen}`;
          }
          
          let cmd = `python3 sfcli.py -s ${inputs.target} -t ${inputs.type}`;
          
          if (inputs.modules && inputs.modules !== 'all') cmd += ` -m ${inputs.modules}`;
          if (inputs.output) cmd += ` -o ${inputs.output}`;
          
          return `${cmd} > ${inputs.outFile}`;
        }
      }
    ]
  }
];

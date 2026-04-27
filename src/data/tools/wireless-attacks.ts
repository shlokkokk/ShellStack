import type { Tool } from '../toolTypes';

export const wirelessAttacksTools: Tool[] = [
  {
    id: 'aircrack-ng',
    name: 'Aircrack-ng',
    description: 'The industry-standard suite for 802.11 wireless security auditing. Includes tools for monitor mode (airmon-ng), packet capturing (airodump-ng), packet injection/deauth (aireplay-ng), and password cracking (aircrack-ng). Essential for WiFi pentesting.',
    category: 'wireless-attacks',
    difficulty: 'intermediate',
    tags: ['wifi', 'wpa', 'wep', 'wireless', 'must-know'],
    commands: [
      { command: 'airmon-ng start wlan0', description: 'Enable monitor mode on wireless interface to capture raw 802.11 frames' },
      { command: 'airmon-ng check kill', description: 'Kill interfering processes (NetworkManager, wpa_supplicant) before starting monitor mode' },
      { command: 'airodump-ng wlan0mon', description: 'Scan for all nearby wireless networks to identify targets (BSSID, channel, encryption)' },
      { command: 'airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon', description: 'Focus on a specific target AP on channel 6 and write captured packets to a file' },
      { command: 'aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c CLIENT_MAC wlan0mon', description: 'Send 5 Deauthentication packets to force a client to reconnect, capturing the 4-way handshake' },
      { command: 'aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap', description: 'Perform offline dictionary attack against the captured WPA/WPA2 handshake' },
      { command: 'aireplay-ng -3 -b AA:BB:CC:DD:EE:FF wlan0mon', description: 'ARP replay attack to rapidly generate initialization vectors (IVs) for WEP cracking' },
    ],
    whenToUse: [
      'At the core of any wireless network security assessment or pentest',
      'To verify if WPA/WPA2 pre-shared keys are susceptible to dictionary attacks',
      'To passively capture wireless handshakes for offline cracking',
      'When auditing legacy systems still utilizing vulnerable WEP encryption',
    ],
    commonFlags: [
      { flag: '-w', description: 'Path to wordlist for WPA cracking (aircrack-ng)' },
      { flag: '-c', description: 'Channel to listen on (airodump-ng)' },
      { flag: '--bssid', description: 'MAC address of target access point (airodump-ng)' },
      { flag: '-0', description: 'Deauthentication attack mode (aireplay-ng)' },
      { flag: '-a', description: 'BSSID of the Access Point (aireplay-ng)' },
      { flag: '-c', description: 'MAC of the specific client to deauth (aireplay-ng)' },
    ],
    relatedTools: ['wifite', 'fern-wifi-cracker', 'kismet', 'hashcat'],
    installation: 'sudo apt install aircrack-ng -y',
    website: 'https://www.aircrack-ng.org',
    interactiveCommands: [
      {
        name: 'Aircrack-ng WPA/WEP Crack Builder',
        description: 'Build a complete wireless cracking workflow from monitor mode setup through handshake capture to password cracking.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['Crack Handshake (aircrack-ng)', 'Start Monitor Mode (airmon-ng)', 'Capture Handshake (airodump-ng)', 'Deauth Client (aireplay-ng)'], defaultValue: 'Crack Handshake (aircrack-ng)' },
          { id: 'interface', label: 'Wireless Interface', type: 'text', defaultValue: 'wlan0mon', placeholder: 'e.g., wlan0, wlan0mon' },
          { id: 'bssid', label: 'Target BSSID (AP MAC)', type: 'text', defaultValue: '', placeholder: 'e.g., AA:BB:CC:DD:EE:FF' },
          { id: 'channel', label: 'Channel', type: 'text', defaultValue: '6', placeholder: 'AP channel number' },
          { id: 'capFile', label: 'Capture File', type: 'text', defaultValue: 'capture-01.cap', placeholder: '.cap file with handshake' },
          { id: 'wordlist', label: 'Wordlist', type: 'select', options: ['/usr/share/wordlists/rockyou.txt', '/usr/share/seclists/Passwords/WiFi-WPA/probable-v2-wpa-top4800.txt', 'Custom'], defaultValue: '/usr/share/wordlists/rockyou.txt' },
          { id: 'customWordlist', label: 'Custom Wordlist', type: 'text', defaultValue: '', placeholder: 'Path to custom wordlist' }
        ],
        generator: (inputs) => {
          const wl = inputs.wordlist === 'Custom' && inputs.customWordlist ? inputs.customWordlist : inputs.wordlist;
          if (inputs.action.includes('aircrack-ng')) return `aircrack-ng -w ${wl} ${inputs.capFile}`;
          if (inputs.action.includes('airmon-ng')) return `airmon-ng check kill && airmon-ng start ${inputs.interface}`;
          if (inputs.action.includes('airodump-ng')) return `airodump-ng -c ${inputs.channel} --bssid ${inputs.bssid} -w capture ${inputs.interface}`;
          return `aireplay-ng -0 5 -a ${inputs.bssid} ${inputs.interface}`;
        }
      }
    ]
  },
  {
    id: 'wifite',
    name: 'Wifite',
    description: 'Automated wireless attack wrapper that simplifies the entire auditing process into a seamless execution. Automatically handles monitor mode, scans for targets, sorts by signal strength, and executes WEP/WPA/WPS attacks in sequence without manual intervention.',
    category: 'wireless-attacks',
    difficulty: 'beginner',
    tags: ['wifi', 'automation', 'wpa', 'wep', 'wps'],
    commands: [
      { command: 'wifite', description: 'Start Wifite interactive wizard — scans all networks and prompts for target selection' },
      { command: 'wifite --wpa --dict /usr/share/wordlists/rockyou.txt', description: 'Target only WPA/WPA2 networks and auto-crack using rockyou' },
      { command: 'wifite -e "Corporate_WiFi"', description: 'Automatically attack a specific ESSID without prompting' },
      { command: 'wifite --kill', description: 'Kill interfering background processes (NetworkManager) before starting' },
      { command: 'wifite --wps-only', description: 'Focus exclusively on WPS vulnerabilities (PixieDust and PIN brute-force)' },
    ],
    whenToUse: [
      'For rapid, automated wireless audits when time is a constraint',
      'To execute complex Aircrack-ng/Reaver attack chains automatically',
      'When auditing multiple wireless networks in sequence automatically',
      'To quickly validate if default WPS PINs or weak WPA passwords are in use',
    ],
    commonFlags: [
      { flag: '--wpa', description: 'Only target WPA/WPA2 networks' },
      { flag: '--wep', description: 'Only target WEP networks' },
      { flag: '--wps', description: 'Only target WPS-enabled networks' },
      { flag: '--dict', description: 'Specific wordlist to use for WPA cracking' },
      { flag: '-e', description: 'Target a specific ESSID (network name)' },
      { flag: '--kill', description: 'Kill conflicting background processes' },
    ],
    relatedTools: ['aircrack-ng', 'fern-wifi-cracker', 'reaver'],
    installation: 'sudo apt install wifite -y',
    website: 'https://github.com/derv82/wifite2',
    interactiveCommands: [
      {
        name: 'Wifite Auto-Pwn Builder',
        description: 'Configure automated WEP, WPA, and WPS attacks with specific dictionaries and targets.',
        inputs: [
          { id: 'targetType', label: 'Target Filter', type: 'select', options: ['All Networks', 'WPA/WPA2 Only (--wpa)', 'WEP Only (--wep)', 'WPS Only (--wps)'], defaultValue: 'All Networks' },
          { id: 'essid', label: 'Specific ESSID (-e)', type: 'text', defaultValue: '', placeholder: 'Leave blank to scan all' },
          { id: 'bssid', label: 'Specific BSSID (-b)', type: 'text', defaultValue: '', placeholder: 'Leave blank to scan all' },
          { id: 'wordlist', label: 'Wordlist (--dict)', type: 'text', defaultValue: '/usr/share/wordlists/rockyou.txt', placeholder: 'Path to custom wordlist' },
          { id: 'kill', label: 'Kill Conflicting (--kill)', type: 'checkbox', defaultValue: 'true', placeholder: 'Kill NetworkManager/wpa_supplicant' },
          { id: 'wpsOnly', label: 'WPS PixieDust Only (--wps-only)', type: 'checkbox', defaultValue: 'false', placeholder: 'Fastest attack method' },
          { id: 'noPmkid', label: 'Disable PMKID (--no-pmkid)', type: 'checkbox', defaultValue: 'false', placeholder: 'Skip clientless PMKID attacks' }
        ],
        generator: (inputs) => {
          let cmd = 'wifite';
          
          if (inputs.kill === 'true') cmd += ' --kill';
          if (inputs.targetType === 'WPA/WPA2 Only (--wpa)') cmd += ' --wpa';
          if (inputs.targetType === 'WEP Only (--wep)') cmd += ' --wep';
          if (inputs.targetType === 'WPS Only (--wps)') cmd += ' --wps';
          if (inputs.wpsOnly === 'true') cmd += ' --wps-only';
          if (inputs.noPmkid === 'true') cmd += ' --no-pmkid';
          
          if (inputs.essid) cmd += ` -e "${inputs.essid}"`;
          if (inputs.bssid) cmd += ` -b ${inputs.bssid}`;
          if (inputs.wordlist !== '/usr/share/wordlists/rockyou.txt' || inputs.targetType.includes('WPA')) cmd += ` --dict ${inputs.wordlist}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'reaver',
    name: 'Reaver',
    description: 'Advanced WPS brute-force tool that exploits the WiFi Protected Setup PIN vulnerability. It can recover the plaintext WPA/WPA2 passphrase by exhaustively guessing the 8-digit WPS PIN, bypassing complex passwords entirely. Also supports PixieDust offline attacks for instant cracking.',
    category: 'wireless-attacks',
    difficulty: 'intermediate',
    tags: ['wifi', 'wps', 'brute-force', 'pin', 'pixiedust'],
    commands: [
      { command: 'reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv', description: 'Standard WPS PIN online brute-force (can take hours/days)' },
      { command: 'reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv -K 1', description: 'Execute PixieDust offline attack — can recover the PIN in seconds on vulnerable chipsets' },
      { command: 'wash -i wlan0mon', description: 'Scan for nearby Access Points with WPS enabled and check if they are locked' },
      { command: 'reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -d 5', description: 'Target specific channel and add a 5-second delay between attempts to avoid AP lockouts' },
    ],
    whenToUse: [
      'When a target router has WPS enabled (discovered via wash)',
      'To bypass extremely complex WPA/WPA2 passwords by attacking the weaker 8-digit PIN',
      'To perform lightning-fast offline PixieDust attacks against vulnerable Ralink/Broadcom/Realtek chips',
    ],
    commonFlags: [
      { flag: '-i', description: 'Monitor mode interface to use' },
      { flag: '-b', description: 'BSSID (MAC address) of the target AP' },
      { flag: '-c', description: 'Channel of the target AP' },
      { flag: '-K 1', description: 'Run the PixieDust offline attack (requires pixiewps)' },
      { flag: '-vv', description: 'Double verbose mode to see exact PINs being tried' },
      { flag: '-d', description: 'Delay between PIN attempts to prevent AP rate-limiting' },
    ],
    relatedTools: ['bully', 'aircrack-ng', 'pixiewps'],
    installation: 'sudo apt install reaver pixiewps -y',
    website: 'https://github.com/t6x/reaver-wps-fork-t6x',
    interactiveCommands: [
      {
        name: 'Reaver WPS Exploiter',
        description: 'Configure WPS PIN brute-force or ultra-fast offline PixieDust attacks.',
        inputs: [
          { id: 'interface', label: 'Monitor Interface (-i)', type: 'text', defaultValue: 'wlan0mon', placeholder: 'Must be monitor mode' },
          { id: 'bssid', label: 'Target BSSID (-b)', type: 'text', defaultValue: '', placeholder: 'AP MAC address' },
          { id: 'channel', label: 'Channel (-c)', type: 'text', defaultValue: '', placeholder: 'Lock to channel' },
          { id: 'pixiedust', label: 'PixieDust Attack (-K 1)', type: 'checkbox', defaultValue: 'true', placeholder: 'Offline PIN crack (fastest)' },
          { id: 'delay', label: 'Delay (-d)', type: 'text', defaultValue: '0', placeholder: 'Seconds between PIN attempts' },
          { id: 'noNacks', label: 'No NACKs (-N)', type: 'checkbox', defaultValue: 'true', placeholder: 'Ignore NACKs (increases stability)' },
          { id: 'verbose', label: 'Verbose (-vv)', type: 'checkbox', defaultValue: 'true', placeholder: 'Show PINs being tried' }
        ],
        generator: (inputs) => {
          let cmd = `reaver -i ${inputs.interface}`;
          
          if (inputs.bssid) cmd += ` -b ${inputs.bssid}`;
          if (inputs.channel) cmd += ` -c ${inputs.channel}`;
          if (inputs.pixiedust === 'true') cmd += ' -K 1';
          if (inputs.delay && inputs.delay !== '0') cmd += ` -d ${inputs.delay}`;
          if (inputs.noNacks === 'true') cmd += ' -N';
          if (inputs.verbose === 'true') cmd += ' -vv';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'bettercap',
    name: 'Bettercap',
    description: 'The "Swiss Army Knife" for network attacks and monitoring. A powerful, highly extensible framework that replaces ettercap. Features WiFi reconnaissance, Bluetooth Low Energy (BLE) auditing, ARP spoofing, DNS poisoning, and full packet manipulation via an interactive command shell.',
    category: 'wireless-attacks',
    difficulty: 'advanced',
    tags: ['network', 'mitm', 'wifi', 'bluetooth', 'arp', 'framework'],
    commands: [
      { command: 'bettercap -iface eth0', description: 'Start Bettercap interactive session on a specific interface' },
      { command: 'net.probe on', description: 'Actively discover hosts on the local network (sends UDP packets to every IP)' },
      { command: 'net.show', description: 'Display a table of all discovered local network hosts' },
      { command: 'set arp.spoof.targets 192.168.1.100; arp.spoof on', description: 'Perform targeted ARP spoofing to intercept traffic' },
      { command: 'net.sniff on', description: 'Capture HTTP requests, credentials, and sensitive data from spoofed targets' },
      { command: 'wifi.recon on', description: 'Start 802.11 wireless discovery (requires monitor mode)' },
      { command: 'wifi.deauth AA:BB:CC:DD:EE:FF', description: 'Broadcast deauthentication frames to a specific BSSID' },
      { command: 'ble.recon on', description: 'Discover nearby Bluetooth Low Energy (BLE) devices' },
    ],
    whenToUse: [
      'For sophisticated Man-In-The-Middle (MITM) attacks and credential harvesting',
      'To actively intercept and modify HTTP/DNS traffic on a local network',
      'To audit BLE (Bluetooth Low Energy) devices and smart peripherals',
      'When you need a unified, scriptable platform (caplets) for complex network attacks',
    ],
    commonFlags: [
      { flag: '-iface', description: 'Network interface to bind to' },
      { flag: '-eval', description: 'Run Bettercap commands automatically on startup' },
      { flag: '-caplet', description: 'Load a predefined script of commands (caplet)' },
      { flag: 'net.probe on', description: 'Actively probe the network for new hosts' },
      { flag: 'wifi.recon on', description: 'Start 802.11 wireless discovery' },
    ],
    relatedTools: ['ettercap', 'mitmf', 'arpspoof'],
    installation: 'sudo apt install bettercap -y',
    website: 'https://www.bettercap.org',
    interactiveCommands: [
      {
        name: 'Bettercap Attack Orchestrator',
        description: 'Build Bettercap launch commands with caplet loading, interface selection, ARP spoofing, and module activation.',
        inputs: [
          { id: 'interface', label: 'Interface (-iface)', type: 'text', defaultValue: 'eth0', placeholder: 'e.g., eth0, wlan0mon' },
          { id: 'caplet', label: 'Caplet Script', type: 'select', options: ['None (Interactive)', 'http-ui', 'hstshijack/hstshijack', 'Custom'], defaultValue: 'None (Interactive)' },
          { id: 'customCaplet', label: 'Custom Caplet Path', type: 'text', defaultValue: '', placeholder: 'e.g., /path/to/my.cap' },
          { id: 'evalCmd', label: 'Auto-Run Commands (-eval)', type: 'select', options: ['None', 'net.probe on; net.sniff on', 'arp.spoof on; net.sniff on', 'wifi.recon on', 'ble.recon on'], defaultValue: 'None', helpText: 'Commands to execute automatically on startup' },
          { id: 'arpTarget', label: 'ARP Spoof Target', type: 'text', defaultValue: '', placeholder: 'e.g., 192.168.1.100 (only with arp.spoof)' },
          { id: 'noHistory', label: 'No History (-no-history)', type: 'checkbox', defaultValue: 'false', placeholder: 'Do not log command history' },
          { id: 'silent', label: 'Silent Mode (-silent)', type: 'checkbox', defaultValue: 'false', placeholder: 'Suppress non-error output' }
        ],
        generator: (inputs) => {
          const caplet = inputs.caplet === 'Custom' && inputs.customCaplet ? ` -caplet ${inputs.customCaplet}` : inputs.caplet !== 'None (Interactive)' ? ` -caplet ${inputs.caplet}` : '';
          let evalCmd = '';
          if (inputs.evalCmd !== 'None') {
            let cmd = inputs.evalCmd;
            if (inputs.arpTarget && cmd.includes('arp.spoof')) cmd = `set arp.spoof.targets ${inputs.arpTarget}; ${cmd}`;
            evalCmd = ` -eval "${cmd}"`;
          }
          let extra = '';
          if (inputs.noHistory === 'true') extra += ' -no-history';
          if (inputs.silent === 'true') extra += ' -silent';
          return `bettercap -iface ${inputs.interface}${caplet}${evalCmd}${extra}`;
        }
      }
    ]
  },
  {
    id: 'kismet',
    name: 'Kismet',
    description: 'Passive wireless network detector, sniffer, and intrusion detection system (WIDS). Operates entirely in stealth, never transmitting packets. Maps local WiFi topography, detects hidden networks, captures PCAP files for later analysis, and logs GPS coordinates for wardriving.',
    category: 'wireless-attacks',
    difficulty: 'intermediate',
    tags: ['wifi', 'wardriving', 'sniffing', 'detection', 'passive'],
    commands: [
      { command: 'kismet -c wlan0mon', description: 'Launch Kismet using a specific monitor mode interface' },
      { command: 'kismet -t kismet-server -c wlan0mon --no-ncurses', description: 'Run completely headless as a background daemon capturing data' },
      { command: 'kismet -c wlan0mon -p /root/captures/', description: 'Start Kismet and log all captured packets to a specific directory' },
    ],
    whenToUse: [
      'For completely passive, undetectable wireless network discovery',
      'During physical red-team operations conducting wardriving with GPS receivers to map corporate WiFi footprints',
      'To act as a Wireless Intrusion Detection System (WIDS), identifying rogue APs or ongoing deauth attacks',
      'To discover hidden (non-broadcasting) SSIDs by passively monitoring client associations',
    ],
    commonFlags: [
      { flag: '-c', description: 'Data source interface (e.g., wlan0mon)' },
      { flag: '-t', description: 'Start as a background server daemon' },
      { flag: '--no-ncurses', description: 'Disable the terminal UI (run headless)' },
      { flag: '-p', description: 'Path to save packet capture (pcapng) files' },
    ],
    relatedTools: ['aircrack-ng', 'wireshark', 'hcxdumptool'],
    installation: 'sudo apt install kismet -y',
    website: 'https://www.kismetwireless.net/',
    interactiveCommands: [
      {
        name: 'Kismet Passive Reconnaissance',
        description: 'Configure passive wireless sniffing, GPS wardriving, and intrusion detection.',
        inputs: [
          { id: 'interface', label: 'Interface (-c)', type: 'text', defaultValue: 'wlan0mon', placeholder: 'Wireless interface' },
          { id: 'daemon', label: 'Run as Daemon (-t)', type: 'checkbox', defaultValue: 'false', placeholder: 'Run in background' },
          { id: 'noNcurses', label: 'Headless Mode (--no-ncurses)', type: 'checkbox', defaultValue: 'true', placeholder: 'Disable CLI UI' },
          { id: 'logDir', label: 'Log Directory (-p)', type: 'text', defaultValue: '/root/captures/', placeholder: 'Save pcapng files here' },
          { id: 'config', label: 'Custom Config (-f)', type: 'text', defaultValue: '', placeholder: 'e.g., /etc/kismet/kismet.conf' },
          { id: 'override', label: 'Override Params', type: 'text', defaultValue: '', placeholder: 'e.g., gps=true' }
        ],
        generator: (inputs) => {
          let cmd = `kismet -c ${inputs.interface}`;
          
          if (inputs.daemon === 'true') cmd += ' -t kismet-server';
          if (inputs.noNcurses === 'true') cmd += ' --no-ncurses';
          if (inputs.logDir) cmd += ` -p ${inputs.logDir}`;
          if (inputs.config) cmd += ` -f ${inputs.config}`;
          if (inputs.override) cmd += ` --override ${inputs.override}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'fern-wifi-cracker',
    name: 'Fern WiFi Cracker',
    description: 'A GUI-based wireless security auditing and attack program written in Python. It wraps standard command-line tools like Aircrack-ng and Reaver into an intuitive visual dashboard. Excellent for managing captured WPA/WEP keys via its internal SQLite database.',
    category: 'wireless-attacks',
    difficulty: 'beginner',
    tags: ['wifi', 'gui', 'cracking', 'automation'],
    commands: [
      { command: 'fern-wifi-cracker', description: 'Launch the GUI interface as root' },
    ],
    whenToUse: [
      'For operators who prefer a visual dashboard over command-line execution',
      'To automatically manage and archive captured WPA/WEP keys in an internal SQLite database',
      'To execute dictionary attacks visually and track cracking progress effortlessly',
    ],
    commonFlags: [],
    relatedTools: ['wifite', 'aircrack-ng'],
    installation: 'sudo apt install fern-wifi-cracker -y',
    website: 'https://github.com/savio-code/fern-wifi-cracker',
    interactiveCommands: [
      {
        name: 'Fern GUI Launcher',
        description: 'Launch the Fern WiFi Cracker GUI with optional debugging features.',
        inputs: [
          { id: 'cli', label: 'Launch Command', type: 'text', defaultValue: 'fern-wifi-cracker', placeholder: 'Runs the GUI tool' },
          { id: 'debug', label: 'Debug Mode', type: 'checkbox', defaultValue: 'false', placeholder: 'Show backend errors in console' },
          { id: 'root', label: 'Run as Root', type: 'checkbox', defaultValue: 'true', placeholder: 'Required for packet injection' },
          { id: 'interface', label: 'Pre-select Interface', type: 'text', defaultValue: '', placeholder: 'Set default wlan0' },
          { id: 'database', label: 'Custom DB', type: 'text', defaultValue: '', placeholder: 'Path to sqlite db' },
          { id: 'log', label: 'Log Output', type: 'text', defaultValue: '', placeholder: 'Console log file' }
        ],
        generator: (inputs) => {
          let cmd = inputs.root === 'true' ? 'sudo ' : '';
          cmd += inputs.cli;
          
          if (inputs.debug === 'true') cmd += ' --debug';
          if (inputs.interface) cmd += ` -i ${inputs.interface}`;
          if (inputs.database) cmd += ` --db ${inputs.database}`;
          if (inputs.log) cmd += ` > ${inputs.log} 2>&1`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'fluxion',
    name: 'Fluxion',
    description: 'Automated Evil Twin and social engineering tool. When brute-forcing a WPA handshake fails due to a strong password, Fluxion jams the original AP, forces clients to disconnect, and spins up a cloned rogue AP. It serves a captive portal tricking users into entering their WiFi password to "re-authenticate".',
    category: 'wireless-attacks',
    difficulty: 'intermediate',
    tags: ['wifi', 'evil-twin', 'social-engineering', 'phishing', 'captive-portal'],
    commands: [
      { command: './fluxion.sh', description: 'Start the Fluxion interactive wizard to guide through the Evil Twin setup' },
    ],
    whenToUse: [
      'When standard Hashcat offline cracking fails due to high password complexity',
      'To create a highly convincing rogue access point (Evil Twin) mirroring a target SSID',
      'To capture plaintext WPA credentials via targeted phishing captive portals',
    ],
    commonFlags: [],
    relatedTools: ['wifiphisher', 'hostapd-wpe', 'bettercap'],
    installation: 'git clone https://github.com/FluxionNetwork/fluxion.git && cd fluxion && sudo ./fluxion.sh -i',
    website: 'https://github.com/FluxionNetwork/fluxion',
    interactiveCommands: [
      {
        name: 'Fluxion Evil Twin Orchestrator',
        description: 'Launch Fluxion with pre-configured flags or auto-install missing dependencies.',
        inputs: [
          { id: 'install', label: 'Check Dependencies (-i)', type: 'checkbox', defaultValue: 'false', placeholder: 'Install missing deps' },
          { id: 'debug', label: 'Debug Mode (-d)', type: 'checkbox', defaultValue: 'false', placeholder: 'Show script execution details' },
          { id: 'workspace', label: 'Workspace Path (-w)', type: 'text', defaultValue: '', placeholder: 'Save captures here' },
          { id: 'interface', label: 'Target Interface', type: 'text', defaultValue: '', placeholder: 'Skip interface prompt' },
          { id: 'language', label: 'Language', type: 'select', options: ['en', 'es', 'fr', 'de'], defaultValue: 'en' },
          { id: 'skipChecks', label: 'Skip Root Checks', type: 'checkbox', defaultValue: 'false', placeholder: 'Bypass root enforcement' }
        ],
        generator: (inputs) => {
          let cmd = './fluxion.sh';
          
          if (inputs.install === 'true') cmd += ' -i';
          if (inputs.debug === 'true') cmd += ' -d';
          if (inputs.workspace) cmd += ` -w ${inputs.workspace}`;
          if (inputs.interface) cmd += ` --iface ${inputs.interface}`;
          if (inputs.language !== 'en') cmd += ` --lang ${inputs.language}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'mdk4',
    name: 'mdk4',
    description: 'An advanced proof-of-concept tool to exploit common IEEE 802.11 protocol weaknesses. It can perform mass authentication Denial of Service (DoS), beacon flooding to create thousands of fake APs, massive Deauthentication routing, and WIDS/WIPS confusion attacks.',
    category: 'wireless-attacks',
    difficulty: 'advanced',
    tags: ['wifi', 'dos', 'fuzzing', 'jamming', '802.11'],
    commands: [
      { command: 'mdk4 wlan0mon a -a AP_MAC', description: 'Authentication Denial of Service — floods the AP with auth requests to exhaust its client table' },
      { command: 'mdk4 wlan0mon b -n "FakeAP"', description: 'Beacon flooding — creates hundreds of fake APs to crash/confuse nearby scanners and clients' },
      { command: 'mdk4 wlan0mon d -c 6', description: 'Mass Deauthentication/Disassociation routing on channel 6 — knocks all clients offline' },
      { command: 'mdk4 wlan0mon w -e AP_MAC', description: 'WIDS/WIPS confusion attack — generates fake intrusion alerts to overwhelm security systems' },
    ],
    whenToUse: [
      'To brutally stress-test wireless infrastructure stability and resilience against DoS',
      'For targeted WiFi network jamming and evaluating client roaming behavior during DoS',
      'To flood environments and test the effectiveness of Wireless Intrusion Prevention Systems (WIPS)',
    ],
    commonFlags: [
      { flag: 'a', description: 'Authentication Denial of Service mode' },
      { flag: 'b', description: 'Beacon flooding mode (fake APs)' },
      { flag: 'd', description: 'Deauthentication/Disassociation mode' },
      { flag: 'w', description: 'WIDS/WIPS confusion mode' },
      { flag: '-c', description: 'Specific channel to target' },
    ],
    relatedTools: ['aireplay-ng', 'bettercap'],
    installation: 'sudo apt install mdk4 -y',
    website: 'https://github.com/aircrack-ng/mdk4',
    interactiveCommands: [
      {
        name: 'mdk4 Infrastructure Attacker',
        description: 'Design massive DoS attacks targeting WiFi infrastructure (auth DoS, beacon flooding, deauth).',
        inputs: [
          { id: 'interface', label: 'Monitor Interface', type: 'text', defaultValue: 'wlan0mon', placeholder: 'Must be monitor mode' },
          { id: 'mode', label: 'Attack Mode', type: 'select', options: ['Auth DoS (a)', 'Beacon Flood (b)', 'Deauth/Disassoc (d)', 'WIDS/WIPS Confusion (w)'], defaultValue: 'Auth DoS (a)' },
          { id: 'apMac', label: 'Target AP MAC (-a/-e)', type: 'text', defaultValue: '', placeholder: 'e.g., AA:BB:CC:DD:EE:FF' },
          { id: 'channel', label: 'Channel (-c)', type: 'text', defaultValue: '', placeholder: 'Target specific channel' },
          { id: 'speed', label: 'Speed (-s)', type: 'text', defaultValue: '1000', placeholder: 'Packets per second' },
          { id: 'ssid', label: 'Custom SSID (-n)', type: 'text', defaultValue: 'FakeAP', placeholder: 'For beacon flooding' },
          { id: 'file', label: 'MAC/SSID List (-f)', type: 'text', defaultValue: '', placeholder: 'Path to list file' }
        ],
        generator: (inputs) => {
          let cmd = `mdk4 ${inputs.interface}`;
          
          if (inputs.mode === 'Auth DoS (a)') {
            cmd += ' a';
            if (inputs.apMac) cmd += ` -a ${inputs.apMac}`;
            if (inputs.speed && inputs.speed !== '1000') cmd += ` -s ${inputs.speed}`;
          } else if (inputs.mode === 'Beacon Flood (b)') {
            cmd += ' b';
            if (inputs.ssid) cmd += ` -n "${inputs.ssid}"`;
            if (inputs.file) cmd += ` -f ${inputs.file}`;
            if (inputs.speed && inputs.speed !== '1000') cmd += ` -s ${inputs.speed}`;
          } else if (inputs.mode === 'Deauth/Disassoc (d)') {
            cmd += ' d';
            if (inputs.channel) cmd += ` -c ${inputs.channel}`;
            if (inputs.file) cmd += ` -b ${inputs.file}`; // blacklist file
          } else if (inputs.mode === 'WIDS/WIPS Confusion (w)') {
            cmd += ' w';
            if (inputs.apMac) cmd += ` -e ${inputs.apMac}`;
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'airodump-ng',
    name: 'Airodump-ng',
    description: 'The packet capture component of the Aircrack-ng suite. It captures raw 802.11 frames, displaying all nearby access points with their BSSID, ESSID, channel, signal strength, encryption type, and connected clients. The foundational wireless reconnaissance tool.',
    category: 'wireless-attacks',
    difficulty: 'beginner',
    tags: ['wifi', 'packet-capture', 'reconnaissance', 'wpa-handshake'],
    commands: [
      { command: 'airmon-ng start wlan0', description: 'FIRST: Put wireless card into monitor mode (creates wlan0mon interface)' },
      { command: 'airodump-ng wlan0mon', description: 'Scan all channels for nearby access points and clients' },
      { command: 'airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon', description: 'Lock to channel 6, target a specific AP, and save all captured frames to a file' },
      { command: 'airodump-ng --manufacturer --uptime --wps wlan0mon', description: 'Enhanced display: show hardware manufacturer, AP uptime, and WPS status' },
      { command: 'airodump-ng --output-format csv wlan0mon -w scan', description: 'Save scan results to CSV for analysis or mapping tools' },
      { command: 'airodump-ng --band abg wlan0mon', description: 'Scan on 2.4GHz (bg) AND 5GHz (a) bands simultaneously' },
      { command: 'airodump-ng -c 1,6,11 wlan0mon', description: 'Only hop between channels 1, 6, and 11 (most common WiFi channels)' },
      { command: 'airodump-ng --essid "TargetNetwork" wlan0mon', description: 'Filter output to only show APs matching a specific SSID name' },
      { command: 'airodump-ng --output-format pcap -w evidence wlan0mon', description: 'Save raw packet capture in PCAP format for analysis in Wireshark' },
    ],
    whenToUse: [
      'To identify all nearby wireless networks and their clients before targeting a specific one',
      'To capture a WPA/WPA2 4-way authentication handshake (triggered by a deauth attack)',
      'To passively discover hidden SSIDs by monitoring client probe frames',
      'For wireless site surveys identifying channel congestion and signal strengths',
    ],
    commonFlags: [
      { flag: '-c', description: 'Lock to a specific channel (stops multi-channel hopping)' },
      { flag: '--bssid', description: 'Filter output to a specific Access Point MAC address' },
      { flag: '-w', description: 'Write captured frames to a .cap file' },
      { flag: '--manufacturer', description: 'Show OUI manufacturer info for BSSIDs' },
      { flag: '--wps', description: 'Show WPS status for detected APs' },
      { flag: '--band', description: 'Specify band(s) to scan: a (5GHz), b/g (2.4GHz), or abg (both)' },
      { flag: '--essid', description: 'Filter by a specific SSID name' },
      { flag: '--output-format', description: 'Output format: csv, pcap, kismet, etc.' },
    ],
    outputExample: [
      ' BSSID              PWR  Beacons    #Data  CH  ENC  ESSID',
      '',
      ' AA:BB:CC:DD:EE:FF  -45      312       0   6  WPA2  TargetNetwork',
      ' 11:22:33:44:55:66  -67      241      42   1  WPA2  HomeRouter',
      '',
      ' BSSID              STATION            PWR   Rate   Frames  Probe',
      '',
      ' AA:BB:CC:DD:EE:FF  FF:EE:DD:CC:BB:AA  -55   54e   6      TargetNetwork'
    ],
    relatedTools: ['aircrack-ng', 'aireplay-ng', 'hashcat'],
    installation: 'sudo apt install aircrack-ng -y',
    website: 'https://www.aircrack-ng.org/doku.php?id=airodump-ng',
    interactiveCommands: [
      {
        name: 'Airodump-ng Capture Builder',
        description: 'Configure wireless reconnaissance and handshake capture with channel selection, filtering, and output options.',
        inputs: [
          { id: 'interface', label: 'Monitor Interface', type: 'text', defaultValue: 'wlan0mon', placeholder: 'Must be in monitor mode' },
          { id: 'mode', label: 'Scan Mode', type: 'select', options: ['Full Scan (All Channels)', 'Targeted AP Capture'], defaultValue: 'Full Scan (All Channels)' },
          { id: 'bssid', label: 'Target BSSID (--bssid)', type: 'text', defaultValue: '', placeholder: 'e.g., AA:BB:CC:DD:EE:FF' },
          { id: 'channel', label: 'Channel (-c)', type: 'text', defaultValue: '', placeholder: 'e.g., 6 or 1,6,11' },
          { id: 'band', label: 'Band (--band)', type: 'select', options: ['bg (2.4GHz Default)', 'a (5GHz)', 'abg (Both)'], defaultValue: 'bg (2.4GHz Default)' },
          { id: 'writeFile', label: 'Output File Prefix (-w)', type: 'text', defaultValue: '', placeholder: 'e.g., capture' },
          { id: 'outputFormat', label: 'Output Format', type: 'select', options: ['Default (All)', 'csv', 'pcap', 'kismet'], defaultValue: 'Default (All)' },
          { id: 'showExtra', label: 'Extra Display', type: 'checkbox', defaultValue: 'false', placeholder: 'Show manufacturer, WPS, uptime' }
        ],
        generator: (inputs) => {
          const bssid = inputs.bssid ? ` --bssid ${inputs.bssid}` : '';
          const channel = inputs.channel ? ` -c ${inputs.channel}` : '';
          const band = inputs.band !== 'bg (2.4GHz Default)' ? ` --band ${inputs.band.split(' ')[0]}` : '';
          const write = inputs.writeFile ? ` -w ${inputs.writeFile}` : '';
          const format = inputs.outputFormat !== 'Default (All)' ? ` --output-format ${inputs.outputFormat}` : '';
          const extra = inputs.showExtra === 'true' ? ' --manufacturer --wps --uptime' : '';
          return `airodump-ng${channel}${bssid}${band}${write}${format}${extra} ${inputs.interface}`;
        }
      }
    ]
  },
  {
    id: 'aireplay-ng',
    name: 'Aireplay-ng',
    description: 'The packet injection and replay component of the Aircrack-ng suite. It performs a variety of attacks on wireless networks including deauthentication attacks, fake authentication, ARP replay, and Caffe-Latte attacks to actively capture WPA handshakes or generate WEP IVs.',
    category: 'wireless-attacks',
    difficulty: 'intermediate',
    tags: ['wifi', 'injection', 'deauth', 'wpa-handshake', 'wep'],
    commands: [
      { command: 'aireplay-ng -0 5 -a AP_MAC -c CLIENT_MAC wlan0mon', description: 'DEAUTH ATTACK: Send 5 deauthentication frames to kick a client off. Client reconnects = handshake captured' },
      { command: 'aireplay-ng -0 0 -a AP_MAC wlan0mon', description: 'Continuous broadcast deauth — kick ALL clients off the AP indefinitely (DoS mode)' },
      { command: 'aireplay-ng -1 0 -a AP_MAC -h YOUR_MAC wlan0mon', description: 'Fake Authentication: associate your card with the AP without knowing the passphrase (needed before injection)' },
      { command: 'aireplay-ng -3 -b AP_MAC -h YOUR_MAC wlan0mon', description: 'ARP Replay Attack: capture and replay ARP packets to rapidly generate WEP initialization vectors' },
      { command: 'aireplay-ng -9 wlan0mon', description: 'Injection test: verify your wireless card supports packet injection' },
      { command: 'aireplay-ng -2 -p 0841 -c FF:FF:FF:FF:FF:FF -b AP_MAC wlan0mon', description: 'Interactive packet replay: choose a specific packet to replay for IV generation (WEP)' },
      { command: 'aireplay-ng -5 -b AP_MAC wlan0mon', description: 'Fragmentation Attack: capture a PRGA (keystream fragment) for WEP decryption' },
      { command: 'aireplay-ng -6 -b AP_MAC -h YOUR_MAC wlan0mon', description: 'Caffe-Latte Attack: exploit client probe requests to recover WEP keys without the AP' },
    ],
    whenToUse: [
      'To force a WPA/WPA2 client to reconnect so airodump-ng can capture the 4-way handshake',
      'During WEP cracking to rapidly generate the thousands of IVs needed for the attack',
      'To test if your wireless adapter supports raw packet injection before starting other attacks',
      'To perform a Caffe-Latte attack against roaming clients looking for their home network',
    ],
    commonFlags: [
      { flag: '-0', description: 'Deauthentication attack (specify count, 0 = infinite)' },
      { flag: '-1', description: 'Fake authentication attack' },
      { flag: '-2', description: 'Interactive packet replay' },
      { flag: '-3', description: 'ARP request replay attack (WEP)' },
      { flag: '-5', description: 'Fragmentation attack (WEP)' },
      { flag: '-6', description: 'Caffe-Latte attack (WEP, client-side)' },
      { flag: '-9', description: 'Injection test mode' },
      { flag: '-a', description: 'BSSID of the target Access Point' },
      { flag: '-c', description: 'MAC address of the target client to deauth' },
      { flag: '-h', description: 'Your wireless adapter\'s MAC address (source MAC for injection)' },
    ],
    outputExample: [
      'aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c FF:EE:DD:CC:BB:AA wlan0mon',
      '12:00:01  Waiting for beacon frame (BSSID: AA:BB:CC:DD:EE:FF) on channel 6',
      '12:00:01  Sending 64 directed DeAuth (code 7). STMAC: [FF:EE:DD:CC:BB:AA] [10|62 ACKs]',
      '12:00:02  Sending 64 directed DeAuth (code 7). STMAC: [FF:EE:DD:CC:BB:AA] [10|60 ACKs]',
      '12:00:03  WPA handshake: AA:BB:CC:DD:EE:FF captured!'
    ],
    relatedTools: ['airodump-ng', 'aircrack-ng', 'mdk4'],
    installation: 'sudo apt install aircrack-ng -y',
    website: 'https://www.aircrack-ng.org/doku.php?id=aireplay-ng',
    interactiveCommands: [
      {
        name: 'Aireplay-ng Injection Builder',
        description: 'Configure wireless injection attacks including deauthentication, fake authentication, ARP replay, and injection testing.',
        inputs: [
          { id: 'attack', label: 'Attack Type', type: 'select', options: ['Deauth (-0)', 'Fake Auth (-1)', 'ARP Replay (-3)', 'Fragmentation (-5)', 'Injection Test (-9)', 'Caffe-Latte (-6)'], defaultValue: 'Deauth (-0)' },
          { id: 'interface', label: 'Monitor Interface', type: 'text', defaultValue: 'wlan0mon', placeholder: 'Must be in monitor mode' },
          { id: 'apMac', label: 'Target AP BSSID (-a)', type: 'text', defaultValue: '', placeholder: 'AP MAC address' },
          { id: 'clientMac', label: 'Client MAC (-c)', type: 'text', defaultValue: '', placeholder: 'Client to deauth (optional)' },
          { id: 'yourMac', label: 'Your MAC (-h)', type: 'text', defaultValue: '', placeholder: 'Your card MAC (for fake auth/replay)' },
          { id: 'count', label: 'Packet Count', type: 'text', defaultValue: '5', placeholder: 'Number of packets (0=infinite)' }
        ],
        generator: (inputs) => {
          const attackMap: Record<string, string> = { 'Deauth (-0)': '-0', 'Fake Auth (-1)': '-1', 'ARP Replay (-3)': '-3', 'Fragmentation (-5)': '-5', 'Injection Test (-9)': '-9', 'Caffe-Latte (-6)': '-6' };
          const flag = attackMap[inputs.attack] || '-0';
          const count = flag === '-0' || flag === '-1' ? ` ${inputs.count}` : '';
          const ap = inputs.apMac ? ` -a ${inputs.apMac}` : '';
          const client = inputs.clientMac ? ` -c ${inputs.clientMac}` : '';
          const yourMac = inputs.yourMac ? ` -h ${inputs.yourMac}` : '';
          return `aireplay-ng ${flag}${count}${ap}${client}${yourMac} ${inputs.interface}`;
        }
      }
    ]
  },
  {
    id: 'wifipineapple',
    name: 'WiFi Pineapple (Hak5)',
    description: 'A purpose-built wireless auditing platform by Hak5. Masquerades as a known WiFi hotspot to lure victims into connecting automatically (KARMA/PineAP attack). Once connected, all victim traffic passes through the Pineapple, enabling credential harvesting, DNS spoofing, and man-in-the-middle attacks.',
    category: 'wireless-attacks',
    difficulty: 'intermediate',
    tags: ['evil-twin', 'mitm', 'karma', 'hardware', 'social-engineering', 'captive-portal'],
    commands: [
      { command: 'Access via http://172.16.42.1:1471 (Web UI)', description: 'The Pineapple is managed entirely via its browser-based dashboard' },
      { command: 'PineAP → Enable KARMA', description: 'Enable KARMA mode: automatically responds to every client probe request with a matching fake AP' },
      { command: 'PineAP → Beacon Responses → Add SSID List', description: 'Add a list of popular SSIDs to broadcast (Hotel WiFi, Starbucks, Google Starbucks, etc.)' },
      { command: 'Modules → SSLsplit', description: 'Install and enable SSLsplit module to intercept HTTPS traffic from connected clients' },
      { command: 'Modules → Captive Portal', description: 'Deploy a custom captive portal to harvest credentials from clients who connect' },
      { command: 'Modules → DNSspoof', description: 'Install DNSspoof module to redirect specific domains to your phishing server' },
      { command: 'Modules → Responder', description: 'Run Responder through the Pineapple to capture NTLM hashes from Windows clients' },
      { command: 'Recon → Passive Scan', description: 'Passively monitor all client probe requests to build a list of remembered WiFi networks' },
      { command: 'Filters → Client MAC Filter', description: 'Whitelist or blacklist specific client MACs to target only specific devices' },
    ],
    whenToUse: [
      'For physical social engineering operations in public spaces (hotels, airports, cafes)',
      'To demonstrate KARMA attack risks to clients — showing how corporate phones auto-connect to rogue APs',
      'During authorized red team engagements to capture employee credentials at remote offices',
      'To capture NTLM hashes from Windows laptops that auto-connect and try to authenticate to network shares',
    ],
    commonFlags: [
      { flag: 'KARMA', description: 'Responds to every client probe with a matching fake AP SSID' },
      { flag: 'PineAP', description: 'Advanced rogue AP engine with beacon flooding and association management' },
      { flag: 'Modules', description: 'Install Hak5 modules for extended functionality (DNS spoof, captive portal, etc.)' },
    ],
    relatedTools: ['fluxion', 'hostapd-wpe', 'bettercap'],
    installation: 'Hardware device — purchase WiFi Pineapple Mark VII from hak5.org',
    website: 'https://hak5.org/collections/network-pentest/products/wifi-pineapple',
    interactiveCommands: [
      {
        name: 'Pineapple Setup Commands',
        description: 'Generate standard initialization or configuration commands for Pineapple hardware.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['Connect via Web UI', 'SSH Access', 'Factory Reset', 'Firmware Upgrade', 'Start PineAP'], defaultValue: 'Connect via Web UI' },
          { id: 'ipAddress', label: 'Pineapple IP', type: 'text', defaultValue: '172.16.42.1', placeholder: 'Default is 172.16.42.1' },
          { id: 'port', label: 'Web UI Port', type: 'text', defaultValue: '1471', placeholder: 'Default is 1471' },
          { id: 'sshUser', label: 'SSH User', type: 'text', defaultValue: 'root', placeholder: 'Root user' },
          { id: 'module', label: 'Install Module', type: 'text', defaultValue: '', placeholder: 'e.g., nmap, responder' },
          { id: 'shareNet', label: 'Share Internet', type: 'checkbox', defaultValue: 'true', placeholder: 'Share host internet (wp6.sh)' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'Connect via Web UI') {
            return `firefox http://${inputs.ipAddress}:${inputs.port}`;
          } else if (inputs.action === 'SSH Access') {
            return `ssh ${inputs.sshUser}@${inputs.ipAddress}`;
          } else if (inputs.action === 'Factory Reset') {
            return `ssh ${inputs.sshUser}@${inputs.ipAddress} "firstboot -y && reboot"`;
          } else if (inputs.action === 'Firmware Upgrade') {
            return `ssh ${inputs.sshUser}@${inputs.ipAddress} "sysupgrade -n /tmp/upgrade.bin"`;
          } else if (inputs.action === 'Start PineAP') {
            return `ssh ${inputs.sshUser}@${inputs.ipAddress} "/etc/init.d/pineapd start"`;
          }
          return `echo "Pineapple commands are mostly GUI based."`;
        }
      }
    ]
  },
  {
    id: 'wifiphisher',
    name: 'Wifiphisher',
    description: 'An automated rogue access point framework that performs credential harvesting through customizable phishing scenarios. It de-auths clients from their real AP, then presents a convincing evil twin portal asking for the WiFi password, corporate credentials, or router admin password via a fake "firmware upgrade" page.',
    category: 'wireless-attacks',
    difficulty: 'intermediate',
    tags: ['evil-twin', 'phishing', 'captive-portal', 'social-engineering', 'wifi'],
    commands: [
      { command: 'wifiphisher', description: 'Launch Wifiphisher interactive wizard — select target AP, attack type, and phishing scenario' },
      { command: 'wifiphisher -e "TargetSSID" --phishing-pages', description: 'Target a specific SSID and list available phishing page templates' },
      { command: 'wifiphisher -e "CorporateWiFi" -p firmware-upgrade', description: 'Run the "Firmware Upgrade" scenario — victim sees a router upgrade page asking for WiFi key' },
      { command: 'wifiphisher -e "CorporateWiFi" -p oauth-login', description: 'Run the "OAuth Login" scenario — presents a fake Google/Office365 sign-in page' },
      { command: 'wifiphisher -e "CorporateWiFi" -p plugin_update', description: 'Run the "Plugin Update" scenario — asks victim to enter WiFi password to "install a browser plugin"' },
      { command: 'wifiphisher -e "CorporateWiFi" -p custom -pP /path/to/custom_page/', description: 'Use a fully custom phishing page directory for the captive portal' },
      { command: 'wifiphisher --nojamming -e "FreeWiFi"', description: 'Create an evil twin WITHOUT deauth jamming (passive mode, relies on stronger signal)' },
      { command: 'wifiphisher -e "CorporateWiFi" -kN', description: 'Maintain network connectivity for victim even after credential capture (stealth persistence)' },
    ],
    whenToUse: [
      'When offline dictionary attacks against WPA handshakes fail due to strong passwords',
      'For social engineering WiFi credential harvesting at physical red team engagements',
      'To demonstrate how easily non-technical users can be tricked into revealing WiFi passwords',
      'When you need a custom captive portal for corporate-branded phishing attacks',
    ],
    commonFlags: [
      { flag: '-e', description: 'Target network ESSID (name)' },
      { flag: '-p', description: 'Phishing scenario/page template to use' },
      { flag: '-pP', description: 'Path to custom phishing page directory' },
      { flag: '-aI', description: 'Access Point interface (wireless card for hosting the evil twin)' },
      { flag: '-jI', description: 'Jammer interface (wireless card for sending deauth frames)' },
      { flag: '--nojamming', description: 'Do not send deauth frames (passive evil twin)' },
      { flag: '-kN', description: 'Keep network connectivity for victim after credential capture' },
    ],
    outputExample: [
      'wifiphisher v1.4',
      '[*] Starting Rogue Access Point: "CorporateWiFi"',
      '[*] Deauthenticating clients on: AA:BB:CC:DD:EE:FF',
      '[*] DHCP server running, serving 10.0.0.0/24',
      '[+] Client 192.168.100.37 connected to Rogue AP',
      '[*] Client visited phishing page: http://10.0.0.1/',
      '[+] Credentials submitted: {"wifipassword": "Summer2024!"}'
    ],
    relatedTools: ['fluxion', 'wifi-pineapple', 'bettercap'],
    installation: 'sudo apt install wifiphisher -y',
    website: 'https://github.com/wifiphisher/wifiphisher',
    interactiveCommands: [
      {
        name: 'Wifiphisher Scenario Builder',
        description: 'Configure automated rogue AP phishing campaigns targeting corporate portals or router upgrades.',
        inputs: [
          { id: 'essid', label: 'Target ESSID (-e)', type: 'text', defaultValue: 'CorporateWiFi', placeholder: 'e.g., Free_Starbucks' },
          { id: 'scenario', label: 'Phishing Scenario (-p)', type: 'select', options: ['Interactive Selection', 'firmware-upgrade', 'oauth-login', 'plugin_update', 'custom_page'], defaultValue: 'firmware-upgrade' },
          { id: 'customPath', label: 'Custom Page Path (-pP)', type: 'text', defaultValue: '', placeholder: 'Required if scenario=custom_page' },
          { id: 'apInterface', label: 'AP Interface (-aI)', type: 'text', defaultValue: '', placeholder: 'e.g., wlan0' },
          { id: 'jamInterface', label: 'Jammer Interface (-jI)', type: 'text', defaultValue: '', placeholder: 'e.g., wlan1mon' },
          { id: 'noJamming', label: 'Passive Evil Twin (--nojamming)', type: 'checkbox', defaultValue: 'false', placeholder: 'Do not send deauth packets' },
          { id: 'keepNet', label: 'Stealth Persistence (-kN)', type: 'checkbox', defaultValue: 'false', placeholder: 'Maintain connectivity after phish' },
          { id: 'preshared', label: 'WPA Password (-pS)', type: 'text', defaultValue: '', placeholder: 'Run WPA-protected Evil Twin' }
        ],
        generator: (inputs) => {
          let cmd = 'wifiphisher';
          
          if (inputs.essid) cmd += ` -e "${inputs.essid}"`;
          
          if (inputs.scenario === 'custom_page' && inputs.customPath) {
             cmd += ` -p custom -pP ${inputs.customPath}`;
          } else if (inputs.scenario !== 'Interactive Selection') {
             cmd += ` -p ${inputs.scenario}`;
          }
          
          if (inputs.apInterface) cmd += ` -aI ${inputs.apInterface}`;
          if (inputs.jamInterface) cmd += ` -jI ${inputs.jamInterface}`;
          if (inputs.noJamming === 'true') cmd += ' --nojamming';
          if (inputs.keepNet === 'true') cmd += ' -kN';
          if (inputs.preshared) cmd += ` -pS "${inputs.preshared}"`;
          
          return cmd;
        }
      }
    ]
  }
];

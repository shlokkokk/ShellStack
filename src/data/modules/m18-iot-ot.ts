import type { Module } from '../cehModules';

export const m18: Module = {
  id: 'm18',
  number: 'M18',
  title: 'IoT & OT Hacking',
  description: 'Explore the critical security challenges within the Internet of Things (IoT) and Operational Technology (OT) environments. Understand the convergence of IT and OT, hardware hacking methodologies (UART/JTAG), IoT firmware reverse engineering, and the catastrophic real-world implications of compromising Industrial Control Systems (ICS) and SCADA networks.',
  examWeight: '3%',
  estimatedQuestions: 4,
  duration: '2h 45m',
  topics: [
    {
      id: 'm18-t01',
      title: 'IoT Architecture & Attack Surface',
      content: 'The Internet of Things (IoT) refers to billions of physical devices connected to the internet, collecting and sharing data. The architecture consists of Edge Devices (sensors/actuators), Gateways, and the Cloud/Data Center backend. Security is often an afterthought in IoT manufacturing due to cost, time-to-market pressure, and extreme hardware constraints.',
      keyPoints: [
        'Attack Surface: Physical Device (hardware interfaces, JTAG/UART), Network (unencrypted Wi-Fi/BLE/Zigbee), Cloud API (IDOR, Broken Auth), and Mobile/Web Interface.',
        'Default Credentials: The #1 vulnerability in IoT. Millions of devices ship with `admin/admin` or telnet exposed, fueling massive botnets like Mirai and Mozi.',
        'Lack of Update Mechanisms: Many IoT devices cannot be patched or require complex manual flashing. A zero-day vulnerability often remains exploitable for the physical lifespan of the device.',
        'Insecure Firmware: Firmware can be extracted via hardware interfaces or intercepted during unencrypted OTA (Over-The-Air) updates. Attackers reverse engineer it to find hardcoded AWS keys or SSH backdoors.',
      ],
    },
    {
      id: 'm18-t02',
      title: 'Hardware Hacking & Firmware Analysis',
      content: 'When network attacks fail, attackers turn to hardware hacking. By physically opening an IoT device, attackers can connect directly to the circuit board to extract firmware, read memory, or gain an unauthenticated root shell.',
      commands: [
        { command: 'binwalk -Me firmware.bin', description: 'Binwalk: Analyze, carve, and automatically extract file systems (like SquashFS) from a raw firmware binary image' },
        { command: 'firmwalker firmware_extracted/', description: 'Firmwalker: Automated script that searches extracted firmware for hardcoded passwords, SSL certificates, API keys, and backdoors' },
        { command: 'minicom -D /dev/ttyUSB0 -b 115200', description: 'Connect to a hardware UART interface using a USB-to-Serial adapter to interact with the device\'s bootloader (U-Boot) or drop into a root shell' },
      ],
      keyPoints: [
        'UART (Universal Asynchronous Receiver-Transmitter): A serial communication hardware interface. Developers often leave it active for debugging. Connecting to it often yields a root terminal without a password.',
        'JTAG (Joint Test Action Group): An industry-standard hardware interface used for testing circuit boards and programming chips. Attackers use JTAG to halt the CPU, read/write directly to memory, and step through code execution.',
        'SPI / I2C: Serial protocols used to communicate with EEPROM or Flash memory chips. Attackers use tools like the Bus Pirate to read the firmware directly off the flash chip.',
        'U-Boot Manipulation: The bootloader can often be interrupted via UART. Attackers can modify the boot parameters (e.g., `init=/bin/sh`) to bypass OS-level authentication.',
      ],
    },
    {
      id: 'm18-t03',
      title: 'OT, ICS, & SCADA Systems',
      content: 'Operational Technology (OT) refers to the hardware and software that controls physical industrial equipment (manufacturing lines, power grids, water treatment). ICS (Industrial Control Systems) encompasses all OT. SCADA (Supervisory Control and Data Acquisition) is a specific type of ICS architecture used for high-level, geographically dispersed process management.',
      keyPoints: [
        'IT/OT Convergence: Historically, OT networks were physically isolated (air-gapped) from the internet. Today, they are increasingly connected to IT networks for data analytics and remote maintenance, destroying the air-gap and exposing critical infrastructure to cyberattacks.',
        'PLCs (Programmable Logic Controllers): The robust, physical microcomputers on the factory floor that directly control machinery (e.g., opening a valve, spinning a motor).',
        'HMIs (Human-Machine Interfaces): The graphical dashboards (often running on Windows) used by human operators to monitor and control the PLCs.',
        'Availability over Confidentiality: In IT, a breached system is shut down to protect data (Confidentiality). In OT, shutting down a system might mean turning off power to a hospital (Availability is paramount).',
      ],
    },
    {
      id: 'm18-t04',
      title: 'IoT/OT Communication Protocols',
      content: 'Unlike IT networks which standardize on TCP/IP and HTTP, IoT and OT environments use highly specialized, lightweight, and historically unencrypted protocols designed for low bandwidth, low latency, and high reliability.',
      keyPoints: [
        'MQTT: A lightweight publish-subscribe messaging protocol heavily used in IoT. Operates on port 1883. Often deployed without authentication or TLS, allowing attackers to subscribe to the `#` wildcard topic and intercept all sensitive sensor data or publish malicious commands.',
        'CoAP: Constrained Application Protocol. Similar to HTTP but runs over UDP and is designed for highly constrained devices.',
        'Modbus: The de facto standard industrial protocol developed in 1979. It operates on TCP port 502. It has ABSOLUTELY ZERO security (no authentication, no encryption). Any device that can send a Modbus packet to a PLC can control the physical machinery.',
        'DNP3 / IEC 61850: Protocols used primarily in the electrical and power distribution sectors.',
        'Zigbee / Z-Wave: Short-range wireless mesh protocols used in smart homes and building automation. Vulnerable to sniffing and replay attacks if encryption keys are extracted.',
      ],
    },
    {
      id: 'm18-t05',
      title: 'Attacking Cyber-Physical Systems',
      content: 'Attacks against OT have real-world, kinetic consequences. Attackers rarely exploit the PLCs directly first; they typically compromise the corporate IT network, pivot into the OT network, compromise the Windows-based Engineering Workstations or HMIs, and from there, manipulate the PLC logic.',
      commands: [
        { command: 'shodan search "port:502" or "port:1883"', description: 'Use Shodan OSINT to find internet-exposed SCADA systems (Modbus) or IoT message brokers (MQTT)' },
        { command: 'shodan search "Server: SQ-WEBCAM"', description: 'Find specific vulnerable IoT camera models exposed online' },
        { command: 'nmap -Pn -sV -p 502 --script modbus-discover 192.168.1.100', description: 'Nmap NSE script to extract device ID, vendor, and configuration details from a Modbus PLC' },
      ],
      keyPoints: [
        'Purdue Model: The industry standard reference architecture for segmenting ICS networks into hierarchical zones. Level 0/1 (Physical/PLCs) must be strictly isolated from Level 4/5 (Corporate IT/Internet) via firewalls and DMZs (Level 3).',
        'Stuxnet (2010): The first cyber weapon. Destroyed Iranian nuclear centrifuges by manipulating Siemens PLCs while feeding fake "normal" data back to the operators\' HMIs.',
        'Triton / Trisis (2017): Highly sophisticated malware designed specifically to compromise Schneider Electric Safety Instrumented Systems (SIS) — the fail-safes designed to prevent industrial explosions.',
        'BlackEnergy / Industroyer (2015/2016): Malware used to attack the Ukrainian power grid, cutting electricity to hundreds of thousands of people in the dead of winter.',
      ],
    },
  ],
  keyTools: ['Shodan', 'Binwalk', 'Firmwalker', 'Wireshark (Modbus/MQTT dissectors)', 'Metasploit (SCADA modules)', 'Nmap (ICS NSE scripts)', 'Bus Pirate', 'Minicom'],
  countermeasures: [
    'Change ALL default passwords immediately upon deployment. NEVER connect IoT or OT devices directly to the internet.',
    'Strict Network Segmentation: Follow the Purdue Model strictly. Use Industrial Firewalls or Data Diodes to ensure traffic can only flow outward from OT to IT, never inward.',
    'Implement strong access controls, Jump Servers, and MFA for any remote access (e.g., VPNs used by external maintenance vendors) into the OT environment.',
    'Disable unused services on IoT devices (Telnet, SSH, UPnP, FTP).',
    'Monitor OT networks passively using specialized industrial IDS solutions (e.g., Claroty, Nozomi, Dragos). Active scanning (like traditional Nmap or Nessus) can easily crash fragile legacy PLCs and halt production.',
    'Ensure firmware updates are cryptographically signed to prevent attackers from flashing malicious or backdoored firmware via OTA.',
  ],
  examTips: [
    'Mirai is the most famous IoT botnet. It spread by brute-forcing factory default credentials on IP cameras and routers.',
    'SCADA/ICS attacks target Availability and physical processes, not data confidentiality.',
    'Modbus (Port 502) is the primary industrial protocol tested. It has NO built-in security. If you can reach the port, you can send commands.',
    'IT/OT Convergence (connecting factory floors to the internet/cloud for analytics) is the primary reason for the massive increase in ICS attacks.',
    'Shodan is the "search engine for IoT." It is used to find internet-exposed webcams, routers, and industrial control systems.',
    'The Purdue Model is the standard architecture for securing and segmenting ICS environments.',
  ],
  realWorldScenarios: [
    'An attacker uses Shodan (`port:502`) to find a municipal water treatment plant\'s HMI dashboard exposed directly to the internet via an insecure cellular modem. They log in with default vendor credentials and alter the chemical mix levels (lye), demonstrating a critical threat to public safety.',
    'A hospital\'s network is infected with a devastating ransomware strain. The attackers gained initial entry through an unpatched, internet-connected smart thermostat located in a patient wing. The thermostat was improperly placed on the same flat network as the core patient billing servers.',
    'During an ICS penetration test, the tester gains access to the corporate IT network. They discover that an HVAC vendor left a VPN connection open between the IT network and the Level 2 SCADA network. The tester pivots through the VPN and runs a simple active Nmap scan. The unexpected network traffic crashes a fragile legacy PLC, accidentally halting the entire manufacturing line.',
  ],
  prerequisites: ['M02 — Footprinting via Shodan is the primary reconnaissance method for IoT/OT.'],
};

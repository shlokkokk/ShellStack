import type { Tool } from '../toolTypes';

export const cryptographyTools: Tool[] = [
  {
    id: 'openssl',
    name: 'OpenSSL',
    description: 'The definitive open-source cryptography toolkit and SSL/TLS library. Penetration testers use it for everything: testing server cipher suites, decoding certificates, generating self-signed certs, encrypting/decrypting data, performing manual TLS handshakes, and converting between key formats.',
    category: 'cryptography',
    difficulty: 'intermediate',
    tags: ['tls', 'ssl', 'certificates', 'encryption', 'must-know'],
    commands: [
      { command: 'openssl s_client -connect example.com:443', description: 'Manually perform a TLS handshake with a server — see the full certificate chain, cipher, and protocol version' },
      { command: 'openssl s_client -connect example.com:443 -tls1', description: 'Force a TLSv1.0 connection to check if the server allows downgrade (legacy/insecure)' },
      { command: 'openssl s_client -connect example.com:443 -cipher NULL', description: 'Test if the server accepts NULL (no encryption) cipher suites — critical vulnerability if it does' },
      { command: 'openssl x509 -in certificate.crt -text -noout', description: 'Display all details of an X.509 certificate (issuer, subject, SANs, validity period, public key)' },
      { command: 'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes', description: 'Generate a self-signed RSA 4096-bit certificate and key pair (for testing or backdoor use)' },
      { command: 'openssl genrsa -out private.key 2048', description: 'Generate a 2048-bit RSA private key' },
      { command: 'openssl enc -aes-256-cbc -in plaintext.txt -out encrypted.bin -k "password" -pbkdf2', description: 'Encrypt a file using AES-256-CBC symmetric encryption' },
      { command: 'openssl enc -d -aes-256-cbc -in encrypted.bin -out decrypted.txt -k "password" -pbkdf2', description: 'Decrypt a file encrypted with AES-256-CBC' },
      { command: 'openssl dgst -sha256 -sign private.key -out signature.bin message.txt', description: 'Digitally sign a file with an RSA private key' },
      { command: 'openssl dgst -sha256 -verify public.key -signature signature.bin message.txt', description: 'Verify a digital signature using the corresponding public key' },
      { command: 'openssl pkcs12 -export -out bundle.pfx -inkey private.key -in cert.pem -certfile chain.pem', description: 'Bundle certificate + private key into a PKCS#12 (.pfx) file (for Windows/IIS)' },
    ],
    whenToUse: [
      'To test a web server\'s TLS configuration for weak protocols (SSLv3, TLSv1.0) or ciphers',
      'To quickly inspect, decode, and verify SSL certificates from the command line',
      'For generating self-signed certificates when you need a quick HTTPS listener during engagements',
      'To encrypt payloads and communication during post-exploitation to evade DLP tools',
    ],
    commonFlags: [
      { flag: 's_client', description: 'Connect to a server using TLS/SSL and display details' },
      { flag: 'x509', description: 'Certificate management (view, convert, sign)' },
      { flag: 'req', description: 'Certificate Signing Request (CSR) generation' },
      { flag: 'enc', description: 'Encrypt or decrypt data using various ciphers' },
      { flag: 'dgst', description: 'Message digest (hash) and digital signature operations' },
      { flag: 'genrsa', description: 'Generate an RSA private key' },
      { flag: '-tls1 / -tls1_1 / -tls1_2 / -tls1_3', description: 'Force a specific TLS version for testing' },
    ],
    outputExample: [
      '$ openssl s_client -connect example.com:443',
      'CONNECTED(00000003)',
      'depth=2 C = US, O = DigiCert Inc, CN = DigiCert Global Root CA',
      'depth=1 C = US, O = DigiCert Inc, CN = DigiCert TLS RSA SHA256 2020 CA1',
      'depth=0 C = US, ST = California, L = Los Angeles, O = Internet Corporation...',
      '---',
      'Certificate chain',
      ' 0 s:CN = www.example.com',
      '   i:C = US, O = DigiCert Inc',
      '---',
      'SSL handshake has read 4985 bytes and written 758 bytes',
      'Protocol  : TLSv1.3',
      'Cipher    : TLS_AES_256_GCM_SHA384'
    ],
    relatedTools: ['sslyze', 'testssl.sh', 'nmap --script ssl-enum-ciphers'],
    installation: 'sudo apt install openssl -y   # Pre-installed on virtually all Linux systems',
    website: 'https://www.openssl.org',
    interactiveCommands: [
      {
        name: 'TLS Server Inspector',
        description: 'Inspect a server\'s TLS configuration, certificate, and supported cipher suites.',
        inputs: [
          { id: 'host', label: 'Target Host', type: 'text', defaultValue: 'example.com', placeholder: 'e.g., example.com or 192.168.1.100' },
          { id: 'port', label: 'Port', type: 'text', defaultValue: '443', placeholder: '443' },
          { id: 'tlsVersion', label: 'TLS Version Test', type: 'select', defaultValue: '', options: ['', '-tls1', '-tls1_1', '-tls1_2', '-tls1_3'] },
        ],
        generator: (inputs) => {
          const version = inputs.tlsVersion ? ` ${inputs.tlsVersion}` : '';
          return `openssl s_client -connect ${inputs.host}:${inputs.port}${version} < /dev/null 2>&1 | head -50`;
        }
      }
    ]
  },
  {
    id: 'gnupg',
    name: 'GnuPG (GPG)',
    description: 'The GNU Privacy Guard, a free implementation of the OpenPGP standard for encrypting and signing data. Used for email encryption, file confidentiality, and verifying software package signatures. Essential for secure key management in red team operations and for verifying the integrity of downloaded tools.',
    category: 'cryptography',
    difficulty: 'intermediate',
    tags: ['pgp', 'encryption', 'signing', 'key-management', 'privacy'],
    commands: [
      { command: 'gpg --gen-key', description: 'Generate a new GPG key pair (public + private) interactively' },
      { command: 'gpg --full-generate-key', description: 'Generate with full control over key type, length, and expiry' },
      { command: 'gpg --list-keys', description: 'List all public keys in the keyring' },
      { command: 'gpg --list-secret-keys', description: 'List all private keys you hold' },
      { command: 'gpg --export -a "User Name" > public.key', description: 'Export a public key to a file for sharing' },
      { command: 'gpg --import public.key', description: 'Import a public key received from someone else' },
      { command: 'gpg --encrypt --recipient "recipient@email.com" --armor file.txt', description: 'Encrypt a file for a specific recipient (they need the private key to decrypt)' },
      { command: 'gpg --decrypt file.txt.gpg > decrypted.txt', description: 'Decrypt an encrypted GPG file' },
      { command: 'gpg --sign --armor file.txt', description: 'Create a detached signature for a file' },
      { command: 'gpg --verify file.txt.asc file.txt', description: 'Verify the signature on a file' },
    ],
    whenToUse: [
      'For encrypting sensitive findings, reports, and evidence files before transferring them to clients',
      'To verify the integrity and authenticity of downloaded security tool packages',
      'To sign and verify code or files during secure communications in red team operations',
    ],
    commonFlags: [
      { flag: '--encrypt / -e', description: 'Encrypt data' },
      { flag: '--decrypt / -d', description: 'Decrypt data' },
      { flag: '--sign / -s', description: 'Create a digital signature' },
      { flag: '--verify', description: 'Verify a digital signature' },
      { flag: '--armor / -a', description: 'Output in ASCII-armored format (human-readable base64)' },
      { flag: '--recipient / -r', description: 'Specify the recipient key for encryption' },
    ],
    outputExample: [
      '$ gpg --encrypt --recipient "alice@example.com" --armor secret.txt',
      '-----BEGIN PGP MESSAGE-----',
      '',
      'hQEMA5fTczGt1PsRAQf9EGh2mF9GaJXwNKq...',
      '...',
      '-----END PGP MESSAGE-----'
    ],
    relatedTools: ['openssl', 'age', 'pass'],
    installation: 'sudo apt install gnupg -y   # Pre-installed on most Linux systems',
    website: 'https://www.gnupg.org',
  },
  {
    id: 'cryptool',
    name: 'CrypTool',
    description: 'An educational open-source software platform for learning cryptography. CrypTool 2 (CT2) provides visual drag-and-drop tools to analyze classic and modern ciphers, run frequency analysis on ciphertext, visualize AES/RSA/DES internals, and perform attacks like brute-force, known-plaintext, and differential cryptanalysis interactively.',
    category: 'cryptography',
    difficulty: 'beginner',
    tags: ['educational', 'cipher-analysis', 'frequency-analysis', 'ceh', 'gui'],
    commands: [
      { command: 'CrypTool2.exe', description: 'Launch the CrypTool 2 GUI application (Windows)' },
    ],
    whenToUse: [
      'For learning and demonstrating cryptographic concepts and attacks in an educational environment',
      'To analyze ciphertext using frequency analysis to identify classical substitution ciphers',
      'As a CEH/certification study tool for understanding how cryptographic algorithms work internally',
    ],
    commonFlags: [
      { flag: 'Frequency Analysis Plugin', description: 'Analyze letter frequency to identify classical cipher types' },
      { flag: 'AES Plugin', description: 'Step-through AES encryption rounds visually' },
      { flag: 'Brute-force Plugin', description: 'Run brute-force attacks against Caesar, Vigenere, or other classical ciphers' },
    ],
    relatedTools: ['openssl', 'hashcat', 'john'],
    installation: 'Download installer from cryptool.org — Windows only (CT2). CrypTool 1 also available.',
    website: 'https://www.cryptool.org',
  },
  {
    id: 'hashid',
    name: 'hash-identifier / HashID',
    description: 'A tool for identifying the type of hash from an unknown hash string. When you capture a hash from a database dump or SAM file and need to know whether it\'s MD5, SHA-1, NTLM, bcrypt, or another algorithm, hash-identifier gives you an immediate answer so you can choose the right Hashcat mode.',
    category: 'cryptography',
    difficulty: 'beginner',
    tags: ['hash', 'identification', 'cracking-prep', 'forensics'],
    commands: [
      { command: 'hash-identifier', description: 'Launch the interactive hash-identifier prompt — paste a hash and get the type' },
      { command: 'hash-identifier "5f4dcc3b5aa765d61d8327deb882cf99"', description: 'Identify the type of this specific hash directly from the command line' },
      { command: 'hashid "5f4dcc3b5aa765d61d8327deb882cf99"', description: 'HashID variant — provides possible hash types with likelihood scores' },
      { command: 'hashid -m "5f4dcc3b5aa765d61d8327deb882cf99"', description: 'HashID: also show the corresponding Hashcat mode number (-m flag value to use)' },
      { command: 'hashid -j "$2a$10$N9qo8uLOickgx2ZMRZoMye"', description: 'HashID: also show the John the Ripper format name for the detected hash type' },
      { command: 'hashid -m -j "aad3b435b51404eeaad3b435b51404ee:e19ccf75ee54e06b"', description: 'Identify an NTLM hash and show both Hashcat mode and John format' },
      { command: 'cat hashes.txt | hashid -m', description: 'Pipe a file of hashes to identify each one with their Hashcat mode' },
    ],
    whenToUse: [
      'When you have captured an unknown hash and need to identify its type before cracking it with Hashcat or John',
      'During CTF challenges when you encounter a hash in a file and need to determine the algorithm',
      'When doing a database dump and you need to quickly triage what hashing algorithm the application uses',
    ],
    commonFlags: [
      { flag: '-m', description: '(hashid) Also display the corresponding Hashcat mode number' },
      { flag: '-j', description: '(hashid) Display corresponding John the Ripper format string' },
    ],
    outputExample: [
      '$ hashid -m "5f4dcc3b5aa765d61d8327deb882cf99"',
      'Analyzing: 5f4dcc3b5aa765d61d8327deb882cf99',
      '[+] MD2',
      '[+] MD5 [Hashcat Mode: 0]',
      '[+] MD4 [Hashcat Mode: 900]',
      '[+] Double MD5 [Hashcat Mode: 2600]',
      '[+] LM [Hashcat Mode: 3000]',
      '[+] RIPEMD-128',
      '[+] Haval-128',
      '[+] Tiger-128'
    ],
    relatedTools: ['hashcat', 'john', 'haiti'],
    installation: 'pip install hashid   # or: sudo apt install hash-identifier -y',
    website: 'https://github.com/psypanda/hashID',
  },
  {
    id: 'testssl',
    name: 'testssl.sh',
    description: 'A powerful free command-line tool to check a server\'s TLS/SSL encryption configuration. It checks for supported cipher suites, all TLS protocol versions, vulnerabilities (BEAST, POODLE, Heartbleed, DROWN, ROBOT, Sweet32), certificate issues, and security headers — all from a single command.',
    category: 'cryptography',
    difficulty: 'beginner',
    tags: ['tls', 'ssl', 'cipher-analysis', 'vulnerabilities', 'web'],
    commands: [
      { command: 'testssl.sh https://example.com', description: 'Run a full TLS/SSL audit against a web server — checks everything' },
      { command: 'testssl.sh --heartbleed example.com:443', description: 'Check specifically for the Heartbleed vulnerability (CVE-2014-0160)' },
      { command: 'testssl.sh --poodle example.com:443', description: 'Check specifically for POODLE SSLv3 downgrade vulnerability' },
      { command: 'testssl.sh --ciphers example.com:443', description: 'Enumerate all accepted cipher suites and highlight weak ones' },
      { command: 'testssl.sh --full --json example.com:443 > report.json', description: 'Run full audit and export a complete JSON report for documentation' },
      { command: 'testssl.sh --protocols example.com:443', description: 'Show only which TLS/SSL protocol versions are supported (SSLv2/3, TLSv1.0-1.3)' },
      { command: 'testssl.sh --headers example.com:443', description: 'Check HTTP security headers (HSTS, X-Frame-Options, CSP, etc.)' },
      { command: 'testssl.sh --vulnerable example.com:443', description: 'Only run vulnerability checks (Heartbleed, POODLE, DROWN, ROBOT, etc.)' },
      { command: 'testssl.sh --ip one example.com:443', description: 'Test only one IP if the domain resolves to multiple IPs' },
      { command: 'testssl.sh --serial --html report.html example.com:443', description: 'Run checks sequentially (slower but more reliable) and generate HTML report' },
    ],
    whenToUse: [
      'As a mandatory step in any web application pentest to assess the TLS configuration',
      'To quickly verify if a server is vulnerable to Heartbleed, POODLE, or other SSL/TLS CVEs',
      'For PCI-DSS compliance checks — no TLS 1.0/1.1 or weak ciphers are allowed',
      'To audit HTTP security headers alongside TLS configuration in a single scan',
    ],
    commonFlags: [
      { flag: '--full', description: 'Run all checks (most complete output)' },
      { flag: '--heartbleed', description: 'Only test for Heartbleed' },
      { flag: '--ciphers', description: 'Only enumerate cipher suites' },
      { flag: '--protocols', description: 'Only check supported TLS/SSL protocol versions' },
      { flag: '--vulnerable', description: 'Only run vulnerability checks' },
      { flag: '--headers', description: 'Only check HTTP security headers' },
      { flag: '--json', description: 'Output results in JSON format' },
      { flag: '--html', description: 'Output results as an HTML report' },
      { flag: '--serial', description: 'Run checks sequentially (one at a time, more reliable)' },
    ],
    outputExample: [
      'Testing vulnerabilities',
      '',
      'Heartbleed (CVE-2014-0160)              not vulnerable (OK)',
      'CCS (CVE-2014-0224)                     not vulnerable (OK)',
      'ROBOT                                   not vulnerable (OK)',
      'Secure Renegotiation                    supported (OK)',
      'CRIME, TLS (CVE-2012-4929)              not vulnerable (OK)',
      'POODLE, SSL (CVE-2014-3566)             not vulnerable (OK)',
      'SWEET32 (CVE-2016-2183, CVE-2016-6329)  VULNERABLE, uses 64 bit block ciphers'
    ],
    relatedTools: ['openssl', 'nmap ssl-enum-ciphers', 'sslyze'],
    installation: 'git clone https://github.com/drwetter/testssl.sh.git && cd testssl.sh   # No installation needed, just run the script',
    website: 'https://testssl.sh',
    interactiveCommands: [
      {
        name: 'TLS/SSL Audit Builder',
        description: 'Generate a testssl.sh command to audit a server\'s TLS configuration.',
        inputs: [
          { id: 'host', label: 'Target Host', type: 'text', defaultValue: 'example.com', placeholder: 'Domain or IP address' },
          { id: 'port', label: 'Port', type: 'text', defaultValue: '443', placeholder: '443' },
          { id: 'check', label: 'Check Type', type: 'select', defaultValue: '--full', options: ['--full', '--vulnerable', '--ciphers', '--protocols', '--headers', '--heartbleed'] },
          { id: 'output', label: 'Report Format', type: 'select', defaultValue: '', options: ['', '--json', '--html'] },
        ],
        generator: (inputs) => {
          const outputFlag = inputs.output ? ` ${inputs.output}` : '';
          return `testssl.sh ${inputs.check}${outputFlag} ${inputs.host}:${inputs.port}`;
        }
      }
    ]
  },
];

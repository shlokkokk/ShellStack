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
        name: 'OpenSSL Toolkit Builder',
        description: 'Comprehensive builder for TLS connections, certificate generation, encryption, and signatures.',
        inputs: [
          { id: 'mode', label: 'Operation Mode', type: 'select', options: ['s_client (TLS Test)', 'x509 (Read Cert)', 'req (Generate CSR/Cert)', 'genrsa (Generate Key)', 'enc (Encrypt/Decrypt)', 'dgst (Hash/Sign)'], defaultValue: 's_client (TLS Test)' },
          { id: 'target', label: 'Target / Input File', type: 'text', defaultValue: 'example.com:443', placeholder: 'Host:Port or file.txt' },
          { id: 'outFile', label: 'Output File (-out)', type: 'text', defaultValue: '', placeholder: 'Save output to file' },
          { id: 'tlsVersion', label: 'TLS Version (s_client)', type: 'select', options: ['Auto', '-tls1', '-tls1_1', '-tls1_2', '-tls1_3'], defaultValue: 'Auto' },
          { id: 'cipher', label: 'Cipher Suite (s_client/enc)', type: 'text', defaultValue: '', placeholder: 'e.g., NULL, HIGH, -aes-256-cbc' },
          { id: 'keySize', label: 'Key Size (genrsa)', type: 'text', defaultValue: '2048', placeholder: '2048, 4096' },
          { id: 'pass', label: 'Password (-k/-pass)', type: 'text', defaultValue: '', placeholder: 'Password for encryption' },
          { id: 'decrypt', label: 'Decrypt (-d)', type: 'checkbox', defaultValue: 'false', placeholder: 'For enc mode' }
        ],
        generator: (inputs) => {
          let cmd = `openssl ${inputs.mode.split(' ')[0]}`;
          
          if (inputs.mode.includes('s_client')) {
            cmd += ` -connect ${inputs.target}`;
            if (inputs.tlsVersion !== 'Auto') cmd += ` ${inputs.tlsVersion}`;
            if (inputs.cipher) cmd += ` -cipher ${inputs.cipher}`;
            cmd += ' < /dev/null 2>&1 | head -50';
          } else if (inputs.mode.includes('req')) {
            cmd += ` -x509 -newkey rsa:${inputs.keySize} -keyout key.pem -out ${inputs.outFile || 'cert.pem'} -days 365 -nodes`;
          } else if (inputs.mode.includes('x509')) {
            cmd += ` -in ${inputs.target} -text -noout`;
          } else if (inputs.mode.includes('genrsa')) {
            cmd += ` -out ${inputs.outFile || 'private.key'} ${inputs.keySize}`;
          } else if (inputs.mode.includes('enc')) {
            if (inputs.decrypt === 'true') cmd += ' -d';
            if (inputs.cipher) cmd += ` ${inputs.cipher.startsWith('-') ? inputs.cipher : '-' + inputs.cipher}`;
            else cmd += ' -aes-256-cbc';
            cmd += ` -in ${inputs.target}`;
            if (inputs.outFile) cmd += ` -out ${inputs.outFile}`;
            if (inputs.pass) cmd += ` -k "${inputs.pass}" -pbkdf2`;
          } else if (inputs.mode.includes('dgst')) {
            cmd += ` -sha256 -sign private.key -out ${inputs.outFile || 'sig.bin'} ${inputs.target}`;
          }
          
          return cmd;
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
    interactiveCommands: [
      {
        name: 'GnuPG Crypto Operations',
        description: 'Build complete GPG commands for key management, encryption, and digital signatures.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['--encrypt (-e)', '--decrypt (-d)', '--sign (-s)', '--verify', '--gen-key', '--export (-a)', '--import'], defaultValue: '--encrypt (-e)' },
          { id: 'targetFile', label: 'Target File', type: 'text', defaultValue: 'secret.txt', placeholder: 'File to encrypt/decrypt/sign' },
          { id: 'recipient', label: 'Recipient (-r)', type: 'text', defaultValue: 'user@email.com', placeholder: 'Required for encryption' },
          { id: 'armor', label: 'ASCII Armor (-a)', type: 'checkbox', defaultValue: 'true', placeholder: 'Output as base64 text' },
          { id: 'outFile', label: 'Output File (-o)', type: 'text', defaultValue: '', placeholder: 'Save output to file' },
          { id: 'symmetric', label: 'Symmetric Enc (--symmetric)', type: 'checkbox', defaultValue: 'false', placeholder: 'Encrypt with password' }
        ],
        generator: (inputs) => {
          let cmd = `gpg`;
          
          const act = inputs.action.split(' ')[0];
          cmd += ` ${act}`;
          
          if (inputs.armor === 'true' && (act === '--encrypt' || act === '--sign' || act === '--export')) {
            cmd += ' --armor';
          }
          
          if (act === '--encrypt' && inputs.recipient) {
            cmd += ` --recipient "${inputs.recipient}"`;
          }
          if (inputs.symmetric === 'true') {
            cmd += ' --symmetric';
          }
          
          if (inputs.outFile) cmd += ` --output ${inputs.outFile}`;
          
          if (!act.includes('gen-key') && !act.includes('export') && !act.includes('import')) {
            cmd += ` ${inputs.targetFile}`;
          } else if (act === '--export') {
            cmd += ` "${inputs.recipient}"`;
          } else if (act === '--import') {
             cmd += ` public.key`;
          }
          
          return cmd;
        }
      }
    ]
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
    interactiveCommands: [
      {
        name: 'CrypTool Launcher',
        description: 'Launch CrypTool or specific CT2 workspaces.',
        inputs: [
          { id: 'executable', label: 'Executable', type: 'text', defaultValue: 'CrypTool2.exe', placeholder: 'Path to executable' },
          { id: 'workspace', label: 'Workspace File (.cwm)', type: 'text', defaultValue: '', placeholder: 'Path to workspace' },
          { id: 'hidden', label: 'Start Hidden', type: 'checkbox', defaultValue: 'false', placeholder: 'Run in background' },
          { id: 'language', label: 'Language', type: 'select', options: ['en', 'de', 'es'], defaultValue: 'en' },
          { id: 'logLevel', label: 'Log Level', type: 'select', options: ['Info', 'Warning', 'Error', 'Debug'], defaultValue: 'Info' },
          { id: 'plugin', label: 'Load Plugin', type: 'text', defaultValue: '', placeholder: 'DLL name' }
        ],
        generator: (inputs) => {
          let cmd = inputs.executable;
          if (inputs.workspace) cmd += ` "${inputs.workspace}"`;
          return cmd;
        }
      }
    ]
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
    interactiveCommands: [
      {
        name: 'HashID Expert Analyzer',
        description: 'Generate advanced hash identification commands with Hashcat and John the Ripper integration.',
        inputs: [
          { id: 'hashInput', label: 'Hash string or file', type: 'text', defaultValue: '5f4dcc3b5aa765d61d8327deb882cf99', placeholder: 'Enter hash or filename' },
          { id: 'hashcat', label: 'Hashcat mode (-m)', type: 'checkbox', defaultValue: 'true', placeholder: 'Enable' },
          { id: 'john', label: 'John format (-j)', type: 'checkbox', defaultValue: 'true', placeholder: 'Enable' },
          { id: 'extended', label: 'Extended Info (-e)', type: 'checkbox', defaultValue: 'false', placeholder: 'Enable' },
          { id: 'outFile', label: 'Output File (-o)', type: 'text', defaultValue: '', placeholder: 'Save output to file' },
          { id: 'quiet', label: 'Quiet Mode', type: 'checkbox', defaultValue: 'false', placeholder: 'Suppress banner' }
        ],
        generator: (inputs) => {
          let cmd = 'hashid';
          if (inputs.hashcat === 'true') cmd += ' -m';
          if (inputs.john === 'true') cmd += ' -j';
          if (inputs.extended === 'true') cmd += ' -e';
          if (inputs.outFile) cmd += ` -o ${inputs.outFile}`;
          
          let execCmd = inputs.hashInput.endsWith('.txt') ? `cat ${inputs.hashInput} | ${cmd}` : `${cmd} "${inputs.hashInput}"`;
          if (inputs.quiet === 'true') execCmd = execCmd.replace('hashid', 'hashid 2>/dev/null'); // Simple hack for hiding some errors/banners in CLI
          return execCmd;
        }
      }
    ]
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
        name: 'TLS/SSL Complete Audit Builder',
        description: 'Generate highly detailed testssl.sh commands to audit servers for vulnerabilities, ciphers, and certificate flaws.',
        inputs: [
          { id: 'host', label: 'Target Host', type: 'text', defaultValue: 'example.com', placeholder: 'Domain or IP address' },
          { id: 'port', label: 'Port', type: 'text', defaultValue: '443', placeholder: '443' },
          { id: 'checkMode', label: 'Audit Scope', type: 'select', defaultValue: '--full', options: ['--full', '--vulnerable', '--ciphers', '--protocols', '--headers', '--heartbleed', '--poodle'] },
          { id: 'outputFormat', label: 'Report Format', type: 'select', defaultValue: '--html', options: ['None', '--json', '--html', '--csv'] },
          { id: 'outDir', label: 'Output Dir/File', type: 'text', defaultValue: 'report.html', placeholder: 'e.g., report.html' },
          { id: 'fast', label: 'Fast Mode (--fast)', type: 'checkbox', defaultValue: 'false', placeholder: 'Skip some checks' },
          { id: 'serial', label: 'Serial Mode (--serial)', type: 'checkbox', defaultValue: 'false', placeholder: 'Run sequentially (slower, reliable)' }
        ],
        generator: (inputs) => {
          let cmd = 'testssl.sh';
          
          if (inputs.checkMode !== '--full') cmd += ` ${inputs.checkMode}`;
          
          if (inputs.fast === 'true') cmd += ' --fast';
          if (inputs.serial === 'true') cmd += ' --serial';
          
          if (inputs.outputFormat !== 'None') {
            cmd += ` ${inputs.outputFormat} ${inputs.outDir}`;
          }
          
          return `${cmd} ${inputs.host}:${inputs.port}`;
        }
      }
    ]
  },
];

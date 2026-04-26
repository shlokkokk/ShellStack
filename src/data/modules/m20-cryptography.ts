import type { Module } from '../cehModules';

export const m20: Module = {
  id: 'm20',
  number: 'M20',
  title: 'Cryptography',
  description: 'Master the mathematical foundations of modern data security. Differentiate between symmetric and asymmetric encryption architectures, understand the critical role of cryptographic hashing and digital signatures, and analyze the deployment of Public Key Infrastructure (PKI). Explore advanced topics like Post-Quantum Cryptography, AES modes of operation (ECB vs GCM), and the attacks used to break poor cryptographic implementations.',
  examWeight: '5%',
  estimatedQuestions: 6,
  duration: '3h 30m',
  topics: [
    {
      id: 'm20-t01',
      title: 'Cryptographic Concepts & Architectures',
      content: 'Cryptography ensures Confidentiality (encryption), Integrity (hashing), Authentication (proving identity), and Non-Repudiation (preventing denial of action). The strength of a cryptographic system should rely entirely on the secrecy of the key, not the secrecy of the algorithm itself (Kerckhoffs\'s Principle). Proprietary, "secret" algorithms are universally discouraged.',
      keyPoints: [
        'Symmetric Encryption: Uses a SINGLE shared key for both encryption and decryption. Fast, computationally efficient, and used for bulk data encryption (e.g., AES, DES). The major flaw is Key Distribution—how do you securely share the symmetric key with the recipient over an untrusted network?',
        'Asymmetric Encryption: Uses a mathematically linked KEY PAIR (Public Key and Private Key). What the public key encrypts, ONLY the private key can decrypt. Slower and computationally heavy, but solves the key distribution problem. Used for secure key exchange and digital signatures (e.g., RSA, ECC, Diffie-Hellman).',
        'Hybrid Encryption: Modern systems (like TLS) use asymmetric encryption initially to securely exchange a symmetric "session key," then switch to the faster symmetric encryption (AES) for the actual bulk data transfer.',
      ],
    },
    {
      id: 'm20-t02',
      title: 'Symmetric Encryption & Block Ciphers',
      content: 'Symmetric encryption operates in two primary ways: Stream Ciphers (encrypting data bit-by-bit, like RC4) and Block Ciphers (encrypting data in fixed-size blocks, like AES). For block ciphers, the "Mode of Operation" dictates how multiple blocks are chained together, which is critical for security.',
      keyPoints: [
        'AES (Advanced Encryption Standard): The global standard. Replaced DES. Block size is 128 bits. Key sizes are 128, 192, or 256 bits. AES-256 is considered quantum-resistant for symmetric encryption.',
        'ECB (Electronic Codebook): The weakest block cipher mode. Identical plaintext blocks produce identical ciphertext blocks. If you encrypt an image with ECB, you can still see the outline of the original image in the ciphertext. NEVER use ECB.',
        'CBC (Cipher Block Chaining): Uses an Initialization Vector (IV) for the first block, and XORs each subsequent block with the previous ciphertext block. Provides good security but cannot be parallelized.',
        'GCM (Galois/Counter Mode): The modern standard (used in TLS 1.3). Combines Counter mode with authentication (Galois Authentication), providing both confidentiality AND integrity (Authenticated Encryption). Highly parallelizable and extremely fast.',
      ],
    },
    {
      id: 'm20-t03',
      title: 'Hashing & Digital Signatures',
      content: 'Hashing is a one-way mathematical function that converts data of any size into a fixed-length string (digest). It is used to verify data integrity (has the file been altered?). Digital signatures combine hashing with asymmetric cryptography to prove both the integrity of a message and the identity of the sender.',
      commands: [
        { command: 'sha256sum file.txt', description: 'Generate a SHA-256 hash to verify the integrity of a downloaded file against the author\'s published hash' },
        { command: 'openssl dgst -sha256 -sign private.pem -out sign.bin document.txt', description: 'Generate a digital signature for a document using an RSA private key' },
      ],
      keyPoints: [
        'Hash Functions: MD5 (128-bit, fundamentally broken, susceptible to collisions), SHA-1 (160-bit, deprecated/broken), SHA-256 / SHA-3 (highly secure modern standards).',
        'Collisions: When two completely different inputs produce the exact same hash output. If an attacker can generate a collision, the hash function is considered broken (e.g., MD5).',
        'Digital Signatures: The sender hashes the message, then ENCRYPTS THE HASH with their PRIVATE KEY. The receiver decrypts the hash with the sender\'s PUBLIC KEY, and compares it to their own hash of the message. This proves Non-Repudiation.',
        'HMAC (Hash-based Message Authentication Code): Combines a cryptographic hash function with a secret cryptographic key to provide both data integrity and authenticity.',
      ],
    },
    {
      id: 'm20-t04',
      title: 'Public Key Infrastructure (PKI) & TLS',
      content: 'PKI is the framework of hardware, software, people, and policies required to create, manage, distribute, and revoke digital certificates. It is the trust model that underpins HTTPS/TLS on the internet.',
      commands: [
        { command: 'openssl genrsa -out private.key 2048', description: 'Generate a 2048-bit RSA private key' },
        { command: 'openssl req -new -key private.key -out request.csr', description: 'Generate a Certificate Signing Request (CSR) to send to a Certificate Authority' },
        { command: 'openssl x509 -req -days 365 -in request.csr -signkey private.key -out certificate.crt', description: 'Self-sign the certificate (often used for internal testing, throws warnings in browsers)' },
      ],
      keyPoints: [
        'Certificate Authority (CA): The trusted third party that issues digital certificates (e.g., Let\'s Encrypt, DigiCert). By trusting the CA\'s Root Certificate, your browser trusts all certificates issued by that CA.',
        'Digital Certificate (X.509): Essentially a public key bundled with identity information (Domain Name, Organization) that is digitally signed by a CA.',
        'CRL (Certificate Revocation List) & OCSP (Online Certificate Status Protocol): Mechanisms used by browsers to check if a certificate has been revoked before its expiration date (e.g., if the private key was stolen).',
        'TLS (Transport Layer Security): Replaced SSL. TLS 1.3 is the current standard, dropping support for weak ciphers and enforcing Perfect Forward Secrecy (PFS).',
      ],
    },
    {
      id: 'm20-t05',
      title: 'Cryptographic Attacks & Post-Quantum',
      content: 'Attackers rarely try to break the core mathematics of AES or RSA; instead, they attack the implementation, the key storage, or rely on weak configurations.',
      keyPoints: [
        'Known Plaintext Attack: The attacker has access to both the plaintext and the corresponding ciphertext, and uses this to deduce the key or the algorithm.',
        'Chosen Ciphertext Attack: The attacker can choose ciphertexts to be decrypted and has access to the resulting decrypted plaintext (e.g., Padding Oracle attacks against CBC mode).',
        'Birthday Attack: A statistical attack targeting hash collisions, based on the birthday paradox (you only need 23 people in a room for a 50% chance two share a birthday). This is why hash lengths must be so long.',
        'Post-Quantum Cryptography: Quantum computers running Shor\'s algorithm will be able to easily break RSA and ECC (asymmetric encryption). NIST is currently standardizing quantum-resistant algorithms (e.g., lattice-based cryptography) to replace them.',
      ],
    },
  ],
  keyTools: ['OpenSSL', 'GnuPG', 'Hashcat', 'John the Ripper', 'Cryptool'],
  countermeasures: [
    'Always use well-established, peer-reviewed cryptographic libraries (libsodium, Bouncy Castle). Never attempt to write your own "custom" cryptographic algorithms.',
    'Deprecate and disable weak protocols and ciphers: Disable SSLv3, TLS 1.0, TLS 1.1, RC4, DES, and MD5 across all infrastructure.',
    'Implement Perfect Forward Secrecy (PFS) by using Ephemeral Diffie-Hellman (DHE or ECDHE) for key exchange, ensuring that if a long-term private key is compromised, past session traffic cannot be decrypted.',
    'Use strong random number generators (CSPRNG). Cryptography relies entirely on entropy; predictable random numbers lead to predictable keys.',
    'Salt all passwords before hashing them (using bcrypt or Argon2) to defend against Rainbow Table attacks.',
  ],
  examTips: [
    'Symmetric = 1 Key (Fast, Bulk Data). Asymmetric = 2 Keys (Slow, Key Exchange, Signatures).',
    'To achieve Non-Repudiation, you MUST use Digital Signatures (Encrypting a hash with the sender\'s Private Key).',
    'AES is Symmetric. RSA, ECC, and Diffie-Hellman are Asymmetric.',
    'MD5 and SHA-1 are broken due to collisions. SHA-256 is secure.',
    'PKI relies on the Certificate Authority (CA) as the trusted third party.',
    'The Birthday Attack specifically targets hash collisions.',
    'ECB is the weakest block cipher mode of operation because it produces identical ciphertext for identical plaintext blocks.',
  ],
  realWorldScenarios: [
    'During an engagement, you capture an encrypted zip file. You know the zip file contains a standard corporate "readme.txt" file. Because you possess the plaintext of the readme file and the ciphertext of the zip, you execute a Known-Plaintext Attack using `pkcrack` to recover the encryption keys for the entire archive in minutes.',
    'A legacy web application uses AES-CBC encryption for its session cookies but fails to implement an HMAC for integrity. You use a tool like PadBuster to execute a Padding Oracle attack, sending thousands of slightly modified cookies to the server. By observing the specific error messages (Chosen Ciphertext Attack), you decrypt the cookie byte-by-byte without ever knowing the AES key.',
    'A developer needs to securely transmit a daily 50GB backup file to a remote server. They use hybrid encryption: they generate a unique, random 256-bit AES key, encrypt the 50GB file with AES-GCM (fast), then encrypt the small AES key with the recipient\'s RSA Public Key (secure key exchange). The recipient uses their RSA Private Key to decrypt the AES key, then uses the AES key to decrypt the backup file.',
  ],
  prerequisites: ['M06 — Password cracking concepts are deeply tied to hashing algorithms.', 'M13 — TLS configuration is a critical component of web server security.'],
};

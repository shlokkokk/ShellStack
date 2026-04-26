import type { Module } from '../cehModules';

export const m17: Module = {
  id: 'm17',
  number: 'M17',
  title: 'Hacking Mobile Platforms',
  description: 'Analyze the security architectures of iOS and Android mobile platforms. Master the techniques used to bypass App Store/Google Play protections, reverse engineer APK/IPA files, exploit insecure local data storage, manipulate APIs via dynamic instrumentation (Frida/Objection), and understand the severe implications of rooting and jailbreaking on enterprise security.',
  examWeight: '4%',
  estimatedQuestions: 5,
  duration: '3h 00m',
  topics: [
    {
      id: 'm17-t01',
      title: 'Mobile Architecture & OS Security Models',
      content: 'Android and iOS are built on different foundations (Linux kernel vs Darwin/XNU kernel) but share core security concepts designed for mobile environments: application sandboxing, mandatory code signing, and strict permission models. Understanding how these operating systems isolate applications is the key to bypassing that isolation.',
      keyPoints: [
        'Android Sandbox: Uses Linux UID/GID separation. Every app runs as a unique Linux user in its own Dalvik/ART virtual machine, meaning one app cannot access another app\'s files by default.',
        'iOS Sandbox: Enforces strict isolation via the Seatbelt kernel extension. Apps cannot read files outside their dedicated container (`/var/mobile/Containers/Data/Application/`).',
        'Code Signing: Both OSs require apps to be cryptographically signed. iOS enforces this strictly (App Store only, unless enterprise provisioned). Android allows "Unknown Sources" (sideloading) trivially.',
        'Rooting (Android) / Jailbreaking (iOS): The process of gaining privileged control (root/UID 0) over the OS. This fundamentally breaks the sandbox, allowing any app (or malware) to read any file on the device, including other apps\' private data.',
      ],
    },
    {
      id: 'm17-t02',
      title: 'Android Static Analysis & Reverse Engineering',
      content: 'Android apps are distributed as APK (Android Package) files, which are essentially ZIP archives containing Dalvik executable code (`classes.dex`), resources, and the Manifest. Because Java/Kotlin compiles to intermediate bytecode, Android apps are highly susceptible to reverse engineering, exposing business logic and hardcoded secrets.',
      commands: [
        { command: 'apktool d target.apk', description: 'Decompile the APK to extract the AndroidManifest.xml and smali (disassembled Dalvik bytecode) for modification' },
        { command: 'jadx-gui target.apk', description: 'Decompile the APK directly into highly readable Java source code for static analysis and secret hunting' },
        { command: 'keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000', description: 'Generate a fake cryptographic key to sign a modified, malicious APK' },
        { command: 'apksigner sign --ks my-release-key.keystore target_modified.apk', description: 'Sign the repacked APK so it can be installed on an Android device' },
      ],
      keyPoints: [
        'AndroidManifest.xml: The blueprint of the app. Defines permissions, exported components (Activities, Services, Receivers), and configurations. Identifying exported components without access control is a primary attack vector.',
        'Insecure Data Storage: Storing sensitive data (passwords, JWT tokens) in `SharedPreferences`, local SQLite databases, or external storage (SD card) without encryption.',
        'Repackaging Attack: Decompiling a legitimate app with apktool, injecting a malicious payload (like a Metasploit reverse shell or keylogger into the Smali code), recompiling it, signing it with a fake key, and distributing it via phishing or third-party app stores.',
      ],
    },
    {
      id: 'm17-t03',
      title: 'Dynamic Instrumentation (Frida & Objection)',
      content: 'Static analysis only goes so far, especially when the code is obfuscated. Dynamic instrumentation involves modifying the application\'s behavior at runtime (in memory) while it is executing. This is the primary method for bypassing modern mobile security controls.',
      commands: [
        { command: 'objection -g com.target.app explore', description: 'Launch the Objection runtime exploration toolkit against a specific app' },
        { command: 'android sslpinning disable', description: 'Use Objection to dynamically bypass SSL pinning checks in memory' },
        { command: 'android root disable', description: 'Use Objection to bypass root detection checks implemented by the app' },
        { command: 'frida -U -f com.target.app -l bypass.js', description: 'Use Frida to inject a custom JavaScript payload (`bypass.js`) into the app at runtime' },
      ],
      keyPoints: [
        'Frida: A dynamic code instrumentation toolkit. It lets you inject snippets of JavaScript into native apps on Windows, macOS, GNU/Linux, iOS, Android, and QNX.',
        'Objection: A runtime mobile exploration toolkit powered by Frida, built specifically to assess the security posture of mobile applications without needing a jailbroken/rooted device (if the app is patched).',
        'SSL Pinning: A defense where the app hardcodes the expected server certificate. If an attacker uses a proxy (like Burp Suite) to intercept traffic, the app detects the mismatch and terminates the connection. Frida/Objection are used to hook the pinning validation function and force it to return "True".',
      ],
    },
    {
      id: 'm17-t04',
      title: 'iOS Exploitation & Ecosystem Attacks',
      content: 'iOS apps (IPA files) are compiled into native ARM binary code (Mach-O format), making them significantly harder to reverse engineer than Android apps (which use bytecode). Furthermore, the closed ecosystem makes distributing malware difficult without exploiting zero-day kernel vulnerabilities or abusing enterprise provisioning.',
      keyPoints: [
        'Jailbreaking Types: Tethered (requires a PC to boot), Semi-tethered (boots normally, but requires PC to run jailbreak code), Untethered (retains jailbreak after reboot without PC — highly rare today).',
        'Binary Analysis: Tools like Hopper, Ghidra, or IDA Pro are required to disassemble the Mach-O binaries. Code must be read in ARM assembly or C pseudo-code rather than Java.',
        'Keychain: The secure storage mechanism in iOS, backed by the Secure Enclave. If a device is fully jailbroken, tools can dump the entire Keychain, revealing saved Wi-Fi passwords, app tokens, and credentials.',
        'Sideloading & Enterprise Abuse: Attackers use compromised Apple Developer Enterprise Certificates to sign malicious apps. This bypasses the App Store review process and allows the malware to be installed directly via a web link.',
      ],
    },
    {
      id: 'm17-t05',
      title: 'Mobile Device Management (MDM) & BYOD Security',
      content: 'In enterprise environments, managing a fleet of mobile devices is handled via MDM solutions (e.g., MobileIron, Workspace ONE, Intune). Attackers target MDM infrastructure to push malicious configurations or wipe devices, while defenders use MDM to enforce strict security policies across BYOD environments.',
      keyPoints: [
        'MDM Capabilities: Remote wipe, enforcing complex passcodes, disabling hardware (camera, Bluetooth), preventing screenshots, and forcefully deploying enterprise applications.',
        'BYOD (Bring Your Own Device) Risks: Mixing personal and corporate data. If the user downloads malware on their personal profile, it could potentially access the corporate network.',
        'Containerization: Using solutions like Android Enterprise (Work Profile) to cryptographically separate corporate data from personal data on the same physical device.',
        'Compliance Checks: Financial and corporate apps MUST implement client-side checks to detect if the device is rooted/jailbroken and refuse to run, as the OS security model can no longer be trusted.',
      ],
    },
  ],
  keyTools: ['Apktool', 'JADX', 'MobSF (Mobile Security Framework)', 'Frida', 'Objection', 'Burp Suite', 'Drozer', 'Ghidra'],
  countermeasures: [
    'Enforce strict Mobile Device Management (MDM) policies: aggressively block jailbroken/rooted devices, enforce screen locks, and enable remote wipe capabilities.',
    'Developers MUST implement SSL/Certificate Pinning to prevent Man-in-the-Middle attacks on backend API traffic.',
    'Never hardcode sensitive information (API keys, AWS credentials, encryption keys) in the source code; use the OS-provided secure storage (iOS Keychain, Android Keystore).',
    'Implement code obfuscation (e.g., ProGuard/R8 on Android) to make static reverse engineering significantly more difficult.',
    'Implement robust anti-tampering and runtime protection (RASP) to detect dynamic instrumentation tools like Frida or debugging attempts.',
  ],
  examTips: [
    'Android uses APKs (Dalvik/ART bytecode, easily decompiled to Java). iOS uses IPAs (Mach-O native ARM binaries, much harder to reverse engineer).',
    'Rooting (Android) and Jailbreaking (iOS) break the OS sandbox, giving full system access to all apps (and malware).',
    'MDM (Mobile Device Management) is the enterprise solution for securing BYOD and corporate devices (remote wipe, policy enforcement).',
    'SSL Pinning is the specific developer defense against MitM proxy attacks on mobile apps. Objection/Frida are the attacker tools used to bypass it.',
    'Insecure Data Storage (storing cleartext passwords in local SQLite databases or SharedPreferences) is a top mobile vulnerability on the OWASP Mobile Top 10.',
  ],
  realWorldScenarios: [
    'You are assessing a modern banking app. You set up Burp Suite as a proxy, but the app refuses to connect due to SSL Pinning. You launch `objection` against the app, run the `android sslpinning disable` command, and successfully intercept the HTTPS traffic. You then discover an IDOR vulnerability in the backend API that allows you to view other customers\' accounts.',
    'You use JADX to decompile a ride-sharing APK and find the AWS S3 Access Keys hardcoded in the `Constants.java` file. You use these keys to access the company\'s cloud storage and download driver license photos without ever touching the app\'s backend API.',
    'A corporate employee roots their Android device to install a custom ROM. They then install a "free" premium game from a third-party site. The game is a repackaged APK containing a hidden RAT. Because the device is rooted, the malware breaks the sandbox, reads the corporate MDM authentication tokens from memory, and exfiltrates corporate emails.',
    'You run MobSF (Mobile Security Framework) against a healthcare app. The automated static analysis reveals that a specific Activity component is "exported" (`android:exported="true"`) but lacks intent permissions. You craft a malicious app that sends an intent directly to that Activity, bypassing the login screen entirely.',
  ],
  prerequisites: ['M14 — Mobile apps are essentially rich clients for Web APIs; understanding Web App hacking is crucial for mobile backend exploitation.'],
};

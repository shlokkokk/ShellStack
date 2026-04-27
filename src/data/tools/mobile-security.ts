import type { Tool } from '../toolTypes';

export const mobileSecurityTools: Tool[] = [
  {
    id: 'mobsf',
    name: 'MobSF (Mobile Security Framework)',
    description: 'An automated, all-in-one mobile application (Android/iOS/Windows) pentesting framework capable of performing both static and dynamic analysis. It decodes APKs, decompiles code, checks for insecure configurations, performs certificate pinning bypass, and provides a risk score with detailed findings.',
    category: 'mobile-security',
    difficulty: 'intermediate',
    tags: ['android', 'ios', 'mobile', 'static-analysis', 'dynamic-analysis', 'automated'],
    commands: [
      { command: 'docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf', description: 'Start MobSF via Docker (recommended) — web UI on http://localhost:8000' },
      { command: 'python manage.py runserver', description: 'Start MobSF manually after installation (inside the MobSF directory)' },
      { command: 'curl -F "file=@app.apk" http://localhost:8000/api/v1/upload -H "Authorization: API_KEY"', description: 'Upload an APK for static analysis via the REST API' },
      { command: 'curl "http://localhost:8000/api/v1/scan" -X POST -d "scan_type=apk&file_name=app.apk&hash=HASH" -H "Authorization: API_KEY"', description: 'Trigger a static scan via API after uploading' },
      { command: 'curl "http://localhost:8000/api/v1/report_json?hash=HASH" -H "Authorization: API_KEY"', description: 'Download the full scan report as JSON via API' },
      { command: 'curl "http://localhost:8000/api/v1/download_pdf?hash=HASH" -H "Authorization: API_KEY" -o report.pdf', description: 'Download a PDF report for the scanned APK' },
    ],
    whenToUse: [
      'For rapid, automated static analysis of an APK or IPA without setting up complex toolchains',
      'To find hardcoded secrets, insecure data storage, weak cryptography, and permission abuse',
      'When you need a beautiful, PDF-exportable report of all mobile app findings for a client',
    ],
    commonFlags: [
      { flag: 'Static Analysis', description: 'Upload APK/IPA to the web UI for automated decompilation and analysis' },
      { flag: 'Dynamic Analysis', description: 'Connect a physical or emulated Android device for runtime analysis' },
      { flag: 'API', description: 'REST API for CI/CD pipeline integration' },
    ],
    outputExample: [
      'MobSF Static Analysis Summary',
      'App Name: BankingApp',
      'Package: com.bank.app',
      'Security Score: 32/100',
      '',
      'HIGH Risks:',
      '  - Hardcoded Secret Found: api_key = "sk_live_XXXXXXXX" (MainActivity.java:45)',
      '  - Insecure Storage: Sensitive data stored in SharedPreferences without encryption',
      '  - Certificate Pinning: NOT IMPLEMENTED',
      '',
      'MEDIUM Risks:',
      '  - Exported Activity with no permission check: .LoginActivity',
      '  - allowBackup=true in AndroidManifest.xml'
    ],
    relatedTools: ['frida', 'objection', 'apktool', 'jadx'],
    installation: 'docker pull opensecurity/mobile-security-framework-mobsf',
    website: 'https://github.com/MobSF/Mobile-Security-Framework-MobSF',
    interactiveCommands: [
      {
        name: 'MobSF API Orchestrator',
        description: 'Generate cURL commands to interact with the MobSF REST API for automated analysis pipelines.',
        inputs: [
          { id: 'action', label: 'API Action', type: 'select', options: ['Upload File (/api/v1/upload)', 'Scan File (/api/v1/scan)', 'Get JSON Report (/api/v1/report_json)', 'Get PDF Report (/api/v1/download_pdf)', 'Delete Scan (/api/v1/delete_scan)'], defaultValue: 'Upload File (/api/v1/upload)' },
          { id: 'apiKey', label: 'MobSF API Key', type: 'text', defaultValue: 'YOUR_API_KEY', placeholder: 'Required for all API calls' },
          { id: 'host', label: 'MobSF Host', type: 'text', defaultValue: 'http://localhost:8000', placeholder: 'e.g., http://10.0.0.5:8000' },
          { id: 'filePath', label: 'File Path', type: 'text', defaultValue: 'app.apk', placeholder: 'Required for Upload action' },
          { id: 'hash', label: 'File Hash', type: 'text', defaultValue: '', placeholder: 'Required for Scan, Report, Delete actions' },
          { id: 'scanType', label: 'Scan Type', type: 'select', options: ['apk', 'ipa', 'appx', 'zip'], defaultValue: 'apk' }
        ],
        generator: (inputs) => {
          const baseCmd = `curl -H "Authorization: ${inputs.apiKey}"`;
          
          if (inputs.action.includes('upload')) {
            return `${baseCmd} -F "file=@${inputs.filePath}" ${inputs.host}/api/v1/upload`;
          } else if (inputs.action.includes('scan')) {
            return `${baseCmd} -X POST -d "scan_type=${inputs.scanType}&file_name=${inputs.filePath.split('/').pop()}&hash=${inputs.hash}" ${inputs.host}/api/v1/scan`;
          } else if (inputs.action.includes('report_json')) {
            return `${baseCmd} "${inputs.host}/api/v1/report_json?hash=${inputs.hash}"`;
          } else if (inputs.action.includes('download_pdf')) {
            return `${baseCmd} "${inputs.host}/api/v1/download_pdf?hash=${inputs.hash}" -o report.pdf`;
          } else if (inputs.action.includes('delete_scan')) {
            return `${baseCmd} -X POST -d "hash=${inputs.hash}" ${inputs.host}/api/v1/delete_scan`;
          }
          return `${baseCmd} ${inputs.host}`;
        }
      }
    ]
  },
  {
    id: 'frida',
    name: 'Frida',
    description: 'A dynamic instrumentation toolkit that lets you inject JavaScript snippets or your own library into native apps on Windows, macOS, GNU/Linux, iOS, and Android. Pen testers use it to bypass certificate pinning, bypass root detection, hook functions, dump memory, and intercept encryption routines at runtime without decompiling.',
    category: 'mobile-security',
    difficulty: 'advanced',
    tags: ['android', 'ios', 'dynamic-analysis', 'hook', 'reverse-engineering', 'must-know'],
    commands: [
      { command: 'frida-ps -Ua', description: 'List all applications running on an attached USB Android device' },
      { command: 'frida-ps -Uai', description: 'List all installed apps (running + not running) with their identifiers on USB device' },
      { command: 'frida -U -n com.example.app -l script.js', description: 'Attach Frida to a running app on a USB device and inject a JavaScript script' },
      { command: 'frida -U -f com.example.app --no-pause -l script.js', description: 'Spawn and immediately inject into an app before it runs any code (good for anti-debug bypass)' },
      { command: 'frida-trace -U -i "SSL_write" com.example.app', description: 'Trace specific native function calls (here: SSL_write to capture pre-encrypted data)' },
      { command: 'frida-trace -U -j "com.example.CryptoUtil*!*" com.example.app', description: 'Trace all Java method calls matching a wildcard pattern on a specific class' },
      { command: 'frida -U -f com.example.app --codeshare akabe1/frida-multiple-unpinning', description: 'Use a community Frida script from codeshare to bypass multiple pinning implementations' },
      { command: 'frida-kill -U com.example.app', description: 'Kill (terminate) a specific app on the device' },
      { command: 'frida-ls-devices', description: 'List all connected Frida-compatible devices (USB, remote, local)' },
    ],
    whenToUse: [
      'To bypass certificate pinning so you can intercept HTTPS traffic through Burp Suite or mitmproxy',
      'To bypass root detection and jailbreak detection in mobile apps',
      'To hook application functions and dump decrypted data at runtime',
      'For runtime method tracing to understand obfuscated code without full decompilation',
    ],
    commonFlags: [
      { flag: '-U', description: 'Connect to a USB-attached device' },
      { flag: '-n', description: 'Attach to an already-running process by name' },
      { flag: '-f', description: 'Spawn (launch) an application fresh before injecting' },
      { flag: '-l', description: 'Load and inject a JavaScript file' },
      { flag: '--no-pause', description: 'Do not pause the app at startup (inject and let it run immediately)' },
    ],
    outputExample: [
      '[Frida Script: SSL Bypass]',
      'Injected SSL bypass script...',
      '[*] Bypassing SSL Pinning via OkHttp3',
      '[*] Bypassing SSL Pinning via TrustManager',
      '[*] Certificate pinning disabled successfully!',
      '[*] Now configure Burp Suite as HTTP proxy and intercept all HTTPS traffic.'
    ],
    relatedTools: ['objection', 'mobsf', 'apktool', 'jadx', 'mitmproxy'],
    installation: 'pip install frida-tools   # Also install the Frida server on the Android device',
    website: 'https://frida.re',
    interactiveCommands: [
      {
        name: 'Frida Injection Builder',
        description: 'Build comprehensive Frida commands for dynamic instrumentation, tracing, and code hooking.',
        inputs: [
          { id: 'mode', label: 'Execution Mode', type: 'select', options: ['Attach (-n)', 'Spawn Fresh (-f)', 'Process List (frida-ps)', 'Trace (frida-trace)', 'Kill (frida-kill)'], defaultValue: 'Spawn Fresh (-f)' },
          { id: 'device', label: 'Device Target', type: 'select', options: ['USB (-U)', 'Remote (-R)', 'Local (-D)'], defaultValue: 'USB (-U)' },
          { id: 'target', label: 'App / Process', type: 'text', defaultValue: 'com.example.app', placeholder: 'Package name or PID' },
          { id: 'script', label: 'Load Script (-l)', type: 'text', defaultValue: '', placeholder: 'Local path to .js script' },
          { id: 'codeshare', label: 'Codeshare Script', type: 'text', defaultValue: '', placeholder: 'e.g., akabe1/frida-multiple-unpinning' },
          { id: 'noPause', label: 'No Pause (--no-pause)', type: 'checkbox', defaultValue: 'true', placeholder: 'Do not pause spawned process' },
          { id: 'traceFunc', label: 'Trace Function (-i)', type: 'text', defaultValue: '', placeholder: 'Native function (e.g., SSL_write)' },
          { id: 'traceJava', label: 'Trace Java (-j)', type: 'text', defaultValue: '', placeholder: 'Java class/method (e.g., *crypto*)' },
          { id: 'output', label: 'Output File (-o)', type: 'text', defaultValue: '', placeholder: 'Log output to file' }
        ],
        generator: (inputs) => {
          let cmd = 'frida';
          if (inputs.mode.includes('frida-ps')) return `frida-ps ${inputs.device.split(' ')[0]}ai`;
          if (inputs.mode.includes('frida-kill')) return `frida-kill ${inputs.device.split(' ')[0]} ${inputs.target}`;
          if (inputs.mode.includes('frida-trace')) cmd = 'frida-trace';
          
          cmd += ` ${inputs.device.split(' ')[0]}`;
          
          if (inputs.mode.includes('Spawn')) cmd += ` -f ${inputs.target}`;
          else if (inputs.mode.includes('Attach') || cmd === 'frida-trace') cmd += ` -n ${inputs.target}`;
          
          if (inputs.noPause === 'true' && inputs.mode.includes('Spawn')) cmd += ' --no-pause';
          if (inputs.script) cmd += ` -l ${inputs.script}`;
          if (inputs.codeshare) cmd += ` --codeshare ${inputs.codeshare}`;
          if (inputs.traceFunc) cmd += ` -i "${inputs.traceFunc}"`;
          if (inputs.traceJava) cmd += ` -j "${inputs.traceJava}"`;
          if (inputs.output) cmd += ` -o ${inputs.output}`;
          
          return cmd.replace('-n -n', '-n').replace('-f -n', '-f');
        }
      }
    ]
  },
  {
    id: 'objection',
    name: 'Objection',
    description: 'A powerful runtime mobile exploration toolkit built on top of Frida. It gives you a comprehensive REPL shell to explore and manipulate a running mobile app without needing to write custom Frida scripts. Automates common tasks: SSL bypass, root detection bypass, memory dumping, and file system exploration.',
    category: 'mobile-security',
    difficulty: 'intermediate',
    tags: ['android', 'ios', 'frida', 'runtime', 'interactive'],
    commands: [
      { command: 'objection -g com.example.app explore', description: 'Launch an interactive Objection shell attached to the running app' },
      { command: 'android sslpinning disable', description: '(In Objection shell) Disable SSL Certificate Pinning — the most common command' },
      { command: 'android root disable', description: '(In Objection shell) Disable root detection checks' },
      { command: 'android hooking list classes', description: '(In Objection shell) List all loaded Java classes in the app' },
      { command: 'android hooking search classes crypto', description: '(In Objection shell) Search loaded classes for any containing "crypto"' },
      { command: 'android hooking watch class com.example.LoginManager', description: '(In Objection shell) Watch all method calls on a specific class — prints arguments and return values' },
      { command: 'android hooking watch class_method com.example.LoginManager.checkPassword --dump-args --dump-return', description: '(In Objection shell) Hook a specific method and dump its arguments and return value on every call' },
      { command: 'android heap execute --return-string com.example.CryptoUtils getDecryptedKey', description: '(In Objection shell) Call a specific method on a live heap object' },
      { command: 'android intent launch_activity com.example.AdminActivity', description: '(In Objection shell) Launch a hidden/unexported activity directly' },
      { command: 'android keystore list', description: '(In Objection shell) List all entries in the Android Keystore (may contain encryption keys)' },
      { command: 'android clipboard monitor', description: '(In Objection shell) Monitor clipboard for sensitive data being copied' },
      { command: 'memory dump all dump.bin', description: '(In Objection shell) Dump the entire application memory to a binary file' },
      { command: 'sqlite connect /data/data/com.example.app/databases/app.db', description: '(In Objection shell) Connect to a SQLite database and query it interactively' },
      { command: 'import /path/to/file.js', description: '(In Objection shell) Import and run a custom Frida script' },
    ],
    whenToUse: [
      'To bypass SSL pinning without writing Frida scripts manually — one command does it all',
      'To explore live app data, file structures, and memory without recompiling the APK',
      'To access hidden admin activities not exposed in the normal app UI',
    ],
    commonFlags: [
      { flag: '-g', description: 'Target application\'s package name or process name' },
      { flag: 'explore', description: 'Start the interactive Objection REPL shell' },
      { flag: 'android sslpinning disable', description: 'One-shot SSL pinning bypass command (in shell)' },
    ],
    outputExample: [
      '     _     _         _   _',
      '  ___| |__ | | ___  ___| |_(_) ___  _ __',
      ' / _ \\ \'_ \\| |/ _ \\/ __| __| |/ _ \\| \'_ \\',
      '|  __/ |_) | |  __/ (__| |_| | (_) | | | |',
      ' \\___|_.__/|_|\\___|\\___|\\__|_|\\___/|_| |_|',
      '',
      'com.example.app on (android: 11) [usb] # android sslpinning disable',
      '(agent) Custom TrustManager registered, intercepting SSL checks...',
      '(agent) OkHttp3 CertificatePinner patched.',
      '[+] SSL Pinning bypassed! Configure your proxy and capture traffic.'
    ],
    relatedTools: ['frida', 'mobsf', 'burpsuite', 'mitmproxy'],
    installation: 'pip install objection',
    website: 'https://github.com/sensepost/objection',
    interactiveCommands: [
      {
        name: 'Objection REPL & Shell Builder',
        description: 'Build complete objection runtime exploration commands and REPL scripts.',
        inputs: [
          { id: 'target', label: 'Target App (-g)', type: 'text', defaultValue: 'com.example.app', placeholder: 'App package name' },
          { id: 'action', label: 'Initial Action', type: 'select', options: ['explore (Launch REPL)', 'patchapk (Inject into APK)'], defaultValue: 'explore (Launch REPL)' },
          { id: 'startupCmd', label: 'Startup Command (-s)', type: 'select', options: ['None', 'android sslpinning disable', 'android root disable', 'android keystore list', 'memory dump all dump.bin', 'Custom Command'], defaultValue: 'None' },
          { id: 'customCmd', label: 'Custom Command', type: 'text', defaultValue: '', placeholder: 'Command to run automatically on start' },
          { id: 'network', label: 'Network (-N)', type: 'checkbox', defaultValue: 'false', placeholder: 'Connect over network (e.g., Corellium)' },
          { id: 'api', label: 'API Host (-h)', type: 'text', defaultValue: '', placeholder: 'Target IP if networked' },
          { id: 'apk', label: 'Source APK (-s)', type: 'text', defaultValue: '', placeholder: 'Required for patchapk' }
        ],
        generator: (inputs) => {
          let cmd = `objection`;
          
          if (inputs.network === 'true') {
            cmd += ' -N';
            if (inputs.api) cmd += ` -h ${inputs.api}`;
          } else {
            cmd += ` -g ${inputs.target}`;
          }
          
          if (inputs.action.includes('patchapk')) {
            return `objection patchapk -s ${inputs.apk}`;
          }
          
          cmd += ' explore';
          
          let startup = '';
          if (inputs.startupCmd === 'Custom Command') {
            startup = inputs.customCmd;
          } else if (inputs.startupCmd !== 'None') {
            startup = inputs.startupCmd;
          }
          
          if (startup) {
            cmd += ` -s "${startup}"`;
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'drozer',
    name: 'Drozer',
    description: 'The leading security testing framework for Android. Drozer allows you to interact with the Android framework (IPC, Binder, Content Providers, Activities, Broadcast Receivers) as though you were another malicious app. Essential for testing Android app components that are exported and accessible to other apps.',
    category: 'mobile-security',
    difficulty: 'advanced',
    tags: ['android', 'ipc', 'content-provider', 'binder', 'attack-surface'],
    commands: [
      { command: 'adb forward tcp:31415 tcp:31415', description: 'Step 1: Forward port from the device (after installing Drozer agent on the Android device)' },
      { command: 'drozer console connect', description: 'Step 2: Connect Drozer client to the device agent and launch interactive console' },
      { command: 'run app.package.list -f bank', description: '(In Drozer console) Search for installed packages matching "bank"' },
      { command: 'run app.package.info -a com.example.app', description: '(In Drozer console) Get detailed package info (permissions, activities, services, providers)' },
      { command: 'run app.package.attacksurface com.example.app', description: '(In Drozer console) Enumerate the full attack surface (exported components without permissions)' },
      { command: 'run app.activity.info -a com.example.app', description: '(In Drozer console) List all activities and whether they are exported' },
      { command: 'run app.activity.start --component com.example.app .AdminActivity', description: '(In Drozer console) Launch a hidden exported Activity to access locked UI' },
      { command: 'run app.provider.info -a com.example.app', description: '(In Drozer console) List all content providers and their read/write permissions' },
      { command: 'run app.provider.query content://com.example.app.db/users', description: '(In Drozer console) Query an exported Content Provider directly for user data' },
      { command: 'run app.provider.read content://com.example.app.files/../../../etc/hosts', description: '(In Drozer console) Attempt directory traversal through a Content Provider to read arbitrary files' },
      { command: 'run scanner.provider.injection -a com.example.app', description: '(In Drozer console) Test all content providers for SQL injection' },
      { command: 'run scanner.provider.traversal -a com.example.app', description: '(In Drozer console) Test all content providers for path traversal vulnerabilities' },
      { command: 'run app.broadcast.info -a com.example.app', description: '(In Drozer console) List all broadcast receivers and check for unexported ones' },
      { command: 'run app.broadcast.send --action com.example.app.RESET_PASSWORD --extra string email attacker@evil.com', description: '(In Drozer console) Send a crafted broadcast intent to an exported receiver' },
      { command: 'run app.service.info -a com.example.app', description: '(In Drozer console) List all services and check exported status' },
    ],
    whenToUse: [
      'To discover and exploit exported Android components (Activities, Services, BroadcastReceivers, ContentProviders)',
      'To test Content Providers for SQL injection and directory traversal vulnerabilities',
      'To simulate a malicious app attacking another app through Android\'s IPC mechanisms',
    ],
    commonFlags: [
      { flag: 'console connect', description: 'Connect to the Drozer agent on the device' },
      { flag: 'run <module>', description: 'Execute a specific Drozer module' },
      { flag: 'list', description: 'List all available Drozer modules' },
    ],
    outputExample: [
      'dz> run app.package.attacksurface com.example.app',
      'Attack Surface:',
      '  4 activities exported',
      '  1 broadcast receiver exported',
      '  2 content providers exported',
      '  0 services exported',
      '',
      '  is debuggable',
      '  has custom permissions (1 dangerous)'
    ],
    relatedTools: ['frida', 'objection', 'apktool'],
    installation: 'pip install drozer   # Also install drozer agent APK on Android device',
    website: 'https://github.com/WithSecureLabs/drozer',
    interactiveCommands: [
      {
        name: 'Drozer Android Attacker',
        description: 'Build complete Drozer commands to analyze and exploit Android IPC components.',
        inputs: [
          { id: 'action', label: 'Execution Mode', type: 'select', options: ['Connect to Agent', 'Execute Module (run)'], defaultValue: 'Execute Module (run)' },
          { id: 'module', label: 'Drozer Module', type: 'select', options: ['app.package.list', 'app.package.attacksurface', 'app.activity.info', 'app.activity.start', 'app.provider.info', 'app.provider.query', 'app.provider.read', 'scanner.provider.injection', 'app.broadcast.send', 'app.service.info'], defaultValue: 'app.package.attacksurface' },
          { id: 'targetApp', label: 'Target App (-a)', type: 'text', defaultValue: 'com.example.app', placeholder: 'Package Name' },
          { id: 'component', label: 'Component (--component)', type: 'text', defaultValue: '', placeholder: 'e.g., .MainActivity (for activity.start)' },
          { id: 'uri', label: 'Content URI', type: 'text', defaultValue: 'content://com.example.app.db/users', placeholder: 'For provider read/query' },
          { id: 'actionIntent', label: 'Intent Action (--action)', type: 'text', defaultValue: '', placeholder: 'For broadcast.send' },
          { id: 'extras', label: 'Intent Extras', type: 'text', defaultValue: '', placeholder: 'e.g., --extra string key value' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'Connect to Agent') return 'drozer console connect';
          
          let cmd = `run ${inputs.module}`;
          
          if (inputs.module === 'app.package.list') return `${cmd} -f ${inputs.targetApp}`;
          
          if (!inputs.module.includes('provider.query') && !inputs.module.includes('provider.read') && !inputs.module.includes('broadcast.send')) {
             cmd += ` -a ${inputs.targetApp}`;
          }
          
          if (inputs.module === 'app.activity.start' && inputs.component) {
            cmd += ` --component ${inputs.targetApp} ${inputs.component}`;
          }
          
          if ((inputs.module === 'app.provider.query' || inputs.module === 'app.provider.read') && inputs.uri) {
            cmd += ` ${inputs.uri}`;
          }
          
          if (inputs.module === 'app.broadcast.send' && inputs.actionIntent) {
            cmd += ` --action ${inputs.actionIntent}`;
            if (inputs.extras) cmd += ` ${inputs.extras}`;
          }
          
          return cmd;
        }
      }
    ]
  },
];

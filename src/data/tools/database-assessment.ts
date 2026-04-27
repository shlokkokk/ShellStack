import type { Tool } from '../toolTypes';

export const databaseAssessmentTools: Tool[] = [
  {
    id: 'sqlmap-db',
    name: 'SQLMap (DB Mode)',
    description: 'The industry-standard SQL injection and database exploitation tool, used here specifically for direct database connection, enumeration, dumping, and OS takeover bypassing web parameters.',
    category: 'database-assessment',
    difficulty: 'intermediate',
    tags: ['database', 'sql-injection', 'dump', 'takeover', 'exploitation'],
    commands: [
      { command: 'sqlmap -d "mysql://user:password@192.168.1.100:3306/dbname"', description: 'Establish a direct connection to a MySQL database natively' },
      { command: 'sqlmap -d "postgres://user:password@192.168.1.100:5432/dbname" --os-shell', description: 'Connect directly to PostgreSQL and attempt to spawn an interactive OS shell' },
      { command: 'sqlmap -d "mssql://user:password@192.168.1.100:1433/dbname" --sql-query="SELECT * FROM users"', description: 'Connect directly and execute arbitrary custom SQL queries natively' },
      { command: 'sqlmap -u "http://example.com/vuln.php?id=1" --dump-all --exclude-sysdbs', description: 'Dump all databases across the server excluding standard system tables' },
    ],
    whenToUse: [
      'When you have valid database credentials but no direct client interface access',
      'To automate the massive extraction and dumping of databases via an identified injection point',
      'To escalate database privileges into full OS level execution utilizing internal DB mechanisms natively (xp_cmdshell, INTO OUTFILE)',
    ],
    commonFlags: [
      { flag: '-d', description: 'Direct connection string to database' },
      { flag: '--dump', description: 'Dump database table entries' },
      { flag: '--os-shell', description: 'Prompt for an interactive operating system shell' },
      { flag: '--sql-query', description: 'SQL query to be executed' },
      { flag: '--exclude-sysdbs', description: 'Exclude system databases when dumping' },
    ],
    relatedTools: ['nosqlmap', 'dbeaver'],
    installation: 'sudo apt install sqlmap -y',
    website: 'https://sqlmap.org',
    interactiveCommands: [
      {
        name: 'SQLMap Direct DB Attacker',
        description: 'Generate direct database connection strings to exploit DB services without going through a web application.',
        inputs: [
          { id: 'dbType', label: 'Database Engine', type: 'select', options: ['mysql', 'postgres', 'mssql', 'oracle'], defaultValue: 'mysql' },
          { id: 'user', label: 'Username', type: 'text', defaultValue: 'sa', placeholder: 'Database user' },
          { id: 'password', label: 'Password', type: 'text', defaultValue: 'password123', placeholder: 'Database password' },
          { id: 'host', label: 'Target Host/IP', type: 'text', defaultValue: '192.168.1.100', placeholder: 'IP Address' },
          { id: 'port', label: 'Port', type: 'text', defaultValue: '3306', placeholder: 'e.g., 3306, 5432, 1433' },
          { id: 'dbname', label: 'Database Name', type: 'text', defaultValue: 'master', placeholder: 'Target DB' },
          { id: 'action', label: 'Action', type: 'select', options: ['--dump-all', '--os-shell', '--sql-shell', '--priv-esc'], defaultValue: '--dump-all' },
          { id: 'exclude', label: 'Exclude SysDBs', type: 'checkbox', defaultValue: 'true', placeholder: '--exclude-sysdbs' }
        ],
        generator: (inputs) => {
          let cmd = `sqlmap -d "${inputs.dbType}://${inputs.user}:${inputs.password}@${inputs.host}:${inputs.port}/${inputs.dbname}"`;
          
          if (inputs.action) cmd += ` ${inputs.action}`;
          if (inputs.action === '--dump-all' && inputs.exclude === 'true') {
            cmd += ' --exclude-sysdbs';
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'nosqlmap',
    name: 'NoSQLMap',
    description: 'An automated open-source penetration testing tool designed to audit for and automate injection attacks against NoSQL databases (specifically MongoDB and CouchDB) and web applications relying on them.',
    category: 'database-assessment',
    difficulty: 'intermediate',
    tags: ['database', 'nosql', 'mongodb', 'couchdb', 'injection'],
    commands: [
      { command: 'python nosqlmap.py', description: 'Launch the interactive menu interface natively' },
    ],
    whenToUse: [
      'When targeting modern web applications using MongoDB or CouchDB backend architectures',
      'To dynamically discover default NoSQL setups explicitly exposed with no authentication enabled',
      'To reliably exploit NoSQL injection flaws via complex JSON parameters bypassing WAFs',
      'For launching sophisticated MongoDB timing attacks to extract data blind natively',
    ],
    commonFlags: [
      { flag: '--attack', description: 'Start the attack modules' },
      { flag: '--enumerate', description: 'Enumerate NoSQL databases and collections' },
    ],
    relatedTools: ['sqlmap', 'mongoaudit'],
    installation: 'git clone https://github.com/codingo/NoSQLMap.git && cd NoSQLMap && python setup.py install',
    website: 'https://github.com/codingo/NoSQLMap',
    interactiveCommands: [
      {
        name: 'NoSQLMap Launcher',
        description: 'Generate NoSQLMap commands for automated NoSQL database injection and enumeration.',
        inputs: [
          { id: 'mode', label: 'Launch Mode', type: 'select', options: ['Interactive Menu', '--attack', '--enumerate', '--scan'], defaultValue: 'Interactive Menu' },
          { id: 'target', label: 'Target URL/IP', type: 'text', defaultValue: '', placeholder: 'e.g., http://example.com' },
          { id: 'dbType', label: 'Database Type', type: 'select', options: ['MongoDB', 'CouchDB'], defaultValue: 'MongoDB' },
          { id: 'port', label: 'Port', type: 'text', defaultValue: '27017', placeholder: 'Default NoSQL port' },
          { id: 'auth', label: 'Authentication', type: 'text', defaultValue: '', placeholder: 'user:pass' },
          { id: 'verbose', label: 'Verbose Mode (-v)', type: 'checkbox', defaultValue: 'true', placeholder: 'Enable verbose output' }
        ],
        generator: (inputs) => {
          let cmd = 'python nosqlmap.py';
          
          if (inputs.mode !== 'Interactive Menu') {
             cmd += ` ${inputs.mode.split(' ')[0]}`;
             if (inputs.target) cmd += ` -t ${inputs.target}`;
             if (inputs.dbType === 'CouchDB') cmd += ' --couchdb';
             if (inputs.port) cmd += ` -p ${inputs.port}`;
             if (inputs.auth) cmd += ` -a "${inputs.auth}"`;
             if (inputs.verbose === 'true') cmd += ' -v';
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'odat',
    name: 'ODAT (Oracle Database Attacking Tool)',
    description: 'The Oracle Database Attacking Tool. An incredibly comprehensive penetration testing framework specifically built to attack Oracle database servers remotely, brute-forcing accounts, escalating privileges, and executing commands natively.',
    category: 'database-assessment',
    difficulty: 'advanced',
    tags: ['database', 'oracle', 'odat', 'pentest', 'exploitation'],
    commands: [
      { command: 'python odat.py all -s 192.168.1.100', description: 'Execute all vulnerability modules comprehensively against the target' },
      { command: 'python odat.py passwordguesser -s 192.168.1.100 -p 1521', description: 'Brute force Oracle credentials utilizing known default passwords natively' },
      { command: 'python odat.py utlfile -s 192.168.1.100 -U sys -P pass --sysdba --putFile /tmp test.txt ./test.txt', description: 'Upload arbitrary files natively via Oracle mechanisms' },
      { command: 'python odat.py dbms_scheduler -s 192.168.1.100 -U sys -P pass --sysdba --exec "cmd.exe /c calc.exe"', description: 'Execute raw OS commands directly escalating to RCE' },
    ],
    whenToUse: [
      'When you encounter Oracle TNS listeners on port 1521 during an internal penetration test',
      'To rapidly safely brute force Oracle accounts using known default administrative SIDs',
      'To cleanly escalate privileges to DBA and eventually achieve remote code execution',
    ],
    commonFlags: [
      { flag: '-s', description: 'Target IP address or hostname' },
      { flag: '-p', description: 'Port number (default 1521)' },
      { flag: '-U', description: 'Username for connection' },
      { flag: '-P', description: 'Password for connection' },
      { flag: '--sysdba', description: 'Connect as SYSDBA role' },
    ],
    relatedTools: ['sqlmap', 'nmap'],
    installation: 'sudo apt install odat -y',
    website: 'https://github.com/quentinhardy/odat',
    interactiveCommands: [
      {
        name: 'ODAT Attack Launcher',
        description: 'Construct complex ODAT commands for Oracle DB brute-forcing, file uploads, and RCE.',
        inputs: [
          { id: 'module', label: 'Attack Module', type: 'select', options: ['all', 'passwordguesser', 'utlfile', 'dbms_scheduler'], defaultValue: 'all' },
          { id: 'target', label: 'Target IP (-s)', type: 'text', defaultValue: '192.168.1.100', placeholder: 'IP address' },
          { id: 'port', label: 'Port (-p)', type: 'text', defaultValue: '1521', placeholder: 'Oracle listener port' },
          { id: 'user', label: 'Username (-U)', type: 'text', defaultValue: 'sys', placeholder: 'Optional for all/guesser' },
          { id: 'password', label: 'Password (-P)', type: 'text', defaultValue: 'oracle', placeholder: 'Optional for all/guesser' },
          { id: 'sysdba', label: 'Is SYSDBA (--sysdba)', type: 'checkbox', defaultValue: 'true', placeholder: 'Connect as SYSDBA' },
          { id: 'cmd', label: 'OS Command (--exec)', type: 'text', defaultValue: 'cmd.exe /c calc.exe', placeholder: 'For dbms_scheduler' }
        ],
        generator: (inputs) => {
          let cmd = `python odat.py ${inputs.module} -s ${inputs.target} -p ${inputs.port}`;
          
          if (inputs.module !== 'all' && inputs.module !== 'passwordguesser') {
             if (inputs.user) cmd += ` -U ${inputs.user}`;
             if (inputs.password) cmd += ` -P ${inputs.password}`;
             if (inputs.sysdba === 'true') cmd += ' --sysdba';
          }
          
          if (inputs.module === 'dbms_scheduler' && inputs.cmd) {
             cmd += ` --exec "${inputs.cmd}"`;
          }
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'dbpw-audit',
    name: 'DBPwAudit',
    description: 'A fast, Java-based command-line tool allowing operators to perform rapid online dictionary and brute-force password audits against multiple major database engines natively over the network.',
    category: 'database-assessment',
    difficulty: 'beginner',
    tags: ['database', 'brute-force', 'passwords', 'audit'],
    commands: [
      { command: './dbpwaudit -s 192.168.1.100 -d master -D MySQL -U users.txt -P passwords.txt', description: 'Audit explicitly for weak MySQL database passwords natively' },
      { command: './dbpwaudit -s 192.168.1.100 -d master -D MSSQL -U users.txt -P passwords.txt', description: 'Audit explicitly for weak MS-SQL database passwords natively' },
    ],
    whenToUse: [
      'For extremely fast network-level brute forcing of database authentication services natively',
      'When you need to test database password policies directly without overhead frameworks',
      'To check efficiently for weak default credentials across Oracle, MSSQL, MySQL, and DB2 targets',
    ],
    commonFlags: [
      { flag: '-s', description: 'Target server IP address' },
      { flag: '-d', description: 'Database instance name' },
      { flag: '-D', description: 'Driver to use (MySQL, MSSQL, Oracle, DB2)' },
      { flag: '-U', description: 'File containing list of usernames' },
      { flag: '-P', description: 'File containing list of passwords' },
    ],
    relatedTools: ['hydra', 'medusa', 'ncrack'],
    installation: 'git clone https://github.com/nmonkee/dbpwaudit && cd dbpwaudit',
    website: 'https://github.com/nmonkee/dbpwaudit',
    interactiveCommands: [
      {
        name: 'DBPwAudit Brute Forcer',
        description: 'Generate fast, multi-engine database dictionary attack commands.',
        inputs: [
          { id: 'target', label: 'Target IP (-s)', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Target IP' },
          { id: 'driver', label: 'DB Driver (-D)', type: 'select', options: ['MySQL', 'MSSQL', 'Oracle', 'DB2'], defaultValue: 'MySQL' },
          { id: 'dbName', label: 'Database Name (-d)', type: 'text', defaultValue: 'master', placeholder: 'e.g., master, mysql' },
          { id: 'userList', label: 'User List (-U)', type: 'text', defaultValue: 'users.txt', placeholder: 'Path to user dictionary' },
          { id: 'passList', label: 'Password List (-P)', type: 'text', defaultValue: 'passwords.txt', placeholder: 'Path to password dictionary' },
          { id: 'port', label: 'Port (-p)', type: 'text', defaultValue: '', placeholder: 'Override default port' }
        ],
        generator: (inputs) => {
          let cmd = `./dbpwaudit -s ${inputs.target} -d ${inputs.dbName} -D ${inputs.driver} -U ${inputs.userList} -P ${inputs.passList}`;
          if (inputs.port) cmd += ` -p ${inputs.port}`;
          return cmd;
        }
      }
    ]
  },
  {
    id: 'mssqlclient',
    name: 'MSSQLClient (Impacket)',
    description: 'An advanced Python module from the Impacket suite providing a highly customized, direct MS-SQL interactive shell over network protocols. Crucial for Active Directory pentests, lateral movement, and Pass-the-Hash execution natively.',
    category: 'database-assessment',
    difficulty: 'intermediate',
    tags: ['database', 'mssql', 'impacket', 'windows', 'shell', 'active-directory'],
    commands: [
      { command: 'mssqlclient.py admin:Password123@192.168.1.100', description: 'Connect interactively using known plaintext credentials' },
      { command: 'mssqlclient.py -hashes :NTHASH admin@192.168.1.100', description: 'Connect transparently utilizing Pass-The-Hash natively' },
      { command: 'mssqlclient.py -windows-auth domain/user:pass@192.168.1.100', description: 'Connect authentically using mapped Windows Domain Authentication' },
      { command: 'SQL> enable_xp_cmdshell', description: 'Utilize the custom Impacket macro to instantly enable OS execution globally' },
      { command: 'SQL> xp_cmdshell whoami', description: 'Execute highly privileged OS commands directly via SQL wrapper natively' },
    ],
    whenToUse: [
      'When actively targeting MS-SQL servers during vast Active Directory penetration tests',
      'For stealthy lateral movement natively exploiting MS-SQL trusted domains directly',
      'To securely proxy SQL authentication natively via SMB relay attacks externally',
      'When native SQL GUI clients are strictly unavailable on your attack machine',
    ],
    commonFlags: [
      { flag: '-hashes', description: 'NTLM hashes for authentication (LM:NT)' },
      { flag: '-windows-auth', description: 'Use Windows Authentication (Domain/User)' },
      { flag: '-port', description: 'Target port (default 1433)' },
      { flag: '-dc-ip', description: 'IP Address of the Domain Controller' },
    ],
    relatedTools: ['crackmapexec', 'sqlmap', 'sqsh'],
    installation: 'sudo apt install python3-impacket -y',
    website: 'https://github.com/fortra/impacket',
    interactiveCommands: [
      {
        name: 'MSSQLClient Impacket Builder',
        description: 'Prepare Impacket MSSQL connection strings for Pass-the-Hash and AD integration.',
        inputs: [
          { id: 'authMode', label: 'Auth Mode', type: 'select', options: ['Plaintext', 'Pass-the-Hash (-hashes)'], defaultValue: 'Plaintext' },
          { id: 'domain', label: 'Domain', type: 'text', defaultValue: 'CORP', placeholder: 'Leave blank for local auth' },
          { id: 'user', label: 'Username', type: 'text', defaultValue: 'Administrator', placeholder: 'Target user' },
          { id: 'secret', label: 'Password or Hash', type: 'text', defaultValue: 'Password123!', placeholder: 'Cleartext or LM:NT hash' },
          { id: 'target', label: 'Target IP', type: 'text', defaultValue: '192.168.1.100', placeholder: 'Target IP Address' },
          { id: 'winAuth', label: 'Windows Auth', type: 'checkbox', defaultValue: 'true', placeholder: '-windows-auth' },
          { id: 'dcIp', label: 'DC IP (-dc-ip)', type: 'text', defaultValue: '', placeholder: 'Optional Domain Controller IP' }
        ],
        generator: (inputs) => {
          let cmd = 'mssqlclient.py';
          
          if (inputs.authMode === 'Pass-the-Hash (-hashes)') {
             cmd += ` -hashes :${inputs.secret.replace(':', '')}`;
          }
          if (inputs.winAuth === 'true') cmd += ' -windows-auth';
          if (inputs.dcIp) cmd += ` -dc-ip ${inputs.dcIp}`;
          
          const prefix = inputs.domain ? `${inputs.domain}/${inputs.user}` : inputs.user;
          const authString = inputs.authMode === 'Plaintext' ? `${prefix}:${inputs.secret}@${inputs.target}` : `${prefix}@${inputs.target}`;
          
          return `${cmd} ${authString}`;
        }
      }
    ]
  },
  {
    id: 'pgaudit',
    name: 'pgaudit',
    description: 'An official PostgreSQL extension that provides detailed, forensic-level session and object audit logging natively via the standard logging facility. Essential for compliance and monitoring deeply restricted database environments.',
    category: 'database-assessment',
    difficulty: 'advanced',
    tags: ['database', 'postgres', 'audit', 'logging', 'forensics'],
    commands: [
      { command: 'CREATE EXTENSION pgaudit;', description: 'Enable the internal audit extension natively (requires superuser privileges)' },
      { command: 'SET pgaudit.log = \'write, ddl\';', description: 'Configure granular logging specifically for DDL and write operations explicitly' },
    ],
    whenToUse: [
      'To comprehensively monitor and log all SQL statements affecting highly sensitive databases for forensic auditing',
      'To rigorously verify strict compliance frameworks directly within the database natively',
    ],
    commonFlags: [
      { flag: 'pgaudit.log', description: 'Configuration parameter for defining log classes' },
      { flag: 'pgaudit.role', description: 'Define the master role for auditing' },
    ],
    relatedTools: ['sqlmap', 'dbeaver'],
    installation: 'sudo apt install postgresql-pgaudit -y',
    website: 'https://github.com/pgaudit/pgaudit',
    interactiveCommands: [
      {
        name: 'pgAudit Configuration Generator',
        description: 'Generate PostgreSQL SQL commands to configure the pgAudit extension and set granular logging rules natively.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['Enable Extension', 'Set Log Classes', 'Set Audit Role', 'Disable Extension'], defaultValue: 'Set Log Classes' },
          { id: 'logClasses', label: 'Log Classes', type: 'text', defaultValue: 'write, ddl', placeholder: 'e.g., READ, WRITE, FUNCTION, ROLE, DDL, MISC, ALL' },
          { id: 'auditRole', label: 'Audit Role', type: 'text', defaultValue: 'auditor_role', placeholder: 'Role name for object auditing' },
          { id: 'logCatalog', label: 'Log Catalog', type: 'checkbox', defaultValue: 'false', placeholder: 'pgaudit.log_catalog' },
          { id: 'logRelation', label: 'Log Relation', type: 'checkbox', defaultValue: 'false', placeholder: 'pgaudit.log_relation' },
          { id: 'sessionScope', label: 'Session Scope', type: 'checkbox', defaultValue: 'true', placeholder: 'Use SET (session) vs ALTER SYSTEM' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'Enable Extension') return 'CREATE EXTENSION pgaudit;';
          if (inputs.action === 'Disable Extension') return 'DROP EXTENSION pgaudit;';
          
          let prefix = inputs.sessionScope === 'true' ? 'SET' : 'ALTER SYSTEM SET';
          
          if (inputs.action === 'Set Audit Role') {
            return `${prefix} pgaudit.role = '${inputs.auditRole}';`;
          }
          
          let cmd = `${prefix} pgaudit.log = '${inputs.logClasses}';`;
          if (inputs.logCatalog === 'true') cmd += `\n${prefix} pgaudit.log_catalog = on;`;
          if (inputs.logRelation === 'true') cmd += `\n${prefix} pgaudit.log_relation = on;`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'mongoaudit',
    name: 'MongoAudit',
    description: 'A highly automated CLI auditing tool that aggressively checks MongoDB instances for common security misconfigurations, missing authentication, exposed interfaces, and unpatched known CVE vulnerabilities instantly.',
    category: 'database-assessment',
    difficulty: 'beginner',
    tags: ['database', 'mongodb', 'audit', 'nosql', 'scanner'],
    commands: [
      { command: 'mongoaudit', description: 'Launch the interactive configuration wizard asking for target specifications natively' },
    ],
    whenToUse: [
      'To instantly check if a massive target MongoDB instance is open externally with no authentication required natively',
      'To securely verify if the target database is genuinely running with TLS/SSL encryption natively enabled securely',
      'To identify rapidly outdated and easily exploitable vulnerable MongoDB architectural versions natively',
    ],
    commonFlags: [
      { flag: 'mongoaudit', description: 'Launches the interactive configuration wizard' },
    ],
    relatedTools: ['nosqlmap'],
    installation: 'pip install mongoaudit',
    website: 'https://github.com/stamparm/mongoaudit',
    interactiveCommands: [
      {
        name: 'MongoAudit Launcher',
        description: 'Generate commands to launch the MongoAudit automated assessment wizard or headless scan.',
        inputs: [
          { id: 'mode', label: 'Launch Mode', type: 'select', options: ['Interactive Wizard', 'Headless Check'], defaultValue: 'Interactive Wizard' },
          { id: 'target', label: 'Target', type: 'text', defaultValue: '127.0.0.1', placeholder: 'Target IP' },
          { id: 'port', label: 'Port', type: 'text', defaultValue: '27017', placeholder: 'MongoDB port' },
          { id: 'auth', label: 'Authentication', type: 'text', defaultValue: '', placeholder: 'username:password' },
          { id: 'quiet', label: 'Quiet Mode', type: 'checkbox', defaultValue: 'false', placeholder: 'Suppress unnecessary output' },
          { id: 'export', label: 'Export Report', type: 'text', defaultValue: '', placeholder: 'e.g., report.json' }
        ],
        generator: (inputs) => {
          if (inputs.mode === 'Interactive Wizard') return 'mongoaudit';
          
          let cmd = `mongoaudit --host ${inputs.target} --port ${inputs.port}`;
          if (inputs.auth) cmd += ` --auth "${inputs.auth}"`;
          if (inputs.quiet === 'true') cmd += ' --quiet';
          if (inputs.export) cmd += ` --export ${inputs.export}`;
          return cmd;
        }
      }
    ]
  },
  {
    id: 'hexorbase',
    name: 'HexorBase',
    description: 'A GUI-based database administration and auditing application. It allows testers to manage MySQL, SQLite, PostgreSQL, Oracle, and MS-SQL from a single interface, while integrating basic network brute-forcing capabilities.',
    category: 'database-assessment',
    difficulty: 'beginner',
    tags: ['database', 'gui', 'administration', 'audit'],
    commands: [
      { command: 'hexorbase', description: 'Launch the complete HexorBase GUI environment natively' },
    ],
    whenToUse: [
      'When a clean graphical interface is strongly preferred natively over complex CLI tools for mass database administration natively',
      'To visually manage MySQL, SQLite, PostgreSQL, Oracle, and MS-SQL simultaneously from a single comprehensive pane of glass natively',
      'To reliably execute rapid visual brute force credential attacks locally within the robust GUI interface',
    ],
    commonFlags: [
      { flag: 'hexorbase', description: 'Starts the Graphical User Interface' },
    ],
    relatedTools: ['dbeaver', 'dbpwaudit'],
    installation: 'sudo apt install hexorbase -y',
    website: 'https://github.com/savio-code/hexorbase',
    interactiveCommands: [
      {
        name: 'HexorBase GUI Launcher',
        description: 'Launch the HexorBase administration GUI with optional debugging flags.',
        inputs: [
          { id: 'executable', label: 'Executable', type: 'text', defaultValue: 'hexorbase', placeholder: 'Launch command' },
          { id: 'debug', label: 'Debug Mode', type: 'checkbox', defaultValue: 'false', placeholder: 'Enable verbose GUI logging' },
          { id: 'lang', label: 'Language Override', type: 'select', options: ['Default', 'en', 'es', 'fr'], defaultValue: 'Default' },
          { id: 'profile', label: 'Load Profile', type: 'text', defaultValue: '', placeholder: 'Path to saved configuration' },
          { id: 'noSplash', label: 'No Splash Screen', type: 'checkbox', defaultValue: 'true', placeholder: 'Skip startup graphic' },
          { id: 'timeout', label: 'Connection Timeout', type: 'text', defaultValue: '30', placeholder: 'Seconds' }
        ],
        generator: (inputs) => {
          let cmd = inputs.executable;
          if (inputs.debug === 'true') cmd += ' --debug';
          if (inputs.lang !== 'Default') cmd += ` --lang=${inputs.lang}`;
          if (inputs.profile) cmd += ` --profile="${inputs.profile}"`;
          if (inputs.noSplash === 'true') cmd += ' --no-splash';
          if (inputs.timeout !== '30') cmd += ` --timeout=${inputs.timeout}`;
          return cmd;
        }
      }
    ]
  }
];

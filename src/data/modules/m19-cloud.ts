import type { Module } from '../cehModules';

export const m19: Module = {
  id: 'm19',
  number: 'M19',
  title: 'Cloud Computing Security',
  description: 'Analyze the unique security challenges introduced by cloud infrastructure (AWS, Azure, GCP). Master the Shared Responsibility Model, exploit misconfigured S3 buckets and IAM policies, escalate privileges in cloud environments using Pacu, understand container orchestration security (Docker/Kubernetes API exploitation), and learn how traditional attacks like SSRF adapt to compromise serverless and containerized deployments.',
  examWeight: '4%',
  estimatedQuestions: 5,
  duration: '3h 00m',
  topics: [
    {
      id: 'm19-t01',
      title: 'Cloud Concepts & Shared Responsibility',
      content: 'Cloud computing shifts physical infrastructure to a service model. The foundational concept in cloud security is the Shared Responsibility Model, which dictates precisely who (the Cloud Service Provider vs. the Customer) is responsible for securing which aspects of the stack. Failure to understand this model is the root cause of most cloud breaches.',
      keyPoints: [
        'IaaS (Infrastructure as a Service): E.g., AWS EC2, Azure VMs. Provider secures the physical hardware, networking, and hypervisor. Customer secures the OS, network firewalls (Security Groups), and application code.',
        'PaaS (Platform as a Service): E.g., AWS Elastic Beanstalk, Heroku. Provider secures the OS and runtime environment. Customer secures the application code and data.',
        'SaaS (Software as a Service): E.g., Microsoft 365, Salesforce. Provider secures almost everything. Customer is ONLY responsible for user access (IAM), data classification, and endpoint devices.',
        'The primary cause of cloud breaches is NOT cloud provider failure or zero-days, but Customer Misconfiguration (e.g., leaving a storage bucket publicly readable).',
      ],
    },
    {
      id: 'm19-t02',
      title: 'IAM (Identity & Access Management)',
      content: 'In the cloud, identity is the new perimeter. Network firewalls matter less than IAM policies. If an attacker compromises an IAM key or exploits an overly permissive role, they can take over the entire cloud environment, bypass network segmentation, and exfiltrate data directly via the CSP\'s API.',
      commands: [
        { command: 'aws sts get-caller-identity', description: 'Determine who you are authenticated as (similar to `whoami`) after finding leaked AWS credentials' },
        { command: 'aws s3 ls --profile stolen_keys', description: 'Enumerate S3 buckets using the stolen credentials' },
        { command: 'pacu', description: 'Launch the Pacu AWS exploitation framework to automatically enumerate permissions and find privilege escalation paths in IAM policies' },
        { command: 'run iam__privesc_scan', description: 'Pacu command to automatically scan for 21 different AWS IAM privilege escalation vectors' },
      ],
      keyPoints: [
        'Overly Permissive Policies: Granting `*` (wildcard) permissions (e.g., `s3:*` or `iam:*`) instead of strictly defining what actions a user/role can perform (Principle of Least Privilege).',
        'Metadata Service (IMDS): Cloud VMs (EC2 instances) have a local endpoint (`169.254.169.254`) that provides instance metadata, including temporary IAM credentials. If a web app on the EC2 instance has an SSRF vulnerability, attackers can steal these credentials.',
        'Privilege Escalation: Attackers look for specific permissions like `iam:PutUserPolicy`, `iam:AttachUserPolicy`, or `iam:CreateAccessKey` which allow a low-level user to grant themselves Administrator access.',
      ],
    },
    {
      id: 'm19-t03',
      title: 'Storage & Serverless Misconfigurations',
      content: 'Cloud storage buckets (S3, Azure Blob) and serverless functions (AWS Lambda, Azure Functions) represent massive attack surfaces. Misconfigured buckets are the leading cause of massive data leaks, while serverless functions introduce new execution contexts for old vulnerabilities.',
      keyPoints: [
        'S3 Bucket Leaks: AWS S3 buckets are private by default, but administrators often configure them to "Public Read" to easily serve files, inadvertently exposing entire databases, PII, or backups to the public internet.',
        'S3 Bucket Takeovers: If a web app points to an S3 bucket that has been deleted by the owner, an attacker can create a new bucket with the exact same name and serve malicious content (e.g., a JavaScript keylogger) to the app\'s legitimate users.',
        'Serverless (FaaS): While the OS is completely abstracted, the code running in the Lambda function is still vulnerable to traditional web attacks (Command Injection, XSS, Insecure Deserialization).',
        'Over-privileged Serverless: If a Lambda function has excessive IAM permissions (e.g., full DynamoDB access), compromising the function via code injection compromises the entire database.',
      ],
    },
    {
      id: 'm19-t04',
      title: 'Containers & Kubernetes Security',
      content: 'Containers (Docker) and Container Orchestration (Kubernetes) are the modern standard for deploying scalable cloud applications. Security focuses on isolating the container runtime and securing the highly privileged control plane APIs.',
      keyPoints: [
        'Docker Daemon: Running Docker historically requires root privileges. If an attacker gains access to the Docker socket (`/var/run/docker.sock`), they can achieve instant root access on the host machine by spinning up a privileged container with the host\'s root filesystem mounted.',
        'Container Breakout: Exploiting a kernel vulnerability (like DirtyPipe) or a misconfigured privileged container (e.g., `--privileged`) to escape the container sandbox and access the underlying host OS.',
        'Kubernetes API Server: The brain of the K8s cluster. If left unauthenticated (historically exposed on port 8080 or poorly secured on 6443), attackers can deploy malicious pods (e.g., cryptominers) across the entire cluster.',
        'Kubelet Read-Only API: Often exposed on port 10255. While read-only, it leaks the entire cluster topology, pod configurations, and sometimes environment variables containing secrets.',
        'Secrets Management: Hardcoding database passwords in Dockerfiles or K8s ConfigMaps is a critical flaw. Proper Secrets management engines (e.g., HashiCorp Vault or K8s native Secrets) must be used.',
      ],
    },
  ],
  keyTools: ['AWS CLI', 'Pacu', 'ScoutSuite', 'Cloudsplaining', 'TruffleHog (for finding leaked keys)', 'Kube-hunter', 'Peirates'],
  countermeasures: [
    'Enforce the Principle of Least Privilege globally. Never use wildcard (`*`) IAM permissions in production.',
    'Require Multi-Factor Authentication (MFA) for all console access and, where possible, CLI access via STS session tokens.',
    'Use Cloud Security Posture Management (CSPM) tools (e.g., AWS Security Hub, ScoutSuite, Prowler) to automatically scan for misconfigured S3 buckets, open security groups (0.0.0.0/0 on port 22), and IAM issues.',
    'Implement IMDSv2 (Instance Metadata Service Version 2) in AWS. It requires session tokens (a PUT request followed by a GET) to access metadata, effectively neutralizing traditional SSRF attacks against temporary credentials.',
    'Never hardcode AWS Access Keys in source code or Dockerfiles. Use IAM Roles attached directly to EC2 instances or K8s Service Accounts instead.',
    'Regularly audit Kubernetes RBAC (Role-Based Access Control) configurations to ensure users and service accounts do not have excessive permissions (like `cluster-admin`).',
  ],
  examTips: [
    'The Shared Responsibility Model is heavily tested. Know who is responsible for what in IaaS (OS up) vs PaaS (App up) vs SaaS (Data/Identity only).',
    'Cloud misconfiguration (especially open S3 buckets) is the primary cause of cloud data breaches, NOT zero-day exploits.',
    'The AWS Instance Metadata IP is ALWAYS `169.254.169.254`. An SSRF attack fetching this IP steals IAM credentials.',
    'A Docker Container is NOT a VM; it shares the host\'s OS kernel. A breakout from a container compromises the entire host node.',
    'IAM (Identity and Access Management) is the new perimeter in cloud computing.',
  ],
  realWorldScenarios: [
    'An attacker finds a public GitHub repository containing a hardcoded `AKIA...` (AWS Access Key). They use the AWS CLI to authenticate. Using `pacu`, they discover the key has `s3:ListAllMyBuckets` and `s3:GetObject` permissions. They dump gigabytes of customer data from an internal S3 bucket and demand a ransom.',
    'A web application hosted on an EC2 instance has an SSRF vulnerability in its PDF generator. You provide the URL `http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-role`. The app fetches the metadata and returns temporary AWS access keys. You configure your local AWS CLI with these keys and assume the identity of the EC2 instance, bypassing all network firewalls.',
    'During a Kubernetes pentest, you gain access to a low-privileged container via a web app vulnerability. You scan the internal pod network and find the kubelet read-only API exposed on port 10255. You query it to extract the cluster topology, identify a pod running a legacy application with high privileges, and pivot to attack it.',
  ],
  prerequisites: ['M14 — SSRF is the primary web vulnerability used to attack cloud instance metadata and pivot into the cloud environment.'],
};

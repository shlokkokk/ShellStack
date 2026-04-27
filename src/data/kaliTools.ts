import type { Tool, Category, Command } from './toolTypes';

import { informationGatheringTools } from './tools/information-gathering';
import { vulnerabilityAnalysisTools } from './tools/vulnerability-analysis';
import { webApplicationTools } from './tools/web-application';
import { databaseAssessmentTools } from './tools/database-assessment';
import { passwordAttacksTools } from './tools/password-attacks';
import { wirelessAttacksTools } from './tools/wireless-attacks';
import { exploitationTools } from './tools/exploitation-tools';
import { sniffingSpoofingTools } from './tools/sniffing-spoofing';
import { postExploitationTools } from './tools/post-exploitation';
import { forensicsTools } from './tools/forensics';
import { reverseEngineeringTools } from './tools/reverse-engineering';
import { socialEngineeringTools } from './tools/social-engineering';
import { reportingTools } from './tools/reporting';
import { cloudSecurityTools } from './tools/cloud-security';
import { mobileSecurityTools } from './tools/mobile-security';
import { denialOfServiceTools } from './tools/denial-of-service';
import { iotOtTools } from './tools/iot-ot';
import { evasionTools } from './tools/evasion-tools';
import { cryptographyTools } from './tools/cryptography';

export type { Tool, Category, Command };

export const tools: Tool[] = [
  ...informationGatheringTools,
  ...vulnerabilityAnalysisTools,
  ...webApplicationTools,
  ...databaseAssessmentTools,
  ...passwordAttacksTools,
  ...wirelessAttacksTools,
  ...exploitationTools,
  ...sniffingSpoofingTools,
  ...postExploitationTools,
  ...forensicsTools,
  ...reverseEngineeringTools,
  ...socialEngineeringTools,
  ...reportingTools,
  ...cloudSecurityTools,
  ...mobileSecurityTools,
  ...denialOfServiceTools,
  ...iotOtTools,
  ...evasionTools,
  ...cryptographyTools,
];

export const categories: Category[] = [
  {
    id: 'information-gathering',
    name: 'Information Gathering',
    description: 'Reconnaissance tools for discovering targets, mapping attack surfaces, and collecting intelligence.',
    icon: 'Search',
    toolCount: informationGatheringTools.length,
  },
  {
    id: 'vulnerability-analysis',
    name: 'Vulnerability Analysis',
    description: 'Identify weaknesses, security flaws, and misconfigurations in systems and applications.',
    icon: 'Bug',
    toolCount: vulnerabilityAnalysisTools.length,
  },
  {
    id: 'web-application',
    name: 'Web Application Analysis',
    description: 'Test web applications for SQL injection, XSS, and other critical vulnerabilities.',
    icon: 'Globe',
    toolCount: webApplicationTools.length,
  },
  {
    id: 'database-assessment',
    name: 'Database Assessment',
    description: 'Audit and exploit database systems including MySQL, PostgreSQL, Oracle, and MSSQL.',
    icon: 'Database',
    toolCount: databaseAssessmentTools.length,
  },
  {
    id: 'password-attacks',
    name: 'Password Attacks',
    description: 'Crack hashes, brute-force credentials, and test authentication mechanisms.',
    icon: 'Lock',
    toolCount: passwordAttacksTools.length,
  },
  {
    id: 'wireless-attacks',
    name: 'Wireless Attacks',
    description: 'WiFi, Bluetooth, and RF security testing including WPA cracking and evil twin attacks.',
    icon: 'Wifi',
    toolCount: wirelessAttacksTools.length,
  },
  {
    id: 'exploitation-tools',
    name: 'Exploitation Tools',
    description: 'Gain access with Metasploit, custom exploits, and automated exploitation frameworks.',
    icon: 'Zap',
    toolCount: exploitationTools.length,
  },
  {
    id: 'sniffing-spoofing',
    name: 'Sniffing & Spoofing',
    description: 'Intercept, analyze, and manipulate network traffic with packet capture tools.',
    icon: 'Eye',
    toolCount: sniffingSpoofingTools.length,
  },
  {
    id: 'post-exploitation',
    name: 'Post-Exploitation',
    description: 'Maintain access, escalate privileges, and pivot through compromised networks.',
    icon: 'ArrowRight',
    toolCount: postExploitationTools.length,
  },
  {
    id: 'forensics',
    name: 'Forensics',
    description: 'Digital investigation, evidence analysis, and incident response tools.',
    icon: 'FileSearch',
    toolCount: forensicsTools.length,
  },
  {
    id: 'reverse-engineering',
    name: 'Reverse Engineering',
    description: 'Analyze binaries, dissect malware, and understand program internals.',
    icon: 'Cpu',
    toolCount: reverseEngineeringTools.length,
  },
  {
    id: 'social-engineering',
    name: 'Social Engineering',
    description: 'Phishing, pretexting, and human manipulation attack frameworks.',
    icon: 'Users',
    toolCount: socialEngineeringTools.length,
  },
  {
    id: 'reporting',
    name: 'Reporting Tools',
    description: 'Generate professional penetration test reports and documentation.',
    icon: 'FileText',
    toolCount: reportingTools.length,
  },
  {
    id: 'cloud-security',
    name: 'Cloud Security',
    description: 'Audit and exploit cloud environments — AWS, Azure, GCP, and Kubernetes misconfigurations.',
    icon: 'Cloud',
    toolCount: cloudSecurityTools.length,
  },
  {
    id: 'mobile-security',
    name: 'Mobile Security',
    description: 'Static and dynamic analysis of Android and iOS applications for vulnerabilities.',
    icon: 'Smartphone',
    toolCount: mobileSecurityTools.length,
  },
  {
    id: 'denial-of-service',
    name: 'Denial of Service',
    description: 'Network and application layer DoS/DDoS testing and resilience assessment tools.',
    icon: 'ZapOff',
    toolCount: denialOfServiceTools.length,
  },
  {
    id: 'iot-ot',
    name: 'IoT & OT Security',
    description: 'Audit embedded devices, firmware, industrial control systems, and hardware interfaces.',
    icon: 'Cpu',
    toolCount: iotOtTools.length,
  },
  {
    id: 'evasion-tools',
    name: 'Evasion & Covert Channels',
    description: 'Bypass IDS/IPS, firewalls, and establish covert tunnels for exfiltration and C2.',
    icon: 'EyeOff',
    toolCount: evasionTools.length,
  },
  {
    id: 'cryptography',
    name: 'Cryptography',
    description: 'Analyze TLS/SSL configurations, crack hash algorithms, and manage cryptographic keys.',
    icon: 'Shield',
    toolCount: cryptographyTools.length,
  },
];

// Helper functions for dynamic fetching
export const getToolsByCategory = (categoryId: string): Tool[] => {
  return tools.filter((tool) => tool.category === categoryId);
};

export const getToolById = (toolId: string): Tool | undefined => {
  return tools.find((tool) => tool.id === toolId);
};

export const getToolsByTag = (tag: string): Tool[] => {
  return tools.filter((tool) => tool.tags.includes(tag));
};

export const getToolsByDifficulty = (difficulty: Tool['difficulty']): Tool[] => {
  return tools.filter((tool) => tool.difficulty === difficulty);
};

const normalizeSearchText = (text: string): string => {
  return text.toLowerCase().replace(/[\s_-]+/g, '');
};

const dedupeToolsById = (items: Tool[]): Tool[] => {
  const uniqueTools = new Map<string, Tool>();

  for (const tool of items) {
    if (!uniqueTools.has(tool.id)) {
      uniqueTools.set(tool.id, tool);
    }
  }

  return Array.from(uniqueTools.values());
};

const getSearchScore = (tool: Tool, rawQuery: string): number => {
  const query = rawQuery.toLowerCase().trim();
  if (!query) {
    return 1;
  }

  const queryNormalized = normalizeSearchText(query);
  const queryTokens = query.split(/\s+/).filter(Boolean);

  const name = tool.name.toLowerCase();
  const description = tool.description.toLowerCase();
  const tags = tool.tags.map((tag) => tag.toLowerCase());
  const searchBlob = `${name} ${description} ${tags.join(' ')}`;
  const nameNormalized = normalizeSearchText(name);

  let score = 0;

  if (name === query) {
    score += 200;
  }
  if (nameNormalized === queryNormalized) {
    score += 180;
  }
  if (name.startsWith(query)) {
    score += 120;
  }
  if (name.includes(query)) {
    score += 90;
  }
  if (nameNormalized.includes(queryNormalized)) {
    score += 100;
  }
  if (description.includes(query)) {
    score += 20;
  }

  for (const tag of tags) {
    if (tag === query) {
      score += 70;
    } else if (tag.startsWith(query)) {
      score += 45;
    } else if (tag.includes(query)) {
      score += 25;
    }
  }

  const matchingTokens = queryTokens.filter((token) => searchBlob.includes(token));
  score += matchingTokens.length * 15;

  const tokenMatchInName = queryTokens.every((token) => name.includes(token));
  if (queryTokens.length > 1 && tokenMatchInName) {
    score += 50;
  }

  return score;
};

export const searchTools = (query: string): Tool[] => {
  const uniqueTools = dedupeToolsById(tools);
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return uniqueTools;
  }

  return uniqueTools
    .map((tool) => ({
      tool,
      score: getSearchScore(tool, trimmedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.tool.name.localeCompare(b.tool.name);
    })
    .map((entry) => entry.tool);
};

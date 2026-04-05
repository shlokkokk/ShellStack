import type { Tool } from '../toolTypes';

export const reportingTools: Tool[] = [
  {
    id: 'faraday',
    name: 'Faraday',
    description: 'Integrated penetration testing environment (IPE) that helps distribute, monitor, and document.',
    category: 'reporting',
    difficulty: 'intermediate',
    tags: ['collaboration', 'reporting', 'management'],
    commands: [
      { command: 'faraday-server', description: 'Start Faraday server' },
      { command: 'faraday-client', description: 'Start Faraday client' },
    ],
    whenToUse: [
      'For team-based penetration testing',
      'To centralize vulnerability data',
      'For professional report generation',
      'To track testing progress',
    ],
    relatedTools: ['dradis', 'defectdojo'],
    website: 'https://www.faradaysec.com',
  },
  {
    id: 'dradis',
    name: 'Dradis',
    description: 'Open-source reporting and collaboration tool for InfoSec teams.',
    category: 'reporting',
    difficulty: 'beginner',
    tags: ['reporting', 'collaboration', 'open-source'],
    commands: [
      { command: 'dradis-ce', description: 'Start Dradis' },
    ],
    whenToUse: [
      'For generating penetration test reports',
      'To import scan results from multiple tools',
      'For team collaboration on reports',
      'To create consistent report templates',
    ],
    relatedTools: ['faraday'],
    website: 'https://dradisframework.com',
  },
  {
    id: 'defectdojo',
    name: 'DefectDojo',
    description: 'Open-source application vulnerability correlation and security orchestration tool.',
    category: 'reporting',
    difficulty: 'intermediate',
    tags: ['reporting', 'vulnerability-management', 'ci-cd'],
    commands: [
      { command: 'docker-compose up', description: 'Start DefectDojo natively via Docker' },
    ],
    whenToUse: [
      'To track software vulnerabilities effectively across large engineering teams',
      'For deeply integrated CI/CD secure pipeline management mapping tool outputs',
      'When consolidating Nessus, Burp, and OpenVAS results centrally',
    ],
    relatedTools: ['faraday'],
    website: 'https://www.defectdojo.org/',
  },
  {
    id: 'pipal',
    name: 'Pipal',
    description: 'Statistical analysis tool for password dumps and dictionaries.',
    category: 'reporting',
    difficulty: 'beginner',
    tags: ['reporting', 'passwords', 'statistics'],
    commands: [
      { command: 'pipal passwords.txt', description: 'Analyze a cracked password file' },
      { command: 'pipal -t 10 passwords.txt', description: 'Show top 10 base words' },
    ],
    whenToUse: [
      'To generate highly accurate password strength metrics perfectly during pentests',
      'To populate the "Password Analysis" section accurately in final deliverables',
    ],
    relatedTools: ['john', 'hashcat'],
    website: 'https://github.com/digininja/pipal',
  }
];

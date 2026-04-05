import type { Tool } from '../toolTypes';

export const socialEngineeringTools: Tool[] = [
  {
    id: 'set',
    name: 'Social-Engineer Toolkit (SET)',
    description: 'Open-source penetration testing framework designed for social engineering.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['phishing', 'social-engineering', 'automation'],
    commands: [
      { command: 'setoolkit', description: 'Launch SET' },
    ],
    whenToUse: [
      'For phishing campaign simulations',
      'To create credential harvesting pages',
      'For spear-phishing attacks',
      'To test employee security awareness',
    ],
    relatedTools: ['gophish', 'king-phisher', 'evilginx2'],
    website: 'https://github.com/trustedsec/social-engineer-toolkit',
  },
  {
    id: 'gophish',
    name: 'Gophish',
    description: 'Open-source phishing framework that makes the simulation of real-world phishing attacks easy.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['phishing', 'campaigns', 'reporting', 'professional'],
    commands: [
      { command: './gophish', description: 'Start Gophish server' },
    ],
    whenToUse: [
      'For professional phishing simulations',
      'To measure security awareness',
      'For compliance training',
      'To generate detailed campaign reports',
    ],
    relatedTools: ['set', 'evilginx2', 'cobalt-strike'],
    website: 'https://getgophish.com',
  },
  {
    id: 'evilginx2',
    name: 'Evilginx2',
    description: 'Man-in-the-middle attack framework used for phishing login credentials along with session cookies, which in turn allows bypassing 2FA protection.',
    category: 'social-engineering',
    difficulty: 'advanced',
    tags: ['phishing', '2fa-bypass', 'mitm'],
    commands: [
      { command: 'evilginx2', description: 'Start Evilginx2 console' },
      { command: 'phishlets enable linkedin', description: 'Enable the LinkedIn phishlet template' },
      { command: 'lures create linkedin', description: 'Create a lure link for the target' },
    ],
    whenToUse: [
      'When standard phishing fails because the target enforces strong 2FA/MFA',
      'To securely extract active session cookies alongside credentials',
      'For highly sophisticated Red Team social engineering operations',
    ],
    relatedTools: ['set', 'gophish'],
    website: 'https://github.com/kgretzky/evilginx2',
  },
  {
    id: 'king-phisher',
    name: 'King Phisher',
    description: 'A tool for testing and promoting user awareness by simulating real world phishing attacks.',
    category: 'social-engineering',
    difficulty: 'intermediate',
    tags: ['phishing', 'campaigns', 'gui'],
    commands: [
      { command: '/opt/king-phisher/KingPhisherServer', description: 'Start the King Phisher Server' },
      { command: '/opt/king-phisher/KingPhisher', description: 'Start the King Phisher graphical client' },
    ],
    whenToUse: [
      'When you need a mature GUI-based phishing framework with strong reporting',
      'To track extremely granular statistics on link clicks and credential captures',
    ],
    relatedTools: ['gophish'],
    website: 'https://github.com/securestate/king-phisher',
  }
];

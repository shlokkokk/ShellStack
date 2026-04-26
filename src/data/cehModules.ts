// Comprehensive CEH v13 Module Database
// Modular architecture — each module in its own file under ./modules/

export interface Topic {
  id: string;
  title: string;
  content: string;
  keyPoints?: string[];
  commands?: { command: string; description: string }[];
}

export interface Module {
  id: string;
  number: string;
  title: string;
  description: string;
  examWeight: string;
  estimatedQuestions: number;
  duration: string;
  topics: Topic[];
  keyTools: string[];
  countermeasures: string[];
  commonPorts?: { port: number; protocol: string; service: string; description: string }[];
  examTips: string[];
  realWorldScenarios?: string[];
  prerequisites?: string[];
}

// Import individual modules
import { m01 } from './modules/m01-introduction';
import { m02 } from './modules/m02-footprinting';
import { m03 } from './modules/m03-scanning';
import { m04 } from './modules/m04-enumeration';
import { m05 } from './modules/m05-vulnerability';
import { m06 } from './modules/m06-system-hacking';
import { m07 } from './modules/m07-malware';
import { m08 } from './modules/m08-sniffing';
import { m09 } from './modules/m09-social-engineering';
import { m10 } from './modules/m10-dos';
import { m11 } from './modules/m11-session-hijacking';
import { m12 } from './modules/m12-ids-firewall';
import { m13 } from './modules/m13-web-servers';
import { m14 } from './modules/m14-web-apps';
import { m15 } from './modules/m15-sql-injection';
import { m16 } from './modules/m16-wireless';
import { m17 } from './modules/m17-mobile';
import { m18 } from './modules/m18-iot-ot';
import { m19 } from './modules/m19-cloud';
import { m20 } from './modules/m20-cryptography';

export const cehModules: Module[] = [
  m01, m02, m03, m04, m05, m06, m07, m08, m09, m10,
  m11, m12, m13, m14, m15, m16, m17, m18, m19, m20,
];

// Helper functions
export const getModuleById = (moduleId: string): Module | undefined => {
  return cehModules.find((module) => module.id === moduleId);
};

export const searchModules = (query: string): Module[] => {
  const lowerQuery = query.toLowerCase();
  return cehModules.filter(
    (module) =>
      module.title.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery) ||
      module.topics.some(
        (topic) =>
          topic.title.toLowerCase().includes(lowerQuery) ||
          topic.content.toLowerCase().includes(lowerQuery)
      )
  );
};

export const getTotalStudyHours = (): number => {
  return cehModules.reduce((total, module) => {
    const hours = parseInt(module.duration.split('h')[0]);
    return total + hours;
  }, 0);
};

export const getTotalTopics = (): number => {
  return cehModules.reduce((total, module) => total + module.topics.length, 0);
};

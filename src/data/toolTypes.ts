export interface Command {
  command: string;
  description: string;
  example?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  commands: Command[];
  whenToUse: string[];
  commonFlags?: { flag: string; description: string }[];
  outputExample?: string[];
  relatedTools?: string[];
  installation?: string;
  website?: string;
  detailedReport?: {
    whyThisTool: string[];
    stepByStep: { step: number; title: string; description: string; code?: string }[];
    ctfTips: string[];
    useCases: { title: string; context: string; commands: string[] }[];
    legalWarning: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  toolCount: number;
}

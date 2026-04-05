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
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  toolCount: number;
}

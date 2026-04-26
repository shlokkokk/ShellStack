export interface Command {
  command: string;
  description: string;
  example?: string;
}

export interface InteractiveCommandInput {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  options?: string[]; // Only used if type is 'select'
  defaultValue: string;
  placeholder?: string;
  helpText?: string;
}

export interface InteractiveCommand {
  name: string;
  description: string;
  inputs: InteractiveCommandInput[];
  generator: (inputs: Record<string, string>) => string;
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
  interactiveCommands?: InteractiveCommand[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  toolCount: number;
}

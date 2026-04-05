import type { Tool } from '../toolTypes';

export const reverseEngineeringTools: Tool[] = [
  {
    id: 'ghidra',
    name: 'Ghidra',
    description: 'Software reverse engineering (SRE) suite of tools developed by NSA\'s Research Directorate.',
    category: 'reverse-engineering',
    difficulty: 'advanced',
    tags: ['disassembler', 'decompiler', 'sre', 'free'],
    commands: [
      { command: 'ghidra', description: 'Launch Ghidra' },
      { command: 'analyzeHeadless /path/to/project myProject -import /path/to/binary', description: 'Run headless analysis' },
    ],
    whenToUse: [
      'For complex binary reverse engineering',
      'To analyze obfuscated malware',
      'For high-level vulnerability research requiring a native C decompiler'
    ],
    relatedTools: ['ida-pro', 'binary-ninja', 'radare2'],
    website: 'https://ghidra-sre.org',
  },
  {
    id: 'radare2',
    name: 'Radare2',
    description: 'Complete framework for reverse-engineering and analyzing binaries entirely via CLI.',
    category: 'reverse-engineering',
    difficulty: 'advanced',
    tags: ['cli', 'disassembler', 'debugger', 'framework'],
    commands: [
      { command: 'r2 binary', description: 'Open binary in radare2' },
      { command: 'r2 -d binary', description: 'Launch in Debug mode' },
      { command: 'r2 -A binary', description: 'Auto-analyze upon opening' },
      { command: 'aa', description: 'Analyze all' },
      { command: 'afl', description: 'List functions' },
      { command: 'pdf @ main', description: 'Disassemble main function' },
      { command: 'VV', description: 'Enter visual graph mode' },
    ],
    whenToUse: [
      'For fast command-line terminal-based reverse engineering',
      'When you need a lightweight alternative to Ghidra/IDA',
      'For rapidly scripting binary analysis'
    ],
    relatedTools: ['cutter', 'iaito', 'gdb'],
    website: 'https://rada.re',
  },
  {
    id: 'gdb',
    name: 'GDB + GEF/PEDA',
    description: 'GNU Debugger with enhanced plugins for exploit development and reverse engineering.',
    category: 'reverse-engineering',
    difficulty: 'advanced',
    tags: ['debugger', 'exploit-dev', 'cli'],
    commands: [
      { command: 'gdb ./binary', description: 'Start debugging' },
      { command: 'run', description: 'Run program' },
      { command: 'break main', description: 'Set breakpoint' },
      { command: 'info registers', description: 'Show registers' },
      { command: 'x/20x $esp', description: 'Examine stack' },
    ],
    whenToUse: [
      'For debugging Linux programs dynamically',
      'For exploit development natively'
    ],
    relatedTools: ['lldb', 'edb-debugger'],
    website: 'https://www.gnu.org/software/gdb',
  },
  {
    id: 'apktool',
    name: 'Apktool',
    description: 'A tool for reverse engineering 3rd party, closed, binary Android apps.',
    category: 'reverse-engineering',
    difficulty: 'intermediate',
    tags: ['android', 'apk', 'mobile'],
    commands: [
      { command: 'apktool d app.apk', description: 'Decode APK file' },
      { command: 'apktool b target_dir', description: 'Build APK from decoded directory' },
    ],
    whenToUse: [
      'For reversing Android APK files',
      'To discover hardcoded API keys inside mobile applications',
    ],
    relatedTools: ['jadx', 'dex2jar'],
    website: 'https://ibotpeaches.github.io/Apktool/',
  },
  {
    id: 'jadx',
    name: 'JADX',
    description: 'Dex to Java decompiler. Produces Java source code from Android Dex and Apk files.',
    category: 'reverse-engineering',
    difficulty: 'intermediate',
    tags: ['android', 'java', 'decompiler'],
    commands: [
      { command: 'jadx-gui app.apk', description: 'Open APK in GUI decompiler' },
      { command: 'jadx -d out_dir app.apk', description: 'Decompile APK to directory via CLI' },
    ],
    whenToUse: [
      'When you need to read Java source code reconstructed from Android compiled DEX files',
      'For statically reviewing Android application logic securely'
    ],
    relatedTools: ['apktool', 'dex2jar'],
    website: 'https://github.com/skylot/jadx',
  }
];

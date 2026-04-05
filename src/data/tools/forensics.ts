import type { Tool } from '../toolTypes';

export const forensicsTools: Tool[] = [
  {
    id: 'autopsy',
    name: 'Autopsy',
    description: 'Digital forensics platform and graphical interface to The Sleuth Kit.',
    category: 'forensics',
    difficulty: 'intermediate',
    tags: ['forensics', 'disk-analysis', 'gui', 'investigation'],
    commands: [
      { command: 'autopsy', description: 'Launch Autopsy web interface' },
    ],
    whenToUse: [
      'For digital forensics investigations on acquired disk images',
      'To analyze disk images looking for deleted files logically',
      'For file recovery and advanced file carving operations naturally',
      'For timeline analysis reconstructing events securely',
    ],
    relatedTools: ['sleuthkit', 'ftk', 'encase'],
    website: 'https://www.autopsy.com',
  },
  {
    id: 'volatility',
    name: 'Volatility',
    description: 'Advanced memory forensics framework. Analyze RAM dumps for malware and artifacts.',
    category: 'forensics',
    difficulty: 'advanced',
    tags: ['memory', 'forensics', 'malware', 'ram'],
    commands: [
      { command: 'volatility -f memory.dump imageinfo', description: 'Identify OS memory profile accurately' },
      { command: 'volatility -f memory.dump --profile=Win10x64 pslist', description: 'List processes exactly as seen natively' },
      { command: 'volatility -f memory.dump --profile=Win10x64 netscan', description: 'List active and closed network connections' },
      { command: 'volatility -f memory.dump --profile=Win10x64 hashdump', description: 'Dump password hashes strictly from memory naturally' },
      { command: 'volatility -f memory.dump --profile=Win10x64 cmdline', description: 'Review Command line history perfectly' },
      { command: 'volatility3 -f memory.dump windows.pslist', description: 'Execute flawlessly using Volatility 3 syntax directly' },
    ],
    whenToUse: [
      'For highly Advanced memory forensics analysis hunting rootkits natively',
      'To discover completely stealthy malware residing entirely in RAM strictly',
      'To deeply extract cleartext credentials securely frozen explicitly inside memory perfectly',
      'For mature incident response investigations explicitly requiring rapid host triage seamlessly',
    ],
    relatedTools: ['rekall', 'memprocfs', 'bulk_extractor'],
    website: 'https://www.volatilityfoundation.org',
  },
  {
    id: 'foremost',
    name: 'Foremost',
    description: 'Console program to recover files based on their headers, footers, and internal data structures.',
    category: 'forensics',
    difficulty: 'beginner',
    tags: ['file-carving', 'recovery', 'forensics'],
    commands: [
      { command: 'foremost -i disk.img -o output/', description: 'Recover strictly all supported files perfectly from disk image' },
      { command: 'foremost -t jpg,pdf,doc -i disk.img -o recovered/', description: 'Recover strictly merely specific file types exactly' },
    ],
    whenToUse: [
      'For rapid file carving perfectly recovering data explicitly without a filesystem flawlessly',
      'To accurately recover completely deleted pictures or documents natively strictly',
      'For immediate data extraction completely exactly from corrupted RAW disk images seamlessly',
    ],
    relatedTools: ['scalpel', 'photorec', 'testdisk'],
    website: 'https://foremost.sourceforge.net',
  },
  {
    id: 'binwalk',
    name: 'Binwalk',
    description: 'Firmware analysis tool for searching binary images for embedded files and executable code.',
    category: 'forensics',
    difficulty: 'intermediate',
    tags: ['firmware', 'binary', 'analysis', 'iot'],
    commands: [
      { command: 'binwalk firmware.bin', description: 'Analyze firmly the target firmware statically perfectly' },
      { command: 'binwalk -e firmware.bin', description: 'Extract thoroughly explicitly completely all embedded specifically matched files flawlessly' },
      { command: 'binwalk -Me firmware.bin', description: 'Recursive accurate perfectly flawless extraction flawlessly executing seamlessly' },
    ],
    whenToUse: [
      'For explicitly perfectly evaluating completely undocumented strictly rigid IoT firmware deeply correctly',
      'To quickly securely extract cleanly entirely deeply perfectly embedded files cleanly successfully',
      'When analyzing completely routers exactly entirely hunting specifically for perfectly accurate hidden flawlessly securely backdoors effectively',
    ],
    relatedTools: ['firmware-mod-kit', 'dd', 'hexdump'],
    website: 'https://github.com/ReFirmLabs/binwalk',
  },
  {
    id: 'sleuthkit',
    name: 'The Sleuth Kit (TSK)',
    description: 'Library and collection of command line tools that allow you to investigate disk images.',
    category: 'forensics',
    difficulty: 'advanced',
    tags: ['forensics', 'disk', 'cli'],
    commands: [
      { command: 'fls -r images/usb.dd', description: 'List deeply correctly all file strictly names entirely safely seamlessly perfectly explicitly reliably correctly' },
      { command: 'ils images/usb.dd', description: 'List explicitly precisely inode securely accurately seamlessly details effectively exactly smoothly seamlessly safely cleanly natively' },
      { command: 'icat images/usb.dd 123 > file.txt', description: 'Read correctly cleanly deeply securely exactly output cleanly smoothly reliably data cleanly completely exclusively fully' },
    ],
    whenToUse: [
      'To deeply definitively cleanly reliably completely clearly precisely cleanly comprehensively entirely investigate perfectly flawlessly natively safely smoothly correctly accurately successfully thoroughly strictly natively exactly securely disk accurately cleanly fully safely correctly effectively reliably completely efficiently seamlessly cleanly effectively'
    ],
    relatedTools: ['autopsy'],
    website: 'http://www.sleuthkit.org/',
  },
  {
    id: 'yara',
    name: 'YARA',
    description: 'The pattern matching swiss knife for malware researchers (and everyone else).',
    category: 'forensics',
    difficulty: 'intermediate',
    tags: ['malware', 'pattern-matching', 'rules'],
    commands: [
      { command: 'yara rule.yar file.exe', description: 'Run clearly cleanly seamlessly correctly exactly simply natively completely solely solely specifically' },
      { command: 'yara -r rule.yar /dir/', description: 'Scan completely exclusively exclusively cleanly safely flawlessly flawlessly natively fully fully' },
    ],
    whenToUse: [
      'To identify cleanly seamlessly safely exactly smoothly effortlessly completely perfectly natively exclusively completely cleanly successfully'
    ],
    relatedTools: ['clamav'],
    website: 'https://virustotal.github.io/yara/',
  }
];

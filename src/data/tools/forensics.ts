import type { Tool } from '../toolTypes';

export const forensicsTools: Tool[] = [
  {
    id: 'autopsy',
    name: 'Autopsy',
    description: 'GUI-based digital forensics platform built on top of The Sleuth Kit. Performs disk image analysis, file recovery, timeline generation, keyword searching, and hash filtering for law enforcement and incident response investigations.',
    category: 'forensics',
    difficulty: 'intermediate',
    tags: ['forensics', 'disk-analysis', 'gui', 'investigation', 'sleuthkit'],
    commands: [
      { command: 'autopsy', description: 'Launch the Autopsy web-based GUI — opens a browser interface for case management and analysis' },
      { command: 'autopsy -c case_name -d /cases/', description: 'Create a new case with a specific name and output directory' },
      { command: 'autopsy -p 9999', description: 'Start Autopsy on a custom port (default is 9999) — useful when running multiple instances' },
    ],
    whenToUse: [
      'When performing full disk forensic investigations on acquired .dd/.E01/.raw images',
      'To recover deleted files and carve data from unallocated space',
      'For building visual event timelines from filesystem metadata (MAC times)',
      'When you need keyword search across an entire disk image for terms like "password" or "confidential"',
      'To hash-filter known-good files (NSRL) and focus only on unknown/suspicious files',
      'For generating court-admissible forensic reports with chain of custody',
    ],
    commonFlags: [
      { flag: '-c', description: 'Specify case name for new investigation' },
      { flag: '-d', description: 'Set the evidence locker directory path' },
      { flag: '-p', description: 'Custom port for the web interface' },
    ],
    outputExample: [
      '====================================================',
      '                  Autopsy Forensic Browser',
      '         https://www.sleuthkit.org/autopsy/',
      '                   ver 2.24',
      '====================================================',
      'Evidence Locker: /cases/',
      'Start Time: Sat Apr 26 12:00:00 2026',
      'Remote Host: localhost',
      'Local Port: 9999',
      '',
      'Open a browser to: http://localhost:9999/autopsy',
    ],
    relatedTools: ['sleuthkit', 'ftk', 'encase', 'xways'],
    installation: 'sudo apt install autopsy -y',
    website: 'https://www.autopsy.com',
    interactiveCommands: [
      {
        name: 'Autopsy Instance Builder',
        description: 'Configure and launch the Autopsy web-based GUI for forensic analysis.',
        inputs: [
          { id: 'caseName', label: 'Case Name (-c)', type: 'text', defaultValue: '', placeholder: 'e.g., case_001' },
          { id: 'evidenceDir', label: 'Evidence Directory (-d)', type: 'text', defaultValue: '', placeholder: 'e.g., /cases/ (requires -c)' },
          { id: 'port', label: 'Custom Port (-p)', type: 'text', defaultValue: '9999', placeholder: 'Default is 9999' }
        ],
        generator: (inputs) => {
          let cmd = 'autopsy';
          if (inputs.caseName) cmd += ` -c ${inputs.caseName}`;
          if (inputs.evidenceDir && inputs.caseName) cmd += ` -d ${inputs.evidenceDir}`;
          if (inputs.port && inputs.port !== '9999') cmd += ` -p ${inputs.port}`;
          return cmd;
        }
      }
    ]
  },
  {
    id: 'volatility',
    name: 'Volatility',
    description: 'The gold-standard memory forensics framework. Analyzes RAM dumps to extract running processes, network connections, registry hives, password hashes, injected DLLs, and hidden malware that never touches disk. Supports Windows, Linux, and macOS memory images.',
    category: 'forensics',
    difficulty: 'advanced',
    tags: ['memory', 'forensics', 'malware', 'ram', 'incident-response'],
    commands: [
      { command: 'volatility -f memory.dump imageinfo', description: 'Auto-detect the OS profile of the memory dump — always run this first to identify the correct profile' },
      { command: 'volatility -f memory.dump --profile=Win10x64 pslist', description: 'List all running processes with PID, PPID, and start time — compare against known-good baselines' },
      { command: 'volatility -f memory.dump --profile=Win10x64 pstree', description: 'Display process tree hierarchy — reveals suspicious parent-child relationships (e.g., cmd.exe spawned by Word)' },
      { command: 'volatility -f memory.dump --profile=Win10x64 psscan', description: 'Scan for hidden/unlinked processes that rootkits try to hide from the OS process list' },
      { command: 'volatility -f memory.dump --profile=Win10x64 netscan', description: 'List all active, closed, and listening network connections with associated PIDs' },
      { command: 'volatility -f memory.dump --profile=Win10x64 hashdump', description: 'Dump NTLM password hashes directly from the SAM registry hive in memory' },
      { command: 'volatility -f memory.dump --profile=Win10x64 cmdline', description: 'Show the full command-line arguments for every running process — reveals attacker commands' },
      { command: 'volatility -f memory.dump --profile=Win10x64 filescan', description: 'Scan for FILE_OBJECT structures to find files opened by any process' },
      { command: 'volatility -f memory.dump --profile=Win10x64 dumpfiles -Q 0x00000 -D output/', description: 'Extract a specific file from memory using its physical offset' },
      { command: 'volatility -f memory.dump --profile=Win10x64 malfind', description: 'Detect injected code and DLL injection by finding memory regions with suspicious PAGE_EXECUTE_READWRITE permissions' },
      { command: 'volatility -f memory.dump --profile=Win10x64 hivelist', description: 'List all registry hives loaded in memory with their virtual and physical addresses' },
      { command: 'volatility3 -f memory.dump windows.pslist', description: 'Volatility 3 syntax — the modern Python 3 rewrite with auto-detection (no profile needed)' },
      { command: 'volatility3 -f memory.dump windows.netscan', description: 'Volatility 3 network scan — cleaner output, faster execution' },
    ],
    whenToUse: [
      'During incident response to analyze a compromised machine without altering the disk',
      'To detect fileless malware, rootkits, and injected code that only lives in RAM',
      'To extract plaintext passwords and NTLM hashes frozen in LSASS memory',
      'For identifying C2 (command & control) network connections from malware beaconing',
      'To reconstruct attacker activity from command-line history and process trees',
      'When investigating memory dumps from CTF challenges (very common in forensics challenges)',
    ],
    commonFlags: [
      { flag: '-f', description: 'Path to the memory dump file (.raw, .vmem, .dmp)' },
      { flag: '--profile', description: 'OS profile to use (e.g., Win10x64, Win7SP1x64) — get from imageinfo' },
      { flag: '-D', description: 'Output directory for dumped files' },
      { flag: '-Q', description: 'Physical offset of object to dump' },
      { flag: '--output=csv', description: 'Output results in CSV format for spreadsheet analysis' },
      { flag: '--output-file', description: 'Write output to a file instead of stdout' },
    ],
    outputExample: [
      'Volatility Foundation Volatility Framework 2.6.1',
      'INFO    : volatility.debug    : Determining profile based on KDBG search...',
      '         Suggested Profile(s) : Win10x64_19041',
      '                     AS Layer1 : SkipDuplicatesAMD64PagedMemory',
      '                      PAE type : No PAE',
      '                           DTB : 0x1ad002',
      '                          KDBG : 0xf80150a2a120',
      '',
      'Offset(V)          Name          PID   PPID   Thds   Hnds   Time',
      '0xffff8a8140c2e080 System          4      0     127      0   2026-04-20 08:15:22',
      '0xffff8a8140c4a340 smss.exe      328      4       2      0   2026-04-20 08:15:22',
      '0xffff8a8141a3b080 csrss.exe     448    440      10      0   2026-04-20 08:15:23',
      '0xffff8a81425f0080 powershell   2847   1204       8      0   2026-04-20 09:42:11',
    ],
    relatedTools: ['rekall', 'memprocfs', 'bulk_extractor', 'winpmem'],
    installation: 'pip install volatility3   # Volatility 3 (recommended)\nsudo apt install volatility -y   # Volatility 2 (legacy)',
    website: 'https://www.volatilityfoundation.org',
    interactiveCommands: [
      {
        name: 'Volatility Analysis Builder',
        description: 'Build memory forensic commands for both Volatility 2 and 3, selecting profiles and analysis plugins.',
        inputs: [
          { id: 'version', label: 'Volatility Version', type: 'select', options: ['volatility3 (Python 3)', 'volatility (Python 2)'], defaultValue: 'volatility3 (Python 3)' },
          { id: 'dumpFile', label: 'Memory Dump (-f)', type: 'text', defaultValue: 'memory.dump', placeholder: 'Path to .raw or .vmem file' },
          { id: 'profile', label: 'Profile (--profile)', type: 'text', defaultValue: '', placeholder: 'e.g., Win10x64 (Vol 2 only)' },
          { id: 'plugin', label: 'Plugin', type: 'select', options: ['windows.info / imageinfo', 'windows.pslist / pslist', 'windows.pstree / pstree', 'windows.netscan / netscan', 'windows.malfind / malfind', 'windows.hashdump / hashdump', 'windows.cmdline / cmdline', 'windows.dumpfiles / dumpfiles'], defaultValue: 'windows.pslist / pslist' },
          { id: 'outputDir', label: 'Dump Directory (-D)', type: 'text', defaultValue: '', placeholder: 'Path to dump extracted files' }
        ],
        generator: (inputs) => {
          const isV3 = inputs.version.includes('volatility3');
          const cmd = isV3 ? 'volatility3' : 'volatility';
          const profile = !isV3 && inputs.profile ? ` --profile=${inputs.profile}` : '';
          const pluginRaw = inputs.plugin.split(' / ');
          const plugin = isV3 ? pluginRaw[0] : pluginRaw[1];
          const dumpDir = inputs.outputDir ? (isV3 ? ` -o ${inputs.outputDir}` : ` -D ${inputs.outputDir}`) : '';
          
          return `${cmd} -f ${inputs.dumpFile}${profile}${dumpDir} ${plugin}`;
        }
      }
    ]
  },
  {
    id: 'foremost',
    name: 'Foremost',
    description: 'Header/footer-based file carving tool originally developed by the US Air Force Office of Special Investigations. Recovers files from disk images, raw partitions, or any binary data by matching known file signatures — works even when the filesystem is destroyed.',
    category: 'forensics',
    difficulty: 'beginner',
    tags: ['file-carving', 'recovery', 'forensics', 'data-recovery'],
    commands: [
      { command: 'foremost -i disk.img -o output/', description: 'Carve all supported file types (jpg, png, pdf, doc, zip, etc.) from a disk image into output directory' },
      { command: 'foremost -t jpg,pdf,doc -i disk.img -o recovered/', description: 'Carve only specific file types — faster when you know what you are looking for' },
      { command: 'foremost -t all -i /dev/sdb -o recovered/', description: 'Carve directly from a raw device (e.g., USB drive) — no need to image first' },
      { command: 'foremost -v -i disk.img -o output/', description: 'Verbose mode — shows real-time progress and file discovery notifications' },
      { command: 'foremost -q -i disk.img -o output/', description: 'Quick mode — only search in sectors that appear to have data (faster but may miss fragments)' },
      { command: 'foremost -c /etc/foremost.conf -i disk.img -o output/', description: 'Use custom configuration file with additional file signatures you have defined' },
    ],
    whenToUse: [
      'To recover deleted files from a disk image when the filesystem is intact or corrupted',
      'For carving files from raw unallocated space where the directory structure is gone',
      'When investigating a wiped USB drive or formatted hard disk',
      'To extract embedded files from firmware images or memory dumps',
      'In CTF challenges where you need to find hidden files in raw binary data',
    ],
    commonFlags: [
      { flag: '-i', description: 'Input file (disk image, raw device, or any binary file)' },
      { flag: '-o', description: 'Output directory for recovered files (must not already exist)' },
      { flag: '-t', description: 'Comma-separated file types to carve (jpg, png, gif, pdf, doc, zip, rar, exe, all)' },
      { flag: '-v', description: 'Verbose mode — display detailed progress' },
      { flag: '-q', description: 'Quick mode — skip sectors without data signatures' },
      { flag: '-c', description: 'Path to custom configuration file with file signatures' },
    ],
    outputExample: [
      'Processing: disk.img',
      '|*************************************|',
      'Foremost version 1.5.7 by Jesse Kornblum, Kris Kendall, and Nick Mikus',
      'Audit File',
      '',
      'Foremost started at Sat Apr 26 12:00:00 2026',
      'Invocation: foremost -i disk.img -o output/',
      'Output directory: output/',
      'Configuration file: /etc/foremost.conf',
      '',
      'File: disk.img',
      'Length: 512 MB (536870912 bytes)',
      '',
      'Num     Name (bs=512)     Size     File Offset     Comment',
      '0:      00000024.jpg      45 KB    12288           ',
      '1:      00000136.pdf      120 KB   69632           ',
      '2:      00000512.png      89 KB    262144          ',
      '',
      'Finish: Sat Apr 26 12:00:05 2026',
      '3 FILES EXTRACTED',
    ],
    relatedTools: ['scalpel', 'photorec', 'testdisk', 'binwalk'],
    installation: 'sudo apt install foremost -y',
    website: 'https://foremost.sourceforge.net',
    interactiveCommands: [
      {
        name: 'Foremost Carver Builder',
        description: 'Build file carving commands specifying input devices, target file types, and recovery options.',
        inputs: [
          { id: 'inputFile', label: 'Input Image/Device (-i)', type: 'text', defaultValue: 'disk.img', placeholder: 'Image file or /dev/sdb' },
          { id: 'outputDir', label: 'Output Directory (-o)', type: 'text', defaultValue: 'recovered/', placeholder: 'Must not already exist' },
          { id: 'fileTypes', label: 'File Types (-t)', type: 'text', defaultValue: 'all', placeholder: 'e.g., jpg,pdf,doc or all' },
          { id: 'quickMode', label: 'Quick Mode (-q)', type: 'checkbox', defaultValue: 'false', placeholder: 'Skip sectors without signatures' },
          { id: 'verbose', label: 'Verbose (-v)', type: 'checkbox', defaultValue: 'true', placeholder: 'Show detailed progress' }
        ],
        generator: (inputs) => {
          const types = inputs.fileTypes ? ` -t ${inputs.fileTypes}` : '';
          const quick = inputs.quickMode === 'true' ? ' -q' : '';
          const verbose = inputs.verbose === 'true' ? ' -v' : '';
          return `foremost${verbose}${quick}${types} -i ${inputs.inputFile} -o ${inputs.outputDir}`;
        }
      }
    ]
  },
  {
    id: 'binwalk',
    name: 'Binwalk',
    description: 'Firmware analysis and binary extraction tool. Scans any binary file for embedded file signatures, compressed archives, filesystem images, bootloaders, and executable code. Essential for IoT security research, CTF challenges, and reverse engineering firmware updates.',
    category: 'forensics',
    difficulty: 'intermediate',
    tags: ['firmware', 'binary', 'analysis', 'iot', 'extraction'],
    commands: [
      { command: 'binwalk firmware.bin', description: 'Scan and list all embedded file signatures found in the binary — does NOT extract, just shows what is inside' },
      { command: 'binwalk -e firmware.bin', description: 'Extract all identified embedded files into a _firmware.bin.extracted/ directory' },
      { command: 'binwalk -Me firmware.bin', description: 'Recursive extraction — extract, then scan extracted files, and extract again (goes deep into nested archives)' },
      { command: 'binwalk -E firmware.bin', description: 'Entropy analysis — generates a graph showing data randomness. High entropy = encrypted/compressed data' },
      { command: 'binwalk -A firmware.bin', description: 'Scan for common CPU architecture signatures (ARM, MIPS, x86) — helps identify the target platform' },
      { command: 'binwalk -W file1.bin file2.bin', description: 'Hexdump comparison of two firmware versions — find exactly what changed between updates' },
      { command: 'binwalk --dd=".*" firmware.bin', description: 'Force-extract everything regardless of file type identification' },
    ],
    whenToUse: [
      'When analyzing IoT/router firmware to find hardcoded credentials, backdoors, or private keys',
      'To extract filesystem images (SquashFS, JFFS2, CramFS) from firmware update files',
      'In CTF steganography challenges where files are hidden inside other files',
      'To identify encryption or compression used in proprietary binary formats via entropy analysis',
      'When reverse engineering embedded devices to extract the root filesystem',
    ],
    commonFlags: [
      { flag: '-e', description: 'Extract identified files automatically' },
      { flag: '-M', description: 'Recursively scan extracted files' },
      { flag: '-E', description: 'Calculate file entropy (detect encryption/compression)' },
      { flag: '-A', description: 'Scan for CPU architecture opcodes' },
      { flag: '-W', description: 'Hexdump diff between files' },
      { flag: '-D', description: 'Custom extraction rule (e.g., --dd="png image:png")' },
      { flag: '--dd', description: 'Extract files matching a specific type/regex' },
      { flag: '-C', description: 'Set output directory for extracted files' },
    ],
    outputExample: [
      'DECIMAL       HEXADECIMAL     DESCRIPTION',
      '---------------------------------------------------',
      '0             0x0             TRX firmware header, little endian, header size: 28',
      '28            0x1C            LZMA compressed data, properties: 0x5D',
      '1048576       0x100000        Squashfs filesystem, little endian, version 4.0',
      '1048576       0x100000          compression: xz',
      '1048576       0x100000          size: 3145728 bytes',
      '4194304       0x400000        JFFS2 filesystem, little endian',
    ],
    relatedTools: ['firmware-mod-kit', 'dd', 'hexdump', 'unsquashfs', 'jefferson'],
    installation: 'sudo apt install binwalk -y\npip install binwalk   # Python module',
    website: 'https://github.com/ReFirmLabs/binwalk',
    interactiveCommands: [
      {
        name: 'Binwalk Firmware Extractor',
        description: 'Build Binwalk commands for analyzing, extracting, and calculating entropy of firmware binaries.',
        inputs: [
          { id: 'firmware', label: 'Firmware File', type: 'text', defaultValue: 'firmware.bin', placeholder: 'Path to binary file' },
          { id: 'mode', label: 'Analysis Mode', type: 'select', options: ['Scan Only (List Signatures)', 'Extract Known Files (-e)', 'Recursive Extract (-Me)', 'Entropy Graph (-E)', 'Architecture Scan (-A)'], defaultValue: 'Extract Known Files (-e)' },
          { id: 'extractFilter', label: 'Extract Filter (--dd)', type: 'text', defaultValue: '', placeholder: 'e.g., jpeg:ext (optional)' }
        ],
        generator: (inputs) => {
          let flag = '';
          if (inputs.mode.includes('-e')) flag = '-e';
          else if (inputs.mode.includes('-Me')) flag = '-Me';
          else if (inputs.mode.includes('-E')) flag = '-E';
          else if (inputs.mode.includes('-A')) flag = '-A';
          
          const filter = inputs.extractFilter ? ` --dd="${inputs.extractFilter}"` : '';
          return `binwalk ${flag}${filter} ${inputs.firmware}`.replace('  ', ' ');
        }
      }
    ]
  },
  {
    id: 'sleuthkit',
    name: 'The Sleuth Kit (TSK)',
    description: 'Collection of command-line forensic tools for investigating disk images at the filesystem layer. Supports NTFS, FAT, EXT2/3/4, HFS+, UFS, and more. TSK is the engine behind Autopsy — use it when you need scriptable, automated forensic analysis without a GUI.',
    category: 'forensics',
    difficulty: 'advanced',
    tags: ['forensics', 'disk', 'cli', 'filesystem', 'sleuthkit'],
    commands: [
      { command: 'mmls disk.img', description: 'Display the partition table layout — shows partition types, start offsets, and sizes (use offsets for other TSK tools)' },
      { command: 'fsstat -o 2048 disk.img', description: 'Show filesystem details (type, block size, inode count) at partition offset 2048' },
      { command: 'fls -r -o 2048 disk.img', description: 'Recursively list all files and directories including deleted entries (marked with *)' },
      { command: 'fls -d -r -o 2048 disk.img', description: 'List ONLY deleted files — perfect for quick recovery triage' },
      { command: 'icat -o 2048 disk.img 123 > recovered_file.txt', description: 'Extract a file by its inode number (123) — works even if the file is deleted' },
      { command: 'mactime -b timeline.body -d > timeline.csv', description: 'Generate a CSV timeline of all file activity (Modified/Accessed/Changed/Born)' },
      { command: 'fls -m "/" -r -o 2048 disk.img > timeline.body', description: 'Create a body file for timeline generation — feeds into mactime' },
      { command: 'img_stat disk.img', description: 'Show image format details (raw, E01, AFF) and size information' },
      { command: 'blkstat -o 2048 disk.img 500', description: 'Show the allocation status of a specific disk block — is it allocated or free?' },
      { command: 'sigfind -t ext3 disk.img', description: 'Search for filesystem signatures — useful when partition table is damaged' },
    ],
    whenToUse: [
      'When you need scriptable forensic analysis that can be automated in bash/python pipelines',
      'To recover deleted files from disk images by inode number',
      'For building forensic timelines of file system activity (creation, modification, access times)',
      'When Autopsy GUI is unavailable and you need CLI-only investigation on a headless server',
      'To examine partition layouts and identify hidden or deleted partitions',
    ],
    commonFlags: [
      { flag: '-o', description: 'Sector offset of the partition (get from mmls output)' },
      { flag: '-r', description: 'Recursive — process all subdirectories' },
      { flag: '-d', description: 'Show only deleted entries' },
      { flag: '-m', description: 'Mactime output format with mount point prefix' },
      { flag: '-i', description: 'Image format type (raw, ewf, aff)' },
      { flag: '-f', description: 'Filesystem type override (ntfs, fat, ext)' },
    ],
    outputExample: [
      'DOS Partition Table',
      'Offset Sector: 0',
      'Units are in 512-byte sectors',
      '',
      '     Slot    Start        End          Length       Description',
      '00:  Meta    0000000000   0000000000   0000000001   Primary Table (#0)',
      '01:  -----   0000000000   0000002047   0000002048   Unallocated',
      '02:  00:00   0000002048   0041943039   0041940992   Linux (0x83)',
      '03:  00:01   0041943040   0052428799   0010485760   Linux Swap (0x82)',
    ],
    relatedTools: ['autopsy', 'foremost', 'scalpel'],
    installation: 'sudo apt install sleuthkit -y',
    website: 'http://www.sleuthkit.org/',
    interactiveCommands: [
      {
        name: 'Sleuth Kit Tool Selector',
        description: 'Build targeted TSK commands for partition viewing, file listing, extraction, and timeline generation.',
        inputs: [
          { id: 'tool', label: 'TSK Tool', type: 'select', options: ['mmls (View Partitions)', 'fls (List Files)', 'icat (Extract File)', 'mactime (Generate Timeline)', 'fsstat (Filesystem Details)'], defaultValue: 'fls (List Files)' },
          { id: 'image', label: 'Disk Image', type: 'text', defaultValue: 'disk.img', placeholder: 'Image file' },
          { id: 'offset', label: 'Partition Offset (-o)', type: 'text', defaultValue: '2048', placeholder: 'Sector offset (get from mmls)' },
          { id: 'inode', label: 'Inode/MFT Number', type: 'text', defaultValue: '', placeholder: 'Required for icat (e.g., 123)' },
          { id: 'deletedOnly', label: 'Deleted Only (-d)', type: 'checkbox', defaultValue: 'false', placeholder: 'For fls only' }
        ],
        generator: (inputs) => {
          const tool = inputs.tool.split(' ')[0];
          if (tool === 'mmls') return `mmls ${inputs.image}`;
          if (tool === 'mactime') return `mactime -b timeline.body -d > timeline.csv`;
          
          const offset = inputs.offset ? ` -o ${inputs.offset}` : '';
          const del = inputs.deletedOnly === 'true' && tool === 'fls' ? ' -d' : '';
          
          if (tool === 'fls') return `fls -r${del}${offset} ${inputs.image}`;
          if (tool === 'icat') return `icat${offset} ${inputs.image} ${inputs.inode || 'INODE_NUM'} > recovered_file`;
          if (tool === 'fsstat') return `fsstat${offset} ${inputs.image}`;
          
          return `${tool}${offset} ${inputs.image}`;
        }
      }
    ]
  },
  {
    id: 'yara',
    name: 'YARA',
    description: 'Pattern-matching engine for malware researchers. Write custom rules to identify and classify malware samples based on textual or binary patterns, file structure, and metadata. Used by antivirus companies, SOC teams, and threat intelligence platforms worldwide.',
    category: 'forensics',
    difficulty: 'intermediate',
    tags: ['malware', 'pattern-matching', 'rules', 'threat-intel', 'detection'],
    commands: [
      { command: 'yara rule.yar suspicious_file.exe', description: 'Scan a single file against your YARA rule — prints the rule name if it matches' },
      { command: 'yara -r rule.yar /malware_samples/', description: 'Recursively scan an entire directory of files against your rules' },
      { command: 'yara -s rule.yar suspicious_file.exe', description: 'Show the matching strings/hex patterns that triggered each rule — essential for debugging rules' },
      { command: 'yara -c rule.yar /malware_samples/', description: 'Count-only mode — show how many files matched each rule without details' },
      { command: 'yara -t ransomware rules_collection.yar /samples/', description: 'Only run rules tagged with "ransomware" — useful for large rule sets' },
      { command: 'yara -p 8 rules.yar /large_dataset/', description: 'Multi-threaded scan using 8 threads — dramatically speeds up large-scale scanning' },
      { command: 'yara -d filename="test.exe" rule.yar test.exe', description: 'Pass external variables to rules — enables dynamic/parameterized rule matching' },
    ],
    whenToUse: [
      'To create custom detection signatures for malware families your AV misses',
      'During incident response to scan endpoints for known IOCs (Indicators of Compromise)',
      'To classify unknown malware samples by matching against known patterns and behaviors',
      'For hunting specific threat actors by matching their unique code patterns across file collections',
      'To integrate with SIEM/EDR platforms for automated threat detection at scale',
    ],
    commonFlags: [
      { flag: '-r', description: 'Recursively scan directories' },
      { flag: '-s', description: 'Show matching strings that triggered the rule' },
      { flag: '-c', description: 'Count matches only (no details)' },
      { flag: '-t', description: 'Only run rules with specified tag' },
      { flag: '-p', description: 'Number of threads for parallel scanning' },
      { flag: '-d', description: 'Define external variable for rules' },
      { flag: '-n', description: 'Print only non-matching rules (invert)' },
      { flag: '-w', description: 'Suppress warnings' },
    ],
    outputExample: [
      'malware_trojan_generic suspicious_file.exe',
      '0x1a4:$mz_header: 4D 5A',
      '0x3c0:$suspicious_api: VirtualAlloc',
      '0x4f2:$suspicious_api: WriteProcessMemory',
      '0x812:$c2_domain: evil-server.com',
    ],
    relatedTools: ['clamav', 'sigma', 'snort', 'osquery'],
    installation: 'sudo apt install yara -y\npip install yara-python   # Python bindings',
    website: 'https://virustotal.github.io/yara/',
    interactiveCommands: [
      {
        name: 'YARA Rule Scanner',
        description: 'Configure and execute YARA rules against files and directories to detect malware signatures.',
        inputs: [
          { id: 'ruleFile', label: 'YARA Rule File', type: 'text', defaultValue: 'rules.yar', placeholder: 'Path to .yar file' },
          { id: 'target', label: 'Target File/Directory', type: 'text', defaultValue: '/malware_samples/', placeholder: 'Path to scan' },
          { id: 'recursive', label: 'Recursive (-r)', type: 'checkbox', defaultValue: 'true', placeholder: 'Scan directories recursively' },
          { id: 'showStrings', label: 'Show Strings (-s)', type: 'checkbox', defaultValue: 'true', placeholder: 'Show matching strings' },
          { id: 'countOnly', label: 'Count Only (-c)', type: 'checkbox', defaultValue: 'false', placeholder: 'Show only match counts' },
          { id: 'tag', label: 'Tag Filter (-t)', type: 'text', defaultValue: '', placeholder: 'e.g., ransomware' },
          { id: 'threads', label: 'Threads (-p)', type: 'text', defaultValue: '4', placeholder: 'Number of scanning threads' }
        ],
        generator: (inputs) => {
          const r = inputs.recursive === 'true' ? ' -r' : '';
          const s = inputs.showStrings === 'true' && inputs.countOnly !== 'true' ? ' -s' : '';
          const c = inputs.countOnly === 'true' ? ' -c' : '';
          const t = inputs.tag ? ` -t ${inputs.tag}` : '';
          const p = inputs.threads ? ` -p ${inputs.threads}` : '';
          return `yara${r}${s}${c}${t}${p} ${inputs.ruleFile} ${inputs.target}`;
        }
      }
    ]
  },
  {
    id: 'scalpel',
    name: 'Scalpel',
    description: 'High-performance file carving tool and successor to Foremost. Uses a database of file headers/footers to carve files from raw disk images, memory dumps, or any binary blob. Faster and more configurable than Foremost with support for custom file signatures.',
    category: 'forensics',
    difficulty: 'beginner',
    tags: ['file-carving', 'recovery', 'forensics', 'performance'],
    commands: [
      { command: 'scalpel -c /etc/scalpel/scalpel.conf -o output/ disk.img', description: 'Carve files using the default configuration — edit scalpel.conf to uncomment the file types you want' },
      { command: 'scalpel -b -o output/ disk.img', description: 'Carve in block-aligned mode — faster but may miss files that cross block boundaries' },
      { command: 'scalpel -p -o output/ disk.img', description: 'Preview mode — show what would be carved without actually extracting files' },
    ],
    whenToUse: [
      'When Foremost is too slow for large disk images (Scalpel is significantly faster)',
      'To carve files with custom-defined header/footer signatures not in default tools',
      'For recovering specific file types from corrupted or partially overwritten media',
      'When you need fine-grained control over carving behavior (min/max file sizes, case sensitivity)',
    ],
    commonFlags: [
      { flag: '-c', description: 'Path to configuration file defining file signatures' },
      { flag: '-o', description: 'Output directory for carved files' },
      { flag: '-b', description: 'Block-aligned carving mode (faster)' },
      { flag: '-p', description: 'Preview mode (dry run, no extraction)' },
      { flag: '-e', description: 'Skip block alignment (thorough mode)' },
    ],
    relatedTools: ['foremost', 'photorec', 'testdisk'],
    installation: 'sudo apt install scalpel -y',
    website: 'https://github.com/sleuthkit/scalpel',
    interactiveCommands: [
      {
        name: 'Scalpel Carver Builder',
        description: 'Build fast file carving commands using Scalpel.',
        inputs: [
          { id: 'inputFile', label: 'Input Image', type: 'text', defaultValue: 'disk.img', placeholder: 'Disk image or device' },
          { id: 'outputDir', label: 'Output Directory (-o)', type: 'text', defaultValue: 'scalpel_out/', placeholder: 'Must be empty/non-existent' },
          { id: 'configFile', label: 'Config File (-c)', type: 'text', defaultValue: '/etc/scalpel/scalpel.conf', placeholder: 'Path to scalpel.conf' },
          { id: 'blockAligned', label: 'Block Aligned (-b)', type: 'checkbox', defaultValue: 'false', placeholder: 'Faster, skips unaligned' },
          { id: 'preview', label: 'Preview Mode (-p)', type: 'checkbox', defaultValue: 'false', placeholder: 'Dry run, no extraction' }
        ],
        generator: (inputs) => {
          const conf = inputs.configFile ? ` -c ${inputs.configFile}` : '';
          const b = inputs.blockAligned === 'true' ? ' -b' : '';
          const p = inputs.preview === 'true' ? ' -p' : '';
          return `scalpel${conf}${b}${p} -o ${inputs.outputDir} ${inputs.inputFile}`;
        }
      }
    ]
  },
  {
    id: 'bulk-extractor',
    name: 'bulk_extractor',
    description: 'High-speed forensic tool that scans disk images, files, or directories and extracts useful information like email addresses, URLs, credit card numbers, GPS coordinates, EXIF data, and social security numbers without parsing the filesystem. Works on any binary data.',
    category: 'forensics',
    difficulty: 'intermediate',
    tags: ['forensics', 'extraction', 'pii', 'email', 'automated'],
    commands: [
      { command: 'bulk_extractor -o output/ disk.img', description: 'Run full extraction on a disk image — creates separate files for each data type found' },
      { command: 'bulk_extractor -o output/ -E email -E url disk.img', description: 'Only extract email addresses and URLs — faster when you know what you need' },
      { command: 'bulk_extractor -o output/ -x exif disk.img', description: 'Exclude EXIF extraction — useful to skip noisy image metadata' },
      { command: 'bulk_extractor -o output/ -S context_window=32 disk.img', description: 'Set context window size — shows 32 bytes around each finding for context' },
    ],
    whenToUse: [
      'For rapid automated triage of disk images — find all email addresses, URLs, and credentials in minutes',
      'To extract credit card numbers and PII for data breach investigations',
      'When you need to process terabytes of data quickly (bulk_extractor is multithreaded and very fast)',
      'To analyze network packet captures (pcap files) for leaked credentials and sensitive data',
    ],
    commonFlags: [
      { flag: '-o', description: 'Output directory (must not exist)' },
      { flag: '-E', description: 'Enable only specific scanner (email, url, exif, etc.)' },
      { flag: '-x', description: 'Disable specific scanner' },
      { flag: '-j', description: 'Number of threads (default: number of CPU cores)' },
      { flag: '-S', description: 'Set scanner parameter (key=value)' },
      { flag: '-R', description: 'Process a directory recursively' },
    ],
    relatedTools: ['autopsy', 'foremost', 'strings'],
    installation: 'sudo apt install bulk-extractor -y',
    website: 'https://github.com/simsong/bulk_extractor',
    interactiveCommands: [
      {
        name: 'bulk_extractor Triage Builder',
        description: 'Build rapid extraction commands for finding emails, URLs, and credit cards from disk images.',
        inputs: [
          { id: 'inputFile', label: 'Input File/Dir', type: 'text', defaultValue: 'disk.img', placeholder: 'Image file or directory' },
          { id: 'outputDir', label: 'Output Directory (-o)', type: 'text', defaultValue: 'triage_out/', placeholder: 'Must be empty/non-existent' },
          { id: 'enableScanners', label: 'Enable Scanners (-E)', type: 'text', defaultValue: '', placeholder: 'e.g., email,url' },
          { id: 'disableScanners', label: 'Disable Scanners (-x)', type: 'text', defaultValue: 'exif', placeholder: 'e.g., exif' },
          { id: 'recursive', label: 'Recursive Dir (-R)', type: 'checkbox', defaultValue: 'false', placeholder: 'If input is a directory' }
        ],
        generator: (inputs) => {
          let cmd = `bulk_extractor -o ${inputs.outputDir}`;
          if (inputs.enableScanners) {
            cmd += inputs.enableScanners.split(',').map(s => ` -E ${s.trim()}`).join('');
          }
          if (inputs.disableScanners) {
            cmd += inputs.disableScanners.split(',').map(s => ` -x ${s.trim()}`).join('');
          }
          if (inputs.recursive === 'true') cmd += ' -R';
          cmd += ` ${inputs.inputFile}`;
          return cmd;
        }
      }
    ]
  },
  {
    id: 'testdisk',
    name: 'TestDisk & PhotoRec',
    description: 'TestDisk recovers lost partitions and repairs boot sectors. PhotoRec (bundled together) recovers deleted files by ignoring the filesystem entirely — works on FAT, NTFS, EXT, HFS+, and even when the partition table is completely destroyed.',
    category: 'forensics',
    difficulty: 'beginner',
    tags: ['recovery', 'partition', 'boot-repair', 'photorec', 'data-recovery'],
    commands: [
      { command: 'testdisk /dev/sdb', description: 'Launch interactive partition recovery wizard for a specific device' },
      { command: 'testdisk disk.img', description: 'Analyze a disk image file for lost partitions' },
      { command: 'testdisk /log /dev/sdb', description: 'Run with logging enabled — creates testdisk.log for documentation' },
      { command: 'photorec /dev/sdb', description: 'Launch PhotoRec file recovery wizard — recovers deleted files by signature' },
      { command: 'photorec /d output/ /dev/sdb', description: 'Specify output directory for recovered files' },
    ],
    whenToUse: [
      'When a partition table is corrupted or accidentally deleted — TestDisk can rebuild it',
      'To recover files from a formatted drive, corrupted SD card, or crashed USB stick',
      'When the filesystem is too damaged for normal tools but the raw data is still on disk',
      'For recovering photos from camera memory cards (PhotoRec excels at this)',
    ],
    commonFlags: [
      { flag: '/log', description: 'Create a log file for documentation and troubleshooting' },
      { flag: '/debug', description: 'Enable debug mode with extra technical output' },
      { flag: '/d', description: 'Specify output directory for PhotoRec recovered files' },
    ],
    relatedTools: ['foremost', 'scalpel', 'ddrescue'],
    installation: 'sudo apt install testdisk -y   # Includes both TestDisk and PhotoRec',
    website: 'https://www.cgsecurity.org/wiki/TestDisk',
    interactiveCommands: [
      {
        name: 'PhotoRec Recovery Builder',
        description: 'Configure and launch PhotoRec to recover files bypassing the filesystem.',
        inputs: [
          { id: 'device', label: 'Device/Image', type: 'text', defaultValue: '/dev/sdb', placeholder: 'Target device or image' },
          { id: 'outputDir', label: 'Output Directory (/d)', type: 'text', defaultValue: 'recovered_files/', placeholder: 'Where to save files' },
          { id: 'log', label: 'Enable Logging (/log)', type: 'checkbox', defaultValue: 'true', placeholder: 'Create photorec.log' }
        ],
        generator: (inputs) => {
          const log = inputs.log === 'true' ? ' /log' : '';
          const dir = inputs.outputDir ? ` /d ${inputs.outputDir}` : '';
          return `photorec${log}${dir} ${inputs.device}`;
        }
      }
    ]
  },
  {
    id: 'steghide',
    name: 'Steghide',
    description: 'A steganography program that is able to hide data in various kinds of image- and audio-files. The color- respectively sample-frequencies are not changed thus making the embedding resistant against first-order statistical tests.',
    category: 'forensics',
    difficulty: 'beginner',
    tags: ['steganography', 'crypto', 'hide', 'images', 'audio'],
    commands: [
      { command: 'steghide embed -cf picture.jpg -ef secret.txt', description: 'Embed secret.txt into picture.jpg (will prompt for a passphrase)' },
      { command: 'steghide extract -sf picture.jpg', description: 'Extract the hidden data from picture.jpg (requires the passphrase)' },
      { command: 'steghide info picture.jpg', description: 'Display information about whether a file contains hidden data (needs passphrase)' },
      { command: 'steghide embed -cf cover.wav -ef secret.txt -p mypassword', description: 'Embed data into a WAV audio file providing the password inline' },
      { command: 'steghide embed -cf picture.jpg -ef secret.txt -p "" -f', description: 'Embed data WITHOUT a passphrase (empty password, force overwrite)' },
      { command: 'steghide extract -sf picture.jpg -p "" -xf output.txt', description: 'Extract with empty passphrase and save output to a specific file' },
      { command: 'steghide embed -cf picture.jpg -ef secret.zip -e rijndael-128 -Z 9', description: 'Embed with AES-128 encryption and maximum compression level' },
      { command: 'stegcracker picture.jpg /usr/share/wordlists/rockyou.txt', description: 'Brute-force the steghide passphrase using a wordlist (requires stegcracker)' },
    ],
    whenToUse: [
      'In CTF challenges where a secret flag is hidden inside an image or audio file',
      'During forensics investigations to extract hidden communication or stolen data',
      'To securely hide a small payload or configuration file inside an innocent looking asset',
      'To check if an image recovered from a suspect\'s machine contains hidden steganographic data',
    ],
    commonFlags: [
      { flag: 'embed', description: 'Embed data into a cover file' },
      { flag: 'extract', description: 'Extract data from a stego file' },
      { flag: 'info', description: 'Display information about a cover or stego file' },
      { flag: '-cf', description: 'Cover file (the image/audio file)' },
      { flag: '-ef', description: 'Embed file (the secret data)' },
      { flag: '-sf', description: 'Stego file (the file containing hidden data)' },
      { flag: '-p', description: 'Passphrase (use -p "" for no passphrase)' },
      { flag: '-xf', description: 'Extract to a specific output filename' },
      { flag: '-e', description: 'Encryption algorithm (rijndael-128, blowfish, cast-128, etc.)' },
      { flag: '-Z', description: 'Compression level (1-9, default 6)' },
      { flag: '-f', description: 'Force overwrite of existing output files' },
    ],
    outputExample: [
      '$ steghide info picture.jpg',
      '"picture.jpg":',
      '  format: jpeg',
      '  capacity: 3.2 KB',
      'Try to get information about embedded data ? (y/n) y',
      'Enter passphrase:',
      '  embedded file "secret.txt":',
      '    size: 245.0 Byte',
      '    encrypted: rijndael-128, cbc',
    ],
    relatedTools: ['zsteg', 'exiftool', 'binwalk', 'stegcracker'],
    installation: 'sudo apt install steghide -y',
    website: 'http://steghide.sourceforge.net/',
    interactiveCommands: [
      {
        name: 'Steghide Steganography Builder',
        description: 'Build commands for embedding or extracting hidden data in images and audio files.',
        inputs: [
          { id: 'action', label: 'Action', type: 'select', options: ['embed', 'extract', 'info'], defaultValue: 'extract' },
          { id: 'coverFile', label: 'Cover File (Image/Audio)', type: 'text', defaultValue: 'picture.jpg', placeholder: 'The media file' },
          { id: 'secretFile', label: 'Secret File (-ef)', type: 'text', defaultValue: 'secret.txt', placeholder: 'File to hide (for embed)' },
          { id: 'passphrase', label: 'Passphrase (-p)', type: 'text', defaultValue: '', placeholder: 'Password (empty for prompt)' },
          { id: 'emptyPass', label: 'No Passphrase', type: 'checkbox', defaultValue: 'false', placeholder: 'Force empty password' },
          { id: 'outFile', label: 'Extracted File (-xf)', type: 'text', defaultValue: '', placeholder: 'Save extracted data as (optional)' }
        ],
        generator: (inputs) => {
          if (inputs.action === 'info') return `steghide info ${inputs.coverFile}`;
          let p = inputs.emptyPass === 'true' ? ' -p ""' : (inputs.passphrase ? ` -p '${inputs.passphrase}'` : '');
          if (inputs.action === 'extract') {
            const xf = inputs.outFile ? ` -xf ${inputs.outFile}` : '';
            return `steghide extract -sf ${inputs.coverFile}${p}${xf}`;
          }
          return `steghide embed -cf ${inputs.coverFile} -ef ${inputs.secretFile}${p}`;
        }
      }
    ]
  },
  {
    id: 'sysinternals',
    name: 'Sysinternals Suite',
    description: 'A collection of advanced Windows system utilities provided by Microsoft. Includes Process Explorer, Process Monitor (Procmon), Autoruns, and TCPView. Essential for malware analysis, incident response, and deep Windows system troubleshooting.',
    category: 'forensics',
    difficulty: 'advanced',
    tags: ['windows', 'malware-analysis', 'sysinternals', 'monitoring'],
    commands: [
      { command: 'procexp.exe', description: 'Launch Process Explorer (advanced Task Manager with VirusTotal integration)' },
      { command: 'procmon.exe', description: 'Launch Process Monitor (monitors all registry, file system, and network activity in real-time)' },
      { command: 'autoruns.exe', description: 'Launch Autoruns (shows every program configured to run during system bootup or login)' },
      { command: 'tcpview.exe', description: 'Launch TCPView (detailed active network connections per process)' },
      { command: 'procdump.exe -ma lsass.exe lsass.dmp', description: 'Use ProcDump to create a full memory dump of the LSASS process for offline credential extraction' },
      { command: 'procdump.exe -ma -r lsass.exe lsass.dmp', description: 'Clone LSASS first then dump (avoids triggering some EDR detections)' },
      { command: 'sigcheck.exe -u -e C:\\Windows\\System32', description: 'Check digital signatures of all executables in System32 (unsigned = suspicious)' },
      { command: 'strings.exe -n 8 malware.exe', description: 'Extract all strings >= 8 characters from a suspicious binary' },
      { command: 'accesschk.exe -uwcqv "Authenticated Users" *', description: 'Check what services authenticated users can modify (privilege escalation recon)' },
      { command: 'handle.exe -p malware.exe', description: 'List all open handles (files, registry keys, mutexes) held by a process' },
      { command: 'listdlls.exe -u malware.exe', description: 'List all DLLs loaded by a process, highlighting unsigned ones' },
      { command: 'psexec.exe \\\\TARGETPC -u admin -p P@ss cmd.exe', description: 'Execute a command shell on a remote machine (lateral movement / admin tool)' },
      { command: 'sdelete.exe -z C:', description: 'Securely zero free disk space (anti-forensics)' },
    ],
    whenToUse: [
      'For dynamic malware analysis: detonating malware and using Procmon to see exactly what files and registry keys it modifies',
      'During incident response: using Autoruns to find persistence mechanisms used by attackers',
      'To dump process memory (like LSASS) without triggering basic antivirus alarms (using ProcDump)',
      'For checking unsigned executables and DLLs to find injected/malicious code in running processes',
      'To audit writable service configurations for privilege escalation with accesschk',
    ],
    commonFlags: [
      { flag: 'Procmon Filtering', description: 'Use the GUI filters to exclude known-good processes and focus only on the malware executable' },
      { flag: '-ma (ProcDump)', description: 'Write a Full Dump file (includes all memory)' },
      { flag: '-u (sigcheck)', description: 'Only show files not verified by a trusted signature' },
      { flag: '-uwcqv (accesschk)', description: 'Show services writable by specific users/groups (u=user, w=write, c=service, q=quiet, v=verbose)' },
    ],
    outputExample: [
      '[Procmon Example Output]',
      'Time       Process Name   Operation      Path                                Result',
      '10:12:05   malware.exe    RegSetValue    HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Payload   SUCCESS',
      '10:12:06   malware.exe    CreateFile     C:\\Windows\\System32\\drivers\\etc\\hosts                      SUCCESS',
      '10:12:07   malware.exe    TCP Connect    192.168.1.50:4444                                          SUCCESS'
    ],
    relatedTools: ['wireshark', 'volatility', 'regshot'],
    installation: 'Download from Microsoft Docs (Sysinternals Suite). Also available: winget install sysinternals',
    website: 'https://docs.microsoft.com/en-us/sysinternals/',
    interactiveCommands: [
      {
        name: 'Sysinternals Tool Selector',
        description: 'Build commands for ProcDump, Sigcheck, AccessChk, and other Sysinternals tools.',
        inputs: [
          { id: 'tool', label: 'Sysinternals Tool', type: 'select', options: ['procdump.exe (Dump LSASS)', 'sigcheck.exe (Verify Signatures)', 'accesschk.exe (Check Permissions)', 'strings.exe (Extract Strings)', 'handle.exe (List Handles)', 'listdlls.exe (List DLLs)', 'psexec.exe (Remote Shell)', 'sdelete.exe (Secure Delete)'], defaultValue: 'procdump.exe (Dump LSASS)' },
          { id: 'target', label: 'Target Process/File/Path', type: 'text', defaultValue: 'lsass.exe', placeholder: 'e.g., lsass.exe or C:\\Windows' },
          { id: 'dumpFile', label: 'Dump File (ProcDump)', type: 'text', defaultValue: 'lsass.dmp', placeholder: 'Output file for memory dump' },
          { id: 'remoteIP', label: 'Remote Target (PsExec)', type: 'text', defaultValue: '', placeholder: 'e.g., \\\\10.10.10.5' },
          { id: 'username', label: 'Username (PsExec)', type: 'text', defaultValue: 'administrator', placeholder: 'Remote user' },
          { id: 'password', label: 'Password (PsExec)', type: 'text', defaultValue: '', placeholder: 'Remote password' }
        ],
        generator: (inputs) => {
          const t = inputs.tool.split(' ')[0];
          if (t === 'procdump.exe') return `procdump.exe -ma ${inputs.target} ${inputs.dumpFile}`;
          if (t === 'sigcheck.exe') return `sigcheck.exe -u -e ${inputs.target}`;
          if (t === 'accesschk.exe') return `accesschk.exe -uwcqv "Authenticated Users" *`;
          if (t === 'strings.exe') return `strings.exe -n 8 ${inputs.target}`;
          if (t === 'psexec.exe') return `psexec.exe ${inputs.remoteIP} -u ${inputs.username} -p '${inputs.password}' cmd.exe`;
          if (t === 'sdelete.exe') return `sdelete.exe -z ${inputs.target}`;
          return `${t} ${inputs.target}`;
        }
      }
    ]
  }
];

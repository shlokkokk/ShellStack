import { masterCheatSheet } from '../data/masterCheatSheet';
import { tools } from '../data/kaliTools';
import { expertIntelligence } from '../data/knowledgeBase';
import type { IntelligenceEntry } from '../data/knowledgeBase';
import type { Tool } from '../data/kaliTools';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  matchedTool?: Tool | null;
}

export interface BrainResult {
  text: string;
  matchedTool?: Tool | null;
}

// ─── Intent detection ────────────────────────────────────────────────────────

function detectIntent(q: string) {
  const l = q.toLowerCase();
  const is = (keywords: string[]) => keywords.some(k => l.includes(k));

  if (/^(hi+|hello+|hey+|sup|yo|greetings)(\s|$)/.test(l) || is(['who are you', 'what are you', 'what can you do', 'hacker']))
    return 'greeting';
  if (is(['help me', 'how to use', 'what commands', 'show me commands', 'teach me', 'guide me']))
    return 'help';
  if (is(['module ', 'ceh module', 'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09',
           'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20']))
    return 'module';
  if (is(['command for', 'how to', 'how do i', 'how can i', 'syntax for', 'usage of', 'what is the command']))
    return 'command';
  return 'search';
}

// ─── Scoring helpers ─────────────────────────────────────────────────────────

function scoreTool(tool: Tool, query: string): number {
  const q = query.toLowerCase();
  const name = tool.name.toLowerCase();
  const desc = tool.description.toLowerCase();
  const tags = tool.tags.join(' ').toLowerCase();
  const blob = `${name} ${desc} ${tags}`;
  let score = 0;
  if (name === q) score += 500;
  else if (name.startsWith(q)) score += 250;
  else if (name.includes(q)) score += 180;
  if (desc.includes(q)) score += 40;
  q.split(/\s+/).forEach(token => { if (blob.includes(token)) score += 20; });
  return score;
}

function scoreCheatCommand(cmd: string, desc: string, query: string): number {
  const q = query.toLowerCase();
  const c = cmd.toLowerCase();
  const d = desc.toLowerCase();
  let score = 0;
  if (c.startsWith(q)) score += 200;
  else if (c.includes(q)) score += 100;
  if (d.includes(q)) score += 60;
  q.split(/\s+/).forEach(token => {
    if (token.length > 2 && (c.includes(token) || d.includes(token))) score += 15;
  });
  return score;
}

function scoreIntelligence(entry: IntelligenceEntry, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (entry.topic.toLowerCase().includes(q)) score += 300;
  if (entry.category.toLowerCase().includes(q)) score += 100;
  q.split(/\s+/).forEach(token => {
    if (token.length > 3) {
      if (entry.topic.toLowerCase().includes(token)) score += 50;
      if (entry.intelligence.toLowerCase().includes(token)) score += 20;
    }
  });
  return score;
}

// ─── Main brain function ─────────────────────────────────────────────────────

export async function getResponse(query: string): Promise<BrainResult> {
  const q = query.trim();
  const intent = detectIntent(q);

  // ── Greeting (Elite Persona) ──
  if (intent === 'greeting') {
    return {
      text: [
        '## ⚡ STACK.AI — Neural Link Active',
        '',
        '> "I am your resident ghost in the machine. I eat firewalls for breakfast and bleed 0days."',
        '',
        'I am hooked directly into the **ShellStack Mainframe**. I have full access to:',
        '- 🧠 **God-Tier Intelligence Base** (Methodologies, Exploits, Defenses)',
        '- 🔍 **280+ Security Tools** (Full specs & flags)',
        '- 💻 **1,000+ Command Cheatsheets**',
        '- 📚 **CEH v13 Master Archives**',
        '',
        '**Hit me with a target:**',
        '- `explain kerberoasting`',
        '- `nmap commands`',
        '- `how to bypass xss filters`',
        '- `ceh module 15`',
        '',
        'What are we melting today? 🕶️',
      ].join('\n'),
    };
  }

  // ── Help ──
  if (intent === 'help' && q.length < 20) {
    return {
      text: [
        '## 📡 System Override: Help Menu',
        '',
        'Just type naturally. My NLP engine will parse your intent.',
        '',
        '**Tools (opens modal):** `nmap`, `sqlmap`, `burp suite`, `wireshark`',
        '**Tactics:** `sql injection`, `buffer overflow`, `zero trust`',
        '**Commands:** `reverse shell python`, `privilege escalation linux`',
        '**Modules:** `session hijacking`, `wireless attacks`',
        '',
        'Stop reading manuals. Start hacking. 🏴‍☠️',
      ].join('\n'),
    };
  }

  // ── Intelligence Base Search (High Priority for concepts) ──
  const intelResults = expertIntelligence
    .map(entry => ({ entry, score: scoreIntelligence(entry, q) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (intelResults.length > 0 && intelResults[0].score > 100) {
    const hit = intelResults[0].entry;
    const lines = [
      `## 🧠 ${hit.topic}`,
      `**Class:** \`${hit.category.toUpperCase()}\` | **Source:** Deep Intel File`,
      '',
      `> ${hit.intelligence}`,
      '',
      '### 💡 Pro Tips from the Underground',
      ...hit.tips.map(tip => `- ${tip}`),
    ];

    if (hit.relatedTools.length > 0) {
      lines.push('', `**Weaponized Tools:** ${hit.relatedTools.map(t => `\`${t}\``).join(' · ')}`);
      lines.push('_Ask me about any of these tools for full deployment specs._');
    }

    return { text: lines.join('\n') };
  }

  // ── Tool-specific search ──
  const toolResults = tools
    .map(t => ({ tool: t, score: scoreTool(t, q) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const topTool = toolResults[0];

  if (topTool && topTool.score >= 150) {
    const t = topTool.tool;
    const lines = [
      `## 🛠️ ${t.name}`,
      `**Difficulty:** \`${t.difficulty.toUpperCase()}\` | **Category:** ${t.category}`,
      '',
      t.description,
      '',
      '### 🔥 Core Execution Sequences',
      '```bash',
      ...t.commands.slice(0, 6).map(c => `# ${c.description}\n${c.command}`),
      '```',
    ];

    if (t.commonFlags?.length) {
      lines.push('', '### 🚩 Tactical Flags');
      t.commonFlags.slice(0, 5).forEach(f => lines.push(`- \`${f.flag}\` — ${f.description}`));
    }
    lines.push('', '_Full tool detail modal injected into viewport below ↓_');

    return { text: lines.join('\n'), matchedTool: t };
  }

  // ── Cheat sheet deep search ──
  interface CheatHit { score: number; category: string; section: string; cmd: string; desc: string; }
  const cheatHits: CheatHit[] = [];
  masterCheatSheet.forEach(cat => {
    cat.sections.forEach(sec => {
      sec.commands.forEach(c => {
        const s = scoreCheatCommand(c.cmd, c.desc, q);
        if (s > 0) cheatHits.push({ score: s, category: cat.name, section: sec.title, cmd: c.cmd, desc: c.desc });
      });
    });
  });
  cheatHits.sort((a, b) => b.score - a.score);

  if (cheatHits.length > 0) {
    const byCategory: Record<string, CheatHit[]> = {};
    cheatHits.slice(0, 12).forEach(h => {
      if (!byCategory[h.category]) byCategory[h.category] = [];
      byCategory[h.category].push(h);
    });

    const lines: string[] = [
      `## 🎯 Target Acquired — ${cheatHits.length} Vectors Found`,
      '',
    ];

    Object.entries(byCategory).forEach(([cat, hits]) => {
      lines.push(`### [ ${cat} ]`);
      lines.push('```bash');
      hits.slice(0, 4).forEach(h => {
        lines.push(`# ${h.desc}`);
        lines.push(h.cmd);
        lines.push('');
      });
      lines.push('```');
      lines.push('');
    });

    return { text: lines.join('\n') };
  }

  // ── Zero results ──
  return {
    text: [
      '## 🔴 404: Intel Not Found',
      '',
      `My scans came back empty for \`${q}\`. You either threw me a curveball, or the target is running completely stealth.`,
      '',
      '> "Try adjusting your syntax or query a specific tool/tactic."',
      '',
      '**Try hitting me with:**',
      '`nmap` · `privilege escalation` · `xss bypass` · `kerberoasting` · `sqlmap`',
    ].join('\n'),
  };
}

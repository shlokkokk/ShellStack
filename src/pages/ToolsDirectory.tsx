import { useMemo, useState } from 'react';
import { tools, categories, searchTools, type Tool } from '../data/kaliTools';
import { 
  Terminal, Search, ChevronRight, Code, Info, TerminalSquare, Layers, 
  Globe, Database, Key, Wifi, Zap, Users, FileText, Cpu, Eye, Radio, Fingerprint, ShieldAlert, Crosshair, ArrowRight
} from 'lucide-react';
import ToolDetailModal from '../components/ToolDetailModal'; 

const categoryIcons: Record<string, React.ElementType> = {
  'information-gathering': Eye,
  'vulnerability-analysis': ShieldAlert,
  'web-application': Globe,
  'database-assessment': Database,
  'password-attacks': Key,
  'wireless-attacks': Wifi,
  'exploitation-tools': Crosshair,
  'sniffing-spoofing': Radio,
  'post-exploitation': Zap,
  'forensics': Fingerprint,
  'reporting': FileText,
  'social-engineering': Users,
  'reverse-engineering': Cpu,
};
// "a page full new diff super super coollooking page only for all all alllll tools that we jus added with thier proper content definition short ones and their commands"
// Let's render them in an accordion or full cards!

const ToolsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Use scored search results and then apply category filtering.
  const filteredTools = useMemo(() => {
    const searchResults = searchQuery.trim() ? searchTools(searchQuery) : searchTools('');

    return searchResults.filter(
      (tool) => selectedCategory === 'all' || tool.category === selectedCategory
    );
  }, [searchQuery, selectedCategory]);

  return (
    <div className="relative w-full pt-28 pb-20 px-6 lg:px-12 max-w-screen-2xl mx-auto">
      
      {/* Header Area */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-6 h-6 text-[#39FF14]" />
          <span className="text-sm font-mono text-[#39FF14] uppercase tracking-wider">
            Offensive Security Arsenal
          </span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-[#F2F5F9] mb-4 uppercase tracking-tight">
          Tools <span className="text-[#39FF14]">Directory</span>
        </h1>
        <p className="text-lg text-[#A7B0BC] max-w-3xl">
          Comprehensive encyclopedia of {tools.length} highly weaponized, specialized penetration testing utilities.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B0BC]" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0B0E16] border border-[rgba(243,245,249,0.08)] rounded-xl text-sm text-[#F2F5F9] placeholder:text-[#A7B0BC]/50 focus:outline-none focus:border-[#39FF14] transition-colors"
            />
          </div>

          {/* Category List */}
          <div className="cyber-panel p-4 max-h-[60vh] flex flex-col">
            <h3 className="text-xs font-mono text-[#A7B0BC] uppercase tracking-wider mb-4 px-2 flex items-center gap-2 shrink-0">
              <Layers className="w-4 h-4 text-[#39FF14]" />
              Categories
            </h3>
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-300 group ${
                  selectedCategory === 'all'
                    ? 'bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] text-[#39FF14] shadow-[inset_0_0_15px_rgba(57,255,20,0.05)]'
                    : 'text-[#F2F5F9] border border-transparent hover:bg-[rgba(243,245,249,0.05)] hover:border-[rgba(243,245,249,0.1)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Terminal className={`w-4 h-4 transition-colors ${selectedCategory === 'all' ? 'text-[#39FF14]' : 'text-[#A7B0BC] group-hover:text-[#F2F5F9]'}`} />
                  <span>All Tools</span>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14]'
                    : 'bg-[#05060B] border-[rgba(243,245,249,0.1)] text-[#A7B0BC]'
                }`}>
                  {tools.length}
                </span>
              </button>
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.id] || Terminal;
                const isSelected = selectedCategory === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-300 group ${
                      isSelected
                        ? 'bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] text-[#39FF14] shadow-[inset_0_0_15px_rgba(57,255,20,0.05)]'
                        : 'text-[#F2F5F9] border border-transparent hover:bg-[rgba(243,245,249,0.05)] hover:border-[rgba(243,245,249,0.1)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-[#39FF14]' : 'text-[#A7B0BC] group-hover:text-[#F2F5F9]'}`} />
                      <span className="truncate pr-3">{cat.name}</span>
                    </div>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14]'
                        : 'bg-[#05060B] border-[rgba(243,245,249,0.1)] text-[#A7B0BC]'
                    }`}>
                      {cat.toolCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content: Tools Grid */}
        <div className="flex-1 w-full flex flex-col gap-6 lg:gap-8">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <div key={tool.id} className="cyber-panel p-6 lg:p-8 flex flex-col gap-6 hover:border-[rgba(57,255,20,0.3)] transition-all">
                {/* Tool Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(243,245,249,0.08)] pb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-[#F2F5F9] mb-2">{tool.name}</h2>
                    <p className="text-sm text-[#A7B0BC]">{tool.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap">
                    {tool.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 text-xs font-mono text-[#39FF14] bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Commands Section - Displaying genuine outputs and details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-[#F2F5F9] flex items-center gap-2">
                    <TerminalSquare className="w-4 h-4 text-[#A7B0BC]" />
                    Usage Commands
                  </h3>
                  <div className="grid gap-3">
                    {tool.commands.slice(0, 3).map((cmd, idx) => (
                      <div key={idx} className="bg-[#05060B] rounded-lg border border-[rgba(243,245,249,0.08)] p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="font-mono text-sm text-[#39FF14] break-all">
                          $&gt; {cmd.command}
                        </div>
                        <div className="text-xs text-[#A7B0BC] shrink-0 font-mono bg-[rgba(243,245,249,0.03)] px-3 py-1 rounded">
                          {cmd.description}
                        </div>
                      </div>
                    ))}
                    {tool.commands.length > 3 && (
                      <div className="text-xs font-mono text-[#A7B0BC] pl-2 italic">
                        + {tool.commands.length - 3} more commands available in details...
                      </div>
                    )}
                  </div>
                </div>

                {/* When to use */}
                <div className="space-y-3">
                  <h3 className="text-sm font-mono text-[#F2F5F9] flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#A7B0BC]" />
                    Tactical Application
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#A7B0BC]">
                    {tool.whenToUse.slice(0, 2).map((scenario, idx) => (
                      <li key={idx} className="flex gap-2">
                        <ChevronRight className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
                        <span>{scenario}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-auto">
                  <button 
                    onClick={() => setSelectedTool(tool)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-[#39FF14] bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.3)] rounded-lg hover:bg-[rgba(57,255,20,0.15)] hover:border-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all group"
                  >
                    View Full Tool Documentation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 text-[#A7B0BC] cyber-panel">
              <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tools matched your exceedingly narrow search parameters.</p>
            </div>
          )}
        </div>
      </div>

      <ToolDetailModal
        tool={selectedTool}
        isOpen={selectedTool !== null}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
};


export default ToolsDirectory;

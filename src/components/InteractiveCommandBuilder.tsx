import { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Settings2 } from 'lucide-react';
import type { InteractiveCommand } from '../data/toolTypes';

interface InteractiveCommandBuilderProps {
  command: InteractiveCommand;
}

const InteractiveCommandBuilder = ({ command }: InteractiveCommandBuilderProps) => {
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    command.inputs.forEach(input => {
      initialState[input.id] = input.defaultValue;
    });
    return initialState;
  });

  const [copied, setCopied] = useState(false);
  const [generatedCommand, setGeneratedCommand] = useState('');

  // Update the generated command whenever inputs change
  useEffect(() => {
    try {
      const result = command.generator(inputs);
      setGeneratedCommand(result);
    } catch (error) {
      setGeneratedCommand('Error generating command. Check inputs.');
    }
  }, [inputs, command]);

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-panel p-5 bg-gradient-to-br from-[rgba(11,14,22,0.8)] to-[rgba(5,6,11,0.9)] border border-[rgba(57,255,20,0.2)] shadow-[inset_0_0_20px_rgba(57,255,20,0.02)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-[rgba(243,245,249,0.08)] pb-4">
        <div className="p-2 bg-[rgba(57,255,20,0.1)] rounded-lg border border-[rgba(57,255,20,0.3)]">
          <Settings2 className="w-5 h-5 text-[#39FF14]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#F2F5F9] font-mono tracking-tight flex items-center gap-2">
            {command.name}
            <span className="px-2 py-0.5 text-[10px] bg-[rgba(0,240,255,0.1)] text-[#00F0FF] border border-[rgba(0,240,255,0.3)] rounded animate-pulse-subtle uppercase">
              Interactive
            </span>
          </h3>
          <p className="text-sm text-[#A7B0BC] mt-1">{command.description}</p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {command.inputs.map((input) => (
          <div key={input.id} className="space-y-1.5">
            <label className="text-xs font-mono text-[#F2F5F9] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse-subtle" />
              {input.label}
            </label>
            
            {input.type === 'checkbox' ? (
              <label className="flex items-center gap-3 h-[42px] px-4 bg-[#05060B] border border-[rgba(243,245,249,0.1)] rounded-lg cursor-pointer hover:border-[rgba(57,255,20,0.5)] transition-colors group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={inputs[input.id] === 'true'}
                  onChange={(e) => handleInputChange(input.id, e.target.checked ? 'true' : 'false')}
                />
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${inputs[input.id] === 'true' ? 'bg-[rgba(57,255,20,0.2)] border-[#39FF14]' : 'bg-transparent border-[rgba(243,245,249,0.3)] group-hover:border-[#39FF14]'}`}>
                  {inputs[input.id] === 'true' && <Check className="w-3 h-3 text-[#39FF14] stroke-[3]" />}
                </div>
                <span className="text-sm font-mono text-[#A7B0BC] group-hover:text-[#F2F5F9] transition-colors select-none">
                  {input.placeholder || 'Enable'}
                </span>
              </label>
            ) : input.type === 'select' && input.options ? (
              <div className="relative group">
                <select
                  value={inputs[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  className="w-full appearance-none bg-[#05060B] border border-[rgba(243,245,249,0.1)] text-[#00F0FF] text-sm font-mono rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#39FF14] hover:border-[rgba(57,255,20,0.5)] transition-colors cursor-pointer select-none group-hover:shadow-[0_0_15px_rgba(57,255,20,0.05)]"
                >
                  {input.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#A7B0BC] group-hover:text-[#39FF14] transition-colors">
                  ▼
                </div>
              </div>
            ) : (
              <input
                type={input.type}
                value={inputs[input.id] || ''}
                placeholder={input.placeholder || ''}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
                className="w-full bg-[#05060B] border border-[rgba(243,245,249,0.1)] text-[#00F0FF] text-sm font-mono rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#39FF14] hover:border-[rgba(57,255,20,0.5)] hover:shadow-[0_0_15px_rgba(57,255,20,0.05)] transition-all placeholder:text-[#A7B0BC]/30"
              />
            )}
            
            {input.helpText && (
              <p className="text-[10px] text-[#A7B0BC]/70 font-mono mt-1.5 leading-snug">
                {input.helpText}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Generated Output */}
      <div className="relative mt-2">
        <div className="absolute -top-3 left-4 px-2 bg-[#05060B] border border-[#39FF14] text-[#39FF14] text-[10px] font-mono rounded uppercase tracking-widest z-10">
          Generated Output
        </div>
        <div className="group relative bg-[#05060B] border border-[#39FF14]/50 hover:border-[#39FF14] rounded-lg p-4 pt-5 overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(57,255,20,0.02)] to-transparent pointer-events-none" />
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 overflow-x-auto custom-scrollbar pb-2 pt-1">
              <Terminal className="w-5 h-5 text-[#39FF14] shrink-0 mt-0.5" />
              <code className="text-sm font-mono text-[#F2F5F9] whitespace-nowrap">
                {generatedCommand}
              </code>
            </div>
            
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center justify-center p-2 rounded-lg transition-all ${
                copied 
                  ? 'bg-[rgba(57,255,20,0.2)] text-[#39FF14] border border-[#39FF14]' 
                  : 'bg-[rgba(243,245,249,0.05)] text-[#A7B0BC] border border-[rgba(243,245,249,0.1)] hover:text-[#39FF14] hover:border-[#39FF14]/50'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCommandBuilder;

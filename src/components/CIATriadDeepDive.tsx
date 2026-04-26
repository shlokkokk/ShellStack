import React from 'react';
import { Shield, Lock, Activity, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const CIATriadDeepDive: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-[200] bg-[#05060B]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#0B0E16] border border-[#39FF14]/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[#39FF14]/5" />
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#39FF14]/10 bg-[rgba(57,255,20,0.02)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[rgba(57,255,20,0.1)] rounded-lg border border-[#39FF14]/30">
              <Shield className="w-6 h-6 text-[#39FF14]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F2F5F9] tracking-tight">CIA Triad / <span className="text-[#39FF14] font-mono text-sm uppercase">Deep_Intelligence</span></h2>
              <p className="text-[#A7B0BC] text-xs font-mono uppercase tracking-widest opacity-70">Core Foundation of Information Security</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[rgba(57,255,20,0.1)] rounded-lg transition-colors text-[#A7B0BC] hover:text-[#39FF14]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Figure */}
            <div className="relative flex items-center justify-center aspect-square max-w-[320px] mx-auto">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-[#39FF14]/20 rounded-full animate-[spin_20s_linear_infinite]" />
              
              {/* The Triangle */}
              <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                <defs>
                  <linearGradient id="triGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#39FF14" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#39FF14" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path 
                  d="M100 20 L180 160 L20 160 Z" 
                  fill="url(#triGradient)" 
                  stroke="#39FF14" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                />
                
                {/* Nodes */}
                <circle cx="100" cy="20" r="8" fill="#0B0E16" stroke="#39FF14" strokeWidth="2" />
                <circle cx="180" cy="160" r="8" fill="#0B0E16" stroke="#39FF14" strokeWidth="2" />
                <circle cx="20" cy="160" r="8" fill="#0B0E16" stroke="#39FF14" strokeWidth="2" />
                
                {/* Icons inside triangle */}
                <foreignObject x="85" y="5" width="30" height="30">
                  <div className="flex items-center justify-center h-full"><Lock className="w-4 h-4 text-[#39FF14]" /></div>
                </foreignObject>
                <foreignObject x="165" y="145" width="30" height="30">
                  <div className="flex items-center justify-center h-full"><Shield className="w-4 h-4 text-[#39FF14]" /></div>
                </foreignObject>
                <foreignObject x="5" y="145" width="30" height="30">
                  <div className="flex items-center justify-center h-full"><Activity className="w-4 h-4 text-[#39FF14]" /></div>
                </foreignObject>

                {/* Central Core */}
                <circle cx="100" cy="113" r="15" fill="rgba(57, 255, 20, 0.1)" stroke="#39FF14" strokeWidth="1" strokeDasharray="2" />
                <text x="100" y="117" textAnchor="middle" fill="#39FF14" fontSize="8" fontWeight="bold" fontFamily="monospace">DATA</text>
              </svg>
              
              {/* Labels around the triangle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[#F2F5F9] font-mono text-[10px] font-bold tracking-widest bg-[#0B0E16] px-2 py-1 border border-[#39FF14]/30 rounded">CONFIDENTIALITY</div>
              <div className="absolute bottom-0 right-0 translate-x-4 translate-y-4 text-[#F2F5F9] font-mono text-[10px] font-bold tracking-widest bg-[#0B0E16] px-2 py-1 border border-[#39FF14]/30 rounded">INTEGRITY</div>
              <div className="absolute bottom-0 left-0 -translate-x-4 translate-y-4 text-[#F2F5F9] font-mono text-[10px] font-bold tracking-widest bg-[#0B0E16] px-2 py-1 border border-[#39FF14]/30 rounded">AVAILABILITY</div>
            </div>

            {/* Pillar Details */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 cyber-scrollbar">
              {/* Confidentiality */}
              <div className="p-4 rounded-lg bg-[rgba(57,255,20,0.03)] border border-[rgba(57,255,20,0.1)] hover:border-[rgba(57,255,20,0.3)] transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-4 h-4 text-[#39FF14]" />
                  <h4 className="text-[#39FF14] font-bold font-mono text-sm uppercase">Confidentiality</h4>
                </div>
                <p className="text-xs text-[#A7B0BC] leading-relaxed mb-3">
                  Ensures that information is accessible only to those authorized to have access. It is the protection of data from unauthorized disclosure.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">Encryption (AES-256)</span>
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">Access Control Lists (ACLs)</span>
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">Multi-Factor Auth (MFA)</span>
                </div>
              </div>

              {/* Integrity */}
              <div className="p-4 rounded-lg bg-[rgba(57,255,20,0.03)] border border-[rgba(57,255,20,0.1)] hover:border-[rgba(57,255,20,0.3)] transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-4 h-4 text-[#39FF14]" />
                  <h4 className="text-[#39FF14] font-bold font-mono text-sm uppercase">Integrity</h4>
                </div>
                <p className="text-xs text-[#A7B0BC] leading-relaxed mb-3">
                  Assurance that the information is accurate and complete, and has not been modified by unauthorized users or accidental errors.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">Hashing (SHA-256)</span>
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">Digital Signatures</span>
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">Version Control</span>
                </div>
              </div>

              {/* Availability */}
              <div className="p-4 rounded-lg bg-[rgba(57,255,20,0.03)] border border-[rgba(57,255,20,0.1)] hover:border-[rgba(57,255,20,0.3)] transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-[#39FF14]" />
                  <h4 className="text-[#39FF14] font-bold font-mono text-sm uppercase">Availability</h4>
                </div>
                <p className="text-xs text-[#A7B0BC] leading-relaxed mb-3">
                  Ensures that authorized users have reliable and timely access to information and resources when needed.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">HA Clusters / Load Balancing</span>
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">DDoS Mitigation</span>
                  <span className="px-2 py-0.5 bg-[#05060B] rounded border border-[#39FF14]/10 text-[9px] font-mono text-[#39FF14]/80">Disaster Recovery (DR)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#39FF14]/10 bg-[rgba(57,255,20,0.02)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#39FF14] text-[#020617] font-mono text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#39FF14]/80 transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
          >
            Acknowledge Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};

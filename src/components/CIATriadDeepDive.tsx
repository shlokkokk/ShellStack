import React from 'react';
import { Shield, Lock, Activity, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const CIATriadDeepDive: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-[200] bg-[#05060B]/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl h-[100dvh] md:h-auto max-h-[100dvh] md:max-h-[90vh] bg-[#0B0E16] border-0 md:border border-[#39FF14]/20 rounded-none md:rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[#39FF14]/5" />
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#39FF14]/10 bg-[rgba(57,255,20,0.02)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[rgba(57,255,20,0.1)] rounded-lg border border-[#39FF14]/30 shrink-0">
              <Shield className="w-6 h-6 text-[#39FF14]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#F2F5F9] tracking-tight">CIA Triad / <span className="text-[#39FF14] font-mono text-sm uppercase">Deep_Intelligence</span></h2>
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-70">Core Foundation of Information Security</p>
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
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Visual Figure */}
            <div className="relative flex items-center justify-center w-full aspect-[260/220] max-w-[260px] md:max-w-[320px] mx-auto shrink-0">
              <svg viewBox="0 0 260 220" style={{ forcedColorAdjust: 'none' }} className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)] triad-svg">
                <defs>
                  <linearGradient id="triGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#39FF14" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#39FF14" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Rotating Outer Ring Circle (Dashed vector, centered) */}
                <circle 
                  cx="130" 
                  cy="113" 
                  r="92" 
                  fill="none" 
                  stroke="rgba(57, 255, 20, 0.15)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  style={{ transformOrigin: '130px 113px', forcedColorAdjust: 'none' }}
                  className="animate-[spin_20s_linear_infinite]"
                />
                
                {/* The Triangle */}
                <path 
                  d="M130 40 L210 180 L50 180 Z" 
                  fill="url(#triGradient)" 
                  stroke="#39FF14" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                  style={{ forcedColorAdjust: 'none' }}
                />
                
                {/* Nodes */}
                <circle cx="130" cy="40" r="8" fill="#0B0E16" stroke="#39FF14" strokeWidth="2" style={{ fill: '#0B0E16', stroke: '#39FF14', forcedColorAdjust: 'none' }} />
                <circle cx="210" cy="180" r="8" fill="#0B0E16" stroke="#39FF14" strokeWidth="2" style={{ fill: '#0B0E16', stroke: '#39FF14', forcedColorAdjust: 'none' }} />
                <circle cx="50" cy="180" r="8" fill="#0B0E16" stroke="#39FF14" strokeWidth="2" style={{ fill: '#0B0E16', stroke: '#39FF14', forcedColorAdjust: 'none' }} />
                
                {/* Icons inside triangle */}
                <foreignObject x="115" y="25" width="30" height="30">
                  <div className="flex items-center justify-center h-full" style={{ forcedColorAdjust: 'none' }}><Lock className="w-4 h-4 text-[#39FF14]" /></div>
                </foreignObject>
                <foreignObject x="195" y="165" width="30" height="30">
                  <div className="flex items-center justify-center h-full" style={{ forcedColorAdjust: 'none' }}><Shield className="w-4 h-4 text-[#39FF14]" /></div>
                </foreignObject>
                <foreignObject x="35" y="165" width="30" height="30">
                  <div className="flex items-center justify-center h-full" style={{ forcedColorAdjust: 'none' }}><Activity className="w-4 h-4 text-[#39FF14]" /></div>
                </foreignObject>

                {/* Central Core */}
                <circle cx="130" cy="113" r="15" fill="rgba(57, 255, 20, 0.1)" stroke="#39FF14" strokeWidth="1" strokeDasharray="2" style={{ fill: 'rgba(57, 255, 20, 0.1)', stroke: '#39FF14', forcedColorAdjust: 'none' }} />
                <text x="130" y="117" textAnchor="middle" fill="#39FF14" fontSize="8" fontWeight="bold" fontFamily="monospace" style={{ fill: '#39FF14', forcedColorAdjust: 'none' }}>DATA</text>

                {/* Cyber HUD Labels inside foreignObject to prevent mobile SVG color inversion */}
                {/* Confidentiality */}
                <foreignObject x="80" y="8" width="100" height="18">
                  <div className="flex items-center justify-center w-full h-full text-[#F2F5F9] font-mono text-[8px] font-bold tracking-widest bg-[#0B0E16] border border-[#39FF14]/30 rounded select-none">
                    CONFIDENTIALITY
                  </div>
                </foreignObject>
                
                {/* Integrity */}
                <foreignObject x="170" y="190" width="80" height="18">
                  <div className="flex items-center justify-center w-full h-full text-[#F2F5F9] font-mono text-[8px] font-bold tracking-widest bg-[#0B0E16] border border-[#39FF14]/30 rounded select-none">
                    INTEGRITY
                  </div>
                </foreignObject>
                
                {/* Availability */}
                <foreignObject x="5" y="190" width="90" height="18">
                  <div className="flex items-center justify-center w-full h-full text-[#F2F5F9] font-mono text-[8px] font-bold tracking-widest bg-[#0B0E16] border border-[#39FF14]/30 rounded select-none">
                    AVAILABILITY
                  </div>
                </foreignObject>
              </svg>
            </div>

            {/* Pillar Details */}
            <div className="space-y-4 lg:max-h-[400px] lg:overflow-y-auto lg:pr-4 cyber-scrollbar">
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
        <div className="p-4 md:p-6 border-t border-[#39FF14]/10 bg-[rgba(57,255,20,0.02)] flex justify-end">
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

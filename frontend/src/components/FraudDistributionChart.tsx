'use client'

export default function FraudDistributionChart() {
  return (
    <div className="glass-panel border border-white/5 rounded-2xl p-6 h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Threat Vector Distribution</h3>
          <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">PCA Manifold Analysis</p>
        </div>
        <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
          Last 24h Window
        </div>
      </div>

      <div className="relative h-48 w-full mt-4 flex items-center justify-center">
        {/* Advanced SVG implementation of a radar/polar chart style or layered area */}
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          <path d="M 0 160 L 400 160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
          <path d="M 0 120 L 400 120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
          <path d="M 0 80 L 400 80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
          <path d="M 0 40 L 400 40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>

          <defs>
            <linearGradient id="fraudGradientNew" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="legitGradientNew" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Legitimate Volume Area */}
          <path
            d="M 0 160 Q 50 140, 100 150 T 200 130 T 300 145 T 400 120 L 400 200 L 0 200 Z"
            fill="url(#legitGradientNew)"
            className="transition-all duration-1000"
          />
          <path
            d="M 0 160 Q 50 140, 100 150 T 200 130 T 300 145 T 400 120"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            filter="url(#glow)"
            className="path-draw"
          />

          {/* Anomalous Volume Area (Fraud) */}
          <path
            d="M 0 190 Q 50 185, 100 180 T 200 160 T 300 170 T 400 140 L 400 200 L 0 200 Z"
            fill="url(#fraudGradientNew)"
            className="transition-all duration-1000 delay-300"
          />
          <path
            d="M 0 190 Q 50 185, 100 180 T 200 160 T 300 170 T 400 140"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            filter="url(#glow)"
            className="path-draw stroke-red-500"
            style={{ animationDelay: '300ms' }}
          />

          {/* Hover hit points mock */}
          <circle cx="200" cy="130" r="4" fill="#3b82f6" className="animate-pulse" />
          <circle cx="200" cy="160" r="4" fill="#ef4444" className="animate-pulse" />
          
          <line x1="200" y1="40" x2="200" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>

        {/* Floating Tooltip mock */}
        <div className="absolute top-[20%] left-[55%] glass-panel border border-white/10 px-3 py-2 rounded pointer-events-none fade-in">
           <p className="text-[10px] font-mono text-slate-400 mb-1">T-12:04:00</p>
           <p className="text-xs font-bold text-blue-400">Vol: 1,420</p>
           <p className="text-xs font-bold text-red-400">Anm: 12 (0.8%)</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8 mt-6 border-t border-white/5 pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Expected Distribution</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Anomalous Spikes</span>
        </div>
      </div>
    </div>
  )
}

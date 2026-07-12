'use client'

export default function FraudDistributionChart() {
  return (
    <div className="glass-panel border border-border/50 rounded-2xl p-6 h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/15 transition-all duration-700"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-foreground">Threat Vector Distribution</h3>
          <p className="text-2xs font-mono text-muted-foreground mt-1 uppercase tracking-widest">PCA Manifold Analysis</p>
        </div>
        <div className="px-2.5 py-1 rounded bg-muted/40 border border-border/50 text-2xs font-mono text-muted-foreground">
          Last 24h Window
        </div>
      </div>

      <div className="relative h-48 w-full mt-4 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="fraudGradientNew" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="legitGradientNew" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path d="M 0 160 Q 50 140, 100 150 T 200 130 T 300 145 T 400 120 L 400 200 L 0 200 Z" fill="url(#legitGradientNew)" className="transition-all duration-1000" />
          <path d="M 0 160 Q 50 140, 100 150 T 200 130 T 300 145 T 400 120" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="path-draw" />
          <path d="M 0 190 Q 50 185, 100 180 T 200 160 T 300 170 T 400 140 L 400 200 L 0 200 Z" fill="url(#fraudGradientNew)" className="transition-all duration-1000 delay-300" />
          <path d="M 0 190 Q 50 185, 100 180 T 200 160 T 300 170 T 400 140" fill="none" stroke="#ef4444" strokeWidth="2" filter="url(#glow)" className="path-draw stroke-red-500" style={{ animationDelay: '300ms' }} />
        </svg>

        <div className="absolute top-[20%] left-[55%] glass-panel border border-border/50 px-3 py-2 rounded pointer-events-none">
          <p className="text-2xs font-mono text-muted-foreground mb-1">T-12:04:00</p>
          <p className="text-xs font-bold text-blue-500">Vol: 1,420</p>
          <p className="text-xs font-bold text-red-500">Anm: 12 (0.8%)</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8 mt-6 border-t border-border/40 pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest">Expected Distribution</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest">Anomalous Spikes</span>
        </div>
      </div>
    </div>
  )
}

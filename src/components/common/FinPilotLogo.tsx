import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export const FinPilotLogo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2.5 font-sans ${className}`}>
      {/* FinPilot Emblem SVG */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-navy-950 p-1.5 shadow-lg border border-cyan-500/30 group-hover:border-cyan-400 transition-all`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        >
          <defs>
            <linearGradient id="finGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="glowLine" x1="8" y1="40" x2="42" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>

          {/* Background subtle hexagon / flight grid */}
          <path
            d="M24 4L40 13.2V34.8L24 44L8 34.8V13.2L24 4Z"
            stroke="url(#finGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            strokeDasharray="2 2"
          />

          {/* Upward Flight Path + Stylized 'F' */}
          <path
            d="M14 38V12C14 10.8954 14.8954 10 16 10H32C33.1046 10 34 10.8954 34 12V14C34 15.1046 33.1046 16 32 16H22V22H30C31.1046 22 32 22.8954 32 24V26C32 27.1046 31.1046 28 30 28H22V38"
            stroke="url(#finGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ascending Flight Vector Arrow */}
          <path
            d="M26 24L38 12M38 12H30M38 12V20"
            stroke="#22D3EE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* AI Intelligence Pulsing Core */}
          <circle cx="38" cy="12" r="3" fill="#10B981" className="animate-pulse" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes[size]} font-extrabold tracking-tight text-white`}>
              FIN<span className="text-cyan-400">PILOT</span>
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 rounded">
              AI
            </span>
          </div>
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-mono">
            Financial Cockpit
          </span>
        </div>
      )}
    </div>
  );
};

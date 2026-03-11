import { SignupForm } from "@/features/auth/components/signup-form";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import { useState, useEffect } from "react";

export default function SignupPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <div
      className="relative w-full min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      <style>{`
        @keyframes hexPulse {
          0%, 100% {
            background-color: rgba(99, 102, 241, 0.08);
            opacity: 0.15;
          }
          50% {
            background-color: rgba(99, 102, 241, 0.12);
            opacity: 0.25;
          }
        }
        
        .hexagon-animate {
          transition: all 0.3s ease;
        }
        
        .hexagon-animate:hover [clip-path*="polygon"] {
          animation: hexGlow 0.5s ease-out forwards !important;
        }
        
        @keyframes hexGlow {
          0% {
            background-color: rgba(99, 102, 241, 0.15);
            opacity: 0.3;
          }
          100% {
            background-color: rgba(99, 102, 241, 0.35);
            opacity: 0.6;
          }
        }
        
        .hexagon-animate [clip-path*="polygon"] {
          animation: hexPulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Cursor-following glow effect */}
      <div
        className="pointer-events-none fixed inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 z-[1]"
        style={{
          background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.2) 30%, rgba(99, 102, 241, 0.05) 60%, transparent 85%)`,
          filter: "blur(120px)",
        }}
      />

      {/* Hexagon background with dark colors and animation */}
      <div className="absolute inset-0 z-0 hexagon-animate">
        <HexagonBackground
          className="!bg-transparent"
          hexagonSize={60}
          hexagonMargin={2}
          hexagonProps={{
            className:
              "before:!bg-indigo-900/10 dark:before:!bg-indigo-900/10 after:!bg-slate-950 dark:after:!bg-slate-950 hover:before:!bg-indigo-500/35 dark:hover:before:!bg-indigo-500/35 transition-all duration-300",
          }}
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-sm relative z-10">
        <SignupForm />
      </div>
    </div>
  );
}

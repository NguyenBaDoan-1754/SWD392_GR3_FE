// Custom TypeScript module declarations for files without type definitions

// Animation background module without types
declare module "@/components/animate-ui/components/backgrounds/hexagon" {
  import * as React from "react";
  export interface HexagonBackgroundProps {
    className?: string;
    hexagonSize?: number;
    hexagonMargin?: number;
    hexagonProps?: React.HTMLAttributes<HTMLElement>;
  }
  export const HexagonBackground: React.FC<HexagonBackgroundProps>;
}

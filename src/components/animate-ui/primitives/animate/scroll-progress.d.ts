import type { ReactNode } from "react";

export interface ScrollProgressProviderProps {
  global?: boolean;
  transition?: {
    stiffness?: number;
    damping?: number;
    bounce?: number;
  };
  direction?: "vertical" | "horizontal";
  children?: ReactNode;
}

export interface ScrollProgressProps {
  style?: React.CSSProperties;
  mode?: "width" | "height";
  asChild?: boolean;
  className?: string;
}

export function ScrollProgressProvider(
  props: ScrollProgressProviderProps,
): JSX.Element;
export function ScrollProgress(props: ScrollProgressProps): JSX.Element;

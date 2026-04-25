import { CSSProperties } from "react";

// Ionicons web component wrapper. Loaded once in main.tsx.
// Usage: <Ion name="heart-outline" className="text-accent text-xl" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { name?: string; size?: string },
        HTMLElement
      >;
    }
  }
}

interface IonProps {
  name: string;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
}

export const Ion = ({ name, className, style, ...rest }: IonProps) => (
  <ion-icon
    name={name}
    class={className}
    style={style}
    aria-hidden={rest["aria-hidden"] ?? true}
  />
);

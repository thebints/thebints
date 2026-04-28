import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  /** Vertical translation in px while hidden. Default 24. */
  y?: number;
  /** Once revealed, do not reverse on scroll out. Default true. */
  once?: boolean;
}

/**
 * IntersectionObserver-based reveal with subtle slide + fade.
 * Respects prefers-reduced-motion.
 */
export const Reveal = ({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  y = 24,
  once = true,
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const Component = Tag as any;
  return (
    <Component
      ref={ref as any}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      }}
      className={cn(
        "transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </Component>
  );
};

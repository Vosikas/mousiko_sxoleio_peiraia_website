"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Τυλίγει περιεχόμενο που εμφανίζεται απαλά μόλις μπει στο viewport.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={"reveal " + (visible ? "is-visible " : "") + className}
      style={{ "--reveal-delay": delay + "ms" } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

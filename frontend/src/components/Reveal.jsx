import { useEffect, useRef, useState } from "react";

/**
 * Above-the-fold content stays visible so it can paint immediately.
 * Only content that starts below the viewport fades in.
 */
export default function Reveal({ children, className }) {
  const ref = useRef(null);
  const [state, setState] = useState("visible");

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return undefined;
    setState("waiting");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("visible");
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const motionClass = state === "waiting" ? " reveal-wait" : " reveal-in";
  return (
    <div ref={ref} className={`reveal${motionClass}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

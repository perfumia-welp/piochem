import { useCallback, useEffect, useRef, useState } from "react";

// Animated stat: counts from 1 to the numeric part of `value` on hover (and once on scroll into view).
// The final text is always rendered invisibly underneath, so the counting digits never change the layout.
// Hover is picked up on the nearest `[data-count-hover]` ancestor when present, otherwise on the number itself.
export default function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const valid = match !== null;
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2], 10) : 0;
  const suffix = match?.[3] ?? "";
  // Symbol suffixes (% or +) appear once the count lands; word suffixes (" ISO") stay visible.
  const holdSuffix = /^[%+]/.test(suffix);

  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);
  const [display, setDisplay] = useState(target);
  const [running, setRunning] = useState(false);

  const start = useCallback(() => {
    if (!valid || frame.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = Math.min(1100, 380 + target * 7);
    const t0 = performance.now();
    setRunning(true);
    setDisplay(1);
    const tick = (now: number) => {
      // rAF timestamps can precede t0 slightly, so clamp both ends.
      const p = Math.min(1, Math.max(0, (now - t0) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(1 + (target - 1) * eased));
      if (p < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        frame.current = null;
        setRunning(false);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [valid, target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const hoverTarget = (el.closest("[data-count-hover]") as HTMLElement | null) ?? el;
    hoverTarget.addEventListener("mouseenter", start);

    let delay: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        delay = setTimeout(start, 250);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(el);

    return () => {
      hoverTarget.removeEventListener("mouseenter", start);
      observer.disconnect();
      clearTimeout(delay);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [start]);

  if (!valid) return <>{value}</>;

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      <span style={{ color: "transparent" }}>{value}</span>
      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0 }}>
        {prefix}{display}
        <span style={{ opacity: running && holdSuffix ? 0 : 1, transition: "opacity 0.25s ease" }}>{suffix}</span>
      </span>
    </span>
  );
}

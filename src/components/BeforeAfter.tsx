import { useEffect, useRef, useState } from "react";

interface Props { before: string; after: string; alt?: string }

export const BeforeAfter = ({ before, after, alt = "Avant / Après" }: Props) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const move = (clientX: number) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const p = ((clientX - rect.left) / rect.width) * 100;
      setPos(Math.max(0, Math.min(100, p)));
    };
    const onMove = (e: MouseEvent) => dragging.current && move(e.clientX);
    const onTouch = (e: TouchEvent) => dragging.current && e.touches[0] && move(e.touches[0].clientX);
    const stop = () => (dragging.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-elev select-none cursor-ew-resize bg-secondary"
      onMouseDown={(e) => { dragging.current = true; const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); setPos(((e.clientX - r.left)/r.width)*100); }}
      onTouchStart={(e) => { dragging.current = true; const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); if (e.touches[0]) setPos(((e.touches[0].clientX - r.left)/r.width)*100); }}
    >
      <img src={after} alt={`${alt} - après`} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt={`${alt} - avant`} className="absolute inset-0 w-full h-full object-cover" style={{ width: `${(100/pos)*100}%`, maxWidth: "none" }} />
      </div>

      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium">Avant</div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-foreground text-background text-xs font-medium">Après</div>

      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg grid place-items-center">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-foreground/40 rounded-full" />
            <div className="w-1 h-3 bg-foreground/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

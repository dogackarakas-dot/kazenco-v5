"use client";

import { useEffect, useRef } from "react";

export function IncrediblesCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    const cursor = cursorRef.current;
    if (!cursor) return;

    root.classList.add("inc-has-cursor");

    const pointer = { x: -8, y: -8 };
    const current = { x: -8, y: -8 };
    let active = false;
    let visible = false;
    let raf = 0;

    const updateState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      active = Boolean(
        element?.closest('a, button, input, textarea, select, label, summary, [role="button"]'),
      );
      cursor.classList.toggle("is-active", active);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      visible = true;
      cursor.classList.add("is-visible");
      updateState(event.target);
    };

    const onPointerLeave = () => {
      visible = false;
      cursor.classList.remove("is-visible");
    };

    const render = () => {
      current.x += (pointer.x - current.x) * 0.34;
      current.y += (pointer.y - current.y) * 0.34;
      const scale = active ? 1.45 : 1;
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      cursor.style.opacity = visible ? "1" : "0";
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      root.classList.remove("inc-has-cursor");
    };
  }, []);

  return (
    <>
      <style>{`
        .inc-cursor {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 9999;
          width: 8px;
          height: 8px;
          pointer-events: none;
          border-radius: 50%;
          background: #fc4778;
          opacity: 0;
          will-change: transform, opacity;
          transition: opacity 0.2s ease, background-color 0.2s ease;
        }

        .inc-cursor.is-active {
          background: #ff2b63;
        }

        html.inc-has-cursor,
        html.inc-has-cursor a,
        html.inc-has-cursor button,
        html.inc-has-cursor input,
        html.inc-has-cursor textarea,
        html.inc-has-cursor select,
        html.inc-has-cursor label,
        html.inc-has-cursor summary,
        html.inc-has-cursor [role="button"] {
          cursor: none;
        }
      `}</style>
      <div ref={cursorRef} aria-hidden className="inc-cursor" />
    </>
  );
}
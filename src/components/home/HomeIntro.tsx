"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { site } from "@/config/site";

export function HomeIntro() {
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const cycleRef = useRef<HTMLDivElement>(null);
  const dragActive = useRef(false);

  function updateCursor(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 22;
    event.currentTarget.style.setProperty("--cursor-x", `${x}px`);
    event.currentTarget.style.setProperty("--cursor-y", `${y}px`);
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    dragActive.current = true;
    dragOrigin.current = { x: event.clientX, y: event.clientY, offsetX: dragOffset.x, offsetY: dragOffset.y };
    setDragging(true);
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    updateCursor(event);
    if (!dragActive.current) return;
    const radius = 28;
    const dx = event.clientX - dragOrigin.current.x;
    const dy = event.clientY - dragOrigin.current.y;
    const rawX = dragOrigin.current.offsetX + dx;
    const rawY = dragOrigin.current.offsetY + dy;
    const length = Math.hypot(rawX, rawY);
    const scale = length > radius ? radius / length : 1;
    setDragOffset({ x: rawX * scale, y: rawY * scale });
  }

  function resetCursor(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--cursor-x", "0px");
    event.currentTarget.style.setProperty("--cursor-y", "0px");
  }

  function stopDrag() {
    dragActive.current = false;
    setDragging(false);
  }

  useEffect(() => {
    if (sessionStorage.getItem("portfolio-intro-seen")) return;
    const showTimer = window.setTimeout(() => setVisible(true), 0);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = window.setTimeout(() => {
      if (dragActive.current) return;
      sessionStorage.setItem("portfolio-intro-seen", "true");
      setVisible(false);
    }, 5000);
    return () => window.clearTimeout(hideTimer);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const cycle = cycleRef.current;
    if (!cycle) return;

    const move = (event: PointerEvent) => {
      const rect = cycle.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 22;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 22;
      cycle.style.setProperty("--cursor-x", `${x}px`);
      cycle.style.setProperty("--cursor-y", `${y}px`);
      if (!dragActive.current) return;

      const radius = 28;
      const dx = event.clientX - dragOrigin.current.x;
      const dy = event.clientY - dragOrigin.current.y;
      const rawX = dragOrigin.current.offsetX + dx;
      const rawY = dragOrigin.current.offsetY + dy;
      const length = Math.hypot(rawX, rawY);
      const scale = length > radius ? radius / length : 1;
      setDragOffset({ x: rawX * scale, y: rawY * scale });
    };

    const stop = () => {
      dragActive.current = false;
      setDragging(false);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [visible]);

  if (!visible) return null;

  function enter() {
    sessionStorage.setItem("portfolio-intro-seen", "true");
    setVisible(false);
  }

  return (
    <div role="dialog" aria-label="Portfolio introduction" className="intro-overlay fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-[#070a12] px-6 text-[#f8fafc]">
      <div className="relative z-10 grid w-full max-w-5xl items-center gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#38bdf8]">01 — Digital identity</p>
          <p className="mt-5 text-[clamp(3.8rem,11vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.07em]">Hello.</p>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#b6bed6] sm:text-base">
            Full-Stack Software Engineer building scalable products and resilient systems.
          </p>
          <button type="button" onClick={enter} className="group mt-7 inline-flex min-h-12 items-center justify-between gap-8 rounded-full border border-white/15 bg-white/[0.07] px-5 text-sm font-semibold uppercase tracking-[0.08em] backdrop-blur-md transition-colors hover:border-[#38bdf8]/50 hover:bg-[#38bdf8]/10">
            Enter portfolio
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <div
          ref={cycleRef}
          aria-label="Portrait in the portfolio identity cycle"
          className="intro-identity-cycle hero-portrait-wrap relative mx-auto aspect-square w-full max-w-[18rem] touch-none sm:max-w-[22rem]"
          onPointerMove={moveDrag}
          onPointerLeave={resetCursor}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          <div aria-hidden className="hero-orbit hero-orbit-outer" />
          <div aria-hidden className="hero-orbit hero-orbit-middle" />
          <div aria-hidden className="hero-orbit hero-orbit-inner" />
          <div aria-hidden className="hero-particle hero-particle-one" />
          <div aria-hidden className="hero-particle hero-particle-two" />
          <div aria-hidden className="hero-particle hero-particle-three" />
          <div aria-hidden className="intro-cursor-glow" />
          <div
            className={`intro-portrait-drag absolute left-1/2 top-1/2 size-[74%] cursor-grab active:cursor-grabbing ${dragging ? "is-dragging" : ""}`}
            style={{ "--drag-x": `${dragOffset.x}px`, "--drag-y": `${dragOffset.y}px` } as CSSProperties}
            onPointerDown={startDrag}
          >
          <div className="portrait-flip-wrap hero-portrait relative size-full rounded-full">
            <div className="portrait-flip-inner">
              <div className="portrait-face portrait-face-front">
                <Image src={site.photo.src ?? "/images/profile-chatgpt.jpg"} alt={site.photo.alt} fill priority sizes="(min-width: 640px) 352px, 288px" className="object-cover object-[50%_28%]" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(145deg,transparent_55%,rgba(56,189,248,0.14)_100%)]" />
              </div>
              <div className="portrait-face portrait-face-back">
                <Image src="/images/profile-alternate.jpg" alt="Alternate portrait of Chukwu Chinecherem" fill priority sizes="(min-width: 640px) 352px, 288px" className="object-cover object-[50%_28%]" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(145deg,transparent_55%,rgba(56,189,248,0.14)_100%)]" />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

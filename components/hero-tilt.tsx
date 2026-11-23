"use client";

import { useState, useEffect, useRef, useCallback, MouseEvent, TouchEvent } from "react";

interface HeroTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  maxGlare?: number;
}

const getInitialReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function HeroTilt({
  children,
  className = "",
  maxTilt = 6,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  maxGlare = 0.15,
}: HeroTiltProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glareValue, setGlareValue] = useState({ x: 50, y: 50, opacity: 0 });
  const [reducedMotion] = useState<boolean>(() => getInitialReducedMotion());
  const elementRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      // We can't update reducedMotion state here since it's initialized once
      // The component will re-render when the media query changes via the handler
      // For this component, we accept the initial value only
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const resetTilt = useCallback(() => {
    if (reducedMotion) return;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const animate = () => {
      setTilt((prev) => ({
        x: prev.x * 0.9,
        y: prev.y * 0.9,
      }));
      setGlareValue((prev) => ({
        ...prev,
        opacity: prev.opacity * 0.9,
      }));
      if (Math.abs(tilt.x) > 0.01 || Math.abs(tilt.y) > 0.01 || glareValue.opacity > 0.01) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  }, [tilt.x, tilt.y, glareValue.opacity, reducedMotion]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const newTiltX = Math.max(-maxTilt, Math.min(maxTilt, deltaY * maxTilt));
      const newTiltY = Math.max(-maxTilt, Math.min(maxTilt, -deltaX * maxTilt));

      setTilt({ x: newTiltX, y: newTiltY });

      if (glare) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        const distance = Math.sqrt(
          Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
        );
        const opacity = Math.min(maxGlare, distance * maxGlare * 0.8);
        setGlareValue({ x: glareX, y: glareY, opacity });
      }
    },
    [maxTilt, glare, maxGlare, reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) {
      setTilt({ x: 0, y: 0 });
      setGlareValue((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    setIsHovering(false);
    resetTilt();
  }, [resetTilt, reducedMotion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (reducedMotion || !elementRef.current) return;
      const touch = e.touches[0];
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (touch.clientX - centerX) / (rect.width / 2);
      const deltaY = (touch.clientY - centerY) / (rect.height / 2);

      const newTiltX = Math.max(-maxTilt, Math.min(maxTilt, deltaY * maxTilt));
      const newTiltY = Math.max(-maxTilt, Math.min(maxTilt, -deltaX * maxTilt));

      setTilt({ x: newTiltX, y: newTiltY });

      if (glare) {
        const glareX = ((touch.clientX - rect.left) / rect.width) * 100;
        const glareY = ((touch.clientY - rect.top) / rect.height) * 100;
        const distance = Math.sqrt(
          Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
        );
        const opacity = Math.min(maxGlare, distance * maxGlare * 0.8);
        setGlareValue({ x: glareX, y: glareY, opacity });
      }
    },
    [maxTilt, glare, maxGlare, reducedMotion]
  );

  const handleTouchEnd = useCallback(() => {
    if (reducedMotion) {
      setTilt({ x: 0, y: 0 });
      setGlareValue((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    resetTilt();
  }, [resetTilt, reducedMotion]);

  const transformStyle = {
    transform: `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${scale}, ${scale}, ${scale})`,
    transformStyle: "preserve-3d" as const,
    willChange: "transform",
    transition: reducedMotion
      ? "none"
      : "transform 0.1s ease-out, box-shadow 0.1s ease-out",
  } as React.CSSProperties;

  const glareStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(circle at ${glareValue.x}% ${glareValue.y}%, rgba(255,255,255,${glareValue.opacity}) 0%, transparent 70%)`,
    pointerEvents: "none" as const,
    borderRadius: "inherit",
    opacity: glare && isHovering ? 1 : 0,
    transition: "opacity 0.3s ease-out",
  } as React.CSSProperties;

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={transformStyle}
    >
      {glare && <div style={glareStyle} aria-hidden="true" />}
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </div>
  );
}
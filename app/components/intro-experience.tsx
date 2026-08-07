"use client";

import { useEffect, useRef, useState } from "react";

const socialLinks = [
  { label: "телеграм", href: "https://t.me/s49design" },
  { label: "behance", href: "https://www.behance.net/s49design" },
  { label: "инстаграм*", href: "https://www.instagram.com/s49design/" },
  { label: "линкедин", href: "https://www.linkedin.com/company/s49design/" },
  { label: "написать", href: "mailto:s49design@yandex.ru" },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const easeInOutCubic = (value: number) => (
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
);

const HERO = {
  s: { x: 0, y: 0, width: 50.286, height: 64 },
  line: { x: 59, y: 29, width: 1702, height: 11 },
  fortyNine: { x: 1783, y: 0, width: 97, height: 64 },
} as const;

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

export function IntroExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId = 0;
    let disposed = false;
    const images = loadImage("/studio49-hero.svg");

    const render = async () => {
      const brandMark = await images;
      if (disposed) return;

      const bounds = canvas.getBoundingClientRect();
      const width = Math.round(bounds.width);
      const height = Math.round(bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const isMobile = width <= 640;
      const pagePadding = isMobile ? 20 : clamp(width * 0.02, 20, 24);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext("2d");
      if (!context) return;
      const introStart = window.performance.now();

      const drawDesktopBrand = (lineProgress: number, sOpacity: number, fortyNineOpacity: number) => {
        const logoY = height * 0.52;
        const brandWidth = Math.min(width - pagePadding * 2, brandMark.naturalWidth);
        const brandScale = brandWidth / brandMark.naturalWidth;
        const brandHeight = brandMark.naturalHeight * brandScale;
        const brandX = (width - brandWidth) / 2;
        const brandY = logoY - brandHeight / 2;

        context.globalAlpha = sOpacity;
        context.drawImage(brandMark, HERO.s.x, HERO.s.y, HERO.s.width, HERO.s.height, brandX, brandY, HERO.s.width * brandScale, brandHeight);
        context.globalAlpha = 1;
        if (lineProgress > 0) {
          context.drawImage(
            brandMark,
            HERO.line.x,
            HERO.line.y,
            HERO.line.width * lineProgress,
            HERO.line.height,
            brandX + HERO.line.x * brandScale,
            brandY + HERO.line.y * brandScale,
            HERO.line.width * lineProgress * brandScale,
            HERO.line.height * brandScale,
          );
        }
        context.globalAlpha = fortyNineOpacity;
        context.drawImage(brandMark, HERO.fortyNine.x, HERO.fortyNine.y, HERO.fortyNine.width, HERO.fortyNine.height, brandX + HERO.fortyNine.x * brandScale, brandY, HERO.fortyNine.width * brandScale, brandHeight);
        context.globalAlpha = 1;
      };

      const drawMobileBrand = (lineProgress: number, sOpacity: number, fortyNineOpacity: number) => {
        const brandScale = clamp((width - 40) / 350, 0.75, 1);
        const brandTop = clamp(height * 0.15, 104, 118);
        const lineY = brandTop + HERO.line.y * brandScale;
        const rowStep = HERO.s.height * brandScale;
        const lineHeight = HERO.line.height * brandScale;
        const outerLeft = -lineHeight / 2;
        const outerRight = width + lineHeight / 2;
        const fortyNineX = width - pagePadding - HERO.fortyNine.width * brandScale;
        const finalLineEnd = fortyNineX - 6 * brandScale;
        const rows = Array.from({ length: 9 }, (_, index) => {
          const y = lineY + rowStep * index;
          if (index === 0) return { from: pagePadding + HERO.line.x * brandScale, to: outerRight, y };
          if (index === 8) return { from: outerLeft, to: finalLineEnd, y };
          return index % 2 === 0
            ? { from: outerLeft, to: outerRight, y }
            : { from: outerRight, to: outerLeft, y };
        });
        const pathLength = rows.reduce((total, row) => total + Math.abs(row.to - row.from), 0);
        let remaining = pathLength * lineProgress;

        context.globalAlpha = sOpacity;
        context.drawImage(brandMark, HERO.s.x, HERO.s.y, HERO.s.width, HERO.s.height, pagePadding, brandTop, HERO.s.width * brandScale, HERO.s.height * brandScale);
        context.globalAlpha = 1;

        rows.forEach((row) => {
          const rowLength = Math.abs(row.to - row.from);
          const drawnLength = clamp(remaining, 0, rowLength);
          if (drawnLength > 0) {
            const direction = Math.sign(row.to - row.from);
            context.fillRect(row.from, row.y - lineHeight / 2, drawnLength * direction, lineHeight);
          }
          remaining -= rowLength;
        });

        context.globalAlpha = fortyNineOpacity;
        context.drawImage(
          brandMark,
          HERO.fortyNine.x,
          HERO.fortyNine.y,
          HERO.fortyNine.width,
          HERO.fortyNine.height,
          fortyNineX,
          lineY + rowStep * 8 - HERO.line.y * brandScale,
          HERO.fortyNine.width * brandScale,
          HERO.fortyNine.height * brandScale,
        );
        context.globalAlpha = 1;
      };

      const drawBrand = () => {
        const elapsed = window.performance.now() - introStart;
        const sOpacity = clamp((elapsed - 200) / 350);
        const lineProgress = easeInOutCubic(clamp((elapsed - 750) / (isMobile ? 2500 : 1750)));
        const fortyNineOpacity = clamp((elapsed - (isMobile ? 3300 : 2800)) / 400);

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        if (isMobile) drawMobileBrand(lineProgress, sOpacity, fortyNineOpacity);
        else drawDesktopBrand(lineProgress, sOpacity, fortyNineOpacity);
      };

      const update = () => {
        drawBrand();
        frameId = 0;
        if (window.performance.now() - introStart < (isMobile ? 3800 : 3400)) {
          requestUpdate();
        } else {
          setIsReady(true);
        }
      };

      const requestUpdate = () => {
        if (!frameId) frameId = window.requestAnimationFrame(update);
      };

      requestUpdate();

      return () => {
      };
    };

    let cleanup: (() => void) | undefined;
    render().then((result) => {
      cleanup = result;
    });

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      cleanup?.();
    };
  }, []);

  return (
    <section className="intro-scroll" id="top" aria-labelledby="studio-title">
      <div className="intro-stage">
        <header className={`site-header${isReady ? " is-ready" : ""}`}>
          <a className="site-mark" href="#top" aria-label="S—49, в начало страницы">
            <img src="/studio49-header.svg" alt="S—49" />
          </a>
          <nav className="social-links" aria-label="Контакты">
            {socialLinks.map(({ label, href }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
                {label}
              </a>
            ))}
          </nav>
        </header>
        <h1 id="studio-title" className="sr-only">Studio49</h1>
        <canvas ref={canvasRef} className="brand-canvas" aria-hidden="true" />
        <div className="intro-meta" aria-hidden="true">
          <span>Version: 001</span>
          <span>Loading: 78%</span>
        </div>
      </div>
    </section>
  );
}

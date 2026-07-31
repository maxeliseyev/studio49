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

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const isMobile = width <= 640;
      const pagePadding = isMobile ? 20 : clamp(width * 0.02, 20, 24);
      const logoY = height * (isMobile ? 0.56 : 0.52);
      const brandWidth = Math.min(width - pagePadding * 2, brandMark.naturalWidth);
      const brandScale = brandWidth / brandMark.naturalWidth;
      const brandHeight = brandMark.naturalHeight * brandScale;
      const brandX = (width - brandWidth) / 2;
      const brandY = logoY - brandHeight / 2;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext("2d");
      if (!context) return;
      const introStart = window.performance.now();

      const drawBrand = () => {
        const elapsed = window.performance.now() - introStart;
        const sOpacity = clamp((elapsed - 200) / 350);
        const lineProgress = easeInOutCubic(clamp((elapsed - 750) / 1750));
        const fortyNineOpacity = clamp((elapsed - 2800) / 400);

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        context.globalAlpha = sOpacity;
        context.drawImage(brandMark, 0, 0, 50.286, 64, brandX, brandY, 50.286 * brandScale, brandHeight);
        context.globalAlpha = 1;
        if (lineProgress > 0) {
          context.drawImage(
            brandMark,
            59,
            29,
            1702 * lineProgress,
            11,
            brandX + 59 * brandScale,
            brandY + 29 * brandScale,
            1702 * lineProgress * brandScale,
            11 * brandScale,
          );
        }
        context.globalAlpha = fortyNineOpacity;
        context.drawImage(brandMark, 1783, 0, 97, 64, brandX + 1783 * brandScale, brandY, 97 * brandScale, brandHeight);
        context.globalAlpha = 1;
      };

      const update = () => {
        drawBrand();
        frameId = 0;
        if (window.performance.now() - introStart < 3400) {
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
      </div>
    </section>
  );
}

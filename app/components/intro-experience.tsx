"use client";

import { useEffect, useRef } from "react";

const socialLinks = [
  { label: "телеграм", href: "https://t.me/s49design" },
  { label: "behance", href: "https://www.behance.net/s49design" },
  { label: "инстаграм*", href: "https://www.instagram.com/s49design/" },
  { label: "линкедин", href: "https://www.linkedin.com/company/s49design/" },
  { label: "написать", href: "mailto:s49design@yandex.ru" },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

export function IntroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let frameId = 0;
    let disposed = false;
    const images = Promise.all([loadImage("/s.svg"), loadImage("/49.svg")]);

    const render = async () => {
      const [sMark, fortyNineMark] = await images;
      if (disposed) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const isMobile = width <= 640;
      const pagePadding = isMobile ? 20 : clamp(width * 0.02, 20, 24);
      const sWidth = isMobile ? 34 : clamp(width * 0.03, 32, 46);
      const fortyNineWidth = isMobile ? 67 : clamp(width * 0.058, 60, 88);
      const logoGap = isMobile ? 6 : clamp(width * 0.005, 4, 10);
      const lineThickness = isMobile ? 8 : clamp(width * 0.00667, 6, 8);
      const logoY = height * (isMobile ? 0.56 : 0.52);
      const sHeight = (sWidth / sMark.naturalWidth) * sMark.naturalHeight;
      const fortyNineHeight = (fortyNineWidth / fortyNineMark.naturalWidth) * fortyNineMark.naturalHeight;
      const sX = pagePadding;
      const sY = logoY - sHeight / 2;
      const fortyNineX = width - pagePadding - fortyNineWidth;
      const fortyNineY = logoY - fortyNineHeight / 2;
      const lineStart = sX + sWidth + logoGap;
      const lineWidth = Math.max(24, fortyNineX - logoGap - lineStart);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext("2d");
      if (!context) return;
      const introStart = window.performance.now();
      let furthestScrollProgress = 0;

      const drawBrand = () => {
        const bounds = section.getBoundingClientRect();
        const scrollableDistance = Math.max(section.offsetHeight - height, 1);
        const scrollProgress = clamp(-bounds.top / scrollableDistance);
        furthestScrollProgress = Math.max(furthestScrollProgress, scrollProgress);
        const progress = furthestScrollProgress;
        const scrollLineProgress = clamp(progress / 0.82);
        const introLineProgress = clamp((window.performance.now() - introStart - 1000) / 550);
        const lineLength = Math.max(lineWidth * 0.02 * introLineProgress, lineWidth * scrollLineProgress);
        const fortyNineOpacity = clamp((scrollLineProgress - 0.9) / 0.1);

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        context.globalAlpha = 1;
        context.drawImage(sMark, sX, sY, sWidth, sHeight);
        context.fillStyle = "#fff";
        context.fillRect(lineStart, logoY - lineThickness / 2, lineLength, lineThickness);
        context.globalAlpha = fortyNineOpacity;
        context.drawImage(fortyNineMark, fortyNineX, fortyNineY, fortyNineWidth, fortyNineHeight);
        context.globalAlpha = 1;
      };

      const update = () => {
        drawBrand();
        frameId = 0;
        if (window.performance.now() - introStart < 1600) requestUpdate();
      };

      const requestUpdate = () => {
        if (!frameId) frameId = window.requestAnimationFrame(update);
      };

      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
      requestUpdate();

      return () => {
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
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
    <section ref={sectionRef} className="intro-scroll" id="top" aria-labelledby="studio-title">
      <div className="intro-stage">
        <header className="site-header">
          <a className="site-mark" href="#top" aria-label="S—49, в начало страницы">S—49</a>
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

"use client";

import { useEffect, useRef, useState } from "react";

const socialLinks = [
  { label: "behance", href: "https://www.behance.net/s49design" },
  { label: "инстаграм*", href: "https://www.instagram.com/s49design/" },
  { label: "телеграм", href: "https://t.me/s49design" },
  { label: "линкедин", href: "https://www.linkedin.com/company/s49design/" },
  { label: "написать", href: "/contacts" },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const easeInOutCubic = (value: number) => (
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
);

// Переводит момент времени внутри отрезка [from, to] в прогресс 0..1.
const track = (value: number, from: number, to: number) => clamp((value - from) / (to - from));

const HERO = {
  s: { x: 0, y: 0, width: 50.286, height: 64 },
  line: { x: 59, y: 29, width: 1702, height: 11 },
  fortyNine: { x: 1783, y: 0, width: 97, height: 64 },
} as const;

// Макет S—49_Main_375: знак сложен в 9 строк с шагом 64. Первая строка начинается
// после «S», семь средних идут от края до края, последняя обрывается перед «49».
// bottomReserve — полоса под Version/Loading плюс воздух над ней.
const FOLD = { rows: 9, step: 64, top: 129, gap: 8, refWidth: 375, refHeight: 705, bottomReserve: 76 } as const;

const INK = "#111111";
const FINAL = 100000;

const timeline = (isMobile: boolean) => {
  const lineStart = 750;
  const lineEnd = lineStart + (isMobile ? 2600 : 1750);
  return { lineStart, lineEnd, total: lineEnd + 400 };
};

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
  // Счётчик пишется напрямую в DOM, чтобы не перерисовывать дерево каждый кадр.
  const loadingRef = useRef<HTMLSpanElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (!isNavOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsNavOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isNavOpen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let frameId = 0;
    let startTime = 0;
    let finished = false;
    let detach: (() => void) | undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    loadImage("/studio49-hero.svg").then((brandMark) => {
      if (disposed) return;
      const context = canvas.getContext("2d");
      if (!context) return;

      const measureStage = () => {
        const isMobile = window.innerWidth <= 640;
        // Замеряем сцену, а не канвас: канвасу ниже проставляются инлайновые
        // размеры, и на ресайзе он вернул бы их же вместо размера контейнера.
        const bounds = (canvas.parentElement ?? canvas).getBoundingClientRect();
        // Desktop keeps the original viewport-based canvas. The mobile canvas uses
        // its own stage so the folded mark can reserve its vertical space.
        const width = Math.round(isMobile ? bounds.width : window.innerWidth);
        const height = Math.round(isMobile ? bounds.height : window.innerHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        return { isMobile, width, height, dpr, pagePadding: isMobile ? 20 : clamp(width * 0.02, 20, 24) };
      };

      let stage = measureStage();

      const drawDesktopBrand = (lineProgress: number, sOpacity: number, fortyNineOpacity: number) => {
        const { width, height, pagePadding } = stage;
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
        const { width, height, pagePadding } = stage;
        // Макет нарисован на артборде 375px, поэтому знак тянется вместе с шириной
        // экрана — но не настолько, чтобы девять строк перестали влезать по высоте.
        const brandScale = clamp(
          Math.min(width / FOLD.refWidth, (height - FOLD.bottomReserve) / FOLD.refHeight),
          0.7,
          1.25,
        );
        const brandTop = FOLD.top * brandScale;
        const rowStep = FOLD.step * brandScale;
        const thickness = HERO.line.height * brandScale;
        // Строки выходят на пиксель за края, чтобы на дробном dpr не было щели.
        const outerLeft = -1;
        const outerRight = width + 1;
        const fortyNineX = width - pagePadding - HERO.fortyNine.width * brandScale;
        const lastRow = FOLD.rows - 1;

        // Линия переносится как текст: каждая строка идёт слева направо, дойдя до
        // правого края — обрыв и продолжение с левого края следующей строки.
        const rows = Array.from({ length: FOLD.rows }, (_, index) => {
          const y = brandTop + rowStep * index + HERO.line.y * brandScale;
          const start = index === 0 ? pagePadding + HERO.line.x * brandScale : outerLeft;
          const end = index === lastRow ? fortyNineX - FOLD.gap * brandScale : outerRight;
          return { start, end, y };
        });

        // Штрих движется с постоянной скоростью вдоль суммы всех строк, поэтому
        // перенос читается как продолжение одной линии, а не как девять ревилов.
        const pathLength = rows.reduce((total, row) => total + (row.end - row.start), 0);
        let remaining = pathLength * lineProgress;

        context.globalAlpha = sOpacity;
        context.drawImage(brandMark, HERO.s.x, HERO.s.y, HERO.s.width, HERO.s.height, pagePadding, brandTop, HERO.s.width * brandScale, HERO.s.height * brandScale);
        context.globalAlpha = 1;

        context.fillStyle = INK;
        rows.forEach((row) => {
          const rowLength = row.end - row.start;
          const drawnLength = clamp(remaining, 0, rowLength);
          if (drawnLength > 0) context.fillRect(row.start, row.y, drawnLength, thickness);
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
          brandTop + rowStep * lastRow,
          HERO.fortyNine.width * brandScale,
          HERO.fortyNine.height * brandScale,
        );
        context.globalAlpha = 1;
      };

      const paint = (elapsed: number) => {
        const { lineStart, lineEnd, total } = timeline(stage.isMobile);
        const sOpacity = track(elapsed, 200, 550);
        const lineProgress = easeInOutCubic(track(elapsed, lineStart, lineEnd));
        const fortyNineOpacity = track(elapsed, lineEnd, lineEnd + 400);

        context.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
        context.clearRect(0, 0, stage.width, stage.height);
        if (stage.isMobile) drawMobileBrand(lineProgress, sOpacity, fortyNineOpacity);
        else drawDesktopBrand(lineProgress, sOpacity, fortyNineOpacity);

        if (loadingRef.current) {
          loadingRef.current.textContent = `Loading: ${Math.round(track(elapsed, 0, total) * 100)}%`;
        }
      };

      const tick = (now: number) => {
        frameId = 0;
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const done = elapsed >= timeline(stage.isMobile).total;
        // Следующий кадр запрашивается до отрисовки: если paint бросит исключение,
        // анимация не замрёт молча на полпути.
        if (!done) frameId = window.requestAnimationFrame(tick);
        paint(done ? FINAL : elapsed);
        if (done && !finished) {
          finished = true;
          setIsReady(true);
        }
      };

      // rAF не тикает в скрытой вкладке — если кадр потерялся, подхватываем цикл.
      const resume = () => {
        if (disposed || finished || frameId || document.hidden) return;
        frameId = window.requestAnimationFrame(tick);
      };

      const handleResize = () => {
        stage = measureStage();
        // Пока идёт анимация, перерисовкой займётся следующий кадр rAF.
        if (finished) paint(FINAL);
        else resume();
      };

      if (reduceMotion) {
        paint(FINAL);
        finished = true;
        setIsReady(true);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }

      window.addEventListener("resize", handleResize);
      document.addEventListener("visibilitychange", resume);
      detach = () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", resume);
      };
    });

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      detach?.();
    };
  }, []);

  return (
    <section className="intro-scroll" id="top" aria-labelledby="studio-title">
      <div className="intro-stage">
        <header className={`site-header${isReady ? " is-ready" : ""}${isNavOpen ? " is-open" : ""}`}>
          <a className="site-mark" href="#top" aria-label="S—49, в начало страницы">
            <img src="/studio49-header.svg" alt="S—49" />
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-controls="site-nav"
            aria-expanded={isNavOpen}
            aria-label={isNavOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setIsNavOpen((open) => !open)}
          >
            <span aria-hidden="true" />
          </button>
          <nav id="site-nav" className="social-links" aria-label="Контакты">
            <div className="social-links-inner">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  onClick={() => setIsNavOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </header>
        <h1 id="studio-title" className="sr-only">Studio49</h1>
        <canvas ref={canvasRef} className="brand-canvas" aria-hidden="true" />
        <div className="intro-meta" aria-hidden="true">
          <span>Version: 001</span>
          <span ref={loadingRef}>Loading: 0%</span>
        </div>
      </div>
    </section>
  );
}

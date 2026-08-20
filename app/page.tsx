"use client";

import { useEffect, useRef, useState } from "react";
import { IntroExperience } from "./components/intro-experience";

const projects = [
  ["Cosmopolitan", "логотип / веб-дизайн / разработка", "", "сайт", "2026", "https://cosmopolitancardetailing.com/"],
  ["Petro Aesthetics", "веб-дизайн / разработка", "", "сайт", "2026", "https://petroaesthetics.com/"],
  ["Brier", "веб-дизайн / разработка", "", "сайт", "2026", "https://brier-wear.com/"],
  ["Technometall", "логотип / веб-дизайн / разработка", "", "сайт", "2026", "https://technometall.ru/"],
  ["Logos&Marks", "логотип", "кейс", "", "2025", "", "https://www.behance.net/gallery/243448671/Logotypes-2025"],
  ["ORWO", "брендинг / веб-дизайн", "", "", "2025", ""],
  ["Forge", "логотип / брендинг / веб-дизайн / разработка", "", "сайт", "2025", "https://forgemoscow.ru/"],
  ["КДК", "веб-дизайн / разработка", "", "сайт", "2025", "https://kdkstanki.ru/"],
  ["PAX", "веб-дизайн / разработка", "", "сайт", "2025", "https://paxfactory.com/"],
  ["Apparat software", "веб-дизайн / разработка", "", "сайт", "2025", "https://teams.apparat.software/"],
  ["Logos&Marks", "логотип", "кейс", "", "2024", "", "https://www.behance.net/gallery/216997067/Logotypes-2024"],
  ["SMT FLEX", "логотип / брендинг / веб-дизайн", "кейс", "сайт", "2024", "https://smtflex.ru/", "https://www.behance.net/gallery/249769439/SMT-FLEX-identity-web"],
  ["WhatMattersAgency", "логотип / брендинг / веб-дизайн", "кейс", "", "2024", "", "https://www.behance.net/gallery/229955147/WhatMattersAgency-identity-web"],
  ["Logos&Marks", "логотип", "кейс", "", "2023", ""],
  ["РациON", "логотип / брендинг", "кейс", "", "2023", "", "https://www.behance.net/gallery/195802431/raciON-logo-identity"],
  ["CROOG", "логотип / брендинг", "кейс", "", "2022", "", "https://www.behance.net/gallery/174180313/CROOG-ux-ui-logo"],
  ["Logos&Marks", "логотип", "кейс", "", "2022", "", "https://www.behance.net/gallery/161569643/Logotypes-2021-2022"],
] as const;

const filters = [
  ["all", "все проекты"],
  ["логотип", "логотип"],
  ["брендинг", "брендинг"],
  ["веб-дизайн", "веб-дизайн"],
  ["разработка", "разработка"],
] as const;

const REVEAL_CASCADE_DELAY_MS = 300;
// Эти проекты остаются в данных, но временно не выводятся на сайт.
const temporarilyHiddenProjects = new Set(["ORWO"]);

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number][0]>("all");
  const [isAboutRevealed, setIsAboutRevealed] = useState(false);
  const [isProjectsHeadingReleased, setIsProjectsHeadingReleased] = useState(false);
  const [isProjectsHeadingInView, setIsProjectsHeadingInView] = useState(false);
  const [isProjectsHeadingRevealed, setIsProjectsHeadingRevealed] = useState(false);
  const [isProjectFiltersInView, setIsProjectFiltersInView] = useState(false);
  const [isProjectFiltersRevealed, setIsProjectFiltersRevealed] = useState(false);
  const [isProjectListInView, setIsProjectListInView] = useState(false);
  const [isProjectListRevealed, setIsProjectListRevealed] = useState(false);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsHeadingRef = useRef<HTMLDivElement>(null);
  const projectFiltersRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(([, services]) => services.includes(activeFilter));
  const visibleProjects = filteredProjects.filter(([name]) => !temporarilyHiddenProjects.has(name));

  useEffect(() => {
    const targets = [
      [aboutRef.current, setIsAboutRevealed],
      [projectsHeadingRef.current, setIsProjectsHeadingInView],
      [projectFiltersRef.current, setIsProjectFiltersInView],
      [projectListRef.current, setIsProjectListInView],
    ] as const;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = targets.find(([element]) => element === entry.target);
        target?.[1](true);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    targets.forEach(([element]) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAboutRevealed) return;
    const timeout = window.setTimeout(() => setIsProjectsHeadingReleased(true), REVEAL_CASCADE_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [isAboutRevealed]);

  useEffect(() => {
    if (isProjectsHeadingReleased && isProjectsHeadingInView) setIsProjectsHeadingRevealed(true);
  }, [isProjectsHeadingReleased, isProjectsHeadingInView]);

  useEffect(() => {
    if (isProjectsHeadingRevealed && isProjectFiltersInView) setIsProjectFiltersRevealed(true);
  }, [isProjectFiltersInView, isProjectsHeadingRevealed]);

  useEffect(() => {
    if (isProjectFiltersRevealed && isProjectListInView) setIsProjectListRevealed(true);
  }, [isProjectFiltersRevealed, isProjectListInView]);

  return (
    <main>
      <IntroExperience />
      <section className={`about reveal-copy${isAboutRevealed ? " is-revealed" : ""}`} aria-labelledby="about-title" ref={aboutRef}>
        <p className="section-label">О команде</p>
        <h2 id="about-title">
          <span>Сейчас нас четверо: арт-директор, UX/UI-дизайнер, фуллстак-разработчик и&nbsp;графический дизайнер. И&nbsp;этого хватает, чтобы закрыть проект целиком — от исследования и брендинга до свёрстанного и работающего сайта, без&nbsp;подрядчиков на стороне.</span>
          <span>Каждый проект начинается с задачи, а не с макета: разбираемся в контексте, выбираем направление и только потом проектируем решение.</span>
          <span>Пять лет работаем распределённо и за это время собрали процесс, который доводит проект до запуска без&nbsp;потерь.</span>
          <span>Нам важно делать не просто выразительные проекты, а решения, после&nbsp;которых бизнес становится понятнее и&nbsp;сильнее.</span>
        </h2>
      </section>
      <section className="projects" aria-labelledby="projects-title">
        <div className={`section-heading reveal-copy${isProjectsHeadingRevealed ? " is-revealed" : ""}`} ref={projectsHeadingRef}>
          <p className="section-label">Проекты</p>
          <h2 id="projects-title">
            Проекты, которые мы уже создали: от лендингов до комплексного брендинга. Каждый из них — не просто визуальное решение, а продуманная система, которая&nbsp;работает на задачи бизнеса
          </h2>
        </div>
        <div className={`project-filters reveal-filters${isProjectFiltersRevealed ? " is-revealed" : ""}`} aria-label="Тип проекта" ref={projectFiltersRef}>
          {filters.map(([filter, label]) => (
            <button
              className={activeFilter === filter ? "is-active" : undefined}
              type="button"
              key={filter}
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={`project-list reveal-project-list${isProjectListRevealed ? " is-revealed" : ""}`} ref={projectListRef}>
          {visibleProjects.map(([name, services, caseLink, siteLink, year, siteUrl, caseUrl], index) => (
            <article className="project-row" key={`${name}-${year}-${index}`} style={isProjectListRevealed ? { animationDelay: `${index * 50}ms` } : undefined}>
              <p className="project-name">{name}</p>
              <p className="project-services">{services}</p>
              <div className="project-actions">
                <span className="project-action">
                  {caseUrl && (
                    <a href={caseUrl} target="_blank" rel="noreferrer">
                      {caseLink}<img className="project-arrow" src="/arrow.svg" alt="" aria-hidden="true" />
                    </a>
                  )}
                </span>
                <span className="project-action">
                  {siteUrl && (
                    <a href={siteUrl} target="_blank" rel="noreferrer">
                    {siteLink}<img className="project-arrow" src="/arrow.svg" alt="" aria-hidden="true" />
                    </a>
                  )}
                </span>
              </div>
              <p className="project-year">{year}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="closing-footer">
        <p className="legal-notice">* Принадлежит Meta — организации, деятельность которой запрещена в РФ</p>
        <a className="footer-privacy" href="/privacy-policy">Политика обработки данных</a>
        <p className="copyright" aria-label="S—49, copyright 2026">
          S—49©2026
        </p>
      </footer>
    </main>
  );
}

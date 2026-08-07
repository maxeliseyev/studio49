"use client";

import { useState } from "react";
import { IntroExperience } from "./components/intro-experience";

const projects = [
  ["Cosmopolitan", "логотип / веб-дизайн / разработка", "кейс", "сайт", "2026", "https://cosmopolitancardetailing.com/"],
  ["Petro Aesthetics", "веб-дизайн / разработка", "", "сайт", "2026", "https://petroaesthetics.com/"],
  ["Brier", "веб-дизайн / разработка", "", "сайт", "2026", "https://brier-wear.com/"],
  ["Technometall", "логотип / веб-дизайн / разработка", "", "сайт", "2026", "https://technometall.ru/"],
  ["Logos&Marks", "логотип", "кейс", "", "2025", ""],
  ["ORWO", "брендинг / веб-дизайн", "кейс", "", "2025", ""],
  ["Forge", "логотип / брендинг / веб-дизайн / разработка", "кейс", "сайт", "2025", "https://forgemoscow.ru/"],
  ["КДК", "веб-дизайн / разработка", "", "сайт", "2025", "https://kdkstanki.ru/"],
  ["РАХ", "веб-дизайн / разработка", "", "сайт", "2025", "https://paxfactory.com/"],
  ["Apparat software", "веб-дизайн / разработка", "", "сайт", "2025", "https://teams.apparat.software/"],
  ["Logos&Marks", "логотип", "кейс", "", "2024", ""],
  ["SMT FLEX", "логотип / брендинг / веб-дизайн", "кейс", "сайт", "2024", "https://smtflex.ru/"],
  ["WhatMattersAgency", "логотип / брендинг / веб-дизайн", "кейс", "", "2024", ""],
  ["Logos&Marks", "логотип", "кейс", "", "2023", ""],
  ["РациON", "логотип / брендинг", "кейс", "", "2023", ""],
  ["CROOG", "логотип / веб-дизайн", "кейс", "", "2022", ""],
  ["Logos&Marks", "логотип", "кейс", "", "2022", ""],
] as const;

const filters = [
  ["all", "все проекты"],
  ["логотип", "логотип"],
  ["брендинг", "брендинг"],
  ["веб-дизайн", "веб-дизайн"],
  ["разработка", "разработка"],
] as const;

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number][0]>("all");
  const visibleProjects = activeFilter === "all"
    ? projects
    : projects.filter(([, services]) => services.includes(activeFilter));

  return (
    <main>
      <IntroExperience />
      <section className="about" aria-labelledby="about-title">
        <p className="section-label">О команде</p>
        <h2 id="about-title">Нам важно, чтобы проект приносил результат, а не просто пополнял портфолио. Работая в формате распределённой команды в течении 5 лет, мы сформировали системный подход к выполнению задач. И готовы к новым вызовам.</h2>
      </section>
      <section className="projects" aria-labelledby="projects-title">
        <div className="section-heading">
          <p className="section-label">Проекты</p>
          <h2 id="projects-title">Здесь — то, что мы уже построили. От лендингов до сложных айдентик. Каждый проект — не просто картинка, а работающая система.</h2>
        </div>
        <div className="project-filters" aria-label="Тип проекта">
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
        <div className="project-list">
          {visibleProjects.map(([name, services, caseLink, siteLink, year, siteUrl], index) => (
            <article className="project-row" key={`${name}-${year}-${index}`}>
              <p className="project-name">{name}</p>
              <p className="project-services">{services}</p>
              <p className="project-link">{caseLink}</p>
              {siteUrl ? (
                <a className="project-link" href={siteUrl} target="_blank" rel="noreferrer">
                  {siteLink}
                </a>
              ) : (
                <p className="project-link">{siteLink}</p>
              )}
              <p className="project-year">{year}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="closing-footer">
        <p className="legal-notice">* Принадлежит Meta — организации, деятельность которой запрещена в РФ</p>
        <p className="copyright" aria-label="S—49, copyright 2026">
          S—49©2026
        </p>
      </footer>
    </main>
  );
}

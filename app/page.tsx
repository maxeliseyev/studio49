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
  ["Laser balance", "веб-дизайн / разработка", "", "сайт", "2023", "https://laserbalance.ru/"],
  ["CROOG", "логотип / веб-дизайн", "кейс", "", "2022", ""],
  ["Logos&Marks", "логотип", "кейс", "", "2022", ""],
] as const;

export default function Home() {
  return (
    <main>
      <IntroExperience />
      <section className="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">Проекты</h2>
        <div className="project-filters" aria-label="Тип проекта">
          <button className="is-active" type="button">все проекты</button>
          <button type="button">логотип</button>
          <button type="button">брендинг</button>
          <button type="button">веб-дизайн</button>
          <button type="button">разработка</button>
        </div>
        <div className="project-list">
          {projects.map(([name, services, caseLink, siteLink, year, siteUrl], index) => (
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

const socialLinks = [
  { label: "телеграм", href: "https://t.me/s49design" },
  { label: "инстаграм*", href: "https://www.instagram.com/s49design/" },
  { label: "дизайнерс", href: "https://designers.ru/s49design/" },
  { label: "линкедин", href: "https://www.linkedin.com/company/s49design/" },
];

export default function Home() {
  return (
    <main className="page">
      <nav className="social-links" aria-label="Социальные сети">
        {socialLinks.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        ))}
      </nav>

      <a className="contact-link" href="mailto:s49design@yandex.ru">
        написать
      </a>

      <section className="hero" aria-label="Studio49">
        <div className="brand">
          <img className="brand-mark brand-s" src="/s.svg" alt="S" />
          <div className="brand-line" aria-hidden="true">
            <div className="brand-line-fill" />
          </div>
          <img className="brand-mark brand-forty-nine" src="/49.svg" alt="49" />
        </div>
      </section>

      <footer className="site-footer">
        <p className="legal-notice">* Принадлежит Meta — организации, деятельность которой запрещена в РФ</p>
        <p className="copyright" aria-label="S—49, copyright 2026">
          S—49©2026
        </p>
      </footer>
    </main>
  );
}

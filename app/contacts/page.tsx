import { ContactForm } from "./contact-form";

const socialLinks = [
  { label: "behance", href: "https://www.behance.net/s49design" },
  { label: "инстаграм*", href: "https://www.instagram.com/s49design/" },
  { label: "телеграм", href: "https://t.me/s49design" },
  { label: "линкедин", href: "https://www.linkedin.com/company/s49design/" },
  { label: "написать", href: "/contacts" },
];

export default function ContactsPage() {
  return (
    <main className="contacts-page">
      <header className="contacts-header">
        <a className="site-mark" href="/" aria-label="S—49, на главную страницу">
          <img src="/studio49-header.svg" alt="S—49" />
        </a>
        <nav className="contacts-social-links" aria-label="Контакты">
          {socialLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="contacts-content" aria-labelledby="contacts-title">
        <p className="section-label">Контакты</p>
        <h1 id="contacts-title">
          Если наш подход вам близок — давайте обсудим вашу задачу.<br />
          Напишите нам, и мы свяжемся, чтобы познакомиться, обменяться идеями<br />
          и понять, чем можем быть полезны. Без обязательств и лишних формальностей.
        </h1>

        <ContactForm />
      </section>

      <footer className="contacts-footer">
        <p>* Принадлежит Meta — организации, деятельность которой запрещена в РФ</p>
        <a href="/privacy-policy">Политика обработки данных</a>
        <p>S—49©2026</p>
      </footer>
    </main>
  );
}

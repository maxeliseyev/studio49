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

        <form className="contacts-form" action="mailto:s49design@yandex.ru" method="post" encType="text/plain">
          <div className="contacts-form-fields">
            <label>
              <span className="sr-only">Имя</span>
              <input name="name" type="text" placeholder="Имя" required />
            </label>
            <label>
              <span className="sr-only">Почта</span>
              <input name="email" type="email" placeholder="Почта" required />
            </label>
            <label>
              <span className="sr-only">Телефон или мессенджер</span>
              <input name="contact" type="text" placeholder="Телефон или мессенджер" />
            </label>
            <label className="contacts-form-message">
              <span className="sr-only">Несколько слов о задаче</span>
              <textarea name="message" placeholder="Несколько слов о задаче" required />
            </label>
          </div>
          <label className="contacts-consent">
            <input name="consent" type="checkbox" defaultChecked required />
            <span>Я даю согласие на обработку моих персональных данных в соответствии с <a href="/privacy-policy">Политикой обработки персональных данных</a></span>
          </label>
          <button className="contacts-submit" type="submit">
            Отправить <img className="project-arrow" src="/arrow.svg" alt="" aria-hidden="true" />
          </button>
        </form>
      </section>

      <footer className="contacts-footer">
        <p>* Принадлежит Meta — организации, деятельность которой запрещена в РФ</p>
        <a href="/privacy-policy">Политика обработки данных</a>
        <p>S—49©2026</p>
      </footer>
    </main>
  );
}

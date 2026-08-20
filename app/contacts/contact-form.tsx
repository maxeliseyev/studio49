"use client";

import { FormEvent, useState } from "react";

type SubmissionStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", { method: "POST", body: new FormData(form) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Не удалось отправить сообщение. Попробуйте позже.");

      form.reset();
      setStatus("success");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Не удалось отправить сообщение. Попробуйте позже.");
      setStatus("error");
    }
  };

  return (
    <form className="contacts-form" onSubmit={handleSubmit}>
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
      <label className="contacts-honeypot" aria-hidden="true">
        <span>Не заполняйте это поле</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="contacts-consent">
        <input name="consent" type="checkbox" defaultChecked required />
        <span>Я даю согласие на обработку моих персональных данных в соответствии с <a href="/privacy-policy">Политикой обработки персональных данных</a></span>
      </label>
      <button className="contacts-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Отправляем…" : "Отправить"} <img className="project-arrow" src="/arrow.svg" alt="" aria-hidden="true" />
      </button>
      <p className={`contacts-form-status${status === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
        {status === "success" ? "Спасибо! Сообщение отправлено." : error}
      </p>
    </form>
  );
}

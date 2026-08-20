export const runtime = "nodejs";

const RECIPIENT = "s49design@yandex.ru";
const SENDER = "Studio49 <hello@s-49.ru>";

const valueOf = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export async function POST(request: Request) {
  const formData = await request.formData();

  // Скрытое поле: боты обычно заполняют его, реальные посетители — нет.
  if (valueOf(formData, "website")) return Response.json({ ok: true });

  const name = valueOf(formData, "name");
  const email = valueOf(formData, "email");
  const contact = valueOf(formData, "contact");
  const message = valueOf(formData, "message");
  const consent = valueOf(formData, "consent");

  if (!name || !email || !message || !consent || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: "Проверьте, пожалуйста, заполнение формы." }, { status: 400 });
  }

  if ([name, email, contact, message].some((value) => value.length > 4_000)) {
    return Response.json({ error: "Одно из полей слишком длинное." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return Response.json({ error: "Отправка временно недоступна. Попробуйте позже." }, { status: 503 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: SENDER,
      to: [RECIPIENT],
      reply_to: email,
      subject: `Новая заявка с сайта — ${name}`,
      text: `Имя: ${name}\nПочта: ${email}\nТелефон или мессенджер: ${contact || "не указан"}\n\nЗадача:\n${message}`,
    }),
  });

  if (!response.ok) {
    console.error("Resend request failed", response.status);
    return Response.json({ error: "Не удалось отправить сообщение. Попробуйте позже." }, { status: 502 });
  }

  return Response.json({ ok: true });
}

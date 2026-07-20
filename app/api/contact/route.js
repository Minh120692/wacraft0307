import nodemailer from "nodemailer";

export const runtime = "nodejs";

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "sunflora92612@gmail.com";

function badRequest(message) {
  return new Response(message, {
    status: 400,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

function serverError(message) {
  return new Response(message, {
    status: 500,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

function emailNotConfiguredMessage() {
  if (process.env.NODE_ENV !== "production") {
    return "Email delivery is not configured for local development. Add SMTP settings to .env.local.";
  }

  return "Email delivery is not configured.";
}

function formatPreferredDatetime(value) {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "Contact form message").trim();
  const message = String(formData.get("message") || "").trim();
  const preferredDatetime = String(formData.get("preferred_datetime") || "").trim();

  if (!name || !email || !message) {
    return badRequest("Please complete all required fields.");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return badRequest("Please enter a valid email address.");
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;
  const fromName = process.env.SMTP_FROM_NAME || "WA+CRAFT Contact";

  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
    return serverError(emailNotConfiguredMessage());
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const formattedPreferredDatetime = formatPreferredDatetime(preferredDatetime);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safePreferredDatetime = escapeHtml(formattedPreferredDatetime);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const textLines = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
  ];

  if (formattedPreferredDatetime) {
    textLines.push(`Preferred date/time: ${formattedPreferredDatetime}`);
  }

  textLines.push("", "Message:", message);

  const htmlSections = [
    "<h2>New contact form submission</h2>",
    `<p><strong>Name:</strong> ${safeName}</p>`,
    `<p><strong>Email:</strong> ${safeEmail}</p>`,
    `<p><strong>Subject:</strong> ${safeSubject}</p>`,
  ];

  if (formattedPreferredDatetime) {
    htmlSections.push(`<p><strong>Preferred date/time:</strong> ${safePreferredDatetime}</p>`);
  }

  htmlSections.push(`<p><strong>Message:</strong><br>${safeMessage}</p>`);

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: `[WA+CRAFT] ${subject}`,
      text: textLines.join("\n"),
      html: htmlSections.join(""),
    });
  } catch (error) {
    console.error("Contact form email failed", error);
    return serverError("Unable to send your message right now.");
  }

  return new Response("OK", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  business: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  service: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { name, business, email, phone, service, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "contact@verique.co.uk";
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Verique Website <contact@verique.co.uk>";

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; contact form submission was not emailed.");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Consultation request — ${business}`,
      text: [
        `Name: ${name}`,
        `Business: ${business}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        "",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact form email", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }
}

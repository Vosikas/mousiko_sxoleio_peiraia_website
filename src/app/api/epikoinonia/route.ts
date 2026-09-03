import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";
import { EMPTY_CONTACT, hasErrors, validateContact, type ContactInput } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const seen = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = seen.get(ip);
  if (!entry || entry.reset < now) {
    seen.set(ip, { count: 1, reset: now + WINDOW });
    if (seen.size > 500) for (const [key, value] of seen) if (value.reset < now) seen.delete(key);
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

let transporter: Transporter | null = null;

function getTransport(): Transporter {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Λείπουν οι μεταβλητές SMTP_HOST / SMTP_USER / SMTP_PASS");
  }
  const port = Number(SMTP_PORT ?? 587);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string,
  );

function body(input: ContactInput, meta: { ip: string; at: string }) {
  const rows: [string, string][] = [
    ["Ονοματεπώνυμο", input.name],
    ["Email", input.email],
    ["Τηλέφωνο", input.phone || "—"],
    ["Θέμα", input.topic],
    ["Ημερομηνία", meta.at],
    ["IP", meta.ip],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n") + `\n\nΜήνυμα:\n${input.message}\n`;
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#102a43;line-height:1.6">
  <h2 style="margin:0 0 16px;font-size:18px">Νέο μήνυμα από τον ιστότοπο</h2>
  <table style="border-collapse:collapse;font-size:14px">
    ${rows.map(([label, value]) => `<tr><td style="padding:4px 16px 4px 0;color:#5b7285">${escape(label)}</td><td style="padding:4px 0"><strong>${escape(value)}</strong></td></tr>`).join("")}
  </table>
  <div style="margin-top:20px;padding:16px;background:#f2f8f8;border-left:3px solid #0e938c;white-space:pre-wrap;font-size:14px">${escape(input.message)}</div>
</div>`;

  return { text, html };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  if (rateLimited(ip)) return NextResponse.json({ ok: false, message: "Πολλά αιτήματα." }, { status: 429 });

  let payload: ContactInput;
  try {
    const raw = (await request.json()) as Partial<ContactInput>;
    payload = {
      ...EMPTY_CONTACT,
      ...raw,
      name: String(raw.name ?? "").trim(),
      email: String(raw.email ?? "").trim(),
      phone: String(raw.phone ?? "").trim(),
      topic: String(raw.topic ?? ""),
      message: String(raw.message ?? "").trim(),
      consent: raw.consent === true,
      website: String(raw.website ?? ""),
    };
  } catch {
    return NextResponse.json({ ok: false, message: "Μη έγκυρο αίτημα." }, { status: 400 });
  }

  if (payload.website) return NextResponse.json({ ok: true });

  const errors = validateContact(payload);
  if (hasErrors(errors)) return NextResponse.json({ ok: false, errors }, { status: 400 });

  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!to || !from) {
    console.error("[epikoinonia] Λείπουν CONTACT_TO ή CONTACT_FROM");
    return NextResponse.json({ ok: false, message: "Η αποστολή δεν είναι διαθέσιμη αυτή τη στιγμή." }, { status: 500 });
  }

  const content = body(payload, {
    ip,
    at: new Intl.DateTimeFormat("el-GR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Athens" }).format(
      new Date(),
    ),
  });

  try {
    await getTransport().sendMail({
      from: { name: "Ιστότοπος σχολείου", address: from },
      to,
      bcc: process.env.CONTACT_BCC || undefined,
      replyTo: `${payload.name} <${payload.email}>`,
      subject: `[Επικοινωνία] ${payload.topic} — ${payload.name}`,
      text: content.text,
      html: content.html,
    });

    if (process.env.CONTACT_AUTOREPLY === "true") {
      await getTransport()
        .sendMail({
          from: { name: "Μουσικό Σχολείο Πειραιά", address: from },
          to: payload.email,
          subject: "Λάβαμε το μήνυμά σας",
          text: `Καλησπέρα ${payload.name},\n\nΛάβαμε το μήνυμά σας και θα απαντήσουμε μέσα σε δύο εργάσιμες ημέρες.\n\nΤο μήνυμά σας:\n${payload.message}\n\nΜουσικό Σχολείο Πειραιά`,
        })
        .catch((error) => console.error("[epikoinonia] autoreply", error));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[epikoinonia] sendMail", error);
    return NextResponse.json({ ok: false, message: "Το μήνυμα δεν στάλθηκε. Δοκιμάστε ξανά ή τηλεφωνήστε στη γραμματεία." }, { status: 502 });
  }
}

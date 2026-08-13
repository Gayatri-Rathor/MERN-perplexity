import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  console.log("Sending email to:", to);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: ["delivered@resend.dev"],
    subject,
    html,
  });

  if (error) {
    console.log("RESEND ERROR:", error);
    throw new Error(error.message);
  }

  console.log("EMAIL SENT:", data);
  return data;
}
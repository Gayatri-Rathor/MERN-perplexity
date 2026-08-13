import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  console.log("sendEmail called:", to);

  try {
    const { data, error } = await resend.emails.send({
      from: "Perplexity <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.log("Email sending failed:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);

    return data;
  } catch (error) {
    console.log("Email sending failed:", error);
    throw error;
  }
}
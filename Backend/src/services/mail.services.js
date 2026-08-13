import dotenv from "dotenv";

dotenv.config();

export async function sendEmail({ to, subject, html }) {
  console.log("Sending email to:", to);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: "beta",
        email: "gaytrirathore314@gmail.com",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("BREVO ERROR:", data);
    throw new Error(data.message || "Failed to send email");
  }

  console.log("EMAIL SENT:", data);
  return data;
}
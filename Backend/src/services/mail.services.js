import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email is ready for Transport to SMTP");
  })
  .catch((err) => {
    console.log("Email transporter verification failed:", err);
  });

export async function sendEmail({ to, subject, html, text }) {
  console.log("sendEmail called:", to);

  try {
    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    };

    const details = await transporter.sendMail(mailOptions);

    console.log("Email sent:", details.response);

    return details;
  } catch (error) {
    console.log("Email sending failed:", error);

    // VERY IMPORTANT
    throw error;
  }
}
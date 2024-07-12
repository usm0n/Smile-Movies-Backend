import nodemailer from "nodemailer";
import "dotenv/config"

export const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: { address: process.env.MAIL_EMAIL, name: process.env.MAIL_NAME },
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email sent error: " + error);
  }
};
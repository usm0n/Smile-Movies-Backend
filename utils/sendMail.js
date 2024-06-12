import nodemailer from "nodemailer";

export const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: "usmon.umarovich.09@gmail.com",
        pass: "eeip agee pyyr ltnz",
      },
    });

    await transporter.sendMail({
      from: "usmon.umarovich.09@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email sent error: " + error);
  }
};

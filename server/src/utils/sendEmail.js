import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const emailHost = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const emailPort = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT) || 587;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from: `"PathSeeker Career Passport" <${emailUser}>`,
        to,
        subject,
        html,
        text,
      });

      console.log(`[Email Sent] ✅ Successfully sent to ${to} | MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      // Log detailed mock for easy OTP retrieval during dev
      console.log(`\n[📧 Email Mock] ─────────────────────────────────────`);
      console.log(`  To      : ${to}`);
      console.log(`  Subject : ${subject}`);
      if (text) {
        const otpMatch = text.match(/\b\d{6}\b/);
        if (otpMatch) {
          console.log(`  OTP CODE: 👉 ${otpMatch[0]} 👈`);
        }
      }
      console.log(`  (Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env to send real emails)`);
      console.log(`──────────────────────────────────────────────────────\n`);
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error(`[Email Send Error] ❌ Failed sending email to ${to}:`, error.message);
    // Don't throw — we don't want email failures to break registration
    return { success: false, error: error.message };
  }
};

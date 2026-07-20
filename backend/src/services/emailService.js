import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email
export const sendEmail = async ({ to, subject, template, data }) => {
  try {
    // For now, just log the email (since we don't have email templates yet)
    console.log(`📧 Email sent to ${to}: ${subject}`);
    console.log(`📝 Template: ${template}`, data);
    
    // Uncomment when you have email templates ready
    /*
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html: renderTemplate(template, data),
    };

    await transporter.sendMail(mailOptions);
    */
    
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Render template (placeholder)
const renderTemplate = (template, data) => {
  switch (template) {
    case 'welcome':
      return `<h1>Welcome ${data.name}!</h1><p>Thanks for joining JurisFlow.</p>`;
    case 'reset-password':
      return `<h1>Reset Password</h1><p>Click here to reset your password: ${data.link}</p>`;
    default:
      return `<p>Email from JurisFlow</p>`;
  }
};
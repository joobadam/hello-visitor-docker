const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS }
})
const sendEmail = (to, name) => transporter.sendMail({
  from: process.env.GMAIL_USER,
  to,
  subject: `Hello ${name}! 👋`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hello ${name},</h1>
        <p style="color: #374151; line-height: 1.6; margin: 0 0 16px 0;">Thank you for checking out my project! This is a simple Docker Compose demonstration showcasing multi-container orchestration.</p>
        <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">If you're interested in more of my work, feel free to visit my portfolio:</p>
        <p style="margin: 0 0 20px 0;">
          <a href="https://www.adamjuhasz.com/" style="color: #3b82f6; text-decoration: none; font-weight: 500;">https://www.adamjuhasz.com/</a>
        </p>
        <p style="color: #374151; margin: 20px 0 0 0;">Best regards,<br>Adam</p>
      </div>
    </div>
  `
})
module.exports = { sendEmail }

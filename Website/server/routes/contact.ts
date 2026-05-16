import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { getSMTPConfig, getRecipientEmails } from "../utils/smtp-storage";

interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  description: string;
}

export const handleContact: RequestHandler = async (req, res) => {
  try {
    const { name, email, subject, description }: ContactRequestBody = req.body;

    // Validate required fields
    if (!name || !email || !subject || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Get SMTP configuration
    const smtpConfig = getSMTPConfig();
    const recipientEmails = getRecipientEmails();
    
    if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.password) {
      console.error('SMTP configuration is missing. Please configure it in the backend admin panel.');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service is not configured. Please contact the administrator.' 
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password,
      },
    });

    // Email content
    const emailSubject = `Contact Form: ${subject}`;
    
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${description.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>This message was submitted from the RR Greenfield International School website contact form.</small></p>
    `;

    // Send email to both recipients
    const info = await transporter.sendMail({
      from: `"RR Greenfield School" <${smtpConfig.from}>`,
      to: recipientEmails,
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, ''),
    });

    console.log('Contact form email sent:', info.messageId);

    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
};


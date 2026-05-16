import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { getSMTPConfig, getRecipientEmails } from "../utils/smtp-storage";

interface EnquiryRequestBody {
  name: string;
  phone: string;
  email?: string;
  studentName?: string;
  class?: string;
  subject?: string;
  message?: string;
}

export const handleEnquiry: RequestHandler = async (req, res) => {
  try {
    const { name, phone, email, studentName, class: studentClass, subject, message }: EnquiryRequestBody = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and phone number are required' 
      });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number must be 10 digits' 
      });
    }

    // Get SMTP configuration from storage (backend admin panel) or fallback to env
    const smtpConfig = getSMTPConfig();
    const recipientEmails = getRecipientEmails();
    
    const smtpHost = smtpConfig.host;
    const smtpPort = smtpConfig.port;
    const smtpUser = smtpConfig.user;
    const smtpPassword = smtpConfig.password;
    const smtpFrom = smtpConfig.from || smtpUser;

    // Validate SMTP configuration
    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error('SMTP configuration is missing. Please configure it in the backend admin panel.');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service is not configured. Please contact the administrator.' 
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Email content
    const emailSubject = `New Enquiry from ${name} - ${subject || 'General Enquiry'}`;
    
    const emailBody = `
      <h2>New Enquiry Received</h2>
      <p><strong>Parent/Guardian Name:</strong> ${name}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
      ${studentName ? `<p><strong>Student Name:</strong> ${studentName}</p>` : ''}
      ${studentClass ? `<p><strong>Class/Grade:</strong> ${studentClass}</p>` : ''}
      ${subject ? `<p><strong>Subject of Enquiry:</strong> ${subject}</p>` : ''}
      ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>This enquiry was submitted from the RR Greenfield International School website.</small></p>
    `;

    // Send email to both recipients
    const info = await transporter.sendMail({
      from: `"RR Greenfield School" <${smtpFrom}>`,
      to: recipientEmails,
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, ''), // Plain text version
    });

    console.log('Enquiry email sent:', info.messageId);

    res.json({ 
      success: true, 
      message: 'Enquiry submitted successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending enquiry email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send enquiry. Please try again later.' 
    });
  }
};


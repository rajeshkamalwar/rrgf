import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { getSMTPConfig, getRecipientEmails } from "../utils/smtp-storage";

interface VisitScheduleRequestBody {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  numberOfVisitors: string;
  purpose: string;
  message?: string;
}

export const handleVisitSchedule: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, preferredDate, preferredTime, numberOfVisitors, purpose, message }: VisitScheduleRequestBody = req.body;

    // Validate required fields
    if (!name || !email || !phone || !preferredDate || !preferredTime || !numberOfVisitors || !purpose) {
      return res.status(400).json({ 
        success: false, 
        error: 'All required fields must be filled' 
      });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number must be 10 digits' 
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
    const emailSubject = `School Visit Request from ${name}`;
    
    const emailBody = `
      <h2>New School Visit Request</h2>
      <p><strong>Visitor Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Preferred Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
      <p><strong>Preferred Time:</strong> ${preferredTime}</p>
      <p><strong>Number of Visitors:</strong> ${numberOfVisitors}</p>
      <p><strong>Visit Purpose:</strong> ${purpose}</p>
      ${message ? `<p><strong>Additional Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>This visit request was submitted from the RR Greenfield International School website.</small></p>
    `;

    // Send email to both recipients
    const info = await transporter.sendMail({
      from: `"RR Greenfield School" <${smtpConfig.from}>`,
      to: recipientEmails,
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, ''),
    });

    console.log('Visit schedule email sent:', info.messageId);

    res.json({ 
      success: true, 
      message: 'Visit request submitted successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending visit schedule email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit visit request. Please try again later.' 
    });
  }
};


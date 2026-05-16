import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { getSMTPConfig, getRecipientEmails } from "../utils/smtp-storage";

interface AdmissionsRequestBody {
  // Student Information
  studentName: string;
  dateOfBirth: string;
  gender: string;
  classSeeking: string;
  previousSchool: string;
  previousClass: string;
  
  // Parent/Guardian Information
  parentName: string;
  relationship: string;
  occupation: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  
  // Additional Information
  message: string;
}

export const handleAdmissions: RequestHandler = async (req, res) => {
  try {
    const {
      studentName,
      dateOfBirth,
      gender,
      classSeeking,
      previousSchool,
      previousClass,
      parentName,
      relationship,
      occupation,
      phone,
      alternatePhone,
      email,
      address,
      emergencyContactName,
      emergencyContactPhone,
      message
    }: AdmissionsRequestBody = req.body;

    // Validate all required fields
    if (!studentName || !dateOfBirth || !gender || !classSeeking || !previousSchool || !previousClass ||
        !parentName || !relationship || !occupation || !phone || !alternatePhone || !email || !address ||
        !emergencyContactName || !emergencyContactPhone || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are mandatory. Please fill in all the required information.' 
      });
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number must be 10 digits' 
      });
    }

    // Validate alternate phone number format (10 digits)
    if (!/^\d{10}$/.test(alternatePhone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Alternate phone number must be 10 digits' 
      });
    }

    // Validate emergency contact phone number format (10 digits)
    if (!/^\d{10}$/.test(emergencyContactPhone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Emergency contact phone number must be 10 digits' 
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
    const emailSubject = `Admission Application 2025-26: ${studentName} - ${classSeeking}`;
    
    const emailBody = `
      <h2>New Admission Application for Session 2025-26</h2>
      
      <h3 style="color: #1e40af; margin-top: 20px; margin-bottom: 10px;">Student Information</h3>
      <p><strong>Student Name:</strong> ${studentName}</p>
      <p><strong>Date of Birth:</strong> ${new Date(dateOfBirth).toLocaleDateString()}</p>
      <p><strong>Gender:</strong> ${gender.charAt(0).toUpperCase() + gender.slice(1)}</p>
      <p><strong>Class Seeking Admission:</strong> ${classSeeking}</p>
      <p><strong>Previous School:</strong> ${previousSchool}</p>
      <p><strong>Previous Class:</strong> ${previousClass}</p>
      
      <h3 style="color: #1e40af; margin-top: 20px; margin-bottom: 10px;">Parent/Guardian Information</h3>
      <p><strong>Parent/Guardian Name:</strong> ${parentName}</p>
      <p><strong>Relationship:</strong> ${relationship.charAt(0).toUpperCase() + relationship.slice(1)}</p>
      <p><strong>Occupation:</strong> ${occupation}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Alternate Phone:</strong> ${alternatePhone}</p>
      <p><strong>Email Address:</strong> ${email}</p>
      <p><strong>Address:</strong><br>${address.replace(/\n/g, '<br>')}</p>
      
      <h3 style="color: #1e40af; margin-top: 20px; margin-bottom: 10px;">Emergency Contact</h3>
      <p><strong>Emergency Contact Name:</strong> ${emergencyContactName}</p>
      <p><strong>Emergency Contact Phone:</strong> ${emergencyContactPhone}</p>
      
      <h3 style="color: #1e40af; margin-top: 20px; margin-bottom: 10px;">Additional Information</h3>
      <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      
      <hr style="margin-top: 30px; border-color: #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
        This admission application was submitted from the RR Greenfield International School website for the academic session 2025-26.
      </p>
    `;

    // Send email to both recipients
    const info = await transporter.sendMail({
      from: `"RR Greenfield School" <${smtpConfig.from}>`,
      to: recipientEmails,
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, ''),
    });

    console.log('Admissions email sent:', info.messageId);

    res.json({ 
      success: true, 
      message: 'Admission application submitted successfully for session 2025-26',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending admissions email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register interest. Please try again later.' 
    });
  }
};


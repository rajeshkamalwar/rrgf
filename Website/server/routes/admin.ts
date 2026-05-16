import { RequestHandler } from "express";
import { verifyCredentials, createSession, verifySession, destroySession } from "../utils/auth";
import { getSMTPConfig, saveSMTPConfig, type SMTPConfig } from "../utils/smtp-storage";
import nodemailer from "nodemailer";

// Login endpoint
export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required',
      });
    }

    if (verifyCredentials(username, password)) {
      const sessionId = createSession(username);
      res.json({
        success: true,
        sessionId,
        message: 'Login successful',
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Logout endpoint
export const handleLogout: RequestHandler = (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    if (sessionId) {
      destroySession(sessionId);
    }
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Middleware to check authentication
export const requireAuth = (req: any, res: any, next: any) => {
  const sessionId = req.headers['x-session-id'] as string;

  if (!sessionId || !verifySession(sessionId)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Please login first.',
    });
  }

  next();
};

// Check authentication status (doesn't require auth, just verifies session)
export const handleCheckAuth: RequestHandler = (req, res) => {
  const sessionId = req.headers['x-session-id'] as string;
  const isValid = sessionId ? verifySession(sessionId) : false;
  
  res.json({
    success: isValid,
    authenticated: isValid,
  });
};

// Get SMTP config
export const handleGetSMTPConfig: RequestHandler = (req, res) => {
  try {
    const config = getSMTPConfig();
    // Don't send password in response
    const { password, ...safeConfig } = config;
    res.json({
      success: true,
      config: safeConfig,
      hasPassword: !!password,
    });
  } catch (error) {
    console.error('Error getting SMTP config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get SMTP configuration',
    });
  }
};

// Update SMTP config
export const handleUpdateSMTPConfig: RequestHandler = (req, res) => {
  try {
    const config: Partial<SMTPConfig> = req.body;

    // Validate required fields if provided
    if (config.host !== undefined && !config.host) {
      return res.status(400).json({
        success: false,
        error: 'SMTP host is required',
      });
    }

    if (config.user !== undefined && !config.user) {
      return res.status(400).json({
        success: false,
        error: 'SMTP user is required',
      });
    }

    if (config.port !== undefined && (config.port < 1 || config.port > 65535)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid SMTP port (must be between 1 and 65535)',
      });
    }

    const updatedConfig = saveSMTPConfig(config);
    const { password, ...safeConfig } = updatedConfig;

    res.json({
      success: true,
      config: safeConfig,
      hasPassword: !!updatedConfig.password,
      message: 'SMTP configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating SMTP config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update SMTP configuration',
    });
  }
};

// Test SMTP connection
export const handleTestSMTPConnection: RequestHandler = async (req, res) => {
  try {
    const config = getSMTPConfig();

    if (!config.host || !config.user || !config.password) {
      return res.status(400).json({
        success: false,
        error: 'SMTP configuration is incomplete. Please configure host, user, and password.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    // Test connection
    await transporter.verify();

    res.json({
      success: true,
      message: 'SMTP connection successful',
    });
  } catch (error: any) {
    console.error('SMTP connection test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect to SMTP server',
    });
  }
};

// Send test email
export const handleSendTestEmail: RequestHandler = async (req, res) => {
  try {
    const { testEmail } = req.body;
    const config = getSMTPConfig();

    if (!config.host || !config.user || !config.password) {
      return res.status(400).json({
        success: false,
        error: 'SMTP configuration is incomplete. Please configure host, user, and password.',
      });
    }

    if (!testEmail) {
      return res.status(400).json({
        success: false,
        error: 'Test email address is required',
      });
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    const info = await transporter.sendMail({
      from: `"RR Greenfield School" <${config.from}>`,
      to: testEmail,
      subject: 'Test Email from RR Greenfield School',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the RR Greenfield International School website backend.</p>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
        <hr>
        <p><small>Sent at ${new Date().toLocaleString()}</small></p>
      `,
      text: 'This is a test email from the RR Greenfield International School website backend.',
    });

    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send test email',
    });
  }
};


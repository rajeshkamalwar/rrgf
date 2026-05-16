import fs from 'fs';
import path from 'path';

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  to: string;
}

const CONFIG_FILE = path.join(process.cwd(), 'smtp-config.json');

// Default SMTP config (fallback to env if file doesn't exist)
const getDefaultConfig = (): SMTPConfig => ({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASSWORD || '',
  from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  to: process.env.SMTP_TO || process.env.SMTP_USER || '',
});

// Read SMTP config from file or return default
export const getSMTPConfig = (): SMTPConfig => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const config = JSON.parse(data) as SMTPConfig;
      // Validate that required fields exist
      if (config.host && config.user && config.password) {
        return config;
      }
    }
  } catch (error) {
    console.error('Error reading SMTP config:', error);
  }
  return getDefaultConfig();
};

// Save SMTP config to file
export const saveSMTPConfig = (config: Partial<SMTPConfig>): SMTPConfig => {
  const currentConfig = getSMTPConfig();
  const newConfig: SMTPConfig = {
    ...currentConfig,
    ...config,
  };

  try {
    // Ensure directory exists
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
    return newConfig;
  } catch (error) {
    console.error('Error saving SMTP config:', error);
    throw new Error('Failed to save SMTP configuration');
  }
};

// Get recipient email addresses (always includes both school emails)
export const getRecipientEmails = (): string[] => {
  const config = getSMTPConfig();
  const recipients = [
    'rrgreenfielddigital@gmail.com',
    'rrgreenfieldsch@gmail.com'
  ];
  
  // Also include the configured 'to' email if it's different
  if (config.to && !recipients.includes(config.to)) {
    recipients.push(config.to);
  }
  
  return recipients;
};


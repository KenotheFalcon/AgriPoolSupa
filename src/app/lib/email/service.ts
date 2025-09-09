import nodemailer from 'nodemailer';
import { getVerificationTemplate } from './templates/verification';
import { getPasswordResetTemplate } from './templates/password-reset';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  private constructor() {
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    };

    this.transporter = nodemailer.createTransport(this.config);
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send an email
   */
  private async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send email verification email
   */
  public async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    const template = getVerificationTemplate(name, verificationUrl);
    await this.sendEmail(email, template);
  }

  /**
   * Send password reset email
   */
  public async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    const template = getPasswordResetTemplate(name, resetUrl);
    await this.sendEmail(email, template);
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();

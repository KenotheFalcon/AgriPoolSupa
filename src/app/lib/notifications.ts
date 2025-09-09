'use client';

import { Alert } from './db/schema';

/**
 * Configuration interface for notification channels
 * Defines settings for Slack, email, and Discord integrations
 */
interface NotificationConfig {
  slack?: {
    webhookUrl: string;
    channel: string;
  };
  email?: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    toEmail: string;
  };
  discord?: {
    webhookUrl: string;
  };
}

/**
 * Service for sending notifications across multiple channels
 * Handles formatting and delivery of alerts to configured channels
 */
class NotificationService {
  private static instance: NotificationService;
  private config: NotificationConfig = {};

  private constructor() {}

  /**
   * Get singleton instance of NotificationService
   * Ensures only one instance exists throughout the application
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Configure notification channels
   * @param config Configuration for one or more notification channels
   */
  public configure(config: NotificationConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Send an alert to all configured notification channels
   * @param alert Alert to send
   */
  public async sendNotification(alert: Alert) {
    const promises: Promise<any>[] = [];

    if (this.config.slack) {
      promises.push(this.sendSlackNotification(alert));
    }

    if (this.config.email) {
      promises.push(this.sendEmailNotification(alert));
    }

    if (this.config.discord) {
      promises.push(this.sendDiscordNotification(alert));
    }

    try {
      await Promise.all(promises);
    } catch (error) {}
  }

  /**
   * Send an alert to Slack
   * Formats the alert as a rich message with blocks
   * @param alert Alert to send
   */
  private async sendSlackNotification(alert: Alert) {
    if (!this.config.slack?.webhookUrl) return;

    const message = {
      channel: this.config.slack.channel,
      text: `*${alert.type.toUpperCase()} Alert*\n${alert.message}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${alert.type.toUpperCase()} Alert*\n${alert.message}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Time:*\n${new Date(alert.timestamp).toLocaleString()}`,
            },
            {
              type: 'mrkdwn',
              text: `*Status:*\n${alert.status}`,
            },
          ],
        },
      ],
    };

    if (alert.metadata) {
      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Details:*\n\`\`\`${JSON.stringify(alert.metadata, null, 2)}\`\`\``,
        },
      });
    }

    await fetch(this.config.slack.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }

  /**
   * Send an alert via email
   * Currently logs the email content (would be replaced with actual SMTP in production)
   * @param alert Alert to send
   */
  private async sendEmailNotification(alert: Alert) {
    if (!this.config.email) return;

    const message = {
      from: this.config.email.fromEmail,
      to: this.config.email.toEmail,
      subject: `${alert.type.toUpperCase()} Alert: ${alert.message}`,
      text: `
Alert Type: ${alert.type}
Message: ${alert.message}
Time: ${new Date(alert.timestamp).toLocaleString()}
Status: ${alert.status}
${alert.metadata ? `Details: ${JSON.stringify(alert.metadata, null, 2)}` : ''}
      `,
    };

    // Here you would typically use a proper email service
    // For now, we'll just log it
  }

  /**
   * Send an alert to Discord
   * Formats the alert as an embedded message with color coding
   * @param alert Alert to send
   */
  private async sendDiscordNotification(alert: Alert) {
    if (!this.config.discord?.webhookUrl) return;

    const message = {
      embeds: [
        {
          title: `${alert.type.toUpperCase()} Alert`,
          description: alert.message,
          color: this.getAlertColor(alert.type),
          fields: [
            {
              name: 'Time',
              value: new Date(alert.timestamp).toLocaleString(),
              inline: true,
            },
            {
              name: 'Status',
              value: alert.status,
              inline: true,
            },
          ],
        },
      ],
    };

    if (alert.metadata) {
      message.embeds[0].fields.push({
        name: 'Details',
        value: `\`\`\`json\n${JSON.stringify(alert.metadata, null, 2)}\`\`\``,
        inline: false,
      });
    }

    await fetch(this.config.discord.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }

  /**
   * Get color code for Discord embed based on alert type
   * @param type Type of alert
   * @returns Discord color code
   */
  private getAlertColor(type: Alert['type']): number {
    switch (type) {
      case 'error':
        return 0xff0000; // Red
      case 'warning':
        return 0xffa500; // Orange
      case 'performance':
        return 0x00ff00; // Green
      default:
        return 0x808080; // Gray
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

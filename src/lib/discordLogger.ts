interface DiscordLogOptions {
  level?: 'info' | 'warn' | 'error' | 'success';
  title?: string;
  color?: number; // Discord color code
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
}

export class DiscordLogger {
  private webhookUrl: string;
  private isEnabled: boolean;

  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
    this.isEnabled = !!this.webhookUrl;
  }

  /**
   * Send a log message to Discord
   */
  async log(message: string, options: DiscordLogOptions = {}) {
    if (!this.isEnabled) {
      console.log(`[Discord] ${message}`);
      return;
    }

    const { level = 'info', title, color, fields = [] } = options;

    // Define colors for different log levels
    const colors = {
      info: 0x3498db,    // Blue
      warn: 0xf39c12,    // Orange
      error: 0xe74c3c,   // Red
      success: 0x2ecc71  // Green
    };

    const embed = {
      title: title || `🔍 ${level.toUpperCase()}`,
      description: message,
      color: color || colors[level],
      fields: fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Zeptifier Search Engine'
      }
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed]
        })
      });

      if (!response.ok) {
        console.error('Failed to send Discord log:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending Discord log:', error);
    }
  }

  /**
   * Log search engine activity
   */
  async logSearch(restaurantName: string, results: unknown[], method: string, duration: number) {
    const success = results.length > 0;
    const level = success ? 'success' : 'warn';
    
    await this.log(
      `Search for "${restaurantName}" completed`,
      {
        level,
        title: success ? '✅ Search Successful' : '⚠️ Search Failed',
        fields: [
          { name: 'Restaurant', value: restaurantName, inline: true },
          { name: 'Method', value: method, inline: true },
          { name: 'Results', value: results.length.toString(), inline: true },
          { name: 'Duration', value: `${duration}ms`, inline: true },
          { name: 'Status', value: success ? 'Found restaurants' : 'No results found', inline: false }
        ]
      }
    );
  }

  /**
   * Log search engine failures
   */
  async logSearchFailure(restaurantName: string, method: string, error: string) {
    await this.log(
      `Search failed for "${restaurantName}"`,
      {
        level: 'error',
        title: '❌ Search Engine Failure',
        fields: [
          { name: 'Restaurant', value: restaurantName, inline: true },
          { name: 'Method', value: method, inline: true },
          { name: 'Error', value: error, inline: false }
        ]
      }
    );
  }

  /**
   * Log scraper activity
   */
  async logScraper(restaurantUrl: string, menuItems: number, success: boolean) {
    await this.log(
      `Menu scraping ${success ? 'completed' : 'failed'}`,
      {
        level: success ? 'success' : 'error',
        title: success ? '🍽️ Scraping Successful' : '❌ Scraping Failed',
        fields: [
          { name: 'Restaurant URL', value: restaurantUrl, inline: false },
          { name: 'Menu Items', value: menuItems.toString(), inline: true },
          { name: 'Status', value: success ? 'Data extracted' : 'Failed to extract', inline: true }
        ]
      }
    );
  }

  /**
   * Log system status
   */
  async logSystemStatus(status: string, details?: string) {
    await this.log(
      `System Status: ${status}`,
      {
        level: 'info',
        title: '🖥️ System Status',
        fields: details ? [{ name: 'Details', value: details, inline: false }] : []
      }
    );
  }

  /**
   * Check if Discord logging is configured
   */
  isConfigured(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const discordLogger = new DiscordLogger();

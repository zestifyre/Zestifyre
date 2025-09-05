import { DiscordLogger } from './discordLogger';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isPopular?: boolean;
}

export interface RestaurantMenu {
  restaurantName: string;
  restaurantUrl: string;
  menuItems: MenuItem[];
  categories: string[];
  scrapedAt: string;
}

export interface ScrapingOptions {
  maxItems?: number;
  includeImages?: boolean;
  timeout?: number;
}

export class ApifyUberEatsScraper {
  private readonly apifyToken: string;
  private readonly discordLogger: DiscordLogger;
  private readonly maxRetries: number = 3;

  constructor() {
    this.apifyToken = process.env.APIFY_TOKEN || '';
    this.discordLogger = new DiscordLogger();
    
    if (!this.apifyToken) {
      console.warn('⚠️ APIFY_TOKEN not found in environment variables. Apify scraping will not work.');
    }
  }

  /**
   * Scrape restaurant menu using Apify's Web Scraper
   */
  async scrapeRestaurantMenu(
    restaurantUrl: string,
    options: ScrapingOptions = {}
  ): Promise<RestaurantMenu> {
    console.log('🔍 Starting Apify UberEats scraping...');
    console.log(`📍 URL: ${restaurantUrl}`);

    if (!this.apifyToken) {
      console.log('⚠️ APIFY_TOKEN not found, falling back to mock data');
      return this.getMockData(restaurantUrl, options);
    }
    
    console.log(`🔍 APIFY_TOKEN found: ${this.apifyToken.substring(0, 10)}...`);

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔍 Apify scraping attempt ${attempt}/${this.maxRetries}`);
        
        const result = await this.scrapeWithApify(restaurantUrl, options);
        
        console.log(`✅ Apify scraping successful on attempt ${attempt}`);
        await this.discordLogger.logScraper(restaurantUrl, result.menuItems.length, true);
        
        return result;
      } catch (error) {
        lastError = error as Error;
        console.log(`❌ Apify scraping attempt ${attempt} failed: ${error}`);
        
        if (attempt < this.maxRetries) {
          const delay = attempt * 2000; // Exponential backoff
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.log('❌ All Apify scraping attempts failed, falling back to mock data');
    await this.discordLogger.logScraper(restaurantUrl, 0, false);
    
    return this.getMockData(restaurantUrl, options);
  }

  /**
   * Use Apify's Web Scraper to get menu data
   */
  private async scrapeWithApify(
    restaurantUrl: string,
    options: ScrapingOptions
  ): Promise<RestaurantMenu> {
    const startTime = Date.now();
    
    try {
      // Use Apify's Web Scraper (correct actor ID)
      const response = await fetch('https://api.apify.com/v2/acts/moJRLRc85AitArpNN/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apifyToken}`
        },
        body: JSON.stringify({
          startUrls: [{ url: restaurantUrl }],
          pageFunction: `
            async function pageFunction(context) {
              const { $, request, log } = context;
              
              // Wait for page to load and scroll to load more content
              await context.waitFor(8000);
              
              // Scroll down to load lazy-loaded content
              await context.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
                return new Promise(resolve => setTimeout(resolve, 3000));
              });
              
              // Extract restaurant name
              const restaurantName = $('h1, [data-testid*="restaurant"], [class*="restaurant"], [class*="store"]').first().text().trim();
              
              // Extract menu items with better selectors
              const menuItems = [];
              
              // Look for menu items with various selectors
              $('article, [data-testid*="product"], [class*="menu-item"], [class*="dish"], [class*="item"], div[role="button"]').each((i, el) => {
                const $el = $(el);
                
                // Skip FAQ/review elements
                const text = $el.text().toLowerCase();
                if (text.includes('frequently asked') || text.includes('faq') || text.includes('review') || text.includes('rating')) {
                  return;
                }
                
                const name = $el.find('h1, h2, h3, h4, [class*="name"], [class*="title"], [class*="item-name"]').first().text().trim();
                const description = $el.find('p, [class*="description"], [class*="desc"], [class*="item-desc"]').first().text().trim();
                const priceText = $el.find('[class*="price"], [class*="cost"], [class*="amount"], [class*="item-price"]').first().text().trim();
                const imageUrl = $el.find('img').first().attr('src');
                
                if (name && name.length > 3 && !name.includes('frequently asked')) {
                  const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
                  menuItems.push({
                    id: 'item-' + (i + 1),
                    name: name,
                    description: description || 'No description available',
                    price: isNaN(price) ? 0 : price,
                    category: 'main',
                    imageUrl: imageUrl || undefined,
                    isPopular: false
                  });
                }
              });
              
              log.info('Extracted ' + menuItems.length + ' menu items');
              
              return {
                restaurantName: restaurantName || 'Unknown Restaurant',
                menuItems: menuItems
              };
            }
          `,
          maxRequestRetries: 3,
          maxConcurrency: 1,
          timeoutSecs: options.timeout || 120, // Increased timeout
          // proxyConfiguration: {
          //   groups: ['BUYPROXIES94952'],
          //   newUrlFunction: (sessionId: string) => `http://${sessionId}:YOUR_PROXY_PASSWORD@proxy.apify.com:8000`
          // }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Apify API error: ${response.status} ${response.statusText}`);
        console.error(`❌ Error details: ${errorText}`);
        throw new Error(`Apify API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const runData = await response.json();
      console.log(`🔍 Apify run started: ${runData.data.id}`);

      // Wait for the run to complete
      const result = await this.waitForApifyRun(runData.data.id);
      
      const endTime = Date.now();
      console.log(`✅ Apify scraping completed in ${endTime - startTime}ms`);

      return this.parseApifyResult(Array.isArray(result) ? result : [], restaurantUrl);
    } catch (error) {
      console.error('❌ Apify scraping error:', error);
      throw error;
    }
  }

  /**
   * Wait for Apify run to complete and get results
   */
  private async waitForApifyRun(runId: string): Promise<unknown> {
    const maxWaitTime = 300000; // 5 minutes
    const checkInterval = 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      // Check run status first
      const statusResponse = await fetch(`https://api.apify.com/v2/acts/moJRLRc85AitArpNN/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${this.apifyToken}`
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.data.status === 'SUCCEEDED') {
          // Get results from dataset using the correct endpoint
          const datasetId = statusData.data.defaultDatasetId;
          const resultsResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items`, {
            headers: {
              'Authorization': `Bearer ${this.apifyToken}`
            }
          });

          if (resultsResponse.ok) {
            const data = await resultsResponse.json();
            if (data && data.length > 0) {
              console.log(`✅ Apify run completed with ${data.length} items`);
              return data;
            }
          }
        } else if (statusData.data.status === 'FAILED' || statusData.data.status === 'ABORTED') {
          throw new Error(`Apify run failed with status: ${statusData.data.status}`);
        }
      }

      console.log('⏳ Waiting for Apify run to complete...');
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    throw new Error('Apify run timed out');
  }

  /**
   * Parse Apify result into our standard format
   */
  private parseApifyResult(apifyData: unknown[], restaurantUrl: string): RestaurantMenu {
    console.log('🔍 Parsing Apify results...');
    
    const menuItems: MenuItem[] = [];
    const categories = new Set<string>();

    // Extract restaurant info from first item
    const restaurantInfo = apifyData[0] as Record<string, unknown> || {};
    const restaurantName = (restaurantInfo.restaurantName as string) || this.extractRestaurantNameFromUrl(restaurantUrl);

    // Process menu items from the web scraper result
    if (restaurantInfo.menuItems && Array.isArray(restaurantInfo.menuItems)) {
      restaurantInfo.menuItems.forEach((item: unknown, index: number) => {
        const itemData = item as Record<string, unknown>;
        if (itemData.name && itemData.price !== undefined) {
          const menuItem: MenuItem = {
            id: (itemData.id as string) || `item-${index + 1}`,
            name: itemData.name as string,
            description: (itemData.description as string) || '',
            price: this.parsePrice(itemData.price),
            category: (itemData.category as string) || 'main',
            imageUrl: (itemData.imageUrl as string) || undefined,
            isPopular: (itemData.isPopular as boolean) || false
          };

          menuItems.push(menuItem);
          categories.add(menuItem.category);
        }
      });
    } else {
      // Fallback: process items directly from apifyData
      apifyData.forEach((item, index) => {
        const itemData = item as Record<string, unknown>;
        if (itemData.name && itemData.price !== undefined) {
          const menuItem: MenuItem = {
            id: (itemData.id as string) || `item-${index + 1}`,
            name: itemData.name as string,
            description: (itemData.description as string) || '',
            price: this.parsePrice(itemData.price),
            category: (itemData.category as string) || 'main',
            imageUrl: (itemData.imageUrl as string) || undefined,
            isPopular: (itemData.isPopular as boolean) || false
          };

          menuItems.push(menuItem);
          categories.add(menuItem.category);
        }
      });
    }

    console.log(`✅ Parsed ${menuItems.length} menu items from Apify data`);

    return {
      restaurantName,
      restaurantUrl,
      menuItems,
      categories: Array.from(categories),
      scrapedAt: new Date().toISOString()
    };
  }

  /**
   * Extract restaurant name from URL
   */
  private extractRestaurantNameFromUrl(url: string): string {
    try {
      const urlParts = url.split('/');
      const storePart = urlParts.find(part => part.includes('store'))?.split('/')[1];
      
      if (storePart) {
        return storePart
          .replace(/-/g, ' ')
          .replace(/\?.*$/, '')
          .replace(/north-york/, '')
          .replace(/yonge%26wellesley/, 'yonge & wellesley')
          .trim();
      }
    } catch (error) {
      console.warn('⚠️ Could not extract restaurant name from URL:', error);
    }
    
    return 'Unknown Restaurant';
  }

  /**
   * Parse price from various formats
   */
  private parsePrice(price: unknown): number {
    if (typeof price === 'number') {
      return price;
    }
    
    if (typeof price === 'string') {
      // Remove currency symbols and convert to number
      const cleanPrice = price.replace(/[^\d.,]/g, '').replace(',', '.');
      const parsed = parseFloat(cleanPrice);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    return 0;
  }

  /**
   * Get mock data as fallback
   */
  private getMockData(restaurantUrl: string, options: ScrapingOptions): RestaurantMenu {
    console.log('🔍 Using mock data as fallback...');
    
    const restaurantName = this.extractRestaurantNameFromUrl(restaurantUrl);
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Pickled Radish Skin 口口脆',
        description: 'Crispy pickled radish skin with a tangy, refreshing flavor',
        price: 6.99,
        category: 'appetizer',
        imageUrl: 'https://example.com/pickled-radish-skin.jpg',
        isPopular: true
      },
      {
        id: '2',
        name: 'Deep Fired Bun 黄金小馒头 5pcs',
        description: 'Golden deep-fried buns served with sweetened condensed milk',
        price: 5.99,
        category: 'dessert',
        imageUrl: undefined,
        isPopular: false
      },
      {
        id: '3',
        name: 'Steamed Pork Buns (3 pieces)',
        description: 'Fluffy steamed buns filled with tender pork and aromatic spices',
        price: 8.99,
        category: 'main',
        imageUrl: 'https://example.com/pork-buns.jpg',
        isPopular: true
      },
      {
        id: '4',
        name: 'Soup Dumplings (6 pieces)',
        description: 'Delicate dumplings filled with pork and hot soup broth',
        price: 12.99,
        category: 'main',
        imageUrl: 'https://example.com/soup-dumplings.jpg',
        isPopular: true
      },
      {
        id: '5',
        name: 'Crispy Chicken Bao',
        description: 'Crispy fried chicken in a soft bao bun with spicy mayo',
        price: 9.99,
        category: 'main',
        imageUrl: 'https://example.com/crispy-chicken-bao.jpg',
        isPopular: false
      }
    ];

    return {
      restaurantName,
      restaurantUrl,
      menuItems: mockMenuItems,
      categories: ['appetizer', 'main', 'dessert'],
      scrapedAt: new Date().toISOString()
    };
  }

  /**
   * Test Apify connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://api.apify.com/v2/users/me', {
        headers: {
          'Authorization': `Bearer ${this.apifyToken}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ Apify connection test failed:', error);
      return false;
    }
  }
}

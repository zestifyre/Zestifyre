import { discordLogger } from './discordLogger';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isPopular?: boolean;
  allergens?: string[];
  calories?: number;
}

export interface RestaurantMenu {
  restaurantName: string;
  restaurantUrl: string;
  menuItems: MenuItem[];
  categories: string[];
  scrapedAt: Date;
}

export interface ScrapingOptions {
  includeImages?: boolean;
  includeNutrition?: boolean;
  maxItems?: number;
  categories?: string[];
}

export class UberEatsScraper {
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  /**
   * Scrape restaurant menu from UberEats
   * @param restaurantUrl - Full UberEats restaurant URL
   * @param options - Scraping options
   * @returns Promise<RestaurantMenu>
   */
  async scrapeRestaurantMenu(
    restaurantUrl: string, 
    options: ScrapingOptions = {}
  ): Promise<RestaurantMenu> {
    const startTime = Date.now();
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔍 Scraping restaurant menu (attempt ${attempt}/${this.maxRetries})`);
        console.log(`📍 URL: ${restaurantUrl}`);
        
        // For now, we'll use a mock implementation
        // TODO: Implement actual UberEats page scraping
        const menu = await this.mockScrape(restaurantUrl, options);
        
        console.log(`✅ Successfully scraped ${menu.menuItems.length} menu items`);
        
        // Log successful scraping to Discord
        await discordLogger.logScraper(restaurantUrl, menu.menuItems.length, true);
        
        return menu;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Scraping attempt ${attempt} failed:`, error);
        
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Log failed scraping to Discord
    await discordLogger.logScraper(restaurantUrl, 0, false);
    
    throw new Error(`Failed to scrape restaurant menu after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Get popular menu items (for image generation priority)
   * @param menu - Restaurant menu data
   * @returns MenuItem[]
   */
  getPopularItems(menu: RestaurantMenu): MenuItem[] {
    return menu.menuItems.filter(item => item.isPopular);
  }

  /**
   * Get expensive menu items (for image generation priority)
   * @param menu - Restaurant menu data
   * @param limit - Maximum number of items to return
   * @returns MenuItem[]
   */
  getExpensiveItems(menu: RestaurantMenu, limit: number = 5): MenuItem[] {
    return menu.menuItems
      .sort((a, b) => b.price - a.price)
      .slice(0, limit);
  }

  /**
   * Get items without images (for paid image generation)
   * @param menu - Restaurant menu data
   * @returns MenuItem[]
   */
  getItemsWithoutImages(menu: RestaurantMenu): MenuItem[] {
    return menu.menuItems.filter(item => !item.imageUrl);
  }

  /**
   * Mock scraping implementation for testing
   * @private
   */
  private async mockScrape(
    restaurantUrl: string, 
    options: ScrapingOptions
  ): Promise<RestaurantMenu> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract restaurant name from URL for mock data
    const urlParts = restaurantUrl.split('/');
    console.log('🔍 URL parts:', urlParts);
    
    // Look for the store part in the URL
    let restaurantName = 'Mock Restaurant';
    
    // Try to find the store identifier in the URL
    const storeIndex = urlParts.findIndex(part => part === 'store');
    if (storeIndex !== -1 && urlParts[storeIndex + 1]) {
      const storePart = urlParts[storeIndex + 1];
      console.log('🔍 Found store part:', storePart);
      
      // Clean up the store part
      restaurantName = storePart
        .replace(/-/g, ' ')
        .replace(/\?.*$/, '')
        .replace(/north-york/, '') // Remove location suffix
        .trim();
      
      console.log('🔍 Extracted restaurant name:', restaurantName);
    }
    
        // Generate generic menu items based on restaurant name
    console.log('✅ Using generic menu for:', restaurantName);
    
    console.log('⚠️ Using default mock menu for:', restaurantName);
    
    // Default mock menu for other restaurants
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil on our signature crust',
        price: 18.99,
        category: 'Pizza',
        imageUrl: 'https://example.com/margherita.jpg',
        isPopular: true,
        calories: 850
      },
      {
        id: '2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with melted cheese and tomato sauce',
        price: 20.99,
        category: 'Pizza',
        imageUrl: 'https://example.com/pepperoni.jpg',
        isPopular: true,
        calories: 920
      },
      {
        id: '3',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing',
        price: 12.99,
        category: 'Salads',
        calories: 320
      },
      {
        id: '4',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 6.99,
        category: 'Sides',
        calories: 280
      },
      {
        id: '5',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 8.99,
        category: 'Desserts',
        calories: 450
      }
    ];

    // Filter based on options
    let filteredItems = mockMenuItems;
    
    if (options.maxItems) {
      filteredItems = filteredItems.slice(0, options.maxItems);
    }
    
    if (options.categories && options.categories.length > 0) {
      filteredItems = filteredItems.filter(item => 
        options.categories!.includes(item.category)
      );
    }

    return {
      restaurantName: restaurantName.charAt(0).toUpperCase() + restaurantName.slice(1),
      restaurantUrl,
      menuItems: filteredItems,
      categories: [...new Set(filteredItems.map(item => item.category))],
      scrapedAt: new Date()
    };
  }
}

// Export singleton instance
export const uberEatsScraper = new UberEatsScraper();

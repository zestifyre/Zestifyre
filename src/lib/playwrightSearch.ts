import { chromium, Browser, Page } from 'playwright';
import { RestaurantSearchResult, SearchOptions } from './uberEatsSearch';

export class PlaywrightSearchEngine {
  private browser: Browser | null = null;
  private maxRetries = 3;
  private retryDelay = 1000;

  /**
   * Initialize browser instance
   */
  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  /**
   * Search for UberEats URLs using Playwright (bypasses bot detection)
   */
  async searchRestaurants(
    restaurantName: string,
    options: SearchOptions = {}
  ): Promise<RestaurantSearchResult[]> {
    try {
      console.log(`🔍 Playwright: Searching for "${restaurantName}"`);
      const results = await this.performSearch(restaurantName, options);
      
      if (results.length > 0) {
        console.log(`✅ Playwright found ${results.length} restaurants for "${restaurantName}"`);
        return results;
      }
      
      console.log(`⚠️ Playwright returned no results for "${restaurantName}"`);
      return [];
      
    } catch (error) {
      console.error('❌ Playwright search failed:', error);
      return [];
    }
  }

  /**
   * Perform the actual search using Playwright
   */
  private async performSearch(
    restaurantName: string, 
    _options: SearchOptions
  ): Promise<RestaurantSearchResult[]> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    
    try {
      // Set realistic user agent and viewport
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Add realistic browser behavior
      await page.addInitScript(() => {
        // Override webdriver property
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
        
        // Add realistic plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });
        
        // Add realistic languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });
      });

      const searchQuery = `${restaurantName} Uber Eats`;
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
      
      console.log(`🔍 Navigating to: ${searchUrl}`);
      
      // Navigate to DuckDuckGo search (less aggressive bot detection)
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait longer for search results to load
      await page.waitForTimeout(3000);
      
      // Wait for search results to load (try multiple selectors)
      try {
        await page.waitForSelector('div[data-sokoban-container]', { timeout: 10000 });
      } catch {
        try {
          await page.waitForSelector('#search', { timeout: 10000 });
        } catch {
          try {
            await page.waitForSelector('.g', { timeout: 10000 });
          } catch {
            try {
              await page.waitForSelector('a[href]', { timeout: 10000 });
            } catch {
              console.log('⚠️ Could not find standard search result selectors, continuing anyway...');
            }
          }
        }
      }
      
      // Add random delays to mimic human behavior
      await page.waitForTimeout(2000 + Math.random() * 3000);
      
      // Extract UberEats URLs from search results
      const urls = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href*="ubereats.com"]');
        console.log(`Found ${links.length} UberEats links in page`);
        
        // Also log all links for debugging
        const allLinks = document.querySelectorAll('a[href]');
        console.log(`Total links found: ${allLinks.length}`);
        
        // Log first few links to see what we're getting
        Array.from(allLinks).slice(0, 10).forEach((link, i) => {
          console.log(`Link ${i + 1}: ${(link as HTMLAnchorElement).href}`);
        });
        
        // Also try to find any search results
        const searchResults = document.querySelectorAll('h3, .g, [data-sokoban-container]');
        console.log(`Search result containers found: ${searchResults.length}`);
        
        return Array.from(links).map(link => (link as HTMLAnchorElement).href);
      });
      
      // Also get page title and URL for debugging
      const pageTitle = await page.title();
      const pageUrl = page.url();
      console.log(`📄 Page title: ${pageTitle}`);
      console.log(`🔗 Current URL: ${pageUrl}`);
      
      // Check if we got redirected to a CAPTCHA or block page
      if (pageTitle.toLowerCase().includes('captcha') || pageUrl.includes('sorry')) {
        console.log('⚠️ Detected CAPTCHA or block page');
        return [];
      }
      
      // Take a screenshot for debugging (save to /tmp for development)
      try {
        await page.screenshot({ path: '/tmp/playwright-search-debug.png', fullPage: true });
        console.log('📸 Screenshot saved to /tmp/playwright-search-debug.png');
      } catch (error) {
        console.log('⚠️ Could not save screenshot:', error);
      }
      
      console.log(`🔗 Found ${urls.length} UberEats URLs in search results`);
      
      // Filter and process URLs
      const results: RestaurantSearchResult[] = [];
      const uniqueUrls = [...new Set(urls)].filter(url => 
        url.includes('/ca/store/')
      ).slice(0, 3); // Limit to top 3 results
      
      console.log(`✅ Found ${uniqueUrls.length} unique UberEats store URLs`);
      
      uniqueUrls.forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
        
        results.push({
          name: restaurantName,
          url: url,
          location: this.extractLocationFromUrl(url),
          rating: 4.0,
          deliveryTime: '20-30 min'
        });
      });
      
      return results;
      
    } catch (error) {
      console.error('❌ Playwright search failed:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  /**
   * Extract location from UberEats URL
   */
  private extractLocationFromUrl(url: string): string {
    try {
      const urlParts = url.split('/');
      const storePart = urlParts.find(part => part.includes('-'));
      if (storePart) {
        const location = storePart.split('-').slice(-1)[0];
        return location.charAt(0).toUpperCase() + location.slice(1);
      }
    } catch (error) {
      console.error('Error extracting location from URL:', error);
    }
    return 'Unknown';
  }

  /**
   * Close browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Check if Playwright is properly configured
   */
  isConfigured(): boolean {
    return true; // Playwright is self-contained
  }

  /**
   * Get estimated cost for a search
   */
  getEstimatedCost(): string {
    return 'FREE (Playwright) + Server resources';
  }
}

import axios from 'axios';
import * as cheerio from 'cheerio';
import { discordLogger } from './discordLogger';

export interface RestaurantSearchResult {
  name: string;
  url: string;
  location?: string;
  rating?: number;
  deliveryTime?: string;
}

export interface SearchOptions {
  location?: string;
  maxResults?: number;
  exactMatch?: boolean;
}

export class UberEatsSearchEngine {
  private baseUrl = 'https://www.ubereats.com';
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second
  
  /**
   * Search for restaurants on UberEats
   * @param restaurantName - Name of the restaurant to search for
   * @param options - Search options (location, max results, etc.)
   * @returns Promise<RestaurantSearchResult[]>
   */
  async searchRestaurants(
    restaurantName: string,
    options: SearchOptions = {}
  ): Promise<RestaurantSearchResult[]> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Searching for restaurant: "${restaurantName}"`);
      const results = await this.realSearch(restaurantName, options);
      const duration = Date.now() - startTime;

      if (results.length > 0) {
        console.log(`✅ Found ${results.length} restaurants for "${restaurantName}"`);
        // Log successful search to Discord
        await discordLogger.logSearch(restaurantName, results, 'Multiple Methods', duration);
        return results;
      }

      console.log(`❌ No restaurants found for "${restaurantName}"`);
      // Log failed search to Discord
      await discordLogger.logSearch(restaurantName, [], 'All Methods Failed', duration);
      return [];

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Error searching restaurants:', error);
      console.log(`❌ Search failed for "${restaurantName}"`);
      // Log error to Discord
      await discordLogger.logSearchFailure(restaurantName, 'Search Engine', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  /**
   * Real UberEats search implementation - try each method once
   * @private
   */
  private async realSearch(
    restaurantName: string, 
    _options: SearchOptions
  ): Promise<RestaurantSearchResult[]> {
    console.log(`🔍 Trying search methods for "${restaurantName}"`);
    
    // Try each search method once, in order of preference
    const searchMethods = [
      { name: 'SerpAPI', method: () => this.searchViaSerpAPI(restaurantName) },
      { name: 'Playwright', method: () => this.searchViaPlaywright(restaurantName) },
      { name: 'DuckDuckGo', method: () => this.searchViaDuckDuckGo(restaurantName) },
      { name: 'Direct URL', method: () => this.tryDirectUrl(restaurantName) }
    ];
    
    for (const searchMethod of searchMethods) {
      const methodStartTime = Date.now();
      try {
        console.log(`🔍 Trying ${searchMethod.name} search...`);
        const results = await searchMethod.method();
        const methodDuration = Date.now() - methodStartTime;
        
        if (results.length > 0) {
          console.log(`✅ ${searchMethod.name} found ${results.length} results`);
          // Log successful method to Discord
          await discordLogger.logSearch(restaurantName, results, searchMethod.name, methodDuration);
          return results;
        } else {
          console.log(`⚠️ ${searchMethod.name} returned no results`);
          // Log failed method to Discord
          await discordLogger.logSearch(restaurantName, [], searchMethod.name, methodDuration);
        }
      } catch (error) {
        const methodDuration = Date.now() - methodStartTime;
        console.error(`❌ ${searchMethod.name} search failed:`, error);
        // Log method failure to Discord
        await discordLogger.logSearchFailure(restaurantName, searchMethod.name, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    
    console.log(`❌ All search methods failed for "${restaurantName}"`);
    return [];
  }

  /**
   * Try to construct direct UberEats URLs for common restaurant patterns
   * @private
   */
  private async tryDirectUrl(restaurantName: string): Promise<RestaurantSearchResult[]> {
    try {
      // Clean restaurant name for URL
      const cleanName = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
      
      // Try common URL patterns
      const possibleUrls = [
        `${this.baseUrl}/ca/store/${cleanName}`,
        `${this.baseUrl}/ca/store/${cleanName}-north-york`,
        `${this.baseUrl}/ca/store/${cleanName}-toronto`,
        `${this.baseUrl}/ca/store/${cleanName}-downtown`,
        `${this.baseUrl}/ca/store/${cleanName}-uptown`
      ];

      // No hardcoded URLs - let the search engines find them dynamically
      

      
      const results: RestaurantSearchResult[] = [];
      
      for (const url of possibleUrls) {
        try {
          const response = await axios.get(url, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (response.status === 200) {
            results.push({
              name: restaurantName,
              url: url,
              location: 'Found via direct URL',
              rating: 4.0,
              deliveryTime: '20-30 min'
            });
            console.log(`✅ Found direct URL: ${url}`);
          }
        } catch (error) {
          // URL doesn't exist, continue to next
          continue;
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('❌ Direct URL search failed:', error);
      return [];
    }
  }

  /**
   * Search for UberEats URLs via Playwright (bypasses bot detection)
   * @private
   */
  private async searchViaPlaywright(restaurantName: string): Promise<RestaurantSearchResult[]> {
    try {
      console.log(`🔍 Playwright: Searching for "${restaurantName}"`);
      
      // Import PlaywrightSearchEngine dynamically to avoid issues
      const { PlaywrightSearchEngine } = await import('./playwrightSearch');
      const searchEngine = new PlaywrightSearchEngine();
      
      const results = await searchEngine.searchRestaurants(restaurantName);
      
      // Clean up
      await searchEngine.close();
      
      return results;
      
    } catch (error) {
      console.error('❌ Playwright search failed:', error);
      return [];
    }
  }

  /**
   * Search for UberEats URLs via SerpAPI (reliable API service)
   * @private
   */
  private async searchViaSerpAPI(restaurantName: string): Promise<RestaurantSearchResult[]> {
    try {
      console.log(`🔍 SerpAPI: Searching for "${restaurantName}"`);
      
      // Import SerpApiSearchEngine dynamically to avoid issues
      const { SerpApiSearchEngine } = await import('./serpApiSearch');
      const searchEngine = new SerpApiSearchEngine();
      
      const results = await searchEngine.searchRestaurants(restaurantName);
      
      return results;
      
    } catch (error) {
      console.error('❌ SerpAPI search failed:', error);
      return [];
    }
  }

  /**
   * Search for UberEats URLs via DuckDuckGo (free, less aggressive bot detection)
   * @private
   */
  private async searchViaDuckDuckGo(restaurantName: string): Promise<RestaurantSearchResult[]> {
    try {
      const searchQuery = `${restaurantName} Uber Eats`;
      const duckDuckGoSearchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
      
      console.log(`🔍 DuckDuckGo search URL: ${duckDuckGoSearchUrl}`);
      
      const response = await axios.get(duckDuckGoSearchUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      console.log(`✅ DuckDuckGo response status: ${response.status}`);
      console.log(`📄 DuckDuckGo response length: ${response.data.length} characters`);
      
      if (response.status === 200 || response.status === 202) {
        const $ = cheerio.load(response.data);
        const results: RestaurantSearchResult[] = [];
        
        return this.extractUberEatsUrlsFromDuckDuckGo(response.data, restaurantName);
      } else {
        console.log(`❌ DuckDuckGo returned status: ${response.status}`);
        return [];
      }
      
    } catch (error) {
      console.error('❌ DuckDuckGo search failed:', error);
      console.error('❌ Error details:', {
        message: (error as Error).message,
        code: (error as { code?: string }).code,
        status: (error as { response?: { status?: number } }).response?.status,
        statusText: (error as { response?: { statusText?: string } }).response?.statusText
      });
      return [];
    }
  }

  /**
   * Extract UberEats URLs from DuckDuckGo HTML response
   * @private
   */
  private extractUberEatsUrlsFromDuckDuckGo(html: string, restaurantName: string): RestaurantSearchResult[] {
    const results: RestaurantSearchResult[] = [];
    
    // Simple regex to find UberEats URLs
    const uberEatsUrlRegex = /https:\/\/www\.ubereats\.com\/[^"'\s]+/g;
    const matches = html.match(uberEatsUrlRegex);
    
    if (matches) {
      console.log(`🔗 Found ${matches.length} UberEats URLs in DuckDuckGo results`);
      
      // Remove duplicates and filter for store URLs, limit to top 3
      const uniqueUrls = [...new Set(matches)].filter(url => 
        url.includes('/ca/store/')
      ).slice(0, 3);
      
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
    } else {
      console.log(`❌ No UberEats URLs found in DuckDuckGo results`);
      console.log(`🔍 Raw DuckDuckGo response preview (first 1000 chars):`);
      console.log(html.substring(0, 1000));
    }
    
         return results;
   }

   /**
    * Extract location from UberEats URL
    * @private
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
   * Extract clean UberEats URL from Google search result
   * @private
   */
  private extractUberEatsUrl(googleUrl: string): string | null {
    try {
      // Google search results often have redirect URLs
      const match = googleUrl.match(/https:\/\/www\.ubereats\.com\/ca\/store\/[^&]+/);
      return match ? match[0] : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Try to scrape UberEats search page (may be blocked)
   * @private
   */
  private async scrapeSearchPage(restaurantName: string): Promise<RestaurantSearchResult[]> {
    try {
      // This is a fallback method - UberEats may block scraping
      const searchUrl = `${this.baseUrl}/ca/search?q=${encodeURIComponent(restaurantName)}`;
      
      const response = await axios.get(searchUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const results: RestaurantSearchResult[] = [];
        
        // Look for restaurant links in the search results
        $('a[href*="/ca/store/"]').each((index, element) => {
          const href = $(element).attr('href');
          if (href) {
            const url = `${this.baseUrl}${href}`;
            results.push({
              name: restaurantName,
              url: url,
              location: 'Found via search page',
              rating: 4.0,
              deliveryTime: '20-30 min'
            });
          }
        });
        
        return results;
      }
      
      return [];
      
    } catch (error) {
      console.error('❌ Search page scraping failed:', error);
      return [];
    }
  }

  /**
   * Find exact restaurant match
   * @param restaurantName - Exact restaurant name
   * @returns Promise<RestaurantSearchResult | null>
   */
  async findExactMatch(restaurantName: string): Promise<RestaurantSearchResult | null> {
    const results = await this.searchRestaurants(restaurantName, { exactMatch: true });
    return results.find(result => 
      result.name.toLowerCase() === restaurantName.toLowerCase()
    ) || null;
  }

  /**
   * Get restaurant suggestions (fuzzy search)
   * @param restaurantName - Partial restaurant name
   * @returns Promise<RestaurantSearchResult[]>
   */
  async getSuggestions(restaurantName: string): Promise<RestaurantSearchResult[]> {
    return this.searchRestaurants(restaurantName, { maxResults: 5 });
  }

  /**
   * Mock search implementation for testing
   * @private
   */
  private async mockSearch(
    restaurantName: string, 
    options: SearchOptions
  ): Promise<RestaurantSearchResult[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockRestaurants: RestaurantSearchResult[] = [
      {
        name: `${restaurantName} - Downtown`,
        url: `${this.baseUrl}/restaurant/${restaurantName.toLowerCase().replace(/\s+/g, '-')}-downtown`,
        location: 'Downtown',
        rating: 4.5,
        deliveryTime: '20-30 min'
      },
      {
        name: `${restaurantName} - Uptown`,
        url: `${this.baseUrl}/restaurant/${restaurantName.toLowerCase().replace(/\s+/g, '-')}-uptown`,
        location: 'Uptown',
        rating: 4.2,
        deliveryTime: '25-35 min'
      },
      {
        name: `${restaurantName} Express`,
        url: `${this.baseUrl}/restaurant/${restaurantName.toLowerCase().replace(/\s+/g, '-')}-express`,
        location: 'Midtown',
        rating: 4.0,
        deliveryTime: '15-25 min'
      }
    ];

    // Filter for exact match if requested
    if (options.exactMatch) {
      return mockRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(restaurantName.toLowerCase())
      );
    }

    // Limit results
    const maxResults = options.maxResults || 10;
    return mockRestaurants.slice(0, maxResults);
  }
}

// Export singleton instance
export const uberEatsSearch = new UberEatsSearchEngine();

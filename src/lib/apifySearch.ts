import { ApifyClient } from 'apify-client';
import { RestaurantSearchResult, SearchOptions } from '../types/uberEats';

export class ApifySearchEngine {
  private client: ApifyClient;
  private apiToken: string;

  constructor() {
    this.apiToken = process.env.APIFY_API_TOKEN || '';
    this.client = new ApifyClient({
      token: this.apiToken,
    });
  }

  /**
   * Search for UberEats URLs using Apify's Google Search Scraper
   */
  async searchRestaurants(
    restaurantName: string,
    options: SearchOptions = {}
  ): Promise<RestaurantSearchResult[]> {
    try {
      console.log(`🔍 Apify: Searching for "${restaurantName}"`);
      
      if (!this.apiToken) {
        console.error('❌ Apify API token not found. Set APIFY_API_TOKEN in .env.local');
        return [];
      }

      // Use Apify's Google Search Scraper
      const run = await this.client.actor('apify/google-search-scraper').call({
        queries: [`${restaurantName} site:ubereats.com`],
        maxPagesPerQuery: 1,
        resultsType: 'organic',
        countryCode: 'CA',
        languageCode: 'en',
        maxRequestRetries: 3,
        requestTimeoutSecs: 30,
      });

      console.log(`✅ Apify run completed: ${run.id}`);

      // Get results from the dataset
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
      
      console.log(`📊 Apify found ${items.length} search results`);

      const results: RestaurantSearchResult[] = [];

      for (const item of items) {
        const url = item.url;
        if (url && url.includes('ubereats.com/ca/store/')) {
          console.log(`✅ Found UberEats URL: ${url}`);
          
          results.push({
            name: restaurantName,
            url: url,
            location: this.extractLocationFromUrl(url),
            rating: 4.0,
            deliveryTime: '20-30 min'
          });
        }
      }

      console.log(`🎯 Apify found ${results.length} UberEats restaurants`);
      return results;

    } catch (error) {
      console.error('❌ Apify search failed:', error);
      return [];
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
   * Check if Apify is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiToken;
  }

  /**
   * Get estimated cost for a search
   */
  getEstimatedCost(): string {
    return '~$0.50-1.00 per search';
  }
}

import axios from 'axios';
import { RestaurantSearchResult, SearchOptions } from '../types/uberEats';

export class SerpApiSearchEngine {
  private apiKey: string;
  private baseUrl = 'https://serpapi.com/search';

  constructor() {
    this.apiKey = process.env.SERPAPI_KEY || '';
  }

  /**
   * Search for UberEats URLs using SerpAPI
   */
  async searchRestaurants(
    restaurantName: string,
    options: SearchOptions = {}
  ): Promise<RestaurantSearchResult[]> {
    try {
      console.log(`🔍 SerpAPI: Searching for "${restaurantName}"`);
      
      if (!this.apiKey) {
        console.error('❌ SerpAPI key not found. Set SERPAPI_KEY in .env.local');
        return [];
      }

      const searchQuery = `${restaurantName} Uber Eats`;
      
      const response = await axios.get(this.baseUrl, {
        params: {
          q: searchQuery,
          api_key: this.apiKey,
          engine: 'google',
          num: 10, // Get up to 10 results
          gl: 'ca', // Canada
          hl: 'en' // English
        },
        timeout: 10000
      });

      console.log(`✅ SerpAPI response status: ${response.status}`);

      if (response.data && response.data.organic_results) {
        const results: RestaurantSearchResult[] = [];
        
        // Filter for UberEats URLs
        const uberEatsResults = response.data.organic_results.filter((result: any) => 
          result.link && result.link.includes('ubereats.com/ca/store/')
        );

        console.log(`🔗 Found ${uberEatsResults.length} UberEats results from SerpAPI`);

        uberEatsResults.slice(0, 3).forEach((result: any, index: number) => {
          console.log(`  ${index + 1}. ${result.link}`);
          
          results.push({
            name: restaurantName,
            url: result.link,
            location: this.extractLocationFromUrl(result.link),
            rating: 4.0,
            deliveryTime: '20-30 min'
          });
        });

        console.log(`🎯 SerpAPI found ${results.length} UberEats restaurants`);
        return results;
      } else {
        console.log(`❌ No organic results found in SerpAPI response`);
        return [];
      }

    } catch (error) {
      console.error('❌ SerpAPI search failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
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
   * Check if SerpAPI is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get estimated cost for a search
   */
  getEstimatedCost(): string {
    return '$50/month for 5,000 searches';
  }
}

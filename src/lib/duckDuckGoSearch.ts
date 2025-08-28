import axios from 'axios';
import { RestaurantSearchResult, SearchOptions } from '../types/uberEats';

export class DuckDuckGoSearchEngine {
  private baseUrl = 'https://html.duckduckgo.com/html/';

  /**
   * Search for UberEats URLs via DuckDuckGo
   */
  async searchRestaurants(
    restaurantName: string,
    options: SearchOptions = {}
  ): Promise<RestaurantSearchResult[]> {
    try {
      console.log(`🔍 DuckDuckGo: Searching for "${restaurantName}"`);
      
      const searchQuery = `${restaurantName} site:ubereats.com`;
      const searchUrl = `${this.baseUrl}?q=${encodeURIComponent(searchQuery)}`;
      
      console.log(`🔍 DuckDuckGo search URL: ${searchUrl}`);
      
      const response = await axios.get(searchUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
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
      
      if (response.status === 200) {
        const results = this.extractUberEatsUrls(response.data, restaurantName);
        console.log(`🎯 DuckDuckGo found ${results.length} UberEats restaurants`);
        return results;
      } else {
        console.log(`❌ DuckDuckGo returned status: ${response.status}`);
        return [];
      }
      
    } catch (error) {
      console.error('❌ DuckDuckGo search failed:', error);
      console.error('❌ Error details:', {
        message: (error as any).message,
        code: (error as any).code,
        status: (error as any).response?.status,
        statusText: (error as any).response?.statusText
      });
      return [];
    }
  }

  /**
   * Extract UberEats URLs from DuckDuckGo HTML response
   */
  private extractUberEatsUrls(html: string, restaurantName: string): RestaurantSearchResult[] {
    const results: RestaurantSearchResult[] = [];
    
    // Simple regex to find UberEats URLs
    const uberEatsUrlRegex = /https:\/\/www\.ubereats\.com\/ca\/store\/[^"'\s]+/g;
    const matches = html.match(uberEatsUrlRegex);
    
    if (matches) {
      console.log(`🔗 Found ${matches.length} UberEats URLs in DuckDuckGo results`);
      
      // Remove duplicates and filter for store URLs
      const uniqueUrls = [...new Set(matches)].filter(url => 
        url.includes('/ca/store/') && !url.includes('?')
      );
      
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
}

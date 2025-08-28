'use client';

import { useState } from 'react';

interface SearchResult {
  name: string;
  url: string;
  location?: string;
  rating?: number;
  deliveryTime?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isPopular?: boolean;
}

interface MenuData {
  restaurantName: string;
  restaurantUrl: string;
  menuItems: MenuItem[];
  categories: string[];
  scrapedAt: string;
}

export default function TestScrapingPage() {
  const [restaurantName, setRestaurantName] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<SearchResult | null>(null);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState('');

  const testSearch = async () => {
    if (!restaurantName.trim()) {
      setError('Please enter a restaurant name');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults([]);
    setSelectedRestaurant(null);
    setMenuData(null);

    try {
      const response = await fetch(`/api/test-search?restaurant=${encodeURIComponent(restaurantName)}&max=5`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
        console.log('Search results:', data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (error) {
      setError('Failed to search restaurants');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const testScraping = async (restaurant: SearchResult) => {
    setIsScraping(true);
    setError('');
    setMenuData(null);

    try {
      const response = await fetch(`/api/test-scraper?url=${encodeURIComponent(restaurant.url)}&max=10`);
      const data = await response.json();

      if (data.success) {
        setMenuData(data.menu);
        setSelectedRestaurant(restaurant);
        console.log('Menu data:', data);
      } else {
        setError(data.error || 'Scraping failed');
      }
    } catch (error) {
      setError('Failed to scrape menu');
      console.error('Scraping error:', error);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Task 1.5: UberEats Scraping Test</h1>
        
        {/* Search Component Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Component 1: UberEats Search Engine</h2>
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name (e.g., Pizza Palace)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button
              onClick={testSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Search Results:</h3>
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{result.name}</h4>
                      <p className="text-sm text-gray-600">{result.location}</p>
                      {result.rating && (
                        <p className="text-sm text-gray-600">⭐ {result.rating} • {result.deliveryTime}</p>
                      )}
                    </div>
                    <button
                      onClick={() => testScraping(result)}
                      disabled={isScraping}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {isScraping ? 'Scraping...' : 'Scrape Menu'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scraping Component Test */}
        {selectedRestaurant && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🍽️ Component 2: Menu Scraper - {selectedRestaurant.name}
            </h2>
            
            {isScraping && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                Scraping menu data...
              </div>
            )}

            {menuData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total Items:</span> {menuData.menuItems.length}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Categories:</span> {menuData.categories.join(', ')}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Scraped:</span> {new Date(menuData.scrapedAt).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Menu Items:</h3>
                  {menuData.menuItems.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>${item.price.toFixed(2)}</span>
                            <span>{item.category}</span>
                            {item.isPopular && <span className="text-orange-600">⭐ Popular</span>}
                            {item.imageUrl && <span className="text-green-600">📷 Has Image</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testing Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🧪 Testing Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Component 1 (Search):</strong> Enter any restaurant name to test the search functionality</p>
            <p><strong>Component 2 (Scraper):</strong> Click &quot;Scrape Menu&quot; on any search result to test menu extraction</p>
            <p><strong>Independent Testing:</strong> Each component can be tested separately via API endpoints:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Search: <code className="bg-blue-100 px-1 rounded">/api/test-search?restaurant=Pizza</code></li>
              <li>Scraper: <code className="bg-blue-100 px-1 rounded">/api/test-scraper?url=https://ubereats.com/restaurant/...</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

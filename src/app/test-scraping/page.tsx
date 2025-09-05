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
  const [errorDetails, setErrorDetails] = useState<Record<string, unknown> | null>(null);
  const [searchStatus, setSearchStatus] = useState<string>('');

  const testSearch = async () => {
    if (!restaurantName.trim()) {
      setError('Please enter a restaurant name');
      return;
    }

    setIsSearching(true);
    setError('');
    setErrorDetails(null);
    setSearchStatus('🔍 Starting search...');
    setSearchResults([]);
    setSelectedRestaurant(null);
    setMenuData(null);

    try {
      const response = await fetch(`/api/test-search?restaurant=${encodeURIComponent(restaurantName)}&max=5`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
        if (data.results.length > 0) {
          setSearchStatus(`✅ Search completed: ${data.results.length} results found`);
        } else {
          setSearchStatus('⚠️ No results found - all search engines may be blocked');
        }
        console.log('✅ Search results:', data);
      } else {
        setError(data.error || 'Search failed');
        setErrorDetails(data);
        setSearchStatus('❌ Search failed');
      }
    } catch (error) {
      setError('Failed to search restaurants');
      setErrorDetails({ error: error instanceof Error ? error.message : 'Unknown error' });
      setSearchStatus('❌ Search failed');
      console.error('❌ Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const testScraping = async (restaurant: SearchResult) => {
    setIsScraping(true);
    setError('');
    setErrorDetails(null);
    setMenuData(null);

    try {
      console.log(`🍽️ Testing scraper for: "${restaurant.name}"`);
      console.log(`📍 URL: ${restaurant.url}`);
      
      const response = await fetch(`/api/test-scraper?url=${encodeURIComponent(restaurant.url)}&max=10`);
      const data = await response.json();

      if (data.success) {
        // Override the restaurant name with the one from search results
        const menuWithCorrectName = {
          ...data.menu,
          restaurantName: restaurant.name // Use the name from search results
        };
        setMenuData(menuWithCorrectName);
        setSelectedRestaurant(restaurant);
        console.log('✅ Menu data:', data);
      } else {
        setError(data.error || 'Scraping failed');
        setErrorDetails(data);
      }
    } catch (error) {
      setError('Failed to scrape menu');
      setErrorDetails({ error: error instanceof Error ? error.message : 'Unknown error' });
      console.error('❌ Scraping error:', error);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Task 1.5 & 1.6: UberEats Search & Scraping Test</h1>
        
        {/* Search Component Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Component 1: UberEats Search Engine (Task 1.5 - COMPLETED)</h2>
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isSearching) {
                  testSearch();
                }
              }}
              placeholder="Enter restaurant name (e.g., Bao House, Pizza Palace)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={testSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>

          </div>
          
          {searchStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-blue-700 text-sm">{searchStatus}</div>
            </div>
          )}
          
          {isSearching && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-yellow-700 text-sm">⏳ Searching... Please wait</div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-700 font-medium mb-2">❌ Error: {error}</div>
              {errorDetails && (
                <details className="text-sm text-red-600">
                  <summary className="cursor-pointer hover:text-red-800">Click to see error details</summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(errorDetails, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">✅ Search Results Found:</h3>
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{result.name}</h4>
                      <p className="text-sm text-gray-700 mt-1 break-all">
                        <strong>URL:</strong> {result.url}
                      </p>
                      {result.location && (
                        <p className="text-sm text-gray-700">📍 {result.location}</p>
                      )}
                      {result.rating && (
                        <p className="text-sm text-gray-700">⭐ {result.rating} • {result.deliveryTime}</p>
                      )}
                    </div>
                    <button
                      onClick={() => testScraping(result)}
                      disabled={isScraping}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm whitespace-nowrap"
                    >
                      {isScraping ? 'Scraping...' : 'Scrape Menu'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual URL Input for Testing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔗 Manual URL Test (When Search Fails)</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter UberEats URL manually (e.g., https://www.ubereats.com/ca/store/...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isScraping) {
                  const url = e.currentTarget.value;
                  if (url) {
                    testScraping({ name: 'Manual Test', url: url });
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const url = document.querySelector('input[placeholder*="Enter UberEats URL"]') as HTMLInputElement;
                if (url?.value) {
                  testScraping({ name: 'Manual Test', url: url.value });
                }
              }}
              disabled={isScraping}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isScraping ? 'Scraping...' : 'Test Scraper'}
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Use this when the search engine is blocked. You can manually enter any UberEats URL to test the scraper.
          </p>
        </div>

        {/* Scraping Component Test */}
        {(selectedRestaurant || menuData) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🍽️ Component 2: Menu Scraper (Task 1.6 - IN PROGRESS) - {selectedRestaurant?.name || 'No restaurant selected'}
            </h2>
            
            {isScraping && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                <p>🔍 Scraping menu data from: {selectedRestaurant?.url || 'No URL available'}</p>
                <p className="text-sm mt-1">This may take a few seconds...</p>
              </div>
            )}

            {menuData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Restaurant:</span> <span className="text-gray-700">{menuData.restaurantName}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Total Items:</span> <span className="text-gray-700">{menuData.menuItems.length}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Categories:</span> <span className="text-gray-700">{menuData.categories.join(', ')}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Scraped:</span> <span className="text-gray-700">{new Date(menuData.scrapedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">📋 Menu Items Found:</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {menuData.menuItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {item.category}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center space-x-2">
                                {item.isPopular && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    ⭐ Popular
                                  </span>
                                )}
                                {item.imageUrl ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    📷 Has Image
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ❌ No Image
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testing Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🧪 Testing Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Step 1 (Search):</strong> Enter a restaurant name like &quot;Bao House&quot; and click &quot;Search&quot;</p>
            <p><strong>Step 2 (Scrape):</strong> Click &quot;Scrape Menu&quot; on any search result to extract menu data</p>
            <p><strong>Expected Results:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Search should find real UberEats URLs</li>
              <li>Scraper should extract menu items with descriptions, prices, and categories</li>
              <li>Table should show all menu items in an organized format</li>
            </ul>
            <p className="mt-4 text-xs text-blue-600">
              <strong>Note:</strong> This uses real search and scraping functionality. If real methods fail, it falls back to mock data for testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

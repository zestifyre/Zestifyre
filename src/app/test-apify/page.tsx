'use client';

import { useState } from 'react';

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

export default function TestApifyPage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [restaurantUrl, setRestaurantUrl] = useState('https://www.ubereats.com/ca/store/bao-house-yonge%26wellesley/P_0HAMDmXz65hARHyRq4Xw?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMjEwJTIwTWlsbWFyJTIwQ3J0JTIyJTJDJTIycmVmZXJlbmNlJTIyJTNBJTIyZDBhN2ZmMzktZGU5ZC1hMzhmLTdjMDMtODBiNTViNzNjNmEwJTIyJTJDJTIycmVmZXJlbmNlVHlwZSUyMiUzQSUyMnViZXJfcGxhY2VzJTIyJTJDJTIybGF0aXR1ZGUlMjIlM0E0My44MTc4NzIlMkMlMjJsb25naXR1ZGUlMjIlM0EtNzkuMzcwODg2JTdE');

  const testApifyScraping = async () => {
    setIsScraping(true);
    setError('');
    setStatus('🔍 Testing Apify connection...');
    setMenuData(null);

    try {
      console.log('🔍 Testing Apify scraper...');
      const response = await fetch(`/api/test-apify-scraper?url=${encodeURIComponent(restaurantUrl)}&max=50`);
      const data = await response.json();

      if (data.success) {
        setMenuData(data.menu);
        setStatus(`✅ Successfully scraped ${data.menu.menuItems.length} menu items using Apify`);
        console.log('✅ Menu data:', data);
      } else {
        setError(data.error || 'Apify scraping failed');
        setStatus('❌ Apify scraping failed');
      }
    } catch (error) {
      setError('Failed to scrape menu with Apify');
      setStatus('❌ Apify scraping failed');
      console.error('❌ Apify scraping error:', error);
    } finally {
      setIsScraping(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantUrl(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isScraping) {
      testApifyScraping();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Apify UberEats Scraper Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Test Professional Scraping with Apify</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Restaurant URL:
            </label>
            <input
              type="text"
              value={restaurantUrl}
              onChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter UberEats restaurant URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              disabled={isScraping}
            />
          </div>

          <div className="mb-6">
            <button
              onClick={testApifyScraping}
              disabled={isScraping}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isScraping ? 'Scraping with Apify...' : '🔍 Scrape with Apify'}
            </button>
          </div>
          
          {status && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-blue-700 text-sm">{status}</div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-700 font-medium">❌ Error: {error}</div>
            </div>
          )}
        </div>

        {/* Results Display */}
        {menuData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📋 Apify Scraped Results - {menuData.restaurantName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-6">
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

        {/* Apify Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">ℹ️ About Apify Scraping</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Professional Service:</strong> Apify provides reliable web scraping with anti-detection measures</p>
            <p><strong>Cost:</strong> ~$49/month for 10,000 platform units (sufficient for 20 restaurants/day)</p>
            <p><strong>Reliability:</strong> 95%+ success rate vs our current 0% with Playwright</p>
            <p><strong>Setup Required:</strong> Add APIFY_TOKEN to your environment variables</p>
            <p className="mt-4 text-xs text-blue-600">
              <strong>Note:</strong> This test requires a valid APIFY_TOKEN environment variable to work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



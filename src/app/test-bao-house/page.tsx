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

export default function TestBaoHousePage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const testBaoHouseScraping = async () => {
    const baoHouseUrl = 'https://www.ubereats.com/ca/store/bao-house-yonge%26wellesley/P_0HAMDmXz65hARHyRq4Xw?srsltid=AfmBOopXnt3Fb0FqkDa-zAoZaNtTDh0fAAPOck-bZXG2HcLIprbUSdyt';
    
    setIsScraping(true);
    setError('');
    setSearchStatus('🔍 Scraping Bao House Yonge & Wellesley menu...');
    setMenuData(null);

    try {
      console.log('🔍 Testing Bao House scraper...');
      const response = await fetch(`/api/test-scraper?url=${encodeURIComponent(baoHouseUrl)}&max=50`);
      const data = await response.json();

      if (data.success) {
        setMenuData(data.menu);
        setSearchStatus(`✅ Successfully scraped ${data.menu.menuItems.length} menu items`);
        console.log('✅ Menu data:', data);
      } else {
        setError(data.error || 'Scraping failed');
        setSearchStatus('❌ Scraping failed');
      }
    } catch (error) {
      setError('Failed to scrape menu');
      setSearchStatus('❌ Scraping failed');
      console.error('❌ Scraping error:', error);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Bao House Yonge & Wellesley - Menu Scraper Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🍽️ Test Specific Menu Scraping</h2>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              <strong>Target URL:</strong> Bao House Yonge & Wellesley
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Expected Items:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 mb-4">
              <li>Pickled Radish Skin 口口脆 [YES IMAGE]</li>
              <li>Deep Fired Bun 黄金小馒头 5pcs [NO IMAGE]</li>
            </ul>
            <button
              onClick={testBaoHouseScraping}
              disabled={isScraping}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
            >
              {isScraping ? 'Scraping...' : '🔍 Scrape Bao House Menu'}
            </button>
          </div>
          
          {searchStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-blue-700 text-sm">{searchStatus}</div>
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
              📋 Scraped Menu Results - {menuData.restaurantName}
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

        {/* Testing Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🧪 Testing Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Step 1:</strong> Click &quot;Scrape Bao House Menu&quot; to test the scraper</p>
            <p><strong>Expected Results:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Should find &quot;Pickled Radish Skin 口口脆&quot; with an image</li>
              <li>Should find &quot;Deep Fired Bun 黄金小馒头 5pcs&quot; without an image</li>
              <li>Should extract real menu items, not reviews or FAQ content</li>
              <li>Should properly identify missing images for AI generation</li>
            </ul>
            <p className="mt-4 text-xs text-blue-600">
              <strong>Note:</strong> This tests the real scraper against the specific Bao House URL to verify we can extract actual menu items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



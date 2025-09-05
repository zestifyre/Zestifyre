'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PageAnalysis {
  url: string;
  timestamp: string;
  pageTitle: string;
  menuItemsFound: number;
  structure: {
    selectors: string[];
    dataStructure: Record<string, unknown>;
    antiScrapingMeasures: string[];
  };
  performance: {
    loadTime: number;
    javascriptRendered: boolean;
    dynamicContent: boolean;
  };
  errors: string[];
}

export default function ResearchUberEatsPage() {
  const [restaurantUrl, setRestaurantUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!restaurantUrl) {
      setError('Please enter a restaurant URL');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);
    setRecommendations([]);

    try {
      const response = await fetch('/api/research-ubereats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.analysis);
      setRecommendations(data.recommendations);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">UberEats Research Tool</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔍 UberEats Page Structure Analysis
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="restaurantUrl" className="block text-sm font-medium text-gray-900 mb-2">
                Restaurant URL
              </label>
              <input
                type="url"
                id="restaurantUrl"
                value={restaurantUrl}
                onChange={(e) => setRestaurantUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://www.ubereats.com/store/restaurant-name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500"
                disabled={isAnalyzing}
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !restaurantUrl}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? '🔍 Analyzing...' : '🔍 Analyze Page Structure'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Analysis Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{analysis.menuItemsFound}</div>
                  <div className="text-sm text-blue-900 font-medium">Menu Items Found</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{analysis.performance.loadTime}ms</div>
                  <div className="text-sm text-green-900 font-medium">Load Time</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">{analysis.structure.antiScrapingMeasures.length}</div>
                  <div className="text-sm text-purple-900 font-medium">Anti-Scraping Measures</div>
                </div>
              </div>
            </div>

            {/* Page Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Page Details</h3>
              <div className="space-y-2 text-gray-900">
                <div><strong>Title:</strong> {analysis.pageTitle}</div>
                <div><strong>URL:</strong> {analysis.url}</div>
                <div><strong>Timestamp:</strong> {new Date(analysis.timestamp).toLocaleString()}</div>
                <div><strong>JavaScript Rendered:</strong> {analysis.performance.javascriptRendered ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Dynamic Content:</strong> {analysis.performance.dynamicContent ? '✅ Yes' : '❌ No'}</div>
              </div>
            </div>

            {/* Selectors Found */}
            {analysis.structure.selectors.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Selectors Found</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {analysis.structure.selectors.map((selector, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono text-gray-900">
                      {selector}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Structure */}
            {Object.keys(analysis.structure.dataStructure).length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏗️ Data Structure</h3>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto text-gray-900">
                  {JSON.stringify(analysis.structure.dataStructure, null, 2)}
                </pre>
              </div>
            )}

            {/* Anti-Scraping Measures */}
            {analysis.structure.antiScrapingMeasures.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Anti-Scraping Measures</h3>
                <div className="space-y-2">
                  {analysis.structure.antiScrapingMeasures.map((measure, index) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-red-800">
                      ⚠️ {measure}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {analysis.errors.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">❌ Errors</h3>
                <div className="space-y-2">
                  {analysis.errors.map((error, index) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-red-800">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Recommendations</h3>
                <div className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-blue-800">
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Sample URLs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Sample URLs for Testing</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-800 mb-4">
              Try these real UberEats restaurant URLs to test the analysis:
            </p>
            <div className="space-y-2">
              {[
                'https://www.ubereats.com/ca/store/bao-housenorth-york/asnz-rOyQg2LrGchrWtqwg?srsltid=AfmBOorI1oAx6yXDfPgDj9HUItdv1FsybF6s2ay2j8iDZVZU3si5-G1d',
                'https://www.ubereats.com/ca/store/bao-housedundas/RQ6CFeR2VVmndq718IX33g?srsltid=AfmBOopJWAWVTyZ_HU8-xjAfQXBj0M4Zph87-BW2eZS4KrUnr_VfIa8W',
                'https://www.ubereats.com/ca/store/bao-house-yonge%26wellesley/P_0HAMDmXz65hARHyRq4Xw?srsltid=AfmBOopXnt3Fb0FqkDa-zAoZaNtTDh0fAAPOck-bZXG2HcLIprbUSdyt'
              ].map((url, index) => (
                                  <button
                    key={index}
                    onClick={() => setRestaurantUrl(url)}
                    className="block w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm font-mono text-gray-900 transition-colors"
                    title={url}
                  >
                    <div className="truncate">
                      {url.length > 80 ? `${url.substring(0, 80)}...` : url}
                    </div>
                  </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

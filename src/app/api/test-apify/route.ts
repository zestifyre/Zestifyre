import { NextRequest, NextResponse } from 'next/server';
import { ApifySearchEngine } from '../../../lib/apifySearch';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurant = searchParams.get('restaurant');

    if (!restaurant) {
      return NextResponse.json({
        success: false,
        error: 'Restaurant name is required'
      }, { status: 400 });
    }

    console.log(`🧪 Testing Apify search for: "${restaurant}"`);

    const searchEngine = new ApifySearchEngine();
    
    if (!searchEngine.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Apify not configured. Set APIFY_API_TOKEN in .env.local',
        estimatedCost: searchEngine.getEstimatedCost()
      }, { status: 400 });
    }

    const results = await searchEngine.searchRestaurants(restaurant);

    return NextResponse.json({
      success: true,
      restaurantName: restaurant,
      results: results,
      count: results.length,
      estimatedCost: searchEngine.getEstimatedCost(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Apify test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

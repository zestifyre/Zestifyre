import { NextRequest, NextResponse } from 'next/server';
import { DuckDuckGoSearchEngine } from '../../../lib/duckDuckGoSearch';

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

    console.log(`🧪 Testing DuckDuckGo search for: "${restaurant}"`);

    const searchEngine = new DuckDuckGoSearchEngine();
    const results = await searchEngine.searchRestaurants(restaurant);

    return NextResponse.json({
      success: true,
      restaurantName: restaurant,
      results: results,
      count: results.length,
      searchEngine: 'DuckDuckGo',
      cost: 'FREE',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ DuckDuckGo test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

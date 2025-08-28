import { NextRequest, NextResponse } from 'next/server';
import { PlaywrightSearchEngine } from '../../../lib/playwrightSearch';

export async function GET(request: NextRequest) {
  const searchEngine = new PlaywrightSearchEngine();
  
  try {
    const { searchParams } = new URL(request.url);
    const restaurant = searchParams.get('restaurant');

    if (!restaurant) {
      return NextResponse.json({
        success: false,
        error: 'Restaurant name is required'
      }, { status: 400 });
    }

    console.log(`🧪 Testing Playwright search for: "${restaurant}"`);

    const results = await searchEngine.searchRestaurants(restaurant);

    return NextResponse.json({
      success: true,
      restaurantName: restaurant,
      results: results,
      count: results.length,
      searchEngine: 'Playwright',
      cost: searchEngine.getEstimatedCost(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Playwright test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    // Clean up browser instance
    await searchEngine.close();
  }
}

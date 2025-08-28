import { NextRequest, NextResponse } from 'next/server';
import { uberEatsSearch } from '@/lib/uberEatsSearch';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantName = searchParams.get('restaurant');
    const exactMatch = searchParams.get('exact') === 'true';
    const maxResults = parseInt(searchParams.get('max') || '5');

    if (!restaurantName) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing search for: "${restaurantName}"`);

    let results;
    if (exactMatch) {
      const exactResult = await uberEatsSearch.findExactMatch(restaurantName);
      results = exactResult ? [exactResult] : [];
    } else {
      results = await uberEatsSearch.searchRestaurants(restaurantName, {
        maxResults,
        exactMatch: false
      });
    }

    return NextResponse.json({
      success: true,
      restaurantName,
      exactMatch,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Search test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantName, options = {} } = body;

    if (!restaurantName) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing search with options:`, { restaurantName, options });

    const results = await uberEatsSearch.searchRestaurants(restaurantName, options);

    return NextResponse.json({
      success: true,
      restaurantName,
      options,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Search test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

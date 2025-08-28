import { NextRequest, NextResponse } from 'next/server';
import { uberEatsScraper } from '@/lib/uberEatsScraper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantUrl = searchParams.get('url');
    const includeImages = searchParams.get('images') === 'true';
    const maxItems = parseInt(searchParams.get('max') || '10');

    if (!restaurantUrl) {
      return NextResponse.json(
        { error: 'Restaurant URL is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing scraper for URL: "${restaurantUrl}"`);

    const menu = await uberEatsScraper.scrapeRestaurantMenu(restaurantUrl, {
      includeImages,
      maxItems
    });

    // Get additional analysis
    const popularItems = uberEatsScraper.getPopularItems(menu);
    const expensiveItems = uberEatsScraper.getExpensiveItems(menu, 3);
    const itemsWithoutImages = uberEatsScraper.getItemsWithoutImages(menu);

    return NextResponse.json({
      success: true,
      restaurantUrl,
      menu,
      analysis: {
        popularItems,
        expensiveItems,
        itemsWithoutImages,
        totalItems: menu.menuItems.length,
        categories: menu.categories
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Scraper test failed:', error);
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
    const { restaurantUrl, options = {} } = body;

    if (!restaurantUrl) {
      return NextResponse.json(
        { error: 'Restaurant URL is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing scraper with options:`, { restaurantUrl, options });

    const menu = await uberEatsScraper.scrapeRestaurantMenu(restaurantUrl, options);

    return NextResponse.json({
      success: true,
      restaurantUrl,
      options,
      menu,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Scraper test failed:', error);
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

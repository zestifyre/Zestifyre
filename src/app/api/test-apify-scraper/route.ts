import { NextRequest, NextResponse } from 'next/server';
import { ApifyUberEatsScraper } from '@/lib/apifyUberEatsScraper';

export async function POST(request: NextRequest) {
  try {
    const { restaurantUrl, options = {} } = await request.json();

    if (!restaurantUrl) {
      return NextResponse.json(
        { success: false, error: 'restaurantUrl is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing Apify scraper with options:', { restaurantUrl, options });

    const scraper = new ApifyUberEatsScraper();

    // Test Apify connection first
    const isConnected = await scraper.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Apify connection failed. Please check your APIFY_TOKEN environment variable.' 
        },
        { status: 500 }
      );
    }

    console.log('✅ Apify connection successful');

    // Scrape the restaurant menu
    const menu = await scraper.scrapeRestaurantMenu(restaurantUrl, options);

    return NextResponse.json({
      success: true,
      menu,
      message: `Successfully scraped ${menu.menuItems.length} menu items using Apify`
    });

  } catch (error) {
    console.error('❌ Apify scraper test failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantUrl = searchParams.get('url');
    const maxItems = searchParams.get('max') ? parseInt(searchParams.get('max')!) : undefined;

    if (!restaurantUrl) {
      return NextResponse.json(
        { success: false, error: 'restaurantUrl parameter is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing Apify scraper for URL:', restaurantUrl);

    const scraper = new ApifyUberEatsScraper();

    // Test Apify connection first
    const isConnected = await scraper.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Apify connection failed. Please check your APIFY_TOKEN environment variable.' 
        },
        { status: 500 }
      );
    }

    console.log('✅ Apify connection successful');

    // Scrape the restaurant menu
    const menu = await scraper.scrapeRestaurantMenu(restaurantUrl, { maxItems });

    return NextResponse.json({
      success: true,
      menu,
      message: `Successfully scraped ${menu.menuItems.length} menu items using Apify`
    });

  } catch (error) {
    console.error('❌ Apify scraper test failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}



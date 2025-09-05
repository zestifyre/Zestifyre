import { NextRequest, NextResponse } from 'next/server';
import { discordLogger } from '@/lib/discordLogger';

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

export async function POST(request: NextRequest) {
  try {
    const { restaurantUrl } = await request.json();
    
    if (!restaurantUrl) {
      return NextResponse.json({ error: 'Restaurant URL is required' }, { status: 400 });
    }

    console.log('🔍 Starting UberEats page analysis:', restaurantUrl);
    
    const analysis = await analyzeUberEatsPage(restaurantUrl);
    
    // Log research results to Discord
    await discordLogger.logResearch(restaurantUrl, analysis);
    
    return NextResponse.json({ 
      success: true, 
      analysis,
      recommendations: generateRecommendations(analysis)
    });
    
  } catch (error) {
    console.error('❌ Research analysis failed:', error);
    await discordLogger.logError('Research analysis failed', error as Error);
    
    return NextResponse.json({ 
      error: 'Failed to analyze UberEats page' 
    }, { status: 500 });
  }
}

async function analyzeUberEatsPage(url: string): Promise<PageAnalysis> {
  const startTime = Date.now();
  const analysis: PageAnalysis = {
    url,
    timestamp: new Date().toISOString(),
    pageTitle: '',
    menuItemsFound: 0,
    structure: {
      selectors: [],
      dataStructure: {},
      antiScrapingMeasures: []
    },
    performance: {
      loadTime: 0,
      javascriptRendered: false,
      dynamicContent: false
    },
    errors: []
  };

  try {
    // Test 1: Basic HTTP request
    console.log('🔍 Testing basic HTTP request...');
    const basicResponse = await testBasicHttp(url);
    analysis.structure.selectors.push(...basicResponse.selectors);
    analysis.errors.push(...basicResponse.errors);
    
    // Test 2: Playwright with stealth
    console.log('🔍 Testing Playwright with stealth...');
    const playwrightResponse = await testPlaywright(url);
    analysis.pageTitle = playwrightResponse.pageTitle;
    analysis.menuItemsFound = playwrightResponse.menuItemsFound;
    analysis.structure.dataStructure = playwrightResponse.dataStructure;
    analysis.performance.javascriptRendered = playwrightResponse.javascriptRendered;
    analysis.performance.dynamicContent = playwrightResponse.dynamicContent;
    analysis.structure.antiScrapingMeasures.push(...playwrightResponse.antiScrapingMeasures);
    
    // Test 3: Check for dynamic content loading
    console.log('🔍 Testing dynamic content detection...');
    const dynamicResponse = await testDynamicContent(url);
    analysis.performance.dynamicContent = dynamicResponse.hasDynamicContent;
    analysis.structure.antiScrapingMeasures.push(...dynamicResponse.antiScrapingMeasures);
    
  } catch (error) {
    analysis.errors.push(`Analysis failed: ${error}`);
  }
  
  analysis.performance.loadTime = Date.now() - startTime;
  
  return analysis;
}

async function testBasicHttp(url: string) {
  const axios = (await import('axios')).default;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000
    });
    
    const html = response.data;
    const selectors = extractSelectors(html);
    
    return {
      selectors,
      errors: []
    };
    
  } catch (error) {
    return {
      selectors: [],
      errors: [`HTTP request failed: ${error}`]
    };
  }
}

async function testPlaywright(url: string) {
  const { chromium } = await import('playwright');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });
    
    const page = await context.newPage();
    
    // Add stealth measures
    await page.addInitScript(() => {
      // Override webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      
      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    const pageTitle = await page.title();
    
    // Try to find menu items with various selectors
    const menuSelectors = [
      '[data-testid*="menu-item"]',
      '[data-testid*="dish"]',
      '.menu-item',
      '.dish-item',
      '[class*="menu"]',
      '[class*="dish"]',
      '[class*="item"]',
      'article',
      '.product-card',
      '.food-item'
    ];
    
    let menuItemsFound = 0;
    const dataStructure: Record<string, unknown> = {};
    const antiScrapingMeasures = [];
    
    for (const selector of menuSelectors) {
      try {
        const items = await page.$$(selector);
        if (items.length > 0) {
          menuItemsFound = items.length;
          console.log(`✅ Found ${items.length} items with selector: ${selector}`);
          
          // Extract sample data from first item
          if (items.length > 0) {
            const sampleItem = await items[0].evaluate((el) => {
              return {
                text: el.textContent?.trim(),
                className: el.className,
                attributes: Array.from(el.attributes).map(attr => ({
                  name: attr.name,
                  value: attr.value
                })),
                children: Array.from(el.children).map(child => ({
                  tagName: child.tagName,
                  className: child.className,
                  text: child.textContent?.trim()
                }))
              };
            });
            
            dataStructure[selector] = sampleItem;
          }
          break;
        }
      } catch (error) {
        console.log(`❌ Selector ${selector} failed:`, error);
      }
    }
    
    // Check for anti-scraping measures
    const hasCaptcha = await page.$('[class*="captcha"], [id*="captcha"]');
    if (hasCaptcha) antiScrapingMeasures.push('CAPTCHA detected');
    
    const hasBlockingOverlay = await page.$('[class*="block"], [class*="overlay"]');
    if (hasBlockingOverlay) antiScrapingMeasures.push('Blocking overlay detected');
    
    const hasRateLimit = await page.$('[class*="rate"], [class*="limit"]');
    if (hasRateLimit) antiScrapingMeasures.push('Rate limiting detected');
    
    // Check if content is JavaScript rendered
    const bodyText = await page.textContent('body');
    const javascriptRendered = Boolean(bodyText && bodyText.length > 1000);
    
    await browser.close();
    
    return {
      pageTitle,
      menuItemsFound,
      dataStructure,
      javascriptRendered,
      dynamicContent: false, // Will be tested separately
      antiScrapingMeasures
    };
    
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function testDynamicContent(url: string) {
  const { chromium } = await import('playwright');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Track network requests
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Wait and check for additional requests
    await page.waitForTimeout(5000);
    
    const hasDynamicContent = requests.some(req => 
      req.includes('api') || req.includes('graphql') || req.includes('ajax')
    );
    
    const antiScrapingMeasures = [];
    if (hasDynamicContent) {
      antiScrapingMeasures.push('Dynamic content loading detected');
    }
    
    await browser.close();
    
    return {
      hasDynamicContent,
      antiScrapingMeasures
    };
    
  } catch (error) {
    await browser.close();
    throw error;
  }
}

function extractSelectors(html: string): string[] {
  const selectors: string[] = [];
  
  // Look for common menu item patterns
  const patterns = [
    /data-testid="([^"]*menu[^"]*)"/g,
    /data-testid="([^"]*dish[^"]*)"/g,
    /class="([^"]*menu[^"]*)"/g,
    /class="([^"]*dish[^"]*)"/g,
    /class="([^"]*item[^"]*)"/g,
    /id="([^"]*menu[^"]*)"/g,
    /id="([^"]*dish[^"]*)"/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      selectors.push(match[1]);
    }
  });
  
  return [...new Set(selectors)];
}

function generateRecommendations(analysis: PageAnalysis) {
  const recommendations = [];
  
  if (analysis.structure.antiScrapingMeasures.length > 0) {
    recommendations.push('⚠️ Anti-scraping measures detected - implement stealth mode');
  }
  
  if (analysis.performance.javascriptRendered) {
    recommendations.push('✅ JavaScript rendering required - use Playwright');
  }
  
  if (analysis.performance.dynamicContent) {
    recommendations.push('🔄 Dynamic content detected - implement wait strategies');
  }
  
  if (analysis.menuItemsFound === 0) {
    recommendations.push('❌ No menu items found - need to identify correct selectors');
  } else {
    recommendations.push(`✅ Found ${analysis.menuItemsFound} menu items - proceed with extraction`);
  }
  
  return recommendations;
}

# Web Scraping & Search Engine Access Research

## Current State (2024)

### Search Engine Bot Detection
All major search engines now have sophisticated bot detection:
- **Google**: JavaScript challenges, CAPTCHA, IP blocking
- **Bing**: Redirects, user-agent blocking
- **DuckDuckGo**: Status 202 redirects, block pages
- **Yahoo**: Similar to Google

## Modern Solutions

### 1. Headless Browser Automation
**Tools:**
- **Playwright** (Microsoft) - Most modern, handles JavaScript
- **Puppeteer** (Google) - Chrome automation
- **Selenium** - Cross-browser automation

**Pros:**
- ✅ Can handle JavaScript challenges
- ✅ Mimics real user behavior
- ✅ Bypasses most bot detection

**Cons:**
- ❌ Resource intensive
- ❌ Slower than direct HTTP requests
- ❌ Still can be detected by advanced systems

### 2. Search Engine APIs
**Paid Services:**
- **SerpAPI** - $50/month for 5,000 searches
- **ScrapingBee** - $49/month for 1,000 requests
- **Bright Data** - $500/month for 100,000 requests
- **Apify** - $49/month for 10,000 compute units

**Free Services:**
- **Google Custom Search API** - 100 free queries/day
- **Bing Search API** - 1,000 free queries/month

### 3. Proxy & Rotation Services
**Tools:**
- **Bright Data** - Residential proxies
- **SmartProxy** - Rotating proxies
- **Oxylabs** - Premium proxies

**Pros:**
- ✅ Bypasses IP-based blocking
- ✅ Appears as real users

**Cons:**
- ❌ Expensive ($50-500/month)
- ❌ Can be unreliable

### 4. Alternative Search Sources
**Options:**
- **Yelp API** - Restaurant data
- **Foursquare API** - Venue information
- **OpenTable API** - Restaurant listings
- **TripAdvisor API** - Restaurant reviews

### 5. Web Scraping Services
**Services:**
- **ScrapingBee** - Handles JavaScript, CAPTCHA
- **Apify** - Custom scrapers
- **Bright Data** - Web scraping infrastructure
- **Zyte** - Smart proxy rotation

## Recommended Approach for MVP

### Option 1: Playwright + Proxy Rotation (Recommended)
```javascript
// Example implementation
import { chromium } from 'playwright';

async function searchWithPlaywright(restaurantName) {
  const browser = await chromium.launch({ 
    headless: true,
    proxy: { server: 'proxy-server:port' }
  });
  
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?q=${restaurantName}+Uber+Eats`);
  
  // Wait for results to load
  await page.waitForSelector('.g');
  
  // Extract UberEats URLs
  const urls = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="ubereats.com"]');
    return Array.from(links).map(link => link.href);
  });
  
  await browser.close();
  return urls;
}
```

### Option 2: Search API Service
```javascript
// Example with SerpAPI
import axios from 'axios';

async function searchWithSerpAPI(restaurantName) {
  const response = await axios.get('https://serpapi.com/search', {
    params: {
      q: `${restaurantName} Uber Eats`,
      api_key: process.env.SERPAPI_KEY,
      engine: 'google'
    }
  });
  
  return response.data.organic_results
    .filter(result => result.link.includes('ubereats.com'))
    .map(result => result.link);
}
```

### Option 3: Hybrid Approach
1. **Primary**: Use Playwright with proxy rotation
2. **Fallback**: Use search API service
3. **Emergency**: Manual URL entry

## Cost Analysis

### Playwright + Proxy Approach
- **Playwright**: Free
- **Proxy Service**: $50-200/month
- **Server Resources**: $20-50/month
- **Total**: $70-250/month

### Search API Approach
- **SerpAPI**: $50/month (5,000 searches)
- **ScrapingBee**: $49/month (1,000 requests)
- **Total**: $50-100/month

### Hybrid Approach
- **Playwright + Proxy**: $70-250/month
- **Search API Backup**: $50/month
- **Total**: $120-300/month

## Implementation Recommendations

### For MVP (Phase 1)
1. **Start with Playwright** - Most reliable, handles JavaScript
2. **Add proxy rotation** - Bypass IP blocking
3. **Implement retry logic** - Handle temporary failures
4. **Add search API fallback** - For reliability

### For Production (Phase 2)
1. **Multiple search engines** - Google, Bing, DuckDuckGo
2. **Advanced proxy rotation** - Residential proxies
3. **Machine learning** - Predict and avoid blocking
4. **Distributed scraping** - Multiple servers

## Next Steps

1. **Test Playwright** with Google search
2. **Evaluate proxy services** (Bright Data, SmartProxy)
3. **Compare search APIs** (SerpAPI, ScrapingBee)
4. **Implement hybrid solution**
5. **Add monitoring and alerts**

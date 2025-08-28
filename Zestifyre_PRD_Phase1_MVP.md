# Zestifyre PRD - Complete Development Guide
## AI-Generated Menu Images for UberEats Sales Boost

### **Product Overview**
Zestifyre is a web application that generates high-quality AI menu images for UberEats restaurants to boost their sales. This document serves as the complete development guideline with all phases and testing protocols.

### **Project Rules & Testing Protocol**
1. **Task Completion**: Each task must be completed and tested before moving to the next
2. **Testing Responsibility**: I will run tests for each completed task and provide you with testing instructions
3. **Progress Tracking**: Always reference this document to determine current project status
4. **Quality Gates**: No task is considered complete until testing is verified
5. **Documentation**: All completed tasks must be marked as "✅ COMPLETED" in this document
6. **Repository Privacy**: All GitHub repositories should be private by default (by invitation only)
7. **Readability First**: Always prioritize text readability - ensure sufficient contrast between text and background colors, especially for input fields and form elements
8. **Enter Key Functionality**: When creating input boxes, hitting Enter should perform the most logical next action. Consider: "nothing", "next field", "search", "submit". Examples: Search inputs should trigger search, form inputs should submit the form, multi-field forms should move to next field.
9. **Build Error Prevention**: Always run `npm run build` locally before pushing to GitHub to catch TypeScript/ESLint errors. Common issues: `any` types, unused variables, missing imports. Fix these immediately to prevent Vercel deployment failures.

### **Core Value Proposition**
- Generate professional-quality food images using AI
- Boost UberEats restaurant sales through better visual presentation
- Free sample image to demonstrate value
- Simple, frictionless user experience

---

## **Technical Architecture**

### **Tech Stack**
- **Frontend**: Next.js with React (TypeScript)
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **AI Image Generation**: DALL-E 3 API
- **Email Service**: Gmail SMTP with Nodemailer
- **Hosting**: Vercel
- **Error Monitoring**: Discord webhooks + email alerts

### **Estimated Monthly Costs**
- DALL-E 3 API: ~$150-300 (depending on usage)
- Vercel Pro: $20/month
- Supabase Pro: $25/month (after free tier)
- Email service: ~$10-20/month
- **Total**: ~$205-365/month

---

## **User Flow**

### **1. Landing Page**
- **URL**: `zestifyre.com`
- **Hero Section**: "Get a free AI-generated menu image that BOOSTS your UberEats sales"
- **CTA**: "Get a free image now" button
- **Form Fields**:
  - Restaurant name on UberEats (text input)
  - Email address (email input)
- **Validation**: Basic email format validation

### **2. Email Confirmation**
- **Trigger**: Form submission
- **Content**: 
  - Thank you message
  - Link to image generation page
  - 30-day expiration notice
- **Link Format**: `zestifyre.com/generate?token={unique_token}&email={email}`

### **3. Image Generation Page**
- **Authentication**: Token-based (no login required)
- **Process Steps**:
  1. "Finding your restaurant on UberEats..."
  2. "Extracting menu data..."
  3. "Generating your AI image..."
  4. "Almost ready..."
- **Success**: "Your image will be sent to your email in the next few minutes"

---

## **Data Flow & Processing**

### **1. Restaurant Search Engine**
- **Input**: Restaurant name from form
- **Process**: 
  - Search UberEats for restaurant name using multiple engines
  - DuckDuckGo (primary), Playwright (fallback), SerpAPI (backup)
  - Return UberEats URLs for found restaurants
- **Retry Logic**: 3 attempts with exponential backoff
- **Error Handling**: "Sorry, please try again later" message

### **2. Menu Data Scraping**
- **Input**: UberEats URLs from search engine
- **Process**: 
  - Extract menu items, descriptions, prices, images
  - Handle anti-scraping measures
  - Parse restaurant menu structure
- **Retry Logic**: 3 attempts with different methods
- **Error Handling**: Graceful degradation with partial data

### **3. Data Storage (Supabase)**
**Tables Structure:**
- **users**: email, restaurant_name, created_at, status
- **restaurants**: name, uber_eats_url, scraped_at, menu_items_count
- **menu_items**: restaurant_id, name, description, price, category, has_image
- **generated_images**: user_id, menu_item_id, image_url, status, created_at

### **4. Image Generation Priority**
- **Selection Criteria**: Most expensive OR most popular item
- **AI Prompt**: Combine food description + style reference from existing UberEats images
- **Retry Logic**: 3 attempts with different prompts
- **Error Handling**: Daily email alerts to admin

### **5. Image Delivery**
- **Format**: High-resolution, UberEats-compliant specifications
- **Storage**: Cloud storage (AWS S3 or similar)
- **Download Link**: 30-day expiration
- **Email Content**: Download link + brief usage instructions

---

## **Error Handling & Monitoring**

### **Discord Integration**
- **Channel**: `#zestifyre-errors`
- **Triggers**:
  - UberEats search failures (after 3 retries)
  - Menu scraping failures (after 3 retries)
  - AI generation failures (after 3 retries)
  - Email delivery failures
  - Database connection issues

### **Email Alerts**
- **Recipients**: Admin team
- **Frequency**: Daily digest for generation failures
- **Content**: Error summary, affected users, recommended actions

### **User-Facing Error Messages**
- **Search Failure**: "Sorry, we couldn't find your restaurant. Please try again later."
- **Scraping Failure**: "Sorry, we couldn't load the menu. Please try again later."
- **Generation Failure**: "Sorry, we're experiencing technical difficulties. Please try again later."
- **Generic Error**: "Something went wrong. Please try again."

---

## **Success Metrics (Phase 1)**

### **Conversion Funnel Tracking**
1. **Landing Page → Form Submission**: Target 15-20%
2. **Form Submission → Email Click**: Target 40-50%
3. **Email Click → Image Generation**: Target 80-90%
4. **Image Generation → Email Delivery**: Target 95%+
5. **Email Delivery → Image Download**: Target 60-70%

### **Key Performance Indicators**
- **Overall Conversion Rate**: Landing page to image download
- **Email Open Rate**: For generated image emails
- **Image Download Rate**: Success rate of image delivery
- **Error Rate**: Percentage of failed generations/scraping

---

## **PHASE 1: MVP - Free + Paid Image Generation**
**Timeline: 6-8 weeks | Status: 🚀 READY TO START**

### **Week 1-2: Foundation**
- [x] **Task 1.1**: Set up Next.js project with TypeScript ✅ COMPLETED
  - [x] Initialize Next.js project
  - [x] Configure TypeScript
  - [x] Set up ESLint and Prettier
  - [x] Create basic folder structure
  - **Testing**: ✅ Verified project runs locally, TypeScript compilation works

- [x] **Task 1.2**: Configure Supabase database ✅ COMPLETED
  - [x] Set up Supabase project (linked to GitHub)
  - [x] Create users table with proper schema
  - [x] Create restaurants table with proper schema
  - [x] Create menu_items table with proper schema
  - [x] Create generated_images table with proper schema
  - [x] Set up Row Level Security (RLS) policies
  - [x] Configure API access and environment variables
  - **Testing**: ✅ Verified database connection, CRUD operations work

- [x] **Task 1.3**: Set up Vercel deployment ✅ COMPLETED
  - [x] Connect GitHub repository to Vercel
  - [x] Configure environment variables
  - [x] Set up custom domain (zestifyre.com)
  - [x] Configure build settings
  - **Testing**: ✅ Verified deployment works, app live at https://zestifyre.vercel.app/

- [x] **Task 1.4**: Create basic landing page ✅ COMPLETED
  - [x] Design hero section with value proposition
  - [x] Create restaurant name input field
  - [x] Create email input field
  - [x] Add form validation
  - [x] Style with responsive design
  - **Testing**: ✅ Verified form validation, responsive design on mobile/desktop

### **Week 3: Core Functionality**
- [x] **Task 1.5**: Implement UberEats Search Engine ✅ COMPLETED
  - [x] Research search engine solutions (Playwright, SerpAPI, DuckDuckGo)
  - [x] Implement multiple search engines with fallback logic
  - [x] Create modular search architecture
  - [x] Add comprehensive testing endpoints
  - [x] Remove all hardcoded elements
  - [x] Implement proper error handling and status reporting
  - [x] Add Enter key functionality for search inputs
  - [x] Optimize search order (SerpAPI first, then Playwright, then DuckDuckGo, then Direct URL)
  - [x] Create comprehensive test page with real-time status updates
  - [x] **Discord logging integration for production monitoring**
  - [x] **Vercel deployment compatibility and environment variable setup**
  - **Testing**: ✅ Verified search works with various restaurant names, SerpAPI is reliable, Enter key functionality working
  - **Production**: ✅ Successfully deployed and tested on Vercel with Discord logging

- [ ] **Task 1.6**: Implement UberEats Menu Scraper
  - [ ] Research UberEats page structure and anti-scraping measures
  - [ ] Implement real menu item extraction (no mock data)
  - [ ] Add image URL extraction from UberEats pages
  - [ ] Create modular scraping architecture
  - [ ] Implement retry logic and error handling
  - **Testing**: Test with real UberEats URLs, verify accurate data extraction

- [ ] **Task 1.7**: Set up DALL-E 3 integration
  - [ ] Create OpenAI API account
  - [ ] Implement DALL-E 3 API calls
  - [ ] Create prompt engineering for food images
  - [ ] Add image generation queue system
  - [ ] Implement retry logic for failed generations
  - **Testing**: Generate test images, verify quality and consistency

- [ ] **Task 1.8**: Create image generation workflow
  - [ ] Build item selection logic (most expensive/popular)
  - [ ] Create image processing pipeline
  - [ ] Implement cloud storage (AWS S3)
  - [ ] Generate download links with expiration
  - [ ] Add status tracking
  - **Testing**: End-to-end image generation workflow

- [ ] **Task 1.9**: Build email system
  - [ ] Set up Gmail SMTP with Nodemailer
  - [ ] Create email templates
  - [ ] Implement token-based authentication links
  - [ ] Add email tracking
  - [ ] Set up email delivery monitoring
  - **Testing**: Send test emails, verify delivery and link functionality

### **Week 4: User Experience**
- [ ] **Task 1.10**: Implement fuzzy search for restaurants
  - [ ] Research fuzzy search algorithms
  - [ ] Implement restaurant name matching
  - [ ] Create suggestion display
  - [ ] Add user selection interface
  - **Testing**: Test with various restaurant name variations

- [ ] **Task 1.11**: Add error handling and retry logic
  - [ ] Implement comprehensive error handling
  - [ ] Add user-friendly error messages
  - [ ] Create retry mechanisms for all critical operations
  - [ ] Add error logging
  - **Testing**: Simulate various error scenarios

- [ ] **Task 1.12**: Set up Discord monitoring
  - [ ] Create Discord server and channel
  - [ ] Set up webhook integration
  - [ ] Configure error alerts
  - [ ] Add daily digest functionality
  - **Testing**: Trigger test alerts, verify notification delivery

- [ ] **Task 1.13**: Create download link system
  - [ ] Implement secure token generation
  - [ ] Add 30-day expiration logic
  - [ ] Create download page
  - [ ] Add download tracking
  - **Testing**: Test link expiration, download functionality

### **Week 5-6: Payment Integration**
- [ ] **Task 1.14**: Set up Stripe integration
  - [ ] Create Stripe account and configure
  - [ ] Implement Stripe checkout
  - [ ] Set up webhook handling
  - [ ] Add payment success/failure handling
  - [ ] Implement refund functionality
  - **Testing**: Test payment flows, webhook processing

- [ ] **Task 1.15**: Create item selection interface
  - [ ] Design menu item display grid
  - [ ] Add item filtering (missing images, categories)
  - [ ] Implement item selection functionality
  - [ ] Add item preview modal
  - [ ] Create shopping cart system
  - **Testing**: Test item selection, cart functionality

- [ ] **Task 1.16**: Build checkout process
  - [ ] Create checkout page design
  - [ ] Implement Stripe Elements
  - [ ] Add order summary
  - [ ] Create order confirmation
  - [ ] Set up order tracking
  - **Testing**: End-to-end checkout flow testing

- [ ] **Task 1.17**: Create user dashboard
  - [ ] Design dashboard layout
  - [ ] Add order history
  - [ ] Implement download management
  - [ ] Create user profile section
  - [ ] Add account settings
  - **Testing**: Dashboard functionality, user experience

### **Week 7-8: Testing & Polish**
- [ ] **Task 1.18**: End-to-end testing
  - [ ] Create comprehensive test suite
  - [ ] Test all user flows (free + paid)
  - [ ] Performance testing
  - [ ] Security testing
  - **Testing**: Full system integration testing

- [ ] **Task 1.19**: Performance optimization
  - [ ] Optimize image loading
  - [ ] Implement caching strategies
  - [ ] Database query optimization
  - [ ] API response optimization
  - **Testing**: Load testing, performance benchmarking

- [ ] **Task 1.20**: Error monitoring setup
  - [ ] Configure comprehensive error tracking
  - [ ] Set up alert thresholds
  - [ ] Create error dashboard
  - [ ] Implement automated recovery
  - **Testing**: Error simulation and monitoring verification

- [ ] **Task 1.21**: Launch preparation
  - [ ] Final security review
  - [ ] Documentation completion
  - [ ] Team training
  - [ ] Go-live checklist
  - **Testing**: Pre-launch validation testing

---

## **PHASE 2: Future Enhancement - Analytics & Optimization**
**Timeline: 4-5 weeks | Status: 📋 FUTURE PHASE**

### **Week 1-2: Advanced Analytics**
- [ ] **Task 2.1**: Implement comprehensive funnel tracking
  - [ ] Set up Google Analytics 4
  - [ ] Create custom event tracking
  - [ ] Implement conversion tracking
  - [ ] Add user journey mapping
  - [ ] Create funnel visualization
  - **Testing**: Verify tracking accuracy, data collection

- [ ] **Task 2.2**: Build A/B testing framework
  - [ ] Set up A/B testing infrastructure
  - [ ] Create test variation system
  - [ ] Implement statistical analysis
  - [ ] Add test result dashboard
  - [ ] Create automated test optimization
  - **Testing**: A/B test execution, statistical validity

### **Week 3-4: Performance & Optimization**
- [ ] **Task 2.3**: Advanced performance analytics
  - [ ] Implement Core Web Vitals tracking
  - [ ] Add performance monitoring
  - [ ] Create performance dashboards
  - [ ] Set up performance alerts
  - [ ] Implement automated optimization
  - **Testing**: Performance measurement, optimization effectiveness

- [ ] **Task 2.4**: User behavior insights
  - [ ] Implement heatmap tracking
  - [ ] Add session recording
  - [ ] Create user behavior analytics
  - [ ] Build predictive analytics
  - [ ] Implement personalized recommendations
  - **Testing**: Data accuracy, insight generation

### **Week 5: Advanced Features**
- [ ] **Task 2.5**: Automated optimization system
  - [ ] Create machine learning models
  - [ ] Implement automated A/B testing
  - [ ] Add predictive pricing
  - [ ] Create automated content optimization
  - [ ] Build recommendation engine
  - **Testing**: ML model accuracy, automation effectiveness

- [ ] **Task 2.6**: Advanced reporting & insights
  - [ ] Create executive dashboards
  - [ ] Implement automated reporting
  - [ ] Add predictive analytics
  - [ ] Create business intelligence tools
  - [ ] Build data export functionality
  - **Testing**: Report accuracy, insight generation



---

## **Risk Assessment**

### **Technical Risks**
- **UberEats TOS Changes**: Monitor for scraping policy updates
- **AI API Rate Limits**: Implement queue system for high volume
- **Email Deliverability**: Monitor spam folder placement

### **Business Risks**
- **Low Conversion Rates**: A/B test landing page elements
- **High Error Rates**: Optimize scraping and generation processes
- **Cost Overruns**: Monitor API usage and implement rate limiting

### **Mitigation Strategies**
- **Backup Scraping Methods**: Alternative data sources
- **Cost Monitoring**: Real-time API usage tracking
- **User Feedback Loop**: Collect feedback for continuous improvement

---

## **Success Criteria by Phase**

### **Phase 1 MVP Success Criteria (Free + Paid)**
- [ ] **Minimum Viable Success**
  - 100 successful free image generations
  - 50 paid image purchases
  - 70%+ overall conversion rate (landing to free image)
  - 15% conversion rate from free to paid
  - <5% error rate
  - <2% payment failure rate
  - Positive user feedback
- [ ] **Target Success**
  - 500 successful free image generations
  - 200 paid image purchases
  - 80%+ overall conversion rate
  - 25% conversion rate from free to paid
  - <2% error rate
  - <1% payment failure rate
  - Strong revenue growth
  - Strong user testimonials
  - Ready for Phase 2 development

### **Phase 2 Success Criteria (Future Enhancement)**
- [ ] **Minimum Viable Success**
  - Comprehensive analytics implementation
  - 10% improvement in conversion rates
  - Automated optimization working
  - Data-driven insights generated
- [ ] **Target Success**
  - 25% improvement in conversion rates
  - Fully automated optimization system
  - Predictive analytics accuracy >80%
  - Significant revenue growth through optimization

---

## **Project Status Tracking**

### **Current Phase**: Phase 1 - MVP Development (Free + Paid)
### **Current Status**: 🎉 MILESTONE COMPLETED - MVP Foundation Ready
### **Next Task**: Task 1.6 - Implement UberEats Menu Scraper

### **Completed Tasks**: 
- ✅ Task 1.1: Next.js setup with TypeScript
- ✅ Task 1.2: Supabase database configuration  
- ✅ Task 1.3: Vercel deployment
- ✅ Task 1.4: Landing page with form functionality
### **In Progress**: None
### **Blocked**: None

### **🎉 MILESTONE ACHIEVEMENT:**
**MVP Foundation Complete!**
- ✅ **Live website**: https://zestifyre.vercel.app/
- ✅ **Form functionality**: Working with proper UX flow
- ✅ **Database**: Connected and tested
- ✅ **Deployment**: Automated with GitHub integration
- ✅ **Ready for core functionality development**

---

## **Testing Protocol Summary**

### **For Each Task Completion:**
1. **I will run automated tests** for the completed functionality
2. **I will provide you with manual testing instructions** to verify the feature works as expected
3. **You will confirm testing results** before we mark the task as complete
4. **Task will be marked as "✅ COMPLETED"** in this document once testing is verified

### **Testing Categories:**
- **Unit Testing**: Individual component/function testing
- **Integration Testing**: API and database interaction testing
- **User Experience Testing**: Manual flow testing
- **Performance Testing**: Load and speed testing
- **Security Testing**: Vulnerability and access control testing

---

*This document serves as the complete development guideline for Zestifyre. All phases are planned with detailed checklists and testing protocols. Each task must be completed and tested before proceeding to the next.*

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ restaurantName?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { restaurantName?: string; email?: string } = {};

    if (!restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit form to API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantName, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      console.log('Form submitted successfully:', result);
      
      // Show success state
      setIsSuccess(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setRestaurantName('');
    setEmail('');
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Zestifyre</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Success Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Check your email!
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  We&apos;ve sent your free AI-generated menu image to:
                </p>
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
                  <p className="text-lg font-semibold text-gray-900">{email}</p>
                </div>
                <p className="text-gray-600 mb-8">
                  Please check your inbox (and spam folder) for an email from Zeptifier. 
                  Click the link in the email to download your free image.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleReset}
                  className="bg-orange-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  Get another free image
                </button>
                <div>
                  <p className="text-sm text-gray-500">
                    Didn&apos;t receive the email? Check your spam folder or{' '}
                    <button 
                      onClick={handleReset}
                      className="text-orange-600 hover:text-orange-700 underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p>&copy; 2025 Zestifyre. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Zestifyre</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-orange-600 transition-colors">About</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-orange-600 transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors">Testimonials</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get a free AI-generated menu image that{' '}
              <span className="text-orange-600">BOOSTS</span> your UberEats sales
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your restaurant&apos;s menu with professional AI-generated food images. 
              Get your first image free and watch your UberEats orders soar!
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant name on UberEats
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500 ${
                    errors.restaurantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Pizza Palace"
                />
                {errors.restaurantName && (
                  <p className="mt-1 text-sm text-red-600">{errors.restaurantName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Getting your free image...' : 'Get a free image now'}
              </button>
            </form>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Free sample image</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Ready in minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Zestifyre</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Zestifyre was founded in 2025 by a small team of students and entrepreneurs who saw a major gap on food delivery apps: thousands of restaurants had menus with missing photos. We came together with a shared vision — to make professional-quality menu images accessible to every restaurant, without the high cost or long wait times of traditional photography.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-4">
              Our mission is simple: help restaurants stand out online, attract more customers, and grow their business with fast, affordable AI-generated images.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Zestifyre Different?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-orange-600 text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Affordable</h3>
              <p className="text-gray-600">Professional-quality menu photos for a fraction of the cost of a traditional photoshoot.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-orange-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">Restaurants can get complete image sets within 24–48 hours.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-orange-600 text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tailored for Uber Eats</h3>
              <p className="text-gray-600">Every image is designed to match the platform&apos;s requirements and look great on delivery apps.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-orange-600 text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hands-On Support</h3>
              <p className="text-gray-600">We work directly with restaurants to customize images for their exact menu items.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-orange-600 text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Risk</h3>
              <p className="text-gray-600">Samples are provided upfront before purchase.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-orange-600 text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Consistent Branding</h3>
              <p className="text-gray-600">We can apply your logo, style, or color scheme to maintain your brand identity.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Generate Your Images</h2>
            <p className="text-xl text-gray-600">Simple, fast, and professional</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Menu</h3>
              <p className="text-gray-600">Restaurant submits menu items via form or email</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Generation</h3>
              <p className="text-gray-600">AI-powered generation creates realistic, appetizing photos</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customization</h3>
              <p className="text-gray-600">We adjust lighting, plating, and style to match your restaurant&apos;s vibe</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview Samples</h3>
              <p className="text-gray-600">Delivered with a watermark for review</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl font-bold">5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Delivery</h3>
              <p className="text-gray-600">High-resolution, watermark-free images once purchased</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">No subscriptions, no hidden fees</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm border-2 border-orange-200"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Samples</h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">$0</div>
                <p className="text-gray-600 mb-6">Watermarked preview images to try before you buy</p>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>✅ Preview images with watermark</li>
                  <li>✅ No commitment required</li>
                  <li>✅ See quality before purchase</li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm border-2 border-orange-500"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay-As-You-Go</h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">$20-30</div>
                <p className="text-gray-600 mb-6">Per image (no subscriptions)</p>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>✅ High-resolution images</li>
                  <li>✅ No watermark</li>
                  <li>✅ Optimized for delivery apps</li>
                  <li>✅ Custom styling available</li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm border-2 border-orange-200"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bulk Discounts</h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">Custom</div>
                <p className="text-gray-600 mb-6">Lower rates available for larger menus</p>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>✅ Volume pricing</li>
                  <li>✅ Consistent branding</li>
                  <li>✅ Priority support</li>
                  <li>✅ Faster turnaround</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Our Uber Eats menu used to look incomplete. After using Zestifyre, our dishes finally had photos — and we saw an immediate boost in orders. Customers know exactly what they&apos;re getting now.&quot;
              </p>
              <div className="font-semibold text-gray-900">Independent Toronto Restaurant</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;The quality is amazing and the turnaround time is incredible. We got our entire menu photographed in 2 days for a fraction of what traditional photography would cost.&quot;
              </p>
              <div className="font-semibold text-gray-900">Local Pizza Chain</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Professional results without the professional price tag. The images look so realistic that customers can&apos;t tell they&apos;re AI-generated. Highly recommend!&quot;
              </p>
              <div className="font-semibold text-gray-900">Family Restaurant Owner</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="text-center text-gray-500">
              <p>&copy; 2025 Zestifyre. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
// Test deployment - Thu Aug 28 08:40:16 EDT 2025

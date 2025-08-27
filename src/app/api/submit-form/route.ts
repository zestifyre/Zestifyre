import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantName, email } = body;

    // Validate input
    if (!restaurantName || !email) {
      return NextResponse.json(
        { error: 'Restaurant name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    console.log('Form submission received:', { restaurantName, email, timestamp: new Date().toISOString() });

    // TODO: Send email
    // TODO: Start image generation process

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: { restaurantName, email }
    });

  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

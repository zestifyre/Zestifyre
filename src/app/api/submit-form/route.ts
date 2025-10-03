import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/emailService';

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

    // Save to database (TODO: implement database storage)
    console.log('Form submission received:', { restaurantName, email, timestamp: new Date().toISOString() });

    // Send welcome email
    console.log('📧 Attempting to send welcome email...');
    const emailResult = await sendWelcomeEmail({
      restaurantName,
      email,
      customerName: restaurantName // Using restaurant name as customer name for now
    });

    if (!emailResult.success) {
      console.error('❌ Failed to send email:', emailResult.error);
      // Don't fail the request if email fails, just log it
    } else {
      console.log('✅ Email sent successfully:', emailResult.messageId);
    }

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

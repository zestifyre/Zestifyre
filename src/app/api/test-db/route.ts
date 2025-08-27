import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET() {
  try {
    // Test database connection by trying to get a user (should return empty if no users exist)
    const testUser = await db.getUserByEmail('test@example.com');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      testUser: testUser ? 'User found' : 'No user found (expected)',
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, restaurantName } = await request.json();

    if (!email || !restaurantName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and restaurant name are required',
        },
        { status: 400 }
      );
    }

    // Test creating a user
    const user = await db.createUser(email, restaurantName);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create user',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        restaurant_name: user.restaurant_name,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

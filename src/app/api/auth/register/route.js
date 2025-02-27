// File location: /src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    
    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if username already exists
    const existingUserByUsername = await db.collection('users').findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }
    
    // Check if email already exists
    const existingUserByEmail = await db.collection('users').findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const now = new Date();
    await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now
    });
    
    return NextResponse.json(
      { success: true, message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
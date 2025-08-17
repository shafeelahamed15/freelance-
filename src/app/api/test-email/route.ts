import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';

export async function GET() {
  try {
    const result = await EmailService.testConnection();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email service is working correctly!',
        data: result.data 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Email service test failed',
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Email service test failed',
      error: error 
    }, { status: 500 });
  }
}
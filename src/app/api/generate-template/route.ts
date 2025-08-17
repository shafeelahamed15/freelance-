import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, clientName, projectType, businessType, tone, brandName } = body;

    if (!type || !clientName) {
      return NextResponse.json(
        { error: 'Missing required fields: type and clientName' },
        { status: 400 }
      );
    }

    const template = await OpenAIService.generateTemplateServer({
      type,
      clientName,
      projectType,
      businessType,
      tone,
      brandName
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
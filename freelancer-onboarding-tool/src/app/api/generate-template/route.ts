import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, clientName, clientEmail, clientCompany, projectType, businessType, tone, brandName, freelancerName, useClientData } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    const template = await OpenAIService.generateTemplateServer({
      type,
      clientName,
      clientEmail,
      clientCompany,
      projectType,
      businessType,
      tone,
      brandName,
      freelancerName,
      useClientData
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
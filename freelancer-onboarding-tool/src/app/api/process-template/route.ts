import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, currentClientName, currentCompany, currentProjectType, freelancerName } = body;

    console.log('Processing template request:', {
      currentClientName,
      currentCompany,
      contentLength: content?.length,
      freelancerName
    });

    if (!content || !currentClientName) {
      return NextResponse.json(
        { error: 'Missing required fields: content and currentClientName' },
        { status: 400 }
      );
    }

    console.log('Original content:', content);

    // Use AI to intelligently replace old client names with new ones
    const processedContent = await OpenAIService.processTemplateContent({
      content,
      newClientName: currentClientName,
      newCompany: currentCompany,
      newProjectType: currentProjectType,
      freelancerName
    });

    console.log('Processed content:', processedContent);

    return NextResponse.json({ processedContent });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process template' },
      { status: 500 }
    );
  }
}
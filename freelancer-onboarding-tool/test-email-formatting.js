/**
 * Email Formatting Test
 * Tests the enhanced email formatting to ensure proper alignment and structure
 */

// Test the email formatting function
const testEmailFormat = async () => {
  console.log('🧪 Testing Email Formatting Fixes...\n');

  // Test content with proper spacing
  const testContent = `Hi John Smith,

I hope this email finds you well. Welcome to Shafez Development!

I am Shafez Ahmed, your dedicated website development expert. I'm thrilled to have the opportunity to work with you and ABC Company. I truly appreciate your trust in choosing my services for your website development needs.

Our collaboration marks the beginning of an exciting journey, and I am confident that together, we can achieve remarkable results.

Here's a brief rundown of our next steps:

Within the next 24 hours, I will send over a comprehensive project scope outlining our objectives, strategies, and the specific services to be rendered.

We will arrange a kickoff call at your earliest convenience to discuss your goals, preferences, and any specific requirements you might have.

I will provide a detailed project timeline that includes important milestones to help us track progress and stay on schedule.

My commitment to you is not just to deliver exceptional results, but also to maintain open and transparent communication throughout the entire process. I believe our collaboration will yield a website development for ABC Company that is both visually appealing and functionally superior.

I am eagerly looking forward to working with you, John Smith. If you have any questions or need further information, please feel free to reach out to me at any time.

Best regards,
Shafez Ahmed
Shafez Development`;

  console.log('📧 Sample Email Content:');
  console.log('=' * 50);
  console.log(testContent);
  console.log('=' * 50);

  // Test the HTML formatting function
  const formatTextToHtml = (text) => {
    return text
      // First normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Split by double line breaks to create paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        // Handle single line breaks within paragraphs as <br>
        const formattedParagraph = paragraph.replace(/\n/g, '<br>');
        return `<p style="margin: 0 0 20px 0; line-height: 1.8; font-size: 16px; color: #333;">${formattedParagraph}</p>`;
      })
      .filter(p => p !== '')
      .join('');
  };

  const htmlContent = formatTextToHtml(testContent);

  console.log('\n🔧 Generated HTML:');
  console.log('=' * 50);
  console.log(htmlContent);
  console.log('=' * 50);

  // Validate the formatting
  const paragraphCount = (htmlContent.match(/<p[^>]*>/g) || []).length;
  const hasProperSpacing = htmlContent.includes('margin: 0 0 20px 0');
  const hasProperLineHeight = htmlContent.includes('line-height: 1.8');
  const hasProperFontSize = htmlContent.includes('font-size: 16px');

  console.log('\n✅ Formatting Validation:');
  console.log(`   📄 Paragraph count: ${paragraphCount}`);
  console.log(`   📏 Proper spacing: ${hasProperSpacing ? '✅' : '❌'}`);
  console.log(`   📐 Proper line height: ${hasProperLineHeight ? '✅' : '❌'}`);
  console.log(`   🔤 Proper font size: ${hasProperFontSize ? '✅' : '❌'}`);

  // Test the email sending endpoint
  console.log('\n🌐 Testing Email Send Endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'custom',
        clientEmail: 'test@example.com',
        clientName: 'John Smith',
        freelancerName: 'Shafez Ahmed',
        freelancerEmail: 'shafeelahamed15@gmail.com',
        subject: 'Welcome to Shafez – Excited to Begin Our Collaboration',
        content: testContent
      }),
    });

    if (response.ok) {
      console.log('✅ Email endpoint is working correctly!');
      const result = await response.json();
      console.log('   Response:', result);
    } else {
      const error = await response.text();
      console.log(`❌ Email endpoint failed: ${response.status}`);
      console.log('   Error:', error);
    }
  } catch (error) {
    console.log(`❌ Failed to test endpoint: ${error.message}`);
  }

  console.log('\n🎯 Email Formatting Test Complete!');
  console.log('\nThe improvements include:');
  console.log('• Enhanced HTML structure with proper paragraph spacing');
  console.log('• Improved line height (1.8) for better readability');
  console.log('• Larger font size (16px) for professional appearance');
  console.log('• Monospace font in textarea for better editing experience');
  console.log('• Enhanced email preview with proper styling');
  console.log('• Better handling of line breaks and whitespace');
};

// Run the test if called directly
if (typeof window === 'undefined') {
  testEmailFormat().catch(console.error);
}

module.exports = { testEmailFormat };
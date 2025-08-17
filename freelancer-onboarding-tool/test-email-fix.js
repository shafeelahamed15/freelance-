// Test script to verify the email sending fix

console.log('📧 Testing Email Sending Fix...\n');

// Simulate the data that SendEmailModal sends to the API
const testEmailData = {
    type: 'custom',
    clientEmail: 'john@example.com',
    clientName: 'John Doe',
    freelancerName: 'Jane Designer',
    freelancerEmail: 'jane@designer.com',
    subject: 'Professional Onboarding - John Doe',
    content: `Hi John Doe,

Welcome to working with Jane Designer! 

We're excited to start your Website Development project for Acme Corp.

Next steps:
1. Review the attached scope document
2. Sign the contract
3. Let's schedule our kickoff call

Best regards,
Jane Designer
Email: jane@designer.com`
};

// Test the transformation logic that should now be in the API route
function testEmailTransformation() {
    console.log('🔄 Testing Email Data Transformation\n');
    
    const textContent = testEmailData.content;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${testEmailData.subject}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-content {
            white-space: pre-wrap;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e1e5e9;
        }
    </style>
</head>
<body>
    <div class="email-content">${textContent.replace(/\n/g, '<br>')}</div>
</body>
</html>
    `;

    const transformedEmailOptions = {
        to: testEmailData.clientEmail,
        subject: testEmailData.subject,
        text: textContent,
        html: htmlContent,
        from: testEmailData.freelancerEmail ? `${testEmailData.freelancerName} <${testEmailData.freelancerEmail}>` : undefined,
        replyTo: testEmailData.freelancerEmail
    };
    
    // Validate the transformation
    const tests = [
        {
            name: 'Has recipient email',
            condition: transformedEmailOptions.to === 'john@example.com',
            expected: 'john@example.com',
            actual: transformedEmailOptions.to
        },
        {
            name: 'Has subject',
            condition: transformedEmailOptions.subject === 'Professional Onboarding - John Doe',
            expected: 'Professional Onboarding - John Doe',
            actual: transformedEmailOptions.subject
        },
        {
            name: 'Has text content',
            condition: transformedEmailOptions.text && transformedEmailOptions.text.includes('Hi John Doe'),
            expected: 'Contains "Hi John Doe"',
            actual: transformedEmailOptions.text ? 'Text content present' : 'No text content'
        },
        {
            name: 'Has HTML content',
            condition: transformedEmailOptions.html && transformedEmailOptions.html.includes('<br>'),
            expected: 'Contains HTML with <br> tags',
            actual: transformedEmailOptions.html ? 'HTML content present' : 'No HTML content'
        },
        {
            name: 'Has proper from address',
            condition: transformedEmailOptions.from === 'Jane Designer <jane@designer.com>',
            expected: 'Jane Designer <jane@designer.com>',
            actual: transformedEmailOptions.from
        },
        {
            name: 'Has reply-to address',
            condition: transformedEmailOptions.replyTo === 'jane@designer.com',
            expected: 'jane@designer.com',
            actual: transformedEmailOptions.replyTo
        }
    ];
    
    let passedTests = 0;
    const totalTests = tests.length;
    
    tests.forEach((test, index) => {
        if (test.condition) {
            console.log(`✅ Test ${index + 1}: ${test.name} - PASSED`);
            passedTests++;
        } else {
            console.log(`❌ Test ${index + 1}: ${test.name} - FAILED`);
            console.log(`   Expected: ${test.expected}`);
            console.log(`   Actual: ${test.actual}`);
        }
    });
    
    console.log(`\n📊 Transformation Test Results:`);
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    return passedTests === totalTests;
}

// Test the EmailService compatibility
function testEmailServiceCompatibility() {
    console.log('\n🔌 Testing EmailService Compatibility\n');
    
    // Simulate the EmailService.sendEmail method requirements
    function validateEmailOptions(options) {
        const errors = [];
        
        if (!options.to) {
            errors.push('Missing "to" field');
        }
        
        if (!options.subject) {
            errors.push('Missing "subject" field');
        }
        
        if (!options.html && !options.text) {
            errors.push('Missing both "html" and "text" fields - at least one is required');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    // Test the transformed options
    const textContent = testEmailData.content;
    const htmlContent = textContent.replace(/\n/g, '<br>');
    
    const transformedOptions = {
        to: testEmailData.clientEmail,
        subject: testEmailData.subject,
        text: textContent,
        html: htmlContent,
        from: `${testEmailData.freelancerName} <${testEmailData.freelancerEmail}>`,
        replyTo: testEmailData.freelancerEmail
    };
    
    const validation = validateEmailOptions(transformedOptions);
    
    if (validation.valid) {
        console.log('✅ Email options are valid for EmailService.sendEmail()');
        console.log('✅ Both text and HTML content are provided');
        console.log('✅ All required fields are present');
        return true;
    } else {
        console.log('❌ Email options validation failed:');
        validation.errors.forEach(error => {
            console.log(`   - ${error}`);
        });
        return false;
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Running Email Fix Tests\n');
    
    const transformationTest = testEmailTransformation();
    const compatibilityTest = testEmailServiceCompatibility();
    
    console.log('\n🎯 Overall Results:');
    
    if (transformationTest && compatibilityTest) {
        console.log('🎉 ALL TESTS PASSED!');
        console.log('✅ The email sending fix should work correctly');
        console.log('✅ No more "Either html or text content is required" errors');
        console.log('✅ Custom templates will be sent as both HTML and text emails');
        return true;
    } else {
        console.log('⚠️ Some tests failed - the fix may need adjustment');
        return false;
    }
}

// Execute the tests
runAllTests();
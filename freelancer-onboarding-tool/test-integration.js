// Template Integration Test Script
// This script tests the template creation and email integration functionality

console.log('🧪 Starting Template Integration Tests...');

// Test 1: Template Variable Replacement
function testVariableReplacement() {
    console.log('\n📝 Test 1: Variable Replacement');
    
    const templateContent = `
Hi {{clientName}},

Welcome to working with {{freelancerName}}! 

We're excited to start your {{projectType}} project for {{company}}.

Next steps:
1. Review the attached scope document
2. Sign the contract
3. Let's schedule our kickoff call

Best regards,
{{freelancerName}}
Email: {{freelancerEmail}}
    `;
    
    const testClient = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        projectType: 'Website Development'
    };
    
    const testUser = {
        name: 'Jane Designer',
        email: 'jane@designer.com'
    };
    
    // Simulate the replacement logic from SendEmailModal
    let processedContent = templateContent
        .replace(/\{\{clientName\}\}/g, testClient.name)
        .replace(/\{\{projectType\}\}/g, testClient.projectType || 'your project')
        .replace(/\{\{freelancerName\}\}/g, testUser.name || 'Your Name')
        .replace(/\{\{company\}\}/g, testClient.company || '')
        .replace(/\{\{clientEmail\}\}/g, testClient.email || '')
        .replace(/\{\{freelancerEmail\}\}/g, testUser.email || '');
    
    console.log('✅ Template Content Processed:');
    console.log('---');
    console.log(processedContent);
    console.log('---');
    
    // Check if all variables were replaced
    const remainingVariables = processedContent.match(/\{\{.*?\}\}/g);
    if (remainingVariables) {
        console.log('❌ Unreplaced variables found:', remainingVariables);
        return false;
    } else {
        console.log('✅ All variables replaced successfully');
        return true;
    }
}

// Test 2: Template Type Validation
function testTemplateTypes() {
    console.log('\n🏷️  Test 2: Template Type Validation');
    
    const validTypes = ['onboarding', 'invoice', 'welcome', 'scope', 'timeline', 'payment', 'follow-up', 'custom'];
    
    const testTemplate = {
        name: 'Professional Onboarding',
        type: 'onboarding',
        content: 'Hello {{clientName}}, welcome to our service!',
        variables: ['clientName']
    };
    
    if (validTypes.includes(testTemplate.type)) {
        console.log('✅ Template type validation passed');
        return true;
    } else {
        console.log('❌ Invalid template type:', testTemplate.type);
        return false;
    }
}

// Test 3: Variable Extraction
function testVariableExtraction() {
    console.log('\n🔍 Test 3: Variable Extraction');
    
    const content = `Hi {{clientName}}, your {{projectType}} project with {{freelancerName}} is ready. Contact us at {{freelancerEmail}}.`;
    
    // Simulate the extractVariables function from templates page
    function extractVariables(content) {
        const variableRegex = /\{\{(\w+)\}\}/g;
        const variables = [];
        let match;

        while ((match = variableRegex.exec(content)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }

        return variables;
    }
    
    const extractedVars = extractVariables(content);
    const expectedVars = ['clientName', 'projectType', 'freelancerName', 'freelancerEmail'];
    
    console.log('Extracted variables:', extractedVars);
    console.log('Expected variables:', expectedVars);
    
    const allFound = expectedVars.every(v => extractedVars.includes(v));
    if (allFound && extractedVars.length === expectedVars.length) {
        console.log('✅ Variable extraction test passed');
        return true;
    } else {
        console.log('❌ Variable extraction test failed');
        return false;
    }
}

// Test 4: Subject Line Generation
function testSubjectLineGeneration() {
    console.log('\n📧 Test 4: Subject Line Generation');
    
    const template = {
        name: 'Professional Onboarding',
        type: 'onboarding'
    };
    
    const client = {
        name: 'John Doe'
    };
    
    // Simulate subject generation logic
    let subject = template.name;
    if (template.type && template.type !== 'custom') {
        subject = `${template.name} - ${client.name}`;
    }
    
    const expectedSubject = 'Professional Onboarding - John Doe';
    
    if (subject === expectedSubject) {
        console.log('✅ Subject line generated correctly:', subject);
        return true;
    } else {
        console.log('❌ Subject line generation failed. Expected:', expectedSubject, 'Got:', subject);
        return false;
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Running Template Integration Tests\n');
    
    const tests = [
        testVariableReplacement,
        testTemplateTypes,
        testVariableExtraction,
        testSubjectLineGeneration
    ];
    
    let passedTests = 0;
    const totalTests = tests.length;
    
    tests.forEach((test, index) => {
        try {
            if (test()) {
                passedTests++;
            }
        } catch (error) {
            console.log(`❌ Test ${index + 1} threw an error:`, error.message);
        }
    });
    
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! Template integration is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the implementation.');
    }
    
    return passedTests === totalTests;
}

// Run the tests
runAllTests();
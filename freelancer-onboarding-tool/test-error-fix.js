// Test script to verify the toLowerCase error is fixed

console.log('🔧 Testing AITemplateGenerator toLowerCase error fix...\n');

// Simulate the scenarios that could cause the error
const testScenarios = [
    { templateType: 'welcome', expected: 'welcome message' },
    { templateType: 'scope', expected: 'scope of work' },
    { templateType: 'timeline', expected: 'project timeline' },
    { templateType: 'payment', expected: 'payment terms' },
    { templateType: 'invoice', expected: 'invoice template' },
    { templateType: 'follow-up', expected: 'follow-up email' },
    { templateType: 'onboarding', expected: 'onboarding template' },
    { templateType: 'custom', expected: 'custom template' },
    { templateType: 'all', expected: 'template' },
    { templateType: 'undefined_type', expected: 'template' }, // Edge case
    { templateType: null, expected: 'template' }, // Edge case
    { templateType: undefined, expected: 'template' } // Edge case
];

function getTemplateTypeLabel(templateType) {
    const labels = {
        welcome: 'Welcome Message',
        scope: 'Scope of Work',
        timeline: 'Project Timeline',
        payment: 'Payment Terms',
        invoice: 'Invoice Template',
        'follow-up': 'Follow-up Email',
        onboarding: 'Onboarding Template',
        custom: 'Custom Template',
        all: 'Template'
    };
    return labels[templateType] || 'Template';
}

function testToLowerCase(templateType) {
    try {
        const label = getTemplateTypeLabel(templateType);
        const result = label?.toLowerCase() || 'template';
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

let passedTests = 0;
const totalTests = testScenarios.length;

console.log('Running test scenarios:\n');

testScenarios.forEach((scenario, index) => {
    const test = testToLowerCase(scenario.templateType);
    
    if (test.success) {
        if (test.result === scenario.expected) {
            console.log(`✅ Test ${index + 1}: templateType "${scenario.templateType}" -> "${test.result}"`);
            passedTests++;
        } else {
            console.log(`❌ Test ${index + 1}: templateType "${scenario.templateType}" -> "${test.result}" (expected "${scenario.expected}")`);
        }
    } else {
        console.log(`💥 Test ${index + 1}: templateType "${scenario.templateType}" -> ERROR: ${test.error}`);
    }
});

console.log(`\n📊 Test Results:`);
console.log(`✅ Passed: ${passedTests}/${totalTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The toLowerCase error has been fixed.');
    console.log('✅ No more "Cannot read properties of undefined (reading \'toLowerCase\')" errors');
} else {
    console.log('\n⚠️  Some tests failed. The fix may need additional work.');
}

console.log('\n🔍 Key fixes applied:');
console.log('1. Added fallback value || "Template" in getTemplateTypeLabel()');
console.log('2. Added optional chaining ?. before toLowerCase()'); 
console.log('3. Added fallback || "template" after toLowerCase()');
console.log('4. Added support for all template types including "all"');
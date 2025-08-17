'use client';

import { useState } from 'react';
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export function EmailTester() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testEmailService = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setResult({ success: data.success, message: data.message });
    } catch {
      setResult({ success: false, message: 'Failed to test email service' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <EnvelopeIcon className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Email Service</h3>
        </div>
        <button
          onClick={testEmailService}
          disabled={testing}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Email'}
        </button>
      </div>
      
      {result && (
        <div className={`flex items-center mt-2 p-2 rounded text-sm ${
          result.success 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {result.success ? (
            <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <XCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          {result.message}
        </div>
      )}
      
      {!result && !testing && (
        <p className="text-xs text-gray-500 mt-2">
          Click to test if Resend email service is configured correctly
        </p>
      )}
    </div>
  );
}
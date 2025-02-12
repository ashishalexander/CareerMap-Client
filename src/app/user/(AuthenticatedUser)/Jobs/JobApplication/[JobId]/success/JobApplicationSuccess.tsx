import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, Mail, Home, FileText, Building } from 'lucide-react';

export default function JobApplicationSuccess({ jobTitle = "", company = "", email = "" }) {
  const steps = [
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: "Application Review",
      description: "Our hiring team will review your application and get back to you within 5-7 business days."
    },
    {
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      title: "Initial Screening",
      description: "If your profile matches our requirements, our HR team will reach out to schedule an initial screening."
    },
    {
      icon: <Mail className="w-5 h-5 text-blue-600" />,
      title: "Keep an Eye on Your Inbox",
      description: `We've sent a confirmation to ${email}. You'll receive updates about your application status via email.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Application Submitted!</h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Building className="w-5 h-5" />
            <p className="text-lg">
              {jobTitle} at {company}
            </p>
          </div>
        </div>

        {/* Next Steps Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              What happens next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">{step.icon}</div>
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}

            <div className="pt-6 space-y-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full h-11 text-base"
                onClick={() => window.location.href = '/user/AuthenticatedUser/Jobs'}
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Job Listings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Questions or concerns? Contact our support team at{' '}
            <a 
              href="mailto:support@company.com" 
              className="text-blue-600 hover:text-blue-800"
            >
              support@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
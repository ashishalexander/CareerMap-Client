import React from 'react';

export const WelcomeSection: React.FC = () => (
  <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-400 to-indigo-700 p-12 text-white">
    <div className="h-full flex flex-col justify-between">
      <div>
        <h2 className="text-4xl font-bold mb-6">Welcome to CareerMap</h2>
        <p className="text-lg mb-8">
          Your journey to professional success starts here. Join thousands of professionals who&apos;ve found their dream careers through CareerMap.
        </p>
        <ul className="space-y-4">
          {[
            "Personalized job recommendations",
            "Network with industry leaders",
            "Access exclusive career resources",
          ].map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <p className="text-sm opacity-80">
          &quot;CareerMap transformed my job search. I found my dream role within weeks!&quot; - Sarah Johnson, Software Engineer
        </p>
      </div>
    </div>
  </div>
);
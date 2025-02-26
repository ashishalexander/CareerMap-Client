export const WelcomeSection: React.FC = () => {
    return (
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-700 p-12">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Welcome to CareerMap</h2>
            <p className="text-white text-lg mb-8">
              Sign in to access your personalized career dashboard and continue your professional journey.
            </p>
            <ul className="space-y-4 text-white">
              {[
                "Access your saved job searches",
                "Track your application status",
                "Connect with recruiters",
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
            <p className="italic text-white opacity-80">
              &quot;CareerMap has revolutionized how I approach my job search. The personalized recommendations are spot-on!&quot; - Michael Chen, Product Manager
            </p>
          </div>
        </div>
      </div>
    );
  };
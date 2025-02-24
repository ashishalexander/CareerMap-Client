import { Metadata } from 'next';
import SubscriptionDashboard from './components/subscriptionDashboard';

export const metadata: Metadata = {
  title: 'Subscription Dashboard | Your App Name',
  description: 'View and manage your subscription details and transaction history',
};

export default async function SubscriptionPage() {
  
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Subscription Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage your subscription and view transaction history
              </p>
            </div>
          </div>

          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-gray-700">
                  Dashboard
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-900 font-medium">Subscription</li>
            </ol>
          </nav>

          <div className="mt-8">
            <SubscriptionDashboard />
          </div>
        </div>
      </div>
    </main>
  );
}
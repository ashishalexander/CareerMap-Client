
import { Metadata } from 'next';
import { ReportsList } from './ReportsList';

export const metadata: Metadata = {
  title: 'Content Moderation Reports',
  description: 'Review and manage content moderation reports',
};

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage reported content from users
        </p>
      </div>
      
      <ReportsList />
    </div>
  );
}
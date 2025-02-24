"use client"
import { Suspense } from 'react';
import { ContentModerationHeader } from './components/ContentModerationHeader';
import { ReportsList } from './components/ReportsList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';


export default function ContentModerationPage() {
  return (
    <div className="container mx-auto py-2 max-w-7xl">
      <ContentModerationHeader />
      
      <ErrorBoundary fallback={<div>Something went wrong loading the reports. Please try again.</div>}>
        <Suspense fallback={<LoadingSpinner />}>
          <ReportsList />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

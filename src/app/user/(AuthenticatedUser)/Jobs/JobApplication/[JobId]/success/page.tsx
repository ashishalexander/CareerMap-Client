// success/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import JobApplicationSuccess from './JobApplicationSuccess';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  
  // Get the URL parameters
  const jobTitle = searchParams.get('jobTitle') || '';
  const company = searchParams.get('company') || '';
  const email = searchParams.get('email') || '';

  return (
    <JobApplicationSuccess 
      jobTitle={jobTitle}
      company={company}
      email={email}
    />
  );
}
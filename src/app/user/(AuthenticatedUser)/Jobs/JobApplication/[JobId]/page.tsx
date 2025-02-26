'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { JobApplicationForm } from '../JobApplication';
import { IJob } from '../../Types/Job';
import api from '../../../../../lib/axios-config';
import { useAppSelector} from '@/app/store/store';
import type {RootState} from '../../../../../store/store'

export default function JobApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.JobId as string;
  
  const [job, setJob] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isapplied, setIsApplied] = useState<boolean>(false)
  const user = useAppSelector((state:RootState)=>state.auth.user)
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get<IJob>(`/api/users/jobsById/${jobId}`);
        setJob(response.data);
        const responseboolean = await api.get<boolean>(`/api/users/isApplied/${user?._id}/${jobId}`)
        setIsApplied(responseboolean.data)
      } catch (err) {
        setError('Failed to load job details');
        console.error('Error fetching job:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleSubmit = async (formData: any) => {
    try {
      const submitData = new FormData();
      submitData.append('jobId', jobId);
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'resume') {
          submitData.append('Resumes', formData.resume);
        } else {
          submitData.append(key, JSON.stringify(formData[key]));
        }
      });

      await api.post(`/api/users/application/submit/${jobId}/${user?._id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to success page
      const successUrl = `/user/AuthenticatedUser/Jobs/JobApplication/${jobId}/success?` + 
      new URLSearchParams({
        jobTitle: job?.title|| '',
        company: job?.company || '',
        email: formData.email
      }).toString();
      router.push(successUrl);

  } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-500">{error || 'Job not found'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Job Details
          </button>
        </nav>
        
        <JobApplicationForm 
          job={job} 
          onSubmit={handleSubmit}
          hasapplied = {isapplied}
        />
      </div>
    </div>
  );
}



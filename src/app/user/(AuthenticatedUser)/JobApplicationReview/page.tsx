'use client'
import { useEffect, useState } from 'react';
import JobApplicationsViewer from './components/JobApplicationsViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { Loader2, Briefcase, MapPin, Clock } from 'lucide-react';
import api from '../../../lib/axios-config';
import { RootState, useAppSelector } from '@/app/store/store';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

export default function JobApplicationsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [error, setError] = useState('');
  const {user} = useAppSelector((state:RootState)=>state.auth);

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get<Job[]>(`api/users/jobs/recruiter/${user?._id}`);
      
      if (response.data && response.data.length > 0) {
        setJobs(response.data);
        setSelectedJob(response.data[0]._id);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-50">
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center">
          <CardContent className="p-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Jobs Posted</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t posted any jobs yet.</p>
            <button
              onClick={() => router.push('/jobs/create')}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Post Your First Job
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Job Applications Dashboard</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total Jobs: {jobs.length}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs 
        defaultValue={jobs[0]._id} 
        value={selectedJob || undefined} 
        onValueChange={setSelectedJob}
        className="space-y-6"
      >
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <TabsList className="w-full h-auto flex-wrap gap-2 bg-transparent">
            {jobs.map(job => (
              <TabsTrigger
                key={job._id}
                value={job._id}
                className="flex-1 min-w-[200px] p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
              >
                <div className="text-left w-full">
                  <p className="font-medium truncate">{job.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span className="truncate">{job.company}</span>
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {jobs.map(job => (
          <TabsContent key={job._id} value={job._id} className="mt-6">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company</p>
                      <p className="font-medium">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Job Type</p>
                      <p className="font-medium">{job.type}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <JobApplicationsViewer jobId={job._id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
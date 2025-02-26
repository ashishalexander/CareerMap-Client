"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Mail, Download, User, Loader2 } from 'lucide-react';
import api from '../../../../lib/axios-config';

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Application {
  _id: string;
  fullName: string;
  email: string;
  appliedAt: string;
  resumeUrl: string;
  coverLetter?: string;
  education: Education[];
  experience: Experience[];
  customAnswers?: Record<string, string>;
}

interface JobApplicationsViewerProps {
  jobId: string;
}

const JobApplicationsViewer: React.FC<JobApplicationsViewerProps> = ({ jobId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchApplications();
  }, [jobId, page]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get<{
          applications: Application[];
          total: number;
      }>(`api/users/applications/job/${jobId}`, {
        params: { page }
      });

      setApplications(response.data.applications);
      setTotalPages(Math.ceil(response.data.total / 10));
      setTotalApplications(response.data.total);
      setError('');
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const ApplicationCard: React.FC<{ application: Application }> = ({ application }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">{application.fullName}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <a 
                href={`mailto:${application.email}`} 
                className="text-blue-600 hover:text-blue-800"
              >
                {application.email}
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Applied on: {new Date(application.appliedAt).toLocaleDateString()}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => window.open(application.resumeUrl)}
          >
            <Download className="w-4 h-4 mr-2" />
            Resume
          </Button>
        </div>

        {application.coverLetter && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Cover Letter</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-medium mb-2">Education</h4>
          {application.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">{edu.institution}</p>
              <p className="text-sm text-gray-600">
                {edu.degree} in {edu.field}
                {edu.startDate && edu.endDate && ` (${edu.startDate} - ${edu.endDate})`}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Experience</h4>
          {application.experience.map((exp, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">{exp.company}</p>
              <p className="text-sm text-gray-600">
                {exp.position}
                {exp.startDate && exp.endDate && ` (${exp.startDate} - ${exp.endDate})`}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
              )}
            </div>
          ))}
        </div>

        {application.customAnswers && Object.keys(application.customAnswers).length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Additional Information</h4>
            {Object.entries(application.customAnswers).map(([question, answer], index) => (
              <div key={index} className="mb-2">
                <p className="text-sm font-medium">{question}</p>
                <p className="text-sm text-gray-600">{answer}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="p-6 text-center text-red-600">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CardHeader className="mb-6">
        <CardTitle className="flex justify-between items-center">
          <span>Job Applications</span>
          <span className="text-gray-500 text-base font-normal">
            Total Applications: {totalApplications}
          </span>
        </CardTitle>
      </CardHeader>

      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="py-2 px-4 bg-gray-100 rounded">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsViewer;
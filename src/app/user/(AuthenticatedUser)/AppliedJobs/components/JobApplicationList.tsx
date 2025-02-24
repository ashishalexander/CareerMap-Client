import { useState } from 'react';
import { JobApplicationCard } from './JobApplicationCard';
import { ApplicationDetailsModal } from './ApplicationDetailsModal';
import { useJobApplications } from '../Hooks/useJobApplications';
import { JobApplication } from '../Types/JobApplication';

export const JobApplicationsList = () => {
  const { data: applications, isLoading, error } = useJobApplications();
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading applications</div>;
  if (!applications?.length) return <div>No applications found</div>;

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <JobApplicationCard 
          key={application._id} 
          application={application}
          onViewDetails={setSelectedApplication}
        />
      ))}

      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  );
};

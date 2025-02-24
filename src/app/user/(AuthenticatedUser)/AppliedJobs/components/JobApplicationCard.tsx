import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JobApplication } from '../Types/JobApplication';

interface JobApplicationCardProps {
  application: JobApplication;
  onViewDetails: (application: JobApplication) => void;
}

export const JobApplicationCard = ({ application, onViewDetails }: JobApplicationCardProps) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{application.jobId.title}</h3>
            <p className="text-gray-600">{application.jobId.company}</p>
          </div>
          <div className="text-sm text-gray-500">
            Applied: {new Date(application.appliedAt).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a 
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Resume
            </a>
            <span className="text-sm text-gray-600">{application.jobId.location}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => onViewDetails(application)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JobApplication } from '../Types/JobApplication';

interface ApplicationDetailsModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationDetailsModal = ({ application, isOpen, onClose }: ApplicationDetailsModalProps) => {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{application.jobId.title} at {application.jobId.company}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Job Details</h3>
            <p className="text-sm text-gray-600">{application.jobId.description}</p>
            <p className="text-sm mt-2">
              <span className="font-medium">Location:</span> {application.jobId.location}
            </p>
            <p className="text-sm">
              <span className="font-medium">Type:</span> {application.jobId.type}
            </p>
          </div>

          {application.coverLetter && (
            <div>
              <h3 className="font-semibold mb-2">Cover Letter</h3>
              <p className="text-sm text-gray-600">{application.coverLetter}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Education</h3>
            {application.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm font-medium">{edu.degree} in {edu.field}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </p>
              </div>
            ))}
          </div>

          {application.experience && application.experience.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              {application.experience.map((exp, index) => (
                <div key={index} className="mb-2">
                  <p className="text-sm font-medium">{exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Application Details</h3>
            <p className="text-sm">
              <span className="font-medium">Applied:</span>{' '}
              {new Date(application.appliedAt).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <span className="font-medium">Resume:</span>{' '}
              <a 
                href={application.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View Resume
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
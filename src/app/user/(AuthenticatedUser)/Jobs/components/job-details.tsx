import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IJob } from '../Types/Job';
import { useRouter } from 'next/navigation';

interface JobDetailsProps {
  job: IJob;
}

export function JobDetails({ job }: JobDetailsProps) {
  const router = useRouter();
  
  const handleApply = () => {
    router.push(`/user/Jobs/JobApplication/${job._id}`);
  };

  // Format the requirements text into a proper list
  const formatRequirements = (requirements: string) => {
    // Split by newline or bullet points
    const reqList = requirements
      .split(/[\n•-]/)
      .map(req => req.trim())
      .filter(req => req.length > 0);

    return reqList;
  };

  // Format description text to handle paragraphs
  const formatDescription = (description: string) => {
    return description
      .split('\n')
      .map(para => para.trim())
      .filter(para => para.length > 0);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl text-gray-700">{job.company}</p>
          <p className="text-gray-600">{job.location}</p>
        </div>
        <p className="text-gray-500">{job.type}</p>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description Section */}
          <div className="space-y-4">
            {formatDescription(job.description).map((para, index) => (
              <p key={index} className="text-gray-700 break-words">
                {para}
              </p>
            ))}
          </div>

          {/* Requirements Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            <ul className="list-disc pl-5 space-y-2">
              {formatRequirements(job.requirements).map((req, index) => (
                <li key={index} className="text-gray-700 break-words">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        {/* Footer Section */}
        <CardFooter className="justify-between border-t pt-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold">Salary: {job.salary}</p>
            <p className="text-gray-500">Contact: {job.contactEmail}</p>
          </div>
          <Button onClick={handleApply}>Apply Now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
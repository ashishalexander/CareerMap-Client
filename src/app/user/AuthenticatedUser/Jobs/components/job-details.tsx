import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IJob } from '../Types/Job';

interface JobDetailsProps {
  job: IJob;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl text-gray-700">{job.company}</p>
          <p className="text-gray-600">{job.location}</p>
        </div>
        <p className="text-gray-500">{job.type}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{job.description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                {/* Split the requirements string into lines */}
                {job.requirements
                  .split('\n')
                  .map((req, index) => (
                    <li key={index}>{req.trim()}</li>
                  ))}
              </ul>
            </div>
            {/* {job.skills && (
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div>
            <p className="text-lg font-semibold">Salary: {job.salary}</p>
            <p className="text-gray-500">Contact: {job.contactEmail}</p>
          </div>
          <Button>Apply Now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

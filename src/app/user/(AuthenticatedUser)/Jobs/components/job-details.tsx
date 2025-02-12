import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IJob } from '../Types/Job';
import { useRouter } from 'next/navigation';
interface JobDetailsProps {
  job: IJob;
}

export function JobDetails({ job }: JobDetailsProps) {
  const router = useRouter()
  const handleApply = ()=>{
    router.push(`/user/AuthenticatedUser/Jobs/JobApplication/${job._id}`)
  }
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
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div>
            <p className="text-lg font-semibold">Salary: {job.salary}</p>
            <p className="text-gray-500">Contact: {job.contactEmail}</p>
          </div>
          <Button onClick={handleApply}>Apply Now</Button>
        </CardFooter>
      </Card> 
    </div>
  );
}

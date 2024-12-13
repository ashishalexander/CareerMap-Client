export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    salaryRange: string;
    skills: string[];
}
  
export interface JobsResponse {
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
  }
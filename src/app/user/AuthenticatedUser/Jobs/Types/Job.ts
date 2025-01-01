export interface IJob  {
    _id:string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    requirements: string;
    salary?: string;
    contactEmail: string;
    recruiter: string; 
    createdAt: Date;
    updatedAt: Date;
    customQuestions?: Array<{
      question: string;
      type: string;      // 'text' | 'multiple-choice'
      options?: string[];
  }>;
  }
  
  
export interface JobsResponse {
    jobs: IJob[];
    total: number;
    page: number;
    totalPages: number;
  }
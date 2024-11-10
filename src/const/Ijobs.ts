export interface ICompany {
    id: string;
    name: string;
    logoUrl: string;
    location: string;  // e.g., city, state, or "Remote"
    industry?: string;  // Optional: industry of the company
    website?: string;
  }
  
  export interface IJob {
    id: string;
    title: string;  // Job title, e.g., "Software Engineer"
    company: ICompany;  // Information about the company
    location: string;  // Job location, e.g., city, state, or "Remote"
    employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary";  // Type of employment
    description: string;  // Detailed job description
    responsibilities?: string[];  // Optional: List of job responsibilities
    requirements: string[];  // List of job requirements or qualifications
    skills: string[];  // Required skills for the job
    postedAt: Date;  // Date when the job was posted
    validUntil?: Date;  // Optional: Expiration date for the job posting
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
      frequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
    };  // Optional: Salary information
  
    benefits?: string[];  // Optional: List of benefits offered
    experienceLevel: "Entry-level" | "Mid-level" | "Senior" | "Executive";  // Required experience level
    educationLevel?: "High School" | "Associate Degree" | "Bachelor's Degree" | "Master's Degree" | "Doctorate";  // Optional: Required education level
  
    application: {
      applyUrl?: string;  // URL to apply for the job
      applicationDeadline?: Date;  // Optional: Application deadline
      status: "Open" | "Closed";  // Current job status
    };
  
    recruiterId: string;  // ID of the recruiter or hiring manager posting the job
    jobCategory?: string;  // Optional: Category, e.g., "Engineering", "Marketing", etc.
    applicants?: IApplicant[];  // Optional: List of applicants for the job
  }
  
  interface IApplicant {
    userId: string;
    appliedAt: Date;
    resumeUrl?: string;  // Optional: URL of the applicant's resume
    coverLetter?: string;  // Optional: Applicant's cover letter
    applicationStatus: "Pending" | "Reviewed" | "Interviewing" | "Rejected" | "Accepted";
  }
  
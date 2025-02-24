export interface JobApplication {
    _id: string;
    jobId: {
      _id: string;
      title: string;
      company: string;
      location: string;
      description: string;
      type: string;
    };
    status: "pending";
    appliedAt: string;
    resumeUrl: string;
    coverLetter?: string;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
    }>;
    experience?: Array<{
      company?: string;
      position?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>;
  }

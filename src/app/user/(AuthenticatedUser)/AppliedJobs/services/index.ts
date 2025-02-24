import { JobApplication } from '../Types/JobApplication';
import { api } from '../../../../lib/axios-config';

export const fetchUserApplications = async (): Promise<JobApplication[]> => {
    const response = await api.get<JobApplication[]>('/api/users/job-applications');
    return response.data; 
  };    
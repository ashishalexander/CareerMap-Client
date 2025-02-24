import { useQuery } from '@tanstack/react-query';
import { fetchUserApplications } from '../services/index';

export const useJobApplications = () => {
  return useQuery({
    queryKey: ['userApplications'],
    queryFn: fetchUserApplications,
  });
};

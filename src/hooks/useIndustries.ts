
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Industry {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export const useIndustries = () => {
  return useQuery({
    queryKey: ['industries'],
    queryFn: async (): Promise<Industry[]> => {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching industries:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};

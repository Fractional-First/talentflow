
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Timezone {
  id: string;
  value: string;
  abbr: string;
  utc_offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
}

export const useTimezones = () => {
  return useQuery({
    queryKey: ['timezones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timezones')
        .select('*')
        .order('utc_offset', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as Timezone[];
    }
  });
};

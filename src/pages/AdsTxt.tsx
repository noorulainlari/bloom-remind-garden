
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AdsTxt = () => {
  const [adsTxtContent, setAdsTxtContent] = useState('');

  useEffect(() => {
    loadAdsTxtContent();
  }, []);

  const loadAdsTxtContent = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('ads_txt')
        .limit(1);

      if (error) {
        console.error('Error loading ads.txt:', error);
        return;
      }

      // Use the first row if it exists
      if (data && data.length > 0) {
        setAdsTxtContent(data[0]?.ads_txt || '');
      }
    } catch (error) {
      console.error('Error loading ads.txt:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      {adsTxtContent || '# ads.txt content will appear here when configured by admin'}
    </div>
  );
};

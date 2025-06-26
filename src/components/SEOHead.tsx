
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SEOHead = () => {
  const [settings, setSettings] = useState<{
    adsense_code: string;
    analytics_code: string;
  }>({
    adsense_code: '',
    analytics_code: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('adsense_code, analytics_code')
        .limit(1)
        .single();

      if (error) {
        console.error('Error loading SEO settings:', error);
        return;
      }

      if (data) {
        setSettings({
          adsense_code: data.adsense_code || '',
          analytics_code: data.analytics_code || ''
        });
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
    }
  };

  useEffect(() => {
    // Inject AdSense code
    if (settings.adsense_code && !document.querySelector('[data-adsense-injected]')) {
      const adsenseScript = document.createElement('div');
      adsenseScript.innerHTML = settings.adsense_code;
      adsenseScript.setAttribute('data-adsense-injected', 'true');
      document.head.appendChild(adsenseScript);
    }

    // Inject Analytics code
    if (settings.analytics_code && !document.querySelector('[data-analytics-injected]')) {
      const analyticsScript = document.createElement('div');
      analyticsScript.innerHTML = settings.analytics_code;
      analyticsScript.setAttribute('data-analytics-injected', 'true');
      document.head.appendChild(analyticsScript);
    }
  }, [settings]);

  return null;
};

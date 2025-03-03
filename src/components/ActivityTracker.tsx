import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ActivityTrackerProps {
  userId: string;
  documentId?: string;
  type: 'view' | 'download' | 'login';
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({ userId, documentId, type }) => {
  useEffect(() => {
    const trackActivity = async () => {
      try {
        if (type === 'view' && documentId) {
          await supabase.from('document_views').insert({
            user_id: userId,
            document_id: documentId
          });
        } else if (type === 'download' && documentId) {
          await supabase.from('downloads').insert({
            user_id: userId,
            document_id: documentId
          });
        } else if (type === 'login') {
          await supabase.from('user_sessions').insert({
            user_id: userId,
            ip_address: 'client-ip', // In a real app, you'd get this from the request
            user_agent: navigator.userAgent
          });
        }
      } catch (error) {
        console.error(`Error tracking ${type}:`, error);
      }
    };

    trackActivity();
  }, [userId, documentId, type]);

  return null; // This is a utility component that doesn't render anything
};

export default ActivityTracker;
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserStats {
  id: string;
  name: string;
  email: string;
  downloads: number;
  logins: number;
  views: number;
  lastActive: string;
}

interface StatisticsData {
  downloads: any[];
  logins: any[];
  views: any[];
  userStats: UserStats[];
  isLoading: boolean;
  error: Error | null;
}

export const useStatistics = (dateRange?: [Date | null, Date | null]) => {
  const [data, setData] = useState<StatisticsData>({
    downloads: [],
    logins: [],
    views: [],
    userStats: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        let downloadsQuery = supabase.from('downloads').select('*');
        let loginsQuery = supabase.from('user_sessions').select('*');
        let viewsQuery = supabase.from('document_views').select('*');
        
        // Apply date filters if provided
        if (dateRange && dateRange[0] && dateRange[1]) {
          const startDate = dateRange[0].toISOString();
          const endDate = dateRange[1].toISOString();
          
          downloadsQuery = downloadsQuery.gte('created_at', startDate).lte('created_at', endDate);
          loginsQuery = loginsQuery.gte('created_at', startDate).lte('created_at', endDate);
          viewsQuery = viewsQuery.gte('created_at', startDate).lte('created_at', endDate);
        }
        
        // Execute queries in parallel
        const [downloadsRes, loginsRes, viewsRes, usersRes] = await Promise.all([
          downloadsQuery,
          loginsQuery,
          viewsQuery,
          supabase.from('users').select('*')
        ]);
        
        if (downloadsRes.error) throw downloadsRes.error;
        if (loginsRes.error) throw loginsRes.error;
        if (viewsRes.error) throw viewsRes.error;
        if (usersRes.error) throw usersRes.error;
        
        const downloadsData = downloadsRes.data || [];
        const loginsData = loginsRes.data || [];
        const viewsData = viewsRes.data || [];
        const usersData = usersRes.data || [];
        
        // Process user statistics
        const userStats = usersData.map(user => {
          const userDownloads = downloadsData.filter(d => d.user_id === user.id).length;
          const userLogins = loginsData.filter(l => l.user_id === user.id).length;
          const userViews = viewsData.filter(v => v.user_id === user.id).length;
          
          return {
            id: user.id,
            name: user.name || user.email,
            email: user.email,
            downloads: userDownloads,
            logins: userLogins,
            views: userViews,
            lastActive: user.last_sign_in_at || 'N/A'
          };
        });
        
        setData({
          downloads: downloadsData,
          logins: loginsData,
          views: viewsData,
          userStats,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error
        }));
      }
    };
    
    fetchStatistics();
  }, [dateRange]);
  
  return data;
};
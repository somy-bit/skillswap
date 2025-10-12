import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Stats {
  totalConnections: number;
  thisWeekSessions: number;
  lastWeekSessions: number;
  sessionDifference: number;
  unreadMessages: number;
}

interface UseStatsReturn {
  data: Stats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStats(): UseStatsReturn {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const stats = await response.json();
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchStats();
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}

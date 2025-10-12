import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Connection {
  id: string;
  connectedUserId: string;
  connectedAt: any;
}

interface ConnectionRequest {
  id: string;
  senderId?: string;
  receiverId?: string;
  sentAt: any;
}

interface UseConnectionsReturn {
  connections: Connection[];
  sentRequests: ConnectionRequest[];
  receivedRequests: ConnectionRequest[];
  loading: boolean;
  error: string | null;
  sendConnectionRequest: (receiverId: string) => Promise<void>;
  acceptConnection: (connectionId: string) => Promise<void>;
  rejectConnection: (connectionId: string) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
  refetch: () => void;
}

export function useConnections(): UseConnectionsReturn {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const response = await fetch('/api/connections', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch connections');
      }

      const data = await response.json();
      setConnections(data.connections);
      setSentRequests(data.sentRequests);
      setReceivedRequests(data.receivedRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (receiverId: string) => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send connection request');
      }

      fetchConnections(); // Refresh data
    } catch (err) {
      throw err;
    }
  };

  const acceptConnection = async (connectionId: string) => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept connection');
      }

      fetchConnections(); // Refresh data
    } catch (err) {
      throw err;
    }
  };

  const rejectConnection = async (connectionId: string) => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject connection');
      }

      fetchConnections(); // Refresh data
    } catch (err) {
      throw err;
    }
  };

  const removeConnection = async (connectionId: string) => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove connection');
      }

      fetchConnections(); // Refresh data
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchConnections();
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    connections,
    sentRequests,
    receivedRequests,
    loading,
    error,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    removeConnection,
    refetch: fetchConnections,
  };
}

'use client';
import { useState } from 'react';
import { useConnections } from '@/lib/hooks/useConnections';
import { UserPlus, UserCheck, Clock, UserX } from 'lucide-react';

interface ConnectionButtonProps {
  userId: string;
  className?: string;
}

export function ConnectionButton({ userId, className = '' }: ConnectionButtonProps) {
  const { connections, sentRequests, sendConnectionRequest } = useConnections();
  const [isLoading, setIsLoading] = useState(false);

  // Check connection status
  const isConnected = connections.some(conn => conn.connectedUserId === userId);
  const hasPendingRequest = sentRequests.some(req => req.receiverId === userId);

  const handleConnect = async () => {
    if (isConnected || hasPendingRequest || isLoading) return;

    try {
      setIsLoading(true);
      await sendConnectionRequest(userId);
    } catch (error) {
      console.error('Failed to send connection request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg ${className}`}
      >
        <UserCheck size={16} />
        Connected
      </button>
    );
  }

  if (hasPendingRequest) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg ${className}`}
      >
        <Clock size={16} />
        Pending
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 ${className}`}
    >
      <UserPlus size={16} />
      {isLoading ? 'Connecting...' : 'Connect'}
    </button>
  );
}

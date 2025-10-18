'use client';
import { useState } from 'react';
import { useConnections } from '@/lib/hooks/useConnections';
import { UserPlus, UserCheck, Clock, UserX } from 'lucide-react';

interface ConnectionButtonProps {
  userId: string;
  className?: string;
}

export function ConnectionButton({ userId, className = '' }: ConnectionButtonProps) {
  const { connections, sentRequests, sendConnectionRequest, removeConnection } = useConnections();
  const [isLoading, setIsLoading] = useState(false);

  // Check connection status
  const connection = connections.find(conn => conn.connectedUserId === userId);
  const isConnected = !!connection;
  const hasPendingRequest = sentRequests.some(req => req.receiverId === userId);

  const handleConnect = async () => {
    if (hasPendingRequest || isLoading) return;

    try {
      setIsLoading(true);
      await sendConnectionRequest(userId);
    } catch (error) {
      console.error('Failed to send connection request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connection || isLoading) return;

    try {
      setIsLoading(true);
      await removeConnection(connection.id);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <button
        onClick={handleDisconnect}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg disabled:opacity-50 ${className}`}
      >
        <UserX size={16} />
        {isLoading ? 'Disconnecting...' : 'Disconnect'}
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

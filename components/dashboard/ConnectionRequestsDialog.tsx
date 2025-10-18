'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Check, UserPlus } from 'lucide-react';

interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  sentAt: any;
}

interface ConnectionRequestsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestHandled: () => void;
}

export default function ConnectionRequestsDialog({ isOpen, onClose, onRequestHandled }: ConnectionRequestsDialogProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchRequests();
    }
  }, [isOpen, user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/connections', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.receivedRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/connections/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== requestId));
        onRequestHandled();
        if (action === 'accept') {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error handling request:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connection Requests</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {request.senderName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{request.senderName}</p>
                    <p className="text-sm text-gray-500">Wants to connect</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRequest(request.id, 'accept')}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRequest(request.id, 'reject')}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { ArrowRightLeft, Clock, Inbox } from 'lucide-react';

type SwapRequest = {
  id: string;
  sessionId: string;
  requesterId: string;
  targetSessionId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: Date;
};

interface ReceivedRequestsTabProps {
  requests: SwapRequest[];
  onSwapResponse: (requestId: string, action: 'accept' | 'reject') => void;
}

export const ReceivedRequestsTab: React.FC<ReceivedRequestsTabProps> = ({
  requests,
  onSwapResponse
}) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-16 animate-in bounce-in">
        <div className="relative">
          <Inbox className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">0</span>
          </div>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No received requests</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          When others want to swap sessions with you, they'll appear here
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Stay tuned for incoming requests</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ArrowRightLeft className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Incoming Swap Request</h3>
            </div>
            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => onSwapResponse(request.id, 'accept')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button 
                  onClick={() => onSwapResponse(request.id, 'reject')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4">{request.message}</p>
        </div>
      ))}
    </div>
  );
};

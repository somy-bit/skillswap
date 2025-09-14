import { Session } from '@/types/type';

export const getTimeUntilSession = (date: string, startTime: string) => {
  const sessionDateTime = new Date(`${date}T${startTime}`);
  const now = new Date();
  const diff = sessionDateTime.getTime() - now.getTime();
  
  if (diff <= 0) return { canJoin: true, timeLeft: '' };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    canJoin: false,
    timeLeft: `${days}d ${hours}h ${minutes}m`
  };
};

export const handleSessionAction = async (
  sessionId: string, 
  action: 'accept' | 'reject' | 'cancel' | 'delete' | 'archive',
  user: any,
  onSuccess: (sessionId: string, action: string) => void,
  onError: (message: string) => void
) => {
  try {
    if (!user) return;
    
    const token = await user.getIdToken();
    const response = await fetch('/api/sessions', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sessionId, action })
    });

    if (response.ok) {
      onSuccess(sessionId, action);
    } else {
      onError(`Failed to ${action} session`);
    }
  } catch (error) {
    onError(`Failed to ${action} session`);
  }
};

export const handleSwapRequest = async (
  selectedSession: Session,
  swapMessage: string,
  user: any,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  if (!selectedSession || !swapMessage.trim() || !user) return;

  try {
    const token = await user.getIdToken();
    const response = await fetch('/api/swap-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sessionId: selectedSession.id,
        targetSessionId: selectedSession.id,
        message: swapMessage
      })
    });

    if (response.ok) {
      onSuccess();
    } else {
      onError('Failed to send swap request');
    }
  } catch (error) {
    onError('Failed to send swap request');
  }
};

export const handleSwapResponse = async (
  requestId: string,
  action: 'accept' | 'reject',
  user: any,
  onSuccess: (requestId: string, action: string) => void,
  onError: (message: string) => void
) => {
  try {
    if (!user) return;
    
    const token = await user.getIdToken();
    const response = await fetch('/api/swap-requests', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ requestId, action })
    });

    if (response.ok) {
      onSuccess(requestId, action);
    } else {
      onError(`Failed to ${action} swap request`);
    }
  } catch (error) {
    onError(`Failed to ${action} swap request`);
  }
};

export const handleCancelSwapRequest = async (
  requestId: string,
  user: any,
  onSuccess: (requestId: string) => void,
  onError: (message: string) => void
) => {
  try {
    if (!user) return;
    
    const token = await user.getIdToken();
    const response = await fetch('/api/swap-requests', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ requestId })
    });

    if (response.ok) {
      onSuccess(requestId);
    } else {
      onError('Failed to cancel swap request');
    }
  } catch (error) {
    onError('Failed to cancel swap request');
  }
};

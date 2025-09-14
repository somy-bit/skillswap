'use client';

import { useEffect, useState } from 'react';
import { SessionWithProfile, Session } from '@/types/type';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Inbox, Calendar, ArrowRightLeft, X, Clock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  handleSessionAction as sessionActionUtil,
  handleSwapRequest as swapRequestUtil,
  handleSwapResponse as swapResponseUtil,
  handleCancelSwapRequest as cancelSwapRequestUtil
} from '@/lib/sessionUtils';
import { BookedSessionsTab } from '@/components/sessions/BookedSessionsTab';
import { MyRequestsTab } from '@/components/sessions/MyRequestsTab';
import { SwapSessionsTab } from '@/components/sessions/SwapSessionsTab';
import { ArchiveTab } from '@/components/sessions/ArchiveTab';

type SwapRequest = {
  id: string;
  sessionId: string;
  requesterId: string;
  targetSessionId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: Date;
  session: SessionWithProfile;
  targetSession: SessionWithProfile;
  requesterProfile: any;
};

export default function SessionsPage() {
  const { user } = useAuth();
  const [asMenteeSessions, setAsMenteeSessions] = useState<Session[]>([]);
  const [asMentorSessions, setAsMentorSessions] = useState<Session[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'booked' | 'requests' | 'received' | 'swaps'>('booked');
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [swapMessage, setSwapMessage] = useState('');
  const [swapSessions,setSwapSessions] = useState<Session[]>([])
  const [archivedSessions, setArchivedSessions] = useState<Session[]>([])

  const handleCancelSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        setAsMenteeSessions(prev => prev.filter(session => session.id !== sessionId));
        toast.success('Session cancelled successfully!');
      } else {
        toast.error('Failed to cancel session');
      }
    } catch (error) {
      toast.error('Failed to cancel session');
    }
  };

  const fetchData = async () => {
    try {
      if (!user?.getIdToken) return;
      
      const token = await user.getIdToken();
      const swapResponse = await fetch('/api/swap-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (swapResponse.ok && swapResponse.status === 200) {
        const data = await swapResponse.json();
        console.log("data",data)
        
        setAsMenteeSessions(data.asMentee.filter((session:Session)=>session.status==="pending") || []);
        setAsMentorSessions(data.asMentor.filter((session:Session)=>session.status==='pending') || []);
       
        setSwapSessions(data.swapSessions || []);
        setArchivedSessions(data.archivedSessions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSessionAction = async (sessionId: string, action: 'accept' | 'reject' | 'cancel' | 'delete' | 'archive') => {
    await sessionActionUtil(
      sessionId,
      action,
      user,
      (sessionId, action) => {
        if (action === 'delete') {
          setAsMentorSessions(prev => prev.filter(session => session.id !== sessionId));
          setAsMenteeSessions(prev => prev.filter(session => session.id !== sessionId));
          setArchivedSessions(prev => prev.filter(session => session.id !== sessionId));
        } else if (action === 'archive') {
          const sessionToArchive = [...asMentorSessions, ...asMenteeSessions,...swapSessions].find(s => s.id === sessionId);
          if (sessionToArchive) {
            setArchivedSessions(prev => [...prev, { ...sessionToArchive, status: 'archived' as any }]);
            setAsMentorSessions(prev => prev.filter(session => session.id !== sessionId));
            setAsMenteeSessions(prev => prev.filter(session => session.id !== sessionId));
            setSwapSessions(prev=>prev.filter(session=>session.id !== sessionId))
          }
        } else {
          const updateStatus = action === 'accept' ? 'confirmed' : action === 'cancel' ? 'cancelled' : undefined;
          if (updateStatus) {
            setAsMentorSessions(prev => 
              prev.map(session => 
                session.id === sessionId ? { ...session, status: updateStatus as any } : session
              )
            );
            setAsMenteeSessions(prev => 
              prev.map(session => 
                session.id === sessionId ? { ...session, status: updateStatus as any } : session
              )
            );
            setSwapSessions(prev=>
              prev.map(session=>
                session.id ===sessionId ? {...session,status:updateStatus as any} : session
              )
            )
          }
        }
        toast.success(`Session ${action}ed successfully!`);
      },
      (message) => toast.error(message)
    );
  };

  const handleSwapRequest = (session: Session) => {
    setSelectedSession(session);
    setShowSwapModal(true);
  };

  const submitSwapRequest = async () => {
    await swapRequestUtil(
      selectedSession!,
      swapMessage,
      user,
      () => {
        toast.success('Swap request sent successfully!');
        setShowSwapModal(false);
        setSwapMessage('');
        setSelectedSession(null);
        // Refresh data
        fetchData();
      },
      (message) => toast.error(message)
    );
  };

 


  const tabs = [
    { id: 'booked', label: 'Booked Sessions', icon: Calendar, count: asMentorSessions.length },
    { id: 'requests', label: 'My Requests', icon: Send, count: asMenteeSessions.length },
    { id: 'swaps', label: 'Swap Sessions', icon: ArrowRightLeft, count: swapSessions.length },
    { id: 'received', label: 'Archive', icon: Inbox, count: archivedSessions.length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-16 lightbg darkbg w-full  h-screen overflow-auto mx-auto">
      <div className="mb-8 animate-in fade-in-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-gray-300 text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
              Session Management
            </h1>
            <p className="text-gray-500">Manage your booked sessions and swap requests</p>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Sessions</span>
            </div>
          </div>
        </div>
      </div>

     
      <div className="border-b border-gray-200 mb-8 animate-in slide-in-right">
        <nav className="flex space-x-8 overflow-x-auto custom-scrollbar">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap group ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 transform scale-105'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === tab.id ? 'rotate-12' : 'group-hover:scale-110'
                }`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full transition-all duration-200 bounce-in ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-600 scale-110' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

     
      <div className="animate-in fade-in-50 duration-200">
        {activeTab === 'booked' && (
          <BookedSessionsTab
            sessions={asMentorSessions}
            onAction={handleSessionAction}
           
          />
        )}

        {activeTab === 'requests' && (
          <MyRequestsTab
            sessions={asMenteeSessions}
            onCancel={handleCancelSession}
          />
        )}

        {activeTab === 'swaps' && (
          <SwapSessionsTab
            sessions={swapSessions}
            userId={user?.uid || ''}
            onAction={handleSessionAction}
          />
        )}

        {activeTab === 'received' && (
          <ArchiveTab
            sessions={archivedSessions}
            onDelete={(sessionId) => handleSessionAction(sessionId, 'delete')}
          />
        )}
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl animate-in bounce-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Request Session Swap</h3>
              </div>
              <button 
                onClick={() => setShowSwapModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedSession && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedSession.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedSession.startTime} - {selectedSession.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{selectedSession.skill}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Message to the other party
              </label>
              <textarea
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={4}
                placeholder="Hi! I'd like to swap this session because..."
              />
              <div className="mt-2 text-xs text-gray-500">
                {swapMessage.length}/500 characters
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitSwapRequest}
                disabled={!swapMessage.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

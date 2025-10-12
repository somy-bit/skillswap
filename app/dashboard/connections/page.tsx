'use client';
import { useConnections } from '@/lib/hooks/useConnections';
import { useEffect, useState } from 'react';
import { Users, UserPlus, Clock, Check, X } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  skills?: string[];
}

export default function ConnectionsPage() {
  const { 
    connections, 
    receivedRequests, 
    loading, 
    error, 
    acceptConnection, 
    rejectConnection 
  } = useConnections();
  
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({});
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Fetch profile data for connections and requests
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const allUserIds = [
          ...connections.map(c => c.connectedUserId),
          ...receivedRequests.map(r => r.senderId!)
        ];

        if (allUserIds.length === 0) {
          setLoadingProfiles(false);
          return;
        }

        const response = await fetch('/api/profiles');
        const allProfiles = await response.json();
        
        const profileMap: { [key: string]: Profile } = {};
        allProfiles.forEach((profile: Profile) => {
          if (allUserIds.includes(profile.id)) {
            profileMap[profile.id] = profile;
          }
        });
        
        setProfiles(profileMap);
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    if (!loading) {
      fetchProfiles();
    }
  }, [connections, receivedRequests, loading]);

  const handleAccept = async (connectionId: string) => {
    try {
      await acceptConnection(connectionId);
    } catch (error) {
      console.error('Failed to accept connection:', error);
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      await rejectConnection(connectionId);
    } catch (error) {
      console.error('Failed to reject connection:', error);
    }
  };

  if (loading || loadingProfiles) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <Users className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold">My Connections</h1>
      </div>

      {/* Connection Requests */}
      {receivedRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="text-orange-600" size={24} />
            <h2 className="text-xl font-semibold">Connection Requests</h2>
          </div>
          <div className="grid gap-4">
            {receivedRequests.map((request) => {
              const profile = profiles[request.senderId!];
              if (!profile) return null;

              return (
                <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt={profile.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold">{profile.name?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                      {profile.skills && (
                        <p className="text-xs text-gray-500">{profile.skills.slice(0, 3).join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Check size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Connections */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Connections ({connections.length})</h2>
        {connections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No connections yet. Start connecting with mentors!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {connections.map((connection) => {
              const profile = profiles[connection.connectedUserId];
              if (!profile) return null;

              return (
                <div key={connection.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt={profile.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold">{profile.name?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                      {profile.skills && (
                        <p className="text-xs text-gray-500">{profile.skills.slice(0, 3).join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Connected
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface VideoCallProps {
  roomName: string;
  onClose: () => void;
  isModerator?: boolean;
  userName?: string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function VideoCall({ 
  roomName, 
  onClose, 
  isModerator = false,
  userName = 'User'
}: VideoCallProps) {
  const { user } = useAuth();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.onload = () => {
      const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: document.querySelector('#jitsi-container'),
        width: '100%',
        height: '600px',
        userInfo: {
          displayName: userName,
          email: user?.email || ''
        },
        configOverwrite: {
          startWithAudioMuted: !isModerator,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          enableWelcomePage: false,
          enableClosePage: false,
          defaultLanguage: 'en',
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'settings',
            'raisehand', 'videoquality', 'filmstrip', 'tileview'
          ],
        },
        interfaceConfigOverwrite: {
          DEFAULT_LANGUAGE: 'en',
          LANG_DETECTION: false,
          SHOW_JITSI_WATERMARK: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          TOOLBAR_TIMEOUT: 0,
        }
      });

     

      api.addEventListener('videoConferenceLeft', onClose);
      api.addEventListener('readyToClose', onClose);
    };
    document.head.appendChild(script);

    return () => {
      if (window.JitsiMeetExternalAPI) {
        const container = document.querySelector('#jitsi-container');
        if (container) {
          container.innerHTML = '';
        }
      }
    };
  }, [roomName, onClose, isModerator, userName, user]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10 transition-colors"
      >
        ×
      </button>
      <div 
        id="jitsi-container" 
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      ></div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

interface VideoCallProps {
  roomName: string;
  onClose: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function VideoCall({ roomName, onClose }: VideoCallProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.onload = () => {
      const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: document.querySelector('#jitsi-container'),
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
        },
      });

      api.addEventListener('videoConferenceLeft', onClose);
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
  }, [roomName, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10 transition-colors"
      >
        ×
      </button>
      <div id="jitsi-container" className="flex-1 m-4 mt-16"></div>
    </div>
  );
}

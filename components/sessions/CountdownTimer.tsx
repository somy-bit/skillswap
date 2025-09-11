'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { getTimeUntilSession } from '@/lib/sessionUtils';

interface CountdownTimerProps {
  date: string;
  startTime: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, startTime }) => {
  const [timeInfo, setTimeInfo] = useState(getTimeUntilSession(date, startTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getTimeUntilSession(date, startTime));
    }, 60000);

    return () => clearInterval(timer);
  }, [date, startTime]);

  if (timeInfo.canJoin) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg mb-4">
      <Timer className="w-4 h-4" />
      <span>Starts in: {timeInfo.timeLeft}</span>
    </div>
  );
};

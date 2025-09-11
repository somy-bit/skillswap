'use client'
import { Profile, Slot } from '@/types/type';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface BookingCardProps {
  profile: Profile;
  availableSlots: Slot[];
  onClose: () => void;
}

export default function BookingCard({ profile, availableSlots, onClose }: BookingCardProps) {
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);

  const handleBookSession = async () => {
    if (!selectedSlot || !selectedSkill || !message.trim() || !user) {
      toast.error('Please fill in all fields');
      return;
    }

    setBooking(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mentorId: profile.id,
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          skill: selectedSkill,
          message: message
        })
      });

      if (response.ok) {
        toast.success('Session booked successfully!');
        onClose();
      } else {
        toast.error('Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Error booking session');
    } finally {
      setBooking(false);
    }
  };

  const skills = profile.skills || [];

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50'>
      <div className='max-w-4xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Book Session with {profile.name}
          </h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Select Time Slot */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Select Time Slot
            </label>
            <div className='space-y-2 max-h-32 overflow-y-auto'>
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-2 text-left rounded-lg border text-sm transition-colors ${
                    selectedSlot === slot
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {slot.date}
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    {slot.startTime} - {slot.endTime}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Skill */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Session Topic
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
            >
              <option value="">Select a skill</option>
              {skills.map((skill, index) => (
                <option key={index} value={skill.trim()}>
                  {skill.trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Tell them why you want to learn this skill...'
              className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm h-20 resize-none'
            />
          </div>
        </div>

        <div className='flex justify-end space-x-3 mt-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          >
            Cancel
          </button>
          <button
            onClick={handleBookSession}
            disabled={booking || !selectedSlot || !selectedSkill || !message.trim()}
            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {booking ? 'Booking...' : 'Book Session'}
          </button>
        </div>
      </div>
    </div>
  );
}

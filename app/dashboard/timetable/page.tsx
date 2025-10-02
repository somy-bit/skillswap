'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Slot, Session } from '@/types/type';
import { Plus, Trash2, Calendar, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { getVancouverDate, getVancouverDateString, isPastDate, isToday } from '@/lib/timezone';

function TimetablePage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookedSessions, setBookedSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'manage' | 'calendar'>('manage');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBookedAccordion, setShowBookedAccordion] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const token = await user.getIdToken();
        
        const slotsResponse = await fetch('/api/timetable', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (slotsResponse.ok) {
          const slotsData = await slotsResponse.json();
          const today = getVancouverDate();
          today.setHours(0, 0, 0, 0);
          
          // Keep slots for one day after they expire
          const oneDayAgo = new Date(today);
          oneDayAgo.setDate(oneDayAgo.getDate() - 1);
          
          const currentSlots = slotsData.filter((slot: Slot) => {
            const slotDate = new Date(slot.date + 'T00:00:00');
            return slotDate >= oneDayAgo;
          });
          
          setSlots(currentSlots);
          
          // Only update database if we actually removed expired slots
          if (currentSlots.length !== slotsData.length) {
            await fetch('/api/timetable', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ slots: currentSlots })
            });
          }
        }

        const sessionsResponse = await fetch('/api/swap-requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (sessionsResponse.ok && sessionsResponse.status===200) {
          const sessionsData = await sessionsResponse.json();
          console.log('sessions',sessionsData)
          setBookedSessions([...sessionsData.asMentor, ...sessionsData.asMentee]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addSlot = () => {
    const newSlot: Slot = {
      date: '',
      startTime: '',
      endTime: '',
      isBooked: false
    };
    setSlots([...slots, newSlot]);
  };

  const updateSlot = (index: number, field: keyof Slot, value: string | boolean) => {
    const updatedSlots = [...slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    
    if (field === 'date') {
      const selectedDateStr = value as string;
      
      if (isPastDate(selectedDateStr)) {
        toast.error('Date cannot be in the past');
        return;
      }
    }
    
    if (field === 'startTime' || field === 'endTime') {
      const slot = updatedSlots[index];
      if (slot.startTime && slot.endTime) {
        if (slot.endTime <= slot.startTime) {
          toast.error('End time must be after start time');
          return;
        }
        
        if (slot.date) {
          // Only check time if it's today in Vancouver timezone
          if (isToday(slot.date)) {
            const now = getVancouverDate();
            const [startHour, startMin] = slot.startTime.split(':').map(Number);
            const slotStart = getVancouverDate();
            slotStart.setHours(startHour, startMin, 0, 0);
            
            if (slotStart <= now) {
              toast.error('Start time cannot be in the past for today');
              return;
            }
          }
        }
      }
    }
    
    setSlots(updatedSlots);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const checkOverlap = (slots: Slot[]) => {
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slot1 = slots[i];
        const slot2 = slots[j];
        
        if (slot1.date === slot2.date && slot1.startTime && slot1.endTime && slot2.startTime && slot2.endTime) {
          const start1 = slot1.startTime;
          const end1 = slot1.endTime;
          const start2 = slot2.startTime;
          const end2 = slot2.endTime;
          
          if ((start1 < end2 && end1 > start2)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const saveSlots = async () => {
    if (!user) return;
    
    const incompleteSlots = slots.filter(slot => !slot.date || !slot.startTime || !slot.endTime);
    if (incompleteSlots.length > 0) {
      toast.error('Please complete all time slots');
      return;
    }
    
    if (checkOverlap(slots)) {
      toast.error('Time slots cannot overlap');
      return;
    }
    
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slots })
      });
      
      if (response.ok) {
        toast.success('Timetable saved successfully!');
      } else {
        toast.error('Failed to save timetable');
      }
    } catch (error) {
      console.error('Error saving slots:', error);
      toast.error('Error saving timetable');
    } finally {
      setSaving(false);
    }
  };

  const renderCalendarView = () => {
    const today = getVancouverDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayBookedSessions = bookedSessions.filter(slot => slot.date === dateStr);
      console.log('slot date',bookedSessions)
      days.push(
        <div key={day} className="p-2 border border-gray-200 dark:border-gray-600 min-h-[80px]">
          <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">{day}</div>
          {dayBookedSessions.map((session, idx) => (
            <div key={idx}
            className={`text-xs  ${session.mentorId === user?.uid ?"dark:bg-blue-900 bg-blue-100 text-blue-800 dark:text-blue-200":"dark:bg-teal-900 bg-teal-100 text-teal-800 dark:text-teal-200"} p-1 rounded mb-1`}>
              {session.startTime} - {session.skill}
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric',
            timeZone: 'America/Vancouver'
          })}
        </h2>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-700 dark:text-gray-300 border-b">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen w-full px-4 py-8 darkbg lightbg flex items-center justify-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full px-4 py-8 darkbg lightbg'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Timetable Management</h1>
          <p className='text-gray-600 dark:text-gray-300'>Manage your schedule and view booked sessions</p>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Manage Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Booked Sessions</span>
            </button>
          </nav>
        </div>

        {activeTab === 'manage' && (
          <div className='space-y-6'>
            {slots.filter(slot => slot.isBooked).length > 0 && (
              <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
                <button
                  onClick={() => setShowBookedAccordion(!showBookedAccordion)}
                  className='w-full flex items-center justify-between p-6 text-left'
                >
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      Booked Time Slots ({slots.filter(slot => slot.isBooked).length})
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>View your confirmed bookings</p>
                  </div>
                  {showBookedAccordion ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
                </button>
                
                {showBookedAccordion && (
                  <div className='px-6 pb-6 border-t border-gray-200 dark:border-gray-600'>
                    <div className='space-y-3 mt-4'>
                      {slots.filter(slot => slot.isBooked).map((slot, index) => (
                        <div key={index} className='flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                          <div className='flex items-center space-x-4'>
                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                            <div>
                              <div className='font-medium text-gray-900 dark:text-white'>
                                {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', {timeZone: 'America/Vancouver'})}
                              </div>
                              <div className='text-sm text-gray-600 dark:text-gray-300'>
                                {slot.startTime} - {slot.endTime}
                              </div>
                            </div>
                          </div>
                          <span className='text-sm font-medium text-green-700 dark:text-green-300'>Booked</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
              <div className='flex justify-between items-center mb-6'>
                <div>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>Available Time Slots</h2>
                  <p className='text-gray-600 dark:text-gray-300'>Add and manage your available time slots</p>
                </div>
                <button
                  onClick={addSlot}
                  className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  <span>Add Slot</span>
                </button>
              </div>

              {slots.filter(slot => !slot.isBooked).length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-gray-500 dark:text-gray-400 mb-4'>No time slots added yet</div>
                  <button
                    onClick={addSlot}
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                  >
                    Add Your First Slot
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  {slots.filter(slot => !slot.isBooked).map((slot, index) => {
                    const originalIndex = slots.findIndex(s => s === slot);
                    return (
                      <div key={originalIndex} className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Date
                          </label>
                          <input
                            type='date'
                            value={slot.date}
                            onChange={(e) => updateSlot(originalIndex, 'date', e.target.value)}
                            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                          />
                        </div>
                        
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Start Time
                          </label>
                          <input
                            type='time'
                            value={slot.startTime}
                            onChange={(e) => updateSlot(originalIndex, 'startTime', e.target.value)}
                            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                          />
                        </div>
                        
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            End Time
                          </label>
                          <input
                            type='time'
                            value={slot.endTime}
                            onChange={(e) => updateSlot(originalIndex, 'endTime', e.target.value)}
                            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                          />
                        </div>
                        
                        <div className='flex items-end'>
                          <button
                            onClick={() => removeSlot(originalIndex)}
                            className='w-full p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
                          >
                            <Trash2 className='w-4 h-4 mx-auto' />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className='flex justify-end pt-4'>
                    <button
                      onClick={saveSlots}
                      disabled={saving}
                      className='px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors'
                    >
                      {saving ? 'Saving...' : 'Save Timetable'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && renderCalendarView()}
      </div>
    </div>
  );
}

export default TimetablePage;

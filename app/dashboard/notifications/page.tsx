'use client'

import React, { useEffect, useState } from 'react'
import { Notification } from '@/types/type'
import NotifCard from '@/components/NotifCard'
import { useAuth } from '@/contexts/AuthContext'

const NotificationsPage: React.FC = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return
      
      try {
        const token = await user.getIdToken()
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  // Mark as read (when click) - now deletes the notification
  const handleClick = async (notif: Notification, index: number) => {
    if (!user) return
    
    try {
      const token = await user.getIdToken()
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationIndex: index
        })
      })
      
      // Remove the notification from local state
      setNotifications((prev) => prev.filter((_, i) => i !== index))

      // If notification has sessionId, navigate to it
      if (notif.sessionId) {
        window.location.href = `/dashboard/sessions/${notif.sessionId}`
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen w-full px-4 py-8 darkbg lightbg flex items-center justify-center'>
        <p className='text-gray-600 dark:text-gray-400'>Please log in to see notifications</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen w-full px-4 py-8 darkbg lightbg flex items-center justify-center'>
        <p className='text-gray-600 dark:text-gray-400'>Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-full px-4 py-8 darkbg lightbg'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Notifications</h1>
          
          {notifications.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 dark:text-gray-400'>No notifications yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {notifications.map((notif, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(notif, index)}
                  className='cursor-pointer'
                >
                  <NotifCard notification={notif} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage

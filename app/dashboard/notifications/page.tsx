'use client'

import React, { useEffect, useState } from 'react'
import { Notification } from '@/types/type'
import NotifCard from '@/components/NotifCard'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const NotificationsPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadIds, setUnreadIds] = useState<string[]>([])

  useEffect(() => {
    fetchNotifications()
  }, [user])

  // Mark notifications as read when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (unreadIds.length > 0) {
        markAllAsRead()
      }
    }

    const handleRouteChange = () => {
      if (unreadIds.length > 0) {
        markAllAsRead()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    const originalPush = router.push
    router.push = (...args) => {
      handleRouteChange()
      return originalPush.apply(router, args)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (unreadIds.length > 0) {
        markAllAsRead()
      }
    }
  }, [unreadIds, router])

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
        const notifs = data || []
        
        // Sort: unread first, then by timestamp
        const sortedNotifs = notifs.sort((a: Notification, b: Notification) => {
          if (a.read !== b.read) {
            return a.read ? 1 : -1
          }
          const aTime = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp as any).getTime()
          const bTime = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp as any).getTime()
          return bTime - aTime
        })
        
        setNotifications(sortedNotifs)
        setUnreadIds(sortedNotifs.filter((n: Notification) => !n.read).map((n: Notification) => n.id))
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    if (unreadIds.length === 0) return
    
    try {
      const token = await user?.getIdToken()
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const handleClick = (notif: Notification) => {
    // Removed - navigation now handled by buttons in NotifCard
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
          <div className='flex items-center gap-3 mb-6'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Notifications</h1>
            {unreadIds.length > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadIds.length} new
              </span>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 dark:text-gray-400'>No notifications</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {notifications.map((notif, index) => (
                <div
                  key={index}
                  className={`transition-colors ${
                    !notif.read ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 pl-4' : ''
                  }`}
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

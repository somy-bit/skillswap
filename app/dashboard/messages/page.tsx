'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { MessageCircle, Search } from 'lucide-react'

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    avatar: string
  }
  lastMessage: {
    content: string
    timestamp: Date
    senderId: string
  }
  unreadCount: number
}

function MessagesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return
      
      try {
        const token = await user.getIdToken()
        const response = await fetch('/api/messages/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [user])

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen w-full px-4 py-8 darkbg lightbg flex items-center justify-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>Loading messages...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-full darkbg lightbg'>
      <div className='max-w-4xl mx-auto px-4 py-6'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
          {/* Header */}
          <div className='mid-lightbg mid-darkbg px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <MessageCircle className='w-6 h-6 text-white' />
                <h1 className='text-xl font-semibold text-white'>Messages</h1>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search conversations...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className='divide-y divide-gray-200 dark:divide-gray-700'>
            {filteredConversations.length === 0 ? (
              <div className='p-8 text-center'>
                <MessageCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-600 dark:text-gray-400'>
                  {searchTerm ? 'No conversations found' : 'No messages yet'}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>
                  Start a conversation by visiting someone's profile
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => router.push(`/dashboard/messages/${conversation.otherUser.id}`)}
                  className='p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='relative'>
                      <img
                        src={conversation.otherUser.avatar || '/default-avatar.png'}
                        alt={conversation.otherUser.name}
                        className='w-12 h-12 rounded-full object-cover'
                      />
                      {conversation.unreadCount > 0 && (
                        <div className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center'>
                          <span className='text-xs text-white font-medium'>
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h3 className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                          {conversation.otherUser.name}
                        </h3>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400 truncate mt-1'>
                        {conversation.lastMessage.senderId === user?.uid ? 'You: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage

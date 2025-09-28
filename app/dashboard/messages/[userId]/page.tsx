'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, MoreVertical } from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  read: boolean
}

interface ChatUser {
  id: string
  name: string
  avatar: string
}

function ChatPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = params.userId as string
  
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchChatData = async () => {
      if (!user) return
      
      try {
        const token = await user.getIdToken()
        
        // Fetch other user info
        const userResponse = await fetch(`/api/profile/view/${userId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setOtherUser({
            id: userData.id,
            name: userData.name,
            avatar: userData.avatar
          })
        }
        
        // Fetch messages
        const messagesResponse = await fetch(`/api/messages/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          setMessages(messagesData)
        }
      } catch (error) {
        console.error('Error fetching chat data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatData()
  }, [user, userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || sending) return
    
    setSending(true)
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: userId,
          content: newMessage.trim()
        })
      })
      
      if (response.ok) {
        const sentMessage = await response.json()
        setMessages(prev => [...prev, sentMessage])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen w-full darkbg lightbg flex items-center justify-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>Loading chat...</div>
      </div>
    )
  }

  if (!otherUser) {
    return (
      <div className='min-h-screen w-full darkbg lightbg flex items-center justify-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>User not found</div>
      </div>
    )
  }

  return (
    <div className='h-screen flex flex-col darkbg lightbg'>
      {/* Chat Header */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <button
              onClick={() => router.back()}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
            >
              <ArrowLeft className='w-5 h-5 text-gray-600 dark:text-gray-400' />
            </button>
            
            <img
              src={otherUser.avatar || '/default-avatar.png'}
              alt={otherUser.name}
              className='w-10 h-10 rounded-full object-cover'
            />
            
            <div>
              <h2 className='font-medium text-gray-900 dark:text-white'>
                {otherUser.name}
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Online</p>
            </div>
          </div>
          
          <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'>
            <MoreVertical className='w-5 h-5 text-gray-600 dark:text-gray-400' />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500 dark:text-gray-400'>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === user?.uid
            const showDate = index === 0 || 
              formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp)
            
            return (
              <div key={message.id}>
                {showDate && (
                  <div className='text-center py-2'>
                    <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full'>
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className='text-sm'>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isCurrentUser 
                        ? 'text-blue-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4'>
        <div className='flex items-center space-x-3'>
          <div className='flex-1 relative'>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Type a message...'
              rows={1}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <Send className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

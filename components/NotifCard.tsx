import React from 'react'
import { Notification } from '../types/type'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import { DARK_TEXT, LIGHT_TEXT } from '@/lib/utils'

type NotificationCardProps = {
    notification: Notification
}

const typeToTitle = {
    booking: 'New Booking',
    message: 'New Message',
    reminder: 'Reminder',
    session_confirmed: 'Session Confirmed',
    session_cancelled: 'Session Cancelled',
    session_completed: 'Session Completed',
}

const NotifCard: React.FC<NotificationCardProps> = ({ notification }) => {
    const { type, message, timestamp, sessionId, seen } = notification

    // Format timestamp
    const formatTimestamp = () => {
        if (timestamp instanceof Timestamp) {
            return timestamp.toDate().toLocaleString()
        }
        if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
            return timestamp.toDate().toLocaleString()
        }
        return new Date(timestamp).toLocaleString()
    }

    const cardContent = (
        <div className={`flex items-center space-x-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full transition-shadow duration-300 hover:shadow-lg ${seen ? 'opacity-75' : 'ring-2 ring-blue-400'}`}>
            {/* Icon based on type */}
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {type.charAt(0).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className={`text-sm font-semibold ${LIGHT_TEXT} dark:${DARK_TEXT}`}>
                    {typeToTitle[type] || 'Notification'}
                </h3>
                <p className={`text-xs ${LIGHT_TEXT} dark:${DARK_TEXT} opacity-80 mt-1`}>
                    {message}
                </p>
                <span className={`text-[10px] ${LIGHT_TEXT} dark:${DARK_TEXT} opacity-60 mt-1 block`}>
                    {formatTimestamp()}
                </span>
            </div>

            {/* Unread indicator */}
            {!seen && (
                <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
        </div>
    )

    return cardContent
}

export default NotifCard

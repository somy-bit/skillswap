'use client'
import React, { useState, useEffect } from 'react'
import { Profile, Slot } from '@/types/type'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, MessageCircle } from 'lucide-react'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import BookingCard from '@/components/BookingCard'

const occupationColors = {
  'Technology & IT': 'border-blue-500',
  'Business & Finance': 'border-green-500',
  'Education & Training': 'border-yellow-500',
  'Health & Wellness': 'border-red-500',
  'Creative & Design': 'border-purple-500',
  'Science & Research': 'border-cyan-500',
  'Legal & Government': 'border-gray-500',
  'Hospitality & Service': 'border-orange-500',
  'Lifestyle & Personal Development': 'border-pink-500',
};

function ViewProfilePage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const userId = params.userId as string
    const [profile, setProfile] = useState<Profile | null>(null)
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
    const [loading, setLoading] = useState(true)
    const [showBooking, setShowBooking] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/profile/view/${userId}`)
                if (response.ok) {
                    const data = await response.json()
                    setProfile(data)
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setLoading(false)
            }
        }

        const fetchAvailableSlots = async () => {
            if (!user) return
            
            try {
                const token = await user.getIdToken()
                const response = await fetch(`/api/slots/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    const unbooked = data.filter((slot: Slot) => !slot.isBooked)
                    setAvailableSlots(unbooked)
                }
            } catch (error) {
                console.error('Error fetching slots:', error)
            }
        }

        if (userId) {
            fetchProfile()
            fetchAvailableSlots()
        }
    }, [userId, user])

    if (loading) {
        return (
            <>
                <Header />
                <div className='min-h-screen w-full px-4 py-8 pt-20 darkbg lightbg flex items-center justify-center'>
                    <div className='text-lg text-gray-600 dark:text-gray-400'>Loading profile...</div>
                </div>
            </>
        )
    }

    if (!profile) {
        return (
            <>
                <Header />
                <div className='min-h-screen w-full px-4 py-8 pt-20 darkbg lightbg flex items-center justify-center'>
                    <div className='text-lg text-gray-600 dark:text-gray-400'>Profile not found</div>
                </div>
            </>
        )
    }

    const borderColor = occupationColors[profile.occupation] || 'border-gray-400';

    return (
        <>
            <Header />
            <div className='min-h-screen w-full px-4 py-8 pt-20 darkbg lightbg'>
                <div className='max-w-4xl mx-auto'>
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className='flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors'
                    >
                        <ArrowLeft className='w-5 h-5' />
                        <span>Back</span>
                    </button>

                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
                        {/* Header */}
                        <div className='mid-lightbg mid-darkbg px-6 py-8 text-white'>
                            <div className='text-center'>
                                <div className={`w-32 h-32 mx-auto rounded-full border-4 ${borderColor} overflow-hidden bg-white mb-4`}>
                                    <img
                                        src={profile.avatar || '/default-avatar.png'}
                                        alt={profile.name}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <h1 className='text-3xl font-bold mb-2'>{profile.name}</h1>
                                <p className='text-blue-100 text-lg'>{profile.occupation}</p>
                                <p className='text-blue-200'>{profile.experience} years experience • {profile.location}</p>
                                
                                {/* Action Buttons */}
                                <div className='mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center'>
                                    {/* Chat Button */}
                                    <button
                                        onClick={() => router.push(`/dashboard/messages/${userId}`)}
                                        className='flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium'
                                    >
                                        <MessageCircle className='w-5 h-5' />
                                        <span>Chat</span>
                                    </button>
                                    
                                    {/* Book Session Button */}
                                    {availableSlots.length > 0 ? (
                                        <button
                                            onClick={() => setShowBooking(true)}
                                            className='flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium'
                                        >
                                            <Calendar className='w-5 h-5' />
                                            <span>Book Session</span>
                                        </button>
                                    ) : (
                                        <div className='px-6 py-3 bg-gray-500 text-white rounded-lg font-medium opacity-75'>
                                            No Available Slots
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className='p-6'>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                {/* Left Column */}
                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>About</h3>
                                        <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                                            {profile.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>Skills</h3>
                                        <div className='flex flex-wrap gap-2'>
                                            {( profile.skills || []).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm'
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {profile.socailLinks && profile.socailLinks.length > 0 && (
                                        <div>
                                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>Links</h3>
                                            <div className='space-y-2'>
                                                {profile.socailLinks.map((link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 block'
                                                    >
                                                        {link}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>Professional Details</h3>
                                        <div className='space-y-3'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600 dark:text-gray-400'>Occupation:</span>
                                                <span className='text-gray-900 dark:text-white font-medium'>{profile.occupation}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600 dark:text-gray-400'>Experience:</span>
                                                <span className='text-gray-900 dark:text-white font-medium'>{profile.experience} years</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600 dark:text-gray-400'>Location:</span>
                                                <span className='text-gray-900 dark:text-white font-medium'>{profile.location}</span>
                                            </div>
                                            {profile.rating && (
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-600 dark:text-gray-400'>Rating:</span>
                                                    <span className='text-gray-900 dark:text-white font-medium'>
                                                        ★ {profile.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {profile.achievements && (
                                        <div>
                                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>Achievements</h3>
                                            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                                                {profile.achievements}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>Contact</h3>
                                        <div className='space-y-2'>
                                            <p className='text-gray-700 dark:text-gray-300'>
                                                <span className='font-medium'>Email:</span> {profile.email}
                                            </p>
                                            {profile.phone && (
                                                <p className='text-gray-700 dark:text-gray-300'>
                                                    <span className='font-medium'>Phone:</span> {profile.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Booking Card */}
                {showBooking && profile && (
                    <BookingCard
                        profile={profile}
                        availableSlots={availableSlots}
                        onClose={() => setShowBooking(false)}
                    />
                )}
            </div>
        </>
    )
}

export default ViewProfilePage

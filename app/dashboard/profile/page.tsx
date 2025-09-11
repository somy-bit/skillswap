'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Profile } from '@/types/type'
import ImageUploader from '@/components/ImageUploader'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'

function ProfilePage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [newImage, setNewImage] = useState<File | null>(null)

    const occupations = [
        'Technology & IT',
        'Business & Finance',
        'Education & Training',
        'Health & Wellness',
        'Creative & Design',
        'Science & Research',
        'Legal & Government',
        'Hospitality & Service',
        'Lifestyle & Personal Development'
    ]

    const locations = [
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
        'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
        'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
        'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
        'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
        'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD'
    ]

    // Fetch current user's profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return
            
            try {
                const token = await user.getIdToken()
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (response.ok && response.status === 200) {
                    const data = await response.json()
                    setProfile(data)
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user])

    const handleSave = async () => {
        if (!profile || !user) return

        setSaving(true)
        try {
            const token = await user.getIdToken()
            const formData = new FormData()
            
            if (newImage) {
                formData.append('image', newImage)
            }
            
            formData.append('profileData', JSON.stringify({
                ...profile,
                skills: profile.skills
            }))

            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (response.ok) {
                const updatedProfile = await response.json()
                setProfile(updatedProfile)
                setEditing(false)
                setNewImage(null)
                toast.success('Profile updated successfully!')
            } else {
                toast.error('Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Error updating profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen w-full px-4 py-8 darkbg lightbg flex items-center justify-center'>
                <div className='text-lg text-gray-600 dark:text-gray-400'>Loading profile...</div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className='min-h-screen w-full px-4 py-8 darkbg lightbg flex items-center justify-center'>
                <div className='text-lg text-gray-600 dark:text-gray-400'>Profile not found</div>
            </div>
        )
    }

    return (
        <div className='min-h-screen w-full px-4 py-8 darkbg lightbg'>
            <div className='max-w-5xl mx-auto'>
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
                    {/* Header */}
                    <div className='bg-gradient-to-r mid-lightbg mid-darkbg px-6 py-8 text-white'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <h1 className='text-3xl font-bold mb-2'>My Profile</h1>
                                <p className='text-blue-100'>Manage your profile information</p>
                            </div>
                            <button
                                onClick={() => editing ? handleSave() : setEditing(true)}
                                disabled={saving}
                                className='px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50'
                            >
                                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className='p-6'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                            {/* Left Column - Image and Basic Info */}
                            <div className='lg:col-span-1'>
                                <div className='text-center mb-6'>
                                    {editing ? (
                                        <div className=''>
                                            <ImageUploader onImageSelected={setNewImage} />
                                            <p className='text-sm text-gray-500 mt-2'>Upload new profile image</p>
                                        </div>
                                    ) : (
                                        <div className='w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700'>
                                            <img
                                                src={profile.avatar || '/default-avatar.png'}
                                                alt={profile.name}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Name
                                        </label>
                                        {editing ? (
                                            <Input
                                                value={profile.name}
                                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                                className='w-full'
                                            />
                                        ) : (
                                            <p className='text-gray-900 dark:text-white font-medium'>{profile.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Email
                                        </label>
                                        <p className='text-gray-600 dark:text-gray-400'>{profile.email}</p>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Phone
                                        </label>
                                        {editing ? (
                                            <Input
                                                value={profile.phone}
                                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                                className='w-full'
                                            />
                                        ) : (
                                            <p className='text-gray-900 dark:text-white'>{profile.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Detailed Info */}
                            <div className='lg:col-span-2 space-y-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Occupation
                                        </label>
                                        {editing ? (
                                            <select
                                                value={profile.occupation}
                                                onChange={(e) => setProfile({...profile, occupation: e.target.value as any})}
                                                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                                            >
                                                {occupations.map((occ) => (
                                                    <option key={occ} value={occ}>{occ}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className='text-gray-900 dark:text-white'>{profile.occupation}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Experience (years)
                                        </label>
                                        {editing ? (
                                            <Input
                                                type='number'
                                                value={profile.experience}
                                                onChange={(e) => setProfile({...profile, experience: Number(e.target.value)})}
                                                className='w-full'
                                                min="0"
                                            />
                                        ) : (
                                            <p className='text-gray-900 dark:text-white'>{profile.experience} years</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Location
                                        </label>
                                        {editing ? (
                                            <select
                                                value={profile.location}
                                                onChange={(e) => setProfile({...profile, location: e.target.value})}
                                                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                                            >
                                                {locations.map((loc) => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className='text-gray-900 dark:text-white'>{profile.location}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Rating
                                        </label>
                                        <p className='text-gray-900 dark:text-white'>
                                            {profile.rating ? `★ ${profile.rating.toFixed(1)}` : 'No rating yet'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Skills (comma separated)
                                    </label>
                                    {editing ? (
                                        <Input
                                            value={Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills}
                                            onChange={(e) => setProfile({...profile, skills: (e.target.value).split(',')})}
                                            className='w-full'
                                            placeholder='React, Node.js, JavaScript'
                                        />
                                    ) : (
                                        <div className='flex flex-wrap gap-2'>
                                            {(profile.skills ? profile.skills: []).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm'
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Description
                                    </label>
                                    {editing ? (
                                        <textarea
                                            value={profile.description}
                                            onChange={(e) => setProfile({...profile, description: e.target.value})}
                                            className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24'
                                            placeholder='Tell others about yourself...'
                                        />
                                    ) : (
                                        <p className='text-gray-900 dark:text-white'>{profile.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Achievements
                                    </label>
                                    {editing ? (
                                        <textarea
                                            value={profile.achievements || ''}
                                            onChange={(e) => setProfile({...profile, achievements: e.target.value})}
                                            className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24'
                                            placeholder='Your achievements and certifications...'
                                        />
                                    ) : (
                                        <p className='text-gray-900 dark:text-white'>{profile.achievements || 'No achievements listed'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {editing && (
                            <div className='mt-8 flex justify-end space-x-4'>
                                <button
                                    onClick={() => {
                                        setEditing(false)
                                        setNewImage(null)
                                    }}
                                    className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage

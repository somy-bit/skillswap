'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User } from 'lucide-react'

interface UserProfile {
    name: string;
    avatar: string;
}

function UserAvatar() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            
            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/user-avatar', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Error fetching user avatar:', error);
            }
        };

        fetchProfile();
    }, [user]);

    if (!profile) return null;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex items-center space-x-2">
            {profile.avatar && typeof profile.avatar === "string" && profile.avatar.trim() !== "" ? (
                <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover"
                />
            ) : profile.name ? (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(profile.name)}
                </div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
            )}
            <span className="text-gray-900 dark:text-white text-sm font-medium">{profile.name || 'User'}</span>
        </div>
    );
}

export default UserAvatar;
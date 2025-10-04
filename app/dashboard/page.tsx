'use client'
import React, { useState, useEffect, useMemo } from 'react'
import UserCard from '@/components/UserCard';
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from '@/types/type';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import SkillsOverview from '@/components/dashboard/SkillsOverview';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import { Users, Calendar, MessageSquare, TrendingUp, Filter } from 'lucide-react';

function Dashboard() {
    const { user } = useAuth();
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [occupationFilter, setOccupationFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [displayCount, setDisplayCount] = useState(8);
    const [showFilters, setShowFilters] = useState(false);

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
    ];

    const locations = [
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
        'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
        'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
        'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
        'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
        'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD'
    ];

    // Fetch all profiles once
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch('/api/profiles');
                const data = await response.json();
                setAllProfiles(data);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    // Filter profiles
    const filteredProfiles = useMemo(() => {
        let filtered = allProfiles.filter(profile => profile.email !== user?.email);
        
        if (occupationFilter) {
            filtered = filtered.filter(profile => profile.occupation === occupationFilter);
        }
        
        if (experienceFilter) {
            const minExp = parseInt(experienceFilter);
            filtered = filtered.filter(profile => profile.experience >= minExp);
        }

        if (locationFilter) {
            filtered = filtered.filter(profile => profile.location === locationFilter);
        }
        
        return filtered;
    }, [allProfiles, user?.email, occupationFilter, experienceFilter, locationFilter]);

    // Reset display count when filters change
    useEffect(() => {
        setDisplayCount(8);
    }, [occupationFilter, experienceFilter, locationFilter]);

    // Get profiles to display (lazy loaded)
    const displayedProfiles = filteredProfiles.slice(0, displayCount);
    const hasMore = displayCount < filteredProfiles.length;

    const loadMore = () => {
        setDisplayCount(prev => prev + 8);
    };

    return (
        <div className='min-h-screen w-full px-4 py-8 darkbg lightbg'>
            <div className='max-w-7xl mx-auto'>
                {/* Welcome Section */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                        Welcome back, {user?.displayName || 'Learner'}! 👋
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300'>
                        Ready to learn something new today?
                    </p>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    <StatsCard
                        title="Total Connections"
                        value={allProfiles.length}
                        icon={Users}
                        trend="+12% this month"
                        color="bg-blue-500"
                    />
                    <StatsCard
                        title="Sessions This Week"
                        value="8"
                        icon={Calendar}
                        trend="+3 from last week"
                        color="bg-green-500"
                    />
                    <StatsCard
                        title="Messages"
                        value="24"
                        icon={MessageSquare}
                        trend="5 unread"
                        color="bg-purple-500"
                    />
                    <StatsCard
                        title="Skill Level"
                        value="Advanced"
                        icon={TrendingUp}
                        trend="Level up!"
                        color="bg-orange-500"
                    />
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
                    {/* Left Column */}
                    <div className='lg:col-span-2 space-y-6'>
                        <QuickActions />
                        <UpcomingSessions />
                    </div>
                    
                    {/* Right Column */}
                    <div className='space-y-6'>
                        <SkillsOverview />
                        <RecentActivity />
                    </div>
                </div>

                {/* Discover Section */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8'>
                    <div className='flex items-center justify-between mb-24'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                                Discover Mentors
                            </h2>
                            <p className='text-gray-600 dark:text-gray-300'>
                                Connect with {filteredProfiles.length} talented professionals
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                        >
                            <Filter className='w-4 h-4' />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Occupation
                                    </label>
                                    <select
                                        value={occupationFilter}
                                        onChange={(e) => setOccupationFilter(e.target.value)}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                    >
                                        <option value="">All Occupations</option>
                                        {occupations.map(occupation => (
                                            <option key={occupation} value={occupation}>{occupation}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Experience Level
                                    </label>
                                    <select
                                        value={experienceFilter}
                                        onChange={(e) => setExperienceFilter(e.target.value)}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                    >
                                        <option value="">Any Experience</option>
                                        <option value="1">1+ Years</option>
                                        <option value="3">3+ Years</option>
                                        <option value="5">5+ Years</option>
                                        <option value="10">10+ Years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Location
                                    </label>
                                    <select
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profiles Grid */}
                    {loading ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className='bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse'></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-y-10 gap-6'>
                                {displayedProfiles.map((profile, index) => (
                                    <UserCard key={profile.email || index} profile={profile} />
                                ))}
                            </div>
                            
                            {hasMore && (
                                <div className='text-center mt-8'>
                                    <button
                                        onClick={loadMore}
                                        className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                                    >
                                        Load More Profiles
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

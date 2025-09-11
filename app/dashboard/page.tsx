'use client'
import React, { useState, useEffect, useMemo } from 'react'
import UserCard from '@/components/UserCard';
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from '@/types/type';

function Dashboard() {
    const { user } = useAuth();
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [occupationFilter, setOccupationFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [displayCount, setDisplayCount] = useState(12);

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
        setDisplayCount(12);
    }, [occupationFilter, experienceFilter, locationFilter]);

    // Get profiles to display (lazy loaded)
    const displayedProfiles = filteredProfiles.slice(0, displayCount);
    const hasMore = displayCount < filteredProfiles.length;

    const loadMore = () => {
        setDisplayCount(prev => prev + 12);
    };

    return (
        <div className='min-h-screen w-full px-4 py-8 darkbg lightbg'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>SKILL SWAP</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300'>Discover talented professionals and expand your network</p>
                </div>

                {/* Filters */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Filter Profiles</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Occupation
                            </label>
                            <select
                                value={occupationFilter}
                                onChange={(e) => setOccupationFilter(e.target.value)}
                                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value="">All Occupations</option>
                                {occupations.map((occ) => (
                                    <option key={occ} value={occ}>{occ}</option>
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
                                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value="">Any Experience</option>
                                <option value="0">Entry Level (0+ years)</option>
                                <option value="2">Junior (2+ years)</option>
                                <option value="5">Mid-Level (5+ years)</option>
                                <option value="8">Senior (8+ years)</option>
                                <option value="12">Expert (12+ years)</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Location
                            </label>
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value="">All Locations</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(occupationFilter || experienceFilter || locationFilter) && (
                        <button
                            onClick={() => {
                                setOccupationFilter('');
                                setExperienceFilter('');
                                setLocationFilter('');
                            }}
                            className='mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>

                {/* Results Count */}
                <div className='mb-16'>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Showing {displayedProfiles.length} of {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className='flex justify-center items-center py-12'>
                        <div className='text-lg text-gray-600 dark:text-gray-400'>Loading profiles...</div>
                    </div>
                )}

                {/* Profiles Grid */}
                {!loading && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 space-y-12 gap-8 justify-items-center'>
                        {displayedProfiles.map((profile, index) => (
                            <UserCard
                                key={profile.id || index}
                                profile={profile}
                            />
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {!loading && hasMore && (
                    <div className='text-center mt-8'>
                        <button
                            onClick={loadMore}
                            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium'
                        >
                            Load More ({filteredProfiles.length - displayCount} remaining)
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProfiles.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='text-gray-500 dark:text-gray-400 text-lg'>
                            No profiles found matching your criteria.
                        </div>
                        <p className='text-gray-400 dark:text-gray-500 mt-2'>
                            Try adjusting your filters to see more results.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard

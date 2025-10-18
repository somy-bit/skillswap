'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from '@/types/type';
import { useStats } from '@/lib/hooks/useStats';
import ConnectionRequestsDialog from '@/components/dashboard/ConnectionRequestsDialog';
import StatsSection from '@/components/dashboard/StatsSection';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DiscoverSection from '@/components/dashboard/DiscoverSection';

function Dashboard() {
    const { user } = useAuth();
    const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useStats();
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [connectionRequestsOpen, setConnectionRequestsOpen] = useState(false);
    const [occupationFilter, setOccupationFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchProfiles = async (loadMore = false) => {
        if (!user) return;
        
        try {
            if (!loadMore) {
                setLoading(true);
                setAllProfiles([]);
                setLastDoc(null);
            } else {
                setLoadingMore(true);
            }

            const token = await user.getIdToken();
            const url = `/api/profiles?limit=8${lastDoc && loadMore ? `&lastDoc=${lastDoc}` : ''}`;
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            
            if (loadMore) {
                setAllProfiles(prev => [...prev, ...data.profiles]);
            } else {
                setAllProfiles(data.profiles);
            }
            
            setLastDoc(data.lastDoc);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [user]);

    const loadMore = () => {
        fetchProfiles(true);
    };

    // Filter profiles
    const filteredProfiles = useMemo(() => {
        let filtered = allProfiles.filter(profile => profile.email !== user?.email);
        
        if (occupationFilter) {
            filtered = filtered.filter(profile => profile.occupation === occupationFilter);
        }
        
        if (experienceFilter) {
            const minExperience = parseInt(experienceFilter);
            filtered = filtered.filter(profile => profile.experience >= minExperience);
        }
        
        if (locationFilter) {
            filtered = filtered.filter(profile => profile.location === locationFilter);
        }
        
        return filtered;
    }, [allProfiles, user?.email, occupationFilter, experienceFilter, locationFilter]);

    // Get profiles to display (all loaded profiles, filtered)
    const displayedProfiles = filteredProfiles;

    return (
        <div className='min-h-screen w-full px-4 py-8 darkbg lightbg'>
            <div className='max-w-7xl mx-auto'>
                {/* Welcome Section */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Welcome back, {user?.displayName?.split(' ')[0] || 'User'}! 👋
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300'>
                        Here's what's happening with your skill swapping journey today.
                    </p>
                </div>

                {/* Stats Cards */}
                <StatsSection
                    stats={stats}
                    loading={statsLoading}
                    error={statsError}
                    onConnectionsClick={() => setConnectionRequestsOpen(true)}
                />

                {/* Main Content Grid */}
                <DashboardContent />

                {/* Discover Section */}
                <DiscoverSection
                    profiles={displayedProfiles}
                    loading={loading}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                    showFilters={showFilters}
                    occupationFilter={occupationFilter}
                    experienceFilter={experienceFilter}
                    locationFilter={locationFilter}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onOccupationChange={setOccupationFilter}
                    onExperienceChange={setExperienceFilter}
                    onLocationChange={setLocationFilter}
                    onLoadMore={loadMore}
                />
            </div>

            <ConnectionRequestsDialog
                isOpen={connectionRequestsOpen}
                onClose={() => setConnectionRequestsOpen(false)}
                onRequestHandled={refetchStats}
            />
        </div>
    );
}

export default Dashboard;

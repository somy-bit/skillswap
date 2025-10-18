import { Filter } from 'lucide-react';
import { Profile } from '@/types/type';
import FilterSection from './FilterSection';
import ProfilesGrid from './ProfilesGrid';

interface DiscoverSectionProps {
  profiles: Profile[];
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  showFilters: boolean;
  occupationFilter: string;
  experienceFilter: string;
  locationFilter: string;
  onToggleFilters: () => void;
  onOccupationChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onLoadMore: () => void;
}

export default function DiscoverSection({
  profiles,
  loading,
  hasMore,
  loadingMore,
  showFilters,
  occupationFilter,
  experienceFilter,
  locationFilter,
  onToggleFilters,
  onOccupationChange,
  onExperienceChange,
  onLocationChange,
  onLoadMore
}: DiscoverSectionProps) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
      <div className='flex items-center justify-between mb-24'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Discover Mentors
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Connect with {profiles.length} talented professionals
          </p>
        </div>
        <button
          onClick={onToggleFilters}
          className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          <Filter className='w-4 h-4' />
          <span>Filters</span>
        </button>
      </div>

      <FilterSection
        showFilters={showFilters}
        occupationFilter={occupationFilter}
        experienceFilter={experienceFilter}
        locationFilter={locationFilter}
        onOccupationChange={onOccupationChange}
        onExperienceChange={onExperienceChange}
        onLocationChange={onLocationChange}
      />

      <ProfilesGrid
        profiles={profiles}
        loading={loading}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
      />
    </div>
  );
}

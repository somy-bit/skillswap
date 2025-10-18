import UserCard from '@/components/UserCard';
import { Profile } from '@/types/type';

interface ProfilesGridProps {
  profiles: Profile[];
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export default function ProfilesGrid({ 
  profiles, 
  loading, 
  hasMore, 
  loadingMore, 
  onLoadMore 
}: ProfilesGridProps) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse'></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-y-10 gap-6 mt-12'>
        {profiles.map((profile, index) => (
          <UserCard key={profile.email || index} profile={profile} />
        ))}
      </div>
      
      {hasMore && (
        <div className='text-center mt-8'>
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
          >
            {loadingMore ? 'Loading...' : 'Load More Profiles'}
          </button>
        </div>
      )}
    </>
  );
}

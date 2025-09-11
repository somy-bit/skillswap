import { Profile } from '@/types/type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

interface UserCardProps {
  profile: Profile;
}

export default function UserCard({ profile }: UserCardProps) {
  const router = useRouter();
  const borderColor = occupationColors[profile.occupation] || 'border-gray-400';

  const handleClick = () => {
    router.push(`/profile/${profile.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 pt-16 max-w-sm mx-auto cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {/* Profile Image - Half outside card */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className={`w-24 h-24 rounded-full border-4 ${borderColor} overflow-hidden bg-white`}>
          <Image
            src={profile.avatar || '/default-avatar.png'}
            alt={profile.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="text-center mt-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {profile.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {profile.occupation}
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {profile.experience} years experience • {profile.location}
        </p>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {profile.description}
        </p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300">
              +{profile.skills.length - 3}
            </span>
          )}
        </div>
        
        {/* Rating */}
        {profile.rating && (
          <div className="flex items-center justify-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              {profile.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

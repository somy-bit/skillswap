interface FilterSectionProps {
  showFilters: boolean;
  occupationFilter: string;
  experienceFilter: string;
  locationFilter: string;
  onOccupationChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

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

export default function FilterSection({
  showFilters,
  occupationFilter,
  experienceFilter,
  locationFilter,
  onOccupationChange,
  onExperienceChange,
  onLocationChange
}: FilterSectionProps) {
  if (!showFilters) return null;

  return (
    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Occupation
          </label>
          <select
            value={occupationFilter}
            onChange={(e) => onOccupationChange(e.target.value)}
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
            onChange={(e) => onExperienceChange(e.target.value)}
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
            onChange={(e) => onLocationChange(e.target.value)}
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
  );
}

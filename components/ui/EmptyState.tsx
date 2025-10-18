import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className='text-center py-12'>
      <Icon className='w-12 h-12 text-gray-400 mx-auto mb-4' />
      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>{title}</h3>
      {description && (
        <p className='text-gray-500 dark:text-gray-400 mb-4'>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

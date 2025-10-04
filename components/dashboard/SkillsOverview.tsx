import { TrendingUp, Star, Award } from 'lucide-react';

export default function SkillsOverview() {
  const skills = [
    { name: 'React', level: 85, sessions: 12 },
    { name: 'Node.js', level: 70, sessions: 8 },
    { name: 'Python', level: 90, sessions: 15 },
    { name: 'Design', level: 60, sessions: 5 }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Skills</h3>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {skill.name}
              </span>
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-500">{skill.sessions} sessions</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            You've completed 40 sessions this month!
          </span>
        </div>
      </div>
    </div>
  );
}

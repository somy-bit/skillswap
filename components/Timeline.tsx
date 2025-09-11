import { UserPlus, BarChart3, Search, MessageSquare, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <UserPlus className="w-5 h-5 text-blue-600" />,
    title: "Register & Profile Setup",
    description:
      "Begin by signing up with your email, name, and password. Complete your profile by detailing your skills, education, and certifications.",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
    title: "Skill Evaluation",
    description:
      "Our platform analyzes your profile to assign scores to your offered skills, helping others understand your expertise level.",
  },
  {
    icon: <Search className="w-5 h-5 text-blue-600" />,
    title: "Discover Matches",
    description:
      "Use our search feature to find users offering skills you want to learn and seeking skills you offer, sorted by skill scores for best matches.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
    title: "Connect & Communicate",
    description:
      "When you find a match, message them directly on the platform to express interest and discuss potential skill exchange.",
  },
  {
    icon: <Calendar className="w-5 h-5 text-blue-600" />,
    title: "Schedule & Meet",
    description:
      "Agree on a session time, schedule it through the platform, and receive a Google Meet link for your virtual exchange.",
  },
];

export default function Timeline() {
  return (
    <div className="relative border-l-2 border-dashed border-gray-200 pl-8 space-y-8">
      {steps.map((step, i) => (
        <motion.div 
          key={i} 
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
        >
          {/* Icon container */}
          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full border border-gray-300">
            {step.icon}
          </div>

          {/* Content */}
          <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
          <p className="text-gray-900 dark:text-white opacity-80 text-sm">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
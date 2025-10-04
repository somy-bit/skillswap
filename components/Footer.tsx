import { Heart, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className=" border dark:border-t-white border-t-gray-500 lightbg darkbg text-gray-500 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">SkillSwap</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Connect, learn, and grow together. Share your skills and discover new ones in our vibrant community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 dark:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-gray-500 dark:text-white transition-colors">Dashboard</a></li>
              <li><a href="/dashboard/sessions" className="text-gray-500 dark::text-white transition-colors">Sessions</a></li>
              <li><a href="/dashboard/profile" className="text-gray-500 dark:text-white transition-colors">Profile</a></li>
              <li><a href="/dashboard/messages" className="text-gray-500 dark:text-white transition-colors">Messages</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 dark:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-500 dark:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 dark:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 dark:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SkillSwap. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
}

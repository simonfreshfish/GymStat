import React from 'react';
import { Heart, Code, Dumbbell, Target, Zap, Users } from 'lucide-react';

interface AboutTabProps {
  isDarkMode: boolean;
}

const AboutTab: React.FC<AboutTabProps> = ({ isDarkMode }) => {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">💪</div>
        <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          About GymStat
        </h2>
        <p className={`text-lg transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Your intelligent fitness companion for tracking progress and achieving goals
        </p>
      </div>

      {/* Mission Statement */}
      <div className={`p-8 border rounded-xl transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-gray-600' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="text-red-500" size={28} />
          <h3 className={`text-xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Our Mission
          </h3>
        </div>
        <p className={`text-base leading-relaxed transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          GymStat was created to provided a no B.S, fun, and user-friendly way to track your workouts. We believe access to a tool like that can significantly help people understand their progress, celebrate their achievements, and stay motivated on their fitness journey. Though we thought out the app for our young gym grasshoppers first, we are sure it'll satisfy the Zyzz level lifters of the community as well :)
        </p>
      </div>

      {/* Motivation */}
      <div className={`p-8 border rounded-xl transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-green-900 to-teal-900 border-gray-600' 
          : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <Target className="text-green-500" size={28} />
          <h3 className={`text-xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Motivation
          </h3>
        </div>
        <p className={`text-base leading-relaxed transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          GymStat was entirely engineered to make fitness more approachable and your results more shareable. Anyone at any level can inspire around them. We have purposefully designed a trophy system that rewards consistency above all. Even if that 5lbs dumbbell is the heaviest you can carry, you'll eventually move the equivalent of a 747 :)
        </p>
      </div>

      {/* Regarding AI */}
      <div className={`p-8 border rounded-xl transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-900 to-pink-900 border-gray-600' 
          : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="text-purple-500" size={28} />
          <h3 className={`text-xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Regarding AI
          </h3>
        </div>
        <p className={`text-base leading-relaxed transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Though generative Artificial Intelligence was used as an assistance tool during early software development to reduce cost, we are committed to never include it as an app feature, whether it be for software or support. We strongly think there is little point in working so hard towards a physique you're happy with if there no planet for you to enjoy it on.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`p-6 border rounded-xl transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`p-3 rounded-lg mb-4 ${
            isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            <Dumbbell size={24} />
          </div>
          <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Smart Tracking
          </h4>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Automatically calculate 1RM, track volume, and monitor your progress with intelligent analytics.
          </p>
        </div>

        <div className={`p-6 border rounded-xl transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`p-3 rounded-lg mb-4 ${
            isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'
          }`}>
            <Target size={24} />
          </div>
          <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Goal Oriented
          </h4>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Set targets, track achievements, and get personalized insights to reach your fitness goals faster.
          </p>
        </div>

        <div className={`p-6 border rounded-xl transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`p-3 rounded-lg mb-4 ${
            isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'
          }`}>
            <Zap size={24} />
          </div>
          <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Motivational
          </h4>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Fun weight comparisons, progress celebrations, and yearly wrapped summaries keep you motivated.
          </p>
        </div>
      </div>

      {/* Version & Technical Info */}
      <div className={`p-6 border rounded-xl transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <Code className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} size={24} />
          <h3 className={`text-xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Technical Details
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Version Information
            </h4>
            <ul className={`space-y-1 text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <li>• App Version: 2.0.0 (Prototype)</li>
              <li>• Build: React + TypeScript</li>
              <li>• Last Updated: January 2025</li>
              <li>• Platform: Progressive Web App</li>
            </ul>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Key Features
            </h4>
            <ul className={`space-y-1 text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <li>• Offline-first data storage</li>
              <li>• Real-time progress tracking</li>
              <li>• Intelligent weight comparisons</li>
              <li>• Customizable workout plans</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Community & Future */}
      <div className={`p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-800/50' 
          : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="text-center">
          <Users className={`mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={48} />
          
          <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Built for the Community
          </h3>
          
          <p className={`text-base mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            GymStat is continuously evolving based on user feedback and the needs of the fitness community. 
            We're committed to making this the best workout tracking experience possible.
          </p>

          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
          }`}>
            <Heart size={16} />
            <span className="font-medium">Made with passion for fitness enthusiasts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
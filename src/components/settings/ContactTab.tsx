import React from 'react';
import { Mail, MessageCircle, Bug, Lightbulb, Heart, ExternalLink } from 'lucide-react';

interface ContactTabProps {
  isDarkMode: boolean;
}

const ContactTab: React.FC<ContactTabProps> = ({ isDarkMode }) => {
  const contactOptions = [
    {
      icon: Bug,
      title: 'Report a Bug',
      description: 'Found something that\'s not working? Let us know!',
      action: 'Report Bug',
      color: 'red',
      href: 'mailto:gymstatapp@gmail.com?subject=Bug Report&body=Please describe the bug you encountered:'
    },
    {
      icon: Lightbulb,
      title: 'Feature Request',
      description: 'Have an idea to make GymStat better? We\'d love to hear it!',
      action: 'Suggest Feature',
      color: 'yellow',
      href: 'mailto:gymstatapp@gmail.com?subject=Feature Request&body=I would like to suggest the following feature:'
    },
    {
      icon: MessageCircle,
      title: 'General Support',
      description: 'Need help or have questions about using GymStat?',
      action: 'Get Support',
      color: 'blue',
      href: 'mailto:gymstatapp@gmail.com?subject=Support Request&body=Hi! I need help with:'
    },
    {
      icon: Heart,
      title: 'Share Feedback',
      description: 'Tell us what you love or what could be improved!',
      action: 'Send Feedback',
      color: 'pink',
      href: 'mailto:gymstatapp@gmail.com?subject=User Feedback&body=Here\'s my feedback about GymStat:'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: {
        bg: isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600',
        button: isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
      },
      yellow: {
        bg: isDarkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600',
        button: isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
      },
      blue: {
        bg: isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600',
        button: isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
      },
      pink: {
        bg: isDarkMode ? 'bg-pink-900 text-pink-400' : 'bg-pink-100 text-pink-600',
        button: isDarkMode ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">📞</div>
        <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Get in Touch
        </h2>
        <p className={`text-lg transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          We're here to help! Send us an email about anything GymStat related
        </p>
      </div>

      {/* Contact Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactOptions.map((option, index) => {
          const Icon = option.icon;
          const colorClasses = getColorClasses(option.color);
          
          return (
            <div key={index} className={`p-6 border rounded-xl transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {option.title}
                  </h3>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {option.description}
                  </p>
                  <a
                    href={option.href}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 ${colorClasses.button}`}
                  >
                    <span>{option.action}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Contact Info */}
      <div className={`p-8 border rounded-xl transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
          : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
      }`}>
        <div className="text-center">
          <Mail className={`mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={48} />
          
          <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Direct Contact
          </h3>
          
          <p className={`text-base mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            For urgent matters or detailed discussions, reach out to us directly
          </p>

          <div className="max-w-md mx-auto">
            <div className={`p-6 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <div className={`font-medium mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Email Us
              </div>
              <a 
                href="mailto:gymstatapp@gmail.com"
                className={`text-lg font-medium transition-colors duration-300 hover:underline ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                gymstatapp@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Response Time Info */}
      <div className={`p-6 border-2 border-dashed rounded-xl transition-colors duration-300 ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-800/50' 
          : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="text-4xl mb-3">⏰</div>
          
          <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            We'll Get Back to You
          </h3>
          
          <div className={`text-sm space-y-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>We typically respond within 24-48 hours.</p>
            <p>All emails are read and appreciated!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
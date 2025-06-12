import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle, ArrowRight, Heart, Shield, Clock, Users } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    notifications: true,
    emergencyContact: '',
    medicalConditions: [],
    allergies: [],
    medications: []
  });
  
  const { updateUser, user } = useAuth();
  const { t } = useLanguage();

  const handleComplete = () => {
    // Update user with onboarding completion
    updateUser({
      ...user,
      onboardingCompleted: true,
      preferences
    });
  };

  const features = [
    {
      icon: Heart,
      title: 'AI Health Assessment',
      description: 'Get instant health insights with our AI-powered symptom checker'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with enterprise-grade security'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access healthcare services anytime, anywhere in Ethiopia'
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Connect with licensed healthcare professionals in your area'
    }
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('welcome')} {user?.firstName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Let's set up your TeleHealth experience
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 text-left">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Quick Setup
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emergency Contact (Optional)
                </label>
                <input
                  type="tel"
                  value={preferences.emergencyContact}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    emergencyContact: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+251911234567"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: e.target.checked
                    })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Enable push notifications for appointments and health reminders
                  </span>
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Privacy Notice:</strong> Your health information is encrypted and only shared with your chosen healthcare providers. You can update these preferences anytime in settings.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {t('back')}
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Complete Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


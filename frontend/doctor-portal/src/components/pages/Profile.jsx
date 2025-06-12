import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your professional profile and account settings
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Doctor Profile
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This section will contain your professional profile, credentials, specializations, 
            and account management features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;


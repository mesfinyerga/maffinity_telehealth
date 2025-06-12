// Placeholder components for remaining pages
import { Users } from 'lucide-react';

const Patients = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your patient records and medical history
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Patients Management
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This section will contain comprehensive patient management features including medical records, 
            treatment history, and patient communication tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Patients;


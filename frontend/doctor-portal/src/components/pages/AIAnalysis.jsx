import { Brain, Image, FileText, TrendingUp } from 'lucide-react';

const AIAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review AI-powered medical analysis and diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Triage
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Review AI-powered symptom analysis and triage recommendations for your patients.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Image className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Image Analysis
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered analysis of medical images including X-rays, skin lesions, and lab results.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analytics
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analytics and insights from AI analysis patterns and outcomes.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            AI Analysis Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This section will contain detailed AI analysis results, medical image diagnostics, 
            and intelligent insights to support your clinical decision-making.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;


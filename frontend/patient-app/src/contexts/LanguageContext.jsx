import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionaries
const translations = {
  en: {
    // Common
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'cancel': 'Cancel',
    'save': 'Save',
    'next': 'Next',
    'back': 'Back',
    'continue': 'Continue',
    'submit': 'Submit',
    
    // Authentication
    'login': 'Login',
    'register': 'Register',
    'email': 'Email',
    'password': 'Password',
    'firstName': 'First Name',
    'lastName': 'Last Name',
    'phone': 'Phone Number',
    'signIn': 'Sign In',
    'signUp': 'Sign Up',
    'forgotPassword': 'Forgot Password?',
    'alreadyHaveAccount': 'Already have an account?',
    'dontHaveAccount': "Don't have an account?",
    
    // Navigation
    'home': 'Home',
    'aiTriage': 'AI Health Check',
    'appointments': 'Appointments',
    'consultations': 'Consultations',
    'profile': 'Profile',
    
    // Home
    'goodMorning': 'Good Morning',
    'goodAfternoon': 'Good Afternoon',
    'goodEvening': 'Good Evening',
    'howAreYouFeeling': 'How are you feeling today?',
    'quickActions': 'Quick Actions',
    'bookAppointment': 'Book Appointment',
    'startHealthCheck': 'Start Health Check',
    'viewRecords': 'View Medical Records',
    'emergencyContact': 'Emergency Contact',
    
    // AI Triage
    'healthAssessment': 'Health Assessment',
    'describeSymptoms': 'Describe your symptoms',
    'typeSymptoms': 'Type your symptoms here...',
    'analyzeSymptoms': 'Analyze Symptoms',
    'urgencyLevel': 'Urgency Level',
    'recommendations': 'Recommendations',
    
    // Appointments
    'upcomingAppointments': 'Upcoming Appointments',
    'pastAppointments': 'Past Appointments',
    'noAppointments': 'No appointments found',
    'scheduleNew': 'Schedule New Appointment',
    
    // Profile
    'personalInfo': 'Personal Information',
    'medicalHistory': 'Medical History',
    'settings': 'Settings',
    'language': 'Language',
    'theme': 'Theme',
    'notifications': 'Notifications',
    'logout': 'Logout'
  },
  am: {
    // Common
    'welcome': 'እንኳን ደህና መጡ',
    'loading': 'በመጫን ላይ...',
    'error': 'ስህተት',
    'success': 'ተሳክቷል',
    'cancel': 'ሰርዝ',
    'save': 'አስቀምጥ',
    'next': 'ቀጣይ',
    'back': 'ተመለስ',
    'continue': 'ቀጥል',
    'submit': 'ላክ',
    
    // Authentication
    'login': 'ግባ',
    'register': 'ተመዝገብ',
    'email': 'ኢሜይል',
    'password': 'የይለፍ ቃል',
    'firstName': 'ስም',
    'lastName': 'የአባት ስም',
    'phone': 'ስልክ ቁጥር',
    'signIn': 'ግባ',
    'signUp': 'ተመዝገብ',
    'forgotPassword': 'የይለፍ ቃልዎን ረሱት?',
    'alreadyHaveAccount': 'መለያ አለዎት?',
    'dontHaveAccount': 'መለያ የለዎትም?',
    
    // Navigation
    'home': 'ቤት',
    'aiTriage': 'የጤና ምርመራ',
    'appointments': 'ቀጠሮዎች',
    'consultations': 'ምክክር',
    'profile': 'መገለጫ',
    
    // Home
    'goodMorning': 'እንደምን አደሩ',
    'goodAfternoon': 'እንደምን ዋሉ',
    'goodEvening': 'እንደምን አመሹ',
    'howAreYouFeeling': 'ዛሬ እንዴት ይሰማዎታል?',
    'quickActions': 'ፈጣን እርምጃዎች',
    'bookAppointment': 'ቀጠሮ ይያዙ',
    'startHealthCheck': 'የጤና ምርመራ ይጀምሩ',
    'viewRecords': 'የሕክምና መዝገቦች ይመልከቱ',
    'emergencyContact': 'የአደጋ ጊዜ ስልክ',
    
    // AI Triage
    'healthAssessment': 'የጤና ምዘና',
    'describeSymptoms': 'ምልክቶችዎን ይግለጹ',
    'typeSymptoms': 'ምልክቶችዎን እዚህ ይጻፉ...',
    'analyzeSymptoms': 'ምልክቶች ይተንተኑ',
    'urgencyLevel': 'የአስቸኳይነት ደረጃ',
    'recommendations': 'ምክሮች',
    
    // Appointments
    'upcomingAppointments': 'የሚመጡ ቀጠሮዎች',
    'pastAppointments': 'ያለፉ ቀጠሮዎች',
    'noAppointments': 'ምንም ቀጠሮ አልተገኘም',
    'scheduleNew': 'አዲስ ቀጠሮ ይያዙ',
    
    // Profile
    'personalInfo': 'የግል መረጃ',
    'medicalHistory': 'የሕክምና ታሪክ',
    'settings': 'ቅንብሮች',
    'language': 'ቋንቋ',
    'theme': 'ገጽታ',
    'notifications': 'ማሳወቂያዎች',
    'logout': 'ውጣ'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('patientLanguage');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('patientLanguage', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
    isAmharic: language === 'am',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};


import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Send, 
  Mic, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Brain,
  User,
  Bot
} from 'lucide-react';

export default function AITriage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI health assistant. I can help assess your symptoms and provide health guidance. Please describe how you\'re feeling today.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const messagesEndRef = useRef(null);
  const { t, isAmharic } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response service
  const getAIResponse = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple keyword-based responses for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('head')) {
      return {
        response: "I understand you're experiencing headaches. Can you tell me more about:\n\n• How long have you had this headache?\n• On a scale of 1-10, how would you rate the pain?\n• Is it accompanied by any other symptoms like nausea, sensitivity to light, or fever?",
        urgency: 'medium',
        recommendations: [
          'Stay hydrated and rest in a quiet, dark room',
          'Consider over-the-counter pain relief if appropriate',
          'Monitor for worsening symptoms'
        ]
      };
    }
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return {
        response: "Fever can indicate various conditions. Please provide more details:\n\n• What is your current temperature?\n• How long have you had the fever?\n• Are you experiencing any other symptoms like cough, sore throat, or body aches?",
        urgency: 'medium',
        recommendations: [
          'Monitor your temperature regularly',
          'Stay hydrated with plenty of fluids',
          'Rest and avoid strenuous activities',
          'Seek medical attention if fever exceeds 39°C (102°F)'
        ]
      };
    }
    
    if (lowerMessage.includes('chest pain') || lowerMessage.includes('chest')) {
      return {
        response: "Chest pain requires immediate attention. Please seek emergency medical care right away if you're experiencing:\n\n• Severe or crushing chest pain\n• Pain radiating to arm, jaw, or back\n• Shortness of breath\n• Sweating or nausea\n\nIf symptoms are mild, please describe the nature of your chest discomfort.",
        urgency: 'high',
        recommendations: [
          'Seek immediate medical attention',
          'Call emergency services if symptoms are severe',
          'Do not drive yourself to the hospital',
          'Chew aspirin if not allergic (unless contraindicated)'
        ]
      };
    }
    
    return {
      response: "Thank you for sharing that information. To provide you with the best assessment, could you please provide more specific details about your symptoms? For example:\n\n• When did the symptoms start?\n• How severe are they on a scale of 1-10?\n• Have you tried any treatments?\n• Do you have any relevant medical history?",
      urgency: 'low',
      recommendations: [
        'Monitor your symptoms',
        'Stay hydrated and get adequate rest',
        'Contact a healthcare provider if symptoms worsen'
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update assessment
      setAssessment({
        urgency: aiResponse.urgency,
        recommendations: aiResponse.recommendations,
        timestamp: new Date()
      });

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact a healthcare provider directly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      default: return 'bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('healthAssessment')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered symptom checker
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Summary */}
      {assessment && (
        <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className={`rounded-lg p-3 border ${getUrgencyColor(assessment.urgency)}`}>
            <div className="flex items-center space-x-2 mb-2">
              {(() => {
                const Icon = getUrgencyIcon(assessment.urgency);
                return <Icon size={16} />;
              })()}
              <span className="font-medium text-sm">
                {assessment.urgency === 'high' && 'High Priority'}
                {assessment.urgency === 'medium' && 'Medium Priority'}
                {assessment.urgency === 'low' && 'Low Priority'}
              </span>
            </div>
            <p className="text-xs opacity-90">
              Based on your symptoms, here are my recommendations
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-purple-100 dark:bg-purple-900'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Recommendations */}
      {assessment && assessment.recommendations && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
            {t('recommendations')}
          </h3>
          <div className="space-y-1">
            {assessment.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('typeSymptoms')}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
              <Camera size={20} />
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
              <Mic size={20} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-full transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          This AI assistant provides general health information only. Always consult healthcare professionals for medical advice.
        </div>
      </div>
    </div>
  );
}


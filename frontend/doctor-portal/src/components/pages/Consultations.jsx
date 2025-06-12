import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image,
  FileText,
  Phone,
  Video,
  Mic,
  MoreVertical,
  Clock,
  User,
  Star,
  CheckCircle
} from 'lucide-react';

const Consultations = () => {
  const { id } = useParams();
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sample consultations data
  useEffect(() => {
    const sampleConsultations = [
      {
        id: 1,
        patient: {
          name: 'John Doe',
          age: 35,
          avatar: 'JD',
          lastSeen: '2 minutes ago'
        },
        status: 'active',
        startTime: '2024-12-06T10:00:00Z',
        lastMessage: 'Thank you for the consultation, Doctor.',
        unreadCount: 0,
        type: 'video'
      },
      {
        id: 2,
        patient: {
          name: 'Jane Smith',
          age: 28,
          avatar: 'JS',
          lastSeen: 'Online'
        },
        status: 'active',
        startTime: '2024-12-06T09:30:00Z',
        lastMessage: 'I have been experiencing some side effects...',
        unreadCount: 2,
        type: 'chat'
      },
      {
        id: 3,
        patient: {
          name: 'Mike Johnson',
          age: 42,
          avatar: 'MJ',
          lastSeen: '1 hour ago'
        },
        status: 'completed',
        startTime: '2024-12-06T08:00:00Z',
        lastMessage: 'Prescription sent. Thank you!',
        unreadCount: 0,
        type: 'chat'
      }
    ];
    setConsultations(sampleConsultations);

    // Auto-select first consultation or the one from URL
    if (id) {
      const consultation = sampleConsultations.find(c => c.id === parseInt(id));
      setSelectedConsultation(consultation);
    } else if (sampleConsultations.length > 0) {
      setSelectedConsultation(sampleConsultations[0]);
    }
  }, [id]);

  // Sample messages for selected consultation
  useEffect(() => {
    if (selectedConsultation) {
      const sampleMessages = [
        {
          id: 1,
          senderId: 'patient',
          senderName: selectedConsultation.patient.name,
          message: 'Hello Doctor, I have been experiencing persistent headaches for the past week.',
          timestamp: '2024-12-06T10:00:00Z',
          type: 'text'
        },
        {
          id: 2,
          senderId: 'doctor',
          senderName: 'Dr. Smith',
          message: 'Hello John, I understand your concern. Can you describe the intensity and frequency of these headaches?',
          timestamp: '2024-12-06T10:01:00Z',
          type: 'text'
        },
        {
          id: 3,
          senderId: 'patient',
          senderName: selectedConsultation.patient.name,
          message: 'They occur mostly in the morning and rate about 7/10 in intensity. Sometimes accompanied by nausea.',
          timestamp: '2024-12-06T10:02:00Z',
          type: 'text'
        },
        {
          id: 4,
          senderId: 'patient',
          senderName: selectedConsultation.patient.name,
          message: 'I have attached my recent blood test results.',
          timestamp: '2024-12-06T10:03:00Z',
          type: 'file',
          fileName: 'blood_test_results.pdf'
        },
        {
          id: 5,
          senderId: 'doctor',
          senderName: 'Dr. Smith',
          message: 'Thank you for the detailed information and the test results. Based on your symptoms and the normal blood work, this appears to be tension-type headaches. I recommend starting with stress management techniques and will prescribe a mild pain reliever.',
          timestamp: '2024-12-06T10:05:00Z',
          type: 'text'
        }
      ];
      setMessages(sampleMessages);
    }
  }, [selectedConsultation]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: 'doctor',
        senderName: 'Dr. Smith',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Consultations List */}
      <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Consultations
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {consultations.filter(c => c.status === 'active').length} active sessions
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              onClick={() => setSelectedConsultation(consultation)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedConsultation?.id === consultation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center text-sm font-medium">
                    {consultation.patient.avatar}
                  </div>
                  {consultation.status === 'active' && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-3 w-3 border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {consultation.patient.name}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                      {consultation.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {consultation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {consultation.patient.lastSeen}
                  </p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {consultation.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Started {formatTime(consultation.startTime)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {consultation.type === 'video' ? (
                        <Video className="h-3 w-3 text-gray-400" />
                      ) : (
                        <MessageSquare className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      {selectedConsultation ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center text-sm font-medium">
                  {selectedConsultation.patient.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedConsultation.patient.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Age {selectedConsultation.patient.age} • {selectedConsultation.patient.lastSeen}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'doctor' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === 'doctor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {message.type === 'text' ? (
                    <p className="text-sm">{message.message}</p>
                  ) : message.type === 'file' ? (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{message.fileName}</span>
                    </div>
                  ) : null}
                  
                  <p className={`text-xs mt-1 ${
                    message.senderId === 'doctor' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Image className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows="1"
                />
              </div>

              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Mic className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Select a consultation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;


import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Award,
  Heart,
  DollarSign,
  Building
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface ChatbotKnowledge {
  [key: string]: {
    response: string;
    quickReplies?: string[];
    keywords: string[];
  };
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const knowledgeBase: ChatbotKnowledge = {
    greeting: {
      response: "Hello! Welcome to RR Greenfield International School. I'm here to help you with any questions about our school. What would you like to know?",
      quickReplies: ["Admissions", "Academic Programs", "Facilities", "Contact Info", "About School"],
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "start"]
    },
    admissions: {
      response: "Our admissions for 2025-26 will open soon! We offer admission from Nursery to Class VIII. Required documents include birth certificate, photographs, previous school records, and Aadhar card. The admission process includes application form submission, document verification, and interaction session.",
      quickReplies: ["Admission Process", "Required Documents", "Important Dates", "Contact Admissions"],
      keywords: ["admission", "apply", "enrollment", "join", "new student", "application"]
    },
    admissionProcess: {
      response: "Our admission process has 4 simple steps:\n1. Fill application form\n2. Submit required documents\n3. Parent-child interaction session\n4. Admission confirmation and fee payment\n\nFor 2025-26 admissions, please contact us at 7903059909 or rrgreenfieldsch@gmail.com for details.",
      quickReplies: ["Required Documents", "Important Dates", "Fee Information"],
      keywords: ["admission process", "how to apply", "steps", "procedure"]
    },
    documents: {
      response: "Required documents for admission:\n• Birth Certificate (original + photocopy)\n• 6 passport size photographs\n• Transfer Certificate (for students from other schools)\n• Previous year mark sheet/report card\n• Aadhar Card (student + parents)\n• Address proof\n• Medical certificate (if applicable)\n• Caste certificate (if applicable)",
      quickReplies: ["Admission Process", "Important Dates", "Contact Info"],
      keywords: ["documents", "required documents", "papers", "certificates", "what do i need"]
    },
    academics: {
      response: "We offer International Standards curriculum from Nursery to Class VIII:\n\n• Balvatika (Nursery-UKG): Play-based learning\n• Primary (I-V): Foundation subjects\n• Middle (VI-VIII): Comprehensive education\n\nWe focus on interactive learning, practical application, and holistic development.",
      quickReplies: ["Curriculum Details", "Teaching Methods", "Facilities", "Faculty"],
      keywords: ["academics", "curriculum", "subjects", "classes", "cbse", "studies", "education"]
    },
    facilities: {
      response: "Our school offers modern facilities:\n\n🏫 Well-equipped classrooms\n📚 Extensive library with digital resources\n🔬 Modern science laboratories (Physics, Chemistry, Biology)\n💻 Computer lab with latest technology\n🎨 Art & craft rooms\n🎵 Music room with instruments\n🌳 Outdoor learning spaces and gardens\n🏃 Sports facilities\n🚌 Transportation with GPS tracking",
      quickReplies: ["Academic Programs", "Sports Activities", "Transportation", "Contact Info"],
      keywords: ["facilities", "infrastructure", "library", "lab", "computer", "sports", "playground", "building"]
    },
    contact: {
        response: "📍 Address: New bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar\n\n📞 Phone: 7903059909 | 8210215818\n\n📧 Email: rrgreenfieldsch@gmail.com\n\n🕒 School Hours:\nMonday-Friday: 8:00 AM - 3:00 PM\nSaturday: 8:00 AM - 12:00 PM\nOffice Hours: 9:00 AM - 4:00 PM",
      quickReplies: ["Directions", "Office Hours", "Admissions", "Visit Campus"],
      keywords: ["contact", "phone", "email", "address", "location", "reach", "call", "visit"]
    },
    about: {
      response: "RR Greenfield International School is a premier International Standard School institution in Madhepura, Bihar. We provide quality education from Nursery to Class VIII, focusing on:\n\n✨ Academic excellence\n💪 Character building\n🌟 Leadership development\n🌍 Global citizenship\n❤️ Holistic development\n\nOur mission is to provide affordable, quality education accessible to all families while preparing responsible global citizens.",
      quickReplies: ["Mission & Vision", "Our Values", "Faculty", "Achievements"],
      keywords: ["about", "school", "information", "overview", "mission", "vision", "history"]
    },
    faculty: {
      response: "Our dedicated faculty includes highly qualified and experienced educators:\n\n👩‍🏫 Expert teachers for all subjects\n🎓 Experienced in International Standards curriculum\n📚 Continuous professional development\n💡 Innovative teaching methods\n❤️ Committed to student success\n\nKey faculty members include Chunni Kumari, Suman Thapa, Ningma Lepcha, and many other dedicated professionals.",
      quickReplies: ["Teaching Methods", "Academic Programs", "About School"],
      keywords: ["faculty", "teachers", "staff", "educators", "teaching", "qualification"]
    },
    fees: {
      response: "We believe in providing quality education at affordable fees. For detailed fee structure and payment information:\n\n📞 Contact our office: 7903059909 | 8210215818\n📧 Email: rrgreenfieldsch@gmail.com\n\nWe offer transparent pricing with no hidden charges and are committed to making education accessible to families from all backgrounds.",
      quickReplies: ["Payment Options", "Scholarships", "Contact Admissions"],
      keywords: ["fees", "cost", "price", "payment", "scholarship", "financial", "money", "affordable"]
    },
    transportation: {
      response: "🚌 We provide safe and reliable school transportation:\n\n✅ GPS tracking for all buses\n✅ Experienced and trained drivers\n✅ Various routes covering Madhepura and surrounding areas\n✅ Safety protocols and supervision\n✅ Reasonable transportation fees\n\nFor route details and transportation registration, please contact our office.",
      quickReplies: ["Routes Available", "Transportation Fees", "Safety Measures", "Contact Info"],
      keywords: ["transportation", "bus", "transport", "pickup", "drop", "routes", "vehicle"]
    },
    extracurricular: {
      response: "We offer diverse extracurricular activities for holistic development:\n\n🏃 Sports: Football, Cricket, Basketball, Athletics\n🎨 Arts: Drawing, Painting, Craft work\n🎵 Music: Vocal, Instrumental training\n💃 Dance: Classical, Folk, Modern\n🎭 Drama and Theatre\n�� Literary activities and clubs\n🏆 Competitions and events\n🌱 Environmental clubs",
      quickReplies: ["Sports Activities", "Cultural Programs", "Competitions", "Facilities"],
      keywords: ["extracurricular", "activities", "sports", "music", "dance", "art", "clubs", "competitions"]
    },
    timings: {
      response: "🕒 School Timings:\n\n📚 Classes:\nMonday - Friday: 8:00 AM - 3:00 PM\nSaturday: 8:00 AM - 12:00 PM\n\n🏢 Office Hours:\nMonday - Friday: 9:00 AM - 4:00 PM\nSaturday: 9:00 AM - 1:00 PM\n\n📞 For any urgent matters, you can call us during office hours.",
      quickReplies: ["Holiday Calendar", "Contact Info", "Admission Enquiry"],
      keywords: ["timings", "hours", "schedule", "time", "when", "office hours", "school hours"]
    },
    help: {
      response: "I can help you with information about:\n\n🎓 Admissions and enrollment\n📚 Academic programs and curriculum\n🏫 School facilities and infrastructure\n���� Faculty and teaching methods\n📞 Contact information and location\n💰 Fees and payment information\n🚌 Transportation services\n🎨 Extracurricular activities\n⏰ School timings and calendar\n\nWhat would you like to know more about?",
      quickReplies: ["Admissions", "Academics", "Facilities", "Contact Info"],
      keywords: ["help", "assist", "support", "what can you do", "options", "menu"]
    }
  };

  const findBestMatch = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Check for exact keyword matches first
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (value.keywords.some(keyword => input.includes(keyword))) {
        return key;
      }
    }
    
    // If no match found, return help
    return 'help';
  };

  const simulateTyping = (delay: number = 1000) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(void 0);
      }, delay);
    });
  };

  const addMessage = (content: string, type: 'user' | 'bot', quickReplies?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      quickReplies
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    setInputValue('');

    // Show typing indicator
    await simulateTyping(800);

    // Find response
    const matchKey = findBestMatch(text);
    const response = knowledgeBase[matchKey];
    
    addMessage(response.response, 'bot', response.quickReplies);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const initializeChat = () => {
    if (messages.length === 0) {
      const welcomeMessage = knowledgeBase.greeting;
      addMessage(welcomeMessage.response, 'bot', welcomeMessage.quickReplies);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setTimeout(initializeChat, 300);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-school-primary hover:bg-school-primary-dark text-white shadow-lg z-50 transition-all duration-300 hover:scale-110"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 border-school-primary/20">
          {/* Chat Header */}
          <div className="bg-school-primary text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-school-accent w-10 h-10 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-school-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">School Assistant</h3>
                <p className="text-xs text-white/80">RR Greenfield International School</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <CardContent className="p-0 h-80 overflow-y-auto bg-gray-50">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-school-accent' 
                        : 'bg-school-primary'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-school-secondary" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-school-accent text-school-secondary'
                        : 'bg-white text-school-secondary border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {message.quickReplies && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 border-school-primary text-school-primary hover:bg-school-primary hover:text-white"
                              onClick={() => handleQuickReply(reply)}
                            >
                              {reply}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-school-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-school-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-school-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-school-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-school-primary/30 focus:border-school-primary"
              />
              <Button 
                onClick={() => handleSendMessage()}
                size="icon"
                className="bg-school-primary hover:bg-school-primary-dark text-white"
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;

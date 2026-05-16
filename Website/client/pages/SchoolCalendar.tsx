import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Trophy,
  GraduationCap,
  Sun,
  Moon,
  Star,
  Flag,
  Heart,
  TreePine,
  Lightbulb,
  Globe,
  Music,
  Palette,
  Target,
  Award,
  FileText,
  Download
} from 'lucide-react';

const SchoolCalendar = () => {
  const heroAnimation = useScrollAnimation();
  const academicAnimation = useScrollAnimation();
  const eventsAnimation = useScrollAnimation();
  const holidaysAnimation = useScrollAnimation();

  const academicYear = "2025-26";

  const academicEvents = [
    {
      month: "April",
      events: [
        { date: "1", title: "New Academic Year Begins", type: "academic", description: "Classes commence for all grades" },
        { date: "14", title: "B.R. Ambedkar Jayanti", type: "holiday", description: "National holiday - School closed" },
        { date: "15-30", title: "Orientation Week", type: "academic", description: "New student orientation and parent meetings" },
        { date: "22", title: "Earth Day", type: "event", description: "Environmental awareness activities" }
      ]
    },
    {
      month: "May",
      events: [
        { date: "1", title: "Labour Day", type: "holiday", description: "National holiday - School closed" },
        { date: "15-20", title: "First Unit Test", type: "academic", description: "Assessment for all classes" },
        { date: "25", title: "Parent-Teacher Meeting", type: "academic", description: "First PTA meeting of the year" }
      ]
    },
    {
      month: "June",
      events: [
        { date: "5", title: "World Environment Day", type: "event", description: "Tree plantation and eco-activities" },
        { date: "15-30", title: "Summer Vacation", type: "holiday", description: "School closed for summer break" },
        { date: "21", title: "International Yoga Day", type: "event", description: "Yoga sessions and wellness activities" }
      ]
    },
    {
      month: "July",
      events: [
        { date: "1-15", title: "Summer Vacation Continues", type: "holiday", description: "School remains closed" },
        { date: "16", title: "School Reopens", type: "academic", description: "Classes resume after summer break" },
        { date: "26", title: "Kargil Vijay Diwas", type: "event", description: "Patriotic activities and remembrance" }
      ]
    },
    {
      month: "August",
      events: [
        { date: "15", title: "Independence Day", type: "holiday", description: "National holiday - Flag hoisting ceremony" },
        { date: "20-25", title: "Mid-Term Examinations", type: "academic", description: "Comprehensive assessment" },
        { date: "30", title: "Raksha Bandhan", type: "holiday", description: "Cultural celebration" }
      ]
    },
    {
      month: "September",
      events: [
        { date: "5", title: "Teacher's Day", type: "event", description: "Special celebrations and student performances" },
        { date: "15-20", title: "Sports Meet Preparation", type: "event", description: "Sports trials and team selection" },
        { date: "25-30", title: "Annual Sports Meet", type: "event", description: "Inter-house sports competition" }
      ]
    },
    {
      month: "October",
      events: [
        { date: "2", title: "Gandhi Jayanti", type: "holiday", description: "National holiday - Peace activities" },
        { date: "8", title: "World Space Week", type: "event", description: "Science exhibitions and space activities" },
        { date: "15-20", title: "Second Unit Test", type: "academic", description: "Assessment for all classes" },
        { date: "31", title: "National Unity Day", type: "event", description: "Unity and integration activities" }
      ]
    },
    {
      month: "November",
      events: [
        { date: "14", title: "Children's Day", type: "event", description: "Special activities and celebrations" },
        { date: "20", title: "Universal Children's Day", type: "event", description: "Child rights awareness" },
        { date: "25-30", title: "Annual Day Preparation", type: "event", description: "Cultural program rehearsals" }
      ]
    },
    {
      month: "December",
      events: [
        { date: "15", title: "Annual Day Celebration", type: "event", description: "Cultural performances and prize distribution" },
        { date: "20-25", title: "Winter Vacation", type: "holiday", description: "School closed for winter break" },
        { date: "25", title: "Christmas", type: "holiday", description: "Cultural celebration" }
      ]
    },
    {
      month: "January",
      events: [
        { date: "1", title: "New Year's Day", type: "holiday", description: "New Year celebrations" },
        { date: "15", title: "Makar Sankranti", type: "holiday", description: "Cultural celebration" },
        { date: "26", title: "Republic Day", type: "holiday", description: "National holiday - Flag hoisting and cultural program" },
        { date: "30", title: "Martyrs' Day", type: "event", description: "Remembrance and tribute activities" }
      ]
    },
    {
      month: "February",
      events: [
        { date: "14", title: "Valentine's Day", type: "event", description: "Friendship and love activities" },
        { date: "20-25", title: "Annual Examinations", type: "academic", description: "End of year assessments" },
        { date: "28", title: "National Science Day", type: "event", description: "Science exhibitions and experiments" }
      ]
    },
    {
      month: "March",
      events: [
        { date: "8", title: "International Women's Day", type: "event", description: "Women empowerment activities" },
        { date: "15-20", title: "Final Examinations", type: "academic", description: "Annual examinations for all classes" },
        { date: "25", title: "Holi", type: "holiday", description: "Cultural celebration" },
        { date: "30", title: "Academic Year Ends", type: "academic", description: "Last day of school" }
      ]
    }
  ];

  const importantDates = [
    { title: "Admission Open", date: "January 2025", description: "New admissions for academic year 2025-26" },
    { title: "Last Date for Admission", date: "March 31, 2025", description: "Final deadline for new student registrations" },
    { title: "First Day of School", date: "April 1, 2025", description: "Academic year 2025-26 begins" },
    { title: "Summer Vacation", date: "June 15 - July 15, 2025", description: "One month summer break" },
    { title: "Winter Vacation", date: "December 20 - January 5, 2026", description: "Two weeks winter break" },
    { title: "Annual Day", date: "December 15, 2025", description: "Cultural celebration and prize distribution" },
    { title: "Sports Meet", date: "September 25-30, 2025", description: "Annual inter-house sports competition" },
    { title: "Last Day of School", date: "March 30, 2026", description: "Academic year 2025-26 ends" }
  ];

  const holidays = [
    { date: "April 14", title: "B.R. Ambedkar Jayanti", type: "National Holiday" },
    { date: "May 1", title: "Labour Day", type: "National Holiday" },
    { date: "August 15", title: "Independence Day", type: "National Holiday" },
    { date: "October 2", title: "Gandhi Jayanti", type: "National Holiday" },
    { date: "January 26", title: "Republic Day", type: "National Holiday" },
    { date: "June 15 - July 15", title: "Summer Vacation", type: "School Holiday" },
    { date: "December 20 - January 5", title: "Winter Vacation", type: "School Holiday" }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <BookOpen className="h-4 w-4" />;
      case 'holiday':
        return <Sun className="h-4 w-4" />;
      case 'event':
        return <Star className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-school-primary text-white';
      case 'holiday':
        return 'bg-orange-500 text-white';
      case 'event':
        return 'bg-school-accent text-school-secondary';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div ref={heroAnimation.elementRef} className="relative container mx-auto px-4 text-center">
          <Badge className={`bg-school-accent text-school-secondary mb-6 ${heroAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
            Academic Calendar {academicYear}
          </Badge>
          <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${heroAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
            School Calendar
          </h1>
          <p className={`text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed ${heroAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
            Important dates, events, and holidays for the academic year {academicYear}. 
            Stay updated with all school activities and plan your year accordingly.
          </p>
        </div>
      </section>

      {/* Important Dates Summary */}
      <section className="py-20 bg-white print:py-8 print:border-b-2 print:border-gray-300">
        <div ref={academicAnimation.elementRef} className="container mx-auto px-4">
          <div className="text-center mb-16 print:mb-8">
            <Badge className={`bg-school-primary text-white mb-4 print:bg-white print:text-black print:border print:border-gray-300 ${academicAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              Key Dates
            </Badge>
            <h2 className={`text-4xl font-bold text-school-secondary mb-6 print:text-black print:text-2xl ${academicAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
              Important Academic Dates
            </h2>
            <p className={`text-xl text-school-secondary/70 max-w-3xl mx-auto print:text-gray-700 print:text-base ${academicAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
              Mark these essential dates in your calendar for the academic year {academicYear}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 print:block">
            {importantDates.map((item, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-xl transition-all duration-300 border-t-4 border-school-accent print:border print:border-gray-300 print:mb-4 print:break-inside-avoid ${
                  academicAnimation.isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center print:p-4">
                  <div className="bg-school-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 print:bg-gray-100 print:w-12 print:h-12">
                    <Calendar className="h-8 w-8 text-school-primary print:h-6 print:w-6 print:text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-school-secondary mb-2 print:text-black print:text-base">
                    {item.title}
                  </h3>
                  <p className="text-school-accent font-bold text-lg mb-2 print:text-black print:text-base">
                    {item.date}
                  </p>
                  <p className="text-school-secondary/70 text-sm print:text-gray-700">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Calendar */}
      <section className="py-20 bg-school-green-light/10 print:py-8 print:bg-white print:border-b-2 print:border-gray-300">
        <div ref={eventsAnimation.elementRef} className="container mx-auto px-4">
          <div className="text-center mb-16 print:mb-8">
            <Badge className={`bg-school-green text-white mb-4 print:bg-white print:text-black print:border print:border-gray-300 ${eventsAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              Monthly Events
            </Badge>
            <h2 className={`text-4xl font-bold text-school-secondary mb-6 print:text-black print:text-2xl ${eventsAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
              Month-by-Month Calendar
            </h2>
            <p className={`text-xl text-school-secondary/70 max-w-3xl mx-auto print:text-gray-700 print:text-base ${eventsAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
              Detailed breakdown of all events, holidays, and activities throughout the academic year
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 print:block">
            {academicEvents.map((monthData, monthIndex) => (
              <Card 
                key={monthIndex} 
                className={`hover:shadow-xl transition-all duration-300 print:border print:border-gray-300 print:mb-6 print:break-inside-avoid ${
                  eventsAnimation.isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${monthIndex * 0.1}s` }}
              >
                <CardContent className="p-6 print:p-4">
                  <div className="text-center mb-6 print:mb-4">
                    <h3 className="text-2xl font-bold text-school-primary mb-2 print:text-black print:text-xl">
                      {monthData.month}
                    </h3>
                    <div className="w-16 h-1 bg-school-accent mx-auto print:bg-gray-400"></div>
                  </div>
                  
                  <div className="space-y-4 print:space-y-3">
                    {monthData.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-start space-x-3 print:border-l-2 print:border-gray-300 print:pl-3 print:py-1">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getEventColor(event.type)} print:bg-gray-200 print:text-black print:border print:border-gray-400`}>
                          {event.date}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getEventIcon(event.type)}
                            <h4 className="font-semibold text-school-secondary text-sm print:text-black print:text-sm">
                              {event.title}
                            </h4>
                          </div>
                          <p className="text-school-secondary/70 text-xs print:text-gray-700">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Holidays Section */}
      <section className="py-20 bg-white print:py-8 print:border-b-2 print:border-gray-300">
        <div ref={holidaysAnimation.elementRef} className="container mx-auto px-4">
          <div className="text-center mb-16 print:mb-8">
            <Badge className={`bg-orange-500 text-white mb-4 print:bg-white print:text-black print:border print:border-gray-300 ${holidaysAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              School Holidays
            </Badge>
            <h2 className={`text-4xl font-bold text-school-secondary mb-6 print:text-black print:text-2xl ${holidaysAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
              Official Holidays & Breaks
            </h2>
            <p className={`text-xl text-school-secondary/70 max-w-3xl mx-auto print:text-gray-700 print:text-base ${holidaysAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
              Plan your family time around these official school holidays and vacation periods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 print:block">
            {holidays.map((holiday, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 print:border print:border-gray-300 print:mb-4 print:break-inside-avoid ${
                  holidaysAnimation.isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 print:p-4">
                  <div className="flex items-center space-x-3 mb-4 print:mb-3">
                    <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center print:bg-gray-200 print:w-10 print:h-10">
                      <Sun className="h-6 w-6 text-orange-600 print:h-5 print:w-5 print:text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-school-secondary print:text-black print:text-base">
                        {holiday.title}
                      </h3>
                      <p className="text-orange-600 text-sm font-medium print:text-gray-600 print:text-sm">
                        {holiday.type}
                      </p>
                    </div>
                  </div>
                  <p className="text-school-accent font-bold text-lg print:text-black print:text-base">
                    {holiday.date}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Download Calendar */}
      <section className="py-20 bg-gradient-to-r from-school-primary to-school-green text-white no-print">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Download Complete Calendar
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get the complete academic calendar in PDF format for easy reference and printing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-school-accent hover:bg-school-accent/90 text-school-secondary text-lg px-8"
              onClick={() => window.open('/Calander.pdf', '_blank')}
            >
              <Download className="mr-2 h-5 w-5" />
              Download PDF Calendar
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-school-primary text-lg px-8"
              onClick={() => window.print()}
            >
              <FileText className="mr-2 h-5 w-5" />
              Print Calendar
            </Button>
          </div>
        </div>
      </section>
      
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block print:py-8 print:border-b-2 print:border-gray-300 print:mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">RR Greenfield International School</h1>
          <h2 className="text-2xl font-semibold text-black mb-2">Academic Calendar 2025-26</h2>
          <p className="text-lg text-gray-700">Important dates, events, and holidays for the academic year</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolCalendar;

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  Clock,
  Award,
  Microscope,
  Calculator,
  Globe,
  Palette,
  Music,
  Heart,
  Brain,
  TreePine,
  ChevronRight,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ACADEMIC_CALENDAR_URL = '/documents/academic-calendar.pdf';

const Academics = () => {
  const academicLevels = [
    {
      level: 'Balvatika',
      classes: 'Nursery to UKG',
      description: 'Foundation years focusing on play-based learning, creativity, and basic skills development',
      icon: Heart,
      subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Science', 'Art & Craft', 'Music & Dance'],
      highlights: ['Play-based Learning', 'Motor Skills Development', 'Social Skills', 'Creative Expression']
    },
    {
      level: 'Primary',
      classes: 'Class I to V',
      description: 'Building strong academic foundation with emphasis on core subjects and value education',
      icon: BookOpen,
      subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Studies', 'Computer Science', 'Art Education', 'Physical Education'],
      highlights: ['International Standards Curriculum', 'Activity-based Learning', 'Life Skills', 'Moral Education']
    },
    {
      level: 'Middle School',
      classes: 'Class VI to VIII',
      description: 'Comprehensive education with introduction to specialized subjects and skill development',
      icon: Brain,
      subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit/Third Language'],
      highlights: ['Scientific Thinking', 'Critical Analysis', 'Project Work', 'Co-curricular Activities'],
    },
    {
      level: 'Secondary',
      classes: 'Class IX to X',
      description:
        'Structured CBSE secondary programme building conceptual depth and board exam readiness for Class X',
      icon: Award,
      subjects: [
        'English',
        'Hindi / Sanskrit',
        'Mathematics',
        'Science',
        'Social Science',
        'Computer Applications',
        'Work Education / Art Education',
      ],
      highlights: ['CBSE Class X Preparation', 'Practical & Lab Work', 'Internal Assessments', 'Life Skills'],
    },
    {
      level: 'Senior Secondary',
      classes: 'Class XI to XII (+2)',
      description:
        'CBSE senior secondary with stream-based learning, board examinations, and career-oriented guidance',
      icon: GraduationCap,
      subjects: {
        'Science Stream': ['Physics', 'Chemistry', 'Mathematics', 'Biology / Computer Science', 'English'],
        'Commerce Stream': ['Accountancy', 'Business Studies', 'Economics', 'Mathematics / Informatics', 'English'],
        'Humanities Stream': ['History', 'Political Science', 'Geography', 'Economics / Psychology', 'English'],
      },
      highlights: [
        'CBSE Class XII Board Exams',
        'Stream Counselling',
        'Competitive Exam Foundation',
        'Career & University Guidance',
      ],
    },
  ];

  const teachingMethodology = [
    {
      title: 'Interactive Learning',
      description: 'Engaging students through hands-on activities, group discussions, and multimedia presentations',
      icon: Users
    },
    {
      title: 'Practical Application',
      description: 'Laboratory experiments, field trips, and real-world problem solving to enhance understanding',
      icon: Microscope
    },
    {
      title: 'Technology Integration',
      description: 'Smart classrooms, digital learning tools, and computer-assisted instruction',
      icon: Calculator
    },
    {
      title: 'Holistic Assessment',
      description: 'Continuous evaluation through projects, presentations, and comprehensive assessments',
      icon: Award
    }
  ];

  const facilities = [
    { icon: BookOpen, title: 'Well-Equipped Library', description: 'Extensive collection of books and digital resources' },
    { icon: Microscope, title: 'Science Laboratories', description: 'Modern physics, chemistry, and biology labs' },
    { icon: Calculator, title: 'Computer Lab', description: 'Latest technology and software for digital literacy' },
    { icon: Palette, title: 'Art & Craft Room', description: 'Creative spaces for artistic expression' },
    { icon: Music, title: 'Music Room', description: 'Musical instruments and audio equipment' },
    { icon: TreePine, title: 'Outdoor Learning', description: 'Garden spaces for environmental education' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="bg-school-accent text-school-secondary mb-6">International Standards Curriculum</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Academic Excellence
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Comprehensive CBSE education from Nursery to Class XII (senior secondary +2), fostering intellectual
            growth, character development, and preparing students for future success.
          </p>
        </div>
      </section>

      {/* Academic Levels */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-primary text-white mb-4">Educational Journey</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Academic Levels
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              Structured learning pathway from early childhood through senior secondary (+2).
            </p>
          </div>

          <div className="space-y-8">
            {academicLevels.map((level, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-l-4 border-school-accent">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-school-primary p-3 rounded-full">
                          <level.icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-school-secondary">{level.level}</h3>
                          <p className="text-school-accent font-medium">{level.classes}</p>
                        </div>
                      </div>
                      <p className="text-school-secondary/70 leading-relaxed">
                        {level.description}
                      </p>
                    </div>

                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-school-secondary mb-3">Core Subjects</h4>
                      {!Array.isArray(level.subjects) ? (
                        <div className="space-y-3">
                          {Object.entries(level.subjects).map(([stream, subjects]) => (
                            <div key={stream}>
                              <p className="font-medium text-school-primary text-sm">{stream} Stream:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {(subjects as string[]).map((subject, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {level.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-school-secondary mb-3">Key Highlights</h4>
                      <ul className="space-y-2">
                        {level.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <ChevronRight className="h-4 w-4 text-school-green" />
                            <span className="text-school-secondary/70 text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-green text-white mb-4">Our Approach</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Teaching Methodology
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              Modern teaching methods that engage students and promote deep understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachingMethodology.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-school-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-school-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-school-secondary mb-3">
                    {method.title}
                  </h3>
                  <p className="text-school-secondary/70 text-sm leading-relaxed">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Facilities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-accent text-school-secondary mb-4">Infrastructure</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Academic Facilities
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              State-of-the-art facilities to support comprehensive learning and development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-t-4 border-school-primary">
                <CardContent className="p-6 text-center">
                  <div className="bg-school-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <facility.icon className="h-8 w-8 text-school-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-school-secondary mb-3">
                    {facility.title}
                  </h3>
                  <p className="text-school-secondary/70 text-sm">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Standards Information */}
      <section className="py-20 bg-school-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-school-accent text-school-secondary mb-4">International Standards</Badge>
            <h2 className="text-4xl font-bold mb-6">
              International Standards Education
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-school-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Academic Calendar</h3>
                <p className="text-white/90">Following International Standards academic calendar with regular assessments and examinations</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-school-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Regular Assessments</h3>
                <p className="text-white/90">Continuous evaluation through periodic assessments and comprehensive examinations</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-school-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">National Recognition</h3>
                <p className="text-white/90">International Standards certification recognized across India and internationally</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-school-secondary mb-6">
            Ready to Begin Your Child's Academic Journey?
          </h2>
          <p className="text-xl text-school-secondary/70 mb-8 max-w-2xl mx-auto">
            Join RR Greenfield International School and give your child the foundation for lifelong success 
            through quality International Standards education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-school-primary hover:bg-school-primary-dark text-white text-lg px-8"
              asChild
            >
              <Link to="/admissions">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Admission Process
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-school-primary text-school-primary hover:bg-school-primary hover:text-white text-lg px-8"
              asChild
            >
              <Link to="/contact">
                <Users className="mr-2 h-5 w-5" />
                Contact Academic Team
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-school-accent text-school-accent hover:bg-school-accent hover:text-white text-lg px-8"
              onClick={() => window.open(ACADEMIC_CALENDAR_URL, '_blank', 'noopener,noreferrer')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Download Calendar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;

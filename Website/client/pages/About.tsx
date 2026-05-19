import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Globe, 
  Heart,
  BookOpen,
  Trophy,
  Target,
  Eye,
  Award,
  Lightbulb,
  Shield,
  HandHeart
} from 'lucide-react';

const About = () => {
  const coreValues = [
    {
      icon: GraduationCap,
      title: 'Academic Excellence',
      description: 'Committed to providing quality education that ensures strong academic foundations and conceptual understanding.'
    },
    {
      icon: Heart,
      title: 'Character Building',
      description: 'Nurturing moral values, integrity, and ethical behavior to develop well-rounded individuals.'
    },
    {
      icon: Users,
      title: 'Leadership Skills',
      description: 'Developing leadership qualities and confidence to prepare students for future challenges.'
    },
    {
      icon: Globe,
      title: 'Global Citizenship',
      description: 'Preparing responsible global citizens who can contribute positively to society.'
    },
    {
      icon: HandHeart,
      title: 'Inclusivity & Diversity',
      description: 'Welcoming students from all backgrounds and fostering empathy and respect for others.'
    },
    {
      icon: Shield,
      title: 'Affordable Quality',
      description: 'Providing quality education at affordable prices, making excellence accessible to all families.'
    }
  ];

  const coActivities = [
    {
      category: 'Sports & Athletics',
      activities: ['Football', 'Cricket', 'Basketball', 'Volleyball', 'Track & Field', 'Table Tennis'],
      icon: Trophy
    },
    {
      category: 'Arts & Culture',
      activities: ['Music', 'Dance', 'Drama', 'Painting', 'Craft Work', 'Cultural Performances'],
      icon: Award
    },
    {
      category: 'Academic Clubs',
      activities: ['Science Club', 'Mathematics Club', 'Literary Society', 'Debate Club', 'Quiz Team', 'Model UN'],
      icon: Lightbulb
    },
    {
      category: 'Life Skills',
      activities: ['Leadership Training', 'Community Service', 'Environmental Awareness', 'Health & Wellness', 'Public Speaking', 'Team Building'],
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="bg-school-accent text-school-secondary mb-6">About The School</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            About RR Greenfield International School
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            A premier International Standard School institution dedicated to providing quality education and 
            nurturing responsible global citizens through holistic development.
          </p>
        </div>
      </section>

      {/* School Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-school-primary text-white">Our Story</Badge>
              <h2 className="text-4xl font-bold text-school-secondary">
                Excellence in Education
              </h2>
              <div className="space-y-4 text-school-secondary/80 leading-relaxed">
                <p>
                  RR Greenfield International School stands as a beacon of quality education in Madhepura, Bihar. 
                  We offer comprehensive CBSE education from Nursery to Class XII (senior secondary +2), creating a nurturing and 
                  challenging learning environment for our students.
                </p>
                <p>
                  Our dedicated team of highly qualified and experienced educators employs innovative teaching methods
                  to make learning engaging and enjoyable for students. We focus on the holistic development of each child,
                  emphasizing academic excellence alongside character building and leadership skills. Our faculty's
                  commitment to continuous professional development ensures cutting-edge educational practices.
                </p>
                <p>
                  We are committed to making quality education accessible to families from all backgrounds by 
                  providing excellent educational services at affordable prices, ensuring that financial constraints 
                  never become a barrier to learning.
                </p>
              </div>
              <Button asChild className="bg-school-primary hover:bg-school-primary-dark">
                <Link to="/admissions">Learn About Admissions</Link>
              </Button>
            </div>
            
            <div className="bg-school-green-light/10 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-school-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-school-secondary">International Standards Curriculum</h3>
                  <p className="text-sm text-school-secondary/70">Nursery to Class XII</p>
                </div>
                <div className="text-center">
                  <div className="bg-school-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-school-secondary" />
                  </div>
                  <h3 className="font-bold text-school-secondary">Expert Faculty</h3>
                  <p className="text-sm text-school-secondary/70">Qualified & Experienced</p>
                </div>
                <div className="text-center">
                  <div className="bg-school-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-school-secondary">Global Standards</h3>
                  <p className="text-sm text-school-secondary/70">International Quality</p>
                </div>
                <div className="text-center">
                  <div className="bg-school-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-school-secondary" />
                  </div>
                  <h3 className="font-bold text-school-secondary">Holistic Care</h3>
                  <p className="text-sm text-school-secondary/70">Complete Development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-accent text-school-secondary mb-4">Our Purpose</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-l-4 border-school-primary">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-school-primary w-12 h-12 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-school-secondary">Our Mission</h3>
                </div>
                <p className="text-school-secondary/80 leading-relaxed">
                  To provide quality education at an affordable price, making it accessible to families from all backgrounds. 
                  We aim to offer holistic education that focuses not just on academic learning but also on extracurricular 
                  activities and character-building, helping students develop into well-rounded individuals equipped with 
                  the skills and values needed to succeed in life.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-school-accent">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-school-accent w-12 h-12 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-school-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-school-secondary">Our Vision</h3>
                </div>
                <p className="text-school-secondary/80 leading-relaxed">
                  To be a leading educational institution that prepares responsible global citizens through excellence in 
                  academics, character development, and leadership skills. We envision a diverse and inclusive community 
                  where every student is empowered to reach their full potential and contribute positively to society 
                  with empathy and respect for others.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-primary text-white mb-4">Our Values</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              What We Stand For
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              Our core values guide everything we do and shape the character of our students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-school-green">
                <CardContent className="p-6 text-center">
                  <div className="bg-school-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-school-primary group-hover:text-white transition-all duration-300">
                    <value.icon className="h-8 w-8 text-school-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-school-secondary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-school-secondary/70 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Faculty */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-primary text-white mb-4">Our Team</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Our Dedicated Faculty
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-4xl mx-auto">
              Our team of highly qualified and experienced educators is dedicated to the holistic development
              of students, encompassing academic excellence, character building, and leadership skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-school-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-school-secondary mb-2">
                  Qualified Educators
                </h3>
                <p className="text-school-secondary/70">
                  Our faculty members hold advanced degrees and certifications in their respective fields,
                  ensuring quality education delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-school-accent w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-10 w-10 text-school-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-school-secondary mb-2">
                  Experienced Professionals
                </h3>
                <p className="text-school-secondary/70">
                  Years of teaching experience combined with continuous professional development
                  keeps our educators at the forefront of modern pedagogy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-school-green w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-school-secondary mb-2">
                  Passionate Mentors
                </h3>
                <p className="text-school-secondary/70">
                  Beyond academics, our teachers serve as mentors, guiding students in their
                  personal growth and character development journey.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-school-green-light/10 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <h3 className="text-3xl font-bold text-school-secondary mb-6">
                  Meet Our Faculty Team
                </h3>
                <p className="text-school-secondary/80 mb-6 leading-relaxed">
                  Our diverse team of educators brings together expertise across all subjects and grade levels.
                  From early childhood specialists to senior secondary subject experts, each teacher is
                  committed to providing personalized attention and innovative teaching methods.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-school-accent rounded-full"></div>
                    <span className="text-school-secondary">Subject Matter Experts across all disciplines</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-school-accent rounded-full"></div>
                    <span className="text-school-secondary">International Standards curriculum specialists</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-school-accent rounded-full"></div>
                    <span className="text-school-secondary">Regular training and development programs</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-school-accent rounded-full"></div>
                    <span className="text-school-secondary">Student-centered teaching approach</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg text-center shadow-md">
                  <div className="bg-school-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-school-secondary mb-1">Primary Wing</h4>
                  <p className="text-sm text-school-secondary/70">Nursery - Class V</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center shadow-md">
                  <div className="bg-school-accent w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-school-secondary" />
                  </div>
                  <h4 className="font-semibold text-school-secondary mb-1">Middle Wing</h4>
                  <p className="text-sm text-school-secondary/70">Class VI - VIII</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center shadow-md">
                  <div className="bg-school-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-school-secondary mb-1">Secondary</h4>
                  <p className="text-sm text-school-secondary/70">Class IX - X</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center shadow-md">
                  <div className="bg-school-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-school-secondary mb-1">Senior Secondary</h4>
                  <p className="text-sm text-school-secondary/70">Class XI - XII (+2)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Curricular Activities */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-accent text-school-secondary mb-4">Beyond Academics</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Co-Curricular Activities
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-4xl mx-auto">
              Engaging in co-curricular activities provides students with platforms to explore and discover their 
              interests and talents beyond the classroom, developing skills that contribute to their personal and professional lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coActivities.map((category, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-school-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-school-primary" />
                    </div>
                    <h3 className="font-semibold text-school-secondary">{category.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-school-accent rounded-full"></div>
                        <span className="text-sm text-school-secondary/80">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-school-primary to-school-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join Our School Community?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experience the RR Greenfield difference - where academic excellence meets character development 
            in an inclusive and nurturing environment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-school-accent hover:bg-school-accent/90 text-school-secondary text-lg px-8"
            >
              <Link to="/admissions">Start Admission Process</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-school-primary hover:bg-school-primary-dark text-white text-lg px-8"
            >
              <Link to="/contact">Visit Our Campus</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

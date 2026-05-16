import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Car, 
  Trophy,
  Users,
  Shield,
  Wifi,
  GraduationCap
} from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      icon: BookOpen,
      title: 'Library Facility',
      description: 'Access to a wide range of resources, including books, journals, and digital materials to support learning and personal growth.',
      features: ['Extensive Book Collection', 'Digital Resources', 'Reading Spaces', 'Study Areas']
    },
    {
      icon: Trophy,
      title: 'Sports Facility',
      description: 'Comprehensive sports facilities for students to engage in physical activities, develop life skills, and promote overall health.',
      features: ['Playground', 'Indoor Games', 'Sports Equipment', 'Fitness Programs']
    },
    {
      icon: Car,
      title: 'Transport Facility',
      description: 'Safe and convenient transportation for students, reducing travel-related stress for both students and parents.',
      features: ['GPS Tracking', 'Trained Drivers', 'Safety Measures', 'Multiple Routes']
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      description: 'Comprehensive safety measures ensuring a secure learning environment for all students.',
      features: ['CCTV Surveillance', 'Trained Security', 'Emergency Protocols', 'Safe Campus']
    },
    {
      icon: Wifi,
      title: 'Digital Learning',
      description: 'Modern technology integration with smart classrooms and digital learning resources.',
      features: ['Smart Boards', 'Computer Labs', 'Internet Access', 'E-Learning Platforms']
    }
  ];

  return (
    <section className="py-20 bg-school-green-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-school-primary text-white mb-4">Our Facilities</Badge>
          <h2 className="text-4xl font-bold text-school-secondary mb-6">
            World-Class Infrastructure
          </h2>
          <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
            State-of-the-art facilities designed to provide the best learning environment and support holistic development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-school-accent">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-school-primary/10 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-school-primary group-hover:text-white transition-all duration-300">
                    <facility.icon className="h-6 w-6 text-school-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-school-secondary">
                    {facility.title}
                  </h3>
                </div>
                
                <p className="text-school-secondary/70 mb-4 leading-relaxed">
                  {facility.description}
                </p>
                
                <div className="space-y-2">
                  {facility.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-school-accent rounded-full"></div>
                      <span className="text-sm text-school-secondary/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facilities;

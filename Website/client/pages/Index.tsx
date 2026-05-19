import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Facilities from '@/components/Facilities';
import VisitScheduleForm from '@/components/VisitScheduleForm';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useCounter } from '@/hooks/use-counter';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Globe,
  Microscope,
  Palette,
  Trophy,
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
  ArrowUp,
  Loader2
} from 'lucide-react';

// Animated Counter Component
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AnimatedCounter = ({ end, duration = 2000, label, icon: Icon }: AnimatedCounterProps) => {
  const count = useCounter(end, duration);
  
  return (
    <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-scale-in">
      <Icon className="h-8 w-8 text-school-accent mx-auto mb-3" />
      <div className="text-2xl lg:text-3xl font-bold text-white mb-2">{count}</div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  );
};

// Back to Top Button Component
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 bg-school-primary hover:bg-school-primary-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

const Index = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [loadingHeroImages, setLoadingHeroImages] = useState(true);
  const featuresAnimation = useScrollAnimation();
  const aboutAnimation = useScrollAnimation();
  const whyChooseAnimation = useScrollAnimation();
  const facilitiesAnimation = useScrollAnimation();
  const contactAnimation = useScrollAnimation();

  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      const response = await fetch('/api/hero-images');
      const data = await response.json();
      if (data.success && data.images) {
        setHeroImages(data.images.map((img: { imageUrl: string }) => img.imageUrl));
      } else {
        // Fallback to default images
        setHeroImages([
          '/images/hero/1.jpg',
          '/images/hero/2.jpg',
          '/images/hero/3.jpg',
          '/images/hero/4.jpg',
        ]);
      }
    } catch (error) {
      console.error('Error loading hero images:', error);
      // Fallback to default images
      setHeroImages([
        '/images/hero/1.jpg',
        '/images/hero/2.jpg',
        '/images/hero/3.jpg',
        '/images/hero/4.jpg',
      ]);
    } finally {
      setLoadingHeroImages(false);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play carousel
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  const stats = [
    { icon: Users, label: 'Students', value: 474, duration: 2000 },
    { icon: Award, label: 'Classrooms', value: 25, duration: 1800 },
    { icon: BookOpen, label: 'Qualified Teachers', value: 27, duration: 1500 },
    { icon: Trophy, label: 'Years of Excellence', value: 5, duration: 1000 },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: 'International Standards Curriculum',
      description: 'Comprehensive International Standards curriculum with focus on holistic development.'
    },
    {
      icon: Globe,
      title: 'Global Curriculum',
      description: 'International curriculum standards with global perspectives, preparing students for worldwide opportunities.'
    },
    {
      icon: Microscope,
      title: 'Modern Facilities',
      description: 'State-of-the-art library, sports facilities, and well-equipped laboratories for comprehensive learning.'
    },
    {
      icon: Palette,
      title: 'Holistic Development',
      description: 'Focus on academic excellence, character building, leadership skills, and extracurricular activities.'
    },
  ];

  const keyHighlights = [
    { icon: GraduationCap, title: 'CBSE Curriculum', description: 'Comprehensive education from Nursery to Class XII (+2)' },
    { icon: Users, title: 'Experienced Faculty', description: 'Highly qualified and dedicated teaching staff' },
    { icon: Globe, title: 'International Standards', description: 'World-class infrastructure and teaching methods' },
    { icon: Trophy, title: 'Holistic Development', description: 'Academic excellence with character building' },
  ];

  const educationalApproach = [
    {
      title: 'Academic Excellence',
      description: 'Comprehensive International Standards curriculum with focus on conceptual understanding and practical application.',
      features: ['Interactive Learning', 'Regular Assessments', 'Individual Attention', 'Skill Development']
    },
    {
      title: 'Character Development',
      description: 'Nurturing moral values, leadership skills, and responsible citizenship through various programs.',
      features: ['Value Education', 'Leadership Training', 'Community Service', 'Cultural Activities']
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[75vh] md:min-h-[70vh] lg:min-h-[80vh]">
        <div className="absolute inset-0 w-full h-full">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {loadingHeroImages ? (
                <CarouselItem className="h-full pl-0 basis-full">
                  <div className="relative h-full w-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-school-primary mx-auto mb-4" />
                      <p className="text-school-secondary">Loading hero images...</p>
                    </div>
                  </div>
                </CarouselItem>
              ) : heroImages.length > 0 ? (
                heroImages.map((image, index) => (
                  <CarouselItem key={index} className="h-full pl-0 basis-full">
                    <div className="relative h-full w-full">
                      <img
                        src={image.startsWith('/') ? image : `/${image}`}
                        alt={`Hero image ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                        loading={index === 0 ? "eager" : "lazy"}
                        onError={(e) => {
                          console.error('Hero image failed to load:', image);
                          const target = e.target as HTMLImageElement;
                          // Try with different path variations
                          if (!target.src.includes('placeholder')) {
                            if (image.startsWith('/images/')) {
                              target.src = image.replace('/images/', './images/');
                            } else if (!image.startsWith('/')) {
                              target.src = `/${image}`;
                            } else {
                              target.src = '/placeholder.svg';
                            }
                          }
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="h-full pl-0 basis-full">
                  <div className="relative h-full w-full flex items-center justify-center bg-gray-200">
                    <p className="text-school-secondary">No hero images available</p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 h-10 w-10 md:h-12 md:w-12 bg-white/20 hover:bg-white/30 border-white/30 text-white z-20" />
            <CarouselNext className="right-2 md:right-4 h-10 w-10 md:h-12 md:w-12 bg-white/20 hover:bg-white/30 border-white/30 text-white z-20" />
          </Carousel>
        </div>
        
        {/* Blue Overlay - Darker on mobile for better text readability */}
        <div className="absolute inset-0 bg-school-primary/50 md:bg-school-primary/40 z-10"></div>
        
        {/* Slide Indicators - Positioned above content on mobile */}
        {!loadingHeroImages && heroImages.length > 0 && (
          <div className="absolute bottom-16 sm:bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 md:h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                  current === index
                    ? 'w-8 md:w-10 bg-school-accent'
                    : 'w-2 md:w-2.5 bg-white/50 hover:bg-white/70 active:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Floating Elements - Hidden on mobile for better performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-20 left-10 animate-float-slow">
            <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"></div>
          </div>
          <div className="absolute top-40 right-20 animate-float-medium">
            <div className="w-12 h-12 bg-school-accent/20 rounded-full backdrop-blur-sm border border-school-accent/30"></div>
          </div>
          <div className="absolute bottom-40 left-20 animate-float-fast">
            <div className="w-20 h-20 bg-school-green/20 rounded-full backdrop-blur-sm border border-school-green/30"></div>
          </div>
          <div className="absolute bottom-20 right-10 animate-float-slow">
            <div className="w-14 h-14 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 pt-12 pb-20 sm:pt-16 sm:pb-24 md:py-12 lg:py-20 z-20">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
            <div className="text-white space-y-3 sm:space-y-4 md:space-y-6 animate-slide-in-left">
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <Badge className="bg-school-accent text-school-secondary hover:bg-school-accent/90 animate-pulse text-xs sm:text-sm px-2 sm:px-3 py-1 inline-block">
                  International Standard School
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Nurturing Tomorrow's
                  <span className="text-school-accent block animate-pulse">Leaders</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 leading-relaxed">
                  At RR Greenfield International School, we provide comprehensive CBSE education from Nursery to Class XII (+2),
                  nurturing responsible global citizens with excellence in academics and character development.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-school-accent hover:bg-school-accent/90 text-school-secondary text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  <Link to="/admissions">
                    Admissions 2026-27
                    <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6">
                {stats.map((stat, index) => (
                  <AnimatedCounter
                    key={index}
                    end={stat.value}
                    duration={stat.duration}
                    label={stat.label}
                    icon={stat.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div ref={featuresAnimation.elementRef} className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className={`bg-school-green-light text-school-primary mb-4 ${featuresAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              Why Choose Us
            </Badge>
            <h2 className={`text-4xl font-bold text-school-secondary mb-6 ${featuresAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
              Excellence in Every Aspect
            </h2>
            <p className={`text-xl text-school-secondary/70 max-w-3xl mx-auto ${featuresAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
              We offer a nurturing and challenging learning environment with highly qualified educators and state-of-the-art facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 border-t-4 border-school-green ${
                  featuresAnimation.isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-school-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-school-primary group-hover:text-white transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-school-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-school-secondary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-school-secondary/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <Facilities />

      {/* Key Highlights Section */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-accent text-school-secondary mb-4">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Our Commitment to Excellence
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              We are committed to providing quality education with a focus on holistic development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyHighlights.map((highlight, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-school-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <highlight.icon className="h-8 w-8 text-school-primary" />
                  </div>
                  <h4 className="font-semibold text-school-secondary mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-sm text-school-secondary/70">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Approach Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-primary text-white mb-4">Our Approach</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Comprehensive Education Philosophy
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              We believe in nurturing well-rounded individuals through a balanced approach to education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {educationalApproach.map((approach, index) => (
              <Card key={index} className="border-l-4 border-school-accent">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-school-secondary mb-4">
                    {approach.title}
                  </h3>
                  <p className="text-school-secondary/80 mb-6 leading-relaxed">
                    {approach.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {approach.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-school-accent rounded-full"></div>
                        <span className="text-school-secondary font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
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
            Ready to Join Our School Family?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Give your child the gift of exceptional education in a nurturing environment. 
            Admissions are now open for the academic year 2026-27.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-school-accent hover:bg-school-accent/90 text-school-secondary text-lg px-8"
            >
              <Link to="/admissions">Start Admission Process</Link>
            </Button>
            <VisitScheduleForm>
              <Button
                size="lg"
                className="bg-school-primary hover:bg-school-primary-dark text-white text-lg px-8"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Visit
              </Button>
            </VisitScheduleForm>
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-white/90">
            <a href="tel:7903059909" className="flex items-center space-x-2 hover:text-school-accent transition-colors">
              <Phone className="h-5 w-5" />
              <span>Call: 7903059909 | 8210215818</span>
            </a>
            <a 
              href="https://maps.google.com/?q=West+bypass,+Sahugadh+Road,+Ward+No.+2,+Madhepura+-+852113,+Bihar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-5 hover:text-school-accent transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <span>Visit: West bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar</span>
            </a>
          </div>
        </div>
      </section>
      <BackToTop />
    </div>
  );
};

export default Index;

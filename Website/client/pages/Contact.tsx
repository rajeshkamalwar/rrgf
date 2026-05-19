import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import VisitScheduleForm from '@/components/VisitScheduleForm';
import { toast } from 'sonner';
import ThankYouPopup from '@/components/ThankYouPopup';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageSquare,
  Users,
  Navigation
} from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        description: ''
      });
      
      setShowThankYou(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      details: [
        'West bypass, Sahugadh Road',
        'Ward No. 2',
        'Madhepura - 852113, Bihar',
        'India'
      ]
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [
        '7903059909',
        '8210215818'
      ]
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: [
        'rrgreenfieldsch@gmail.com'
      ]
    },
    {
      icon: Clock,
      title: 'School Hours',
      details: [
        'Monday - Friday: 8:00 AM - 3:00 PM',
        'Saturday: 8:00 AM - 12:00 PM',
        'Office Hours: 9:00 AM - 4:00 PM'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="bg-school-accent text-school-secondary mb-6">Contact Us</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Get In Touch With Us
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            We're here to help with any questions about admissions, academics, or school life. 
            Reach out to us and we'll get back to you promptly.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-primary text-white mb-4">Contact Information</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              How to Reach Us
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              Multiple ways to connect with RR Greenfield International School for all your inquiries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const isLocation = info.title === 'Our Location';
              const isPhone = info.title === 'Phone Numbers';
              const isEmail = info.title === 'Email Address';
              
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-xl transition-shadow border-t-4 border-school-accent ${(isLocation || isPhone || isEmail) ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (isLocation) {
                      window.open('https://maps.google.com/?q=West+bypass,+Sahugadh+Road,+Ward+No.+2,+Madhepura+-+852113,+Bihar', '_blank');
                    }
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-school-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <info.icon className="h-8 w-8 text-school-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-school-secondary mb-4">
                      {info.title}
                    </h3>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => {
                        if (isPhone) {
                          return (
                            <a 
                              key={idx} 
                              href={`tel:${detail}`} 
                              className="block text-school-secondary/70 text-sm hover:text-school-primary transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {detail}
                            </a>
                          );
                        } else if (isEmail) {
                          return (
                            <a 
                              key={idx} 
                              href={`mailto:${detail}`} 
                              className="block text-school-secondary/70 text-sm hover:text-school-primary transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {detail}
                            </a>
                          );
                        } else {
                          return (
                            <p key={idx} className="text-school-secondary/70 text-sm">
                              {detail}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* WhatsApp Contact Card */}
            <Card className="hover:shadow-xl transition-shadow border-t-4 border-green-500 text-center cursor-pointer" onClick={() => window.open('https://wa.me/917903059909?text=Hi, I would like to know more about RR Greenfield International School admissions.', '_blank')}>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-school-secondary mb-4">
                  WhatsApp
                </h3>
                <div className="space-y-2">
                  <p className="text-green-600 font-medium text-sm">Chat with us</p>
                  <p className="text-school-secondary/70 text-sm">Instant messaging support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge className="bg-school-accent text-school-secondary mb-4">Send Your Query</Badge>
                <h3 className="text-3xl font-bold text-school-secondary mb-4">
                  Send In Your Query
                </h3>
                <p className="text-school-secondary/70 leading-relaxed">
                  Have questions about admissions, academics, or campus life? Fill out the form below 
                  and our team will get back to you as soon as possible.
                </p>
              </div>

              <Card className="border-l-4 border-school-primary">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-school-secondary mb-2">
                        Name *
                      </label>
                      <Input 
                        type="text"
                        placeholder="Enter Your Name"
                        className="w-full"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-school-secondary mb-2">
                        Email *
                      </label>
                      <Input 
                        type="email"
                        placeholder="Enter Your Email"
                        className="w-full"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-school-secondary mb-2">
                        Subject *
                      </label>
                      <Input 
                        type="text"
                        placeholder="Enter Subject"
                        className="w-full"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-school-secondary mb-2">
                        Description *
                      </label>
                      <Textarea 
                        placeholder="Enter Description"
                        rows={5}
                        className="w-full"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-school-primary hover:bg-school-primary-dark text-white py-3"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-school-green text-white mb-4">Find Us</Badge>
                <h3 className="text-3xl font-bold text-school-secondary mb-4">
                  Visit Our Campus
                </h3>
                <p className="text-school-secondary/70 leading-relaxed mb-6">
                  Located in the heart of Madhepura, our modern campus is easily accessible 
                  and provides a safe, nurturing environment for learning.
                </p>
              </div>

              {/* Google Maps Embed */}
              <Card className="overflow-hidden">
                <div className="relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.8267845277734!2d87.08052617517!3d26.570088776960!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef96c4b5b5b5b5%3A0x1234567890abcdef!2sWest%20bypass%2C%20Sahugadh%20Road%2C%20Ward%20No.%202%2C%20Madhepura%20-%20852113%2C%20Bihar!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="RR Greenfield International School Location"
                  ></iframe>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-5 w-5 text-school-primary" />
                      <span className="text-sm font-medium text-school-secondary">
                        RR Greenfield School
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('tel:7903059909')}>
                  <CardContent className="p-6 text-center">
                    <div className="bg-school-accent w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="h-6 w-6 text-school-secondary" />
                    </div>
                    <h4 className="font-semibold text-school-secondary mb-1">Call Us</h4>
                    <p className="text-xs text-school-secondary/70">Direct phone support</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('mailto:rrgreenfieldsch@gmail.com')}>
                  <CardContent className="p-6 text-center">
                    <div className="bg-school-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-school-secondary mb-1">Email Us</h4>
                    <p className="text-xs text-school-secondary/70">Send us an email</p>
                  </CardContent>
                </Card>
              </div>

              {/* Directions */}
              <Card className="bg-school-primary text-white">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <MapPin className="mr-2 h-6 w-6" />
                    Directions
                  </h4>
                  <div className="space-y-2 text-white/90">
                    <p className="text-sm">
                      <strong>From Railway Station:</strong> 2 minutes walk - We're located very close to Madhepura Railway Station
                    </p>
                    <p className="text-sm">
                      <strong>Location:</strong> West bypass, Sahugadh Road, Ward No. 2
                    </p>
                    <p className="text-sm">
                      <strong>Public Transport:</strong> Auto-rickshaws and buses available
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-accent text-school-secondary mb-4">FAQ</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-school-secondary mb-3">
                  What are the admission requirements?
                </h4>
                <p className="text-school-secondary/70 text-sm">
                  We offer admissions from Nursery to Class XII. Please contact our admissions office 
                  for specific requirements for each grade level.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-school-secondary mb-3">
                  Do you provide transportation?
                </h4>
                <p className="text-school-secondary/70 text-sm">
                  Yes, we provide safe and reliable transportation services with GPS tracking 
                  covering various routes in Madhepura and surrounding areas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-school-secondary mb-3">
                  What extracurricular activities are available?
                </h4>
                <p className="text-school-secondary/70 text-sm">
                  We offer sports, arts, music, dance, drama, and various clubs to ensure 
                  holistic development of our students.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-school-secondary mb-3">
                  Can I schedule a campus visit?
                </h4>
                <p className="text-school-secondary/70 text-sm">
                  Absolutely! Contact us to schedule a guided tour of our campus and facilities. 
                  We'd love to show you around.
                </p>
              </CardContent>
            </Card>
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
            Take the first step towards your child's bright future. Contact us today to learn more 
            about our programs and admission process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <VisitScheduleForm>
              <Button
                size="lg"
                className="bg-school-primary hover:bg-school-primary-dark text-white text-lg px-8"
              >
                <Users className="mr-2 h-5 w-5" />
                Schedule a Visit
              </Button>
            </VisitScheduleForm>
          </div>
        </div>
      </section>
      
      <ThankYouPopup
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You!"
        message="Your message has been sent successfully!"
        description="We will get back to you soon."
      />
    </div>
  );
};

export default Contact;

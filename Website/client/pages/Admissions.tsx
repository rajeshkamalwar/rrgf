import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ThankYouPopup from '@/components/ThankYouPopup';
import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  Send,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Upload,
  User,
  GraduationCap,
  MapPin,
  IdCard
} from 'lucide-react';

const Admissions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    // Student Information
    studentName: '',
    dateOfBirth: '',
    gender: '',
    classSeeking: '',
    previousSchool: '',
    previousClass: '',
    
    // Parent/Guardian Information
    parentName: '',
    relationship: '',
    occupation: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: '',
    
    // Additional Information
    emergencyContactName: '',
    emergencyContactPhone: '',
    message: ''
  });

  const classes = [
    'Nursery',
    'LKG',
    'UKG',
    'Class I',
    'Class II',
    'Class III',
    'Class IV',
    'Class V',
    'Class VI',
    'Class VII',
    'Class VIII',
    'Class IX',
    'Class X',
    'Class XI',
    'Class XII',
  ];

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
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to register interest');
      }
      
      toast.success('Admission application submitted successfully for session 2026-27! We will contact you within 24-48 hours.');
      
      // Reset form
      setFormData({
        studentName: '',
        dateOfBirth: '',
        gender: '',
        classSeeking: '',
        previousSchool: '',
        previousClass: '',
        parentName: '',
        relationship: '',
        occupation: '',
        phone: '',
        alternatePhone: '',
        email: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        message: ''
      });
      
      setShowThankYou(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register interest. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const admissionProcess = [
    {
      step: 1,
      title: 'Application Form',
      description: 'Fill out the online admission form or visit our school office',
      icon: FileText
    },
    {
      step: 2,
      title: 'Document Submission',
      description: 'Submit required documents including birth certificate, photographs, and previous school records',
      icon: Upload
    },
    {
      step: 3,
      title: 'Interaction & Assessment',
      description: 'Parent-child interaction session and age-appropriate assessment',
      icon: Users
    },
    {
      step: 4,
      title: 'Admission Confirmation',
      description: 'Receive admission confirmation and complete fee payment',
      icon: CheckCircle
    }
  ];

  const requiredDocuments = [
    'Birth Certificate (Original + Photocopy)',
    'Passport size photographs (6 nos.)',
    'Transfer Certificate (for students from other schools)',
    'Previous year mark sheet/report card',
    'Aadhar Card (Student + Parents)',
    'Address Proof',
    'Medical Certificate (if applicable)',
    'Caste Certificate (if applicable)'
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="bg-school-accent text-school-secondary mb-6">Admissions 2026-27</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Join Our School Family
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
            Begin your child's journey of excellence with RR Greenfield International School.
            Contact us for admission enquiries for academic year 2026-27.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-school-accent hover:bg-school-accent/90 text-school-secondary text-lg px-8"
            >
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact for Admissions
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-school-accent text-school-accent hover:bg-school-accent hover:text-white text-lg px-8"
              onClick={() => window.open('/Fees structure.pdf', '_blank')}
            >
              <FileText className="mr-2 h-5 w-5" />
              Download Fee Structure
            </Button>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-primary text-white mb-4">Admission Process</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-school-secondary/70 max-w-3xl mx-auto">
              Our streamlined admission process ensures a smooth experience for parents and students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionProcess.map((process, index) => (
              <Card key={index} className="relative hover:shadow-xl transition-shadow border-t-4 border-school-accent text-center">
                <CardContent className="p-6">
                  <div className="bg-school-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <process.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-school-accent text-school-secondary w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-semibold text-school-secondary mb-3">
                    {process.title}
                  </h3>
                  <p className="text-school-secondary/70 text-sm leading-relaxed">
                    {process.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge className="bg-school-green text-white mb-4">Required Documents</Badge>
              <h3 className="text-3xl font-bold text-school-secondary mb-6">
                Documents Checklist
              </h3>
              <p className="text-school-secondary/70 mb-8">
                Please ensure you have all the required documents ready before starting the admission process.
              </p>
              
              <div className="space-y-3">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-school-green mt-0.5 flex-shrink-0" />
                    <span className="text-school-secondary">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admission Form 2026-27 */}
            <div>
              <Badge className="bg-school-accent text-school-secondary mb-4">Admission Form</Badge>
              <h3 className="text-3xl font-bold text-school-secondary mb-2">
                Admission Application 2026-27
              </h3>
              <p className="text-school-secondary/70 mb-6">
                Fill out the form below to apply for admission. All fields are mandatory.
              </p>
              
              <Card className="border-l-4 border-school-primary">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Student Information Section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-2 border-b border-school-primary/20">
                        <GraduationCap className="h-5 w-5 text-school-primary" />
                        <h4 className="text-lg font-semibold text-school-secondary">Student Information</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentName" className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-school-primary" />
                            <span>Student Name *</span>
                          </Label>
                          <Input 
                            id="studentName"
                            type="text"
                            placeholder="Enter student's full name"
                            value={formData.studentName}
                            onChange={(e) => handleInputChange('studentName', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input 
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender *</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) => handleInputChange('gender', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="classSeeking" className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-school-primary" />
                            <span>Class Seeking Admission *</span>
                          </Label>
                          <Select
                            value={formData.classSeeking}
                            onValueChange={(value) => handleInputChange('classSeeking', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls} value={cls}>
                                  {cls}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="previousSchool">Previous School *</Label>
                          <Input 
                            id="previousSchool"
                            type="text"
                            placeholder="Name of previous school (or 'New Admission' if not applicable)"
                            value={formData.previousSchool}
                            onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="previousClass">Previous Class *</Label>
                          <Input 
                            id="previousClass"
                            type="text"
                            placeholder="Last class attended (or 'N/A' for new admission)"
                            value={formData.previousClass}
                            onChange={(e) => handleInputChange('previousClass', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parent/Guardian Information Section */}
                    <div className="space-y-4 pt-4 border-t border-school-primary/20">
                      <div className="flex items-center space-x-2 pb-2 border-b border-school-primary/20">
                        <Users className="h-5 w-5 text-school-primary" />
                        <h4 className="text-lg font-semibold text-school-secondary">Parent/Guardian Information</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentName" className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-school-primary" />
                            <span>Parent/Guardian Name *</span>
                          </Label>
                          <Input 
                            id="parentName"
                            type="text"
                            placeholder="Enter parent/guardian name"
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship with Student *</Label>
                          <Select
                            value={formData.relationship}
                            onValueChange={(value) => handleInputChange('relationship', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation *</Label>
                        <Input 
                          id="occupation"
                          type="text"
                          placeholder="Enter occupation"
                          value={formData.occupation}
                          onChange={(e) => handleInputChange('occupation', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-school-primary" />
                            <span>Phone Number *</span>
                          </Label>
                          <Input 
                            id="phone"
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            minLength={10}
                            maxLength={10}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="alternatePhone">Alternate Phone Number *</Label>
                          <Input 
                            id="alternatePhone"
                            type="tel"
                            placeholder="Alternate contact number"
                            value={formData.alternatePhone}
                            onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                            minLength={10}
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-school-primary" />
                          <span>Email Address *</span>
                        </Label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-school-primary" />
                          <span>Complete Address *</span>
                        </Label>
                        <Textarea 
                          id="address"
                          placeholder="Enter complete residential address"
                          rows={3}
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="space-y-4 pt-4 border-t border-school-primary/20">
                      <div className="flex items-center space-x-2 pb-2 border-b border-school-primary/20">
                        <IdCard className="h-5 w-5 text-school-primary" />
                        <h4 className="text-lg font-semibold text-school-secondary">Emergency Contact</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                          <Input 
                            id="emergencyContactName"
                            type="text"
                            placeholder="Name of emergency contact"
                            value={formData.emergencyContactName}
                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                          <Input 
                            id="emergencyContactPhone"
                            type="tel"
                            placeholder="10-digit phone number"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                            minLength={10}
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4 pt-4 border-t border-school-primary/20">
                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Information / Special Requirements *</Label>
                        <Textarea 
                          id="message"
                          placeholder="Any specific questions, requirements, or additional information (or 'None' if not applicable)..."
                          rows={4}
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-xs text-school-secondary/70 mb-4">
                        * Required fields. By submitting this form, you agree to provide accurate information. 
                        Our admissions team will contact you within 24-48 hours to proceed with the admission process.
                      </p>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-school-primary hover:bg-school-primary-dark text-white py-3 text-base"
                      >
                        {isSubmitting ? (
                          'Submitting Application...'
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Submit Admission Application 2026-27
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* Important Dates */}
      <section className="py-20 bg-school-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-school-accent text-school-secondary mb-4">Important Dates</Badge>
            <h2 className="text-4xl font-bold mb-6">
              Academic Calendar 2026-27
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-school-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Applications Open</h3>
                <p className="text-white/90 text-lg">Contact for Details</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-school-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Interaction Sessions</h3>
                <p className="text-white/90 text-lg">Schedule on Application</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-school-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Session Begins</h3>
                <p className="text-white/90 text-lg">April 2026</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact for Admissions */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-school-green text-white mb-4">Need Help?</Badge>
            <h2 className="text-4xl font-bold text-school-secondary mb-6">
              Contact Our Admissions Team
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-school-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-school-secondary mb-2">
                  Call Us
                </h3>
                <p className="text-school-secondary/70 mb-4">
                  Speak directly with our admissions counselor
                </p>
                <div className="space-y-1">
                  <a href="tel:7903059909" className="block font-medium text-school-primary hover:text-school-primary-dark transition-colors">7903059909</a>
                  <a href="tel:8210215818" className="block font-medium text-school-primary hover:text-school-primary-dark transition-colors">8210215818</a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-school-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-school-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-school-secondary mb-2">
                  Email Us
                </h3>
                <p className="text-school-secondary/70 mb-4">
                  Send us your queries via email
                </p>
                <a href="mailto:rrgreenfieldsch@gmail.com" className="font-medium text-school-primary hover:text-school-primary-dark transition-colors">rrgreenfieldsch@gmail.com</a>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Card className="bg-school-primary text-white max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 text-school-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Office Hours</h3>
                <div className="space-y-2">
                  <p>Monday - Friday: 9:00 AM - 4:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p className="text-school-accent font-medium">Visit us for personalized guidance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <ThankYouPopup
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You!"
        message="Your admission application has been submitted successfully!"
        description="We will contact you within 24-48 hours to proceed with the admission process."
      />
    </div>
  );
};

export default Admissions;

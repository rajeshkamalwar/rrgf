import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, User, GraduationCap, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import ThankYouPopup from '@/components/ThankYouPopup';

interface EnquiryFormProps {
  children: React.ReactNode;
}

const EnquiryForm = ({ children }: EnquiryFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentName: '',
    class: '',
    subject: '',
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
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }
      
      toast.success('Enquiry submitted successfully!', {
        description: 'We will get back to you soon.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        studentName: '',
        class: '',
        subject: '',
        message: ''
      });

      setIsOpen(false);
      setShowThankYou(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit enquiry';
      toast.error('Failed to submit enquiry', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-school-secondary flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-school-primary" />
            <span>Enquiry Form</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="h-4 w-4 text-school-primary" />
                <span>Parent/Guardian Name *</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="border-school-primary/20 focus:border-school-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-school-primary" />
                <span>Email Address</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-school-primary/20 focus:border-school-primary"
              />
            </div>
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
                required
                minLength={10}
                maxLength={10}
                className="border-school-primary/20 focus:border-school-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName" className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-school-primary" />
                <span>Student Name</span>
              </Label>
              <Input
                id="studentName"
                type="text"
                placeholder="Enter student's name"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                className="border-school-primary/20 focus:border-school-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class/Grade Interested In</Label>
              <Select
                value={formData.class}
                onValueChange={(value) => handleInputChange('class', value)}
              >
                <SelectTrigger className="border-school-primary/20 focus:border-school-primary">
                  <SelectValue placeholder="Select class (optional)" />
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

            <div className="space-y-2">
              <Label htmlFor="subject">Subject of Enquiry</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleInputChange('subject', value)}
              >
                <SelectTrigger className="border-school-primary/20 focus:border-school-primary">
                  <SelectValue placeholder="Select subject (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admission">Admission</SelectItem>
                  <SelectItem value="academics">Academics</SelectItem>
                  <SelectItem value="fees">Fees & Payment</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message / Additional Information</Label>
            <Textarea
              id="message"
              placeholder="Please provide any additional information or questions..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className="border-school-primary/20 focus:border-school-primary"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-school-primary hover:bg-school-primary-dark text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-school-primary text-school-primary hover:bg-school-primary hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
      <ThankYouPopup
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You!"
        message="Your enquiry has been submitted successfully!"
        description="We will get back to you soon."
      />
    </Dialog>
  );
};

export default EnquiryForm;


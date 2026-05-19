import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Phone, Mail, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import ThankYouPopup from '@/components/ThankYouPopup';

interface VisitScheduleFormProps {
  children: React.ReactNode;
}

const VisitScheduleForm = ({ children }: VisitScheduleFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    numberOfVisitors: '',
    purpose: '',
    message: ''
  });

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM'
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
      const response = await fetch('/api/visit-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit visit request');
      }
      
      toast.success('Visit request submitted successfully! We will contact you soon to confirm.');
      
      // Reset form and close dialog
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        numberOfVisitors: '',
        purpose: '',
        message: ''
      });
      setIsOpen(false);
      setShowThankYou(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-school-secondary text-center">
            Schedule a School Visit
          </DialogTitle>
          <p className="text-center text-school-secondary/70 mt-2">
            We'd love to show you around our campus and answer your questions
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-school-secondary font-medium">
                <User className="h-4 w-4 inline mr-2" />
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="border-school-primary/20 focus:border-school-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-school-secondary font-medium">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className="border-school-primary/20 focus:border-school-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-school-secondary font-medium">
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className="border-school-primary/20 focus:border-school-primary"
            />
          </div>

          {/* Visit Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-school-secondary font-medium">
                <Calendar className="h-4 w-4 inline mr-2" />
                Preferred Date *
              </Label>
              <Input
                id="preferredDate"
                type="date"
                required
                min={getMinDate()}
                value={formData.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                className="border-school-primary/20 focus:border-school-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime" className="text-school-secondary font-medium">
                <Clock className="h-4 w-4 inline mr-2" />
                Preferred Time *
              </Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) => handleInputChange('preferredTime', value)}
                required
              >
                <SelectTrigger className="border-school-primary/20 focus:border-school-primary">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfVisitors" className="text-school-secondary font-medium">
                Number of Visitors *
              </Label>
              <Select
                value={formData.numberOfVisitors}
                onValueChange={(value) => handleInputChange('numberOfVisitors', value)}
                required
              >
                <SelectTrigger className="border-school-primary/20 focus:border-school-primary">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, '6+'].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-school-secondary font-medium">
                Visit Purpose *
              </Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange('purpose', value)}
                required
              >
                <SelectTrigger className="border-school-primary/20 focus:border-school-primary">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admission">Admission Inquiry</SelectItem>
                  <SelectItem value="campus-tour">Campus Tour</SelectItem>
                  <SelectItem value="meet-principal">Meet Principal</SelectItem>
                  <SelectItem value="faculty-meeting">Faculty Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-school-secondary font-medium">
              Additional Message
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Any specific questions or requirements for your visit..."
              rows={3}
              className="border-school-primary/20 focus:border-school-primary"
            />
          </div>

          {/* School Information */}
          <div className="bg-school-green-light/10 p-4 rounded-lg border border-school-green/20">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-school-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-school-secondary">
                <p className="font-medium">Visit Address:</p>
                <a 
                  href="https://maps.google.com/?q=West+bypass,+Sahugadh+Road,+Ward+No.+2,+Madhepura+-+852113,+Bihar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-school-primary hover:text-school-primary-dark underline transition-colors"
                >
                  West bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar
                </a>
                <p className="mt-2 text-school-accent font-medium">School Hours: Mon-Fri 8:00 AM - 3:00 PM, Sat 8:00 AM - 12:00 PM</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-school-primary hover:bg-school-primary-dark text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Schedule Visit'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-school-primary/20 text-school-primary hover:bg-school-primary hover:text-white"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-school-secondary/60 text-center">
            * Required fields. We will contact you within 24 hours to confirm your visit.
          </p>
        </form>
      </DialogContent>
      <ThankYouPopup
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You!"
        message="Your visit request has been submitted successfully!"
        description="We will contact you within 24 hours to confirm your visit."
      />
    </Dialog>
  );
};

export default VisitScheduleForm;

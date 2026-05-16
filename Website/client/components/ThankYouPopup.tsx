import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ThankYouPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  description?: string;
}

const ThankYouPopup = ({ 
  isOpen, 
  onClose, 
  title = "Thank You!",
  message = "Your submission was successful.",
  description = "We will get back to you soon."
}: ThankYouPopupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className="bg-school-green/10 w-20 h-20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-school-green" />
            </div>
            <DialogTitle className="text-2xl font-bold text-school-secondary">
              {title}
            </DialogTitle>
            <p className="text-lg text-school-secondary/80 font-medium">
              {message}
            </p>
            <p className="text-sm text-school-secondary/70">
              {description}
            </p>
          </div>
        </DialogHeader>
        <div className="flex justify-center pb-4">
          <Button
            onClick={onClose}
            className="bg-school-primary hover:bg-school-primary-dark text-white px-8"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThankYouPopup;


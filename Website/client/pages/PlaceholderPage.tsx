import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-school-green-light/20 to-school-primary-light/20">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="bg-school-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="h-12 w-12 text-school-primary" />
          </div>
          <h1 className="text-4xl font-bold text-school-secondary mb-4">
            {title}
          </h1>
          <p className="text-school-secondary/70 text-lg mb-8">
            This page is currently under development. We're working hard to bring you 
            comprehensive information about our {title.toLowerCase()} section.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-school-accent max-w-lg mx-auto mb-8">
            <p className="text-school-secondary text-sm">
              <strong>Coming Soon:</strong> Detailed information, galleries, resources, 
              and interactive content for this section. Check back soon for updates!
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="bg-school-primary hover:bg-school-primary-dark">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>
          </Button>
          <p className="text-school-secondary/60 text-sm">
            In the meantime, feel free to explore our homepage or contact us for more information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;

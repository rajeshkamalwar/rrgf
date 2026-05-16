import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Menu, Phone, Mail, Search, X, MessageSquare } from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Mandatory Disclosure', href: '/mandatory-disclosure' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-school-primary text-white py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <a href="tel:7903059909" className="flex items-center space-x-2 hover:text-school-accent transition-colors">
              <Phone className="h-4 w-4" />
              <span>7903059909 | 8210215818</span>
            </a>
            <a href="mailto:rrgreenfieldsch@gmail.com" className="flex items-center space-x-2 hover:text-school-accent transition-colors">
              <Mail className="h-4 w-4" />
              <span>rrgreenfieldsch@gmail.com</span>
            </a>
          </div>
          <div className="text-school-accent">
            International Standard School
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg border-b-4 border-school-green sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="h-16 w-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6d0b6221ec3c4898ae227e84751bf3f7%2F4c53fa71517b42389461d048abe17843?format=webp&width=800"
                  alt="RR Greenfield International School Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className="text-school-secondary hover:text-school-primary transition-colors duration-200 font-medium relative flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-school-green transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              ))}
              <EnquiryForm>
                <Button className="bg-school-accent hover:bg-school-accent/90 text-school-secondary font-medium">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enquire Now
                </Button>
              </EnquiryForm>
            </nav>


            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="default" size="icon" className="bg-school-primary hover:bg-school-primary-dark text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex justify-center pb-4 border-b">
                    <div className="h-12 w-auto">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F6d0b6221ec3c4898ae227e84751bf3f7%2F4c53fa71517b42389461d048abe17843?format=webp&width=800"
                        alt="RR Greenfield International School Logo"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-school-secondary hover:text-school-primary transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-school-green-light/20"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <EnquiryForm>
                      <Button 
                        className="w-full bg-school-accent hover:bg-school-accent/90 text-school-secondary font-medium mt-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enquire Now
                      </Button>
                    </EnquiryForm>
                  </nav>
                  <div className="pt-4 border-t">
                    <div className="space-y-2 text-sm">
                      <a href="tel:7903059909" className="flex items-center space-x-2 text-school-secondary hover:text-school-primary transition-colors">
                        <Phone className="h-4 w-4" />
                        <span>7903059909 | 8210215818</span>
                      </a>
                      <a href="mailto:rrgreenfieldsch@gmail.com" className="flex items-center space-x-2 text-school-secondary hover:text-school-primary transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>rrgreenfieldsch@gmail.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

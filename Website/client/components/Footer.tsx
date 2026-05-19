import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-school-secondary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-12 w-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6d0b6221ec3c4898ae227e84751bf3f7%2F4c53fa71517b42389461d048abe17843?format=webp&width=800"
                  alt="RR Greenfield International School Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-school-secondary-light text-sm leading-relaxed">
              A renowned CBSE-affiliated school offering comprehensive education from Balvatika to Class XII
              (senior secondary +2), committed to preparing students to be responsible global citizens.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/RRGreenfield/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-school-primary p-2 rounded-full hover:bg-school-primary-dark transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://www.instagram.com/rrgreenfieldschool/?igsh=MWF0anZkYzdhbjNzbw%3D%3D#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-school-primary p-2 rounded-full hover:bg-school-primary-dark transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://www.youtube.com/@rrgis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-school-primary p-2 rounded-full hover:bg-school-primary-dark transition-colors"
                aria-label="Visit our YouTube channel"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-school-secondary-light hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="text-school-secondary-light hover:text-white transition-colors">Academics</Link></li>

              <li><Link to="/admissions" className="text-school-secondary-light hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/mandatory-public-disclosure" className="text-school-secondary-light hover:text-white transition-colors">Mandatory Public Disclosure</Link></li>
            </ul>
          </div>

          {/* Academics */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Academics</h4>
            <ul className="space-y-2">
              <li><Link to="/academics" className="text-school-secondary-light hover:text-white transition-colors">Balvatika</Link></li>
              <li><Link to="/academics/primary" className="text-school-secondary-light hover:text-white transition-colors">Primary School</Link></li>
              <li><Link to="/academics/middle" className="text-school-secondary-light hover:text-white transition-colors">Middle School (VI–VIII)</Link></li>
              <li><Link to="/academics/secondary" className="text-school-secondary-light hover:text-white transition-colors">Secondary (IX–X)</Link></li>
              <li><Link to="/academics/senior-secondary" className="text-school-secondary-light hover:text-white transition-colors">Senior Secondary (XI–XII)</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <a 
                href="https://maps.google.com/?q=West+bypass,+Sahugadh+Road,+Ward+No.+2,+Madhepura+-+852113,+Bihar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start space-x-3 hover:text-white transition-colors"
              >
                <MapPin className="h-5 w-5 text-school-accent mt-0.5 flex-shrink-0" />
                <div className="text-school-secondary-light text-sm hover:text-white transition-colors">
                  West bypass, Sahugadh Road<br />
                  Ward No. 2<br />
                  Madhepura - 852113, Bihar
                </div>
              </a>
              <a href="tel:7903059909" className="flex items-center space-x-3 hover:text-white transition-colors">
                <Phone className="h-5 w-5 text-school-accent" />
                <span className="text-school-secondary-light text-sm hover:text-white transition-colors">7903059909 | 8210215818</span>
              </a>
              <a href="mailto:rrgreenfieldsch@gmail.com" className="flex items-center space-x-3 hover:text-white transition-colors">
                <Mail className="h-5 w-5 text-school-accent" />
                <span className="text-school-secondary-light text-sm hover:text-white transition-colors">rrgreenfieldsch@gmail.com</span>
              </a>
            </div>
            <div className="bg-school-primary/20 p-4 rounded-lg">
              <h5 className="font-semibold text-sm mb-2">School Hours</h5>
              <p className="text-school-secondary-light text-xs">
                Monday - Friday: 8:00 AM - 3:00 PM<br />
                Saturday: 8:00 AM - 12:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-school-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-school-secondary-light text-sm">
              © 2024 RR Greenfield International School, Madhepura, Bihar. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/mandatory-public-disclosure" className="text-school-secondary-light hover:text-white transition-colors">Mandatory Disclosure</Link>
            </div>
          </div>
          <div className="border-t border-school-secondary-light/20 mt-6 pt-4 text-center">
            <p className="text-school-secondary-light text-xs">
              Powered by{' '}
              <a
                href="https://neksoftconsultancy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-school-accent hover:text-white transition-colors"
              >
                Neksoft Consultancy Services
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  FileText,
  ExternalLink,
  School,
  Users,
  Building2,
  BookOpen,
  Award,
  Calendar,
  Download,
  ClipboardList,
  Loader2
} from 'lucide-react';

interface Document {
  id: string;
  category: 'documents' | 'academic' | 'infrastructure';
  sno: string;
  document?: string;
  information?: string;
  link: string;
  status: string;
}

const MandatoryDisclosure = () => {
  const heroAnimation = useScrollAnimation();
  const introAnimation = useScrollAnimation();
  const generalInfoAnimation = useScrollAnimation();
  const documentsAnimation = useScrollAnimation();
  const academicAnimation = useScrollAnimation();
  const staffAnimation = useScrollAnimation();
  const infrastructureAnimation = useScrollAnimation();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [academicInfo, setAcademicInfo] = useState<Document[]>([]);
  const [infrastructureInfo, setInfrastructureInfo] = useState<any[]>([]);
  const [infrastructureDocuments, setInfrastructureDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const staffInfo = [
    { sno: "1", information: "PRINCIPAL", details: "Rakesh Ranjan (M.A., B.Ed.)" },
    { sno: "2", information: "TOTAL NO. OF TEACHERS", details: "27 Teachers" },
    { sno: "3", information: "TEACHERS SECTION RATIO", details: "1.93 teachers per section" },
    { sno: "4", information: "DETAILS OF SPECIAL EDUCATOR", details: "1" },
    { sno: "5", information: "DETAILS OF COUNSELLOR AND WELLNESS TEACHER", details: "1" }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      if (data.success) {
        const allDocs = data.documents;
        setDocuments(allDocs.filter((d: Document) => d.category === 'documents'));
        setAcademicInfo(allDocs.filter((d: Document) => d.category === 'academic'));
        setInfrastructureDocuments(allDocs.filter((d: Document) => d.category === 'infrastructure'));
        
        // Infrastructure info - keep existing structure but update document link
        setInfrastructureInfo([
          { sno: "1", information: "NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)", details: "22 Classrooms (Each: 56 sq mtr, 600 sq ft)" },
          { sno: "2", information: "NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)", details: "Composite Lab: 56 sq mtr, 602 ft, Physics Lab: 56 sq mtr, 602 ft, Chemistry Lab: 56 sq mtr, 602 ft, Biology Lab: 56 sq mtr, 602 ft, Computer Lab: 56 sq mtr, 602 ft, Maths Lab: 56 sq mtr, 602 ft" },
          { sno: "3", information: "INTERNET FACILITY (Y/N)", details: "YES" },
          { sno: "4", information: "NO. OF GIRLS TOILETS", details: "14" },
          { sno: "5", information: "NO. OF BOYS TOILETS", details: "16" },
          { sno: "6", information: "LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL", details: "✓ Available", link: "https://www.youtube.com/watch?v=iVS2A1JErCQ" },
          { sno: "7", information: "ADDITIONAL FACILITIES", details: "Library: 112 sq mtr, 1205 ft, Sick Room: 33 sq mtr, 355 ft, Sports & Games Room: 119 sq mtr, 1280 ft, Arts & Music Room: 32 sq mtr, 344 ft" },
          { sno: "8", information: "INFRASTRUCTURE DETAILS DOCUMENT", details: "View Complete Infrastructure Details", link: "/documents/infradoc.jpeg" }
        ]);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      // Fallback to default documents on error
      setDocuments([
        { id: 'doc-1', category: 'documents', sno: '1', document: 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', link: '#', status: 'Not Applicable' },
        { id: 'doc-2', category: 'documents', sno: '2', document: 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', link: './trustdeed.pdf', status: '✓ Available' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generalInfo = [
    { sno: "1", information: "NAME OF SCHOOL", details: "RR GREENFIELD INTERNATIONAL SCHOOL" },
    { sno: "2", information: "AFFILIATION NO. (IF APPLICABLE)", details: "Not Applicable" },
    { sno: "3", information: "SCHOOL CODE (IF APPLICABLE)", details: "21311612021919150645" },
            { sno: "4", information: "COMPLETE ADDRESS PIN CODE", details: "New bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar" },
    { sno: "5", information: "PRINCIPAL NAME", details: "Rakesh Ranjan" },
    { sno: "6", information: "PRINCIPAL QUALIFICATION", details: "M.A., B.Ed." },
    { sno: "7", information: "SCHOOL EMAIL ID", details: "rrgreenfieldsch@gmail.com" },
    { sno: "8", information: "CONTACT DETAILS(MOBILE)", details: "7903059909, 8210215818" }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div ref={heroAnimation.elementRef} className="relative container mx-auto px-4 text-center">
          <Badge className={`bg-school-accent text-school-secondary mb-6 ${heroAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
            Compliance
          </Badge>
          <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${heroAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
            Mandatory Public Disclosure
          </h1>
          <p className={`text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed ${heroAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
            Comprehensive information about RR Greenfield International School in compliance with educational regulations
            and transparency requirements for all stakeholders.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div ref={introAnimation.elementRef} className="container mx-auto px-4">
          <Card className={`border-l-4 border-school-primary ${introAnimation.isVisible ? 'animate-slide-in-bottom' : ''}`}>
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className={`bg-school-primary/10 p-3 rounded-lg ${introAnimation.isVisible ? 'animate-scale-in' : ''}`}>
                  <FileText className="h-8 w-8 text-school-primary" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold text-school-secondary mb-4 ${introAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
                    About This Disclosure
                  </h3>
                  <p className={`text-school-secondary/80 leading-relaxed mb-4 ${introAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
                    As per educational regulations and transparency requirements, all International Standard School institutions are required to
                    upload and regularly update their mandatory public disclosure on their official websites. This ensures
                    transparency and provides essential information to students, parents, and other stakeholders.
                  </p>
                  <p className={`text-school-secondary/80 leading-relaxed ${introAnimation.isVisible ? 'animate-fade-in-up-delay-3' : ''}`}>
                    The information provided below is in accordance with educational standards and regulations,
                    regarding the Mandatory Public Disclosure for educational institutions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* A - General Information */}
      <section className="py-16 bg-school-green-light/10">
        <div ref={generalInfoAnimation.elementRef} className="container mx-auto px-4">
          <div className="mb-12">
            <div className={`flex items-center space-x-3 mb-6 ${generalInfoAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              <div className={`bg-school-primary w-12 h-12 rounded-full flex items-center justify-center ${generalInfoAnimation.isVisible ? 'animate-scale-in' : ''}`}>
                <School className="h-6 w-6 text-white" />
              </div>
              <h2 className={`text-3xl font-bold text-school-secondary ${generalInfoAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
                A - General Information
              </h2>
            </div>
          </div>

          <Card className={`overflow-hidden ${generalInfoAnimation.isVisible ? 'animate-slide-in-bottom' : ''}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-school-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">INFORMATION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generalInfo.map((item, index) => {
                    const isEmail = item.information === 'SCHOOL EMAIL ID';
                    const isPhone = item.information === 'CONTACT DETAILS(MOBILE)';
                    const isAddress = item.information === 'COMPLETE ADDRESS PIN CODE';
                    
                    let detailsContent = item.details;
                    if (isEmail) {
                      detailsContent = (
                        <a 
                          href={`mailto:${item.details}`} 
                          className="text-school-primary hover:text-school-primary-dark underline transition-colors"
                        >
                          {item.details}
                        </a>
                      );
                    } else if (isPhone) {
                      const phones = item.details.split(', ');
                      detailsContent = (
                        <div className="flex flex-wrap gap-2">
                          {phones.map((phone, idx) => (
                            <a 
                              key={idx}
                              href={`tel:${phone.trim()}`} 
                              className="text-school-primary hover:text-school-primary-dark underline transition-colors"
                            >
                              {phone.trim()}
                            </a>
                          ))}
                        </div>
                      );
                    } else if (isAddress) {
                      detailsContent = (
                        <a 
                          href="https://maps.google.com/?q=New+bypass,+Sahugadh+Road,+Ward+No.+2,+Madhepura+-+852113,+Bihar" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-school-primary hover:text-school-primary-dark underline transition-colors"
                        >
                          {item.details}
                        </a>
                      );
                    }
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-school-secondary">{item.sno}</td>
                        <td className="px-6 py-4 text-sm text-school-secondary">{item.information}</td>
                        <td className="px-6 py-4 text-sm text-school-secondary font-medium">{detailsContent}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* B - Documents and Information */}
      <section className="py-16 bg-white">
        <div ref={documentsAnimation.elementRef} className="container mx-auto px-4">
          <div className="mb-12">
            <div className={`flex items-center space-x-3 mb-6 ${documentsAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              <div className={`bg-school-accent w-12 h-12 rounded-full flex items-center justify-center ${documentsAnimation.isVisible ? 'animate-scale-in' : ''}`}>
                <ClipboardList className="h-6 w-6 text-school-secondary" />
              </div>
              <h2 className={`text-3xl font-bold text-school-secondary ${documentsAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
                B - Documents and Information
              </h2>
            </div>
            <p className={`text-school-secondary/70 leading-relaxed max-w-4xl ${documentsAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
              Self-attested copies of all documents uploaded on the website of the school
            </p>
          </div>

          <Card className={`overflow-hidden ${documentsAnimation.isVisible ? 'animate-slide-in-bottom' : ''}`}>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-school-primary" />
                  <p className="mt-4 text-muted-foreground">Loading documents...</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-school-accent text-school-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">DOCUMENTS</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">DOCUMENTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documents.map((item, index) => (
                      <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-school-secondary">{item.sno}</td>
                        <td className="px-6 py-4 text-sm text-school-secondary">{item.information || item.document}</td>
                        <td className="px-6 py-4">
                          {(item.status === "✓ Available" || item.status === "Available" || (!item.status && item.link && item.link !== '#')) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-school-primary border-school-primary hover:bg-school-primary hover:text-white"
                              onClick={() => {
                                const link = item.link.startsWith('http') || item.link.startsWith('/') 
                                  ? item.link 
                                  : `/${item.link.replace(/^\.\//, '')}`;
                                window.open(link, '_blank');
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          ) : (
                            <span className="text-sm font-medium text-school-secondary">{item.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* C - Result and Academics */}
      <section className="py-16 bg-school-green-light/10">
        <div ref={academicAnimation.elementRef} className="container mx-auto px-4">
          <div className="mb-12">
            <div className={`flex items-center space-x-3 mb-6 ${academicAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              <div className={`bg-school-green w-12 h-12 rounded-full flex items-center justify-center ${academicAnimation.isVisible ? 'animate-scale-in' : ''}`}>
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h2 className={`text-3xl font-bold text-school-secondary ${academicAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
                C - Result and Academics
              </h2>
            </div>
          </div>

          <Card className={`overflow-hidden ${academicAnimation.isVisible ? 'animate-slide-in-bottom' : ''}`}>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-school-green" />
                  <p className="mt-4 text-muted-foreground">Loading documents...</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-school-green text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">INFORMATION</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">DOCUMENTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {academicInfo.map((item, index) => (
                      <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-school-secondary">{item.sno}</td>
                        <td className="px-6 py-4 text-sm text-school-secondary">{item.information || item.document}</td>
                        <td className="px-6 py-4">
                          {(item.status === "✓ Available" || item.status === "Available" || (!item.status && item.link && item.link !== '#')) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-school-green border-school-green hover:bg-school-green hover:text-white"
                              onClick={() => {
                                const link = item.link.startsWith('http') || item.link.startsWith('/') 
                                  ? item.link 
                                  : `/${item.link.replace(/^\.\//, '')}`;
                                window.open(link, '_blank');
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          ) : (
                            <span className="text-sm font-medium text-school-secondary">{item.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* D - Staff (Teaching) */}
      <section className="py-16 bg-white">
        <div ref={staffAnimation.elementRef} className="container mx-auto px-4">
          <div className="mb-12">
            <div className={`flex items-center space-x-3 mb-6 ${staffAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              <div className={`bg-school-primary w-12 h-12 rounded-full flex items-center justify-center ${staffAnimation.isVisible ? 'animate-scale-in' : ''}`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className={`text-3xl font-bold text-school-secondary ${staffAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
                D - Staff (Teaching)
              </h2>
            </div>
          </div>

          <Card className={`overflow-hidden ${staffAnimation.isVisible ? 'animate-slide-in-bottom' : ''}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-school-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">INFORMATION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffInfo.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-school-secondary">{item.sno}</td>
                      <td className="px-6 py-4 text-sm text-school-secondary">{item.information}</td>
                      <td className="px-6 py-4 text-sm text-school-secondary font-medium">{item.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* E - School Infrastructure */}
      <section className="py-16 bg-school-green-light/10">
        <div ref={infrastructureAnimation.elementRef} className="container mx-auto px-4">
          <div className="mb-12">
            <div className={`flex items-center space-x-3 mb-6 ${infrastructureAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
              <div className={`bg-school-accent w-12 h-12 rounded-full flex items-center justify-center ${infrastructureAnimation.isVisible ? 'animate-scale-in' : ''}`}>
                <Building2 className="h-6 w-6 text-school-secondary" />
              </div>
              <h2 className={`text-3xl font-bold text-school-secondary ${infrastructureAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
                E - School Infrastructure
              </h2>
            </div>
          </div>

          <Card className={`overflow-hidden ${infrastructureAnimation.isVisible ? 'animate-slide-in-bottom' : ''}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-school-accent text-school-secondary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">INFORMATION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {infrastructureInfo.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-school-secondary">{item.sno}</td>
                      <td className="px-6 py-4 text-sm text-school-secondary">{item.information}</td>
                      <td className="px-6 py-4 text-sm text-school-secondary font-medium">
                        {item.sno === "6" && item.link ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-school-accent border-school-accent hover:bg-school-accent hover:text-school-secondary"
                            onClick={() => window.open(item.link, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Watch Video
                          </Button>
                        ) : item.sno === "8" && item.link ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-school-accent border-school-accent hover:bg-school-accent hover:text-school-secondary"
                            onClick={() => {
                              const link = item.link.startsWith('http') || item.link.startsWith('/') 
                                ? item.link 
                                : `/${item.link.replace(/^\.\//, '')}`;
                              window.open(link, '_blank');
                            }}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Document
                          </Button>
                        ) : (
                          item.details
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* F - Infrastructure Documents */}
      {infrastructureDocuments.length > 0 && (
        <section className="py-16 bg-white">
          <div ref={infrastructureAnimation.elementRef} className="container mx-auto px-4">
            <div className="mb-12">
              <div className={`flex items-center space-x-3 mb-6 ${infrastructureAnimation.isVisible ? 'animate-fade-in-up' : ''}`}>
                <div className={`bg-school-accent w-12 h-12 rounded-full flex items-center justify-center ${infrastructureAnimation.isVisible ? 'animate-scale-in' : ''}`}>
                  <Building2 className="h-6 w-6 text-school-secondary" />
                </div>
                <h2 className={`text-3xl font-bold text-school-secondary ${infrastructureAnimation.isVisible ? 'animate-fade-in-up-delay-1' : ''}`}>
                  F - Infrastructure Documents
                </h2>
              </div>
              <p className={`text-school-secondary/70 leading-relaxed max-w-4xl ${infrastructureAnimation.isVisible ? 'animate-fade-in-up-delay-2' : ''}`}>
                Infrastructure-related certificates and documents
              </p>
            </div>

            <Card className={`overflow-hidden ${infrastructureAnimation.isVisible ? 'animate-slide-in-bottom' : ''}`}>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-school-accent" />
                    <p className="mt-4 text-muted-foreground">Loading documents...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-school-accent text-school-secondary">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">DOCUMENT</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {infrastructureDocuments.map((item, index) => (
                        <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm font-medium text-school-secondary">{item.sno}</td>
                          <td className="px-6 py-4 text-sm text-school-secondary">{item.information || item.document}</td>
                          <td className="px-6 py-4">
                            {(item.status === "✓ Available" || item.status === "Available" || (!item.status && item.link && item.link !== '#')) ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-school-accent border-school-accent hover:bg-school-accent hover:text-school-secondary"
                                onClick={() => {
                                  const link = item.link.startsWith('http') || item.link.startsWith('/') 
                                    ? item.link 
                                    : `/${item.link.replace(/^\.\//, '')}`;
                                  window.open(link, '_blank');
                                }}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            ) : (
                              <span className="text-sm font-medium text-school-secondary">{item.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        </section>
      )}

    </div>
  );
};

export default MandatoryDisclosure;

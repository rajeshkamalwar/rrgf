import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Images, 
  Camera, 
  Users, 
  GraduationCap,
  Trophy,
  Music,
  Palette,
  Microscope,
  BookOpen,
  TreePine,
  Building,
  Sparkles
} from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'events' | 'academics' | 'sports' | 'cultural' | 'infrastructure' | 'students';
  title?: string;
  description?: string;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Photos', icon: Images },
    { id: 'events', name: 'Events', icon: Sparkles },
    { id: 'academics', name: 'Academics', icon: BookOpen },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'cultural', name: 'Cultural', icon: Music },
    { id: 'infrastructure', name: 'Infrastructure', icon: Building },
    { id: 'students', name: 'Student Life', icon: Users },
  ];

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      if (data.success && data.images) {
        setGalleryItems(data.images);
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setImageLoading(true);
    setLightboxOpen(true);
  };

  const handlePreviousImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(img => img.id === selectedImage.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setImageLoading(true);
    setSelectedImage(filteredItems[previousIndex]);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setImageLoading(true);
    setSelectedImage(filteredItems[nextIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedImage, filteredItems]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="bg-school-accent text-school-secondary mb-6">Photo Gallery</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            School Gallery
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Capturing moments of excellence, creativity, and achievement at RR Greenfield International School
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white sticky top-20 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-school-primary hover:bg-school-primary-dark text-white'
                      : 'border-school-primary text-school-primary hover:bg-school-primary hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-school-green-light/10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="h-16 w-16 text-school-primary animate-spin mx-auto mb-4" />
              <p className="text-xl text-school-secondary/70">Loading gallery images...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 text-school-secondary/30 mx-auto mb-4" />
              <p className="text-xl text-school-secondary/70">No photos found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-school-green"
                  onClick={() => handleImageClick(item)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.description || 'Gallery image'}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        console.error('Image failed to load:', item.imageUrl);
                        // Fallback to main image if thumbnail fails
                        if (item.thumbnailUrl && e.currentTarget.src !== item.imageUrl) {
                          e.currentTarget.src = item.imageUrl;
                        }
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', item.imageUrl);
                      }}
                    />
                    {item.description && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="text-sm text-white/90">{item.description}</p>
                        </div>
                      </div>
                    )}
                    <Badge 
                      className="absolute top-4 right-4 bg-school-accent text-school-secondary"
                    >
                      {categories.find(cat => cat.id === item.category)?.name}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <style>{`
          [data-radix-dialog-overlay] {
            background-color: rgba(0, 0, 0, 0.5) !important;
          }
        `}</style>
        <DialogContent className="!max-w-[95vw] !w-[95vw] !max-h-[95vh] !h-[95vh] p-0 bg-transparent border-none overflow-hidden !translate-x-[-50%] !translate-y-[-50%] shadow-none">
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Previous Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
              )}

              {/* Next Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              )}

              {/* Image Container */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                )}
                <img
                  key={selectedImage.id}
                  src={selectedImage.imageUrl}
                  alt={selectedImage.description || 'Gallery image'}
                  className={`max-w-full max-h-[85vh] w-auto h-auto object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  style={{ display: 'block', maxWidth: '100%', maxHeight: '85vh' }}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Image failed to load:', selectedImage.imageUrl);
                    setImageLoading(false);
                    // Try thumbnail if main image fails
                    if (selectedImage.thumbnailUrl && target.src !== selectedImage.thumbnailUrl) {
                      target.src = selectedImage.thumbnailUrl;
                    } else {
                      target.src = '/placeholder.svg';
                    }
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', selectedImage.imageUrl);
                    setImageLoading(false);
                  }}
                />
                
                {/* Image Info */}
                {selectedImage.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 text-white pointer-events-none">
                    <div className="container mx-auto">
                      <p className="text-lg text-white/90">{selectedImage.description}</p>
                      <Badge className="mt-3 bg-school-accent text-school-secondary">
                        {categories.find(cat => cat.id === selectedImage.category)?.name}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Image Counter */}
                {filteredItems.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-10">
                    {filteredItems.findIndex(img => img.id === selectedImage.id) + 1} / {filteredItems.length}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 bg-school-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Be Part of Our Story
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join RR Greenfield International School and create memories that last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-school-accent hover:bg-school-accent/90 text-school-secondary text-lg px-8"
              asChild
            >
              <Link to="/admissions">
                <GraduationCap className="mr-2 h-5 w-5" />
                Start Admission Process
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-school-primary text-lg px-8"
              asChild
            >
              <Link to="/contact">
                <Users className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;


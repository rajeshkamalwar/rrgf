import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Chatbot from "./components/Chatbot";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admissions from "./pages/Admissions";
import Academics from "./pages/Academics";
import Gallery from "./pages/Gallery";
import MandatoryDisclosure from "./pages/MandatoryDisclosure";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import Backend from "./pages/Backend";

// Layout component for public pages
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/academics/primary" element={<PlaceholderPage title="Primary School" />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/academics/middle" element={<PlaceholderPage title="Middle School" />} />
          <Route path="/academics/secondary" element={<PlaceholderPage title="Secondary School" />} />
          <Route path="/academics/senior-secondary" element={<PlaceholderPage title="Senior Secondary" />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mandatory-disclosure" element={<MandatoryDisclosure />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <Routes>
        {/* Backend admin route - no header/footer */}
        <Route path="/backend" element={<Backend />} />
        
        {/* Public routes - with header/footer */}
        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

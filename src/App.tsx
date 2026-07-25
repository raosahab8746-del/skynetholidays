import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { InquiryModal } from './components/InquiryModal';

// Pages
import { Home } from './pages/Home';
import { DomesticDestinations } from './pages/DomesticDestinations';
import { DomesticStatePackages } from './pages/DomesticStatePackages';
import { InternationalDestinations } from './pages/InternationalDestinations';
import { InternationalCountryPackages } from './pages/InternationalCountryPackages';
import { PackageDetails } from './pages/PackageDetails';
import { WeekendTrips } from './pages/WeekendTrips';
import { GalleryPage } from './pages/GalleryPage';
import { BlogsPage } from './pages/BlogsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryDestination, setInquiryDestination] = useState<string | undefined>(undefined);

  const handleOpenInquiry = (dest?: string) => {
    setInquiryDestination(dest);
    setInquiryModalOpen(true);
  };

  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1F2937] font-sans selection:bg-[#00AEEF] selection:text-white">
          {/* Header Navbar */}
          <Navbar onOpenInquiry={() => handleOpenInquiry('General Inquiry')} />

          {/* Main Content Area */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home onOpenInquiry={handleOpenInquiry} />} />
              
              {/* Domestic Hierarchy */}
              <Route path="/domestic" element={<DomesticDestinations />} />
              <Route path="/domestic/:stateSlug" element={<DomesticStatePackages onOpenInquiry={handleOpenInquiry} />} />

              {/* International Hierarchy */}
              <Route path="/international" element={<InternationalDestinations />} />
              <Route path="/international/:countrySlug" element={<InternationalCountryPackages onOpenInquiry={handleOpenInquiry} />} />

              {/* Package Details */}
              <Route path="/package/:slug" element={<PackageDetails onOpenInquiry={handleOpenInquiry} />} />

              {/* Weekend Getaways */}
              <Route path="/weekend-trips" element={<WeekendTrips onOpenInquiry={handleOpenInquiry} />} />

              {/* Gallery, Blogs, About, Contact */}
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Admin Panel */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Floating Action Buttons (WhatsApp, Phone, Instagram) */}
          <FloatingActions />

          {/* Global Inquiry Modal */}
          {inquiryModalOpen && (
            <InquiryModal
              isOpen={inquiryModalOpen}
              onClose={() => setInquiryModalOpen(false)}
              defaultDestination={inquiryDestination}
            />
          )}
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;

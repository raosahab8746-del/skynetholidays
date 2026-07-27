import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { ImageSelector } from '../components/ImageSelector';
import { PackageItem, StateDestination, CountryDestination, GalleryItem, BlogPost, Testimonial, SpecialOffer, HeroSlide } from '../types';
import {
  ShieldAlert,
  LogOut,
  Package,
  MapPin,
  Image as ImageIcon,
  BookOpen,
  MessageSquare,
  Building2,
  CalendarCheck,
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Instagram,
  RefreshCw,
  Search,
  DollarSign,
  Eye,
  EyeOff,
  Tag,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Calendar
} from 'lucide-react';

const destinationHierarchy = {
  domestic: {
    "Kashmir": ["Srinagar", "Gulmarg", "Sonmarg", "Pahalgam"],
    "Goa": ["North Goa", "South Goa"],
    "Kerala": ["Munnar", "Alleppey", "Kochi", "Wayanad"],
    "Andaman": ["Port Blair", "Havelock Island", "Neil Island"],
    "Ladakh": ["Leh", "Nubra Valley"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Jaisalmer", "Udaipur"],
    "Uttarakhand": ["Nainital", "Mussoorie", "Rishikesh", "Auli"],
    "Rann of Kutch (Gujarat)": ["White Rann", "Bhuj"],
    "Karnataka": ["Coorg", "Chikmagalur", "Mysore", "Hampi"],
    "Tamil Nadu": ["Ooty", "Kodaikanal", "Chennai", "Madurai", "Rameswaram"],
    "North East India": ["Shillong", "Cherrapunji", "Dawki", "Kaziranga", "Gangtok", "Tawang"]
  },
  international: {
    "Nepal": ["Kathmandu", "Pokhara", "Chitwan"],
    "Bali": ["Ubud", "Kuta", "Nusa Penida"],
    "Bhutan": ["Thimphu", "Paro", "Punakha"],
    "Dubai": ["Dubai City", "Desert Safari", "Abu Dhabi"],
    "Malaysia": ["Kuala Lumpur", "Langkawi"],
    "Singapore": ["Marina Bay", "Sentosa"],
    "Thailand": ["Bangkok", "Pattaya", "Phuket", "Krabi"],
    "Maldives": ["Male", "Water Villas"],
    "Vietnam": ["Hanoi", "Halong Bay", "Da Nang"],
    "Sri Lanka": ["Colombo", "Kandy", "Bentota"],
    "Mauritius": ["North Island", "South Island"],
    "Turkey": ["Istanbul", "Cappadocia"],
    "Switzerland": ["Zurich", "Lucerne", "Interlaken"],
    "Europe": ["Paris", "Rome", "Amsterdam", "Vienna"],
    "Japan": ["Tokyo", "Kyoto", "Osaka", "Mount Fuji"],
    "South Korea": ["Seoul", "Busan"],
    "Azerbaijan": ["Baku"],
    "Kazakhstan": ["Almaty"],
    "Georgia": ["Tbilisi"],
    "Egypt": ["Cairo", "Luxor"]
  }
};

const parentSlugMap: Record<string, string> = {
  "Kashmir": "kashmir",
  "Goa": "goa",
  "Kerala": "kerala",
  "Andaman": "andaman",
  "Ladakh": "ladakh",
  "Rajasthan": "rajasthan",
  "Uttarakhand": "uttarakhand",
  "Rann of Kutch (Gujarat)": "gujarat",
  "Karnataka": "karnataka",
  "Tamil Nadu": "tamil-nadu",
  "North East India": "north-east-india"
};

const getParentDetails = (
  selectedParent: string,
  type?: 'domestic' | 'international',
  domesticStates: StateDestination[] = [],
  internationalCountries: CountryDestination[] = []
): { parentName: string; parentSlug: string } => {
  if (selectedParent === "Rann of Kutch (Gujarat)") {
    return { parentName: "Gujarat", parentSlug: "gujarat" };
  }
  
  if (type) {
    if (type === 'domestic') {
      const st = domesticStates.find(s => s.name.toLowerCase() === selectedParent.toLowerCase());
      if (st) {
        return { parentName: st.name, parentSlug: st.slug };
      }
    } else {
      const co = internationalCountries.find(c => c.name.toLowerCase() === selectedParent.toLowerCase());
      if (co) {
        return { parentName: co.name, parentSlug: co.slug };
      }
    }
  }

  const slug = parentSlugMap[selectedParent] || selectedParent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');
  return { parentName: selectedParent, parentSlug: slug };
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const getAvailableParents = (
  type: 'domestic' | 'international',
  domesticStates: StateDestination[],
  internationalCountries: CountryDestination[]
) => {
  return type === 'international'
    ? internationalCountries.map(c => c.name)
    : domesticStates.map(s => s.name);
};

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    companyInfo,
    updateCompanyInfo,
    heroSlides,
    updateHeroSlides,
    domesticStates,
    updateDomesticStates,
    internationalCountries,
    updateInternationalCountries,
    packages,
    addPackage,
    updatePackage,
    deletePackage,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    blogs,
    addBlog,
    updateBlog,
    deleteBlog,
    testimonials,
    addTestimonial,
    deleteTestimonial,
    offers,
    updateOffers,
    bookings,
    updateBookingStatus,
    deleteBooking,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    resetToDefaultData
  } = useData();

  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [showHelpPassword, setShowHelpPassword] = useState(false);

  // Admin active tab
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'inquiries' | 'packages' | 'destinations' | 'hero' | 'gallery' | 'blogs' | 'company' | 'offers' | 'instructions'
  >('bookings');

  // Package Edit Modal / State
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [isAddingNewPackage, setIsAddingNewPackage] = useState(false);
  const [addPackageStep, setAddPackageStep] = useState<1 | 2 | 3>(1);
  const [packageFormTab, setPackageFormTab] = useState<'overview' | 'itinerary' | 'details'>('overview');
  const [isSavingPackage, setIsSavingPackage] = useState(false);
  const [packageSaveError, setPackageSaveError] = useState('');

  useEffect(() => {
    if (editingPackage === null) {
      setPackageSaveError('');
      setIsSavingPackage(false);
    }
  }, [editingPackage]);

  // Company info form state
  const [companyForm, setCompanyForm] = useState(companyInfo);

  // Gallery add form state
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<any>('Domestic');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newGalleryLocation, setNewGalleryLocation] = useState('');

  // Hero Slide form states
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [newHeroTitle, setNewHeroTitle] = useState('');
  const [newHeroSubtitle, setNewHeroSubtitle] = useState('');
  const [newHeroTag, setNewHeroTag] = useState('');
  const [newHeroBgImage, setNewHeroBgImage] = useState('');
  const [newHeroCtaText, setNewHeroCtaText] = useState('Explore Packages');
  const [newHeroCtaLink, setNewHeroCtaLink] = useState('/packages');

  // Destination form states
  const [destTab, setDestTab] = useState<'domestic' | 'international'>('domestic');
  const [editingDestId, setEditingDestId] = useState<string | null>(null);
  const [newDestName, setNewDestName] = useState('');
  const [newDestSlug, setNewDestSlug] = useState('');
  const [newDestImage, setNewDestImage] = useState('');
  const [newDestBannerImage, setNewDestBannerImage] = useState('');
  const [newDestDescription, setNewDestDescription] = useState('');
  const [newDestTag, setNewDestTag] = useState('');
  const [newDestFeatured, setNewDestFeatured] = useState(false);
  const [newDestHighlights, setNewDestHighlights] = useState('');

  // Blog form states
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSlug, setNewBlogSlug] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('SkyNet Holidays');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogImage, setNewBlogImage] = useState('');
  const [newBlogFeatured, setNewBlogFeatured] = useState(false);

  // Special Offer form states
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferSubtitle, setNewOfferSubtitle] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferDiscountText, setNewOfferDiscountText] = useState('');
  const [newOfferValidTill, setNewOfferValidTill] = useState('');
  const [newOfferBgImage, setNewOfferBgImage] = useState('');

  // Inline dynamic destination addition states
  const [isAddingNewDestInline, setIsAddingNewDestInline] = useState(false);
  const [inlineDestName, setInlineDestName] = useState('');
  const [inlineDestSlug, setInlineDestSlug] = useState('');
  const [inlineDestImage, setInlineDestImage] = useState('');
  const [inlineDestDescription, setInlineDestDescription] = useState('');
  const [inlineDestCities, setInlineDestCities] = useState('');
  const [inlineDestError, setInlineDestError] = useState('');

  const handleSaveInlineDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    if (!inlineDestName.trim()) {
      setInlineDestError('Destination name is required.');
      return;
    }

    const name = inlineDestName.trim();
    const slug = inlineDestSlug.trim() || generateSlug(name);
    
    // Check if a destination with this slug already exists
    const exists = editingPackage.type === 'international'
      ? internationalCountries.some(c => c.slug === slug)
      : domesticStates.some(s => s.slug === slug);
    
    if (exists) {
      setInlineDestError(`A destination with the slug "${slug}" already exists!`);
      return;
    }

    const citiesArray = inlineDestCities
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const regions = citiesArray.map(city => ({
      name: city,
      description: `Explore ${city} during your stay in ${name}.`,
      highlights: ['Local sightseeing', 'Scenic viewpoints']
    }));

    // If no regions were specified, create a default one
    if (regions.length === 0) {
      regions.push({
        name: `${name} Premium`,
        description: `Experience the breathtaking scenery of ${name} with our premium tour.`,
        highlights: ['Local tour', 'Sights sightseeing', 'Scenic valleys']
      });
    }

    if (editingPackage.type === 'international') {
      const newCountry: CountryDestination = {
        id: `country-${Date.now()}`,
        name: name,
        slug: slug,
        image: inlineDestImage.trim() || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        bannerImage: inlineDestImage.trim() || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
        description: inlineDestDescription.trim() || `Explore the beautiful country of ${name} with our exclusive tour packages.`,
        regions: regions,
        tag: 'New',
        packageCount: 0,
        featured: false
      };
      await updateInternationalCountries([...internationalCountries, newCountry]);
      
      // Select this destination and proceed to Step 3
      setEditingPackage({
        ...editingPackage,
        parentName: newCountry.name,
        parentSlug: newCountry.slug,
        regionName: citiesArray[0] || `${name} Premium`
      });
    } else {
      const newState: StateDestination = {
        id: `state-${Date.now()}`,
        name: name,
        slug: slug,
        image: inlineDestImage.trim() || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        bannerImage: inlineDestImage.trim() || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
        description: inlineDestDescription.trim() || `Explore the beautiful state of ${name} with our exclusive tour packages.`,
        regions: regions,
        tag: 'New',
        packageCount: 0,
        featured: false
      };
      await updateDomesticStates([...domesticStates, newState]);

      // Select this destination and proceed to Step 3
      setEditingPackage({
        ...editingPackage,
        parentName: newState.name,
        parentSlug: newState.slug,
        regionName: citiesArray[0] || `${name} Premium`
      });
    }

    // Reset inline form
    setInlineDestName('');
    setInlineDestSlug('');
    setInlineDestImage('');
    setInlineDestDescription('');
    setInlineDestCities('');
    setInlineDestError('');
    setIsAddingNewDestInline(false);

    // Proceed to Step 3
    setAddPackageStep(3);
    setPackageFormTab('overview');
  };

  // Hero Slide Submissions
  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroBgImage) return;
    const slideData: HeroSlide = {
      id: editingHeroId || `hero-${Date.now()}`,
      title: newHeroTitle,
      subtitle: newHeroSubtitle,
      tag: newHeroTag,
      bgImage: newHeroBgImage,
      ctaText: newHeroCtaText,
      ctaLink: newHeroCtaLink,
    };

    if (editingHeroId) {
      updateHeroSlides(heroSlides.map(s => s.id === editingHeroId ? slideData : s));
    } else {
      updateHeroSlides([...heroSlides, slideData]);
    }

    // Reset Form
    setEditingHeroId(null);
    setNewHeroTitle('');
    setNewHeroSubtitle('');
    setNewHeroTag('');
    setNewHeroBgImage('');
    setNewHeroCtaText('Explore Packages');
    setNewHeroCtaLink('/packages');
  };

  const handleEditHeroSlide = (slide: HeroSlide) => {
    setEditingHeroId(slide.id);
    setNewHeroTitle(slide.title);
    setNewHeroSubtitle(slide.subtitle);
    setNewHeroTag(slide.tag);
    setNewHeroBgImage(slide.bgImage);
    setNewHeroCtaText(slide.ctaText);
    setNewHeroCtaLink(slide.ctaLink);
  };

  const handleDeleteHeroSlide = (id: string) => {
    if (window.confirm('Are you sure you want to delete this hero slide?')) {
      updateHeroSlides(heroSlides.filter(s => s.id !== id));
    }
  };

  // Special Offers Submissions
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle || !newOfferCode) return;

    const offerData: SpecialOffer = {
      id: editingOfferId || `offer-${Date.now()}`,
      title: newOfferTitle,
      subtitle: newOfferSubtitle,
      code: newOfferCode,
      discountText: newOfferDiscountText || 'Limited Time Offer',
      validTill: newOfferValidTill || 'Ongoing',
      bgImage: newOfferBgImage || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
    };

    if (editingOfferId) {
      updateOffers(offers.map(o => o.id === editingOfferId ? offerData : o));
    } else {
      updateOffers([...offers, offerData]);
    }

    // Reset Form
    setEditingOfferId(null);
    setNewOfferTitle('');
    setNewOfferSubtitle('');
    setNewOfferCode('');
    setNewOfferDiscountText('');
    setNewOfferValidTill('');
    setNewOfferBgImage('');
  };

  const handleEditOffer = (offer: SpecialOffer) => {
    setEditingOfferId(offer.id);
    setNewOfferTitle(offer.title);
    setNewOfferSubtitle(offer.subtitle || '');
    setNewOfferCode(offer.code);
    setNewOfferDiscountText(offer.discountText);
    setNewOfferValidTill(offer.validTill);
    setNewOfferBgImage(offer.bgImage);
  };

  const handleDeleteOffer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this special offer / discount option?')) {
      updateOffers(offers.filter(o => o.id !== id));
    }
  };

  // Destination Submissions
  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newDestSlug.trim() || newDestName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const highlightsArray = newDestHighlights.split(',').map(h => h.trim()).filter(h => h.length > 0);
    
    const regions = [
      {
        name: `${newDestName} Premium`,
        description: `Experience the breathtaking scenery of ${newDestName} with our premium tour.`,
        highlights: highlightsArray.length > 0 ? highlightsArray : ['Local tour', 'Sights sightseeing', 'Scenic valleys']
      }
    ];

    if (destTab === 'domestic') {
      const destData: StateDestination = {
        id: editingDestId || `state-${Date.now()}`,
        name: newDestName,
        slug: slug,
        image: newDestImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        bannerImage: newDestBannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
        description: newDestDescription,
        regions: regions,
        tag: newDestTag || 'Popular',
        packageCount: editingDestId ? (domesticStates.find(s => s.id === editingDestId)?.packageCount || 0) : 0,
        featured: newDestFeatured
      };

      if (editingDestId) {
        updateDomesticStates(domesticStates.map(s => s.id === editingDestId ? destData : s));
      } else {
        updateDomesticStates([...domesticStates, destData]);
      }
    } else {
      const destData: CountryDestination = {
        id: editingDestId || `country-${Date.now()}`,
        name: newDestName,
        slug: slug,
        image: newDestImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        bannerImage: newDestBannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
        description: newDestDescription,
        regions: regions,
        tag: newDestTag || 'Trending',
        packageCount: editingDestId ? (internationalCountries.find(c => c.id === editingDestId)?.packageCount || 0) : 0,
        featured: newDestFeatured
      };

      if (editingDestId) {
        updateInternationalCountries(internationalCountries.map(c => c.id === editingDestId ? destData : c));
      } else {
        updateInternationalCountries([...internationalCountries, destData]);
      }
    }

    // Reset Form
    setEditingDestId(null);
    setNewDestName('');
    setNewDestSlug('');
    setNewDestImage('');
    setNewDestBannerImage('');
    setNewDestDescription('');
    setNewDestTag('');
    setNewDestFeatured(false);
    setNewDestHighlights('');
  };

  const handleEditDestination = (dest: any, type: 'domestic' | 'international') => {
    setDestTab(type);
    setEditingDestId(dest.id);
    setNewDestName(dest.name);
    setNewDestSlug(dest.slug);
    setNewDestImage(dest.image);
    setNewDestBannerImage(dest.bannerImage);
    setNewDestDescription(dest.description);
    setNewDestTag(dest.tag);
    setNewDestFeatured(!!dest.featured);
    const firstRegionHighlights = dest.regions?.[0]?.highlights || [];
    setNewDestHighlights(firstRegionHighlights.join(', '));
  };

  const handleDeleteDestination = (id: string, type: 'domestic' | 'international') => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      if (type === 'domestic') {
        updateDomesticStates(domesticStates.filter(s => s.id !== id));
      } else {
        updateInternationalCountries(internationalCountries.filter(c => c.id !== id));
      }
    }
  };

  // Blog Submissions
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newBlogSlug.trim() || newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const blogData: BlogPost = {
      id: editingBlogId || `blog-${Date.now()}`,
      title: newBlogTitle,
      slug: slug,
      category: newBlogCategory || 'Travel Guide',
      author: newBlogAuthor || 'SkyNet Holidays',
      authorRole: 'Travel Expert',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: `${Math.max(3, Math.ceil(newBlogContent.split(' ').length / 200))} min read`,
      excerpt: newBlogExcerpt || newBlogContent.substring(0, 120) + '...',
      content: newBlogContent,
      image: newBlogImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      featured: newBlogFeatured
    };

    if (editingBlogId) {
      updateBlog(blogData);
    } else {
      addBlog(blogData);
    }

    // Reset Form
    setEditingBlogId(null);
    setNewBlogTitle('');
    setNewBlogSlug('');
    setNewBlogCategory('');
    setNewBlogAuthor('SkyNet Holidays');
    setNewBlogExcerpt('');
    setNewBlogContent('');
    setNewBlogImage('');
    setNewBlogFeatured(false);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setNewBlogTitle(blog.title);
    setNewBlogSlug(blog.slug);
    setNewBlogCategory(blog.category);
    setNewBlogAuthor(blog.author);
    setNewBlogExcerpt(blog.excerpt);
    setNewBlogContent(blog.content);
    setNewBlogImage(blog.image);
    setNewBlogFeatured(!!blog.featured);
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(id);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username, password);
    if (!success) {
      setLoginError('Invalid credentials. Please enter a valid Email ID and Password.');
    } else {
      setLoginError('');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = forgotEmail.trim().toLowerCase();
    const isEmailValid = emailLower === 'info@skynetholidays.com' || emailLower === 'info@skynetholiday.com';
    const cleanPhoneInput = forgotPhone.replace(/[\s+()-]+/g, '');
    const isPhoneValid = cleanPhoneInput.includes('9358718087') || cleanPhoneInput.includes('7877566175');

    if (isEmailValid && isPhoneValid) {
      setRecoverySuccess(true);
      setRecoveryMessage('Verification Successful! Your administrator password is: 7877566175');
    } else {
      setRecoverySuccess(false);
      setRecoveryMessage('Invalid verification details. Please verify your official administrator email and backup contact number (e.g. +91 9358718087).');
    }
  };

  const handleCompanySave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(companyForm);
    alert('Company details updated successfully!');
  };

  const handleAddGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryImage) return;

    addGalleryItem({
      id: `g-${Date.now()}`,
      title: newGalleryTitle,
      category: newGalleryCategory,
      image: newGalleryImage,
      location: newGalleryLocation
    });

    setNewGalleryTitle('');
    setNewGalleryImage('');
    setNewGalleryLocation('');
  };



  const handleSavePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    setIsSavingPackage(true);
    setPackageSaveError('');

    try {
      // Recalculate discount
      const calculatedDiscount = Math.round(((editingPackage.price - editingPackage.offerPrice) / editingPackage.price) * 100);
      const updatedPkg = { ...editingPackage, discountPercent: Math.max(0, calculatedDiscount) || 0 };

      if (isAddingNewPackage) {
        await addPackage(updatedPkg);
      } else {
        await updatePackage(updatedPkg);
      }

      setEditingPackage(null);
      setIsAddingNewPackage(false);
    } catch (err: any) {
      console.error("Failed to save package:", err);
      let errMsg = "Failed to save the package. Please try again.";
      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.error && (parsed.error.includes("Maximum document size exceeded") || parsed.error.includes("exceeded"))) {
            errMsg = "Failed to save: The total size of images or descriptions exceeds Firestore's 1MB limit. Please choose a smaller/preset image or paste a web URL.";
          } else {
            errMsg = `Error: ${parsed.error}`;
          }
        } catch {
          if (err.message.includes("size") || err.message.includes("exceeded")) {
            errMsg = "Failed to save: The image is too large for the database (exceeds 1MB limit). Please upload a smaller photo, use a preset, or paste a web URL.";
          } else {
            errMsg = `Error: ${err.message}`;
          }
        }
      }
      setPackageSaveError(errMsg);
    } finally {
      setIsSavingPackage(false);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50/40">
        <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                {isForgotPassword ? 'Password Recovery' : 'Admin Control Panel'}
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isForgotPassword
                  ? 'Verify your registered administrator account details below to recover your login password.'
                  : 'Log in to SkyNet Holidays content management system to edit packages, destinations, contact details, and view customer enquiries.'}
              </p>
            </div>

            {!isForgotPassword ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username / Email ID</label>
                  <input
                    type="text"
                    required
                    placeholder="info@skynetholidays.com"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setRecoveryMessage('');
                        setRecoverySuccess(false);
                      }}
                      className="text-[11px] text-[#00AEEF] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00AEEF] hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                >
                  Sign In to Admin
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                {recoveryMessage && (
                  <div className={`p-3.5 rounded-xl text-xs border leading-relaxed ${
                    recoverySuccess 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {recoveryMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="info@skynetholidays.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9358718087"
                    value={forgotPhone}
                    onChange={e => setForgotPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter the registered SkyNet business phone number (e.g. <span className="font-semibold">9358718087</span>) to authenticate.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setRecoveryMessage('');
                    }}
                    className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#00AEEF] hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    Recover Password
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Instructions */}
          <div className="bg-slate-900 text-slate-300 p-8 md:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-white">
                <HelpCircle className="w-5 h-5 text-[#FDB813]" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Quick Management Guide</h2>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <h3 className="font-bold text-white mb-1">1. Authenticate with Administrator ID</h3>
                  <p className="text-slate-400">
                    Sign in using your official administrator ID. If you forgot your password, please use the <span className="text-[#00AEEF] font-semibold">Forgot Password?</span> option to recover your access.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-white mb-1">2. Edit Packages & Prices</h3>
                  <p className="text-slate-400">
                    Navigate to the <span className="text-white font-semibold">Packages</span> tab to modify existing listings or add custom tours. You can update titles, itineraries, prices, discounts, and duration.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-white mb-1">3. Live Leads (Bookings & Inquiries)</h3>
                  <p className="text-slate-400">
                    All client-submitted "Get Quote" and booking forms go straight to your admin dashboard list. Change status from <span className="text-amber-400 font-semibold">Pending</span> to <span className="text-emerald-400 font-semibold">Confirmed</span> as you resolve them.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-white mb-1">4. Live Company Contact Info</h3>
                  <p className="text-slate-400">
                    Use the <span className="text-white font-semibold">Company Info</span> tab to update your business phone, email, and social networks. Saving updates changes the information sitewide instantly!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500">
              SkyNet Holidays Management System • Built securely with offline fallback persistence.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="text-xs font-bold text-[#FDB813] uppercase tracking-wider block">
            SkyNet Holidays Management
          </span>
          <h1 className="text-2xl font-bold">Admin Content Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage packages, prices, itineraries, inquiries & bookings locally.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none bg-white p-2 rounded-2xl shadow-sm gap-2">
        {[
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: CalendarCheck },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare },
          { id: 'packages', label: `Packages (${packages.length})`, icon: Package },
          { id: 'destinations', label: 'Destinations', icon: MapPin },
          { id: 'hero', label: 'Hero Sliders', icon: Sparkles },
          { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          { id: 'blogs', label: 'Blogs', icon: BookOpen },
          { id: 'company', label: 'Company Info', icon: Building2 },
          { id: 'offers', label: `Offers & Discounts (${offers.length})`, icon: Tag },
          { id: 'instructions', label: 'Help & Instructions', icon: HelpCircle }
        ].map(tab => {
          const IconComp = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#00AEEF] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Customer Tour Bookings</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Package Title</th>
                  <th className="p-3">Travel Date</th>
                  <th className="p-3">Guests</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#00AEEF]">{b.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400">{b.customerPhone}</div>
                    </td>
                    <td className="p-3 font-medium line-clamp-1">{b.packageTitle}</td>
                    <td className="p-3 font-medium">{b.travelDate}</td>
                    <td className="p-3">{b.guestCount} Guests</td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={e => updateBookingStatus(b.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border focus:outline-none ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES MANAGEMENT */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Customer Inquiries</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {inquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#00AEEF]">{inq.id}</td>
                    <td className="p-3 font-bold text-slate-900">{inq.customerName}</td>
                    <td className="p-3 font-mono">{inq.customerPhone}</td>
                    <td className="p-3 font-semibold text-slate-800">{inq.destination}</td>
                    <td className="p-3 max-w-xs truncate">{inq.message || 'No message'}</td>
                    <td className="p-3">
                      <select
                        value={inq.status}
                        onChange={e => updateInquiryStatus(inq.id, e.target.value as any)}
                        className="text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGES MANAGEMENT */}
      {activeTab === 'packages' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Manage Tour Packages</h2>

            <button
              onClick={() => {
                setEditingPackage({
                  id: `pkg-custom-${Date.now()}`,
                  title: '',
                  slug: '',
                  type: 'domestic',
                  parentSlug: 'rajasthan',
                  parentName: 'Rajasthan',
                  regionName: 'Jaipur',
                  coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=80',
                  galleryImages: [],
                  duration: '1 Days / 0 Nights',
                  nights: 0,
                  days: 1,
                  price: 25000,
                  offerPrice: 19999,
                  discountPercent: 20,
                  description: '',
                  longDescription: '',
                  highlights: ['Key attraction visits', 'Scenic viewpoint stops'],
                  dayItinerary: [
                    { day: 1, title: 'Arrival & Welcome', description: 'Arrive and check in to resort.', activities: 'Welcome dinner and rest.', hotel: 'Premium Resort Stay', mealsIncluded: 'Dinner Included' }
                  ],
                  hotels: ['Deluxe Premium Stay'],
                  hotelsDetailed: [{ name: 'Deluxe Premium Stay', rating: '4', location: 'City Center' }],
                  meals: 'Breakfast & Dinner Included',
                  transportation: 'Private AC Cab / Sedan',
                  sightseeing: ['Local Attractions'],
                  inclusions: ['Hotel Stay', 'Breakfast & Dinner', 'Cab transfers'],
                  exclusions: ['Airfare', 'Personal expenses'],
                  bestTime: 'All Year',
                  thingsToCarry: ['ID Proof', 'Camera'],
                  faqs: [{ question: "Is pickup included?", answer: "Yes." }],
                  reviews: [],
                  rating: 5.0,
                  reviewCount: 0,
                  budgetCategory: 'mid',
                  availableDates: [],
                  featured: false,
                  trending: false,
                  popular: false
                });
                setIsAddingNewPackage(true);
                setAddPackageStep(1);
              }}
              className="flex items-center gap-1.5 bg-[#00AEEF] hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <div key={pkg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#00AEEF] uppercase">{pkg.parentName}</span>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{pkg.title}</h3>
                  </div>
                  <span className="text-[10px] bg-sky-100 text-[#00AEEF] px-2 py-0.5 rounded font-bold uppercase">
                    {pkg.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Price / Offer Price</span>
                    <span className="font-bold text-slate-900">₹{pkg.offerPrice.toLocaleString()}</span>{' '}
                    <span className="line-through text-slate-400 text-[10px]">₹{pkg.price.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPackage(pkg);
                        setIsAddingNewPackage(false);
                      }}
                      className="p-3 rounded-xl bg-sky-50 text-[#00AEEF] hover:bg-sky-100 transition-colors cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                      title="Edit Package"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the package "${pkg.title}"? This action cannot be undone.`)) {
                          deletePackage(pkg.id);
                        }
                      }}
                      className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT PACKAGE MODAL */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-4 border border-slate-100 shadow-2xl relative text-slate-800">
            
            {/* Loading / Saving Overlay */}
            {isSavingPackage && (
              <div className="absolute inset-0 bg-white/85 z-55 flex flex-col items-center justify-center rounded-3xl backdrop-blur-xs">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#00AEEF] border-t-transparent"></div>
                <p className="text-xs font-bold text-slate-700 mt-3">Saving to database, please wait...</p>
              </div>
            )}

            {/* Error Banner */}
            {packageSaveError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
                <span>{packageSaveError}</span>
                <button 
                  type="button" 
                  onClick={() => setPackageSaveError('')}
                  className="p-1 hover:bg-rose-100 rounded-lg cursor-pointer text-rose-500 font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* STEP 1: CHOOSE DOMESTIC/INTERNATIONAL */}
            {isAddingNewPackage && addPackageStep === 1 && (
              <div className="space-y-6 text-center py-6">
                <h3 className="text-xl font-extrabold text-slate-900">Step 1: Choose Package Category</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">Select whether this package is a Domestic Tour (within India) or an International Tour.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPackage({ ...editingPackage, type: 'domestic' });
                      setAddPackageStep(2);
                    }}
                    className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#00AEEF] hover:bg-sky-50/20 text-center transition-all group cursor-pointer"
                  >
                    <span className="block text-4xl mb-2">🇮🇳</span>
                    <span className="block font-bold text-sm text-slate-900 group-hover:text-[#00AEEF]">Domestic Package</span>
                    <span className="block text-[11px] text-slate-500 mt-1">Explore beautiful states & cities across India like Rajasthan, Goa, Kashmir, Kerala, etc.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPackage({ ...editingPackage, type: 'international' });
                      setAddPackageStep(2);
                    }}
                    className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#00AEEF] hover:bg-sky-50/20 text-center transition-all group cursor-pointer"
                  >
                    <span className="block text-4xl mb-2">✈️</span>
                    <span className="block font-bold text-sm text-slate-900 group-hover:text-[#00AEEF]">International Package</span>
                    <span className="block text-[11px] text-slate-500 mt-1">Premium global travel experiences like Dubai, Nepal, Bali, Thailand, Europe, Switzerland, etc.</span>
                  </button>
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT PARENT DESTINATION */}
            {isAddingNewPackage && addPackageStep === 2 && (
              <div className="space-y-6 py-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">Step 2: Select Parent Destination</h3>
                  <p className="text-xs text-slate-500">Choose the state or country under which this tour package will be grouped.</p>
                </div>

                {isAddingNewDestInline ? (
                  <form onSubmit={handleSaveInlineDestination} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto">
                    <div className="border-b border-slate-200 pb-3 mb-2 flex justify-between items-center">
                      <h4 className="font-extrabold text-slate-800 text-sm">
                        Add New {editingPackage.type === 'international' ? 'International Country' : 'Domestic State'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewDestInline(false);
                          setInlineDestError('');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {inlineDestError && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[11px] font-bold">
                        {inlineDestError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-bold block mb-1 text-slate-700">Name *</label>
                        <input
                          type="text"
                          required
                          value={inlineDestName}
                          onChange={e => {
                            setInlineDestName(e.target.value);
                            setInlineDestSlug(generateSlug(e.target.value));
                          }}
                          placeholder={editingPackage.type === 'international' ? 'e.g. Switzerland' : 'e.g. Sikkim'}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1 text-slate-700">Slug (URL-friendly)</label>
                        <input
                          type="text"
                          value={inlineDestSlug}
                          onChange={e => setInlineDestSlug(generateSlug(e.target.value))}
                          placeholder={editingPackage.type === 'international' ? 'e.g. switzerland' : 'e.g. sikkim'}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none bg-white"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="font-bold block mb-1 text-slate-700">Cities / Regions (comma-separated)</label>
                      <input
                        type="text"
                        value={inlineDestCities}
                        onChange={e => setInlineDestCities(e.target.value)}
                        placeholder="e.g. Zurich, Geneva, Lucerne"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none bg-white"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">These will be selectable as the sub-regions for your tour package.</p>
                    </div>

                    <div className="text-xs">
                      <label className="font-bold block mb-1 text-slate-700">Image URL (Optional)</label>
                      <input
                        type="url"
                        value={inlineDestImage}
                        onChange={e => setInlineDestImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none bg-white"
                      />
                    </div>

                    <div className="text-xs">
                      <label className="font-bold block mb-1 text-slate-700">Description (Optional)</label>
                      <textarea
                        value={inlineDestDescription}
                        onChange={e => setInlineDestDescription(e.target.value)}
                        rows={2}
                        placeholder={`Discover the beauty of ${inlineDestName || 'this destination'}...`}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none bg-white resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewDestInline(false);
                          setInlineDestError('');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Back to Selection
                      </button>
                      <button
                        type="submit"
                        className="bg-[#00AEEF] hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm hover:shadow-md transition-all"
                      >
                        Save & Select Destination
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto p-2 border border-slate-100 rounded-2xl bg-slate-50/50">
                      {getAvailableParents(
                        editingPackage.type === 'international' ? 'international' : 'domestic',
                        domesticStates,
                        internationalCountries
                      ).map(parent => (
                        <div
                          key={parent}
                          className="relative group p-1 rounded-xl border border-slate-200 bg-white hover:border-[#00AEEF] hover:bg-sky-50/10 font-bold text-xs text-slate-800 transition-all shadow-sm hover:shadow-md flex items-center justify-between min-h-[56px]"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const details = getParentDetails(
                                parent,
                                editingPackage.type === 'international' ? 'international' : 'domestic',
                                domesticStates,
                                internationalCountries
                              );
                              
                              // Determine cities array based on static list or dynamic database
                              let cities: string[] = [];
                              if (editingPackage.type === 'international') {
                                const found = internationalCountries.find(c => c.name.toLowerCase() === parent.toLowerCase());
                                if (found && found.regions && found.regions.length > 0) {
                                  cities = found.regions.map(r => r.name);
                                } else {
                                  cities = destinationHierarchy.international[parent as keyof typeof destinationHierarchy.international] || [];
                                }
                              } else {
                                const found = domesticStates.find(s => s.name.toLowerCase() === parent.toLowerCase());
                                if (found && found.regions && found.regions.length > 0) {
                                  cities = found.regions.map(r => r.name);
                                } else {
                                  cities = destinationHierarchy.domestic[parent as keyof typeof destinationHierarchy.domestic] || [];
                                }
                              }

                              setEditingPackage({
                                ...editingPackage,
                                parentName: details.parentName,
                                parentSlug: details.parentSlug,
                                regionName: cities[0] || ''
                              });
                              setAddPackageStep(3);
                              setPackageFormTab('overview');
                            }}
                            className="flex-1 text-center font-bold text-xs text-slate-800 py-3 px-2 h-full flex items-center justify-center cursor-pointer border-none bg-transparent hover:text-[#00AEEF] select-none outline-none"
                          >
                            {parent}
                          </button>

                          {/* Delete inline button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isDomestic = editingPackage.type !== 'international';
                              const list = isDomestic ? domesticStates : internationalCountries;
                              const found = list.find(d => d.name.toLowerCase() === parent.toLowerCase());
                              
                              if (found) {
                                if (window.confirm(`Are you sure you want to delete "${parent}" and all of its settings? This action cannot be undone.`)) {
                                  if (isDomestic) {
                                    updateDomesticStates(domesticStates.filter(s => s.id !== found.id));
                                  } else {
                                    updateInternationalCountries(internationalCountries.filter(c => c.id !== found.id));
                                  }
                                }
                              } else {
                                alert(`"${parent}" has already been deleted or is not registered as a database destination.`);
                              }
                            }}
                            className="opacity-100 absolute -top-1.5 -right-1.5 p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full border border-rose-200 transition-all cursor-pointer shadow-sm z-10"
                            title={`Delete ${parent}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* "+ Add New State/Country" interactive card */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewDestInline(true);
                          setInlineDestName('');
                          setInlineDestSlug('');
                          setInlineDestImage('');
                          setInlineDestDescription('');
                          setInlineDestCities('');
                          setInlineDestError('');
                        }}
                        className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#00AEEF] hover:bg-sky-50/20 text-[#00AEEF] text-center transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col items-center justify-center gap-1 min-h-[56px] font-bold text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New {editingPackage.type === 'international' ? 'Country' : 'State'}</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setAddPackageStep(1)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Back to Step 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPackage(null)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 3: FULL FORM (FOR EDITING EXISTING OR CREATING DRAFT IN STEP 3) */}
            {(!isAddingNewPackage || addPackageStep === 3) && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] bg-sky-100 text-[#00AEEF] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
                      {editingPackage.type} Package
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                      {isAddingNewPackage ? 'Create Sub-Package' : 'Edit Tour Package'}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Grouping under parent destination: <strong className="text-[#00AEEF]">{editingPackage.parentName}</strong> (slug: {editingPackage.parentSlug})
                    </p>
                  </div>
                  
                  {isAddingNewPackage && (
                    <button
                      type="button"
                      onClick={() => setAddPackageStep(2)}
                      className="text-xs text-[#00AEEF] hover:underline font-semibold flex items-center gap-1 self-start sm:self-center"
                    >
                      ← Change Destination
                    </button>
                  )}
                </div>

                {/* Subform Tabs */}
                <div className="flex gap-1 border-b border-slate-100 pb-1 overflow-x-auto scrollbar-none">
                  {[
                    { id: 'overview', label: '1. Overview & Pricing', icon: Sparkles },
                    { id: 'itinerary', label: '2. Day-wise Itinerary', icon: Calendar },
                    { id: 'details', label: '3. Highlights & Tour Details', icon: Tag }
                  ].map(tab => {
                    const IconComp = tab.icon;
                    const isActive = packageFormTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPackageFormTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#00AEEF]/10 text-[#00AEEF]'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSavePackageSubmit} className="space-y-4 text-xs">
                  
                  {/* TAB A: OVERVIEW & PRICING */}
                  {packageFormTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Package Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Scenic Srinagar & Gulmarg Special"
                            value={editingPackage.title}
                            onChange={e => {
                              const newTitle = e.target.value;
                              setEditingPackage({
                                ...editingPackage,
                                title: newTitle,
                                slug: generateSlug(newTitle)
                              });
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-bold block mb-1 text-slate-700">Parent Destination</label>
                            <select
                              value={editingPackage.parentName}
                              onChange={e => {
                                const selected = e.target.value;
                                const details = getParentDetails(
                                  selected,
                                  editingPackage.type === 'international' ? 'international' : 'domestic',
                                  domesticStates,
                                  internationalCountries
                                );
                                setEditingPackage({
                                  ...editingPackage,
                                  parentName: details.parentName,
                                  parentSlug: details.parentSlug
                                });
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none"
                            >
                              {getAvailableParents(
                                editingPackage.type === 'international' ? 'international' : 'domestic',
                                domesticStates,
                                internationalCountries
                              ).map(parent => (
                                <option key={parent} value={parent}>{parent}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="font-bold block mb-1 text-slate-700">City / Region *</label>
                            {(() => {
                              let cities: string[] = [];
                              if (editingPackage.type === 'international') {
                                const found = internationalCountries.find(c => c.slug === editingPackage.parentSlug);
                                if (found && found.regions && found.regions.length > 0) {
                                  cities = found.regions.map(r => r.name);
                                } else {
                                  const parentKey = Object.keys(parentSlugMap).find(k => getParentDetails(k).parentSlug === editingPackage.parentSlug) || editingPackage.parentName;
                                  cities = destinationHierarchy.international[parentKey as keyof typeof destinationHierarchy.international] || [];
                                }
                              } else {
                                const found = domesticStates.find(s => s.slug === editingPackage.parentSlug);
                                if (found && found.regions && found.regions.length > 0) {
                                  cities = found.regions.map(r => r.name);
                                } else {
                                  const parentKey = Object.keys(parentSlugMap).find(k => getParentDetails(k).parentSlug === editingPackage.parentSlug) || editingPackage.parentName;
                                  cities = destinationHierarchy.domestic[parentKey as keyof typeof destinationHierarchy.domestic] || [];
                                }
                              }
                              
                              if (cities.length > 0) {
                                return (
                                  <select
                                    value={editingPackage.regionName}
                                    onChange={e => setEditingPackage({ ...editingPackage, regionName: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none bg-white"
                                  >
                                    {cities.map((city: string) => (
                                      <option key={city} value={city}>{city}</option>
                                    ))}
                                  </select>
                                );
                              }
                              return (
                                <input
                                  type="text"
                                  required
                                  value={editingPackage.regionName}
                                  onChange={e => setEditingPackage({ ...editingPackage, regionName: e.target.value })}
                                  placeholder="e.g. City / Region"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00AEEF] outline-none"
                                />
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Days *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={editingPackage.days}
                            onChange={e => {
                              const d = Number(e.target.value);
                              const n = Math.max(0, d - 1);
                              setEditingPackage({
                                ...editingPackage,
                                days: d,
                                nights: n,
                                duration: `${d} Days / ${n} Nights`
                              });
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Nights *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={editingPackage.nights}
                            onChange={e => {
                              const n = Number(e.target.value);
                              setEditingPackage({
                                ...editingPackage,
                                nights: n,
                                duration: `${editingPackage.days} Days / ${n} Nights`
                              });
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Original Price (₹) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={editingPackage.price}
                            onChange={e => setEditingPackage({ ...editingPackage, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Offer Price (₹) *</label>
                          <div className="relative">
                            <input
                              type="number"
                              required
                              min="1"
                              value={editingPackage.offerPrice}
                              onChange={e => setEditingPackage({ ...editingPackage, offerPrice: Number(e.target.value) })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                            />
                            {editingPackage.price > editingPackage.offerPrice && (
                              <span className="absolute right-2 top-2 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                {Math.round(((editingPackage.price - editingPackage.offerPrice) / editingPackage.price) * 100)}% Off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Category</label>
                          <select
                            value={editingPackage.budgetCategory}
                            onChange={e => setEditingPackage({ ...editingPackage, budgetCategory: e.target.value as any })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-white"
                          >
                            <option value="budget">Budget (Standard)</option>
                            <option value="mid">Mid-Range (Deluxe)</option>
                            <option value="luxury">Luxury (Super Deluxe)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Meals Included</label>
                          <input
                            type="text"
                            placeholder="e.g. Breakfast & Dinner"
                            value={editingPackage.meals}
                            onChange={e => setEditingPackage({ ...editingPackage, meals: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Transportation</label>
                          <input
                            type="text"
                            placeholder="e.g. Private AC Sedan"
                            value={editingPackage.transportation}
                            onChange={e => setEditingPackage({ ...editingPackage, transportation: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Best Time to Visit</label>
                          <input
                            type="text"
                            placeholder="e.g. October to March"
                            value={editingPackage.bestTime}
                            onChange={e => setEditingPackage({ ...editingPackage, bestTime: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Package Rating *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="5"
                            step="0.1"
                            value={editingPackage.rating !== undefined ? editingPackage.rating : 5.0}
                            onChange={e => setEditingPackage({ ...editingPackage, rating: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Review Count *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={editingPackage.reviewCount !== undefined ? editingPackage.reviewCount : 0}
                            onChange={e => setEditingPackage({ ...editingPackage, reviewCount: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        <label className="flex items-center gap-2 p-3 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingPackage.featured}
                            onChange={e => setEditingPackage({ ...editingPackage, featured: e.target.checked })}
                            className="w-4 h-4 text-[#00AEEF] border-slate-300 rounded focus:ring-[#00AEEF]"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">Featured Package</span>
                            <span className="text-[10px] text-slate-500">Showcases on the Homepage featured slider.</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 p-3 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingPackage.trending}
                            onChange={e => setEditingPackage({ ...editingPackage, trending: e.target.checked })}
                            className="w-4 h-4 text-[#00AEEF] border-slate-300 rounded focus:ring-[#00AEEF]"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">Trending Package</span>
                            <span className="text-[10px] text-slate-500">Displays a special flame/trending badge.</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 p-3 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingPackage.popular}
                            onChange={e => setEditingPackage({ ...editingPackage, popular: e.target.checked })}
                            className="w-4 h-4 text-[#00AEEF] border-slate-300 rounded focus:ring-[#00AEEF]"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">Popular Choice</span>
                            <span className="text-[10px] text-slate-500">Displays an exclusive premium badge.</span>
                          </div>
                        </label>
                      </div>

                      <ImageSelector
                        value={editingPackage.coverImage}
                        onChange={url => setEditingPackage({ ...editingPackage, coverImage: url })}
                        label="Cover Banner Image URL"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Short Summary Description *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Enter a brief, eye-catching overview of the tour..."
                            value={editingPackage.description}
                            onChange={e => setEditingPackage({ ...editingPackage, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#00AEEF]"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1 text-slate-700">Detailed Long Description</label>
                          <textarea
                            rows={3}
                            placeholder="Add detailed information, background details, safety, and experiences of the trip..."
                            value={editingPackage.longDescription || ''}
                            onChange={e => setEditingPackage({ ...editingPackage, longDescription: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#00AEEF]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB B: DAY-WISE ITINERARY */}
                  {packageFormTab === 'itinerary' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">Manage Tour Days ({editingPackage.dayItinerary?.length || 0} Days)</span>
                          <span className="text-[10px] text-slate-500">Add, edit details, delete, or change travel order.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nextDay = (editingPackage.dayItinerary?.length || 0) + 1;
                            const newDay = {
                              day: nextDay,
                              title: `Day ${nextDay}: Sightseeing & Leisure`,
                              description: `Detail description of Day ${nextDay} activities and route...`,
                              mealsIncluded: 'Breakfast Included',
                              overnightStay: 'Deluxe Stays',
                              activities: 'Sightseeing transfers',
                              hotel: 'Premium Luxury Stay'
                            };
                            const list = [...(editingPackage.dayItinerary || []), newDay];
                            setEditingPackage({
                              ...editingPackage,
                              dayItinerary: list,
                              days: list.length,
                              nights: Math.max(0, list.length - 1),
                              duration: `${list.length} Days / ${Math.max(0, list.length - 1)} Nights`
                            });
                          }}
                          className="flex items-center gap-1.5 bg-[#00AEEF] hover:bg-sky-600 text-white px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Day</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {editingPackage.dayItinerary && editingPackage.dayItinerary.map((dayItem, idx) => (
                          <div key={idx} className="p-4 border border-slate-200 bg-white rounded-2xl space-y-3 shadow-sm relative">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="px-3 py-1 rounded-full bg-sky-50 text-[#00AEEF] font-bold text-[10px] uppercase">
                                Day {dayItem.day}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const arr = [...editingPackage.dayItinerary];
                                    const temp = arr[idx];
                                    arr[idx] = arr[idx - 1];
                                    arr[idx - 1] = temp;
                                    const reordered = arr.map((item, i) => ({ ...item, day: i + 1 }));
                                    setEditingPackage({ ...editingPackage, dayItinerary: reordered });
                                  }}
                                  className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === editingPackage.dayItinerary.length - 1}
                                  onClick={() => {
                                    if (idx === editingPackage.dayItinerary.length - 1) return;
                                    const arr = [...editingPackage.dayItinerary];
                                    const temp = arr[idx];
                                    arr[idx] = arr[idx + 1];
                                    arr[idx + 1] = temp;
                                    const reordered = arr.map((item, i) => ({ ...item, day: i + 1 }));
                                    setEditingPackage({ ...editingPackage, dayItinerary: reordered });
                                  }}
                                  className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = editingPackage.dayItinerary.filter((_, i) => i !== idx);
                                    const reordered = arr.map((item, i) => ({ ...item, day: i + 1 }));
                                    setEditingPackage({
                                      ...editingPackage,
                                      dayItinerary: reordered,
                                      days: reordered.length,
                                      nights: Math.max(0, reordered.length - 1),
                                      duration: `${reordered.length} Days / ${Math.max(0, reordered.length - 1)} Nights`
                                    });
                                  }}
                                  className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer ml-1"
                                  title="Delete Day"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="md:col-span-2">
                                <label className="font-semibold text-slate-600 block mb-0.5">Day Title *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Arrival in Srinagar & Shikara Ride"
                                  value={dayItem.title}
                                  onChange={e => {
                                    const arr = [...editingPackage.dayItinerary];
                                    arr[idx] = { ...arr[idx], title: e.target.value };
                                    setEditingPackage({ ...editingPackage, dayItinerary: arr });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                                />
                              </div>
                              <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Activities / Sightseeing</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Shikara rides, Garden visits"
                                  value={dayItem.activities || ''}
                                  onChange={e => {
                                    const arr = [...editingPackage.dayItinerary];
                                    arr[idx] = { ...arr[idx], activities: e.target.value };
                                    setEditingPackage({ ...editingPackage, dayItinerary: arr });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="font-semibold text-slate-600 block mb-0.5">Detailed Day Description *</label>
                              <textarea
                                rows={2}
                                required
                                placeholder="Details of the route, transfers, places visited and experiences..."
                                value={dayItem.description}
                                onChange={e => {
                                    const arr = [...editingPackage.dayItinerary];
                                    arr[idx] = { ...arr[idx], description: e.target.value };
                                    setEditingPackage({ ...editingPackage, dayItinerary: arr });
                                }}
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Overnight Stay (Hotel / Place)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Deluxe Houseboat Stay Srinagar"
                                  value={dayItem.hotel || dayItem.overnightStay || ''}
                                  onChange={e => {
                                    const arr = [...editingPackage.dayItinerary];
                                    arr[idx] = { 
                                      ...arr[idx], 
                                      hotel: e.target.value,
                                      overnightStay: e.target.value 
                                    };
                                    setEditingPackage({ ...editingPackage, dayItinerary: arr });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                                />
                              </div>
                              <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Meals Provided</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Dinner Included"
                                  value={dayItem.mealsIncluded || ''}
                                  onChange={e => {
                                    const arr = [...editingPackage.dayItinerary];
                                    arr[idx] = { ...arr[idx], mealsIncluded: e.target.value };
                                    setEditingPackage({ ...editingPackage, dayItinerary: arr });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB C: HIGHLIGHTS, INCLUSIONS & HOTELS */}
                  {packageFormTab === 'details' && (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      
                      {/* highlights */}
                      <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                        <span className="font-bold text-slate-900 text-xs block mb-2">Key Tour Highlights</span>
                        <div className="space-y-1.5">
                          {editingPackage.highlights && editingPackage.highlights.map((hl, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={hl}
                                onChange={e => {
                                  const arr = [...editingPackage.highlights];
                                  arr[i] = e.target.value;
                                  setEditingPackage({ ...editingPackage, highlights: arr });
                                }}
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                placeholder="e.g. Gondola ride in Gulmarg included"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = editingPackage.highlights.filter((_, idx) => idx !== i);
                                  setEditingPackage({ ...editingPackage, highlights: arr });
                                }}
                                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingPackage({ ...editingPackage, highlights: [...(editingPackage.highlights || []), ""] })}
                          className="mt-2 text-[11px] font-bold text-[#00AEEF] hover:text-sky-600 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Highlight Item
                        </button>
                      </div>

                      {/* inclusions and exclusions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border border-[#E8F8F5] rounded-2xl bg-emerald-50/20">
                          <span className="font-bold text-emerald-800 text-xs block mb-2">What's Included</span>
                          <div className="space-y-1.5">
                            {editingPackage.inclusions && editingPackage.inclusions.map((inc, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={inc}
                                  onChange={e => {
                                    const arr = [...editingPackage.inclusions];
                                    arr[i] = e.target.value;
                                    setEditingPackage({ ...editingPackage, inclusions: arr });
                                  }}
                                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="e.g. Welcome Drinks on Arrival"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = editingPackage.inclusions.filter((_, idx) => idx !== i);
                                    setEditingPackage({ ...editingPackage, inclusions: arr });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingPackage({ ...editingPackage, inclusions: [...(editingPackage.inclusions || []), ""] })}
                            className="mt-2 text-[11px] font-bold text-emerald-700 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Inclusion Item
                          </button>
                        </div>

                        <div className="p-3 border border-[#FDF2F2] rounded-2xl bg-rose-50/20">
                          <span className="font-bold text-rose-800 text-xs block mb-2">What's Excluded</span>
                          <div className="space-y-1.5">
                            {editingPackage.exclusions && editingPackage.exclusions.map((exc, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={exc}
                                  onChange={e => {
                                    const arr = [...editingPackage.exclusions];
                                    arr[i] = e.target.value;
                                    setEditingPackage({ ...editingPackage, exclusions: arr });
                                  }}
                                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="e.g. Airfare / Train Tickets"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = editingPackage.exclusions.filter((_, idx) => idx !== i);
                                    setEditingPackage({ ...editingPackage, exclusions: arr });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingPackage({ ...editingPackage, exclusions: [...(editingPackage.exclusions || []), ""] })}
                            className="mt-2 text-[11px] font-bold text-rose-700 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Exclusion Item
                          </button>
                        </div>
                      </div>

                      {/* hotels detailed stays */}
                      <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                        <span className="font-bold text-slate-900 text-xs block mb-1">Handpicked Hotels & Stays</span>
                        <span className="text-[10px] text-slate-400 block mb-2">Input hotel name, category rating, and location.</span>
                        <div className="space-y-2">
                          {(editingPackage.hotelsDetailed || []).map((hotel, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2 border border-slate-200 bg-white rounded-xl items-center relative">
                              <div className="md:col-span-5">
                                <input
                                  type="text"
                                  value={hotel.name}
                                  onChange={e => {
                                    const arr = [...(editingPackage.hotelsDetailed || [])];
                                    arr[i] = { ...arr[i], name: e.target.value };
                                    setEditingPackage({ 
                                      ...editingPackage, 
                                      hotelsDetailed: arr,
                                      hotels: arr.map(h => h.name) 
                                    });
                                  }}
                                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="Hotel Name"
                                />
                              </div>
                              <div className="md:col-span-3">
                                <select
                                  value={hotel.rating || '4'}
                                  onChange={e => {
                                    const arr = [...(editingPackage.hotelsDetailed || [])];
                                    arr[i] = { ...arr[i], rating: e.target.value };
                                    setEditingPackage({ ...editingPackage, hotelsDetailed: arr });
                                  }}
                                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                                >
                                  <option value="3">3 Star Deluxe</option>
                                  <option value="4">4 Star Deluxe</option>
                                  <option value="5">5 Star Luxury</option>
                                  <option value="Resort">Luxury Resort</option>
                                </select>
                              </div>
                              <div className="md:col-span-3">
                                <input
                                  type="text"
                                  value={hotel.location || ''}
                                  onChange={e => {
                                    const arr = [...(editingPackage.hotelsDetailed || [])];
                                    arr[i] = { ...arr[i], location: e.target.value };
                                    setEditingPackage({ ...editingPackage, hotelsDetailed: arr });
                                  }}
                                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="Location / City"
                                />
                              </div>
                              <div className="md:col-span-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = (editingPackage.hotelsDetailed || []).filter((_, idx) => idx !== i);
                                    setEditingPackage({ 
                                      ...editingPackage, 
                                      hotelsDetailed: arr,
                                      hotels: arr.map(h => h.name)
                                    });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const current = editingPackage.hotelsDetailed || [];
                            const updated = [...current, { name: '', rating: '4', location: editingPackage.regionName || '' }];
                            setEditingPackage({ 
                              ...editingPackage, 
                              hotelsDetailed: updated,
                              hotels: updated.map(h => h.name)
                            });
                          }}
                          className="mt-2 text-[11px] font-bold text-[#00AEEF] hover:text-sky-600 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Hotel / Stay
                        </button>
                      </div>

                      {/* sightseeing locations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                          <span className="font-bold text-slate-900 text-xs block mb-2">Sightseeing Locations Included</span>
                          <div className="space-y-1.5">
                            {editingPackage.sightseeing && editingPackage.sightseeing.map((site, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={site}
                                  onChange={e => {
                                    const arr = [...editingPackage.sightseeing];
                                    arr[i] = e.target.value;
                                    setEditingPackage({ ...editingPackage, sightseeing: arr });
                                  }}
                                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="e.g. Sonmarg Glacier, Zero Point"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = editingPackage.sightseeing.filter((_, idx) => idx !== i);
                                    setEditingPackage({ ...editingPackage, sightseeing: arr });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingPackage({ ...editingPackage, sightseeing: [...(editingPackage.sightseeing || []), ""] })}
                            className="mt-2 text-[11px] font-bold text-[#00AEEF] hover:text-sky-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Sightseeing Location
                          </button>
                        </div>

                        <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                          <span className="font-bold text-slate-900 text-xs block mb-2">Things to Carry</span>
                          <div className="space-y-1.5">
                            {editingPackage.thingsToCarry && editingPackage.thingsToCarry.map((thing, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={thing}
                                  onChange={e => {
                                    const arr = [...editingPackage.thingsToCarry];
                                    arr[i] = e.target.value;
                                    setEditingPackage({ ...editingPackage, thingsToCarry: arr });
                                  }}
                                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="e.g. Warm jacket, ID proof"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = editingPackage.thingsToCarry.filter((_, idx) => idx !== i);
                                    setEditingPackage({ ...editingPackage, thingsToCarry: arr });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingPackage({ ...editingPackage, thingsToCarry: [...(editingPackage.thingsToCarry || []), ""] })}
                            className="mt-2 text-[11px] font-bold text-[#00AEEF] hover:text-sky-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Things to Carry
                          </button>
                        </div>
                      </div>

                      {/* available dates and gallery images urls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                          <span className="font-bold text-slate-900 text-xs block mb-2">Multiple Departure Dates</span>
                          <div className="space-y-1.5">
                            {editingPackage.availableDates && editingPackage.availableDates.map((dateStr, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={dateStr}
                                  onChange={e => {
                                    const arr = [...(editingPackage.availableDates || [])];
                                    arr[i] = e.target.value;
                                    setEditingPackage({ ...editingPackage, availableDates: arr });
                                  }}
                                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="e.g. Oct 24, 2026 or Every Saturday"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = (editingPackage.availableDates || []).filter((_, idx) => idx !== i);
                                    setEditingPackage({ ...editingPackage, availableDates: arr });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingPackage({ ...editingPackage, availableDates: [...(editingPackage.availableDates || []), ""] })}
                            className="mt-2 text-[11px] font-bold text-[#00AEEF] hover:text-sky-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Departure Date
                          </button>
                        </div>

                        <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">Package Gallery Photos</span>
                            <span className="text-[10px] text-slate-500 block">Manage the visual slideshow of photos for this travel package.</span>
                          </div>

                          {/* Visual Grid of Existing Gallery Images */}
                          {editingPackage.galleryImages && editingPackage.galleryImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {editingPackage.galleryImages.map((imgUrl, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 bg-white shadow-xs">
                                  {imgUrl ? (
                                    <>
                                      <img
                                        src={imgUrl}
                                        alt={`Gallery ${i}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const arr = editingPackage.galleryImages.filter((_, idx) => idx !== i);
                                          setEditingPackage({ ...editingPackage, galleryImages: arr });
                                        }}
                                        className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-colors cursor-pointer"
                                        title="Delete Photo"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-2 text-center text-[10px]">
                                      <ImageIcon className="w-5 h-5 text-slate-300 mb-1" />
                                      <span>Empty Image</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const arr = editingPackage.galleryImages.filter((_, idx) => idx !== i);
                                          setEditingPackage({ ...editingPackage, galleryImages: arr });
                                        }}
                                        className="text-rose-500 hover:underline mt-1 font-semibold block cursor-pointer"
                                      >
                                        Remove Slot
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400">
                              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs">No gallery photos in this package yet.</p>
                            </div>
                          )}

                          {/* Quick Add Gallery Image block using ImageSelector directly */}
                          <div className="border-t border-slate-200/60 pt-3">
                            <span className="font-bold text-slate-800 text-[11px] block mb-2">Add Photo to Package Gallery</span>
                            <ImageSelector
                              value=""
                              onChange={(url) => {
                                if (url) {
                                  const arr = [...(editingPackage.galleryImages || []), url];
                                  setEditingPackage({ ...editingPackage, galleryImages: arr });
                                }
                              }}
                              label=""
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SUBMIT BUTTONS FOR FORM TAB 3 */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="flex gap-2">
                      {packageFormTab === 'itinerary' && (
                        <button
                          type="button"
                          onClick={() => setPackageFormTab('overview')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Back to Overview
                        </button>
                      )}
                      {packageFormTab === 'details' && (
                        <button
                          type="button"
                          onClick={() => setPackageFormTab('itinerary')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Back to Itinerary
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPackage(null);
                          setIsAddingNewPackage(false);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>

                      {/* Manual Save button available on all tabs */}
                      <button
                        type="submit"
                        disabled={isSavingPackage}
                        className={`bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 ${
                          isSavingPackage ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {isSavingPackage ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>{isAddingNewPackage ? 'Save & Create' : 'Save & Publish Tour'}</span>
                        )}
                      </button>

                      {packageFormTab === 'overview' && (
                        <button
                          type="button"
                          onClick={() => setPackageFormTab('itinerary')}
                          className="bg-[#00AEEF] hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Next: Itinerary →
                        </button>
                      )}
                      {packageFormTab === 'itinerary' && (
                        <button
                          type="button"
                          onClick={() => setPackageFormTab('details')}
                          className="bg-[#00AEEF] hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Next: Highlights & Stays →
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: COMPANY INFO MANAGEMENT */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Editable Company Settings</h2>
          <p className="text-xs text-slate-500">
            Changes made here will instantly update the Logo text/URL, Navbar top strip, and Footer.
          </p>

          <form onSubmit={handleCompanySave} className="space-y-4 text-xs max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Logo Text</label>
                <input
                  type="text"
                  value={companyForm.logoText}
                  onChange={e => setCompanyForm({ ...companyForm, logoText: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={companyForm.email}
                  onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={companyForm.instagramUrl}
                  onChange={e => setCompanyForm({ ...companyForm, instagramUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Office Address</label>
              <input
                type="text"
                value={companyForm.address}
                onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="bg-[#00AEEF] hover:bg-sky-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md"
            >
              Save Company Info
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Manage Gallery</h2>

          {/* Add gallery image form */}
          <form onSubmit={handleAddGallerySubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">Add New Gallery Photo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Photo Title</label>
                <input
                  type="text"
                  required
                  placeholder="Title (e.g. Sunset in Srinagar)"
                  value={newGalleryTitle}
                  onChange={e => setNewGalleryTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Category</label>
                  <select
                    value={newGalleryCategory}
                    onChange={e => setNewGalleryCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                  >
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                    <option value="Nature">Nature</option>
                    <option value="Beach">Beach</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={newGalleryLocation}
                    onChange={e => setNewGalleryLocation(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                  />
                </div>
              </div>
            </div>

            <ImageSelector
              value={newGalleryImage}
              onChange={setNewGalleryImage}
              label="Photo Image"
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm text-xs transition-colors"
              >
                Add to Gallery Collection
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map(item => (
              <div key={item.id} className="relative rounded-2xl overflow-hidden bg-slate-100 group border border-slate-200">
                <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                <div className="p-2 bg-white flex items-center justify-between">
                  <span className="text-[10px] font-bold truncate">{item.title}</span>
                  <button
                    onClick={() => deleteGalleryItem(item.id)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DESTINATIONS MANAGEMENT */}
      {activeTab === 'destinations' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Destinations</h2>
              <p className="text-xs text-slate-500">Add, edit, or remove domestic states and international countries.</p>
            </div>
            
            {/* Tab selector */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setDestTab('domestic');
                  setEditingDestId(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  destTab === 'domestic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Domestic States ({domesticStates.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestTab('international');
                  setEditingDestId(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  destTab === 'international' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                International Countries ({internationalCountries.length})
              </button>
            </div>
          </div>

          {/* Add/Edit Form */}
          <form onSubmit={handleSaveDestination} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">
              {editingDestId ? 'Edit Destination' : `Add New ${destTab === 'domestic' ? 'Domestic State' : 'International Country'}`}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmir or Japan"
                  value={newDestName}
                  onChange={e => setNewDestName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Slug (URL friendly, auto-generated if empty)</label>
                <input
                  type="text"
                  placeholder="e.g. kashmir"
                  value={newDestSlug}
                  onChange={e => setNewDestSlug(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Highlight Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Paradise on Earth"
                  value={newDestTag}
                  onChange={e => setNewDestTag(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe this destination..."
                value={newDestDescription}
                onChange={e => setNewDestDescription(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageSelector
                value={newDestImage}
                onChange={setNewDestImage}
                label="Card Image (Grid thumbnail)"
              />
              <ImageSelector
                value={newDestBannerImage}
                onChange={setNewDestBannerImage}
                label="Banner Image (Main page hero)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Highlights (comma separated)</label>
                <input
                  type="text"
                  placeholder="Srinagar, Gulmarg, Pahalgam, Sonamarg"
                  value={newDestHighlights}
                  onChange={e => setNewDestHighlights(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="newDestFeatured"
                  checked={newDestFeatured}
                  onChange={e => setNewDestFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <label htmlFor="newDestFeatured" className="font-bold text-slate-700 text-xs cursor-pointer select-none">
                  Feature this destination on Home Page
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingDestId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingDestId(null);
                    setNewDestName('');
                    setNewDestSlug('');
                    setNewDestImage('');
                    setNewDestBannerImage('');
                    setNewDestDescription('');
                    setNewDestTag('');
                    setNewDestFeatured(false);
                    setNewDestHighlights('');
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm text-xs transition-colors"
              >
                {editingDestId ? 'Save Destination Changes' : 'Create New Destination'}
              </button>
            </div>
          </form>

          {/* Destinations Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(destTab === 'domestic' ? domesticStates : internationalCountries).map(item => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    {item.featured && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                      {item.packageCount} Packages
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-[10px] font-mono text-slate-400">Slug: /{item.slug}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-normal">{item.description}</p>
                    {item.tag && (
                      <span className="inline-block bg-[#00AEEF]/10 text-[#00AEEF] text-[9px] font-bold px-2 py-0.5 rounded-md mt-1">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2 border-t border-slate-50 mt-3">
                  <button
                    onClick={() => handleEditDestination(item, destTab)}
                    className="flex-1 flex items-center justify-center gap-1 bg-sky-50 hover:bg-sky-100 text-[#00AEEF] py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteDestination(item.id, destTab)}
                    className="flex-1 flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: HERO SLIDERS MANAGEMENT */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Hero Carousel</h2>
            <p className="text-xs text-slate-500">Edit the large slideshow banners displayed on the home page hero section.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveHeroSlide} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">
              {editingHeroId ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Banner Tag/Badge (e.g. Best Sellers)</label>
                <input
                  type="text"
                  placeholder="e.g. Special Offer 2026"
                  value={newHeroTag}
                  onChange={e => setNewHeroTag(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Hero Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Explore Srinagar & Gulmarg"
                  value={newHeroTitle}
                  onChange={e => setNewHeroTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Nights / 6 Days luxury packages starting from ₹14,999"
                  value={newHeroSubtitle}
                  onChange={e => setNewHeroSubtitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">CTA Button Text</label>
                <input
                  type="text"
                  placeholder="Explore Packages"
                  value={newHeroCtaText}
                  onChange={e => setNewHeroCtaText(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">CTA Target Link</label>
                <input
                  type="text"
                  placeholder="/packages"
                  value={newHeroCtaLink}
                  onChange={e => setNewHeroCtaLink(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>
            </div>

            <ImageSelector
              value={newHeroBgImage}
              onChange={setNewHeroBgImage}
              label="Slider Background Image"
            />

            <div className="flex justify-end gap-2 pt-2">
              {editingHeroId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingHeroId(null);
                    setNewHeroTitle('');
                    setNewHeroSubtitle('');
                    setNewHeroTag('');
                    setNewHeroBgImage('');
                    setNewHeroCtaText('Explore Packages');
                    setNewHeroCtaLink('/packages');
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm text-xs transition-colors"
              >
                {editingHeroId ? 'Save Slide changes' : 'Add Slideshow Banner'}
              </button>
            </div>
          </form>

          {/* Slides lists */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Active Slides List ({heroSlides.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroSlides.map((slide, idx) => (
                <div key={slide.id} className="relative rounded-2xl overflow-hidden bg-slate-900 text-white aspect-[21/9] flex items-center group shadow-md border border-slate-800">
                  <img src={slide.bgImage} alt={slide.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-[1.02] transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  
                  <div className="relative p-6 max-w-md space-y-1.5 z-10">
                    <span className="text-[8px] uppercase tracking-wider font-bold bg-[#FDB813] text-slate-900 px-2 py-0.5 rounded-full w-max">
                      {slide.tag || 'Slide ' + (idx + 1)}
                    </span>
                    <h4 className="text-sm font-bold leading-tight">{slide.title}</h4>
                    <p className="text-[10px] text-slate-300 line-clamp-1">{slide.subtitle}</p>
                    <div className="inline-block bg-[#00AEEF] text-white text-[9px] font-bold px-3 py-1 rounded-md">
                      {slide.ctaText}
                    </div>
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex gap-1.5 z-20">
                    <button
                      onClick={() => handleEditHeroSlide(slide)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                      title="Edit slide"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHeroSlide(slide.id)}
                      className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BLOGS MANAGEMENT */}
      {activeTab === 'blogs' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Travel Blogs</h2>
            <p className="text-xs text-slate-500">Publish guides, travel tips, and scenic logs to the public portal.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveBlog} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">
              {editingBlogId ? 'Edit Blog Post' : 'Write New Blog Post'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Blog Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best Time to Visit Kashmir in 2026"
                  value={newBlogTitle}
                  onChange={e => setNewBlogTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Slug URL (auto-generated if empty)</label>
                <input
                  type="text"
                  placeholder="e.g. best-time-to-visit-kashmir"
                  value={newBlogSlug}
                  onChange={e => setNewBlogSlug(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Travel Guide, Packing Tips, Festivals"
                  value={newBlogCategory}
                  onChange={e => setNewBlogCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Author Name</label>
                <input
                  type="text"
                  value={newBlogAuthor}
                  onChange={e => setNewBlogAuthor(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="newBlogFeatured"
                  checked={newBlogFeatured}
                  onChange={e => setNewBlogFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <label htmlFor="newBlogFeatured" className="font-bold text-slate-700 text-xs cursor-pointer select-none">
                  Highlight as Featured Article
                </label>
              </div>
            </div>

            <ImageSelector
              value={newBlogImage}
              onChange={setNewBlogImage}
              label="Blog Cover Image"
            />

            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Short Excerpt (Introductory summary snippet)</label>
              <input
                type="text"
                placeholder="A quick summary showing on the grid before reading..."
                value={newBlogExcerpt}
                onChange={e => setNewBlogExcerpt(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Main Content (Paragraphs)</label>
              <textarea
                required
                rows={8}
                placeholder="Type or paste the full markdown or plaintext story details here..."
                value={newBlogContent}
                onChange={e => setNewBlogContent(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingBlogId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlogId(null);
                    setNewBlogTitle('');
                    setNewBlogSlug('');
                    setNewBlogCategory('');
                    setNewBlogAuthor('SkyNet Holidays');
                    setNewBlogExcerpt('');
                    setNewBlogContent('');
                    setNewBlogImage('');
                    setNewBlogFeatured(false);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm text-xs transition-colors"
              >
                {editingBlogId ? 'Save Blog Changes' : 'Publish Blog Post'}
              </button>
            </div>
          </form>

          {/* Blogs Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    {blog.featured && (
                      <span className="absolute top-2 left-2 bg-[#FDB813] text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                      {blog.readTime}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {blog.category}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{blog.title}</h4>
                    <p className="text-[10px] text-slate-400">By {blog.author} • {blog.date}</p>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{blog.excerpt || blog.content}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2 border-t border-slate-50 mt-3">
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="flex-1 flex items-center justify-center gap-1 bg-sky-50 hover:bg-sky-100 text-[#00AEEF] py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: OFFERS & DISCOUNTS MANAGEMENT */}
      {activeTab === 'offers' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-6 h-6 text-[#00AEEF]" />
              <span>Manage Special Offers & Discount Codes</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add or edit promo codes, limited time deals, and honeymoon package upgrades shown across the website.
            </p>
          </div>

          {/* Add / Edit Form */}
          <form onSubmit={handleSaveOffer} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">
              {editingOfferId ? 'Edit Selected Offer' : 'Create New Special Offer / Discount'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Early Bird Monsoon & Autumn Discount"
                  value={newOfferTitle}
                  onChange={e => setNewOfferTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Promo Code / Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SKYNETMONSOON"
                  value={newOfferCode}
                  onChange={e => setNewOfferCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs font-mono font-bold uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Subtitle / Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Get flat ₹5,000 OFF per couple on all Kashmir & Kerala packages"
                  value={newOfferSubtitle}
                  onChange={e => setNewOfferSubtitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Discount Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat ₹5,000 OFF"
                    value={newOfferDiscountText}
                    onChange={e => setNewOfferDiscountText(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block text-xs mb-1">Valid Till Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 31st August 2026"
                    value={newOfferValidTill}
                    onChange={e => setNewOfferValidTill(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00AEEF] text-xs"
                  />
                </div>
              </div>
            </div>

            <ImageSelector
              value={newOfferBgImage}
              onChange={setNewOfferBgImage}
              label="Banner Background Image URL (Unsplash or local)"
            />

            <div className="flex justify-end gap-3 pt-2">
              {editingOfferId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingOfferId(null);
                    setNewOfferTitle('');
                    setNewOfferSubtitle('');
                    setNewOfferCode('');
                    setNewOfferDiscountText('');
                    setNewOfferValidTill('');
                    setNewOfferBgImage('');
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm text-xs transition-colors"
              >
                {editingOfferId ? 'Save Changes' : 'Create Special Offer'}
              </button>
            </div>
          </form>

          {/* List current offers */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Active Offers & Promo Codes</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {offers.map(offer => (
                <div key={offer.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-32 md:h-auto relative">
                    <img src={offer.bgImage} alt={offer.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#FDB813] text-slate-900 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {offer.discountText}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{offer.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{offer.subtitle}</p>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">Coupon Code:</span>
                        <code className="bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-lg text-[#00AEEF] text-xs font-mono font-extrabold">{offer.code}</code>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span>Valid Till: <strong className="text-slate-600">{offer.validTill}</strong></span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditOffer(offer)}
                          className="text-[#00AEEF] hover:text-sky-600 font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="text-rose-500 hover:text-rose-700 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DETAILED EDIT INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#00AEEF]" />
              <span>SkyNet Holidays Content Management Guide</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Follow these simple procedures to manage, edit, and keep your travel portal up to date.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Login & Setup */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="bg-[#00AEEF] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Login Credentials</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The primary admin identity is configured to use the official company email:
              </p>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <p><span className="text-slate-400">Username:</span> <code className="text-[#00AEEF] font-bold select-all">info@skynetholidays.com</code></p>
                <div className="flex items-center justify-between">
                  <p>
                    <span className="text-slate-400">Password:</span>{' '}
                    <code className="text-[#00AEEF] font-bold select-all">
                      {showHelpPassword ? '7877566175' : '••••••••••'}
                    </code>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowHelpPassword(!showHelpPassword)}
                    className="text-[10px] text-slate-500 hover:text-[#00AEEF] font-semibold underline cursor-pointer"
                  >
                    {showHelpPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                You can access this page directly by adding <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">/admin</code> to the web URL.
              </p>
            </div>

            {/* Editing Package */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="bg-[#00AEEF] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Modifying Tour Packages</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Go to the <span className="font-semibold text-slate-800">Packages</span> tab and click the blue <span className="font-semibold text-[#00AEEF]">Edit</span> icon on any package card. A pop-up editor will open allowing you to change:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 pl-1">
                <li>Package Title, Pricing, and Special Offer Price</li>
                <li>Duration (e.g. 6 Days / 5 Nights)</li>
                <li>Detailed Day-by-Day Itinerary timeline descriptions</li>
                <li>Cover Images and Highlights bullet list</li>
              </ul>
            </div>

            {/* Leads */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="bg-[#00AEEF] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Managing Client Bookings & Leads</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When visitors fill out booking forms or request a custom quote, their enquiries are captured instantly in local persistent storage.
              </p>
              <div className="space-y-1.5 text-xs text-slate-500">
                <p className="flex items-start gap-1.5">
                  <span className="text-[#00AEEF] font-bold">•</span>
                  <span>View client details, selected package, guest count, and contact phone instantly.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-[#00AEEF] font-bold">•</span>
                  <span>Change status from <span className="text-amber-600 font-bold">Pending</span> to <span className="text-emerald-600 font-bold">Confirmed</span> after speaking with the client.</span>
                </p>
              </div>
            </div>

            {/* Sitewide Info */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="bg-[#00AEEF] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Sitewide Company Settings</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To update contact phone lines, support emails, Instagram handles, or physical office addresses:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 pl-1">
                <li>Navigate to the <span className="font-semibold text-slate-800">Company Info</span> tab.</li>
                <li>Type in your new contact details.</li>
                <li>Click <span className="font-semibold text-[#00AEEF]">Save Company Info</span>.</li>
                <li>This modifies the header, footer, and Contact Us widgets across the whole portal!</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Offline Resilience & Cache Persistence</p>
              <p className="leading-relaxed">
                All changes you make inside this dashboard are safely persisted in the database.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

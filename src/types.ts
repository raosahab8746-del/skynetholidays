export interface CompanyInfo {
  name: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  phone: string;
  altPhone?: string;
  email: string;
  instagramUrl: string;
  address: string;
  aboutText: string;
  mission: string;
  vision: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface DestinationRegion {
  name: string;
  description: string;
  highlights: string[];
}

export interface StateDestination {
  id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage: string;
  description: string;
  regions: DestinationRegion[];
  tag: string;
  packageCount: number;
  featured?: boolean;
}

export interface CountryDestination {
  id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage: string;
  description: string;
  regions: DestinationRegion[];
  tag: string;
  packageCount: number;
  featured?: boolean;
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  mealsIncluded?: string;
  overnightStay?: string;
  activities?: string;
  hotel?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PackageReview {
  id: string;
  user: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PackageHotel {
  name: string;
  rating?: string;
  location?: string;
}

export interface PackageItem {
  id: string;
  title: string;
  slug: string;
  type: 'domestic' | 'international' | 'weekend';
  parentSlug: string; // state or country slug e.g. "kashmir" or "japan"
  parentName: string; // e.g. "Kashmir" or "Japan"
  regionName: string; // e.g. "Srinagar", "Gulmarg", "Tokyo", etc.
  coverImage: string;
  galleryImages: string[];
  duration: string; // e.g. "5 Days / 4 Nights"
  nights: number;
  days: number;
  price: number;
  offerPrice: number;
  discountPercent: number;
  description: string;
  longDescription?: string;
  highlights: string[];
  dayItinerary: DayItinerary[];
  hotels: string[];
  hotelsDetailed?: PackageHotel[];
  meals: string;
  transportation: string;
  sightseeing: string[];
  inclusions: string[];
  exclusions: string[];
  bestTime: string;
  thingsToCarry: string[];
  faqs: FAQItem[];
  reviews: PackageReview[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  budgetCategory: 'budget' | 'mid' | 'luxury';
  availableDates?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Nature' | 'Adventure' | 'Beach' | 'Wildlife' | 'Culture' | 'International' | 'Domestic';
  image: string;
  location: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  packageName: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discountText: string;
  validTill: string;
  bgImage: string;
}

export interface BookingRequest {
  id: string;
  packageId: string;
  packageTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  guestCount: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destination: string;
  preferredDate?: string;
  duration?: string;
  budget?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface SearchFilterState {
  destination: string;
  type: 'all' | 'domestic' | 'international' | 'weekend';
  budgetMax: number;
  durationDays: string;
  category: string;
}

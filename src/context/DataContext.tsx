import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot, getDoc, writeBatch } from 'firebase/firestore';
import { signInAnonymously, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import {
  CompanyInfo,
  HeroSlide,
  StateDestination,
  CountryDestination,
  PackageItem,
  GalleryItem,
  BlogPost,
  Testimonial,
  SpecialOffer,
  BookingRequest,
  CustomerInquiry
} from '../types';
import {
  initialCompanyInfo,
  initialHeroSlides,
  initialDomesticStates,
  initialInternationalCountries,
  initialPackages,
  initialGallery,
  initialBlogPosts,
  initialTestimonials,
  initialSpecialOffers,
  initialBookings,
  initialInquiries
} from '../data/initialData';

interface DataContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: CompanyInfo) => void;
  
  heroSlides: HeroSlide[];
  updateHeroSlides: (slides: HeroSlide[]) => void;
  
  domesticStates: StateDestination[];
  updateDomesticStates: (states: StateDestination[]) => void;
  
  internationalCountries: CountryDestination[];
  updateInternationalCountries: (countries: CountryDestination[]) => void;
  
  packages: PackageItem[];
  addPackage: (pkg: PackageItem) => void;
  updatePackage: (pkg: PackageItem) => void;
  deletePackage: (id: string) => void;
  
  gallery: GalleryItem[];
  addGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  
  blogs: BlogPost[];
  addBlog: (blog: BlogPost) => void;
  updateBlog: (blog: BlogPost) => void;
  deleteBlog: (id: string) => void;
  
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  
  offers: SpecialOffer[];
  updateOffers: (offers: SpecialOffer[]) => void;
  
  bookings: BookingRequest[];
  addBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => string;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => void;
  deleteBooking: (id: string) => void;
  
  inquiries: CustomerInquiry[];
  addInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => string;
  updateInquiryStatus: (id: string, status: 'New' | 'Contacted' | 'Closed') => void;
  deleteInquiry: (id: string) => void;

  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  
  resetToDefaultData: () => void;
}


async function syncCollection(
  collectionName: string,
  localData: any[],
  setState: React.Dispatch<React.SetStateAction<any[]>>
) {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty && localData && localData.length > 0) {
      try {
        const batch = writeBatch(db);
        localData.forEach(item => {
          const docRef = doc(colRef, item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      } catch (e) {
        console.warn("Could not seed", collectionName, e);
      }
    }

    return onSnapshot(colRef, (snap) => {
      const data: any[] = [];
      snap.forEach((doc) => data.push(doc.data()));
      if (data.length > 0) {
        setState(data);
      }
    });
  } catch (e) {
    console.warn("Could not sync", collectionName, e);
    return () => {};
  }
}

async function syncSingleton(
  docName: string,
  localData: any,
  setState: React.Dispatch<React.SetStateAction<any>>
) {
  try {
    const docRef = doc(db, 'singletons', docName);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists() && localData) {
      try {
        await setDoc(docRef, localData);
      } catch (e) {
        console.warn("Could not seed singleton", docName, e);
      }
    }
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.slides) setState(data.slides);
        else if (data.states) setState(data.states);
        else if (data.countries) setState(data.countries);
        else if (data.offers) setState(data.offers);
        else setState(data as any);
      }
    });
  } catch (e) {
    console.warn("Could not sync singleton", docName, e);
    return () => {};
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const CURRENT_DATA_VERSION = 'v2026_07_22_v10';

const LOCAL_STORAGE_KEYS = {
  COMPANY_INFO: 'skynet_company_info',
  HERO_SLIDES: 'skynet_hero_slides',
  DOMESTIC_STATES: 'skynet_domestic_states',
  INTL_COUNTRIES: 'skynet_intl_countries',
  PACKAGES: 'skynet_packages',
  GALLERY: 'skynet_gallery',
  BLOGS: 'skynet_blogs',
  TESTIMONIALS: 'skynet_testimonials',
  OFFERS: 'skynet_offers',
  BOOKINGS: 'skynet_bookings',
  INQUIRIES: 'skynet_inquiries',
  ADMIN_AUTH: 'skynet_admin_auth'
};

const getInitialOrSavedPackages = (): PackageItem[] => {
  const version = localStorage.getItem('skynet_data_version');
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PACKAGES);

  if (version !== CURRENT_DATA_VERSION || !saved) {
    localStorage.setItem('skynet_data_version', CURRENT_DATA_VERSION);
    return initialPackages;
  }

  try {
    const parsed: PackageItem[] = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length < initialPackages.length) {
      const existingIds = new Set(parsed.map(p => p.id));
      const missing = initialPackages.filter(p => !existingIds.has(p.id));
      return [...parsed, ...missing];
    }
    return parsed;
  } catch (e) {
    return initialPackages;
  }
};

const getInitialOrSavedCompanyInfo = (): CompanyInfo => {
  const version = localStorage.getItem('skynet_data_version');
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPANY_INFO);

  if (version !== CURRENT_DATA_VERSION || !saved) {
    return initialCompanyInfo;
  }

  try {
    const parsed = JSON.parse(saved);
    if (parsed.phone === '+91 98290 12345' || !parsed.phone || parsed.phone !== initialCompanyInfo.phone) {
      return { ...parsed, phone: initialCompanyInfo.phone, altPhone: initialCompanyInfo.altPhone };
    }
    return parsed;
  } catch (e) {
    return initialCompanyInfo;
  }
};

const getInitialOrSavedStates = (): StateDestination[] => {
  const version = localStorage.getItem('skynet_data_version');
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DOMESTIC_STATES);
  if (version !== CURRENT_DATA_VERSION || !saved) return initialDomesticStates;
  try {
    const parsed: StateDestination[] = JSON.parse(saved);
    const existingSlugs = new Set(parsed.map(s => s.slug));
    const missing = initialDomesticStates.filter(s => !existingSlugs.has(s.slug));
    return [...parsed, ...missing];
  } catch (e) {
    return initialDomesticStates;
  }
};

const getInitialOrSavedCountries = (): CountryDestination[] => {
  const version = localStorage.getItem('skynet_data_version');
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.INTL_COUNTRIES);
  if (version !== CURRENT_DATA_VERSION || !saved) return initialInternationalCountries;
  try {
    const parsed: CountryDestination[] = JSON.parse(saved);
    const existingSlugs = new Set(parsed.map(c => c.slug));
    const missing = initialInternationalCountries.filter(c => !existingSlugs.has(c.slug));
    return [...parsed, ...missing];
  } catch (e) {
    return initialInternationalCountries;
  }
};

const getInitialOrSaved = <T,>(key: string, initial: T): T => {
  const saved = localStorage.getItem(key);
  if (!saved) return initial;
  try {
    if (saved.includes('"/images/')) {
      return initial;
    }
    return JSON.parse(saved);
  } catch (e) {
    return initial;
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => 
    getInitialOrSavedCompanyInfo()
  );

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => 
    getInitialOrSaved(LOCAL_STORAGE_KEYS.HERO_SLIDES, initialHeroSlides)
  );

  const [domesticStates, setDomesticStates] = useState<StateDestination[]>(() => 
    getInitialOrSavedStates()
  );

  const [internationalCountries, setInternationalCountries] = useState<CountryDestination[]>(() => 
    getInitialOrSavedCountries()
  );

  const [packages, setPackages] = useState<PackageItem[]>(() => 
    getInitialOrSavedPackages()
  );

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const data = getInitialOrSaved(LOCAL_STORAGE_KEYS.GALLERY, initialGallery);
    // Patch specific items that were accidentally saved with location "India"
    return data.map((item: GalleryItem) => {
      if (item.title === 'Hawa Mahal Palace' && item.location === 'India') {
        return { ...item, location: 'Jaipur, Rajasthan' };
      }
      if (item.title === 'Thajiwas Glacier Range, Sonamarg' && item.location === 'India') {
        return { ...item, location: 'Sonmarg, Kashmir' };
      }
      return item;
    });
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => 
    getInitialOrSaved(LOCAL_STORAGE_KEYS.BLOGS, initialBlogPosts)
  );

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => 
    getInitialOrSaved(LOCAL_STORAGE_KEYS.TESTIMONIALS, initialTestimonials)
  );

  const [offers, setOffers] = useState<SpecialOffer[]>(() => 
    getInitialOrSaved(LOCAL_STORAGE_KEYS.OFFERS, initialSpecialOffers)
  );

  const [bookings, setBookings] = useState<BookingRequest[]>(() => 
    getInitialOrSaved(LOCAL_STORAGE_KEYS.BOOKINGS, initialBookings)
  );

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => 
    getInitialOrSaved(LOCAL_STORAGE_KEYS.INQUIRIES, initialInquiries)
  );

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });


  useEffect(() => {
    let unsubscribes: any[] = [];
    
    // Auth
    if (isAdminLoggedIn) {
      signInAnonymously(auth).catch(console.error);
    }

    const initSync = async () => {
      unsubscribes.push(await syncSingleton('companyInfo', companyInfo, setCompanyInfo));
      unsubscribes.push(await syncSingleton('heroSlides', heroSlides, setHeroSlides));
      unsubscribes.push(await syncSingleton('domesticStates', domesticStates, setDomesticStates));
      unsubscribes.push(await syncSingleton('internationalCountries', internationalCountries, setInternationalCountries));
      unsubscribes.push(await syncCollection('packages', packages, setPackages));
      unsubscribes.push(await syncCollection('gallery', gallery, setGallery));
      unsubscribes.push(await syncCollection('blogs', blogs, setBlogs));
      unsubscribes.push(await syncCollection('testimonials', testimonials, setTestimonials));
      unsubscribes.push(await syncSingleton('offers', offers, setOffers));
      unsubscribes.push(await syncCollection('bookings', bookings, setBookings));
      unsubscribes.push(await syncCollection('inquiries', inquiries, setInquiries));
    };
    initSync();

    return () => {
      unsubscribes.forEach(unsub => unsub && unsub());
    };
  }, []);

  const updateCompanyInfo = async (info: CompanyInfo) => {
    setCompanyInfo(info);
    await setDoc(doc(db, 'singletons', 'companyInfo'), info);
  };

  const updateHeroSlides = async (slides: HeroSlide[]) => {
    setHeroSlides(slides);
    await setDoc(doc(db, 'singletons', 'heroSlides'), { slides });
  };

  const updateDomesticStates = async (states: StateDestination[]) => {
    setDomesticStates(states);
    await setDoc(doc(db, 'singletons', 'domesticStates'), { states });
  };

  const updateInternationalCountries = async (countries: CountryDestination[]) => {
    setInternationalCountries(countries);
    await setDoc(doc(db, 'singletons', 'internationalCountries'), { countries });
  };

  const addPackage = async (pkg: PackageItem) => {
    setPackages(prev => [pkg, ...prev]);
    await setDoc(doc(db, 'packages', pkg.id), pkg);
  };

  const updatePackage = async (updatedPkg: PackageItem) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    await setDoc(doc(db, 'packages', updatedPkg.id), updatedPkg);
  };

  const deletePackage = async (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
    await deleteDoc(doc(db, 'packages', id));
  };

  const addGalleryItem = async (item: GalleryItem) => {
    setGallery(prev => [item, ...prev]);
    await setDoc(doc(db, 'gallery', item.id), item);
  };

  const deleteGalleryItem = async (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    await deleteDoc(doc(db, 'gallery', id));
  };

  const addBlog = async (blog: BlogPost) => {
    setBlogs(prev => [blog, ...prev]);
    await setDoc(doc(db, 'blogs', blog.id), blog);
  };

  const updateBlog = async (updatedBlog: BlogPost) => {
    setBlogs(prev => prev.map(b => b.id === updatedBlog.id ? updatedBlog : b));
    await setDoc(doc(db, 'blogs', updatedBlog.id), updatedBlog);
  };

  const deleteBlog = async (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    await deleteDoc(doc(db, 'blogs', id));
  };

  const addTestimonial = async (testimonial: Testimonial) => {
    setTestimonials(prev => [testimonial, ...prev]);
    await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await deleteDoc(doc(db, 'testimonials', id));
  };

  const updateOffers = async (updatedOffers: SpecialOffer[]) => {
    setOffers(updatedOffers);
    await setDoc(doc(db, 'singletons', 'offers'), { offers: updatedOffers });
  };

  const addBooking = async (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRequest = {
      ...bookingData,
      id,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings(prev => [newBooking, ...prev]);
    await setDoc(doc(db, 'bookings', id), newBooking);
    return id;
  };

  const updateBookingStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    const bk = bookings.find(b => b.id === id);
    if (bk) {
      await setDoc(doc(db, 'bookings', id), { ...bk, status });
    }
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    await deleteDoc(doc(db, 'bookings', id));
  };

  const addInquiry = async (inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => {
    const id = `INQ-${Math.floor(500 + Math.random() * 9000)}`;
    const newInquiry: CustomerInquiry = {
      ...inquiryData,
      id,
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInquiries(prev => [newInquiry, ...prev]);
    await setDoc(doc(db, 'inquiries', id), newInquiry);
    return id;
  };

  const updateInquiryStatus = async (id: string, status: 'New' | 'Contacted' | 'Closed') => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    const iq = inquiries.find(i => i.id === id);
    if (iq) {
      await setDoc(doc(db, 'inquiries', id), { ...iq, status });
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
    await deleteDoc(doc(db, 'inquiries', id));
  };

  const loginAdmin = (user: string, pass: string) => {
    const normalizedUser = user.trim().toLowerCase();
    const normalizedPass = pass.trim();
    const isValidUser = normalizedUser === 'info@skynetholidays.com' || normalizedUser === 'info@skynetholiday.com';
    
    if (isValidUser && normalizedPass === '7877566175') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      signInAnonymously(auth).catch(console.error);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'false');
    signOut(auth).catch(console.error);
  };

  const resetToDefaultData = () => {
    setCompanyInfo(initialCompanyInfo);
    setHeroSlides(initialHeroSlides);
    setDomesticStates(initialDomesticStates);
    setInternationalCountries(initialInternationalCountries);
    setPackages(initialPackages);
    setGallery(initialGallery);
    setBlogs(initialBlogPosts);
    setTestimonials(initialTestimonials);
    setOffers(initialSpecialOffers);
    setBookings(initialBookings);
    setInquiries(initialInquiries);
    localStorage.clear();
  };

  const computedDomesticStates = domesticStates.map(state => ({
    ...state,
    packageCount: packages.filter(p => p.parentSlug === state.slug).length
  }));

  const computedInternationalCountries = internationalCountries.map(country => ({
    ...country,
    packageCount: packages.filter(p => p.parentSlug === country.slug).length
  }));

  return (
    <DataContext.Provider
      value={{
        companyInfo,
        updateCompanyInfo,
        heroSlides,
        updateHeroSlides,
        domesticStates: computedDomesticStates,
        updateDomesticStates,
        internationalCountries: computedInternationalCountries,
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
        addBooking,
        updateBookingStatus,
        deleteBooking,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        resetToDefaultData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

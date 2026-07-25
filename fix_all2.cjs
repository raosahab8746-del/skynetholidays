const fs = require('fs');

let content = fs.readFileSync('src/context/DataContext.tsx.bak', 'utf8');

const imports = `import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot, getDoc, writeBatch } from 'firebase/firestore';
import { signInAnonymously, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';`;

content = content.replace("import React, { createContext, useContext, useState, useEffect } from 'react';", "import React, { createContext, useContext, useState, useEffect } from 'react';\n" + imports);

const syncLogic = `
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
`;

content = content.replace("export const DataContext = createContext", syncLogic + "\nexport const DataContext = createContext");

const effectsToRemove = /  \/\/ Save changes to localStorage[\s\S]*?  const updateCompanyInfo/m;
const newEffects = `
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

  const updateCompanyInfo`;

content = content.replace(effectsToRemove, newEffects);

const replacements = {
  "updateCompanyInfo = (info: CompanyInfo) => {\n    setCompanyInfo(info);\n  }": "updateCompanyInfo = async (info: CompanyInfo) => {\n    setCompanyInfo(info);\n    await setDoc(doc(db, 'singletons', 'companyInfo'), info);\n  }",
  
  "updateHeroSlides = (slides: HeroSlide[]) => {\n    setHeroSlides(slides);\n  }": "updateHeroSlides = async (slides: HeroSlide[]) => {\n    setHeroSlides(slides);\n    await setDoc(doc(db, 'singletons', 'heroSlides'), { slides });\n  }",

  "updateDomesticStates = (states: StateDestination[]) => {\n    setDomesticStates(states);\n  }": "updateDomesticStates = async (states: StateDestination[]) => {\n    setDomesticStates(states);\n    await setDoc(doc(db, 'singletons', 'domesticStates'), { states });\n  }",

  "updateInternationalCountries = (countries: CountryDestination[]) => {\n    setInternationalCountries(countries);\n  }": "updateInternationalCountries = async (countries: CountryDestination[]) => {\n    setInternationalCountries(countries);\n    await setDoc(doc(db, 'singletons', 'internationalCountries'), { countries });\n  }",

  "addPackage = (pkg: PackageItem) => {\n    setPackages(prev => [pkg, ...prev]);\n  }": "addPackage = async (pkg: PackageItem) => {\n    setPackages(prev => [pkg, ...prev]);\n    await setDoc(doc(db, 'packages', pkg.id), pkg);\n  }",

  "updatePackage = (updatedPkg: PackageItem) => {\n    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));\n  }": "updatePackage = async (updatedPkg: PackageItem) => {\n    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));\n    await setDoc(doc(db, 'packages', updatedPkg.id), updatedPkg);\n  }",

  "deletePackage = (id: string) => {\n    setPackages(prev => prev.filter(p => p.id !== id));\n  }": "deletePackage = async (id: string) => {\n    setPackages(prev => prev.filter(p => p.id !== id));\n    await deleteDoc(doc(db, 'packages', id));\n  }",

  "addGalleryItem = (item: GalleryItem) => {\n    setGallery(prev => [item, ...prev]);\n  }": "addGalleryItem = async (item: GalleryItem) => {\n    setGallery(prev => [item, ...prev]);\n    await setDoc(doc(db, 'gallery', item.id), item);\n  }",

  "deleteGalleryItem = (id: string) => {\n    setGallery(prev => prev.filter(g => g.id !== id));\n  }": "deleteGalleryItem = async (id: string) => {\n    setGallery(prev => prev.filter(g => g.id !== id));\n    await deleteDoc(doc(db, 'gallery', id));\n  }",

  "addBlog = (blog: BlogPost) => {\n    setBlogs(prev => [blog, ...prev]);\n  }": "addBlog = async (blog: BlogPost) => {\n    setBlogs(prev => [blog, ...prev]);\n    await setDoc(doc(db, 'blogs', blog.id), blog);\n  }",

  "updateBlog = (updatedBlog: BlogPost) => {\n    setBlogs(prev => prev.map(b => b.id === updatedBlog.id ? updatedBlog : b));\n  }": "updateBlog = async (updatedBlog: BlogPost) => {\n    setBlogs(prev => prev.map(b => b.id === updatedBlog.id ? updatedBlog : b));\n    await setDoc(doc(db, 'blogs', updatedBlog.id), updatedBlog);\n  }",

  "deleteBlog = (id: string) => {\n    setBlogs(prev => prev.filter(b => b.id !== id));\n  }": "deleteBlog = async (id: string) => {\n    setBlogs(prev => prev.filter(b => b.id !== id));\n    await deleteDoc(doc(db, 'blogs', id));\n  }",

  "addTestimonial = (testimonial: Testimonial) => {\n    setTestimonials(prev => [testimonial, ...prev]);\n  }": "addTestimonial = async (testimonial: Testimonial) => {\n    setTestimonials(prev => [testimonial, ...prev]);\n    await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);\n  }",

  "deleteTestimonial = (id: string) => {\n    setTestimonials(prev => prev.filter(t => t.id !== id));\n  }": "deleteTestimonial = async (id: string) => {\n    setTestimonials(prev => prev.filter(t => t.id !== id));\n    await deleteDoc(doc(db, 'testimonials', id));\n  }",

  "updateOffers = (updatedOffers: SpecialOffer[]) => {\n    setOffers(updatedOffers);\n  }": "updateOffers = async (updatedOffers: SpecialOffer[]) => {\n    setOffers(updatedOffers);\n    await setDoc(doc(db, 'singletons', 'offers'), { offers: updatedOffers });\n  }",

  "addBooking = (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {\n    const id = \`BK-\${Math.floor(1000 + Math.random() * 9000)}\`;\n    const newBooking: BookingRequest = {\n      ...bookingData,\n      id,\n      status: 'Pending',\n      createdAt: new Date().toISOString().split('T')[0]\n    };\n    setBookings(prev => [newBooking, ...prev]);\n    return id;\n  }": "addBooking = async (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {\n    const id = \`BK-\${Math.floor(1000 + Math.random() * 9000)}\`;\n    const newBooking: BookingRequest = {\n      ...bookingData,\n      id,\n      status: 'Pending',\n      createdAt: new Date().toISOString().split('T')[0]\n    };\n    setBookings(prev => [newBooking, ...prev]);\n    await setDoc(doc(db, 'bookings', id), newBooking);\n    return id;\n  }",

  "updateBookingStatus = (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {\n    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));\n  }": "updateBookingStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {\n    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));\n    const bk = bookings.find(b => b.id === id);\n    if (bk) {\n      await setDoc(doc(db, 'bookings', id), { ...bk, status });\n    }\n  }",

  "deleteBooking = (id: string) => {\n    setBookings(prev => prev.filter(b => b.id !== id));\n  }": "deleteBooking = async (id: string) => {\n    setBookings(prev => prev.filter(b => b.id !== id));\n    await deleteDoc(doc(db, 'bookings', id));\n  }",

  "addInquiry = (inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => {\n    const id = \`INQ-\${Math.floor(500 + Math.random() * 9000)}\`;\n    const newInquiry: CustomerInquiry = {\n      ...inquiryData,\n      id,\n      status: 'New',\n      createdAt: new Date().toISOString().split('T')[0]\n    };\n    setInquiries(prev => [newInquiry, ...prev]);\n    return id;\n  }": "addInquiry = async (inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => {\n    const id = \`INQ-\${Math.floor(500 + Math.random() * 9000)}\`;\n    const newInquiry: CustomerInquiry = {\n      ...inquiryData,\n      id,\n      status: 'New',\n      createdAt: new Date().toISOString().split('T')[0]\n    };\n    setInquiries(prev => [newInquiry, ...prev]);\n    await setDoc(doc(db, 'inquiries', id), newInquiry);\n    return id;\n  }",

  "updateInquiryStatus = (id: string, status: 'New' | 'Contacted' | 'Closed') => {\n    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));\n  }": "updateInquiryStatus = async (id: string, status: 'New' | 'Contacted' | 'Closed') => {\n    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));\n    const iq = inquiries.find(i => i.id === id);\n    if (iq) {\n      await setDoc(doc(db, 'inquiries', id), { ...iq, status });\n    }\n  }",

  "deleteInquiry = (id: string) => {\n    setInquiries(prev => prev.filter(i => i.id !== id));\n  }": "deleteInquiry = async (id: string) => {\n    setInquiries(prev => prev.filter(i => i.id !== id));\n    await deleteDoc(doc(db, 'inquiries', id));\n  }"
};

for (const [key, val] of Object.entries(replacements)) {
  content = content.replace(key, val);
}

content = content.replace(
  "setIsAdminLoggedIn(true);\n      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');",
  "setIsAdminLoggedIn(true);\n      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');\n      signInAnonymously(auth).catch(console.error);"
);

content = content.replace(
  "setIsAdminLoggedIn(false);\n    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'false');",
  "setIsAdminLoggedIn(false);\n    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'false');\n    signOut(auth).catch(console.error);"
);

fs.writeFileSync('src/context/DataContext.tsx', content);

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
import { domesticPackagesData } from './domesticPackagesData';
import { internationalPackagesData } from './internationalPackagesData';

export const initialCompanyInfo: CompanyInfo = {
  name: "SkyNet Holidays",
  tagline: "Your Gateway to Unforgettable Luxury Experiences",
  logoText: "SkyNet Holidays",
  phone: "+91 9358718087",
  altPhone: "+91 9358718087",
  email: "info@skynetholidays.com",
  instagramUrl: "https://www.instagram.com/skynetholidays_/",
  address: "Park Street Road, Jaipur, Rajasthan",
  aboutText: "SkyNet Holidays is a premier luxury travel agency specializing in crafted domestic and international holiday experiences. With over 12 years of excellence, we turn your travel dreams into reality with personalized itineraries, 24/7 dedicated concierges, and handpicked luxury stays.",
  mission: "To provide world-class, seamless, and unforgettable travel journeys with unparalleled luxury and hospitality.",
  vision: "To become India's most trusted and preferred luxury travel brand known for authenticity, innovation, and customer happiness."
};

export const initialHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "Discover Kashmir's Enchanting Valleys",
    subtitle: "Experience Heaven on Earth with Srinagar, Gulmarg & Pahalgam Luxury Packages",
    tag: "Trending Kashmir",
    bgImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Kashmir",
    ctaLink: "/domestic/kashmir"
  },
  {
    id: "hero-2",
    title: "Experience Royal Rajasthan Heritage",
    subtitle: "Explore Palaces, Forts & Golden Deserts in Jaipur, Udaipur & Jaisalmer",
    tag: "Royal Rajasthan",
    bgImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Rajasthan",
    ctaLink: "/domestic/rajasthan"
  },
  {
    id: "hero-3",
    title: "Luxury Getaways in Tropical Bali",
    subtitle: "Immerse in Serene Beaches, Ubud Villas & Sunset Cliffs of Nusa Penida",
    tag: "Tropical Bali",
    bgImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Bali",
    ctaLink: "/international/bali"
  },
  {
    id: "hero-4",
    title: "Futuristic Wonders of Japan & Tokyo",
    subtitle: "Witness Mount Fuji, Historic Kyoto Temples & Cherry Blossom Trails",
    tag: "Exclusive Japan",
    bgImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Japan",
    ctaLink: "/international/japan"
  },
  {
    id: "hero-5",
    title: "Ultra Luxury & Desert Safaris in Dubai",
    subtitle: "Burj Khalifa Views, Dune Bashing & 5-Star Arabian Hospitality",
    tag: "Glamorous Dubai",
    bgImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Dubai",
    ctaLink: "/international/dubai"
  },
  {
    id: "hero-6",
    title: "Overwater Bungalow Paradise in Maldives",
    subtitle: "Turquoise Lagoons, Coral Reef Snorkeling & Private Island Escapes",
    tag: "Romantic Maldives",
    bgImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Maldives",
    ctaLink: "/international/maldives"
  },
  {
    id: "hero-7",
    title: "Serene Backwaters & Misty Munnar Tea Gardens",
    subtitle: "Private Houseboat Cruises & Luxury Hill Resorts in God's Own Country",
    tag: "Tranquil Kerala",
    bgImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Kerala",
    ctaLink: "/domestic/kerala"
  },
  {
    id: "hero-8",
    title: "Sun-Kissed Beaches & Dudhsagar Falls in Goa",
    subtitle: "Beachfront Luxury Resorts, Sunset Cruises & Heritage Portuguese Escapes",
    tag: "Vibrant Goa",
    bgImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Goa",
    ctaLink: "/domestic/goa"
  },
  {
    id: "hero-9",
    title: "High Altitude Wonders of Leh & Pangong Lake",
    subtitle: "Ancient Himalayan Monasteries, Khardung La Pass & Crystal Lakes",
    tag: "High Mountain Ladakh",
    bgImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Ladakh",
    ctaLink: "/domestic/ladakh"
  },
  {
    id: "hero-10",
    title: "Tropical Island Hopping & Temples in Thailand",
    subtitle: "Phi Phi Islands, Emerald Lagoons & Bustling Night Markets in Phuket & Bangkok",
    tag: "Exotic Thailand",
    bgImage: "https://images.unsplash.com/photo-1506665531195-3566af294817?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Thailand",
    ctaLink: "/international/thailand"
  }
];

export const initialDomesticStates: StateDestination[] = [
  {
    id: "state-1",
    name: "Kashmir",
    slug: "kashmir",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1600&q=80",
    description: "Known as 'Paradise on Earth', Kashmir offers snow-capped peaks, serene Dal Lake Shikaras, lush meadows, and pine forests.",
    regions: [
      { name: "Srinagar", description: "Famous for Dal Lake, Houseboats, and Mughal Gardens", highlights: ["Shikara Ride", "Houseboat Stay", "Nishat Bagh"] },
      { name: "Gulmarg", description: "India's premier ski resort with the world's second-highest Gondola ride", highlights: ["Gondola Ride", "Ski Slopes", "Golf Course"] },
      { name: "Sonmarg", description: "The 'Meadow of Gold' flanked by glaciers and river valleys", highlights: ["Thajiwas Glacier", "Zero Point", "Sindh River"] },
      { name: "Pahalgam", description: "The Valley of Shepherds surrounded by pine woods and lidder river", highlights: ["Betaab Valley", "Aru Valley", "Chandanwari"] }
    ],
    tag: "Paradise on Earth",
    packageCount: 6,
    featured: true
  },
  {
    id: "state-2",
    name: "Goa",
    slug: "goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
    description: "Sun-kissed beaches, vibrant nightlife, Portuguese heritage, water sports, and tranquil river cruises.",
    regions: [
      { name: "North Goa", description: "Hub for nightlife, buzzing beaches, and water sports", highlights: ["Calangute Beach", "Baga Nightlife", "Fort Aguada"] },
      { name: "South Goa", description: "Pristine white sand beaches and luxury secluded resorts", highlights: ["Palolem Beach", "Colva", "Old Goa Churches"] },
      { name: "Beach Escape", description: "Relaxing wellness and beachside luxury retreats", highlights: ["Sunset Cruises", "Beach Shacks", "Spas"] },
      { name: "Dudhsagar", description: "Magnificent four-tiered waterfall inside Mollem National Park", highlights: ["Jeep Safari", "Waterfalls", "Spice Plantation"] }
    ],
    tag: "Beach Paradise",
    packageCount: 5,
    featured: true
  },
  {
    id: "state-3",
    name: "Kerala",
    slug: "kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
    description: "God's Own Country, boasting misty tea gardens, serene backwater houseboats, wildlife sanctuaries, and Ayurvedic wellness.",
    regions: [
      { name: "Munnar", description: "Expansive green tea gardens and rolling mist valleys", highlights: ["Tea Gardens", "Anamudi Peak", "Mattupetty Dam"] },
      { name: "Alleppey", description: "The Venice of the East with luxury backwater cruises", highlights: ["Houseboat Cruise", "Vembanad Lake", "Kuttanad"] },
      { name: "Thekkady", description: "Dense elephant reserves and spice plantation gardens", highlights: ["Periyar Boating", "Elephant Safari", "Spice Walk"] },
      { name: "Kochi", description: "Historic port city with Chinese fishing nets and Fort Kochi heritage", highlights: ["Chinese Fishing Nets", "Mattancherry Palace", "Jew Town"] },
      { name: "Wayanad", description: "Cascading waterfalls, caves, and scenic treehouse retreats", highlights: ["Edakkal Caves", "Banasura Sagar", "Chembra Peak"] }
    ],
    tag: "God's Own Country",
    packageCount: 6,
    featured: true
  },
  {
    id: "state-4",
    name: "Andaman",
    slug: "andaman",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=80",
    description: "Turquoise ocean waters, coral reefs, exotic marine life, and historic colonial monuments.",
    regions: [
      { name: "Port Blair", description: "Capital island rich in history and coral islands", highlights: ["Cellular Jail Light Show", "Corbyn's Cove", "Ross Island"] },
      { name: "Havelock Island", description: "Home to Radhanagar Beach, rated among Asia's best beaches", highlights: ["Scuba Diving", "Radhanagar Beach", "Elephant Beach"] },
      { name: "Neil Island", description: "Quiet tropical paradise with natural rock formations", highlights: ["Natural Bridge", "Bharatpur Beach", "Laxmanpur Beach"] }
    ],
    tag: "Island Sanctuary",
    packageCount: 4,
    featured: true
  },
  {
    id: "state-5",
    name: "Ladakh",
    slug: "ladakh",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80",
    description: "The Land of High Passes featuring high-altitude desert landscapes, ancient Buddhist monasteries, and crystal Pangong Lake.",
    regions: [
      { name: "Leh", description: "Historic Himalayan town surrounded by monasteries and royal palaces", highlights: ["Shanti Stupa", "Leh Palace", "Hall of Fame"] },
      { name: "Nubra Valley", description: "Cold desert with double-humped Bactrian camels and Khardung La Pass", highlights: ["Khardung La", "Diskit Monastery", "Hunder Sand Dunes"] }
    ],
    tag: "High Mountain Desert",
    packageCount: 4,
    featured: true
  },
  {
    id: "state-6",
    name: "Rajasthan",
    slug: "rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80",
    description: "Land of Maharajas, grand palaces, formidable forts, desert safaris, and rich folk culture.",
    regions: [
      { name: "Jaipur", description: "The Pink City famous for Hawa Mahal, Amer Fort, and markets", highlights: ["Amer Fort", "City Palace", "Chokhi Dhani"] },
      { name: "Jodhpur", description: "The Blue City overlooked by majestic Mehrangarh Fort", highlights: ["Mehrangarh Fort", "Jaswant Thada", "Umaid Bhawan"] },
      { name: "Jaisalmer", description: "The Golden City with desert camps and Sam Sand Dunes", highlights: ["Jaisalmer Fort", "Sam Sand Dunes", "Desert Camp"] },
      { name: "Udaipur", description: "The City of Lakes with romantic lake palaces and boat rides", highlights: ["Lake Pichola", "City Palace", "Jag Mandir"] }
    ],
    tag: "Land of Kings",
    packageCount: 7,
    featured: true
  },
  {
    id: "state-7",
    name: "Uttarakhand",
    slug: "uttarakhand",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1600&q=80",
    description: "Devbhoomi, filled with emerald lakes, lush hill stations, adventure sports, and Himalayan views.",
    regions: [
      { name: "Mussoorie", description: "The Queen of Hills overlooking the Doon Valley", highlights: ["Kempty Falls", "Mall Road", "Gun Hill"] },
      { name: "Nainital", description: "Picturesque lake city surrounded by seven hills", highlights: ["Naini Lake Boating", "Naina Devi Temple", "Snow View"] }
    ],
    tag: "Queen of Hills",
    packageCount: 4,
    featured: false
  },
  {
    id: "state-8",
    name: "Gujarat",
    slug: "gujarat",
    image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=1600&q=80",
    description: "Vibrant state offering the endless White Rann desert, Gir Asiatic lions, and rich handicrafts.",
    regions: [
      { name: "White Rann Experience", description: "Endless salt desert under moonlight and cultural heritage", highlights: ["Rann Utsav", "Sunset Point", "Kala Dungar"] },
      { name: "Best of Gujarat & Kutch", description: "Somnath, Dwarka, Gir Lion Safari, and Kutch villages", highlights: ["Gir Lion Safari", "Statue of Unity", "Dwarkadhish Temple"] }
    ],
    tag: "Vibrant Culture",
    packageCount: 3,
    featured: false
  },
  {
    id: "state-9",
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
    description: "Land of ancient Dravidian temples, Nilgiri hill stations, rich heritage, and coastal beauty.",
    regions: [
      { name: "Chennai", description: "Cultural capital with historic temples and Marina Beach", highlights: ["Kapaleeshwarar Temple", "Marina Beach", "Fort St George"] },
      { name: "Ooty", description: "Queen of Nilgiri Hill Stations with botanical gardens and toy train", highlights: ["Toy Train Ride", "Ooty Lake", "Doddabetta Peak"] },
      { name: "Kodaikanal", description: "Princess of Hill Stations with misty pine forests and Kodai Lake", highlights: ["Kodai Lake", "Coaker's Walk", "Pillar Rocks"] },
      { name: "Madurai", description: "Historic temple city famous for the grand Meenakshi Temple", highlights: ["Meenakshi Amman Temple", "Thirumalai Nayak Palace"] },
      { name: "Rameswaram", description: "Sacred island town with long corridor temples and Pamban Bridge", highlights: ["Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi"] }
    ],
    tag: "Temple & Hills",
    packageCount: 5,
    featured: false
  },
  {
    id: "state-10",
    name: "Himachal Pradesh",
    slug: "himachal-pradesh",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=1600&q=80",
    description: "Pine valleys, snow mountains, river rafting, and famous hill stations like Shimla, Manali, and Kasol.",
    regions: [
      { name: "Shimla", description: "Colonial summer capital with Mall Road and Ridge", highlights: ["Mall Road", "Kufri Fun World", "Jakhoo Temple"] },
      { name: "Manali", description: "High-altitude Himalayan resort town with Solang Valley and Rohtang Pass", highlights: ["Solang Valley", "Rohtang Pass", "Atal Tunnel"] },
      { name: "Dharamshala", description: "Residence of the Dalai Lama surrounded by cedar forests", highlights: ["McLeod Ganj", "Dalai Lama Temple", "Bhagsunag Waterfall"] },
      { name: "Dalhousie", description: "Colonial hill station boasting Khajjiar - Mini Switzerland of India", highlights: ["Khajjiar Meadow", "Dainkund Peak", "Panchpula"] },
      { name: "Kasol", description: "Hippie village along Parvati River famous for cafes and treks", highlights: ["Parvati River", "Manikaran Sahib", "Tosh Trek"] },
      { name: "Kullu", description: "Valley of Gods known for river rafting and handicraft shawls", highlights: ["Beas River Rafting", "Shawl Factories", "Great Himalayan Park"] },
      { name: "Spiti Valley", description: "Cold mountain desert valley with ancient Key Monastery", highlights: ["Key Monastery", "Chandratal Lake", "Kibber Village"] }
    ],
    tag: "Himalayan Land",
    packageCount: 6,
    featured: true
  },
  {
    id: "state-11",
    name: "Meghalaya",
    slug: "meghalaya",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    description: "Abode of Clouds featuring living root bridges, crystal clear Umngot River in Dawki, and majestic waterfalls.",
    regions: [
      { name: "Shillong", description: "Scotland of the East with pine hills and vibrant music scene", highlights: ["Umiam Lake", "Shillong Peak", "Elephant Falls"] },
      { name: "Cherrapunji", description: "Wettest place on earth with Nohkalikai and Seven Sisters Falls", highlights: ["Nohkalikai Falls", "Mawsmai Cave", "Seven Sisters Falls"] },
      { name: "Dawki", description: "Border town famous for transparent glass-like river boating", highlights: ["Umngot Crystal River", "Tamabil Border", "Jaisagar"] },
      { name: "Mawlynnong", description: "Cleanest village in Asia with living root bridges", highlights: ["Cleanest Village Walk", "Single Living Root Bridge", "Sky Viewpoint"] },
      { name: "Nongriat", description: "Deep valley home to the famous Double Decker Living Root Bridge", highlights: ["Double Decker Bridge", "Rainbow Falls", "Trek"] }
    ],
    tag: "Abode of Clouds",
    packageCount: 5,
    featured: true
  },
  {
    id: "state-12",
    name: "North East India",
    slug: "north-east-india",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80",
    description: "Enchanting Seven Sisters region featuring Sikkim monasteries, Kaziranga rhinos, and Tawang valley.",
    regions: [
      { name: "Gangtok", description: "Sikkim's capital with views of Mount Kanchenjunga and MG Marg", highlights: ["Tsomgo Lake", "Baba Mandir", "Nathula Pass"] },
      { name: "Pelling", description: "Scenic Sikkim town with Skywalk and Pemayangtse Monastery", highlights: ["Pelling Skywalk", "Rabdentse Ruins", "Kanchenjunga Falls"] },
      { name: "Lachung", description: "Gateway to Yumthang Valley of Flowers and Zero Point", highlights: ["Yumthang Valley", "Zero Point", "Lachung Monastery"] },
      { name: "Tawang", description: "High altitude Arunachal town with India's largest Buddhist monastery", highlights: ["Tawang Monastery", "Sela Pass", "Madhuri Lake"] },
      { name: "Kaziranga", description: "UNESCO National Park home to world's highest one-horned rhino population", highlights: ["Elephant Safari", "Jeep Safari", "Orchid Park"] }
    ],
    tag: "Seven Sisters Magic",
    packageCount: 5,
    featured: true
  }
];

export const initialInternationalCountries: CountryDestination[] = [
  {
    id: "country-1",
    name: "Japan",
    slug: "japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    description: "Harmonious blend of ultra-modern technology, ancient Shinto shrines, Mount Fuji views, and gourmet cuisine.",
    regions: [
      { name: "Tokyo", description: "Vibrant metropolis with futuristic skyscrapers and historic temples", highlights: ["Shibuya Crossing", "Senso-ji Temple", "Skytree"] },
      { name: "Kyoto", description: "Japan's cultural heart with thousands of classical Buddhist temples", highlights: ["Fushimi Inari", "Arashiyama Bamboo Grove", "Gion"] },
      { name: "Osaka", description: "Famous for street food, Osaka Castle, and nightlife", highlights: ["Dotonbori", "Osaka Castle", "Universal Studios"] },
      { name: "Mount Fuji", description: "Iconic snow-capped volcanic peak and surrounding lakes", highlights: ["Lake Kawaguchiko", "5th Station", "Chureito Pagoda"] }
    ],
    tag: "Land of Rising Sun",
    packageCount: 5,
    featured: true
  },
  {
    id: "country-2",
    name: "Thailand",
    slug: "thailand",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1600&q=80",
    description: "The Land of Smiles offering ornate temples, vibrant night markets, tropical islands, and world-class Thai spas.",
    regions: [
      { name: "Bangkok", description: "Capital city filled with golden shrines and floating markets", highlights: ["Grand Palace", "Wat Arun", "Floating Market"] },
      { name: "Phuket", description: "Thailand's largest island with luxury beach resorts", highlights: ["Phi Phi Islands", "Patong Nightlife", "Big Buddha"] },
      { name: "Krabi", description: "Dramatic limestone cliffs, emerald lagoons, and clear waters", highlights: ["Railay Beach", "Four Islands Tour", "Emerald Pool"] },
      { name: "Pattaya", description: "Lively coastal resort city known for water sports and shows", highlights: ["Coral Island", "Sanctuary of Truth", "Walking Street"] }
    ],
    tag: "Land of Smiles",
    packageCount: 6,
    featured: true
  },
  {
    id: "country-3",
    name: "Singapore",
    slug: "singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80",
    description: "Futuristic garden city state with iconic Marina Bay skyline, Sentosa island attractions, and multicultural dining.",
    regions: [
      { name: "Sentosa", description: "Island resort playground with beaches and entertainment", highlights: ["Cable Car", "S.E.A. Aquarium", "Siloso Beach"] },
      { name: "Marina Bay", description: "Architectural wonder featuring Gardens by the Bay and Sands", highlights: ["Gardens by the Bay", "Supertree Grove", "Skypark"] },
      { name: "Universal Studios", description: "World-class movie theme park with thrilling rides", highlights: ["Battlestar Galactica", "Transformers Ride", "Far Far Away"] }
    ],
    tag: "Garden City",
    packageCount: 4,
    featured: true
  },
  {
    id: "country-4",
    name: "Malaysia",
    slug: "malaysia",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
    description: "Diverse nation featuring iconic Petronas Twin Towers, rainforest island escapes, and cool mountain resorts.",
    regions: [
      { name: "Kuala Lumpur", description: "Modern capital dominated by Petronas Towers and Batu Caves", highlights: ["Petronas Twin Towers", "Batu Caves", "Bukit Bintang"] },
      { name: "Langkawi", description: "Tropical island archipelago with sky cabs and mangroves", highlights: ["SkyBridge Cable Car", "Kilim Mangrove Tour", "Cenang Beach"] },
      { name: "Genting Highlands", description: "Cool mountain hill resort with indoor and outdoor theme parks", highlights: ["SkyWorlds Theme Park", "Awana SkyWay", "Casino"] }
    ],
    tag: "Truly Asia",
    packageCount: 5,
    featured: true
  },
  {
    id: "country-5",
    name: "Dubai",
    slug: "dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    description: "City of superlatives with the world's tallest building, desert safari adventures, and ultra-luxury shopping.",
    regions: [
      { name: "Downtown Dubai", description: "Home to Burj Khalifa, Dubai Mall, and Dubai Fountain", highlights: ["Burj Khalifa 124th Floor", "Dubai Mall Fountain", "Museum of Future"] },
      { name: "Desert Safari", description: "Thrilling dune bashing, camel rides, and Bedouin BBQ dinner", highlights: ["4x4 Dune Bashing", "Quad Biking", "Belly Dance & Dinner"] },
      { name: "Abu Dhabi", description: "Capital of UAE featuring Sheikh Zayed Grand Mosque and Ferrari World", highlights: ["Grand Mosque", "Ferrari World", "Louvre Abu Dhabi"] }
    ],
    tag: "Luxury Metropolis",
    packageCount: 6,
    featured: true
  },
  {
    id: "country-6",
    name: "Nepal",
    slug: "nepal",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    description: "Himalayan kingdom offering Mount Everest views, ancient heritage squares, and wildlife safaris.",
    regions: [
      { name: "Kathmandu", description: "Valley of ancient stupas, temples, and UNESCO heritage squares", highlights: ["Pashupatinath", "Swayambhunath", "Durbar Square"] },
      { name: "Pokhara", description: "Serene lake city nestled at the base of the Annapurna range", highlights: ["Phew Lake Boating", "Sarangkot Sunrise", "Davis Falls"] },
      { name: "Chitwan", description: "Jungle sanctuary for one-horned rhinos and Bengal tigers", highlights: ["Jungle Safari", "Canoe Ride", "Tharu Cultural Dance"] }
    ],
    tag: "Himalayan Kingdom",
    packageCount: 4,
    featured: false
  },
  {
    id: "country-7",
    name: "Bali",
    slug: "bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    description: "Indonesian island sanctuary of emerald rice terraces, cliffside temples, and beach club sunsets.",
    regions: [
      { name: "Ubud", description: "Cultural heart surrounded by rainforests and rice terraces", highlights: ["Tegallalang Rice Terrace", "Monkey Forest", "Bali Swing"] },
      { name: "Kuta", description: "Lively beach district famous for surfing and vibrant markets", highlights: ["Kuta Beach", "Waterbom Bali", "Sunset Shacks"] },
      { name: "Nusa Penida", description: "Exotic island with dramatic T-Rex shaped Kelingking cliff", highlights: ["Kelingking Beach", "Broken Beach", "Angel's Billabong"] }
    ],
    tag: "Island of Gods",
    packageCount: 5,
    featured: true
  },
  {
    id: "country-8",
    name: "Maldives",
    slug: "maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80",
    description: "Ultimate luxury paradise with overwater private villas, crystal lagoons, and vibrant coral reefs.",
    regions: [
      { name: "Male", description: "Capital island gateway with colorful houses and Islamic center", highlights: ["Grand Friday Mosque", "Fish Market"] },
      { name: "Ari Atoll", description: "Renowned for luxury resorts, whale shark diving, and water villas", highlights: ["Overwater Bungalows", "Whale Shark Diving", "Sunset Cruise"] },
      { name: "Maafushi", description: "Popular local island for budget-friendly beach excursions", highlights: ["Snorkeling Safari", "Sandbank Picnic", "Dolphin Cruise"] }
    ],
    tag: "Overwater Paradise",
    packageCount: 4,
    featured: true
  },
  {
    id: "country-9",
    name: "Vietnam",
    slug: "vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
    description: "Land of emerald Ha Long Bay limestone karsts, lantern-lit Hoi An streets, and rich street food.",
    regions: [
      { name: "Hanoi", description: "Capital with French colonial architecture and ancient streets", highlights: ["Old Quarter", "Hoan Kiem Lake", "Train Street"] },
      { name: "Ha Long Bay", description: "UNESCO natural wonder featuring thousands of karst islands", highlights: ["Luxury Cruise", "Kayaking", "Sung Sot Cave"] },
      { name: "Da Nang", description: "Coastal city home to the famous Golden Hands Bridge", highlights: ["Golden Bridge", "Bana Hills", "Marble Mountains"] }
    ],
    tag: "Emerald Wonders",
    packageCount: 4,
    featured: false
  },
  {
    id: "country-10",
    name: "Sri Lanka",
    slug: "sri-lanka",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80",
    description: "Pearl of the Indian Ocean with ancient rock fortresses, misty tea plantations, and wild elephant herds.",
    regions: [
      { name: "Colombo", description: "Vibrant coastal commercial hub", highlights: ["Lotus Tower", "Gangaramaya Temple"] },
      { name: "Kandy", description: "Sacred hill capital home to the Temple of the Tooth", highlights: ["Temple of Tooth", "Botanical Gardens", "Cultural Show"] },
      { name: "Nuwara Eliya", description: "Little England filled with rolling tea plantations and waterfalls", highlights: ["Tea Factory Tour", "Gregory Lake", "Train Ride"] }
    ],
    tag: "Pearl of Ocean",
    packageCount: 4,
    featured: false
  },
  {
    id: "country-11",
    name: "Turkey",
    slug: "turkey",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
    description: "Transcontinental bridge between East and West, featuring hot air balloons in Cappadocia and Hagia Sophia.",
    regions: [
      { name: "Istanbul", description: "Historical city straddling Europe and Asia across the Bosphorus", highlights: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar"] },
      { name: "Cappadocia", description: "Fairy-tale landscape famous for hot air balloon rides and cave hotels", highlights: ["Hot Air Balloon", "Goreme Open Air", "Underground City"] },
      { name: "Antalya", description: "Mediterranean resort city with turquoise beaches and ancient ruins", highlights: ["Old Town Kaleici", "Duden Waterfalls", "Hadrian's Gate"] }
    ],
    tag: "East Meets West",
    packageCount: 5,
    featured: false
  }
];

export const initialPackages: PackageItem[] = [
  ...domesticPackagesData,
  ...internationalPackagesData
];

export const initialGallery: GalleryItem[] = [
  { id: "g1", title: "Dal Lake Shikara", category: "Domestic", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80", location: "Srinagar, Kashmir" },
  { id: "g2", title: "Mount Fuji & Pagoda", category: "International", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", location: "Japan" },
  { id: "g3", title: "Sam Sand Dunes Camel Ride", category: "Culture", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80", location: "Jaisalmer, Rajasthan" },
  { id: "g4", title: "Kelingking T-Rex Beach", category: "Beach", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", location: "Nusa Penida, Bali" },
  { id: "g5", title: "Alleppey Luxury Houseboat", category: "Nature", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", location: "Alleppey, Kerala" },
  { id: "g6", title: "Burj Khalifa Night Lights", category: "International", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", location: "Dubai, UAE" },
  { id: "g7", title: "Pangong Tso Crystal Waters", category: "Adventure", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80", location: "Ladakh" },
  { id: "g8", title: "Dudhsagar Waterfalls", category: "Nature", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80", location: "Goa" },
  { id: "g9", title: "Gardens by the Bay", category: "International", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80", location: "Singapore" }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "10 Reasons Why Kashmir Should Be Your Next Luxury Escape in 2026",
    slug: "10-reasons-why-kashmir-luxury-escape",
    category: "Domestic Travel",
    author: "SkyNet Travel Expert",
    authorRole: "Head Itinerary Architect",
    date: "July 10, 2026",
    readTime: "5 min read",
    excerpt: "From sleeping aboard handcrafted houseboats on Dal Lake to riding the world's highest Gondola in Gulmarg, Kashmir is re-defining Indian luxury tourism.",
    content: `
Kashmir, fondly referred to as the 'Paradise on Earth', has long captivated poets, emperors, and wanderers. In recent years, it has transformed into one of India's premier high-end luxury destinations.

### 1. Royal Houseboats on Dal Lake
Forget ordinary hotel stays. SkyNet Holidays partners with century-old cedarwood heritage houseboats featuring intricate walnut carvings, crystal chandeliers, and private butler service right on the placid waters of Dal Lake.

### 2. World-Class Gulmarg Gondola
Reaching 13,780 feet above sea level, Phase 2 of the Gulmarg Gondola transports you into a white wonderland reminiscent of the Swiss Alps. Whether you want to ski or enjoy hot Kahwa overlooking snow peaks, it's an experience unmatched in Asia.

### 3. Pine Valleys of Pahalgam
Walk along the crystal-clear Lidder River, ride ponies through Betaab Valley where legendary Bollywood movies were filmed, and stay in secluded boutique pine log cabins.

When booking with SkyNet Holidays, every transfer is executed in luxury SUVs with dedicated chauffeurs who know every secret photo spot in the valley.
    `,
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "b2",
    title: "How to Plan a 7-Day Royal Rajasthan Tour: Forts, Palaces & Sand Dunes",
    slug: "plan-7-day-royal-rajasthan-tour",
    category: "Heritage & Culture",
    author: "Rohan Rathore",
    authorRole: "Senior Cultural Specialist",
    date: "June 28, 2026",
    readTime: "7 min read",
    excerpt: "Discover the ultimate Golden Triangle & Thar desert circuit. Experience heritage stays in Jaipur, Mehrangarh fort, and starry nights in Jaisalmer.",
    content: `
Rajasthan is a land where every fort tells a tale of valor, romance, and artistic grandiosity. Here is how SkyNet Holidays recommends spending a perfect 7-day week in Rajasthan:

### Day 1-2: Jaipur - The Pink City
Start in Jaipur with Amer Fort, City Palace, and Jantar Mantar. Dine at Chokhi Dhani for authentic Dal Baati Churma and folk performances.

### Day 3: Jodhpur - The Blue City
Marvel at the sheer cliffside Mehrangarh Fort towering above blue-painted alleyways.

### Day 4: Jaisalmer Desert Magic
Head deep into the Thar Desert at Sam Sand Dunes. Enjoy 4x4 dune bashing, camel rides, and night fireside Kalbeliya dances under open stars.

### Day 5-7: Udaipur - Venice of the East
Finish your trip floating on Lake Pichola with views of the illuminated Lake Palace and City Palace.
    `,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "b3",
    title: "Japan Golden Route: A First-Timer's Ultimate Travel Guide",
    slug: "japan-golden-route-first-timers-guide",
    category: "International Travel",
    author: "Elena Tanaka",
    authorRole: "Asia Operations Director",
    date: "June 15, 2026",
    readTime: "8 min read",
    excerpt: "Planning your dream trip to Japan? Learn how to navigate Shinkansen bullet trains, Mt Fuji viewing spots, Kyoto shrines, and Osaka food markets seamlessly.",
    content: `
Japan seamlessly weaves ancient traditions with mind-boggling modern technology. For first-time visitors, the "Golden Route" (Tokyo - Mt Fuji - Kyoto - Osaka) offers the quintessential Japanese experience.

### Key Highlights You Must Not Miss:
1. **Tokyo Skytree & Shibuya Crossing**: Marvel at the world's busiest pedestrian intersection.
2. **Mount Fuji & Lake Kawaguchiko**: Capture the iconic view of Mt Fuji reflected over peaceful lake waters.
3. **Fushimi Inari Torii Gates**: Walk through thousands of vermilion shrine gates in Kyoto.
4. **Osaka Street Food in Dotonbori**: Sample piping hot Takoyaki (octopus balls) and Okonomiyaki savory pancakes.

SkyNet Holidays takes care of all JR Bullet train reservations, private luggage transfers, and visa documentation.
    `,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    featured: false
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sunil & Neha Bansal",
    location: "Jaipur, Rajasthan",
    rating: 5,
    comment: "SkyNet Holidays curated our anniversary trip to Kashmir. The houseboat stay on Dal Lake was magical and our driver was like family. Truly luxury experience!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    packageName: "Magical Kashmir Valley"
  },
  {
    id: "t2",
    name: "Dr. Ananya Roy",
    location: "Kolkata, WB",
    rating: 5,
    comment: "Our family tour to Japan was planned to perfection. Every hotel, bullet train pass, and private guide was spot on. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    packageName: "Classic Japan Golden Route"
  },
  {
    id: "t3",
    name: "Amitabh & Rashmi Singh",
    location: "Delhi NCR",
    rating: 5,
    comment: "From Rajasthan desert camps to Bali pool villas, we always trust SkyNet Holidays. Their 24/7 WhatsApp assistance during travel gives absolute peace of mind.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    packageName: "Tropical Bali Luxury Villa"
  }
];

export const initialSpecialOffers: SpecialOffer[] = [
  {
    id: "offer-1",
    title: "Early Bird Monsoon & Autumn Discount",
    subtitle: "Get flat ₹5,000 OFF per couple on all Kashmir & Kerala packages",
    code: "SKYNETMONSOON",
    discountText: "Flat ₹5,000 OFF",
    validTill: "31st August 2026",
    bgImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-2",
    title: "International Honeymoon Special",
    subtitle: "Free Pool Villa Upgrade in Bali or Free Dhow Cruise in Dubai",
    code: "SKYNETHONEYMOON",
    discountText: "Free Luxury Upgrade",
    validTill: "30th September 2026",
    bgImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
  }
];

export const initialBookings: BookingRequest[] = [
  {
    id: "BK-1001",
    packageId: "pkg-kashmir-1",
    packageTitle: "Magical Kashmir Valley & Houseboat Luxury",
    customerName: "Rakesh Sharma",
    customerEmail: "rakesh.sharma@example.com",
    customerPhone: "+91 98765 43210",
    travelDate: "2026-08-15",
    guestCount: 2,
    specialRequests: "Honeymoon setup on Dal Lake houseboat requested.",
    status: "Confirmed",
    createdAt: "2026-07-20"
  },
  {
    id: "BK-1002",
    packageId: "pkg-bali-1",
    packageTitle: "Tropical Bali Luxury Villa & Nusa Penida Island",
    customerName: "Pooja Malhotra",
    customerEmail: "pooja.m@example.com",
    customerPhone: "+91 98111 22334",
    travelDate: "2026-09-10",
    guestCount: 4,
    specialRequests: "Need vegetarian meals during Nusa Penida tour.",
    status: "Pending",
    createdAt: "2026-07-21"
  }
];

export const initialInquiries: CustomerInquiry[] = [
  {
    id: "INQ-501",
    customerName: "Deepak Verma",
    customerEmail: "deepak.verma@example.com",
    customerPhone: "+91 99887 76655",
    destination: "Japan",
    preferredDate: "2026-10-01",
    duration: "8 Days",
    budget: "Luxury (₹1.5L+ per head)",
    message: "Interested in Japan Cherry Blossom / Autumn foliage tour for family of 3.",
    status: "New",
    createdAt: "2026-07-22"
  }
];

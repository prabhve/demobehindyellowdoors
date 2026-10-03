export type CuisineCategory = 
  | 'all'
  | 'starters'
  | 'pizza_pasta'
  | 'global_mains'
  | 'asian_dimsum'
  | 'texmex'
  | 'beverages'
  | 'desserts';

export type DietaryType = 'veg' | 'non-veg' | 'jain-available';

export interface MenuItem {
  id: string;
  name: string;
  category: CuisineCategory;
  price: number;
  dietary: DietaryType;
  isChefsSpecial?: boolean;
  isPopular?: boolean;
  description: string;
  ingredients?: string[];
  spiceLevel?: 0 | 1 | 2 | 3;
  branchAvailability?: ('sigra' | 'bhojuveer' | string)[];
  image: string;
}

export interface BranchInfo {
  id: 'sigra' | 'bhojuveer' | string;
  name: string;
  tagline: string;
  address: string;
  landmark: string;
  phone: string;
  altPhone: string;
  email: string;
  timings: string;
  googleMapsUrl: string;
  seatingCapacity: number;
  features: string[];
}

export interface Reservation {
  id: string;
  branch: 'sigra' | 'bhojuveer' | string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingArea: 'indoor_booth' | 'yellow_door_terrace' | 'family_lounge' | string;
  specialOccasion?: string;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  date: string;
  branch: 'sigra' | 'bhojuveer' | string;
  comment: string;
  likedDishes?: string[];
  status: 'published' | 'pending_moderation' | 'rejected';
  verifiedDiner: boolean;
  helpfulCount: number;
  avatarLetter: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'food' | 'ambiance' | 'moments';
  caption: string;
  location: string;
  imageUrl: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  instructions?: string;
}

export interface KitchenOrder {
  id: string;
  orderType: 'dine_in' | 'takeaway';
  tableNumber?: string;
  customerName?: string;
  customerPhone: string;
  cookingNotes?: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'received' | 'preparing' | 'served' | 'completed' | 'cancelled';
  createdAt: string;
  branch?: string;
  serverName?: string;
  guestCount?: number;
  paymentMethod?: 'cash' | 'upi' | 'card' | 'pay_later' | string;
  paymentStatus?: 'paid' | 'unpaid' | 'pending';
  discount?: number;
  discountReason?: string;
}

export type Order = KitchenOrder;

export interface DinerVideo {
  id: string;
  title: string;
  description: string;
  category: 'culinary' | 'ambiance' | 'stories';
  videoUrl: string; // Direct mp4/webm or YouTube/Vimeo embed
  thumbnailUrl: string;
  duration?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'reservations' | 'food' | 'locations' | 'events';
}

export interface SiteContent {
  announcement: {
    enabled: boolean;
    badge: string;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  hero: {
    kicker: string;
    headlinePart1: string;
    headlineHighlight: string;
    subtitle: string;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    atmosphereTitle?: string;
    atmosphereSubtitle?: string;
    badgeTitle: string;
    badgeSubtitle: string;
    ratingScore: string;
    reviewCountText: string;
    todayHoursText: string;
  };
  story: {
    kicker: string;
    headline: string;
    paragraph: string;
    cardTitle?: string;
    cardSubtitle?: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    quoteText: string;
    quoteAuthor: string;
    badgeNumber: string;
    badgeLabel: string;
    mediaUrl: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    email: string;
    phone?: string;
    brandBio?: string;
    copyrightText: string;
  };
  faqs: FaqItem[];
  videos: DinerVideo[];
}



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
  branchAvailability?: ('sigra' | 'bhojuveer')[];
  image: string;
}

export interface BranchInfo {
  id: 'sigra' | 'bhojuveer';
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
  branch: 'sigra' | 'bhojuveer';
  fullName: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingArea: 'indoor_booth' | 'yellow_door_terrace' | 'family_lounge';
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
  branch: 'sigra' | 'bhojuveer';
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
}


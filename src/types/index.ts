export type UserRole = 'student' | 'visitor' | 'club_admin' | 'stall_admin' | 'scanner' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNo?: string;
  phone?: string;
  college?: string;
  clubId?: string; // If club_admin
  stallId?: string; // If stall_admin
  qrToken?: string;
  festPassPaid?: boolean;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: string;
  festPassPaid: boolean;
  qrToken: string;
}

export interface Visitor {
  id: string;
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  passTier: 'day1' | 'day2' | 'both';
  accommodation: boolean;
  totalPaid: number;
  paymentStatus: 'PAID' | 'PENDING';
  qrToken: string;
  registeredAt: string;
}

export interface Club {
  id: string;
  name: string;
  shortCode: string;
  category: 'Tech' | 'Cultural' | 'Arts' | 'Media' | 'Design' | 'Gaming' | 'Social' | 'Lifestyle' | 'Literary';
  tagline: string;
  description: string;
  logo: string;
  leadName: string;
  leadContact: string;
  bannerImage: string;
  totalEvents: number;
}

export interface CampusVenue {
  id: string;
  name: string;
  code: string;
  category: 'Mega Nights' | 'Tech & Innovation' | 'Cultural & Arts' | 'Food & Marketplace' | 'Sports & Arena';
  description: string;
  coords: { x: number; y: number }; // percentage on campus schematic
  capacity: string;
  hostedEvents: string[];
  image: string;
}

export interface FestEvent {
  id: string;
  title: string;
  tagline: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  image: string;
  badge: string;
  accessRule: 'All Fest Pass Holders' | 'Special Access / Pass' | 'External Registration';
  isExternal?: boolean;
  externalUrl?: string;
}

export interface ClubEvent {
  id: string;
  clubId: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  fee: number;
  prizePool: string;
  maxCapacity: number;
  registeredCount: number;
  rules: string[];
  coordinatorName: string;
  coordinatorPhone: string;
  image: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  clubId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rollNo?: string;
  amount: number;
  paymentStatus: 'PAID' | 'CONFIRMED' | 'PENDING';
  qrToken: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  registeredAt: string;
}

export interface EventAttendance {
  id: string;
  eventId: string;
  eventTitle: string;
  qrToken: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  scannerId: string;
  scannerName: string;
  scannedAt: string;
}

export interface Stall {
  id: string;
  name: string;
  category: 'Food' | 'Beverages' | 'Merchandise' | 'Desserts';
  tagline: string;
  stallNumber: string;
  location: string;
  image: string;
  rating: number;
  isOpen: boolean;
}

export interface Product {
  id: string;
  stallId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  stallId: string;
  stallName: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface StallOrder {
  id: string;
  stallId: string;
  stallName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING';
  redemptionToken: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  createdAt: string;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  token: string;
  eventId: string;
  eventTitle: string;
  scannerName: string;
  scannerRole: string;
  status: 'APPROVED' | 'REJECTED';
  reasonCode: 'SUCCESS' | 'ALREADY_REDEEMED' | 'INVALID_TOKEN' | 'UNAUTHORIZED_EVENT' | 'UNKNOWN';
  message: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  details: string;
  ipAddress?: string;
}

export interface ScanValidationResult {
  status: 'APPROVED' | 'REJECTED';
  reasonCode: 'SUCCESS' | 'ALREADY_REDEEMED' | 'INVALID_TOKEN' | 'UNAUTHORIZED_EVENT' | 'UNKNOWN';
  message: string;
  eventTitle: string;
  holderName?: string;
  holderRole?: string;
  token?: string;
  timestamp: string;
  previousScannedAt?: string;
}

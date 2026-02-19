
export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  SOCIAL = 'SOCIAL',
  MESSENGER = 'MESSENGER',
  MARKETPLACE = 'MARKETPLACE',
  JOBS = 'JOBS',
  RENTALS = 'RENTALS',
  PROFILE = 'PROFILE',
  POINTS = 'POINTS',
  OWNER_DASHBOARD = 'OWNER_DASHBOARD',
  SHOP_DASHBOARD = 'SHOP_DASHBOARD',
  JOBS_DASHBOARD = 'JOBS_DASHBOARD'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  handle: string;
}

export interface SocialComment {
  id: string;
  text: string;
  senderName: string;
  timestamp: number;
  replies: SocialComment[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  video?: string;
  link?: string;
  linkThumbnail?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isAd?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  location?: string;
  image: string;
  images?: string[];
  rating: number;
  soldCount: number;
  category: string;
  link?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  logo: string;
  type: string;
  description?: string;
  image?: string;
  isPromoted?: boolean;
}

export interface Rental {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  location: string;
  type: string;
  description?: string;
  confirmedSchedules?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type?: 'booking_request' | 'general';
  bookingData?: {
    rentalId: string;
    dateTime: string;
    endDateTime: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

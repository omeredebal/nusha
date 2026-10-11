// ====== Core Domain Types ======

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  condition: BookCondition;
  category: BookCategory;
  seller: string;
  city: string;
  timeAgo: number; // minutes
  note: string;
  likes: number;
  comments: Comment[];
  verified: boolean;
}

export type BookCondition = 'Yeni gibi' | 'Çok iyi' | 'İyi' | 'Yıpranmış';

export type BookCategory =
  | 'Roman'
  | 'Felsefe'
  | 'Çocuk'
  | 'Distopya'
  | 'Macera'
  | 'Şiir'
  | 'Tarih'
  | 'Bilim';

export interface Comment {
  user: string;
  text: string;
}

export interface ChatThread {
  id: number;
  user: string;
  bookId: number;
  unread: boolean;
  messages: ChatMessage[];
}

export interface ChatMessage {
  from: 'me' | 'them';
  text?: string;
  offer?: Offer;
  time: string;
}

export interface Offer {
  value: number;
  status: 'wait' | 'acc' | 'rej' | 'old' | 'cnt';
}

export interface Notification {
  type: 'like' | 'offer' | 'follow' | 'msg';
  text: string;
  time: string;
  read: boolean;
  bookId?: number;
}

export interface ShelfItem {
  id: number;
  title: string;
  author: string;
}

export interface DraftListing {
  title: string;
  author: string;
  price: string;
  note: string;
  condition: BookCondition;
  category: BookCategory;
}

export type TabName = 'index' | 'explore' | 'add' | 'messages' | 'profile';

export type ProfileTab = 'listings' | 'saved' | 'shelf';

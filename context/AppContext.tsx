import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Book, ChatThread, Notification, DraftListing, ShelfItem } from '../types';
import { BOOKS, INITIAL_THREADS, INITIAL_NOTIFICATIONS, INITIAL_SHELVES, AUTO_REPLIES } from '../constants/Data';

// ====== State Shape ======

interface AppState {
  books: Book[];
  myListings: Book[];
  likes: Set<number>;
  saved: Set<number>;
  following: Set<string>;
  blocked: Set<string>;
  threads: ChatThread[];
  notifications: Notification[];
  shelves: Record<string, ShelfItem[]>;
  draft: DraftListing;
  nextId: number;
  onboarded: boolean;
}

// ====== Actions ======

type Action =
  | { type: 'TOGGLE_LIKE'; bookId: number }
  | { type: 'TOGGLE_SAVE'; bookId: number }
  | { type: 'TOGGLE_FOLLOW'; user: string }
  | { type: 'BLOCK_USER'; user: string }
  | { type: 'ADD_COMMENT'; bookId: number; user: string; text: string }
  | { type: 'UPDATE_DRAFT'; field: keyof DraftListing; value: string }
  | { type: 'PUBLISH_LISTING' }
  | { type: 'SEND_MESSAGE'; threadId: number; text: string }
  | { type: 'RECEIVE_MESSAGE'; threadId: number; text: string }
  | { type: 'SEND_OFFER'; bookId: number; amount: number }
  | { type: 'RESPOND_OFFER'; threadId: number; messageIndex: number; accept: boolean }
  | { type: 'OFFER_REPLY'; threadId: number; messageIndex: number }
  | { type: 'MARK_THREAD_READ'; threadId: number }
  | { type: 'MARK_ALL_NOTIFS_READ' }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'SET_ONBOARDED' }
  | { type: 'START_CHAT'; bookId: number };

// ====== Initial State ======

const initialState: AppState = {
  books: [...BOOKS],
  myListings: [],
  likes: new Set<number>(),
  saved: new Set<number>(),
  following: new Set<string>(['Elif', 'Zeynep']),
  blocked: new Set<string>(),
  threads: [...INITIAL_THREADS.map(t => ({ ...t, messages: [...t.messages] }))],
  notifications: [...INITIAL_NOTIFICATIONS],
  shelves: { ...INITIAL_SHELVES },
  draft: { title: '', author: '', price: '', note: '', condition: 'İyi', category: 'Roman' },
  nextId: 20,
  onboarded: false,
};

// ====== Reducer ======

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_LIKE': {
      const newLikes = new Set(state.likes);
      if (newLikes.has(action.bookId)) newLikes.delete(action.bookId);
      else newLikes.add(action.bookId);
      return { ...state, likes: newLikes };
    }

    case 'TOGGLE_SAVE': {
      const newSaved = new Set(state.saved);
      if (newSaved.has(action.bookId)) newSaved.delete(action.bookId);
      else newSaved.add(action.bookId);
      return { ...state, saved: newSaved };
    }

    case 'TOGGLE_FOLLOW': {
      const newFollowing = new Set(state.following);
      if (newFollowing.has(action.user)) newFollowing.delete(action.user);
      else newFollowing.add(action.user);
      return { ...state, following: newFollowing };
    }

    case 'BLOCK_USER': {
      const newBlocked = new Set(state.blocked);
      newBlocked.add(action.user);
      return { ...state, blocked: newBlocked };
    }

    case 'ADD_COMMENT': {
      const books = state.books.map(b =>
        b.id === action.bookId
          ? { ...b, comments: [...b.comments, { user: action.user, text: action.text }] }
          : b
      );
      return { ...state, books };
    }

    case 'UPDATE_DRAFT': {
      return { ...state, draft: { ...state.draft, [action.field]: action.value } };
    }

    case 'PUBLISH_LISTING': {
      const { draft, nextId } = state;
      if (!draft.title.trim() || !draft.price || Number(draft.price) <= 0) return state;
      const newBook: Book = {
        id: nextId,
        title: draft.title.trim(),
        author: draft.author.trim() || 'Bilinmeyen yazar',
        price: Math.round(Number(draft.price)),
        condition: draft.condition,
        category: draft.category,
        seller: 'Sen',
        city: 'Bursa',
        timeAgo: 0,
        note: draft.note.trim() || 'Okudum, yeni sahibini arıyor.',
        likes: 0,
        comments: [],
        verified: false,
      };
      return {
        ...state,
        books: [newBook, ...state.books],
        myListings: [newBook, ...state.myListings],
        draft: { title: '', author: '', price: '', note: '', condition: 'İyi', category: 'Roman' },
        nextId: nextId + 1,
      };
    }

    case 'SEND_MESSAGE': {
      const threads = state.threads.map(t =>
        t.id === action.threadId
          ? { ...t, messages: [...t.messages, { from: 'me' as const, text: action.text, time: 'şimdi' }] }
          : t
      );
      return { ...state, threads };
    }

    case 'RECEIVE_MESSAGE': {
      const threads = state.threads.map(t =>
        t.id === action.threadId
          ? {
              ...t,
              unread: true,
              messages: [...t.messages, { from: 'them' as const, text: action.text, time: 'şimdi' }],
            }
          : t
      );
      return { ...state, threads };
    }

    case 'SEND_OFFER': {
      let thread = state.threads.find(t => t.bookId === action.bookId);
      let threads: ChatThread[];

      if (thread) {
        threads = state.threads.map(t =>
          t.bookId === action.bookId
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  { from: 'me' as const, offer: { value: action.amount, status: 'wait' as const }, time: 'şimdi' },
                ],
              }
            : t
        );
      } else {
        const book = state.books.find(b => b.id === action.bookId);
        if (!book) return state;
        const newThread: ChatThread = {
          id: state.nextId,
          user: book.seller,
          bookId: action.bookId,
          unread: false,
          messages: [
            { from: 'me', offer: { value: action.amount, status: 'wait' }, time: 'şimdi' },
          ],
        };
        threads = [newThread, ...state.threads];
        return { ...state, threads, nextId: state.nextId + 1 };
      }
      return { ...state, threads };
    }

    case 'OFFER_REPLY': {
      const threads = state.threads.map(t => {
        if (t.id !== action.threadId) return t;
        const messages = [...t.messages];
        const msg = messages[action.messageIndex];
        if (!msg?.offer) return t;

        const book = state.books.find(b => b.id === t.bookId);
        if (!book) return t;

        if (msg.offer.value >= book.price * 0.82) {
          messages[action.messageIndex] = { ...msg, offer: { ...msg.offer, status: 'acc' } };
          messages.push({ from: 'them', text: 'Anlaştık, teşekkürler! 🎉', time: 'şimdi' });
        } else {
          messages[action.messageIndex] = { ...msg, offer: { ...msg.offer, status: 'old' } };
          const counter = Math.round(book.price * 0.9);
          messages.push({ from: 'them', offer: { value: counter, status: 'cnt' }, time: 'şimdi' });
        }
        return { ...t, messages, unread: true };
      });
      return { ...state, threads };
    }

    case 'RESPOND_OFFER': {
      const threads = state.threads.map(t => {
        if (t.id !== action.threadId) return t;
        const messages = [...t.messages];
        const msg = messages[action.messageIndex];
        if (!msg?.offer) return t;

        messages[action.messageIndex] = {
          ...msg,
          offer: { ...msg.offer, status: action.accept ? 'acc' : 'rej' },
        };
        messages.push({
          from: 'me',
          text: action.accept ? 'Kabul ediyorum 👍' : 'Maalesef bu fiyata olmaz.',
          time: 'şimdi',
        });
        return { ...t, messages };
      });
      return { ...state, threads };
    }

    case 'MARK_THREAD_READ': {
      const threads = state.threads.map(t =>
        t.id === action.threadId ? { ...t, unread: false } : t
      );
      return { ...state, threads };
    }

    case 'MARK_ALL_NOTIFS_READ': {
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    }

    case 'ADD_NOTIFICATION': {
      return { ...state, notifications: [action.notification, ...state.notifications] };
    }

    case 'SET_ONBOARDED': {
      return { ...state, onboarded: true };
    }

    case 'START_CHAT': {
      const existing = state.threads.find(t => t.bookId === action.bookId);
      if (existing) return state;
      const book = state.books.find(b => b.id === action.bookId);
      if (!book) return state;
      const newThread: ChatThread = {
        id: state.nextId,
        user: book.seller,
        bookId: action.bookId,
        unread: false,
        messages: [
          {
            from: 'them',
            text: `Merhaba! "${book.title}" hakkında bilgi almak veya teklif vermek istersen buradayım.`,
            time: 'şimdi',
          },
        ],
      };
      return {
        ...state,
        threads: [newThread, ...state.threads],
        nextId: state.nextId + 1,
      };
    }

    default:
      return state;
  }
}

// ====== Context ======

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  toggleLike: (bookId: number) => void;
  toggleSave: (bookId: number) => void;
  toggleFollow: (user: string) => void;
  sendMessage: (threadId: number, text: string) => void;
  sendOffer: (bookId: number, amount: number) => number;
  startChat: (bookId: number) => number;
  getThreadForBook: (bookId: number) => ChatThread | undefined;
  unreadCount: number;
  unreadNotifCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const toggleLike = useCallback((bookId: number) => {
    dispatch({ type: 'TOGGLE_LIKE', bookId });
  }, []);

  const toggleSave = useCallback((bookId: number) => {
    dispatch({ type: 'TOGGLE_SAVE', bookId });
  }, []);

  const toggleFollow = useCallback((user: string) => {
    dispatch({ type: 'TOGGLE_FOLLOW', user });
  }, []);

  const sendMessage = useCallback((threadId: number, text: string) => {
    dispatch({ type: 'SEND_MESSAGE', threadId, text });
    // Auto-reply after delay
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      dispatch({ type: 'RECEIVE_MESSAGE', threadId, text: reply });
    }, 1200 + Math.random() * 800);
  }, []);

  const sendOffer = useCallback((bookId: number, amount: number): number => {
    dispatch({ type: 'SEND_OFFER', bookId, amount });
    // Find or predict thread id
    const existing = state.threads.find(t => t.bookId === bookId);
    const threadId = existing ? existing.id : state.nextId;
    // Auto-reply to offer
    setTimeout(() => {
      dispatch({ type: 'OFFER_REPLY', threadId, messageIndex: existing ? existing.messages.length : 0 });
    }, 2000 + Math.random() * 1000);
    return threadId;
  }, [state.threads, state.nextId]);

  const startChat = useCallback((bookId: number): number => {
    const existing = state.threads.find(t => t.bookId === bookId);
    if (existing) return existing.id;
    const newId = state.nextId;
    dispatch({ type: 'START_CHAT', bookId });
    return newId;
  }, [state.threads, state.nextId]);

  const getThreadForBook = useCallback((bookId: number) => {
    return state.threads.find(t => t.bookId === bookId);
  }, [state.threads]);

  const unreadCount = state.threads.filter(t => t.unread).length;
  const unreadNotifCount = state.notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        toggleLike,
        toggleSave,
        toggleFollow,
        sendMessage,
        sendOffer,
        startChat,
        getThreadForBook,
        unreadCount,
        unreadNotifCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

import { Book, ChatThread, Notification, ShelfItem } from '../types';

export const BOOKS: Book[] = [
  {
    id: 1, title: 'Suç ve Ceza', author: 'Dostoyevski', price: 95,
    condition: 'Çok iyi', category: 'Roman', seller: 'Elif', city: 'İstanbul',
    timeAgo: 24, note: 'Raskolnikov\'un vicdan muhasebesi beni iki gün kendime getirmedi. Temiz, altı çizili yer yok.',
    likes: 42, comments: [{ user: 'Mert', text: 'Efsane kitap, pazarlık olur mu?' }], verified: true,
  },
  {
    id: 2, title: 'Tutunamayanlar', author: 'Oğuz Atay', price: 140,
    condition: 'İyi', category: 'Roman', seller: 'Burak', city: 'Ankara',
    timeAgo: 120, note: 'Bitirmesi zor ama pişman etmiyor. Kenarlarına notlar aldım.',
    likes: 87, comments: [], verified: false,
  },
  {
    id: 3, title: 'Küçük Prens', author: 'Saint-Exupéry', price: 45,
    condition: 'Yeni gibi', category: 'Çocuk', seller: 'Zeynep', city: 'İzmir',
    timeAgo: 300, note: 'Her yaşta başka okunuyor. Hediyelik duruyor.',
    likes: 31, comments: [{ user: 'Ece', text: 'Kargo dahil mi?' }], verified: true,
  },
  {
    id: 4, title: '1984', author: 'George Orwell', price: 70,
    condition: 'İyi', category: 'Distopya', seller: 'Can', city: 'Bursa',
    timeAgo: 1440, note: 'Bu yıl okuduğum en rahatsız edici ve en gerekli kitap.',
    likes: 56, comments: [], verified: true,
  },
  {
    id: 5, title: 'Sofie\'nin Dünyası', author: 'Jostein Gaarder', price: 85,
    condition: 'İyi', category: 'Felsefe', seller: 'Selin', city: 'Eskişehir',
    timeAgo: 1440, note: 'Felsefeye giriş için hâlâ en keyifli yol.',
    likes: 24, comments: [], verified: false,
  },
  {
    id: 6, title: 'Kürk Mantolu Madonna', author: 'Sabahattin Ali', price: 55,
    condition: 'Çok iyi', category: 'Roman', seller: 'Mert', city: 'Konya',
    timeAgo: 2880, note: 'Bir solukta bitirdim, sonunu unutamıyorum.',
    likes: 103, comments: [], verified: true,
  },
  {
    id: 7, title: 'İnce Memed', author: 'Yaşar Kemal', price: 110,
    condition: 'İyi', category: 'Roman', seller: 'Ayşe', city: 'Adana',
    timeAgo: 4320, note: 'Torosların rüzgârını hissettiren bir başyapıt.',
    likes: 67, comments: [{ user: 'Deniz', text: 'Çok güzel kitap, takası olur mu?' }], verified: false,
  },
  {
    id: 8, title: 'Serenad', author: 'Zülfü Livaneli', price: 65,
    condition: 'Çok iyi', category: 'Roman', seller: 'Deniz', city: 'Antalya',
    timeAgo: 7200, note: 'Müzik ve edebiyat birleşince ortaya çıkan harika bir eser.',
    likes: 39, comments: [], verified: true,
  },
  {
    id: 9, title: 'Beyaz Diş', author: 'Jack London', price: 40,
    condition: 'Yıpranmış', category: 'Macera', seller: 'Ali', city: 'Trabzon',
    timeAgo: 10080, note: 'Doğa ile insan arasındaki savaşı anlatıyor. Biraz yıpranmış ama okunabilir.',
    likes: 18, comments: [], verified: false,
  },
  {
    id: 10, title: 'Simyacı', author: 'Paulo Coelho', price: 50,
    condition: 'Yeni gibi', category: 'Felsefe', seller: 'Nur', city: 'Gaziantep',
    timeAgo: 14400, note: 'Hayallerinin peşinden git demenin en güzel yolu.',
    likes: 94, comments: [{ user: 'Selin', text: 'Bende de var, gerçekten çok güzel!' }], verified: true,
  },
];

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: 1, user: 'Selin', bookId: 5, unread: true,
    messages: [
      { from: 'them', text: 'Merhaba, kitap hâlâ duruyor mu?', time: '14:32' },
      { from: 'me', text: 'Evet duruyor, ilgileniyorsan fiyatı konuşabiliriz.', time: '14:45' },
      { from: 'them', text: '80 TL\'ye olur mu?', time: '14:47' },
    ],
  },
  {
    id: 2, user: 'Can', bookId: 4, unread: false,
    messages: [
      { from: 'them', text: 'Merhaba, 1984 için ilgileniyorum.', time: 'Dün' },
      { from: 'me', text: 'Tabii, teklif verebilirsin!', time: 'Dün' },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { type: 'like', text: 'Mert senin ilanını beğendi', time: '2 dk', read: false, bookId: 1 },
  { type: 'offer', text: 'Selin ₺80 teklif etti', time: '15 dk', read: false, bookId: 5 },
  { type: 'follow', text: 'Zeynep seni takip etti', time: '1 sa', read: true },
  { type: 'msg', text: 'Can mesaj gönderdi', time: '3 sa', read: true, bookId: 4 },
  { type: 'like', text: 'Ali ilanını beğendi', time: '1 gün', read: true, bookId: 2 },
];

export const INITIAL_SHELVES: Record<string, ShelfItem[]> = {
  reading: [
    { id: 101, title: 'Satranç', author: 'Stefan Zweig' },
    { id: 102, title: 'Savaş ve Barış', author: 'Tolstoy' },
  ],
  read: [
    { id: 103, title: 'Fareler ve İnsanlar', author: 'Steinbeck' },
    { id: 104, title: 'Dönüşüm', author: 'Kafka' },
    { id: 105, title: 'Yüzüklerin Efendisi', author: 'Tolkien' },
  ],
  want: [
    { id: 106, title: 'Ulysses', author: 'James Joyce' },
    { id: 107, title: 'Don Kişot', author: 'Cervantes' },
  ],
};

export const AUTO_REPLIES = [
  'Tamamdır, bakıp döneyim 🙂',
  'Kitap çok iyi durumda, emin ol!',
  'Kargo dahil olabilir, konuşalım.',
  'Biraz düşüneyim, teşekkürler!',
  'Harika, anlaşabiliriz sanırım 📚',
  'İlgilendiğin için teşekkürler!',
  'Detaylı fotoğraf atabilirim istersen.',
];

export const ONBOARDING_SCREENS = [
  {
    title: 'Kitaplarına yeni bir hayat ver',
    highlight: 'yeni bir hayat',
    desc: 'Okuduğun kitapları sat, yeni okumalar keşfet. Nüsha ile kitaplar elden ele dolaşır.',
    emoji: '📚',
  },
  {
    title: 'Kolayca ilan ver',
    highlight: 'ilan ver',
    desc: 'Kitabının fotoğrafını çek, fiyatını belirle, duygularını paylaş. 30 saniyede ilanın yayında.',
    emoji: '📸',
  },
  {
    title: 'Güvenle al ve sat',
    highlight: 'Güvenle',
    desc: 'Teklif ver, pazarlık yap, mesajlaş. Kitapsever topluluğuyla güvenli alışveriş.',
    emoji: '🤝',
  },
];

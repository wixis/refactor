// Common Domain Types
export interface Film {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  genre?: string;
  durationMinutes: number;
  ageRating?: string;
  releaseDate?: string;
}

export interface Session {
  id: string;
  movieId: string;
  hallId: string;
  startAt: string;
  endAt?: string;
  availableSeats?: number;
  periodConfig?: {
    period: 'EVERY_DAY' | 'EVERY_WEEK';
    periodGenerationEndsAt: string;
  } | null;
}

export interface Seat {
  id: string;
  row: number;
  number: number;
  categoryId: string;
  status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
}

export interface Category {
  id: string;
  name: string;
  priceCents: number;
}

export interface Hall {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
}

export interface Ticket {
  id: string;
  seatId: string;
  categoryId: string;
  status: 'AVAILABLE' | 'BOOKED' | 'PAID';
  priceCents: number;
}

export interface HallPlan {
  hallId: string;
  rows: number;
  seats: Seat[];
  categories: Category[];
}

export interface Booking {
  id: string;
  userId: string;
  sessionId: string;
  seats: Ticket[];
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

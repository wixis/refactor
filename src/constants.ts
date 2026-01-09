// API Configuration Constants
export const API_BASE_URL = 'http://91.142.94.183:8080';

export const API_ENDPOINTS = {
  films: '/films',
  halls: '/halls',
  sessions: '/sessions',
  categories: '/categories',
  bookings: '/bookings',
  auth: '/auth',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE = 0;

// Auth
export const AUTH_HEADER_KEY = 'Authorization';
export const AUTH_HEADER_SCHEME = 'Bearer';

// Routes
export const ROUTES = {
  home: '/home',
  profile: '/profile',
  admin: '/admin',
  login: '/login',
  register: '/register',
} as const;

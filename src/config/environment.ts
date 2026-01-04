/**
 * ========================================
 * CENTRALIZED ENVIRONMENT CONFIGURATION
 * ========================================
 * 
 * 🎯 SINGLE SOURCE OF TRUTH - SATU FILE UNTUK SEMUA!
 * 
 * Cara pakai:
 * 1. Edit .env file saja
 * 2. Pilih NODE_ENV (development atau production)
 * 3. File ini auto-load nilai yang tepat dari .env
 * 4. Semua code files auto-dapat update
 * 
 * Benefit:
 * ✅ Edit .env saja - semua files otomatis update
 * ✅ Type-safe (TypeScript validation)
 * ✅ Auto-detect development vs production
 * ✅ Aman - semua credentials di satu .env file
 */

// ========================================
// AUTO-DETECT ENVIRONMENT
// ========================================
const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';

/**
 * Helper function: Get env var based on environment
 * Jika NODE_ENV=development, ambil DEV_VAR
 * Jika NODE_ENV=production, ambil PROD_VAR
 */
function getEnvValue(devKey: string, prodKey: string): string {
  const value = isDev 
    ? process.env[devKey] 
    : process.env[prodKey];
  return value || '';
}

// Export isDevelopment variable for use in exports
const isDevelopment = isDev;

// ========================================
// DATABASE CONFIGURATION
// ========================================
interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  name: string;
  port: number;
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || '41.216.185.84',
  user: process.env.DB_USER || 'hostvoch_webar',
  password: process.env.DB_PASSWORD || 'Wizard@231191493',
  name: process.env.DB_DATABASE || 'hostvoch_webapp',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

// ========================================
// FIREBASE CONFIGURATION (DISABLED - MySQL Only)
// ========================================
// Firebase is no longer used - application uses MySQL only
// This config is kept for backward compatibility but is not initialized

interface FirebaseConfig {
  // Client config (public) - all disabled
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  // Server config (private) - not available
  serviceAccountJson?: string;
}

const firebaseConfig: any = {
  // ❌ Firebase is DISABLED - MySQL-only deployment
  // These are intentionally empty strings
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  // Server-side - not configured
  serviceAccountJson: null,
};

/**
 * Parse Firebase service account JSON (server-side only)
 * Returns null jika tidak ada atau invalid
 */
function getFirebaseServiceAccount() {
  if (!firebaseConfig.serviceAccountJson) {
    return null;
  }

  try {
    return JSON.parse(firebaseConfig.serviceAccountJson);
  } catch (error) {
    console.error('❌ Invalid FIREBASE_SERVICE_ACCOUNT_JSON format:', error);
    return null;
  }
}

// Attach function to firebaseConfig object for safe access
firebaseConfig.getFirebaseServiceAccount = getFirebaseServiceAccount;

// ========================================
// JWT CONFIGURATION
// ========================================
interface JwtConfig {
  secret: string;
  expiresIn: string;
}

// ✅ Baca JWT_SECRET langsung dari .env (tidak perlu DEV_/PROD_ prefix)
const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET || '',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

// ========================================
// APPLICATION URLS
// ========================================
interface AppUrls {
  siteUrl: string;
  apiUrl: string;
}

const appUrls: AppUrls = {
  siteUrl: getEnvValue('DEV_NEXT_PUBLIC_SITE_URL', 'PROD_NEXT_PUBLIC_SITE_URL') || 'http://localhost:3000',
  apiUrl: getEnvValue('DEV_NEXT_PUBLIC_API_URL', 'PROD_NEXT_PUBLIC_API_URL') || 'http://localhost:3000/api',
};

// ========================================
// OPTIONAL CONFIGURATIONS
// ========================================
interface OptionalConfig {
  paypal: {
    clientId: string;
    clientSecret?: string;
  };
  crypto: {
    btcWallet: string;
    ethWallet: string;
    usdtWallet: string;
    usdcWallet: string;
    dogeWallet: string;
  };
  email: {
    emailjsServiceId: string;
    emailjsTemplateId: string;
    emailjsPublicKey: string;
  };
  whatsapp: {
    number: string;
    apiToken: string;
  };
  analytics: {
    googleAnalyticsId: string;
    facebookPixelId: string;
    hotjarId: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  upload: {
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  recaptcha: {
    siteKey: string;
    secretKey?: string;
  };
  features: {
    enableGamification: boolean;
    enableCryptoPayments: boolean;
    enableEmailMarketing: boolean;
  };
  debug: {
    debugMode: boolean;
    showConsoleLogs: boolean;
  };
}

const optionalConfig: OptionalConfig = {
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  crypto: {
    btcWallet: process.env.NEXT_PUBLIC_BTC_WALLET || '',
    ethWallet: process.env.NEXT_PUBLIC_ETH_WALLET || '',
    usdtWallet: process.env.NEXT_PUBLIC_USDT_WALLET || '',
    usdcWallet: process.env.NEXT_PUBLIC_USDC_WALLET || '',
    dogeWallet: process.env.NEXT_PUBLIC_DOGE_WALLET || '',
  },
  email: {
    emailjsServiceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    emailjsTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    emailjsPublicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  },
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '08875023202',
    apiToken: process.env.NEXT_PUBLIC_WHATSAPP_API_TOKEN || '',
  },
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  },
  socialMedia: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/hostvoucher',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/hostvoucher',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/hostvoucher',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/hostvoucher',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@hostvoucher',
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com/@hostvoucher',
  },
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760', 10),
    allowedFileTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,webp,pdf').split(','),
  },
  recaptcha: {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
  },
  features: {
    enableGamification: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION === 'true',
    enableCryptoPayments: process.env.NEXT_PUBLIC_ENABLE_CRYPTO_PAYMENTS === 'true',
    enableEmailMarketing: process.env.NEXT_PUBLIC_ENABLE_EMAIL_MARKETING === 'true',
  },
  debug: {
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    showConsoleLogs: process.env.NEXT_PUBLIC_SHOW_CONSOLE_LOGS === 'true',
  },
};

// ========================================
// VALIDATION & ERROR CHECKING
// ========================================

/**
 * Validate critical environment variables
 * Throw error jika ada yang missing di production
 */
function validateEnvironment() {
  const isDev = process.env.NODE_ENV === 'development';

  // Database - WAJIB
  if (!dbConfig.host) {
    throw new Error('❌ DB_HOST environment variable is required');
  }
  if (!dbConfig.user) {
    throw new Error('❌ DB_USER environment variable is required');
  }
  if (!dbConfig.name) {
    throw new Error('❌ DB_NAME environment variable is required');
  }

  // Firebase client - WAJIB untuk hybrid auth
  if (!firebaseConfig.apiKey) {
    console.warn('⚠️  NEXT_PUBLIC_FIREBASE_API_KEY is not set - hybrid auth will not work');
  }
  if (!firebaseConfig.projectId) {
    console.warn('⚠️  NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set - hybrid auth will not work');
  }

  // JWT - WAJIB untuk hybrid auth
  if (!jwtConfig.secret) {
    throw new Error('❌ JWT_SECRET environment variable is required');
  }
  if (jwtConfig.secret.length < 32) {
    throw new Error('❌ JWT_SECRET must be at least 32 characters long');
  }

  // Firebase service account - NOT REQUIRED (MySQL only)
  // Firebase is disabled in production - using MySQL exclusively
  if (!isDev) {
    console.log('✅ MySQL-only mode activated (Firebase disabled)');
  }
}

// Validate pada startup
try {
  validateEnvironment();
} catch (error) {
  console.error('🔴 Environment Configuration Error:', error);
  // Jangan exit di development, tapi log warning
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// ========================================
// EXPORT CONFIGURATION
// ========================================
// 
// Cara pakai di code:
// import { env } from '@/config/environment';
// console.log(env.database.host);  // Otomatis pake nilai dari .env sesuai NODE_ENV
//
// Tidak perlu lagi urus dev vs prod - environment.ts handle semua!

export const env = {
  // Database
  database: dbConfig,

  // Firebase
  firebase: firebaseConfig,
  getFirebaseServiceAccount,

  // JWT
  jwt: jwtConfig,

  // URLs
  urls: appUrls,

  // Optional configs
  ...optionalConfig,

  // Utilities
  isDevelopment,
  isProduction: !isDevelopment,
  nodeEnv,
  
  // Info untuk debugging
  environmentInfo: {
    mode: isDevelopment ? 'development 🔧' : 'production 🚀',
    nodeEnv,
    dbHost: dbConfig.host,
    firebaseProjectId: firebaseConfig.projectId,
  }
};

/**
 * Export individual configs untuk convenience
 * Usage: import { database, firebase, jwt } from '@/config/environment'
 */
export const {
  database,
  firebase,
  jwt,
  urls,
  paypal,
  crypto,
  email,
  whatsapp,
  analytics,
  socialMedia,
  upload,
  recaptcha,
  features,
  debug,
} = env;

export default env;

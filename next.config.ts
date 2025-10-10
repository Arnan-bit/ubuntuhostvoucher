/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opsi untuk mengabaikan error TypeScript & ESLint saat build.
  // PERINGATAN: Sebaiknya nonaktifkan (false) saat development untuk melihat error yang sebenarnya.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimasi untuk production
  compress: true,
  poweredByHeader: false,
  serverExternalPackages: ['mysql2'],

  // Konfigurasi Webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimasi chunk loading untuk client
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
        },
      };
    }
    return config;
  },

  // Fitur Eksperimental
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Konfigurasi Gambar
  images: {
    // PERINGATAN: unoptimized: true mematikan optimasi gambar Next.js.
    // Jika memungkinkan, ubah menjadi 'false' untuk performa yang lebih baik.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'www.hostinger.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.digitalocean.com' },
      { protocol: 'https', hostname: 'www.vultr.com' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'hostvocher.com' },
      { protocol: 'http', hostname: 'hostvocher.com' },
      { protocol: 'https', hostname: 'www.hostvocher.com' },
      { protocol: 'http', hostname: 'www.hostvocher.com' },
      { protocol: 'http', hostname: 'localhost', port: '9001' },
      { protocol: 'http', hostname: 'localhost', port: '9002' },
    ],
  },

  // Aturan penulisan ulang URL (Proxy)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`
          : 'http://localhost:5000/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}/:path*`
          : 'http://localhost:9001/uploads/:path*',
      },
    ];
  }, // Koma sudah benar, karakter 's' sudah dihapus

  // Headers Keamanan
  async headers() {
    return [
      {
        source: '/:path*', // Terapkan ke semua path
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'standalone', // Untuk deployment
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

  // Webpack optimization untuk mengatasi chunk loading issues
  webpack: (config: any, { isServer }: any) => {
    if (!isServer) {
      // Fix chunk loading errors
      config.output = {
        ...config.output,
        publicPath: '/_next/',
        chunkLoadTimeout: 30000,
      };

      // Optimize chunk splitting
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

      // Add retry logic for chunk loading
      config.output.crossOriginLoading = 'anonymous';
    }
    return config;
  },

  // Add experimental features for better chunk handling
  experimental: {
    // optimizeCss: true, // Disabled temporarily due to critters module issue
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hostinger.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.digitalocean.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.vultr.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hostvocher.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'hostvocher.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hostvocher.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'www.hostvocher.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9002',
        pathname: '/uploads/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://api.your-domain.com/:path*'  // Ganti dengan domain API Anda
          : 'http://localhost:5000/:path*'
      },
      {
        source: '/uploads/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://your-domain.com/uploads/:path*'  // Ganti dengan domain Anda
          : 'http://localhost:9001/uploads/:path*',
      },
    ];
  },
  // Headers keamanan
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;

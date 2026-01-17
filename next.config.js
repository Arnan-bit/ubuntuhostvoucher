/**
 * next.config.js
 * - Add allowedDevOrigins to quiet cross-origin dev warning
 * - Add a rewrite for promo-banner.jpg -> promo-banner.svg (placeholder)
 */
module.exports = {
  // Allow dev access from local network address shown in terminal
  allowedDevOrigins: [
    'http://192.168.246.74:3000',
    'http://localhost:3000'
  ],
  images: {
    // Add remote domains used by content (fixes "Invalid src prop" runtime error)
    domains: ['i.ibb.co', 'ibb.co', 'images.unsplash.com', 'res.cloudinary.com'],
    // allow flexible remote patterns if needed
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/images/promo-banner.jpg',
        destination: '/images/promo-banner.svg'
      }
    ];
  }
};

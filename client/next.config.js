/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["date-fns"],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://workforce-manager-api.onrender.com/api/:path*' 
          : 'http://localhost:3001/api/:path*',
      },
    ]
  },
  webpack: (config) => {
    // This is needed for date-fns ESM compatibility
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };
    
    // Add specific condition for date-fns
    config.resolve.conditionNames = ['import', 'require', 'node'];
    
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  },
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? process.env.API_URL || 'https://workforce-manager-api.onrender.com' 
      : 'http://localhost:5000',
  },
};

module.exports = nextConfig; 
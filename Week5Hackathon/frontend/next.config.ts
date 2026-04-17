/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to succeed even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows the build to succeed even if there are linting warnings/errors
    ignoreDuringBuilds: true,
  },
  // If you have image issues from external URLs (like your UI avatars)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'onrender.com' },
    ],
  },
};

export default nextConfig;
import nextPwa from 'next-pwa';
const isDev = process.env.NODE_ENV === 'development';

const withPWA = nextPwa({
  dest: 'public',
  disable: true,
  register: true,
  skipWaiting: true,
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};


export default withPWA(nextConfig);

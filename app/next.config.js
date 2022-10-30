/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-wallets',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-react-ui'
]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withTM(nextConfig);

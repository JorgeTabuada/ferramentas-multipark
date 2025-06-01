/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"]
  },
  images: {
    domains: ['localhost']
  }
}

export default nextConfig

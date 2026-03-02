/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/api/:path*`,
            },
            {
                source: '/auth/:path*',
                destination: `${backendUrl}/auth/:path*`,
            },
            {
                source: '/contracts/:path*',
                destination: `${backendUrl}/contracts/:path*`,
            },
            {
                source: '/payments/:path*',
                destination: `${backendUrl}/payments/:path*`,
            },
        ];
    },
};

export default nextConfig;

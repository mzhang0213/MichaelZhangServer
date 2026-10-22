/** @type {import('next').NextConfig} */
const nextConfig = {
    // serve the static spotifyYt pages in public/ at their base paths
    async rewrites() {
        return [
            { source: "/spotifyYt", destination: "/spotifyYt/index.html" },
            { source: "/spotifyYt/wrapped", destination: "/spotifyYt/wrapped/index.html" },
            { source: "/spotifyYt/saved", destination: "/spotifyYt/saved/index.html" },
        ];
    },
};

export default nextConfig;

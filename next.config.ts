import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.dovegolf.fit",
          },
        ],
        destination: "https://dovegolf.fit/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

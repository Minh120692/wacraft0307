/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index-en.html",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/about.html",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about-en.html",
        destination: "/en/about",
        permanent: true,
      },
      {
        source: "/solutions.html",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/solutions-en.html",
        destination: "/en/solutions",
        permanent: true,
      },
      {
        source: "/why-us.html",
        destination: "/why-us",
        permanent: true,
      },
      {
        source: "/why-us-en.html",
        destination: "/en/why-us",
        permanent: true,
      },
      {
        source: "/team.html",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/team-en.html",
        destination: "/en/team",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

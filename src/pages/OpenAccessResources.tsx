import { useEffect, useState } from "react";
import { SEO } from "../components/SEO";

export default function OpenAccessResources() {
  const [iframeHeight, setIframeHeight] = useState("2000px");

  useEffect(() => {
    const updateHeight = () => {
      setIframeHeight(`${window.innerHeight}px`);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    // return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
       <SEO
        title={"Open Access Resources | Educite Virtual Library"}
        description="Access thousands of educational documents, legal resources, and academic materials through Educite's comprehensive virtual library."
        keywords="judgments, court records, legal documents, legal resources, academic materials, virtual library, legal notice, ordinances"
        type="article"
      />
      {/* Hero Section */}
      <div className="relative bg-blue-900 py-24">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80")',
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Open Access Resources
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Empowering legal professionals and researchers with comprehensive
              digital access to legal resources
            </p>
          </div>
        </div>
      </div>

      {/* Iframe with dynamic height */}
      <iframe
        src="/test.html"
        width="100%"
        height={iframeHeight}
        style={{ border: "none", overflow: "hidden" }}
        // scrolling="no"
      />
    </div>
  );
}

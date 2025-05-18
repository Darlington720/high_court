import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DocumentDetailsContent } from "../components/DocumentDetailsContent";
import { Button } from "../components/ui/Button";
import { fetchDocuments, saveDocumentDownload } from "../lib/documents";
import { formatDate } from "../lib/utils";
import type { Document } from "../types";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";
import { SEO } from "../components/SEO";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

export default function DocumentDetails() {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const appContext = useContext(AppContext);

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Initialize toolbar plugin
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  // Function to check if the file is a PDF
  const isValidPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    if (!documentId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments({ id: documentId });
      console.log("Fetched documents:", data);
      if (data && data.length > 0) {
        setDocument(data[0]);
      } else {
        setError("Document not found");
      }
    } catch (err) {
      setError("Failed to load document. Please try again.");
      console.error("Error loading document:", err);
    } finally {
      setLoading(false);
    }
  };

//   const handleDownload = async () => {
//     if (!document || !appContext?.user) return;

//     try {
//       setDownloading(true);
//       const response = await fetch(document.file_url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/octet-stream",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch file: ${response.statusText}`);
//       }

//       await saveDocumentDownload(appContext.user.id, document.id);

//       const blob = await response.blob();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = document.title || "document.pdf";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(link.href);
//     } catch (error) {
//       console.error("Download error:", error);
//       toast.error("Failed to download document");
//     } finally {
//       setDownloading(false);
//     }
//   };

const handleDownload = async () => {
    if (!document || !appContext?.user) return;
  
    try {
      setDownloading(true);
      const response = await fetch(document.file_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
  
      await saveDocumentDownload(appContext.user.id, document.id);
  
      const blob = await response.blob();
      const link = window.document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = document.title || "document.pdf";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    } finally {
      setDownloading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Document not found"}
            </h2>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO
        title={`${document.title} | Educite Virtual Library`}
        description={`View and download ${document.title}. Access official documents and records through Educite's virtual library.`}
        keywords={`${document.title}, ${document.category}, ${document.subcategory}, document details, virtual library`}
        canonicalUrl={`https://educitevl.edu.ug/document/${document.id}`}
        type="article"
      />

      {/* Add Article Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: document.title,
          datePublished: document.created_at,
          dateModified: document.updated_at,
          description:
            document.metadata.description ||
            `View and download ${document.title}`,
          keywords: document.metadata.keywords?.join(", "),
          author: {
            "@type": "Organization",
            name: "Educite Virtual Library",
          },
        })}
      </script>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="bg-white shadow rounded-xl overflow-hidden">
            {/* Mobile Document Details */}
            <div className="block lg:hidden p-6">
              <DocumentDetailsContent
                document={document}
                appContext={appContext}
                downloading={downloading}
                handleDownload={handleDownload}
                navigate={navigate}
              />
            </div>
            <div className="lg:grid lg:grid-cols-4 h-full">
              {/* PDF Viewer */}
              <div className="lg:col-span-3 p-4 border-r">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 truncate">
                    Document Preview
                  </h2>
                  {!isValidPDF(document.file_url) && (
                    <span className="text-xs text-red-500">
                      Unsupported file
                    </span>
                  )}
                </div>

                {/* Viewer */}
                {isValidPDF(document.file_url) ? (
                  <div className="border rounded-lg overflow-hidden h-[75vh]">
                    <div className="bg-gray-50 border-b px-3 py-2">
                      <Toolbar />
                    </div>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={document.file_url}
                        plugins={[toolbarPluginInstance]}
                        onError={() => setLoadError(true)}
                      />
                    </Worker>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-700 text-sm">
                      Unsupported format. Please download to view.
                    </p>
                  </div>
                )}
              </div>

              {/* Details sidebar */}
              <div className="hidden lg:block lg:col-span-1 p-6 bg-gray-50">
                <DocumentDetailsContent
                  document={document}
                  appContext={appContext}
                  downloading={downloading}
                  handleDownload={handleDownload}
                  navigate={navigate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

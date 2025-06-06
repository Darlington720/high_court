import { FileText, Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";
import { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  fileType: string;
  date: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onClickNext: (currentPage: number) => void;
  onClickPrev: (currentPage: number) => void;
  loading: boolean;
}

export function SearchResults({ results, onClickNext, onClickPrev, loading = false }: SearchResultsProps) {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);

  // const handlePreview = (fileUrl: string) => {
  //   window.open(fileUrl, "_blank");
  // };

  const handlePreview = (file: any) => {
    appContext?.setDocumentPreview(file);
    appContext?.setSelectedDocumentPreviewVisible(true);
    // window.open(fileUrl, "_blank");
  };

  const handleDownload = (doc: any) => {
    // console.log(doc);
    // const link = document.createElement("a");
    // link.href = doc.file_url;
    // link.setAttribute("download", doc.title); // Suggests a filename
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    window.open(doc.file_url, "_blank");
  };

  const handleDocClick = (item: any) => {
    if (!appContext?.user) {
      toast.warn("You need to log in to access this document.");
      navigate("/login");
    } else {
      handlePreview(item);
    }
  };

  const totalPages = results.length > 0 ? Math.ceil(results[0].total_rows / 10) : 1;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Search Results
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {results.length > 0
            ? `Found ${results.length > 0 ?  parseInt(results[0].total_rows).toLocaleString() : 0} documents`
            : "No documents found."}
        </p>
      </div>

      {results.length > 0 ? (
        <>
        <Spin spinning={loading} tip="Loading documents...">
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  {appContext?.user && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center" style={{ width: 300 }}>
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div
                            className="text-md font-medium text-gray-900"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => handleDocClick(result)}
                          >
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-500 w-60">
                            {result.subcategory}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-60">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {result.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 w-20">
                      {result.metadata.type}
                    </td>
                    {appContext?.user && (
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download
                              className="h-4 w-4"
                              onClick={() => handleDownload(result)}
                            />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink
                              className="h-4 w-4"
                              onClick={() => handlePreview(result)}
                            />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        </Spin>

         {/* Pagination */}
         {totalPages > 0 && (
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                        onClickPrev(currentPage)
                      }
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        onClickNext(currentPage)
                      }
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
        </>

      ) : (
        <div className="p-6 text-center text-gray-500">
          No documents match your search.
        </div>
      )}
    </div>
  );
}

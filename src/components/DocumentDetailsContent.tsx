import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  Loader,
  Download,
} from "lucide-react";
import { Button } from "./ui/Button";
import { formatDate } from "../lib/utils";
import type { Document } from "../types";

interface DocumentDetailsContentProps {
  document: Document;
  appContext: any;
  downloading: boolean;
  handleDownload: () => void;
  navigate: (path: string) => void;
}

export function DocumentDetailsContent({
  document,
  appContext,
  downloading,
  handleDownload,
  navigate,
}: DocumentDetailsContentProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
        <div className="rounded-lg bg-blue-100 p-2 self-start">
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex-1">
          <h1
            className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-2"
            title={document.title}
          >
            {document.title}
          </h1>

          <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap gap-2 text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="mr-1.5 h-4 w-4" />
              {formatDate(document.created_at)}
            </span>
            {document.subcategory && (
              <span className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                {document.subcategory}
              </span>
            )}
            {document.metadata.attendees && (
              <span className="flex items-center">
                <Users className="mr-1.5 h-4 w-4" />
                {document.metadata.attendees} Attendees
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {document.metadata.description && (
        <div className="mt-6">
          <h2 className="text-md font-semibold text-gray-800 mb-1">
            Description
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {document.metadata.description}
          </p>
        </div>
      )}

      {/* Download button */}
      {appContext?.user && (
        <div className="mt-6">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full"
          >
            {downloading ? (
              <Loader className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {downloading ? "Downloading..." : "Download Document"}
          </Button>
        </div>
      )}

      {/* <div className="mt-6 flex justify-end">
        {appContext?.user ? (
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto"
          >
            {downloading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Document
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto"
          >
            Login to Download
          </Button>
        )}
      </div> */}
    </>
  );
}

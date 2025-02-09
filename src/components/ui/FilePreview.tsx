import { FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { formatFileSize } from '../../lib/utils';

interface FilePreviewProps {
  file: File;
  progress: number;
  error?: string;
  onRemove: () => void;
  metadata?: {
    title?: string;
    description?: string;
  };
  onMetadataChange?: (metadata: { title?: string; description?: string }) => void;
}

export function FilePreview({
  file,
  progress,
  error,
  onRemove,
  metadata,
  onMetadataChange
}: FilePreviewProps) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-start space-x-4">
        <div className="rounded-lg bg-blue-50 p-2">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {metadata?.title || file.name}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatFileSize(file.size)}
          </p>
          {progress > 0 && !error && (
            <div className="mt-2">
              <ProgressBar progress={progress} className="w-full" />
              <p className="mt-1 text-xs text-gray-500">
                {progress === 100 ? 'Upload complete' : `${progress}% uploaded...`}
              </p>
            </div>
          )}
          {error && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
          {progress === 100 && !error && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Upload successful
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Tag,
  FileType,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Save,
  Folder,
  RefreshCw,
  Send
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FilePreview } from '../../components/ui/FilePreview';
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES } from '../../lib/constants';
import { uploadDocument } from '../../lib/documents';

interface FileWithMetadata {
  file: File;
  metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    status?: 'active' | 'draft';
  };
  progress: number;
  error?: string;
  uploaded?: boolean;
}

export default function UploadDocument() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      metadata: {
        title: file.name,
        description: '',
        keywords: [],
        status: 'draft' as const
      },
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    disabled: isUploading,
    multiple: true
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (editingFile === index) {
      setEditingFile(null);
    }
  };

  const handleMetadataChange = (index: number, field: string, value: any) => {
    setFiles(prev => prev.map((file, i) => 
      i === index 
        ? { ...file, metadata: { ...file.metadata, [field]: value } }
        : file
    ));
  };

  const handleSubmit = async () => {
    if (!category || !subcategory) {
      setGlobalError('Please select a category and subcategory');
      return;
    }

    if (files.length === 0) {
      setGlobalError('Please add at least one file');
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    setGlobalError(null);
    setUploadProgress(0);

    const totalFiles = files.length;
    let completedFiles = 0;
    let hasErrors = false;

    try {
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        if (fileData.uploaded) continue;

        try {
          // Update progress to show upload started
          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, progress: 10 } : f
          ));

          await uploadDocument(fileData.file, category, subcategory, {
            ...fileData.metadata,
            status: fileData.metadata.status || 'active'
          });

          // Mark as uploaded and set progress to 100%
          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, progress: 100, uploaded: true } : f
          ));

          completedFiles++;
          setUploadProgress((completedFiles / totalFiles) * 100);
        } catch (err) {
          hasErrors = true;
          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, error: 'Upload failed' } : f
          ));
        }
      }

      // If all files uploaded successfully, show success message and redirect
      if (!hasErrors) {
        setGlobalError(null);
        setTimeout(() => {
          navigate('/dashboard/documents');
        }, 2000);
      }
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const allUploaded = files.every(f => f.uploaded);
  const hasErrors = files.some(f => f.error);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/documents')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload and organize your legal documents
        </p>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Document Location</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
              }}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {Object.keys(DOCUMENT_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={!category}
            >
              <option value="">Select Subcategory</option>
              {category &&
                DOCUMENT_CATEGORIES[category as keyof typeof DOCUMENT_CATEGORIES].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          rounded-lg border-2 border-dashed p-8 text-center
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <div className="mt-2 text-xs text-gray-500">
          Supported formats: PDF, DOC, DOCX, TXT, RTF, XLS, XLSX
        </div>
      </div>

      {/* Error Message */}
      {globalError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{globalError}</p>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Selected Files ({files.length})
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {files.map((fileData, index) => (
              <FilePreview
                key={index}
                file={fileData.file}
                progress={fileData.progress}
                error={fileData.error}
                onRemove={() => handleRemoveFile(index)}
                metadata={fileData.metadata}
                onMetadataChange={(metadata) => handleMetadataChange(index, 'metadata', metadata)}
              />
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/documents')}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isUploading || files.length === 0 || isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
            {isUploading && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Uploading {files.length} files... {Math.round(uploadProgress)}% complete
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
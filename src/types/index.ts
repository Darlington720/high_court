// Add these types to your existing types file

export interface Document {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  file_url: string;
  metadata: {
    size: number;
    type: string;
    lastModified: number;
    status?: 'active' | 'archived' | 'draft';
    version?: string;
    author?: string;
    keywords?: string[];
    description?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export interface DocumentFilter {
  category?: string;
  subcategory?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  type?: string[];
  keywords?: string[];
}

export interface DocumentSort {
  field: 'title' | 'created_at' | 'updated_at' | 'size';
  direction: 'asc' | 'desc';
}
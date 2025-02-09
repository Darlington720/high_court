// Document categories and subcategories based on database schema
export const DOCUMENT_CATEGORIES = {
  'Hansards': [
    'Hansards 2025',
    'Hansards 2024',
    'Hansards 2023',
    'Hansards 2022',
    'Hansards 2021',
    'Hansards 2020',
    'Hansards 2019',
    'Hansards 2018',
    'Hansards 2017',
    'Hansards 2016',
    'Hansards 2015',
    'Hansards 2014',
    'Hansards 2013',
    'Hansards 2012',
    'Hansards 2011',
    'Hansards 2010',
    'Hansards 2009',
    'Hansards 2008',
    'Hansards 2007',
    'Hansards 2006',
    'Hansards 2005',
    'Hansards 2004',
    'Hansards 2003',
    'Hansards 2002',
    'Hansards 2001',
    'Hansards 2000',
    'Hansards 1999',
    'Hansards 1998',
    'Hansards 1997',
    'Hansards 1996',
    'Hansards 1995',
    'Hansards 1994',
    'Hansards 1993',
    'Hansards 1992',
    'Hansards 1991',
    'Hansards 1990',
    'Hansards 1989',
    'Hansards 1988',
    'Hansards 1987',
    'Hansards 1986',
    'Hansards 1985',
    'Hansards 1984',
    'Hansards 1983',
    'Hansards 1982',
    'Hansards 1981',
    'Hansards 1980',
    'Hansards 1979',
    'Hansards 1978',
    'Hansards 1977',
    'Hansards 1976',
    'Hansards 1975',
    'Hansards 1974',
    'Hansards 1973',
    'Hansards 1972',
    'Hansards 1971',
    'Hansards 1970',
    'Hansards 1969',
    'Hansards 1968',
    'Hansards 1967',
    'Hansards 1966',
    'Hansards 1965',
    'Hansards 1964',
    'Hansards 1963',
    'Hansards 1962',
    'Hansards 1961',
    'Hansards 1960',
    'Hansards 1959',
    'Hansards 1958',
    'Hansards 1957',
    'Hansards 1956'
  ],
  'Courts of Record': [
    'Supreme Court of Uganda',
    'Court of Appeal of Uganda',
    'Constitutional Court of Uganda',
    'High Court of Uganda',
    'High Court of Uganda/Commercial Court Division',
    'High Court of Uganda/Anti-Corruption Division',
    'High Court of Uganda/Civil Division',
    'High Court of Uganda/Criminal Division',
    'High Court of Uganda/Family Division',
    'High Court of Uganda/International Crimes Division',
    'High Court of Uganda/Land Division',
    'High Court of Uganda/Industrial Court Division',
    'High Court of Uganda/Election Petitions'
  ],
  'State Tribunals': [
    'Center for Arbitration and Dispute Resolution of Uganda',
    'Equal Opportunities Commission',
    'Insurance Appeals Tribunal (Uganda)',
    'Leadership Code Tribunal of Uganda',
    'Public Procurement and Disposal of Public Assets Appeals Tribunal',
    'Tax Appeals Tribunal (Uganda)'
  ],
  'Acts of Parliament': ['Acts of Parliament'],
  'Statutory Instruments': [
    'Statutory Instruments 2003',
    'Statutory Instruments 2002',
    'Statutory Instruments 2001'
  ],
  'Gazettes': [
    'General Notices',
    'Legal Notices',
    'Statutory Instruments',
    'Bills Supplements',
    'Acts Supplements',
    'Tender Notices',
    'Trademark Notices',
    'Company Notices'
  ],
  'Archival Materials': ['Archival Materials'],
  'Legal Forms': [
    'Court Forms',
    'Company Forms',
    'Land Forms',
    'Immigration Forms',
    'Tax Forms'
  ],
  'Practice Directions': [
    'Supreme Court',
    'Court of Appeal',
    'High Court',
    'Specialized Divisions'
  ],
  'Law Reports': [
    'Uganda Law Reports',
    'East African Law Reports',
    'Human Rights Law Reports'
  ],
  'Legal Commentaries': [
    'Case Commentaries',
    'Legislative Guides',
    'Practice Notes',
    'Legal Updates'
  ]
};

export const DOCUMENT_TYPES = {
  'application/pdf': {
    label: 'PDF Document',
    icon: 'FileText',
    extensions: ['.pdf']
  },
  'application/msword': {
    label: 'Word Document',
    icon: 'FileText',
    extensions: ['.doc']
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    label: 'Word Document',
    icon: 'FileText',
    extensions: ['.docx']
  },
  'text/plain': {
    label: 'Text Document',
    icon: 'FileText',
    extensions: ['.txt']
  },
  'application/rtf': {
    label: 'Rich Text Document',
    icon: 'FileText',
    extensions: ['.rtf']
  },
  'application/vnd.ms-excel': {
    label: 'Excel Spreadsheet',
    icon: 'FileText',
    extensions: ['.xls']
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    label: 'Excel Spreadsheet',
    icon: 'FileText',
    extensions: ['.xlsx']
  }
};

export const DOCUMENT_STATUSES = {
  active: {
    label: 'Active',
    color: 'green',
    description: 'Document is available and accessible'
  },
  archived: {
    label: 'Archived',
    color: 'gray',
    description: 'Document has been archived'
  },
  draft: {
    label: 'Draft',
    color: 'yellow',
    description: 'Document is in draft state'
  },
  processing: {
    label: 'Processing',
    color: 'blue',
    description: 'Document is being processed'
  }
};

export const DOCUMENT_SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'title', label: 'Title' },
  { value: 'category', label: 'Category' },
  { value: 'metadata.size', label: 'Size' }
];

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const getDocumentTypeFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  for (const [mimeType, info] of Object.entries(DOCUMENT_TYPES)) {
    if (info.extensions.includes(`.${extension}`)) {
      return mimeType;
    }
  }
  return 'application/octet-stream';
};

export const isValidDocumentType = (type: string): boolean => {
  return type in DOCUMENT_TYPES;
};
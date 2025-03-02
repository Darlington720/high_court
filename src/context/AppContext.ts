import { createContext } from "react";

interface AppContextObj {
  user: any;
  setUser: (profile: any) => void;
  editDocModalVisible: boolean;
  setEditDocModalVisible: (payload: any) => void;
  selectedDocument: any;
  setSelectedDocument: (payload: any) => void;
  selectedDocumentPreviewVisible: any;
  setSelectedDocumentPreviewVisible: (payload: any) => void;
  documentPreview: any;
  setDocumentPreview: (payload: any) => void;
}

const AppContext = createContext<AppContextObj | null>(null);

export type { AppContextObj }; // Corrected export

export default AppContext;

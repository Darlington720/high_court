import { createContext } from "react";

interface AppContextObj {
  user: any;
  setUser: (profile: any) => void;
}

const AppContext = createContext<AppContextObj | null>(null);

export type { AppContextObj }; // Corrected export

export default AppContext;

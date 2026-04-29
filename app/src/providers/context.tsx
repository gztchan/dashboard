"use client";

import { createContext, useContext, useMemo } from "react";

import { SessionService, ProfileManagerService, BrowserManagerService } from "@providence/services";

export interface AppContextType {
  sessionService: SessionService;
  profileManagerService: ProfileManagerService;
  browserManagerService: BrowserManagerService;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const sessionService = useMemo(() => SessionService.createService({
    apiEndpoint: null,
    edgeEndpoint: null,
  }), []);
  const profileManagerService = useMemo(() => ProfileManagerService.createService(), []);
  const browserManagerService = useMemo(() => BrowserManagerService.createService(), []);
  
  return <AppContext.Provider value={{
    sessionService,
    profileManagerService,
    browserManagerService,
  }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
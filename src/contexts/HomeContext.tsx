import * as React from "react";

export type HomeData = {
  scrollToProjects?: () => void;
  scrollToContact?: () => void; 
};

const HomeContext = React.createContext<HomeData | undefined>(undefined);

export const useHomeContext = () => {
  const context = React.useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within HomeProvider");
  }
  return context;
};

export const HomeProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: HomeData;
}) => {
  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

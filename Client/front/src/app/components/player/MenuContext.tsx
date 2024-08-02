import { createContext, useState, useContext, ReactNode } from "react";

interface MenuContextProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <MenuContext.Provider value={{ showMenu, setShowMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

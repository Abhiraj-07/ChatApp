import { createContext, useContext, useState } from "react";

export const LoadingContext = createContext();

export const useLoadingContext = () => {
  return useContext(LoadingContext);
};

export const LoadingContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,setEmoji,emoji
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

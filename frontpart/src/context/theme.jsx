import  { createContext, useState } from "react";

const defaultThemeState = {
  theme: false,
  from: "",
  to: ""
};

const ThemeContext = createContext({
  theme: defaultThemeState.theme,
  from: defaultThemeState.from,
  to: defaultThemeState.to,
  setTheme: () => {}
});

const ThemeProvider = ({ children }) => {
  const [themeState, setThemeState] = useState(defaultThemeState);

  const valueToShare = {
    ...themeState,
    setTheme: setThemeState
  };

  return (
    <ThemeContext.Provider value={valueToShare}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };

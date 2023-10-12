import React, { createContext, useMemo, useState } from "react";

import { createUseContext } from "utils/hooks";
import type { Container, ContainerProps, Context } from "utils/types/react";

import type { ThemeConfig, ThemeContext } from "./types";

const createThemeContext = <
  T extends string,
  D extends T,
  K extends string = never,
>(
  config: ThemeConfig<T, D, K>,
): {
  ThemeProvider: Container;
  useTheme: () => ThemeContext<T, K>;
} => {
  const Context = createContext<ThemeContext<T, K> | null>(null);
  const Provider = createThemeProvider(Context, config);
  const useTheme = createUseContext(Context, "Theme");

  return { ThemeProvider: Provider, useTheme };
};

const createThemeProvider = <
  T extends string,
  D extends T,
  K extends string = never,
>(
  Context: Context<ThemeContext<T, K>>,
  config: ThemeConfig<T, D, K>,
): Container => {
  const { initial, themes } = config;

  const Provider = ({ children }: ContainerProps): JSX.Element => {
    const [theme, setTheme] = useState<T>(initial);

    const themeData = useMemo(
      () => Object.assign({ name: theme }, themes[theme]),
      [theme],
    );

    return (
      <Context.Provider value={{ setTheme, theme: themeData }}>
        {children}
      </Context.Provider>
    );
  };

  return Provider;
};

export { createThemeContext };

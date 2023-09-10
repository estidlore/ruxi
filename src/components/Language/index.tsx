import React, { createContext, useMemo, useState } from "react";

import { createUseContext } from "utils/hooks";
import type { Container, ContainerProps, Context } from "utils/types/react";

import type {
  LanguageConfig,
  LanguageContext,
  LanguageEntries,
  LanguageEntry
} from "./types";

const createLanguageProvider = <T extends string, M extends T>(
  Context: Context<LanguageContext<T>>,
  config: LanguageConfig<T, M>
): Container => {
  const LanguageProvider = ({ children }: ContainerProps): JSX.Element => {
    const [language, setLanguage] = useState<T>(config.main);

    const value: LanguageContext<T> = useMemo(
      () => ({
        language: Object.assign({ code: language }, config.languages[language]),
        languages: config.languages,
        setLanguage
      }),
      [language]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return LanguageProvider;
};

const createLanguageContext = <T extends string, M extends T>(
  config: LanguageConfig<T, M>
): {
  Provider: Container;
  translation: <E extends LanguageEntry>(
    entries: LanguageEntries<T, M, E>
  ) => { entries: LanguageEntries<T, M, E>; useTranslation: () => E };
  useLanguage: () => LanguageContext<T>;
} => {
  const Context = createContext<LanguageContext<T> | null>(null);
  const Provider = createLanguageProvider(Context, config);
  const useLanguage = createUseContext(Context, "Language");

  const translation = <E extends LanguageEntry>(
    entries: LanguageEntries<T, M, E>
  ): { entries: LanguageEntries<T, M, E>; useTranslation: () => E } => {
    const useTranslation = (): E => {
      const { language } = useLanguage();
      const t = useMemo(
        () => Object.assign({}, entries[config.main], entries[language.code]),
        [language.code]
      );
      return t;
    };

    return { entries, useTranslation };
  };

  return {
    Provider,
    translation,
    useLanguage
  };
};

export { createLanguageContext };

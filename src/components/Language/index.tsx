import React, { createContext, useMemo, useState } from "react";

import { createUseContext } from "utils/hooks";
import type { Container, ContainerProps, Context } from "utils/types/react";

import type {
  LanguageConfig,
  LanguageContext,
  LanguageEntries,
  LanguageEntry,
  LanguageTranslation,
  LanguageTranslationResult
} from "./types";

const createLanguageProvider = <T extends string, D extends T>(
  Context: Context<LanguageContext<T>>,
  config: LanguageConfig<T, D>
): Container => {
  const LanguageProvider = ({ children }: ContainerProps): JSX.Element => {
    const [language, setLanguage] = useState<T>(config.default);

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

const createLanguageContext = <T extends string, D extends T>(
  config: LanguageConfig<T, D>
): {
  Provider: Container;
  translation: <E extends LanguageEntry>(
    entries: LanguageEntries<T, E, D>
  ) => LanguageTranslationResult<T, E, D>;
  useLanguage: () => LanguageContext<T>;
} => {
  const Context = createContext<LanguageContext<T> | null>(null);
  const Provider = createLanguageProvider(Context, config);
  const useLanguage = createUseContext(Context, "Language");

  const translation = <E extends LanguageEntry>(
    entries: LanguageEntries<T, E, D>
  ): LanguageTranslationResult<T, E, D> => {
    const useTranslation = (): LanguageTranslation<T, E> => {
      const lang = useLanguage();
      const t = useMemo(
        () =>
          Object.assign(
            {},
            entries[config.default],
            entries[lang.language.code]
          ),
        [lang.language.code]
      );
      return { lang, t };
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

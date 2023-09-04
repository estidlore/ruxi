import type { DeepPartial, DeepRecord } from "utils/types/objects";

interface Language {
  name: string;
}

interface LanguageConfig<T extends string, D extends T> {
  default: D;
  languages: Record<T, Language>;
}

interface LanguageContext<T extends string> {
  language: Language & { code: T };
  languages: Record<T, Language>;
  setLanguage: (code: T) => void;
}

type Interpolator = <T extends unknown[]>(...vals: T) => string;
type LanguageEntry = DeepRecord<Interpolator | string>;
type LanguageEntries<
  T extends string,
  E extends LanguageEntry,
  D extends T
> = DeepPartial<Record<T, E>> & Record<D, E>;
interface LanguageTranslationResult<
  T extends string,
  E extends LanguageEntry,
  D extends T
> {
  entries: LanguageEntries<T, E, D>;
  useTranslation: () => LanguageTranslation<T, E>;
}

interface LanguageTranslation<T extends string, E extends LanguageEntry> {
  lang: LanguageContext<T>;
  t: E;
}

export type {
  Language,
  LanguageConfig,
  LanguageContext,
  LanguageEntries,
  LanguageEntry,
  LanguageTranslation,
  LanguageTranslationResult
};

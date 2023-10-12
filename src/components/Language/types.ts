import type { DeepPartial, DeepRecord } from "utils/types/objects";

interface Language {
  name: string;
}

interface LanguageConfig<T extends string, M extends T> {
  languages: Record<T, Language>;
  main: M;
}

interface LanguageContext<T extends string> {
  language: Language & { code: T };
  setLanguage: (code: T) => void;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Interpolator = (...vals: any[]) => string;
type LanguageEntry = DeepRecord<Interpolator | string>;
type LanguageEntries<
  T extends string,
  M extends T,
  E extends LanguageEntry,
> = DeepPartial<Record<T, E>> & Record<M, E>;

export type {
  Language,
  LanguageConfig,
  LanguageContext,
  LanguageEntries,
  LanguageEntry,
};

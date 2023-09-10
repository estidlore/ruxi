interface ColorSet {
  base: string;
  contrast: string;
  variant: string;
}

type Theme<T extends Exclude<string, "main" | "name"> = never> = Record<
  T | "main",
  ColorSet
>;

interface ThemeConfig<T extends string, D extends T, K extends string = never> {
  initial: D;
  themes: Record<T, Theme<K>>;
}

interface ThemeContext<T extends string, K extends string = never> {
  setTheme: (name: T) => void;
  theme: Theme<K> & { name: T };
}

export type { ColorSet, Theme, ThemeConfig, ThemeContext };

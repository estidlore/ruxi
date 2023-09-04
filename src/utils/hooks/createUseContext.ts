import { useContext } from "react";

import type { Context } from "utils/types/react";

const createUseContext = <T>(Context: Context<T>, name = ""): (() => T) => {
  return () => {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(`${name}Provider not found.`);
    }
    return context;
  };
};

export { createUseContext };

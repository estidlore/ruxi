import { useEffect, useState } from "react";

import type { AsyncResult } from "./types";

const useAsync = <T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
): AsyncResult<T> => {
  const [state, setState] = useState<AsyncResult<T>>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    fn()
      .then((data) => {
        setState({ data, status: "success" });
      })
      .catch((error) => {
        setState({ error, status: "error" });
      });
  }, deps);

  return state;
};

export { useAsync };

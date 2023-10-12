import { useReducer } from "react";

const useUpdate = <T extends object>(
  initialState: T,
): [T, (update: Partial<T>) => void] => {
  return useReducer(
    (prev: T, action: Partial<T>) => ({ ...prev, ...action }),
    initialState,
  );
};

export { useUpdate };

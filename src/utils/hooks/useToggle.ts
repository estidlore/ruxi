import { useReducer } from "react";

const useToggle = (init: boolean): [boolean, () => void] => {
  return useReducer((val: boolean) => !val, init);
};

export { useToggle };

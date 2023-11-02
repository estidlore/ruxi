// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type AsyncResult<T> =
  | {
      data: T;
      status: "success";
    }
  | {
      error: Any;
      status: "error";
    }
  | {
      status: "loading";
    };

export type { AsyncResult };

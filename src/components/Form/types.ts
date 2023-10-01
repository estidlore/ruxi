type FormValues = Record<string, unknown>;
type FormParsed<T extends FormValues> = Record<keyof T, unknown>;
type FormParser<T extends FormValues, P extends FormParsed<T>> = {
  [K in keyof T as P[K] extends T[K] ? never : K]: (val: T[K]) => P[K];
};
type FormValidator<T extends FormValues> = {
  [K in keyof T]: (val: T[K]) => string | undefined;
};

interface FormOptions<T extends FormValues, P extends FormParsed<T>> {
  initialValues: T;
  onSubmit?: (values: P) => void;
  parser?: FormParser<T, P>;
  validator?: FormValidator<T>;
}

interface FieldState<T> {
  meta: {
    error?: string;
    touched: boolean;
  };
  onBlur: () => void;
  onChange: (value: T) => void;
  value: T;
}

interface FormState<T extends FormValues> {
  fields: {
    [K in keyof T]: FieldState<T[K]>;
  };
  reset: () => void;
  submit: () => void;
}

export type {
  FormOptions,
  FormParsed,
  FormParser,
  FormState,
  FormValidator,
  FormValues,
};

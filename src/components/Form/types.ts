type FormValues = Record<string, unknown>;
type FormValidator<T extends FormValues> = {
  [K in keyof T]: (val: T[K]) => string | undefined;
};

interface FormOptions<T extends FormValues> {
  initialValues: T;
  onSubmit?: (values: T) => void;
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

export type { FormOptions, FormState, FormValidator, FormValues };

import { useCallback, useMemo } from "react";

import { useUpdate } from "utils/hooks";

import type {
  FormOptions,
  FormState,
  FormValidator,
  FormValues,
} from "./types";

const getInitTouches = <T extends FormValues>(
  initialValues: T,
): Record<keyof T, boolean> => {
  const touches = {} as Record<keyof T, boolean>;
  Object.keys(initialValues).forEach((field: keyof T) => {
    touches[field] = false;
  });
  return touches;
};

const getInitErrors = <T extends FormValues>(
  initialValues: T,
  validator?: FormValidator<T>,
): Record<keyof T, string | undefined> => {
  const errors = {} as Record<keyof T, string | undefined>;
  Object.keys(initialValues).forEach((field: keyof T) => {
    errors[field] = validator?.[field](initialValues[field]);
  });
  return errors;
};

const useForm = <T extends FormValues>({
  initialValues,
  onSubmit,
  validator,
}: FormOptions<T>): FormState<T> => {
  const initErrors = useMemo(() => getInitErrors(initialValues, validator), []);
  const initTouches = useMemo(() => getInitTouches(initialValues), []);

  const [errors, updateErrors] = useUpdate(initErrors);
  const [touches, setTouches] = useUpdate(initTouches);
  const [values, setValues] = useUpdate(initialValues);

  const validate = useCallback((field: keyof T, value: T[keyof T]): void => {
    const error = validator?.[field](value);
    updateErrors({ [field]: error } as object);
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    updateErrors(initErrors);
    setTouches(initTouches);
  }, []);

  const submit = useCallback(() => {
    onSubmit?.(values);
    reset();
  }, [values]);

  const fields = {} as FormState<T>["fields"];
  Object.keys(initialValues).forEach((field: keyof T) => {
    fields[field] = {
      meta: { error: errors[field], touched: touches[field] },
      onBlur: (): void => {
        setTouches({ [field]: true } as object);
      },
      onChange: (value): void => {
        setValues({ [field]: value } as object);
        validate(field, value);
      },
      value: values[field],
    };
  });

  return { fields, reset, submit };
};

export { useForm };

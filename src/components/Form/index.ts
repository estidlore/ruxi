import { useCallback, useMemo } from "react";

import { useUpdate } from "utils/hooks";

import type {
  FormOptions,
  FormParsed,
  FormParser,
  FormState,
  FormValidator,
  FormValues,
  YupSchema,
} from "./types";

const getValidator = <T extends FormValues, P extends FormParsed<T>>(
  validation?: FormValidator<T> | YupSchema<P>,
): FormValidator<T> | undefined => {
  if (validation?.hasOwnProperty("fields")) {
    const schema = validation as YupSchema<P>;
    const validator = {} as FormValidator<T>;
    Object.keys(schema.fields).forEach((field: keyof T) => {
      validator[field] = (value): string | undefined => {
        try {
          schema.validateSyncAt(field as string, { [field]: value });
          return undefined;
        } catch (error: unknown) {
          return (error as { errors: string[] }).errors[0];
        }
      };
    });
    return validator;
  }
  return validation as FormValidator<T> | undefined;
};

const getTouches = <T extends FormValues>(
  initialValues: T,
  touched = false,
): Record<keyof T, boolean> => {
  const touches = {} as Record<keyof T, boolean>;
  Object.keys(initialValues).forEach((field: keyof T) => {
    touches[field] = touched;
  });
  return touches;
};

const getErrors = <T extends FormValues>(
  initialValues: T,
  validator?: FormValidator<T>,
): Record<keyof T, string | undefined> => {
  const errors = {} as Record<keyof T, string | undefined>;
  Object.keys(initialValues).forEach((field: keyof T) => {
    errors[field] = validator?.[field](initialValues[field]);
  });
  return errors;
};

const getParser = <T extends FormValues, P extends FormParsed<T>>(
  parser?: FormParser<T, P>,
): ((values: T) => P) => {
  return (values) => {
    const parsed = Object.assign({}, values) as P;
    if (parser === undefined) {
      return parsed;
    }
    Object.keys(parser).map((key: keyof T) => {
      const value = values[key];
      const parse = parser[key as keyof FormParser<T, P>];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed[key as keyof P] = parse(value as any) as P[keyof P];
    });
    return parsed;
  };
};

const useForm = <T extends FormValues, P extends FormParsed<T>>({
  initialValues,
  onSubmit,
  parser,
  validation,
}: FormOptions<T, P>): FormState<T> => {
  const parse = useMemo(() => getParser(parser), []);
  const validator = useMemo(() => getValidator(validation), []);

  const [errors, updateErrors] = useUpdate(getErrors(initialValues, validator));
  const [touches, updateTouches] = useUpdate(getTouches(initialValues));
  const [values, updateValues] = useUpdate(initialValues);

  const isValid = useMemo(() => {
    return Object.values(errors).every((el) => el === undefined);
  }, [errors]);

  const validate = useCallback((field: keyof T, value: T[keyof T]): void => {
    const error = validator?.[field](value);
    updateErrors({ [field]: error } as object);
  }, []);

  const reset = useCallback(() => {
    updateValues(initialValues);
    updateErrors(getErrors(initialValues, validator));
    updateTouches(getTouches(initialValues));
  }, []);

  const touch = useCallback(() => {
    updateTouches(getTouches(initialValues, true));
  }, []);

  const submit = useCallback(() => {
    if (isValid) {
      onSubmit?.(parse(values));
      reset();
    } else {
      touch();
    }
  }, [isValid, values]);

  const fields = {} as FormState<T>["fields"];
  Object.keys(initialValues).forEach((field: keyof T) => {
    fields[field] = {
      meta: { error: errors[field], touched: touches[field] },
      onBlur: (): void => {
        updateTouches({ [field]: true } as object);
      },
      onChange: (value): void => {
        updateValues({ [field]: value } as object);
        validate(field, value);
      },
      value: values[field],
    };
  });

  return { fields, isValid, reset, submit };
};

export { useForm };

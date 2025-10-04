import type { Option } from "react-multi-select-component";

/**
 * Can be used for a component that only requires children as a prop as below.
 *
 * ```tsx
 * const Component:FC<PropsWithChildren> = ({children}) => {
 *    return <>
 *      ...
 *      {children}
 *    </>;
 * }
 * ```
 *
 * In case of a component that requires children and more props,
 * this interface can be extended as shown below
 * ```tsx
 * export interface SomeComponentProps extends PropsWithChildren {
 *    ...
 * }
 * ```
 */
export interface PropsWithChildren {
  children: ReactNode;
}

// A type used in react-bootstrap that isn't exported publicly
export type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/**
 * When responses from API are successful, response data comes in this form.
 * Errors are handled through catch block
 * ```ts
 * try {
 *   const response = await axiosPrivate.get<ResponseData<Entity>>("/someEndpoint");
 *   const data = response.data.data;
 *   ...
 * } catch (error) {
 *   // handle errors
 * }
 * ```
 */
export interface ResponseData<T> {
  data: T;
}

export type ValidatorErrors<T> = Partial<{ [key in keyof T]: string }>;

/**
 * A schema is defined by passing the interface of the Entity it wants to
 * validate as a parameter to the generic ValidationSchema interface
 * the schema definition expects that functions for each property in the
 * parameter interface will be defined that will throw error for
 * any validation violations that may be there.
 */
export type ValidationSchema<T> = {
  [key in keyof T]?: (value?: T[keyof T] | null) => void;
};

/**
 * this is a generic interface to keep a boolean value for each property
 * of interface T. It is used in the useValidator hook to keep track of
 * which fields a user has interacted with in a form.
 */
export type FormTouchedFields<T> = Partial<{ [key in keyof T]: boolean }>;

/**
 * This is the type of a function that can be used with the useValidator hook
 * for validations that aren't easily defined in a schema object
 * (ex: comparing different fields).
 * Functions of this type assumes that the data being validated and the previously
 * validated errors are given and more validations are done on top of them.
 */
export type CustomValidatorFunction<T> = (
  data: T,
  errors: ValidatorErrors<T>,
) => ValidatorErrors<T>;

/**
 * This is a generic interface to use instead of the Option interface provided by
 * react-multi-select-component. The correct type for the values can be set instead
 * of the `any` used by rmsc.
 */
export interface MultiSelectOption<T> extends Option {
  value: T;
  options?: Exclude<MultiSelectOption<T>, "options">[];
}

/**
 * A generic type to represent an object of type O (usually formData)
 * which has a key of type K that holds a value of a specific type T
 * and may hold other unknown values in other keys
 */
export type ManagedState<T, O, K> = {
  [key in keyof O]: key extends K ? T | null | undefined : unknown;
};

export type Variant =
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "secondary"
  | "info"
  | "light"
  | "dark";

export interface ApprovalResponseType {
  data: string;
  emailLogId: number;
}

export interface GenericPaginatedResponse<T> {
  totalCount: number;
  data: T[];
}

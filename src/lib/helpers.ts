/**
 * Converts a Drizzle query result (or array of results) to a specified type.
 * This helper provides type safety when working with Drizzle ORM results.
 *
 * @template T - The target type to convert to (e.g., ProductSelect, CartItemSelect)
 * @param data - Single object or array of objects from Drizzle query
 * @returns The data cast to the specified type T or T[]
 *
 * @example
 * // Single object
 * const product = convertDrizzleToObject<ProductSelect>(dbResult);
 *
 * @example
 * // Array of objects
 * const products = convertDrizzleToObject<ProductSelect>(dbResults);
 */
export function convertDrizzleToObject<T>(data: unknown): T;
export function convertDrizzleToObject<T>(data: Array<unknown>): Array<T>;
export function convertDrizzleToObject<T>(
  data: unknown | Array<unknown>,
): T | Array<T> {
  if (Array.isArray(data)) {
    return data as Array<T>;
  }
  return data as T;
}

/**
 * Safely converts a single Drizzle query result to a specified type.
 * Returns null if the data is null or undefined.
 *
 * @template T - The target type to convert to
 * @param data - Single object from Drizzle query or null/undefined
 * @returns The data cast to type T or null
 *
 * @example
 * const product = convertDrizzleToObjectOrNull<ProductSelect>(dbResult);
 * if (product) {
 *   // product is typed as ProductSelect
 * }
 */
export function convertDrizzleToObjectOrNull<T>(
  data: unknown | null | undefined,
): T | null {
  if (data === null || data === undefined) {
    return null;
  }
  return data as T;
}

/**
 * Converts TanStack React Form errors to FieldError component format.
 * Filters out undefined values and wraps strings in message objects.
 *
 * @param errors - Array of error strings or undefined from TanStack React Form
 * @returns Array of error objects compatible with FieldError component
 *
 * @example
 * const fieldErrors = convertFormErrors(field.state.meta.errors);
 * <FieldError errors={fieldErrors} />
 */
export function convertFormErrors(
  errors: Array<string | undefined>,
): Array<{ message: string }> {
  return errors
    .filter((error): error is string => error !== undefined)
    .map(error => ({ message: error }));
}

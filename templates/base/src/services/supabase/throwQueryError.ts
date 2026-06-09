/** Wraps Supabase/PostgREST errors so callers throw a real `Error` (with `cause`). */
export function throwQueryError(error: { message: string }): never {
  const wrapped = new Error(error.message);
  wrapped.cause = error;
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw wrapped;
}

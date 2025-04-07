
/**
 * Calculates the backoff time for a retry attempt.
 * @param attempt The current retry attempt number.
 * @param initialBackoff The initial backoff time in milliseconds.
 * @param factor The backoff factor to multiply the initial backoff by.
 * @param maxBackoff The maximum backoff time in milliseconds.
 * @returns The calculated backoff time in milliseconds.
 **/
export const calculateBackoff = (attempt: number, initialBackoff: number, factor: number, maxBackoff?: number) => {
  const exponentialBackoff = initialBackoff * Math.pow(factor, attempt);
  const backoff = maxBackoff ? Math.min(exponentialBackoff, maxBackoff) : exponentialBackoff;
  return backoff * (0.8 + Math.random() * 0.4);
};

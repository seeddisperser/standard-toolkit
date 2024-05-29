/**
 * Returns the value nearest to value which is within the closed range [min,max].
 *
 */
export function clamp<T extends number, Min extends number, Max extends number>(
  value: T,
  min: Min,
  max: Max,
): T | Min | Max {
  // TODO: do we want to handle this differently? A range error is quite explicit
  if (min > max) {
    throw new RangeError('min exceeded max');
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

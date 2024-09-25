const trueRegex = /^(?:y|yes|true|1|on)$/i;
const falseRegex = /^(?:n|no|false|0|off)$/i;

/**
 * Ensures value is cast as string and trimmed
 */
function normalize(val: unknown) {
  return `${val}`.trim();
}

/**
 * Compare the given value against a custom list of `truthy` values.
 *
 * String values are not case sensitive.
 *
 * _1, '1', 'y', 'yes', 'on', 'true', true_
 *
 * @pure
 *
 * @example
 * isTrue('on');
 * // true
 *
 * isTrue('yes');
 * // true
 *
 * isTrue('off');
 * // false
 *
 * isTrue('no');
 * // false
 */
export function isTrue(val: unknown) {
  const normalized = normalize(val);
  return trueRegex.test(normalized);
}

/**
 * Compare the given value against a custom list of `truthy` values.
 *
 * String values are not case sensitive.
 *
 * _1, '1', 'y', 'yes', 'on', 'true', true_
 *
 * @pure
 *
 * @example
 * isYes('on');
 * // true
 *
 * isYes('yes');
 * // true
 *
 * isYes('off');
 * // false
 *
 * isYes('no');
 * // false
 */
export function isYes(val: unknown) {
  return isTrue(val);
}

/**
 * Compare the given value against a custom list of `falsey` values.
 *
 * String values are not case sensitive.
 *
 * _0, '0', 'n', 'no', 'off', 'false', false_
 *
 * @pure
 *
 * @example
 * isFalse('on');
 * // false
 *
 * isFalse('yes');
 * // false
 *
 * isFalse('off');
 * // true
 *
 * isFalse('no');
 * // true
 */
export function isFalse(val: unknown) {
  const normalized = normalize(val);
  return falseRegex.test(normalized);
}

/**
 * Compare the given value against a custom list of `falsey` values.
 *
 * String values are not case sensitive.
 *
 * _0, '0', 'n', 'no', 'off', 'false', false_
 *
 * @pure
 *
 * @example
 * isNo('on');
 * // false
 *
 * isNo('yes');
 * // false
 *
 * isNo('off');
 * // true
 *
 * isNo('no');
 */
export function isNo(val: unknown) {
  return isFalse(val);
}

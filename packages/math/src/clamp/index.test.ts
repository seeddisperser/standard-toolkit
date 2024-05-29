import { describe, it, expect } from 'vitest';
import { clamp } from './';

describe('clamp', () => {
  it('clamps value', () => {
    expect(clamp(0, 1, 2)).toBe(1);
    expect(clamp(3, 1, 2)).toBe(2);
    expect(clamp(2, 1, 3)).toBe(2);
  });

  it('throws when min is greater than max', () => {
    expect(() => clamp(1, 1, 0)).toThrow(RangeError);
  });
});

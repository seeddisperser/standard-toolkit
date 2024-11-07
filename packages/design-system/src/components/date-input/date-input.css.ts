import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars } from '../../styles';
import { containerQueries } from '../../utils';
import type { DateInputClassNames, DateInputState } from './types';

export const dateInputContainer = createContainer();
export const dateSegmentsContainer = createContainer();

export const dateInputStateVars = createThemeContract({
  size: '',
  isHovered: '',
  isFocusWithin: '',
  isFocusVisible: '',
  isDisabled: '',
  isInvalid: '',
});

export const dateSegmentStateVars = createThemeContract({
  isHovered: '',
  isFocusWithin: '',
  isFocusVisible: '',
  isDisabled: '',
  isInvalid: '',
});

export const dateInputSpaceVars = createThemeContract({
  input: {
    x: '',
    y: '',
    gap: '',
    minWidth: '',
    width: '',
    maxWidth: '',
  },
  segments: {
    gap: '',
  },
});

export const dateInputColorVars = createThemeContract({
  border: '',
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const dateInputClassNames: DateInputClassNames = {
  input: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: dateInputContainer,
        },
      },
    }),
    input: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          gap: dateInputSpaceVars.input.gap,
          padding: `${fallbackVar(dateInputSpaceVars.input.y, '0')} ${fallbackVar(dateInputSpaceVars.input.x, '0')}`,
          border: `1px solid ${fallbackVar(dateInputColorVars.border, 'transparent')}`,
          borderRadius: radiusVars.sm,
          minWidth: fallbackVar(dateInputSpaceVars.input.minWidth, 'auto'),
          width: fallbackVar(dateInputSpaceVars.input.width, 'fit-content'),
          maxWidth: fallbackVar(dateInputSpaceVars.input.maxWidth, '100%'),
          '@container': containerQueries<DateInputState>(dateInputStateVars, {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          }),
        },
      },
    }),
    segments: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          gap: dateInputSpaceVars.segments.gap,
        },
      },
    }),
  },
  segment: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: dateSegmentsContainer,
        },
      },
    }),
  },
};

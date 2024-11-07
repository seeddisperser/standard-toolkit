import { style } from '@vanilla-extract/css';
import {
  type DateInputState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  dateInputColorVars,
  dateInputSpaceVars,
  dateInputStateVars,
  semanticColorVars,
  sizeVars,
} from '../../src';

export const DateInput: ThemeContext['DateInput'] = {
  input: {
    input: style(
      applyThemeVars<DateInputState>(dateInputStateVars, [
        {
          vars: assignPartialVars(
            { color: dateInputColorVars, space: dateInputSpaceVars },
            {
              color: {
                border: semanticColorVars.border.interactive.default,
              },
              space: {
                input: {
                  gap: sizeVars.v03,
                  y: sizeVars.v04,
                  x: sizeVars.v04,
                },
              },
            },
          ),
        },
        {
          query: { size: 'sm' },
          vars: assignPartialVars(dateInputSpaceVars, {
            input: {
              maxWidth: '200px',
              x: sizeVars.v03,
              y: sizeVars.v02,
            },
          }),
        },
        {
          query: { size: 'lg' },
          vars: assignPartialVars(dateInputSpaceVars, {
            input: {
              maxWidth: '400px',
              x: sizeVars.v04,
              y: sizeVars.v03,
            },
          }),
        },
        {
          query: { isHovered: true },
          vars: assignPartialVars(dateInputColorVars, {
            border: semanticColorVars.border.interactive.hover,
          }),
        },
      ]),
    ),
    segments: style(
      applyThemeVars<DateInputState>(dateInputStateVars, [
        {
          vars: assignPartialVars(dateInputSpaceVars, {
            segments: {
              gap: sizeVars.v03,
            },
          }),
        },
      ]),
    ),
  },
};

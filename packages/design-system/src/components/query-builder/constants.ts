import { createContext } from 'react';
import type { QueryBuilderContextValue } from './types';

export const defaultOrientation = 'horizontal';

export const defaultSize = 'sm';

export const QueryBuilderContext = createContext<QueryBuilderContextValue>({
  controlElements: {
    ruleGroupBodyElements: () => null,
    ruleGroupFooterElements: () => null,
    ruleGroupHeaderElements: () => null,
  },
  orientation: defaultOrientation,
  size: defaultSize,
});

export const multiValueOperators = [
  'between',
  'notBetween',
  'during',
  'overlapped',
  'overlaps',
];

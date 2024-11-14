import { createContext } from 'react';
import type { QueryBuilderContextValue } from './types';

export const defaultSize = 'sm';

export const defaultLayout = 'row';

export const QueryBuilderContext = createContext<QueryBuilderContextValue>({
  controlElements: {
    ruleGroupBodyElements: () => null,
    ruleGroupFooterElements: () => null,
    ruleGroupHeaderElements: () => null,
  },
  size: defaultSize,
  layout: defaultLayout,
});

export const multiValueOperators = [
  'between',
  'notBetween',
  'during',
  'overlapped',
  'overlaps',
];

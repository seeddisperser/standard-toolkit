export type SortDirectionKey = keyof typeof SORT_DIRECTION;
export type SortDirection = (typeof SORT_DIRECTION)[SortDirectionKey];
export type HeaderColumnActionKey = keyof typeof HEADER_COLUMN_ACTION;
export type HeaderColumnAction = (typeof HEADER_COLUMN_ACTION)[HeaderColumnActionKey];

export const SORT_DIRECTION = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
} as const);

export const HEADER_COLUMN_ACTION = Object.freeze({
    NUMERAL: 'numeral',
    KEBAB: 'kebab',
    SELECTION: 'selection'
} as const);
import type { ReactElement } from 'react';
import type {
  DateInputProps as RACDateInputProps,
  DateInputRenderProps as RACDateInputRenderProps,
  DateSegmentProps as RACDateSegmentProps,
  DateSegmentRenderProps as RACDateSegmentRenderProps,
} from 'react-aria-components';
import type { DateSegment as TDateSegment } from 'react-stately';
import type { PartialDeep } from 'type-fest';
import type { AsType, RenderPropsChildren } from '../../types';

export type DateInputSizes = 'sm' | 'lg';

export type DateInputMapping = {
  input: Partial<Record<DateInputSizes, string>>;
};

type BaseDateInputProps = {
  classNames?: DateInputClassNames;
  mapping?: DateInputMapping;
  size?: DateInputSizes;
};

export type DateInputClassNames = PartialDeep<{
  input: {
    container: string;
    input: string;
    segments: string;
  };
  segment: {
    container: string;
    segment: string;
  };
}>;

export type DateInputProps = Omit<
  RACDateInputProps,
  'className' | 'style' | 'children'
> &
  (
    | { provider?: false; children?: (segment: TDateSegment) => ReactElement }
    | { provider: true; children?: RenderPropsChildren<DateInputRenderProps> }
  ) &
  BaseDateInputProps;

export type DateInputRenderProps = AsType<RACDateInputRenderProps>;

export type DateInputState = DateInputRenderProps &
  Required<Pick<BaseDateInputProps, 'size'>>;

export type DateSegmentsProps = {
  children: any; //TODO
} & BaseDateInputProps;

export type DateSegmentProps = AsType<RACDateSegmentProps> & BaseDateInputProps;

export type DateSegmentRenderProps = RACDateSegmentRenderProps;

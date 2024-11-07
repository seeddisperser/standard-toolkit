import { createCalendar } from '@internationalized/date';
import {
  type ForwardedRef,
  Fragment,
  cloneElement,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { useDateField } from 'react-aria';
import {
  type ContextValue,
  DateFieldStateContext,
  Group,
  Provider,
  DateSegment as RACDateSegment,
  type SlotProps,
  TimeFieldStateContext,
  useLocale,
} from 'react-aria-components';
import { useDateFieldState } from 'react-stately';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { inputs } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaGroupContext } from '../aria';
import type { DateFieldProps } from '../date-field';
import { DateFieldContext } from '../date-field/date-field';
import { Input } from '../input';
import {
  dateInputClassNames,
  dateInputStateVars,
  dateSegmentStateVars,
} from './date-input.css';
import type {
  DateInputProps,
  DateInputRenderProps,
  DateSegmentProps,
  DateSegmentRenderProps,
  DateSegmentsProps,
} from './types';

const defaultMapping = {
  input: {
    sm: inputs.sm,
    lg: inputs.lg,
  },
};

const defaultSize = 'lg';

export const DateInputContext =
  createContext<ContextValue<DateInputProps, HTMLDivElement>>(null);

export const DateInput = forwardRef(function DateInput(
  props: DateInputProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DateInputContext);
  props = useDefaultProps(props, 'DateInput');

  const dateFieldState = useContext(DateFieldStateContext);
  const timeFieldState = useContext(TimeFieldStateContext);

  return dateFieldState || timeFieldState ? (
    <DateInputInner {...props} ref={ref} />
  ) : (
    <DateInputStandalone {...props} ref={ref} />
  );
});

const DateInputInner = forwardRef(
  (props: DateInputProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      children: childrenProp,
      classNames: classNamesProp,
      mapping: mappingProp,
      size = defaultSize,
      provider,
      ...rest
    } = props;

    const dateFieldState = useContext(DateFieldStateContext);
    const timeFieldState = useContext(TimeFieldStateContext);
    const state = dateFieldState ?? timeFieldState ?? null;

    const theme = useTheme();

    const mapping = useMemo(
      () => ({
        ...defaultMapping,
        ...mappingProp,
      }),
      [mappingProp],
    );

    const classNames = useMemo(
      () =>
        mergeClassNames(dateInputClassNames, theme.DateInput, classNamesProp, {
          input: { input: mapping.input[size] },
        }),
      [theme.DateInput, classNamesProp, mapping, size],
    );

    const style = useCallback(
      (renderProps: DateInputRenderProps) =>
        inlineVars(dateInputStateVars, { ...renderProps, size }),
      [size],
    );

    // TODO: clone element here is really gross
    const children = useCallback(
      (renderProps: DateInputRenderProps) => (
        <div className={classNames?.input?.input}>
          {childrenProp &&
            (provider ? (
              callRenderProps(childrenProp, { ...renderProps, ...state })
            ) : (
              <>
                {state.segments.map((segment, i) => (
                  <Fragment key={i}>{childrenProp(segment)}</Fragment>
                ))}
              </>
            ))}
        </div>
      ),
      [childrenProp, state, provider, classNames?.input],
    );

    return (
      <>
        <Group
          ref={ref}
          {...rest}
          className={classNames?.input?.container}
          style={style}
        >
          {children}
        </Group>
        <Input />
      </>
    );
  },
);

// TODO: slot context? what slots?
// TODO: this is copy pasta from react-aria and needs work
const DateInputStandalone = forwardRef(
  (props: DateInputProps, ref: ForwardedRef<HTMLDivElement>) => {
    const [dateFieldProps, fieldRef] = useContextProps(
      { slot: props.slot } as DateFieldProps<any>,
      ref,
      DateFieldContext,
    );
    const { locale } = useLocale();
    const state = useDateFieldState({
      ...dateFieldProps,
      locale,
      createCalendar,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const { fieldProps } = useDateField(
      { ...dateFieldProps, inputRef },
      state,
      fieldRef,
    );

    return (
      <Provider
        values={[
          [DateFieldStateContext, state],
          [AriaGroupContext, { ...fieldProps, isInvalid: state.isInvalid }],
        ]}
      >
        <DateInputInner {...props} ref={ref} />
      </Provider>
    );
  },
);

export const DateSegments = forwardRef(
  (props: DateSegmentsProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, classNames: classNamesProp } = props;

    const dateFieldState = useContext(DateFieldStateContext);
    const timeFieldState = useContext(TimeFieldStateContext);
    const state = dateFieldState ?? timeFieldState ?? null;

    const theme = useTheme();

    const classNames = useMemo(
      () =>
        mergeClassNames(dateInputClassNames, theme.DateInput, classNamesProp),
      [theme.DateInput, classNamesProp],
    );

    return (
      <div className={classNames?.input?.segments} ref={ref}>
        {state.segments.map((segment, i) => (
          <Fragment key={i}>{children(segment)}</Fragment>
        ))}
      </div>
    );
  },
);

export const DateSegmentContext =
  createContext<ContextValue<SlotProps, HTMLDivElement>>(null);

export const DateSegment = forwardRef(function DateSegment(
  props: DateSegmentProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DateSegmentContext);

  const { classNames: classNamesProp, children: childrenProp, ...rest } = props;

  const classNames = useMemo(
    () => mergeClassNames(dateInputClassNames, classNamesProp),
    [classNamesProp],
  );

  const style = useCallback(
    (renderProps: DateSegmentRenderProps) =>
      inlineVars(dateSegmentStateVars, {
        ...renderProps,
      }),
    [],
  );

  // const children = useCallback(
  //   (renderProps: DateSegmentRenderProps) => {
  //     return (
  //       <div className={classNames?.segment?.segment}>
  //         {callRenderProps(childrenProp, {
  //           ...renderProps,
  //           defaultChildren: null,
  //         })}
  //       </div>
  //     );
  //   },
  //   [childrenProp, classNames?.segment],
  // );

  return (
    <RACDateSegment
      ref={ref}
      {...rest}
      style={style}
      className={classNames?.segment?.container}
    >
      {childrenProp}
    </RACDateSegment>
  );
});

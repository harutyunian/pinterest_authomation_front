import {
  Select,
  type SelectChangeEvent,
  type SelectProps,
} from '@mui/material';
import { forwardRef } from 'react';

/**
 * MUI Select can trigger native form submission (full page reload) on mousedown
 * when used near buttons or implicit forms. preventDefault on mousedown fixes this.
 */
export const AppSelect = forwardRef(function AppSelect<Value = unknown>(
  props: SelectProps<Value>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { onMouseDown, ...rest } = props;

  return (
    <Select
      ref={ref}
      {...rest}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
    />
  );
}) as <Value = unknown>(
  props: SelectProps<Value> & { ref?: React.Ref<HTMLDivElement> },
) => React.JSX.Element;

export type { SelectChangeEvent };

import { ComponentProps } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import { Input as InputComponent } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { FormField } from '@/shared/types/blocks/form';

export function Input({
  field,
  formField,
  data: _data,
  className,
  ...props
}: {
  field: FormField;
  formField: ControllerRenderProps<Record<string, unknown>, string>;
  data?: any;
} & Omit<ComponentProps<typeof InputComponent>, 'field' | 'formField'>) {
  const { value, ...formFieldProps } = formField;

  return (
    <InputComponent
      {...formFieldProps}
      value={(value ?? '') as string | number | readonly string[]}
      type={field.type || 'text'}
      placeholder={field.placeholder}
      className={cn(
        'bg-background placeholder:text-base-content/50 rounded-md',
        className
      )}
      {...props}
      {...field.attributes}
    />
  );
}

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

type FieldWrapProps = {
  id: string;
  label: string;
  sublabel?: string;
  error?: string;
  children: ReactNode;
};

export function FieldWrap({ id, label, sublabel, error, children }: FieldWrapProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-sm font-semibold text-foreground">
        {label}
      </label>
      {sublabel && <span className="mt-0.5 block text-xs text-muted">{sublabel}</span>}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClasses =
  'w-full min-h-[48px] rounded-card border border-border bg-panel px-4 text-base text-foreground placeholder:text-muted focus:border-sky';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string };

export function TextInput({ id, error, className = '', ...rest }: TextInputProps) {
  return (
    <input
      id={id}
      className={`${inputClasses} ${className}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...rest}
    />
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; error?: string };

export function TextArea({ id, error, className = '', ...rest }: TextAreaProps) {
  return (
    <textarea
      id={id}
      className={`${inputClasses} min-h-[120px] py-3 ${className}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...rest}
    />
  );
}

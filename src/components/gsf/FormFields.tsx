import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { FieldError } from "react-hook-form";

// ─── Field ────────────────────────────────────────────────────────────────────
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  hint?: string;
  className?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, className, id, name, ...props }, ref) => {
    const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={fieldId} className="text-sm font-semibold text-foreground">
          {label}
          {props.required && <span className="ml-1 text-destructive">*</span>}
        </label>
        <input
          ref={ref}
          id={fieldId}
          name={name}
          aria-invalid={!!error}
          className={cn(
            "flex h-11 w-full rounded-xl border bg-background px-4 py-2 text-sm transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive" : "border-input"
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
        {error?.message && (
          <p className="text-xs text-destructive" role="alert">{error.message}</p>
        )}
      </div>
    );
  }
);
Field.displayName = "Field";

// ─── TextareaField ────────────────────────────────────────────────────────────
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  hint?: string;
  className?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, className, id, name, ...props }, ref) => {
    const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={fieldId} className="text-sm font-semibold text-foreground">
          {label}
          {props.required && <span className="ml-1 text-destructive">*</span>}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          name={name}
          aria-invalid={!!error}
          rows={4}
          className={cn(
            "flex w-full rounded-xl border bg-background px-4 py-3 text-sm transition-colors resize-y min-h-[100px]",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive" : "border-input"
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
        {error?.message && (
          <p className="text-xs text-destructive" role="alert">{error.message}</p>
        )}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

// ─── SelectField ──────────────────────────────────────────────────────────────
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, className, id, name, ...props }, ref) => {
    const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={fieldId} className="text-sm font-semibold text-foreground">
          {label}
          {props.required && <span className="ml-1 text-destructive">*</span>}
        </label>
        <select
          ref={ref}
          id={fieldId}
          name={name}
          aria-invalid={!!error}
          className={cn(
            "flex h-11 w-full rounded-xl border bg-background px-4 py-2 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive" : "border-input"
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error?.message && (
          <p className="text-xs text-destructive" role="alert">{error.message}</p>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

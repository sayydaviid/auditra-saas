import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', id, ...props }, ref) {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <label className={`field ${className}`} htmlFor={inputId}>
      {label && <span className="field-label">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        className={`input ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error && <small className="field-error" id={errorId}>{error}</small>}
    </label>
  );
});

export default Input;

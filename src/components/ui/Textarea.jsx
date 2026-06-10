import { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea({ label, error, className = '', id, ...props }, ref) {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <label className={`field ${className}`} htmlFor={textareaId}>
      {label && <span className="field-label">{label}</span>}
      <textarea
        ref={ref}
        id={textareaId}
        className={`input textarea ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error && <small className="field-error" id={errorId}>{error}</small>}
    </label>
  );
});

export default Textarea;

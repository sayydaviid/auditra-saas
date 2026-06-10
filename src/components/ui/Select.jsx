import { forwardRef, useId } from 'react';

const Select = forwardRef(function Select({ label, error, options = [], placeholder = 'Selecione', className = '', id, ...props }, ref) {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <label className={`field ${className}`} htmlFor={selectId}>
      {label && <span className="field-label">{label}</span>}
      <select
        ref={ref}
        id={selectId}
        className={`input select ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const text = typeof option === 'string' ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
      {error && <small className="field-error" id={errorId}>{error}</small>}
    </label>
  );
});

export default Select;

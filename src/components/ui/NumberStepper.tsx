interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
}

export function NumberStepper({ value, onChange, step = 1, min = 0 }: NumberStepperProps) {
  return (
    <div className="number-stepper">
      <button
        type="button"
        className="number-stepper__btn"
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="number-stepper__value">{value}</span>
      <button
        type="button"
        className="number-stepper__btn"
        onClick={() => onChange(value + step)}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

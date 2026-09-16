import { NumberStepper } from "@/components/ui/NumberStepper";
import { Button } from "@/components/ui/Button";
import type { Exercise } from "@/types";

interface ExerciseStepCardProps {
  exercise: Exercise;
  value: number;
  onChange: (value: number) => void;
  personalBest?: number;
  onDone: () => void;
  currentIndex: number;
  totalSteps: number;
}

export function ExerciseStepCard({
  exercise,
  value,
  onChange,
  personalBest,
  onDone,
  currentIndex,
  totalSteps,
}: ExerciseStepCardProps) {
  const unit = exercise.type === "duration" ? "minutes" : "reps";

  return (
    <div className="exercise-step-card">
      <div className="step-progress">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`step-progress__dot${
              i < currentIndex ? " step-progress__dot--done" : i === currentIndex ? " step-progress__dot--current" : ""
            }`}
          />
        ))}
      </div>
      <h2 className="exercise-step-card__name">{exercise.name}</h2>
      <NumberStepper
        value={value}
        onChange={onChange}
        step={exercise.type === "duration" ? 5 : 1}
      />
      <p className="exercise-step-card__unit">{unit}</p>
      {personalBest !== undefined && personalBest > 0 && (
        <p
          className={`exercise-step-card__pb${
            value >= personalBest ? " exercise-step-card__pb--beat" : ""
          }`}
        >
          {value} / {personalBest} — your best
        </p>
      )}
      <Button variant="primary" size="lg" block onClick={onDone}>
        ✓ Done
      </Button>
    </div>
  );
}

"use client";

import { Modal } from "@/components/ui/Modal";
import type { Exercise } from "@/types";

interface ExercisePickerModalProps {
  exercises: Exercise[];
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
}

export function ExercisePickerModal({ exercises, onSelect, onClose }: ExercisePickerModalProps) {
  return (
    <Modal title="Add Exercise" onClose={onClose}>
      {exercises.length === 0 ? (
        <p className="empty-state">All exercises are already in this workout.</p>
      ) : (
        exercises.map((exercise) => (
          <button
            type="button"
            key={exercise.id}
            className="list-row"
            onClick={() => onSelect(exercise.id)}
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
          >
            <div className="list-row__main">
              <div className="list-row__name">{exercise.name}</div>
              <div className="list-row__meta">{exercise.type === "reps" ? "Reps" : "Duration (min)"}</div>
            </div>
          </button>
        ))
      )}
    </Modal>
  );
}

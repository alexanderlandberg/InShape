import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { Workout } from "@/types";

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link href={`/workouts/${workout.id}/edit`}>
      <Card interactive style={{ marginBottom: "0.75rem" }}>
        <div className="list-row" style={{ border: "none", padding: 0 }}>
          <div className="list-row__main">
            <div className="list-row__name">{workout.name}</div>
            <div className="list-row__meta">{workout.exercises.length} exercises</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

import { FC } from "react";
import { Habit } from "@/types";
import { useHabitStats } from "@/hooks/useHabitStats";
import { Flame, CheckCircle2 } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export const HabitCard: FC<HabitCardProps> = ({
  habit,
  onEdit,
}) => {
  const { streak, totalCompletions, loading } = useHabitStats(habit.id);
  const isAvoid = habit.goal === "avoid";

  return (
    <div 
        className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => onEdit(habit)}
    >
      {/* Left: Habit name */}
      <span className="text-base text-gray-900">
        {habit.name}
      </span>

      {/* Right: Stats */}
      <div className="flex items-center gap-3 text-xs flex-shrink-0 p-2">
        <div className={`flex items-center gap-1 ${isAvoid ? "text-red-500" : "text-orange-500"}`}>
          <Flame className="h-3.5 w-3.5" />
          <span className="font-medium">
            {loading ? "..." : streak} {isAvoid ? "free" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1 text-blue-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span className="font-medium">
            {loading ? "..." : totalCompletions}
          </span>
        </div>
      </div>
    </div>
  );
};

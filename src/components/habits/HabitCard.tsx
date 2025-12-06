import { FC } from "react";
import { Habit } from "@/types";
import { useHabitStats } from "@/hooks/useHabitStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Flame, Calendar, CheckCircle2 } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onArchive: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export const HabitCard: FC<HabitCardProps> = ({
  habit,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const { streak, weeklyCompletions, loading } = useHabitStats(habit.id);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold leading-none">
            {habit.name}
          </CardTitle>
          <p className="text-sm text-gray-500 capitalize">{habit.frequency}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(habit)}>
              {habit.active ? "Archive" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                onClick={() => onDelete(habit)}
                className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm mt-2">
          <div className="flex items-center space-x-1 text-orange-500">
            <Flame className="h-4 w-4" />
            <span className="font-medium">
              {loading ? "..." : streak} Day Streak
            </span>
          </div>
          <div className="flex items-center space-x-1 text-blue-500">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">
              {loading ? "..." : weeklyCompletions} This Week
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import { useHabits } from "@/contexts/HabitsContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { format, subDays } from "date-fns";
import { useAuth } from "@/contexts/auth";

export default function HistoryPage() {
  const { habits, completions, loading } = useHabits();
  const { user } = useAuth();

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
        date: date,
        dateString: format(date, "yyyy-MM-dd")
    };
  });

  return (
    <div className="space-y-6 pb-20 md:pb-4">
      <PageHeader
        title="History"
        description="Your habit completion history for the last 14 days."
      />
      
      {loading ? (
          <div className="text-center py-10 text-gray-500">Loading history...</div>
      ) : (
          <div className="space-y-3">
            {days.map(({ date, dateString }) => {
                const dayCompletions = habits?.filter(habit => {
                    const completionId = `${habit.id}_${dateString}`;
                    return completions[completionId]?.completed;
                }).map(habit => ({
                    ...habit,
                    completion: completions[`${habit.id}_${dateString}`]
                })) || [];

                return (
                    <div key={dateString} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between transition-all hover:shadow-sm">
                        <div className="flex flex-col w-20 flex-shrink-0">
                             <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {format(date, "EEE")}
                             </span>
                             <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {format(date, "MMM d")}
                             </span>
                        </div>
                        
                         <div className="flex flex-wrap gap-3 flex-grow justify-end min-h-[2rem] items-center">
                            {dayCompletions.length > 0 ? dayCompletions.map(h => (
                                <span key={h.id} className="text-xl leading-none" title={h.name} role="img" aria-label={h.name}>
                                    {h.emoji || "✅"}
                                </span>
                            )) : (
                                <span className="text-xs text-zinc-400 italic">No habits</span>
                            )}
                         </div>
                    </div>
                );
            })}
          </div>
      )}
    </div>
  );
}

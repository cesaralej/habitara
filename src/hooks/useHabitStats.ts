import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth";
import { subDays, format, isSameDay } from "date-fns";
import { HabitCompletion } from "@/types";

interface HabitStats {
  streak: number;
  weeklyCompletions: number;
  loading: boolean;
}

export function useHabitStats(habitId: string) {
  const { user } = useAuth();
  const [stats, setStats] = useState<HabitStats>({
    streak: 0,
    weeklyCompletions: 0,
    loading: true,
  });

  useEffect(() => {
    if (!user || !habitId) return;

    const fetchStats = async () => {
      try {
        const completionsRef = collection(db, "users", user.uid, "completions");
        
        // Fetch all completions for this habit (ordered by date desc)
        // Optimization: limit to last 365 days if needed, but for now fetch all 
        // to ensure accurate streak if it's super long (though unlikely > 365)
        // Let's just fetch all for this habit for now.
        const q = query(
          completionsRef,
          where("habitId", "==", habitId),
          where("completed", "==", true)
          // orderBy("date", "desc") // requires index usually, let's filter in memory if small dataset
        );

        const snapshot = await getDocs(q);
        const completions = snapshot.docs.map(doc => doc.data() as HabitCompletion);
        
        // Sort by date desc
        completions.sort((a, b) => b.date.localeCompare(a.date));

        // 1. Calculate Streak
        let currentStreak = 0;
        const today = new Date();
        const yesterday = subDays(today, 1);
        const todayStr = format(today, "yyyy-MM-dd");
        const yesterdayStr = format(yesterday, "yyyy-MM-dd");

        // Check if completed today or yesterday to start the streak
        const hasCompletedToday = completions.some(c => c.date === todayStr);
        const hasCompletedYesterday = completions.some(c => c.date === yesterdayStr);

        if (hasCompletedToday || hasCompletedYesterday) {
            // Start counting
            // If completed today, start checking from yesterday. 
            // If not today but yesterday, start checking from yesterday.
            // Actually simpler: just iterate backwards from today/yesterday.
            
            let checkDate = hasCompletedToday ? today : yesterday;
            
            // If we have today, streak is at least 1. If only yesterday, streak is at least 1.
            // Let's iterate.
            
            while (true) {
                const dateStr = format(checkDate, "yyyy-MM-dd");
                const hasCompletion = completions.some(c => c.date === dateStr);
                
                if (hasCompletion) {
                    currentStreak++;
                    checkDate = subDays(checkDate, 1);
                } else {
                    break;
                }
            }
        }

        // 2. Calculate Weekly Completions (Last 7 days)
        let weeklyCount = 0;
        const oneWeekAgo = subDays(today, 6); // 7 days window including today
        
        // Filter completions within the last 7 days range
        // Since we have YYYY-MM-DD strings, we can compare directly if formatted correctly, 
        // or convert to objects.
        const oneWeekAgoStr = format(oneWeekAgo, "yyyy-MM-dd");
        
        weeklyCount = completions.filter(c => c.date >= oneWeekAgoStr && c.date <= todayStr).length;

        setStats({
          streak: currentStreak,
          weeklyCompletions: weeklyCount,
          loading: false,
        });

      } catch (error) {
        console.error("Error fetching habit stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [user, habitId]);

  return stats;
}

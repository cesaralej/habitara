"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { HabitCompletion } from "@/types";

export const useDateCompletions = (date: string) => {
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const [completions, setCompletions] = useState<Record<string, HabitCompletion>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoading(false);
      setCompletions({});
      return;
    }

    setLoading(true);
    const completionsRef = collection(db, "users", user.uid, "completions");
    // Query for the specific date
    const q = query(completionsRef, where("date", "==", date));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newCompletions: Record<string, HabitCompletion> = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as HabitCompletion;
          newCompletions[data.habitId] = data;
        });
        setCompletions(newCompletions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching completions for date:", date, error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [date, user, authLoading]);

  return { completions, loading };
};

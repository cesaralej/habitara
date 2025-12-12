import { CheckSquare, Square, Check, XSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { useHabits } from "@/contexts/HabitsContext";
import { Habit, HabitCompletion } from "@/types";

interface HabitItemProps {
  habit: Habit;
  completion?: HabitCompletion;
  currentDate: string; // YYYY-MM-DD
  periodCompleted?: boolean;
}

export default function HabitItem({
  habit,
  completion,
  currentDate,
  periodCompleted = false,
}: HabitItemProps) {
  const { toggleHabitCompletion, updateHabitCompletionDetails } = useHabits();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetailsInput, setShowDetailsInput] = useState(false);
  const [detailsText, setDetailsText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const completed = !!completion?.completed;
  const isAvoid = habit.goal === 'avoid';

  // Use effective completion state for visual styling (name text), 
  // but keep checkbox logic strictly tied to 'completed' (today)
  const isVisuallyCompleted = completed || periodCompleted;

  useEffect(() => {
    if (showDetailsInput && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showDetailsInput]);

  // Reset input state when navigating to different dates or when completion changes
  useEffect(() => {
    setShowDetailsInput(false);
    setDetailsText("");
  }, [currentDate, completion?.id]);

  const toggleCompletion = async () => {
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    try {
      const wasCompleted = completed;
      await toggleHabitCompletion(habit.id, currentDate, !wasCompleted);
      
      // If we just completed it, show the details input
      if (!wasCompleted) {
          setShowDetailsInput(true);
          setDetailsText("");
      } else {
          setShowDetailsInput(false);
      }
    } catch (e) {
      console.error("Failed to toggle", e);
    }
  };

  const handleSaveDetails = async () => {
      if (!completion) return; // Should exist if we are saving
      // Need real date key logic? toggleHabitCompletion handles it, but updateHabitCompletionDetails also handles logic.
      // We pass currentDate, and the context resolves it.
      await updateHabitCompletionDetails(habit.id, currentDate, detailsText);
      setShowDetailsInput(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleSaveDetails();
      }
  };

  const getShadowColor = () => isAvoid 
    ? "rgba(220, 38, 38, 0.4)" // Red
    : "rgba(34, 197, 94, 0.4)"; // Green

  return (
    <div className={`flex flex-col p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${
      isAvoid ? "border-l-4 border-l-red-500" : ""
    }`}>
      <div className="flex items-center justify-between">
        {/* Habit name */}
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                {habit.emoji && <span className="text-lg leading-none">{habit.emoji}</span>}
                <span
                    className={`text-base transition-all duration-300 ${
                    isVisuallyCompleted 
                        ? "line-through text-gray-400" 
                        : "text-gray-900"
                    }`}
                >
                    {habit.name}
                </span>
            </div>
            {/* Visual indicator for period completion */}
            {periodCompleted && !completed && !isAvoid && (
                <span className="text-xs text-green-600 font-medium mt-0.5">
                    {habit.frequency === 'weekly' ? 'Week complete' : 'Month complete'}
                </span>
            )}
        </div>

        {/* Checkbox */}
        <button
            onClick={toggleCompletion}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ${
            isAnimating ? "scale-110" : "scale-100"
            }`}
            style={{
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
            boxShadow: isAnimating 
                ? `0 0 20px ${getShadowColor()}, 0 0 10px ${getShadowColor().replace('0.4', '0.2')}`
                : "none",
            }}
        >
            {completed ? (
                isAvoid ? (
                    <XSquare 
                        className={`w-6 h-6 text-red-500 transition-all duration-300 ${
                        isAnimating ? "rotate-12" : "rotate-0"
                        }`}
                        style={{
                        filter: isAnimating ? "drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))" : "none",
                        }}
                    />
                ) : (
                    <CheckSquare 
                        className={`w-6 h-6 text-green-500 transition-all duration-300 ${
                        isAnimating ? "rotate-12" : "rotate-0"
                        }`}
                        style={{
                        filter: isAnimating ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))" : "none",
                        }}
                    />
                )
            ) : (
                <Square className={`w-6 h-6 text-gray-400 transition-colors duration-200 ${isAvoid ? "hover:text-red-400" : "hover:text-gray-600"}`} />
            )}
        </button>
      </div>

      {/* Details Section */}
      {completed && (showDetailsInput || completion?.details) && (
          <div className="mt-1 text-xs pl-0"> 
             {showDetailsInput ? (
                 <div className="relative flex items-center animate-in fade-in slide-in-from-top-1 duration-200">
                     <input
                        ref={inputRef}
                        type="text"
                        value={detailsText}
                        onChange={(e) => setDetailsText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Add details (e.g. 5km run)"
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                     />
                     <button 
                        onClick={handleSaveDetails}
                        className="absolute right-1 p-1.5 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
                     >
                         <Check className="w-4 h-4" />
                     </button>
                 </div>
             ) : (
                 completion?.details && (
                     <div 
                        className="text-gray-400 animate-in fade-in cursor-default"
                     >
                        {completion.details}
                     </div>
                 )
             )}
          </div>
      )}
    </div>
  );
}

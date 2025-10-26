"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { HABIT_FREQUENCIES, Habit } from "@/types";

const habitSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The habit name must be at least 3 characters long." })
    .max(50, { message: "The habit name cannot exceed 50 characters." })
    .trim(),
  frequency: z.enum(HABIT_FREQUENCIES, {
    message: "You must select how often you plan to do this habit.",
  }),
  details: z
    .string()
    .max(500, {
      message: "The details section cannot exceed 500 characters.",
    })
    .trim()
    .optional(),
  active: z.boolean(),
});

export type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Habit> | null;
  onSubmit: (habit: HabitFormValues, habitId?: string) => Promise<void>;
}

export default function HabitForm({
  setShowSheet,
  initialData = null,
  onSubmit,
}: HabitFormProps) {
  const isEdit = Boolean(initialData?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      frequency: initialData?.frequency ?? "daily",
      details: initialData?.details ?? "",
      active: initialData?.active ?? true,
    },
  });

  const handleSubmit = async (values: HabitFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values, initialData?.id);
      setShowSheet(false);
    } catch (err) {
      console.error("Error submitting habit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 p-4 md:p-6"
      >
        {/* Habit Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Read for 30 minutes"
                  aria-label="Habit Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frequency Field (Select) */}
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select how often" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {HABIT_FREQUENCIES.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Details Field (Textarea) */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details (Optional)</FormLabel>
              <FormControl>
                {/* Use a spread to handle the optionality of the field for Textarea */}
                <Textarea
                  placeholder="The 'why' or 'how' for this habit, e.g., 'to reduce stress before bed'."
                  aria-label="Habit Details"
                  rows={4}
                  {...field}
                  // react-hook-form gives undefined for optional empty fields, but Textarea expects string
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEdit && (
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Habit Status</FormLabel>
                  <FormDescription>
                    Deactivate this habit if you no longer want to track it.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Updating Habit..."
              : "Saving Habit..."
            : isEdit
            ? "Update Habit"
            : "Create Habit"}
        </Button>
      </form>
    </Form>
  );
}

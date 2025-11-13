import { z } from 'zod';

// Reflection validation
export const reflectionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  text: z.string().min(1, "Text cannot be empty").max(10000, "Text too long"),
  prompt: z.string().max(500, "Prompt too long").optional(),
  mood: z.string().max(50, "Mood too long").optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
  voice_note_url: z.string().url().optional().or(z.literal('')),
});

// Habit validation
export const habitSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(100, "Name too long"),
  category: z.string().max(50, "Category too long").optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  target_count: z.number().int().min(1).max(1000).default(1),
  reminder_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format").optional(),
});

// Dua validation
export const duaSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(200, "Title too long"),
  category: z.string().max(50, "Category too long").optional(),
  content: z.record(z.string(), z.any()).refine(val => Object.keys(val).length > 0, "Content cannot be empty"),
});

// Dhikr session validation
export const dhikrSessionSchema = z.object({
  phrase: z.string().min(1, "Phrase cannot be empty").max(500, "Phrase too long"),
  count: z.number().int().min(1).max(100000),
  target: z.number().int().min(1).max(100000).optional(),
});

// Companion profile validation
export const companionProfileSchema = z.object({
  name: z.string().min(1, "Name required").max(50, "Name too long").optional(),
  voice_tone: z.enum(['warm', 'motivational', 'friendly']).optional(),
  appearance: z.record(z.string(), z.any()).optional(),
  behavior_settings: z.record(z.string(), z.any()).optional(),
  portrait_url: z.string().url().optional().or(z.literal('')),
  full_body_url: z.string().url().optional().or(z.literal('')),
});

// Profile validation
export const profileSchema = z.object({
  display_name: z.string().min(1, "Name required").max(100, "Name too long").optional(),
  timezone: z.string().max(50, "Timezone too long").default('UTC'),
  language: z.string().length(2, "Invalid language code").default('en'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  prayer_method: z.string().max(50, "Method too long").optional(),
  notifications_enabled: z.boolean().default(true),
  show_hijri: z.boolean().default(true),
});

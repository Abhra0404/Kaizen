import type { Difficulty, Frequency, ProjectStatus } from '@/types';

// ── DSA ──

export const DIFFICULTIES: readonly Difficulty[] = ['Easy', 'Medium', 'Hard'] as const;

export const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy:   'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  Medium: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  Hard:   'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
};

// ── Habits ──

export const FREQUENCIES: readonly Frequency[] = ['Daily', 'Weekly'] as const;

// ── Projects ──

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'Planning',
  'In Progress',
  'Review',
  'Done',
] as const;

// ── Settings ──

export const THEME_OPTIONS = ['Light', 'Dark', 'System'] as const;
export type ThemeOption = (typeof THEME_OPTIONS)[number];

// ── Supabase table names ──

export const TABLES = {
  DSA_PROBLEMS: 'dsa_problems',
  HABITS: 'habits',
  PROJECTS: 'projects',
  GOALS: 'goals',
  USER_PROFILES: 'user_profiles',
  LEETCODE_PROBLEM_CACHE: 'leetcode_problem_cache',
} as const;

// ── Supabase select columns ──

export const SELECT_COLUMNS = {
  DSA_PROBLEMS: 'id, title, difficulty, topic, solved, date, source, leetcode_slug',
  HABITS: 'id, name, frequency, streak',
  PROJECTS: 'id, name, description, status, progress, team, tags',
  GOALS: 'id, title, description, progress, deadline, category, completed',
} as const;

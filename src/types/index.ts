// ── DSA ──

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  solved: boolean;
  date: string;
  source?: 'manual' | 'leetcode';
  leetcode_slug?: string;
};

// ── Habits ──

export type Frequency = 'Daily' | 'Weekly';

export type Habit = {
  id: string;
  name: string;
  frequency: Frequency;
  streak: number;
};

// ── Projects ──

export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Done';

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  team: string[];
  tags: string[];
};

// ── Goals ──

export type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
  completed: boolean;
};

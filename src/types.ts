export type Character = 'tiger' | 'capybara' | 'kangaroo' | 'koala' | 'cat';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface GritData {
  goal: string;
  duration: string; // '1day' | '3days' | '1week' | 'custom'
  customDate: string;
  todos: TodoItem[];
  deadlineHour: string;
  deadlinePeriod: 'AM' | 'PM';
  character: Character;
}

export type OnboardingStep =
  | 'goal'
  | 'duration'
  | 'todos'
  | 'deadline'
  | 'character'
  | 'intro'
  | 'main';

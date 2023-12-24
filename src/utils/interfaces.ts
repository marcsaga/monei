export interface Expense {
  id: string;
  amount: number | undefined;
  description: string | undefined;
  date: string | undefined;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
}

export type CategoryColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "indigo"
  | "teal"
  | "orange";

export const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "indigo",
  "teal",
  "orange",
] as const;

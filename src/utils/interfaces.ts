export interface Investment {
  id: string;
  date: string;
  contribution?: number;
  accumulated?: number;
  totalValue?: number;
  category?: Category;
}

export interface Expense {
  id: string;
  amount: number | undefined;
  description: string | undefined;
  date: string | undefined;
  category?: Category;
}

export type CategoryType = "expense" | "investment";

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
  | "orange"
  | "gray";

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
  "gray",
] as const;

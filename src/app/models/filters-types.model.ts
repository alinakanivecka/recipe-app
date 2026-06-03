export interface FiltersTypes {
  query?: string;
  cuisine: string[];
  diet: string[];
  type?: string;
  maxReadyTime?: number;
  sort?: 'time' | 'popularity' | 'calories' | 'healthiness';
  difficulty?: 'easy' | 'medium' | 'hard' | null;
  page: number;
  pageSize: number;
}

export interface FiltersDraft{
  mealType: string | null;
  diets: string[];
  maxReadyTime: number;
  difficulty: 'easy' | 'medium' | 'hard' | null;
};

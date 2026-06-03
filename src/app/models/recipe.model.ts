import { Ingredient } from './ingredient.model';
import { Instruction } from './instructions.model';
import { Nutrition } from './nutrition.model';

export interface Recipes {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  rating?: number;
  reviews?: number;
  calories?: number;
  cuisines: string[];
  diets: string[];
  aggregateLikes?: number;
  healthScore?: number;
  nutrition?: Nutrition;
  dishTypes: string[];
  extendedIngredients?: Ingredient[];
  analyzedInstructions?: Instruction[];
  vegetarian: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  vegan: boolean;
}

export interface ApiResponse {
  results: Recipes[];
  totalResults: number;
}

export interface RandomRecipesResponse {
  recipes: Recipes[];
}

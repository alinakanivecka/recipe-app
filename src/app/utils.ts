import { Recipes } from "./models/recipe.model";

 export function getRecipeDifficulty(recipe: Recipes): 'easy' | 'medium' | 'hard' {
  if (recipe.readyInMinutes <= 20) return 'easy';
  if (recipe.readyInMinutes <= 45) return 'medium';
  return 'hard';
}
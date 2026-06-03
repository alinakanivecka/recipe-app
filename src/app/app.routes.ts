import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { RecipeDetails } from './pages/recipe-details/recipe-details';
import { Favorites } from './pages/favorites/favorites';
import { AllRecipes } from './pages/all-recipes/all-recipes';
import { CategoryRecipes } from './pages/category-recipes/category-recipes';
import { CuisinesRecipe } from './pages/cuisines-recipe/cuisines-recipe';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'recipe/:id',
    component: RecipeDetails,
  },
  {
    path: 'favorites',
    component: Favorites,
  },
  {
    path: 'recipes',
    component: AllRecipes,
  },
  {
    path: 'recipes/category/:category',
    component: CategoryRecipes,
  },
  {
    path: 'recipes/cuisine/:cuisine',
    component: CuisinesRecipe,
  },
];

import { inject, Injectable } from '@angular/core';
import { ApiResponse, Recipes } from '../models/recipe.model';
import { Observable, of } from 'rxjs';
import { RecipeApiService } from './recipe-api.service';
import { RecipeMockService } from './recipe-mock.service';
import { FiltersTypes } from '../models/filters-types.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipeApiService = inject(RecipeApiService);
  private recipeMockService = inject(RecipeMockService);

  private readonly isLocal = true;

  getAllRecipes(filters: FiltersTypes): Observable<ApiResponse> {
    if (this.isLocal) {
      return this.recipeMockService.getMockRecipes(filters);
    }

    return this.recipeApiService.getApiRecipes(filters);
  }

  getRecipesById(id: number): Observable<Recipes | null> {
    if (this.isLocal) {
      return this.recipeMockService.getMockRecipeById(id);
    }
    return this.recipeApiService.getApiRecipeById(id);
  }

  getRecipesByIds(ids: number[]): Observable<Recipes[]> {
    if (!ids.length) {
      return of([]);
    }

    if (this.isLocal) {
      return this.recipeMockService.getMockRecipesByIds(ids);
    }
    return this.recipeApiService.getApiRecipesBulkByIds(ids);
  }

  getPopularRecipes(): Observable<Recipes[]> {
    return this.recipeApiService.getPopularRecipes();
  }
}

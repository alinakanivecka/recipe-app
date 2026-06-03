import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse, Recipes } from '../models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { FiltersTypes } from '../models/filters-types.model';
import { SearchService } from './search.service';
import { getRecipeDifficulty } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class RecipeMockService {
  private http = inject(HttpClient);
  searchService = inject(SearchService);

  getMockRecipes(filters: FiltersTypes): Observable<ApiResponse> {
    const mode = this.searchService.searchMode();

    return this.http.get<ApiResponse>('assets/data/recipes.json').pipe(
      map((response) => {
        const recipes = response.results ?? [];
        const q = filters.query?.trim().toLowerCase();

        const filteredRecipes = recipes.filter((recipe) => {
          const matchesQuery =
            !q ||
            (mode === 'title'
              ? recipe.title.toLowerCase().includes(q)
              : recipe.extendedIngredients?.some((ingredient) =>
                  ingredient.name.toLowerCase().includes(q),
                ));
          const matchesType = !filters.type || recipe.dishTypes.includes(filters.type ?? '');
          const matchesCuisine =
            filters.cuisine.length === 0 ||
            filters.cuisine.some((cuisine) => recipe.cuisines.includes(cuisine));
          const matchesDiet =
            filters.diet.length === 0 || filters.diet.some((diet) => recipe.diets.includes(diet));
          const matchesTime =
            !filters.maxReadyTime || recipe.readyInMinutes <= filters.maxReadyTime;

          const matchesDifficulty =
            !filters.difficulty || getRecipeDifficulty(recipe) === filters.difficulty;

          return (
            matchesQuery &&
            matchesType &&
            matchesCuisine &&
            matchesDiet &&
            matchesTime &&
            matchesDifficulty
          );
        });

        const sortedRecipes = this.sortedRecipes(filteredRecipes, filters.sort);

        return this.paginateMockRecipes(sortedRecipes, filters);
      }),
    );
  }

  getMockRecipesByIds(ids: number[]): Observable<Recipes[]> {
    return this.http.get<ApiResponse>('assets/data/recipes.json').pipe(
      map((response) => {
        const recipes = response.results ?? [];

        return recipes.filter((recipe) => ids.includes(recipe.id));
      }),
    );
  }

  getMockRecipeById(id: number): Observable<Recipes | null> {
    return this.http
      .get<ApiResponse>('assets/data/recipes.json')
      .pipe(map((response) => response.results.find((recipe) => recipe.id === id) ?? null));
  }

  sortedRecipes(recipes: Recipes[], sort?: string) {
    const copy = [...recipes];
    switch (sort) {
      case 'time':
        return copy.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
      case 'popularity':
        return copy.sort((a, b) => (b.aggregateLikes ?? 0) - (a.aggregateLikes ?? 0));
      case 'calories':
        return copy.sort((a, b) => (a.calories ?? 0) - (b.calories ?? 0));
      case 'healthiness':
        return copy.sort((a, b) => (b.healthScore ?? 0) - (a.healthScore ?? 0));
    }
    return copy;
  }

  paginateMockRecipes(recipes: Recipes[], filters: FiltersTypes): ApiResponse {
    const start = (filters.page - 1) * filters.pageSize;
    const end = start + filters.pageSize;

    return {
      results: recipes.slice(start, end),
      totalResults: recipes.length,
    };
  }
}

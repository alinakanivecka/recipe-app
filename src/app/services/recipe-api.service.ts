import { inject, Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { ApiResponse, RandomRecipesResponse, Recipes } from '../models/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FiltersTypes } from '../models/filters-types.model';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeApiService {
  searchService = inject(SearchService);
  private http = inject(HttpClient);
  private baseUrl = 'https://api.spoonacular./recipes';
  private apiKey = environment.spoonacularApiKey;

  getApiRecipes(filters: FiltersTypes): Observable<ApiResponse> {
    const mode = this.searchService.searchMode();

    if (filters.query?.trim() && mode === 'ingredients') {
      return this.getApiFullRecipesByIngredients(filters);
    }

    return this.getApiRecipesByTitle(filters);
  }

  getApiFullRecipesByIngredients(filters: FiltersTypes): Observable<ApiResponse> {
    return this.getApiRecipesByIngredients(filters).pipe(
      switchMap((ids) => {
        if (!ids.length) {
          return of({
            results: [],
            totalResults: 0,
          });
        }

        return this.getApiRecipesBulkByIds(ids).pipe(
          map((recipes) => ({
            results: recipes,
            totalResults: recipes.length,
          })),
        );
      }),
    );
  }

  getApiRecipesByIngredients(filters: FiltersTypes): Observable<number[]> {
    const url = `${this.baseUrl}/findByIngredients`;

    const params = new HttpParams().appendAll({
      ingredients: filters.query ?? '',
      number: String(filters.pageSize),
      ranking: '1',
      ignorePantry: 'true',
      apiKey: this.apiKey,
    });

    return this.http
      .get<Recipes[]>(url, { params })
      .pipe(map((recipes) => recipes.map((recipe) => recipe.id)));
  }

  getApiRecipesByTitle(filters: FiltersTypes): Observable<ApiResponse> {
    const url = `${this.baseUrl}/complexSearch`;
    const { page, pageSize, query, type, cuisine, sort, maxReadyTime, diet } = filters;
    const offset = (page - 1) * pageSize;
    const cuisineParams = cuisine.join(',');
    const dietParams = diet.join('|');

    let params = new HttpParams().appendAll({
      number: String(pageSize),
      offset: String(offset),
      addRecipeInformation: 'true',
      apiKey: this.apiKey,
    });

    if (query?.trim()) {
      params = params.set('query', query);
    }

    if (type) {
      params = params.set('type', type);
    }

    if (cuisine.length > 0) {
      params = params.set('cuisine', cuisineParams);
    }

    if (diet.length > 0) {
      params = params.set('diet', dietParams);
    }

    if (maxReadyTime && maxReadyTime < 120) {
      params = params.set('maxReadyTime', String(maxReadyTime));
    }

    if (sort) {
      params = params.set('sort', sort);

      if (sort === 'time' || sort === 'calories') {
        params = params.set('sortDirection', 'asc');
      } else {
        params = params.set('sortDirection', 'desc');
      }
    }

    return this.http.get<ApiResponse>(url, { params });
  }

  getApiRecipesBulkByIds(ids: number[]): Observable<Recipes[]> {
    const url = `${this.baseUrl}/informationBulk`;

    const params = new HttpParams().appendAll({
      ids: ids.join(','),
      includeNutrition: 'true',
      apiKey: this.apiKey,
    });

    return this.http.get<Recipes[]>(url, { params });
  }

  getApiRecipeById(id: number): Observable<Recipes> {
    const url = `${this.baseUrl}/${id}/information`;

    const params = new HttpParams().set('apiKey', this.apiKey).set('includeNutrition', 'true');

    return this.http.get<Recipes>(url, { params });
  }

  getPopularRecipes(): Observable<Recipes[]> {
    const url = `${this.baseUrl}/random`;

    const params = new HttpParams().set('number', '12').set('apiKey', this.apiKey);

    return this.http
      .get<RandomRecipesResponse>(url, { params })
      .pipe(map((response) => response.recipes ?? []));
  }
}

/* eslint-disable @angular-eslint/prefer-inject */
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute } from '@angular/router';
import { Recipes } from '../../models/recipe.model';
import { FiltersTypes } from '../../models/filters-types.model';
import { Location } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipeCollectionPage } from '../../recipe-collection-page/recipe-collection-page';

@Component({
  selector: 'app-cuisines-recipe',
  imports: [RecipeCollectionPage],
  templateUrl: './cuisines-recipe.html',
  styleUrl: './cuisines-recipe.scss',
})
export class CuisinesRecipe {
  recipeService = inject(RecipeService);
  searchService = inject(SearchService);
  location = inject(Location);
  recipesByCuisine = signal<Recipes[]>([]);
  cuisineName = signal<string | null>(null);
  totalResults = signal(0);
  currentPage = signal(1);
  pageSize = 12;

  isLoading = signal(false);
  errorMessage = signal('');
  noResults = signal(false);

  buildFilters(cuisine: string): FiltersTypes {
    return {
      query: this.searchService.searchQuery(),
      type: undefined,
      cuisine: [cuisine],
      diet: [],
      maxReadyTime: undefined,
      page: this.currentPage(),
      pageSize: this.pageSize,
    };
  }

  totalPages = computed(() => Math.ceil(this.totalResults() / this.pageSize));

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadRecipes();
  }

  loadRecipes() {
    const category = this.cuisineName();

    if (!category) return;

    const filters = this.buildFilters(category);

    this.errorMessage.set('')
    this.isLoading.set(true);

    this.recipeService.getAllRecipes(filters).subscribe({
      next: (response) => {
        this.recipesByCuisine.set(response.results ?? []);
        this.totalResults.set(response.totalResults ?? 0);
        this.isLoading.set(false);
        this.noResults.set((response.results ?? []).length === 0);
      },
      error: () => {
        this.errorMessage.set('Unable to load recipes');
        this.isLoading.set(false);
      },
    });
  }

  hasSearchQuery = computed(() => {
    return this.searchService.searchQuery().trim().length > 0;
  });

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.cuisineName.set(params.get('cuisine'));
      this.currentPage.set(1);
      this.loadRecipes();
    });

    effect(() => {
      this.searchService.searchQuery();
      this.currentPage.set(1);
      untracked(() => this.loadRecipes());
    });
  }

  cuisineTitle = computed(() => {
    const name = this.cuisineName();

    if (!name) return '';

    return name[0].toUpperCase() + name.slice(1);
  });

  goBack() {
    this.location.back();
  }
}

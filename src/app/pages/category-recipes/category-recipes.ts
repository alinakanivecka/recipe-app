/* eslint-disable @angular-eslint/prefer-inject */
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Recipes } from '../../models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { FiltersTypes } from '../../models/filters-types.model';
import { Location } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipeCollectionPage } from '../../recipe-collection-page/recipe-collection-page';

@Component({
  selector: 'app-category-recipes',
  imports: [RecipeCollectionPage],
  templateUrl: './category-recipes.html',
  styleUrl: './category-recipes.scss',
})
export class CategoryRecipes {
  recipeService = inject(RecipeService);
  searchService = inject(SearchService);
  location = inject(Location);
  categoryName = signal<string | null>(null);
  recipesByCategory = signal<Recipes[]>([]);
  totalResults = signal(0);
  currentPage = signal(1);
  pageSize = 12;

  isLoading = signal(false);
  errorMessage = signal('');
  noResults = signal(false);

  buildFilters(category: string): FiltersTypes {
    return {
      query: this.searchService.searchQuery(),
      type: category,
      cuisine: [],
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
    const category = this.categoryName();

    if (!category) return;

    const filters = this.buildFilters(category);

    this.errorMessage.set('')
    this.isLoading.set(true);

    this.recipeService.getAllRecipes(filters).subscribe({
      next: (response) => {
        this.recipesByCategory.set(response.results ?? []);
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
      this.categoryName.set(params.get('category'));
      this.currentPage.set(1);
      this.loadRecipes();
    });

    effect(() => {
      this.searchService.searchQuery();
      this.currentPage.set(1);
      untracked(() => this.loadRecipes());
    });
  }

  categoryTitle = computed(() => {
    const name = this.categoryName();

    if (!name) return '';

    return name[0].toUpperCase() + name.slice(1);
  });

  goBack() {
    this.location.back();
  }
}

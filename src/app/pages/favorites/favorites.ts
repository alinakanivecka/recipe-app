import { Component, computed, effect, inject, signal } from '@angular/core';
import { FavoriteService } from '../../services/favorites.service';
import { RecipeCard } from '../../components/recipe-card/recipe-card';
import { Recipes } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { Location } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { RecipeCardSkeleton } from '../../recipe-card-skeleton/recipe-card-skeleton';
import { SKELETON_CARDS } from '../../constants/skeleton-cards';

@Component({
  selector: 'app-favorites',
  imports: [RecipeCard, RecipeCardSkeleton],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  recipeService = inject(RecipeService);
  favoriteService = inject(FavoriteService);
  searchService = inject(SearchService);
  location = inject(Location);
  recipes = signal<Recipes[]>([]);
  favoriteIds = this.favoriteService.favoriteIds;

  errorMessage = signal('');
  isLoading = signal(false);

  isFavorite(id: number) {
    return this.favoriteService.isFavorite(id);
  }

  clearAllFavorites() {
    this.favoriteService.clearFavorites();
  }

  filteredRecipes = computed(() => {
    const query = this.searchService.searchQuery().toLowerCase().trim();

    if (!query) {
      return this.recipes();
    }

    return this.recipes().filter((recipe) => recipe.title.toLowerCase().includes(query));
  });

  hasSearchQuery = computed(() => {
    return this.searchService.searchQuery().trim().length > 0;
  });

  noResults = computed(() => {
    return this.hasSearchQuery() && this.filteredRecipes().length === 0;
  });

  constructor() {
    effect(() => {
      const ids = this.favoriteIds();

      if (ids.length === 0) {
        this.recipes.set([]);
        return;
      }

      this.errorMessage.set('');
      this.isLoading.set(true);

      this.recipeService.getRecipesByIds(ids).subscribe({
        next: (response) => {
          this.recipes.set(response);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load favorite recipes');
          this.isLoading.set(false);
        },
      });
    });
  }

  goBack() {
    this.location.back();
  }

  skeletonCards = SKELETON_CARDS;
}

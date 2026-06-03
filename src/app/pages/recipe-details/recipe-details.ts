/* eslint-disable @angular-eslint/prefer-inject */
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipes } from '../../models/recipe.model';
import { DecimalPipe, Location } from '@angular/common';
import { FavoriteService } from '../../services/favorites.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getRecipeDifficulty } from '../../utils';
import { RecipeDetailsSkeleton } from "../../recipe-details-skeleton/recipe-details-skeleton";
import { nutritionCards } from '../../constants/nutrition';

@Component({
  selector: 'app-recipe-details',
  imports: [DecimalPipe, RecipeDetailsSkeleton],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.scss',
})
export class RecipeDetails {
  private location = inject(Location);
  recipeService = inject(RecipeService);
  favoriteService = inject(FavoriteService);
  recipeById = signal<Recipes | null>(null);
  nutritionCards = nutritionCards

  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  showDifficulty(recipe: Recipes) {
    return getRecipeDifficulty(recipe);
  }

  toggleFavorite(recipeId: number) {
    this.favoriteService.toggleFavorite(recipeId);
  }

  getNutrientAmount(recipe: Recipes, name: string): number | null {
    const nutrionName = recipe.nutrition?.nutrients.find((nutrient) => nutrient.name === name);

    return nutrionName?.amount ?? null;
  }

  getShortSummary(recipe: Recipes): string {
    const shortText = recipe.summary.replace(/<[^>]*>/g, '').split('.')[0];

    return shortText + '.';
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));

      this.recipeById.set(null);
      this.errorMessage.set('');
      this.noResults.set(false);

      if (!id) {
        this.noResults.set(true);
        return;
      }

      this.isLoading.set(true);

      this.recipeService.getRecipesById(id).subscribe({
        next: (data) => {
          this.recipeById.set(data);
          this.noResults.set(!data);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error loading recipe');
          this.isLoading.set(false);
        },
      });
    });
  }

  goBack() {
    this.location.back();
  }
}

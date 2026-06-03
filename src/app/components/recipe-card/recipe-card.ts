import { Component, inject, Input } from '@angular/core';
import { Recipes } from '../../models/recipe.model';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { FavoriteService } from '../../services/favorites.service';
import { DecimalPipe } from '@angular/common';
import { getRecipeDifficulty } from '../../utils';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss',
})
export class RecipeCard {
  @Input() recipe!: Recipes;
  @Input() variant: 'compact' | 'full' = 'compact';
  recipeService = inject(RecipeService);
  favoriteService = inject(FavoriteService)

  showDifficulty(recipe: Recipes) {
    return getRecipeDifficulty(recipe);
  }

  toggleFavorite(recipeId: number) {
   this.favoriteService.toggleFavorite(recipeId)
  }
}

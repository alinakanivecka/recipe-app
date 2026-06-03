import { Component, input, output } from '@angular/core';
import { Recipes } from '../models/recipe.model';
import { RecipeCardSkeleton } from '../recipe-card-skeleton/recipe-card-skeleton';
import { RecipeCard } from '../components/recipe-card/recipe-card';
import { Pagination } from '../components/pagination/pagination';
import { SKELETON_CARDS } from '../constants/skeleton-cards';

@Component({
  selector: 'app-recipe-collection-page',
  imports: [RecipeCardSkeleton, RecipeCard, Pagination],
  templateUrl: './recipe-collection-page.html',
  styleUrl: './recipe-collection-page.scss',
})
export class RecipeCollectionPage {
  title = input.required<string>();
  recipes = input.required<Recipes[]>();
  isLoading = input.required<boolean>();
  noResults = input.required<boolean>();
  hasSearchQuery = input.required<boolean>();
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  errorMessage = input.required<string>();

  pageChange = output<number>();
  back = output<void>();

  skeletonCards = SKELETON_CARDS;

  goToPage(page: number) {
    this.pageChange.emit(page);
  }

  goBack() {
    this.back.emit();
  }
}

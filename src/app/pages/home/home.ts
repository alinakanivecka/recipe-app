import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RecipeCard } from '../../components/recipe-card/recipe-card';
import { RecipeService } from '../../services/recipe.service';
import { RouterLink } from '@angular/router';
import { Recipes } from '../../models/recipe.model';
import { Category } from '../../models/category.model';
import { Categories } from '../../constants/categories';
import { Cuisine } from '../../models/cuisine.model';
import { Cuisines } from '../../constants/cuisines';
import { FiltersTypes } from '../../models/filters-types.model';
import { RecipeCardSkeleton } from "../../recipe-card-skeleton/recipe-card-skeleton";
import { SKELETON_CARDS } from '../../constants/skeleton-cards';

@Component({
  selector: 'app-home',
  imports: [RecipeCard, RouterLink, RecipeCardSkeleton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private recipeService = inject(RecipeService);
  recipes = signal<Recipes[]>([]);
  categories = signal<Category[]>(Categories.map((category) => ({ ...category })));
  cuisines = signal<Cuisine[]>(Cuisines.map((cuisine) => ({ ...cuisine })));

  errorMessage = signal('');
  isLoading = signal(false);

  scrollCarousel(carousel: HTMLDivElement, direction: 'left' | 'right') {
    const firstItem = carousel.firstElementChild as HTMLElement;

    if (!firstItem) return;

    const styles = getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap || '0');
    const amount = firstItem.offsetWidth + gap;

    carousel.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  }

  buildFilters(): FiltersTypes {
    return {
      query: '',
      type: undefined,
      cuisine: [],
      diet: [],
      maxReadyTime: undefined,
      page: 1,
      pageSize: 12,
    };
  }

  loadRandomRecipes() {
    const filters = this.buildFilters();

    this.errorMessage.set('')
    this.isLoading.set(true);

    this.recipeService.getAllRecipes(filters).subscribe({
      next: (response) => {
        this.recipes.set(response.results ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load random recipes');
        this.isLoading.set(false);
      },
    });
  }

  loadCounts<T extends { type: string; count: number }>(
    itemsSignal: WritableSignal<T[]>,
    filterType: 'type' | 'cuisine',
  ) {
    itemsSignal().forEach((item) => {
      const filters: FiltersTypes = {
        query: '',
        type: filterType === 'type' ? item.type : undefined,
        cuisine: filterType === 'cuisine' ? [item.type] : [],
        diet: [],
        maxReadyTime: undefined,
        page: 1,
        pageSize: 1,
      };

      this.errorMessage.set('')
      this.isLoading.set(true);

      this.recipeService.getAllRecipes(filters).subscribe({
        next: (response) => {
          itemsSignal.update((items) =>
            items.map((currentItem) =>
              currentItem.type === item.type
                ? { ...currentItem, count: response.totalResults ?? 0 }
                : currentItem,
            ),
          );
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load recipes');
          this.isLoading.set(false);
        },
      });
    });
  }

  loadCategoryCounts() {
    this.loadCounts(this.categories, 'type');
  }

  loadCuisineCounts() {
    this.loadCounts(this.cuisines, 'cuisine');
  }

  ngOnInit() {
    this.loadRandomRecipes();
    this.loadCategoryCounts();
    this.loadCuisineCounts();
  }

  skeletonCards = SKELETON_CARDS
}

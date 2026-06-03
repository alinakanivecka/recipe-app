import { Component, computed, effect, inject, signal } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCard } from '../../components/recipe-card/recipe-card';
import { SearchService } from '../../services/search.service';
import { Recipes } from '../../models/recipe.model';
import { Location } from '@angular/common';
import { Category } from '../../models/category.model';
import { Categories } from '../../constants/categories';
import { Diets } from '../../constants/diets';
import { Diet } from '../../models/diet.model';
import { FiltersTypes } from '../../models/filters-types.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Filters } from '../../components/filters/filters';
import { FiltersDraft } from '../../models/filters-types.model';
import { Pagination } from '../../components/pagination/pagination';
import { Dropdown } from '../../components/dropdown/dropdown';
import { getRecipeDifficulty } from '../../utils';
import { RecipeCardSkeleton } from '../../recipe-card-skeleton/recipe-card-skeleton';
import { SKELETON_CARDS } from '../../constants/skeleton-cards';

@Component({
  selector: 'app-all-recipes',
  imports: [RecipeCard, Filters, Pagination, Dropdown, RecipeCardSkeleton],

  templateUrl: './all-recipes.html',
  styleUrl: './all-recipes.scss',
})
export class AllRecipes {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  recipeService = inject(RecipeService);
  searchService = inject(SearchService);
  location = inject(Location);

  recipes = signal<Recipes[]>([]);
  categories = signal<Category[]>(Categories.map((category) => ({ ...category })));
  diets = signal<Diet[]>(Diets.map((diet) => ({ ...diet })));

  appliedMealType = signal<string | null>(null);
  appliedDietsTypes = signal<string[]>([]);
  appliedMaxReadyTime = signal<number>(120);
  appliedDifficulty = signal<'easy' | 'medium' | 'hard' | null>(null);

  appliedQuery = signal('');
  totalResults = signal(0);
  currentPage = signal(1);
  pageSize = 12;

  isFiltersOpen = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  noResults = signal(false);

  sortMode = signal<'popularity' | 'time' | 'calories' | 'healthiness'>('popularity');

  sortOptions = [
    { label: 'Popularity', name: 'Popularity', value: 'popularity', icon: 'fa-solid fa-fire' },
    { label: 'Cooking time', name: 'Cooking time', value: 'time', icon: 'fa-regular fa-clock' },
    { label: 'Calories', name: 'Calories', value: 'calories', icon: 'fa-solid fa-bolt' },
    { label: 'Healthiness', name: 'Healthiness', value: 'healthiness', icon: 'fa-solid fa-leaf' },
  ];

  selectSortMode(mode: string) {
    if (mode !== 'popularity' && mode !== 'time' && mode !== 'calories' && mode !== 'healthiness')
      return;

    this.sortMode.set(mode);
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  buildFilters(): FiltersTypes {
    return {
      query: this.appliedQuery(),
      type: this.appliedMealType() ?? undefined,
      cuisine: [],
      diet: this.appliedDietsTypes(),
      maxReadyTime: this.appliedMaxReadyTime(),
      difficulty: this.appliedDifficulty(),
      sort: this.sortMode(),
      page: this.currentPage(),
      pageSize: this.pageSize,
    };
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: this.appliedMealType() || null,
        diet: this.appliedDietsTypes().length ? this.appliedDietsTypes().join('|') : null,
        time: this.appliedMaxReadyTime() < 120 ? this.appliedMaxReadyTime() : null,
        sort: this.sortMode() !== 'popularity' ? this.sortMode() : null,
        difficulty: this.appliedDifficulty() !== null ? this.appliedDifficulty() : null,
        page: this.currentPage() > 1 ? this.currentPage() : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  constructor() {
    effect(() => {
      const query = this.searchService.searchQuery();

      this.currentPage.set(1);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          query: query || null,
          page: null,
        },
        queryParamsHandling: 'merge',
      });
    });

    this.route.queryParamMap.subscribe((params) => {
      const type = params.get('type');
      const diet = params.get('diet');
      const time = params.get('time');
      const page = params.get('page');
      const sort = params.get('sort');
      const difficulty = params.get('difficulty');

      const validSorts = ['popularity', 'time', 'calories', 'healthiness'];
      const validSort = validSorts.includes(sort ?? '');

      const validDifficulties = ['easy', 'medium', 'hard'];
      const validDifficulty = validDifficulties.includes(difficulty ?? '');

      this.appliedQuery.set(params.get('query') ?? '');
      this.appliedMealType.set(type);
      this.appliedDietsTypes.set(diet ? diet.split('|') : []);
      this.appliedMaxReadyTime.set(time ? Number(time) : 120);
      this.appliedDifficulty.set(
        validDifficulty ? (difficulty as 'easy' | 'medium' | 'hard') : null,
      );
      this.sortMode.set(
        validSort ? (sort as 'popularity' | 'time' | 'calories' | 'healthiness') : 'popularity',
      );

      this.currentPage.set(page ? Number(page) : 1);

      this.loadAllRecipes();
    });
  }

  applyFilters(filters: FiltersDraft) {
    this.appliedMealType.set(filters.mealType);
    this.appliedDietsTypes.set(filters.diets);
    this.appliedMaxReadyTime.set(filters.maxReadyTime);
    this.appliedDifficulty.set(filters.difficulty);

    this.currentPage.set(1);
    this.updateQueryParams();
    this.closeFilters();
  }

  clearFilters() {
    this.appliedMealType.set(null);
    this.appliedDietsTypes.set([]);
    this.appliedMaxReadyTime.set(120);
    this.appliedDifficulty.set(null);

    this.currentPage.set(1);
    this.updateQueryParams();
    this.closeFilters();
  }

  loadAllRecipes() {
    const filters = this.buildFilters();

    this.noResults.set(false)
    this.errorMessage.set('')
    this.isLoading.set(true);

    this.recipeService.getAllRecipes(filters).subscribe({
      next: (response) => {
        const recipes = response.results ?? [];
        const filteredRecipes = recipes.filter(
          (recipe) => !filters.difficulty || getRecipeDifficulty(recipe) === filters.difficulty,
        );

        this.recipes.set(filteredRecipes);
        this.totalResults.set(response.totalResults ?? 0);
        this.isLoading.set(false);
        this.noResults.set(filteredRecipes.length === 0);
      },
      error: () => {
        this.errorMessage.set('Unable to load recipes');
        this.isLoading.set(false);
      },
    });
  }

  totalPages = computed(() => Math.ceil(this.totalResults() / this.pageSize));

  goToPage(page: number) {
    this.currentPage.set(page);
    this.updateQueryParams();
  }

  goBack() {
    this.location.back();
  }

  openFilters() {
    this.isFiltersOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeFilters() {
    this.isFiltersOpen.set(false);
    document.body.style.overflow = '';
  }

  skeletonCards = SKELETON_CARDS;
}

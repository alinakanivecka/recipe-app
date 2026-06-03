import { Component, effect, input, output, signal, WritableSignal } from '@angular/core';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { Category } from '../../models/category.model';
import { Diet } from '../../models/diet.model';
import { FiltersDraft } from '../../models/filters-types.model';

@Component({
  selector: 'app-filters',
  imports: [MatRadioGroup, MatRadioButton, MatSliderModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  categories = input<Category[]>();
  diets = input<Diet[]>();
  initialMealType = input<string | null>();
  initialDiets = input<string[]>();
  initialMaxReadyTime = input<number>();
  initialDifficulty = input<'easy' | 'medium' | 'hard' | null>();
  apply = output<FiltersDraft>();
  clear = output<void>();

  selectedMealType = signal<string | null>(null);
  selectedDietTypes = signal<string[]>([]);
  selectedMaxReadyTime = signal<number>(120);
  selectedDifficulty = signal<'easy' | 'medium' | 'hard' | null>(null);

  toggleFilter(selectedSignal: WritableSignal<string[]>, type: string) {
    selectedSignal.update((selected) => {
      if (selected.includes(type)) {
        return selected.filter((item) => item !== type);
      }

      return [...selected, type];
    });
  }

  applyFilters() {
    this.apply.emit({
      mealType: this.selectedMealType(),
      diets: this.selectedDietTypes(),
      maxReadyTime: this.selectedMaxReadyTime(),
      difficulty: this.selectedDifficulty(),
    });
  }

  clearFilters() {
    this.selectedMealType.set(null);
    this.selectedDietTypes.set([]);
    this.selectedMaxReadyTime.set(120);
    this.selectedDifficulty.set(null);
    this.clear.emit();
  }

  constructor() {
    effect(() => {
      this.selectedMealType.set(this.initialMealType() ?? null);
      this.selectedDietTypes.set(this.initialDiets() ?? []);
      this.selectedMaxReadyTime.set(this.initialMaxReadyTime() ?? 120);
      this.selectedDifficulty.set(this.initialDifficulty() ?? null);
    });
  }
}

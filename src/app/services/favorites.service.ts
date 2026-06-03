import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  favoriteIds = signal<number[]>([]);

  constructor() {
    this.loadData();
  }

  isFavorite(recipeId: number) {
    return this.favoriteIds().includes(recipeId);
  }

  toggleFavorite(recipeId: number) {
    this.favoriteIds.update((ids) => {
      const updatedIds = ids.includes(recipeId)
        ? ids.filter((id) => id !== recipeId)
        : [...ids, recipeId];

      this.saveData(updatedIds);

      return updatedIds;
    });
  }

  clearFavorites() {
    this.favoriteIds.set([]);
    this.saveData([]);
  }

  saveData(ids: number[]): void {
    const jsonValue = JSON.stringify(ids);
    localStorage.setItem('favoriteIds', jsonValue);
  }

  loadData() {
    const data = localStorage.getItem('favoriteIds');

    if (data) {
      const parsedData = JSON.parse(data);

      const validIds = parsedData.filter((id: unknown) => typeof id === 'number');

      this.favoriteIds.set(validIds);
    }
  }
}

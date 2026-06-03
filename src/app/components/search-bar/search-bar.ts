import { Component, DestroyRef, inject, signal } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { Dropdown } from '../dropdown/dropdown';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  imports: [Dropdown],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  private destroyRef = inject(DestroyRef);
  searchService = inject(SearchService);
  router = inject(Router);
  search = signal('');
  searchInput$ = new Subject<string>();

  searchOptions = [
    { label: 'Search by title', name: 'by title', value: 'title', icon: 'fa-regular fa-newspaper' },
    {
      label: 'Search by ingredients',
      name: 'by ingredients',
      value: 'ingredients',
      icon: 'fa-regular fa-lemon',
    },
  ];

  selectSearchMode(mode: string) {
    if (mode !== 'title' && mode !== 'ingredients') return;

    this.searchService.searchMode.set(mode);
  }

  constructor() {
    this.searchInput$
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const q = value.trim().toLowerCase();
        this.searchService.searchQuery.set(q);
      });
  }

  onSearch() {
    const q = this.search().trim().toLowerCase();

    this.searchService.searchQuery.set(q);

    if (this.router.url === '/home') {
      this.router.navigate(['/recipes']);
    }
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.search.set(value);
    this.searchInput$.next(value);
  }

  clearSearch() {
    this.search.set('');
    this.searchService.searchQuery.set('');
    this.searchInput$.next('');
  }
}

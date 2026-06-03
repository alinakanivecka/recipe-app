import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchQuery = signal('');
  searchMode = signal<'title' | 'ingredients'>('title');
}

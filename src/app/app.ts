import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { SearchBar } from './components/search-bar/search-bar';
import { Category } from './models/category.model';
import { Categories } from './constants/categories';
import { Cuisines } from './constants/cuisines';
import { Cuisine } from './models/cuisine.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SearchBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isMenuOpen = signal(false);
  isCategoriesOpen = signal(false);
  isCuisinesOpen = signal(false);

  categories = signal<Category[]>(Categories.map((category) => ({ ...category })));
  cuisines = signal<Cuisine[]>(Cuisines.map((cuisine) => ({ ...cuisine })));

  toggleCategories() {
    this.isCategoriesOpen.set(!this.isCategoriesOpen());
  }
  toggleCuisines() {
    this.isCuisinesOpen.set(!this.isCuisinesOpen());
  }

  openMenu() {
    this.isMenuOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isMenuOpen.set(false);
    this.isCategoriesOpen.set(false);
    this.isCuisinesOpen.set(false);
    document.body.style.overflow = '';
  }
}

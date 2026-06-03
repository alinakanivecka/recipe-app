import { Component, computed, input, output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-dropdown',
  imports: [ClickOutsideDirective],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  options = input([
    {
      label: '',
      name: '',
      value: '',
      icon: '',
    },
  ]);
  selectedValue = input();
  selected = output<string>();

  isDropdownOpen = signal(false);

  selectedOption = computed(() =>
    this.options().find((option) => option.value === this.selectedValue()),
  );

  selectOption(value: string) {
    this.selected.emit(value);
    this.isDropdownOpen.set(false);
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }
}

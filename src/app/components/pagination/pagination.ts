import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const visibleCount = 5;

    let start = current - 2;
    let end = current + 2;

    if (start < 1) {
      start = 1;
      end = Math.min(visibleCount, total);
    }

    if (end > total) {
      end = total;
      start = Math.max(1, total - visibleCount + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  nextPage() {
    if (this.currentPage() >= this.totalPages()) return;

     this.pageChange.emit(this.currentPage() + 1);
  }

  prevPage() {
    if (this.currentPage() <= 1) return;

     this.pageChange.emit(this.currentPage() - 1);
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }
}

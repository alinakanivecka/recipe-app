import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node | null;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.appClickOutside.emit();
    }
  }
}

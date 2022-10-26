import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appTrim]',
})
export class TrimDirective {
  constructor(private elementRef: ElementRef, private ngModel: NgModel) {}

  @HostListener('change')
  onChange() {
    let value = this.elementRef.nativeElement.value;

    if (value) {
      value = value.trim();

      this.elementRef.nativeElement.value = value;
      this.ngModel.update.emit(value);
    }
  }
}

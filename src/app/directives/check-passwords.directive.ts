import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appCheckPasswords]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CheckPasswordsDirective,
      multi: true,
    },
  ],
})
export class CheckPasswordsDirective implements Validator {
  @Input('appCheckPasswords') password = '';

  constructor() {}

  validate(c: AbstractControl): ValidationErrors | null {
    if (c.value === this.password) {
      return null;
    }
    return {
      checkPasswords: { value: c.value },
    };
  }
}

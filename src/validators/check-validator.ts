import { FormControl } from '@angular/forms';
import {ValidationResult} from "../models/validation-result.interface";

export class CheckedValidator {

  public static isChecked(control: FormControl): ValidationResult {
    var valid = control.value === false || control.value === 'false';
    if (valid) {
      return { isChecked: true };
    }
    return null;
  }
}

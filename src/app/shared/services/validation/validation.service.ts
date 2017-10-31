import { ChangeDetectorRef, Injectable }      from '@angular/core';

import { FormGroup } from '@angular/forms';

@Injectable()
export class ValidationService {

  public frm: any;
  public formErrors: any [];
  public validationMessages: any [];

  public buildForm(controlConfig, formErrors, validationMessages): any {
    let self = this;

    self.formErrors = formErrors;
    self.validationMessages = validationMessages;

    self.frm = new FormGroup(controlConfig);

    self.frm.valueChanges
      .subscribe((data) => self.onValueChanged(data));

    self.onValueChanged(); // (re)set validation messages now

    return self.frm;
  }

  private onValueChanged(data?: any) {
    let self = this;

    if (!self.frm) {
      return;
    }
    const form = self.frm;
    for (const field in self.formErrors) {
      if (self.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        self.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = self.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              self.formErrors[field] += messages[key] + ' ';
              break;
            }
          }
        }
      }
    }
  }

}

export class ExtraValidators {
  public static conditional(conditional, validator) {
    return (control) => {
      revalidateOnChanges(control);

      if (control && control._parent) {
        if (conditional(control._parent)) {
          return validator(control);
        }
      }
    };
  }
}

function revalidateOnChanges(control): void {
  if (control && control._parent && !control._revalidateOnChanges) {
    control._revalidateOnChanges = true;
    control._parent
      .valueChanges
      .distinctUntilChanged((a, b) => {
        // These will always be plain objects coming from the form, do a simple comparison
        if (a && !b || !a && b) {
          return false;
        } else if (a && b && Object.keys(a).length !== Object.keys(b).length) {
          return false;
        } else if (a && b) {
          for (let i in a) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
        }
        return true;
      })
      .subscribe(() => {
        control.updateValueAndValidity();
      });

    control.updateValueAndValidity();
  }
  return;
}

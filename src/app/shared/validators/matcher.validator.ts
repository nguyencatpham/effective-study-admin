import {
  AbstractControl
} from '@angular/forms';

export const Matcher = (ipt1) => {
  return (control: AbstractControl): {[key: string]: boolean} => {
    const input1 = control.parent && control.parent.get(ipt1);
    const input2 = control;
    if (!input1 || !input2) {
      return null;
    }
    return input1.value === input2.value ? null : {nomatch: true};
  };
};

import {
  Directive,
  ElementRef,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[IntegerNumber]'
})
export class IntegerNumberDirective {
  public regexStr = '^[0-9]*$';

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event) {
    let e = <KeyboardEvent> event;

    if ([9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1) {
      // let it happen, don't do anything
      e.preventDefault();
      return;
    }
    if (// Allow backspace
    (e.keyCode === 8 && e.code === 'Backspace') ||
    // Allow: Ctrl+A
    (e.keyCode === 65 && e.ctrlKey === true) ||
    // Allow: Ctrl+C
    (e.keyCode === 67 && e.ctrlKey === true) ||
    // Allow: Ctrl+X
    (e.keyCode === 88 && e.ctrlKey === true) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }

    let key = String.fromCharCode(e.keyCode);

    if (e.code.indexOf('Digit') > -1
      || e.code.indexOf('Numpad') > -1) {
      key = e.key;
    }

    let regEx = new RegExp(this.regexStr);
    if (regEx.test(key)) {
      return;
    } else {
      e.preventDefault();
    }
  }
}

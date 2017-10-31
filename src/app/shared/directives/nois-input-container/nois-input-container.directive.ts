import {
  Directive,
  ElementRef,
  HostBinding,
  ContentChild
} from '@angular/core';

import {
  NoisInputDirective
} from '../nois-input';

@Directive({selector: '[nois-input-container]'})

export class NoisInputContainerDirective {
  @ContentChild(NoisInputDirective) public _noisInput: NoisInputDirective;

  @HostBinding('class.focused') get focused() {
    return this._noisInput && this._noisInput.focused;
  }

  constructor(private el: ElementRef) {
  }
}

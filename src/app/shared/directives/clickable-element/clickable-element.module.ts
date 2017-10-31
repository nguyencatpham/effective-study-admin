import {
  NgModule
} from '@angular/core';

import{
  ClickableElement
} from './clickable-element.directive';

import {
  CommonElementModule
} from './../common-element';

@NgModule({
  imports: [
    CommonElementModule
  ],
  declarations: [
    ClickableElement
  ],
  exports: [
    ClickableElement
  ]
})
export class ClickableElementModule {
}

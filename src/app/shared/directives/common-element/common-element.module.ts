import {
  NgModule
} from '@angular/core';

import{
  CommonElement
} from './common-element.directive';

@NgModule({
  imports: [],
  declarations: [
    CommonElement
  ],
  exports: [
    CommonElement
  ]
})
export class CommonElementModule {
}

import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import { IntegerNumberDirective } from './integer-number.directive';

@NgModule({
  declarations: [
    IntegerNumberDirective
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
  ],
  exports: [
    IntegerNumberDirective,
  ],
})
export class IntegerNumberModule {

}

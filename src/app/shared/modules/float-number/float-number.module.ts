import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import { FloatNumberDirective } from './float-number.directive';

@NgModule({
  declarations: [
    FloatNumberDirective
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
  ],
  exports: [
    FloatNumberDirective,
  ],
})
export class FloatNumberModule {

}

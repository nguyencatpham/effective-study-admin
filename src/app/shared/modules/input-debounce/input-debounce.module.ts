import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { InputDebounceComponent } from './input-debounce.component';
import { OffClickDirective } from './off-click/off-click.directive';

@NgModule({
  declarations: [
    InputDebounceComponent,
    OffClickDirective
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
    FormsModule
  ],
  exports: [
    InputDebounceComponent
  ],
  providers: []
})
export class InputDebounceModule {

}

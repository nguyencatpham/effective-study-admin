import {
  NgModule
} from '@angular/core';

import {
  NoisInputModule
} from '../nois-input';

import {
  NoisInputContainerDirective
} from './nois-input-container.directive';


@NgModule({
  imports: [
    NoisInputModule
  ],
  declarations: [
    NoisInputContainerDirective
  ],
  exports: [
    NoisInputContainerDirective
  ]
})
export class NoisInputContainerModule {
}

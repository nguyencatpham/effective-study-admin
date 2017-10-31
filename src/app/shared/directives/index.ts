import {
  NgModule
} from '@angular/core';

import {
  NoisInputDirective,
  NoisInputModule
} from './nois-input';

import {
  NoisInputContainerDirective,
  NoisInputContainerModule
} from './nois-input-container';

import {
  CommonElement,
  CommonElementModule
} from './common-element';

import {
  ClickableElement,
  ClickableElementModule
} from './clickable-element';

export const SHARED_DIRECTIVES = [
  CommonElement,
  ClickableElement,
  NoisInputDirective,
  NoisInputContainerDirective
];

export const SHARED_DIRECTIVE_MODULES = [
  NoisInputModule,
  NoisInputContainerModule,
  CommonElementModule,
  ClickableElementModule
];

@NgModule({
  imports: [
    ...SHARED_DIRECTIVE_MODULES
  ],
  exports: [
    ...SHARED_DIRECTIVE_MODULES
  ],
  declarations: [
  ],
})
export class SharedDirectiveModule {
}

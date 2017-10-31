import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  AuthLayoutComponent
} from './auth-layout-container.component';

@NgModule({
  imports: [
    SharedCommonModule
  ],
  exports: [
    AuthLayoutComponent
  ],
  declarations: [
    AuthLayoutComponent
  ],
  providers: [],
  entryComponents: [],
})
export class AuthLayoutModule {
}

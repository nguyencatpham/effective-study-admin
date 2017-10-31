import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SharedCommonModule
} from '../shared/common';

import {
  SHARED_DIRECTIVE_MODULES
} from '../shared/directives';

import {
  SignUpComponent
} from './sign-up.component'

import {
  routes
} from './sign-up.routes';

@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    SHARED_DIRECTIVE_MODULES
  ]
})
export class SignUpModule {
}

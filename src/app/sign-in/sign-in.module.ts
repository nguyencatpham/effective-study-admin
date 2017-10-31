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
  SignInComponent
} from './sign-in.component'

import {
  routes
} from './sign-in.routes';

@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    SHARED_DIRECTIVE_MODULES
  ]
})
export class SignInModule {
}

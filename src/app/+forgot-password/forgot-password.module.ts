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
  ForgotPasswordComponent
} from './forgot-password.component'

import {
  routes
} from './forgot-password.routes';

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule
  ]
})
export class ForgotPasswordModule {
}

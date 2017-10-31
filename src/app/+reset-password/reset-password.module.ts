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
  ResetPasswordComponent
} from './reset-password.component'

import {
  routes
} from './reset-password.routes';

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule
  ]
})
export class ResetPasswordModule {
}

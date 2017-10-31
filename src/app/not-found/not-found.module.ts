import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../shared/common';

import {
  NotFoundComponent
} from './not-found.component'

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    SharedCommonModule
  ]
})
export class NotFoundModule {
}

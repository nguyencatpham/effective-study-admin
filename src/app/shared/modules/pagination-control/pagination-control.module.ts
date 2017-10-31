import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  NgbPaginationModule
} from './pagination-custom';

import {
  PaginationControlComponent
} from './pagination-control.component';

@NgModule({
  declarations: [
    PaginationControlComponent
  ],
  imports: [
    SharedCommonModule,
    NgbPaginationModule.forRoot()
  ],
  exports: [
    PaginationControlComponent
  ]
})
export class PaginationControlModule {}

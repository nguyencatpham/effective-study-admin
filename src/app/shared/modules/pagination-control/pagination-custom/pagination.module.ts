import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationComponent } from './pagination.component';
import { NgbPaginationConfig } from './pagination-config';

export { PaginationComponent } from './pagination.component';
export { NgbPaginationConfig } from './pagination-config';

@NgModule({
  declarations: [PaginationComponent],
  exports: [PaginationComponent],
  imports: [CommonModule]
})
export class NgbPaginationModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgbPaginationModule,
      providers: [NgbPaginationConfig]
    };
  }
}

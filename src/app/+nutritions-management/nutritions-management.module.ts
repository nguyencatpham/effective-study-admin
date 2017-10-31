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
  routes
} from './nutritions-management.routes';

// 3rd modules
import {
  NgxDatatableModule
} from '@swimlane/ngx-datatable';
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  MyDatePickerModule
} from 'mydatepicker';

// Modules
import {
  InputDebounceModule
} from '../shared/modules/input-debounce';
import {
  PaginationControlModule
} from '../shared/modules/pagination-control';
import {
  NgSelectCustomModule
} from '../shared/modules/ng-select-custom';

// Components
import {
  NutritionsManagementComponent
} from './nutritions-management.component';
import {
  NutritionsMainComponent
} from './nutritions-main';
import {
  NutritionEditComponent
} from './nutritions-edit';

// Services
import {
  NutritionsManagementService
} from './nutritions-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';

@NgModule({
  declarations: [
    NutritionsManagementComponent,
    NutritionsMainComponent,
    NutritionEditComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    InputDebounceModule,
    PaginationControlModule,
    NgxDatatableModule,
    NgSelectCustomModule,
    MyDatePickerModule
  ],
  entryComponents: [],
  exports: [
  ],
  providers: [
    BreadcrumbService,
    ExtendedHttpService,
    NutritionsManagementService
  ]
})
export class NutritionsManagementModule {}

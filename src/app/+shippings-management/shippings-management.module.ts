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
} from './shippings-management.routes';

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
  ShippingsManagementComponent
} from './shippings-management.component';
import {
  ShippingsMainComponent
} from './shippings-main';
import {
  ShippingEditComponent
} from './shippings-edit';

// Services
import {
  ShippingsManagementService
} from './shippings-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';

@NgModule({
  declarations: [
    ShippingsManagementComponent,
    ShippingsMainComponent,
    ShippingEditComponent
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
    ShippingsManagementService
  ]
})
export class ShippingsManagementModule {}

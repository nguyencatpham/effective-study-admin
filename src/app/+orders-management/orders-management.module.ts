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
} from './orders-management.routes';

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
  OrdersManagementComponent
} from './orders-management.component';
import {
  OrdersMainComponent
} from './orders-main';

// Services
import {
  OrdersManagementService
} from './orders-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';
import { OrdersEditComponent } from './orders-edit/orders-edit.component';
import { OrdersInfoComponent } from './orders-edit/info/info.component';
import { OrdersShippingInfoComponent } from './orders-edit/shipping-info/shipping-info.component';
import { OrdersItemComponent } from './orders-edit/item/item.component';

@NgModule({
  declarations: [
    OrdersManagementComponent,
    OrdersMainComponent,
    OrdersEditComponent,
    OrdersInfoComponent,
    OrdersShippingInfoComponent,
    OrdersItemComponent
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
    OrdersManagementService
  ]
})
export class OrdersManagementModule {}

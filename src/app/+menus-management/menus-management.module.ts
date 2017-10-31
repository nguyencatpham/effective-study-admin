

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
} from './menus-management.routes';

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
  MenusManagementComponent
} from './menus-management.component';
import {
  MenusMainComponent
} from './menus-main';
import {
  MenusEditComponent
} from './menus-edit';
// Services
import {
  MenusManagementService
} from './menus-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';
import {
  MenusInfoComponent
} from './menus-edit/Info/info.component';
import { MenusProductComponent } from './menus-edit/Product/product.component';
import {
  ProductsManagementService
} from '../+products-management/products-management.service';
import {
  CategoriesManagementService
} from '../+categories-management/categories-management.service';
import {
  ConfirmDialogeModule,
  ConfirmDialogComponent
} from '../shared/modules/confirm-dialog';

@NgModule({
  declarations: [
    MenusManagementComponent,
    MenusMainComponent,
    MenusEditComponent,
    MenusInfoComponent,
    MenusProductComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    InputDebounceModule,
    PaginationControlModule,
    NgxDatatableModule,
    NgSelectCustomModule,
    MyDatePickerModule,
    ConfirmDialogeModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  exports: [
  ],
  providers: [
    BreadcrumbService,
    ExtendedHttpService,
    MenusManagementService,
    ProductsManagementService,
    CategoriesManagementService
  ]
})
export class MenusManagementModule {}

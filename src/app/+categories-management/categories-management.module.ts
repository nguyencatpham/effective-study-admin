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
} from './categories-management.routes';

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
  CategoriesManagementComponent
} from './categories-management.component';
import {
  CategoriesMainComponent
} from './categories-main';
import {
  CategoriesEditComponent
} from './categories-edit';

// Services
import {
  CategoriesManagementService
} from './categories-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';
import { TinymceModule } from 'angular2-tinymce';
import { FileUploadModule } from 'ng2-file-upload';
import {
  ConfirmDialogeModule,
  ConfirmDialogComponent
} from '../shared/modules/confirm-dialog';

@NgModule({
  declarations: [
    CategoriesManagementComponent,
    CategoriesMainComponent,
    CategoriesEditComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    InputDebounceModule,
    PaginationControlModule,
    NgxDatatableModule,
    NgSelectCustomModule,
    MyDatePickerModule,
    FileUploadModule,
    TinymceModule.withConfig({
      auto_focus: false
    }),
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
    CategoriesManagementService
  ]
})
export class CategoriesManagementModule {}

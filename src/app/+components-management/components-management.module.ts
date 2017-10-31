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
} from './components-management.routes';

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
  ComponentsManagementComponent
} from './components-management.component';
import {
  ComponentsMainComponent
} from './components-main';
import {
  ComponentEditComponent
} from './components-edit';

// Services
import {
  ComponentsManagementService
} from './components-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';
import { FileUploadModule } from 'ng2-file-upload';
import { ErrorDialogComponent } from '../shared/modules/error-dialog/error-dialog.component';
import { ErrorDialogeModule } from '../shared/modules/error-dialog/error-dialog.module';

@NgModule({
  declarations: [
    ComponentsManagementComponent,
    ComponentsMainComponent,
    ComponentEditComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    InputDebounceModule,
    PaginationControlModule,
    NgxDatatableModule,
    NgSelectCustomModule,
    FileUploadModule,
    MyDatePickerModule,
    ErrorDialogeModule
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  exports: [
  ],
  providers: [
    BreadcrumbService,
    ExtendedHttpService,
    ComponentsManagementService
  ]
})
export class ComponentsManagementModule {}

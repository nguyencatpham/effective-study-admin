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
} from './global-config.routes';

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
import {
  NavTabsModule
} from '../shared/modules/nav-tabs';

import {
  FileUploadModule
} from 'ng2-file-upload';

// Components
import {
  GlobalConfigComponent
} from './global-config.component';
import {
  GlobalConfigMainComponent
} from './global-config-main';
import {
  GlobalConfigEditComponent
} from './global-config-edit';

// Services
import {
  GlobalConfigService
} from './global-config.service';
import {
  ExtendedHttpService
} from '../shared/services/http';
import {
  CategoriesManagementService
} from '../+categories-management/categories-management.service';

import { TinymceModule } from 'angular2-tinymce';
import {
  ConfirmDialogeModule,
  ConfirmDialogComponent
} from '../shared/modules/confirm-dialog';

@NgModule({
  declarations: [
    GlobalConfigComponent,
    GlobalConfigMainComponent,
    GlobalConfigEditComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    InputDebounceModule,
    PaginationControlModule,
    NgxDatatableModule,
    NgSelectCustomModule,
    MyDatePickerModule,
    NavTabsModule,
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
    GlobalConfigService
  ]
})
export class GlobalConfigModule {}

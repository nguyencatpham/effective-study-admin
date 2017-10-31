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
} from './products-management.routes';

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
  ProductsManagementComponent
} from './products-management.component';
import {
  ProductsMainComponent
} from './products-main';
import {
  ProductsEditComponent
} from './products-edit';

// Services
import {
  ProductsManagementService
} from './products-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';
import {
  CategoriesManagementService
} from '../+categories-management/categories-management.service';
import {
  ProductsEditInfoComponent
} from './products-edit/info';
import {
  ProductsEditPictureComponent
} from './products-edit/picture';
import { TinymceModule } from 'angular2-tinymce';
import { ProductsEditComponentComponent } from './products-edit/component/component.component';
import { ProductsEditNutritionComponent } from './products-edit/nutrition/nutrition.component';
import {
  ConfirmDialogeModule,
  ConfirmDialogComponent
} from '../shared/modules/confirm-dialog';
import { ProductsEditSeoComponent } from './products-edit/seo/seo.component';
import { SelectModule } from 'ng2-select';
import { ErrorDialogeModule } from '../shared/modules/error-dialog/error-dialog.module';
import { ErrorDialogComponent } from '../shared/modules/error-dialog/error-dialog.component';

@NgModule({
  declarations: [
    ProductsManagementComponent,
    ProductsMainComponent,
    ProductsEditComponent,
    ProductsEditInfoComponent,
    ProductsEditPictureComponent,
    ProductsEditComponentComponent,
    ProductsEditNutritionComponent,
    ProductsEditSeoComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    InputDebounceModule,
    PaginationControlModule,
    NgxDatatableModule,
    NgSelectCustomModule,
    SelectModule,
    MyDatePickerModule,
    NavTabsModule,
    FileUploadModule,
    TinymceModule.withConfig({
      auto_focus: false
    }),
    ConfirmDialogeModule,
    ErrorDialogeModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    ErrorDialogComponent
  ],
  exports: [
  ],
  providers: [
    BreadcrumbService,
    ExtendedHttpService,
    ProductsManagementService,
    CategoriesManagementService
  ]
})
export class ProductsManagementModule {}

import {
  NgModule,
} from '@angular/core';

import {
  RouterModule,
} from '@angular/router';

import {
  SharedCommonModule,
} from '../shared/common';

import {
  routes,
} from './user-management.routes';

// 3rd modules
import {
  BreadcrumbService,
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import {
  FileUploadModule,
} from 'ng2-file-upload';

// Modules
import {
  InputDebounceModule,
} from '../shared/modules/input-debounce';
import {
  PaginationControlModule,
} from '../shared/modules/pagination-control';
import {
  PermissionModule,
} from '../shared/modules/permission';
import {
  ConfirmDialogeModule,
  ConfirmDialogComponent,
} from '../shared/modules/confirm-dialog';

// Components
import {
  UserManagementComponent,
} from './user-management.component';
import {
  UserMainComponent,
} from './user-main';
import {
  NewUserComponent,
} from './new-user';
import {
  EditUserComponent,
} from './edit-user';
import {
  CreateOrUpdateUserComponent,
} from './create-or-update-user';
import {
  UserProfileComponent,
} from './user-profile';

// Services
import {
  UserManagementService,
} from './user-management.service';
import {
  ExtendedHttpService,
} from '../shared/services/http';
import { EditUserInfoComponent } from './edit-user/info/info.component';
import { EditChefInfoComponent } from "./edit-user/chef/index";
import { TinymceModule } from 'angular2-tinymce';
import { EditChefRatingComponent } from './edit-user/rating/rating.component';

import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    NgxDatatableModule,
    InputDebounceModule,
    PaginationControlModule,
    FileUploadModule,
    PermissionModule,
    ConfirmDialogeModule,
    TinymceModule.withConfig({
      auto_focus: false
    }),
    StarRatingModule.forRoot()
  ],
  declarations: [
    UserManagementComponent,
    UserMainComponent,
    NewUserComponent,
    EditUserComponent,
    CreateOrUpdateUserComponent,
    UserProfileComponent,
    EditUserInfoComponent,
    EditChefInfoComponent,
    EditChefRatingComponent
  ],
  exports: [],
  entryComponents: [
    ConfirmDialogComponent,
  ],
  providers: [
    UserManagementService,
    ExtendedHttpService,
    BreadcrumbService
  ],
})
export class UserManagementModule {
}

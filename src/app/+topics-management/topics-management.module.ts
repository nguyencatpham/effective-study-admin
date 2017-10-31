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
} from './topics-management.routes';

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
import { TinymceModule } from 'angular2-tinymce';

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
  TopicsManagementComponent
} from './topics-management.component';
import {
  TopicsMainComponent
} from './topics-main';
import {
  TopicEditComponent
} from './topics-edit';

// Services
import {
  TopicsManagementService
} from './topics-management.service';
import {
  ExtendedHttpService
} from '../shared/services/http';
import { TopicEditSeoComponent } from './topics-edit/seo/seo.component';
import { TopicEditInfoComponent } from './topics-edit/info/info.component';
import { ConfirmDialogeModule } from '../shared/modules/confirm-dialog/confirm-dialog.module';
import { ConfirmDialogComponent } from '../shared/modules/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    TopicsManagementComponent,
    TopicsMainComponent,
    TopicEditComponent,
    TopicEditInfoComponent,
    TopicEditSeoComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    InputDebounceModule,
    PaginationControlModule,
    NgxDatatableModule,
    NgSelectCustomModule,
    MyDatePickerModule,
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
    TopicsManagementService
  ]
})
export class TopicsManagementModule {}

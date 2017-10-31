import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BreadcrumbService } from "ng2-breadcrumb/ng2-breadcrumb";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule, } from 'ng2-file-upload';
import { TinymceModule } from 'angular2-tinymce';
import { StarRatingModule } from 'angular-star-rating';

import { SharedCommonModule } from "../shared/common";
import { UserManagementService } from "../+user-management/user-management.service";
import { PaginationControlModule } from '../shared/modules/pagination-control';
import { ExtendedHttpService } from '../shared/services/http';

import { routes } from "./profile.routes";
import { ProfileService } from "./profile.service";
import { ProfileComponent } from "./profile.component";
import { ProfileInfoComponent } from "./info/info.component";
import { ProfileChefComponent } from "./chef/chef.component";
import { ProfileRatingComponent } from "./rating/rating.component";

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    NgxDatatableModule,
    FileUploadModule,
    PaginationControlModule,
    StarRatingModule.forRoot(),
    TinymceModule.withConfig({
      auto_focus: false
    }),
  ],
  declarations: [
    ProfileComponent,
    ProfileInfoComponent,
    ProfileChefComponent,
    ProfileRatingComponent
  ],
  exports: [

  ],
  providers: [
    ProfileService,
    ExtendedHttpService,
    UserManagementService
  ]
})
export class ProfileModule {
}
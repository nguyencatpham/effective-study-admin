import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import { PermissionDirective } from './permission.directive';

@NgModule({
  declarations: [
    PermissionDirective
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
  ],
  exports: [
    PermissionDirective,
  ],
})
export class PermissionModule {

}

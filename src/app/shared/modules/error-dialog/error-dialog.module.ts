import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ErrorDialogComponent } from './error-dialog.component';

@NgModule({
  declarations: [
    ErrorDialogComponent
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
    NgbModule
  ],
  exports: [
    ErrorDialogComponent,
  ],
})
export class ErrorDialogeModule {

}

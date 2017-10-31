import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  QuickViewLeftContentDirective
} from './quick-view-left-content.directive';

import {
  QuickViewRightContentDirective
} from './quick-view-right-content.directive';

import {
  QuickViewContentComponent
} from './quick-view-content.component';

@NgModule({
  declarations: [
    QuickViewContentComponent,
    QuickViewLeftContentDirective,
    QuickViewRightContentDirective
  ],
  imports: [
    CommonModule // ngTemplateOutlet
  ],
  exports: [
    QuickViewContentComponent,
    QuickViewLeftContentDirective,
    QuickViewRightContentDirective
  ],
})
export class QuickViewModule {

}

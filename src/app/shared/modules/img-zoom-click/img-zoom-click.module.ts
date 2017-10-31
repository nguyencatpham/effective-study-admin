import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ImgZoomClickComponent } from './img-zoom-click.component';
import { ImgZoomClickDirective } from './img-zoom-click.directive';

@NgModule({
  declarations: [
    ImgZoomClickComponent,
    ImgZoomClickDirective,
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
    NgbModule
  ],
  exports: [
    ImgZoomClickComponent,
    ImgZoomClickDirective
  ],
})
export class ImgZoomClickModule {
}

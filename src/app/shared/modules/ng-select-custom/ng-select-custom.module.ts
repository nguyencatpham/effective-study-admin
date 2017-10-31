import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SelectModule } from 'ng2-select';

import { NgSelectCustomComponent } from './ng-select-custom.component';

@NgModule({
    declarations: [
      NgSelectCustomComponent,
    ],
    imports: [
      CommonModule,
      SelectModule,
    ],
    exports: [
      NgSelectCustomComponent,
    ],
  },
)
export class NgSelectCustomModule {
}

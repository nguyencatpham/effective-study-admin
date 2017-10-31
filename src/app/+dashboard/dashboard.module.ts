import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SharedCommonModule
} from '../shared/common';

import 'd3';

import 'nvd3';
import {
  NvD3Module
} from 'ng2-nvd3';

import 'rickshaw';
import {
  RickshawModule
} from 'ng2-rickshaw';

import {
  UiSwitchModule
} from 'angular2-ui-switch';

import {
  DashboardComponent
} from './dashboard.component';

import {
  QuickViewComponent
} from './components/quickview';

import {
  routes
} from './dashboard.routes';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NvD3Module,
    RickshawModule,
    UiSwitchModule,
    SharedCommonModule
  ],
  exports: [
  ]
})
export class DashboardModule {}

import {
    NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
    TabPane
} from './tab-pane.component';

import {
    NavTabs
} from './nav-tabs.component';


@NgModule({
    declarations: [
        TabPane,
        NavTabs
    ],
    imports: [
        SharedCommonModule
    ],
    exports: [
        TabPane,
        NavTabs
    ]
})
export class NavTabsModule { }
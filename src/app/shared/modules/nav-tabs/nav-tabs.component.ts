import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit
} from '@angular/core';

import {
    TabPane
} from './tab-pane.component';


@Component({
    selector: 'nav-tabs',
    templateUrl: './nav-tabs.template.html',
    styleUrls: [
        'nav-tabs.style.scss'
    ]
})
export class NavTabs implements AfterContentInit {
    @ContentChildren(TabPane) tabs: QueryList<TabPane>;
    
    ngAfterContentInit() {
        let activeTabs = this.tabs.filter((tab) => tab.active);

        if(activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: TabPane) {
        this.tabs.toArray().forEach((tab) => tab.active = false);
        tab.active = true;
    }
}
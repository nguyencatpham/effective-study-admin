import {
    Component,
    Input
} from '@angular/core';


@Component({
    selector: 'tab-pane',
    styles: [`
        .tab-pane {
            padding: 1em;
        }
    `],
    template: `
        <div [hidden]='!active' class='tab-pane'>
            <ng-content></ng-content>
        </div>
    `
})
export class TabPane {
    @Input('tabTitle') title: string;
    @Input() active: boolean = false;
}
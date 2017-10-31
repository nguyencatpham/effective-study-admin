import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'components-management',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: `
    <breadcrumb prefix="Dashboard"></breadcrumb>
    <router-outlet></router-outlet>
  `
})
export class ComponentsManagementComponent implements OnInit {
  constructor(private _breadcrumbService: BreadcrumbService) {}
  /**
   * Config text on breadcrumb
   */
  public ngOnInit(): void {
    this._breadcrumbService
      .addFriendlyNameForRoute('/components-management', 'Components Management');
    this._breadcrumbService
      .addFriendlyNameForRouteRegex('^/components-management/[0-9A-Za-z]*/edit$', 'Edit Component');
    this._breadcrumbService
      .hideRouteRegex('^/components-management/[0-9A-Za-z]*/detail$');
    this._breadcrumbService
      .hideRoute('/components-management/main');
  }
}

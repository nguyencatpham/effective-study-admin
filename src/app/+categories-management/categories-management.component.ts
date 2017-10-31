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
  selector: 'categories-management',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: `
    <breadcrumb prefix="Dashboard"></breadcrumb>
    <router-outlet></router-outlet>
  `
})
export class CategoriesManagementComponent implements OnInit {
  constructor(private _breadcrumbService: BreadcrumbService) {}

  /**
   * Config text on breadcrumb
   */
  public ngOnInit(): void {
    this._breadcrumbService
      .addFriendlyNameForRoute('/categories-management', 'Categories Management');
    this._breadcrumbService
      .addFriendlyNameForRouteRegex('^/categories-management/[0-9A-Za-z]*/edit$', 'Edit Category');
    this._breadcrumbService
      .hideRouteRegex('^/categories-management/[0-9A-Za-z]*/detail$');
    this._breadcrumbService
      .hideRoute('/categories-management/main');
  }
}

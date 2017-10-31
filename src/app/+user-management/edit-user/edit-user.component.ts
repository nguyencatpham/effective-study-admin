import * as _ from 'lodash';

import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

// 3rd modules
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  ToastrService
} from 'ngx-toastr';

// Services
import {
  UserManagementService
} from '../user-management.service';
import {
  AuthService
} from '../../shared/services/auth/auth.service';
import {
  UserContext
} from '../../shared/services/user-context/user-context';

// Interfaces
import {
  Roles,
  UserInfo
} from '../../shared/models/user.model';
import { ResponseMessage } from '../../shared/models/respone.model';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'edit-user',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'edit-user.template.html',
  styleUrls: [
    'edit-user.style.scss'
  ]
})
export class EditUserComponent implements OnInit, OnDestroy {
  public tabs = [];
  public userData: any = {};
  public loadUserTabsEmitter: any;

  constructor(private _authService: AuthService,
              private _userManagementService: UserManagementService,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    this.tabs = [
      {
        id: 0,
        name: 'Info',
        redirectUrl: 'user-info',
        isAllowDelete: false,
        isActive: false
      }];

    this._activatedRoute.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._userManagementService.getUser(params.id).subscribe(
          (resp: any) => {
            this.userData = resp;
            this.tabs = this.tabs.slice(0, 1);
            if (_.some(this.userData.roles, (i: any) => { return i.name === 'Chef' && i.status === true; })) {
              this.tabs.push.apply(this.tabs, [{
                id: 1,
                name: 'Chef Information',
                redirectUrl: 'chef-info',
                isAllowDelete: false,
                isActive: false
              }, {
                id: 2,
                name: 'Rating',
                redirectUrl: 'rating-info',
                isAllowDelete: false,
                isActive: false
              }]);
            }
          },
          (err) => {
            this._toastrService.error(err, "Error");
            this._router.navigate(['users-management', 'main']);
          }
        );
      }

      // this.loadUserTabsEmitter = this._userManagementService.loadUserTabsEvent.subscribe((data) => {
      //   this.tabs = this.tabs.slice(0, 1);
      //   if (_.some(data.roles, (i: any) => { return i.name === 'Chef' && i.status === true; })) {
      //     this.tabs.push.apply(this.tabs, [{
      //       id: 1,
      //       name: 'Chef Information',
      //       redirectUrl: 'chef-info',
      //       isAllowDelete: false,
      //       isActive: false
      //     }, {
      //       id: 2,
      //       name: 'Rating',
      //       redirectUrl: 'rating-info',
      //       isAllowDelete: false,
      //       isActive: false
      //     }]);
      //   }
      // });
    });

    // Config active nav tab when router changes
    this._router.events.subscribe((val: any) => {
      this.configNavTabs(val.urlAfterRedirects);
    });
  }
  /**
   * Active nav tab is selected
   * @param url
   */
  public configNavTabs(url: string): void {
    if (url) {
      let lastUrl = url.split('/');

      _.each(this.tabs, (item) => {
        item.isActive = false;

        if(item.redirectUrl === lastUrl[lastUrl.length - 1])
          item.isActive = true;
      });
    } else{
      _.each(this.tabs, (item) => {
        item.isActive = false;
      });
      this.tabs[0].isActive = true;
    }
  }
  /**
   * Event switch tab
   * @param index
   */
  public switchTab(event: Event, index: number): void {
    // Avoid click to tab when click delete on this tab
    if (!event.target['innerText']) {
      return;
    }
    this._router.navigate([this.tabs[index].redirectUrl],
      { relativeTo: this._activatedRoute });
  }

  public ngOnDestroy(): void {
    // this.loadUserTabsEmitter.unsubscribe();
  }
}

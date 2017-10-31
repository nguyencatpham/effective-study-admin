import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

// 3rd modules
import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

import { UserContext } from '../shared/services/user-context/user-context';
import { Roles, UserInfo } from '../shared/models/user.model';
import { ResponseMessage } from '../shared/models/respone.model';
import { ProfileService } from "./profile.service";


@Component({
  selector: 'profile',
  templateUrl: 'profile.template.html',
  styleUrls: ['profile.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit, OnDestroy {
  public tabs = [];
  public userData: any = {};
  public activeTabEmitter: any;

  constructor(private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _profileService: ProfileService,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    this.tabs = [
    {
      id: 0,
      name: 'Info',
      redirectUrl: 'info',
      isAllowDelete: false,
      isActive: false
    }];
    
    if(this._userContext.currentUser && this._userContext.currentUser.roles) {
      let isChef = this._userContext.currentUser.roles.some(item => {
        return item.name === 'Chef';
      });
      if (isChef) {
        this.tabs.push.apply(this.tabs, [{
          id: 1,
          name: 'Chef Information',
          redirectUrl: 'chef',
          isAllowDelete: false,
          isActive: false
        }, {
          id: 2,
          name: 'Rating',
          redirectUrl: 'ratings',
          isAllowDelete: false,
          isActive: false
        }]);
      }
    }
    this.activeTabEmitter = this._profileService.activeTabEvent.subscribe((index: number) => {
      this.tabs.forEach((value, idx) => {
        if(idx === index) {
          value.isActive = true;
        } else {
          value.isActive = false;
        }
      });
    });
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
    this.activeTabEmitter.unsubscribe();
  }
}

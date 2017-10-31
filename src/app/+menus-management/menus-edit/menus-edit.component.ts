import * as _ from 'lodash';
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

// 3rd modules
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  ToastrService
} from 'ngx-toastr';
// Services
import {
  MenusManagementService
} from '../menus-management.service';
// Model
import {
  MenuInfo
} from '../menus-management.model';


@Component({
  selector: 'menus-edit',
  templateUrl: './menus-edit.template.html',
  styleUrls: ['menus-edit.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenusEditComponent implements OnInit {
  public tabs = [];
  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _menusManagementService: MenusManagementService,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService) {
  }

  public ngOnInit(): void {
    this.tabs = [
      {
        id: 0,
        name: 'Menu Info',
        redirectUrl: 'menus-info',
        isAllowDelete: false,
        isActive: false
      },
      {
        id: 1,
        name: 'Products',
        redirectUrl: 'menus-product',
        isAllowDelete: false,
        isActive: false
      }
    ];

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

        if (item.redirectUrl === lastUrl[lastUrl.length - 1])
          item.isActive = true;
      });
    } else {
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
    this._router.navigate([this.tabs[index].redirectUrl], {relativeTo: this._activatedRoute});
  }

}

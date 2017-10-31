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
  Router,
  ActivatedRoute
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
  TopicsManagementService
} from '../topics-management.service';

@Component({
  selector: 'topic-edit',
  templateUrl: 'topics-edit.template.html',
  styleUrls: [ 'topics-edit.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopicEditComponent implements OnInit {
  public tabs = [];

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _topicManagementService: TopicsManagementService,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService){}

  public ngOnInit(): void {
    this.tabs = [
      {
        id: 0,
        name: 'Topic Info',
        redirectUrl: 'topic-info',
        isAllowDelete: false,
        isActive: false
      }];

    this._activatedRoute.params.subscribe(params => {
      if(params.id != 'new'){
        this.tabs.push.apply(this.tabs, [{
            id: 1,
            name: 'SEO',
            redirectUrl: 'topic-seo',
            isAllowDelete: false,
            isActive: false
          }]);
      }
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
        if ( item.redirectUrl === lastUrl[lastUrl.length - 1] )
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

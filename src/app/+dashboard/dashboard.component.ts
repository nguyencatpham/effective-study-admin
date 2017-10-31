import {
  Component, OnInit,
  ViewEncapsulation,
} from '@angular/core';

import {
  RouterService
} from '../core/router';

import {
  Router
} from '@angular/router';

declare const d3: any;

import {
  nvD3
} from 'ng2-nvd3';

import * as Rickshaw from 'rickshaw';
import {
  rickshaw
} from 'ng2-rickshaw';
// import {rickshaw} from 'app/modules/ng2-rickshaw';
import {
  UserContext
} from '../shared/services/user-context';
import {
  RolesEnum
} from '../shared/models';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'dashboard',  // <dashboard></dashboard>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'dashboard.template.html',
  styleUrls: [
    'dashboard.style.scss'
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private _routerService: RouterService,
              private _router: Router,
              private userContext: UserContext) {

  }

  public ngOnInit(): void {
    setTimeout(() => {
      let currentUser = this.userContext.currentUser;

      if(currentUser.roles.find(item => item.id === RolesEnum.Administrator)) {
        this._router.navigate(['products-management']);
      } else {
        this._router.navigate(['profile']);
      }
    });
  }

}

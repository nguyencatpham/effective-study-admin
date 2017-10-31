import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

// 3rd modules
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  ToastrService
} from 'ngx-toastr';

// Components
import {
  CreateOrUpdateUserComponent
} from '../../create-or-update-user/create-or-update-user.component';

// Services
import {
  UserManagementService
} from '../../user-management.service';
import {
  AuthService
} from '../../../shared/services/auth/auth.service';
import {
  UserContext
} from '../../../shared/services/user-context/user-context';

// Interfaces
import {
  Roles,
  UserInfo
} from '../../../shared/models/user.model';
import { ResponseMessage } from '../../shared/models/respone.model';
import { ChefService } from '../../../shared/services/chef/chef.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'rating-info',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'rating.template.html',
  styleUrls: [
    'rating.style.scss'
  ]
})
export class EditChefRatingComponent implements OnInit {
  public ratings: any = [];

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _authService: AuthService,
              private _userManagementService: UserManagementService,
              private _chefService: ChefService,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._chefService.getAllRatings(params.id).subscribe(
          (resp: any) => {
            this.ratings = resp;
          },
          (err) => {
            this._toastrService.error(err, "Error");
            this._router.navigate(['users-management', 'main']);
          }
        );
      }
    });
  }

  /**
   * Config text on breadcrumb
   * @param username
   */
  public configFriendlyRoutes(username: string) {
    this._breadcrumbService
      .addFriendlyNameForRouteRegex('/user-management/.*', username);
  }
}

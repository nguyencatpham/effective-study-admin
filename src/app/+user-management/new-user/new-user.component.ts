import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  Router
} from '@angular/router';

// 3rd modules
import {
  ToastrService
} from 'ngx-toastr';
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';

// Services
import {
  UserManagementService
} from '../user-management.service';
import { ProgressService } from '../../shared/services/progress';
// Interfaces
import {
  CreateOrUpdateUserComponent
} from '../create-or-update-user';
import {
  Roles,
  UserInfo
} from '../../shared/models/user.model';
import {
  ResponseMessage
} from '../../shared/models/respone.model';
import {
  AuthService
} from '../../shared/services/auth/auth.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'new-user',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'new-user.template.html',
  styleUrls: [
    'new-user.style.scss'
  ]
})
export class NewUserComponent implements OnInit {
  @ViewChild(CreateOrUpdateUserComponent)
  public childComponent: CreateOrUpdateUserComponent;

  public userData: UserInfo;

  constructor(private _userManagementService: UserManagementService,
              private _authService: AuthService,
              private router: Router,
              private _progressService: ProgressService,
              private _breadcrumbService: BreadcrumbService,
              private _toastrService: ToastrService) {}

  public ngOnInit(): void {
    // Get all roles
    this._authService.getRoles()
      .subscribe((resp: ResponseMessage<Roles[]>) => {
        if (resp.status) {
          this.childComponent.roleListData = resp.data || [];
          this.childComponent.roleListData.sort((a: Roles, b: Roles) => {
            return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
          });
        } else {
          this._toastrService.error(resp.errorMessages, 'Error');
        }
      });
    this.configFriendlyRoutes();
  }

  /**
   * Config text on breadcrumb
   * @param username
   */
  public configFriendlyRoutes() {
    this._breadcrumbService
      .addFriendlyNameForRouteRegex('/user-management/.*', 'New User');
  }

  /**
   * submitData
   * @param userData
   */
  public submitData(userData: UserInfo) {
    this.userData = userData;
  }

  public onSubmit() {
    this._userManagementService.createUser(this.userData).subscribe(
      (resp: UserInfo) => {
        this._toastrService.success('New user is created', 'Success');
        this.router.navigate(['users-management', resp.id]);
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      }
    );
  }

  public cancel() {
    this.router.navigate(['users-management']);
  }
}

import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
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

// Components
import {
  CreateOrUpdateUserComponent
} from '../create-or-update-user/create-or-update-user.component';

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
  selector: 'user-profile',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'user-profile.template.html',
  styleUrls: [
    'user-profile.style.scss'
  ]
})
export class UserProfileComponent implements OnInit {
  @ViewChild(CreateOrUpdateUserComponent)
  public childComponent: CreateOrUpdateUserComponent;

  public userData: UserInfo;
  public showChangePassBtn = false;

  constructor(private _authService: AuthService,
              private _userManagementService: UserManagementService,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    this._authService.getProfile().subscribe(
      (resp: UserInfo) => {
        this.userData = resp;
        this._userManagementService.updateUserEvent.emit(this.userData);
        //this.configFriendlyRoutes(userInfoResp.data.username);
      },
      (err) => {
        this._toastrService.error(err, "Error");
        this._router.navigate(['not-found']);
      }
    );
  }

  /**
   * Config text on breadcrumb
   * @param username
   */
  public configFriendlyRoutes(username: string) {
    this._breadcrumbService
      .addFriendlyNameForRouteRegex('/user-management/.*', username);
  }

  /**
   * Fire event childComponent sumbit
   * @param userData
   */
  public submitData(userData: UserInfo) {
    this.userData = userData;
  }

  /**
   * Method call server to update user
   * @param value
   */
  public onSubmit() {
    this._authService.updateProfile(this.userData)
      .subscribe((resp: any) => {
        // update current user info in userContext
        this._userContext.update(this.userData);
        // Show change password button ater update completed
        this.showChangePassBtn = false;
        this.childComponent.changePasswordStatus = false;
        this._toastrService.success(resp.message, 'Success');
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      }
    );
  }

  public cancel() {
    this._router.navigate(['products-management']);
  }

  public revert() {
    this.showChangePassBtn = false;
    this.childComponent.resetData();
  }

  public changePassword() {
    this.showChangePassBtn = true;
    this.childComponent.changePassword();
  }
}

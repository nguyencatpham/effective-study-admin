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

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'user-info',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'info.template.html',
  styleUrls: [
    'info.style.scss'
  ]
})
export class EditUserInfoComponent implements OnInit {
  @ViewChild(CreateOrUpdateUserComponent)
  public childComponent: CreateOrUpdateUserComponent;

  public userData: any;
  public showChangePassBtn = false;

  constructor(private _authService: AuthService,
              private _userManagementService: UserManagementService,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    // Get id from url
    // this._activatedRoute.params.subscribe((params: { id: number }) => {
    //   if (params.id) {
    //     this._userManagementService.getUser(params.id).subscribe(
    //       (resp: UserInfo) => {
    //         this.userData = resp;
    //         this._userManagementService.updateUserEvent.emit(this.userData);
    //       },
    //       (err) => {
    //         this._toastrService.error(err, "Error");
    //         this._router.navigate(['not-found']);
    //       }
    //     );
    //   } else {
    //     this._router.navigate(['not-found']);
    //   }
    // });

    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._userManagementService.getUser(params.id).subscribe(
          (resp: UserInfo) => {
            this._userManagementService.loadUserTabsEvent.emit(Object.assign({}, resp));
            this.userData = resp;
            this._userManagementService.updateUserEvent.emit(this.userData);
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
    this.userData.roles = this.userData.listRoleIds;

    this._userManagementService.updateUser(this.userData)
      .subscribe((resp: any) => {
        // Show change password button ater update completed
        this.showChangePassBtn = false;
        this.childComponent.changePasswordStatus = false;
        // Update username on breadcrumb
        this.configFriendlyRoutes(this.userData.username);
        this._toastrService.success(resp.message, 'Success');
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      }
    );
  }

  public cancel() {
    this._router.navigate(['users-management']);
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

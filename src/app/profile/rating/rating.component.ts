import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

// 3rd modules
import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'angular-2-local-storage';

import { CreateOrUpdateUserComponent } from '../../+user-management/create-or-update-user';
import { UserManagementService } from '../../+user-management/user-management.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserContext } from '../../shared/services/user-context/user-context';
import { Roles, UserInfo } from '../../shared/models/user.model';
import { ResponseMessage } from '../../shared/models/respone.model';
import { ChefService } from '../../shared/services/chef/chef.service';
import { ProfileService } from "../profile.service";

@Component({
  selector: 'rating-info',
  templateUrl: 'rating.template.html',
  styleUrls: ['rating.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileRatingComponent implements OnInit {
  public ratings: any = [];

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _authService: AuthService,
              private _userManagementService: UserManagementService,
              private _profileService: ProfileService,
              private _chefService: ChefService,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    this._profileService.activeTabEvent.emit(2);
    if(this._userContext.currentUser) {
      this._chefService.getAllRatings(this._userContext.currentUser.id).subscribe(
        (resp: any) => {
          this.ratings = resp;
        },
        (err) => {
          this._toastrService.error(err, "Error");
          this._router.navigate(['']);
        }
      );
    }
  }

  /**
   * Config text on breadcrumb
   * @param username
   */
  public configFriendlyRoutes(username: string) {
    this._breadcrumbService
      .addFriendlyNameForRouteRegex('/profile/.*', username);
  }
}

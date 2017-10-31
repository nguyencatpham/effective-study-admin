import { Component,OnInit,ViewChild,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder,FormGroup,FormControl,Validators,FormArray } from '@angular/forms';

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
  selector: 'chef-info',
  templateUrl: 'chef.template.html',
  styleUrls: ['chef.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileChefComponent implements OnInit {
  public frm: FormGroup;
  public formErrors = {
    company: '',
    certification: '',
    experiences: ''
  };
  public validationMessages = {
    // name: {
    //   required: 'Name is required.'
    // },
    // price: {
    //   required: 'Price is required.'
    // },
    // categoryId: {
    //   required: 'CategoryId is required.'
    // },
    // chefId: {
    //   required: 'ChefId is required.'
    // }
  };
  public chefData: any = {};

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
    this._profileService.activeTabEvent.emit(1);
    this.buildForm();
    if(this._userContext.currentUser) {
      this._chefService.getById(this._userContext.currentUser.id).subscribe(
        (resp: any) => {
          this.chefData = resp;
          this.frm.patchValue(this.chefData);
        },
        (err) => {
          this._toastrService.error(err, "Error");
          this._router.navigate(['']);
        }
      );
    }
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      company: new FormControl(''),
      certification: new FormControl(''),
      experiences: new FormControl(''),
      bio: new FormControl(''),
      shortBio: new FormControl(''),
      facebookLink: new FormControl(''),
    });

    this.frm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
    this.backupData();
  }

  public onValueChanged(data?: any): void {
    const form = this.frm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  public backupData(): void {
    let data = Object.assign({}, this.frm.value);
    this._localStorageService.set('backupData', data);
  }

  /**
   * Config text on breadcrumb
   * @param username
   */
  public configFriendlyRoutes(username: string) {
    this._breadcrumbService
      .addFriendlyNameForRouteRegex('/profile/.*', username);
  }

  public onSubmitForm(): void {
    this._chefService.createOrUpdate(this.chefData.id, this.frm.value).subscribe(
      (resp: any) => {
        this._toastrService.success("Create or update chef", 'Success');
        // this._router.navigate(['user-management']);
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      });
  }

  public cancel() {
    this._router.navigate(['users-management']);
  }

  public delete(): void {

  }
}

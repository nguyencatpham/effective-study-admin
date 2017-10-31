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
  selector: 'chef-info',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'chef.template.html',
  styleUrls: [
    'chef.style.scss'
  ]
})
export class EditChefInfoComponent implements OnInit {
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
              private _chefService: ChefService,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    this.buildForm();

    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._chefService.getById(params.id).subscribe(
          (resp: any) => {
            this.chefData = resp;
            this.frm.patchValue(this.chefData);
          },
          (err) => {
            this._toastrService.error(err, "Error");
            this._router.navigate(['users-management', 'main']);
          }
        );
      }
    });
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
      .addFriendlyNameForRouteRegex('/user-management/.*', username);
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

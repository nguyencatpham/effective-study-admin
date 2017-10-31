import * as _ from 'lodash';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

// 3rd modules
import {
  FileUploader
} from 'ng2-file-upload';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  ToastrService
} from 'ngx-toastr';
import * as NProgress from 'nprogress';

// Services
import {
  UserContext
} from '../../shared/services/user-context';
import {
  AuthService
} from '../../shared/services/auth';
import {
  UserManagementService
} from '../user-management.service';

// Validators
import {
  Matcher
} from '../../shared/validators/matcher.validator';

// App Constant
import {
  AppConstant
} from '../../app.constant';

// Interfaces
import {
  Roles,
  UserInfo
} from '../../shared/models/user.model';
import {
  RolesEnum
} from '../../shared/models/enums.model';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'create-or-update-user',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'create-or-update-user.template.html',
  styleUrls: [
    'create-or-update-user.style.scss'
  ]
})
export class CreateOrUpdateUserComponent implements OnInit,
  OnDestroy,
  AfterViewInit {
  @Output()
  public onValueChange = new EventEmitter<any>();

  @Input()
  public isShowRoles = true;

  @ViewChildren('roleListElement')
  public roleListElement: QueryList<any>;
  public roleListData: Roles[] = [];

  public frm: FormGroup;
  public formErrors = {
    isActive: '',
    userName: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };
  public validationMessages = {
    username: {
      required: 'Username is required.'
    },
    password: {
      required: 'Password is required.',
      pattern: 'Password must have at least 8 characters,' +
      ' 1 uppercase letter, 1 lowercase letter, and 1 number.'
    },
    confirmPassword: {
      required: 'ConfirmPassword is required.',
      nomatch: 'Password does not match'
    },
    email: {
      required: 'Email is required.',
      pattern: 'Email address is not valid'
    },
    firstName: {
      required: 'First Name is required.'
    },
    lastName: {
      required: 'Last Name is required.'
    },
    phoneNumber: {
      required: 'Phone Number is required.'
    }
  };
  public listRoleIds = [];
  public changePasswordStatus = true;

  public currentUserInfo: UserInfo;

  public uploader: FileUploader;

  public permission = {
    role: [RolesEnum.Administrator]
  };

  constructor(private _fb: FormBuilder,
              private _toastrService: ToastrService,
              private _userManagementService: UserManagementService,
              private _userContext: UserContext) {
    // Subscribe event input user info from edit user page
    this._userManagementService.updateUserEvent
      .subscribe((userInfo: UserInfo) => {
        this.currentUserInfo = userInfo;
        this.roleListData = userInfo.roles;

        this.listRoleIds = _.map(_.filter(this.roleListData, (i) => {
          return i.status;
        }), (item) => {
          return item.id;
        });

        this.currentUserInfo.password = 'Abc123123';
        this.currentUserInfo.confirmPassword = 'Abc123123';
        this.changePasswordStatus = false;
        this.frm.reset();
        this.frm.patchValue(this.currentUserInfo);
        this.isShowRoles = this.currentUserInfo.id !== this._userContext.currentUser.id;
        this.checkSubmitForm();
      });
  }

  public ngOnInit(): void {
    this.buildForm();
    // Config url & token for upload avatar
    this.initUploader();
  }

  public initUploader(): void {
    // Config url & token for upload avatar
    this.uploader = new FileUploader({
      url: `${AppConstant.domain}/images/upload`,
      authToken: `Bearer ${this._userContext.userToken.accessToken}`,
    });
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
  }

  /**
   * Check roles for each user's role
   */
  public ngAfterViewInit(): void {
    this.roleListElement.changes.subscribe((listRoles: ElementRef[]) => {
      listRoles.forEach((role) => {
        if (this.listRoleIds.length && role.nativeElement) {
          let checked = this.listRoleIds.filter((r) => r === +role.nativeElement.id);
          if (checked.length) {
            role.nativeElement.checked = true;
          }
        }
      });
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      id: new FormControl(''),
      isActive: new FormControl(true),
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*[ ]).*$')
      ])),
      confirmPassword: new FormControl('', [Validators.required, Matcher('password')]),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@'
          + '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ])),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      imageId: new FormControl(''),
      imageUrl: new FormControl('')
    });

    this.frm.valueChanges
      .subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  /**
   * onValueChanged
   * @param data
   */
  public onValueChanged(data?: UserInfo): void {
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
    this.checkSubmitForm();
  }

  /**
   * Fire change role event
   * @param event
   * @param role
   */
  public changeRoleStatus(event: Event, role: Roles): void {
    let itemIndex = this.listRoleIds.indexOf(role.id);
    if (itemIndex > -1) {
      // Avoid duplicate role
      this.listRoleIds.splice(itemIndex, 1);
    } else {
      // If role checked, push id to list role
      if (event.target['checked']) {
        this.listRoleIds.push(role.id);
      }
    }
    this.checkSubmitForm();
  }

  /**
   * Fire upload avatar event
   */
  public uploadAvatar(): void {
    // Start upload avatar
    this.uploader.queue[0].upload();
    // Start loading bar while uploading
    this.uploader.onProgressItem = () => NProgress.start();
    this.uploader.onSuccessItem = (item, resp) => {
      let image = JSON.parse(resp);
      this.frm.patchValue({
        imageId: image.id,
        imageUrl: image.url
      });
      // Clear uploaded item in uploader
      this.uploader.clearQueue();
      // End loading bar
      NProgress.done();
    };
    this.uploader.onErrorItem = (item, err) => {
      NProgress.done();
      this._toastrService.error(err, 'Error');
    };
  }

  /**
   * Fire remove avatar event
   */
  public removeAvatar(): void {
    this.frm.patchValue({
      imageId: '',
      imageUrl: ''
    });
  }

  /**
   * Fire change password event
   */
  public changePassword(): void {
    this.changePasswordStatus = !this.changePasswordStatus;
    this.frm.patchValue({
      password: '',
      confirmPassword: ''
    });
  }

  /**
   * Reset value form
   */
  public resetData(): void {
    this.buildForm();
    // Revert role
    this.listRoleIds = [];
    this.roleListElement.forEach((roleEle: ElementRef) => {
      roleEle.nativeElement.checked = false;
    });
    this.changePasswordStatus = true;
  }

  /**
   * Check value form is valid and emit value
   */
  public checkSubmitForm(): void {
    if (this.frm.valid) {
      let model = {
        ...this.frm.value,
        listRoleIds: this.listRoleIds
      };
      this.onValueChange.emit(model);
    } else {
      this.onValueChange.emit();
    }
  }

  public ngOnDestroy(): void {
    // empty
  }
}

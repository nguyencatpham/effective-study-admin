import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

// 3rd modules
import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload';
import * as NProgress from 'nprogress';

// Components
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserContext } from '../../shared/services/user-context/user-context';
import { Roles, UserInfo } from '../../shared/models/user.model';
import { ResponseMessage } from '../../shared/models/respone.model';
import { Matcher } from '../../shared/validators/matcher.validator';
import { ProfileService } from "../profile.service";
import { AppConstant } from "../../app.constant";

@Component({
  selector: 'profile-info',
  templateUrl: 'info.template.html',
  styleUrls: ['info.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileInfoComponent implements OnInit {
  public frm: FormGroup;
  public uploader: FileUploader;
  public userData: any;
  public showChangePassword = false;

  constructor(private _fb: FormBuilder, 
              private _authService: AuthService,
              private _profileService: ProfileService,
              private _activatedRoute: ActivatedRoute,
              private _toast: ToastrService,
              private _breadcrumbService: BreadcrumbService,
              private _router: Router,
              private _userContext: UserContext) {}

  public ngOnInit(): void {
    this._profileService.activeTabEvent.emit(0);
    this.buildForm();
    this.initUploader();

    this._authService.getProfile().subscribe((resp: UserInfo) => {
      this._userContext.currentUser = resp;
      this.userData = this._userContext.currentUser;
      this.frm.patchValue(this.userData);
    }, (err) => {
      this._toast.error(err, "Error");
      this._router.navigate(['']);
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      imageId: [''],
      imageUrl: ['']
    });
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

    this.uploader.onProgressItem = () => NProgress.start();

    this.uploader.onSuccessItem = (item, resp) => {
      let image = JSON.parse(resp);
      this.frm.patchValue({
        imageId: image.id,
        imageUrl: image.url
      });
      this.uploader.clearQueue();
      NProgress.done();
    };

    this.uploader.onErrorItem = (item, err) => {
      NProgress.done();
      this._toast.error(err, 'Error');
    };
  }

  public uploadAvatar(): void {
    this.uploader.uploadAll();
  }

  public onSubmit() {
    let data = {
      ...this.frm.value
    }
    
    this._profileService.update(this.userData.id, data).subscribe((resp: any) => {
      this._userContext.currentUser = {
        ...this.userData,
        data
      }
      this.userData = this._userContext.currentUser;
      this.showChangePassword = false;
      this._toast.success('Profile has been updated');
    }, (err) => {
      this._toast.error(err, 'Error');
    });
  }

  public cancel() {
    this._router.navigate(['']);
  }

  public changePassword() {
    this.frm.addControl('password', new FormControl('', [Validators.required]));
    this.frm.addControl('confirmPassword', new FormControl('', [Validators.required, Matcher('password')]));
    this.showChangePassword = true;
  }
}

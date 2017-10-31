import * as NProgress from 'nprogress';

import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

// 3rd modules
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  ToastrService
} from 'ngx-toastr';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

// Services
import {
  CategoriesManagementService
} from '../categories-management.service';

// Interfaces
import {
  CategoryInfo,
} from '../categories-management.model';
import {
  ConfirmDialogComponent
} from '../../shared/modules/confirm-dialog/confirm-dialog.component';
import { FileUploader } from 'ng2-file-upload';
import { AppConstant } from '../../app.constant';
import { UserContext } from '../../shared/services/user-context/user-context';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'categories-edit',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'categories-edit.template.html',
  styleUrls: [
    'categories-edit.style.scss'
  ]
})
export class CategoriesEditComponent implements OnInit {
  public uploader: FileUploader;
  public frm: FormGroup;
  public formErrors = {
    name: ""
  };

  public validationMessages = {
    name: {
      required: 'Name is required.'
    }
  };

  public categoryInfo;

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _categoriesManagementService: CategoriesManagementService,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _userContext: UserContext,
              private _breadcrumbService: BreadcrumbService) {
    this.categoryInfo = {
      imageUrl: "http://api.reewod.com/public/uploads/no-images.jpg"
    };
  }

  public ngOnInit(): void {
    this.buildForm();
    this.initUploader();
    this._activatedRoute.parent.params.subscribe((params: { id: number }) => {

      if (!isNaN(params.id)) {
        this._categoriesManagementService.getCategoryInfo(params.id).subscribe(
          (resp: CategoryInfo) => {
            this.categoryInfo = resp;
            this.frm.patchValue(this.categoryInfo);
            this.configFriendlyRoutes();
          },
          (err) => {
            this._toastrService.error(err, "Error");
            this._router.navigate(['categories-management', 'main']);
          }
        );
      }
    });
  }

  public configFriendlyRoutes(): void {
    this._breadcrumbService
      .addCallbackForRouteRegex('^/categories-management/[0-9]*$', () => this.categoryInfo.name);
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      imageId: new FormControl(''),
      parentId: new FormControl(0),
      isShowHomePage: new FormControl(true),
      isShowOnMenu: new FormControl(true),
      isPublished: new FormControl(true),
      displayOrder: new FormControl(0)
    });

    this.frm.valueChanges
      .subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
    this.backupData();
  }

  public onValueChanged(data?: CategoryInfo): void {
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

  public onSubmitForm(): void {
    let model = {
      ...this.frm.value,
      imageId: this.categoryInfo.imageId
    };
    if (this.categoryInfo && this.categoryInfo.id) {
      this._categoriesManagementService.updateCategory(this.categoryInfo.id, model).subscribe(
        (resp: any) => {
          this._toastrService.success("Category id updated", 'Success');
          this._router.navigate(['categories-management']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
          this.revertData(true);
        }
      );
    } else {

      this._categoriesManagementService.createCategory(model).subscribe(
        (resp: CategoryInfo) => {
          this._toastrService.success("Category is created", 'Success');
          this._router.navigate(['categories-management', resp.id, 'edit']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        }
      );
    }
  }

  public backupData(): void {
    let data = Object.assign({}, this.frm.value);
    this._localStorageService.set('backupData', data);
  }

  public revertData(isEdit: boolean): void {
    if (!isEdit) {
      // Assign init value because this properties become null after reset
      this.buildForm();
      return;
    }
    this.frm.patchValue(this._localStorageService.get('backupData'));
    this.backupData();
  }

  public initUploader(): void {
    // Config url & token for upload avatar
    this.uploader = new FileUploader({
      url: `${AppConstant.domain}/images/upload`,
      authToken: `Bearer ${this._userContext.userToken.accessToken}`,
    });
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }
  }

  public uploadImage(): void {
    // Start upload avatar
    this.uploader.queue[0].upload();
    // Start loading bar while uploading
    this.uploader.onProgressItem = () => NProgress.start();
    this.uploader.onSuccessItem = (item, resp) => {
      let image = JSON.parse(resp);
      this.categoryInfo.imageId = image.id;
      this.categoryInfo.imageUrl = image.url;
      this.uploader.clearQueue();
      // End loading bar
      NProgress.done();
      this._toastrService.success("Success", 'Success');
    };
    this.uploader.onErrorItem = (item, err) => {
      NProgress.done();
      this._toastrService.error(err, 'Error');
    };
  }

  public cancel(): void {
    this._router.navigate(['categories-management', 'main']);
  }

  public delete(): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, {
      keyboard: true
    });
    modalRef.componentInstance.title = "Delete Category";
    modalRef.componentInstance.message = 'Are you sure you want to delete this category? This cannot be undone.';

    modalRef.result.then((resp: boolean) => {
      if(resp) {
        this._categoriesManagementService.deleteCategory(this.categoryInfo.id).subscribe(
          (resp) => {
            this._toastrService.success("Category is deleted", "Success");
            this._router.navigate(['menus-mangement', 'main']);
          },
          (err) => {
            this._toastrService.error(err, "Error");
          }
        )
      }
    },(err) => {});
  }
}

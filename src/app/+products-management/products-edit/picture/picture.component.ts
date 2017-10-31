import * as _ from 'lodash';

import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
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
import * as NProgress from 'nprogress';

// 3rd modules
import {
  FileUploader
} from 'ng2-file-upload';
import {
  DatatableComponent
} from '@swimlane/ngx-datatable';
import {
  RowSelectEvent,
  SortEvent
} from '../../../shared/models/ngx-datatable.model';

// Services
import {
  ProductsManagementService
} from '../../products-management.service';
import {
  CategoriesManagementService
} from '../../../+categories-management/categories-management.service';

// Interfaces
import {
  BasicProduct,
  ProductInfo,
  ImageInfo,
  ProductImageInfo
} from '../../products-management.model';
import {
  BasicResponse,
  ResponseMessage
} from '../../../shared/models/respone.model';
import {
  CategoryInfo
} from '../../../+categories-management/categories-management.model';
import {
  AppConstant
} from '../../../app.constant';
import {
  UserContext
} from '../../../shared/services/user-context';
import {ConfirmDialogComponent} from '../../../shared/modules/confirm-dialog/confirm-dialog.component';
import * as imageTypes from '../../../../assets/mock-data/image-type.json';

@Component({
  selector: 'products-edit-picture',
  templateUrl: 'picture.template.html',
  styleUrls: [
    'picture.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductsEditPictureComponent implements OnInit, AfterViewChecked {
  public uploader: FileUploader;
  @ViewChild('tableWrapper')
  public tableWrapper;
  @ViewChild(DatatableComponent)
  public table: DatatableComponent;
  public currentComponentWidth;
  public productImages: ProductImageInfo[];
  public model: ProductImageInfo;
  public frm: FormGroup;
  public productId: number;
  public imageTypes = imageTypes;

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _productsManagementService: ProductsManagementService,
              private _categoriesManagementService: CategoriesManagementService,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _userContext: UserContext,
              private _breadcrumbService: BreadcrumbService) {

  }

  public ngOnInit(): void {
    this.productImages = [];
    this.buildForm();
    this.model = this.frm.value;
    this.model.imageUrl = `${AppConstant.domain}/public/uploads/no-images.jpg`;

    this.initUploader();
    this._activatedRoute.parent.params.subscribe((params: {id: number}) => {
      if(params.id) {
        this.productId = params.id;
        this._productsManagementService.getImages(params.id).subscribe(
          (resp: ProductImageInfo[]) => {
            this.productImages = resp;
          },
          (err) => {
            this._toastrService.error(err, 'Error');
          }
        );
      }
    });
  }

  public ngAfterViewChecked() {
    // Check if the table size has changed
    if (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      setTimeout(() => {
        this.table.recalculate();
      }, 200);
    }
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

  public buildForm(): void {
    this.frm = this._fb.group({
      displayOrder: [0],
      alt: [""],
      title: [""],
      type: [""]
    });
  }

  public uploadImage(): void {
    // Start upload avatar
    this.uploader.queue[0].upload();
    // Start loading bar while uploading
    this.uploader.onProgressItem = () => NProgress.start();
    this.uploader.onSuccessItem = (item, resp) => {
      let image = JSON.parse(resp);
      this.model.imageId = image.id;
      this.model.imageUrl = image.url;
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

  public onSubmitForm(): void {
    let data = {
      ...this.frm.value,
      imageId: this.model.imageId,
      imageUrl: this.model.imageUrl
    }
    if(this.model.id) {
      this._productsManagementService.updateProductImage(this.model.id, data).subscribe(
        (resp: any) => {
          this.productImages = _.map(this.productImages, function(item){
            if(item.imageId == data.imageId) {
              item.displayOrder = data.displayOrder;
              item.alt = data.alt;
              item.title = data.title;
              item.type = data.type;
            }
            return item;
          });
          this.clear();
          this._toastrService.success("Success", 'Success');
        },
        (err) => {
          this._toastrService.error(err, "Error");
        }
      );
    } else {
      this._productsManagementService.addImageToProduct(this.productId,  data).subscribe(
        (resp: any) => {
          this.productImages.push(data);
          this.clear();
          this._toastrService.success("Success", 'Success');
        },
        (err) => {
          this._toastrService.error(err, "Error");
        }
      );
    }
  }

  public edit(id: number): void {
    this.model = _.find(this.productImages, {id: id});
    this.frm.patchValue(this.model);
  }

  public delete(id: number): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, {
      keyboard: true,
    });
    modalRef.componentInstance
      .message = 'Are you sure you want to remove the image? This cannot be undone.';
    modalRef.componentInstance.title = 'Remove image from product';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this._productsManagementService.removeImageFromProduct(id).subscribe(
          (resp) => {
            this.productImages = _.filter(this.productImages, function(item){
              return item.id != id;
            });
          },
          (err) => {
            this._toastrService.error(err, "Error");
          }
        );
      }
    });
  }

  public clear(): void {
    this.buildForm();
    this.model = this.frm.value;
    this.model.imageUrl = `${AppConstant.domain}/public/uploads/no-images.jpg`;
    this.uploader.clearQueue();
    this.uploader.cancelAll();
  }
}

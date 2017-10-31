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
  ProductsManagementService
} from '../../products-management.service';
import {
  CategoriesManagementService
} from '../../../+categories-management/categories-management.service';

// Interfaces
import {
  BasicProduct,
  ProductInfo
} from '../../products-management.model';
import {
  BasicResponse,
  ResponseMessage
} from '../../../shared/models/respone.model';
import {
  CategoryInfo
} from '../../../+categories-management/categories-management.model';
import {
  ConfirmDialogComponent
} from '../../../shared/modules/confirm-dialog';
import { ChefService } from '../../../shared/services/chef/chef.service';

@Component({
  selector: 'products-edit-info',
  templateUrl: 'info.template.html',
  styleUrls: [
    'info.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductsEditInfoComponent implements OnInit {
  public frm: FormGroup;
  public formErrors = {
    name: '',
    price: '',
    oldPrice: '',
    categoryId: '',
    chefId: ''
  };
  public validationMessages = {
    name: {
      required: 'Name is required.'
    },
    price: {
      required: 'Price is required.'
    },
    oldPrice: {
      required: 'OldPrice is required.'
    },
    categoryId: {
      required: 'CategoryId is required.'
    },
    chefId: {
      required: 'ChefId is required.'
    }
  };

  public product: ProductInfo;
  public categories: CategoryInfo[];
  public chefs: any = [];

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _productsManagementService: ProductsManagementService,
              private _categoriesManagementService: CategoriesManagementService,
              private _chefService: ChefService,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService) {

  }

  public ngOnInit(): void {
    this.buildForm();
    this._categoriesManagementService.getAllCategories().subscribe(
      (categories: CategoryInfo[]) => {
        this.categories = categories;
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      }
    );

    this._chefService.getAll().subscribe(
      (resp: any) => {
        this.chefs = resp;
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      }
    );

    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._productsManagementService.getProduct(params.id).subscribe(
          (product: ProductInfo) => {
            this.product = product;
            this.frm.patchValue(this.product);
          },
          (err) => {
            this._toastrService.error(err, 'Error');
            this._router.navigate(['products-management', 'main']);
          });
      }
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      shortDescription: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl('', [Validators.required]),
      oldPrice: new FormControl('', [Validators.required]),
      isPublished: new FormControl(false),
      categoryId: new FormControl('', [Validators.required]),
      imageUrl: new FormControl(''),
      prepairation: new FormControl(''),
      chefId: new FormControl('', [Validators.required])
    });

    this.frm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
    this.backupData();
  }

  public onValueChanged(data?: ProductInfo): void {
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
    if (this.product && this.product.id) {
      this._productsManagementService.updateProduct(this.product.id, this.frm.value).subscribe(
        (resp: BasicResponse) => {
          this._toastrService.success("Product is updated", 'Success');
          this._router.navigate(['products-management']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        });
    } else {
      let model = {
        ...this.frm.value,
        isShowHomePage: true
      };
      this._productsManagementService.createProduct(model).subscribe(
        (resp: ProductInfo) => {
          this._toastrService.success("Product is added", 'Success');
          this._router.navigate(['products-management', resp.id]);
          // this.revertData(false);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        });
    }
  }

  public cancel(): void {
    this._router.navigate(['products-management']);
  }

  public delete(): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, { keyboard: true});
    modalRef.componentInstance.title = "Delete Product";
    modalRef.componentInstance.message = "Are you sure you want to delete this product? This cannot be undone.";
    modalRef.result.then((resp: boolean) => {
      if(resp) {
        this._productsManagementService.deleteProduct(this.product.id).subscribe(
          resp => {
            this._toastrService.success("Product is deleted", "Success");
            this._router.navigate(['products-management', 'main']);
          },
          err => {
            this._toastrService.error(err, "Error");
          }
        )
      }
    }).catch(err => {});
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
}

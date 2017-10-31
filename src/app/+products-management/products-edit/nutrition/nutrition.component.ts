import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

// 3rd modules
import {
  BreadcrumbService,
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  LocalStorageService,
} from 'angular-2-local-storage';
import {
  ToastrService,
} from 'ngx-toastr';
import {
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import * as NProgress from 'nprogress';
import * as _ from 'lodash';

// 3rd modules
import {
  FileUploader,
} from 'ng2-file-upload';

// Services
import {
  ProductsManagementService,
} from '../../products-management.service';
import {
  CategoriesManagementService,
} from '../../../+categories-management/categories-management.service';

// Interfaces
import {
  BasicProduct,
  ProductInfo,
  ProductNutritionInfo,
} from '../../products-management.model';
import {
  BasicResponse,
  ResponseMessage,
} from '../../../shared/models/respone.model';
import {
  CategoryInfo,
} from '../../../+categories-management/categories-management.model';
import {
  AppConstant,
} from '../../../app.constant';
import {
  UserContext,
} from '../../../shared/services/user-context';
import {
  NutritionInfo,
} from '../../../+nutritions-management/nutritions-management.model';
import { ConfirmDialogComponent } from "../../../shared/modules/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'products-edit-nutrition',
  templateUrl: 'nutrition.template.html',
  styleUrls: [
    'nutrition.style.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsEditNutritionComponent implements OnInit {
  public productId: number;
  public nutritions: NutritionInfo[];
  public availableNutritions: NutritionInfo[];
  public productNutritions: ProductNutritionInfo[];
  public frm: FormGroup;

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
    this.buildForm();
    this._activatedRoute.parent.params.subscribe((params: {id: number}) => {
      if(params.id) {
        this.productId = params.id;
        this._productsManagementService.getNutritions().subscribe(
          (resp: NutritionInfo[]) => {
            this.nutritions = resp;
            this._productsManagementService.getProductNutritions(params.id).subscribe(
              (resp: ProductNutritionInfo[]) => {
                this.productNutritions = resp;
                this.updateAvailableNutritions();
              },
              (err) => {
                this._toastrService.error(err, "Error");
              },
            );
          },
          (err) => {
            this._toastrService.error(err, "Error");
          },
        )
      }
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      nutritionId: ["", Validators.required],
      value: [""],
      parentId: [""],
    });
  }

  public updateAvailableNutritions(): void {
    this.availableNutritions = _.filter(this.nutritions, (n) => {
      let index = _.findIndex(this.productNutritions, (pn) => pn.nutritionId === n.id);
      return index === -1;
    });
  }

  public onSubmitForm(): void {
    let data = {
      ...this.frm.value,
    }
    this._productsManagementService.addNutritionToProduct(this.productId, data).subscribe(
      (resp: ProductNutritionInfo) => {
        let newItem = resp;
        let selectedNutrition = _.find(this.nutritions, (item) => item.id == newItem.nutritionId);
        newItem.nutritionName = selectedNutrition.name;
        this.productNutritions.push(newItem);
        this.updateAvailableNutritions();
        this.buildForm();
        this._toastrService.success("Nutrition is added", "Success");
      },
      (err) => {
        this._toastrService.error(err, "Error");
      },
    )
  }

  public remove(productNutritionId: number): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, {
      keyboard: true,
    });
    modalRef.componentInstance
      .message = 'Are you sure you want to remove the nutrition? This cannot be undone.';
    modalRef.componentInstance.title = 'Remove nutrition from product';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this._productsManagementService.removeNutritionFromProduct(productNutritionId).subscribe(
          (resp: any) => {
            this.productNutritions = _.filter(this.productNutritions, (item) => item.id != productNutritionId);
            this.updateAvailableNutritions();
            this._toastrService.success("Nutrition is removed", "Success");
          },
          (err) => {
            this._toastrService.error(err, "Error");
          },
        );
      }
    });
  }

  public clear(): void {
    this.buildForm();
  }
}

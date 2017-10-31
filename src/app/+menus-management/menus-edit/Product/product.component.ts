import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
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
import * as _ from 'lodash';

// Services
import {
  MenusManagementService
} from '../../menus-management.service';
import {
  ProductsManagementService
} from '../../../+products-management/products-management.service';
import {
  CategoriesManagementService
} from '../../../+categories-management/categories-management.service';

// Model
import {
  MenuInfo,
  MenuProductInfo
} from '../../menus-management.model';
import {
  ProductInfo
} from '../../../+products-management/products-management.model';
import {
  CategoryInfo
} from '../../../+categories-management/categories-management.model';


@Component({
  selector: 'menus-product',
  templateUrl: 'product.template.html',
  styleUrls: ['product.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenusProductComponent implements OnInit {
  public menuId: number;
  public products: ProductInfo[];
  public menuProducts: MenuProductInfo[];
  public filteredProducts: ProductInfo[];
  public categories: CategoryInfo[];
  public filter: any;

  public frm: FormGroup;
  public menuInfo: MenuInfo;
  public formErrors = {
    appliedAt: ''
  };

  public validationMessages = {
    appliedAt: {
      required: 'Applied date is required.'
    }
  };

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _menusManagementService: MenusManagementService,
              private _productsManagementService: ProductsManagementService,
              private _categoriesManagementService: CategoriesManagementService,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService){}

  public ngOnInit(): void {
    this._activatedRoute.parent.params.subscribe((params: {id: number}) => {
      if(params.id) {
        this.menuId = params.id;
        this.filter = {
          category: 0,
          productname: ""
        }
        this._categoriesManagementService.getAllCategories().subscribe(
          (resp: CategoryInfo[]) => {
            this.categories = resp;
            this._productsManagementService.getProducts().subscribe(
              (resp: ProductInfo[]) => {
                this.products = resp;
                this._menusManagementService.getProductsOfMenu(this.menuId).subscribe(
                  (resp: MenuProductInfo[]) => {
                    this.menuProducts = resp;
                    this.filterChanged();
                  }
                )
              },
              (err) => {
                this._toastrService.error(err, "Error");
              }
            );
          },
          (err) => {
            this._toastrService.error(err, "Error");
          }
        );
      }
    });
  }

  public filterChanged(): void {
    let name: string = this.filter.productname.toLowerCase().trim();

    this.filteredProducts = _.filter(this.products, (p) => {
      var index = _.findIndex(this.menuProducts, (mp) => {
        return mp.productId == p.id;
      });
      return index === -1;
    });

    this.filteredProducts = _.filter(this.filteredProducts, (item) => {
      let result: boolean = true;
      if (this.filter.category > 0) {
        result = item.categoryId == this.filter.category;
      }

      if (name.length > 0) {
        result = result && (item.name && item.name.toLowerCase().indexOf(name) !== -1);
      }


      return result;
    });
  }

  public add(product: any) {
    let data = {
      menuId: this.menuId,
      productId: product.id,
      quantity: product.quantity
    }
    this._menusManagementService.addProductToMenu(data).subscribe(
      (resp) => {
        this.products = _.filter(this.products, item => item.id != product.id);
        this.filteredProducts = _.filter(this.filteredProducts, item => item.id != product.id);
      },
      (err) => {
        this._toastrService.error(err, "Error");
      }
    )
  }
}

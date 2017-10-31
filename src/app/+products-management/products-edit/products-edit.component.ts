import * as _ from 'lodash';
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
} from '../products-management.service';
import {
  CategoriesManagementService
} from '../../+categories-management/categories-management.service';


// Interfaces
import {
  BasicProduct,
  ProductInfo
} from '../products-management.model';
import {
  BasicResponse,
  ResponseMessage
} from '../../shared/models/respone.model';
import {
  CategoryInfo
} from '../../+categories-management/categories-management.model';

@Component({
  selector: 'products-edit',
  templateUrl: 'products-edit.template.html',
  styleUrls: [
    'products-edit.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductsEditComponent implements OnInit {
  public tabs = [];

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _productsManagementService: ProductsManagementService,
              private _categoriesManagementService: CategoriesManagementService,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService) {}

  public ngOnInit(): void {
    this.tabs = [
      {
        id: 0,
        name: 'Product Info',
        redirectUrl: 'product-info',
        isAllowDelete: false,
        isActive: false
      }];

    this._activatedRoute.params.subscribe(params => {
      if(params.id != 'new'){
        this.tabs.push.apply(this.tabs, [{
          id: 1,
          name: 'Picture',
          redirectUrl: 'product-picture',
          isAllowDelete: false,
          isActive: false
        },
          {
            id: 2,
            name: 'Component',
            redirectUrl: 'product-component',
            isAllowDelete: false,
            isActive: false
          },
          {
            id: 3,
            name: 'Nutrition',
            redirectUrl: 'product-nutrition',
            isAllowDelete: false,
            isActive: false
          },
          {
            id: 4,
            name: 'SEO',
            redirectUrl: 'product-seo',
            isAllowDelete: false,
            isActive: false
          }]);
      }
    });

    // Config active nav tab when router changes
    this._router.events.subscribe((val: any) => {
      this.configNavTabs(val.urlAfterRedirects);
    });
  }
  /**
   * Active nav tab is selected
   * @param url
   */
  public configNavTabs(url: string): void {
    if (url) {
      let lastUrl = url.split('/');

      _.each(this.tabs, (item) => {
        item.isActive = false;

        if(item.redirectUrl === lastUrl[lastUrl.length - 1])
          item.isActive = true;
      });
    } else{
      _.each(this.tabs, (item) => {
        item.isActive = false;
      });
      this.tabs[0].isActive = true;
    }
  }
  /**
   * Event switch tab
   * @param index
   */
  public switchTab(event: Event, index: number): void {
    // Avoid click to tab when click delete on this tab
    if (!event.target['innerText']) {
      return;
    }
    this._router.navigate([this.tabs[index].redirectUrl], {relativeTo: this._activatedRoute});
  }
}

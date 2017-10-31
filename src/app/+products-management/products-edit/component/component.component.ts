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
import * as NProgress from 'nprogress';
import * as _ from 'lodash';

// 3rd modules
import {
  FileUploader
} from 'ng2-file-upload';

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
  ProductComponentInfo,
  ProductNutritionInfo
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
import {
  ComponentInfo
} from '../../../+components-management/components-management.model';
import {
  ConfirmDialogComponent
} from '../../../shared/modules/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'products-edit-component',
  templateUrl: 'component.template.html',
  styleUrls: [
    'component.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductsEditComponentComponent implements OnInit {
  public productComponents: ProductComponentInfo[];
  public components: ComponentInfo[];
  public availableComponents: ComponentInfo[];
  public selectedComponent: ComponentInfo;
  public productId: number;

  public componentSelections: any = [];
  public componentData: any = [];

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
    this._activatedRoute.parent.params.subscribe((params: { id: number }) => {
      if (params.id) {
        this.productId = params.id;
        this.refreshData();
      }
    });
  }

  public refreshData(): void {
    this._productsManagementService.getComponents().subscribe(
      (resp: ComponentInfo[]): void => {
        this.components = resp;
        this._productsManagementService.getProductComponents(this.productId).subscribe(
          (respProductComponent: ProductComponentInfo[]) => {
            this.productComponents = respProductComponent;
            this.updateAvailableComponent();
          },
          (err) => {
            this._toastrService.error(err, 'Error');
          }
        );
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      }
    );
  }

  public updateAvailableComponent(): void {
    this.availableComponents = _.filter(this.components, (c) => {
      let index = _.findIndex(this.productComponents, (pc) => {
        return pc.componentId == c.id;
      });
      return index === -1;
    });

    this.componentSelections = _.map(this.availableComponents, (i) => {
      return {
        id: i.id,
        text: i.name
      };
    });
  }

  public changeComponents(data): void {
    this.componentData = data;
  }

  public onSubmitForm(): void {
    let data = {
      componentIds: _.map(this.componentData, (i: any) => {
        return i.id;
      })
    };

    this._productsManagementService.addComponentToProduct(this.productId, data).subscribe(
      (resp: ProductComponentInfo) => {
        this.componentData.splice(0, this.componentData.length);
        this.refreshData();
      },
      (err) => {
        this._toastrService.error(err, 'Error');
      }
    );
  }

  public remove(productComponentId: number): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, {
      keyboard: true
    });
    modalRef.componentInstance
      .message = 'Are you sure you want to remove the component? This cannot be undone.';
    modalRef.componentInstance.title = 'Remove component from product';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this._productsManagementService.removeComponentFromProduct(productComponentId).subscribe(
          (resp) => {
            this.productComponents = _.filter(this.productComponents, (item) => {
              return item.id != productComponentId;
            });
            this.updateAvailableComponent();
          },
          (err) => {
            this._toastrService.error(err, 'Error');
          }
        );
      }
    });
  }

}

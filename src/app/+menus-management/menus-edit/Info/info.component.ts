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
import {
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

// Services
import {
  MenusManagementService
} from '../../menus-management.service';
// Model
import {
  MenuInfo,
  MenuProductInfo
} from '../../menus-management.model';
import { ConfirmDialogComponent } from '../../../shared/modules/confirm-dialog/confirm-dialog.component';
import {IMyDate} from 'mydatepicker';
// Interfaces
import {
  RowSelectEvent,
  SortEvent
} from '../../../shared/models/ngx-datatable.model';

@Component({
  selector: 'menus-info',
  templateUrl: 'info.template.html',
  styleUrls: ['info.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenusInfoComponent implements OnInit {
  public frm: FormGroup;
  public menuInfo: MenuInfo;
  public products: MenuProductInfo[];
  public dateModel: any;
  public formErrors = {
    appliedAt: ''
  };
  public disableUntilDate: IMyDate = {
    day: (new Date()).getDate(),
    month: (new Date()).getMonth() + 1,
    year: (new Date()).getFullYear()
  };

  public validationMessages = {
    appliedAt: {
      required: 'Applied date is required.'
    }
  };

  public appliedAtOptions: any = {
    selectorHeight: '200px',
    selectorWidth: '220px',
    dateFormat: 'dd/mm/yyyy',
    showTodayBtn: true,
    showClearDateBtn: true,
    alignSelectorRight: true,
    openSelectorOnInputClick: true,
    editableDateField: false,
    selectionTxtFontSize: '12px',
    height: '30px',
    disableUntil: this.disableUntilDate
  };

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _menusManagementService: MenusManagementService,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService){}

  public ngOnInit(): void {
    this._activatedRoute.parent.params.subscribe((params: { id: number }) => {
      if (params.id) {
        this._menusManagementService.getMenuInfo(params.id).subscribe(
          (resp: MenuInfo) => {
            this.menuInfo = resp;
            let applyDate = new Date(this.menuInfo.appliedAt);
            this.dateModel = {
              date: {
                day: applyDate.getDate(),
                month: applyDate.getMonth() + 1,
                year: applyDate.getFullYear()
              }
            };
            this._menusManagementService.getProductsOfMenu(params.id).subscribe(
              (resp: MenuProductInfo[]) => {
                this.products = resp;
              },
              (err) => {
                this._toastrService.error(err, "Error");
              }
            )
            this.configFriendlyRoutes();
          },
          (err) => {
            this._toastrService.error(err, "Error");
          }
        );
      } else {
        this.menuInfo = {
          appliedAt: new Date(),
          productQuantity: 0,
          sumQuantity: 0
        } as any;

        let curDate = new Date();
        this.dateModel = {
          date: {
            day: curDate.getDate(),
            month: curDate.getMonth() + 1,
            year: curDate.getFullYear()
          }
        };
      }
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      appliedAt: new FormControl('', [Validators.required])
    });

    this.frm.valueChanges
      .subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
    this.backupData();
  }

  public configFriendlyRoutes(): void {
    this._breadcrumbService
      .addCallbackForRouteRegex('^/categories-management/[0-9]*$', () => this.menuInfo.appliedAt);
  }

  public onValueChanged(data?: MenuInfo): void {
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

  public revertData(isEdit: boolean): void {
    if (!isEdit) {
      // Assign init value because this properties become null after reset
      this.buildForm();
      return;
    }
    this.frm.patchValue(this._localStorageService.get('backupData'));
    this.backupData();
  }

  public onSubmitForm(): void {
    let model = {
      appliedAt: `${this.dateModel.date.month}/${this.dateModel.date.day}/${this.dateModel.date.year}`,
      productQuantity: this.menuInfo.productQuantity,
      sumQuantity: this.menuInfo.sumQuantity
    };
    if (this.menuInfo && this.menuInfo.id) {
      this._menusManagementService.updateMenu(this.menuInfo.id, model).subscribe(
        (resp: any) => {
          this._toastrService.success("Menu id updated", 'Success');
          this._router.navigate(['menus-management']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
          this.revertData(true);
        }
      );
    } else {
      this._menusManagementService.createMenu(model).subscribe(
        (resp: MenuInfo) => {
          this._toastrService.success("Category is created", 'Success');
          this._router.navigate(['menus-management', resp.id, 'edit', 'menus-product']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        }
      );
    }
  }

  public cancel(): void {
    this._router.navigate(['menus-management']);
  }

  public removeProduct(menuProduct: MenuProductInfo): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, {
      keyboard: true,
    });
    modalRef.componentInstance
      .message = 'Are you sure you want to remove the product? This cannot be undone.';
    modalRef.componentInstance.title = 'Remove product from menu';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this._menusManagementService.removeProductFromMenu(menuProduct.id).subscribe(
          (resp: any) => {
            this.products = _.filter(this.products, (item) => item.id != menuProduct.id);
            this.menuInfo.productQuantity -= 1;
            this.menuInfo.sumQuantity -= menuProduct.quantity;
            this._toastrService.success("Product is removed", "Success");
          },
          (err) => {
            this._toastrService.error(err, "Error");
          }
        );
      }
    });
  }

  /**
   * Row click event
   * @param event
   */
  public onActivate(event: RowSelectEvent): void {
    if (event.column.name) {
      this._router.navigate(['products-management', event.row.productId]);
    }
  }

  /**
   * Fire date change event with prop
   * @param event
   */
  public onDateChanged(event: any, prop: string) {
    console.log('event: ', event);
    console.log('prop: ', prop);
  }
}

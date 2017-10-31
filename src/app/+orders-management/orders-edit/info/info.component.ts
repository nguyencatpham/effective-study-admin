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
import { OrdersManagementService } from '../../orders-management.service';
import * as orderStatus from '../../../../assets/mock-data/order-status.json';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'orders-info',
  templateUrl: 'info.template.html',
  styleUrls: [
    'info.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class OrdersInfoComponent implements OnInit {
  public order: any;
  public frm: FormGroup;
  public formErrors = {
    status: ''
  };
  public validationMessages = {
    status: {
      required: 'Status is required.'
    },
  };
  public orderStatus = orderStatus;

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService,
              private _orderService: OrdersManagementService) {}

  public ngOnInit(): void {
    this.buildForm();
    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._orderService.getInfo(params.id).subscribe(
          (order: any) => {
            this.order = order;
            this.frm.patchValue(this.order);
          },
          (err) => {
            this._toastrService.error(err, 'Error');
          });
      }
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      status: new FormControl('', [Validators.required])
    });

    this.frm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
    this.backupData();
  }

  public onValueChanged(data?: any): void {
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
    if (this.order && this.order.id) {
      this._orderService.updateProduct(this.order.id, this.frm.value).subscribe(
        (resp: any) => {
          this._toastrService.success("Order is updated", 'Success');
          this._router.navigate(['orders-management']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        });
    }
  }

  public cancel(): void {
    this._router.navigate(['orders-management']);
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

  public exportOrder(orderId: number): void {
    this._orderService.printOrderDetail(orderId)
      .subscribe((resp: any) => {
        let data = resp;
        if ( data.status === 200 ) {
          // let values = data.headers.get('Content-Disposition');
          // let filename = values.split(';')[1].trim().split('=')[1];

          let filename = 'print-order-' + orderId + '.xlsx';
          let blob;
          // if (type === 'pdf') {
          //   blob = new Blob([(<any> data)._body],
          //     {type: 'application/pdf'}
          //   );
          // } else if (type === 'xlsx') {
          //   blob = new Blob([(<any> data)._body],
          //     {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
          //   );
          // }

          blob = new Blob([(<any> data)._body],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
          );

          FileSaver.saveAs(blob, filename);
        }

      });
  }
}

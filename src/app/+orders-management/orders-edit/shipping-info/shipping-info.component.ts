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

@Component({
  selector: 'shipping-info',
  templateUrl: 'shipping-info.template.html',
  styleUrls: [
    'shipping-info.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class OrdersShippingInfoComponent implements OnInit {
  public shippingAddress: any;
  public billingAddress: any;
  public tabs = [];

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService,
              private _orderService: OrdersManagementService) {}

  public ngOnInit(): void {
    // this.buildForm();
    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._orderService.getShippingInfo(params.id).subscribe(
          (resp: any) => {
            this.shippingAddress = resp.shippingAddress;
            this.billingAddress = resp.billingAddress;
          },
          (err) => {
            this._toastrService.error(err, 'Error');
          });
      }
    });
  }

}

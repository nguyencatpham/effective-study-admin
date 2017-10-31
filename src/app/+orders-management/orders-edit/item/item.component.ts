import * as _ from 'lodash';
import {
  AfterViewInit,
  Component,
  OnInit, ViewChild,
  ViewEncapsulation,
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
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'orders-item',
  templateUrl: 'item.template.html',
  styleUrls: [
    'item.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class OrdersItemComponent implements OnInit, AfterViewInit {
  public orderItems: any;
  @ViewChild('datatableConfig')
  public datatableConfig: DatatableComponent;
  public searchText: string;
  public tableConfig = {
    keySort: 'name',
    keyword: '',
    orderDescending: false,
    currentPage: 1,
    pageSize: 10,
    loading: false
  };

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService,
              private _orderService: OrdersManagementService) {}

  public ngOnInit(): void {
    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._orderService.getItems(params.id).subscribe(
          (resp: any) => {
            this.orderItems = resp;
            setTimeout(() => {
              this.datatableConfig.rowDetail.expandAllRows();
            });
          },
          (err) => {
            this._toastrService.error(err, 'Error');
          });
      }
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.datatableConfig.recalculate();
    }, 200);
  }
}

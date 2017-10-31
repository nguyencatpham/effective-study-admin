import {
  Component,
  AfterViewChecked,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  URLSearchParams
} from '@angular/http';

import {
  Router
} from '@angular/router';

// 3rd modules
import {
  ToastrService
} from 'ngx-toastr';
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';

// Services
import {
  ProductsManagementService
} from '../products-management.service';
import { RouterService } from '../../core/router';
import { Subscription } from 'rxjs/Subscription';

// Interfaces
import {
  RowSelectEvent,
  SortEvent
} from '../../shared/models/ngx-datatable.model';
import {
  ResponseMessage
} from '../../shared/models/respone.model';
import {
  ProductListResp
} from '../products-management.model';
import {
  TypeEnum
} from '../../shared/models/enums.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs/Observable';
import { setTimeout } from 'timers';
import { AppConstant } from '../../app.constant';
import { FileUploader } from 'ng2-file-upload';
import * as NProgress from 'nprogress';
import { ErrorDialogComponent } from '../../shared/modules/error-dialog/error-dialog.component';
import { UserContext } from '../../shared/services/user-context/user-context';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'products-main',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'products-main.template.html',
  styleUrls: [
    'products-main.style.scss'
  ]
})
export class ProductsMainComponent implements OnInit,
  AfterViewChecked {
  @ViewChild('tableWrapper')
  public tableWrapper;
  @ViewChild(DatatableComponent)
  public table: DatatableComponent;
  public currentComponentWidth;
  public searchText: string;
  public productData = {
    totalRecord: 0,
    data: []
  };
  public tableConfig = {
    keySort: 'name',
    keyword: '',
    orderDescending: false,
    currentPage: 1,
    pageSize: 10,
    loading: false
  };
  public uploader: FileUploader;

  constructor(private _router: Router,
              private _productsManagementService: ProductsManagementService,
              private _toastrService: ToastrService,
              private _routerService: RouterService,
              private _userContext: UserContext,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService) {}

  public ngOnInit(): void {
    this.initImport();
    this.refreshDatatable();
    this._breadcrumbService
      .hideRoute('/products-management/.*');
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

  // -----------------Select Row By Checkbox-----------------
  /**
   * Row click event
   * @param event
   */
  public onActivate(event: RowSelectEvent): void {
    if (event.column.name) {
      // this._routerService.set({
      //   enableBackView: true
      // });
      this._router.navigate(['products-management', event.row.id]);
    }
    // Use rowElement to add class selected to highlight row
  }

  // ---------------------------------------------------------
  /**
   * Search text change event
   * @param value
   */
  public onSearchChanged(value: string): void {
    this.searchText = value;
    this.refreshDatatable();
  }

  /**
   * Page size change event
   * @param pageSize
   */
  public onSelectedPageSize(pageSize: number): void {
    this.tableConfig.pageSize = pageSize;
    this.refreshDatatable();
  }

  /**
   * Page change event
   * @param draw
   */
  public onPageChange(draw: number): void {
    this.tableConfig.currentPage = draw + 1;
    this.refreshDatatable(draw);
  }

  /**
   * Sort change event
   * @param event
   */
  public onSort(event: SortEvent): void {
    this.tableConfig.keySort = event.sorts[0].prop;
    this.tableConfig.orderDescending = event.sorts[0].dir === 'desc';
    this.tableConfig.loading = true;
    this.refreshDatatable(this.tableConfig.currentPage - 1);
  }

  /**
   * Ajax datatable
   * @param draw
   */
  public refreshDatatable(draw?: number): void {
    // Use View caching to get previous current page and assign countSkip
    // .....code here
    let countSkip = draw ? draw * 10 : 0;
    let pageSize = this.tableConfig.pageSize.toString();
    let orderDescending = this.tableConfig.orderDescending.toString();
    let keySort = this.tableConfig.keySort;
    let keyword = this.searchText;

    let params: URLSearchParams = new URLSearchParams();
    params.set('skip', countSkip.toString());
    params.set('count', pageSize);
    params.set('orderDescending', orderDescending);
    params.set('keySort', keySort);
    params.set('keyword', keyword);

    this._productsManagementService.getListProduct(params)
      .subscribe((resp: any): void => {
        // Stop loading from linear loading bar of ngx-datatable
        this.tableConfig.loading = false;
        this.productData.totalRecord = resp.totalRecords;
        this.productData.data = resp.records;

        // if (resp.status) {
        //   // Stop loading from linear loading bar of ngx-datatable
        //   this.tableConfig.loading = false;
        //
        //   console.log('resp: ', resp);
        //
        //   let responseData = resp;
        //   this.productData.totalRecord = 100;
        //   this.productData.data = responseData;
        // } else {
        //   this._toastrService.error(resp.errorMessages, 'Error');
        // }
      });
  }

  /**
   * add new product
   */
  public addNewProduct(): void {
    this._router.navigate(['products-management', 'new']);
  }

  /**
   * initImport
   */
  public initImport(): void {
    // Config url & token for upload avatar
    this.uploader = new FileUploader({
      url: `${AppConstant.domain}/products/import`,
      authToken: `Bearer ${this._userContext.userToken.accessToken}`,
    });
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
  }

  /**
   * import components
   */
  public import(): void {
    // Start upload avatar
    this.uploader.queue[0].upload();
    // Start loading bar while uploading
    this.uploader.onProgressItem = () => NProgress.start();
    this.uploader.onSuccessItem = (item, resp) => {
      this.refreshDatatable();
      this.uploader.clearQueue();
      // End loading bar
      NProgress.done();
      this._toastrService.success("Success", 'Success');
    };
    this.uploader.onErrorItem = (item, err) => {
      NProgress.done();
      this.uploader.clearQueue();

      err = JSON.parse(err);
      if (Array.isArray(err)) {
        let modalRef = this._modalService.open(ErrorDialogComponent, { keyboard: true});
        modalRef.componentInstance.title = "Import Product Failed";
        modalRef.componentInstance.message = err;
      } else {
        this._toastrService.error(err, 'Error');
      }
    };
  }

  /**
   * download
   */
  public download(): void {
    this._productsManagementService.printFileImport()
      .subscribe((resp: any) => {
        let data = resp;
        if ( data.status === 200 ) {
          // let values = data.headers.get('Content-Disposition');
          // let filename = values.split(';')[1].trim().split('=')[1];

          let filename = 'product-import.xlsx';
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

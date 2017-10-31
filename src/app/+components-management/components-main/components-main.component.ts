import {
  Component,
  AfterViewChecked,
  OnInit,
  ViewChild,
  ViewEncapsulation
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
import * as NProgress from 'nprogress';

// Services
import {
  ComponentsManagementService
} from '../components-management.service';
import { RouterService } from '../../core/router';

// Interfaces
import {
  RowSelectEvent,
  SortEvent
} from '../../shared/models/ngx-datatable.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FileUploader } from 'ng2-file-upload';
import { AppConstant } from '../../app.constant';
import { UserContext } from '../../shared/services/user-context/user-context';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorDialogComponent } from '../../shared/modules/error-dialog/error-dialog.component';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'components-main',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'components-main.template.html',
  styleUrls: [
    'components-main.style.scss'
  ]
})
export class ComponentsMainComponent implements OnInit,
  AfterViewChecked {
  @ViewChild('tableWrapper')
  public tableWrapper;
  @ViewChild(DatatableComponent)
  public table: DatatableComponent;
  public currentComponentWidth;
  public searchText: string;
  public componentData = {
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
              private _componentsManagementService: ComponentsManagementService,
              private _toastrService: ToastrService,
              private _routerService: RouterService,
              private _userContext: UserContext,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService) {}

  public ngOnInit(): void {
    this.initImport();
    this.refreshDatatable();
    this._breadcrumbService
      .hideRoute('/components-management/.*');
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
      this._router.navigate(['components-management', event.row.id]);
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

    this._componentsManagementService.getListComponents(params)
      .subscribe((resp: any): void => {
        // Stop loading from linear loading bar of ngx-datatable
        this.tableConfig.loading = false;
        this.componentData.totalRecord = resp.totalRecords;
        this.componentData.data = resp.records;

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
   * add new component
   */
  public addNewComponent(): void {
    this._router.navigate(['components-management', 'new']);
  }

  /**
   * initImport
   */
  public initImport(): void {
    // Config url & token for upload avatar
    this.uploader = new FileUploader({
      url: `${AppConstant.domain}/components/import`,
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
        modalRef.componentInstance.title = "Import Component Failed";
        modalRef.componentInstance.message = err;
      } else {
        this._toastrService.error(err, 'Error');
      }
    };
  }
}

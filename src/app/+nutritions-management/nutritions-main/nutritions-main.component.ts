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

// Services
import {
  NutritionsManagementService
} from '../nutritions-management.service';
import { RouterService } from '../../core/router';

// Interfaces
import {
  RowSelectEvent,
  SortEvent
} from '../../shared/models/ngx-datatable.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'nutritions-main',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'nutritions-main.template.html',
  styleUrls: [
    'nutritions-main.style.scss'
  ]
})
export class NutritionsMainComponent implements OnInit,
  AfterViewChecked {
  @ViewChild('tableWrapper')
  public tableWrapper;
  @ViewChild(DatatableComponent)
  public table: DatatableComponent;
  public currentComponentWidth;
  public searchText: string;
  public nutritionData = {
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

  constructor(private _router: Router,
              private _nutritionsManagementService: NutritionsManagementService,
              private _toastrService: ToastrService,
              private _routerService: RouterService,
              private _breadcrumbService: BreadcrumbService) {}

  public ngOnInit(): void {
    this.refreshDatatable();
    this._breadcrumbService
      .hideRoute('/nutritions-management/.*');
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
      this._router.navigate(['nutritions-management', event.row.id]);
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

    this._nutritionsManagementService.getListNutritions(params)
      .subscribe((resp: any): void => {
        // Stop loading from linear loading bar of ngx-datatable
        this.tableConfig.loading = false;
        this.nutritionData.totalRecord = resp.totalRecords;
        this.nutritionData.data = resp.records;

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
   * add new nutrition
   */
  public addNewNutrition(): void {
    this._router.navigate(['nutritions-management', 'new']);
  }
}

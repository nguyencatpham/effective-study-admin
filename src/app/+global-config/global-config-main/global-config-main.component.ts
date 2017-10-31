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
  GlobalConfigService
} from '../global-config.service';
import { RouterService } from '../../core/router';

// Interfaces
import {
  RowSelectEvent,
  SortEvent
} from '../../shared/models/ngx-datatable.model';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  SettingInfo
} from '../global-config.model';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'global-config-main',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'global-config-main.template.html',
  styleUrls: [
    'global-config-main.style.scss'
  ]
})
export class GlobalConfigMainComponent implements OnInit {
  public settings: SettingInfo[];

  @ViewChild('tableWrapper')
  public tableWrapper;
  @ViewChild(DatatableComponent)
  public table: DatatableComponent;
  public currentComponentWidth;
  public searchText: string;
  public globalConfigData = {
    totalRecord: 0,
    data: []
  };
  public tableConfig = {
    keySort: 'name',
    keyword: '',
    orderDescending: false,
    currentPage: 1,
    pageSize: Number.MAX_VALUE,
    loading: false
  };

  constructor(private _router: Router,
              private _globalConfigService: GlobalConfigService,
              private _toastrService: ToastrService,
              private _routerService: RouterService,
              private _breadcrumbService: BreadcrumbService) {}

  public ngOnInit(): void {
    this._globalConfigService.getSettings().subscribe(
      (resp: SettingInfo[]) => {
        this.settings = resp;
      },
      (err) => {
        this._toastrService.error(err, "Error");
        this._router.navigate(['global-config', 'main']);
      }
    )
    this._breadcrumbService.hideRoute('/global-config/.*');
  }

  /**
   * Row click event
   * @param event
   */
  public onActivate(event: RowSelectEvent): void {
    if (event.column.name) {
      // this._routerService.set({
      //   enableBackView: true
      // });
      this._router.navigate(['global-config', event.row.id]);
    }
    // Use rowElement to add class selected to highlight row
  }

  /**
   * Sort change event
   * @param event
   */
  public onSort(event: SortEvent): void {
    this.tableConfig.keySort = event.sorts[0].prop;
    this.tableConfig.orderDescending = event.sorts[0].dir === 'desc';
    this.tableConfig.loading = true;
    //this.refreshDatatable(this.tableConfig.currentPage - 1);
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

    this._globalConfigService.search(params)
      .subscribe((resp: any): void => {
        // Stop loading from linear loading bar of ngx-datatable
        this.tableConfig.loading = false;
        this.globalConfigData.totalRecord = resp.totalRecords;
        this.globalConfigData.data = resp.records;
      });
  }

  /**
   * add new globalConfig
   */
  public addNewGlobalConfig(): void {
    this._router.navigate(['global-config', 'new']);
  }
}

import {
  EventEmitter,
  Injectable
} from '@angular/core';

import {
  Response,
  URLSearchParams
} from '@angular/http';

import {
  Observable
} from 'rxjs/Observable';

// App Constant
import {
  AppConstant
} from '../app.constant';

// Services
import {
  ExtendedHttpService
} from '../shared/services/http';

// Interfaces
import {
  BasicResponse,
  ResponseMessage,
  TypeEnum
} from '../shared/models';
import {
  MenuInfo,
  ProductListResp,
  ReminderInfo,
  BasicProduct,
  PurchaseOrderListResp,
  MenuProductInfo
} from './menus-management.model';

@Injectable()
export class  MenusManagementService {
  public subpath: string;
  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = 'menus';
  }

  public getListMenu(params: URLSearchParams): Observable<ResponseMessage<ProductListResp>> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`, {
      search: params
    }).map(this.extractData);
  }

  public getMenuInfo(id: number): Observable<MenuInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/id/${id}`).map(this.extractData);
  }

  public createMenu(data) {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(data))
          .map(this.extractData);
  }

  public updateMenu(id: number, data) {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(data))
          .map(this.extractData);
  }

  public getProductsOfMenu(menuId: number): Observable<MenuProductInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${menuId}/products`)
      .map(this.extractData);
  }

  public addProductToMenu(data: any): Observable<any> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}/products`, JSON.stringify(data))
          .map(this.extractData);
  }

  public removeProductFromMenu(menuProductId: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/products/${menuProductId}`)
      .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

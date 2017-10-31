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
  ProductListResp,
} from './orders-management.model';

@Injectable()
export class OrdersManagementService {
  constructor(private http: ExtendedHttpService) {
    // empty
  }

  public getListOrders(params: URLSearchParams): Observable<ResponseMessage<ProductListResp>> {
    return this.http.get(`${AppConstant.domain}/orders`, {
      search: params
    }).map(this.extractData);
  }

  public getInfo(id: Number): Observable<ResponseMessage<ProductListResp>> {
    return this.http.get(`${AppConstant.domain}/orders/${id}`).map(this.extractData);
  }

  public updateProduct(id: number, model: any): Observable<BasicResponse> {
    return this.http.put(`${AppConstant.domain}/orders/${id}`, JSON.stringify(model))
      .map(this.extractData);
  }

  public getShippingInfo(id: Number): Observable<ResponseMessage<any>> {
    return this.http.get(`${AppConstant.domain}/orders/${id}/shipping/info`).map(this.extractData);
  }

  public getItems(id: Number): Observable<ResponseMessage<any>> {
    return this.http.get(`${AppConstant.domain}/orders/${id}/items`).map(this.extractData);
  }

  public printOrderDetail(id: Number): Observable<any> {
    return this.http.get(`${AppConstant.domain}/orders/${id}/print`, {
      responseType: 3
    });
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

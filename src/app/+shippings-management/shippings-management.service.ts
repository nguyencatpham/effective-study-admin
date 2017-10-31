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
  DistrictInfo
} from './shippings-management.model';

@Injectable()
export class ShippingsManagementService {
  public subpath: string;
  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = "addresses";
  }

  public getListShippings(params: URLSearchParams): Observable<ResponseMessage<ProductListResp>> {
    return this.http.get(`${AppConstant.domain}/addresses/districts/search/79`, {
      search: params
    }).map(this.extractData);
  }

  public getDistrict(id: number): Observable<DistrictInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/districts/${id}`)
      .map(this.extractData);
  }

  public updateDistrict(id: number, data: any) {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/districts/${id}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

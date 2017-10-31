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
  NutritionInfo
} from './nutritions-management.model';

@Injectable()
export class NutritionsManagementService {
  public subpath: string;

  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = 'nutritions';
  }

  public getListNutritions(params: URLSearchParams): Observable<ResponseMessage<ProductListResp>> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`, {
      search: params
    }).map(this.extractData);
  }

  public getNutrition(id): Observable<NutritionInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`).map(this.extractData);
  }

  public createNutrition(data): Observable<NutritionInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public updateNutrition(id, data) {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

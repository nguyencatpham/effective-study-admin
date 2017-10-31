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
  CategoryInfo
} from './categories-management.model';

@Injectable()
export class CategoriesManagementService {
  public subpath:string = null;
  
  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = "categories";
  }

  public getListCategories(params: URLSearchParams): Observable<ResponseMessage<ProductListResp>> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`, {
      search: params
    }).map(this.extractData);
  }

  public getAllCategories(): Observable<CategoryInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/all`)
          .map(this.extractData);
  }

  public getCategoryInfo(id): Observable<CategoryInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`).map(this.extractData);
  }

  public updateCategory(id, data): Observable<any> {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(data))
          .map(this.extractData);
  }

  public createCategory(data): Observable<CategoryInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(data))
          .map(this.extractData);
  }

  public deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/${id}`)
          .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

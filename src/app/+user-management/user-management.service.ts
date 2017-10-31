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
  DeleteUserModel,
  UserInfo,
  UserListResponse
} from '../shared/models/user.model';
import {
  BasicResponse,
  ResponseMessage
} from '../shared/models/respone.model';

@Injectable()
export class UserManagementService {
  public updateUserEvent = new EventEmitter<UserInfo>();
  public loadUserTabsEvent = new EventEmitter();

  public subpath: string;
  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = 'users';
  }

  public getListUser(params: URLSearchParams): Observable<ResponseMessage<UserListResponse>> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`, {
      search: params
    }).map(this.extractData);
  }

  public getUser(id: number): Observable<UserInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`)
      .map(this.extractData);
  }

  public createUser(userInfo: UserInfo): Observable<UserInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(userInfo))
      .map(this.extractData);
  }

  public updateUser(userInfo: UserInfo): Observable<any> {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${userInfo.id}`,
      JSON.stringify(userInfo))
      .map(this.extractData);
  }

  public deleteMultiUser(req: DeleteUserModel): Observable<BasicResponse> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('isCheckedAll', req.isCheckedAll.toString());
    params.set('itemsRemoved', req.itemsRemoved);
    params.set('itemsChecked', req.itemsChecked);
    params.set('keyword', req.keyword);

    return this.http.delete(`${AppConstant.domain}/api/v1/account/users/delete`, {
      search: params
    }).map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

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
  SettingInfo
} from './global-config.model';

@Injectable()
export class GlobalConfigService {
  public subpath: string;
  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = "settings";
  }

  public search(params: URLSearchParams): Observable<ResponseMessage<any>> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`, {
      search: params
    }).map(this.extractData);
  }

  public getSettings(): Observable<SettingInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`)
        .map(this.extractData);
  }

  public getSetting(id: number): Observable<SettingInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`)
        .map(this.extractData);
  }

  public addSetting(data): Observable<SettingInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(data))
        .map(this.extractData);
  }

  public updateSetting(id: number, data): Observable<any> {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(data))
        .map(this.extractData);
  }

  public deleteSetting(id: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/${id}`)
        .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

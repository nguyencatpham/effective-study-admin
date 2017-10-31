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

@Injectable()
export class TopicsManagementService {
  public subpath: string;

  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = 'topics';
  }

  public getListTopics(params: URLSearchParams): Observable<ResponseMessage<any>> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`, {
      // search: params
    }).map(this.extractData);
  }

  public getTopic(id): Observable<any> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`).map(this.extractData);
  }

  public createTopic(data): Observable<any> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public updateTopic(id, data) {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public deleteTopic(id) {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/${id}`)
      .map(this.extractData);
  }

  public getSeo(params: URLSearchParams): Observable<ResponseMessage<any>> {
    return this.http.get(`${AppConstant.domain}/seos/byEntity/data`, {
      search: params
    }).map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

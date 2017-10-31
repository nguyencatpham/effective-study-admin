import {
  Injectable
} from '@angular/core';

import {
  Http,
  Response,
  URLSearchParams
} from '@angular/http';

import {
  Observable
} from 'rxjs/Observable';

// Global const
import {
  AppConstant
} from '../../../app.constant';

@Injectable()
export class ChefService {
  public subpath: string;
  constructor(private http: Http) {
    // empty
    this.subpath = "chefs";
  }

  public getAll(): Observable<any> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`)
      .map(this.extractData);
  }

  public getById(id: number): Observable<any> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`)
      .map(this.extractData);
  }

  public createOrUpdate(id: number, data: any): Observable<any> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/${id}`)
      .map(this.extractData);
  }

  public getAllRatings(id: number): Observable<any> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}/ratings`)
      .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

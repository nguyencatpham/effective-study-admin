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

import {
  SeoInfo
} from '../../models/seo.model';


@Injectable()
export class SeoService {
  public subpath: string;
  constructor(private http: Http) {
    // empty
    this.subpath = "seos";
  }

  public getSeos(entity: string): Observable<SeoInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/entity/${entity}`)
      .map(this.extractData);
  }

  public getSeo(id: number): Observable<SeoInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`)
      .map(this.extractData);
  }

  public createSeo(data: any): Observable<SeoInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public updateSeo(id: number, data: any): Observable<any> {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public deleteSeo(id: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/${id}`)
      .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}
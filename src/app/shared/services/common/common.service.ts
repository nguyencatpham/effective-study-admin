import {
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
} from '../../../app.constant';

// Services
import {
  ExtendedHttpService
} from '../http';

// Interfaces
import {
  BasicResponse,
  ResponseMessage
} from '../../models/respone.model';
import {
  BasicCsrInfo,
  BasicCustomerInfo,
  BasicGeneralInfo
} from '../../models/common.model';

@Injectable()
export class CommonService {
  constructor(private http: ExtendedHttpService) {
    // empty
  }

  public getCsrRoleList(): Observable<ResponseMessage<BasicCsrInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/csrs`)
      .map(this.extractData);
  }

  public getCustomersList(): Observable<ResponseMessage<BasicCustomerInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/customers`)
      .map(this.extractData);
  }

  public getOrderTypeList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_ordertype`)
      .map(this.extractData);
  }

  public getDropShipList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_dropship`)
      .map(this.extractData);
  }

  public getShipFromList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_shipfrom`)
      .map(this.extractData);
  }

  public getShipViaList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_shipvia`)
      .map(this.extractData);
  }

  public getVendorList(): Observable<ResponseMessage<BasicCustomerInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/vendors`)
      .map(this.extractData);
  }

  public getStyleList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_style`)
      .map(this.extractData);
  }

  public getCutList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_cut`)
      .map(this.extractData);
  }

  public getColorList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_color`)
      .map(this.extractData);
  }

  public getContentList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_content`)
      .map(this.extractData);
  }

  public getCooList(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_coo`)
      .map(this.extractData);
  }

  public getServiceCode(): Observable<ResponseMessage<BasicGeneralInfo[]>> {
    return this.http.get(`${AppConstant.domain}/api/v1/common/c_servicecode`)
      .map(this.extractData);
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}

import { Injectable, EventEmitter } from "@angular/core";

import { Observable } from "rxjs";

import { ExtendedHttpService } from '../shared/services/http';
import { AppConstant } from "../app.constant";

@Injectable()
export class ProfileService {
  public path: string = 'accounts';
  public activeTabEvent: EventEmitter<number> = new EventEmitter();
  constructor(private http: ExtendedHttpService) {
  }

  public update(id: number, data: any): Observable<any> {
    return this.http.put(`${AppConstant.domain}/${this.path}/profile`, data)
      .map(resp => resp.json());
  }
}
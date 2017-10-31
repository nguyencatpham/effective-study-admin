import {
  Injectable
} from '@angular/core';

export interface RouterOptions {
  enableBackView: boolean;
  pageYOffset?: number;
}

@Injectable()
export class RouterService {
  private _enableBackView: boolean = false;
  private _pageYOffset: number = 0;
  private _storedRoutes: any;
  constructor() {
    // empty
  }

  set(options: RouterOptions){
    this.enableBackView = options.enableBackView;
    this.pageYOffset = options.pageYOffset;
    if(this.enableBackView && typeof this.pageYOffset === 'undefined'){ // auto fill pageYOffset if undefined
      this.pageYOffset = window["pageYOffset"];
    }
  }

  get enableBackView() {
    return this._enableBackView;
  }

  set enableBackView(value) {
    this._enableBackView = value;
  }

  get storedRoutes() {
    return this._storedRoutes;
  }

  set storedRoutes(value) {
    this._storedRoutes = value;
  }

  get pageYOffset() {
    return this._pageYOffset;
  }

  set pageYOffset(value) {
    this._pageYOffset = value;
  }

  public deleteStored(key: string) {
    if (this._storedRoutes) {
      Object.keys(this._storedRoutes).map((item: string) => {
        if (item.includes(key)) {
          this._storedRoutes[item] = undefined;
        }
      });
    }
  }
}

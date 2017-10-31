import { Injectable } from '@angular/core';
import {
  Request,
  XHRBackend,
  RequestOptions,
  Response,
  Http,
  RequestOptionsArgs,
  Headers
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserContext } from '../user-context';
import { ProgressService } from '../progress';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';

// https://www.illucit.com/blog/2016/03/angular2-http-authentication-interceptor/
@Injectable()
export class ExtendedHttpService extends Http {

  private _httpCounter: number = 0;

  constructor(backend: XHRBackend,
              defaultOptions: RequestOptions,
              private router: Router,
              private userContext: UserContext,
              private _progressService: ProgressService) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request,
                 options?: RequestOptionsArgs): Observable<Response> {
    // debugger;
    return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    // debugger;
    return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
  }

  public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
  }

  public getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    options.headers.append('Content-Type', 'application/json');
    options.headers.append('LanguageId', this.userContext.currentUser.languageId ? this.userContext.currentUser.languageId.toString() : '');

    if (this.userContext.userToken && this.userContext.userToken.accessToken) {
      options.headers.append('Authorization', 'Bearer ' + this.userContext.userToken.accessToken);
    }
    return options;
  }

  public intercept(observable: Observable<Response>): Observable<Response> {
    // debugger;
    //
    // observable.subscribe(
    //   () => {
    //     debugger;
    //   },
    //   () => {
    //     debugger;
    //   },
    //   () => {
    //     debugger;
    //   }
    // );
    this._httpCounter++;
    if (this._httpCounter === 1) {
      this._progressService.start();
    }
    return observable
      .finally(() => {
        setTimeout(() => {
          this._httpCounter--;
          if (this._httpCounter === 0) {
            this._progressService.done();
          }
        });
      })
      .catch((err, source) => {
        this._progressService.done();
        if (err.status === 401 /*&& !_.endsWith(err.url, 'api/auth/login')*/) {
          this.userContext.clear();
          this.router.navigate( [ 'auth', 'sign-in' ] );
          return Observable.empty();
        } else {
          return Observable.throw(err);
        }
      });
  }

  private hideProgress() {
    this._progressService.done();
  }
}

import {
  Injectable,
} from '@angular/core';

import {
  Http,
  Response,
  URLSearchParams,
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Router } from '@angular/router';

// Services
import { UserContext } from '../user-context';
import { ProgressService } from '../progress';

// 3rd modules
import { ToastrService } from 'ngx-toastr';

// Global const
import { AppConstant } from '../../../app.constant';

// Interfaces
import {
  UserInfo,
  Roles,
  FullAuthentication,
  ResetUserInfo,
} from '../../models';
import {
  BasicResponse,
  ResponseMessage,
} from '../../models/respone.model';

import {
  BasicUserInfo,
} from '../../models/user.model';

@Injectable()
export class AuthService {
  constructor( private _http: Http,
               private _userContext: UserContext,
               private _router: Router,
               private _progressService: ProgressService,
               private _toastrService: ToastrService ) {
    // empty
  }

  /**
   * transformRequestHandler
   * @param obj
   * @returns {string}
   */
  public transformRequestHandler( obj ): string {
    let str: string[] = [];
    for (let p in obj) {
      if (obj.hasOwnProperty( p )) {
        str.push( encodeURIComponent( p ) + '=' + encodeURIComponent( obj[ p ] ) );
      }
    }
    return str.join( '&' );
  }

  /**
   * login
   * @param email
   * @param pass
   * @returns {any}
   */
  public login( email, pass ): Observable<FullAuthentication> {
    if (!email || !pass) {
      return;
    }
    let data = {
      email: email,
      password: pass,
    };
    // let requestPayload: string = this.transformRequestHandler(data);
    this._progressService.start();
    this._http.post( `${AppConstant.domain}/accounts/token`, data ).subscribe( ( resp: Response ) => {
        this._progressService.done();
        this.saveUserInfo( resp );
      }, ( err ) => {
        this._progressService.done();
        let error = err.json();
        this._toastrService.error( error.error_description, 'Error' );

      },
    );
  }

  /**
   * logout
   * @returns {any}
   */
  public logout(): Observable<Response> {
    return this._http.post( `${AppConstant.domain}/accounts/logout`, {} );
  }

  /**
   * getUserInfo
   * @returns {any}
   */
  public getUserInfo( id: number ): Observable<ResponseMessage<UserInfo>> {
    return this._http.get( `${AppConstant.domain}/accounts/userinfo` )
      .map( this.extractData );
    // .catch(this.handleError);
  }

  public getProfile(): Observable<UserInfo> {
    return this._http.get(`${AppConstant.domain}/accounts/profile`)
      .map(this.extractData);
  }

  public updateProfile(data: any): Observable<any> {
    return this._http.put(`${AppConstant.domain}/accounts/updateProfile`, JSON.stringify(data))
      .map(this.extractData);
  }

  /**
   * getRoles
   * @returns {any}
   */
  public getRoles(): Observable<ResponseMessage<Roles[]>> {
    return this._http.get( `${AppConstant.domain}/api/v1/account/roles` )
      .map( this.extractData );
    // .catch(this.handleError);
  }

  /**
   * getAllUsers
   * @returns {Observable<R>}
   */
  public getAllUsers(): Observable<ResponseMessage<BasicUserInfo[]>> {
    return this._http.get( `${AppConstant.domain}/api/v1/account/users/all` )
      .map( this.extractData );
    // .catch(this.handleError);
  }

  /**
   * forgotPassword
   * @param email
   * @returns {any}
   */
  public forgotPassword( email: string ): Observable<BasicResponse> {
    this._progressService.start();
    return this._http.post( `${AppConstant.domain}/api/v1/account/forgotpassword`, {email} )
      .finally( () => {
        this._progressService.done();
      } )
      .map( this.extractData );
    // .catch(this.handleError);
  }

  public resetPassword( obj: ResetUserInfo ): Observable<BasicResponse> {
    this._progressService.start();
    return this._http.post( `${AppConstant.domain}/api/v1/account/resetpassword`, obj )
      .finally( () => {
        this._progressService.done();
      } )
      .map( this.extractData );
    // .catch(this.handleError);
  }

  public validateResetPassword( userId: number,
                                code: string ): Observable<BasicResponse> {
    let params: URLSearchParams = new URLSearchParams();
    params.set( 'userId', userId.toString() );
    params.set( 'code', code );
    return this._http.get( `${AppConstant.domain}/api/v1/account/validateresetpasswordtoken`, {
      search: params,
    } ).map( this.extractData );
    // .catch(this.handleError);
  }

  /**
   * extractData
   * @param resp
   * @returns {Promise<any>|any|{}}
   */
  public extractData( resp: Response ): any {
    let body = resp.json();
    return body || {};
  }

  /**
   * get user info and save it
   * @param resp
   */
  public saveUserInfo( resp: Response ) {
    let body: FullAuthentication = resp.json();
    this._userContext.setToken( body.acceptToken, body.refreshToken );
    this._progressService.start();
    this.getUserInfo( body.id ).subscribe( ( respInfo: ResponseMessage<UserInfo> ) => {
        this._progressService.done();

        let res = respInfo;
        res['languageId'] = 1;

        this._userContext.update( res );

        this._router.navigate( [ 'dashboard' ] );
      }, ( err ) => {
        this._progressService.done();
        let error = err.json();
        this._toastrService.error( error.error_description, 'Error' );
      },
    );
  }

  public checkLogged(): boolean {
    if (this._userContext.userToken && this._userContext.currentUser) {
      return true;
    }
    return false;
  }

  /**
   * handleError
   * @param error
   * @returns {ErrorObservable<T>}
   */
  // private handleError(error: Response | any) {
  //   // In a real world app, we might use a remote logging infrastructure
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   console.error(errMsg);
  //   return Observable.throw(errMsg);
  // }

  /**
   * updateUserInfo
   */
  public updateUserInfo( userId: number ) {
    this.getUserInfo( userId ).subscribe( ( respInfo: ResponseMessage<UserInfo> ) => {
        this._progressService.done();
        if (respInfo.status) {
          let res: UserInfo = respInfo.data;
          this._userContext.update( res );
        }
      }, ( err ) => {
        this._progressService.done();
        let error = err.json();
        this._toastrService.error( error.error_description, 'Error' );

      },
    );
  }
}

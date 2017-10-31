import {
  EventEmitter,
  Injectable
} from '@angular/core';

// 3rd modules
import { LocalStorageService } from 'angular-2-local-storage';

// Interface
import {
  UserToken,
  UserInfo
} from '../../models';

@Injectable()
export class UserContext {
  // Create event emitter
  public onUserInfoChange = new EventEmitter<any>();

  private _currentUser: UserInfo;
  private _userToken: UserToken;

  constructor(private localStorageService: LocalStorageService) {
    // empty
  }

  get currentUser(): UserInfo {
    if (this._currentUser && this._currentUser.id) {
      return this._currentUser;
    }

    this._currentUser = this.localStorageService.get('userInfo') as UserInfo;

    if (!this._currentUser) {
      this._currentUser = new UserInfo();
    }
    return this._currentUser;
  }

  set currentUser(info: UserInfo) {
    this.localStorageService.set('userInfo', info);
  }

  get userToken(): UserToken {
    if (this._userToken && this._userToken.accessToken) {
      return this._userToken;
    }

    this._userToken = this.localStorageService.get('userToken') as UserToken;

    if (!this._userToken) {
      this._userToken = new UserToken();
    }
    return this._userToken;
  }

  set userToken(token: UserToken) {
    this.localStorageService.set('userToken', token);
  }

  /**
   * setToken
   * @param token
   * @param refreshToken
   */
  public setToken(token: string, refreshToken: string): void {
    if (!token) {
      this.clear();
    } else {
      this.userToken = {
        accessToken: token,
        refreshToken
      };
    }
  }

  /**
   * fillInfo
   * @param obj
   */
  public update(obj: any): void {
    this.currentUser = Object.assign(this.currentUser, obj);
  }

  /**
   * clearInfo
   */
  public clear(): void {
    this.localStorageService.remove('userInfo');
    this.localStorageService.remove('userToken');
    this._userToken = new UserToken();
    this._currentUser = new UserInfo();
  }
}

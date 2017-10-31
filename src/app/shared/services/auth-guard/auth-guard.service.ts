import {
  Injectable
} from '@angular/core';

import { AuthService } from '../auth';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { UserContext } from '../user-context';
import {
  PushNotificationsService,
} from 'angular2-notifications';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private userContext: UserContext,
              private _authService: AuthService,
              private _pushNotificationsService: PushNotificationsService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Get current user was login
    let user = this.userContext.currentUser;
    if (!user || !user.id) {
      this.router.navigateByUrl('/auth/sign-in');
      return false;
    }
    // update user info
    this._authService.updateUserInfo(user.id);

    this._pushNotificationsService.requestPermission();
    return true;
  }
}

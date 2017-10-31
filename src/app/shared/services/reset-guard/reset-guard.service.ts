import {
  Injectable
} from '@angular/core';

import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

// Services
import { AuthService } from '../auth/auth.service';
import { BasicResponse } from '../../models/respone.model';

@Injectable()
export class ResetGuard implements CanActivate {
  constructor(private _router: Router,
              private _authService: AuthService) {
    // empty
  }

  /**
   * canActivate
   * @param route
   * @param state
   * @returns {boolean}
   */
  public canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> {
    let id = route.params['id'] as number;
    let code = route.params['code'] as string;
    return this._authService.validateResetPassword(id, code).map((resp: BasicResponse) => {
      if (!resp.status) {
        this._router.navigate(['NotFound']);
        return false;
      }
      return true;
    });
  }
}

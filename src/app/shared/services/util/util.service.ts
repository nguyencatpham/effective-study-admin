import 'rxjs/add/operator/pairwise';
import {
  EventEmitter,
  Injectable, Injector,
} from '@angular/core';

import {
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class Util {
  public onRouteChange = new EventEmitter<string>();

  private route = {
    previous: '',
    current: ''
  };
  private _router: Router;

  constructor(injector: Injector) {
    setTimeout(() => {
      this._router = injector.get(Router);
      this._router.events.pairwise().subscribe((data) => {
        if (!data[0]['id'] || !data[1]['id'] || data[0]['id'] === data[1]['id']) {
          return;
        } else {
          this.route = {
            previous: data[0]['url'],
            current: data[1]['url']
          };
          this.emitRouteChange(this.route.current);
        }

      });
    });
  }

  public get previousRouteUrl(): string {
    return this.route.previous;
  }

  public getFullRoutePath(suffix, route: ActivatedRouteSnapshot) {
    if (route.routeConfig && route.routeConfig.path) { // If the path not empty
      suffix = `${route.routeConfig.path}/${suffix}`;
    }
    if (route.parent) { // If it still has parent
      return this.getFullRoutePath(suffix, route.parent);
    }
    return '/' + suffix;
  }

  public getFullRoutePathByActivatedRoute(suffix, route: ActivatedRoute) {
    if (route.routeConfig && route.routeConfig.path) { // If the path not empty
      suffix = `${route.routeConfig.path}/${suffix}`;
    }
    if (route.parent) { // If it still has parent
      return this.getFullRoutePathByActivatedRoute(suffix, route.parent);
    }
    return '/' + suffix;
  }

  public getLastActivatedRoute(route: ActivatedRoute) {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  public emitRouteChange(url: string) {
    this.onRouteChange.next(url);
  }
}

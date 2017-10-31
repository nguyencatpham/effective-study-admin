import {
  Component,
  ViewEncapsulation,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  ThemeSetting
} from '../../../../services/theme-setting';

import {
  NoisMedia
} from '../../../../services/nois-media';

import {
  RolesEnum,
  MenuItem
} from '../../../../models';

import {
  Router
} from '@angular/router';

import { RouterService } from '../../../../../core/router';
import { Util } from '../../../../services/util';
import { Subscription } from 'rxjs/Subscription';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'sidebar',  // <sidebar></sidebar>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './sidebar.template.html',
  styleUrls: [
    './sidebar.style.scss'
  ]
})
export class SidebarComponent implements AfterViewInit,
  OnDestroy {
  @ViewChildren('menuItem')
  public menuItem: QueryList<ElementRef>;
  public subscription: Subscription;
  public config = {
    // wheelSpeed: 1              // Scroll speed for the mousewheel event (Default: 1).
    // wheelPropagation: false        // Propagate wheel events at the end (Default: false).
    // swipePropagation: true        // Propagate swipe events at the end (Default: true).
    // minScrollbarLength      // Minimum size for the scrollbar (Default: null).
    // maxScrollbarLength      // Maximum size for the scrollbar (Default: null).
    // useBothWheelAxes        // Always use the both wheel axes (Default: false).
    // suppressScrollX         // Disable X axis in all situations (Default: false).
    // suppressScrollY         // Disable Y axis ni all situations (Default: false).
    // scrollXMarginOffset     // Offset before enabling the X scroller (Default: 0).
    // scrollYMarginOffset     // Offset before enabling the Y scroller (Default: 0).
    // stopPropagationOnClick  // Stop the propagation of click event (Default: true).
    sideBars: [
      // {
      //   routerLink: '/dashboard',
      //   routerLinkActive: 'active',
      //   title: 'Dashboard',
      //   icon: 'fa fa-dashboard',
      //   permission: [RolesEnum.Administrator]
      // }
      {
        routerLink: '/products-management',
        routerLinkActive: 'active',
        title: 'Products',
        icon: 'fa fa-product-hunt',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/categories-management',
        routerLinkActive: 'active',
        title: 'Categories',
        icon: 'fa fa-bookmark',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/menus-management',
        routerLinkActive: 'active',
        title: 'Menus',
        icon: 'fa fa-list-alt',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/components-management',
        routerLinkActive: 'active',
        title: 'Components',
        icon: 'fa fa-align-left',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/nutritions-management',
        routerLinkActive: 'active',
        title: 'Nutritions',
        icon: 'fa fa-inbox',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/orders-management',
        routerLinkActive: 'active',
        title: 'Orders',
        icon: 'fa fa-shopping-cart',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/shippings-management',
        routerLinkActive: 'active',
        title: 'Shippings',
        icon: 'fa fa-globe',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/global-config',
        routerLinkActive: 'active',
        title: 'Global config',
        icon: 'fa fa-cog',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/topics-management',
        routerLinkActive: 'active',
        title: 'Topics',
        icon: 'fa fa-newspaper-o',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/users-management',
        routerLinkActive: 'active',
        title: 'Users',
        icon: 'fa fa-user-o',
        permission: [RolesEnum.Administrator]
      },
      {
        routerLink: '/users-management/profile',
        routerLinkActive: 'active',
        title: 'Profile',
        icon: 'fa fa-cog',
        permission: [RolesEnum.Chef]
      }
    ]
  };

  // Cache
  private _sidebarEl;

  constructor(public el: ElementRef,
              private _themeSetting: ThemeSetting,
              private _router: Router,
              private _routerService: RouterService,
              private _utilService: Util,
              private _noisMedia: NoisMedia) {
    this.subscription = _utilService.onRouteChange.subscribe(
      (url: string) => {
        this.activeCurrentIcon(url);
      });
  }

  public ngAfterViewInit(): void {
    this.activeCurrentIcon(this._router.url);
  }

  @HostListener('mouseenter')
  public mouseenter() {
    if (this._noisMedia.is('max-width: 991px')) {
      return;
    }

    if (this._themeSetting.menuPin) {
      return true;
    }

    let css = 'translate3d(' + this._themeSetting.sideBarWidthCondensed + 'px, 0,0)';

    if (this._sidebar) {
      this._sidebar.style['-webkit-transform'] = css;
      this._sidebar.style['-moz-transform'] = css;
      this._sidebar.style['-ms-transform'] = css;
      this._sidebar.style['-o-transform'] = css;
      this._sidebar.style['transform'] = css;
    }

    this._themeSetting.sidebarHover = true;
  }

  @HostListener('mouseleave')
  public mouseleave() {
    let css = 'translate3d(0,0,0)';

    if (this._sidebar) {
      this._sidebar.style['-webkit-transform'] = css;
      this._sidebar.style['-moz-transform'] = css;
      this._sidebar.style['-ms-transform'] = css;
      this._sidebar.style['-o-transform'] = css;
      this._sidebar.style['transform'] = css;
    }

    this._themeSetting.sidebarHover = false;
  }

  public pinSidebar() {
    this._themeSetting.menuPin = !this._themeSetting.menuPin;
  }

  public isSidebarOpen() {
    return this._themeSetting.sidebarOpen;
  }

  private get _sidebar() {
    if (!this._sidebarEl) {
      this._sidebarEl = this.el.nativeElement.querySelector('nav.page-sidebar');
    }
    return this._sidebarEl;
  };

  public navigate($event: Event, itemData: MenuItem) {
    this._routerService.deleteStored(itemData.routerLink);
    this._router.navigate([itemData.routerLink]);
  }

  public activeCurrentIcon(url: string) {
    let itemId: number = !url ? 0 : this.config.sideBars.findIndex((item) => url.includes(item.routerLink));
    this.menuItem.forEach((item: ElementRef, index) => {
      item.nativeElement.className = '';
      if (index === itemId) {
        item.nativeElement.className += ` ${this.config.sideBars[itemId].routerLinkActive}`;
      }
    });
  }

  public ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}

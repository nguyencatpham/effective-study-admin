import {
  Component,
  ViewEncapsulation,
  Input,
} from '@angular/core';

import {
  Router,
} from '@angular/router';

import {
  Sidebar,
} from 'ng-sidebar';

import {
  AuthService,
} from '../../../../services/auth/auth.service';

import {
  ThemeSetting,
} from '../../../../services/theme-setting';

import {
  TranslationModel,
  Translation,
} from '../../../../modules/i18n';

import {
  UserContext,
} from '../../../../services/user-context/user-context';
import { UserInfo } from '../../../../models/user.model';
import { Util } from '../../../../services/util/util.service';

@Component( {
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'page-header',  // <page-header></page-header>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './page-header.template.html',
  styleUrls: [
    './page-header.style.scss',
  ],
} )
export class PageHeaderComponent {
  @Input()
  public sidenav: Sidebar;

  public userInfo: UserInfo;
  public translations: TranslationModel[] = [];
  public currentTranslation: TranslationModel;
  public languages = [
    {
      id: 1,
      src: '../../../../../assets/flag/vn.png',
    }, {
      id: 2,
      src: '../../../../../assets/flag/us.png',
    }
  ];

  constructor( private _router: Router,
               private _userContext: UserContext,
               private _authService: AuthService,
               private _themeSetting: ThemeSetting,
               private _utilService: Util,
               private _translation: Translation ) {
    this.translations = this._translation.getTranslations();
    this.currentTranslation = this._translation.getCurrentTranslation();
    this.userInfo = this._userContext.currentUser;
    // Subscribe change user info to update info
    this._userContext.onUserInfoChange.subscribe( ( item ) => {
      this.userInfo = item;
    } );
  }

  public onChangeLanguage( languageId ) {
    this.userInfo.languageId = languageId;

    // this._userContext.onUserInfoChange.emit(this.userInfo);
    this._userContext.update( this.userInfo );

    this._router.navigateByUrl('');

    setTimeout(() => {
      this._utilService.onRouteChange.emit('');
    }, 500);
  }

  public changeTranslation( trans ) {
    this.currentTranslation = trans;
    this._translation.use( trans );
  }

  public openLeftSideNav() {
    this._themeSetting.sidebarOpen = !this._themeSetting.sidebarOpen;
  }

  public openRightSideBar() {
    this.sidenav.open();
  }

  public viewProfile(): void {
    this._router.navigate( [ 'profile' ] );
  }

  public goToHome(): void {
    this._router.navigate( [ 'dashboard' ] );
  }

  public newCustomer(): void {
    this._router.navigate( [ 'customers-management', 'new' ] );
  }

  public newSalesOrder(): void {
    this._router.navigate( [ 'order-log', 'new' ] );
  }

  public logout(): void {
    this._authService.logout().subscribe( () => {
      this._userContext.clear();
      this._router.navigate( [ 'auth', 'sign-in' ] );
    } );
  }

  /**
   * goToCustomerPage
   * @param customerId
   */
  public goToCustomerPage( customerId: number ) {
    this._router.navigate( [ 'customers-management', customerId ] );
  }
}

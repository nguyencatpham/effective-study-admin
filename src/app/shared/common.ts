import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  HttpModule,
  Http
} from '@angular/http';

import {
  RouterModule
} from '@angular/router';

import {
  RouterLinkOptions
} from '../core/router';

import {
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';

import {
  LocalStorageModule
} from 'angular-2-local-storage';

import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import {
  Ng2BreadcrumbModule
} from 'ng2-breadcrumb/ng2-breadcrumb';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import {
  SidebarModule
} from 'ng-sidebar';

import {
  TranslateModule,
  TranslateService,
  TranslateLoader
} from '@ngx-translate/core';

import {
  TranslateHttpLoader
} from '@ngx-translate/http-loader';

import {
  ToastrModule
} from 'ngx-toastr';

import {
  ImgZoomClickModule
} from '../shared/modules/img-zoom-click';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

import {
  AppI18n,
  Translation
} from './modules/i18n';

export * from './modules/i18n';

export const ROOT_MODULES = [
  // Angular modules
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,

  // 3rd parties modules
  LocalStorageModule.withConfig({
    prefix: 'nois',
    storageType: 'localStorage'
  }),

  AppI18n.forRoot([
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'vi',
      name: 'Vietnamese'
    }
  ]),

  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [Http]
    }
  }),

  PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
  NgbModule.forRoot(),
  SidebarModule,
  ToastrModule.forRoot({extendedTimeOut: 5000}),
  Ng2BreadcrumbModule.forRoot(),
  ImgZoomClickModule
];

export const CHILD_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  HttpModule,
  LocalStorageModule,
  NgbModule,
  SidebarModule,
  TranslateModule,
  PerfectScrollbarModule,
  AppI18n,
  ToastrModule,
  Ng2BreadcrumbModule,
  ImgZoomClickModule
];

@NgModule({
  imports: [
    ...CHILD_MODULES
  ],
  declarations: [
    RouterLinkOptions
  ],
  exports: [
    ...CHILD_MODULES,
    RouterLinkOptions
  ]
})
export class SharedCommonModule {
  constructor(private _translateService: TranslateService,
              private _translation: Translation) {

    // // the lang to use, if the lang isn't available, it will use the current loader to get them
    // _translateService.use(_translation.userLang);

    // This will fix lazyLoaded modules not binding translation changes event
    _translation.onTranslationChange.subscribe((trans) => {
      _translateService.use(trans.code);
    });

    // Default translation configuration
    _translateService.setDefaultLang(_translation.userLang);
    _translateService.use(_translation.userLang);
  }
}
